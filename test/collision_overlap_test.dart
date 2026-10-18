import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/collision_boxes.dart';

void main() {
  test('a cooperative box overlaps any box but one that overlaps nothing', () {
    final boxes = CollisionBoxes()
      ..take(10, 10, 8, 8, 0, pad: 0, never: false)
      ..take(40, 10, 8, 8, 0, pad: 0);
    expect(boxes.collides(10, 10, 8, 8, 0, pad: 0, cooperative: true), isFalse);
    expect(boxes.collides(40, 10, 8, 8, 0, pad: 0, cooperative: true), isTrue);
    expect(boxes.collides(10, 10, 8, 8, 0, pad: 0), isTrue);
  });
}
