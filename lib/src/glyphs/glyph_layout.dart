import 'dart:math' as math;
import 'dart:typed_data';

import 'package:payv/payv.dart';

/// Whether [text] is written right to left, by its first strong letter.
bool textIsRightToLeft(String text) {
  for (final unit in text.codeUnits) {
    if (unit >= 0x0590 && unit <= 0x08FF || unit >= 0xFB1D && unit <= 0xFEFC) {
      return true;
    }
    if (unit >= 0x41 && unit <= 0x24F) return false;
  }
  return false;
}

/// The fonts labels are shaped with, first to last: a run of text takes the
/// first font that has every one of its glyphs.
class GlyphFonts {
  GlyphFonts(List<Uint8List> faces)
    : _faces = [for (final bytes in faces) OpenTypeFont.parse(bytes)];

  final List<OpenTypeFont> _faces;
  final Map<int, OpenTypeFont> _instances = {};
  final Map<int, Shaper> _shapers = {};

  int get length => _faces.length;

  /// [face] at [weight], snapped to a hundred.
  OpenTypeFont font(int face, int weight) {
    final w = snapWeight(weight);
    return _instances[face * 1000 + w] ??= () {
      final base = _faces[face];
      if (!base.isVariable) return base;
      return base.withVariationCoords(
        base.normalizeAxisValues({'wght': w.toDouble()}),
      );
    }();
  }

  Shaper shaper(int face, int weight) =>
      _shapers[face * 1000 + snapWeight(weight)] ??= Shaper(font(face, weight));

  /// The font's ascent and descent in ems, both positive.
  (double, double) metrics(int face) {
    final f = _faces[face];
    final hhea = f.sfnt.requireTable(Tag.hhea);
    final em = f.unitsPerEm.toDouble();
    return (
      hhea.int16At(hhea.position + 4) / em,
      -hhea.int16At(hhea.position + 6) / em,
    );
  }

  double unitsPerEm(int face) => _faces[face].unitsPerEm.toDouble();

  static int snapWeight(int weight) =>
      ((weight / 100).round() * 100).clamp(100, 900);
}

/// Text shaped once: glyphs in visual order with their places in ems, the
/// box's top left at 0, 0.
class ShapedText {
  ShapedText(this.glyphs, this.width, this.height, this.lines);

  /// Five numbers per glyph: font, glyph id, x and y of its origin on the
  /// baseline, and its advance, the last three in ems.
  final Float32List glyphs;
  final double width;
  final double height;
  final int lines;

  int get count => glyphs.length ~/ 5;
}

/// Characters that may come out of shaping as no glyph without anything
/// being missing: joiners and direction marks.
bool _ignorable(int c) =>
    c == 0x200B ||
    c == 0x200C ||
    c == 0x200D ||
    c == 0x200E ||
    c == 0x200F ||
    c == 0x061C ||
    c == 0xFEFF ||
    c == 0x00AD ||
    (c >= 0x202A && c <= 0x202E) ||
    (c >= 0x2066 && c <= 0x2069) ||
    (c >= 0xFE00 && c <= 0xFE0F);

bool _space(int c) => c == 0x20 || c == 0xA0 || c == 0x3000;

/// One line's glyphs, its width in ems, or null when no font has them all.
(List<double>, double)? _shapeLine(
  GlyphFonts fonts,
  List<int> scalars,
  int weight,
  double letterSpacing,
) {
  final out = <double>[];
  var pen = 0.0;
  if (scalars.isEmpty) return (out, 0.0);
  final bidi = Bidi.resolve(scalars);
  for (final run in bidi.visualRuns) {
    final sub = scalars.sublist(run.start, run.end);
    final rtl = run.level.isOdd;
    final pieces = ScriptItemizer.itemize(sub);
    for (final piece in rtl ? pieces.reversed : pieces) {
      final text = sub.sublist(piece.start, piece.end);
      ShapedRun? shaped;
      var face = 0;
      for (; face < fonts.length; face++) {
        final candidate = fonts
            .shaper(face, weight)
            .shapeScalars(
              text,
              script: piece.scriptTag,
              direction: rtl ? TextDirection.rtl : TextDirection.ltr,
            );
        var complete = true;
        for (final g in candidate.infos) {
          if (g.glyphId == 0 && !_ignorable(g.codepoint)) {
            complete = false;
            break;
          }
        }
        if (complete) {
          shaped = candidate;
          break;
        }
      }
      if (shaped == null) return null;
      final em = fonts.unitsPerEm(face);
      for (var i = 0; i < shaped.length; i++) {
        final info = shaped.infos[i];
        final p = shaped.positions[i];
        final advance = p.xAdvance / em;
        if (info.glyphId != 0) {
          out.addAll([
            face.toDouble(),
            info.glyphId.toDouble(),
            pen + p.xOffset / em,
            -p.yOffset / em,
            advance,
          ]);
        }
        pen += advance;
        if (!rtl && letterSpacing != 0 && advance > 0) pen += letterSpacing;
      }
    }
  }
  return (out, pen);
}

