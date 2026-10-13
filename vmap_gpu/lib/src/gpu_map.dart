import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter_gpu/gpu.dart' as gpu;
import 'package:vector_math/vector_math.dart' show Vector4;
import 'package:vmap/renderer.dart';

const _bundle = 'packages/vmap_gpu/build/shaderbundles/vmap_gpu.shaderbundle';

/// Draws vmap's fill and line layers and its buildings on the GPU: every
/// tile in one call (or a few, past 120 style slots), lines widened in the
/// shader, buildings with a depth buffer. Set it as the engine's renderer;
/// where Flutter GPU is missing, [create] gives null and the canvas draws.
class GpuMap implements MapRenderer {
  GpuMap._() {
    _load();
  }

  /// A renderer when this device runs Flutter GPU, otherwise null.
  static GpuMap? create() {
    try {
      gpu.gpuContext;
      return GpuMap._();
    } catch (e) {
      debugPrint('vmap_gpu: no Flutter GPU, the canvas draws the map: $e');
      return null;
    }
  }

  gpu.ShaderLibrary? _library;
  gpu.RenderPipeline? _flat, _buildings;
  gpu.UniformSlot? _flatFrame, _flatSlots, _buildingFrame;
  gpu.HostBuffer? _host;
  List<gpu.Texture> _ring = const [];
  gpu.Texture? _depth, _samples;
  int _next = 0, _width = 0, _height = 0, _frame = 0;
  bool _transient = true;
  late final bool _msaa = gpu.gpuContext.doesSupportOffscreenMSAA;
  late final gpu.PixelFormat _color =
      gpu.gpuContext.defaultColorFormat == gpu.PixelFormat.unknown
      ? gpu.PixelFormat.r8g8b8a8UNormInt
      : gpu.gpuContext.defaultColorFormat;
  final Map<GpuStream, _TileBuffers> _tiles = Map.identity();
  final Map<BuiltExtrusion, _BuildingBuffers> _built = Map.identity();
  final Stopwatch _clock = Stopwatch()..start();
  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;

  /// Bytes of new geometry sent to the GPU in one frame; the rest waits.
  static const _bytesPerFrame = 256 * 1024;
  static const _fadeMicros = 250000;

  final Float32List _frameInfo = Float32List(20);
  late final ByteData _frameBytes = ByteData.sublistView(_frameInfo);
  final Float32List _slots = Float32List(240 * 4);
  late final ByteData _slotBytes = ByteData.sublistView(_slots);

  /// One layer's paint this frame, in screen pixels, before a tile's scale.
  final Map<int, _Paint> _layerPaint = {};

  Future<void> _load() async {
    try {
      _library = await gpu.ShaderLibrary.fromAsset(_bundle);
    } catch (e) {
      debugPrint('vmap_gpu: shaders did not load: $e');
    }
  }

  @override
  bool supports(StyleSheet sheet) {
    var meshSeen = false;
    for (final run in sheet.runs) {
      if (run.raster >= 0) {
        if (meshSeen) return false;
        continue;
      }
      meshSeen = true;
    }
    for (final layer in sheet.layers) {
      if (layer is CircleLayer || layer is HeatmapLayer) return false;
    }
    return _library != null;
  }

  /// Made on the first frame drawn, never before: on OpenGL ES a pipeline
  /// made before the app has a surface can deadlock (flutter/flutter#193890).
  bool _ready() {
    if (_flat != null) return true;
    final library = _library;
    if (library == null) return false;
    final mapVertex = library['MapVertex'],
        mapFragment = library['MapFragment'];
    final buildingVertex = library['BuildingVertex'];
    final buildingFragment = library['BuildingFragment'];
    if (mapVertex == null ||
        mapFragment == null ||
        buildingVertex == null ||
        buildingFragment == null) {
      return false;
    }
    _flat = gpu.gpuContext.createRenderPipeline(
      mapVertex,
      mapFragment,
      vertexLayout: const gpu.VertexLayout(
        buffers: [
          gpu.VertexBuffer(
            strideInBytes: 24,
            attributes: [
              gpu.VertexAttribute(
                name: 'position',
                format: gpu.VertexFormat.float32x2,
              ),
              gpu.VertexAttribute(
                name: 'packed_data',
                format: gpu.VertexFormat.float32x4,
                offsetInBytes: 8,
              ),
            ],
          ),
        ],
      ),
    );
    _flatFrame = mapVertex.getUniformSlot('FrameInfo');
    _flatSlots = mapVertex.getUniformSlot('SlotInfo');
    _buildings = gpu.gpuContext.createRenderPipeline(
      buildingVertex,
      buildingFragment,
      vertexLayout: const gpu.VertexLayout(
        buffers: [
          gpu.VertexBuffer(
            strideInBytes: 20,
            attributes: [
              gpu.VertexAttribute(
                name: 'position',
                format: gpu.VertexFormat.float32x3,
              ),
              gpu.VertexAttribute(
                name: 'color_data',
                format: gpu.VertexFormat.float32x2,
                offsetInBytes: 12,
              ),
            ],
          ),
        ],
      ),
    );
    _buildingFrame = buildingVertex.getUniformSlot('FrameInfo');
    _host = gpu.gpuContext.createHostBuffer();
    return true;
  }

