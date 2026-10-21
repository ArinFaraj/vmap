import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/tessellate.dart';

void main() {
  test('a straight two-point line is one quad plus two round caps', () {
    final mesher = LineMesher()
      ..addLine(
        Float64List.fromList([0, 0, 10, 0]),
        0,
        2,
        0,
        cap: LineCap.round,
      );
    final chunk = mesher.finish().single;
    expect(chunk.indices.length, 6 + 2 * 7 * 3);
    expect(
      chunk.positions.length.isEven && (chunk.positions.length ~/ 2).isEven,
      isTrue,
    );
    expect(chunk.extrusions!.length, chunk.positions.length);
  });

  test('a gentle bend shares two mitred vertices instead of a fan', () {
    final mesher = LineMesher()
      ..addLine(
        Float64List.fromList([0, 0, 10, 0, 20, 2]),
        0,
        3,
        0,
        cap: LineCap.butt,
      );
    final chunk = mesher.finish().single;
    expect(chunk.indices.length, 12 + 12);
    expect(chunk.positions.length ~/ 2, 10);
  });

  test('a right-angle bend gets a fan on the outside', () {
    final mesher = LineMesher()
      ..addLine(
        Float64List.fromList([0, 0, 10, 0, 10, 10]),
        0,
        3,
        0,
        cap: LineCap.butt,
      );
    expect(mesher.finish().single.indices.length, greaterThan(12));
  });

  test('a square fills with two triangles', () {
    final mesher = FillMesher()
      ..addPolygon(
        Float64List.fromList([0, 0, 10, 0, 10, 10, 0, 10]),
        0,
        4,
        const [],
      );
    expect(mesher.finish().single.indices.length, 6);
  });
}
