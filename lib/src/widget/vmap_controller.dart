import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/animation.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/scheduler.dart';
import 'package:latlong2/latlong.dart';

import '../engine.dart';
import '../camera/bounds.dart';
import '../gestures/gesture_target.dart';
import '../camera/map_camera.dart';
import '../camera/mercator.dart';
import '../options.dart';
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

/// Moves a [Vmap] and reads where it looks. Give one to a [Vmap] to move
/// it from code; a map without one makes its own.
class VmapController extends ChangeNotifier {
  /// A controller starting at [camera].
  VmapController([
    VmapCamera camera = const VmapCamera(center: LatLng(0, 0), zoom: 1),
  ]) : _camera = camera;

  VmapCamera _camera;
  _Motion? _motion;

  /// Where the animation under way left the camera on its last frame, and
  /// where its own path had the camera then. Something else that moves the
  /// camera meanwhile, a wheel zooming during a glide, is kept: the
  /// animation then adds only its own change of the frame.
  VmapCamera? _motionLeft, _motionWas;
  bool _motionMoved = false;
  Ticker? _ticker;
  Size _size = Size.zero;
  bool _flat = true;
  double _minZoom = 0, _maxZoom = 22, _maxPitch = 60;
  final _clock = Stopwatch()..start();
  final _samples = <(int, VmapCamera)>[];
  VmapEngine? _engine;

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

  /// Where the running camera animation ends, while one runs, or where
  /// [headFor] said the camera is going.
  VmapCamera? get destination => _motion?.at(1) ?? _heading;

  VmapCamera? _heading;

  /// Tells the map where code that moves [camera] itself, frame by frame,
  /// is taking it, so the tiles there load on the way as they do for
  /// [flyTo]. Null once it has arrived.
  void headFor(VmapCamera? camera) => _heading = camera;

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
      _engine?.featuresIn(bounds) ?? Future.value(const []);

  /// The zoom at which cluster [clusterId] of the clustered GeoJSON source
  /// named [source] comes apart, to zoom in on a tapped cluster. Null when
  /// there is no such cluster. A cluster's id is the `cluster_id` property
  /// of the feature [featuresAt] finds.
  Future<double?> clusterExpansionZoom(String source, int clusterId) =>
      _engine?.clusterExpansionZoom(source, clusterId) ?? Future.value();

  /// What cluster [clusterId] comes apart into at its expansion zoom.
  Future<List<VmapClusterMember>> clusterChildren(
    String source,
    int clusterId,
  ) => _engine?.clusterChildren(source, clusterId) ?? Future.value(const []);

  /// The points inside cluster [clusterId], [limit] of them from [offset].
  Future<List<VmapClusterMember>> clusterLeaves(
    String source,
    int clusterId, {
    int limit = 10,
    int offset = 0,
  }) =>
      _engine?.clusterLeaves(source, clusterId, limit: limit, offset: offset) ??
      Future.value(const []);

  /// Fetches every tile the style draws inside [bounds] at zooms [minZoom]
  /// to [maxZoom] into the map's cache directory, so that part of the map
  /// shows without a network: see [VmapEngine.downloadRegion]. Needs
  /// [VmapNetworkOptions.cacheDirectory], and a map that has loaded its
  /// style.
  Future<VmapDownload> downloadRegion(
    VmapBounds bounds, {
    required double minZoom,
    required double maxZoom,
    void Function(int done, int total)? onProgress,
    bool Function()? cancelled,
  }) {
    final engine = _engine;
    if (engine == null) {
      throw StateError('Give the controller to a Vmap before downloading');
    }
    return engine.downloadRegion(
      bounds,
      minZoom: minZoom,
      maxZoom: maxZoom,
      onProgress: onProgress,
      cancelled: cancelled,
    );
  }

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

  /// [from] moved by [step].
  VmapCamera _stepped(VmapCamera from, MapGestureStep step) {
    var at = from;
    if (step.from case final a?) {
      final b = step.to!;
      at = at.panned(
        at.view(_size.width, _size.height),
        a.dx,
        a.dy,
        b.dx,
        b.dy,
      );
    }
    if (step.zoomBy != 0 || step.turn != 0) {
      final anchor = step.anchor;
      at = anchor == null
          ? at.copyWith(
              zoom: at.zoom + step.zoomBy,
              bearing: normalBearing(at.bearing + step.turn),
            )
          : at.around(
              at.view(_size.width, _size.height),
              anchor.dx,
              anchor.dy,
              newZoom: at.zoom + step.zoomBy,
              turn: step.turn,
            );
    }
    if (step.tilt != 0) at = at.copyWith(pitch: at.pitch + step.tilt);
    return at;
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
    final running = _motion = _isStill(speed) ? motion : motion.carrying(speed);
    _motionLeft = _camera;
    _motionWas = running.at(0);
    _motionMoved = false;
    ticker.start();
    return running.done.future;
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
    final next = motion.at(t);
    final was = _motionWas ?? next;
    _motionWas = next;
    if (_camera != _motionLeft) _motionMoved = true;
    _set(_motionMoved ? _movedBy(_camera, was, next) : next);
    _motionLeft = _camera;
    if (t >= 1) stop();
  }

  /// [camera] moved as the animation's path moved from [from] to [to] in
  /// one frame: a slide by as many screen pixels at [camera]'s zoom, and
  /// the same change of zoom, bearing and pitch.
  static VmapCamera _movedBy(
    VmapCamera camera,
    VmapCamera from,
    VmapCamera to,
  ) {
    double wrapped(double d) => d - (d + 0.5).floorToDouble();
    final scale = math.pow(2, from.zoom - camera.zoom).toDouble();
    return cameraAt(
      x: camera.worldX + wrapped(to.worldX - from.worldX) * scale,
      y: camera.worldY + (to.worldY - from.worldY) * scale,
      zoom: camera.zoom + to.zoom - from.zoom,
      bearing: normalBearing(camera.bearing + to.bearing - from.bearing),
      pitch: camera.pitch + to.pitch - from.pitch,
      roll: camera.roll,
      padding: camera.padding,
      fieldOfView: camera.fieldOfView,
    );
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
  void tick(Duration elapsed) => _tick(elapsed);

  /// What gestures on the map move.
  MapGestureTarget get gestureTarget => _GestureTarget(this);
}

class _GestureTarget implements MapGestureTarget {
  _GestureTarget(this._c);

  final VmapController _c;

  @override
  Size get size => _c._size;

  @override
  Offset get centre {
    final (:x, :y) = _c._view.screenCenter;
    return Offset(x, y);
  }

  @override
  double get zoom => _c._camera.zoom;

  @override
  double get minZoom => _c._minZoom;

  @override
  double get maxZoom => _c._maxZoom;

  @override
  bool get isMoving => _c.isMoving;

  @override
  void stop() => _c.stop();

  @override
  void jump(MapGestureStep step) => _c._set(_c._stepped(_c._camera, step));

  @override
  void ease(
    MapGestureStep step,
    Duration duration, {
    Curve curve = Curves.ease,
  }) {
    final start = _c._camera;
    unawaited(
      _c._run(
        _Motion(
          duration,
          (t) => _c._stepped(start, step.scaled(curve.transform(t))),
        ),
      ),
    );
  }

  @override
  void glide(MapGlide glide) {
    final start = _c._camera;
    unawaited(
      _c._run(
        _Motion(glide.duration, (t) => _c._stepped(start, glide.at(t))),
        carry: false,
      ),
    );
  }
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
      final k = s * math.exp(-s / MapGlide.glideSeconds) * (1 - t);
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
