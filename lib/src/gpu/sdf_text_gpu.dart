import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:vector_math/vector_math.dart' show Vector4;

import '../labels/sdf_text.dart';
import '../render/frame_planes.dart';
import '../text/glyphs/glyph_pbf.dart';
import 'gpu_buffers.dart' show framesInFlight;
import 'gpu_device.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// Text from a style's glyph ranges drawn as MapLibre draws it: the
/// glyphs' distance fields packed into one atlas, each glyph a quad, its
/// edge and halo cut by MapLibre's `symbol_sdf` shader, into an image the
/// canvas lays where the labels go.
class SdfTextGpu implements SdfText {
  SdfTextGpu(this._device, this._library);

  final GpuDevice _device;
  final gpu.ShaderLibrary _library;
  gpu.RenderPipeline? _pipeline;
  gpu.UniformSlot? _frameSlot, _fragmentFrameSlot, _glyphSlot, _spriteSlot;
  bool _failed = false;

  /// The atlas: one byte a texel, glyphs packed on shelves, each with a
  /// texel of empty space around it as MapLibre's glyph atlas pads them.
  static const _side = 2048;
  final Uint8List _texels = Uint8List(_side * _side);
  gpu.Texture? _atlas;
  bool _dirty = false;

  /// The rows of [_texels] written since the atlas was last sent.
  int _dirtyTop = _side, _dirtyBottom = 0;
  int _shelfX = 0, _shelfY = 0, _shelfH = 0;

  /// Each glyph's corner in the atlas by face and code point, or -1 for
  /// one with no ink.
  final Map<int, int> _placed = {};

  PbfGlyph? Function(int face, int codePoint) _lookup = _none;
  static PbfGlyph? _none(int face, int codePoint) => null;

  ui.Size _size = ui.Size.zero;
  double _dpr = 1;

  /// One instance a quad, 28 floats, drawn over the six corners of
  /// [_corners].
  static const _quadFloats = 28;
  gpu.DeviceBuffer? _corners;
  Float32List _vertices = Float32List(_quadFloats * 256);
  Float32List _ordered = Float32List(_quadFloats * 256);
  int _count = 0;

  /// Each quad's style layer, whether it is an icon, and whether its halo
  /// is drawn apart from its fill.
  Int32List _layers = Int32List(256);
  Uint8List _icons = Uint8List(256);
  Uint8List _overlaps = Uint8List(256);

  final List<(gpu.Texture, ui.Image)> _targets = [];

  /// On the web a texture's image is a copy taken when it is asked for:
  /// the last frame's copy, let go when the next one is taken.
  ui.Image? _webCopy;
  int _next = 0;
  final Float32List _frameInfo = Float32List(8);
  late final ByteData _frameBytes = ByteData.sublistView(_frameInfo);

