import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter_gpu/gpu.dart' as gpu;
import 'package:vector_math/vector_math.dart' show Vector4;
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/extrusion.dart';
import 'package:vmap/src/mercator.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tile_builder.dart' show tileExtent;
import 'package:vmap/src/tiles.dart' show TileDraw;
import 'package:vmap/src/view.dart';

const _bundle = 'build/shaderbundles/vmap.shaderbundle';

/// Draws a style's buildings on the GPU with a depth buffer, so a low
/// building never shows through a tall one. Each tile's buildings go to the
/// GPU once; a frame only sends a matrix per tile. Until the shaders load,
/// and where Flutter GPU is missing, the canvas draws them.
class GpuBuildings implements BuildingRenderer {
  GpuBuildings._() {
    _load();
  }

  /// A renderer when this device runs Flutter GPU, otherwise null.
  static GpuBuildings? create() {
    try {
      gpu.gpuContext;
      return GpuBuildings._();
    } catch (e) {
      debugPrint('vmap: no Flutter GPU, buildings stay on the canvas: $e');
      return null;
    }
  }

  final ExtrusionPainter _canvas = ExtrusionPainter();
  gpu.ShaderLibrary? _library;
  gpu.RenderPipeline? _pipeline;
  gpu.UniformSlot? _slot;

  /// The textures frames are drawn into in turn. Three, so the one being
  /// drawn is never one the raster thread may still be reading; an image
  /// surface waits on the GPU for that instead, on the UI thread.
  List<gpu.Texture> _ring = const [];
  int _next = 0;
  gpu.Texture? _depth;
  gpu.Texture? _samples;
  late final bool _msaa = gpu.gpuContext.doesSupportOffscreenMSAA;
  bool _transient = true;

  /// Flutter GPU reports no default colour format on macOS.
  late final gpu.PixelFormat _colorFormat =
      gpu.gpuContext.defaultColorFormat == gpu.PixelFormat.unknown
      ? gpu.PixelFormat.r8g8b8a8UNormInt
      : gpu.gpuContext.defaultColorFormat;
  gpu.HostBuffer? _host;
  int _width = 0, _height = 0;
  final Map<BuiltExtrusion, _Mesh> _meshes = Map.identity();
  final List<(TileDraw, BuiltExtrusion)> _found = [];
  int _frame = 0;

  /// What the last frame's steps cost, for profiling.
  static String lastBreakdown = '';
  static final List<String> slow = [];
  final Stopwatch _clock = Stopwatch()..start();

  /// How long a tile's buildings take to fade in once on the GPU.
  static const _fadeMicros = 250000;
  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;

  /// Bytes of new tiles sent to the GPU in one frame; the rest wait a
  /// frame. The first tile of a frame always goes.
  static const _bytesPerFrame = 192 * 1024;

  Future<void> _load() async {
    try {
      _library = await gpu.ShaderLibrary.fromAsset(_bundle);
    } catch (e) {
      debugPrint('vmap: building shaders did not load: $e');
    }
  }

