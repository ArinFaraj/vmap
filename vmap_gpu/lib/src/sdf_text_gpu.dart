part of 'gpu_map.dart';

/// Text from a style's glyph ranges drawn as MapLibre draws it: the
/// glyphs' distance fields packed into one atlas, each glyph a quad, its
/// edge and halo cut by MapLibre's `symbol_sdf` shader, into an image the
/// canvas lays where the labels go.
class _SdfTextGpu implements SdfText {
  _SdfTextGpu(this._map);

  final GpuMap _map;
  gpu.RenderPipeline? _pipeline;
  gpu.UniformSlot? _frameSlot, _fragmentFrameSlot, _glyphSlot;
  bool _failed = false;

  /// The atlas: one byte a texel, glyphs packed on shelves, each with a
  /// texel of empty space around it as MapLibre's glyph atlas pads them.
  static const _side = 2048;
  final Uint8List _texels = Uint8List(_side * _side);
  gpu.Texture? _atlas;
  bool _dirty = false;
  int _shelfX = 0, _shelfY = 0, _shelfH = 0;

  /// Each glyph's corner in the atlas by face and code point, or -1 for
  /// one with no ink.
  final Map<int, int> _placed = {};

  PbfGlyph? Function(int face, int codePoint) _lookup = _none;
  static PbfGlyph? _none(int face, int codePoint) => null;

  ui.Size _size = ui.Size.zero;
  double _dpr = 1;

  /// Six vertices a glyph, 16 floats a vertex.
  static const _floats = 16;
  Float32List _vertices = Float32List(6 * _floats * 256);
  int _count = 0;

  /// Where each run of glyphs drawn alike starts: its first glyph, and
  /// whether its halos are drawn apart from its glyphs.
  final List<(int, bool)> _runs = [];
  int _runLayer = -2;
  bool _runOverlap = false;

  final List<(gpu.Texture, ui.Image)> _targets = [];
  int _next = 0;
  final Float32List _frameInfo = Float32List(8);
  late final ByteData _frameBytes = ByteData.sublistView(_frameInfo);

  bool get ready {
    if (_pipeline != null) return true;
    if (_failed) return false;
    final library = _map._library;
    if (library == null || !_map._ready()) return false;
    final vertex = library['SdfVertex'], fragment = library['SdfFragment'];
    if (vertex == null || fragment == null) {
      _failed = true;
      return false;
    }
    try {
      _pipeline = gpu.gpuContext.createRenderPipeline(
        vertex,
        fragment,
        vertexLayout: const gpu.VertexLayout(
          buffers: [
            gpu.VertexBuffer(
              strideInBytes: _floats * 4,
              attributes: [
                gpu.VertexAttribute(
                  name: 'position',
                  format: gpu.VertexFormat.float32x2,
                ),
                gpu.VertexAttribute(
                  name: 'texel',
                  format: gpu.VertexFormat.float32x2,
                  offsetInBytes: 8,
                ),
                gpu.VertexAttribute(
                  name: 'ink',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 16,
                ),
                gpu.VertexAttribute(
                  name: 'halo',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 32,
                ),
                gpu.VertexAttribute(
                  name: 'params',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 48,
                ),
              ],
            ),
          ],
        ),
      );
      _frameSlot = vertex.getUniformSlot('SdfFrame');
      _fragmentFrameSlot = fragment.getUniformSlot('SdfFrame');
      _glyphSlot = fragment.getUniformSlot('glyphs');
      _atlas = gpu.gpuContext.createTexture(
        gpu.StorageMode.hostVisible,
        _side,
        _side,
        format: gpu.PixelFormat.r8UNormInt,
      );
      return true;
    } catch (e) {
      debugPrint('vmap_gpu: text is drawn by the canvas: $e');
      _pipeline = null;
      _failed = true;
      return false;
    }
  }

  @override
  void begin(
    ui.Size size,
    double devicePixelRatio,
    PbfGlyph? Function(int face, int codePoint) glyph,
  ) {
    _size = size;
    _dpr = devicePixelRatio;
    _lookup = glyph;
    _count = 0;
    _runs.clear();
    _runLayer = -2;
  }

