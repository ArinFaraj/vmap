import 'dart:math' as math;
import 'dart:typed_data';

/// A point in world pixels: the world is [MapView.worldSize] pixels wide,
/// x east from 180 west, y south from the top.
typedef WorldPoint = ({double x, double y});

/// A tile picked by [MapView.cover], with the zoom its distance from the
/// camera asks for.
typedef CoverTile = ({int z, int x, int y, double distance});

/// Where the camera is and what it sees, in MapLibre's conventions: tiles
/// are 512 pixels at zoom 0, the camera stands
/// [cameraToCenterDistance] from the centre, and pitch tilts the ground
/// away from the viewer about the screen's centre.
class MapView {
  MapView({
    required this.centerX,
    required this.centerY,
    required this.zoom,
    required this.width,
    required this.height,
    this.bearing = 0,
    double pitch = 0,
    this.fov = defaultFov,
  }) : pitch = pitch.clamp(0, maxPitch) {
    final b = bearing * math.pi / 180;
    final p = this.pitch * math.pi / 180;
    _cosB = math.cos(b);
    _sinB = math.sin(b);
    _cosP = math.cos(p);
    _sinP = math.sin(p);
    worldSize = 512 * math.pow(2, zoom).toDouble();
    cameraToCenterDistance = 0.5 / math.tan(fov / 2) * height;
    _k = _sinP / cameraToCenterDistance;
    _cx = centerX * worldSize;
    _cy = centerY * worldSize;
  }

  /// MapLibre GL JS's default, from `transform_helper.ts`.
  static const double defaultFov = 0.6435011087932844;

  /// MapLibre's highest pitch. Past about 60 degrees the horizon is in
  /// view: the ground ends at [horizonY] and the sky is above it.
  static const double maxPitch = 85;

  /// Where the ground ends on the screen, in logical pixels from the top:
  /// MapLibre's mercator horizon, short of the true horizon so the ground
  /// drawn has a finite far edge. Negative while it is above the screen.
  late final double horizonY =
      height / 2 -
      cameraToCenterDistance *
          math.min(
            math.tan((90 - pitch) * math.pi / 180) * 0.85,
            math.tan((89.25 - pitch) * math.pi / 180),
          );

  /// The centre as a fraction of the world's width and height.
  final double centerX, centerY;
  final double zoom;

  /// Degrees clockwise: 90 puts east at the top of the screen.
  final double bearing;

  /// Degrees from looking straight down.
  final double pitch;

  /// Vertical field of view in radians.
  final double fov;
  final double width, height;

  late final double worldSize;
  late final double cameraToCenterDistance;
  late final double _cosB, _sinB, _cosP, _sinP, _k, _cx, _cy;

  WorldPoint get center => (x: _cx, y: _cy);

  /// Where the camera is: over world point [x], [y] at [height], all in
  /// world pixels.
  ({double x, double y, double height}) get eye {
    final back = cameraToCenterDistance * _sinP;
    return (
      x: _cx - _sinB * back,
      y: _cy + _cosB * back,
      height: cameraToCenterDistance * _cosP,
    );
  }

  /// Ground offset from the centre, turned so v points down the screen.
  (double, double) _uv(double x, double y) {
    final dx = x - _cx, dy = y - _cy;
    return (_cosB * dx + _sinB * dy, -_sinB * dx + _cosB * dy);
  }

  /// How far a ground point is from the camera relative to the centre: 1 at
  /// the centre, more behind it.
  double depth(double x, double y) =>
      1 - _k * (-_sinB * (x - _cx) + _cosB * (y - _cy));

  /// Where [projectTo] put the last point on the screen, and its [depth].
  double outX = 0, outY = 0, outDepth = 1;

  /// [project] without making an object: the result goes to [outX],
  /// [outY] and [outDepth]. Labels project thousands of points a frame,
  /// and a record per point kept the collector busy.
  ///
  /// A point [h] world pixels above the ground comes nearer the camera and
  /// rises on the screen with it.
  void projectTo(double x, double y, [double h = 0]) {
    final dx = x - _cx, dy = y - _cy;
    final u = _cosB * dx + _sinB * dy;
    final v = -_sinB * dx + _cosB * dy;
    final w = 1 - _k * v - h * _cosP / cameraToCenterDistance;
    outX = u / w + width / 2;
    outY = (_cosP * v - _sinP * h) / w + height / 2;
    outDepth = w;
  }

