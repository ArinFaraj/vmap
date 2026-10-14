import 'dart:math' as math;

class Rgba {
  const Rgba(this.r, this.g, this.b, this.a);

  final double r;
  final double g;
  final double b;
  final double a;

  static const transparent = Rgba(0, 0, 0, 0);
  static const black = Rgba(0, 0, 0, 1);

  int toArgb([double opacity = 1]) =>
      ((a * opacity).clamp(0, 1) * 255).round() << 24 |
      (r.clamp(0, 1) * 255).round() << 16 |
      (g.clamp(0, 1) * 255).round() << 8 |
      (b.clamp(0, 1) * 255).round();

  static Rgba lerp(Rgba x, Rgba y, double t) => Rgba(
    x.r + (y.r - x.r) * t,
    x.g + (y.g - x.g) * t,
    x.b + (y.b - x.b) * t,
    x.a + (y.a - x.a) * t,
  );

  /// [x] to [y] by [t] through CIELAB, as MapLibre's `interpolate-lab`.
  static Rgba lerpLab(Rgba x, Rgba y, double t) {
    final a = x._lab, b = y._lab;
    return Rgba._fromLab(
      a.$1 + (b.$1 - a.$1) * t,
      a.$2 + (b.$2 - a.$2) * t,
      a.$3 + (b.$3 - a.$3) * t,
      x.a + (y.a - x.a) * t,
    );
  }

  /// [x] to [y] by [t] through hue, chroma and lightness, the hue taking
  /// the short way round, as MapLibre's `interpolate-hcl`.
  static Rgba lerpHcl(Rgba x, Rgba y, double t) {
    final a = x._lab, b = y._lab;
    var h0 = math.atan2(a.$3, a.$2), h1 = math.atan2(b.$3, b.$2);
    final c0 = math.sqrt(a.$2 * a.$2 + a.$3 * a.$3);
    final c1 = math.sqrt(b.$2 * b.$2 + b.$3 * b.$3);
    var d = h1 - h0;
    if (d > math.pi) d -= 2 * math.pi;
    if (d < -math.pi) d += 2 * math.pi;
    h0 += d * t;
    final c = c0 + (c1 - c0) * t;
    return Rgba._fromLab(
      a.$1 + (b.$1 - a.$1) * t,
      math.cos(h0) * c,
      math.sin(h0) * c,
      x.a + (y.a - x.a) * t,
    );
  }

  // CIELAB against the D50 white MapLibre's style spec uses
  // (color_spaces.ts), so blends match its pixels.
  static const _xn = 0.96422, _zn = 0.82521;
  static const _t0 = 4 / 29, _t1 = 6 / 29;
  static const _t2 = 3 * _t1 * _t1, _t3 = _t1 * _t1 * _t1;

  (double, double, double) get _lab {
    double linear(double v) => v <= 0.04045
        ? v / 12.92
        : math.pow((v + 0.055) / 1.055, 2.4).toDouble();
    double f(double v) =>
        v > _t3 ? math.pow(v, 1 / 3).toDouble() : v / _t2 + _t0;
    final lr = linear(r), lg = linear(g), lb = linear(b);
    final y = f(0.2225045 * lr + 0.7168786 * lg + 0.0606169 * lb);
    final x = r == g && g == b
        ? y
        : f((0.4360747 * lr + 0.3850649 * lg + 0.1430804 * lb) / _xn);
    final z = r == g && g == b
        ? y
        : f((0.0139322 * lr + 0.0971045 * lg + 0.7141733 * lb) / _zn);
    return (math.max(0, 116 * y - 16), 500 * (x - y), 200 * (y - z));
  }

