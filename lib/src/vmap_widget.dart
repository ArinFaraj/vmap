import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/physics.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import 'camera.dart';
import 'engine.dart';
import 'map_camera.dart';
import 'style.dart';

/// Moves a [VMap] and reads where it looks.
class VMapController extends ChangeNotifier {
  VMapController(MapCameraPosition initial) : _camera = initial;

  MapCameraPosition _camera;
  _Motion? _motion;
  Ticker? _ticker;
  Size _size = Size.zero;
  double minZoom = 0, maxZoom = 22, maxPitch = 60;

  MapCameraPosition get camera => _camera;

  /// Jumps to [to] at once, stopping any animation.
  set camera(MapCameraPosition to) {
    stop();
    _set(to);
  }

  /// Whether an animation is moving the camera.
  bool get isMoving => _motion != null;

  void _set(MapCameraPosition to) {
    final clamped = to.copyWith(
      zoom: to.zoom.clamp(minZoom, maxZoom),
      pitch: to.pitch.clamp(0, math.min(maxPitch, 60)),
    );
    if (clamped == _camera) return;
    _camera = clamped;
    notifyListeners();
  }

  /// Flies to [to] along a path that rises over long distances, as
  /// MapLibre's `flyTo` does. Completes when the camera arrives or another
  /// move or a touch stops it.
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

  static double _turn(double from, double to) {
    final d = (to - from) % 360;
    return d > 180 ? d - 360 : d;
  }

  /// Stops any animation where it is.
  void stop() {
    final motion = _motion;
    if (motion == null) return;
    _motion = null;
    _ticker?.stop();
    if (!motion.done.isCompleted) motion.done.complete();
  }

  Future<void> _run(_Motion motion) {
    stop();
    final ticker = _ticker;
    if (ticker == null || motion.duration == Duration.zero) {
      _set(motion.at(1));
      return Future.value();
    }
    _motion = motion;
    ticker.start();
    return motion.done.future;
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
}

/// A map drawn by vmap, without flutter_map: it pans, pinches, turns with
/// two fingers, tilts when two fingers drag up or down, and flies.
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

enum _Gesture { undecided, pan, pinch, tilt }

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

  void _onStart(ScaleStartDetails d) {
    _c.stop();
    _lastFocal = d.localFocalPoint;
    _lastScale = 1;
    _lastRotation = 0;
    _travel = Offset.zero;
    _pointers = d.pointerCount;
    _gesture = d.pointerCount > 1 ? _Gesture.undecided : _Gesture.pan;
  }

  void _onUpdate(ScaleUpdateDetails d) {
    if (d.pointerCount != _pointers) {
      _pointers = d.pointerCount;
      _lastFocal = d.localFocalPoint;
      _lastScale = d.scale;
      _lastRotation = d.rotation;
      _gesture = _pointers > 1 ? _Gesture.undecided : _Gesture.pan;
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
            ? (d.rotation - _lastRotation) * 180 / math.pi
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
    if (_gesture != _Gesture.pan) return;
    final v = d.velocity.pixelsPerSecond;
    if (v.distance < 200) return;
    final sx = FrictionSimulation(0.135, 0, v.dx);
    final sy = FrictionSimulation(0.135, 0, v.dy);
    final seconds = math.min(
      1.6,
      math.max(sx.timeAtX(sx.finalX * 0.995), sy.timeAtX(sy.finalX * 0.995)),
    );
    if (!seconds.isFinite || seconds <= 0) return;
    final start = _c.camera;
    final cx = _c._size.width / 2, cy = _c._size.height / 2;
    final view = start.view(_c._size.width, _c._size.height);
    unawaited(
      _c._run(
        _Motion(
          Duration(microseconds: (seconds * 1e6).round()),
          (t) => start.panned(
            view,
            cx,
            cy,
            cx + sx.x(t * seconds),
            cy + sy.x(t * seconds),
          ),
        ),
      ),
    );
  }

  void _onDoubleTap(TapDownDetails d) {
    final at = d.localPosition;
    final view = _c.camera.view(_c._size.width, _c._size.height);
    final to = _c.camera.around(
      view,
      at.dx,
      at.dy,
      newZoom: _c.camera.zoom + 1,
    );
    unawaited(_c.easeTo(to, duration: const Duration(milliseconds: 300)));
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
        TapDownDetails? doubleTapAt;
        return RawGestureDetector(
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
            DoubleTapGestureRecognizer:
                GestureRecognizerFactoryWithHandlers<
                  DoubleTapGestureRecognizer
                >(
                  DoubleTapGestureRecognizer.new,
                  (r) => r
                    ..onDoubleTapDown = (d) {
                      doubleTapAt = d;
                    }
                    ..onDoubleTap = () {
                      final at = doubleTapAt;
                      if (at != null) _onDoubleTap(at);
                    },
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