  /// Where a ground point lands on the screen, in logical pixels.
  ({double x, double y}) project(double x, double y) {
    final (u, v) = _uv(x, y);
    final w = 1 - _k * v;
    return (x: u / w + width / 2, y: _cosP * v / w + height / 2);
  }

  /// Where the camera stands on the ground, in world pixels.
  WorldPoint get cameraGround {
    final v = cameraToCenterDistance * _sinP;
    return (x: _cx - _sinB * v, y: _cy + _cosB * v);
  }

  /// [depth] for a point [z] world pixels above the ground: at or below
  /// zero the point is behind the camera.
  double depth3(double x, double y, double z) =>
      1 - _k * _uv(x, y).$2 - z * _cosP / cameraToCenterDistance;

  /// Where the point [x], [y] world pixels, [z] world pixels above the
  /// ground, lands on the screen.
  ({double x, double y}) project3(double x, double y, double z) {
    final (u, v) = _uv(x, y);
    final w = 1 - _k * v - z * _cosP / cameraToCenterDistance;
    return (x: u / w + width / 2, y: (_cosP * v - _sinP * z) / w + height / 2);
  }

  /// MapLibre's scale for labels at a ground point
  /// (`projection.ts`, `getPerspectiveRatio`).
  double perspectiveRatio(double x, double y) => 0.5 + 0.5 / depth(x, y);

  /// The ground point under a screen point, or null above the horizon.
  WorldPoint? unproject(double sx, double sy) {
    final rx = sx - width / 2, ry = sy - height / 2;
    final denominator = _cosP + ry * _k;
    if (denominator <= 1e-9) return null;
    final v = ry / denominator;
    final u = rx * (1 - _k * v);
    return (x: _cx + _cosB * u - _sinB * v, y: _cy + _sinB * u + _cosB * v);
  }

  /// A column-major matrix for `Canvas.transform` that draws world pixels,
  /// less [originX] and [originY], where they appear on the screen. Keeping
  /// the origin near the view keeps the numbers small enough for the GPU's
  /// single precision.
  Float64List matrix({double originX = 0, double originY = 0}) {
    final hw = width / 2, hh = height / 2;
    final m = _cosP - hh * _k;
    final v0 = _sinB * _cx - _cosB * _cy;
    final u0 = -(_cosB * _cx + _sinB * _cy);
    final a = _cosB + hw * _k * _sinB, b = _sinB - hw * _k * _cosB;
    final c = -m * _sinB, d = m * _cosB;
    final e = _k * _sinB, f = -_k * _cosB;
    final tx = u0 - hw * _k * v0 + hw;
    final ty = m * v0 + hh;
    final tw = 1 - _k * v0;
    return Float64List.fromList([
      a, c, 0, e, //
      b, d, 0, f, //
      0, 0, 1, 0, //
      tx + a * originX + b * originY,
      ty + c * originX + d * originY,
      0,
      tw + e * originX + f * originY,
    ]);
  }

  /// A column-major matrix from world pixels less [originX], [originY], with
  /// z the height above the ground in world pixels, to clip space: x and y
  /// as the screen shows them, y up, and depth from 0 at [near] to 1 at
  /// [far], both as multiples of the camera's distance to the centre.
  Float64List clipMatrix({
    double originX = 0,
    double originY = 0,
    double near = 0.05,
    double far = 20,
  }) {
    final u0 = -(_cosB * _cx + _sinB * _cy) + _cosB * originX + _sinB * originY;
    final v0 = _sinB * _cx - _cosB * _cy - _sinB * originX + _cosB * originY;
    final w = width, h = height, d = cameraToCenterDistance;
    final a = far / (far - near), b = near * far / (near - far);
    final wx = _k * _sinB, wy = -_k * _cosB, wz = -_cosP / d, wc = 1 - _k * v0;
    return Float64List.fromList([
      2 * _cosB / w, 2 * _cosP * _sinB / h, a * wx, wx, //
      2 * _sinB / w, -2 * _cosP * _cosB / h, a * wy, wy,
      0, 2 * _sinP / h, a * wz, wz,
      2 * u0 / w, -2 * _cosP * v0 / h, a * wc + b, wc,
    ]);
  }

