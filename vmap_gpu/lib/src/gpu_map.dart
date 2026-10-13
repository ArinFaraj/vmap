import 'dart:developer' show Timeline;
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
  gpu.UniformSlot? _flatFrame, _flatSlots, _buildingFrame, _stencilFrame;
  gpu.UniformSlot? _flatFrag, _flatSprites;
  SpriteSheet? _sheet;
  ui.Image? _sheetImage;
  gpu.Texture? _sheetTexture;
  late final gpu.Texture _blank = gpu.gpuContext.createTexture(
    gpu.StorageMode.hostVisible,
    1,
    1,
    format: gpu.PixelFormat.r8g8b8a8UNormInt,
  )..overwrite(ByteData(4));
  final Float32List _fragInfo = Float32List(4);
  late final ByteData _fragBytes = ByteData.sublistView(_fragInfo);
  gpu.RenderPipeline? _stencil;

  /// A tile's square in tile units, two triangles.
  gpu.DeviceBuffer? _quad;
  _Uniforms? _host;
  List<gpu.Texture> _ring = const [];
  List<ui.Image> _images = const [];
  ui.Image? _lastImage;
  int _inFlight = 0;
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

  final Float32List _frameInfo = Float32List(28);
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
      if (layer is HeatmapLayer) return false;
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
    _flatFrag = mapFragment.getUniformSlot('FragInfo');
    _flatSprites = mapFragment.getUniformSlot('sprite_sheet');
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
    final stencilVertex = library['StencilVertex'];
    final stencilFragment = library['StencilFragment'];
    if (stencilVertex != null && stencilFragment != null) {
      _stencil = gpu.gpuContext.createRenderPipeline(
        stencilVertex,
        stencilFragment,
        vertexLayout: const gpu.VertexLayout(
          buffers: [
            gpu.VertexBuffer(
              strideInBytes: 8,
              attributes: [
                gpu.VertexAttribute(
                  name: 'position',
                  format: gpu.VertexFormat.float32x2,
                ),
              ],
            ),
          ],
        ),
      );
      _stencilFrame = stencilVertex.getUniformSlot('FrameInfo');
      const e = tileExtent;
      _quad = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(
          Float32List.fromList([0, 0, e, 0, e, e, 0, 0, e, e, 0, e]),
        ),
      );
    }
    _host = _Uniforms();
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
    for (final image in _images) {
      image.dispose();
    }
    _images = [for (final t in _ring) t.asImage()];
    _lastImage = null;
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
    List<List<TileDraw>> fallback,
    List<List<TileDraw>> ideal,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
    SpriteSheet? sprites,
  ) {
    if (!_ready()) return true;
    _sheet = sprites;
    _frame++;
    final width = (view.width * devicePixelRatio).round();
    final height = (view.height * devicePixelRatio).round();
    if (width <= 0 || height <= 0) return false;
    _size(width, height);
    // A GPU that falls behind blocks the thread that queues more work for
    // it, so while two frames are still in flight the last image is shown
    // again and the frame comes back once one finishes.
    final shown = _lastImage;
    if (_inFlight >= 2 && shown != null) {
      canvas.drawImageRect(
        shown,
        ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()),
        ui.Rect.fromLTWH(0, 0, view.width, view.height),
        _paint,
      );
      return true;
    }
    final target = _ring[_next];
    final image = _images[_next];
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
    _setFog(sheet, context, view);
    _budget = _bytesPerFrame;
    _more = false;
    _layerPaint.clear();

    // Each tile writes its number over its square, and draws only where
    // its number is: a tile's data runs a little past its square, and a
    // translucent fill drawn twice there shows a seam. A tile standing in
    // for a missing one draws where no number is. Tilted, a square is no
    // rectangle on the screen, so scissors cannot do it. Sources tile the
    // map apart, so the numbers are rewritten when the source changes.
    for (final tiles in ideal) {
      for (final d in tiles) {
        _upload(d, all: true);
      }
    }
    for (final tiles in fallback) {
      for (final d in tiles) {
        _upload(d, all: false);
      }
    }

    var marked = -1;
    void mark(int source) {
      if (source == marked || _stencil == null) return;
      pass
        ..clearBindings()
        ..bindPipeline(_stencil!)
        ..setCullMode(gpu.CullMode.none)
        ..setDepthWriteEnable(false)
        ..setDepthCompareOperation(gpu.CompareFunction.always)
        ..setColorBlendEnable(true)
        ..setColorBlendEquation(_over)
        ..setStencilConfig(
          gpu.StencilConfig(
            depthStencilPassOperation: gpu.StencilOperation.setToReferenceValue,
          ),
        )
        ..bindVertexBuffer(
          gpu.BufferView(_quad!, offsetInBytes: 0, lengthInBytes: 48),
        );
      void cover(List<TileDraw> tiles, bool clear) {
        for (final (i, d) in tiles.indexed) {
          if (!_shown(d)) continue;
          _times(clip, d.size / tileExtent, 1, d.left, d.top, 1);
          pass
            ..setStencilReference(clear ? 0 : i + 1)
            ..bindUniform(_stencilFrame!, host.emplace(_frameBytes))
            ..draw(6);
        }
      }

      if (marked >= 0) cover(ideal[marked], true);
      cover(ideal[source], false);
      marked = source;
      pass.clearBindings();
    }

    bool clips(int source) => _stencil != null && ideal[source].length < 255;

    var flat = false;
    Timeline.startSync('vmap.gpu.flat');
    for (final run in sheet.runs) {
      if (run.source < 0 || run.source >= ideal.length) continue;
      final source = run.source;
      final clipped = clips(source);
      if (clipped && marked != source) {
        mark(source);
        flat = false;
      }
      if (!flat) {
        pass
          ..bindPipeline(_flat!)
          ..setDepthWriteEnable(false)
          ..setDepthCompareOperation(gpu.CompareFunction.always)
          ..setCullMode(gpu.CullMode.none)
          ..setColorBlendEnable(true)
          ..setColorBlendEquation(_over);
        _bindSprites(pass);
        flat = true;
      }
      if (clipped) {
        pass
          ..setStencilReference(0)
          ..setStencilConfig(
            gpu.StencilConfig(compareFunction: gpu.CompareFunction.equal),
          );
        for (final d in fallback[source]) {
          _drawFlat(pass, d, sheet, run, clip, context, styleZoom);
        }
      } else {
        pass.setStencilConfig(gpu.StencilConfig());
      }
      for (final (i, d) in ideal[source].indexed) {
        if (clipped) pass.setStencilReference(i + 1);
        _drawFlat(pass, d, sheet, run, clip, context, styleZoom);
      }
      pass.setStencilConfig(gpu.StencilConfig());
    }

    Timeline.finishSync();
    if (sheet.extrusions.isNotEmpty) Timeline.startSync('vmap.gpu.buildings');
    if (sheet.extrusions.isNotEmpty) {
      for (var source = 0; source < ideal.length; source++) {
        bool built(List<TileDraw> tiles) =>
            tiles.any((d) => d.tile.extrusions.isNotEmpty);
        final standIn = built(fallback[source]) && clips(source);
        if (!built(ideal[source]) && !standIn) continue;
        if (standIn) mark(source);
        pass
          ..clearBindings()
          ..bindPipeline(_buildings!)
          ..setCullMode(gpu.CullMode.none)
          ..setColorBlendEnable(true)
          ..setStencilConfig(gpu.StencilConfig())
          ..setDepthWriteEnable(true)
          ..setDepthCompareOperation(gpu.CompareFunction.lessEqual);
        _drawBuildings(pass, view, sheet, ideal[source], clip, styleZoom);
        if (standIn) {
          pass
            ..setStencilReference(0)
            ..setStencilConfig(
              gpu.StencilConfig(compareFunction: gpu.CompareFunction.equal),
            );
          _drawBuildings(pass, view, sheet, fallback[source], clip, styleZoom);
        }
      }
    }
    if (sheet.extrusions.isNotEmpty) Timeline.finishSync();
    final more = _more;

    _inFlight++;
    Timeline.timeSync(
      'vmap.gpu.submit',
      () => commands.submit(completionCallback: (_) => _inFlight--),
    );
    _lastImage = image;
    canvas.drawImageRect(
      image,
      ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()),
      ui.Rect.fromLTWH(0, 0, view.width, view.height),
      _paint,
    );
    if (_frame % 120 == 0) {
      _tiles.removeWhere((_, b) {
        if (_frame - b.usedFrame <= 600) return false;
        _pool.give(b.buffer);
        return true;
      });
      _built.removeWhere((_, b) => _frame - b.usedFrame > 600);
    }
    return more;
  }

  /// Premultiplied source over, which also leaves the colour untouched
  /// where the stencil pass writes its transparent squares.
  static final _over = gpu.ColorBlendEquation(
    sourceColorBlendFactor: gpu.BlendFactor.one,
    destinationColorBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
    sourceAlphaBlendFactor: gpu.BlendFactor.one,
    destinationAlphaBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
  );

  int _budget = 0;
  bool _more = false;
  final _pool = _BufferPool();

  /// Whether [d]'s geometry is all on the GPU, so it draws and claims its
  /// square; a tile still arriving leaves its square to stand-ins.
  bool _shown(TileDraw d) {
    final stream = d.tile.gpu;
    return stream != null && (_tiles[stream]?.ready ?? false);
  }

  @override
  bool upload(GpuStream stream, Stopwatch clock, int deadline) {
    final buffers = _tiles[stream] ??= Timeline.timeSync(
      'vmap.gpu.upload.alloc',
      () => _TileBuffers(stream, _pool),
    );
    buffers.usedFrame = _frame;
    Timeline.timeSync('vmap.gpu.upload.copy', () {
      do {
        buffers.send(_piece);
      } while (!buffers.ready && clock.elapsedMicroseconds < deadline);
    });
    return buffers.ready;
  }

  static const _piece = 256 * 1024;

  /// Sends what this frame's budget allows of [d]'s geometry, or with
  /// [all] all of it: a tile the engine counts as ready, whose buffers were
  /// let go while it sat unused, must not leave a hole.
  void _upload(TileDraw d, {required bool all}) {
    final stream = d.tile.gpu;
    if (stream == null) return;
    final known = _tiles[stream];
    if (known != null && known.ready) return;
    if (all) {
      upload(stream, _clock, 0);
      final buffers = _tiles[stream]!;
      while (!buffers.ready) {
        buffers.send(_piece);
      }
      return;
    }
    if (_budget <= 0) {
      _more = true;
      return;
    }
    final buffers =
        known ??
        (_tiles[stream] = Timeline.timeSync(
          'vmap.gpu.upload.alloc',
          () => _TileBuffers(stream, _pool),
        ));
    buffers.usedFrame = _frame;
    _budget -= Timeline.timeSync(
      'vmap.gpu.upload.copy',
      () => buffers.send(_budget),
    );
    if (!buffers.ready) _more = true;
  }

  /// The style's sprite sheet as a texture, for patterned fills.
  void _bindSprites(gpu.RenderPass pass) {
    final image = _sheet?.image;
    if (!identical(image, _sheetImage)) {
      _sheetImage = image;
      _sheetTexture = null;
      if (image != null) {
        try {
          _sheetTexture = gpu.Texture.fromImage(gpu.gpuContext, image);
        } catch (e) {
          debugPrint('vmap_gpu: the sprite sheet is not on the GPU: $e');
        }
      }
    }
    final texture = _sheetTexture ?? _blank;
    _fragInfo
      ..[0] = texture.width.toDouble()
      ..[1] = texture.height.toDouble();
    pass
      ..bindUniform(_flatFrag!, _host!.emplace(_fragBytes))
      ..bindTexture(
        _flatSprites!,
        texture,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.linear,
          magFilter: gpu.MinMagFilter.linear,
        ),
      );
  }

  /// Draws [run]'s layers of tile [d].
  void _drawFlat(
    gpu.RenderPass pass,
    TileDraw d,
    StyleSheet sheet,
    StyleRun run,
    Float64List clip,
    EvalContext context,
    double styleZoom,
  ) {
    final stream = d.tile.gpu;
    if (stream == null) return;
    final from = stream.layerFirst[run.first];
    final to = stream.layerFirst[run.end];
    if (from == to) return;
    final buffers = _tiles[stream];
    if (buffers == null || !buffers.ready) return;
    buffers.usedFrame = _frame;
    final host = _host!;
    final scale = d.size / tileExtent;
    _times(clip, scale, 1, d.left, d.top, 1);
    pass
      ..bindVertexBuffer(
        gpu.BufferView(
          buffers.buffer,
          offsetInBytes: 0,
          lengthInBytes: stream.vertices.lengthInBytes,
        ),
      )
      ..bindUniform(_flatFrame!, host.emplace(_frameBytes));
    final segments = stream.segments;
    for (var s = 0; s < segments.length; s += 3) {
      final first = math.max(segments[s], from);
      final count = math.min(segments[s] + segments[s + 1], to) - first;
      if (count <= 0) continue;
      final slotBase = segments[s + 2];
      final slotEnd = s + 5 < segments.length
          ? segments[s + 5]
          : stream.slots.length;
      _fillSlots(sheet, stream, slotBase, slotEnd, scale, context, styleZoom);
      pass
        ..bindUniform(_flatSlots!, host.emplace(_slotBytes))
        ..bindIndexBuffer(
          gpu.BufferView(
            buffers.buffer,
            offsetInBytes: buffers.indexOffset + first * 4,
            lengthInBytes: count * 4,
          ),
          gpu.IndexType.int32,
        )
        ..drawIndexed(count);
    }
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
      if (paint.circle) {
        out[o] = paint.r;
        out[o + 1] = paint.g;
        out[o + 2] = paint.b;
        out[o + 3] = paint.a;
        out[o + 4] = paint.halfWidth / scale;
        out[o + 5] = paint.offset / scale;
        out[o + 6] = paint.dashOn;
        out[o + 7] = paint.dashPeriod;
        continue;
      }
      final pattern = paint.pattern;
      if (pattern != null) {
        final entry = _sheet?.entries[pattern];
        out[o] = entry?.pixelRatio ?? 1;
        out[o + 1] = 0;
        out[o + 2] = 0;
        out[o + 3] = entry == null ? 0 : paint.a;
        out[o + 4] = entry?.source.left ?? 0;
        out[o + 5] = entry?.source.top ?? 0;
        out[o + 6] = entry?.source.width ?? 1;
        out[o + 7] = entry?.source.height ?? 1;
        continue;
      }
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

  /// Draws the buildings of [tiles]. The flat layers leave an index buffer
  /// bound, which the caller clears first, or these draws would read their
  /// vertices through it.
  void _drawBuildings(
    gpu.RenderPass pass,
    MapView view,
    StyleSheet sheet,
    List<TileDraw> tiles,
    Float64List clip,
    double styleZoom,
  ) {
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    final host = _host!;
    for (final layer in sheet.extrusions) {
      if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) continue;
      for (final d in tiles) {
        for (final e in d.tile.extrusions) {
          if (e.bucket != layer.bucket) continue;
          final b = _built[e] ??= Timeline.timeSync(
            'vmap.gpu.upload.building',
            () => _BuildingBuffers(e),
          );
          b.usedFrame = _frame;
          while (b.uploaded < b.chunks) {
            final bytes = b.chunkBytes(b.uploaded);
            if (_budget < _bytesPerFrame && bytes > _budget) {
              _more = true;
              break;
            }
            _budget -= bytes;
            b.upload(_clock.elapsedMicroseconds);
          }
          final scale = d.size / tileExtent;
          for (var c = 0; c < b.uploaded; c++) {
            final fade = math.min(
              1.0,
              (_clock.elapsedMicroseconds - b.shownAt[c]) / _fadeMicros,
            );
            if (fade < 1) _more = true;
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
  }

  /// Distance haze in the style's background colour: none on a flat map,
  /// growing with pitch, from 1.25 times the camera's distance to the
  /// centre to 2.6 times, about where the far edge of a 60 degree view on a
  /// phone held upright lies.
  void _setFog(StyleSheet sheet, EvalContext context, MapView view) {
    final background =
        Rgba.of(sheet.background(context)) ?? const Rgba(1, 1, 1, 1);
    final strength = ((view.pitch - 20) / 40).clamp(0.0, 1.0) * 0.75;
    _frameInfo
      ..[20] = background.r
      ..[21] = background.g
      ..[22] = background.b
      ..[23] = strength
      ..[24] = 1.25
      ..[25] = 2.6;
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
    out[17] = scale;
  }

  @override
  void dispose() {
    _tiles.clear();
    _pool.clear();
    _built.clear();
    _ring = const [];
    for (final image in _images) {
      image.dispose();
    }
    _images = const [];
    _lastImage = null;
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
    this.dashPeriod, [
    this.pattern,
    this.circle = false,
  ]);

  /// A circle: [halfWidth] is its radius, [offset] its ring's width,
  /// [dashOn] its ring's colour packed as red plus 256 green plus 65536
  /// blue and [dashPeriod] the ring's alpha.
  final bool circle;

  /// The sprite a patterned fill repeats.
  final String? pattern;

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
      if (layer is CircleLayer) {
        final diameter = (asNumber(layer.width(context)) ?? 0).toDouble();
        final ring = layer.ring;
        var ringWidth = 0.0, ringRgb = 0.0, ringAlpha = 0.0;
        if (ring != null) {
          ringWidth = (asNumber(ring.width(context)) ?? 0).toDouble();
          final ringColor = Rgba.of(ring.color(context));
          if (ringColor != null && ringWidth > 0) {
            int c(double v) => (v * 255).round().clamp(0, 255);
            ringRgb =
                (c(ringColor.r) + c(ringColor.g) * 256 + c(ringColor.b) * 65536)
                    .toDouble();
            ringAlpha = (ringColor.a * (asNumber(ring.opacity(context)) ?? 1))
                .clamp(0.0, 1.0);
          } else {
            ringWidth = 0;
          }
        }
        return _Paint(
          color.r * a,
          color.g * a,
          color.b * a,
          a,
          diameter / 2,
          ringWidth,
          0,
          0,
          ringRgb,
          ringAlpha,
          null,
          true,
        );
      }
      var tx = 0.0, ty = 0.0;
      if (layer is MeshLayer) {
        final moved = layer.translate?.call(context);
        if (moved is List && moved.length == 2) {
          tx = (asNumber(moved[0]) ?? 0).toDouble();
          ty = (asNumber(moved[1]) ?? 0).toDouble();
        }
      }
      final pattern = layer is FillLayer ? layer.pattern?.call(context) : null;
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
        pattern is String && pattern.isNotEmpty ? pattern : null,
      );
    } finally {
      if (props != null) context.props = const {};
    }
  }
}

