import 'dart:math' as math;
import 'dart:typed_data';

import 'globe.dart';

/// A point in world pixels: the world is [MapView.worldSize] pixels wide,
/// x east from 180 west, y south from the top.
typedef WorldPoint = ({double x, double y});

/// Padding in pixels from each edge of the screen, as MapLibre's
/// `PaddingOptions` names them.
class EdgeInsets2 {
  const EdgeInsets2({
    this.top = 0,
    this.bottom = 0,
    this.left = 0,
    this.right = 0,
  });

  static const EdgeInsets2 zero = EdgeInsets2();

  final double top, bottom, left, right;

  EdgeInsets2 copyWith({
    double? top,
    double? bottom,
    double? left,
    double? right,
  }) => EdgeInsets2(
    top: top ?? this.top,
    bottom: bottom ?? this.bottom,
    left: left ?? this.left,
    right: right ?? this.right,
  );

  /// The blend from [a] to [b], which is how a flight to new padding moves
  /// it (`EdgeInsets.interpolate`).
  static EdgeInsets2 lerp(EdgeInsets2 a, EdgeInsets2 b, double t) =>
      EdgeInsets2(
        top: a.top + (b.top - a.top) * t,
        bottom: a.bottom + (b.bottom - a.bottom) * t,
        left: a.left + (b.left - a.left) * t,
        right: a.right + (b.right - a.right) * t,
      );

  @override
  bool operator ==(Object other) =>
      other is EdgeInsets2 &&
      other.top == top &&
      other.bottom == bottom &&
      other.left == left &&
      other.right == right;

  @override
  int get hashCode => Object.hash(top, bottom, left, right);

