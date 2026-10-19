import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/color.dart';
import 'package:vmap/src/glyphs/glyph_pbf.dart';
import 'package:vmap/src/glyphs/maplibre_shaping.dart';
import 'package:vmap/src/icon_stretch.dart';
import 'package:vmap/src/sprites.dart';

/// A font whose every glyph is 10 units wide, as glyph ranges measure.
PbfGlyph? tenWide(int face, int c) =>
    PbfGlyph(c, Uint8List(0), 8, 8, 1, -6, 10);

List<int> varint(int v) {
  final out = <int>[];
  while (v >= 0x80) {
    out.add(v & 0x7f | 0x80);
    v >>= 7;
  }
  return out..add(v);
}

List<int> field(int tag, int wire, List<int> body) => [
  ...varint(tag << 3 | wire),
  if (wire == 2) ...varint(body.length),
  ...body,
];

void main() {
  test('a glyph range file reads back its glyphs', () {
    final glyph = [
      ...field(1, 0, varint(65)),
      ...field(2, 2, List.filled(16 * 18, 7)),
      ...field(3, 0, varint(10)),
      ...field(4, 0, varint(12)),
      ...field(5, 0, varint(2)),
      ...field(6, 0, varint(15)),
      ...field(7, 0, varint(11)),
    ];
    final stack = [
      ...field(1, 2, 'Test'.codeUnits),
      ...field(2, 2, '0-255'.codeUnits),
      ...field(3, 2, glyph),
    ];
    final read = GlyphPbf.parse(Uint8List.fromList(field(1, 2, stack)));
    expect(read, hasLength(1));
    final a = read.single;
    expect(
      [a.id, a.width, a.height, a.left, a.top, a.advance],
      [65, 10, 12, 1, -8, 11],
    );
    expect(a.bitmap, hasLength(16 * 18));
  });

  test('text wraps where MapLibre wraps it: evenly, at spaces', () {
    final one = layoutRanges(tenWide, 600, 'Test Test Test')!;
    expect(one.lines, 1);
    final wrapped = layoutRanges(
      tenWide,
      600,
      'Test Test Test',
      maxWidth: 100 / GlyphPbf.em,
    )!;
    expect(wrapped.lines, 2);
    expect(wrapped.width, closeTo(9 * 10 / GlyphPbf.em, 1e-9));
  });

  test('a newline breaks however much room there is', () {
    expect(layoutRanges(tenWide, 600, 'a\nb')!.lines, 2);
  });

  test('lines are justified within the widest', () {
    final left = layoutRanges(tenWide, 600, 'aaaa\nb', justify: -1)!.glyphs;
    final right = layoutRanges(tenWide, 600, 'aaaa\nb', justify: 1)!.glyphs;
    // The second line's only glyph is the last one: x is its third number.
    expect(left[left.length - 3], closeTo(0, 1e-6));
    expect(right[right.length - 3], closeTo(30 / GlyphPbf.em, 1e-6));
  });

  test('colours blend through CIELAB and hue as MapLibre blends them', () {
    const black = Rgba(0, 0, 0, 1), white = Rgba(1, 1, 1, 1);
    // L* 50 is sRGB 119 on every channel.
    final mid = Rgba.lerpLab(black, white, 0.5);
    expect(mid.r, closeTo(119 / 255, 0.01));
    expect(mid.g, closeTo(mid.r, 1e-6));
    expect(Rgba.lerpLab(black, white, 0).r, closeTo(0, 1e-6));
    expect(Rgba.lerpHcl(white, white, 0.5).r, closeTo(1, 1e-6));
  });

  test('a fitted icon keeps its fixed parts and stretches the rest', () {
    final icon = SpriteImage(
      const ui.Rect.fromLTWH(0, 0, 30, 10),
      30,
      10,
      1,
      stretchX: [(10.0, 20.0)],
      stretchY: [(0.0, 10.0)],
    );
    final pieces = stretchedIcon(
      icon,
      const ui.Rect.fromLTWH(0, 0, 100, 10),
      1,
    );
    final xs = {for (final (_, to) in pieces) (to.left, to.right)};
    expect(xs, {(0.0, 10.0), (10.0, 90.0), (90.0, 100.0)});
  });

  test('vertical text runs down a column an em a glyph, upright', () {
    final shaped = layoutRanges(tenWide, 600, 'マップ', vertical: true)!;
    expect(shaped.width, closeTo(1.2, 1e-9));
    expect(shaped.height, closeTo(3, 1e-9));
    final g = shaped.glyphs;
    expect(g[7] - g[2], closeTo(0, 1e-6));
    expect(g[8] - g[3], closeTo(1, 1e-6));
    expect(shaped.turns, everyElement(0));
  });

  test('vertical text lays a script shaped as words on its side', () {
    final shaped = layoutRanges(tenWide, 600, 'マ ب', vertical: true)!;
    expect(shaped.turns, [0, 1, 1]);
  });

  test('vertical punctuation takes its vertical form beside ideographs', () {
    expect(verticalPunctuation('地「図」'), '地﹁図﹂');
    expect(verticalPunctuation('a(b)'), 'a(b)');
  });

  test('a line may break between ideographs', () {
    final breaks = mapLibreLineBreaks('一二三四五六'.runes.toList(), (_) => 10, 30);
    expect(breaks, [3, 6]);
  });
}
