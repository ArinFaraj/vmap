import 'dart:math' as math;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/globe.dart';
import 'package:vmap/src/mercator.dart' as mercator;
import 'package:vmap/src/view.dart';

MapView _view({
  double lng = 0,
  double lat = 0,
  double zoom = 1,
  double bearing = 0,
  double pitch = 0,
}) => MapView(
  centerX: mercator.worldX(lng),
  centerY: mercator.worldY(lat),
  zoom: zoom,
  width: 512,
  height: 512,
  bearing: bearing,
  pitch: pitch,
);

void main() {
  test('the centre lands on the middle of the screen and faces the camera', () {
    for (final v in [
      _view(),
      _view(lng: 40, lat: 30, bearing: 20, pitch: 30),
      _view(lng: -120, lat: -60, zoom: 3),
    ]) {
      final globe = Globe(v)..projectTo(v.centerX, v.centerY);
      expect(globe.outX, closeTo(256, 1e-6));
      expect(globe.outY, closeTo(256, 1e-6));
      expect(globe.outFaces, isTrue);
    }
  });

  test('at zoom 1 the sphere is as wide on screen as MapLibre draws it', () {
    final globe = Globe(_view());
    expect(globe.radius, closeTo(1024 / (2 * math.pi), 1e-9));
    globe.projectSphere(1, 0, 0);
    final d = 0.5 / math.tan(MapView.defaultFov / 2) * 512;
    expect(
      globe.outX,
      closeTo(256 + globe.radius * d / (d + globe.radius), 1e-6),
    );
    expect(globe.outFaces, isFalse);
  });

  test('the far side faces away', () {
    final globe = Globe(_view(lng: 30));
    final (x, y, z) = Globe.surface(mercator.worldX(-150), 0.5);
    expect(globe.faces(x, y, z), isFalse);
  });

  test('north is up and east is right without bearing', () {
    final globe = Globe(_view(zoom: 2))
      ..projectTo(mercator.worldX(10), mercator.worldY(0));
    expect(globe.outX, greaterThan(256));
    globe.projectTo(0.5, mercator.worldY(10));
    expect(globe.outY, lessThan(256));
  });

  test('unproject undoes project', () {
    final v = _view(lng: 20, lat: 40, zoom: 2, bearing: 30, pitch: 40);
    final globe = Globe(v);
    final mx = mercator.worldX(25), my = mercator.worldY(35);
    globe.projectTo(mx, my);
    final back = globe.unproject(globe.outX, globe.outY)!;
    expect(back.x, closeTo(mx, 1e-9));
    expect(back.y, closeTo(my, 1e-9));
    expect(globe.unproject(0, 0), isNull);
  });

  test('a flat view keeps the scale of the flat map at its centre', () {
    final v = _view(zoom: 5, lat: 45);
    final globe = Globe(v);
    const step = 1e-6;
    globe.projectTo(v.centerX + step, v.centerY);
    final dx = globe.outX - 256;
    expect(dx, closeTo(step * v.worldSize, 1e-3 * step * v.worldSize));
  });

  test('cover takes the visible hemisphere at the view zoom', () {
    final tiles = Globe(_view()).cover(maxZoom: 14);
    expect(tiles.every((t) => t.z == 1), isTrue);
    expect(tiles, hasLength(4));
    final far = Globe(_view(zoom: 3, pitch: 60)).cover(maxZoom: 14);
    expect(far.first.z, 3);
    expect(far.any((t) => t.z < 3), isTrue);
  });

  test('zoomed out, the centre reaches the pole only while the cap fits', () {
    MapView atPole(double zoom) => MapView(
      centerX: 0.5,
      centerY: 0,
      zoom: zoom,
      width: 512,
      height: 512,
      latitude: 90,
    );
    final out = Globe(atPole(-0.5))..projectSphere(0, 1, 0);
    expect(out.outX, closeTo(256, 1e-6));
    expect(out.outY, closeTo(256, 1e-6));
    expect(
      Globe.maxLatitude(atPole(4).worldSize, 512, 512),
      mercator.maxLatitude,
    );
    final near = Globe(atPole(4))..projectSphere(0, 1, 0);
    expect(near.outY, lessThan(200));
  });
}
