// Runs MapLibre's expression conformance tests through vmap's evaluator and
// prints a report, scored as the style spec's own runner compares outputs.
//
//     STYLE_SPEC=<maplibre-style-spec checkout> \
//       flutter test --no-pub tool/expression_suite_test.dart
//
// The checkout only needs test/integration/expression. Tests that expect a
// compile error are counted apart: vmap does not type-check expressions.
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/format.dart';

void main() {
  final root = Platform.environment['STYLE_SPEC'];
  test('expression suite', () {
    final dir = Directory('$root/test/integration/expression/tests');
    final files =
        dir
            .listSync(recursive: true)
            .whereType<File>()
            .where((f) => f.path.endsWith('test.json'))
            .toList()
          ..sort((a, b) => a.path.compareTo(b.path));
    var passed = 0, failed = 0, compileErrors = 0, errorsOnly = 0;
    final failures = <String>[];
    final filter = Platform.environment['FILTER'] ?? '';
    for (final file in files) {
      final id = file.parent.path.substring(dir.path.length + 1);
      if (filter.isNotEmpty && !filter.split(',').any(id.startsWith)) {
        continue;
      }
      final fixture = jsonDecode(file.readAsStringSync()) as Map;
      final expected = fixture['expected'] as Map;
      if ((expected['compiled'] as Map)['result'] == 'error') {
        compileErrors++;
        continue;
      }
      final type = (expected['compiled'] as Map)['type'] as String;
      final outputs = expected['outputs'] as List;
      if (outputs.isNotEmpty && outputs.every(_isError)) {
        errorsOnly++;
        continue;
      }
      String? problem;
      try {
        final json = _resolveState(
          fixture['expression'],
          (fixture['globalState'] as Map?) ?? const {},
        );
        final expr = compileExpr(json);
        final inputs = (fixture['inputs'] as List?) ?? const [];
        final fallback = (fixture['propertySpec'] as Map?)?['default'];
        final actual = [
          for (final input in inputs)
            _evaluate(expr, input as List, type) ??
                (fallback == null ? null : _output(fallback, type)),
        ];
        for (var i = 0; i < outputs.length && problem == null; i++) {
          if (_isError(outputs[i])) continue;
          if (!_same(actual[i], outputs[i])) {
            problem =
                'input $i: expected ${jsonEncode(outputs[i])}, '
                'got ${_show(actual[i])}';
          }
        }
      } catch (e) {
        problem = 'threw $e';
      }
      if (problem == null) {
        passed++;
      } else {
        failed++;
        failures.add('$id\t$problem');
      }
    }
    final out = Platform.environment['OUT'];
    if (out != null) File(out).writeAsStringSync('${failures.join('\n')}\n');
    for (final f in failures) {
      // ignore: avoid_print
      print(f.length > 300 ? '${f.substring(0, 300)}...' : f);
    }
    // ignore: avoid_print
    print(
      'expression suite: $passed passed, $failed failed, '
      '$compileErrors expect a compile error, $errorsOnly expect only '
      'runtime errors',
    );
  }, skip: root == null ? 'set STYLE_SPEC' : false);
}

bool _isError(Object? v) => v is Map && v.containsKey('error');

Object? _evaluate(Expr expr, List input, String type) {
  final globals = input[0] as Map;
  final feature = input[1] as Map;
  final geometry = feature['geometry'] as Map?;
  final c = EvalContext()
    ..zoom = (globals['zoom'] as num?)?.toDouble() ?? 0
    ..progress =
        ((globals['heatmapDensity'] ?? globals['lineProgress']) as num?)
            ?.toDouble() ??
        0
    ..props = {
      ...?(feature['properties'] as Map?)?.cast<String, Object?>(),
      if (feature.containsKey('id')) r'$id': feature['id'],
    }
    ..state = (feature['featureState'] as Map?)?.cast<String, Object?>() ?? {}
    ..geometryType = _geometryType(geometry?['type'] as String?)
    ..lonLats = geometry == null
        ? null
        : () => _flatten(geometry, globals['canonicalID'] as Map?);
  return _output(expr(c), type);
}

Object? _output(Object? v, String type) {
  if (type == 'color') {
    final color = v is Rgba ? v : Rgba.of(v);
    if (color == null) return v;
    return [color.r * color.a, color.g * color.a, color.b * color.a, color.a];
  }
  return v;
}

