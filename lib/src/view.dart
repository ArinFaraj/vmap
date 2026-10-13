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

  /// With [defaultFov], every ray from the camera through the screen meets
  /// the ground up to this pitch.
  static const double maxPitch = 60;

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

  /// Ground offset from the centre, turned so v points down the screen.
  (double, double) _uv(double x, double y) {
    final dx = x - _cx, dy = y - _cy;
    return (_cosB * dx + _sinB * dy, -_sinB * dx + _cosB * dy);
  }

  /// How far a ground point is from the camera relative to the centre: 1 at
  /// the centre, more behind it.
  double depth(double x, double y) => 1 - _k * _uv(x, y).$2;

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

  /// The ground the screen shows, as the four corners in world pixels,
  /// clockwise from the top left.
  List<WorldPoint> ground() => [
    unproject(0, 0)!,
    unproject(width, 0)!,
    unproject(width, height)!,
    unproject(0, height)!,
  ];

  /// The tiles that cover the ground in view, each at the zoom its distance
  /// asks for: the zoom of the view at the centre, less one for every
  /// doubling of distance from the camera. Tiles off the ground are left
  /// out. Columns past the world's edge are not wrapped.
  List<CoverTile> cover({required int maxZoom, int minZoom = 0}) {
    final quad = ground();
    final camU = 0.0, camV = cameraToCenterDistance * _sinP;
    final camX = _cx + _cosB * camU - _sinB * camV;
    final camY = _cy + _sinB * camU + _cosB * camV;
    final camH = cameraToCenterDistance * _cosP;
    final top = math.min(zoom.floor(), maxZoom);
    final out = <CoverTile>[];

    void visit(int z, int x, int y) {
      final span = worldSize / (1 << z);
      final left = x * span, upper = y * span;
      if (!_quadMeetsBox(quad, left, upper, left + span, upper + span)) return;
      final nx = (camX - left).clamp(0, span) + left;
      final ny = (camY - upper).clamp(0, span) + upper;
      final ddx = nx - camX, ddy = ny - camY;
      final distance = math.sqrt(ddx * ddx + ddy * ddy + camH * camH);
      final wanted = zoom + _log2(cameraToCenterDistance / distance);
      if (z >= top || (z >= minZoom && z >= wanted.floor())) {
        out.add((z: z, x: x, y: y, distance: distance));
        return;
      }
      for (var j = 0; j < 2; j++) {
        for (var i = 0; i < 2; i++) {
          visit(z + 1, x * 2 + i, y * 2 + j);
        }
      }
    }

    visit(0, 0, 0);
    out.sort((a, b) => a.distance.compareTo(b.distance));
    return out;
  }

  static double _log2(double v) => math.log(v) / math.ln2;

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
    final corners = [
      (left, top),
      (right, top),
      (right, bottom),
      (left, bottom),
    ];
    for (var i = 0; i < quad.length; i++) {
      final a = quad[i], b = quad[(i + 1) % quad.length];
      final nx = b.y - a.y, ny = a.x - b.x;
      final quadSide = quad
          .map((p) => (p.x - a.x) * nx + (p.y - a.y) * ny)
          .reduce((s, t) => s.abs() > t.abs() ? s : t);
      var allOut = true;
      for (final (cx, cy) in corners) {
        final s = (cx - a.x) * nx + (cy - a.y) * ny;
        if (s * quadSide > 0 || s == 0) {
          allOut = false;
          break;
        }
      }
      if (allOut) return false;
    }
    return true;
  }
}
