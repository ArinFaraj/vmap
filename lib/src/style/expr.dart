import 'dart:convert';
import 'dart:math' as math;

import 'color.dart';
import 'format.dart';
import 'expr_ops.dart';

export 'color.dart';

/// What a style expression is evaluated against.
class EvalContext {
  /// Style zoom: the 512 px tile convention MapLibre styles are written in.
  double zoom = 0;
  Map<String, Object?> props = const {};

  /// `Point`, `LineString` or `Polygon`.
  String geometryType = '';

  /// What `heatmap-density` and `line-progress` read.
  double progress = 0;

  /// What `feature-state` reads: the state the app gave the feature.
  Map<String, Object?> state = const {};

  /// What `accumulated` reads while a cluster adds up one of its properties.
  Object? accumulated;

  /// The time a frame is drawn at, in milliseconds on the engine's clock,
  /// which a paint property's transition is timed by.
  double nowMs = 0;

  /// The feature's parts (its points, lines or rings), each as longitude
  /// and latitude in turn, which `within`
  /// and `distance` read. Null where features are not weighed by place.
  List<List<double>> Function()? lonLats;
}

typedef Expr = Object? Function(EvalContext c);

/// [v] as a number when it is one that can be drawn, otherwise [fallback]:
/// MapLibre draws a size that comes out as NaN or infinite at its default.
double finiteOr(Object? v, double fallback) {
  final n = asNumber(v);
  return n != null && n.isFinite ? n : fallback;
}

double? asNumber(Object? v) => v is num
    ? v.toDouble()
    : v is String
    ? double.tryParse(v)
    : v is bool
    ? (v ? 1 : 0)
    : null;

/// [v] as JavaScript's `String(v)` writes it, which `in` and `index-of`
/// search a string for.
String jsText(Object? v) => v is bool
    ? '$v'
    : v == null
    ? 'null'
    : asText(v);

String asText(Object? v) {
  if (v == null) return '';
  if (v is double && v == v.roundToDouble()) return v.toInt().toString();
  return v.toString();
}

/// The name MapLibre's `typeof` gives [v]'s type.
String typeName(Object? v) {
  switch (v) {
    case null:
      return 'null';
    case bool():
      return 'boolean';
    case num():
      return 'number';
    case String():
      return 'string';
    case Rgba():
      return 'color';
    case FormattedText():
      return 'formatted';
    case List():
      String? item;
      for (final e in v) {
        final t = typeName(e);
        if (item == null) {
          item = t;
        } else if (item != t) {
          item = 'value';
          break;
        }
      }
      return 'array<${item ?? 'value'}, ${v.length}>';
    default:
      return 'object';
  }
}

bool truthy(Object? v) =>
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
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'within', 'distance',
  'accumulated', 'to-rgba', 'hsl', 'hsla', 'split', 'join', 'semiliteral',
  r'$images',
  r'$transition',
};

/// The variables `let` has bound around the expression being compiled.
final List<Map<String, Expr>> letScopes = [];

/// The property a `within` or `distance` [json] is kept under for its
/// feature: worked out where the tile is built, beside the geometry, since
/// a paint is evaluated without it.
String geometryKey(Object? json) => '\$geometry:${jsonEncode(json)}';

final Map<String, Expr> _geometryExprs = {};

/// The expression [geometryKey] named, to work out from a feature's
/// geometry.
Expr? geometryExpr(String key) => _geometryExprs[key];

/// [read], or without the geometry the value kept under its [key].
Expr byGeometry(String key, Expr read) =>
    _geometryExprs[key] = (c) => c.lonLats == null ? c.props[key] : read(c);

Expr constantExpr(Object? value) =>
    (_) => value;

/// Compiles a style property value: a constant, a legacy `stops` function or
/// an expression.
Expr compileExpr(Object? json) {
  if (json is Map) {
    return json.containsKey('stops') || json.containsKey('property')
        ? _legacyFunction(json)
        : constantExpr(json);
  }
  if (json is List && json.isNotEmpty && _operators.contains(json.first)) {
    return compileOp(json.first as String, json.sublist(1));
  }
  return constantExpr(json);
}

/// Compiles a text field: an expression, or a string with `{property}`
/// tokens.
Expr compileText(Object? json) {
  if (json is String && json.contains('{')) return _tokens(json);
  final inner = compileExpr(json);
  // As MapLibre's getValueAndResolveTokens: the output of a legacy
  // function that reads no property has its tokens filled in too.
  if (json is Map && json['property'] == null) {
    final filled = <String, Expr>{};
    return (c) {
      final value = inner(c);
      if (value is String && value.contains('{')) {
        return (filled[value] ??= _tokens(value))(c);
      }
      return value is FormattedText ? value : trimLines(asText(value));
    };
  }
  return (c) {
    final value = inner(c);
    return value is FormattedText ? value : trimLines(asText(value));
  };
}

/// [text] with each `{property}` token the feature's property.
Expr _tokens(String text) {
  final parts = <Object>[];
  final token = RegExp(r'\{([^}]*)\}');
  var at = 0;
  for (final m in token.allMatches(text)) {
    if (m.start > at) parts.add(text.substring(at, m.start));
    parts.add([m.group(1)!]);
    at = m.end;
  }
  if (at < text.length) parts.add(text.substring(at));
  return (c) {
    final out = StringBuffer();
    for (final p in parts) {
      out.write(p is String ? p : asText(c.props[(p as List).first]));
    }
    return trimLines(out.toString());
  };
}

/// Between the names an icon falls back through, first to last, where an
/// `icon-image` coalesces images: the sprite takes the first it has, as
/// MapLibre skips an image that is not available.
const imageChoice = '\u001f';

