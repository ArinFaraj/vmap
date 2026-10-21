import 'dart:math' as math;
import 'dart:typed_data';

import 'mercator.dart' as mercator;
import 'view.dart';

/// MapLibre's globe (`vertical_perspective_transform.ts`): the world on a
/// sphere seen from the camera a mercator view of the same centre, zoom,
/// bearing and pitch has. The sphere is the unit sphere, y to the north
/// pole and z through longitude 0 on the equator, scaled so the map's
/// middle is as many pixels to the metre as the flat map.
class Globe {
  Globe(this.view, {this.transition = 1}) {
    final edge = mercator.latitudeAt(view.centerY);
    final asked = view.latitude ?? edge;
    final most = maxLatitude(view.worldSize, view.width, view.height);
    final latDeg = asked.abs() > mercator.maxLatitude
        ? asked.clamp(-most, most)
        : edge;
    _lat = latDeg * math.pi / 180;
    _lng = mercator.longitudeAt(view.centerX) * math.pi / 180;
    radius = radiusAt(view.worldSize, latDeg);
    final w = view.width, h = view.height;
    final d = view.cameraToCenterDistance;
    final pitch = view.pitch * math.pi / 180;
    final bearing = view.bearing * math.pi / 180;
    final m = _perspective(view.fov, w / h, 0.5, d + radius * 2);
    final (:x, :y) = view.screenCenter;
    m[8] = -(x - w / 2) * 2 / w;
    m[9] = (y - h / 2) * 2 / h;
    _unproject = _invert(m);
    _translate(m, 0, 0, -d);
    _rotateX(m, -pitch);
    _rotateZ(m, bearing);
    _translate(m, 0, 0, -radius);
    _rotateX(m, _lat);
    _rotateY(m, -_lng);
    _scale(m, radius);
    matrix = m;
    final c = Float64List(3)..[2] = d / radius;
    _rotVecX(c, pitch);
    _rotVecZ(c, -bearing);
    c[2] += 1;
    _rotVecX(c, -_lat);
    _rotVecY(c, _lng);
    camera = c;
    plane = _clippingPlane(d / radius, pitch, bearing);
  }

  final MapView view;

  /// How far along from the flat map to the globe: 1 is the globe.
  final double transition;

  late final double _lat, _lng;
  late final Float64List _unproject;

  /// MapLibre's `getGlobeCenterInViewSpace`: the sphere's centre in pixels,
  /// the camera at the origin looking down negative z.
  (double, double, double) get viewCentre {
    final u = _unproject, m = matrix;
    final r = [
      for (var i = 0; i < 4; i++)
        u[i] * m[12] + u[4 + i] * m[13] + u[8 + i] * m[14] + u[12 + i] * m[15],
    ];
    return (r[0] / r[3], r[1] / r[3], r[2] / r[3]);
  }

  /// The view ray through clip point (x, y) is `x * a + y * b + c`, as
  /// MapLibre's atmosphere unprojects it; [a], [b], [c] in that order.
  List<double> get viewRays {
    final u = _unproject;
    return [u[0], u[1], u[2], u[4], u[5], u[6], u[12], u[13], u[14]];
  }

  /// MapLibre's `getSunPos`: the light at [position], distance, azimuth and
  /// polar angle in degrees, shining towards the camera's view space; held
  /// on the map unless [viewport].
  (double, double, double) sunAt(
    List<double> position, {
    required bool viewport,
  }) {
    final azimuth = (position[1] + 90) * math.pi / 180;
    final polar = position[2] * math.pi / 180;
    final r = position[0];
    final v = Float64List.fromList([
      -r * math.cos(azimuth) * math.sin(polar),
      -r * math.sin(azimuth) * math.sin(polar),
      -r * math.cos(polar),
    ]);
    if (!viewport) {
      _rotVecY(v, -_lng);
      _rotVecX(v, _lat);
      _rotVecZ(v, view.bearing * math.pi / 180);
      _rotVecX(v, -view.pitch * math.pi / 180);
    }
    return (v[0], v[1], v[2]);
  }

  /// The sphere's radius in screen pixels.
  late final double radius;

  /// From the unit sphere to clip space, column-major.
  late final Float64List matrix;

  /// The camera on the unit sphere's scale.
  late final Float64List camera;

  /// MapLibre's clipping plane: what is in front of it is the side of the
  /// sphere the camera sees.
  late final Float64List plane;

