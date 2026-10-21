import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/tessellate.dart';

void main() {
  test('a fill kept for an outline gives each ring edge once', () {
    final square = Float64List.fromList([0, 0, 10, 0, 10, 10, 0, 10]);
    final chunk = (FillMesher(
      outlines: true,
    )..addPolygon(square, 0, 4, const [])).finish().single;
    expect(chunk.outline, [0, 1, 1, 2, 2, 3, 3, 0]);
    final plain = (FillMesher()..addPolygon(square, 0, 4, const []))
        .finish()
        .single;
    expect(plain.outline, isNull);
  });
}
