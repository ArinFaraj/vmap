import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:latlong2/latlong.dart';

import '../engine.dart';
import '../errors.dart';
import '../frame_rate.dart';
import '../glyphs/vmap_font.dart';
import '../map_camera.dart';
import '../marker.dart';
import '../options.dart';
import '../pins.dart';
import '../query.dart';
import '../style.dart';
import '../text_style.dart';
import '../view.dart';
import 'markers.dart';
import 'vmap_controller.dart';

/// A map of any MapLibre style, drawn by vmap.
///
/// One finger pans; two pinch, turn, and tilt when dragged up or down
/// together; a double tap zooms in and a two finger tap out; a double tap
/// held and dragged zooms. A mouse wheel zooms, a right drag turns and
/// tilts, a trackpad pans, pinches and turns, and with focus the arrow keys
/// pan, `+` and `-` zoom, and shift with the arrows turns and tilts.
/// Released gestures and interrupted animations keep their speed and slow
/// down naturally.
class Vmap extends StatefulWidget {
  const Vmap({
    this.controller,
    this.initialCamera = const VmapCamera(center: LatLng(0, 0), zoom: 1),
    this.style = VmapStyle.light,
    this.overlay,
    this.styleEdits = const [],
    this.featureStates = const [],
    this.markers = const [],
    this.pins,
    this.textStyle = const VmapTextStyle(),
    this.labels = const VmapLabelOptions(),
    this.network = const VmapNetworkOptions(),
    this.rendering = const VmapRenderOptions(),
    this.fonts = const [],
    this.engine,
    this.minZoom = 0,
    this.maxZoom = 22,
    this.maxPitch = 60,
    this.interactive = true,
    this.rotate = true,
    this.tilt = true,
    this.keyboard = true,
    this.attribution = true,
    this.loadingBuilder,
    this.onTap,
    this.onLongPress,
    this.onCameraMove,
    this.onCameraIdle,
    this.onStyleLoaded,
    this.onIdle,
    this.onError,
    this.semanticLabel = 'Map',
    super.key,
  });

  /// Moves the map from code and reads where it looks. The map makes its
  /// own, starting at [initialCamera], when none is given.
  final VmapController? controller;

  /// Where a map without a [controller] starts.
  final VmapCamera initialCamera;

  /// The style to draw: one of MapLibre's, by address or as JSON, or the
  /// built in one, which needs no key.
  final VmapStyle style;

  /// Sources and layers of the app's own, drawn with the style.
  final VmapOverlay? overlay;

  /// Changes to single layers of the style: a colour, a filter, whether a
  /// layer is shown.
  final List<VmapStyleEdit> styleEdits;

  /// State for single features, which the style reads with
  /// `['feature-state', name]`: the way to highlight what was tapped.
  final List<VmapFeatureState> featureStates;

  /// Widgets drawn above the map at places. Map labels keep clear of them.
  final List<VmapMarker> markers;

  /// Draws places of interest as round pins instead of the style's icons.
  final VmapPins? pins;

  /// The fonts of labels, their scale, and the look of markers' names.
  final VmapTextStyle textStyle;

  /// Which labels are written and how they are placed.
  final VmapLabelOptions labels;

  /// How the map fetches and keeps what it loads. Read when the map is
  /// first built.
  final VmapNetworkOptions network;

  /// What draws the map. Read when the map is first built.
  final VmapRenderOptions rendering;

  /// Fonts labels may be shaped with, beyond the app's own. Read when the
  /// map is first built.
  final List<VmapFont> fonts;

  /// Draws with an engine the app made and owns, to keep loaded tiles
  /// across pages or share them. The parameters above that configure an
  /// engine are then ignored: set them on this one.
  final VmapEngine? engine;

  final double minZoom;
  final double maxZoom;

  /// Degrees, at most 85. Past about 60 the horizon and the sky show.
  final double maxPitch;

  /// Whether gestures, the mouse and the keyboard move the map. Off, only
  /// [controller] does, and taps are still reported.
  final bool interactive;
  final bool rotate;
  final bool tilt;

  /// Whether the map takes key presses once tapped or focused.
  final bool keyboard;

  /// Shows the credit the style's sources ask for in a corner, as their
  /// terms require. Off, the app must show it some other way: see
  /// [VmapEngine.attributions].
  final bool attribution;

