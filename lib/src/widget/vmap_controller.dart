import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/animation.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/scheduler.dart';
import 'package:latlong2/latlong.dart';

import '../engine.dart';
import 'frame_rate.dart';
import '../camera/map_camera.dart';
import '../camera/mercator.dart';
import '../tiles/query.dart';
import '../camera/view.dart';

/// How fast the camera moves, per second: the centre in fractions of the
/// world, zoom levels, and degrees of bearing and pitch.
typedef _Velocity = ({
  double x,
  double y,
  double zoom,
  double bearing,
  double pitch,
});

const _Velocity _still = (x: 0, y: 0, zoom: 0, bearing: 0, pitch: 0);

bool _isStill(_Velocity v) =>
    v.x == 0 && v.y == 0 && v.zoom == 0 && v.bearing == 0 && v.pitch == 0;

double _turn(double from, double to) {
  final d = (to - from) % 360;
  return d > 180 ? d - 360 : d;
}

/// The area between two corners, for [VmapController.fitBounds] and
/// [VmapController.featuresIn].
@immutable
class VmapBounds {
  const VmapBounds(this.southWest, this.northEast);

  /// The smallest bounds holding every one of [points], which must not be
  /// empty.
  factory VmapBounds.around(Iterable<LatLng> points) {
    var south = 90.0, west = 180.0, north = -90.0, east = -180.0;
    for (final p in points) {
      south = math.min(south, p.latitude);
      north = math.max(north, p.latitude);
      west = math.min(west, p.longitude);
      east = math.max(east, p.longitude);
    }
    if (south > north) throw ArgumentError.value(points, 'points', 'empty');
    return VmapBounds(LatLng(south, west), LatLng(north, east));
  }

  final LatLng southWest;
  final LatLng northEast;

  @override
  bool operator ==(Object other) =>
      other is VmapBounds &&
      other.southWest == southWest &&
      other.northEast == northEast;

  @override
  int get hashCode => Object.hash(southWest, northEast);
}

/// Moves a [Vmap] and reads where it looks. Give one to a [Vmap] to move
/// it from code; a map without one makes its own.
class VmapController extends ChangeNotifier {
  VmapController([
    VmapCamera camera = const VmapCamera(center: LatLng(0, 0), zoom: 1),
  ]) : _camera = camera;

  VmapCamera _camera;
  _Motion? _motion;
  Ticker? _ticker;
  Size _size = Size.zero;
  bool _flat = true;
  double _minZoom = 0, _maxZoom = 22, _maxPitch = 60;
  final _clock = Stopwatch()..start();
  final _samples = <(int, VmapCamera)>[];
  VmapEngine? _engine;

  /// How long a released gesture or an interrupted animation keeps its
  /// speed: the speed falls to a third in this time.
  static const _glideSeconds = 0.32;

  /// Zoom, turn and tilt settle a little sooner than a slide does.
  static const _zoomSeconds = 0.24, _turnSeconds = 0.28, _tiltSeconds = 0.22;

  /// Where the map looks.
  VmapCamera get camera => _camera;

  /// Jumps to [to] at once, stopping any animation.
  set camera(VmapCamera to) {
    stop();
    _set(to);
  }

  /// What draws the map this controller moves, once the map is built.
  VmapEngine? get engine => _engine;

  /// Whether an animation is moving the camera.
  bool get isMoving => _motion != null;

  /// Where the running camera animation ends, while one runs.
  VmapCamera? get destination => _motion?.at(1);

  /// How fast the camera has moved over the last few frames, or still when
  /// it last moved more than a moment ago.
  _Velocity get _velocity {
    if (_samples.length < 2) return _still;
    final now = _clock.elapsedMicroseconds;
    final (t1, last) = _samples.last;
    if (now - t1 > 50000) return _still;
    final (t0, first) = _samples.first;
    final dt = (t1 - t0) / 1e6;
    if (dt < 0.008) return _still;
    return (
      x: (last.worldX - first.worldX) / dt,
      y: (last.worldY - first.worldY) / dt,
      zoom: (last.zoom - first.zoom) / dt,
      bearing: _turn(first.bearing, last.bearing) / dt,
      pitch: (last.pitch - first.pitch) / dt,
    );
  }

