import 'dart:math' as math;
import 'dart:typed_data';

import 'package:payv/payv.dart';

import 'glyph_layout.dart';
import 'glyph_pbf.dart';

/// Lays [text] out with the glyphs [glyphOf] finds, as MapLibre's
/// `shaping.ts` does for glyph range fonts: each glyph placed by its
/// advance, as the [face] the cells are drawn from, lines
/// [lineHeight] ems apart, broken to about [maxWidth] ems as
/// `tagged_string.ts` breaks them, each justified by [justify] (-1 left,
/// 0 centre, 1 right). [letterSpacing] is in ems. Glyphs the ranges lack
/// are left out. Breaks between ideographs are not taken yet.
///
/// The result's origins are MapLibre's glyph positions, which the cells
/// [GlyphRasterizer] draws for these faces are placed against.
ShapedText? layoutRanges(
  PbfGlyph? Function(int codePoint) glyphOf,
  int face,
  String text, {
  double letterSpacing = 0,
  double lineHeight = 1.2,
  int justify = 0,
  double maxWidth = double.infinity,
}) {
  const em = GlyphPbf.em;
  const shapingOffset = -17.0;
  final spacing = letterSpacing * em;
  final lineStep = lineHeight * em;
  final share = (justify + 1) / 2;
  final codes = text.runes.toList();
  final breaks = mapLibreLineBreaks(
    codes,
    (i) {
      final g = glyphOf(codes[i]);
      return g == null ? 0 : g.advance + spacing;
    },
    maxWidth * em,
    spacing: spacing,
  );
  final lines = <String>[];
  var from = 0;
  for (final to in breaks) {
    lines.add(String.fromCharCodes(codes, from, to));
    from = to;
  }
  final placed = <List<double>>[];
  var maxLength = 0.0;
  var y = 0.0;
  for (final raw in lines) {
    final line = raw.trim();
    final glyphs = <double>[];
    var x = 0.0;
    for (final c in _visualOrder(line.runes.toList())) {
      final g = glyphOf(c);
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

const _breakAfter = {
  0x0a, 0x0d, 0x20, 0x26, 0x29, 0x2b, 0x2d, 0x2f, 0xad, 0xb7, //
  0x200b, 0x2010, 0x2013, 0x2027,
};

bool _whitespace(int c) => c == 0x20 || (c >= 0x09 && c <= 0x0d);

class _Break {
  _Break(this.index, this.x, this.prior, this.badness);

  final int index;
  final double x;
  final _Break? prior;
  final double badness;
}

/// Where [codes] break into lines no wider than about [maxWidth], in the
/// units of [advance], the width of the code at an index with its letter
/// [spacing]: each line's end, as `TaggedString.determineLineBreaks` finds
/// them.
List<int> mapLibreLineBreaks(
  List<int> codes,
  double Function(int index) advance,
  double maxWidth, {
  double spacing = 0,
}) {
  var total = 0.0;
  for (var i = 0; i < codes.length; i++) {
    total += advance(i);
  }
  final newline = codes.contains(0x0a) || codes.contains(0x0d);
  if (spacing >= 0 && total > 0 && total <= maxWidth && !newline) {
    return [codes.length];
  }
  final lineCount = maxWidth > 0 && maxWidth.isFinite
      ? (total / maxWidth).ceil()
      : 1;
  final target = total / math.max(1, lineCount);

  double badness(double width, double penalty, bool last) {
    final ragged = (width - target) * (width - target);
    if (last) return width < target ? ragged / 2 : ragged * 2;
    return ragged + penalty.abs() * penalty;
  }

  _Break evaluate(
    int index,
    double x,
    List<_Break> before,
    double penalty,
    bool last,
  ) {
    _Break? best;
    var least = badness(x, penalty, last);
    for (final b in before) {
      final score = badness(x - b.x, penalty, last) + b.badness;
      if (score <= least) {
        best = b;
        least = score;
      }
    }
    return _Break(index, x, best, least);
  }

  final candidates = <_Break>[];
  var x = 0.0;
  for (var i = 0; i < codes.length; i++) {
    final c = codes[i];
    if (i > 0) {
      final previous = codes[i - 1];
      if (_breakAfter.contains(previous) ||
          (i + 1 < codes.length && c == 0x28)) {
        var penalty = 0.0;
        if (previous == 0x0a || previous == 0x0d) penalty -= 10000;
        if (previous == 0x28 || previous == 0xff08) penalty += 50;
        if (c == 0x29 || c == 0xff09) penalty += 50;
        candidates.add(evaluate(i, x, candidates, penalty, false));
      }
    }
    if (!_whitespace(c)) x += advance(i);
  }
  final out = <int>[];
  for (
    _Break? b = evaluate(codes.length, x, candidates, 0, true);
    b != null;
    b = b.prior
  ) {
    out.insert(0, b.index);
  }
  return out;
}

/// One line's [codes] in the order they are drawn, left to right: runs of
/// right-to-left text reversed by the Unicode bidi algorithm, as MapLibre
/// orders a line after breaking the text into lines. The characters that
/// only steer the ordering are dropped, as no font draws them.
List<int> _visualOrder(List<int> codes) {
  if (!codes.any((c) => c >= 0x0590 && c <= 0x08FF || c >= 0xFB1D)) {
    return [
      for (final c in codes)
        if (!_bidiControl(c)) c,
    ];
  }
  final out = <int>[];
  for (final run in Bidi.resolve(codes).visualRuns) {
    final part = codes.sublist(run.start, run.end);
    for (final c in run.level.isOdd ? part.reversed : part) {
      if (!_bidiControl(c)) out.add(c);
    }
  }
  return out;
}

bool _bidiControl(int c) =>
    c == 0x061C ||
    c == 0x200E ||
    c == 0x200F ||
    (c >= 0x202A && c <= 0x202E) ||
    (c >= 0x2066 && c <= 0x2069);
