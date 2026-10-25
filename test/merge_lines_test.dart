import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/line_anchors.dart';

NamedLine _road(String text, List<double> points) => NamedLine(
  priority: 0,
  text: text,
  spacing: 250,
  labelLength: 100,
  em: 16,
  maxBend: 0.8,
  props: {'name': text},
  rings: [Float32List.fromList(points)],
);

void main() {
  test('ways of one name meeting end to start become one line', () {
    final merged = mergeNamedLines([
      _road('Main', [10, 0, 20, 0]),
      _road('Main', [0, 0, 10, 0]),
      _road('Side', [20, 0, 30, 0]),
      _road('Main', [20, 0, 30, 0]),
    ]);
    expect(merged.map((l) => l.text), ['Main', 'Side']);
    expect(merged.first.rings.single, [0, 0, 10, 0, 20, 0, 30, 0]);
  });

  test('a way between two of its name joins all three', () {
    final merged = mergeNamedLines([
      _road('Main', [0, 0, 10, 0]),
      _road('Main', [20, 0, 30, 0]),
      _road('Main', [10, 0, 20, 0]),
    ]);
    expect(merged.single.rings.single, [0, 0, 10, 0, 20, 0, 30, 0]);
  });

  test('ways that only touch at their starts stay apart', () {
    final merged = mergeNamedLines([
      _road('Main', [0, 0, 10, 0]),
      _road('Main', [0, 0, 0, 10]),
    ]);
    expect(merged, hasLength(2));
  });
}
