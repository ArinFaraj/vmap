import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/glyphs/glyph_layout.dart';
import 'package:vmap/src/label_path.dart';

void main() {
  final fonts = GlyphFonts([
    File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync(),
  ]);

  test('Sorani and Latin both shape into glyphs', () {
    for (final text in ['هەولێر', 'Erbil Citadel', 'شەقامی ٦٠ مەتری']) {
      final shaped = layoutText(fonts, text)!;
      expect(shaped.count, greaterThan(0));
      expect(shaped.lines, 1);
      expect(shaped.width, greaterThan(1));
    }
  });

  test('a zero width non-joiner is not a missing glyph', () {
    expect(layoutText(fonts, 'بازاڕی‌ قەیسەری'), isNotNull);
  });

  test('text the fonts do not cover falls back', () {
    expect(layoutText(fonts, 'Москва'), isNull);
    expect(layoutText(fonts, 'Hi 😀'), isNull);
  });

  test('long names wrap into even lines no wider than asked', () {
    final shaped = layoutText(
      fonts,
      'مزگەوتی گەورەی جەلیل خەیات لە شاری هەولێر',
      maxWidth: 8,
    )!;
    expect(shaped.lines, 3);
    expect(shaped.height, closeTo(3 * 1.2, 1e-6));
    expect(shaped.width, lessThanOrEqualTo(8.5));
  });

  test('a newline in a name starts a new line, and a road joins them', () {
    expect(layoutText(fonts, 'Erbil\nهەولێر', maxWidth: 9)!.lines, 2);
    expect(layoutText(fonts, 'Erbil\nهەولێر', singleLine: true)!.lines, 1);
  });

  test('a road name never wraps', () {
    final shaped = layoutText(
      fonts,
      'شەقامی شێخی چۆلی لە ناوەندی شار',
      maxWidth: 2,
      singleLine: true,
    )!;
    expect(shaped.lines, 1);
  });

  test('a heavier weight is wider', () {
    final light = layoutText(fonts, 'Erbil', weight: 300)!;
    final bold = layoutText(fonts, 'Erbil', weight: 800)!;
    expect(bold.width, greaterThan(light.width));
  });

  test('right aligned lines end at the box edge', () {
    final shaped = layoutText(
      fonts,
      'Erbil International Airport Terminal',
      maxWidth: 6,
      align: 1,
    )!;
    var lastEnd = 0.0;
    for (var i = 0; i < shaped.count; i++) {
      final end = shaped.glyphs[i * 5 + 2] + shaped.glyphs[i * 5 + 4];
      if (end > lastEnd) lastEnd = end;
    }
    expect(lastEnd, closeTo(shaped.width, 0.05));
  });

  test("a style's text-font names its fonts first, by family", () {
    final bytes = File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync();
    final two = GlyphFonts(
      [bytes, bytes],
      families: ['Noto Sans', 'Vazirmatn'],
    );
    expect(two.orderFor(['Vazirmatn Bold']), [1, 0]);
    expect(two.orderFor(['Noto Sans Regular', 'Vazirmatn Regular']), [0, 1]);
    expect(two.orderFor(['Open Sans Semibold Italic']), [0, 1]);
    expect(two.orderFor(const []), [0, 1]);
    final shaped = layoutText(two, 'هەولێر', stack: ['Vazirmatn Medium'])!;
    expect(shaped.glyphs[0], 1);
  });

  test('a point along a path, and past its end', () {
    final path = Float64List.fromList([0, 0, 10, 0, 10, 10]);
    final out = Float64List(3);
    pointAlong(path, 15, out);
    expect(out[0], closeTo(10, 1e-9));
    expect(out[1], closeTo(5, 1e-9));
    expect(out[2], closeTo(1.5707963, 1e-6));
    pointAlong(path, 25, out);
    expect(out[1], closeTo(15, 1e-9));
    pointAlong(path, -5, out);
    expect(out[0], closeTo(-5, 1e-9));
  });
}
