import 'dart:math' as math;
import 'dart:typed_data';

import 'package:payv/payv.dart';

import 'maplibre_shaping.dart';

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
  /// [faces] in the order they are tried when a label's style names none
  /// of them, each with its family in [families].
  GlyphFonts(List<Uint8List> faces, {List<String>? families})
    : faceBytes = faces,
      familyNames = families,
      _faces = [for (final bytes in faces) OpenTypeFont.parse(bytes)],
      _families = [
        for (var i = 0; i < faces.length; i++)
          _family(families != null && i < families.length ? families[i] : ''),
      ];

  /// What the fonts were made from, for another isolate to make them again.
  final List<Uint8List> faceBytes;
  final List<String>? familyNames;

  final List<OpenTypeFont> _faces;
  final List<String> _families;
  final Map<String, List<int>> _orders = {};

  /// Words a style's font name carries for weight and slant, which the
  /// family a font is registered under does not.
  static const _styleWords = {
    'thin',
    'hairline',
    'extralight',
    'ultralight',
    'light',
    'regular',
    'normal',
    'book',
    'medium',
    'semibold',
    'demibold',
    'demi',
    'bold',
    'extrabold',
    'ultrabold',
    'black',
    'heavy',
    'italic',
    'oblique',
    'condensed',
    'semicondensed',
    'expanded',
    'extra',
    'semi',
    'ultra',
  };

  static String _family(String name) => [
    for (final w in name.toLowerCase().split(RegExp(r'[\s_-]+')))
      if (w.isNotEmpty && !_styleWords.contains(w)) w,
  ].join();

  /// The order to try the faces in for a style's `text-font` [stack]: its
  /// fonts first, in its order, then every other face.
  List<int> orderFor(List<String> stack) {
    final key = stack.join('\u0001');
    return _orders[key] ??= () {
      final out = <int>[];
      for (final name in stack) {
        final family = _family(name);
        for (var i = 0; i < _faces.length; i++) {
          if (_families[i] == family && !out.contains(i)) out.add(i);
        }
      }
      for (var i = 0; i < _faces.length; i++) {
        if (!out.contains(i)) out.add(i);
      }
      return out;
    }();
  }

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
  ShapedText(
    this.glyphs,
    this.width,
    this.height,
    this.lines, [
    this.scales,
    this.colors,
  ]);

  /// For a formatted label, each glyph's size against the label's, and its
  /// colour, zero for the label's own. Null for plain text.
  final Float32List? scales;
  final Int32List? colors;

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
  List<int> order,
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
      for (final next in order) {
        face = next;
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
  List<int> order,
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
      _shapeLine(fonts, const [0x20], weight, letterSpacing, order)?.$2 ?? 0.25;
  final widths = [
    for (final w in words)
      _shapeLine(fonts, w, weight, letterSpacing, order)?.$2 ?? w.length * 0.5,
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
  List<String> stack = const [],
  bool mapLibreBreaks = false,
  double Function(int index)? breakAdvance,
}) {
  final order = fonts.orderFor(stack);
  if (mapLibreBreaks && !singleLine && maxWidth.isFinite) {
    return _layoutLines(
      fonts,
      _mapLibreLines(
        fonts,
        text,
        weight,
        letterSpacing,
        maxWidth,
        order,
        breakAdvance,
      ),
      weight,
      letterSpacing,
      lineHeight,
      align,
      order,
    );
  }
  final lines = <List<int>>[];
  var paragraph = <int>[];
  void endParagraph() {
    if (singleLine || maxWidth.isInfinite) {
      lines.add(paragraph);
    } else {
      lines.addAll(
        _breakLines(fonts, paragraph, weight, letterSpacing, maxWidth, order),
      );
    }
    paragraph = <int>[];
  }

  for (final c in text.runes) {
    if (c == 0x0A || c == 0x0D || c == 0x2028 || c == 0x2029) {
      if (singleLine) {
        paragraph.add(0x20);
      } else {
        endParagraph();
      }
      continue;
    }
    paragraph.add(c == 0x09 ? 0x20 : c);
  }
  endParagraph();
  return _layoutLines(
    fonts,
    lines,
    weight,
    letterSpacing,
    lineHeight,
    align,
    order,
  );
}

/// [text] broken into lines as MapLibre breaks a label drawn from glyph
/// ranges, the whole text weighed at once, its newlines among the breaks:
/// each code [advance] ems wide with its letter spacing, or as wide as the
/// fonts set it alone.
List<List<int>> _mapLibreLines(
  GlyphFonts fonts,
  String text,
  int weight,
  double letterSpacing,
  double maxWidth,
  List<int> order,
  double Function(int index)? advance,
) {
  final codes = [for (final c in text.runes) c == 0x09 ? 0x20 : c];
  final widths = <int, double>{};
  double alone(int i) => widths[codes[i]] ??=
      (_shapeLine(fonts, [codes[i]], weight, 0, order)?.$2 ?? 0.5) +
      letterSpacing;
  final breaks = mapLibreLineBreaks(
    codes,
    advance ?? alone,
    maxWidth,
    spacing: letterSpacing,
  );
  final lines = <List<int>>[];
  var from = 0;
  for (final to in breaks) {
    var line = [
      for (final c in codes.sublist(from, to))
        if (c != 0x0A && c != 0x0D) c,
    ];
    while (line.isNotEmpty && _space(line.first)) {
      line = line.sublist(1);
    }
    while (line.isNotEmpty && _space(line.last)) {
      line = line.sublist(0, line.length - 1);
    }
    lines.add(line);
    from = to;
  }
  return lines;
}

/// [lines] shaped and stacked, each aligned by [align].
ShapedText? _layoutLines(
  GlyphFonts fonts,
  List<List<int>> lines,
  int weight,
  double letterSpacing,
  double lineHeight,
  int align,
  List<int> order,
) {
  final shaped = <(List<double>, double)>[];
  for (final line in lines) {
    final one = _shapeLine(fonts, line, weight, letterSpacing, order);
    if (one == null) return null;
    shaped.add(one);
  }
  final width = shaped.fold<double>(0, (a, l) => math.max(a, l.$2));
  final (ascent, descent) = fonts.metrics(order.first);
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