String _geometryType(String? type) => switch (type) {
  'MultiPoint' => 'Point',
  'MultiLineString' => 'LineString',
  'MultiPolygon' => 'Polygon',
  _ => type ?? '',
};

// As tile data: snapped to the 8192 unit grid of the tile [canonical] names,
// one list per point set, line or ring.
List<List<double>> _flatten(Map geometry, Map? canonical) {
  final size = canonical == null
      ? 0
      : 8192 * math.pow(2, canonical['z'] as int).toDouble();
  List<double> part(Object? v) {
    final out = <double>[];
    void walk(Object? v) {
      if (v is List && v.length >= 2 && v.first is num) {
        var lon = (v[0] as num).toDouble(), lat = (v[1] as num).toDouble();
        if (size > 0) {
          final x = ((lon + 180) / 360 * size).roundToDouble();
          final y =
              ((180 -
                          180 /
                              math.pi *
                              math.log(
                                math.tan(math.pi / 4 + lat * math.pi / 360),
                              )) /
                      360 *
                      size)
                  .roundToDouble();
          lon = x / size * 360 - 180;
          lat =
              360 /
                  math.pi *
                  math.atan(math.exp((180 - y / size * 360) * math.pi / 180)) -
              90;
        }
        out
          ..add(lon)
          ..add(lat);
      } else if (v is List) {
        v.forEach(walk);
      }
    }

    walk(v);
    return out;
  }

  final c = geometry['coordinates'] as List;
  return switch (geometry['type']) {
    'Point' || 'MultiPoint' || 'LineString' => [part(c)],
    'MultiLineString' || 'Polygon' => [for (final l in c) part(l)],
    _ => [
      for (final p in c)
        for (final r in p as List) part(r),
    ],
  };
}

Object? _resolveState(Object? v, Map state) => switch (v) {
  ['global-state', final String name] => switch (state[name]) {
    final List<Object?> l => ['literal', l],
    final Map<Object?, Object?> m => ['literal', m],
    final other => other,
  },
  final List<Object?> l => [for (final e in l) _resolveState(e, state)],
  final Map<Object?, Object?> m => {
    for (final e in m.entries) e.key: _resolveState(e.value, state),
  },
  _ => v,
};

String _show(Object? v) {
  try {
    return jsonEncode(v);
  } catch (_) {
    return '$v';
  }
}

bool _same(Object? a, Object? b) {
  if (b is Map && b.length == 1 && b.containsKey('values')) {
    return _same(a, b['values']);
  }
  if (b is Map && b.containsKey('name') && b.containsKey('available')) {
    return a == b['name'];
  }
  if (b is Map && b.keys.toSet().containsAll(const ['r', 'g', 'b', 'a'])) {
    final color = a is Rgba ? a : Rgba.of(a);
    return color != null &&
        _same(
          [color.r * color.a, color.g * color.a, color.b * color.a, color.a],
          [b['r'], b['g'], b['b'], b['a']],
        );
  }
  if (b is Map && b.containsKey('sections')) {
    final sections = switch (a) {
      FormattedText(:final sections) => sections,
      String() => [FormatSection(a)],
      _ => null,
    };
    final want = b['sections'] as List;
    if (sections == null || sections.length != want.length) return false;
    for (var i = 0; i < want.length; i++) {
      final s = sections[i], w = want[i] as Map;
      if (s.text != w['text'] ||
          !_same(s.image, w['image']) ||
          s.scale != ((w['scale'] as num?)?.toDouble() ?? 1) ||
          s.align != w['verticalAlign'] ||
          (w['textColor'] == null) != (s.color == null) ||
          (s.color != null && !_same(s.color, w['textColor'])) ||
          (w['fontStack'] == null) != (s.fonts == null) ||
          (s.fonts != null && s.fonts!.join(',') != w['fontStack'])) {
        return false;
      }
    }
    return true;
  }
  if (a is num && b is num) return _close(a.toDouble(), b.toDouble());
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_same(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_same(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

bool _close(double a, double b) => a == b || _strip(a) == _strip(b);

// The style spec's json-diff: six significant figures, truncated twice.
double _strip(double x) {
  if (x == 0 || !x.isFinite) return x;
  final digits = (math.log(x.abs()) / math.ln10).ceil();
  final m = math.pow(10, math.max(0, 6 - digits)).toDouble();
  final once = (x * m).floorToDouble() / m;
  return (once * m).floorToDouble() / m;
}
