import 'dart:math' as math;

import 'package:flutter/foundation.dart';

import '../text/glyphs/glyph_pbf.dart';
import '../text/glyphs/glyph_table.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// The glyphs' distance fields in one atlas: one byte a texel, glyphs
/// packed on shelves, each with a texel of empty space around it as
/// MapLibre's glyph atlas pads them.
class SdfAtlas {
  static const side = 2048;

  /// The atlas's one channel is alpha on native: Flutter's OpenGL ES
  /// backend shows nothing of a red one on an Adreno 650, and Metal,
  /// Vulkan and OpenGL ES all read an alpha one in alpha. The web has red
  /// only. [channel] is which of red, green, blue and alpha a shader reads
  /// a distance from.
  static const _format = kIsWeb
      ? gpu.PixelFormat.r8UNormInt
      : gpu.PixelFormat.a8UNormInt;
  static const channel = kIsWeb ? 0 : 3;

  final Uint8List _texels = Uint8List(side * side);

  /// The rows of [_texels] written since they were last sent.
  int _dirtyTop = side, _dirtyBottom = 0;
  int _shelfX = 0, _shelfY = 0, _shelfH = 0;

  /// Each glyph's corner by face and code point, or -1 for one with no
  /// ink.
  final GlyphTable<int> _placed = GlyphTable();

  /// A texture the size of the atlas, which [send] fills.
  gpu.Texture createTexture() => gpu.gpuContext.createTexture(
    gpu.StorageMode.hostVisible,
    side,
    side,
    format: _format,
  );

  /// The corner of [codePoint] of [face] as x plus y times the side,
  /// placing it the first time; -1 when it has no ink or does not fit.
  int corner(int face, int codePoint, PbfGlyph glyph) {
    final known = _placed.at(face, codePoint);
    if (known != null) return known;
    if (glyph.bitmap.isEmpty) {
      _placed.put(face, codePoint, -1);
      return -1;
    }
    const border = GlyphPbf.border;
    final w = glyph.width + 2 * border, h = glyph.height + 2 * border;
    if (_shelfX + w + 2 > side) {
      _shelfX = 0;
      _shelfY += _shelfH;
      _shelfH = 0;
    }
    if (_shelfY + h + 2 > side) return -1;
    final x = _shelfX, y = _shelfY;
    for (var row = 0; row < h; row++) {
      final to = (y + 1 + row) * side + x + 1;
      _texels.setRange(to, to + w, glyph.bitmap, row * w);
    }
    _shelfX += w + 2;
    _shelfH = math.max(_shelfH, h + 2);
    _dirtyTop = math.min(_dirtyTop, y);
    _dirtyBottom = math.max(_dirtyBottom, y + h + 2);
    final corner = x + y * side;
    _placed.put(face, codePoint, corner);
    return corner;
  }

  /// Sends [texture] the rows written since the atlas was last sent.
  void send(gpu.Texture texture) {
    if (_dirtyBottom <= _dirtyTop) return;
    gpu.overwriteTextureRows(
      texture,
      ByteData.sublistView(_texels),
      top: _dirtyTop,
      rows: math.min(_dirtyBottom, side) - _dirtyTop,
    );
    _dirtyTop = side;
    _dirtyBottom = 0;
  }
}
