import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import 'camera.dart';
import 'engine.dart';
import 'map_camera.dart';
import 'view.dart';
import 'style.dart';

/// How fast the camera moves, per second: the centre in fractions of the
/// world, zoom levels, and degrees of bearing and pitch.
typedef CameraVelocity = ({
  double x,
  double y,
  double zoom,
  double bearing,
  double pitch,
});

const CameraVelocity _still = (x: 0, y: 0, zoom: 0, bearing: 0, pitch: 0);

bool _isStill(CameraVelocity v) =>
    v.x == 0 && v.y == 0 && v.zoom == 0 && v.bearing == 0 && v.pitch == 0;

double _turn(double from, double to) {
  final d = (to - from) % 360;
  return d > 180 ? d - 360 : d;
}

/// Moves a [VMap] and reads where it looks.
class VMapController extends ChangeNotifier {
  VMapController(MapCameraPosition initial) : _camera = initial;

  MapCameraPosition _camera;
  _Motion? _motion;
  Ticker? _ticker;
  Size _size = Size.zero;
  double minZoom = 0, maxZoom = 22, maxPitch = 60;
  final _clock = Stopwatch()..start();
  final _samples = <(int, MapCameraPosition)>[];

  /// How long a released gesture or an interrupted animation keeps its
  /// speed: the speed falls to a third in this time.
  static const glideSeconds = 0.32;

  /// Zoom, turn and tilt settle a little sooner than a slide does.
  static const _zoomSeconds = 0.24, _turnSeconds = 0.28, _tiltSeconds = 0.22;

  MapCameraPosition get camera => _camera;

  /// Jumps to [to] at once, stopping any animation.
  set camera(MapCameraPosition to) {
    stop();
    _set(to);
  }

  /// Whether an animation is moving the camera.
  bool get isMoving => _motion != null;

