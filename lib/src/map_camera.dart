import 'dart:math' as math;

import 'mercator.dart' as mercator;
import 'view.dart';

/// Where the map looks: a centre, a zoom in MapLibre's convention (512
/// pixel tiles), a bearing in degrees clockwise and a pitch in degrees from
/// straight down.
class MapCameraPosition {
  const MapCameraPosition({
    required this.latitude,
    required this.longitude,
    required this.zoom,
    this.bearing = 0,
    this.pitch = 0,
    this.roll = 0,
    this.pad = EdgeInsets2.zero,
    double? fov,
  }) : fov = fov ?? MapView.defaultFov;

  /// The same place at fractions [x], [y] of the world.
  MapCameraPosition.world({
    required double x,
    required double y,
    required this.zoom,
    this.bearing = 0,
    this.pitch = 0,
    this.roll = 0,
    this.pad = EdgeInsets2.zero,
    double? fov,
  }) : latitude = mercator.latitudeAt(y.clamp(0, 1)),
       longitude = mercator.longitudeAt(x - x.floorToDouble()),
       fov = fov ?? MapView.defaultFov;

  final double latitude;
  final double longitude;
  final double zoom;
  final double bearing;
  final double pitch;

  /// Degrees the camera turns about its line of sight, as MapLibre's roll.
  final double roll;

  /// Space kept free around the drawn area, in pixels: the camera looks at
  /// the middle of what it leaves.
  final EdgeInsets2 pad;

  /// The camera's vertical field of view, in radians. MapLibre's default is
  /// about 37 degrees; a wider one looks through a wider lens.
  final double fov;

  double get worldX => mercator.worldX(longitude);
  double get worldY => mercator.worldY(latitude);

  MapView view(double width, double height) => MapView(
    centerX: worldX,
    centerY: worldY,
    zoom: zoom,
    width: width,
    height: height,
    bearing: bearing,
    pitch: pitch,
    roll: roll,
    pad: pad,
    fov: fov,
    latitude: latitude,
  );

  MapCameraPosition copyWith({
    double? latitude,
    double? longitude,
    double? zoom,
    double? bearing,
    double? pitch,
    double? roll,
    EdgeInsets2? pad,
    double? fov,
  }) => MapCameraPosition(
    latitude: latitude ?? this.latitude,
    longitude: longitude ?? this.longitude,
    zoom: zoom ?? this.zoom,
    bearing: bearing ?? this.bearing,
    pitch: pitch ?? this.pitch,
    roll: roll ?? this.roll,
    pad: pad ?? this.pad,
    fov: fov ?? this.fov,
  );

  /// Moves the map so the ground under screen point [fromX], [fromY] comes
  /// to [toX], [toY], as a finger dragging the map does.
  MapCameraPosition panned(
    MapView view,
    double fromX,
    double fromY,
    double toX,
    double toY,
  ) {
    final a = view.unproject(fromX, fromY);
    final b = view.unproject(toX, toY);
    if (a == null || b == null) return this;
    final size = view.worldSize;
    return MapCameraPosition.world(
      x: worldX + (a.x - b.x) / size,
      y: worldY + (a.y - b.y) / size,
      zoom: zoom,
      bearing: bearing,
      pitch: pitch,
      roll: roll,
      pad: pad,
      fov: fov,
    );
  }

  /// Zooms to [newZoom] and turns by [turn] degrees about screen point [x],
  /// [y], keeping the ground under it in place.
  MapCameraPosition around(
    MapView view,
    double x,
    double y, {
    double? newZoom,
    double turn = 0,
  }) {
    final anchor = view.unproject(x, y);
    final next = copyWith(
      zoom: newZoom ?? zoom,
      bearing: _normal(bearing + turn),
    );
    if (anchor == null) return next;
    final moved = next.view(view.width, view.height);
    final now = moved.unproject(x, y);
    if (now == null) return next;
    final size = moved.worldSize;
    return MapCameraPosition.world(
      x: next.worldX + (anchor.x / view.worldSize - now.x / size),
      y: next.worldY + (anchor.y / view.worldSize - now.y / size),
      zoom: next.zoom,
      bearing: next.bearing,
      pitch: pitch,
      roll: roll,
      pad: pad,
      fov: fov,
    );
  }

  static double _normal(double degrees) {
    final d = degrees % 360;
    return d > 180 ? d - 360 : d;
  }

  @override
  bool operator ==(Object other) =>
      other is MapCameraPosition &&
      other.latitude == latitude &&
      other.longitude == longitude &&
      other.zoom == zoom &&
      other.bearing == bearing &&
      other.pitch == pitch &&
      other.roll == roll &&
      other.pad == pad &&
      other.fov == fov;