  /// The atlas corner of [codePoint] of [face] as x plus y times the
  /// side, placing it the first time; -1 when it has no ink or is missing.
  int _corner(int face, int codePoint, PbfGlyph glyph) {
    final key = face << 21 | codePoint;
    final known = _placed[key];
    if (known != null) return known;
    if (glyph.bitmap.isEmpty) return _placed[key] = -1;
    const border = GlyphPbf.border;
    final w = glyph.width + 2 * border, h = glyph.height + 2 * border;
    if (_shelfX + w + 2 > _side) {
      _shelfX = 0;
      _shelfY += _shelfH;
      _shelfH = 0;
    }
    if (_shelfY + h + 2 > _side) return -1;
    final x = _shelfX, y = _shelfY;
    for (var row = 0; row < h; row++) {
      final from = row * w;
      _texels.setRange(
        (y + 1 + row) * _side + x + 1,
        (y + 1 + row) * _side + x + 1 + w,
        glyph.bitmap,
        from,
      );
    }
    _shelfX += w + 2;
    _shelfH = math.max(_shelfH, h + 2);
    _dirty = true;
    return _placed[key] = x + y * _side;
  }

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
    final g = _lookup(face, codePoint);
    if (g == null) return;
    final corner = _corner(face, codePoint, g);
    if (corner < 0) return;
    if (layer != _runLayer || look.overlap != _runOverlap) {
      _runs.add((_count, look.overlap));
      _runLayer = layer;
      _runOverlap = look.overlap;
    }
    // As MapLibre's getGlyphQuads: the quad covers the glyph's field and
    // its padding, from its left bearing less the border and the padding.
    const pad = GlyphPbf.border + 1;
    final u0 = g.left - pad.toDouble(), v0 = -g.top - pad.toDouble();
    final u1 = u0 + g.width + 2 * pad, v1 = v0 + g.height + 2 * pad;
    final tx = (corner % _side).toDouble(), ty = (corner ~/ _side).toDouble();
    final tw = g.width + 2 * pad.toDouble(), th = g.height + 2 * pad.toDouble();
    if ((_count + 1) * 6 * _floats > _vertices.length) {
      _vertices = Float32List(_vertices.length * 2)
        ..setRange(0, _count * 6 * _floats, _vertices);
    }
    var o = _count * 6 * _floats;
    final ink = look.ink, halo = look.halo;
    void put(double u, double v, double s, double t) {
      final out = _vertices;
      out
        ..[o] = ox + u * ax + v * bx
        ..[o + 1] = oy + u * ay + v * by
        ..[o + 2] = tx + s
        ..[o + 3] = ty + t
        ..[o + 4] = ink[0]
        ..[o + 5] = ink[1]
        ..[o + 6] = ink[2]
        ..[o + 7] = ink[3]
        ..[o + 8] = halo?[0] ?? 0
        ..[o + 9] = halo?[1] ?? 0
        ..[o + 10] = halo?[2] ?? 0
        ..[o + 11] = halo?[3] ?? 0
        ..[o + 12] = look.haloWidth
        ..[o + 13] = look.haloBlur
        ..[o + 14] = look.fontScale
        ..[o + 15] = look.gammaScale;
      o += _floats;
    }

    put(u0, v0, 0, 0);
    put(u1, v0, tw, 0);
    put(u1, v1, tw, th);
    put(u0, v0, 0, 0);
    put(u1, v1, tw, th);
    put(u0, v1, 0, th);
    _count++;
  }

  @override
  bool end(ui.Canvas canvas) {
    if (_count == 0 || !ready) return false;
    final width = (_size.width * _dpr).round();
    final height = (_size.height * _dpr).round();
    if (width <= 0 || height <= 0) return false;
    if (_targets.isNotEmpty &&
        (_targets.first.$1.width != width ||
            _targets.first.$1.height != height)) {
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
        format: _map._color,
      );
      _targets.add((texture, texture.asImage()));
    }
    final (target, image) = _targets[_next];
    _next = (_next + 1) % _targets.length;
    if (_dirty) {
      _atlas!.overwrite(ByteData.sublistView(_texels));
      _dirty = false;
    }
    final host = _map._host!;
    final buffer = gpu.gpuContext.createDeviceBufferWithCopy(
      ByteData.sublistView(_vertices, 0, _count * 6 * _floats),
    );
    final commands = gpu.gpuContext.createCommandBuffer();
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        gpu.ColorAttachment(texture: target, clearValue: Vector4.zero()),
      ),
    );
    pass
      ..bindPipeline(_pipeline!)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(GpuMap._over)
      ..bindVertexBuffer(
        gpu.BufferView(
          buffer,
          offsetInBytes: 0,
          lengthInBytes: _count * 6 * _floats * 4,
        ),
      )
      ..bindTexture(
        _glyphSlot!,
        _atlas!,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.linear,
          magFilter: gpu.MinMagFilter.linear,
          widthAddressMode: gpu.SamplerAddressMode.clampToEdge,
          heightAddressMode: gpu.SamplerAddressMode.clampToEdge,
        ),
      );
    _frameInfo
      ..[0] = _size.width
      ..[1] = _size.height
      ..[2] = _dpr
      ..[4] = _side.toDouble()
      ..[5] = _side.toDouble();
    void draw(int from, int to, double mode) {
      _frameInfo[3] = mode;
      final frame = host.emplace(_frameBytes);
      pass
        ..bindUniform(_frameSlot!, frame)
        ..bindUniform(_fragmentFrameSlot!, frame)
        ..bindVertexBuffer(
          gpu.BufferView(
            buffer,
            offsetInBytes: from * 6 * _floats * 4,
            lengthInBytes: (to - from) * 6 * _floats * 4,
          ),
        )
        ..draw((to - from) * 6);
    }

    // As MapLibre draws a layer's text: halo and glyph at once, or every
    // halo before every glyph when halos are wide or letters overlap.
    for (var r = 0; r < _runs.length; r++) {
      final (from, overlap) = _runs[r];
      final to = r + 1 < _runs.length ? _runs[r + 1].$1 : _count;
      if (overlap) {
        draw(from, to, 1);
        draw(from, to, 2);
      } else {
        draw(from, to, 3);
      }
    }
    commands.submit();
    canvas.drawImageRect(
      image,
      ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()),
      ui.Offset.zero & _size,
      ui.Paint()..filterQuality = ui.FilterQuality.none,
    );
    return false;
  }
}