  void _size(int width, int height) {
    if (width == _width && height == _height && _ring.isNotEmpty) return;
    _width = width;
    _height = height;
    _ring = [
      for (var i = 0; i < 3; i++)
        gpu.gpuContext.createTexture(
          gpu.StorageMode.devicePrivate,
          width,
          height,
          format: _color,
        ),
    ];
    final samples = _msaa ? 4 : 1;
    _depth = _scratch(
      width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      samples,
    );
    _samples = _msaa ? _scratch(width, height, _color, samples) : null;
  }

  /// A texture only the GPU touches within a pass: kept in tile memory where
  /// the GPU has it, which desktop GPUs do not.
  gpu.Texture _scratch(
    int width,
    int height,
    gpu.PixelFormat format,
    int samples,
  ) {
    for (final mode in [
      if (_transient) gpu.StorageMode.deviceTransient,
      gpu.StorageMode.devicePrivate,
    ]) {
      try {
        return gpu.gpuContext.createTexture(
          mode,
          width,
          height,
          format: format,
          sampleCount: samples,
          enableShaderReadUsage: false,
        );
      } catch (_) {
        _transient = false;
      }
    }
    throw StateError('vmap_gpu: no texture for the map pass');
  }

  @override
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    List<TileDraw> tiles,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
  ) {
    if (!_ready()) return true;
    _frame++;
    final width = (view.width * devicePixelRatio).round();
    final height = (view.height * devicePixelRatio).round();
    if (width <= 0 || height <= 0) return false;
    _size(width, height);
    final target = _ring[_next];
    _next = (_next + 1) % _ring.length;
    final commands = gpu.gpuContext.createCommandBuffer();
    final samples = _samples;
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        samples == null
            ? gpu.ColorAttachment(texture: target, clearValue: Vector4.zero())
            : gpu.ColorAttachment(
                texture: samples,
                resolveTexture: target,
                storeAction: gpu.StoreAction.multisampleResolve,
                clearValue: Vector4.zero(),
              ),
        depthStencilAttachment: gpu.DepthStencilAttachment(
          texture: _depth!,
          depthClearValue: 1,
        ),
      ),
    );
    final host = _host!..reset();
    final clip = view.clipMatrix(originX: origin.dx, originY: origin.dy);
    var budget = _bytesPerFrame;
    var more = false;

    _layerPaint.clear();
    pass
      ..bindPipeline(_flat!)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(
        gpu.ColorBlendEquation(
          sourceColorBlendFactor: gpu.BlendFactor.one,
          destinationColorBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
          sourceAlphaBlendFactor: gpu.BlendFactor.one,
          destinationAlphaBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
        ),
      );
    for (final d in tiles) {
      final stream = d.tile.gpu;
      if (stream == null) continue;
      var buffers = _tiles[stream];
      if (buffers == null) {
        final bytes =
            stream.vertices.lengthInBytes + stream.indices.lengthInBytes;
        if (budget < _bytesPerFrame && bytes > budget) {
          more = true;
          continue;
        }
        budget -= bytes;
        buffers = _tiles[stream] = _TileBuffers(stream);
      }
      buffers.usedFrame = _frame;
      final scale = d.size / tileExtent;
      _times(clip, scale, 1, d.left, d.top, 1);
      pass
        ..bindVertexBuffer(
          gpu.BufferView(
            buffers.vertices,
            offsetInBytes: 0,
            lengthInBytes: stream.vertices.lengthInBytes,
          ),
        )
        ..bindUniform(_flatFrame!, host.emplace(_frameBytes));
      final segments = stream.segments;
      for (var s = 0; s < segments.length; s += 3) {
        final first = segments[s], count = segments[s + 1];
        final slotBase = segments[s + 2];
        final slotEnd = s + 5 < segments.length
            ? segments[s + 5]
            : stream.slots.length;
        _fillSlots(sheet, stream, slotBase, slotEnd, scale, context, styleZoom);
        pass
          ..bindUniform(_flatSlots!, host.emplace(_slotBytes))
          ..bindIndexBuffer(
            gpu.BufferView(
              buffers.indices,
              offsetInBytes: first * 4,
              lengthInBytes: count * 4,
            ),
            gpu.IndexType.int32,
          )
          ..drawIndexed(count);
      }
    }

    if (sheet.extrusions.isNotEmpty) {
      more =
          _drawBuildings(pass, view, sheet, tiles, clip, styleZoom, budget) ||
          more;
    }

    commands.submit();
    canvas.drawImageRect(
      target.asImage(),
      ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()),
      ui.Rect.fromLTWH(0, 0, view.width, view.height),
      _paint,
    );
    if (_frame % 120 == 0) {
      _tiles.removeWhere((_, b) => _frame - b.usedFrame > 600);
      _built.removeWhere((_, b) => _frame - b.usedFrame > 600);
    }
    return more;
  }

  /// Writes the slots [from] to [to] of [stream] into the slot table, in
  /// tile units for a tile [scale] screen pixels to the unit.
  void _fillSlots(
    StyleSheet sheet,
    GpuStream stream,
    int from,
    int to,
    double scale,
    EvalContext context,
    double styleZoom,
  ) {
    final out = _slots;
    for (var i = from; i < to; i++) {
      final (layerIndex, props) = stream.slots[i];
      final layer = sheet.layers[layerIndex];
      final paint = props == null
          ? (_layerPaint[layerIndex] ??= _Paint.of(layer, context, styleZoom))
          : _Paint.of(layer, context, styleZoom, props);
      final o = (i - from) * 8;
      out[o] = paint.r;
      out[o + 1] = paint.g;
      out[o + 2] = paint.b;
      out[o + 3] = paint.a;
      out[o + 4] = paint.halfWidth / scale;
      out[o + 5] = paint.offset / scale;
      out[o + 6] = paint.dashOn / scale;
      out[o + 7] = paint.dashPeriod / scale;
    }
  }

  bool _drawBuildings(
    gpu.RenderPass pass,
    MapView view,
    StyleSheet sheet,
    List<TileDraw> tiles,
    Float64List clip,
    double styleZoom,
    int budget,
  ) {
    var more = false;
    // The flat layers leave an index buffer bound, which a plain draw would
    // otherwise read its vertices through.
    pass
      ..clearBindings()
      ..bindPipeline(_buildings!)
      ..setDepthWriteEnable(true)
      ..setDepthCompareOperation(gpu.CompareFunction.lessEqual);
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    final host = _host!;
    for (final layer in sheet.extrusions) {
      if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) continue;
      for (final d in tiles) {
        for (final e in d.tile.extrusions) {
          if (e.bucket != layer.bucket) continue;
          final b = _built[e] ??= _BuildingBuffers(e);
          b.usedFrame = _frame;
          while (b.uploaded < b.chunks) {
            final bytes = b.chunkBytes(b.uploaded);
            if (budget < _bytesPerFrame && bytes > budget) {
              more = true;
              break;
            }
            budget -= bytes;
            b.upload(_clock.elapsedMicroseconds);
          }
          final scale = d.size / tileExtent;
          for (var c = 0; c < b.uploaded; c++) {
            final fade = math.min(
              1.0,
              (_clock.elapsedMicroseconds - b.shownAt[c]) / _fadeMicros,
            );
            if (fade < 1) more = true;
            _times(clip, scale, perMetre, d.left, d.top, fade);
            pass
              ..bindVertexBuffer(
                gpu.BufferView(
                  b.buffers[c],
                  offsetInBytes: 0,
                  lengthInBytes: b.chunkBytes(c),
                ),
              )
              ..bindUniform(_buildingFrame!, host.emplace(_frameBytes))
              ..draw(b.chunkBytes(c) ~/ _BuildingBuffers._stride);
          }
        }
      }
    }
    return more;
  }

  /// [clip] times a tile's placement into the frame info block: tile units
  /// scaled by [scale] and moved to [left], [top], heights by [perMetre].
  void _times(
    Float64List clip,
    double scale,
    double perMetre,
    double left,
    double top,
    double fade,
  ) {
    final out = _frameInfo;
    for (var r = 0; r < 4; r++) {
      out[r] = clip[r] * scale;
      out[4 + r] = clip[4 + r] * scale;
      out[8 + r] = clip[8 + r] * perMetre;
      out[12 + r] = clip[r] * left + clip[4 + r] * top + clip[12 + r];
    }
    out[16] = fade;
  }

  @override
  void dispose() {
    _tiles.clear();
    _built.clear();
    _ring = const [];
    _depth = null;
    _samples = null;
  }
}

