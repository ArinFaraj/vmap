import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/mercator.dart';
import 'package:vmap/src/view.dart';

MapView _view({double pitch = 0, double bearing = 0, double zoom = 15.5}) =>
    MapView(
      centerX: worldX(44.0092),
      centerY: worldY(36.1912),
      zoom: zoom,
      width: 1080,
      height: 2200,
      pitch: pitch,
      bearing: bearing,
    );

({double x, double y}) _apply(List<double> m, double x, double y) {
  final w = m[3] * x + m[7] * y + m[15];
  return (
    x: (m[0] * x + m[4] * y + m[12]) / w,
    y: (m[1] * x + m[5] * y + m[13]) / w,
  );
}

void main() {
  const screens = [(0.0, 0.0), (1080.0, 0.0), (540.0, 1100.0), (13.0, 2199.0)];

  test('the centre of the world stays at the centre of the screen', () {
    for (final pitch in [0.0, 30.0, 60.0]) {
      final v = _view(pitch: pitch, bearing: 37);
      final c = v.project(v.center.x, v.center.y);
      expect(c.x, closeTo(540, 1e-6));
      expect(c.y, closeTo(1100, 1e-6));
    }
  });

  test('a screen point unprojected and projected again comes back', () {
    for (final pitch in [0.0, 45.0, 60.0]) {
      for (final bearing in [0.0, 90.0, 217.0]) {
        final v = _view(pitch: pitch, bearing: bearing);
        for (final (sx, sy) in screens) {
          final g = v.unproject(sx, sy)!;
          final p = v.project(g.x, g.y);
          expect(p.x, closeTo(sx, 1e-6));
          expect(p.y, closeTo(sy, 1e-6));
        }
      }
    }
  });

  test('the canvas matrix agrees with project, from any origin', () {
    final v = _view(pitch: 50, bearing: 120);
    for (final (sx, sy) in screens) {
      final g = v.unproject(sx, sy)!;
      final originX = g.x - 300, originY = g.y + 70;
      final p = _apply(v.matrix(originX: originX, originY: originY), 300, -70);
      expect(p.x, closeTo(sx, 1e-6));
      expect(p.y, closeTo(sy, 1e-6));
    }
  });

  test('the top of a tilted screen is farther and its labels smaller', () {
    final v = _view(pitch: 60);
    final top = v.unproject(540, 0)!;
    final bottom = v.unproject(540, 2200)!;
    expect(v.depth(top.x, top.y), greaterThan(1));
    expect(v.depth(bottom.x, bottom.y), lessThan(1));
    expect(v.perspectiveRatio(top.x, top.y), lessThan(1));
  });

  test(
    'pitch is held at MapLibre\'s most, the ground ending short of the horizon',
    () {
      final steep = _view(pitch: 89);
      expect(steep.pitch, MapView.maxPitch);
      expect(steep.horizonY, greaterThan(0));
      expect(steep.unproject(540, steep.horizonY), isNotNull);
      expect(_view(pitch: 45).horizonY, lessThan(0));
    },
  );

  test('a flat view is covered by tiles of its own zoom only', () {
    final tiles = _view().cover(maxZoom: 22);
    expect(tiles.map((t) => t.z).toSet(), {15});
    expect(tiles, hasLength(8));
  });

  test('a tilted view uses coarser tiles far away and stays small', () {
    for (final pitch in [45.0, 60.0]) {
      final tiles = _view(
        pitch: pitch,
        bearing: 37,
      ).cover(maxZoom: 22, variableZoom: true);
      expect(tiles.map((t) => t.z).toSet(), containsAll([14, 15]));
      expect(tiles.length, lessThan(40));
    }
  });

  test('tiles come nearest first', () {
    final tiles = _view(pitch: 60).cover(maxZoom: 22);
    for (var i = 1; i < tiles.length; i++) {
      expect(tiles[i].distance, greaterThanOrEqualTo(tiles[i - 1].distance));
    }
  });

  test('the cover stops at the source maximum zoom', () {
    final tiles = _view(zoom: 18).cover(maxZoom: 14);
    expect(tiles.map((t) => t.z).toSet(), {14});
  });
}
