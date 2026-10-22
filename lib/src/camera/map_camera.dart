import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/painting.dart';
import 'package:latlong2/latlong.dart';

import 'mercator.dart' as mercator;
import 'view.dart';

/// Where the map looks: a [center], a [zoom] in MapLibre's convention (the
/// world is `512 * 2^zoom` logical pixels wide), a [bearing] in degrees
/// clockwise from north, and a [pitch] in degrees from straight down.
@immutable
class VmapCamera {
  /// A camera over [center] at [zoom], turned and tilted as given.
  const VmapCamera({
    required this.center,
    required this.zoom,
    this.bearing = 0,
    this.pitch = 0,
    this.roll = 0,
    this.padding = EdgeInsets.zero,
    this.fieldOfView = defaultFieldOfView,
  });

  /// MapLibre's vertical field of view, in degrees.
  static const double defaultFieldOfView = 36.86989764584402;

  /// The place at the middle of the map, or of what [padding] leaves.
  final LatLng center;

  /// MapLibre's zoom: 0 shows the world 512 logical pixels wide, and each
  /// level doubles it.
  final double zoom;

  /// Degrees clockwise from north that the top of the map faces.
  final double bearing;

  /// Degrees the camera tilts from looking straight down.
  final double pitch;

  /// Degrees the camera turns about its line of sight, as MapLibre's roll.
  final double roll;

  /// Space kept free at each edge of the map, in logical pixels: the camera
  /// looks at the middle of what is left, as MapLibre's padding.
  final EdgeInsets padding;

  /// The camera's vertical field of view, in degrees. A wider one looks
  /// through a wider lens.
  final double fieldOfView;

  /// This camera with the given parts changed.
  VmapCamera copyWith({
    LatLng? center,
    double? zoom,
    double? bearing,
    double? pitch,
    double? roll,
    EdgeInsets? padding,
    double? fieldOfView,
  }) => VmapCamera(
    center: center ?? this.center,
    zoom: zoom ?? this.zoom,
    bearing: bearing ?? this.bearing,
    pitch: pitch ?? this.pitch,
    roll: roll ?? this.roll,
    padding: padding ?? this.padding,
    fieldOfView: fieldOfView ?? this.fieldOfView,
  );

  @override
  bool operator ==(Object other) =>
      other is VmapCamera &&
      other.center == center &&
      other.zoom == zoom &&
      other.bearing == bearing &&
      other.pitch == pitch &&
      other.roll == roll &&
      other.padding == padding &&
      other.fieldOfView == fieldOfView;

  @override
  int get hashCode =>
      Object.hash(center, zoom, bearing, pitch, roll, padding, fieldOfView);

  @override
  String toString() =>
      'VmapCamera(${center.latitude.toStringAsFixed(5)}, '
      '${center.longitude.toStringAsFixed(5)}, zoom ${zoom.toStringAsFixed(2)}, '
      'bearing ${bearing.toStringAsFixed(1)}, pitch ${pitch.toStringAsFixed(1)})';
}

/// The camera at fractions [x], [y] of the world.
VmapCamera cameraAt({
  required double x,
  required double y,
  required double zoom,
  double bearing = 0,
  double pitch = 0,
  double roll = 0,
  EdgeInsets padding = EdgeInsets.zero,
  double fieldOfView = VmapCamera.defaultFieldOfView,
}) => VmapCamera(
  center: LatLng(
    mercator.latitudeAt(y.clamp(0, 1)),
    mercator.longitudeAt(x - x.floorToDouble()),
  ),
  zoom: zoom,
  bearing: bearing,
  pitch: pitch,
  roll: roll,
  padding: padding,
  fieldOfView: fieldOfView,
);

/// The projection and gesture arithmetic of a camera, kept out of the public
/// type.
extension CameraGeometry on VmapCamera {
  double get worldX => mercator.worldX(center.longitude);
  double get worldY => mercator.worldY(center.latitude);

  EdgeInsets2 get pad => EdgeInsets2(
    top: padding.top,
    bottom: padding.bottom,
    left: padding.left,
    right: padding.right,
  );

  /// [fieldOfView] in radians.
  double get fov => fieldOfView * math.pi / 180;

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
    latitude: center.latitude,
  );

  VmapCamera _at(double x, double y, {double? zoom, double? bearing}) =>
      cameraAt(
        x: x,
        y: y,
        zoom: zoom ?? this.zoom,
        bearing: bearing ?? this.bearing,
        pitch: pitch,
        roll: roll,
        padding: padding,
        fieldOfView: fieldOfView,
      );

  /// Moves the map so the ground under screen point [fromX], [fromY] comes
  /// to [toX], [toY], as a finger dragging the map does.
  VmapCamera panned(
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
    return _at(worldX + (a.x - b.x) / size, worldY + (a.y - b.y) / size);
  }

  /// Zooms to [newZoom] and turns by [turn] degrees about screen point [x],
  /// [y], keeping the ground under it in place.
  VmapCamera around(
    MapView view,
    double x,
    double y, {
    double? newZoom,
    double turn = 0,
  }) {
    final anchor = view.unproject(x, y);
    final next = copyWith(
      zoom: newZoom ?? zoom,
      bearing: normalBearing(bearing + turn),
    );
    if (anchor == null) return next;
    final moved = next.view(view.width, view.height);
    final now = moved.unproject(x, y);
    if (now == null) return next;
    final size = moved.worldSize;
    return next._at(
      next.worldX + (anchor.x / view.worldSize - now.x / size),
      next.worldY + (anchor.y / view.worldSize - now.y / size),
    );
  }

  /// This camera kept to the world on a flat map [height] pixels tall, as
  /// MapLibre's mercator camera keeps it: zoomed in until the world is as
  /// tall as the screen inside the padding, else moved north or south so
  /// nothing past the world's edge shows.
  VmapCamera constrained(double height) {
    final screen = height - padding.top - padding.bottom;
    if (screen <= 0) return this;
    final worldSize = 512 * math.pow(2, zoom).toDouble();
    if (worldSize < screen) {
      return copyWith(
        zoom: zoom + math.log(screen / worldSize) / math.ln2,
        center: LatLng(0, center.longitude),
      );
    }
    final y = worldY * worldSize;
    final half = screen / 2;
    final kept = y.clamp(half, worldSize - half);
    if (kept == y) return this;
    return copyWith(
      center: LatLng(mercator.latitudeAt(kept / worldSize), center.longitude),
    );
  }
}

/// [degrees] turned into -180 to 180.
double normalBearing(double degrees) {
  final d = degrees % 360;
  return d > 180 ? d - 360 : d;
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

  final VmapCamera from;
  final VmapCamera to;
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
  VmapCamera at(double t) {
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
    final turn = normalBearing(to.bearing - from.bearing);
    return cameraAt(
      x: from.worldX + u * _dx / world,
      y: from.worldY + u * _dy / world,
      zoom: zoom,
      bearing: normalBearing(from.bearing + turn * t),
      pitch: from.pitch + (to.pitch - from.pitch) * t,
      roll: from.roll + (to.roll - from.roll) * t,
      padding: EdgeInsets.lerp(from.padding, to.padding, t)!,
      fieldOfView: from.fieldOfView + (to.fieldOfView - from.fieldOfView) * t,
    );
  }
}