  /// MapLibre's `getGlobeRadiusPixels`: larger towards the poles, so the
  /// map's middle keeps the flat map's scale.
  static double radiusAt(double worldSize, double latitude) =>
      worldSize /
      (2 * math.pi) /
      math.cos(math.min(latitude.abs(), mercator.maxLatitude) * math.pi / 180);

  /// MapLibre's `_getMaxLatitude`: how near a pole the centre may be on a
  /// world [worldSize] pixels across seen on a [width] by [height] screen.
  /// Past the flat map's edge there is no data, so the centre reaches the
  /// pole only while that cap fits on the screen, and eases back to the
  /// edge as it outgrows it.
  static double maxLatitude(double worldSize, double width, double height) {
    const edge = mercator.maxLatitude;
    const cap = (90 - edge) * math.pi / 180;
    final capPixels = radiusAt(worldSize, edge) * cap;
    final reach = math.min(width, height) / 2;
    final fade = ((capPixels - reach) / (reach * 4 - reach)).clamp(0.0, 1.0);
    final centrePixels = math.min(capPixels, reach) * (1 - fade);
    return edge + cap * centrePixels / capPixels * 180 / math.pi;
  }

  /// MapLibre's `getZoomAdjustment`: the zoom change that keeps the
  /// globe's size on screen as its centre moves from [from] to [to].
  static double zoomAdjustment(double from, double to) {
    double scale(double lat) =>
        math.cos(math.min(lat.abs(), mercator.maxLatitude) * math.pi / 180);
    return math.log(scale(to) / scale(from)) / math.ln2;
  }

  /// The point on the unit sphere at fractions [mx], [my] of the mercator
  /// world, as `projectToSphere`.
  static (double, double, double) surface(double mx, double my) {
    final lng = mx * 2 * math.pi + math.pi;
    final t = math.exp(math.pi - my * 2 * math.pi);
    final t2 = t * t;
    final sinLat = (t2 - 1) / (t2 + 1);
    final cosLat = 2 * t / (t2 + 1);
    return (math.sin(lng) * cosLat, sinLat, math.cos(lng) * cosLat);
  }

  /// Whether the unit sphere point [x], [y], [z] faces the camera.
  bool faces(double x, double y, double z) =>
      plane[0] * x + plane[1] * y + plane[2] * z + plane[3] >= 0;

  /// Where [projectTo] put the last point, in logical pixels, its clip w,
  /// and whether it faces the camera.
  double outX = 0, outY = 0, outW = 1;
  bool outFaces = true;

  /// Projects the mercator world fractions [mx], [my] to the screen; the
  /// result is in [outX], [outY], [outW] and [outFaces].
  void projectTo(double mx, double my) {
    final (x, y, z) = surface(mx, my);
    projectSphere(x, y, z);
  }

  /// [projectTo] for a point on the unit sphere.
  void projectSphere(double x, double y, double z) {
    final m = matrix;
    final cx = m[0] * x + m[4] * y + m[8] * z + m[12];
    final cy = m[1] * x + m[5] * y + m[9] * z + m[13];
    final cw = m[3] * x + m[7] * y + m[11] * z + m[15];
    outW = cw;
    outX = (cx / cw + 1) / 2 * view.width;
    outY = (1 - cy / cw) / 2 * view.height;
    outFaces = faces(x, y, z);
  }

  /// The mercator world fractions under screen point [sx], [sy], or null
  /// off the sphere.
  ({double x, double y})? unproject(double sx, double sy) {
    final inv = _inverse;
    final nx = sx / view.width * 2 - 1, ny = 1 - sy / view.height * 2;
    (double, double, double) at(double z) {
      final x = inv[0] * nx + inv[4] * ny + inv[8] * z + inv[12];
      final y = inv[1] * nx + inv[5] * ny + inv[9] * z + inv[13];
      final zz = inv[2] * nx + inv[6] * ny + inv[10] * z + inv[14];
      final w = inv[3] * nx + inv[7] * ny + inv[11] * z + inv[15];
      return (x / w, y / w, zz / w);
    }

    final (ax, ay, az) = at(-1);
    final (bx, by, bz) = at(1);
    var dx = bx - ax, dy = by - ay, dz = bz - az;
    final len = math.sqrt(dx * dx + dy * dy + dz * dz);
    dx /= len;
    dy /= len;
    dz /= len;
    final ox = camera[0], oy = camera[1], oz = camera[2];
    final b = ox * dx + oy * dy + oz * dz;
    final c = ox * ox + oy * oy + oz * oz - 1;
    final disc = b * b - c;
    if (disc < 0) return null;
    final t = -b - math.sqrt(disc);
    if (t < 0) return null;
    return toWorld(ox + dx * t, oy + dy * t, oz + dz * t);
  }

