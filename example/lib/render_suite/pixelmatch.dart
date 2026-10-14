// A port of pixelmatch 5 (ISC licence, Mapbox), the comparison MapLibre's
// render tests score with, so a score here means what it means there.
import 'dart:math' as math;
import 'dart:typed_data';

/// The number of pixels of [a] and [b], straight RGBA of [width] by
/// [height], that differ by more than [threshold], not counting
/// antialiasing. Differing pixels are painted red in [diff], antialiased
/// ones yellow, and the rest a faded grey of [a].
int pixelmatch(
  Uint8List a,
  Uint8List b,
  Uint8List diff,
  int width,
  int height, {
  double threshold = 0.1,
}) {
  final maxDelta = 35215 * threshold * threshold;
  var count = 0;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      final pos = (y * width + x) * 4;
      final delta = _colorDelta(a, b, pos, pos, false);
      if (delta.abs() > maxDelta) {
        if (_antialiased(a, x, y, width, height, b) ||
            _antialiased(b, x, y, width, height, a)) {
          _paint(diff, pos, 255, 255, 0);
        } else {
          _paint(diff, pos, 255, 0, 0);
          count++;
        }
      } else {
        final grey = _blend(
          _rgb2y(a[pos], a[pos + 1], a[pos + 2]),
          0.1 * a[pos + 3] / 255,
        );
        _paint(diff, pos, grey, grey, grey);
      }
    }
  }
  return count;
}

void _paint(Uint8List out, int pos, num r, num g, num b) {
  out[pos] = r.round().clamp(0, 255);
  out[pos + 1] = g.round().clamp(0, 255);
  out[pos + 2] = b.round().clamp(0, 255);
  out[pos + 3] = 255;
}

bool _antialiased(Uint8List img, int x1, int y1, int w, int h, Uint8List img2) {
  final x0 = math.max(x1 - 1, 0), y0 = math.max(y1 - 1, 0);
  final x2 = math.min(x1 + 1, w - 1), y2 = math.min(y1 + 1, h - 1);
  final pos = (y1 * w + x1) * 4;
  var zeroes = x1 == x0 || x1 == x2 || y1 == y0 || y1 == y2 ? 1 : 0;
  var min = 0.0, max = 0.0;
  var minX = 0, minY = 0, maxX = 0, maxY = 0;
  for (var x = x0; x <= x2; x++) {
    for (var y = y0; y <= y2; y++) {
      if (x == x1 && y == y1) continue;
      final delta = _colorDelta(img, img, pos, (y * w + x) * 4, true);
      if (delta == 0) {
        zeroes++;
        if (zeroes > 2) return false;
      } else if (delta < min) {
        min = delta;
        minX = x;
        minY = y;
      } else if (delta > max) {
        max = delta;
        maxX = x;
        maxY = y;
      }
    }
  }
  if (min == 0 || max == 0) return false;
  return (_manySiblings(img, minX, minY, w, h) &&
          _manySiblings(img2, minX, minY, w, h)) ||
      (_manySiblings(img, maxX, maxY, w, h) &&
          _manySiblings(img2, maxX, maxY, w, h));
}

bool _manySiblings(Uint8List img, int x1, int y1, int w, int h) {
  final x0 = math.max(x1 - 1, 0), y0 = math.max(y1 - 1, 0);
  final x2 = math.min(x1 + 1, w - 1), y2 = math.min(y1 + 1, h - 1);
  final pos = (y1 * w + x1) * 4;
  var zeroes = x1 == x0 || x1 == x2 || y1 == y0 || y1 == y2 ? 1 : 0;
  for (var x = x0; x <= x2; x++) {
    for (var y = y0; y <= y2; y++) {
      if (x == x1 && y == y1) continue;
      final pos2 = (y * w + x) * 4;
      if (img[pos] == img[pos2] &&
          img[pos + 1] == img[pos2 + 1] &&
          img[pos + 2] == img[pos2 + 2] &&
          img[pos + 3] == img[pos2 + 3]) {
        zeroes++;
      }
      if (zeroes > 2) return true;
    }
  }
  return false;
}

double _colorDelta(Uint8List a, Uint8List b, int k, int m, bool yOnly) {
  double r1 = a[k].toDouble(),
      g1 = a[k + 1].toDouble(),
      b1 = a[k + 2].toDouble();
  final a1 = a[k + 3];
  double r2 = b[m].toDouble(),
      g2 = b[m + 1].toDouble(),
      b2 = b[m + 2].toDouble();
  final a2 = b[m + 3];
  if (a1 == a2 && r1 == r2 && g1 == g2 && b1 == b2) return 0;
  if (a1 < 255) {
    final f = a1 / 255;
    r1 = _blend(r1, f);
    g1 = _blend(g1, f);
    b1 = _blend(b1, f);
  }
  if (a2 < 255) {
    final f = a2 / 255;
    r2 = _blend(r2, f);
    g2 = _blend(g2, f);
    b2 = _blend(b2, f);
  }
  final y1 = _rgb2y(r1, g1, b1), y2 = _rgb2y(r2, g2, b2);
  final y = y1 - y2;
  if (yOnly) return y;
  final i = _rgb2i(r1, g1, b1) - _rgb2i(r2, g2, b2);
  final q = _rgb2q(r1, g1, b1) - _rgb2q(r2, g2, b2);
  final delta = 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
  return y1 > y2 ? -delta : delta;
}

double _rgb2y(num r, num g, num b) =>
    r * 0.29889531 + g * 0.58662247 + b * 0.11448223;
double _rgb2i(num r, num g, num b) =>
    r * 0.59597799 - g * 0.27417610 - b * 0.32180189;
double _rgb2q(num r, num g, num b) =>
    r * 0.21147017 - g * 0.52261711 + b * 0.31114694;
double _blend(num c, double a) => 255 + (c - 255) * a;
