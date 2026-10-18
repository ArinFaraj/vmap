import 'dart:math' as math;
import 'dart:typed_data';

import 'package:payv/payv.dart';

import 'glyph_layout.dart';
import '../format.dart';
import 'glyph_pbf.dart';

/// One run of a formatted label as the glyph ranges lay it out: the face
/// its glyphs come from, its size against the label's, its colour or
/// null for the label's own, and how a smaller run sits on its line, 0 at
/// the top, 0.5 in the middle and 1, MapLibre's default, at the bottom.
typedef RangeSection = ({int face, double scale, int? color, double align});

/// Lays [text] out with the glyphs [glyphOf] finds, as MapLibre's
/// `shaping.ts` does for glyph range fonts: each glyph placed by its
/// advance, as the [face] the cells are drawn from, lines
/// [lineHeight] ems apart, broken to about [maxWidth] ems as
/// `tagged_string.ts` breaks them, each justified by [justify] (-1 left,
/// 0 centre, 1 right). [letterSpacing] is in ems. Glyphs the ranges lack
/// are left out. Breaks between ideographs are not taken yet.
///
/// With [sections], [text] is a formatted label as [labelText] writes it:
/// each run opened by its section's mark, laid out in that section's face
/// and size, its line as tall as its largest run.
///
/// The result's origins are MapLibre's glyph positions, which the cells
/// [GlyphRasterizer] draws for these faces are placed against.
ShapedText? layoutRanges(
  PbfGlyph? Function(int face, int codePoint) glyphOf,
  int face,
  String text, {
  double letterSpacing = 0,
  double lineHeight = 1.2,
  int justify = 0,
  double maxWidth = double.infinity,
  List<RangeSection>? sections,
  (double, double)? Function(int section)? imageSize,
  double textSize = 16,
}) {
  const em = GlyphPbf.em;
  const shapingOffset = -17.0;
  final spacing = letterSpacing * em;
  final lineStep = lineHeight * em;
  final share = (justify + 1) / 2;
  final codes = <int>[];
  final runOf = <int>[];
  var run = -1;
  final runes = text.runes.toList();
  for (var i = 0; i < runes.length; i++) {
    if (runes[i] == formatMark && i + 1 < runes.length) {
      run = runes[++i] - formatIndexBase;
      continue;
    }
    codes.add(runes[i]);
    runOf.add(run);
  }
  RangeSection? sectionOf(int run) =>
      sections == null || run < 0 || run >= sections.length
      ? null
      : sections[run];
  int faceOf(int run) => sectionOf(run)?.face ?? face;
  double scaleOf(int run) => sectionOf(run)?.scale ?? 1;
  // As MapLibre, an image's size goes by its own pixels, not the text's:
  // a shaping unit of an image is its section scale over the text size.
  final perImagePixel = em / textSize;
  (double, double)? imageAt(int i) =>
      codes[i] == formatImage ? imageSize?.call(runOf[i]) : null;
  double advanceAt(int i) {
    if (imageAt(i) case (final w, _)) {
      return w * scaleOf(runOf[i]) * perImagePixel;
    }
    final g = glyphOf(faceOf(runOf[i]), codes[i]);
    return g == null ? 0 : g.advance * scaleOf(runOf[i]);
  }

  final breaks = mapLibreLineBreaks(
    codes,
    (i) => advanceAt(i) + spacing,
    maxWidth * em,
    spacing: spacing,
  );
  final placed = <List<double>>[];
  final scales = <double>[];
  final colors = <int>[];
  var scaled = false;
  var maxLength = 0.0;
  var y = 0.0;
  var from = 0;
  for (final to in breaks) {
    var start = from, end = to;
    while (start < end && _trimmed(codes[start])) {
      start++;
    }
    while (end > start && _trimmed(codes[end - 1])) {
      end--;
    }
    from = to;
    // As MapLibre's getMaxScale: the largest run on the line.
    var lineScale = start < end ? 0.0 : 1.0;
    for (var i = start; i < end; i++) {
      lineScale = math.max(lineScale, scaleOf(runOf[i]));
    }
    // MapLibre's calculateLineContentSize and image offset: a line is as
    // tall as its largest run or image, and an image taller than an em of
    // it pushes the next line down.
    var tallestImage = 0.0, imageOffset = 0.0;
    for (var i = start; i < end; i++) {
      if (imageAt(i) case (_, final h)) {
        tallestImage = math.max(tallestImage, h);
        imageOffset = math.max(
          imageOffset,
          h * scaleOf(runOf[i]) * perImagePixel - em * lineScale,
        );
      }
    }
    final content = math.max(lineScale * em, tallestImage * perImagePixel);
    if (lineScale != 1 || imageOffset > 0) scaled = true;
    final glyphs = <double>[];
    var x = 0.0;
    for (final k in _visualIndices(codes.sublist(start, end))) {
      final i = start + k;
      final c = codes[i];
      final r = runOf[i];
      final section = sectionOf(r);
      final align = section?.align ?? 1;
      if (imageAt(i) case (final w, final h)) {
        final s = scaleOf(r) * perImagePixel;
        glyphs.addAll([
          -1,
          r.toDouble(),
          x,
          y + shapingOffset + (content - h * s) * align,
          w * s,
        ]);
        scales.add(s);
        colors.add(0);
        x += w * s + spacing;
        continue;
      }
      final g = glyphOf(faceOf(r), c);
      if (g == null) continue;
      final scale = scaleOf(r);
      final lift = (content - scale * em) * align;
      glyphs.addAll([
        faceOf(r).toDouble(),
        c.toDouble(),
        x,
        y + shapingOffset + lift,
        g.advance * scale,
      ]);
      scales.add(scale);
      colors.add(section?.color ?? 0);
      x += g.advance * scale + spacing;
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
    y += lineStep * lineScale + imageOffset;
  }
  if (placed.every((l) => l.isEmpty)) return null;
  final shiftX = (share - 0.5) * maxLength;
  // As MapLibre's align: lines of one height are centred by their count,
  // a block with taller lines by its height.
  final shiftY = scaled
      ? -0.5 * y - shapingOffset
      : -0.5 * placed.length * lineStep + 0.5 * lineStep;
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
    placed.length,
    sections == null ? null : Float32List.fromList(scales),
    sections == null ? null : Int32List.fromList(colors),
  );
}

