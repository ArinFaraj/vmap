import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/extrusion.dart';

void main() {
  Float64List square(double x, double y, double s) => Float64List.fromList([
    x, y, x + s, y, x + s, y + s, x, y + s, x, y, //
  ]);

  test('a square building has four walls, a roof and its height', () {
    final b = ExtrusionBuilder(3)
      ..add(square(10, 10, 20), [0], [5], 12, 2, const Rgba(1, 0, 0, 1));
    final built = b.finish()!;
    expect(built.bucket, 3);
    expect(built.count, 1);
    expect(built.walls.length, 16);
    expect(built.roofIndices.length, 6);
    expect(built.info[0], 12);
    expect(built.info[1], 2);
    expect(built.info[2], closeTo(20, 1e-6));
    expect(built.info[3], closeTo(20, 1e-6));
  });

  test('a courtyard adds walls of its own and no roof over it', () {
    final rings = Float64List.fromList([
      ...square(0, 0, 30),
      10, 10, 10, 20, 20, 20, 20, 10, 10, 10, //
    ]);
    final built = (ExtrusionBuilder(
      0,
    )..add(rings, [0, 5], [5, 10], 9, 0, const Rgba(0, 0, 0, 1))).finish()!;
    expect(built.walls.length, 32);
    expect(built.roofIndices.length, greaterThan(6));
  });

  test(
    'a building as tall as its base keeps its roof, one below it is left out',
    () {
      final flat =
          (ExtrusionBuilder(0)
                ..add(square(0, 0, 10), [0], [5], 3, 3, const Rgba(0, 0, 0, 1)))
              .finish()!;
      expect(flat.roofIndices, isNotEmpty);
      final sunk = ExtrusionBuilder(0)
        ..add(square(0, 0, 10), [0], [5], 2, 3, const Rgba(0, 0, 0, 1));
      expect(sunk.finish(), isNull);
    },
  );

  test('buildings survive the trip between isolates', () {
    final built = (ExtrusionBuilder(
      1,
    )..add(square(0, 0, 10), [0], [5], 5, 0, const Rgba(0, 0, 1, 1))).finish()!;
    final back = BuiltExtrusion.fromMessage(built.toMessage());
    expect(back.info, built.info);
    expect(back.walls, built.walls);
  });
}
