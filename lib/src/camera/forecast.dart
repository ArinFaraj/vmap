import 'dart:math' as math;

import 'map_camera.dart';

/// Where the camera will be a moment from now, from how it has been
/// moving. A tile asked for now arrives after that moment, so the tiles to
/// ask for are the ones the view will need then, not the ones it is
/// already leaving.
class CameraForecast {
  VmapCamera? _last;
  int _lastMicros = 0;
  bool _moving = false;
  double _x = 0, _y = 0, _zoom = 0, _bearing = 0, _pitch = 0;

  /// Frames further apart than this are no movement to go on.
  static const _restMicros = 250000;

  /// The furthest a camera with no known target is taken to go: it may
  /// stop or turn at any moment.
  static const _mostLevels = 1.5, _mostPixels = 1000.0, _mostDegrees = 30.0;

  /// Notes where the camera is at [micros] of a running clock.
  void see(VmapCamera now, int micros) {
    final last = _last;
    final dt = (micros - _lastMicros) / 1e6;
    _last = now;
    _lastMicros = micros;
    if (last == null || dt <= 0 || dt * 1e6 > _restMicros) {
      _moving = false;
      return;
    }
    final mix = _moving ? 0.5 : 1.0;
    double eased(double before, double step) =>
        before + (step / dt - before) * mix;
    _x = eased(_x, eastward(last.worldX, now.worldX));
    _y = eased(_y, now.worldY - last.worldY);
    _zoom = eased(_zoom, now.zoom - last.zoom);
    _bearing = eased(_bearing, _turn(last.bearing, now.bearing));
    _pitch = eased(_pitch, now.pitch - last.pitch);
    _moving = true;
  }

  /// The camera [lead] seconds after it was last seen, or null while it is
  /// at rest. A camera heading for [target] does not pass it.
  VmapCamera? after(double lead, {VmapCamera? target}) {
    final now = _last;
    if (now == null || !_moving) return null;
    final pixels = 512 * math.pow(2, now.zoom);
    if (_zoom.abs() < 0.05 &&
        math.max(_x.abs(), _y.abs()) * pixels < 20 &&
        _bearing.abs() < 2 &&
        _pitch.abs() < 2) {
      return null;
    }

    /// [from] moved by [step], kept short of [to] when it heads there and
    /// within [most] of [from] when there is nowhere it is known to head.
    double moved(double from, double step, double? to, double most) {
      if (to == null) return from + step.clamp(-most, most);
      final left = to - from;
      if (left * step <= 0) return from + step;
      return step.abs() > left.abs() ? to : from + step;
    }

    final reach = _mostPixels / pixels;
    final x = moved(
      0,
      _x * lead,
      target == null ? null : eastward(now.worldX, target.worldX),
      reach,
    );
    return cameraAt(
      x: now.worldX + x,
      y: moved(now.worldY, _y * lead, target?.worldY, reach),
      zoom: moved(now.zoom, _zoom * lead, target?.zoom, _mostLevels),
      bearing:
          now.bearing +
          moved(
            0,
            _bearing * lead,
            target == null ? null : _turn(now.bearing, target.bearing),
            _mostDegrees,
          ),
      pitch: moved(
        now.pitch,
        _pitch * lead,
        target?.pitch,
        _mostDegrees,
      ).clamp(0.0, 85.0),
      roll: now.roll,
      padding: now.padding,
      fieldOfView: now.fieldOfView,
    );
  }

  /// The shortest turn from [from] to [to], in degrees.
  static double _turn(double from, double to) {
    final d = (to - from) % 360;
    return d > 180 ? d - 360 : d;
  }
}