  static Rgba _fromLab(double l, double a, double b, double alpha) {
    double f(double v) => v > _t1 ? v * v * v : _t2 * (v - _t0);
    double gamma(double v) =>
        (v <= 0.0031308 ? 12.92 * v : 1.055 * math.pow(v, 1 / 2.4) - 0.055)
            .clamp(0.0, 1.0);
    final fy = (l + 16) / 116;
    final y = f(fy), x = _xn * f(fy + a / 500), z = _zn * f(fy - b / 200);
    return Rgba(
      gamma(3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      gamma(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
      gamma(0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      alpha,
    );
  }

  static final Map<String, Rgba?> _parsed = {};

  static Rgba? of(Object? value) {
    if (value is Rgba) return value;
    if (value is! String) return null;
    return _parsed.putIfAbsent(value, () => _parse(value));
  }

  static const _named = <String, int>{
    'transparent': 0x00000000,
    'black': 0xFF000000,
    'white': 0xFFFFFFFF,
    'red': 0xFFFF0000,
    'green': 0xFF008000,
    'blue': 0xFF0000FF,
    'yellow': 0xFFFFFF00,
    'orange': 0xFFFFA500,
    'gray': 0xFF808080,
    'grey': 0xFF808080,
    'silver': 0xFFC0C0C0,
    'lightgray': 0xFFD3D3D3,
    'lightgrey': 0xFFD3D3D3,
    'darkgray': 0xFFA9A9A9,
    'darkgrey': 0xFFA9A9A9,
    'dimgray': 0xFF696969,
    'whitesmoke': 0xFFF5F5F5,
    'gainsboro': 0xFFDCDCDC,
    'purple': 0xFF800080,
    'brown': 0xFFA52A2A,
    'pink': 0xFFFFC0CB,
    'cyan': 0xFF00FFFF,
    'magenta': 0xFFFF00FF,
    'navy': 0xFF000080,
    'teal': 0xFF008080,
    'beige': 0xFFF5F5DC,
    'ivory': 0xFFFFFFF0,
    'lightblue': 0xFFADD8E6,
    'steelblue': 0xFF4682B4,
    'darkblue': 0xFF00008B,
    'darkgreen': 0xFF006400,
  };

  static Rgba? _parse(String input) {
    final s = input.trim().toLowerCase();
    if (s.startsWith('#')) {
      var hex = s.substring(1);
      if (hex.length == 3 || hex.length == 4) {
        hex = hex.split('').map((c) => '$c$c').join();
      }
      final v = int.tryParse(hex, radix: 16);
      if (v == null) return null;
      if (hex.length == 6) {
        return Rgba(
          (v >> 16 & 255) / 255,
          (v >> 8 & 255) / 255,
          (v & 255) / 255,
          1,
        );
      }
      if (hex.length == 8) {
        return Rgba(
          (v >> 24 & 255) / 255,
          (v >> 16 & 255) / 255,
          (v >> 8 & 255) / 255,
          (v & 255) / 255,
        );
      }
      return null;
    }
    final open = s.indexOf('(');
    if (open > 0 && s.endsWith(')')) {
      final parts = s
          .substring(open + 1, s.length - 1)
          .split(RegExp(r'[,/\s]+'))
          .where((p) => p.isNotEmpty)
          .toList();
      double part(int i, double whole) {
        final p = parts[i];
        return p.endsWith('%')
            ? (double.tryParse(p.substring(0, p.length - 1)) ?? 0) / 100
            : (double.tryParse(p) ?? 0) / whole;
      }

      if (parts.length < 3) return null;
      final alpha = parts.length > 3 ? part(3, 1) : 1.0;
      final name = s.substring(0, open);
      if (name == 'rgb' || name == 'rgba') {
        return Rgba(part(0, 255), part(1, 255), part(2, 255), alpha);
      }
      if (name == 'hsl' || name == 'hsla') {
        final h =
            ((double.tryParse(parts[0].replaceAll('deg', '')) ?? 0) % 360) /
            360;
        return hsl(h, part(1, 100), part(2, 100), alpha);
      }
      return null;
    }
    final named = _named[s];
    if (named == null) return null;
    return Rgba(
      (named >> 16 & 255) / 255,
      (named >> 8 & 255) / 255,
      (named & 255) / 255,
      (named >> 24 & 255) / 255,
    );
  }

  static Rgba hsl(double h, double s, double l, double a) {
    final q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    final p = 2 * l - q;
    double channel(double t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    return Rgba(channel(h + 1 / 3), channel(h), channel(h - 1 / 3), a);
  }
}
