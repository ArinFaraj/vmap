import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';

import '../camera/view.dart';
import '../labels/sdf_text.dart';
import '../render/frame_planes.dart';
import '../text/glyphs/glyph_pbf.dart';
import 'gpu_buffers.dart' show framesInFlight;
import 'gpu_device.dart';
import 'frame_show.dart' show TextPass;
import 'gpu_shim/gpu.dart' as gpu;
import 'pass_target.dart';
import 'sdf_atlas.dart';
import 'sdf_quad.dart';

/// Text from a style's glyph ranges drawn as MapLibre draws it: the
/// glyphs' distance fields packed into one atlas, each glyph a quad, its
/// edge and halo cut by MapLibre's `symbol_sdf` shader, into an image the
/// canvas lays where the labels go.
class SdfTextGpu implements SdfText {
  SdfTextGpu(this._device, this._library, {required this._guard});

  final GpuDevice _device;

  /// Runs the text's work on the GPU, answering the canvas given when the
  /// device refuses it.
  final ui.Canvas Function(ui.Canvas lost, ui.Canvas Function() draw) _guard;
  final gpu.ShaderLibrary _library;
  gpu.RenderPipeline? _pipeline;
  gpu.UniformSlot? _frameSlot, _fragmentFrameSlot, _glyphSlot, _spriteSlot;
  gpu.UniformSlot? _groundSlot;
  bool _failed = false;

  final SdfAtlas _atlas = SdfAtlas();
  gpu.Texture? _atlasTexture;

  PbfGlyphs? _glyphs;

  ui.Size _size = ui.Size.zero;
  double _dpr = 1;

  /// One [SdfQuad] an instance, drawn over the six corners of [_corners].
  static const _quadFloats = SdfQuad.floats;
  gpu.DeviceBuffer? _corners;
  Float32List _vertices = Float32List(_quadFloats * 256);
  Float32List _ordered = Float32List(_quadFloats * 256);
  int _count = 0;

  /// Each quad's style layer and whether it is an icon.
  Int32List _layers = Int32List(256);
  Uint8List _icons = Uint8List(256);

  /// What text is drawn into when it does not go in the map's pass, a
  /// ring for the frames the GPU may still be drawing, and their images.
  final List<(PassTarget, ui.Image)> _targets = [];

  /// On the web a texture's image is a copy taken when it is asked for:
  /// the last frame's copy, let go when the next one is taken.
  ui.Image? _webCopy;
  int _next = 0;
  final Float32List _frameInfo = Float32List(12)..[8 + SdfAtlas.channel] = 1;
  late final ByteData _frameBytes = ByteData.sublistView(_frameInfo);

  /// The flat map's projection this frame, for quads kept on the ground.
  final Float32List _groundInfo = Float32List(12);
  late final ByteData _groundBytes = ByteData.sublistView(_groundInfo);

  /// Whether [build] made its pipeline.
  bool get ready => _pipeline != null;

  /// Whether [build] is still to be called: false once it has made the
  /// pipeline or found the device cannot.
  bool get unbuilt => _pipeline == null && !_failed;

