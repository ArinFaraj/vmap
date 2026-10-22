import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';

/// Touch, mouse, trackpad and keyboard handling for a [FlutterMap] whose own
/// gestures are switched off (`InteractiveFlag.none`): drag with a glide,
/// pinch around the fingers with zoom carry-over, double tap, two finger
/// tap, double tap then drag, the mouse wheel, right or control drag to
/// turn, a trackpad's slide, pinch and twist, and the arrow and plus and
/// minus keys once the map has focus.
///
/// It reads raw pointers rather than joining the gesture arena, so the map
/// follows the finger from the first frame and taps on markers keep working.
class VmapGestures extends StatefulWidget {
  const VmapGestures({
    required this.controller,
    required this.child,
    this.minZoom = 3,
    this.maxZoom = 19,
    this.enabled = true,
    this.rotate = true,
    this.keyboard = true,
    super.key,
  });

  /// The arrow keys pan, shift with them turns, and plus and minus zoom,
  /// once a press on the map has given it focus.
  final bool keyboard;

  final MapController controller;
  final Widget child;
  final double minZoom;
  final double maxZoom;
  final bool enabled;

  /// Two fingers turning turn the map.
  final bool rotate;

  @override
  State<VmapGestures> createState() => _VmapGesturesState();
}

enum _Mode { idle, pending, pan, pinch, quickZoom, turn, spent }

