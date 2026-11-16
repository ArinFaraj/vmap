import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/text/glyphs/glyph_layout.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';
import 'package:vmap/src/text/glyphs/glyph_raster.dart';

void main() {
  final fonts = GlyphFonts([
    File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync(),
  ]);
  final rasterizer = GlyphRasterizer(fonts);

  List<int> glyphsOf(String text) {
    final g = layoutText(fonts, text)!.glyphs;
    return [for (var i = 0; i < g.length; i += 5) g[i + 1].toInt()];
  }

  test('a glyph has a field the size of its ink and its border', () {
    final glyphs = glyphsOf('هەولێر');
    final made = rasterizer.fields(0, 400, false, glyphs);
    const border = GlyphPbf.border;
    expect([for (final g in made) g.id], glyphs);
    for (final g in made) {
      expect(g.width, inInclusiveRange(1, GlyphPbf.em * 2));
      expect(g.height, inInclusiveRange(1, GlyphPbf.em * 2));
      expect(g.bitmap.length, (g.width + 2 * border) * (g.height + 2 * border));
    }
  });

  test('a field is over the edge value in the ink and under it outside', () {
    final alef = rasterizer.fields(0, 400, false, glyphsOf('ا')).single;
    const border = GlyphPbf.border;
    final w = alef.width + 2 * border, h = alef.height + 2 * border;
    final field = alef.bitmap;
    expect(alef.height, greaterThan(alef.width));
    expect(field[h ~/ 2 * w + w ~/ 2], greaterThan(192));
    for (final corner in [0, w - 1, (h - 1) * w, h * w - 1]) {
      expect(field[corner], lessThan(140));
    }
  });

  test('a field sits from the origin on the baseline', () {
    final alef = rasterizer.fields(0, 400, false, glyphsOf('ا')).single;
    expect(alef.top, greaterThan(GlyphPbf.em ~/ 2));
    expect(alef.top - alef.height, inInclusiveRange(-2, 2));
  });

  test('a glyph with no outline has no ink', () {
    final space = glyphsOf('a b')[1];
    final made = rasterizer.fields(0, 400, false, [space]).single;
    expect(made.id, space);
    expect(made.bitmap, isEmpty);
  });

  test('a heavier weight has a wider field', () {
    final glyph = glyphsOf('ا');
    int ink(int weight) => rasterizer
        .fields(0, weight, false, glyph)
        .single
        .bitmap
        .where((v) => v >= 192)
        .length;
    expect(ink(900), greaterThan(ink(400)));
  });
}
