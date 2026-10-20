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
String _jsText(Object? v) => v is bool
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
String _typeName(Object? v) {
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
        final t = _typeName(e);
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
  'accumulated', 'to-rgba', 'hsl', 'hsla', 'split', 'join', 'semiliteral',
  r'$images',
  r'$transition',
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
  if (json is! List || json.isEmpty) return _constant(json != false);
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
        _ => (c) => _compare(op as String, key(c, name), value),
      };
  }
  return compileExpr(json);
}

/// What a `collator` expression gives: how text compares, as MapLibre's
/// `Intl.Collator` for searching, with the root locale's ordering.
class _Collator {
  const _Collator(this.caseSensitive, this.diacriticSensitive, this.locale);

  final bool caseSensitive;
  final bool diacriticSensitive;
  final String? locale;

  int compare(String a, String b) {
    final lowerA = a.toLowerCase(), lowerB = b.toLowerCase();
    var order = _withoutMarks(lowerA).compareTo(_withoutMarks(lowerB));
    if (order == 0 && diacriticSensitive) order = lowerA.compareTo(lowerB);
    if (order == 0 && caseSensitive) {
      // Lower case sorts before upper case at the same letter.
      final ra = a.runes.toList(), rb = b.runes.toList();
      for (var i = 0; order == 0 && i < ra.length && i < rb.length; i++) {
        order = _upper(ra[i]).compareTo(_upper(rb[i]));
      }
    }
    return order.sign;
  }

  static int _upper(int rune) {
    final s = String.fromCharCode(rune);
    return s == s.toLowerCase() ? 0 : 1;
  }
}

/// The Latin letters with marks, under the letter they are drawn from.
const _marked = {
  'a': '\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u0101\u0103\u0105',
  'c': '\u00e7\u0107\u0109\u010b\u010d',
  'd': '\u010f\u0111',
  'e': '\u00e8\u00e9\u00ea\u00eb\u0113\u0115\u0117\u0119\u011b',
  'g': '\u011d\u011f\u0121\u0123',
  'h': '\u0125\u0127',
  'i': '\u00ec\u00ed\u00ee\u00ef\u0129\u012b\u012d\u012f\u0131',
  'j': '\u0135',
  'k': '\u0137',
  'l': '\u013a\u013c\u013e\u0140\u0142',
  'n': '\u00f1\u0144\u0146\u0148\u0149',
  'o': '\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u014d\u014f\u0151',
  'r': '\u0155\u0157\u0159',
  's': '\u015b\u015d\u015f\u0161',
  't': '\u0163\u0165\u0167',
  'u': '\u00f9\u00fa\u00fb\u00fc\u0169\u016b\u016d\u016f\u0171\u0173',
  'w': '\u0175',
  'y': '\u00fd\u00ff\u0177',
  'z': '\u017a\u017c\u017e',
};

final Map<int, int> _baseLetters = {
  for (final MapEntry(:key, :value) in _marked.entries)
    for (final r in value.runes) r: key.codeUnitAt(0),
};

