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

  /// The CSS colour keywords.
  static const _named = <String, int>{
    'transparent': 0x00000000,
    'aliceblue': 0xFFF0F8FF,
    'antiquewhite': 0xFFFAEBD7,
    'aqua': 0xFF00FFFF,
    'aquamarine': 0xFF7FFFD4,
    'azure': 0xFFF0FFFF,
    'beige': 0xFFF5F5DC,
    'bisque': 0xFFFFE4C4,
    'black': 0xFF000000,
    'blanchedalmond': 0xFFFFEBCD,
    'blue': 0xFF0000FF,
    'blueviolet': 0xFF8A2BE2,
    'brown': 0xFFA52A2A,
    'burlywood': 0xFFDEB887,
    'cadetblue': 0xFF5F9EA0,
    'chartreuse': 0xFF7FFF00,
    'chocolate': 0xFFD2691E,
    'coral': 0xFFFF7F50,
    'cornflowerblue': 0xFF6495ED,
    'cornsilk': 0xFFFFF8DC,
    'crimson': 0xFFDC143C,
    'cyan': 0xFF00FFFF,
    'darkblue': 0xFF00008B,
    'darkcyan': 0xFF008B8B,
    'darkgoldenrod': 0xFFB8860B,
    'darkgray': 0xFFA9A9A9,
    'darkgreen': 0xFF006400,
    'darkgrey': 0xFFA9A9A9,
    'darkkhaki': 0xFFBDB76B,
    'darkmagenta': 0xFF8B008B,
    'darkolivegreen': 0xFF556B2F,
    'darkorange': 0xFFFF8C00,
    'darkorchid': 0xFF9932CC,
    'darkred': 0xFF8B0000,
    'darksalmon': 0xFFE9967A,
    'darkseagreen': 0xFF8FBC8F,
    'darkslateblue': 0xFF483D8B,
    'darkslategray': 0xFF2F4F4F,
    'darkslategrey': 0xFF2F4F4F,
    'darkturquoise': 0xFF00CED1,
    'darkviolet': 0xFF9400D3,
    'deeppink': 0xFFFF1493,
    'deepskyblue': 0xFF00BFFF,
    'dimgray': 0xFF696969,
    'dimgrey': 0xFF696969,
    'dodgerblue': 0xFF1E90FF,
    'firebrick': 0xFFB22222,
    'floralwhite': 0xFFFFFAF0,
    'forestgreen': 0xFF228B22,
    'fuchsia': 0xFFFF00FF,
    'gainsboro': 0xFFDCDCDC,
    'ghostwhite': 0xFFF8F8FF,
    'gold': 0xFFFFD700,
    'goldenrod': 0xFFDAA520,
    'gray': 0xFF808080,
    'green': 0xFF008000,
    'greenyellow': 0xFFADFF2F,
    'grey': 0xFF808080,
    'honeydew': 0xFFF0FFF0,
    'hotpink': 0xFFFF69B4,
    'indianred': 0xFFCD5C5C,
    'indigo': 0xFF4B0082,
    'ivory': 0xFFFFFFF0,
    'khaki': 0xFFF0E68C,
    'lavender': 0xFFE6E6FA,
    'lavenderblush': 0xFFFFF0F5,
    'lawngreen': 0xFF7CFC00,
    'lemonchiffon': 0xFFFFFACD,
    'lightblue': 0xFFADD8E6,
    'lightcoral': 0xFFF08080,
    'lightcyan': 0xFFE0FFFF,
    'lightgoldenrodyellow': 0xFFFAFAD2,
    'lightgray': 0xFFD3D3D3,
    'lightgreen': 0xFF90EE90,
    'lightgrey': 0xFFD3D3D3,
    'lightpink': 0xFFFFB6C1,
    'lightsalmon': 0xFFFFA07A,
    'lightseagreen': 0xFF20B2AA,
    'lightskyblue': 0xFF87CEFA,
    'lightslategray': 0xFF778899,
    'lightslategrey': 0xFF778899,
    'lightsteelblue': 0xFFB0C4DE,
    'lightyellow': 0xFFFFFFE0,
    'lime': 0xFF00FF00,
    'limegreen': 0xFF32CD32,
    'linen': 0xFFFAF0E6,
    'magenta': 0xFFFF00FF,
    'maroon': 0xFF800000,
    'mediumaquamarine': 0xFF66CDAA,
    'mediumblue': 0xFF0000CD,
    'mediumorchid': 0xFFBA55D3,
    'mediumpurple': 0xFF9370DB,
    'mediumseagreen': 0xFF3CB371,
    'mediumslateblue': 0xFF7B68EE,
    'mediumspringgreen': 0xFF00FA9A,
    'mediumturquoise': 0xFF48D1CC,
    'mediumvioletred': 0xFFC71585,
    'midnightblue': 0xFF191970,
    'mintcream': 0xFFF5FFFA,
    'mistyrose': 0xFFFFE4E1,
    'moccasin': 0xFFFFE4B5,
    'navajowhite': 0xFFFFDEAD,
    'navy': 0xFF000080,
    'oldlace': 0xFFFDF5E6,
    'olive': 0xFF808000,
    'olivedrab': 0xFF6B8E23,
    'orange': 0xFFFFA500,
    'orangered': 0xFFFF4500,
    'orchid': 0xFFDA70D6,
    'palegoldenrod': 0xFFEEE8AA,
    'palegreen': 0xFF98FB98,
    'paleturquoise': 0xFFAFEEEE,
    'palevioletred': 0xFFDB7093,
    'papayawhip': 0xFFFFEFD5,
    'peachpuff': 0xFFFFDAB9,
    'peru': 0xFFCD853F,
    'pink': 0xFFFFC0CB,
    'plum': 0xFFDDA0DD,
    'powderblue': 0xFFB0E0E6,
    'purple': 0xFF800080,
    'rebeccapurple': 0xFF663399,
    'red': 0xFFFF0000,
    'rosybrown': 0xFFBC8F8F,
    'royalblue': 0xFF4169E1,
    'saddlebrown': 0xFF8B4513,
    'salmon': 0xFFFA8072,
    'sandybrown': 0xFFF4A460,
    'seagreen': 0xFF2E8B57,
    'seashell': 0xFFFFF5EE,
    'sienna': 0xFFA0522D,
    'silver': 0xFFC0C0C0,
    'skyblue': 0xFF87CEEB,
    'slateblue': 0xFF6A5ACD,
    'slategray': 0xFF708090,
    'slategrey': 0xFF708090,
    'snow': 0xFFFFFAFA,
    'springgreen': 0xFF00FF7F,
    'steelblue': 0xFF4682B4,
    'tan': 0xFFD2B48C,
    'teal': 0xFF008080,
    'thistle': 0xFFD8BFD8,
    'tomato': 0xFFFF6347,
    'turquoise': 0xFF40E0D0,
    'violet': 0xFFEE82EE,
    'wheat': 0xFFF5DEB3,
    'white': 0xFFFFFFFF,
    'whitesmoke': 0xFFF5F5F5,
    'yellow': 0xFFFFFF00,
    'yellowgreen': 0xFF9ACD32,
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