  /// Shown over the map until it first draws tiles, or until it fails.
  final WidgetBuilder? loadingBuilder;

  /// Called with the place tapped. [VmapController.featuresAt] tells what
  /// the style draws there.
  final void Function(LatLng point)? onTap;
  final void Function(LatLng point)? onLongPress;

  /// Called as the camera moves, by a gesture or from code.
  final void Function(VmapCamera camera)? onCameraMove;

  /// Called once the camera comes to rest after moving.
  final void Function(VmapCamera camera)? onCameraIdle;

  /// Called each time a style has loaded and is drawn.
  final VoidCallback? onStyleLoaded;

  /// Called when the map has drawn everything in view and has nothing left
  /// to load or animate.
  final VoidCallback? onIdle;

  /// Told of everything the map could not load or draw. Only for the map's
  /// own engine; an app's [engine] reports to its own `onError`.
  final void Function(VmapError error)? onError;

  /// What screen readers announce for the map.
  final String semanticLabel;

  @override
  State<Vmap> createState() => _VmapState();
}

enum _Gesture { undecided, pan, pinch, tilt, quickZoom, turnTilt }

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

class _VmapState extends State<Vmap>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  VmapEngine? _owned;
  VmapController? _ownController;
  late final Ticker _ticker = createTicker((elapsed) => _c.tick(elapsed));
  final FocusNode _focus = FocusNode(debugLabel: 'Vmap');

  VmapEngine get _engine => widget.engine ?? (_owned ??= _makeEngine());

  VmapEngine _makeEngine() =>
      VmapEngine(
          style: widget.style,
          network: widget.network,
          rendering: widget.rendering,
          labels: widget.labels,
          text: widget.textStyle,
          fonts: widget.fonts,
          pins: widget.pins,
          overlay: widget.overlay,
          edits: widget.styleEdits,
        )
        ..onError = _error
        ..markers = widget.markers
        ..featureStates = widget.featureStates;

  void _error(VmapError error) {
    widget.onError?.call(error);
    if (_loading && _engine.error != null) _settled();
  }

  VmapController get _c =>
      widget.controller ??
      (_ownController ??= VmapController(widget.initialCamera));

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

  /// The pointer went down on a marker: it may still pan the map, but its
  /// tap is the marker's.
  bool _onMarker = false;
  Timer? _longPress;

  /// The zoom the mouse wheel is easing towards.
  double? _wheelZoom;
  Offset _trackpadLast = Offset.zero;
  double _trackpadScale = 1, _trackpadTurn = 0;

  bool _loading = true;
  bool _styleWasLoaded = false;
  bool _busy = true;
  bool _cameraPending = false;
  VmapCamera? _lastCamera;

  static const _doubleTapGap = Duration(milliseconds: 300);
  static const _tapTime = Duration(milliseconds: 250);
  static const _longPressTime = Duration(milliseconds: 500);
  static const _tapSlop = 8.0;
  static const _doubleTapReach = 48.0;

  /// A twist this large, in radians, before two fingers turn the map, so a
  /// pinch does not turn it by accident.
  static const _turnThreshold = 0.26;

  @override
  void initState() {
    super.initState();
    FrameRateVote.attach();
    _attach();
    _lastCamera = _c.camera;
    _c.addListener(_cameraChanged);
    _engine.addListener(_engineChanged);
    PaintingBinding.instance.systemFonts.addListener(_fontsChanged);
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didHaveMemoryPressure() => _engine.trimMemory();

  /// A font arriving late, as the browser's fallback fonts do, draws the
  /// labels again; those drawn before it keep their boxes otherwise.
  void _fontsChanged() => _engine.fontsChanged();

  void _attach() => _c.attach(
    ticker: _ticker,
    minZoom: widget.minZoom,
    maxZoom: widget.maxZoom,
    maxPitch: widget.maxPitch,
    engine: _engine,
  );

  @override
  void didUpdateWidget(Vmap old) {
    super.didUpdateWidget(old);
    final oldController = old.controller ?? _ownController;
    if (widget.controller != null && oldController != widget.controller) {
      oldController
        ?..removeListener(_cameraChanged)
        ..detach();
      widget.controller!.addListener(_cameraChanged);
    }
    if (old.engine != widget.engine) {
      (old.engine ?? _owned)?.removeListener(_engineChanged);
      if (widget.engine != null) {
        _owned?.dispose();
        _owned = null;
      }
      _engine.addListener(_engineChanged);
    }
    _attach();
    final owned = _owned;
    if (owned == null) return;
    owned
      ..style = widget.style
      ..overlay = widget.overlay
      ..edits = widget.styleEdits
      ..pins = widget.pins
      ..text = widget.textStyle
      ..labels = widget.labels;
    if (!identical(old.featureStates, widget.featureStates)) {
      owned.featureStates = widget.featureStates;
    }
    if (!VmapMarker.sameRooms(old.markers, widget.markers)) {
      owned.markers = widget.markers;
    }
  }

  @override
  void dispose() {
    _longPress?.cancel();
    _focus.dispose();
    WidgetsBinding.instance.removeObserver(this);
    PaintingBinding.instance.systemFonts.removeListener(_fontsChanged);
    FrameRateVote.detach();
    _c
      ..removeListener(_cameraChanged)
      ..detach();
    _engine.removeListener(_engineChanged);
    _ticker.dispose();
    _owned?.dispose();
    _ownController?.dispose();
    super.dispose();
  }

  void _cameraChanged() {
    final camera = _c.camera;
    if (camera != _lastCamera) {
      _lastCamera = camera;
      _cameraPending = true;
      widget.onCameraMove?.call(camera);
    }
    _checkIdleCamera();
  }

  void _checkIdleCamera() {
    if (!_cameraPending || _c.isMoving || _fingers.isNotEmpty) return;
    _cameraPending = false;
    widget.onCameraIdle?.call(_c.camera);
  }

  void _engineChanged() {
    final loaded = _engine.styleLoaded;
    if (loaded && !_styleWasLoaded) widget.onStyleLoaded?.call();
    _styleWasLoaded = loaded;
  }

  /// After each frame the map drew: the loading cover goes once tiles show,
  /// and [Vmap.onIdle] hears when nothing is left to do.
  void _painted() {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final stats = _engine.stats;
      if (_loading &&
          _engine.styleLoaded &&
          (stats.tilesDrawn > 0 ||
              (stats.tilesLoading == 0 && !stats.preparing))) {
        _settled();
      }
      final busy = stats.busy || stats.tilesLoading > 0;
      if (_busy && !busy && _engine.styleLoaded) widget.onIdle?.call();
      _busy = busy;
    });
  }

  void _settled() {
    if (!_loading) return;
    setState(() => _loading = false);
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

  void _onDown(PointerDownEvent e) {
    final onMarker = _onMarker;
    _onMarker = false;
    if (widget.keyboard) _focus.requestFocus();
    FrameRateVote.moving();
    _c.stop();
    _wheelZoom = null;
    _fingers[e.pointer] = e.localPosition;
    _downAt[e.pointer] = e.timeStamp;
    _most = math.max(_most, _fingers.length);
    _longPress?.cancel();
    if (_fingers.length == 1) {
      _markerTouch = onMarker;
      _moved = false;
      final last = _tapUpAt;
      _secondTap =
          widget.interactive &&
          !onMarker &&
          last != null &&
          e.timeStamp - last < _doubleTapGap &&
          (e.localPosition - _tapUpPosition).distance < _doubleTapReach;
      if (_secondTap) {
        _gesture = _Gesture.quickZoom;
        _quickAnchor = e.localPosition;
        _quickStartZoom = _c.camera.zoom;
      } else if (e.kind == PointerDeviceKind.mouse &&
          e.buttons & kSecondaryMouseButton != 0) {
        _gesture = _Gesture.turnTilt;
      }
      final onLongPress = widget.onLongPress;
      if (onLongPress != null && !onMarker) {
        final at = e.localPosition;
        _longPress = Timer(_longPressTime, () {
          if (!mounted || _moved || _fingers.length != 1) return;
          _longPressed = true;
          final point = _c.toLatLng(at);
          if (point != null) onLongPress(point);
        });
      }
    } else {
      _secondTap = false;
      if (_gesture == _Gesture.quickZoom) _gesture = _Gesture.undecided;
    }
    _longPressed = false;
    _restart(e.timeStamp, fresh: _fingers.length == 1);
  }

  bool _markerTouch = false;
  bool _longPressed = false;

  void _onMove(PointerMoveEvent e) {
    if (!_fingers.containsKey(e.pointer)) return;
    _fingers[e.pointer] = e.localPosition;
    final start = _fingersAtStart[e.pointer];
    if (start != null && (e.localPosition - start).distance > _tapSlop) {
      _moved = true;
      _longPress?.cancel();
    }
    if (!widget.interactive) return;
    if (!_moved && _gesture != _Gesture.quickZoom) return;
    final view = _c.view;
    final focal = _focal;
    switch (_gesture) {
      case _Gesture.quickZoom:
        final zoom = _quickStartZoom + (focal.dy - _quickAnchor.dy) / 160;
        _zoomTotal = zoom - _quickStartZoom;
        _c.move(
          _c.camera.around(
            view,
            _quickAnchor.dx,
            _quickAnchor.dy,
            newZoom: zoom,
          ),
        );
      case _Gesture.pan:
        _panTotal += focal - _lastFocal;
        _c.move(
          _c.camera.panned(
            view,
            _lastFocal.dx,
            _lastFocal.dy,
            focal.dx,
            focal.dy,
          ),
        );
      case _Gesture.turnTilt:
        final d = focal - _lastFocal;
        var camera = _c.camera;
        if (widget.rotate) {
          final turn = d.dx * 0.8;
          _turnTotal += turn;
          camera = camera.copyWith(
            bearing: normalBearing(camera.bearing + turn),
          );
        }
        if (widget.tilt) {
          _tiltTotal -= d.dy * 0.45;
          camera = camera.copyWith(pitch: camera.pitch - d.dy * 0.45);
        }
        _c.move(camera);
      case _Gesture.undecided:
        _decide();
        if (_gesture == _Gesture.undecided) return;
        _onMove(e);
        return;
      case _Gesture.tilt:
        final dy = focal.dy - _lastFocal.dy;
        _tiltTotal -= dy * 0.45;
        _c.move(_c.camera.copyWith(pitch: _c.camera.pitch - dy * 0.45));
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
      // From the span at touch down, so the ground under the fingers stays
      // under them through the movement it took to tell a pinch.
      _gesture = _Gesture.pinch;
      _lastSpan = _spanAtStart;
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
    _c.move(
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
    _longPress?.cancel();
    final downAt = _downAt.remove(e.pointer);
    final start = _fingersAtStart[e.pointer];
    final wasMost = _most;
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
    _fingers.remove(e.pointer);
    if (_fingers.isNotEmpty) {
      _restart(end);
      return;
    }
    _most = 0;
    final markerTouch = _markerTouch;
    _markerTouch = false;
    if (_longPressed) {
      _tapUpAt = null;
      _gesture = _Gesture.undecided;
      _checkIdleCamera();
      return;
    }
    if (widget.interactive &&
        wasMost == 2 &&
        short &&
        gesture != _Gesture.tilt) {
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
    if (wasMost == 1 && short && gesture != _Gesture.turnTilt) {
      _gesture = _Gesture.undecided;
      if (markerTouch) {
        _tapUpAt = null;
        return;
      }
      _tapUpAt = end;
      _tapUpPosition = e.localPosition;
      _tap(e.localPosition);
      _checkIdleCamera();
      return;
    }
    _tapUpAt = null;
    if (widget.interactive) {
      _coastAll(focal, end);
    } else {
      _gesture = _Gesture.undecided;
    }
    _checkIdleCamera();
  }

  /// Lets every part of the movement coast together at the speed it had:
  /// a pan that was zooming keeps zooming as it slides.
  void _coastAll(Offset focal, Duration end) {
    _c.coast(
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
      _c.view,
      at.dx,
      at.dy,
      newZoom: _c.camera.zoom + levels,
    );
    unawaited(_c.easeTo(to, duration: const Duration(milliseconds: 300)));
  }

  void _tap(Offset at) {
    final onTap = widget.onTap;
    if (onTap == null) return;
    final point = _c.toLatLng(at);
    if (point != null) onTap(point);
  }

  void _onSignal(PointerSignalEvent e) {
    if (!widget.interactive) return;
    GestureBinding.instance.pointerSignalResolver.register(e, (event) {
      switch (event) {
        case PointerScrollEvent(:final scrollDelta, :final localPosition):
          if (scrollDelta.dy == 0) return;
          _wheel(-scrollDelta.dy / 300, localPosition);
        case PointerScaleEvent(:final scale, :final localPosition):
          if (scale <= 0) return;
          _wheel(math.log(scale) / math.ln2, localPosition);
        default:
      }
    });
  }

  /// Zooms by [levels] about [at], easing so a wheel's steps glide.
  void _wheel(double levels, Offset at) {
    final camera = _c.camera;
    final target = ((_c.isMoving ? _wheelZoom : null) ?? camera.zoom) + levels;
    _wheelZoom = target.clamp(widget.minZoom, widget.maxZoom).toDouble();
    unawaited(
      _c.easeTo(
        camera.around(_c.view, at.dx, at.dy, newZoom: _wheelZoom),
        duration: const Duration(milliseconds: 160),
        curve: Curves.easeOut,
      ),
    );
  }

  void _onPanZoomStart(PointerPanZoomStartEvent e) {
    if (!widget.interactive) return;
    _c.stop();
    _trackpadLast = Offset.zero;
    _trackpadScale = 1;
    _trackpadTurn = 0;
    _fingersAtStart.clear();
    _lastFocal = e.localPosition;
    _resetChannels(e.timeStamp);
  }

  void _onPanZoomUpdate(PointerPanZoomUpdateEvent e) {
    if (!widget.interactive) return;
    final view = _c.view;
    final focal = e.localPosition;
    final pan = e.pan - _trackpadLast;
    _trackpadLast = e.pan;
    var camera = _c.camera.panned(
      view,
      focal.dx,
      focal.dy,
      focal.dx + pan.dx,
      focal.dy + pan.dy,
    );
    _panTotal += pan;
    final zoomBy = e.scale > 0 && _trackpadScale > 0
        ? math.log(e.scale / _trackpadScale) / math.ln2
        : 0.0;
    _trackpadScale = e.scale;
    final turn = widget.rotate
        ? -(e.rotation - _trackpadTurn) * 180 / math.pi
        : 0.0;
    _trackpadTurn = e.rotation;
    _zoomTotal += zoomBy;
    _turnTotal += turn;
    if (zoomBy != 0 || turn != 0) {
      camera = camera.around(
        camera.view(view.width, view.height),
        focal.dx,
        focal.dy,
        newZoom: camera.zoom + zoomBy,
        turn: turn,
      );
    }
    _c.move(camera);
    _lastFocal = focal;
    _record(e.timeStamp);
  }

  void _onPanZoomEnd(PointerPanZoomEndEvent e) {
    if (!widget.interactive) return;
    _coastAll(_lastFocal, e.timeStamp);
    _checkIdleCamera();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent e) {
    if (!widget.interactive || e is KeyUpEvent) return KeyEventResult.ignored;
    final key = e.logicalKey;
    final shift = HardwareKeyboard.instance.isShiftPressed;
    final camera = _c.camera;
    final view = _c.view;
    final middle = Offset(view.width / 2, view.height / 2);
    VmapCamera? to;
    if (key == LogicalKeyboardKey.equal ||
        key == LogicalKeyboardKey.add ||
        key == LogicalKeyboardKey.numpadAdd) {
      to = camera.copyWith(zoom: camera.zoom + 1);
    } else if (key == LogicalKeyboardKey.minus ||
        key == LogicalKeyboardKey.numpadSubtract) {
      to = camera.copyWith(zoom: camera.zoom - 1);
    } else if (shift && key == LogicalKeyboardKey.arrowLeft && widget.rotate) {
      to = camera.copyWith(bearing: normalBearing(camera.bearing - 15));
    } else if (shift && key == LogicalKeyboardKey.arrowRight && widget.rotate) {
      to = camera.copyWith(bearing: normalBearing(camera.bearing + 15));
    } else if (shift && key == LogicalKeyboardKey.arrowUp && widget.tilt) {
      to = camera.copyWith(pitch: camera.pitch + 10);
    } else if (shift && key == LogicalKeyboardKey.arrowDown && widget.tilt) {
      to = camera.copyWith(pitch: camera.pitch - 10);
    } else {
      final step = switch (key) {
        LogicalKeyboardKey.arrowLeft => const Offset(-100, 0),
        LogicalKeyboardKey.arrowRight => const Offset(100, 0),
        LogicalKeyboardKey.arrowUp => const Offset(0, -100),
        LogicalKeyboardKey.arrowDown => const Offset(0, 100),
        _ => null,
      };
      if (step == null) return KeyEventResult.ignored;
      to = camera.panned(
        view,
        middle.dx + step.dx,
        middle.dy + step.dy,
        middle.dx,
        middle.dy,
      );
    }
    unawaited(_c.easeTo(to, duration: const Duration(milliseconds: 200)));
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final dpr = MediaQuery.devicePixelRatioOf(context);
    final engine = _engine;
    final loading = widget.loadingBuilder;
    return LayoutBuilder(
      builder: (context, constraints) {
        _c.layout(constraints.biggest, flat: !engine.drawsGlobe);
        Widget map = Listener(
          behavior: HitTestBehavior.opaque,
          onPointerDown: _onDown,
          onPointerMove: _onMove,
          onPointerUp: _onUp,
          onPointerCancel: _onUp,
          onPointerSignal: _onSignal,
          onPointerPanZoomStart: _onPanZoomStart,
          onPointerPanZoomUpdate: _onPanZoomUpdate,
          onPointerPanZoomEnd: _onPanZoomEnd,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // The map paints every frame it moves; left in the semantics
              // tree it has an accessibility service walk it every frame.
              ExcludeSemantics(
                child: RepaintBoundary(
                  child: CustomPaint(
                    size: constraints.biggest,
                    painter: _VmapPainter(engine, _c, dpr, _painted),
                  ),
                ),
              ),
              if (widget.markers.isNotEmpty)
                MarkerLayer(
                  controller: _c,
                  markers: widget.markers,
                  onMarkerDown: () => _onMarker = true,
                ),
              if (widget.attribution) _Attribution(engine),
              if (loading != null)
                IgnorePointer(
                  child: AnimatedOpacity(
                    opacity: _loading ? 1 : 0,
                    duration: const Duration(milliseconds: 250),
                    child: Builder(builder: loading),
                  ),
                ),
            ],
          ),
        );
        if (widget.keyboard) {
          map = Focus(focusNode: _focus, onKeyEvent: _onKey, child: map);
        }
        return Semantics(
          container: true,
          label: widget.semanticLabel,
          child: map,
        );
      },
    );
  }
}

/// The credit the style's sources ask for, small in the bottom right.
class _Attribution extends StatelessWidget {
  const _Attribution(this.engine);

  final VmapEngine engine;

  static final _tags = RegExp('<[^>]*>');

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: engine,
    builder: (context, _) {
      final text = {
        for (final a in engine.attributions)
          a.replaceAll(_tags, '').replaceAll('&copy;', '©').trim(),
      }.where((a) => a.isNotEmpty).join(' ');
      if (text.isEmpty) return const SizedBox.shrink();
      return Align(
        alignment: Alignment.bottomRight,
        child: Container(
          margin: const EdgeInsets.all(4),
          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
          decoration: BoxDecoration(
            color: const Color(0xB3FFFFFF),
            borderRadius: BorderRadius.circular(3),
          ),
          child: Text(
            text,
            style: const TextStyle(fontSize: 10, color: Color(0xFF333333)),
          ),
        ),
      );
    },
  );
}

class _VmapPainter extends CustomPainter {
  _VmapPainter(this.engine, this.controller, this.dpr, this.painted)
    : super(repaint: Listenable.merge([engine, controller]));

  final VmapEngine engine;
  final VmapController controller;
  final double dpr;
  final VoidCallback painted;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.clipRect(Offset.zero & size);
    engine.paint(
      canvas,
      size,
      controller.camera,
      devicePixelRatio: dpr,
      ahead: controller.destination,
    );
    painted();
  }

  @override
  bool shouldRepaint(_VmapPainter old) =>
      old.engine != engine || old.controller != controller || old.dpr != dpr;
}