  /// The mercator world fractions of unit sphere point [x], [y], [z].
  static ({double x, double y}) toWorld(double x, double y, double z) {
    final lat = math.asin(y.clamp(-1.0, 1.0)) * 180 / math.pi;
    final lng = math.atan2(x, z) * 180 / math.pi;
    return (x: mercator.worldX(lng), y: mercator.worldY(lat));
  }

  late final Float64List _inverse = _invert(matrix);

  /// The tiles that cover the side of the sphere in view, nearest first:
  /// MapLibre's `coveringTiles` for the globe, each tile at the zoom its
  /// distance from the camera asks for, no deeper than [maxZoom].
  List<CoverTile> cover({
    required int maxZoom,
    int minZoom = 0,
    double hold = 0,
  }) {
    final out = <CoverTile>[];
    final zoom = view.zoom + hold;
    final cx = camera[0], cy = camera[1], cz = camera[2];
    final centreDistance = view.cameraToCenterDistance / radius;
    final spread = math.max(0.5, math.cos(view.fov / 2));
    const samples = 4;
    // Where the screen meets the sphere: a tile far larger than the part
    // of it in view can have none of its samples there.
    final seen = [
      for (var j = 0; j <= samples; j++)
        for (var i = 0; i <= samples; i++)
          ?unproject(view.width * i / samples, view.height * j / samples),
    ];
    void visit(int z, int x, int y) {
      final n = 1 << z;
      var visible = false;
      var nearest = double.infinity;
      var minX = double.infinity, maxX = -double.infinity;
      var minY = double.infinity, maxY = -double.infinity;
      void sample(double px, double py, double pz) {
        final dx = px - cx, dy = py - cy, dz = pz - cz;
        nearest = math.min(nearest, math.sqrt(dx * dx + dy * dy + dz * dz));
        if (!faces(px, py, pz)) return;
        projectSphere(px, py, pz);
        visible = true;
        minX = math.min(minX, outX);
        maxX = math.max(maxX, outX);
        minY = math.min(minY, outY);
        maxY = math.max(maxY, outY);
      }

      for (var j = 0; j <= samples; j++) {
        for (var i = 0; i <= samples; i++) {
          final (px, py, pz) = surface(
            (x + i / samples) / n,
            (y + j / samples) / n,
          );
          sample(px, py, pz);
        }
      }
      // As MapLibre's: a tile at the world's edge reaches on to its pole.
      if (y == 0) sample(0, 1, 0);
      if (y == n - 1) sample(0, -1, 0);
      final onScreen =
          visible &&
          maxX >= 0 &&
          minX <= view.width &&
          maxY >= 0 &&
          minY <= view.height;
      if (!onScreen) {
        for (final p in seen) {
          final tx = p.x * n - x, ty = p.y * n - y;
          if (tx >= 0 && tx <= 1 && ty >= 0 && ty <= 1) {
            visible = true;
            minX = minY = 0;
            maxX = view.width;
            maxY = view.height;
            break;
          }
        }
      }
      if (z > 2) {
        if (!visible) return;
        if (maxX < 0 || minX > view.width || maxY < 0 || minY > view.height) {
          return;
        }
      }
      final wanted = math.max(
        0,
        (zoom +
                math.log(centreDistance / math.max(nearest, 1e-9) / spread) /
                    math.ln2)
            .floor(),
      );
      if (z >= maxZoom || z >= math.min(wanted, maxZoom) && z >= minZoom) {
        if (z <= 2 && !visible && !_meets(z, x, y)) return;
        out.add((
          z: z,
          x: x,
          y: y,
          distance: nearest * radius,
          over: math.max(z, wanted),
        ));
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

  /// Whether a large tile reaches the visible side though none of its
  /// sampled points does: finer samples settle it.
  bool _meets(int z, int x, int y) {
    final n = 1 << z;
    const k = 32;
    for (var j = 0; j <= k; j++) {
      for (var i = 0; i <= k; i++) {
        final (px, py, pz) = surface((x + i / k) / n, (y + j / k) / n);
        if (faces(px, py, pz)) return true;
      }
    }
    return false;
  }

  Float64List _clippingPlane(double distance, double pitch, double bearing) {
    final toA = math.sin(pitch) * distance;
    final aToC = math.cos(pitch) * distance + 1;
    final toC = math.sqrt(toA * toA + aToC * aToC);
    final tangent = 1 / toC;
    final v = Float64List(3)
      ..[1] = -toA / toC
      ..[2] = aToC / toC;
    _rotVecZ(v, -bearing);
    _rotVecX(v, -_lat);
    _rotVecY(v, _lng);
    final len = math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return Float64List.fromList([
      v[0] / len,
      v[1] / len,
      v[2] / len,
      -tangent / len,
    ]);
  }

  static Float64List _perspective(
    double fovy,
    double aspect,
    double near,
    double far,
  ) {
    final f = 1 / math.tan(fovy / 2);
    final nf = 1 / (near - far);
    return Float64List(16)
      ..[0] = f / aspect
      ..[5] = f
      ..[10] = (far + near) * nf
      ..[11] = -1
      ..[14] = 2 * far * near * nf;
  }

  static void _translate(Float64List m, double x, double y, double z) {
    for (var r = 0; r < 4; r++) {
      m[12 + r] += m[r] * x + m[4 + r] * y + m[8 + r] * z;
    }
  }

  static void _scale(Float64List m, double s) {
    for (var i = 0; i < 12; i++) {
      m[i] *= s;
    }
  }

  /// Post-multiplies by a rotation in the plane of columns [a] and [b].
  static void _rotate(Float64List m, int a, int b, double angle) {
    final s = math.sin(angle), c = math.cos(angle);
    for (var r = 0; r < 4; r++) {
      final ma = m[a * 4 + r], mb = m[b * 4 + r];
      m[a * 4 + r] = ma * c + mb * s;
      m[b * 4 + r] = mb * c - ma * s;
    }
  }

  static void _rotateX(Float64List m, double angle) => _rotate(m, 1, 2, angle);
  static void _rotateY(Float64List m, double angle) => _rotate(m, 2, 0, angle);
  static void _rotateZ(Float64List m, double angle) => _rotate(m, 0, 1, angle);

  static void _rotVec(Float64List v, int a, int b, double angle) {
    final s = math.sin(angle), c = math.cos(angle);
    final va = v[a], vb = v[b];
    v[a] = va * c - vb * s;
    v[b] = va * s + vb * c;
  }

  static void _rotVecX(Float64List v, double angle) => _rotVec(v, 1, 2, angle);
  static void _rotVecY(Float64List v, double angle) => _rotVec(v, 2, 0, angle);
  static void _rotVecZ(Float64List v, double angle) => _rotVec(v, 0, 1, angle);

  static Float64List _invert(Float64List a) {
    final a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    final a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    final a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    final a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    final b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10;
    final b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11;
    final b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
    final b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30;
    final b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31;
    final b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    final det =
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    final d = 1 / det;
    return Float64List.fromList([
      (a11 * b11 - a12 * b10 + a13 * b09) * d,
      (a02 * b10 - a01 * b11 - a03 * b09) * d,
      (a31 * b05 - a32 * b04 + a33 * b03) * d,
      (a22 * b04 - a21 * b05 - a23 * b03) * d,
      (a12 * b08 - a10 * b11 - a13 * b07) * d,
      (a00 * b11 - a02 * b08 + a03 * b07) * d,
      (a32 * b02 - a30 * b05 - a33 * b01) * d,
      (a20 * b05 - a22 * b02 + a23 * b01) * d,
      (a10 * b10 - a11 * b08 + a13 * b06) * d,
      (a01 * b08 - a00 * b10 - a03 * b06) * d,
      (a30 * b04 - a31 * b02 + a33 * b00) * d,
      (a21 * b02 - a20 * b04 - a23 * b00) * d,
      (a11 * b07 - a10 * b09 - a12 * b06) * d,
      (a00 * b09 - a01 * b07 + a02 * b06) * d,
      (a31 * b01 - a30 * b03 - a32 * b00) * d,
      (a20 * b03 - a21 * b01 + a22 * b00) * d,
    ]);
  }
}
