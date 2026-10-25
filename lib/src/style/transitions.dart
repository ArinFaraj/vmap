import 'json_equals.dart';
import 'expr.dart';
import 'paint_defaults.dart';

/// Paint properties on their way from one value to another after a style
/// changed, as MapLibre animates a changed paint property.
class PaintTransitions {
  /// The document last applied, before its transitions were written in.
  Map<String, Object?>? _applied;

  /// By layer id and property name.
  final Map<String, _Transition> _transitions = {};

  bool get isEmpty => _transitions.isEmpty;
  bool get isNotEmpty => _transitions.isNotEmpty;

  /// Whether one of them is in a layer of [layers].
  bool touches(Set<String> layers) =>
      _transitions.values.any((t) => layers.contains(t.layer));

  /// Whether all of them have finished at [nowMs].
  bool allOver(double nowMs) => _transitions.values.every((t) => t.over(nowMs));

  void clear() => _transitions.clear();

  /// [document] with each paint property that changed since the last
  /// document passing from its old value to its new one, from [now] in
  /// milliseconds, over its `-transition` or the style's `transition`, 300
  /// ms by default.
  Map<String, Object?> apply(Map<String, Object?> document, double now) {
    final before = _applied;
    _applied = document;
    _transitions.removeWhere((_, t) => t.over(now));
    if (before != null) {
      final old = {
        for (final l in (before['layers'] as List?) ?? const [])
          if (l is Map) '${l['id']}': l,
      };
      final style = document['transition'];
      for (final l in (document['layers'] as List?) ?? const []) {
        if (l is! Map) continue;
        final id = '${l['id']}';
        final was = old[id];
        if (was == null) continue;
        final paint = l['paint'] is Map ? l['paint'] as Map : const {};
        final prior = was['paint'] is Map ? was['paint'] as Map : const {};
        for (final key in {...paint.keys, ...prior.keys}) {
          if ('$key'.endsWith('-transition')) continue;
          final a = prior[key] ?? paintDefaults[key];
          final b = paint[key] ?? paintDefaults[key];
          if (a == null || b == null || jsonEquals(a, b)) continue;
          final own = paint['$key-transition'];
          double timing(String name, double fallback) =>
              asNumber(own is Map ? own[name] : null) ??
              asNumber(style is Map ? style[name] : null) ??
              fallback;
          final duration = timing('duration', 300);
          final delay = timing('delay', 0);
          if (duration <= 0 && delay <= 0) continue;
          _transitions['$id\u0000$key'] = _Transition(
            id,
            '$key',
            a,
            b,
            now,
            duration,
            delay,
          );
        }
      }
    }
    if (_transitions.isEmpty) return document;
    return {
      ...document,
      'layers': [
        for (final l in (document['layers'] as List?) ?? const [])
          if (l is Map &&
              _transitions.values.any((t) => t.layer == '${l['id']}'))
            {
              ...l,
              'paint': {
                ...?(l['paint'] as Map?),
                for (final t in _transitions.values)
                  if (t.layer == '${l['id']}') t.key: t.expression,
              },
            }
          else
            l,
      ],
    };
  }
}

/// A paint property passing from one value to another.
class _Transition {
  _Transition(
    this.layer,
    this.key,
    this.from,
    this.to,
    this.startMs,
    this.duration,
    this.delay,
  );

  final String layer, key;
  final Object? from, to;
  final double startMs, duration, delay;

  bool over(double nowMs) => nowMs >= startMs + delay + duration;

  /// The property's value as an expression of the frame's time.
  List<Object?> get expression => [
    r'$transition',
    _quoted(from),
    _quoted(to),
    startMs,
    duration,
    delay,
  ];

  /// [v] as an expression: a list that is not one is a literal.
  static Object? _quoted(Object? v) =>
      v is List && (v.isEmpty || v.first is! String) ||
          v is Map && !_isFunction(v)
      ? ['literal', v]
      : v;

  static bool _isFunction(Map<Object?, Object?> v) =>
      v.containsKey('stops') || v.containsKey('property');
}