/// A fill or line layer's paint for one frame, in screen pixels.
class _Paint {
  _Paint(
    this.r,
    this.g,
    this.b,
    this.a,
    this.halfWidth,
    this.offset,
    this.translateX,
    this.translateY,
    this.dashOn,
    this.dashPeriod,
  );

  final double r, g, b, a;
  final double halfWidth, offset, translateX, translateY, dashOn, dashPeriod;

  static final _clear = _Paint(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  static _Paint of(
    PaintLayer layer,
    EvalContext context,
    double styleZoom, [
    Map<String, Object?>? props,
  ]) {
    if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) {
      return _clear;
    }
    if (props != null) context.props = props;
    try {
      final color = Rgba.of(layer.color(context));
      if (color == null) return _clear;
      final a = (color.a * (asNumber(layer.opacity(context)) ?? 1)).clamp(
        0.0,
        1.0,
      );
      var width = 0.0, offset = 0.0, dashOn = 0.0, dashPeriod = 0.0;
      if (layer is LineLayer) {
        width = (asNumber(layer.width(context)) ?? 0).toDouble();
        offset = (asNumber(layer.offset?.call(context)) ?? 0).toDouble();
        final dash = layer.dash;
        if (dash != null && dash.length >= 2 && width > 0) {
          dashOn = dash[0] * width;
          dashPeriod = (dash[0] + dash[1]) * width;
        }
      }
      var tx = 0.0, ty = 0.0;
      if (layer is MeshLayer) {
        final moved = layer.translate?.call(context);
        if (moved is List && moved.length == 2) {
          tx = (asNumber(moved[0]) ?? 0).toDouble();
          ty = (asNumber(moved[1]) ?? 0).toDouble();
        }
      }
      return _Paint(
        color.r * a,
        color.g * a,
        color.b * a,
        a,
        width / 2,
        offset,
        tx,
        ty,
        dashOn,
        dashPeriod,
      );
    } finally {
      if (props != null) context.props = const {};
    }
  }
}

