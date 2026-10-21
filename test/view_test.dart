import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/mercator.dart';
import 'package:vmap/src/map_camera.dart' show MapCameraPosition;
import 'package:vmap/src/view.dart' show EdgeInsets2, MapView;

MapView _view({
  double pitch = 0,
  double bearing = 0,
  double roll = 0,
  double zoom = 15.5,
}) => MapView(
  centerX: worldX(44.0092),
  centerY: worldY(36.1912),
  zoom: zoom,
  width: 1080,
  height: 2200,
  pitch: pitch,
  bearing: bearing,
  roll: roll,
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

  test('the camera looks at the middle of what the padding leaves', () {
    final flat = MapView(
      centerX: 0.5,
      centerY: 0.5,
      zoom: 4,
      width: 512,
      height: 256,
      pad: const EdgeInsets2(top: 20, left: 125, bottom: 10, right: 15),
    );
    expect(flat.screenCenter.x, (125 + 512 - 15) / 2);
    expect(flat.screenCenter.y, (20 + 256 - 10) / 2);
    final at = flat.project(flat.center.x, flat.center.y);
    expect(at.x, flat.screenCenter.x);
    expect(at.y, flat.screenCenter.y);
    final back = flat.unproject(flat.screenCenter.x, flat.screenCenter.y)!;
    expect(back.x, closeTo(flat.center.x, 1e-6));
    expect(back.y, closeTo(flat.center.y, 1e-6));
  });

  test('padding moves the ground by half the room it adds', () {
    MapView padded(double left) => MapView(
      centerX: 0.5,
      centerY: 0.5,
      zoom: 4,
      width: 512,
      height: 256,
      pad: EdgeInsets2(left: left),
    );
    final before = padded(0);
    final after = padded(100);
    final b = before.project(before.center.x, before.center.y);
    final a = after.project(after.center.x, after.center.y);
    expect(a.x - b.x, 50.0);
    expect(a.y, b.y);
  });

  test('padding keeps the height the camera is at', () {
    // MapLibre measures the height from the whole screen, so the
    // perspective is unchanged; only where the camera looks moves.
    MapView padded(double left) => MapView(
      centerX: 0.5,
      centerY: 0.5,
      zoom: 4,
      width: 512,
      height: 256,
      pad: EdgeInsets2(left: left),
    );
    expect(
      padded(0).cameraToCenterDistance,
      padded(125).cameraToCenterDistance,
    );
  });

  test('padding past the screen is clamped to it', () {
    final v = MapView(
      centerX: 0.5,
      centerY: 0.5,
      zoom: 4,
      width: 512,
      height: 256,
      pad: const EdgeInsets2(left: 900, right: 900),
    );
    expect(v.screenCenter.x, 256.0);
  });

  test('clipMatrix and matrix put a point in the same place under padding', () {
    // The canvas renderer draws through matrix() and the GPU one through
    // clipMatrix(). They must agree, with padding as much as without it,
    // or the two tiers would draw the map in different places.
    ({double x, double y}) screenOf(List<double> m, double x, double y) {
      final w = m[3] * x + m[7] * y + m[15];
      return (
        x: (m[0] * x + m[4] * y + m[12]) / w,
        y: (m[1] * x + m[5] * y + m[13]) / w,
      );
    }

    for (final pad in const [
      EdgeInsets2.zero,
      EdgeInsets2(top: 20, left: 125, bottom: 10, right: 15),
      EdgeInsets2(left: 100),
      EdgeInsets2(top: 40, bottom: 40),
      EdgeInsets2(top: 5, right: 5, bottom: 5, left: 5),
    ]) {
      for (final pitch in [0.0, 30.0, 60.0]) {
        final view = _view(pitch: pitch, bearing: 17).copyWithPad(pad);
        final screen = view.matrix();
        final clip = view.clipMatrix();
        for (final dx in const [-40.0, 0.0, 60.0]) {
          for (final dy in const [-10.0, 25.0]) {
            // Far points lose precision in single precision on the GPU,
            // and clip and screen paths round differently; the tolerance
            // is in pixels rather than exact.
            final p = (x: view.center.x + dx, y: view.center.y + dy);
            final s = screenOf(screen, p.x, p.y);
            final w = clip[3] * p.x + clip[7] * p.y + clip[15];
            final cx = (clip[0] * p.x + clip[4] * p.y + clip[12]) / w;
            final cy = (clip[1] * p.x + clip[5] * p.y + clip[13]) / w;
            // The canvas gives screen pixels, y down; clip space is -1..1,
            // y up.
            expect(
              2 * (s.x - (cx + 1) * view.width / 2) / 2,
              lessThan(0.05),
              reason: 'pad $pad pitch $pitch p $p x',
            );
            expect(
              2 * (view.height / 2 - s.y - (1 - cy) * view.height / 2) / 2,
              lessThan(0.05),
              reason: 'pad $pad pitch $pitch p $p y',
            );
          }
        }
      }
    }
  });

  test('a roll turns the picture counterclockwise about the centre', () {
    final flat = _view(pitch: 40, bearing: 20);
    final rolled = _view(pitch: 40, bearing: 20, roll: 90);
    final g = flat.unproject(740, 1100)!;
    final p = rolled.project(g.x, g.y);
    expect(p.x, closeTo(540, 1e-6));
    expect(p.y, closeTo(900, 1e-6));
  });

  test('a rolled view unprojects, projects and draws its points alike', () {
    final v = _view(pitch: 55, bearing: 130, roll: 35);
    final clip = v.clipMatrix();
    for (final (sx, sy) in screens) {
      final g = v.unproject(sx, sy);
      if (g == null) continue;
      final p = v.project(g.x, g.y);
      expect(p.x, closeTo(sx, 1e-6));
      expect(p.y, closeTo(sy, 1e-6));
      final m = _apply(v.matrix(), g.x, g.y);
      expect(m.x, closeTo(sx, 1e-6));
      expect(m.y, closeTo(sy, 1e-6));
      final w = clip[3] * g.x + clip[7] * g.y + clip[15];
      final cx = (clip[0] * g.x + clip[4] * g.y + clip[12]) / w;
      final cy = (clip[1] * g.x + clip[5] * g.y + clip[13]) / w;
      expect((cx + 1) * v.width / 2, closeTo(sx, 1e-3));
      expect((1 - cy) * v.height / 2, closeTo(sy, 1e-3));
    }
  });

  test('a picture taken with one camera warps onto the ground of another', () {
    MapView at(
      double lon,
      double lat,
      double zoom,
      double bearing,
      double pitch,
    ) => MapCameraPosition(
      latitude: lat,
      longitude: lon,
      zoom: zoom,
      bearing: bearing,
      pitch: pitch,
    ).view(400, 300);
    final from = at(44, 36.19, 14, 10, 40);
    for (final to in [
      at(44.001, 36.19, 14, 10, 40),
      at(44, 36.19, 14.3, 10, 40),
      at(44, 36.19, 14, 14, 40),
      at(44, 36.19, 14, 10, 44),
      at(44.002, 36.189, 14.2, 7, 35),
    ]) {
      final m = to.warpFrom(from)!;
      for (final (sx, sy) in [(50.0, 280.0), (200.0, 200.0), (380.0, 150.0)]) {
        final ground = from.unproject(sx, sy)!;
        final want = to.project(
          ground.x / from.worldSize * to.worldSize,
          ground.y / from.worldSize * to.worldSize,
        );
        final w = m[3] * sx + m[7] * sy + m[15];
        expect((m[0] * sx + m[4] * sy + m[12]) / w, closeTo(want.x, 1e-3));
        expect((m[1] * sx + m[5] * sy + m[13]) / w, closeTo(want.y, 1e-3));
      }
    }
  });
}