  bool get ready {
    if (_pipeline != null) return true;
    if (_failed) return false;
    final library = _library;
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
              strideInBytes: 8,
              attributes: [
                gpu.VertexAttribute(
                  name: 'corner',
                  format: gpu.VertexFormat.float32x2,
                ),
              ],
            ),
            gpu.VertexBuffer(
              strideInBytes: _quadFloats * 4,
              stepMode: gpu.VertexStepMode.instance,
              attributes: [
                gpu.VertexAttribute(
                  name: 'placement',
                  format: gpu.VertexFormat.float32x4,
                ),
                gpu.VertexAttribute(
                  name: 'axes',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 16,
                ),
                gpu.VertexAttribute(
                  name: 'extent',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 32,
                ),
                gpu.VertexAttribute(
                  name: 'ink',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 48,
                ),
                gpu.VertexAttribute(
                  name: 'halo',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 64,
                ),
                gpu.VertexAttribute(
                  name: 'params',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 80,
                ),
                gpu.VertexAttribute(
                  name: 'clip',
                  format: gpu.VertexFormat.float32x4,
                  offsetInBytes: 96,
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
      _spriteSlot = fragment.getUniformSlot('sprites');
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
      _device.fail(e);
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
    _dirtyTop = math.min(_dirtyTop, y);
    _dirtyBottom = math.max(_dirtyBottom, y + h + 2);
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
    // As MapLibre's getGlyphQuads: the quad covers the glyph's field and
    // its padding, from its left bearing less the border and the padding.
    const pad = GlyphPbf.border + 1;
    final u0 = g.left - pad.toDouble(), v0 = -g.top - pad.toDouble();
    final tw = g.width + 2 * pad.toDouble(), th = g.height + 2 * pad.toDouble();
    final tx = (corner % _side).toDouble(), ty = (corner ~/ _side).toDouble();
    _quad(
      ox + u0 * ax + v0 * bx,
      oy + u0 * ay + v0 * by,
      ax,
      ay,
      bx,
      by,
      tx,
      ty,
      tw,
      th,
      look,
      layer,
      kind: 0,
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
    _quad(
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
      layer,
      kind: sdf ? 1 : 2,
      linear: linear,
      clip: clip,
    );
    return true;
  }

  /// Queues a quad from [ox], [oy] spanning [tw] texels by [ax], [ay] and
  /// [th] texels by [bx], [by], sampling from texel [tx], [ty].
  void _quad(
    double ox,
    double oy,
    double ax,
    double ay,
    double bx,
    double by,
    double tx,
    double ty,
    double tw,
    double th,
    SdfLook look,
    int layer, {
    required int kind,
    bool linear = true,
    ui.Rect clip = ui.Rect.zero,
  }) {
    if ((_count + 1) * _quadFloats > _vertices.length) {
      _vertices = Float32List(_vertices.length * 2)
        ..setRange(0, _count * _quadFloats, _vertices);
      _ordered = Float32List(_vertices.length);
      _layers = Int32List(_layers.length * 2)..setRange(0, _count, _layers);
      _icons = Uint8List(_icons.length * 2)..setRange(0, _count, _icons);
      _overlaps = Uint8List(_overlaps.length * 2)
        ..setRange(0, _count, _overlaps);
    }
    _layers[_count] = layer;
    _icons[_count] = kind > 0 ? 1 : 0;
    _overlaps[_count] = look.overlap ? 1 : 0;
    final o = _count * _quadFloats;
    final ink = look.ink, halo = look.halo;
    _vertices
      ..[o] = ox
      ..[o + 1] = oy
      ..[o + 2] = tx
      ..[o + 3] = ty
      ..[o + 4] = tw * ax
      ..[o + 5] = tw * ay
      ..[o + 6] = th * bx
      ..[o + 7] = th * by
      ..[o + 8] = tw
      ..[o + 9] = th
      ..[o + 10] = kind.toDouble()
      ..[o + 11] = linear ? 1 : 0
      ..[o + 12] = ink[0]
      ..[o + 13] = ink[1]
      ..[o + 14] = ink[2]
      ..[o + 15] = ink[3]
      ..[o + 16] = halo?[0] ?? 0
      ..[o + 17] = halo?[1] ?? 0
      ..[o + 18] = halo?[2] ?? 0
      ..[o + 19] = halo?[3] ?? 0
      ..[o + 20] = look.haloWidth
      ..[o + 21] = look.haloBlur
      ..[o + 22] = look.fontScale
      ..[o + 23] = look.gammaScale
      ..[o + 24] = clip.left
      ..[o + 25] = clip.top
      ..[o + 26] = clip.right
      ..[o + 27] = clip.bottom;
    _count++;
  }

  @override
  bool get loading => false;

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

  /// Where the text goes on the web, as a page element of its own; null
  /// to draw it on the canvas.
  FramePlanes? planes;

  /// The map's texture this frame's text is drawn into, over the map,
  /// rather than into an image of its own; set for each frame.
  gpu.Texture? into;

  /// Whether this frame's text is in the image shown already, the last
  /// frame's shown again, so none is drawn; set for each frame.
  bool inShown = false;

  /// Whether this frame's text went into [into].
  bool drewInto = false;

  /// Text drawn into a texture of its own while its map waits to be laid
  /// down, handed to the page after it by [layKept].
  gpu.Texture? _kept;

  @override
  ui.Canvas layKept(ui.Canvas canvas) {
    final kept = _kept, planes = this.planes;
    _kept = null;
    if (kept == null || planes == null) return canvas;
    return planes.hand([(gpu.gpuHost.textureToBitmap(kept)!, 1)], null);
  }

  @override
  ui.Canvas end(ui.Canvas canvas, {bool drawnBelow = false}) {
    if (_count == 0 || !ready || inShown) return canvas;
    final width = (_size.width * _dpr).round();
    final height = (_size.height * _dpr).round();
    if (width <= 0 || height <= 0) return canvas;
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
        format: _device.color,
      );
      _targets.add((texture, texture.asImage()));
    }
    // Over an icon drawn on the canvas, the text cannot go into the map,
    // which is laid down under the canvas.
    final into = drawnBelow ? null : this.into;
    final (own, image) = _targets[_next];
    if (into == null) _next = (_next + 1) % _targets.length;
    final target = into ?? own;
    if (_dirty) {
      gpu.overwriteTextureRows(
        _atlas!,
        ByteData.sublistView(_texels),
        top: _dirtyTop,
        rows: math.min(_dirtyBottom, _side) - _dirtyTop,
      );
      _dirty = false;
      _dirtyTop = _side;
      _dirtyBottom = 0;
    }
    // Each run of one layer's quads: its icons, then its text, as
    // MapLibre draws a symbol layer, each part split where halos are
    // drawn apart from fills.
    final draws = <(int, int, bool)>[];
    var at = 0;
    for (var from = 0; from < _count;) {
      var to = from + 1;
      while (to < _count && _layers[to] == _layers[from]) {
        to++;
      }
      for (final icons in const [1, 0]) {
        var start = at;
        var overlap = false;
        for (var q = from; q < to; q++) {
          if (_icons[q] != icons) continue;
          final apart = _overlaps[q] == 1;
          if (at > start && apart != overlap) {
            draws.add((start, at, overlap));
            start = at;
          }
          overlap = apart;
          _ordered.setRange(
            at * _quadFloats,
            (at + 1) * _quadFloats,
            _vertices,
            q * _quadFloats,
          );
          at++;
        }
        if (at > start) draws.add((start, at, overlap));
      }
      from = to;
    }
    final host = _device.host;
    final buffer = _quadBuffer(
      Float32List.sublistView(_ordered, 0, _count * _quadFloats),
    );
    final commands = gpu.gpuContext.createCommandBuffer();
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        gpu.ColorAttachment(
          texture: target,
          loadAction: into == null ? gpu.LoadAction.clear : gpu.LoadAction.load,
          clearValue: Vector4.zero(),
        ),
      ),
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
        _atlas!,
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
      ..[4] = _side.toDouble()
      ..[5] = _side.toDouble()
      ..[6] = (sheetImage?.width ?? 1).toDouble()
      ..[7] = (sheetImage?.height ?? 1).toDouble();
    void draw(int from, int to, double mode) {
      _frameInfo[3] = mode;
      final frame = host.emplace(_frameBytes);
      pass
        ..bindUniform(_frameSlot!, frame)
        ..bindUniform(_fragmentFrameSlot!, frame)
        ..bindVertexBuffer(
          gpu.BufferView(_corners!, offsetInBytes: 0, lengthInBytes: 48),
        )
        ..bindVertexBuffer(
          gpu.BufferView(
            buffer,
            offsetInBytes: from * _quadFloats * 4,
            lengthInBytes: (to - from) * _quadFloats * 4,
          ),
          slot: 1,
        )
        ..draw(6, instanceCount: to - from);
    }

    // As MapLibre draws a symbol layer: halo and fill at once, or every
    // halo before every fill when halos are wide or letters overlap.
    for (final (from, to, overlap) in draws) {
      if (overlap) {
        draw(from, to, 1);
        draw(from, to, 2);
      } else {
        draw(from, to, 3);
      }
    }
    commands.submit();
    if (into != null) {
      drewInto = true;
      return canvas;
    }
    if (this.into != null && planes != null) {
      _kept = own;
      return canvas;
    }
    if (planes case final planes?) {
      return planes.hand([(gpu.gpuHost.textureToBitmap(target)!, 1)], null);
    }
    var shown = image;
    if (kIsWeb) {
      _webCopy?.dispose();
      shown = _webCopy = target.asImage();
    }
    canvas.drawImageRect(
      shown,
      ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()),
      ui.Offset.zero & _size,
      ui.Paint()..filterQuality = ui.FilterQuality.none,
    );
    return canvas;
  }
}
