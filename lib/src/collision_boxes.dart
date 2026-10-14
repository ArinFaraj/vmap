import 'dart:math' as math;
import 'dart:typed_data';

/// The screen boxes placed labels and markers take, which the labels placed
/// after them keep clear of.
class CollisionBoxes {
  /// The style spec's `text-padding` and `icon-padding` default.
  static const double defaultPad = 2;

  Float32List _boxes = Float32List(1024);
  int _count = 0;

  void clear() => _count = 0;

  /// Takes the box from [l], [t] to [r], [b] as it is, and returns its
  /// number.
  int add(double l, double t, double r, double b) {
    if (_count + 4 > _boxes.length) {
      _boxes = Float32List(_boxes.length * 2)..setRange(0, _count, _boxes);
    }
    final number = _count ~/ 4;
    _boxes[_count++] = l;
    _boxes[_count++] = t;
    _boxes[_count++] = r;
    _boxes[_count++] = b;
    return number;
  }

  /// Whether the box from [l], [t] to [r], [b] overlaps one taken, other
  /// than box number [except].
  bool hits(double l, double t, double r, double b, {int? except}) {
    final boxes = _boxes;
    final skip = except == null ? -1 : except * 4;
    for (var i = 0; i < _count; i += 4) {
      if (i == skip) continue;
      if (l < boxes[i + 2] &&
          r > boxes[i] &&
          t < boxes[i + 3] &&
          b > boxes[i + 1]) {
        return true;
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
  }) {
    if (angle == 0) {
      return hits(
        sx - w / 2 - pad,
        sy - h / 2 - pad,
        sx + w / 2 + pad,
        sy + h / 2 + pad,
        except: except,
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
      if (hits(x - r, y - r, x + r, y + r, except: except)) return true;
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
  }) {
    if (angle == 0) {
      add(
        sx - w / 2 - pad,
        sy - h / 2 - pad,
        sx + w / 2 + pad,
        sy + h / 2 + pad,
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
      add(x - r, y - r, x + r, y + r);
    }
  }
}
