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

/// How far along [screen], the points of [world] where they fall on the
/// screen, the point [at] along [world] lands. Past either end the last
/// segment's scale carries on.
double screenDistance(Float64List world, Float64List screen, double at) {
  final segments = world.length ~/ 2 - 1;
  var walked = 0.0, onScreen = 0.0;
  for (var k = 0; k < segments; k++) {
    final wx = world[k * 2 + 2] - world[k * 2];
    final wy = world[k * 2 + 3] - world[k * 2 + 1];
    final sx = screen[k * 2 + 2] - screen[k * 2];
    final sy = screen[k * 2 + 3] - screen[k * 2 + 1];
    final seg = math.sqrt(wx * wx + wy * wy);
    final shown = math.sqrt(sx * sx + sy * sy);
    if (k == segments - 1 || at <= walked + seg) {
      return onScreen + (seg == 0 ? 0 : (at - walked) / seg * shown);
    }
    walked += seg;
    onScreen += shown;
  }
  return onScreen;
}

/// A line a name is laid along, as `pointAlong` walks it from the name's
/// middle. With a `text-offset`, the glyphs after the middle may start
/// [gap] further on, where the middle sits on a corner.
class OffsetLine {
  OffsetLine(this.path, this.middle, [this.gap = 0]);

  final Float64List path;
  final double middle;
  final double gap;

  /// The point [along] the line from its middle, and its direction there.
  void at(double along, Float64List out) =>
      pointAlong(path, middle + (along > 0 ? along + gap : along), out);
}

/// [path] moved [offset] to the right of its direction, as MapLibre lays a
/// name along a line by its `text-offset`: each segment moved along its
/// normal and joined to the next where the two meet, and walked from the
/// point beside [middle] to each corner by straight distance, so glyphs
/// keep their spacing on either side of a bend. Where [middle] falls on a
/// corner, the glyphs before it start beside it on the segment before and
/// those after on the segment after, without meeting.
OffsetLine offsetPath(Float64List path, double middle, double offset) {
  final points = path.length ~/ 2;
  if (offset == 0 || points < 2) return OffsetLine(path, middle);
  final normals = Float64List((points - 1) * 2);
  final lengths = Float64List(points - 1);
  for (var k = 0; k < points - 1; k++) {
    final dx = path[k * 2 + 2] - path[k * 2];
    final dy = path[k * 2 + 3] - path[k * 2 + 1];
    final l = math.sqrt(dx * dx + dy * dy);
    lengths[k] = l;
    if (l > 0) {
      normals[k * 2] = -dy / l * offset;
      normals[k * 2 + 1] = dx / l * offset;
    } else if (k > 0) {
      normals[k * 2] = normals[k * 2 - 2];
      normals[k * 2 + 1] = normals[k * 2 - 1];
    }
  }
  final out = Float64List(path.length);
  out[0] = path[0] + normals[0];
  out[1] = path[1] + normals[1];
  for (var k = 1; k < points - 1; k++) {
    final px = path[k * 2], py = path[k * 2 + 1];
    final ax = px + normals[k * 2 - 2], ay = py + normals[k * 2 - 1];
    final bx = px + normals[k * 2], by = py + normals[k * 2 + 1];
    final ux = px - path[k * 2 - 2], uy = py - path[k * 2 - 1];
    final vx = path[k * 2 + 2] - px, vy = path[k * 2 + 3] - py;
    final cross = ux * vy - uy * vx;
    if (cross.abs() < 1e-9 * (lengths[k - 1] * lengths[k] + 1e-12)) {
      out[k * 2] = bx;
      out[k * 2 + 1] = by;
    } else {
      final t = ((bx - ax) * vy - (by - ay) * vx) / cross;
      out[k * 2] = ax + ux * t;
      out[k * 2 + 1] = ay + uy * t;
    }
  }
  final last = points - 1;
  out[last * 2] = path[last * 2] + normals[last * 2 - 2];
  out[last * 2 + 1] = path[last * 2 + 1] + normals[last * 2 - 1];

  var walked = 0.0;
  var k = 0;
  while (k < points - 2 && middle > walked + lengths[k]) {
    walked += lengths[k];
    k++;
  }
  final t = lengths[k] == 0 ? 0.0 : (middle - walked) / lengths[k];
  final onCorner = k < points - 2 && t >= 1 - 1e-9;
  final double bx, by, fx, fy;
  if (onCorner) {
    final v = k + 1;
    bx = path[v * 2] + normals[k * 2];
    by = path[v * 2 + 1] + normals[k * 2 + 1];
    fx = path[v * 2] + normals[v * 2];
    fy = path[v * 2 + 1] + normals[v * 2 + 1];
  } else {
    bx = fx =
        path[k * 2] + (path[k * 2 + 2] - path[k * 2]) * t + normals[k * 2];
    by = fy =
        path[k * 2 + 1] +
        (path[k * 2 + 3] - path[k * 2 + 1]) * t +
        normals[k * 2 + 1];
  }
  // The corner, or the next one, gives way to the points beside the middle.
  final keepFrom = onCorner ? k + 2 : k + 1;
  final joined = Float64List((k + 1) * 2 + 4 + (points - keepFrom) * 2)
    ..setRange(0, (k + 1) * 2, out)
    ..[(k + 1) * 2] = bx
    ..[(k + 1) * 2 + 1] = by
    ..[(k + 1) * 2 + 2] = fx
    ..[(k + 1) * 2 + 3] = fy;
  joined.setRange((k + 3) * 2, joined.length, out, keepFrom * 2);
  var moved = 0.0;
  for (var m = 0; m <= k; m++) {
    final dx = joined[m * 2 + 2] - joined[m * 2];
    final dy = joined[m * 2 + 3] - joined[m * 2 + 1];
    moved += math.sqrt(dx * dx + dy * dy);
  }
  final gap = math.sqrt((fx - bx) * (fx - bx) + (fy - by) * (fy - by));
  return OffsetLine(joined, moved, gap);
}
