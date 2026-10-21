import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/labels/collision_boxes.dart';

void main() {
  test('a box overlapping one taken hits it, one beside it does not', () {
    final boxes = CollisionBoxes()..add(10, 10, 50, 30);
    expect(boxes.hits(40, 20, 80, 60), isTrue);
    expect(boxes.hits(50, 10, 90, 30), isFalse, reason: 'edges touching');
    expect(boxes.hits(200, 200, 220, 220), isFalse);
  });

  test('a box spanning many cells is found from any of them', () {
    final boxes = CollisionBoxes()..add(-300, -20, 900, 20);
    expect(boxes.hits(-290, 0, -280, 10), isTrue);
    expect(boxes.hits(850, 0, 860, 10), isTrue);
    expect(boxes.hits(400, 100, 410, 110), isFalse);
  });

  test('a box can be left out of the test, and clear forgets all', () {
    final boxes = CollisionBoxes();
    final own = boxes.add(0, 0, 10, 10);
    expect(boxes.hits(5, 5, 15, 15, except: own), isFalse);
    boxes.add(8, 8, 20, 20);
    expect(boxes.hits(5, 5, 15, 15, except: own), isTrue);
    boxes.clear();
    expect(boxes.hits(5, 5, 15, 15), isFalse);
  });

  test('many boxes are each tested once and found', () {
    final boxes = CollisionBoxes();
    for (var i = 0; i < 2000; i++) {
      boxes.add(i * 30.0, 0, i * 30.0 + 20, 20);
    }
    expect(boxes.hits(59975, 5, 59980, 10), isTrue);
    expect(boxes.hits(59992, 5, 59998, 10), isFalse);
  });

  test('a box of one group is unseen by another, group 0 by all', () {
    final boxes = CollisionBoxes()..add(0, 0, 10, 10);
    boxes
      ..group = 1
      ..add(20, 0, 30, 10);
    expect(boxes.hits(22, 2, 28, 8), isTrue);
    expect(boxes.hits(2, 2, 8, 8), isTrue);
    boxes.group = 2;
    expect(boxes.hits(22, 2, 28, 8), isFalse);
    expect(boxes.hits(2, 2, 8, 8), isTrue);
  });

  test('a circle is weighed as a circle, against boxes and circles', () {
    final boxes = CollisionBoxes()..add(0, 0, 10, 10);
    // Beside the box's corner, inside its bounding square but not the box.
    expect(boxes.hitsCircle(14, 14, 5), isFalse);
    expect(boxes.hitsCircle(13, 13, 5), isTrue);
    boxes.addCircle(100, 100, 10);
    expect(boxes.hitsCircle(115, 100, 6), isTrue);
    expect(boxes.hitsCircle(115, 115, 10), isFalse);
    // A box in the circle's bounding square's corner clears the circle.
    expect(boxes.hits(91, 91, 92, 92), isFalse);
    expect(boxes.hits(98, 98, 102, 102), isTrue);
  });
}