  @override
  String toString() =>
      'EdgeInsets2(${top.toInt()}, ${bottom.toInt()}, '
      '${left.toInt()}, ${right.toInt()})';
}

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
    this.roll = 0,
    this.fov = defaultFov,
    this.pad = EdgeInsets2.zero,
    this.globeness = 0,
  }) : pitch = pitch.clamp(0, maxPitch) {
    final b = bearing * math.pi / 180;
    final r = roll * math.pi / 180;
    _cosR = math.cos(r);
    _sinR = math.sin(r);
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
    // MapLibre's centre of the drawn area, `edge_insets.ts`'s `getCenter`:
    // the middle of what the padding leaves, kept inside the screen. The
    // camera looks there, so everything projects about _sx and _sy
    // instead of the screen's middle.
    _sx = ((pad.left + width - pad.right) / 2).clamp(0.0, width);
    _sy = ((pad.top + height - pad.bottom) / 2).clamp(0.0, height);
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
      _sy -
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

  /// Degrees the camera turns about its line of sight, as MapLibre's
  /// `roll`: the picture turns counterclockwise about the screen's centre.
  final double roll;

  /// Vertical field of view in radians.
  final double fov;
  final double width, height;

  /// The space kept free around the drawn area, in pixels, as an app
  /// insets a map under a sheet. The camera looks at the middle of what it
  /// leaves, so the ground under those edges is off screen.
  final EdgeInsets2 pad;
  ({double x, double y}) get screenCenter => (x: _sx, y: _sy);

  /// How far from the flat map to the globe the style draws this view at:
  /// 0 is the flat map.
  final double globeness;

  /// The globe this view is drawn on, or null for the flat map.
  late final Globe? globe = globeness > 0
      ? Globe(this, transition: globeness)
      : null;

  /// The same view drawn [amount] of the way to the globe.
  MapView withGlobe(double amount) => MapView(
    centerX: centerX,
    centerY: centerY,
    zoom: zoom,
    width: width,
    height: height,
    bearing: bearing,
    pitch: pitch,
    roll: roll,
    fov: fov,
    pad: pad,
    globeness: amount,
  );

  late final double worldSize;
  late final double cameraToCenterDistance;
  late final double _cosB, _sinB, _cosP, _sinP, _k, _cx, _cy, _sx, _sy;
  late final double _cosR, _sinR;

  /// Where a point of the unrolled picture, in logical pixels, lands on
  /// the screen once the camera's [roll] turns it.
  ({double x, double y}) rolled(double x, double y) {
    if (roll == 0) return (x: x, y: y);
    final dx = x - _sx, dy = y - _sy;
    return (
      x: dx * _cosR + dy * _sinR + _sx,
      y: -dx * _sinR + dy * _cosR + _sy,
    );
  }

  /// The screen's bounds in the unrolled picture: the whole screen when the
  /// camera does not roll, else the box its turned corners reach.
  late final ({double left, double top, double right, double bottom})
  unrolledBounds = () {
    if (roll == 0) return (left: 0.0, top: 0.0, right: width, bottom: height);
    var l = double.infinity, t = double.infinity;
    var r = -double.infinity, b = -double.infinity;
    for (final (x, y) in [
      (0.0, 0.0),
      (width, 0.0),
      (width, height),
      (0.0, height),
    ]) {
      final dx = x - _sx, dy = y - _sy;
      final ux = dx * _cosR - dy * _sinR + _sx;
      final uy = dx * _sinR + dy * _cosR + _sy;
      l = math.min(l, ux);
      t = math.min(t, uy);
      r = math.max(r, ux);
      b = math.max(b, uy);
    }
    return (left: l, top: t, right: r, bottom: b);
  }();

  WorldPoint get center => (x: _cx, y: _cy);

  /// The same view with its [pad] replaced, for a camera that moves.
  MapView copyWithPad(EdgeInsets2 pad) => MapView(
    centerX: centerX,
    centerY: centerY,
    zoom: zoom,
    width: width,
    height: height,
    bearing: bearing,
    pitch: pitch,
    roll: roll,
    fov: fov,
    pad: pad,
    globeness: globeness,
  );

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
    if (globe case final globe?) {
      _projectGlobe(globe, x, y, h);
      return;
    }
    _projectFlat(x, y, h);
  }

  void _projectGlobe(Globe globe, double x, double y, double h) {
    final (gx, gy, gz) = Globe.surface(x / worldSize, y / worldSize);
    final lift = 1 + h / globe.radius;
    globe.projectSphere(gx * lift, gy * lift, gz * lift);
    final amount = globe.transition;
    var sx = globe.outX, sy = globe.outY;
    var depth = globe.outW / cameraToCenterDistance;
    if (!globe.outFaces) {
      sx = sy = -1e6;
    }
    if (amount < 1) {
      _projectFlat(x, y, h);
      sx = outX + (sx - outX) * amount;
      sy = outY + (sy - outY) * amount;
      depth = outDepth + (depth - outDepth) * amount;
    }
    if (roll != 0 && sx > -1e5) {
      final dx = sx - _sx, dy = sy - _sy;
      sx = dx * _cosR + dy * _sinR + _sx;
      sy = -dx * _sinR + dy * _cosR + _sy;
    }
    outX = sx;
    outY = sy;
    outDepth = depth;
  }

  void _projectFlat(double x, double y, double h) {
    final dx = x - _cx, dy = y - _cy;
    final u = _cosB * dx + _sinB * dy;
    final v = -_sinB * dx + _cosB * dy;
    final w = 1 - _k * v - h * _cosP / cameraToCenterDistance;
    final ox = u / w, oy = (_cosP * v - _sinP * h) / w;
    outX = ox * _cosR + oy * _sinR + _sx;
    outY = -ox * _sinR + oy * _cosR + _sy;
    outDepth = w;
  }

  /// Where a ground point lands on the screen, in logical pixels.
  ({double x, double y}) project(double x, double y) {
    final (u, v) = _uv(x, y);
    final w = 1 - _k * v;
    final ox = u / w, oy = _cosP * v / w;
    return (
      x: ox * _cosR + oy * _sinR + _sx,
      y: -ox * _sinR + oy * _cosR + _sy,
    );
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
    final ox = u / w, oy = (_cosP * v - _sinP * z) / w;
    return (
      x: ox * _cosR + oy * _sinR + _sx,
      y: -ox * _sinR + oy * _cosR + _sy,
    );
  }

  /// MapLibre's scale for labels at a ground point
  /// (`projection.ts`, `getPerspectiveRatio`).
  double perspectiveRatio(double x, double y) => 0.5 + 0.5 / depth(x, y);

  /// The ground point under a screen point, or null above the horizon.
  WorldPoint? unproject(double sx, double sy) {
    final dx = sx - _sx, dy = sy - _sy;
    return _unprojectUnrolled(dx * _cosR - dy * _sinR, dx * _sinR + dy * _cosR);
  }

  /// [unproject] for an offset from the screen's centre in the unrolled
  /// picture.
  WorldPoint? _unprojectUnrolled(double rx, double ry) {
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
    final hw = _sx, hh = _sy;
    final m = _cosP - hh * _k;
    final v0 = _sinB * _cx - _cosB * _cy;
    final u0 = -(_cosB * _cx + _sinB * _cy);
    final a = _cosB + hw * _k * _sinB, b = _sinB - hw * _k * _cosB;
    final c = -m * _sinB, d = m * _cosB;
    final e = _k * _sinB, f = -_k * _cosB;
    final tx = u0 - hw * _k * v0 + hw;
    final ty = m * v0 + hh;
    final tw = 1 - _k * v0;
    final m4 = Float64List.fromList([
      a, c, 0, e, //
      b, d, 0, f, //
      0, 0, 1, 0, //
      tx + a * originX + b * originY,
      ty + c * originX + d * originY,
      0,
      tw + e * originX + f * originY,
    ]);
    if (roll != 0) {
      for (var col = 0; col < 16; col += 4) {
        final x = m4[col] - _sx * m4[col + 3];
        final y = m4[col + 1] - _sy * m4[col + 3];
        m4[col] = x * _cosR + y * _sinR + _sx * m4[col + 3];
        m4[col + 1] = -x * _sinR + y * _cosR + _sy * m4[col + 3];
      }
    }
    return m4;
  }

  /// A column-major matrix from world pixels less [originX], [originY], with
  /// z the height above the ground in world pixels, to clip space: x and y
  /// as the screen shows them, y up, and depth from 0 at [near] to 1 at
  /// [far], both as multiples of the camera's distance to the centre.
  /// [near] defaults to MapLibre's, a fiftieth of the screen's height.
  Float64List clipMatrix({
    double originX = 0,
    double originY = 0,
    double? near,
    double far = 20,
  }) {
    near ??= height / 50 / cameraToCenterDistance;
    final u0 = -(_cosB * _cx + _sinB * _cy) + _cosB * originX + _sinB * originY;
    final v0 = _sinB * _cx - _cosB * _cy - _sinB * originX + _cosB * originY;
    final w = width, h = height, d = cameraToCenterDistance;
    final a = far / (far - near), b = near * far / (near - far);
    final wx = _k * _sinB, wy = -_k * _cosB, wz = -_cosP / d, wc = 1 - _k * v0;
    // The camera looks at the middle of what the padding leaves, so the map
    // is drawn as though that were the screen's middle: clip x and y are
    // shifted by the offset from the screen's middle, a fraction of the
    // screen each way (MapLibre's off-centre perspective, `m[8]` `m[9]`).
    final ox = (_sx - width / 2) * 2 / w;
    // Clip y runs up the screen, so the offset from the screen's middle
    // points the other way from the screen's.
    final oy = (height / 2 - _sy) * 2 / h;
    final m4 = Float64List.fromList([
      2 * _cosB / w, 2 * _cosP * _sinB / h, a * wx, wx, //
      2 * _sinB / w, -2 * _cosP * _cosB / h, a * wy, wy,
      0, 2 * _sinP / h, a * wz, wz,
      2 * u0 / w + ox * wc, -2 * _cosP * v0 / h + oy * wc, a * wc + b, wc,
    ]);
    if (roll != 0) {
      // Clip x and y back to pixels from the screen's centre, y down,
      // turned there, and back to clip space.
      final kx = w / 2 - _sx, ky = h / 2 - _sy;
      for (var col = 0; col < 16; col += 4) {
        final cw = m4[col + 3];
        final px = m4[col] * w / 2 + cw * kx;
        final py = -m4[col + 1] * h / 2 + cw * ky;
        final rx = px * _cosR + py * _sinR;
        final ry = -px * _sinR + py * _cosR;
        m4[col] = (rx - cw * kx) * 2 / w;
        m4[col + 1] = -(ry - cw * ky) * 2 / h;
      }
    }
    return m4;
  }

  /// How far MapLibre's far plane lies along the camera's line of sight,
  /// in world pixels (`_calculateNearFarZ`): far enough for the ground up to
  /// the horizon, measured from a plane 100 metres under a camera lower
  /// than that, so a low camera sees the ground run on past the horizon.
  late final double farDistance = () {
    final p = math.min(pitch, 89.25) * math.pi / 180;
    final d = cameraToCenterDistance;
    final offsetY = _sy - height / 2;
    final lat = math.atan(_sinh(math.pi * (1 - 2 * centerY)));
    final pixelsPerMeter = worldSize / (_earthCircumference * math.cos(lat));
    final altitude = math.cos(pitch * math.pi / 180) * d / pixelsPerMeter;
    final lowestElevation = math.min(0.0, altitude - 100);
    final lowest = lowestElevation < 0
        ? d - lowestElevation * pixelsPerMeter / math.cos(p)
        : d;
    final ground = math.pi / 2 + pitch * math.pi / 180;
    double reach(double angle) =>
        math.sin(angle) *
        lowest /
        math.sin((math.pi - ground - angle).clamp(0.01, math.pi - 0.01));
    final r = roll * math.pi / 180;
    final zfov =
        fov * (math.cos(r).abs() * height + math.sin(r).abs() * width) / height;
    final above = zfov * (0.5 + offsetY / height);
    final horizon = _sy - horizonY;
    final horizonAngle = math.atan(horizon / d);
    const least = (90 - 89.25) * math.pi / 180;
    final toHorizon = horizonAngle > least
        ? 2 * horizonAngle * (0.5 + offsetY / (horizon * 2))
        : least;
    return (math.sin(p) * math.min(reach(above), reach(toHorizon)) + lowest) *
        1.01;
  }();

  /// MapLibre's `earthRadius` times two pi, in metres.
  static const double _earthCircumference = 2 * math.pi * 6371008.8;

  static double _sinh(double x) => (math.exp(x) - math.exp(-x)) / 2;

  /// Where the far plane cuts the ground on the screen, in logical pixels
  /// from the top; negative while that is above the screen.
  late final double groundTopY = pitch == 0
      ? -double.infinity
      : _sy +
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
        : math.max(unrolledBounds.top, groundTopY);
    final (:left, :right, :bottom, top: _) = unrolledBounds;
    return [
      _unprojectUnrolled(left - _sx, far - _sy)!,
      _unprojectUnrolled(right - _sx, far - _sy)!,
      _unprojectUnrolled(right - _sx, bottom - _sy)!,
      _unprojectUnrolled(left - _sx, bottom - _sy)!,
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
    if (globe case final globe?) {
      return globe.cover(maxZoom: maxZoom, minZoom: minZoom, hold: hold);
    }
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

    // A tilted view's ground can reach far past the horizon; a few copies
    // of the world each side of the centre's are as far as tiles are drawn.
    final xs = [for (final p in quad) p.x / worldSize];
    final first = math.max(xs.reduce(math.min).floor(), -_copies);
    final last = math.min(xs.reduce(math.max).floor(), _copies);
    for (var copy = first; copy <= last; copy++) {
      visit(0, copy, 0);
    }
    out.sort((a, b) => a.distance.compareTo(b.distance));
    return out;
  }

  static const _copies = 4;

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