  /// Made on the first frame drawn, never before: on OpenGL ES a pipeline
  /// made before the app has a surface can deadlock (flutter/flutter#193890).
  bool _ready() {
    if (_pipeline != null) return true;
    final library = _library;
    if (library == null) return false;
    final vertex = library['BuildingVertex'],
        fragment = library['BuildingFragment'];
    if (vertex == null || fragment == null) return false;
    _pipeline = gpu.gpuContext.createRenderPipeline(
      vertex,
      fragment,
      vertexLayout: const gpu.VertexLayout(
        buffers: [
          gpu.VertexBuffer(
            strideInBytes: 12,
            attributes: [
              gpu.VertexAttribute(
                name: 'packed_vertex',
                format: gpu.VertexFormat.uint32x3,
              ),
            ],
          ),
        ],
      ),
    );
    _slot = vertex.getUniformSlot('FrameInfo');
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
          format: _colorFormat,
        ),
    ];
    final samples = _msaa ? 4 : 1;
    _depth = _scratch(
      width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      samples,
    );
    _samples = _msaa ? _scratch(width, height, _colorFormat, samples) : null;
  }

  /// A texture only the GPU touches within a pass: kept in tile memory
  /// where the GPU has it, which desktop GPUs do not.
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
    throw StateError('vmap: no texture for the building pass');
  }

  @override
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    Iterable<TileDraw> tiles,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
  ) {
    if (!_ready()) {
      return _canvas.paint(
        canvas,
        view,
        origin,
        sheet,
        tiles,
        context,
        styleZoom,
        devicePixelRatio,
      );
    }
    _frame++;
    _found.clear();
    for (final layer in sheet.extrusions) {
      if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) continue;
      for (final d in tiles) {
        for (final e in d.tile.extrusions) {
          if (e.bucket == layer.bucket) _found.add((d, e));
        }
      }
    }
    if (_found.isEmpty) return false;
    final width = (view.width * devicePixelRatio).round();
    final height = (view.height * devicePixelRatio).round();
    if (width <= 0 || height <= 0) return false;
    final watch = Stopwatch()..start();
    _size(width, height);
    final target = _ring[_next];
    _next = (_next + 1) % _ring.length;
    final tAcquire = watch.elapsedMicroseconds;
    final commands = gpu.gpuContext.createCommandBuffer();
    final tCommands = watch.elapsedMicroseconds;
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        _samples == null
            ? gpu.ColorAttachment(texture: target, clearValue: Vector4.zero())
            : gpu.ColorAttachment(
                texture: _samples!,
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
    final tPass = watch.elapsedMicroseconds;
    pass
      ..bindPipeline(_pipeline!)
      ..setDepthWriteEnable(true)
      ..setDepthCompareOperation(gpu.CompareFunction.lessEqual)
      ..setCullMode(gpu.CullMode.none);
    final host = _host!..reset();
    final clip = view.clipMatrix(originX: origin.dx, originY: origin.dy);
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    final tSetup = watch.elapsedMicroseconds;
    var uploadMicros = 0;
    var uploads = 0, uploaded = 0;
    var fading = false, held = false;
    for (final (d, e) in _found) {
      final mesh = _meshes[e] ??= _Mesh(e);
      mesh.usedFrame = _frame;
      while (mesh.uploaded < mesh.chunks) {
        final bytes = mesh.chunkBytes(mesh.uploaded);
        if (uploaded > 0 && uploaded + bytes > _bytesPerFrame) {
          held = true;
          break;
        }
        final t0 = watch.elapsedMicroseconds;
        mesh.upload(_clock.elapsedMicroseconds);
        uploadMicros += watch.elapsedMicroseconds - t0;
        uploads++;
        uploaded += bytes;
      }
      if (mesh.uploaded == 0) continue;
      final scale = d.size / tileExtent;
      for (var c = 0; c < mesh.uploaded; c++) {
        final fade = math.min(
          1.0,
          (_clock.elapsedMicroseconds - mesh.shownAt[c]) / _fadeMicros,
        );
        if (fade < 1) fading = true;
        _times(clip, scale, perMetre, d.left, d.top, fade);
        pass
          ..bindVertexBuffer(
            gpu.BufferView(
              mesh.buffers[c],
              offsetInBytes: 0,
              lengthInBytes: mesh.chunkBytes(c),
            ),
          )
          ..bindUniform(_slot!, host.emplace(_infoBytes))
          ..draw(mesh.chunkBytes(c) ~/ 12);
      }
    }
    final tEncode = watch.elapsedMicroseconds;
    final tPresent = watch.elapsedMicroseconds;
    commands.submit();
    final tSubmit = watch.elapsedMicroseconds;
    final image = target.asImage();
    final tImage = watch.elapsedMicroseconds;
    lastBreakdown =
        'acquire=$tAcquire commands=${tCommands - tAcquire} '
        'pass=${tPass - tCommands} setup=${tSetup - tPass} '
        'upload=$uploadMicros/${uploaded ~/ 1024}KB '
        'draws=${tEncode - tSetup - uploadMicros} '
        'present=${tPresent - tEncode} submit=${tSubmit - tPresent} '
        'image=${tImage - tSubmit} tiles=${_found.length} uploads=$uploads';
    if (tImage > 2000 && slow.length < 60) slow.add(lastBreakdown);
    canvas.drawImageRect(
      image,
      ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()),
      ui.Rect.fromLTWH(0, 0, view.width, view.height),
      _paint,
    );
    if (_frame % 120 == 0) {
      _meshes.removeWhere((_, m) => _frame - m.usedFrame > 600);
    }
    return fading || held;
  }

  /// [clip] times a tile's model matrix: tile units scaled by [scale] and
  /// moved to [left], [top], metres up scaled by [perMetre].
  /// One frame info block, reused for every draw: the host buffer copies
  /// it, so making a new one per draw only fed the collector.
  static final Float32List _info = Float32List(20);
  static final ByteData _infoBytes = ByteData.sublistView(_info);

  static Float32List _times(
    Float64List clip,
    double scale,
    double perMetre,
    double left,
    double top,
    double fade,
  ) {
    final out = _info;
    out[16] = fade;
    for (var r = 0; r < 4; r++) {
      out[r] = clip[r] * scale;
      out[4 + r] = clip[4 + r] * scale;
      out[8 + r] = clip[8 + r] * perMetre;
      out[12 + r] = clip[r] * left + clip[4 + r] * top + clip[12 + r];
    }
    return out;
  }

  @override
  void dispose() {
    _meshes.clear();
    _ring = const [];
    _depth = null;
    _samples = null;
  }
}

/// One tile's buildings on the GPU, sent in pieces of a few dozen
/// kilobytes so no frame copies megabytes.
class _Mesh {
  _Mesh(this._built)
    : chunks =
          (_built.vertices.length ~/ 3 + BuiltExtrusion.chunk - 1) ~/
          BuiltExtrusion.chunk;

  final BuiltExtrusion _built;
  final int chunks;
  final List<gpu.DeviceBuffer> buffers = [];
  final List<int> shownAt = [];
  int usedFrame = 0;

  int get uploaded => buffers.length;

  int chunkBytes(int c) {
    final vertices = _built.vertices.length ~/ 3;
    final from = c * BuiltExtrusion.chunk;
    return math.min(BuiltExtrusion.chunk, vertices - from) * 12;
  }

  void upload(int now) {
    final c = buffers.length;
    final words = _built.vertices;
    final from = c * BuiltExtrusion.chunk * 3;
    buffers.add(
      gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(words, from, from + chunkBytes(c) ~/ 4),
      ),
    );
    shownAt.add(now);
  }
}