class _TileBuffers {
  _TileBuffers(GpuStream stream)
    : vertices = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(stream.vertices),
      ),
      indices = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(stream.indices),
      );

  final gpu.DeviceBuffer vertices;
  final gpu.DeviceBuffer indices;
  int usedFrame = 0;
}

/// One tile's buildings on the GPU, sent in pieces so no frame copies
/// megabytes.
class _BuildingBuffers {
  _BuildingBuffers(this._built)
    : chunks =
          (_built.vertices.length ~/ BuiltExtrusion.floatsPerVertex +
              BuiltExtrusion.chunk -
              1) ~/
          BuiltExtrusion.chunk;

  final BuiltExtrusion _built;
  final int chunks;
  final List<gpu.DeviceBuffer> buffers = [];
  final List<int> shownAt = [];
  int usedFrame = 0;

  int get uploaded => buffers.length;

  static const _stride = BuiltExtrusion.floatsPerVertex * 4;

  int chunkBytes(int c) {
    final vertices = _built.vertices.length ~/ BuiltExtrusion.floatsPerVertex;
    final from = c * BuiltExtrusion.chunk;
    return math.min(BuiltExtrusion.chunk, vertices - from) * _stride;
  }

  void upload(int now) {
    final c = buffers.length;
    final from = c * BuiltExtrusion.chunk * BuiltExtrusion.floatsPerVertex;
    buffers.add(
      gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(_built.vertices, from, from + chunkBytes(c) ~/ 4),
      ),
    );
    shownAt.add(now);
  }
}
