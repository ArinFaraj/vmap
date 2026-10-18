import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/subdivide.dart';

double _area(List<double> v, List<int> idx, int width) {
  var sum = 0.0;
  for (var i = 0; i < idx.length; i += 3) {
    final a = idx[i] * width, b = idx[i + 1] * width, c = idx[i + 2] * width;
    sum +=
        ((v[b] - v[a]) * (v[c + 1] - v[a + 1]) -
                (v[c] - v[a]) * (v[b + 1] - v[a + 1]))
            .abs() /
        2;
  }
  return sum;
}

void main() {
  test('pieces keep the area and stay within a cell', () {
    final cut = Subdivider(2, 100);
    final src = Float32List.fromList([10, 10, 390, 30, 120, 350]);
    cut.add(src, 0, 1, 2);
    final whole = ((390 - 10) * (350 - 10) - (120 - 10) * (30 - 10)) / 2;
    expect(_area(cut.vertices, cut.indices, 2), closeTo(whole, 1e-6));
    for (var i = 0; i < cut.indices.length; i += 3) {
      final xs = [
        for (var k = 0; k < 3; k++) cut.vertices[cut.indices[i + k] * 2],
      ];
      final ys = [
        for (var k = 0; k < 3; k++) cut.vertices[cut.indices[i + k] * 2 + 1],
      ];
      final cx = (xs.reduce((a, b) => a + b) / 3 / 100).floor();
      final cy = (ys.reduce((a, b) => a + b) / 3 / 100).floor();
      for (var k = 0; k < 3; k++) {
        expect(xs[k], inInclusiveRange(cx * 100 - 1e-9, cx * 100 + 100 + 1e-9));
        expect(ys[k], inInclusiveRange(cy * 100 - 1e-9, cy * 100 + 100 + 1e-9));
      }
    }
  });

  test('extra values follow the position', () {
    final cut = Subdivider(3, 50);
    final src = Float32List.fromList([0, 0, 0, 200, 0, 200, 0, 200, 0]);
    cut.add(src, 0, 1, 2);
    for (var i = 0; i < cut.vertexCount; i++) {
      final v = cut.vertices.sublist(i * 3, i * 3 + 3);
      expect(v[2], closeTo(v[0], 1e-9));
    }
  });

  test('two triangles sharing an edge cut it at the same points', () {
    final cut = Subdivider(2, 64);
    final src = Float32List.fromList([0, 0, 300, 100, 20, 280, 310, 330]);
    cut
      ..add(src, 0, 1, 2)
      ..add(src, 2, 1, 3);
    final onEdge = <String, int>{};
    for (var i = 0; i < cut.vertexCount; i++) {
      final x = cut.vertices[i * 2], y = cut.vertices[i * 2 + 1];
      final t = (x - 300) / (20 - 300);
      if ((y - (100 + t * 180)).abs() < 1e-6 && t > 1e-6 && t < 1 - 1e-6) {
        final key = '${x.toStringAsFixed(9)},${y.toStringAsFixed(9)}';
        onEdge[key] = (onEdge[key] ?? 0) + 1;
      }
    }
    expect(onEdge, isNotEmpty);
    for (final count in onEdge.values) {
      expect(count, greaterThanOrEqualTo(2));
    }
  });

  test('granularity follows MapLibre', () {
    expect(fillCells(0), 128);
    expect(fillCells(7), 2);
    expect(fillCells(12), 2);
    expect(lineCells(0), 512);
    expect(lineCells(10), 0);
  });
}