  /// How far MapLibre's far plane lies along the camera's line of sight,
  /// in world pixels: it reaches twice the angle up to [horizonY], so the
  /// ground covers the lowest pixels of the sky.
  late final double farDistance = () {
    final p = pitch * math.pi / 180;
    final d = cameraToCenterDistance;
    final ground = math.pi / 2 + p;
    double reach(double angle) =>
        math.sin(angle) *
        d /
        math.sin((math.pi - ground - angle).clamp(0.01, math.pi - 0.01));
    final toHorizon = math.atan((height / 2 - horizonY) / d);
    const least = (90 - 89.25) * math.pi / 180;
    return (math.sin(p) *
                math.min(
                  reach(fov / 2),
                  reach(toHorizon > least ? 2 * toHorizon : least),
                ) +
            d) *
        1.01;
  }();

  /// Where the far plane cuts the ground on the screen, in logical pixels
  /// from the top; negative while that is above the screen.
  late final double groundTopY = pitch == 0
      ? -double.infinity
      : height / 2 +
            cameraToCenterDistance *
                _cosP /
                _sinP *
                (cameraToCenterDistance / farDistance - 1);

  /// The ground the screen shows, as the four corners in world pixels,
  /// clockwise from the top left, its far edge at [groundTopY] when that
  /// is on the screen. With [beyond], over raised ground, the far edge is
  /// that many pixels above the screen's top instead, still under the
  /// horizon: hills there rise into view, as MapLibre's far plane, measured
  /// from sea level, lets them.
  List<WorldPoint> ground({double beyond = 0}) {
    final far = beyond > 0
        ? math.max(
            -beyond,
            height / 2 - cameraToCenterDistance * _cosP / _sinP + 1,
          )
        : math.max(0.0, groundTopY);
    return [
      unproject(0, far)!,
      unproject(width, far)!,
      unproject(width, height)!,
      unproject(0, height)!,
    ];
  }

  /// The tiles that cover the ground in view. As MapLibre covers a map,
  /// every tile is at the view's zoom unless [variableZoom], which MapLibre
  /// allows with terrain, or the view is pitched past 60 degrees: then each
  /// tile is at the zoom its distance from the camera asks for, by MapLibre's
  /// `calculateTileZoom`. Tiles off the [ground] reaching [beyond] the
  /// screen's top are left out. Each copy of the world in view has its own
  /// columns, counted on past the world's edge, not wrapped.
  List<CoverTile> cover({
    required int maxZoom,
    int minZoom = 0,
    double hold = 0,
    bool variableZoom = false,
    double beyond = 0,
  }) {
    final quad = ground(beyond: beyond);
    final (x: camX, y: camY, height: camH) = eye;
    final top = math.min((zoom + hold).floor(), maxZoom);
    final out = <CoverTile>[];
    final tileZoom = variableZoom || pitch > 60 ? _TileZoom(this) : null;

    void visit(int z, int x, int y) {
      final span = worldSize / (1 << z);
      final left = x * span, upper = y * span;
      if (!_quadMeetsBox(quad, left, upper, left + span, upper + span)) return;
      final nx = (camX - left).clamp(0, span) + left;
      final ny = (camY - upper).clamp(0, span) + upper;
      final ddx = nx - camX, ddy = ny - camY;
      final flat = math.sqrt(ddx * ddx + ddy * ddy);
      final distance = math.sqrt(flat * flat + camH * camH);
      final wanted = tileZoom == null
          ? top
          : tileZoom.at(zoom + hold, flat, camH).floor();
      if (z >= top || (z >= minZoom && z >= wanted)) {
        out.add((z: z, x: x, y: y, distance: distance));
        return;
      }
      for (var j = 0; j < 2; j++) {
        for (var i = 0; i < 2; i++) {
          visit(z + 1, x * 2 + i, y * 2 + j);
        }
      }
    }

    // A tilted view's ground can reach far past the horizon; one copy of
    // the world each side of the centre's is as far as tiles are drawn.
    final xs = [for (final p in quad) p.x / worldSize];
    final first = math.max(xs.reduce(math.min).floor(), -1);
    final last = math.min(xs.reduce(math.max).floor(), 1);
    for (var copy = first; copy <= last; copy++) {
      visit(0, copy, 0);
    }
    out.sort((a, b) => a.distance.compareTo(b.distance));
    return out;
  }

