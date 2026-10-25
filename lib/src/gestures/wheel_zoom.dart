import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/animation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import 'gesture_target.dart';

/// One wheel event as MapLibre GL JS reads it: [deltaY] in pixels, or in
/// lines when [lines], with shift held or not, at [at] in the map's
/// logical pixels. A trackpad pinch is one with the control key held,
/// which browsers send for it; MapLibre reads it the same way.
typedef WheelInput = ({double deltaY, bool lines, bool shift, Offset at});

enum _Device { wheel, trackpad }

/// MapLibre GL JS's scroll zoom (`src/ui/handler/scroll_zoom.ts`): tells a
/// mouse wheel from a trackpad by its deltas and their timing, zooms by a
/// sigmoid of the delta gathered since the last frame, eases a wheel's
/// steps over 200 ms and follows a trackpad frame by frame, about the
/// pointer, and reports the zoom over 200 ms after the last step.
class WheelZoom {
  WheelZoom(this._target, {required this.onEnd});

  final MapGestureTarget Function() _target;

  /// Told when a zoom has come to rest.
  final VoidCallback onEnd;

  /// The trackpad's zoom rate, MapLibre's `setZoomRate`.
  double zoomRate = 1 / 100;

  /// The mouse wheel's zoom rate, MapLibre's `setWheelZoomRate`.
  double wheelZoomRate = 1 / 450;

  /// A delta of this marks a mouse wheel.
  static const _wheelZoomDelta = 4.000244140625;

  /// The most the map scales in one frame, however fast the wheel turns.
  static const _maxScalePerFrame = 2.0;

  /// The least time between wheel events counted in the easing, as
  /// Chromium sends events well under a millisecond apart.
  static const _wheelEventTimeDiffAdjustment = 5.0;

  static const _defaultEasing = Cubic(0.25, 0.1, 0.25, 1);

  /// Milliseconds on the clock frames are drawn by.
  static double get _now =>
      SchedulerBinding.instance.currentSystemFrameTimeStamp.inMicroseconds /
      1000;

  _Device? _type;
  double _lastValue = 0;
  Timer? _timeout, _finishTimeout;
  double _lastWheelEventTime = double.negativeInfinity;
  double? _lastExpectedZoom, _startZoom, _targetZoom;
  double _delta = 0;
  Curve? _easing;
  ({double start, double duration, Curve easing})? _prevEase;
  bool _active = false, _zooming = false, _needsRerender = false;
  Offset _around = Offset.zero;

  /// Whether a zoom is under way or has not yet come to rest.
  bool get zooming => _zooming;

  void wheel(WheelInput e) {
    var value = e.lines ? e.deltaY * 40 : e.deltaY;
    final now = _now;
    final timeDelta = now - _lastWheelEventTime;
    _lastWheelEventTime = now;
    if (value != 0 && value % _wheelZoomDelta == 0) {
      _type = _Device.wheel;
    } else if (value != 0 && value.abs() < 4) {
      _type = _Device.trackpad;
    } else if (timeDelta > 400) {
      // Likely a new scroll: wait 40 ms in case it is a single wheel step.
      _type = null;
      _lastValue = value;
      _timeout?.cancel();
      _timeout = Timer(const Duration(milliseconds: 40), () => _onTimeout(e));
    } else if (_type == null) {
      // A repeat before the device is known: a small delta for the time is
      // a fast trackpad, else a wheel.
      _type = (timeDelta * value).abs() < 200
          ? _Device.trackpad
          : _Device.wheel;
      if (_timeout != null) {
        _timeout!.cancel();
        _timeout = null;
        value += _lastValue;
      }
    }
    if (e.shift && value != 0) value /= 4;
    if (_type != null) {
      _delta -= value;
      if (!_active) _start(e.at);
    }
  }

  void _onTimeout(WheelInput e) {
    _timeout = null;
    _type = _Device.wheel;
    _delta -= _lastValue;
    if (!_active) _start(e.at);
  }