class _VmapGesturesState extends State<VmapGestures>
    with SingleTickerProviderStateMixin {
  static const double _slop = 8;
  static const double _zoomDecay = 0.16;
  static const double _minFling = 140;

  /// A glide measured against Google Maps on Android for the same swipes: it
  /// lasts in proportion to the release speed and eases out along
  /// 1 - (1 - t)^2.4, which ends sooner than an exponential decay does.
  static const double _maxFling = 2100;
  static const double _flingSecondsPerSpeed = 1 / 2500;
  static const double _flingPower = 2.4;
  static const double _minZoomFling = 0.7;
  static const double _maxZoomFling = 9;
  static const double _quickZoomPixelsPerLevel = 110;
  static const Duration _tapTime = Duration(milliseconds: 260);
  static const Duration _doubleTapGap = Duration(milliseconds: 300);
  static const double _doubleTapReach = 48;
  static const Duration _zoomAnimation = Duration(milliseconds: 280);

  late final Ticker _ticker = createTicker(_tick);
  final Map<int, Offset> _pointers = {};
  _Mode _mode = _Mode.idle;

  Offset _downAt = Offset.zero;
  Duration _downTime = Duration.zero;
  Offset _last = Offset.zero;
  VelocityTracker _velocity = VelocityTracker.withKind(PointerDeviceKind.touch);

  Offset _focal = Offset.zero;
  double _spread = 1;
  double _bearing = 0;

  /// How far the fingers have turned since the pinch began. The map follows
  /// once this passes [_turnSlop], so a plain pinch never turns it.
  double _twist = 0;
  bool _turning = false;
  static const double _turnSlop = 0.2;
  double _pinchTravel = 0;
  Duration _pinchStart = Duration.zero;
  final List<(Duration, double)> _zoomSamples = [];
  double _pinchZoom = 0;

  Offset? _lastTapAt;
  Duration _lastTapTime = Duration.zero;
  bool _secondTap = false;

  Offset _flingVector = Offset.zero;
  double _flingDuration = 0;
  double _flingElapsed = 0;
  double _zoomVelocity = 0;
  Offset _momentumFocal = Offset.zero;
  double _animRemaining = 0;
  double _animTotal = 0;
  double _animElapsed = 0;
  Duration _lastTick = Duration.zero;

  final FocusNode _focus = FocusNode(debugLabel: 'VmapGestures');

  /// Where a trackpad gesture was at its last update.
  Offset _padPan = Offset.zero;
  double _padScale = 1, _padTurn = 0;

  @override
  void dispose() {
    _ticker.dispose();
    _focus.dispose();
    super.dispose();
  }

  static Offset _turned(Offset o, double angle) {
    if (angle == 0) return o;
    final c = math.cos(angle);
    final s = math.sin(angle);
    return Offset(o.dx * c - o.dy * s, o.dx * s + o.dy * c);
  }

  /// Moves the map by [pan] screen pixels, then zooms and turns it around
  /// [focal], so what is under the fingers stays under them.
  void _apply(Offset pan, double zoomDelta, Offset focal, [double turn = 0]) {
    final camera = widget.controller.camera;
    final z0 = camera.zoom;
    final z1 = (z0 + zoomDelta).clamp(widget.minZoom, widget.maxZoom);
    if (pan == Offset.zero && z1 == z0 && turn == 0) return;
    final f = focal - camera.nonRotatedSize.center(Offset.zero);
    final r0 = camera.rotationRad;
    final r1 = r0 + turn;
    final scale = math.pow(2.0, z1 - z0).toDouble();
    final world =
        camera.projectAtZoom(camera.center, z0) + _turned(f - pan, -r0);
    final worldSize = 256.0 * math.pow(2.0, z1);
    final centre = world * scale - _turned(f, -r1);
    final to = camera.unprojectAtZoom(
      Offset(centre.dx, centre.dy.clamp(0.0, worldSize)),
      z1,
    );
    if (turn == 0) {
      widget.controller.move(to, z1);
    } else {
      widget.controller.moveAndRotate(to, z1, r1 * 180 / math.pi);
    }
  }

  void _stopMotion() {
    _flingDuration = 0;
    _zoomVelocity = 0;
    _animRemaining = 0;
    if (_ticker.isActive) _ticker.stop();
  }

  void _startTicker() {
    if (_ticker.isActive) return;
    _lastTick = Duration.zero;
    _ticker.start();
  }

  void _animateZoom(double delta, Offset focal) {
    final zoom = widget.controller.camera.zoom;
    final left = _animRemaining != 0
        ? _animTotal *
              (1 - _ease(_animElapsed / (_zoomAnimation.inMicroseconds / 1e6)))
        : 0.0;
    final from = zoom + left;
    final target = (from + delta).clamp(widget.minZoom, widget.maxZoom);
    _stopMotion();
    _animRemaining = target - zoom;
    _animTotal = _animRemaining;
    _animElapsed = 0;
    _momentumFocal = focal;
    if (_animRemaining != 0) _startTicker();
  }

  void _tick(Duration elapsed) {
    final dt = math.min(0.05, (elapsed - _lastTick).inMicroseconds / 1e6);
    _lastTick = elapsed;
    if (dt <= 0) return;
    var pan = Offset.zero;
    var zoom = 0.0;
    var focal = _momentumFocal;

    if (_animRemaining != 0) {
      final before = _ease(
        _animElapsed / (_zoomAnimation.inMicroseconds / 1e6),
      );
      _animElapsed += dt;
      final after = _ease(_animElapsed / (_zoomAnimation.inMicroseconds / 1e6));
      zoom += _animTotal * (after - before);
      if (after >= 1) _animRemaining = 0;
    }
    if (_flingDuration > 0) {
      final before = _glide(_flingElapsed / _flingDuration);
      _flingElapsed += dt;
      final after = _glide(_flingElapsed / _flingDuration);
      pan = _flingVector * (after - before);
      if (after >= 1) _flingDuration = 0;
    }
    if (_zoomVelocity != 0) {
      final k = math.exp(-dt / _zoomDecay);
      zoom += _zoomVelocity * _zoomDecay * (1 - k);
      _zoomVelocity *= k;
      final at = widget.controller.camera.zoom;
      if (_zoomVelocity.abs() < 0.05 ||
          at <= widget.minZoom && _zoomVelocity < 0 ||
          at >= widget.maxZoom && _zoomVelocity > 0) {
        _zoomVelocity = 0;
      }
    }
    if (zoom == 0) {
      focal = widget.controller.camera.nonRotatedSize.center(Offset.zero);
    }
    _apply(pan, zoom, focal);
    if (_animRemaining == 0 && _flingDuration == 0 && _zoomVelocity == 0) {
      _ticker.stop();
    }
  }

  static double _glide(double t) =>
      t >= 1 ? 1 : 1 - math.pow(1 - t, _flingPower).toDouble();

  static double _ease(double t) {
    if (t >= 1) return 1;
    final u = 1 - t;
    return 1 - u * u * u;
  }

  void _down(PointerDownEvent e) {
    _stopMotion();
    if (widget.keyboard) _focus.requestFocus();
    _pointers[e.pointer] = e.localPosition;
    final mouse = e.kind == PointerDeviceKind.mouse;
    if (_pointers.length == 1 &&
        mouse &&
        widget.rotate &&
        (e.buttons & kSecondaryMouseButton != 0 ||
            e.buttons & kPrimaryMouseButton != 0 &&
                HardwareKeyboard.instance.isControlPressed)) {
      _last = e.localPosition;
      _mode = _Mode.turn;
      return;
    }
    if (_pointers.length == 1) {
      _downAt = e.localPosition;
      _downTime = e.timeStamp;
      _last = e.localPosition;
      _velocity = VelocityTracker.withKind(e.kind)
        ..addPosition(e.timeStamp, e.localPosition);
      final tap = _lastTapAt;
      _secondTap =
          tap != null &&
          e.timeStamp - _lastTapTime < _doubleTapGap &&
          (tap - e.localPosition).distance < _doubleTapReach;
      _mode = _Mode.pending;
    } else if (_pointers.length == 2) {
      _startPinch(e.timeStamp);
    }
  }

  void _startPinch(Duration time) {
    final p = _pointers.values.toList();
    _focal = (p[0] + p[1]) / 2;
    _spread = math.max(1, (p[0] - p[1]).distance);
    _bearing = (p[1] - p[0]).direction;
    _twist = 0;
    _turning = false;
    _pinchTravel = 0;
    _pinchStart = time;
    _pinchZoom = 0;
    _zoomSamples
      ..clear()
      ..add((time, 0));
    _velocity = VelocityTracker.withKind(PointerDeviceKind.touch)
      ..addPosition(time, _focal);
    _secondTap = false;
    _lastTapAt = null;
    _mode = _Mode.pinch;
  }

  void _move(PointerMoveEvent e) {
    if (!_pointers.containsKey(e.pointer)) return;
    _pointers[e.pointer] = e.localPosition;
    switch (_mode) {
      case _Mode.pending:
        if ((e.localPosition - _downAt).distance < _slop) return;
        _mode = _secondTap ? _Mode.quickZoom : _Mode.pan;
        _pinchZoom = 0;
        _zoomSamples
          ..clear()
          ..add((e.timeStamp, 0));
        _last = e.localPosition;
        _velocity.addPosition(e.timeStamp, e.localPosition);
      case _Mode.pan:
        _apply(e.localPosition - _last, 0, e.localPosition);
        _last = e.localPosition;
        _velocity.addPosition(e.timeStamp, e.localPosition);
      case _Mode.quickZoom:
        final dz = (e.localPosition.dy - _last.dy) / _quickZoomPixelsPerLevel;
        _apply(Offset.zero, dz, _downAt);
        _last = e.localPosition;
        _pinchZoom += dz;
        _zoomSamples.add((e.timeStamp, _pinchZoom));
        while (_zoomSamples.length > 2 &&
            e.timeStamp - _zoomSamples.first.$1 >
                const Duration(milliseconds: 90)) {
          _zoomSamples.removeAt(0);
        }
      case _Mode.pinch:
        if (_pointers.length < 2) return;
        final p = _pointers.values.toList();
        final focal = (p[0] + p[1]) / 2;
        final spread = math.max(1.0, (p[0] - p[1]).distance);
        final dz = math.log(spread / _spread) / math.ln2;
        final bearing = (p[1] - p[0]).direction;
        var turn = bearing - _bearing;
        if (turn > math.pi) turn -= 2 * math.pi;
        if (turn < -math.pi) turn += 2 * math.pi;
        _bearing = bearing;
        if (!widget.rotate) {
          turn = 0;
        } else if (!_turning) {
          _twist += turn;
          turn = 0;
          _turning = _twist.abs() > _turnSlop;
        }
        _pinchTravel +=
            (focal - _focal).distance + dz.abs() * 120 + turn.abs() * 200;
        _apply(focal - _focal, dz, focal, turn);
        _pinchZoom += dz;
        _focal = focal;
        _spread = spread;
        _velocity.addPosition(e.timeStamp, focal);
        _zoomSamples.add((e.timeStamp, _pinchZoom));
        while (_zoomSamples.length > 2 &&
            e.timeStamp - _zoomSamples.first.$1 >
                const Duration(milliseconds: 90)) {
          _zoomSamples.removeAt(0);
        }
      case _Mode.turn:
        final turn = (e.localPosition.dx - _last.dx) * 0.8 * math.pi / 180;
        _last = e.localPosition;
        final camera = widget.controller.camera;
        _apply(
          Offset.zero,
          0,
          camera.nonRotatedSize.center(Offset.zero),
          -turn,
        );
      case _Mode.idle || _Mode.spent:
        break;
    }
  }

  void _up(PointerEvent e) {
    if (_pointers.remove(e.pointer) == null) return;
    final cancelled = e is PointerCancelEvent;
    switch (_mode) {
      case _Mode.pending:
        if (!cancelled && e.timeStamp - _downTime < _tapTime) {
          if (_secondTap) {
            _lastTapAt = null;
            _animateZoom(1, _downAt);
          } else {
            _lastTapAt = _downAt;
            _lastTapTime = e.timeStamp;
          }
        }
      case _Mode.pan:
        if (!cancelled) _fling(_velocity.getVelocity().pixelsPerSecond);
      case _Mode.pinch:
        if (!cancelled) {
          if (_pinchTravel < _slop * 2 &&
              e.timeStamp - _pinchStart < _tapTime) {
            _animateZoom(-1, _focal);
          } else {
            _releasePinch(e.timeStamp);
          }
        }
        _mode = _pointers.isEmpty ? _Mode.idle : _Mode.spent;
        return;
      case _Mode.quickZoom:
        if (!cancelled) {
          _focal = _downAt;
          _velocity = VelocityTracker.withKind(PointerDeviceKind.touch);
          _releasePinch(e.timeStamp);
        }
        _lastTapAt = null;
      case _Mode.turn || _Mode.idle || _Mode.spent:
        break;
    }
    if (_pointers.isEmpty) _mode = _Mode.idle;
  }

  void _fling(Offset velocity) {
    final speed = velocity.distance;
    if (speed < _minFling) return;
    final capped = math.min(speed, _maxFling);
    _flingDuration = capped * _flingSecondsPerSpeed;
    _flingElapsed = 0;
    _flingVector = velocity * (capped * _flingDuration / _flingPower / speed);
    _startTicker();
  }

  void _releasePinch(Duration time) {
    final first = _zoomSamples.first;
    final last = _zoomSamples.last;
    final span = (last.$1 - first.$1).inMicroseconds / 1e6;
    final fresh = time - last.$1 < const Duration(milliseconds: 60);
    if (fresh && span > 0.02) {
      final v = (last.$2 - first.$2) / span;
      if (v.abs() > _minZoomFling) {
        _zoomVelocity = v.clamp(-_maxZoomFling, _maxZoomFling);
      }
    }
    _momentumFocal = _focal;
    _fling(_velocity.getVelocity().pixelsPerSecond);
    if (_zoomVelocity != 0) _startTicker();
  }

  void _signal(PointerSignalEvent e) {
    GestureBinding.instance.pointerSignalResolver.register(e, (event) {
      switch (event) {
        // Two fingers sliding on a trackpad, as a browser reports them.
        case PointerScrollEvent(
          kind: PointerDeviceKind.trackpad,
          :final scrollDelta,
          :final localPosition,
        ):
          _stopMotion();
          _apply(-scrollDelta, 0, localPosition);
        case PointerScrollEvent(:final scrollDelta, :final localPosition):
          if (scrollDelta.dy != 0) {
            _animateZoom(-scrollDelta.dy / 300, localPosition);
          }
        // A trackpad pinch, as a browser reports it.
        case PointerScaleEvent(:final scale, :final localPosition):
          if (scale > 0) {
            _stopMotion();
            _apply(Offset.zero, math.log(scale) / math.ln2, localPosition);
          }
        case PointerScrollInertiaCancelEvent():
          _stopMotion();
        default:
      }
    });
  }

  void _padStart(PointerPanZoomStartEvent e) {
    _stopMotion();
    _padPan = Offset.zero;
    _padScale = 1;
    _padTurn = 0;
    _velocity = VelocityTracker.withKind(PointerDeviceKind.trackpad)
      ..addPosition(e.timeStamp, Offset.zero);
  }

  void _padUpdate(PointerPanZoomUpdateEvent e) {
    final pan = e.pan - _padPan;
    _padPan = e.pan;
    final zoom = e.scale > 0 && _padScale > 0
        ? math.log(e.scale / _padScale) / math.ln2
        : 0.0;
    _padScale = e.scale;
    final turn = widget.rotate ? e.rotation - _padTurn : 0.0;
    _padTurn = e.rotation;
    _apply(pan, zoom, e.localPosition, turn);
    _velocity.addPosition(e.timeStamp, e.pan);
  }

  void _padEnd(PointerPanZoomEndEvent e) =>
      _fling(_velocity.getVelocity().pixelsPerSecond);

  KeyEventResult _key(FocusNode node, KeyEvent e) {
    if (e is KeyUpEvent) return KeyEventResult.ignored;
    final key = e.logicalKey;
    final shift = HardwareKeyboard.instance.isShiftPressed;
    final camera = widget.controller.camera;
    final middle = camera.nonRotatedSize.center(Offset.zero);
    if (key == LogicalKeyboardKey.equal ||
        key == LogicalKeyboardKey.add ||
        key == LogicalKeyboardKey.numpadAdd) {
      _animateZoom(shift ? 2 : 1, middle);
    } else if (key == LogicalKeyboardKey.minus ||
        key == LogicalKeyboardKey.underscore ||
        key == LogicalKeyboardKey.numpadSubtract) {
      _animateZoom(shift ? -2 : -1, middle);
    } else if (shift &&
        widget.rotate &&
        (key == LogicalKeyboardKey.arrowLeft ||
            key == LogicalKeyboardKey.arrowRight)) {
      final by = key == LogicalKeyboardKey.arrowLeft ? 15 : -15;
      _apply(Offset.zero, 0, middle, by * math.pi / 180);
    } else {
      final step = switch (key) {
        LogicalKeyboardKey.arrowLeft => const Offset(100, 0),
        LogicalKeyboardKey.arrowRight => const Offset(-100, 0),
        LogicalKeyboardKey.arrowUp => const Offset(0, 100),
        LogicalKeyboardKey.arrowDown => const Offset(0, -100),
        _ => null,
      };
      if (step == null) return KeyEventResult.ignored;
      _stopMotion();
      _apply(step, 0, middle);
    }
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.enabled) return widget.child;
    final map = Listener(
      behavior: HitTestBehavior.translucent,
      onPointerDown: _down,
      onPointerMove: _move,
      onPointerUp: _up,
      onPointerCancel: _up,
      onPointerSignal: _signal,
      onPointerPanZoomStart: _padStart,
      onPointerPanZoomUpdate: _padUpdate,
      onPointerPanZoomEnd: _padEnd,
      child: widget.child,
    );
    if (!widget.keyboard) return map;
    return Focus(focusNode: _focus, onKeyEvent: _key, child: map);
  }
}