/// Compiles an `icon-image`: as [compileText], with each `coalesce` of
/// images giving every name it names, joined by [imageChoice].
Expr compileIcon(Object? json) {
  Object? walk(Object? v) => switch (v) {
    ['coalesce', ...final rest]
        when rest.isNotEmpty &&
            rest.every(
              (a) => a is List && a.isNotEmpty && a.first == 'image',
            ) =>
      [r'$images', ...rest],
    final List<Object?> l => [for (final e in l) walk(e)],
    _ => v,
  };
  return compileImage(walk(json));
}

/// Compiles a sprite image's name, for an icon or a pattern: as
/// [compileText], with formatted text read as its plain text.
Expr compileImage(Object? json) {
  final text = compileText(json);
  return (c) => switch (text(c)) {
    final FormattedText f => '$f',
    final v => v,
  };
}

/// Compiles a layer filter in either the expression or the legacy syntax.
bool Function(EvalContext) compileFilter(Object? json) {
  if (json == null) return (_) => true;
  final expr = _filter(json);
  return (c) => expr(c) == true;
}

Expr _filter(Object? json) {
  if (json is! List || json.isEmpty) return constantExpr(json != false);
  final op = json.first;
  final args = json.sublist(1);
  Object? key(EvalContext c, Object? name) =>
      name == r'$type' ? c.geometryType : c.props[name];
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
        _ => (c) => compareValues(op as String, key(c, name), value),
      };
  }
  return compileExpr(json);
}

Expr interpolateExpr(
  Expr input,
  List<double> stops,
  List<Expr> outs, {
  double base = 1,
  bool geometric = false,
  List<double>? bezier,
  String? space,
}) {
  if (stops.isEmpty) return constantExpr(null);
  return (c) {
    final v = asNumber(input(c));
    if (v != null && v.isNaN) return null;
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
        : bezier != null
        ? _bezier(bezier, at / span)
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
    if (ca != null && cb != null) {
      return switch (space) {
        'hcl' => Rgba.lerpHcl(ca, cb, t),
        'lab' => Rgba.lerpLab(ca, cb, t),
        _ => Rgba.lerp(ca, cb, t),
      };
    }
    return a;
  };
}

/// The height of the curve through (0,0), the two control points in [p] and
/// (1,1) at horizontal position [x].
double _bezier(List<double> p, double x) {
  double at(double t, double a, double b) {
    final u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  }

  var lo = 0.0, hi = 1.0;
  for (var i = 0; i < 24; i++) {
    final mid = (lo + hi) / 2;
    if (at(mid, p[0], p[2]) < x) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return at((lo + hi) / 2, p[1], p[3]);
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
  if (property is String &&
      rawStops.every((s) => s is List && s.isNotEmpty && s.first is Map)) {
    return _compositeFunction(json, rawStops);
  }
  final keys = <Object?>[];
  final values = <Object?>[];
  for (final s in rawStops) {
    if (s is! List || s.length < 2 || s.first is Map) {
      return constantExpr(fallback);
    }
    keys.add(s[0]);
    values.add(s[1]);
  }
  if (type == 'categorical') {
    final table = Map<Object?, Object?>.fromIterables(keys, values);
    return (c) => table[input(c)] ?? fallback;
  }
  final numeric = values.every(
    (v) =>
        v is num ||
        (v is List && v.isNotEmpty && v.every((n) => n is num)) ||
        Rgba.of(v) != null,
  );
  final stops = [for (final k in keys) asNumber(k) ?? 0];
  final outs = [for (final v in values) constantExpr(v)];
  if (type == 'interval' || (!numeric && type != 'exponential')) {
    return (c) {
      final v = input(c);
      if (v is! num) return fallback;
      var out = values.first;
      for (var i = 0; i < stops.length && stops[i] <= v; i++) {
        out = values[i];
      }
      return out;
    };
  }
  final curve = interpolateExpr(
    input,
    stops,
    outs,
    base: asNumber(json['base']) ?? 1,
    space: json['colorSpace'] as String?,
  );
  if (property is! String) return curve;
  return (c) => c.props[property] is num ? curve(c) : fallback;
}

/// A legacy function of both zoom and a feature property: its stops keyed
/// `{"zoom": z, "value": v}` make one property function per zoom, and the
/// zoom interpolates between them, as MapLibre's `createFunction` does.
Expr _compositeFunction(Map<Object?, Object?> json, List<Object?> rawStops) {
  final byZoom = <double, List<Object?>>{};
  for (final s in rawStops.cast<List<Object?>>()) {
    final key = s.first! as Map;
    final zoom = (asNumber(key['zoom']) ?? 0).toDouble();
    (byZoom[zoom] ??= []).add([key['value'], s.length > 1 ? s[1] : null]);
  }
  final zooms = byZoom.keys.toList()..sort();
  if (json['type'] == 'interval') {
    final byStep = [
      for (final z in zooms) _legacyFunction({...json, 'stops': byZoom[z]}),
    ];
    return (c) {
      var i = 0;
      while (i + 1 < zooms.length && zooms[i + 1] <= c.zoom) {
        i++;
      }
      return byStep[i](c);
    };
  }
  return interpolateExpr(
    (c) => c.zoom,
    zooms,
    [
      for (final z in zooms)
        _legacyFunction({
          'type': json['type'],
          'property': json['property'],
          'default': json['default'],
          'colorSpace': json['colorSpace'],
          'stops': byZoom[z],
        }),
    ],
    base: asNumber(json['base']) ?? 1,
    space: json['colorSpace'] as String?,
  );
}
