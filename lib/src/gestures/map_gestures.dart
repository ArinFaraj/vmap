import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'browser_wheel.dart';
import 'gesture_options.dart';
import 'gesture_target.dart';
import 'wheel_zoom.dart';

enum _Gesture { undecided, pan, pinch, tilt, quickZoom, turnTilt, box }

/// What letting go of the map's last finger or button ends.
enum _Release {
  box,
  held,
  twoFingerTap,
  doubleTap,
  quickZoomDrag,
  tap,
  markerTap,
  fling,
}

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

/// Reads touches, the mouse, a trackpad and the keyboard as MapLibre GL JS
/// does, and moves a [MapGestureTarget]. One finger pans; two pinch, turn,
/// and tilt when dragged up or down together; a double tap zooms in and a
/// two finger tap out; a double tap held and dragged zooms. A mouse wheel
/// zooms, a double click zooms in and a shift double click out, a right or
/// control drag turns and tilts, and a shift drag zooms to its box. Two
/// fingers on a trackpad slide the map, a pinch zooms and a twist turns it.
/// With focus the arrow keys pan, `+` and `-` zoom, two levels with shift,
/// and shift with the arrows turns and tilts. Released gestures keep their
/// speed and slow down naturally. [options] switches each of them off.
///
/// It reads raw pointers rather than joining the gesture arena, so the map
/// follows the finger from the first frame. Give it to a
/// [MapGestureDetector] over the map.
class MapGestureRecognizer {
  MapGestureRecognizer(
    this.target, {
    VmapGestureOptions options = const VmapGestureOptions(),
    this.onTap,
    this.onLongPress,
    this.onSettle,
  }) : _options = ValueNotifier(options);

  MapGestureTarget target;

  /// Which gestures move the map; a [MapGestureDetector] follows changes.
  VmapGestureOptions get options => _options.value;
  set options(VmapGestureOptions value) => _options.value = value;
  final ValueNotifier<VmapGestureOptions> _options;

  /// Called with where a tap landed.
  void Function(Offset at)? onTap;

  /// Called with where a finger was held still.
  void Function(Offset at)? onLongPress;

  /// Called when a gesture has let go of the map, for the host to tell
  /// whether the camera has come to rest.
  VoidCallback? onSettle;

  /// Takes the map's key presses once a press on it gave it focus.
  final FocusNode focus = FocusNode(debugLabel: 'vmap gestures');

  /// The box a shift drag draws so far, in logical pixels.
  final ValueNotifier<Rect?> box = ValueNotifier(null);

  /// The cursor over the map: a hand, closed while the mouse drags.
  final ValueNotifier<MouseCursor> cursor = ValueNotifier(
    SystemMouseCursors.grab,
  );

  /// Whether a gesture is under way: fingers down, or a wheel zoom not
  /// yet come to rest.
  bool get active => _fingers.isNotEmpty || _scrollZoom.zooming;

  /// The next pointer down is on something above the map that takes its
  /// own tap, as a marker: it may still pan the map.
  void claimPointer() => _onMarker = true;

  static const _doubleTapGap = Duration(milliseconds: 300);
  static const _tapTime = Duration(milliseconds: 250);
  static const _longPressTime = Duration(milliseconds: 500);
  static const _tapSlop = 8.0;
  static const _doubleTapReach = 48.0;

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

  bool _onMarker = false;
  bool _markerTouch = false;
  bool _longPressed = false;
  Timer? _longPress;

  late final WheelZoom _scrollZoom = WheelZoom(
    () => target,
    onEnd: () {
      if (!_disposed) onSettle?.call();
    },
  );

  /// A double click with shift held zooms out rather than in.
  bool _zoomOutTap = false;

  Offset _boxStart = Offset.zero;

  Offset _trackpadLast = Offset.zero;
  double _trackpadScale = 1, _trackpadTurn = 0;
  bool _trackpad = false;

  bool _menuHeld = false;
  bool _disposed = false;

