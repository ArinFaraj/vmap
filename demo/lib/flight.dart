import 'dart:math' as math;

import 'package:vmap/vmap.dart';

/// Smootherstep: speed and acceleration are zero at both ends, so a move
/// starts and stops without a jolt.
double smoother(double t) {
  final x = t.clamp(0.0, 1.0);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

double _worldX(double lng) => (lng + 180) / 360;

double _worldY(double lat) {
  final s = math.sin(lat * math.pi / 180);
  return 0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi);
}

double _lng(double x) => x * 360 - 180;

double _lat(double y) =>
    (2 * math.atan(math.exp((0.5 - y) * 2 * math.pi)) - math.pi / 2) *
    180 /
    math.pi;

double _cosh(double x) => (math.exp(x) + math.exp(-x)) / 2;
double _sinh(double x) => (math.exp(x) - math.exp(-x)) / 2;
double _tanh(double x) => _sinh(x) / _cosh(x);

/// The shortest signed turn from [from] to [to], in degrees.
double turnBetween(double from, double to) {
  var d = (to - from) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

/// A camera flight between two places along van Wijk and Nuijten's path,
/// as MapLibre's `flyTo` takes: it rises over long distances so the ground
/// passes at a steady pace. The pitch dips toward looking straight down at
/// the top of a long flight and comes back up for the landing.
class Flight {
  Flight(this.from, this.to, {required double viewWidth}) {
    final x0 = _worldX(from.center.longitude),
        y0 = _worldY(from.center.latitude);
    var dx = _worldX(to.center.longitude) - x0;
    dx -= dx.roundToDouble();
    final dy = _worldY(to.center.latitude) - y0;
    _x0 = x0;
    _y0 = y0;
    _dx = dx;
    _dy = dy;
    final scale = 512 * math.pow(2, from.zoom).toDouble();
    final w0 = math.max(viewWidth, 1.0);
    final w1 = w0 * math.pow(2, from.zoom - to.zoom).toDouble();
    final u1 = math.sqrt(dx * dx + dy * dy) * scale;
    const rho2 = _rho * _rho;
    _w0 = w0;
    _u1 = u1;
    if (u1 < 1e-6) {
      _still = true;
      _k = w1 < w0 ? -1 : 1;
      _length = (math.log(w1 / w0)).abs() / _rho;
    } else {
      double r(bool end) {
        final w = end ? w1 : w0;
        final b =
            (w1 * w1 - w0 * w0 + (end ? -1 : 1) * rho2 * rho2 * u1 * u1) /
            (2 * w * rho2 * u1);
        return math.log(math.sqrt(b * b + 1) - b);
      }

      _r0 = r(false);
      _length = (r(true) - _r0) / _rho;
    }
    final rise = _highest() - math.min(from.zoom, to.zoom);
    _dip = (rise.abs() / 3).clamp(0.0, 1.0);
    final seconds = (_length / 1.2 * 1.7).clamp(2.6, 9.0);
    duration = Duration(milliseconds: (seconds * 1000).round());
  }

  static const _rho = 1.42;

  final VmapCamera from, to;
  late final Duration duration;
  late final double _x0, _y0, _dx, _dy, _w0, _u1, _length, _dip;
  double _r0 = 0;
  bool _still = false;
  double _k = 1;

  (double, double) _at(double s) {
    if (_still) return (math.exp(_k * _rho * s), 0);
    final w = _cosh(_r0) / _cosh(_r0 + _rho * s);
    final u =
        _w0 *
        ((_cosh(_r0) * _tanh(_r0 + _rho * s) - _sinh(_r0)) / (_rho * _rho)) /
        _u1;
    return (w, u);
  }

  /// The lowest zoom the path passes through.
  double _highest() {
    var lowest = math.min(from.zoom, to.zoom);
    for (var i = 1; i < 32; i++) {
      final (w, _) = _at(_length * i / 32);
      lowest = math.min(lowest, from.zoom + math.log(1 / w) / math.ln2);
    }
    return lowest;
  }

  /// The camera [t] of the way through the flight, from 0 to 1.
  VmapCamera at(double t) {
    final e = smoother(t);
    final (w, u) = _at(e * _length);
    final zoom = from.zoom + math.log(1 / w) / math.ln2;
    var x = _x0 + _dx * u;
    x -= x.floorToDouble();
    final level = from.pitch + (to.pitch - from.pitch) * e;
    final pitch = level * (1 - _dip * math.pow(math.sin(math.pi * e), 0.8));
    return VmapCamera(
      center: LatLng(_lat(_y0 + _dy * u), _lng(x)),
      zoom: zoom,
      bearing: from.bearing + turnBetween(from.bearing, to.bearing) * e,
      pitch: pitch,
    );
  }
}