  void _start(Offset at) {
    if (_delta == 0) return;
    _needsRerender = false;
    _active = true;
    _zooming = true;
    _finishTimeout?.cancel();
    _finishTimeout = null;
    _around = at;
    _needsRerender = true;
    _requestFrame();
  }

  void _requestFrame() =>
      SchedulerBinding.instance.scheduleFrameCallback((_) => _renderFrame());

  void _renderFrame() {
    if (!_needsRerender) return;
    _needsRerender = false;
    if (!_active) return;
    final target = _target();
    final zoomNow = target.zoom;
    if (_lastExpectedZoom case final expected?) {
      final external = zoomNow - expected;
      if (_startZoom != null) _startZoom = _startZoom! + external;
      if (_targetZoom != null) _targetZoom = _targetZoom! + external;
    }
    if (_delta != 0) {
      final rate = _type == _Device.wheel && _delta.abs() > _wheelZoomDelta
          ? wheelZoomRate
          : zoomRate;
      // A sigmoid of the delta, so small scrolls tell and large ones are
      // held back.
      var scale = _maxScalePerFrame / (1 + math.exp(-(_delta * rate).abs()));
      if (_delta < 0 && scale != 0) scale = 1 / scale;
      final from = _targetZoom ?? zoomNow;
      _targetZoom = (from + math.log(scale) / math.ln2)
          .clamp(target.minZoom, target.maxZoom)
          .toDouble();
      if (_type == _Device.wheel) {
        _startZoom = zoomNow;
        _easing = _smoothOutEasing(200);
      }
      _delta = 0;
    }
    final targetZoom = _targetZoom ?? zoomNow;
    final startZoom = _startZoom, easing = _easing;
    var finished = false;
    double zoom;
    if (_type == _Device.wheel && startZoom != null && easing != null) {
      final sinceWheel = _now - _lastWheelEventTime;
      final t = math.min(
        (sinceWheel + _wheelEventTimeDiffAdjustment) / 200,
        1.0,
      );
      zoom = startZoom + (targetZoom - startZoom) * easing.transform(t);
      if (t < 1) {
        _needsRerender = true;
      } else {
        finished = true;
      }
    } else {
      zoom = targetZoom;
      finished = true;
    }
    _active = true;
    if (finished) {
      _active = false;
      _finishTimeout = Timer(const Duration(milliseconds: 200), () {
        _zooming = false;
        _targetZoom = null;
        _lastExpectedZoom = null;
        _finishTimeout = null;
        onEnd();
      });
    }
    _lastExpectedZoom = zoom;
    target.jump(MapGestureStep(around: _around, zoomBy: zoom - zoomNow));
    if (!finished) _requestFrame();
  }

  /// An easing that carries on at the speed of the one under way, so a
  /// wheel turned again keeps gliding rather than starting from rest.
  Curve _smoothOutEasing(double duration) {
    Curve easing = _defaultEasing;
    if (_prevEase case final current?) {
      final t = ((_now - current.start) / current.duration).clamp(0.0, 1.0);
      final speed =
          current.easing.transform(math.min(t + 0.01, 1)) -
          current.easing.transform(t);
      final x = 0.27 / math.sqrt(speed * speed + 0.0001) * 0.01;
      final y = math.sqrt(math.max(0, 0.27 * 0.27 - x * x));
      easing = Cubic(x, y, 0.25, 1);
    }
    _prevEase = (start: _now, duration: duration, easing: easing);
    return easing;
  }

  /// Stops a zoom under way.
  void reset() {
    _active = false;
    _zooming = false;
    _needsRerender = false;
    _targetZoom = null;
    _lastExpectedZoom = null;
    _timeout?.cancel();
    _timeout = null;
    _finishTimeout?.cancel();
    _finishTimeout = null;
  }

  void dispose() => reset();
}
