import 'dart:math' as math;
import 'dart:typed_data';

import '../net.dart';
import 'glyph_layout.dart';

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

/// The glyph ranges of a style's `glyphs` URL, fetched as labels need
/// them. Each font stack is a face from [GlyphPbf.firstFace] up.
class PbfStore {
  PbfStore(
    this.template, {
    required this.onLoaded,
    this.userAgent = 'vmap',
    this.headers = const {},
  });

  /// The style's `glyphs`, with `{fontstack}` and `{range}` in it.
  final String template;
  final String userAgent;
  final Map<String, String> headers;

  /// Called with each range as it arrives.
  final void Function(int face, List<PbfGlyph> glyphs) onLoaded;

  final List<String> _stacks = [];
  final Map<String, int> _faces = {};
  final List<Map<int, PbfGlyph>> _glyphs = [];
  final Set<int> _asked = {};
  final Set<int> _arrived = {};
  Net? _net;
  bool _closed = false;

  /// The face of the font stack [fonts].
  int face(List<String> fonts) {
    final name = fonts.join(',');
    return _faces.putIfAbsent(name, () {
      _stacks.add(name);
      _glyphs.add({});
      return GlyphPbf.firstFace + _stacks.length - 1;
    });
  }

  PbfGlyph? glyph(int face, int codePoint) =>
      _glyphs[face - GlyphPbf.firstFace][codePoint];

  /// Whether every range [text] needs in [face] has been answered, asking
  /// for those that have not. A range that failed counts as answered: its
  /// characters are left out, as MapLibre leaves them.
  bool ready(int face, String text) {
    var all = true;
    for (final c in text.runes) {
      final key = face << 16 | c >> 8;
      if (_arrived.contains(key)) continue;
      all = false;
      if (_asked.add(key)) _fetch(face, c >> 8, key);
    }
    return all;
  }

  Future<void> _fetch(int face, int block, int key) async {
    final url = template
        .replaceAll(
          '{fontstack}',
          Uri.encodeComponent(_stacks[face - GlyphPbf.firstFace]),
        )
        .replaceAll('{range}', '${block * 256}-${block * 256 + 255}');
    var glyphs = const <PbfGlyph>[];
    try {
      final reply = await (_net ??= Net(
        userAgent: userAgent,
      )).get(url, headers);
      if (reply.status == 200) glyphs = GlyphPbf.parse(reply.bytes);
    } catch (_) {}
    if (_closed) return;
    final known = _glyphs[face - GlyphPbf.firstFace];
    for (final g in glyphs) {
      known[g.id] = g;
    }
    _arrived.add(key);
    onLoaded(face, glyphs);
  }

  void close() {
    _closed = true;
    _net?.close();
  }
}

/// Lays [text] out in [face] of [store] the way MapLibre's `shaping.ts`
/// does for glyph range fonts: each glyph placed by its advance, lines
/// [lineHeight] ems apart, each justified by [justify] (-1 left, 0 centre,
/// 1 right). [letterSpacing] is in ems. Glyphs the ranges lack are left out.
///
/// The result's origins are MapLibre's glyph positions, which the cells
/// [GlyphRasterizer] draws for these faces are placed against.
ShapedText? layoutPbf(
  PbfStore store,
  int face,
  String text, {
  double letterSpacing = 0,
  double lineHeight = 1.2,
  int justify = 0,
}) {
  const em = GlyphPbf.em;
  const shapingOffset = -17.0;
  final spacing = letterSpacing * em;
  final lineStep = lineHeight * em;
  final share = (justify + 1) / 2;
  final lines = text.split(RegExp('[\n\r\u2028\u2029]'));
  final placed = <List<double>>[];
  var maxLength = 0.0;
  var y = 0.0;
  for (final raw in lines) {
    final line = raw.trim();
    final glyphs = <double>[];
    var x = 0.0;
    for (final c in line.runes) {
      final g = store.glyph(face, c);
      if (g == null) continue;
      glyphs.addAll([
        face.toDouble(),
        c.toDouble(),
        x,
        y + shapingOffset,
        g.advance.toDouble(),
      ]);
      x += g.advance + spacing;
    }
    if (glyphs.isNotEmpty) {
      maxLength = math.max(maxLength, x - spacing);
      final last = glyphs.length - 5;
      final indent = (glyphs[last + 2] + glyphs[last + 4]) * share;
      for (var i = 0; i < glyphs.length; i += 5) {
        glyphs[i + 2] -= indent;
      }
    }
    placed.add(glyphs);
    y += lineStep;
  }
  if (placed.every((l) => l.isEmpty)) return null;
  final shiftX = (share - 0.5) * maxLength;
  final shiftY = -0.5 * lines.length * lineStep + 0.5 * lineStep;
  final left = -0.5 * maxLength, top = -0.5 * y;
  final out = <double>[];
  for (final line in placed) {
    for (var i = 0; i < line.length; i += 5) {
      out.addAll([
        line[i],
        line[i + 1],
        (line[i + 2] + shiftX - left) / em,
        (line[i + 3] + shiftY - top) / em,
        line[i + 4] / em,
      ]);
    }
  }
  return ShapedText(
    Float32List.fromList(out),
    maxLength / em,
    y / em,
    lines.length,
  );
}