  MapView get _view => _camera.view(_size.width, _size.height);

  /// Where [point] is on the map, in logical pixels from its top left, or
  /// null when it is not in front of the camera.
  Offset? toScreen(LatLng point) {
    final view = _view;
    view.projectTo(
      worldX(point.longitude) * view.worldSize,
      worldY(point.latitude) * view.worldSize,
    );
    if (view.outDepth <= 0 || view.outX < -1e5) return null;
    return Offset(view.outX, view.outY);
  }

  /// The place on the ground at [position] on the map, or null where the
  /// screen shows sky.
  LatLng? toLatLng(Offset position) {
    final view = _view;
    final g = view.unproject(position.dx, position.dy);
    if (g == null) return null;
    return LatLng(
      latitudeAt(g.y / view.worldSize),
      longitudeAt(g.x / view.worldSize - (g.x / view.worldSize).floor()),
    );
  }

  /// What the map shows at [point]: the features the style draws within
  /// [radius] logical pixels of it, topmost first. It reads the tiles off
  /// the UI thread, so it answers a moment later, and nothing before the map
  /// has drawn its first frame.
  Future<List<VmapFeature>> featuresAt(LatLng point, {double radius = 6}) =>
      _engine?.featuresAt(point, radius: radius) ?? Future.value(const []);

  /// What the map shows inside [bounds]: the features the style draws that
  /// touch it, topmost first.
  Future<List<VmapFeature>> featuresIn(VmapBounds bounds) =>
      _engine?.featuresIn(bounds.southWest, bounds.northEast) ??
      Future.value(const []);

  void _set(VmapCamera to) {
    var clamped = to.copyWith(
      zoom: to.zoom.clamp(_minZoom, _maxZoom),
      pitch: to.pitch.clamp(0, math.min(_maxPitch, MapView.maxPitch)),
    );
    if (_flat && _size.height > 0) clamped = clamped.constrained(_size.height);
    final now = _clock.elapsedMicroseconds;
    _samples.add((now, clamped));
    while (_samples.length > 2 && now - _samples.first.$1 > 100000) {
      _samples.removeAt(0);
    }
    if (clamped == _camera) return;
    _camera = clamped;
    FrameRateVote.moving();
    notifyListeners();
  }

  /// Flies to [to] along a path that rises over long distances, as
  /// MapLibre's `flyTo` does. A camera already moving carries its speed
  /// into the flight. Completes when the camera arrives or another move or
  /// a touch stops it.
  Future<void> flyTo(VmapCamera to, {Duration? duration}) {
    final path = FlyPath(
      _camera,
      to,
      width: math.max(_size.width, 1),
      height: math.max(_size.height, 1),
    );
    return _run(
      _Motion(
        duration ?? path.duration,
        (t) => path.at(Curves.ease.transform(t)),
      ),
    );
  }

  /// Eases straight to [to]: every part of the camera together, along
  /// [curve], MapLibre's default easing unless given.
  Future<void> easeTo(
    VmapCamera to, {
    Duration duration = const Duration(milliseconds: 500),
    Curve curve = Curves.ease,
  }) {
    final from = _camera;
    final turn = _turn(from.bearing, to.bearing);
    return _run(
      _Motion(duration, (t) {
        final k = curve.transform(t);
        double mix(double a, double b) => a + (b - a) * k;
        return cameraAt(
          x: mix(from.worldX, to.worldX),
          y: mix(from.worldY, to.worldY),
          zoom: mix(from.zoom, to.zoom),
          bearing: from.bearing + turn * k,
          pitch: mix(from.pitch, to.pitch),
          roll: mix(from.roll, to.roll),
          padding: EdgeInsets.lerp(from.padding, to.padding, k)!,
          fieldOfView: mix(from.fieldOfView, to.fieldOfView),
        );
      }),
    );
  }

