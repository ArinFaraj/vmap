import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/canvas/zoom_history.dart';

void main() {
  const fade = ZoomHistory.fadeMicros;

  test('a map that has not crossed a level shows its own dashes', () {
    final history = ZoomHistory()..update(3.4, 1000);
    expect(history.fade.mix, 1);
    expect(history.fading, isFalse);
    history.update(3.9, 2000);
    expect(history.fade.mix, 1);
  });

  test('zooming in past a level fades from the level below, twice as long', () {
    final history = ZoomHistory()
      ..update(3.9, 0)
      ..update(4.25, fade);
    expect(history.fade.fromZoom, 3);
    expect(history.fade.fromScale, 2);
    expect(history.fade.mix, closeTo(0.25, 1e-9));
    expect(history.fading, isTrue);

    history.update(4.25, fade + fade ~/ 2);
    expect(history.fade.mix, closeTo(0.25 + 0.75 * 0.5, 1e-9));

    history.update(4.25, fade * 2);
    expect(history.fade.mix, 1);
    expect(history.fading, isFalse);
  });

  test('zooming out past a level fades from the level above, half as long', () {
    final history = ZoomHistory()
      ..update(5.1, 0)
      ..update(4.75, fade);
    expect(history.fade.fromZoom, 5);
    expect(history.fade.fromScale, 0.5);
    expect(history.fade.mix, closeTo(0.25, 1e-9));

    history.update(4.75, fade * 2);
    expect(history.fade.mix, 1);
  });

  test('a whole zoom shows its own dashes whichever way it was reached', () {
    final history = ZoomHistory()
      ..update(5.5, 0)
      ..update(5, fade * 2);
    expect(history.fade.mix, 1);
  });
}
