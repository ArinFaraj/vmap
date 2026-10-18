import 'dart:convert';
import 'dart:math' as math;

import 'color.dart';
import 'format.dart';
import 'place.dart';

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

  /// The feature's points as longitude and latitude in turn, which `within`
  /// and `distance` read. Null where features are not weighed by place.
  List<double> Function()? lonLats;
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
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'within', 'distance',
  'accumulated', 'to-rgba', 'hsl', 'hsla', 'split', 'join',
};

/// The variables `let` has bound around the expression being compiled.
final List<Map<String, Expr>> _scopes = [];

/// The property a `within` or `distance` [json] is kept under for its
/// feature: worked out where the tile is built, beside the geometry, since
/// a paint is evaluated without it.
String geometryKey(Object? json) => '\$geometry:${jsonEncode(json)}';

final Map<String, Expr> _geometryExprs = {};

/// The expression [geometryKey] named, to work out from a feature's
/// geometry.
Expr? geometryExpr(String key) => _geometryExprs[key];

/// [read], or without the geometry the value kept under its [key].
Expr _byGeometry(String key, Expr read) =>
    _geometryExprs[key] = (c) => c.lonLats == null ? c.props[key] : read(c);

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
    return (c) {
      final value = inner(c);
      return value is FormattedText ? value : asText(value).trim();
    };
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

/// Whether a comparison is given a collator that sets case aside, which is
/// what a collator does unless told otherwise.
bool _folds(List<Object?> args) =>
    args.length > 2 &&
    args[2] is List &&
    (args[2]! as List).firstOrNull == 'collator' &&
    switch ((args[2]! as List).elementAtOrNull(1)) {
      {'case-sensitive': true} => false,
      _ => true,
    };