  /// Moves the camera so [bounds] fills the map inside [padding], on top of
  /// the camera's own padding, looking straight down with the bearing it
  /// has, no deeper than [maxZoom]. With a [duration] it eases there, else
  /// it jumps.
  Future<void> fitBounds(
    VmapBounds bounds, {
    EdgeInsets padding = EdgeInsets.zero,
    double? maxZoom,
    Duration? duration,
  }) {
    final to = cameraFor(bounds, padding: padding, maxZoom: maxZoom);
    if (duration == null) {
      camera = to;
      return Future.value();
    }
    return easeTo(to, duration: duration);
  }

  /// The camera [fitBounds] moves to.
  VmapCamera cameraFor(
    VmapBounds bounds, {
    EdgeInsets padding = EdgeInsets.zero,
    double? maxZoom,
  }) {
    final west = worldX(bounds.southWest.longitude);
    final east = worldX(bounds.northEast.longitude);
    final north = worldY(bounds.northEast.latitude);
    final south = worldY(bounds.southWest.latitude);
    final rad = _camera.bearing * math.pi / 180;
    final cos = math.cos(rad).abs(), sin = math.sin(rad).abs();
    final spanX = (east - west).abs(), spanY = (south - north).abs();
    final turnedX = spanX * cos + spanY * sin;
    final turnedY = spanX * sin + spanY * cos;
    final room = _size.isEmpty ? const Size(512, 512) : _size;
    final inset = _camera.padding + padding;
    final width = math.max(1.0, room.width - inset.horizontal);
    final height = math.max(1.0, room.height - inset.vertical);
    var zoom = math.min(
      math.log(width / math.max(turnedX * 512, 1e-9)) / math.ln2,
      math.log(height / math.max(turnedY * 512, 1e-9)) / math.ln2,
    );
    zoom = math.min(zoom, maxZoom ?? _maxZoom);
    // The camera looks at the middle inside its own padding; the bounds go
    // to the middle inside both paddings, this far from it on the screen.
    final ox = (padding.left - padding.right) / 2;
    final oy = (padding.top - padding.bottom) / 2;
    final world = 512 * math.pow(2, zoom);
    final c = math.cos(rad), s = math.sin(rad);
    return cameraAt(
      x: (west + east) / 2 - (ox * c - oy * s) / world,
      y: (north + south) / 2 - (ox * s + oy * c) / world,
      zoom: zoom,
      bearing: _camera.bearing,
      padding: _camera.padding,
      fieldOfView: _camera.fieldOfView,
    );
  }

  /// Lets a released gesture coast and slow like a body on a surface: the
  /// map slides at [pan] screen pixels a second, and zooms, turns and tilts
  /// at their rates per second, all about screen point [focal].
  void _coast({
    required Offset focal,
    Offset pan = Offset.zero,
    double zoom = 0,
    double turn = 0,
    double tilt = 0,
  }) {
    double cap(double v, double most) => v.clamp(-most, most);
    final speed = pan.distance > 6000 ? pan * (6000 / pan.distance) : pan;
    zoom = cap(zoom, 4);
    turn = cap(turn, 300);
    tilt = cap(tilt, 120);
    if (speed.distance < 80 &&
        zoom.abs() < 0.25 &&
        turn.abs() < 10 &&
        tilt.abs() < 10) {
      return;
    }
    const seconds = _glideSeconds * 4.5;
    final start = _camera;
    final startView = start.view(_size.width, _size.height);
    double eased(double tau, double t) =>
        tau * (1 - math.exp(-t * seconds / tau));
    unawaited(
      _run(
        _Motion(Duration(microseconds: (seconds * 1e6).round()), (t) {
          final k = eased(_glideSeconds, t);
          final kZoom = eased(_zoomSeconds, t);
          final kTurn = eased(_turnSeconds, t);
          final kTilt = eased(_tiltSeconds, t);
          var at = start;
          if (zoom != 0 || turn != 0) {
            at = at.around(
              startView,
              focal.dx,
              focal.dy,
              newZoom: start.zoom + zoom * kZoom,
              turn: turn * kTurn,
            );
          }
          if (tilt != 0) at = at.copyWith(pitch: start.pitch + tilt * kTilt);
          if (speed != Offset.zero) {
            at = at.panned(
              at.view(_size.width, _size.height),
              focal.dx,
              focal.dy,
              focal.dx + speed.dx * k,
              focal.dy + speed.dy * k,
            );
          }
          return at;
        }),
        carry: false,
      ),
    );
  }

