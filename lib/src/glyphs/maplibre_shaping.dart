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
/// are left out.
///
/// With [sections], [text] is a formatted label as [labelText] writes it:
/// each run opened by its section's mark, laid out in that section's face
/// and size, its line as tall as its largest run.
///
/// The result's origins are MapLibre's glyph positions, which the cells
/// [GlyphRasterizer] draws for these faces are placed against.
///
/// [vertical] writes the text down the page as MapLibre writes a point
/// label vertically: punctuation takes its vertical forms, every glyph
/// stands upright an em below the last, lines run from right to left.
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
  bool vertical = false,
}) {
  const em = GlyphPbf.em;
  if (vertical) {
    text = verticalPunctuation(text);
    justify = -1;
  }
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

  // As MapLibre's shapeLines, a glyph written vertically stands upright
  // and takes an em whatever its width; whitespace and the scripts shaped
  // as words lie on their side and keep their own.
  bool uprightAt(int i) =>
      vertical &&
      imageAt(i) == null &&
      !_whitespace(codes[i]) &&
      !_shapedAsWords(codes[i]);
  double stepAt(int i, double advance) =>
      uprightAt(i) ? em * scaleOf(runOf[i]) : advance;

  final breaks = mapLibreLineBreaks(
    codes,
    (i) => advanceAt(i) + spacing,
    maxWidth * em,
    spacing: spacing,
  );
  final placed = <List<double>>[];
  final scales = <double>[];
  final colors = <int>[];
  final upright = <bool>[];
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
    for (final (k, mirror) in _visualIndices(codes.sublist(start, end))) {
      final i = start + k;
      final c = mirror ? _mirrored[codes[i]] ?? codes[i] : codes[i];
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
        upright.add(false);
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
      upright.add(uprightAt(i));
      x += stepAt(i, g.advance * scale) + spacing;
    }
    if (glyphs.isNotEmpty) {
      maxLength = math.max(maxLength, x - spacing);
      final indent = (x - spacing) * share;
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
  if (vertical) {
    // MapLibre's getGlyphQuads turns each upright glyph a quarter back
    // about the middle of its em box's left edge, and the label a quarter
    // on: the line runs down, its glyphs upright, the next line to the
    // left. Positions here are where those quads land.
    // One lying on its side is only turned with the label.
    final turns = Uint8List(out.length ~/ 5);
    for (var i = 0; i < out.length; i += 5) {
      final x = out[i + 2] * em, yy = out[i + 3] * em;
      if (!upright[i ~/ 5]) {
        turns[i ~/ 5] = 1;
        out[i + 2] = (y - yy) / em;
        out[i + 3] = x / em;
        continue;
      }
      final half = out[i + 4] * em / 2;
      out[i + 2] = (y - yy + shapingOffset - half) / em;
      out[i + 3] = (x - 7) / em;
    }
    return ShapedText(
      Float32List.fromList(out),
      y / em,
      maxLength / em,
      placed.length,
      sections == null ? null : Float32List.fromList(scales),
      sections == null ? null : Int32List.fromList(colors),
      turns,
    );
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
    return _atParagraphs(codes, [codes.length]);
  }
  // As MapLibre, a width of 0 asks for lines of no width: every break.
  final lineCount = maxWidth > 0 && maxWidth.isFinite
      ? (total / maxWidth).ceil()
      : 1;
  final target = maxWidth == 0 ? 0.0 : total / math.max(1, lineCount);

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
  final suggested = codes.contains(0x200b);
  var x = 0.0;
  for (var i = 0; i < codes.length; i++) {
    final c = codes[i];
    if (i > 0) {
      final previous = codes[i - 1];
      final ideographic = _breaksAfterIdeograph(previous);
      // As MapLibre's determineLineBreaks, a line may break after an image
      // and after an ideograph, which a zero width space in the text marks
      // as worse than the breaks it suggests.
      if (_breakAfter.contains(previous) ||
          ideographic ||
          previous == formatImage ||
          (i + 1 < codes.length && c == 0x28)) {
        var penalty = ideographic && suggested ? 150.0 : 0.0;
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
  return _atParagraphs(codes, out);
}

/// [breaks] with a line also ended at each paragraph separator when
/// [codes] has right-to-left letters, as MapLibre's bidi step ends one.
List<int> _atParagraphs(List<int> codes, List<int> breaks) {
  if (!codes.any(_rightToLeft)) return breaks;
  final ends = {...breaks};
  for (var i = 0; i + 1 < codes.length; i++) {
    if (_paragraphSeparator(codes[i])) ends.add(i + 1);
  }
  return ends.length == breaks.length ? breaks : (ends.toList()..sort());
}

bool _rightToLeft(int c) => c >= 0x0590 && c <= 0x08FF || c >= 0xFB1D;

/// The characters of bidi class B other than the newlines, which end a
/// paragraph in the Unicode bidi algorithm.
bool _paragraphSeparator(int c) =>
    c == 0x1C || c == 0x1D || c == 0x1E || c == 0x85 || c == 0x2029;

/// Where in [codes], one line, each character drawn is, left to right: runs of
/// right-to-left text reversed by the Unicode bidi algorithm, as MapLibre
/// orders a line after breaking the text into lines. The characters that
/// only steer the ordering are dropped, as no font draws them.
List<(int, bool)> _visualIndices(List<int> codes) {
  if (!codes.any(_rightToLeft)) {
    return [
      for (var i = 0; i < codes.length; i++)
        if (!_bidiControl(codes[i])) (i, false),
    ];
  }
  final out = <(int, bool)>[];
  for (final run in Bidi.resolve(codes).visualRuns) {
    final order = [for (var i = run.start; i < run.end; i++) i];
    final rtl = run.level.isOdd;
    for (final i in rtl ? order.reversed : order) {
      if (!_bidiControl(codes[i])) out.add((i, rtl));
    }
  }
  return out;
}

/// The characters Unicode draws mirrored in right-to-left text, each with
/// the one drawn in its place, as the bidi step of MapLibre's RTL plugin
/// mirrors them.
const _mirrorPairs = [
  (0x28, 0x29),
  (0x3C, 0x3E),
  (0x5B, 0x5D),
  (0x7B, 0x7D),
  (0xAB, 0xBB),
  (0x2039, 0x203A),
  (0x2045, 0x2046),
  (0x207D, 0x207E),
  (0x208D, 0x208E),
  (0x2264, 0x2265),
  (0x3008, 0x3009),
  (0x300A, 0x300B),
  (0x300C, 0x300D),
  (0x300E, 0x300F),
  (0x3010, 0x3011),
  (0xFF08, 0xFF09),
  (0xFF3B, 0xFF3D),
  (0xFF5B, 0xFF5D),
];
final _mirrored = {
  for (final (a, b) in _mirrorPairs) ...{a: b, b: a},
};

bool _bidiControl(int c) =>
    c == 0x061C ||
    c == 0x200E ||
    c == 0x200F ||
    (c >= 0x202A && c <= 0x202E) ||
    (c >= 0x2066 && c <= 0x2069);

/// Whether [text] holds a character MapLibre writes upright in vertical
/// text, which lets its label be written vertically
/// (`allowsVerticalWritingMode`).
bool allowsVerticalText(String text) {
  for (final c in text.runes) {
    if (_upright(c)) return true;
  }
  return false;
}

bool _upright(int c) =>
    (c >= 0x1100 && c <= 0x11FF) ||
    (c >= 0x2E80 && c <= 0x2FDF) ||
    (c >= 0x2FF0 && c <= 0x303F) ||
    (c >= 0x3040 && c <= 0x31FF) ||
    (c >= 0x3200 && c <= 0x4DBF) ||
    (c >= 0x4E00 && c <= 0x9FFF) ||
    (c >= 0xA000 && c <= 0xA4CF) ||
    (c >= 0xA960 && c <= 0xA97F) ||
    (c >= 0xAC00 && c <= 0xD7FF) ||
    (c >= 0xF900 && c <= 0xFAFF) ||
    (c >= 0xFE10 && c <= 0xFE1F) ||
    (c >= 0xFE30 && c <= 0xFE4F) ||
    (c >= 0xFF00 && c <= 0xFFEF) ||
    (c >= 0x20000 && c <= 0x3FFFF);

/// Letters and digits that lie on their side in vertical text.
bool _sideways(int c) =>
    (c >= 0x30 && c <= 0x39) ||
    (c >= 0x41 && c <= 0x5A) ||
    (c >= 0x61 && c <= 0x7A) ||
    (c >= 0xC0 && c <= 0x24F);

/// [text] with its punctuation in the forms vertical text takes, where it
/// stands between characters that are not on their side, as MapLibre's
/// `verticalizePunctuation`.
String verticalPunctuation(String text) {
  final codes = text.runes.toList();
  final out = <int>[];
  for (var i = 0; i < codes.length; i++) {
    final form = _verticalForms[codes[i]];
    final before = i > 0 ? codes[i - 1] : null;
    final after = i + 1 < codes.length ? codes[i + 1] : null;
    final fits =
        (after == null ||
            !_sideways(after) ||
            _verticalForms.containsKey(after)) &&
        (before == null ||
            !_sideways(before) ||
            _verticalForms.containsKey(before));
    out.add(form != null && fits ? form : codes[i]);
  }
  return String.fromCharCodes(out);
}

/// MapLibre's `verticalizedCharacterMap`.
const Map<int, int> _verticalForms = {
  0x21: 0xFE15, 0x23: 0xFF03, 0x24: 0xFF04, 0x25: 0xFF05, 0x26: 0xFF06, //
  0x28: 0xFE35, 0x29: 0xFE36, 0x2A: 0xFF0A, 0x2B: 0xFF0B, 0x2C: 0xFE10,
  0x2D: 0xFE32, 0x2E: 0x30FB, 0x2F: 0xFF0F, 0x3A: 0xFE13, 0x3B: 0xFE14,
  0x3C: 0xFE3F, 0x3D: 0xFF1D, 0x3E: 0xFE40, 0x3F: 0xFE16, 0x40: 0xFF20,
  0x5B: 0xFE47, 0x5C: 0xFF3C, 0x5D: 0xFE48, 0x5E: 0xFF3E, 0x5F: 0xFE33,
  0x60: 0xFF40, 0x7B: 0xFE37, 0x7C: 0x2015, 0x7D: 0xFE38, 0x7E: 0xFF5E,
  0xA2: 0xFFE0, 0xA3: 0xFFE1, 0xA5: 0xFFE5, 0xA6: 0xFFE4, 0xAC: 0xFFE2,
  0xAF: 0xFFE3, 0x2013: 0xFE32, 0x2014: 0xFE31, 0x2018: 0xFE43,
  0x2019: 0xFE44, 0x201C: 0xFE41, 0x201D: 0xFE42, 0x2026: 0xFE19,
  0x2027: 0x30FB, 0x20A9: 0xFFE6, 0x3001: 0xFE11, 0x3002: 0xFE12,
  0x3008: 0xFE3F, 0x3009: 0xFE40, 0x300A: 0xFE3D, 0x300B: 0xFE3E,
  0x300C: 0xFE41, 0x300D: 0xFE42, 0x300E: 0xFE43, 0x300F: 0xFE44,
  0x3010: 0xFE3B, 0x3011: 0xFE3C, 0x3014: 0xFE39, 0x3015: 0xFE3A,
  0x3016: 0xFE17, 0x3017: 0xFE18, 0xFF01: 0xFE15, 0xFF08: 0xFE35,
  0xFF09: 0xFE36, 0xFF0C: 0xFE10, 0xFF0D: 0xFE32, 0xFF0E: 0x30FB,
  0xFF1A: 0xFE13, 0xFF1B: 0xFE14, 0xFF1C: 0xFE3F, 0xFF1E: 0xFE40,
  0xFF1F: 0xFE16, 0xFF3B: 0xFE47, 0xFF3D: 0xFE48, 0xFF3F: 0xFE33,
  0xFF5B: 0xFE37, 0xFF5C: 0x2015, 0xFF5D: 0xFE38, 0xFF5F: 0xFE35,
  0xFF60: 0xFE36, 0xFF61: 0xFE12, 0xFF62: 0xFE41, 0xFF63: 0xFE42,
};

/// Characters a line may break after with no space, as MapLibre's
/// `charAllowsIdeographicBreaking`.
bool _breaksAfterIdeograph(int c) =>
    (c >= 0x2E80 && c <= 0x2FDF) ||
    (c >= 0x2FF0 && c <= 0x30FF) ||
    (c >= 0x3100 && c <= 0x312F) ||
    (c >= 0x31A0 && c <= 0x31FF) ||
    (c >= 0x3200 && c <= 0x4DBF) ||
    (c >= 0x4E00 && c <= 0x9FFF) ||
    (c >= 0xA000 && c <= 0xA4CF) ||
    (c >= 0xF900 && c <= 0xFAFF) ||
    (c >= 0xFE10 && c <= 0xFE1F) ||
    (c >= 0xFE30 && c <= 0xFE4F) ||
    (c >= 0xFF00 && c <= 0xFFEF);

/// Scripts MapLibre shapes a word at a time, which vertical text lays on
/// their side (`charInComplexShapingScript`).
bool _shapedAsWords(int c) =>
    (c >= 0x0590 && c <= 0x08FF) ||
    (c >= 0x0900 && c <= 0x0DFF) ||
    (c >= 0x0F00 && c <= 0x0FFF) ||
    (c >= 0x1000 && c <= 0x109F) ||
    (c >= 0x1780 && c <= 0x17FF) ||
    (c >= 0xFB1D && c <= 0xFDFF) ||
    (c >= 0xFE70 && c <= 0xFEFF);