/// One tile's stream in one host visible buffer, vertices then indices,
/// filled over as many frames as the upload budget needs.
/// Uniform data for the frames the GPU may still be reading, in host
/// visible blocks reused frame after frame. Flutter's HostBuffer checks a
/// block's room without the write's length and never reuses a block it
/// added (flutter/flutter#186526, #192392).
class _Uniforms {
  static const _frames = 4;
  static const _blockBytes = 1 << 20;
  final List<List<gpu.DeviceBuffer>> _blocks = [
    for (var i = 0; i < _frames; i++) [],
  ];
  late final int _align = math.max(
    16,
    gpu.gpuContext.minimumUniformByteAlignment,
  );
  int _frame = 0, _block = 0, _offset = 0;

  void reset() {
    _frame = (_frame + 1) % _frames;
    _block = 0;
    _offset = 0;
  }

  gpu.BufferView emplace(ByteData bytes) {
    final length = bytes.lengthInBytes;
    var at = (_offset + _align - 1) ~/ _align * _align;
    final blocks = _blocks[_frame];
    if (blocks.isEmpty || at + length > _blockBytes) {
      if (blocks.isNotEmpty) _block++;
      at = 0;
    }
    while (blocks.length <= _block) {
      blocks.add(
        gpu.gpuContext.createDeviceBuffer(
          gpu.StorageMode.hostVisible,
          math.max(_blockBytes, length),
        ),
      );
    }
    final buffer = blocks[_block];
    buffer.overwrite(bytes, destinationOffsetInBytes: at);
    _offset = at + length;
    return gpu.BufferView(buffer, offsetInBytes: at, lengthInBytes: length);
  }
}