  @override
  int get hashCode =>
      Object.hash(latitude, longitude, zoom, bearing, pitch, roll, pad, fov);

  @override
  String toString() =>
      'MapCameraPosition(${latitude.toStringAsFixed(5)}, '
      '${longitude.toStringAsFixed(5)}, zoom ${zoom.toStringAsFixed(2)}, '
      'bearing ${bearing.toStringAsFixed(1)}, pitch ${pitch.toStringAsFixed(1)})';
}

/// The flight from one camera to another along the path of van Wijk and
/// Nuij, "Smooth and efficient zooming and panning" (2003): out, across and
/// in, as MapLibre GL JS's `flyTo` does (`camera.ts`).
class FlyPath {
  FlyPath(
    this.from,
    this.to, {
    required double width,
    required double height,
    double curve = 1.42,
    double speed = 1.2,
  }) : _w0 = math.max(width, height) {
    _rho = curve;
    final scale = math.pow(2, to.zoom - from.zoom).toDouble();
    final world = 512 * math.pow(2, from.zoom).toDouble();
    _dx = (to.worldX - from.worldX) * world;
    _dy = (to.worldY - from.worldY) * world;
    _w1 = _w0 / scale;
    _u1 = math.sqrt(_dx * _dx + _dy * _dy);
    final rho2 = _rho * _rho;

    double zoomOut(bool descent) {
      final b =
          (_w1 * _w1 -
              _w0 * _w0 +
              (descent ? -1 : 1) * rho2 * rho2 * _u1 * _u1) /
          (2 * (descent ? _w1 : _w0) * rho2 * _u1);
      return math.log(math.sqrt(b * b + 1) - b);
    }

    _r0 = zoomOut(false);
    var s = (zoomOut(true) - _r0) / _rho;
    if (_u1.abs() < 0.000002 || !s.isFinite) {
      _straight = true;
      final k = _w1 < _w0 ? -1 : 1;
      _k = k.toDouble();
      s = (_w0 - _w1).abs() < 0.000001 ? 0 : (math.log(_w1 / _w0)).abs() / _rho;
    }
    length = s;
    duration = Duration(milliseconds: (1000 * s / speed).round());
  }

  final MapCameraPosition from;
  final MapCameraPosition to;
  final double _w0;
  late final double _w1, _u1, _rho, _r0, _dx, _dy;
  bool _straight = false;
  double _k = 1;

  /// In screenfuls, the path's length.
  late final double length;

  /// How long the flight takes at MapLibre's default speed.
  late final Duration duration;

  static double _cosh(double n) => (math.exp(n) + math.exp(-n)) / 2;
  static double _sinh(double n) => (math.exp(n) - math.exp(-n)) / 2;
  static double _tanh(double n) => _sinh(n) / _cosh(n);

  /// The camera at fraction [t] of the flight, already eased.
  MapCameraPosition at(double t) {
    if (t >= 1 || length == 0) return to;
    final s = t * length;
    final double w, u;
    if (_straight) {
      w = math.exp(_k * _rho * s);
      u = 0;
    } else {
      w = _cosh(_r0) / _cosh(_r0 + _rho * s);
      u =
          _w0 *
          ((_cosh(_r0) * _tanh(_r0 + _rho * s) - _sinh(_r0)) / (_rho * _rho)) /
          _u1;
    }
    final world = 512 * math.pow(2, from.zoom).toDouble();
    final zoom = from.zoom + math.log(1 / w) / math.ln2;
    final turn = MapCameraPosition._normal(to.bearing - from.bearing);
    return MapCameraPosition.world(
      x: from.worldX + u * _dx / world,
      y: from.worldY + u * _dy / world,
      zoom: zoom,
      bearing: MapCameraPosition._normal(from.bearing + turn * t),
      pitch: from.pitch + (to.pitch - from.pitch) * t,
      pad: EdgeInsets2.lerp(from.pad, to.pad, t),
      fov: from.fov + (to.fov - from.fov) * t,
    );
  }
}

/// MapLibre's default easing, `bezier(0.25, 0.1, 0.25, 1)`.
double defaultEasing(double t) => _bezier(0.25, 0.1, 0.25, 1, t);

double _bezier(double x1, double y1, double x2, double y2, double t) {
  double sample(double a, double b, double s) =>
      ((1 - 3 * b + 3 * a) * s + (3 * b - 6 * a)) * s * s + 3 * a * s;
  var lo = 0.0, hi = 1.0, s = t;
  for (var i = 0; i < 30; i++) {
    final x = sample(x1, x2, s);
    if ((x - t).abs() < 1e-7) break;
    if (x < t) {
      lo = s;
    } else {
      hi = s;
    }
    s = (lo + hi) / 2;
  }
  return sample(y1, y2, s);
}
