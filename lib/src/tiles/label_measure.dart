import '../text/glyphs/cursive.dart';
import '../text/glyphs/glyph_ranges.dart';
import '../text/glyphs/glyph_pbf.dart';
import '../text/glyphs/arabic_forms.dart';
import '../text/glyphs/glyph_layout.dart';
import '../style/format.dart';
import '../style/style_model.dart';

/// Measures label text in ems while a tile is built, as MapLibre measures
/// a label to space it along a line.
class LabelMeasure {
  LabelMeasure({this.fonts, this.ranges});

  /// Sets text when the labels are not drawn from glyph ranges.
  final GlyphFonts? fonts;

  /// The style's glyph ranges, which a name along a line is measured with
  /// as MapLibre measures it, when the labels are drawn from them.
  final GlyphRanges? ranges;

  /// The size of each sprite image in logical pixels, by name, once the
  /// style's sprite indexes are read: images in formatted text are
  /// measured by it.
  Map<String, (double, double)> iconSizes = const {};

  /// A measure met a range still on its way: built again once it
  /// arrives, its names are where MapLibre puts them.
  bool missedGlyphs = false;

  final Map<String, double> _fontEms = {};

  /// How long [text] is in ems at [symbol]'s letter spacing, as MapLibre
  /// measures a label: from the style's glyph ranges, its letters joined,
  /// when the labels are drawn from them; else as the fonts set it, or
  /// about half an em a letter.
  double textEms(
    SymbolLayer symbol,
    String text, [
    List<Object?>? format,
    double textSize = 16,
  ]) {
    final ranges = this.ranges;
    if (format != null && ranges != null) {
      final width = _formattedEms(symbol, text, format, ranges, textSize);
      if (width != null) return width;
    }
    final plain = plainText(text);
    final label = symbol.uppercase ? plain.toUpperCase() : plain;
    final spacing = letterSpacingFor(label, symbol.letterSpacing);
    if (ranges != null) {
      final face = ranges.face(symbol.fontStack);
      final forms = [
        for (final c in joinedForms(label.runes.toList()))
          if (c >= 0) c,
      ];
      if (ranges.ready(face, String.fromCharCodes(forms))) {
        var width = 0.0;
        var glyphs = 0;
        for (final c in forms) {
          final g = ranges.glyph(face, c);
          if (g != null) {
            width += g.advance / GlyphPbf.em + spacing;
            glyphs++;
          }
        }
        // As MapLibre's shaping, no spacing follows the last letter.
        return glyphs == 0 ? 0 : width - spacing;
      }
      missedGlyphs = true;
    }
    return _fontEms[text] ??= () {
      final fonts = this.fonts;
      if (fonts == null) return text.runes.length * 0.55;
      return layoutText(
            fonts,
            label,
            weight: symbol.weight,
            letterSpacing: spacing,
            singleLine: true,
            stack: symbol.fontStack,
          )?.width ??
          text.runes.length * 0.55;
    }();
  }

  /// The width in ems of formatted [text]: its glyphs, and its images as
  /// MapLibre's shaping weighs one, its width against the [textSize] it is
  /// laid out at.
  double? _formattedEms(
    SymbolLayer symbol,
    String text,
    List<Object?> format,
    GlyphRanges ranges,
    double textSize,
  ) {
    var width = 0.0;
    var section = 0;
    final runes = [
      for (final c in joinedForms(text.runes.toList()))
        if (c >= 0) c,
    ];
    final spacing = letterSpacingFor(plainText(text), symbol.letterSpacing);
    for (var i = 0; i < runes.length; i++) {
      final r = runes[i];
      if (r == formatMark && i + 1 < runes.length) {
        section = runes[++i] - formatIndexBase;
        continue;
      }
      final spec = section < format.length ? format[section] : null;
      final scale = spec is List ? (spec[0] as num?)?.toDouble() ?? 1 : 1.0;
      if (r == formatImage) {
        final name = spec is List && spec.length > 4 ? spec[4] : null;
        final w = name is String ? iconSizes[name]?.$1 : null;
        if (w != null) width += w * scale / textSize + spacing;
        continue;
      }
      final fonts = spec is List && spec[1] is List
          ? (spec[1] as List).cast<String>()
          : symbol.fontStack;
      final face = ranges.face(fonts);
      final c = symbol.uppercase
          ? String.fromCharCode(r).toUpperCase().runes.first
          : r;
      if (!ranges.ready(face, String.fromCharCode(c))) {
        missedGlyphs = true;
        return null;
      }
      final g = ranges.glyph(face, c);
      if (g != null) {
        width += (g.advance / GlyphPbf.em + spacing) * scale;
      }
    }
    return width;
  }
}