class _TileBuffers {
  _TileBuffers(this.stream, _BufferPool pool)
    : indexOffset = _align(stream.vertices.lengthInBytes),
      buffer = pool.take(
        _align(stream.vertices.lengthInBytes) + stream.indices.lengthInBytes,
      );

  final GpuStream stream;
  final gpu.DeviceBuffer buffer;
  final int indexOffset;
  int usedFrame = 0;
  int _sent = 0;

  static int _align(int bytes) => (bytes + 255) & ~255;

  int get _vertexBytes => stream.vertices.lengthInBytes;
  int get _total => _vertexBytes + stream.indices.lengthInBytes;
  bool get ready => _sent >= _total;

  /// Copies up to [most] more bytes and returns how many it copied.
  int send(int most) {
    var left = most;
    while (left > 0 && !ready) {
      final inVertices = _sent < _vertexBytes;
      final source = inVertices
          ? ByteData.sublistView(stream.vertices)
          : ByteData.sublistView(stream.indices);
      final from = inVertices ? _sent : _sent - _vertexBytes;
      final n = math.min(left, source.lengthInBytes - from);
      final at = inVertices ? from : indexOffset + from;
      buffer.overwrite(
        ByteData.sublistView(source, from, from + n),
        destinationOffsetInBytes: at,
      );
      buffer.flush(offsetInBytes: at, lengthInBytes: n);
      _sent += n;
      left -= n;
    }
    return most - left;
  }
}

/// Host visible buffers kept for reuse in power of two sizes, so a new
/// tile rarely asks the driver for memory.
class _BufferPool {
  final Map<int, List<gpu.DeviceBuffer>> _free = {};
  int _freeBytes = 0;
  static const _keepBytes = 32 << 20;

  static int _size(int bytes) {
    var size = 64 << 10;
    while (size < bytes) {
      size <<= 1;
    }
    return size;
  }

  gpu.DeviceBuffer take(int bytes) {
    final size = _size(bytes);
    final list = _free[size];
    if (list != null && list.isNotEmpty) {
      _freeBytes -= size;
      return list.removeLast();
    }
    return gpu.gpuContext.createDeviceBuffer(gpu.StorageMode.hostVisible, size);
  }

  void give(gpu.DeviceBuffer buffer) {
    final size = buffer.sizeInBytes;
    if (_freeBytes + size > _keepBytes) return;
    (_free[size] ??= []).add(buffer);
    _freeBytes += size;
  }

  void clear() {
    _free.clear();
    _freeBytes = 0;
  }
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