String _withoutMarks(String s) =>
    String.fromCharCodes(s.runes.map((r) => _baseLetters[r] ?? r));

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
      if (name is String) return (c) => c.state[name];
      final inner = arg(0);
      return (c) => c.state[inner(c)];
    case r'$transition':
      // From one value to another over a span of the engine's clock, eased
      // as MapLibre eases a paint property's transition.
      final from = arg(0), to = arg(1);
      final start = asNumber(args.elementAtOrNull(2)) ?? 0;
      final duration = asNumber(args.elementAtOrNull(3)) ?? 0;
      final delay = asNumber(args.elementAtOrNull(4)) ?? 0;
      return (c) {
        final t = duration <= 0
            ? 1.0
            : ((c.nowMs - start - delay) / duration).clamp(0.0, 1.0);
        if (t >= 1) return to(c);
        return _blend(from(c), to(c), _easeCubicInOut(t));
      };
    case r'$images':
      final parts = all();
      return (c) =>
          [for (final p in parts) asText(p(c))]
              .where((n) => n.isNotEmpty)
              .join(imageChoice);
    case 'semiliteral':
      final value = args.isEmpty ? null : args.first;
      if (value is! List) return _constant(value);
      final items = [for (final v in value) compileExpr(v)];
      return (c) => [for (final i in items) i(c)];
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
      final collator = arg(0);
      return (c) => switch (collator(c)) {
        _Collator(:final String locale) => locale,
        _ => 'en',
      };
    case 'within':
      final place = Place.of(args.isEmpty ? null : args.first);
      if (place == null) return _constant(false);
      return _byGeometry(geometryKey([op, ...args]), (c) {
        final points = c.lonLats?.call();
        return points != null &&
            c.geometryType != 'Polygon' &&
            place.holds(points, line: c.geometryType == 'LineString');
      });
    case 'distance':
      final place = Place.of(args.isEmpty ? null : args.first);
      if (place == null) return _constant(null);
      return _byGeometry(geometryKey([op, ...args]), (c) {
        final points = c.lonLats?.call();
        return points == null
            ? null
            : place.distanceTo(points, shape: c.geometryType);
      });
    case 'typeof':
      final a = arg(0);
      return (c) => _typeName(a(c));
    case 'to-rgba':
      final a = arg(0);
      return (c) {
        final v = _color(a(c));
        return v == null ? null : [v.r * 255, v.g * 255, v.b * 255, v.a];
      };
    case 'slice':
      final input = arg(0), from = arg(1);
      final to = args.length > 2 ? arg(2) : null;
      return (c) {
        final raw = input(c);
        final v = raw is String ? raw.runes.toList() : raw;
        if (v is! List) return null;
        final length = v.length;
        int at(Object? raw, int fallback) {
          var i = asNumber(raw)?.toInt() ?? fallback;
          if (i < 0) i += length;
          return i.clamp(0, length);
        }

        final a = at(from(c), 0);
        final b = math.max(a, at(to?.call(c), length));
        final part = v.sublist(a, b);
        return raw is String ? String.fromCharCodes(part.cast<int>()) : part;
      };
    case 'index-of':
      final needle = arg(0), haystack = arg(1);
      final fromIndex = args.length > 2 ? arg(2) : null;
      return (c) {
        final h = haystack(c);
        final n = needle(c);
        final start = math.max(0, asNumber(fromIndex?.call(c))?.toInt() ?? 0);
        if (h is String) {
          final runes = h.runes.toList();
          final units = String.fromCharCodes(runes.take(start)).length;
          final i = h.indexOf(_jsText(n), units);
          return i < 0 ? -1 : h.substring(0, i).runes.length;
        }
        if (h is List) {
          var from = asNumber(fromIndex?.call(c))?.toInt() ?? 0;
          if (from < 0) from = math.max(0, from + h.length);
          return from >= h.length ? -1 : h.indexOf(n, from);
        }
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
    case '==' || '!=' || '<' || '<=' || '>' || '>=' when args.length > 2:
      final a = arg(0), b = arg(1), collator = arg(2);
      return (c) {
        final x = a(c), y = b(c);
        final k = collator(c);
        if (x is String && y is String && k is _Collator) {
          final order = k.compare(x, y);
          return switch (op) {
            '==' => order == 0,
            '!=' => order != 0,
            '<' => order < 0,
            '<=' => order <= 0,
            '>' => order > 0,
            _ => order >= 0,
          };
        }
        return switch (op) {
          '==' => x == y,
          '!=' => x != y,
          _ => _compare(op, x, y),
        };
      };
    case 'collator':
      final options = args.isNotEmpty && args.first is Map
          ? args.first! as Map
          : const <Object?, Object?>{};
      final caseSensitive = compileExpr(options['case-sensitive']);
      final diacriticSensitive = compileExpr(options['diacritic-sensitive']);
      final locale = compileExpr(options['locale']);
      return (c) => _Collator(
        caseSensitive(c) == true,
        diacriticSensitive(c) == true,
        switch (locale(c)) {
          final String l => l,
          _ => null,
        },
      );
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
      return (c) => switch (a(c)) {
        final Rgba v =>
          'rgba(${(v.r * 255).round()},${(v.g * 255).round()},'
              '${(v.b * 255).round()},${asText(v.a)})',
        final List<Object?> v => jsonEncode(v),
        final Map<Object?, Object?> v => jsonEncode(v),
        final v => _jsText(v) == 'null' ? '' : _jsText(v),
      };
    case 'number-format':
      final a = arg(0);
      final options = args.length > 1 && args[1] is Map
          ? args[1] as Map
          : const <Object?, Object?>{};
      final least = compileExpr(options['min-fraction-digits']);
      final most = compileExpr(options['max-fraction-digits']);
      return (c) {
        final value = asNumber(a(c));
        if (value == null) return '';
        final min = asNumber(least(c))?.toInt() ?? 0;
        return _grouped(
          value,
          min,
          math.max(min, asNumber(most(c))?.toInt() ?? 3),
        );
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
    case 'to-number':
      final parts = all();
      return (c) {
        for (final p in parts) {
          final raw = p(c);
          if (raw == null || (raw is String && raw.trim().isEmpty)) return 0.0;
          final v = asNumber(raw);
          if (v != null && !v.isNaN) return v;
        }
        return null;
      };
    case 'number' || 'string' || 'boolean' || 'object':
      final parts = all();
      return (c) {
        for (final p in parts) {
          final v = p(c);
          if (switch (op) {
            'number' => v is num,
            'string' => v is String,
            'boolean' => v is bool,
            _ => v is Map,
          }) {
            return v;
          }
        }
        return null;
      };
    case 'to-boolean':
      final a = arg(0);
      return (c) => _truthy(a(c));
    case 'to-color':
      final parts = all();
      return (c) {
        for (final p in parts) {
          final v = _color(p(c));
          if (v != null) return v;
        }
        return null;
      };
    case 'array':
      final item = args.length > 1 && args.first is String
          ? args.first! as String
          : null;
      final length = args.length > 2 ? asNumber(args[1])?.toInt() : null;
      final value = args.isEmpty ? _constant(null) : compileExpr(args.last);
      return (c) {
        final v = value(c);
        if (v is! List) return null;
        if (length != null && v.length != length) return null;
        if (item != null &&
            item != 'value' &&
            !v.every((e) => _typeName(e) == item)) {
          return null;
        }
        return v;
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
            image: image ? asText(text(c)) : null,
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
        double? acc = switch (op) {
          _ when parts.isNotEmpty => null,
          '+' => 0,
          '*' => 1,
          'min' => double.infinity,
          _ => double.negativeInfinity,
        };
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
            ? v.runes.length
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
        if (h is String)
          return n != null && h.contains(_jsText(n)) && h.isNotEmpty;
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

/// [value] in English digits grouped by thousands, with [least] to [most]
/// decimals, as `Intl.NumberFormat` writes it for `number-format`.
String _grouped(double value, int least, int most) {
  if (!value.isFinite) return value.isNaN ? 'NaN' : (value < 0 ? '-∞' : '∞');
  final shortest = value.abs().toString();
  final dot = shortest.indexOf('.');
  var text = !shortest.contains('e') && shortest.length - dot - 1 <= most
      ? shortest
      : value.abs().toStringAsFixed(math.min(most, 20));
  var (whole, fraction) = text.contains('.')
      ? (
          text.substring(0, text.indexOf('.')),
          text.substring(text.indexOf('.') + 1),
        )
      : (text, '');
  while (fraction.length > least && fraction.endsWith('0')) {
    fraction = fraction.substring(0, fraction.length - 1);
  }
  fraction = fraction.padRight(least, '0');
  final groups = StringBuffer();
  for (var i = 0; i < whole.length; i++) {
    if (i > 0 && (whole.length - i) % 3 == 0) groups.write(',');
    groups.write(whole[i]);
  }
  text = fraction.isEmpty ? '$groups' : '$groups.$fraction';
  return value < 0 && text.contains(RegExp('[1-9]')) ? '-$text' : text;
}

double _easeCubicInOut(double t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  final t2 = t * t, t3 = t2 * t;
  return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75);
}

/// [a] to [b] by [t]: numbers, colours and lists of numbers in between,
/// anything else [a] until the end.
Object? _blend(Object? a, Object? b, double t) {
  if (a is num && b is num) return a + (b - a) * t;
  if (a is List && b is List && a.length == b.length) {
    return [for (var i = 0; i < a.length; i++) _blend(a[i], b[i], t)];
  }
  final ca = Rgba.of(a), cb = Rgba.of(b);
  if (ca != null && cb != null) return Rgba.lerp(ca, cb, t);
  return t < 1 ? a : b;
}

/// [v] as a colour, as `to-color` reads one: a CSS colour or three or four
/// channels, red, green and blue out of 255 and alpha out of 1.
Rgba? _color(Object? v) {
  if (v is List &&
      (v.length == 3 || v.length == 4) &&
      v.every((e) => e is num)) {
    final n = [for (final e in v) (e as num).toDouble()];
    if (n.take(3).any((e) => e < 0 || e > 255)) return null;
    final a = n.length > 3 ? n[3] : 1.0;
    if (a < 0 || a > 1) return null;
    return Rgba(n[0] / 255, n[1] / 255, n[2] / 255, a);
  }
  return Rgba.of(v);
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
      final v = input(c);
      if (v is! num) return fallback;
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
