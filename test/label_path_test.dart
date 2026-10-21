import 'dart:math' as math;
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/label_path.dart';

void main() {
  final corner = Float64List.fromList([0, 0, 10, 0, 10, 10]);

  double gap(Float64List strips, int i) {
    final dx = strips[i * 3 + 3] - strips[i * 3];
    final dy = strips[i * 3 + 4] - strips[i * 3 + 1];
    return math.sqrt(dx * dx + dy * dy);
  }

  test('slices sit one step apart whatever the step', () {
    for (final step in [0.5, 1.0, 2.0]) {
      final out = Float64List(12);
      layStrips(corner, 5, 4, step, out);
      for (var i = 0; i < 3; i++) {
        expect(gap(out, i), closeTo(step, 1e-9));
      }
      expect(out[3] + (out[6] - out[3]) / 2, closeTo(5, 1e-9));
    }
  });

  test('slices turn with the line', () {
    final out = Float64List(12);
    layStrips(corner, 10, 4, 2, out);
    expect(out[2], closeTo(0, 1e-9));
    expect(out[11], closeTo(math.pi / 2, 1e-9));
    expect(out[9], closeTo(10, 1e-9));
    expect(out[10], closeTo(3, 1e-9));
  });

  test('a text longer than the line carries on straight', () {
    final out = Float64List(6);
    layStrips(Float64List.fromList([0, 0, 4, 0]), 2, 2, 10, out);
    expect(out[0], closeTo(-3, 1e-9));
    expect(out[3], closeTo(7, 1e-9));
    expect(out[1], 0);
    expect(out[5], 0);
  });

  test('a moved line keeps the glyph spacing on the inside of a bend', () {
    // Going right then down, so the right of the line is inside the bend.
    final line = offsetPath(corner, 5, 2);
    final out = Float64List(3);
    line.at(0, out);
    expect([out[0], out[1]], [5, 2]);
    line.at(3, out);
    expect(out[0], closeTo(8, 1e-9));
    expect(out[1], closeTo(2, 1e-9));
    line.at(4, out);
    expect(out[0], closeTo(8, 1e-9));
    expect(out[1], closeTo(3, 1e-9));
  });

  test('a middle on a corner starts each half beside its own segment', () {
    final line = offsetPath(corner, 10, -2);
    final out = Float64List(3);
    line.at(-1, out);
    expect([out[0], out[1]], [9, -2]);
    line.at(1, out);
    expect([out[0], out[1]], [12, 1]);
  });

  test('no offset leaves the line as it is', () {
    final line = offsetPath(corner, 4, 0);
    expect(line.path, same(corner));
    expect(line.middle, 4);
    expect(line.gap, 0);
  });
}