  /// Makes the pipeline, which compiles the text's shaders on this thread:
  /// Flutter GPU waits for the driver, and on Metal that compiles them from
  /// source. Nothing else should be compiled in the same frame.
  void build() {
    if (!unbuilt) return;
    final library = _library;
    final vertex = library['SdfVertex'], fragment = library['SdfFragment'];
    if (vertex == null || fragment == null) {
      _failed = true;
      return;
    }
    try {
      _pipeline = gpu.gpuContext.createRenderPipeline(
        vertex,
        fragment,
        vertexLayout: const gpu.VertexLayout(
          buffers: [
            gpu.VertexBuffer(
              strideInBytes: 8,
              attributes: [
                gpu.VertexAttribute(
                  name: 'corner',
                  format: gpu.VertexFormat.float32x2,
                ),
              ],
            ),
            gpu.VertexBuffer(
              strideInBytes: SdfQuad.bytes,
              stepMode: gpu.VertexStepMode.instance,
              attributes: [
                gpu.VertexAttribute(
                  name: 'placement',
                  format: gpu.VertexFormat.float32x4,
                ),
                gpu.VertexAttribute(
                  name: 'axes',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: SdfQuad.axes * 4,
                ),
                gpu.VertexAttribute(
                  name: 'extent',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: SdfQuad.extent * 4,
                ),
                gpu.VertexAttribute(
                  name: 'ink',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: SdfQuad.ink * 4,
                ),
                gpu.VertexAttribute(
                  name: 'halo',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: SdfQuad.halo * 4,
                ),
                gpu.VertexAttribute(
                  name: 'params',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: SdfQuad.params * 4,
                ),
                gpu.VertexAttribute(
                  name: 'clip',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: SdfQuad.clip * 4,
                ),
                gpu.VertexAttribute(
                  name: 'anchor',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: SdfQuad.anchor * 4,
                ),
              ],
            ),
          ],
        ),
      );
      _corners = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(
          Float32List.fromList([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
        ),
      );
      _frameSlot = vertex.getUniformSlot('SdfFrame');
      _groundSlot = vertex.getUniformSlot('SdfGround');
      _spriteSlot = fragment.getUniformSlot('sprites');
      _fragmentFrameSlot = fragment.getUniformSlot('SdfFrame');
      _glyphSlot = fragment.getUniformSlot('glyphs');
      _atlasTexture = _atlas.createTexture();
    } catch (e) {
      _device.fail(e);
      _pipeline = null;
      _failed = true;
    }
  }

  @override
  void begin(
    ui.Size size,
    double devicePixelRatio,
    PbfGlyphs glyphs,
    MapView view,
  ) {
    _size = size;
    _dpr = devicePixelRatio;
    _glyphs = glyphs;
    _count = 0;
    view.flatProjection(_groundInfo);
  }

  @override
  KeptText keep(int glyphs) => _KeptQuads(this, glyphs);

  /// Queues [kept]'s quads, placed by [SdfQuad.atAnchor].
  void _queueKept(
    _KeptQuads kept,
    double x,
    double y,
    double size,
    double opacity,
    int layer,
  ) {
    final count = kept._count;
    if (count == 0) return;
    _reserve(count);
    final from = _count * _quadFloats;
    _vertices.setRange(from, from + count * _quadFloats, kept._quads);
    for (var q = 0; q < count; q++) {
      final at = _queue(layer, false);
      SdfQuad.atAnchor(_vertices, at, x, y, size, opacity);
    }
  }

  /// Makes the next quad queued one of [layer]'s and returns where its
  /// floats go in [_vertices], which it may have replaced with a longer
  /// list.
  int _queue(int layer, bool icon) {
    _reserve(1);
    _layers[_count] = layer;
    _icons[_count] = icon ? 1 : 0;
    return _count++ * _quadFloats;
  }

  /// Makes room for [more] quads after the ones queued.
  void _reserve(int more) {
    if ((_count + more) * _quadFloats <= _vertices.length) return;
    var quads = _layers.length;
    while (quads < _count + more) {
      quads *= 2;
    }
    _vertices = Float32List(quads * _quadFloats)
      ..setRange(0, _count * _quadFloats, _vertices);
    _ordered = Float32List(_vertices.length);
    _layers = Int32List(quads)..setRange(0, _count, _layers);
    _icons = Uint8List(quads)..setRange(0, _count, _icons);
  }

  /// As MapLibre's getGlyphQuads: a glyph's quad covers its field and its
  /// padding, from its left bearing less the border and the padding.
  /// Each int is made a double first: an int with a double is boxed on
  /// the web, once for each glyph drawn.
  static const _pad = GlyphPbf.border + 1.0;
  static double _quadLeft(PbfGlyph g) => g.left.toDouble() - _pad;
  static double _quadTop(PbfGlyph g) => -g.top.toDouble() - _pad;
  static double _quadWidth(PbfGlyph g) => g.width.toDouble() + 2.0 * _pad;
  static double _quadHeight(PbfGlyph g) => g.height.toDouble() + 2.0 * _pad;

  @override
  void glyph(
    int face,
    int codePoint,
    double ox,
    double oy,
    double ax,
    double ay,
    double bx,
    double by,
    SdfLook look,
    int layer,
  ) {
    final g = _glyphs?.glyph(face, codePoint);
    if (g == null) return;
    final corner = _atlas.corner(face, codePoint, g);
    if (corner < 0) return;
    final u0 = _quadLeft(g), v0 = _quadTop(g);
    final at = _queue(layer, false);
    SdfQuad.onScreen(
      _vertices,
      at,
      ox + u0 * ax + v0 * bx,
      oy + u0 * ay + v0 * by,
      ax,
      ay,
      bx,
      by,
      (corner % SdfAtlas.side).toDouble(),
      (corner ~/ SdfAtlas.side).toDouble(),
      _quadWidth(g),
      _quadHeight(g),
      look,
    );
  }

  @override
  bool icon(
    ui.Rect source,
    ui.Rect clip,
    double ox,
    double oy,
    double ax,
    double ay,
    double bx,
    double by, {
    required bool sdf,
    required bool linear,
    required SdfLook look,
    required int layer,
  }) {
    final sprites = _device.sprites;
    if (sprites.texture == null || sprites.image == null) return false;
    final at = _queue(layer, true);
    SdfQuad.onScreen(
      _vertices,
      at,
      ox,
      oy,
      ax,
      ay,
      bx,
      by,
      source.left,
      source.top,
      source.width,
      source.height,
      look,
      kind: sdf ? 1 : 2,
      linear: linear,
      within: clip,
    );
    return true;
  }

  @override
  bool get loading => false;

  /// Whether no layer's run of quads holds an icon after a glyph, so the
  /// quads are drawn in the order they were queued.
  bool _inDrawOrder() {
    for (var q = 1; q < _count; q++) {
      if (_icons[q] == 1 &&
          _icons[q - 1] == 0 &&
          _layers[q] == _layers[q - 1]) {
        return false;
      }
    }
    return true;
  }

  /// The quads' buffers, one for each frame the GPU may still be drawing,
  /// grown as text needs, so a frame's quads are written into one rather
  /// than a buffer made for them.
  final List<(gpu.DeviceBuffer, int)?> _quadBuffers = List.filled(
    framesInFlight,
    null,
  );
  int _nextQuadBuffer = 0;

  gpu.DeviceBuffer _quadBuffer(Float32List quads) {
    final i = _nextQuadBuffer;
    _nextQuadBuffer = (i + 1) % framesInFlight;
    var held = _quadBuffers[i];
    if (held == null || held.$2 < quads.lengthInBytes) {
      final size = math.max(quads.lengthInBytes, (held?.$2 ?? 1 << 15) * 2);
      held = _quadBuffers[i] = (
        gpu.createGeometryBuffers(size, 0).vertex,
        size,
      );
    }
    gpu.writeGeometryData(held.$1, quads, destinationOffsetInBytes: 0);
    return held.$1;
  }

  /// Where text drawn apart from the map goes on the web, as a page
  /// element of its own; null to lay it on the canvas.
  FramePlanes? _planes;

  /// The map's pass this frame's text is drawn in, over the map, rather
  /// than into an image of its own.
  TextPass? _into;

  /// Text drawn into a texture of its own while its map waits to be laid
  /// down, handed to the page after it by [layKept].
  gpu.Texture? _kept;

  /// Starts a frame whose text is drawn apart from the map, in [planes] on
  /// the web, unless [drawInto] gives it the map's pass.
  void aimApart(FramePlanes? planes) {
    _planes = planes;
    _into = null;
  }

  /// Has this frame's text drawn in [pass], the map's, over the map.
  void drawInto(TextPass pass) => _into = pass;

  @override
  ui.Canvas layKept(ui.Canvas canvas) => _guard(canvas, () => _layKept(canvas));

  ui.Canvas _layKept(ui.Canvas canvas) {
    final kept = _kept, planes = _planes;
    _kept = null;
    if (kept == null || planes == null) return canvas;
    return planes.hand([(gpu.gpuHost.page!.bitmap(kept), 1)], null);
  }

  _TextGoes _goes(bool drawnBelow) {
    final into = _into;
    if (_count == 0 || !ready || (into != null && into.sent)) {
      return _TextGoes.nowhere;
    }
    // Over an icon drawn on the canvas, the text cannot go into the map,
    // which is laid down under the canvas.
    if (into != null && !drawnBelow) return _TextGoes.intoMap;
    if (_planes == null) return _TextGoes.onCanvas;
    return into == null ? _TextGoes.inPage : _TextGoes.inPageAfterMap;
  }

  @override
  ui.Canvas end(ui.Canvas canvas, {bool drawnBelow = false}) =>
      _guard(canvas, () => _end(canvas, drawnBelow));

  ui.Canvas _end(ui.Canvas canvas, bool drawnBelow) {
    switch (_goes(drawnBelow)) {
      case _TextGoes.nowhere:
        break;
      case _TextGoes.intoMap:
        final into = _into!;
        into.pass
          ..clearBindings()
          ..setDepthWriteEnable(false)
          ..setDepthCompareOperation(gpu.CompareFunction.always)
          ..setStencilConfig(gpu.StencilConfig());
        _draw(into.pass);
        into.pass.clearBindings();
        into.drawn = true;
      case _TextGoes.onCanvas:
        if (_drawApart() case (final own, final image)?) {
          _layOn(canvas, own, image);
        }
      case _TextGoes.inPage:
        if (_drawApart() case (final own, _)?) {
          return _planes!.hand([
            (gpu.gpuHost.page!.bitmap(own.texture), 1),
          ], null);
        }
      case _TextGoes.inPageAfterMap:
        _kept = _drawApart()?.$1.texture;
    }
    return canvas;
  }

  /// Draws the text into an image of its own, the next of [_targets]; null
  /// on a screen with no pixels.
  (PassTarget, ui.Image)? _drawApart() {
    final width = (_size.width * _dpr).round();
    final height = (_size.height * _dpr).round();
    if (width <= 0 || height <= 0) return null;
    final own = _ownTarget(width, height);
    final commands = gpu.gpuContext.createCommandBuffer();
    _draw(own.$1.begin(commands));
    commands.submit();
    return own;
  }

  /// Lays the text drawn in [own], shown by [image], on [canvas].
  void _layOn(ui.Canvas canvas, PassTarget own, ui.Image image) {
    var shown = image;
    if (kIsWeb) {
      _webCopy?.dispose();
      shown = _webCopy = own.texture.asImage();
    }
    canvas.drawImageRect(
      shown,
      ui.Rect.fromLTWH(
        0,
        0,
        own.texture.width.toDouble(),
        own.texture.height.toDouble(),
      ),
      ui.Offset.zero & _size,
      ui.Paint()..filterQuality = ui.FilterQuality.none,
    );
  }

  /// The next of [_targets], made again when the screen's size changed.
  (PassTarget, ui.Image) _ownTarget(int width, int height) {
    if (_targets.isNotEmpty &&
        (_targets.first.$1.texture.width != width ||
            _targets.first.$1.texture.height != height)) {
      for (final (_, image) in _targets) {
        image.dispose();
      }
      _targets.clear();
    }
    while (_targets.length < 3) {
      final texture = gpu.gpuContext.createTexture(
        gpu.StorageMode.devicePrivate,
        width,
        height,
        format: _device.color,
      );
      _targets.add((PassTarget(texture), texture.asImage()));
    }
    final target = _targets[_next];
    _next = (_next + 1) % _targets.length;
    return target;
  }

  /// Lets go of the images the text was drawn into.
  void dispose() {
    for (final (_, image) in _targets) {
      image.dispose();
    }
    _targets.clear();
    _webCopy?.dispose();
    _webCopy = null;
  }

  /// The quads in the order they are drawn, and each run of one layer's
  /// quads in them: its icons, then its text, as MapLibre draws a symbol
  /// layer. Quads are moved only when a layer queued an icon after its
  /// text.
  (Float32List, List<(int, int)>) _inRuns() {
    final runs = <(int, int)>[];
    if (_inDrawOrder()) {
      var start = 0;
      for (var q = 1; q <= _count; q++) {
        if (q < _count &&
            _layers[q] == _layers[start] &&
            _icons[q] == _icons[start]) {
          continue;
        }
        runs.add((start, q));
        start = q;
      }
      return (_vertices, runs);
    }
    var at = 0;
    for (var from = 0; from < _count;) {
      var to = from + 1;
      while (to < _count && _layers[to] == _layers[from]) {
        to++;
      }
      for (final icons in const [1, 0]) {
        final start = at;
        for (var q = from; q < to; q++) {
          if (_icons[q] != icons) continue;
          _ordered.setRange(
            at * _quadFloats,
            (at + 1) * _quadFloats,
            _vertices,
            q * _quadFloats,
          );
          at++;
        }
        if (at > start) runs.add((start, at));
      }
      from = to;
    }
    return (_ordered, runs);
  }

  /// Draws the quads queued in [pass]: each run's halos, then its ink.
  void _draw(gpu.RenderPass pass) {
    final atlas = _atlasTexture!;
    _atlas.send(atlas);
    final (quads, runs) = _inRuns();
    final host = _device.host;
    final buffer = _quadBuffer(
      Float32List.sublistView(quads, 0, _count * _quadFloats),
    );
    final sheet = _device.sprites.texture ?? _device.sprites.blank;
    final sheetImage = _device.sprites.image;
    pass
      ..bindPipeline(_pipeline!)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(overBlend)
      ..bindTexture(
        _glyphSlot!,
        atlas,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.linear,
          magFilter: gpu.MinMagFilter.linear,
          widthAddressMode: gpu.SamplerAddressMode.clampToEdge,
          heightAddressMode: gpu.SamplerAddressMode.clampToEdge,
        ),
      )
      ..bindTexture(
        _spriteSlot!,
        sheet,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
          widthAddressMode: gpu.SamplerAddressMode.clampToEdge,
          heightAddressMode: gpu.SamplerAddressMode.clampToEdge,
        ),
      );
    _frameInfo
      ..[0] = _size.width
      ..[1] = _size.height
      ..[2] = _dpr
      ..[4] = SdfAtlas.side.toDouble()
      ..[5] = SdfAtlas.side.toDouble()
      ..[6] = (sheetImage?.width ?? 1).toDouble()
      ..[7] = (sheetImage?.height ?? 1).toDouble();
    final ground = host.emplace(_groundBytes);
    void draw(int from, int to, double mode) {
      _frameInfo[3] = mode;
      final frame = host.emplace(_frameBytes);
      pass
        ..bindUniform(_frameSlot!, frame)
        ..bindUniform(_groundSlot!, ground)
        ..bindUniform(_fragmentFrameSlot!, frame)
        ..bindVertexBuffer(
          gpu.BufferView(_corners!, offsetInBytes: 0, lengthInBytes: 48),
        )
        ..bindVertexBuffer(
          gpu.BufferView(
            buffer,
            offsetInBytes: from * SdfQuad.bytes,
            lengthInBytes: (to - from) * SdfQuad.bytes,
          ),
          slot: 1,
        )
        ..draw(6, instanceCount: to - from);
    }

