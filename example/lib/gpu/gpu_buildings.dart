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
  gpu.GpuImageSurface? _surface;
  gpu.Texture? _depth;
  gpu.Texture? _samples;
  late final bool _msaa = gpu.gpuContext.doesSupportOffscreenMSAA;
  gpu.HostBuffer? _host;
  int _width = 0, _height = 0;
  final Map<BuiltExtrusion, _Mesh> _meshes = Map.identity();
  final List<(TileDraw, BuiltExtrusion)> _found = [];
  int _frame = 0;
  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;

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
    _pipeline = gpu.gpuContext.createRenderPipeline(vertex, fragment);
    _slot = vertex.getUniformSlot('FrameInfo');
    _host = gpu.gpuContext.createHostBuffer();
    return true;
  }

  void _size(int width, int height) {
    if (width == _width && height == _height && _surface != null) return;
    _width = width;
    _height = height;
    final surface = _surface;
    if (surface == null) {
      _surface = gpu.gpuContext.createImageSurface(width, height);
    } else {
      surface.resize(width, height);
    }
    final samples = _msaa ? 4 : 1;
    _depth = gpu.gpuContext.createTexture(
      gpu.StorageMode.deviceTransient,
      width,
      height,
      format: gpu.gpuContext.defaultDepthStencilFormat,
      sampleCount: samples,
    );
    _samples = _msaa
        ? gpu.gpuContext.createTexture(
            gpu.StorageMode.deviceTransient,
            width,
            height,
            format: gpu.gpuContext.defaultColorFormat,
            sampleCount: samples,
          )
        : null;
  }

  @override
  void paint(
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
      _canvas.paint(
        canvas,
        view,
        origin,
        sheet,
        tiles,
        context,
        styleZoom,
        devicePixelRatio,
      );
      return;
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
    if (_found.isEmpty) return;
    final width = (view.width * devicePixelRatio).round();
    final height = (view.height * devicePixelRatio).round();
    if (width <= 0 || height <= 0) return;
    _size(width, height);
    final frame = _surface!.acquireNextFrame();
    final commands = gpu.gpuContext.createCommandBuffer();
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        _samples == null
            ? gpu.ColorAttachment(
                texture: frame.colorTexture,
                clearValue: Vector4.zero(),
              )
            : gpu.ColorAttachment(
                texture: _samples!,
                resolveTexture: frame.colorTexture,
                storeAction: gpu.StoreAction.multisampleResolve,
                clearValue: Vector4.zero(),
              ),
        depthStencilAttachment: gpu.DepthStencilAttachment(
          texture: _depth!,
          depthClearValue: 1,
        ),
      ),
    );
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
    for (final (d, e) in _found) {
      final mesh = _meshes[e] ??= _Mesh.of(e);
      mesh.usedFrame = _frame;
      if (mesh.count == 0) continue;
      final scale = d.size / tileExtent;
      final mvp = _times(clip, scale, perMetre, d.left, d.top);
      pass
        ..bindVertexBuffer(
          gpu.BufferView(
            mesh.buffer,
            offsetInBytes: 0,
            lengthInBytes: mesh.bytes,
          ),
        )
        ..bindUniform(_slot!, host.emplace(ByteData.sublistView(mvp)))
        ..draw(mesh.count);
    }
    frame.present(commands);
    commands.submit();
    final image = _surface!.currentImage;
    if (image != null) {
      canvas.drawImageRect(
        image,
        ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()),
        ui.Rect.fromLTWH(0, 0, view.width, view.height),
        _paint,
      );
    }
    if (_frame % 120 == 0) {
      _meshes.removeWhere((_, m) => _frame - m.usedFrame > 600);
    }
  }

  /// [clip] times a tile's model matrix: tile units scaled by [scale] and
  /// moved to [left], [top], metres up scaled by [perMetre].
  static Float32List _times(
    Float64List clip,
    double scale,
    double perMetre,
    double left,
    double top,
  ) {
    final out = Float32List(16);
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
    _surface = null;
    _depth = null;
    _samples = null;
  }
}

/// One tile's buildings on the GPU: x and y in tile units, z in metres,
/// then colour, seven floats a vertex, lit once when built.
class _Mesh {
  _Mesh(this.buffer, this.bytes, this.count);

  final gpu.DeviceBuffer buffer;
  final int bytes;
  final int count;
  int usedFrame = 0;

  static const _lightX = -0.6, _lightY = -0.8;

  static _Mesh of(BuiltExtrusion e) {
    final out = <double>[];
    final info = e.info, w = e.walls, rp = e.roof, ri = e.roofIndices;
    for (var b = 0; b < e.count; b++) {
      final i = b * BuiltExtrusion.stride;
      final top = info[i], bottom = info[i + 1];
      final r = info[i + 8],
          g = info[i + 9],
          bl = info[i + 10],
          a = info[i + 11];
      void vertex(double x, double y, double z, double light) => out.addAll([
        x,
        y,
        z,
        math.min(1, r * light),
        math.min(1, g * light),
        math.min(1, bl * light),
        a,
      ]);
      final firstWall = info[i + 4].toInt(), walls = info[i + 5].toInt();
      for (var j = firstWall; j < firstWall + walls; j++) {
        final x0 = w[j * 4],
            y0 = w[j * 4 + 1],
            x1 = w[j * 4 + 2],
            y1 = w[j * 4 + 3];
        final nx = y1 - y0, ny = x0 - x1;
        final len = math.sqrt(nx * nx + ny * ny);
        if (len == 0) continue;
        final light = 0.72 + 0.2 * (nx * _lightX + ny * _lightY) / len;
        final low = light * 0.82;
        vertex(x0, y0, bottom, low);
        vertex(x1, y1, bottom, low);
        vertex(x1, y1, top, light);
        vertex(x0, y0, bottom, low);
        vertex(x1, y1, top, light);
        vertex(x0, y0, top, light);
      }
      final firstRoof = info[i + 6].toInt(), roofs = info[i + 7].toInt();
      for (var j = firstRoof; j < firstRoof + roofs; j++) {
        final v = ri[j].toInt();
        vertex(rp[v * 2], rp[v * 2 + 1], top, 1);
      }
    }
    final data = Float32List.fromList(out);
    final buffer = gpu.gpuContext.createDeviceBufferWithCopy(
      ByteData.sublistView(data),
    );
    return _Mesh(buffer, data.lengthInBytes, out.length ~/ 7);
  }
}
