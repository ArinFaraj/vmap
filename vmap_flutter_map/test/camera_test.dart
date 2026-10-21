// ignore_for_file: implementation_imports

import 'dart:ui';

import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/map_camera.dart';
import 'package:vmap/src/mercator.dart';
import 'package:vmap/vmap.dart';
import 'package:vmap_flutter_map/src/layer.dart';

void main() {
  test('the engine sees a place where flutter_map shows it, turned too', () {
    const size = Size(400, 700);
    const places = [LatLng(36.20, 44.03), LatLng(36.17, 43.99)];
    for (final rotation in [0.0, 30.0, -125.0]) {
      final flutterMap = MapCamera(
        crs: const Epsg3857(),
        center: const LatLng(36.19, 44.01),
        zoom: 13.4,
        rotation: rotation,
        nonRotatedSize: size,
      );
      final view = cameraOf(flutterMap).view(size.width, size.height);
      for (final place in places) {
        final expected = flutterMap.latLngToScreenOffset(place);
        final seen = view.project(
          worldX(place.longitude) * view.worldSize,
          worldY(place.latitude) * view.worldSize,
        );
        expect(seen.x, closeTo(expected.dx, 1e-6));
        expect(seen.y, closeTo(expected.dy, 1e-6));
      }
    }
  });
}
