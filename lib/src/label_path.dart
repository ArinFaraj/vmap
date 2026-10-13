import 'dart:math' as math;
import 'dart:typed_data';

/// The point [at] along [path] and the line's direction there, written to
/// [out] as x, y, angle. Past either end the line carries on straight.
void pointAlong(Float64List path, double at, Float64List out) {
  final segments = path.length ~/ 2 - 1;
  var walked = 0.0;
  for (var k = 0; k < segments; k++) {
    final dx = path[k * 2 + 2] - path[k * 2];
    final dy = path[k * 2 + 3] - path[k * 2 + 1];
    final seg = math.sqrt(dx * dx + dy * dy);
    if (k == segments - 1 || at <= walked + seg) {
      final t = seg == 0 ? 0.0 : (at - walked) / seg;
      out[0] = path[k * 2] + dx * t;
      out[1] = path[k * 2 + 1] + dy * t;
      out[2] = math.atan2(dy, dx);
      return;
    }
    walked += seg;
  }
}

/// Lays a text cut into [count] slices, each [step] long, along [path], a
/// line of x,y pairs, with the middle of the text [mid] along it. Writes
/// where the middle of each slice sits and the line's direction there into
/// [out] as x, y, angle triples.
///
/// A text longer than the line carries on straight past its ends.
void layStrips(
  Float64List path,
  double mid,
  int count,
  double step,
  Float64List out,
) {
  final segments = path.length ~/ 2 - 1;
  var k = 0;
  var walked = 0.0;
  var seg = 0.0;
  void measure() {
    final dx = path[k * 2 + 2] - path[k * 2];
    final dy = path[k * 2 + 3] - path[k * 2 + 1];
    seg = math.sqrt(dx * dx + dy * dy);
  }

  measure();
  var px = 0.0, py = 0.0;
  for (var i = 0; i <= count; i++) {
    final at = mid + (i - count / 2) * step;
    while (k < segments - 1 && at > walked + seg) {
      walked += seg;
      k++;
      measure();
    }
    final t = seg == 0 ? 0.0 : (at - walked) / seg;
    final x = path[k * 2] + (path[k * 2 + 2] - path[k * 2]) * t;
    final y = path[k * 2 + 1] + (path[k * 2 + 3] - path[k * 2 + 1]) * t;
    if (i > 0) {
      out[i * 3 - 3] = (px + x) / 2;
      out[i * 3 - 2] = (py + y) / 2;
      out[i * 3 - 1] = math.atan2(y - py, x - px);
    }
    px = x;
    py = y;
  }
}
