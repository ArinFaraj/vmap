import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';

const _erbil = MapCameraPosition(
  latitude: 36.1912,
  longitude: 44.0092,
  zoom: 15,
);
const _sulaymaniyah = MapCameraPosition(
  latitude: 35.5613,
  longitude: 45.4374,
  zoom: 14,
  pitch: 50,
  bearing: 40,
);

void main() {
  test('a flight starts and ends where asked', () {
    final path = FlyPath(_erbil, _sulaymaniyah, width: 1080, height: 2200);
    expect(path.at(0).latitude, closeTo(_erbil.latitude, 1e-9));
    expect(path.at(1), _sulaymaniyah);
  });

  test('a long flight rises above both ends on the way', () {
    final path = FlyPath(_erbil, _sulaymaniyah, width: 1080, height: 2200);
    expect(path.at(0.5).zoom, lessThan(12));
    expect(path.duration, greaterThan(const Duration(seconds: 2)));
  });

  test('a flight that only zooms stays put and is short', () {
    final path = FlyPath(
      _erbil,
      _erbil.copyWith(zoom: 17),
      width: 1080,
      height: 2200,
    );
    expect(path.at(0.5).latitude, closeTo(_erbil.latitude, 1e-9));
    expect(path.at(0.5).zoom, closeTo(16, 1e-6));
    expect(path.duration, lessThan(const Duration(seconds: 1)));
  });

  test('a flight to where the camera already is takes no time', () {
    expect(
      FlyPath(_erbil, _erbil, width: 400, height: 800).duration,
      Duration.zero,
    );
  });

  test('zooming and turning about a point keeps the ground under it', () {
    for (final pitch in [0.0, 55.0]) {
      final from = _erbil.copyWith(pitch: pitch, bearing: 20);
      final view = from.view(1080, 2200);
      final to = from.around(view, 120, 300, newZoom: 16.3, turn: 25);
      final a = view.unproject(120, 300)!;
      final toView = to.view(1080, 2200);
      final b = toView.unproject(120, 300)!;
      expect(b.x / toView.worldSize, closeTo(a.x / view.worldSize, 1e-12));
      expect(b.y / toView.worldSize, closeTo(a.y / view.worldSize, 1e-12));
      expect(to.bearing, closeTo(45, 1e-9));
    }
  });

  test('dragging moves the ground with the finger, tilted too', () {
    final from = _erbil.copyWith(pitch: 45);
    final view = from.view(1080, 2200);
    final to = from.panned(view, 540, 1500, 700, 900);
    final a = view.unproject(540, 1500)!;
    final toView = to.view(1080, 2200);
    final b = toView.unproject(700, 900)!;
    expect(b.x, closeTo(a.x, 1e-6));
    expect(b.y, closeTo(a.y, 1e-6));
  });

  test('the default easing is the CSS ease curve', () {
    expect(defaultEasing(0), closeTo(0, 1e-6));
    expect(defaultEasing(0.5), closeTo(0.8024, 1e-3));
    expect(defaultEasing(1), closeTo(1, 1e-6));
  });

  test('a flat map zoomed out past the world zooms in to fill the screen', () {
    const far = MapCameraPosition(latitude: 30, longitude: 10, zoom: -2);
    final kept = far.constrained(512);
    expect(kept.zoom, closeTo(0, 1e-9));
    expect(kept.latitude, 0);
    expect(kept.longitude, 10);
  });

  test('a flat map is moved back from past the poles', () {
    const north = MapCameraPosition(latitude: 84, longitude: 0, zoom: 1);
    final kept = north.constrained(512);
    expect(kept.zoom, 1);
    expect(kept.worldY * 1024, closeTo(256, 1e-6));
  });

  test('a camera inside the world is kept as it is', () {
    const inside = MapCameraPosition(latitude: 36, longitude: 44, zoom: 5);
    expect(inside.constrained(800), same(inside));
  });

  test('a flight turns its roll on the way, not at the end', () {
    final path = FlyPath(
      _erbil,
      _sulaymaniyah.copyWith(roll: 20),
      width: 1080,
      height: 2200,
    );
    expect(path.at(0.5).roll, closeTo(10, 1e-9));
  });

  test('easing keeps the padding, roll and lens it is asked for', () async {
    final controller = VMapController(
      _erbil.copyWith(pad: const EdgeInsets2(bottom: 300)),
    );
    final to = _sulaymaniyah.copyWith(
      pad: const EdgeInsets2(bottom: 200, left: 40),
      roll: 12,
      fov: 0.9,
    );
    await controller.easeTo(to);
    expect(controller.camera.pad, to.pad);
    expect(controller.camera.roll, closeTo(12, 1e-9));
    expect(controller.camera.fov, closeTo(0.9, 1e-9));
  });
}
