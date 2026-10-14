import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/label_view.dart';
import 'package:vmap/src/view.dart';

void main() {
  final view = MapView(
    centerX: 0.5,
    centerY: 0.5,
    zoom: 12,
    width: 400,
    height: 800,
    pitch: 60,
  );
  final pixel = 1 / view.worldSize;
  final label = (x: 0.5, y: 0.5 - 600 * pixel);

  LabelView over(double Function(double wx, double wy) ground) => LabelView()
    ..tilted = view
    ..ground = ground;

  test('flat ground hides nothing', () {
    expect(over((_, _) => 0).behindHill(label.x, label.y), isFalse);
  });

  test('a ridge between the camera and a label hides it', () {
    final ridge = over(
      (_, wy) => (wy - (0.5 - 300 * pixel)).abs() < 60 * pixel ? 400 : 0,
    );
    expect(ridge.behindHill(label.x, label.y), isTrue);
  });

  test('a label is not hidden by the slope it stands on', () {
    final slope = over((_, wy) => wy < label.y + 30 * pixel ? 40 : 0);
    expect(slope.behindHill(label.x, label.y), isFalse);
  });

  test('without terrain no label is behind a hill', () {
    expect(LabelView().behindHill(label.x, label.y), isFalse);
  });
}
