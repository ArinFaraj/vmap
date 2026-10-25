import 'dart:math' as math;
import 'dart:typed_data';

/// The screen boxes placed labels and markers take, which the labels placed
/// after them keep clear of.
class CollisionBoxes {
  /// The style spec's `text-padding` and `icon-padding` default.
  static const double defaultPad = 2;

  Float32List _boxes = Float32List(1024);
  int _count = 0;

  /// The boxes in each [_cell] pixel square of the screen, so a test looks
  /// only at the boxes near it, as MapLibre's grid index does: a dense
  /// tilted view weighs hundreds of labels against hundreds of boxes. The
  /// grid spans [_side] squares each way from [_origin]; a box past it is
  /// kept in the squares at its edge.
  final List<List<int>> _grid = List.generate(_side * _side, (_) => []);
  final List<int> _used = [];
  static const double _cell = 64;
  static const int _side = 64;
  static const double _origin = -1024;

  /// For each box, the last query that tested it, so one in several cells
  /// is tested once.
  Int32List _seen = Int32List(256);
  int _query = 0;

  /// For each box, 1 when it was taken by a symbol that overlaps nothing,
  /// which even a cooperative one keeps clear of.
  Uint8List _never = Uint8List(256);

  /// The collision group boxes are taken and tested in, as MapLibre's
  /// `CollisionGroups`: a box of one group is invisible to another, and
  /// group 0's boxes are in every group.
  int group = 0;
  Int32List _groups = Int32List(256);

  /// For each entry, 1 when it is a circle, as MapLibre's grid keeps the
  /// collision circles of names along lines: kept as its bounding box,
  /// weighed as the circle inside it.
  Uint8List _circles = Uint8List(256);

  /// The step an unturned box's half width and height, padding included,
  /// is cut down to, as MapLibre keeps a symbol's box in whole tile units
  /// in 16 bits: an edge between two steps comes in to the inner one. Zero
  /// for none.
  double quantum = 0;

  double _cut(double half) =>
      quantum <= 0 ? half : (half / quantum).truncateToDouble() * quantum;

  /// MapLibre's collision grid: the screen and 100 pixels around it, as
  /// left, top, right and bottom. A box wholly outside it is not placed,
  /// whatever may overlap. Null for no such edge.
  (double, double, double, double)? grid;

  /// Whether the box from [l], [t] to [r], [b] lies wholly outside [grid].
  bool offGrid(double l, double t, double r, double b) {
    final g = grid;
    if (g == null) return false;
    return r < g.$1 || l >= g.$3 || b < g.$2 || t >= g.$4;
  }

  /// [offGrid] for a [w] by [h] box around [sx], [sy] with [pad] around it.
  bool offGridAround(
    double sx,
    double sy,
    double w,
    double h, {
    double pad = 0,
  }) => offGrid(
    sx - w / 2 - pad,
    sy - h / 2 - pad,
    sx + w / 2 + pad,
    sy + h / 2 + pad,
  );

  /// Every box taken, as left, top, right and bottom in turn, for tools
  /// that compare placement.
  List<double> get taken => [for (var i = 0; i < _count; i++) _boxes[i]];

  void clear() {
    _count = 0;
    for (final i in _used) {
      _grid[i].clear();
    }
    _used.clear();
  }

  static int _at(double v) =>
      ((v - _origin) / _cell).floor().clamp(0, _side - 1);