    for (final (from, to) in runs) {
      draw(from, to, 1);
      draw(from, to, 2);
    }
  }
}

/// Where a frame's text ends up.
enum _TextGoes {
  /// There is none, or the map's pass it is in has gone to the GPU.
  nowhere,

  /// In the map's pass, over the map.
  intoMap,

  /// In an image of its own, laid on the canvas.
  onCanvas,

  /// In a page element of its own, over a map already laid down.
  inPage,

  /// In a page element of its own, handed to the page once the map it
  /// covers is laid down.
  inPageAfterMap,
}

/// Glyph quads laid on the ground, as [SdfTextGpu] queues them.
class _KeptQuads implements KeptText {
  _KeptQuads(this._text, int glyphs)
    : _quads = Float32List(glyphs * SdfQuad.floats);

  final SdfTextGpu _text;
  final Float32List _quads;
  int _count = 0;

  @override
  bool add(
    int face,
    int codePoint,
    double x,
    double y,
    double tx,
    double ty,
    double pixel,
    SdfLook look,
  ) {
    final g = _text._glyphs?.glyph(face, codePoint);
    if (g == null) return false;
    final corner = _text._atlas.corner(face, codePoint, g);
    if (corner < 0) return g.bitmap.isEmpty;
    SdfQuad.onGround(
      _quads,
      _count++ * SdfQuad.floats,
      x,
      y,
      tx,
      ty,
      pixel,
      SdfTextGpu._quadLeft(g),
      SdfTextGpu._quadTop(g),
      (corner % SdfAtlas.side).toDouble(),
      (corner ~/ SdfAtlas.side).toDouble(),
      SdfTextGpu._quadWidth(g),
      SdfTextGpu._quadHeight(g),
      look,
    );
    return true;
  }

  @override
  void draw(double x, double y, double size, double opacity, int layer) =>
      _text._queueKept(this, x, y, size, opacity, layer);
}