  bool get _tapZooms => options.doubleClickZoom;
  bool get _dragTurns => options.dragRotate && options.rotate;
  bool get _dragTilts =>
      options.dragRotate && options.pitchWithRotate && options.pitch;
  bool get _pinchZooms => options.touchZoomRotate;
  bool get _pinchTurns => options.touchZoomRotate && options.rotate;
  bool get _touchTilts => options.touchPitch && options.pitch;
  bool get _trackpadMoves =>
      options.dragPan || options.scrollZoom || options.touchZoomRotate;

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
    } else if (_gesture != _Gesture.quickZoom &&
        _gesture != _Gesture.turnTilt) {
      _gesture = _Gesture.pan;
    }
    if (fresh) {
      _resetChannels(at);
    } else {
      _record(at);
    }
  }

  void down(PointerDownEvent e) {
    final onMarker = _onMarker;
    _onMarker = false;
    if (options.keyboard) focus.requestFocus();
    target.stop();
    _fingers[e.pointer] = e.localPosition;
    _downAt[e.pointer] = e.timeStamp;
    _most = math.max(_most, _fingers.length);
    _longPress?.cancel();
    if (_fingers.length == 1) {
      _markerTouch = onMarker;
      _moved = false;
      final last = _tapUpAt;
      _secondTap =
          (_tapZooms || _pinchZooms) &&
          !onMarker &&
          last != null &&
          e.timeStamp - last < _doubleTapGap &&
          (e.localPosition - _tapUpPosition).distance < _doubleTapReach;
      final mouse = e.kind == PointerDeviceKind.mouse;
      final keys = HardwareKeyboard.instance;
      if (_secondTap) {
        _gesture = _Gesture.quickZoom;
        _quickAnchor = e.localPosition;
        _quickStartZoom = target.zoom;
        _zoomOutTap = mouse && keys.isShiftPressed;
      } else if (mouse &&
          (e.buttons & kSecondaryMouseButton != 0 ||
              e.buttons & kPrimaryMouseButton != 0 && keys.isControlPressed)) {
        _gesture = _Gesture.turnTilt;
        if (options.dragRotate) _holdContextMenu();
      } else if (mouse &&
          options.boxZoom &&
          !onMarker &&
          e.buttons & kPrimaryMouseButton != 0 &&
          keys.isShiftPressed) {
        _gesture = _Gesture.box;
        _boxStart = e.localPosition;
      }
      if (mouse) cursor.value = SystemMouseCursors.grabbing;
      final onLongPress = this.onLongPress;
      if (onLongPress != null && !onMarker) {
        final at = e.localPosition;
        _longPress = Timer(_longPressTime, () {
          if (_disposed || _moved || _fingers.length != 1) return;
          _longPressed = true;
          onLongPress(at);
        });
      }
    } else {
      _secondTap = false;
      if (_gesture == _Gesture.quickZoom) _gesture = _Gesture.undecided;
    }
    _longPressed = false;
    final keep = _gesture;
    _restart(e.timeStamp, fresh: _fingers.length == 1);
    if (keep == _Gesture.box && _fingers.length == 1) _gesture = keep;
  }

  /// A browser opens its own menu on a right click, or a control click on
  /// a Mac, over the drag that turns the map: it is held off from the
  /// press until a moment after the release, as some browsers open it on
  /// the release.
  void _holdContextMenu() {
    if (!kIsWeb || !BrowserContextMenu.enabled) return;
    _menuHeld = true;
    unawaited(BrowserContextMenu.disableContextMenu());
  }

  void _releaseContextMenu() {
    if (!_menuHeld) return;
    _menuHeld = false;
    Timer(const Duration(milliseconds: 100), () {
      if (!BrowserContextMenu.enabled) {
        unawaited(BrowserContextMenu.enableContextMenu());
      }
    });
  }

  void move(PointerMoveEvent e) {
    if (!_fingers.containsKey(e.pointer)) return;
    _fingers[e.pointer] = e.localPosition;
    final start = _fingersAtStart[e.pointer];
    if (start != null && (e.localPosition - start).distance > _tapSlop) {
      _moved = true;
      _longPress?.cancel();
    }
    if (!_moved && _gesture != _Gesture.quickZoom) return;
    final focal = _focal;
    switch (_gesture) {
      case _Gesture.quickZoom:
        if (_pinchZooms) {
          final zoom = _quickStartZoom + (focal.dy - _quickAnchor.dy) / 160;
          _zoomTotal = zoom - _quickStartZoom;
          target.jump(
            MapGestureStep(around: _quickAnchor, zoomBy: zoom - target.zoom),
          );
        }
      case _Gesture.pan:
        if (options.dragPan) {
          _panTotal += focal - _lastFocal;
          target.jump(MapGestureStep(from: _lastFocal, to: focal));
        }
      case _Gesture.turnTilt:
        final d = focal - _lastFocal;
        final turn = _dragTurns ? d.dx * 0.8 : 0.0;
        final tilt = _dragTilts ? -d.dy * 0.45 : 0.0;
        if (turn != 0 || tilt != 0) {
          _turnTotal += turn;
          _tiltTotal += tilt;
          target.jump(MapGestureStep(turn: turn, tilt: tilt));
        }
      case _Gesture.box:
        box.value = Rect.fromPoints(_boxStart, focal);
      case _Gesture.undecided:
        _decide();
        if (_gesture == _Gesture.undecided) return;
        move(e);
        return;
      case _Gesture.tilt:
        final tilt = -(focal.dy - _lastFocal.dy) * 0.45;
        _tiltTotal += tilt;
        target.jump(MapGestureStep(tilt: tilt));
      case _Gesture.pinch:
        _pinch(focal);
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
    if (_touchTilts && sideBySide && together && vertical && steadySpan) {
      if (math.min(da.dy.abs(), db.dy.abs()) > 10) _gesture = _Gesture.tilt;
      return;
    }
    if ((span / _spanAtStart - 1).abs() > 0.04 ||
        twist > 0.06 ||
        (da + db).distance / 2 > 14) {
      // From the span at touch down, so the ground under the fingers stays
      // under them through the movement it took to tell a pinch.
      _gesture = _Gesture.pinch;
      _lastSpan = _spanAtStart;
      _lastAngle = angle;
    }
  }

  void _pinch(Offset focal) {
    final (span, angle) = _spanAndAngle();
    final pan = options.dragPan;
    if (pan) _panTotal += focal - _lastFocal;
    final zoomBy = _pinchZooms && _lastSpan > 0
        ? math.log(span / _lastSpan) / math.ln2
        : 0.0;
    _zoomTotal += zoomBy;
    var turn = 0.0;
    if (_pinchTurns) {
      var since = angle - _angleAtStart;
      while (since > math.pi) {
        since -= 2 * math.pi;
      }
      while (since < -math.pi) {
        since += 2 * math.pi;
      }
      if (!_turning && since.abs() > options.rotateThreshold * _radians) {
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
    target.jump(
      MapGestureStep(
        from: pan ? _lastFocal : null,
        to: pan ? focal : null,
        around: focal,
        zoomBy: zoomBy,
        turn: turn,
      ),
    );
    _lastSpan = span;
    _lastAngle = angle;
  }

  void up(PointerEvent e) {
    _longPress?.cancel();
    final downAt = _downAt.remove(e.pointer);
    final start = _fingersAtStart[e.pointer];
    final most = _most;
    final gesture = _gesture;
    final focal = gesture == _Gesture.quickZoom ? _quickAnchor : _lastFocal;
    final end = e.timeStamp;
    final short =
        e is PointerUpEvent &&
        downAt != null &&
        end - downAt < _tapTime &&
        start != null &&
        (e.localPosition - start).distance < _tapSlop &&
        !_moved;
    if (_fingers.remove(e.pointer) == null) return;
    if (_fingers.isNotEmpty) {
      _restart(end);
      return;
    }
    _most = 0;
    cursor.value = SystemMouseCursors.grab;
    _releaseContextMenu();
    final drawn = box.value;
    box.value = null;
    final release = _released(gesture, most, short, drawn);
    _gesture = _Gesture.undecided;
    _tapUpAt = null;
    _markerTouch = false;
    switch (release) {
      case _Release.box:
        _zoomToBox(drawn!);
      case _Release.held:
        onSettle?.call();
      case _Release.twoFingerTap:
        _zoomBy(-1, focal);
      case _Release.doubleTap:
        _zoomBy(_zoomOutTap ? -1 : 1, e.localPosition);
      case _Release.quickZoomDrag:
        _coast(focal, end);
      case _Release.markerTap:
        break;
      case _Release.tap:
        _tapUpAt = end;
        _tapUpPosition = e.localPosition;
        onTap?.call(e.localPosition);
        onSettle?.call();
      case _Release.fling:
        _coast(focal, end);
        onSettle?.call();
    }
  }

  _Release _released(_Gesture gesture, int most, bool short, Rect? drawn) {
    if (gesture == _Gesture.box && drawn != null && _moved) return _Release.box;
    if (_longPressed) return _Release.held;
    if (_tapZooms && most == 2 && short && gesture != _Gesture.tilt) {
      return _Release.twoFingerTap;
    }
    if (gesture == _Gesture.quickZoom) {
      if (_moved) return _Release.quickZoomDrag;
      if (_tapZooms) return _Release.doubleTap;
    }
    if (most == 1 && short && gesture != _Gesture.turnTilt) {
      return _markerTouch ? _Release.markerTap : _Release.tap;
    }
    return _Release.fling;
  }

  static const _radians = math.pi / 180;

  /// Lets every part of the movement coast together at the speed it had:
  /// a pan that was zooming keeps zooming as it slides.
  void _coast(Offset focal, Duration end) {
    if (!options.inertia) return;
    final glide = MapGlide.of(
      focal: focal,
      pan: Offset(_focalX.perSecond(end), _focalY.perSecond(end)),
      zoom: _zoomRate.perSecond(end),
      turn: _turnRate.perSecond(end),
      tilt: _tiltRate.perSecond(end),
    );
    if (glide != null) target.glide(glide);
  }

  double _clampZoom(double zoom) =>
      zoom.clamp(target.minZoom, target.maxZoom).toDouble();

  /// Zooms so the box a shift drag drew fills the map, as MapLibre's box
  /// zoom does.
  void _zoomToBox(Rect drawn) {
    if (drawn.width < 4 || drawn.height < 4) return;
    final size = target.size;
    final by =
        math.log(
          math.min(size.width / drawn.width, size.height / drawn.height),
        ) /
        math.ln2;
    final zoom = target.zoom;
    target.ease(
      MapGestureStep(
        from: drawn.center,
        to: target.centre,
        zoomBy: _clampZoom(zoom + by) - zoom,
      ),
      const Duration(milliseconds: 300),
    );
  }

  void _zoomBy(double levels, Offset at) => target.ease(
    MapGestureStep(around: at, zoomBy: levels),
    const Duration(milliseconds: 300),
  );

  /// A scroll from Flutter. In a browser the map reads the page's own
  /// wheel events instead, through [wheel].
  void signal(PointerSignalEvent e) {
    final wanted = switch (e) {
      PointerScrollEvent() => !kIsWeb && options.scrollZoom,
      PointerScrollInertiaCancelEvent() => options.any,
      _ => false,
    };
    if (!wanted) return;
    GestureBinding.instance.pointerSignalResolver.register(e, (event) {
      switch (event) {
        case PointerScrollEvent(:final scrollDelta, :final localPosition):
          wheel((
            deltaY: scrollDelta.dy,
            lines: false,
            shift: HardwareKeyboard.instance.isShiftPressed,
            at: localPosition,
          ));
        case PointerScrollInertiaCancelEvent():
          target.stop();
        default:
      }
    });
  }

  /// A wheel event, zoomed by as MapLibre GL JS's scroll zoom does.
  void wheel(WheelInput input) {
    if (!options.scrollZoom) return;
    _scrollZoom
      ..zoomRate = options.zoomRate
      ..wheelZoomRate = options.wheelZoomRate
      ..wheel(input);
  }

  void panZoomStart(PointerPanZoomStartEvent e) {
    _trackpad = _trackpadMoves;
    if (!_trackpad) return;
    target.stop();
    _trackpadLast = Offset.zero;
    _trackpadScale = 1;
    _trackpadTurn = 0;
    _fingersAtStart.clear();
    _lastFocal = e.localPosition;
    _resetChannels(e.timeStamp);
  }

  void panZoomUpdate(PointerPanZoomUpdateEvent e) {
    if (!_trackpad) return;
    final focal = e.localPosition;
    final pan = options.dragPan ? e.pan - _trackpadLast : Offset.zero;
    _trackpadLast = e.pan;
    final zoomBy = options.scrollZoom && e.scale > 0 && _trackpadScale > 0
        ? math.log(e.scale / _trackpadScale) / math.ln2
        : 0.0;
    _trackpadScale = e.scale;
    final turn = _pinchTurns
        ? -(e.rotation - _trackpadTurn) * 180 / math.pi
        : 0.0;
    _trackpadTurn = e.rotation;
    _panTotal += pan;
    _zoomTotal += zoomBy;
    _turnTotal += turn;
    target.jump(
      MapGestureStep(
        from: focal,
        to: focal + pan,
        around: focal,
        zoomBy: zoomBy,
        turn: turn,
      ),
    );
    _lastFocal = focal;
    _record(e.timeStamp);
  }

  void panZoomEnd(PointerPanZoomEndEvent e) {
    if (!_trackpad) return;
    _trackpad = false;
    _gesture = _Gesture.undecided;
    _coast(_lastFocal, e.timeStamp);
    onSettle?.call();
  }

  KeyEventResult key(FocusNode node, KeyEvent e) {
    if (!options.keyboard || e is KeyUpEvent) return KeyEventResult.ignored;
    final key = e.logicalKey;
    final shift = HardwareKeyboard.instance.isShiftPressed;
    if (key == LogicalKeyboardKey.escape && box.value != null) {
      box.value = null;
      _gesture = _Gesture.undecided;
      return KeyEventResult.handled;
    }
    // As MapLibre's: from the nearest whole zoom, two levels with shift.
    final zoomStep = shift ? 2 : 1;
    final zoom = target.zoom;
    final turn = shift ? _keyTurn(key) : null;
    final tilt = shift ? _keyTilt(key) : null;
    final MapGestureStep step;
    if (key == LogicalKeyboardKey.equal ||
        key == LogicalKeyboardKey.add ||
        key == LogicalKeyboardKey.numpadAdd) {
      step = MapGestureStep(
        zoomBy: _clampZoom(zoom.roundToDouble() + zoomStep) - zoom,
      );
    } else if (key == LogicalKeyboardKey.minus ||
        key == LogicalKeyboardKey.underscore ||
        key == LogicalKeyboardKey.numpadSubtract) {
      step = MapGestureStep(
        zoomBy: _clampZoom(zoom.roundToDouble() - zoomStep) - zoom,
      );
    } else if (turn != null && options.rotate) {
      step = MapGestureStep(turn: turn);
    } else if (tilt != null && options.pitch) {
      step = MapGestureStep(tilt: tilt);
    } else {
      final by = switch (key) {
        LogicalKeyboardKey.arrowLeft => const Offset(-100, 0),
        LogicalKeyboardKey.arrowRight => const Offset(100, 0),
        LogicalKeyboardKey.arrowUp => const Offset(0, -100),
        LogicalKeyboardKey.arrowDown => const Offset(0, 100),
        _ => null,
      };
      if (by == null) return KeyEventResult.ignored;
      final middle = target.size.center(Offset.zero);
      step = MapGestureStep(from: middle + by, to: middle);
    }
    target.ease(step, const Duration(milliseconds: 200));
    return KeyEventResult.handled;
  }

  static double? _keyTurn(LogicalKeyboardKey key) => switch (key) {
    LogicalKeyboardKey.arrowLeft => -15,
    LogicalKeyboardKey.arrowRight => 15,
    _ => null,
  };

  static double? _keyTilt(LogicalKeyboardKey key) => switch (key) {
    LogicalKeyboardKey.arrowUp => 10,
    LogicalKeyboardKey.arrowDown => -10,
    _ => null,
  };

  void dispose() {
    _disposed = true;
    _options.dispose();
    _longPress?.cancel();
    _scrollZoom.dispose();
    _releaseContextMenu();
    box.dispose();
    cursor.dispose();
    focus.dispose();
  }
}

/// Feeds a [MapGestureRecognizer] the pointers, scrolls, keys and browser
/// pinches that land on [child], and draws the box of a shift drag over it.
class MapGestureDetector extends StatefulWidget {
  const MapGestureDetector({
    required this.recognizer,
    required this.child,
    this.behavior = HitTestBehavior.opaque,
    super.key,
  });

  final MapGestureRecognizer recognizer;
  final Widget child;
  final HitTestBehavior behavior;

  @override
  State<MapGestureDetector> createState() => _MapGestureDetectorState();
}

class _MapGestureDetectorState extends State<MapGestureDetector> {
  final _listener = GlobalKey();
  VoidCallback? _stopWheel;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!kIsWeb) return;
    _stopWheel?.call();
    final viewId = View.of(context).viewId;
    _stopWheel = listenBrowserWheel(
      viewId: viewId,
      owns: (point) => _hits(point, viewId),
      onWheel: (input) => widget.recognizer.wheel((
        deltaY: input.deltaY,
        lines: input.lines,
        shift: input.shift,
        at: _local(input.at),
      )),
    );
  }

  @override
  void dispose() {
    _stopWheel?.call();
    super.dispose();
  }

  bool _hits(Offset point, int viewId) {
    final box = _listener.currentContext?.findRenderObject();
    if (box == null || !box.attached) return false;
    final result = HitTestResult();
    GestureBinding.instance.hitTestInView(result, point, viewId);
    return result.path.any((entry) => identical(entry.target, box));
  }

  Offset _local(Offset point) {
    final box = _listener.currentContext?.findRenderObject() as RenderBox?;
    return box == null || !box.attached ? point : box.globalToLocal(point);
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.recognizer;
    final map = Listener(
      key: _listener,
      behavior: widget.behavior,
      onPointerDown: r.down,
      onPointerMove: r.move,
      onPointerUp: r.up,
      onPointerCancel: r.up,
      onPointerSignal: r.signal,
      onPointerPanZoomStart: r.panZoomStart,
      onPointerPanZoomUpdate: r.panZoomUpdate,
      onPointerPanZoomEnd: r.panZoomEnd,
      child: Stack(
        fit: StackFit.expand,
        children: [
          widget.child,
          ValueListenableBuilder(
            valueListenable: r.box,
            builder: (context, box, _) => box == null
                ? const SizedBox.shrink()
                : Positioned.fromRect(
                    rect: box,
                    child: const IgnorePointer(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: Color(0x1A3887BE),
                          border: Border.fromBorderSide(
                            BorderSide(color: Color(0xFF3887BE), width: 2),
                          ),
                        ),
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
    return ValueListenableBuilder(
      valueListenable: r._options,
      child: map,
      builder: (context, options, map) => Focus(
        focusNode: r.focus,
        canRequestFocus: options.keyboard,
        skipTraversal: !options.keyboard,
        onKeyEvent: r.key,
        child: ValueListenableBuilder(
          valueListenable: r.cursor,
          child: map,
          builder: (context, cursor, map) => MouseRegion(
            cursor: options.any ? cursor : MouseCursor.defer,
            child: map,
          ),
        ),
      ),
    );
  }
}
