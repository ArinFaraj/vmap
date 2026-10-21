import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/round_corners.dart';

void main() {
  test('each corner of a square becomes an arc on the half unit grid', () {
    final square = Float64List.fromList([
      100,
      100,
      300,
      100,
      300,
      300,
      100,
      300,
    ]);
    final round = roundRing(square, 20);
    expect(round.length ~/ 2, 16);
    for (final v in round) {
      expect(v * 2, (v * 2).roundToDouble());
      expect(v, inInclusiveRange(100, 300));
    }
    expect(round.sublist(0, 2), [100, 120]);
  });

  test('corners on the clipped edge of a tile stay sharp', () {
    final ring = Float64List.fromList([-10, 100, 300, 100, 300, 300, -10, 300]);
    final round = roundRing(ring, 20);
    expect(round.sublist(0, 2), [-10, 100]);
    expect(round.sublist(round.length - 2), [-10, 300]);
  });

  test('a turn of 90 degrees keeps each wall its own normal', () {
    final n = smoothNormals(
      Float64List.fromList([0, -10, 10, 0, 0, 10, -10, 0]),
    );
    expect(n.sublist(0, 4), [0, -1, 0, -1]);
  });
}
