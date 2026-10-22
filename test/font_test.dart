import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/text/font/font.dart';
import 'package:vmap/src/text/scripts.dart';
import 'package:vmap/src/text/unicode.dart';

void main() {
  final bytes = File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync();
  final font = Font.parse(bytes);

  test('anything but a TrueType font is a format error', () {
    expect(
      () => Font.parse(Uint8List.fromList('not a font'.codeUnits)),
      throwsFormatException,
    );
    expect(
      () => Font.parse(Uint8List.sublistView(bytes, 0, 200)),
      throwsFormatException,
    );
  });

  test('maps the Sorani letters other fonts lack', () {
    for (final c in 'ڕڵەێۆڤ'.runes) {
      expect(font.glyphOf(c), isNot(0), reason: c.toRadixString(16));
    }
    expect(font.glyphOf(0x1F600), 0);
  });

  test('a weight moves the advances and outlines', () {
    final h = font.glyphOf(0x48);
    final thin = font.withAxes({'wght': 100});
    final black = font.withAxes({'wght': 900});
    expect(black.advance(h), greaterThan(thin.advance(h)));
    expect(font.withAxes({'wght': 400}).coords, isEmpty);
    expect(thin.outline(h)!.points, isNot(black.outline(h)!.points));
  });

  test('walks a contour of control points only from an implied point', () {
    final square = GlyphOutline(
      Float64List.fromList([0, 0, 0, 10, 10, 10, 10, 0]),
      Uint8List(4),
      Uint16List.fromList([3]),
    );
    final path = <String>[];
    square.walk(
      moveTo: (x, y) => path.add('M$x,$y'),
      lineTo: (x, y) => path.add('L$x,$y'),
      quadTo: (cx, cy, x, y) => path.add('Q$cx,$cy $x,$y'),
    );
    expect(path, [
      'M5.0,0.0',
      'Q0.0,0.0 0.0,5.0',
      'Q0.0,10.0 5.0,10.0',
      'Q10.0,10.0 10.0,5.0',
      'Q10.0,0.0 5.0,0.0',
    ]);
  });

  test('walks lines and curves around back to the start', () {
    final shape = GlyphOutline(
      Float64List.fromList([5, 5, 0, 0, 10, 0, 10, 10]),
      Uint8List.fromList([0, 1, 1, 1]),
      Uint16List.fromList([3]),
    );
    final path = <String>[];
    shape.walk(
      moveTo: (x, y) => path.add('M$x,$y'),
      lineTo: (x, y) => path.add('L$x,$y'),
      quadTo: (cx, cy, x, y) => path.add('Q$cx,$cy $x,$y'),
    );
    expect(path, ['M0.0,0.0', 'L10.0,0.0', 'L10.0,10.0', 'Q5.0,5.0 0.0,0.0']);
  });

  test('neutral characters join the script run before them', () {
    final runs = scriptRuns('Erbil هەولێر ٢٠٢٦'.runes.toList());
    expect([for (final r in runs) scriptCode(r.script)], ['Latn', 'Arab']);
    expect(runs.first.end, 6);
    expect(scriptRuns('123'.runes.toList()).single.script, scriptCommon);
  });
}