  /// Takes the box from [l], [t] to [r], [b] as it is, and returns its
  /// number.
  int add(
    double l,
    double t,
    double r,
    double b, {
    bool never = true,
    bool circle = false,
  }) {
    if (_count + 4 > _boxes.length) {
      _boxes = Float32List(_boxes.length * 2)..setRange(0, _count, _boxes);
    }
    final number = _count ~/ 4;
    _boxes[_count++] = l;
    _boxes[_count++] = t;
    _boxes[_count++] = r;
    _boxes[_count++] = b;
    if (number >= _seen.length) {
      _seen = Int32List(_seen.length * 2)..setRange(0, _seen.length, _seen);
      _never = Uint8List(_never.length * 2)..setRange(0, _never.length, _never);
      _groups = Int32List(_groups.length * 2)
        ..setRange(0, _groups.length, _groups);
      _circles = Uint8List(_circles.length * 2)
        ..setRange(0, _circles.length, _circles);
    }
    _circles[number] = circle ? 1 : 0;
    _seen[number] = 0;
    _groups[number] = group;
    _never[number] = never ? 1 : 0;
    final x1 = _at(r), y1 = _at(b);
    for (var cy = _at(t); cy <= y1; cy++) {
      for (var cx = _at(l); cx <= x1; cx++) {
        final cell = _grid[cy * _side + cx];
        if (cell.isEmpty) _used.add(cy * _side + cx);
        cell.add(number);
      }
    }
    return number;
  }