Object? _folded(Object? value) => value is String ? value.toLowerCase() : value;

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
      if (args.length > 1) {
        final key = arg(0), from = arg(1);
        return (c) => switch (from(c)) {
          final Map<Object?, Object?> m => m[key(c)],
          _ => null,
        };
      }
      if (name is String) return (c) => c.props[name];
      final inner = arg(0);
      return (c) => c.props[inner(c)];
    case 'has':
      final name = args.isEmpty ? null : args.first;
      if (args.length > 1) {
        final key = arg(0), from = arg(1);
        return (c) => switch (from(c)) {
          final Map<Object?, Object?> m => m.containsKey(key(c)),
          _ => false,
        };
      }
      return (c) => c.props.containsKey(name);
    case '!has':
      final name = args.isEmpty ? null : args.first;
      return (c) => !c.props.containsKey(name);
    case 'properties':
      return (c) => c.props;
    case 'id':
      return (c) => c.props[r'$id'];
    case 'accumulated':
      return (c) => c.accumulated;
    case 'feature-state':
      final name = args.isEmpty ? null : args.first;
      return (c) => c.state[name];
    case 'let':
      final scope = <String, Expr>{};
      for (var i = 0; i + 2 < args.length; i += 2) {
        scope['${args[i]}'] = compileExpr(args[i + 1]);
      }
      _scopes.add(scope);
      try {
        return args.isEmpty ? _constant(null) : compileExpr(args.last);
      } finally {
        _scopes.removeLast();
      }
    case 'var':
      for (final scope in _scopes.reversed) {
        final bound = scope[args.isEmpty ? '' : '${args.first}'];
        if (bound != null) return bound;
      }
      return _constant(null);
    case 'heatmap-density' || 'line-progress':
      return (c) => c.progress;
    case 'image':
      return arg(0);
    case 'is-supported-script':
      return _constant(true);
    case 'resolved-locale':
      return _constant('en');
    case 'within':
      final place = Place.of(args.isEmpty ? null : args.first);
      if (place == null) return _constant(false);
      return _byGeometry(geometryKey([op, ...args]), (c) {
        final points = c.lonLats?.call();
        return points != null &&
            c.geometryType != 'Polygon' &&
            place.holds(points);
      });
    case 'distance':
      final place = Place.of(args.isEmpty ? null : args.first);
      if (place == null) return _constant(null);
      return _byGeometry(geometryKey([op, ...args]), (c) {
        final points = c.lonLats?.call();
        return points == null
            ? null
            : place.distanceTo(points, joined: c.geometryType != 'Point');
      });
    case 'typeof':
      final a = arg(0);
      return (c) => switch (a(c)) {
        null => 'null',
        String() => 'string',
        num() => 'number',
        bool() => 'boolean',
        List() => 'array',
        Rgba() => 'color',
        _ => 'object',
      };
    case 'to-rgba':
      final a = arg(0);
      return (c) {
        final v = Rgba.of(a(c));
        return v == null ? null : [v.r * 255, v.g * 255, v.b * 255, v.a];
      };
    case 'slice':
      final input = arg(0), from = arg(1);
      final to = args.length > 2 ? arg(2) : null;
      return (c) {
        final v = input(c);
        final length = v is String
            ? v.length
            : v is List
            ? v.length
            : -1;
        if (length < 0) return null;
        int at(Object? raw, int fallback) {
          var i = asNumber(raw)?.toInt() ?? fallback;
          if (i < 0) i += length;
          return i.clamp(0, length);
        }

        final a = at(from(c), 0);
        final b = math.max(a, at(to?.call(c), length));
        return v is String ? v.substring(a, b) : (v! as List).sublist(a, b);
      };
    case 'index-of':
      final needle = arg(0), haystack = arg(1);
      final from = args.length > 2 ? arg(2) : null;
      return (c) {
        final h = haystack(c);
        final n = needle(c);
        final start = asNumber(from?.call(c))?.toInt() ?? 0;
        if (h is String && n is String) return h.indexOf(n, start);
        if (h is List) return h.indexOf(n, start);
        return -1;
      };
    case 'sin':
      return math1(math.sin);
    case 'cos':
      return math1(math.cos);
    case 'tan':
      return math1(math.tan);
    case 'asin':
      return math1(math.asin);
    case 'acos':
      return math1(math.acos);
    case 'atan':
      return math1(math.atan);
    case 'zoom':
      return (c) => c.zoom;
    case 'geometry-type':
      return (c) => c.geometryType;
    case '!':
      final a = arg(0);
      return (c) => !_truthy(a(c));
    case '==' || '!=' || '<' || '<=' || '>' || '>=' when _folds(args):
      final a = arg(0), b = arg(1);
      final same = op == '==' || op == '!=';
      return (c) {
        final x = _folded(a(c)), y = _folded(b(c));
        if (same) return (x == y) == (op == '==');
        return _compare(op, x, y);
      };
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
        space: switch (op) {
          'interpolate-hcl' => 'hcl',
          'interpolate-lab' => 'lab',
          _ => null,
        },
        base: kind.first == 'exponential' && kind.length > 1
            ? asNumber(kind[1]) ?? 1
            : 1,
        geometric: kind.first == 'geometric',
        bezier: kind.first == 'cubic-bezier' && kind.length > 4
            ? [for (var i = 1; i < 5; i++) (asNumber(kind[i]) ?? 0).toDouble()]
            : null,
      );
    case 'to-string':
      final a = arg(0);
      return (c) => asText(a(c));
    case 'number-format':
      final a = arg(0);
      final options = args.length > 1 && args[1] is Map
          ? args[1] as Map
          : const <Object?, Object?>{};
      final least = asNumber(options['min-fraction-digits'])?.toInt() ?? 0;
      final most = math.max(
        least,
        asNumber(options['max-fraction-digits'])?.toInt() ?? 3,
      );
      return (c) {
        final value = asNumber(a(c));
        if (value == null) return '';
        var text = value.toStringAsFixed(most);
        if (most > least && text.contains('.')) {
          final keep = text.indexOf('.') + least + (least == 0 ? 0 : 1);
          var end = text.length;
          while (end > keep && text[end - 1] == '0') {
            end--;
          }
          if (end > 0 && text[end - 1] == '.') end--;
          text = text.substring(0, end);
        }
        return text;
      };
    case 'split':
      final a = arg(0), by = arg(1);
      return (c) => asText(a(c)).split(asText(by(c)));
    case 'join':
      final a = arg(0), by = arg(1);
      return (c) => switch (a(c)) {
        final List<Object?> l => l.map(asText).join(asText(by(c))),
        _ => '',
      };
    case 'hsl' || 'hsla':
      final parts = all();
      return (c) {
        final v = [for (final p in parts) asNumber(p(c)) ?? 0];
        if (v.length < 3) return null;
        return Rgba.hsl(
          (v[0] % 360) / 360,
          (v[1] / 100).clamp(0, 1),
          (v[2] / 100).clamp(0, 1),
          v.length > 3 ? v[3].toDouble() : 1,
        );
      };
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
    case 'format':
      final runs = <(Expr, Map<String, Expr>, bool)>[];
      for (final a in args) {
        if (a is Map) {
          if (runs.isEmpty) continue;
          final (text, _, image) = runs.removeLast();
          runs.add((
            text,
            {
              for (final MapEntry(:key, :value) in a.entries)
                '$key': compileExpr(value),
            },
            image,
          ));
        } else {
          runs.add((
            compileExpr(a),
            const <String, Expr>{},
            a is List && a.isNotEmpty && a.first == 'image',
          ));
        }
      }
      return (c) => FormattedText([
        for (final (text, options, image) in runs)
          FormatSection(
            image ? '' : asText(text(c)),
            scale: (asNumber(options['font-scale']?.call(c)) ?? 1).toDouble(),
            fonts: switch (options['text-font']?.call(c)) {
              final List<Object?> names => [for (final n in names) '$n'],
              _ => null,
            },
            color: Rgba.of(options['text-color']?.call(c)),
            align: options['vertical-align']?.call(c) as String?,
          ),
      ]);
    case 'concat':
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
  List<double>? bezier,
  String? space,
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
      return _constant(fallback);
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
    space: json['colorSpace'] as String?,
  );
  if (property is! String) return curve;
  return (c) => c.props[property] == null ? fallback : curve(c);
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
  return _interpolate(
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