  /// How fast the camera has moved over the last few frames, or still when
  /// it last moved more than a moment ago.
  CameraVelocity get velocity {
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

  void _set(MapCameraPosition to) {
    final clamped = to.copyWith(
      zoom: to.zoom.clamp(minZoom, maxZoom),
      pitch: to.pitch.clamp(0, math.min(maxPitch, 60)),
    );
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
  Future<void> flyTo(MapCameraPosition to, {Duration? duration}) {
    final path = FlyPath(
      _camera,
      to,
      width: math.max(_size.width, 1),
      height: math.max(_size.height, 1),
    );
    return _run(
      _Motion(duration ?? path.duration, (t) => path.at(defaultEasing(t))),
    );
  }

  /// Eases straight to [to]: centre, zoom, bearing and pitch together.
  Future<void> easeTo(
    MapCameraPosition to, {
    Duration duration = const Duration(milliseconds: 500),
    double Function(double t) curve = defaultEasing,
  }) {
    final from = _camera;
    final turn = _turn(from.bearing, to.bearing);
    return _run(
      _Motion(duration, (t) {
        final k = curve(t);
        double mix(double a, double b) => a + (b - a) * k;
        return MapCameraPosition.world(
          x: mix(from.worldX, to.worldX),
          y: mix(from.worldY, to.worldY),
          zoom: mix(from.zoom, to.zoom),
          bearing: from.bearing + turn * k,
          pitch: mix(from.pitch, to.pitch),
        );
      }),
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
    const seconds = glideSeconds * 4.5;
    final start = _camera;
    final startView = start.view(_size.width, _size.height);
    double eased(double tau, double t) =>
        tau * (1 - math.exp(-t * seconds / tau));
    unawaited(
      _run(
        _Motion(Duration(microseconds: (seconds * 1e6).round()), (t) {
          final k = eased(glideSeconds, t);
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
  }

  Future<void> _run(_Motion motion, {bool carry = true}) {
    final speed = carry ? velocity : _still;
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

class _Motion {
  _Motion(this.duration, this.at);

  final Duration duration;
  final MapCameraPosition Function(double t) at;
  final done = Completer<void>();

  /// The same motion, with the speed the camera had when it began fading
  /// out of it: it leaves at that speed and arrives exactly where it would
  /// have.
  _Motion carrying(CameraVelocity v) {
    final seconds = duration.inMicroseconds / 1e6;
    return _Motion(duration, (t) {
      final base = at(t);
      final s = t * seconds;
      final k = s * math.exp(-s / VMapController.glideSeconds) * (1 - t);
      return MapCameraPosition.world(
        x: base.worldX + v.x * k,
        y: base.worldY + v.y * k,
        zoom: base.zoom + v.zoom * k,
        bearing: base.bearing + v.bearing * k,
        pitch: base.pitch + v.pitch * k,
      );
    });
  }
}

/// A map drawn by vmap, without flutter_map. One finger pans; two pinch,
/// turn, and tilt when dragged up or down together; a double tap zooms in;
/// a double tap held and dragged zooms in or out. Released gestures and
/// interrupted animations keep their speed and slow down naturally.
class VMap extends StatefulWidget {
  const VMap({
    required this.controller,
    this.style = VmapStyle.light,
    this.engine,
    this.minZoom = 0,
    this.maxZoom = 22,
    this.maxPitch = 60,
    this.rotate = true,
    this.tilt = true,
    this.onTap,
    super.key,
  });

  final VMapController controller;

  /// Used when no [engine] is given.
  final VmapStyle style;

  /// Draws with an engine the app owns.
  final VmapEngine? engine;
  final double minZoom;
  final double maxZoom;

  /// Degrees, at most 60.
  final double maxPitch;
  final bool rotate;
  final bool tilt;

  /// Called with the latitude and longitude tapped.
  final void Function(double latitude, double longitude)? onTap;

  @override
  State<VMap> createState() => _VMapState();
}

enum _Gesture { undecided, pan, pinch, tilt, quickZoom }

/// Values of one gesture channel over the last tenth of a second, with the
/// touch events' own times, so a frame that arrives late does not make the
/// release look faster than the finger was.
class _Rate {
  final List<(int, double)> _samples = [];

  void reset() => _samples.clear();

  void add(Duration at, double value) {
    final t = at.inMicroseconds;
    _samples.add((t, value));
    while (_samples.length > 2 && t - _samples.first.$1 > 100000) {
      _samples.removeAt(0);
    }
  }

  /// Change per second, the slope of a least squares line through the
  /// samples, or 0 when the fingers held still before letting go.
  double perSecond(Duration end) {
    final n = _samples.length;
    if (n < 2) return 0;
    final t1 = _samples.last.$1;
    if (end.inMicroseconds - t1 > 50000) return 0;
    final t0 = _samples.first.$1;
    if ((t1 - t0) < 12000) return 0;
    var st = 0.0, sv = 0.0;
    for (final (t, v) in _samples) {
      st += (t - t0) / 1e6;
      sv += v;
    }
    final mt = st / n, mv = sv / n;
    var num = 0.0, den = 0.0;
    for (final (t, v) in _samples) {
      final dt = (t - t0) / 1e6 - mt;
      num += dt * (v - mv);
      den += dt * dt;
    }
    return den == 0 ? 0 : num / den;
  }
}

class _VMapState extends State<VMap> with SingleTickerProviderStateMixin {
  VmapEngine? _owned;
  late final Ticker _ticker = createTicker(
    (elapsed) => widget.controller._tick(elapsed),
  );

  VmapEngine get _engine =>
      widget.engine ??
      (_owned ??= VmapEngine(style: widget.style, glyphText: true));

  VMapController get _c => widget.controller;
  MapView get _view => _c.camera.view(_c._size.width, _c._size.height);

  /// Where each finger on the map is, by pointer.
  final Map<int, Offset> _fingers = {};
  final Map<int, Offset> _fingersAtStart = {};
  final Map<int, Duration> _downAt = {};

  var _gesture = _Gesture.undecided;
  Offset _lastFocal = Offset.zero;
  double _lastSpan = 0;
  double _lastAngle = 0;
  double _spanAtStart = 0;
  double _angleAtStart = 0;
  bool _turning = false;
  bool _moved = false;

  final _focalX = _Rate(), _focalY = _Rate(), _zoomRate = _Rate();
  final _turnRate = _Rate(), _tiltRate = _Rate();
  double _zoomTotal = 0, _turnTotal = 0, _tiltTotal = 0;

  Offset _panTotal = Offset.zero;

  /// The last short tap, which a second touch close by in time and place
  /// turns into a double tap, or into a one finger zoom when it is held.
  Duration? _tapUpAt;
  Offset _tapUpPosition = Offset.zero;
  bool _secondTap = false;
  Offset _quickAnchor = Offset.zero;
  double _quickStartZoom = 0;
  int _most = 0;

  static const _doubleTapGap = Duration(milliseconds: 300);
  static const _tapTime = Duration(milliseconds: 250);
  static const _tapSlop = 8.0;
  static const _doubleTapReach = 48.0;

  /// A twist this large, in radians, before two fingers turn the map, so a
  /// pinch does not turn it by accident.
  static const _turnThreshold = 0.26;

  @override
  void initState() {
    super.initState();
    _attach(widget.controller);
  }

  void _attach(VMapController c) {
    c
      .._ticker = _ticker
      ..minZoom = widget.minZoom
      ..maxZoom = widget.maxZoom
      ..maxPitch = widget.maxPitch;
  }

  @override
  void didUpdateWidget(VMap old) {
    super.didUpdateWidget(old);
    if (old.controller != widget.controller) {
      old.controller
        ..stop()
        .._ticker = null;
    }
    _attach(widget.controller);
    if (widget.engine == null && old.style != widget.style) {
      _owned?.style = widget.style;
    }
  }

  @override
  void dispose() {
    widget.controller
      ..stop()
      .._ticker = null;
    _ticker.dispose();
    _owned?.dispose();
    super.dispose();
  }

  Offset get _focal {
    var sum = Offset.zero;
    for (final p in _fingers.values) {
      sum += p;
    }
    return sum / _fingers.length.toDouble();
  }

  (double, double) _spanAndAngle() {
    final points = _fingers.values.take(2).toList();
    final d = points[1] - points[0];
    return (d.distance, d.direction);
  }

  void _resetChannels(Duration at) {
    for (final r in [_focalX, _focalY, _zoomRate, _turnRate, _tiltRate]) {
      r.reset();
    }
    _zoomTotal = _turnTotal = _tiltTotal = 0;
    _panTotal = Offset.zero;
    _record(at);
  }

  void _record(Duration at) {
    _focalX.add(at, _panTotal.dx);
    _focalY.add(at, _panTotal.dy);
    _zoomRate.add(at, _zoomTotal);
    _turnRate.add(at, _turnTotal);
    _tiltRate.add(at, _tiltTotal);
  }

  /// Reads the fingers from where they are now: a finger came or went. The
  /// movement carries on; only a gesture's first finger starts it afresh.
  void _restart(Duration at, {bool fresh = false}) {
    _lastFocal = _focal;
    _fingersAtStart
      ..clear()
      ..addAll(_fingers);
    if (_fingers.length >= 2) {
      final (span, angle) = _spanAndAngle();
      _lastSpan = _spanAtStart = span;
      _lastAngle = _angleAtStart = angle;
      _turning = false;
      if (_gesture != _Gesture.tilt) _gesture = _Gesture.undecided;
    } else if (_gesture != _Gesture.quickZoom) {
      _gesture = _Gesture.pan;
    }
    if (fresh) {
      _resetChannels(at);
    } else {
      _record(at);
    }
  }

  void _onDown(PointerDownEvent e) {
    _c.stop();
    _fingers[e.pointer] = e.localPosition;
    _downAt[e.pointer] = e.timeStamp;
    _most = math.max(_most, _fingers.length);
    if (_fingers.length == 1) {
      _moved = false;
      final last = _tapUpAt;
      _secondTap =
          last != null &&
          e.timeStamp - last < _doubleTapGap &&
          (e.localPosition - _tapUpPosition).distance < _doubleTapReach;
      if (_secondTap) {
        _gesture = _Gesture.quickZoom;
        _quickAnchor = e.localPosition;
        _quickStartZoom = _c.camera.zoom;
      }
    } else {
      _secondTap = false;
      if (_gesture == _Gesture.quickZoom) _gesture = _Gesture.undecided;
    }
    _restart(e.timeStamp, fresh: _fingers.length == 1);
  }

  void _onMove(PointerMoveEvent e) {
    if (!_fingers.containsKey(e.pointer)) return;
    _fingers[e.pointer] = e.localPosition;
    final start = _fingersAtStart[e.pointer];
    if (start != null && (e.localPosition - start).distance > _tapSlop) {
      _moved = true;
    }
    if (!_moved && _gesture != _Gesture.quickZoom) return;
    final view = _view;
    final focal = _focal;
    switch (_gesture) {
      case _Gesture.quickZoom:
        final zoom = _quickStartZoom + (focal.dy - _quickAnchor.dy) / 160;
        _zoomTotal = zoom - _quickStartZoom;
        _c._set(
          _c.camera.around(
            view,
            _quickAnchor.dx,
            _quickAnchor.dy,
            newZoom: zoom,
          ),
        );
      case _Gesture.pan:
        _panTotal += focal - _lastFocal;
        _c._set(
          _c.camera.panned(
            view,
            _lastFocal.dx,
            _lastFocal.dy,
            focal.dx,
            focal.dy,
          ),
        );
      case _Gesture.undecided:
        _decide();
        if (_gesture == _Gesture.undecided) return;
        _onMove(e);
        return;
      case _Gesture.tilt:
        final dy = focal.dy - _lastFocal.dy;
        _tiltTotal -= dy * 0.45;
        _c._set(_c.camera.copyWith(pitch: _c.camera.pitch - dy * 0.45));
      case _Gesture.pinch:
        _pinch(view, focal);
    }
    _lastFocal = focal;
    _record(e.timeStamp);
  }

  /// Tells a tilt from a pinch the way Google Maps does: two fingers side
  /// by side moving up or down together tilt; anything else zooms, pans,
  /// and turns once twisted far enough.
  void _decide() {
    if (_fingers.length < 2) {
      _gesture = _Gesture.pan;
      return;
    }
    final ids = _fingers.keys.take(2).toList();
    final a0 = _fingersAtStart[ids[0]], b0 = _fingersAtStart[ids[1]];
    if (a0 == null || b0 == null) return;
    final da = _fingers[ids[0]]! - a0, db = _fingers[ids[1]]! - b0;
    final (span, angle) = _spanAndAngle();
    final apart = b0 - a0;
    final sideBySide = apart.dy.abs() < apart.dx.abs() * 0.8;
    final together = da.dy * db.dy > 0;
    final vertical =
        da.dy.abs() > da.dx.abs() * 1.5 && db.dy.abs() > db.dx.abs() * 1.5;
    final steadySpan = (span / _spanAtStart - 1).abs() < 0.08;
    var twist = (angle - _angleAtStart).abs();
    if (twist > math.pi) twist = 2 * math.pi - twist;
    if (widget.tilt && sideBySide && together && vertical && steadySpan) {
      if (math.min(da.dy.abs(), db.dy.abs()) > 10) _gesture = _Gesture.tilt;
      return;
    }
    if ((span / _spanAtStart - 1).abs() > 0.04 ||
        twist > 0.06 ||
        (da + db).distance / 2 > 14) {
      _gesture = _Gesture.pinch;
      _lastSpan = span;
      _lastAngle = angle;
    }
  }

  void _pinch(MapView view, Offset focal) {
    final (span, angle) = _spanAndAngle();
    final moved = _c.camera.panned(
      view,
      _lastFocal.dx,
      _lastFocal.dy,
      focal.dx,
      focal.dy,
    );
    _panTotal += focal - _lastFocal;
    final zoomBy = _lastSpan > 0 ? math.log(span / _lastSpan) / math.ln2 : 0.0;
    _zoomTotal += zoomBy;
    var turn = 0.0;
    if (widget.rotate) {
      var since = angle - _angleAtStart;
      while (since > math.pi) {
        since -= 2 * math.pi;
      }
      while (since < -math.pi) {
        since += 2 * math.pi;
      }
      if (!_turning && since.abs() > _turnThreshold) {
        _turning = true;
        _lastAngle = angle;
      }
      if (_turning) {
        var d = angle - _lastAngle;
        if (d > math.pi) d -= 2 * math.pi;
        if (d < -math.pi) d += 2 * math.pi;
        turn = -d * 180 / math.pi;
        _turnTotal += turn;
      }
    }
    _c._set(
      moved.around(
        moved.view(view.width, view.height),
        focal.dx,
        focal.dy,
        newZoom: moved.zoom + zoomBy,
        turn: turn,
      ),
    );
    _lastSpan = span;
    _lastAngle = angle;
  }

  void _onUp(PointerEvent e) {
    final downAt = _downAt.remove(e.pointer);
    final start = _fingersAtStart[e.pointer];
    final wasMost = _most;
    final gesture = _gesture;
    final focal = gesture == _Gesture.quickZoom ? _quickAnchor : _lastFocal;
    final end = e.timeStamp;
    final short =
        downAt != null &&
        end - downAt < _tapTime &&
        start != null &&
        (e.localPosition - start).distance < _tapSlop &&
        !_moved;
    _fingers.remove(e.pointer);
    if (_fingers.isNotEmpty) {
      _restart(end);
      return;
    }
    _most = 0;
    if (wasMost == 2 && short && gesture != _Gesture.tilt) {
      _tapUpAt = null;
      _zoomBy(-1, focal);
      return;
    }
    if (gesture == _Gesture.quickZoom) {
      _tapUpAt = null;
      if (!_moved) {
        _zoomBy(1, e.localPosition);
        return;
      }
      _coastAll(focal, end);
      return;
    }
    if (wasMost == 1 && short) {
      _tapUpAt = end;
      _tapUpPosition = e.localPosition;
      _tap(e.localPosition);
      return;
    }
    _tapUpAt = null;
    _coastAll(focal, end);
  }

  /// Lets every part of the movement coast together at the speed it had:
  /// a pan that was zooming keeps zooming as it slides.
  void _coastAll(Offset focal, Duration end) {
    _c._coast(
      focal: focal,
      pan: Offset(_focalX.perSecond(end), _focalY.perSecond(end)),
      zoom: _zoomRate.perSecond(end),
      turn: _turnRate.perSecond(end),
      tilt: _tiltRate.perSecond(end),
    );
    _gesture = _Gesture.undecided;
  }

  void _zoomBy(double levels, Offset at) {
    final to = _c.camera.around(
      _view,
      at.dx,
      at.dy,
      newZoom: _c.camera.zoom + levels,
    );
    unawaited(_c.easeTo(to, duration: const Duration(milliseconds: 300)));
  }

  void _tap(Offset at) {
    final onTap = widget.onTap;
    if (onTap == null) return;
    final view = _view;
    final g = view.unproject(at.dx, at.dy);
    if (g == null) return;
    final p = MapCameraPosition.world(
      x: g.x / view.worldSize,
      y: g.y / view.worldSize,
      zoom: 0,
    );
    onTap(p.latitude, p.longitude);
  }

  @override
  Widget build(BuildContext context) {
    final dpr = MediaQuery.devicePixelRatioOf(context);
    return LayoutBuilder(
      builder: (context, constraints) {
        _c._size = constraints.biggest;
        return Listener(
          behavior: HitTestBehavior.opaque,
          onPointerDown: _onDown,
          onPointerMove: _onMove,
          onPointerUp: _onUp,
          onPointerCancel: _onUp,
          child: RepaintBoundary(
            child: CustomPaint(
              size: constraints.biggest,
              painter: _VMapPainter(_engine, _c, dpr),
            ),
          ),
        );
      },
    );
  }
}

class _VMapPainter extends CustomPainter {
  _VMapPainter(this.engine, this.controller, this.dpr)
    : super(repaint: Listenable.merge([engine, controller]));

  final VmapEngine engine;
  final VMapController controller;
  final double dpr;

  @override
  void paint(Canvas canvas, Size size) {
    final camera = controller.camera;
    final view = camera.view(size.width, size.height);
    final center = view.center;
    canvas.clipRect(Offset.zero & size);
    engine.paint(
      canvas,
      VmapCamera(
        zoom: camera.zoom + 1,
        origin: Offset(center.x - size.width / 2, center.y - size.height / 2),
        size: size,
        rotation: camera.bearing * math.pi / 180,
        devicePixelRatio: dpr,
        view: view,
      ),
    );
  }

  @override
  bool shouldRepaint(_VMapPainter old) =>
      old.engine != engine || old.controller != controller || old.dpr != dpr;
}
