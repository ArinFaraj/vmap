import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import 'camera.dart';
import 'engine.dart';
import 'map_camera.dart';
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

  /// Lets the camera coast on [speed], slowing like a body on a surface,
  /// with zoom held about screen point [focal].
  void _glide(CameraVelocity speed, Offset focal) {
    double cap(double v, double most) => v.clamp(-most, most);
    final v = (
      x: speed.x,
      y: speed.y,
      zoom: cap(speed.zoom, 4),
      bearing: cap(speed.bearing, 240),
      pitch: cap(speed.pitch, 120),
    );
    final world = 512 * math.pow(2, _camera.zoom).toDouble();
    final screenSpeed = math.sqrt(v.x * v.x + v.y * v.y) * world;
    if (screenSpeed < 60 &&
        v.zoom.abs() < 0.3 &&
        v.bearing.abs() < 8 &&
        v.pitch.abs() < 8) {
      return;
    }
    const tau = glideSeconds;
    const seconds = tau * 4.5;
    final start = _camera;
    unawaited(
      _run(
        _Motion(Duration(microseconds: (seconds * 1e6).round()), (t) {
          final k = tau * (1 - math.exp(-t * seconds / tau));
          final moved = MapCameraPosition.world(
            x: start.worldX + v.x * k,
            y: start.worldY + v.y * k,
            zoom: start.zoom,
            bearing: start.bearing + v.bearing * k,
            pitch: start.pitch + v.pitch * k,
          );
          if (v.zoom == 0) return moved;
          return moved.around(
            moved.view(_size.width, _size.height),
            focal.dx,
            focal.dy,
            newZoom: start.zoom + v.zoom * k,
          );
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

class _VMapState extends State<VMap> with SingleTickerProviderStateMixin {
  VmapEngine? _owned;
  late final Ticker _ticker = createTicker(
    (elapsed) => widget.controller._tick(elapsed),
  );

  VmapEngine get _engine =>
      widget.engine ?? (_owned ??= VmapEngine(style: widget.style));

  Offset _lastFocal = Offset.zero;
  double _lastScale = 1;
  double _lastRotation = 0;
  Offset _travel = Offset.zero;
  var _gesture = _Gesture.undecided;
  int _pointers = 0;

  /// The last short tap, which a second touch close by in time and place
  /// turns into a double tap.
  Duration? _tapUpAt;
  Offset _tapUpPosition = Offset.zero;
  Duration _downAt = Duration.zero;
  Offset _downPosition = Offset.zero;
  bool _secondTap = false;
  bool _quickZoomed = false;
  Offset _quickAnchor = Offset.zero;
  double _quickStartZoom = 0;
  int _down = 0;

  static const _doubleTapGap = Duration(milliseconds: 300);
  static const _doubleTapReach = 48.0;

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

  VMapController get _c => widget.controller;

  void _onPointerDown(PointerDownEvent e) {
    _down++;
    _c.stop();
    if (_down != 1) {
      _secondTap = false;
      return;
    }
    final last = _tapUpAt;
    _secondTap =
        last != null &&
        e.timeStamp - last < _doubleTapGap &&
        (e.localPosition - _tapUpPosition).distance < _doubleTapReach;
    _quickZoomed = false;
    _downAt = e.timeStamp;
    _downPosition = e.localPosition;
  }

  void _onPointerUp(PointerEvent e) {
    _down = math.max(0, _down - 1);
    if (_down != 0) return;
    final short =
        e.timeStamp - _downAt < const Duration(milliseconds: 250) &&
        (e.localPosition - _downPosition).distance < 18;
    if (_secondTap && !_quickZoomed && short) {
      _tapUpAt = null;
      _secondTap = false;
      _zoomInAt(e.localPosition);
      return;
    }
    _secondTap = false;
    if (short) {
      _tapUpAt = e.timeStamp;
      _tapUpPosition = e.localPosition;
    } else {
      _tapUpAt = null;
    }
  }

  void _onStart(ScaleStartDetails d) {
    _lastFocal = d.localFocalPoint;
    _lastScale = 1;
    _lastRotation = 0;
    _travel = Offset.zero;
    _pointers = d.pointerCount;
    if (_secondTap && d.pointerCount == 1) {
      _gesture = _Gesture.quickZoom;
      _quickZoomed = true;
      _quickAnchor = _downPosition;
      _quickStartZoom = _c.camera.zoom;
      _travel = d.localFocalPoint - _downPosition;
      return;
    }
    _gesture = d.pointerCount > 1 ? _Gesture.undecided : _Gesture.pan;
  }

  void _onUpdate(ScaleUpdateDetails d) {
    if (d.pointerCount != _pointers) {
      _pointers = d.pointerCount;
      _lastFocal = d.localFocalPoint;
      _lastScale = d.scale;
      _lastRotation = d.rotation;
      if (_gesture != _Gesture.quickZoom) {
        _gesture = _pointers > 1 ? _Gesture.undecided : _Gesture.pan;
      }
      return;
    }
    final view = _c.camera.view(_c._size.width, _c._size.height);
    final focal = d.localFocalPoint;
    if (_gesture == _Gesture.undecided) {
      _travel += focal - _lastFocal;
      final pinching = (d.scale - 1).abs() > 0.04 || d.rotation.abs() > 0.08;
      if (pinching) {
        _gesture = _Gesture.pinch;
      } else if (widget.tilt &&
          _travel.dy.abs() > 12 &&
          _travel.dy.abs() > _travel.dx.abs() * 2) {
        _gesture = _Gesture.tilt;
      } else if (_travel.distance > 24) {
        _gesture = _Gesture.pinch;
      }
    }
    switch (_gesture) {
      case _Gesture.undecided:
        break;
      case _Gesture.quickZoom:
        final dy = focal.dy - _quickAnchor.dy;
        _c._set(
          _c.camera.around(
            view,
            _quickAnchor.dx,
            _quickAnchor.dy,
            newZoom: _quickStartZoom + dy / 160,
          ),
        );
      case _Gesture.pan:
        _c._set(
          _c.camera.panned(
            view,
            _lastFocal.dx,
            _lastFocal.dy,
            focal.dx,
            focal.dy,
          ),
        );
      case _Gesture.tilt:
        _c._set(
          _c.camera.copyWith(
            pitch: _c.camera.pitch - (focal.dy - _lastFocal.dy) * 0.5,
          ),
        );
      case _Gesture.pinch:
        final moved = _c.camera.panned(
          view,
          _lastFocal.dx,
          _lastFocal.dy,
          focal.dx,
          focal.dy,
        );
        final zoomBy = math.log(d.scale / _lastScale) / math.ln2;
        final turn = widget.rotate
            ? -(d.rotation - _lastRotation) * 180 / math.pi
            : 0.0;
        _c._set(
          moved.around(
            moved.view(view.width, view.height),
            focal.dx,
            focal.dy,
            newZoom: moved.zoom + zoomBy,
            turn: turn,
          ),
        );
    }
    _lastFocal = focal;
    _lastScale = d.scale;
    _lastRotation = d.rotation;
  }

  void _onEnd(ScaleEndDetails d) {
    final anchor = _gesture == _Gesture.quickZoom ? _quickAnchor : _lastFocal;
    _gesture = _Gesture.undecided;
    _c._glide(_c.velocity, anchor);
  }

  void _zoomInAt(Offset at) {
    final view = _c.camera.view(_c._size.width, _c._size.height);
    final to = _c.camera.around(
      view,
      at.dx,
      at.dy,
      newZoom: _c.camera.zoom + 1,
    );
    unawaited(_c.easeTo(to, duration: const Duration(milliseconds: 320)));
  }

  void _onTapUp(TapUpDetails d) {
    final onTap = widget.onTap;
    if (onTap == null) return;
    final view = _c.camera.view(_c._size.width, _c._size.height);
    final g = view.unproject(d.localPosition.dx, d.localPosition.dy);
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
          onPointerDown: _onPointerDown,
          onPointerUp: _onPointerUp,
          onPointerCancel: _onPointerUp,
          child: RawGestureDetector(
            behavior: HitTestBehavior.opaque,
            gestures: {
              ScaleGestureRecognizer:
                  GestureRecognizerFactoryWithHandlers<ScaleGestureRecognizer>(
                    ScaleGestureRecognizer.new,
                    (r) => r
                      ..onStart = _onStart
                      ..onUpdate = _onUpdate
                      ..onEnd = _onEnd,
                  ),
              TapGestureRecognizer:
                  GestureRecognizerFactoryWithHandlers<TapGestureRecognizer>(
                    TapGestureRecognizer.new,
                    (r) => r..onTapUp = _onTapUp,
                  ),
            },
            child: RepaintBoundary(
              child: CustomPaint(
                size: constraints.biggest,
                painter: _VMapPainter(_engine, _c, dpr),
              ),
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
