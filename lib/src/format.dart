import 'color.dart';

/// One run of a `format` expression's text and how it is drawn.
class FormatSection {
  const FormatSection(
    this.text, {
    this.scale = 1,
    this.fonts,
    this.color,
    this.align,
  });

  final String text;

  /// `font-scale`: its size against the label's.
  final double scale;

  /// `text-font`, or null for the label's own.
  final List<String>? fonts;

  /// `text-color`, or null for the label's own.
  final Rgba? color;

  /// `vertical-align`: `bottom`, `center` or `top`, or null for bottom.
  final String? align;

  bool get plain =>
      scale == 1 && fonts == null && color == null && align == null;
}

/// What a `format` expression gives: its runs in order.
class FormattedText {
  const FormattedText(this.sections);

  final List<FormatSection> sections;

  @override
  String toString() => sections.map((s) => s.text).join();
}

/// The character opening a run of a formatted label, followed by
/// [formatIndexBase] plus the run's section number. Both are private use
/// characters, which no font draws and case changes leave alone.
const formatMark = 0xE000;
const formatIndexBase = 0xE100;

/// The property a formatted label carries its sections under.
const formatKey = r'$format';

/// A label's text as one string: plain text trimmed, or a formatted text
/// with each run opened by its mark, and its sections, each its scale,
/// fonts, colour as a 32 bit ARGB or null, and vertical alignment, for the
/// label to carry. Sections are null for plain text.
(String, List<Object?>?) labelText(Object? value) {
  if (value is! FormattedText) return ((value ?? '').toString().trim(), null);
  final sections = value.sections;
  if (sections.every((s) => s.plain)) return (value.toString().trim(), null);
  final out = StringBuffer();
  for (var i = 0; i < sections.length; i++) {
    var text = sections[i].text;
    if (i == 0) text = text.trimLeft();
    if (i == sections.length - 1) text = text.trimRight();
    out
      ..writeCharCode(formatMark)
      ..writeCharCode(formatIndexBase + i)
      ..write(text);
  }
  return (
    out.toString(),
    [
      for (final s in sections) [s.scale, s.fonts, s.color?.toArgb(), s.align],
    ],
  );
}

/// [text] without the marks of a formatted label.
String plainText(String text) {
  if (!text.contains(String.fromCharCode(formatMark))) return text;
  final out = StringBuffer();
  final runes = text.runes.toList();
  for (var i = 0; i < runes.length; i++) {
    if (runes[i] == formatMark) {
      i++;
      continue;
    }
    out.writeCharCode(runes[i]);
  }
  return out.toString();
}
