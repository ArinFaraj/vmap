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
  int add(double l, double t, double r, double b, {bool never = true}) {
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
    }
    _seen[number] = 0;
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
          if (cooperative && _never[number] == 0) continue;
          final i = number * 4;
          if (l < boxes[i + 2] &&
              r > boxes[i] &&
              t < boxes[i + 3] &&
              b > boxes[i + 1]) {
            return true;
          }
        }
      }
    }
    return false;
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
      return hits(
        sx - w / 2 - pad,
        sy - h / 2 - pad,
        sx + w / 2 + pad,
        sy + h / 2 + pad,
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
      add(
        sx - w / 2 - pad,
        sy - h / 2 - pad,
        sx + w / 2 + pad,
        sy + h / 2 + pad,
        never: never,
      );
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
}