  /// Whether a convex quadrilateral and an axis-aligned box overlap, by
  /// looking for an axis that separates them.
  static bool _quadMeetsBox(
    List<WorldPoint> quad,
    double left,
    double top,
    double right,
    double bottom,
  ) {
    var minX = double.infinity, maxX = -double.infinity;
    var minY = double.infinity, maxY = -double.infinity;
    for (final p in quad) {
      minX = math.min(minX, p.x);
      maxX = math.max(maxX, p.x);
      minY = math.min(minY, p.y);
      maxY = math.max(maxY, p.y);
    }
    if (maxX < left || minX > right || maxY < top || minY > bottom) {
      return false;
    }
    final n = quad.length;
    for (var i = 0; i < n; i++) {
      final a = quad[i], b = quad[(i + 1) % n];
      final nx = b.y - a.y, ny = a.x - b.x;
      var quadSide = 0.0;
      for (var j = 0; j < n; j++) {
        final d = (quad[j].x - a.x) * nx + (quad[j].y - a.y) * ny;
        if (d.abs() > quadSide.abs()) quadSide = d;
      }
      final ax = a.x, ay = a.y;
      if (((left - ax) * nx + (top - ay) * ny) * quadSide < 0 &&
          ((right - ax) * nx + (top - ay) * ny) * quadSide < 0 &&
          ((right - ax) * nx + (bottom - ay) * ny) * quadSide < 0 &&
          ((left - ax) * nx + (bottom - ay) * ny) * quadSide < 0) {
        return false;
      }
    }
    return true;
  }
}

/// MapLibre's `createCalculateTileZoomFunction` with its defaults, 9.314
/// zoom levels on screen at most and a tile count ratio of 3, for one
/// view: the zoom a tile asks for at a distance from the camera.
class _TileZoom {
  _TileZoom(MapView view)
    : _fov = view.fov,
      _centre = view.cameraToCenterDistance,
      _behaviour = _behaviourFor(view.fov) {
    final half = _fov / 2;
    final pitch0 = 2 * _integral(_behaviour - 1, 0, half);
    final centrePitch = view.pitch * math.pi / 180;
    final highest = math.min(_horizon, centrePitch + half);
    final lowest = math.min(highest, centrePitch - half);
    final count = _integral(_behaviour - 1, lowest, highest);
    _crowding = _log2(math.max(1, count / pitch0 / 3)) / 2;
  }

  static const _horizon = 89.25 * math.pi / 180;

  final double _fov, _centre, _behaviour;
  late final double _crowding;

  static double _behaviourFor(double fov) =>
      2 *
      ((9.314 - 1) / _log2(math.cos(_horizon - fov) / math.cos(_horizon)) - 1);

  static double _log2(double v) => math.log(v) / math.ln2;

  /// The integral of cos(x) to the [p] from [x1] to [x2], by midpoints.
  static double _integral(double p, double x1, double x2) {
    const n = 10;
    final dx = (x2 - x1) / n;
    var sum = 0.0;
    for (var i = 0; i < n; i++) {
      sum += dx * math.pow(math.cos(x1 + (i + 0.5) * dx), p);
    }
    return sum;
  }

  /// The zoom a tile [flat] world pixels across the ground from the point
  /// under a camera [height] above it asks for, the view's centre being at
  /// [zoom].
  double at(double zoom, double flat, double height) {
    final distance = math.sqrt(flat * flat + height * height);
    final tilePitch = math.atan(flat / height);
    return zoom +
        _log2(_centre / distance / math.max(0.5, math.cos(_fov / 2))) +
        _behaviour * _log2(math.cos(tilePitch)) / 2 -
        _crowding;
  }
}