  /// Stops any animation where it is.
  void stop() {
    final motion = _motion;
    if (motion == null) return;
    _motion = null;
    _ticker?.stop();
    if (!motion.done.isCompleted) motion.done.complete();
    notifyListeners();
  }

  Future<void> _run(_Motion motion, {bool carry = true}) {
    final speed = carry ? _velocity : _still;
    stop();
    final ticker = _ticker;
    if (ticker == null || motion.duration == Duration.zero) {
      _set(motion.at(1));
      return Future.value();
    }
    _motion = _isStill(speed) ? motion : motion.carrying(speed);
    ticker.start();
    return _motion!.done.future;
  }

  void _tick(Duration elapsed) {
    final motion = _motion;
    if (motion == null) return;
    final t = motion.duration.inMicroseconds == 0
        ? 1.0
        : (elapsed.inMicroseconds / motion.duration.inMicroseconds).clamp(
            0.0,
            1.0,
          );
    _set(motion.at(t));
    if (t >= 1) stop();
  }

  @override
  void dispose() {
    stop();
    super.dispose();
  }
}

/// What a [Vmap] sets on its controller; not part of the public API.
extension VmapControllerHost on VmapController {
  void attach({
    required Ticker? ticker,
    required double minZoom,
    required double maxZoom,
    required double maxPitch,
    required VmapEngine? engine,
  }) {
    _ticker = ticker;
    _minZoom = minZoom;
    _maxZoom = maxZoom;
    _maxPitch = maxPitch;
    _engine = engine;
  }

  void detach() {
    stop();
    _ticker = null;
    _engine = null;
  }

  void layout(Size size, {required bool flat}) {
    _size = size;
    _flat = flat;
  }

  MapView get view => _view;
  void move(VmapCamera to) => _set(to);
  void tick(Duration elapsed) => _tick(elapsed);
  void coast({
    required Offset focal,
    Offset pan = Offset.zero,
    double zoom = 0,
    double turn = 0,
    double tilt = 0,
  }) => _coast(focal: focal, pan: pan, zoom: zoom, turn: turn, tilt: tilt);
}

class _Motion {
  _Motion(this.duration, this.at);

  final Duration duration;
  final VmapCamera Function(double t) at;
  final done = Completer<void>();

  /// The same motion, with the speed the camera had when it began fading
  /// out of it: it leaves at that speed and arrives exactly where it would
  /// have.
  _Motion carrying(_Velocity v) {
    final seconds = duration.inMicroseconds / 1e6;
    return _Motion(duration, (t) {
      final base = at(t);
      final s = t * seconds;
      final k = s * math.exp(-s / VmapController._glideSeconds) * (1 - t);
      return cameraAt(
        x: base.worldX + v.x * k,
        y: base.worldY + v.y * k,
        zoom: base.zoom + v.zoom * k,
        bearing: base.bearing + v.bearing * k,
        pitch: base.pitch + v.pitch * k,
        roll: base.roll,
        padding: base.padding,
        fieldOfView: base.fieldOfView,
      );
    });
  }
}
