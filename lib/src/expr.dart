import 'dart:math' as math;

/// What a style expression is evaluated against.
class EvalContext {
  /// Style zoom: the 512 px tile convention MapLibre styles are written in.
  double zoom = 0;
  Map<String, Object?> props = const {};

  /// `Point`, `LineString` or `Polygon`.
  String geometryType = '';
}

typedef Expr = Object? Function(EvalContext c);

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
        return _hsl(h, part(1, 100), part(2, 100), alpha);
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

  static Rgba _hsl(double h, double s, double l, double a) {
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

double? asNumber(Object? v) => v is num
    ? v.toDouble()
    : v is String
    ? double.tryParse(v)
    : v is bool
    ? (v ? 1 : 0)
    : null;

String asText(Object? v) {
  if (v == null) return '';
  if (v is double && v == v.roundToDouble()) return v.toInt().toString();
  return v.toString();
}

bool _truthy(Object? v) =>
    v != null && v != false && v != 0 && v != '' && !(v is double && v.isNaN);

const _operators = {
  'literal', 'get', 'has', '!', '==', '!=', '<', '<=', '>', '>=', 'all', //
  'any', 'none', 'case', 'match', 'coalesce', 'step', 'interpolate',
  'interpolate-hcl', 'interpolate-lab', 'zoom', 'geometry-type', 'to-string',
  'to-number', 'to-boolean', 'to-color', 'string', 'number', 'boolean',
  'array', 'object', 'concat', 'upcase', 'downcase', '+', '-', '*', '/', '%',
  '^', 'min', 'max', 'round', 'floor', 'ceil', 'abs', 'sqrt', 'ln', 'log10',
  'log2', 'length', 'in', '!in', '!has', 'at', 'format', 'number-format',
  'rgb', 'rgba', 'var', 'let', 'id', 'properties', 'feature-state', 'image',
  'typeof', 'collator', 'resolved-locale', 'is-supported-script', 'slice',
  'index-of', 'e', 'pi', 'ln2', 'line-progress', 'heatmap-density',
};

Expr _constant(Object? value) =>
    (_) => value;

/// Compiles a style property value: a constant, a legacy `stops` function or
/// an expression.
Expr compileExpr(Object? json) {
  if (json is Map) {
    return json.containsKey('stops') || json.containsKey('property')
        ? _legacyFunction(json)
        : _constant(json);
  }
  if (json is List && json.isNotEmpty && _operators.contains(json.first)) {
    return _op(json.first as String, json.sublist(1));
  }
  return _constant(json);
}

/// Compiles a text field: an expression, or a string with `{property}`
/// tokens.
Expr compileText(Object? json) {
  if (json is! String || !json.contains('{')) {
    final inner = compileExpr(json);
    return (c) => asText(inner(c)).trim();
  }
  final parts = <Object>[];
  final token = RegExp(r'\{([^}]*)\}');
  var at = 0;
  for (final m in token.allMatches(json)) {
    if (m.start > at) parts.add(json.substring(at, m.start));
    parts.add([m.group(1)!]);
    at = m.end;
  }
  if (at < json.length) parts.add(json.substring(at));
  return (c) {
    final out = StringBuffer();
    for (final p in parts) {
      out.write(p is String ? p : asText(c.props[(p as List).first]));
    }
    return out.toString().trim();
  };
}

/// Compiles a layer filter in either the expression or the legacy syntax.
bool Function(EvalContext) compileFilter(Object? json) {
  if (json == null) return (_) => true;
  final expr = _filter(json);
  return (c) => expr(c) == true;
}

Expr _filter(Object? json) {
  if (json is! List || json.isEmpty) return _constant(json != false);
  final op = json.first;
  final args = json.sublist(1);
  Object? key(EvalContext c, Object? name) => name == r'$type'
      ? c.geometryType
      : name == r'$id'
      ? null
      : c.props[name];
  final legacy =
      args.isNotEmpty &&
      args.first is String &&
      (args.length < 2 || args[1] is! List || op == 'in' || op == '!in');
  switch (op) {
    case 'all':
      final parts = [for (final a in args) _filter(a)];
      return (c) {
        for (final p in parts) {
          if (p(c) != true) return false;
        }
        return true;
      };
    case 'any':
      final parts = [for (final a in args) _filter(a)];
      return (c) {
        for (final p in parts) {
          if (p(c) == true) return true;
        }
        return false;
      };
    case 'none':
      final parts = [for (final a in args) _filter(a)];
      return (c) {
        for (final p in parts) {
          if (p(c) == true) return false;
        }
        return true;
      };
    case '!has':
      final name = args.first;
      return (c) => !c.props.containsKey(name);
    case '!in':
      final name = args.first;
      final set = args.sublist(1).toSet();
      return (c) => !set.contains(key(c, name));
    case 'in' when legacy && (args.length != 2 || args[1] is! List):
      final name = args.first;
      final set = args.sublist(1).toSet();
      return (c) => set.contains(key(c, name));
    case '==' || '!=' || '<' || '<=' || '>' || '>=' when legacy:
      final name = args.first;
      final value = args[1];
      return switch (op) {
        '==' => (c) => key(c, name) == value,
        '!=' => (c) => key(c, name) != value,
        _ => (c) => _compare(op as String, key(c, name), value),
      };
  }
  return compileExpr(json);
}

bool _compare(String op, Object? a, Object? b) {
  final int order;
  if (a is num && b is num) {
    order = a.compareTo(b);
  } else if (a is String && b is String) {
    order = a.compareTo(b);
  } else {
    return false;
  }
  return switch (op) {
    '<' => order < 0,
    '<=' => order <= 0,
    '>' => order > 0,
    _ => order >= 0,
  };
}

Expr _op(String op, List<Object?> args) {
  Expr arg(int i) => i < args.length ? compileExpr(args[i]) : _constant(null);
  List<Expr> all() => [for (final a in args) compileExpr(a)];
  Expr math1(double Function(double) f) {
    final a = arg(0);
    return (c) {
      final v = asNumber(a(c));
      return v == null ? null : f(v);
    };
  }

  switch (op) {
    case 'literal':
      return _constant(args.isEmpty ? null : args.first);
    case 'get':
      final name = args.isEmpty ? null : args.first;
      if (name is String) return (c) => c.props[name];
      final inner = arg(0);
      return (c) => c.props[inner(c)];
    case 'has':
      final name = args.isEmpty ? null : args.first;
      return (c) => c.props.containsKey(name);
    case '!has':
      final name = args.isEmpty ? null : args.first;
      return (c) => !c.props.containsKey(name);
    case 'properties':
      return (c) => c.props;
    case 'zoom':
      return (c) => c.zoom;
    case 'geometry-type':
      return (c) => c.geometryType;
    case '!':
      final a = arg(0);
      return (c) => !_truthy(a(c));
    case '==':
      final a = arg(0), b = arg(1);
      return (c) => a(c) == b(c);
    case '!=':
      final a = arg(0), b = arg(1);
      return (c) => a(c) != b(c);
    case '<' || '<=' || '>' || '>=':
      final a = arg(0), b = arg(1);
      return (c) => _compare(op, a(c), b(c));
    case 'all':
      final parts = all();
      return (c) {
        for (final p in parts) {
          if (!_truthy(p(c))) return false;
        }
        return true;
      };
    case 'any':
      final parts = all();
      return (c) {
        for (final p in parts) {
          if (_truthy(p(c))) return true;
        }
        return false;
      };
    case 'none':
      final parts = all();
      return (c) {
        for (final p in parts) {
          if (_truthy(p(c))) return false;
        }
        return true;
      };
    case 'case':
      final parts = all();
      return (c) {
        var i = 0;
        for (; i + 1 < parts.length; i += 2) {
          if (_truthy(parts[i](c))) return parts[i + 1](c);
        }
        return i < parts.length ? parts[i](c) : null;
      };
    case 'match':
      final input = arg(0);
      final table = <Object?, Expr>{};
      var i = 1;
      for (; i + 1 < args.length; i += 2) {
        final out = compileExpr(args[i + 1]);
        final label = args[i];
        for (final l in label is List ? label : [label]) {
          table[l] = out;
        }
      }
      final fallback = i < args.length ? compileExpr(args[i]) : _constant(null);
      return (c) => (table[input(c)] ?? fallback)(c);
    case 'coalesce':
      final parts = all();
      return (c) {
        for (final p in parts) {
          final v = p(c);
          if (v != null) return v;
        }
        return null;
      };
    case 'step':
      final input = arg(0);
      final first = arg(1);
      final stops = <double>[];
      final outs = <Expr>[];
      for (var i = 2; i + 1 < args.length; i += 2) {
        stops.add(asNumber(args[i]) ?? 0);
        outs.add(compileExpr(args[i + 1]));
      }
      return (c) {
        final v = asNumber(input(c));
        if (v == null) return first(c);
        var out = first;
        for (var i = 0; i < stops.length && stops[i] <= v; i++) {
          out = outs[i];
        }
        return out(c);
      };
    case 'interpolate' || 'interpolate-hcl' || 'interpolate-lab':
      final kind = args.isNotEmpty && args.first is List
          ? args.first! as List
          : const ['linear'];
      final stops = <double>[];
      final outs = <Expr>[];
      for (var i = 2; i + 1 < args.length; i += 2) {
        stops.add(asNumber(args[i]) ?? 0);
        outs.add(compileExpr(args[i + 1]));
      }
      return _interpolate(
        arg(1),
        stops,
        outs,
        base: kind.first == 'exponential' && kind.length > 1
            ? asNumber(kind[1]) ?? 1
            : 1,
        geometric: kind.first == 'geometric',
      );
    case 'to-string' || 'number-format':
      final a = arg(0);
      return (c) => asText(a(c));
    case 'to-number' || 'number':
      final parts = all();
      return (c) {
        for (final p in parts) {
          final v = asNumber(p(c));
          if (v != null) return v;
        }
        return op == 'to-number' ? 0.0 : null;
      };
    case 'to-boolean':
      final a = arg(0);
      return (c) => _truthy(a(c));
    case 'to-color':
      final a = arg(0);
      return (c) => Rgba.of(a(c));
    case 'string' || 'boolean' || 'array' || 'object':
      final parts = all();
      return (c) {
        for (final p in parts) {
          final v = p(c);
          if (v != null) return v;
        }
        return null;
      };
    case 'concat' || 'format':
      final parts = [
        for (final a in args)
          if (a is! Map) compileExpr(a),
      ];
      return (c) {
        final out = StringBuffer();
        for (final p in parts) {
          out.write(asText(p(c)));
        }
        return out.toString();
      };
    case 'upcase':
      final a = arg(0);
      return (c) => asText(a(c)).toUpperCase();
    case 'downcase':
      final a = arg(0);
      return (c) => asText(a(c)).toLowerCase();
    case '+' || '*' || 'min' || 'max':
      final parts = all();
      return (c) {
        double? acc;
        for (final p in parts) {
          final v = asNumber(p(c));
          if (v == null) return null;
          acc = acc == null
              ? v
              : switch (op) {
                  '+' => acc + v,
                  '*' => acc * v,
                  'min' => math.min(acc, v),
                  _ => math.max(acc, v),
                };
        }
        return acc;
      };
    case '-' || '/' || '%' || '^':
      final a = arg(0);
      if (args.length == 1) return math1((v) => -v);
      final b = arg(1);
      return (c) {
        final x = asNumber(a(c)), y = asNumber(b(c));
        if (x == null || y == null) return null;
        return switch (op) {
          '-' => x - y,
          '/' => x / y,
          '%' => x % y,
          _ => math.pow(x, y).toDouble(),
        };
      };
    case 'round':
      return math1((v) => v.roundToDouble());
    case 'floor':
      return math1((v) => v.floorToDouble());
    case 'ceil':
      return math1((v) => v.ceilToDouble());
    case 'abs':
      return math1((v) => v.abs());
    case 'sqrt':
      return math1(math.sqrt);
    case 'ln':
      return math1(math.log);
    case 'log10':
      return math1((v) => math.log(v) / math.ln10);
    case 'log2':
      return math1((v) => math.log(v) / math.ln2);
    case 'e':
      return _constant(math.e);
    case 'pi':
      return _constant(math.pi);
    case 'ln2':
      return _constant(math.ln2);
    case 'length':
      final a = arg(0);
      return (c) {
        final v = a(c);
        return v is String
            ? v.length
            : v is List
            ? v.length
            : null;
      };
    case 'in':
      final needle = arg(0), haystack = arg(1);
      return (c) {
        final h = haystack(c);
        final n = needle(c);
        if (h is List) return h.contains(n);
        if (h is String && n is String) return h.contains(n);
        return false;
      };
    case 'at':
      final index = arg(0), list = arg(1);
      return (c) {
        final l = list(c);
        final i = asNumber(index(c))?.toInt();
        return l is List && i != null && i >= 0 && i < l.length ? l[i] : null;
      };
    case 'rgb' || 'rgba':
      final parts = all();
      return (c) {
        final v = [for (final p in parts) asNumber(p(c)) ?? 0];
        if (v.length < 3) return null;
        return Rgba(
          v[0] / 255,
          v[1] / 255,
          v[2] / 255,
          v.length > 3 ? v[3] : 1,
        );
      };
  }
  return _constant(null);
}

Expr _interpolate(
  Expr input,
  List<double> stops,
  List<Expr> outs, {
  double base = 1,
  bool geometric = false,
}) {
  if (stops.isEmpty) return _constant(null);
  return (c) {
    final v = asNumber(input(c));
    if (v == null || v <= stops.first) return outs.first(c);
    if (v >= stops.last) return outs.last(c);
    var i = 1;
    while (stops[i] < v) {
      i++;
    }
    final span = stops[i] - stops[i - 1];
    final at = v - stops[i - 1];
    final t = span == 0
        ? 0.0
        : base == 1
        ? at / span
        : (math.pow(base, at) - 1) / (math.pow(base, span) - 1);
    final a = outs[i - 1](c);
    final b = outs[i](c);
    if (a is num && b is num) {
      if (geometric && a > 0 && b > 0) return a * math.pow(b / a, t);
      return a + (b - a) * t;
    }
    if (a is List && b is List && a.length == b.length) {
      return [
        for (var k = 0; k < a.length; k++)
          (asNumber(a[k]) ?? 0) +
              ((asNumber(b[k]) ?? 0) - (asNumber(a[k]) ?? 0)) * t,
      ];
    }
    final ca = Rgba.of(a), cb = Rgba.of(b);
    if (ca != null && cb != null) return Rgba.lerp(ca, cb, t);
    return a;
  };
}

Expr _legacyFunction(Map<Object?, Object?> json) {
  final property = json['property'];
  final type = json['type'];
  final fallback = json['default'];
  final rawStops = json['stops'];
  Expr input = property is String ? (c) => c.props[property] : (c) => c.zoom;
  if (type == 'identity' || rawStops is! List || rawStops.isEmpty) {
    return (c) => input(c) ?? fallback;
  }
  final keys = <Object?>[];
  final values = <Object?>[];
  for (final s in rawStops) {
    if (s is! List || s.length < 2 || s.first is Map) {
      return _constant(fallback);
    }
    keys.add(s[0]);
    values.add(s[1]);
  }
  if (type == 'categorical') {
    final table = Map<Object?, Object?>.fromIterables(keys, values);
    return (c) => table[input(c)] ?? fallback;
  }
  final numeric = values.every((v) => v is num || Rgba.of(v) != null);
  final stops = [for (final k in keys) asNumber(k) ?? 0];
  final outs = [for (final v in values) _constant(v)];
  if (type == 'interval' || (!numeric && type != 'exponential')) {
    return (c) {
      final v = asNumber(input(c));
      if (v == null) return fallback;
      var out = values.first;
      for (var i = 0; i < stops.length && stops[i] <= v; i++) {
        out = values[i];
      }
      return out;
    };
  }
  final curve = _interpolate(
    input,
    stops,
    outs,
    base: asNumber(json['base']) ?? 1,
  );
  if (property is! String) return curve;
  return (c) => c.props[property] == null ? fallback : curve(c);
}
