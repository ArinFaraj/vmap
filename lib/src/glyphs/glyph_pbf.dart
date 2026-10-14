import 'dart:typed_data';

/// One glyph of a MapLibre glyph range: a one channel signed distance field
/// drawn at [GlyphPbf.em] pixels to the em with [GlyphPbf.border] pixels
/// of margin, and its metrics in those pixels.
class PbfGlyph {
  const PbfGlyph(
    this.id,
    this.bitmap,
    this.width,
    this.height,
    this.left,
    this.top,
    this.advance,
  );

  /// The Unicode code point.
  final int id;

  /// `(width + 2 * border) * (height + 2 * border)` bytes, 192 on the
  /// glyph's edge; empty for a glyph with no ink, such as a space.
  final Uint8List bitmap;
  final int width, height, left, top, advance;
}

/// MapLibre's glyph ranges: 256 code points of one font stack per file,
/// at `{fontstack}/{start}-{end}.pbf` under a style's `glyphs` URL.
abstract final class GlyphPbf {
  static const em = 24;
  static const border = 3;

  /// The face number of the first glyph range font stack; faces below it
  /// are font files.
  static const firstFace = 512;

  /// The file name of the range holding [codePoint].
  static String range(int codePoint) {
    final start = codePoint ~/ 256 * 256;
    return '$start-${start + 255}';
  }

  /// The glyphs of one range file.
  static List<PbfGlyph> parse(Uint8List data) {
    final out = <PbfGlyph>[];
    final top = _Reader(data, 0, data.length);
    while (top.more) {
      final (field, wire) = top.key();
      if (field == 1 && wire == 2) {
        final stack = top.message();
        while (stack.more) {
          final (f, w) = stack.key();
          if (f == 3 && w == 2) {
            out.add(_glyph(stack.message()));
          } else {
            stack.skip(w);
          }
        }
      } else {
        top.skip(wire);
      }
    }
    return out;
  }

  static PbfGlyph _glyph(_Reader r) {
    var id = 0, width = 0, height = 0, left = 0, top = 0, advance = 0;
    var bitmap = Uint8List(0);
    while (r.more) {
      final (field, wire) = r.key();
      switch (field) {
        case 1:
          id = r.varint();
        case 2:
          bitmap = r.bytes();
        case 3:
          width = r.varint();
        case 4:
          height = r.varint();
        case 5:
          left = r.svarint();
        case 6:
          top = r.svarint();
        case 7:
          advance = r.varint();
        default:
          r.skip(wire);
      }
    }
    return PbfGlyph(id, bitmap, width, height, left, top, advance);
  }
}

class _Reader {
  _Reader(this.data, this.at, this.end);

  final Uint8List data;
  int at;
  final int end;

  bool get more => at < end;

  (int, int) key() {
    final k = varint();
    return (k >> 3, k & 7);
  }

  int varint() {
    var shift = 0, value = 0;
    while (true) {
      final b = data[at++];
      value |= (b & 0x7f) << shift;
      if (b < 0x80) return value;
      shift += 7;
    }
  }

  int svarint() {
    final v = varint();
    return (v >> 1) ^ -(v & 1);
  }

  Uint8List bytes() {
    final n = varint();
    final out = Uint8List.sublistView(data, at, at + n);
    at += n;
    return out;
  }

  _Reader message() {
    final n = varint();
    final r = _Reader(data, at, at + n);
    at += n;
    return r;
  }

  void skip(int wire) {
    switch (wire) {
      case 0:
        varint();
      case 1:
        at += 8;
      case 2:
        final n = varint();
        at += n;
      case 5:
        at += 4;
      default:
        throw FormatException('glyph pbf: wire type $wire');
    }
  }
}
