import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/mvt.dart';
import 'package:vmap/src/tiles/pole.dart';

GeometrySink _rings(List<List<int>> rings) {
  final sink = GeometrySink();
  for (final ring in rings) {
    sink.beginRing();
    for (var i = 0; i < ring.length; i += 2) {
      sink.add(ring[i], ring[i + 1]);
    }
  }
  return sink..end();
}

void main() {
  test('a square is labelled at its middle', () {
    final points = polygonLabelPoints(
      _rings([
        [0, 0, 1000, 0, 1000, 1000, 0, 1000],
      ]),
    );
    expect(points, [(500.0, 500.0)]);
  });

  test('each polygon of a multipolygon gets its own label', () {
    final points = polygonLabelPoints(
      _rings([
        [0, 0, 100, 0, 100, 100, 0, 100],
        [500, 0, 600, 0, 600, 100, 500, 100],
      ]),
    );
    expect(points, hasLength(2));
  });

  test('a hole pushes the label away from the middle', () {
    final (x, y) = polygonLabelPoints(
      _rings([
        [0, 0, 1000, 0, 1000, 1000, 0, 1000],
        [300, 300, 300, 700, 700, 700, 700, 300],
      ]),
    ).single;
    expect(x < 300 || x > 700 || y < 300 || y > 700, isTrue);
  });
}
