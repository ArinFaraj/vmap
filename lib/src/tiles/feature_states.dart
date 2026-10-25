import '../style/style_model.dart' show featureStateKey;
import 'query.dart';

/// The state the app gave single features, by source name and then by the
/// [featureStateKey] of the feature's id.
class FeatureStates {
  final Map<String, Map<Object, Map<String, Object?>>> _bySource = {};

  /// The states of [source]'s features.
  Map<Object, Map<String, Object?>>? of(String source) => _bySource[source];

  /// The state of feature [id] of [source], or null.
  Map<String, Object?>? at(String source, Object? id) =>
      _bySource[source]?[featureStateKey(id)];

  /// [source]'s states as the tile workers take them.
  List<(Object?, Map<String, Object?>)> pairs(String source) => [
    for (final MapEntry(:key, :value) in _bySource[source]?.entries ?? const [])
      (key, value),
  ];

  /// Holds [states] in place of the ones before, and returns the names of
  /// the sources whose states changed.
  Set<String> replace(List<VmapFeatureState> states) {
    if (states.isEmpty && _bySource.isEmpty) return const {};
    final before = Map.of(_bySource);
    _bySource.clear();
    for (final s in states) {
      final id = s.id;
      if (id == null) continue;
      (_bySource[s.source] ??= {})[featureStateKey(id)] = s.state;
    }
    return {
      for (final name in {...before.keys, ..._bySource.keys})
        if (!_same(before[name], _bySource[name])) name,
    };
  }

  static bool _same(
    Map<Object, Map<String, Object?>>? a,
    Map<Object, Map<String, Object?>>? b,
  ) {
    if ((a?.length ?? 0) != (b?.length ?? 0)) return false;
    for (final MapEntry(:key, :value) in a?.entries ?? const []) {
      final other = b![key];
      if (other == null || other.length != value.length) return false;
      for (final MapEntry(key: name, value: v) in value.entries) {
        if (other[name] != v || !other.containsKey(name)) return false;
      }
    }
    return true;
  }
}