  /// Whether the box from [l], [t] to [r], [b] overlaps one taken, other
  /// than box number [except]. A [cooperative] box, as MapLibre's
  /// `*-overlap: cooperative`, only minds boxes that overlap nothing.
  bool hits(
    double l,
    double t,
    double r,
    double b, {
    int? except,
    bool cooperative = false,
  }) {
    if (_count == 0) return false;
    final boxes = _boxes;
    final query = ++_query;
    final x1 = _at(r), y1 = _at(b);
    for (var cy = _at(t); cy <= y1; cy++) {
      for (var cx = _at(l); cx <= x1; cx++) {
        final cell = _grid[cy * _side + cx];
        for (final number in cell) {
          if (number == except || _seen[number] == query) continue;
          _seen[number] = query;
          final owner = _groups[number];
          if (owner != 0 && owner != group) continue;
          if (cooperative && _never[number] == 0) continue;
          final i = number * 4;
          if (l < boxes[i + 2] &&
              r > boxes[i] &&
              t < boxes[i + 3] &&
              b > boxes[i + 1]) {
            if (_circles[number] == 0) return true;
            final cr = (boxes[i + 2] - boxes[i]) / 2;
            if (_circleAndRect(
              boxes[i] + cr,
              boxes[i + 1] + cr,
              cr,
              l,
              t,
              r,
              b,
            )) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /// Takes the circle of radius [radius] around [x], [y].
  int addCircle(double x, double y, double radius, {bool never = true}) => add(
    x - radius,
    y - radius,
    x + radius,
    y + radius,
    never: never,
    circle: true,
  );

  /// Whether the circle of radius [radius] around [x], [y] overlaps a box
  /// or circle taken, as MapLibre's `hitTestCircle`.
  bool hitsCircle(
    double x,
    double y,
    double radius, {
    bool cooperative = false,
  }) {
    if (_count == 0) return false;
    final boxes = _boxes;
    final query = ++_query;
    final x1 = _at(x + radius), y1 = _at(y + radius);
    for (var cy = _at(y - radius); cy <= y1; cy++) {
      for (var cx = _at(x - radius); cx <= x1; cx++) {
        for (final number in _grid[cy * _side + cx]) {
          if (_seen[number] == query) continue;
          _seen[number] = query;
          final owner = _groups[number];
          if (owner != 0 && owner != group) continue;
          if (cooperative && _never[number] == 0) continue;
          final i = number * 4;
          if (_circles[number] == 1) {
            final r = (boxes[i + 2] - boxes[i]) / 2;
            final dx = boxes[i] + r - x, dy = boxes[i + 1] + r - y;
            final reach = r + radius;
            if (dx * dx + dy * dy < reach * reach) return true;
          } else if (_circleAndRect(
            x,
            y,
            radius,
            boxes[i],
            boxes[i + 1],
            boxes[i + 2],
            boxes[i + 3],
          )) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /// MapLibre's `circleAndRectCollide`.
  static bool _circleAndRect(
    double x,
    double y,
    double radius,
    double l,
    double t,
    double r,
    double b,
  ) {
    final halfW = (r - l) / 2, halfH = (b - t) / 2;
    final dx = (x - (l + halfW)).abs(), dy = (y - (t + halfH)).abs();
    if (dx > halfW + radius || dy > halfH + radius) return false;
    if (dx <= halfW || dy <= halfH) return true;
    final cx = dx - halfW, cy = dy - halfH;
    return cx * cx + cy * cy <= radius * radius;
  }

  /// Whether a [w] by [h] box around [sx], [sy], turned by [angle] and
  /// with [pad] of clear space around it, runs into one already taken other
  /// than box number [except]. A turned box is weighed as a row of squares.
  bool collides(
    double sx,
    double sy,
    double w,
    double h,
    double angle, {
    required double pad,
    int? except,
    bool cooperative = false,
  }) {
    if (angle == 0) {
      final hw = _cut(w / 2 + pad), hh = _cut(h / 2 + pad);
      return hits(
        sx - hw,
        sy - hh,
        sx + hw,
        sy + hh,
        except: except,
        cooperative: cooperative,
      );
    }
    final count = math.max(1, (w / h).ceil());
    final cosA = math.cos(angle);
    final sinA = math.sin(angle);
    final r = h / 2 + pad;
    for (var i = 0; i < count; i++) {
      final d = count == 1 ? 0.0 : -w / 2 + h / 2 + (w - h) * i / (count - 1);
      final x = sx + cosA * d;
      final y = sy + sinA * d;
      if (hits(
        x - r,
        y - r,
        x + r,
        y + r,
        except: except,
        cooperative: cooperative,
      )) {
        return true;
      }
    }
    return false;
  }

  /// Takes the room [collides] weighs.
  void take(
    double sx,
    double sy,
    double w,
    double h,
    double angle, {
    required double pad,
    bool never = true,
  }) {
    if (angle == 0) {
      final hw = _cut(w / 2 + pad), hh = _cut(h / 2 + pad);
      add(sx - hw, sy - hh, sx + hw, sy + hh, never: never);
      return;
    }
    final count = math.max(1, (w / h).ceil());
    final cosA = math.cos(angle);
    final sinA = math.sin(angle);
    final r = h / 2 + pad;
    for (var i = 0; i < count; i++) {
      final d = count == 1 ? 0.0 : -w / 2 + h / 2 + (w - h) * i / (count - 1);
      final x = sx + cosA * d;
      final y = sy + sinA * d;
      add(x - r, y - r, x + r, y + r, never: never);
    }
  }

  /// [path], x and y in turn, cut to the collision grid: the pieces of it
  /// inside, as MapLibre's `clipLine`.
  List<Float64List> clipToGrid(List<double> path) {
    final g = grid;
    if (g == null) return [Float64List.fromList(path)];
    final (x1, y1, x2, y2) = g;
    final pieces = <Float64List>[];
    var piece = <double>[];
    void flush() {
      if (piece.length >= 4) pieces.add(Float64List.fromList(piece));
      piece = <double>[];
    }

    for (var q = 2; q < path.length; q += 2) {
      var ax = path[q - 2], ay = path[q - 1], bx = path[q], by = path[q + 1];
      // Liang-Barsky against the grid's four edges.
      var t0 = 0.0, t1 = 1.0;
      final dx = bx - ax, dy = by - ay;
      var inside = true;
      for (final (pv, qv) in [
        (-dx, ax - x1),
        (dx, x2 - ax),
        (-dy, ay - y1),
        (dy, y2 - ay),
      ]) {
        if (pv == 0) {
          if (qv < 0) inside = false;
          continue;
        }
        final r = qv / pv;
        if (pv < 0) {
          if (r > t1) inside = false;
          if (r > t0) t0 = r;
        } else {
          if (r < t0) inside = false;
          if (r < t1) t1 = r;
        }
      }
      if (!inside || t0 > t1) {
        flush();
        continue;
      }
      final sx = ax + dx * t0, sy = ay + dy * t0;
      final ex = ax + dx * t1, ey = ay + dy * t1;
      if (piece.isEmpty || t0 > 0) {
        flush();
        piece.addAll([sx, sy]);
      }
      piece.addAll([ex, ey]);
      if (t1 < 1) flush();
    }
    flush();
    return pieces;
  }
}