const _breakAfter = {
  0x0a, 0x0d, 0x20, 0x26, 0x29, 0x2b, 0x2d, 0x2f, 0xad, 0xb7, //
  0x200b, 0x2010, 0x2013, 0x2027,
};

/// What Dart's `String.trim` takes off the ends of a line.
bool _trimmed(int c) =>
    _whitespace(c) ||
    c == 0x85 ||
    c == 0xA0 ||
    c == 0x1680 ||
    (c >= 0x2000 && c <= 0x200A) ||
    c == 0x2028 ||
    c == 0x2029 ||
    c == 0x202F ||
    c == 0x205F ||
    c == 0x3000 ||
    c == 0xFEFF;

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

/// Where in [codes], one line, each character drawn is, left to right: runs of
/// right-to-left text reversed by the Unicode bidi algorithm, as MapLibre
/// orders a line after breaking the text into lines. The characters that
/// only steer the ordering are dropped, as no font draws them.
List<int> _visualIndices(List<int> codes) {
  if (!codes.any((c) => c >= 0x0590 && c <= 0x08FF || c >= 0xFB1D)) {
    return [
      for (var i = 0; i < codes.length; i++)
        if (!_bidiControl(codes[i])) i,
    ];
  }
  final out = <int>[];
  for (final run in Bidi.resolve(codes).visualRuns) {
    final order = [for (var i = run.start; i < run.end; i++) i];
    for (final i in run.level.isOdd ? order.reversed : order) {
      if (!_bidiControl(codes[i])) out.add(i);
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