/// Splits [scalars] into lines no wider than [maxWidth] ems where it can,
/// breaking at spaces, with the lines evened out the way MapLibre does
/// rather than filled greedily.
List<List<int>> _breakLines(
  GlyphFonts fonts,
  List<int> scalars,
  int weight,
  double letterSpacing,
  double maxWidth,
) {
  final words = <List<int>>[];
  var current = <int>[];
  for (final c in scalars) {
    if (_space(c)) {
      if (current.isNotEmpty) words.add(current);
      current = <int>[];
    } else {
      current.add(c);
    }
  }
  if (current.isNotEmpty) words.add(current);
  if (words.length < 2) return [scalars];
  final space =
      _shapeLine(fonts, const [0x20], weight, letterSpacing)?.$2 ?? 0.25;
  final widths = [
    for (final w in words)
      _shapeLine(fonts, w, weight, letterSpacing)?.$2 ?? w.length * 0.5,
  ];
  final total =
      widths.fold<double>(0, (a, b) => a + b) + space * (words.length - 1);
  if (total <= maxWidth) return [scalars];
  final count = (total / maxWidth).ceil();
  final target = total / count;
  final lines = <List<int>>[];
  var line = <int>[];
  var width = 0.0;
  for (var i = 0; i < words.length; i++) {
    final add = (line.isEmpty ? 0 : space) + widths[i];
    if (line.isNotEmpty &&
        width + add > target &&
        (width + add - target) > (target - width) &&
        lines.length < count - 1) {
      lines.add(line);
      line = <int>[];
      width = 0;
    }
    if (line.isNotEmpty) line.add(0x20);
    line.addAll(words[i]);
    width += (line.length == words[i].length ? 0 : space) + widths[i];
  }
  if (line.isNotEmpty) lines.add(line);
  return lines;
}

/// Shapes [text] for a label: at [weight], with [letterSpacing] and
/// [lineHeight] in ems, wrapped at [maxWidth] ems unless [singleLine], and
/// each line aligned by [align]: -1 left, 0 centre, 1 right. Null when the
/// fonts lack a glyph the text needs.
ShapedText? layoutText(
  GlyphFonts fonts,
  String text, {
  int weight = 400,
  double letterSpacing = 0,
  double lineHeight = 1.2,
  double maxWidth = double.infinity,
  int align = 0,
  bool singleLine = false,
}) {
  final scalars = text.runes.toList();
  final lines = singleLine || maxWidth.isInfinite
      ? [scalars]
      : _breakLines(fonts, scalars, weight, letterSpacing, maxWidth);
  final shaped = <(List<double>, double)>[];
  for (final line in lines) {
    final one = _shapeLine(fonts, line, weight, letterSpacing);
    if (one == null) return null;
    shaped.add(one);
  }
  final width = shaped.fold<double>(0, (a, l) => math.max(a, l.$2));
  final (ascent, descent) = fonts.metrics(0);
  final lead = (lineHeight - ascent - descent) / 2;
  final out = <double>[];
  for (final (i, (glyphs, w)) in shaped.indexed) {
    final shift = switch (align) {
      < 0 => 0.0,
      > 0 => width - w,
      _ => (width - w) / 2,
    };
    final baseline = i * lineHeight + lead + ascent;
    for (var g = 0; g < glyphs.length; g += 5) {
      out.addAll([
        glyphs[g],
        glyphs[g + 1],
        glyphs[g + 2] + shift,
        glyphs[g + 3] + baseline,
        glyphs[g + 4],
      ]);
    }
  }
  return ShapedText(
    Float32List.fromList(out),
    width,
    shaped.length * lineHeight,
    shaped.length,
  );
}
