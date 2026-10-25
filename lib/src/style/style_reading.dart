import 'dart:convert';
import 'dart:typed_data';

import 'expr.dart';
import '../camera/mercator.dart';

/// [v] when it is a map, else an empty one: a style's part of the wrong
/// kind counts as left out, as MapLibre draws what it can of a style it
/// warns about.
Map<Object?, Object?> jsonMap(Object? v) => v is Map ? v : const {};

List<Object?> jsonList(Object? v) => v is List ? v : const [];

String? jsonString(Object? v) => v is String ? v : null;

int? jsonInt(Object? v) => switch (asNumber(v)) {
  final n? when n.isFinite => n.toInt(),
  _ => null,
};

/// [v] as JSON, for keys and the style's shape; a value JSON cannot write,
/// such as NaN, as its text.
String jsonText(Object? v) {
  try {
    return jsonEncode(v);
  } on JsonUnsupportedObjectError {
    return '$v';
  }
}

/// What every layer of a style document says the same way.
class LayerJson {
  LayerJson(Map<Object?, Object?> raw)
    : id = '${raw['id'] ?? ''}',
      type = raw['type'],
      raw = raw,
      paint = jsonMap(raw['paint']),
      layout = jsonMap(raw['layout']),
      // As MapLibre's isHidden, a minzoom of 0 bounds nothing, so the
      // layer shows below zoom 0 too.
      minZoom = switch (asNumber(raw['minzoom'])) {
        final num z when z > 0 => z.toDouble(),
        _ => -24,
      },
      maxZoom = asNumber(raw['maxzoom']) ?? 30;

  final String id;
  final Object? type;
  final Map<Object?, Object?> raw;
  final Map<Object?, Object?> paint;
  final Map<Object?, Object?> layout;
  final double minZoom;
  final double maxZoom;

  bool get hidden => layout['visibility'] == 'none';

  Expr? get translate => switch (paint['$type-translate']) {
    null => null,
    final moved => compileExpr(moved),
  };

  bool get translateOnScreen => paint['$type-translate-anchor'] == 'viewport';
}

/// A layer drawn from a vector or GeoJSON source.
class VectorLayerJson {
  VectorLayerJson(this.layer, this.source, this.sourceLayer)
    : filter = layer.raw['filter'];

  final LayerJson layer;
  final int source;
  final String sourceLayer;
  final Object? filter;
}

/// The feature properties the paint [properties] read.
Set<String> readsOf(Map<Object?, Object?> paint, List<String> properties) {
  final names = <String>{};
  for (final p in properties) {
    collectReads(paint[p], names);
  }
  return names;
}

bool readsState(Object? json) => switch (json) {
  ['feature-state', ...] => true,
  List() => json.any(readsState),
  _ => false,
};

/// Collects the feature properties an expression reads.
bool readsAny(Object? json) {
  final keys = <String>{};
  collectReads(json, keys);
  return keys.isNotEmpty;
}

void collectReads(Object? json, Set<String> into) {
  if (json is List) {
    if (json.length == 2 &&
        (json[0] == 'get' || json[0] == 'has') &&
        json[1] is String) {
      into.add(json[1] as String);
    }
    if (json.isNotEmpty && (json[0] == 'feature-state' || json[0] == 'id')) {
      into.add(r'$id');
    }
    if (json.isNotEmpty && (json[0] == 'within' || json[0] == 'distance')) {
      into.add(geometryKey(json));
    }
    for (final e in json) {
      collectReads(e, into);
    }
  } else if (json is Map) {
    final property = json['property'];
    if (property is String) into.add(property);
  }
}

Float64List? cornersOf(Object? json) {
  if (json is! List || json.length != 4) return null;
  final out = Float64List(8);
  for (var i = 0; i < 4; i++) {
    final at = json[i];
    if (at is! List || at.length < 2) return null;
    final lng = asNumber(at[0]), lat = asNumber(at[1]);
    if (lng == null || lat == null) return null;
    out[i * 2] = worldX(lng.toDouble());
    out[i * 2 + 1] = worldY(lat.toDouble());
  }
  return out;
}

/// A padding given as one to four numbers, as CSS gives them, for each
/// side: top, right, bottom, left. Null for any other.
List<double>? sidesOf(Object? json) {
  var list = json;
  if (list is List && list.length == 2 && list[0] == 'literal') {
    list = list[1];
  }
  if (list is! List || list.isEmpty || list.length > 4) return null;
  final v = [for (final n in list) asNumber(n)?.toDouble()];
  if (v.contains(null)) return null;
  final [t, ...] = v;
  return switch (v.length) {
    1 => [t!, t, t, t],
    2 => [t!, v[1]!, t, v[1]!],
    3 => [t!, v[1]!, v[2]!, v[1]!],
    _ => [t!, v[1]!, v[2]!, v[3]!],
  };
}

/// A property read from [json], or [fallback] when it is unset or comes
/// out null, as MapLibre falls back to a property's default.
Expr exprOr(Object? json, Object fallback) {
  final otherwise = compileExpr(fallback);
  if (json == null) return otherwise;
  final expr = compileExpr(json);
  if (fallback is String && Rgba.of(fallback) != null) {
    // As MapLibre: a colour that does not parse falls back to a legacy
    // function's default, then to the property's.
    final given = json is Map ? json['default'] : null;
    final second = Rgba.of(given) != null ? given : null;
    return (c) {
      final value = expr(c);
      if (Rgba.of(value) != null) return value;
      return second ?? otherwise(c);
    };
  }
  // As MapLibre's StyleExpression.evaluate, a number that is not one
  // falls back to the property's default.
  return (c) => switch (expr(c)) {
    null => otherwise(c),
    final double d when d.isNaN => otherwise(c),
    final value => value,
  };
}

Expr? exprOrNull(Object? json) => json == null ? null : compileExpr(json);

bool drawnByScreenY(Map<Object?, Object?> layout) {
  bool overlaps(String mode, String allow) => switch (layout[mode]) {
    final String m => m != 'never',
    _ => layout[allow] == true,
  };
  final order = layout['symbol-z-order'] ?? 'auto';
  final byKey = order != 'viewport-y' && layout['symbol-sort-key'] != null;
  return (order == 'viewport-y' || (order == 'auto' && !byKey)) &&
      (overlaps('text-overlap', 'text-allow-overlap') ||
          overlaps('icon-overlap', 'icon-allow-overlap') ||
          layout['text-ignore-placement'] == true ||
          layout['icon-ignore-placement'] == true);
}

/// `icon-overlap` or `text-overlap`, which as MapLibre's win over
/// `*-allow-overlap`: `never`, `always` or `cooperative`.
String overlapOf(Map<Object?, Object?> layout, String kind) =>
    switch (layout['$kind-overlap']) {
      final String mode => mode,
      _ => layout['$kind-allow-overlap'] == true ? 'always' : 'never',
    };

/// The anchors a symbol may take and, from `text-variable-anchor-offset`,
/// which wins over [anchors], the offset in ems of each.
(List<String>, List<(double, double)>?) anchorOffsetsOf(
  Object? withOffsets,
  Object? anchors,
) {
  var list = withOffsets;
  if (list case ['literal', final List<Object?> inner]) list = inner;
  if (list is List && list.length >= 2) {
    final names = <String>[];
    final offsets = <(double, double)>[];
    for (var i = 0; i + 1 < list.length; i += 2) {
      if (list[i] case final String name) {
        names.add(name);
        offsets.add(pairOf(list[i + 1]));
      }
    }
    if (names.isNotEmpty) return (names, offsets);
  }
  return (
    anchors is List ? anchors.whereType<String>().toList() : const [],
    null,
  );
}

bool isPair(Object? json) =>
    json == null ||
    (json is List && json.length == 2 && json.every((v) => v is num));

(double, double) pairOf(Object? json) {
  var list = json;
  if (list is List && list.length == 2 && list[0] == 'literal') {
    list = list[1];
  }
  if (list is! List || list.length != 2) return (0, 0);
  return (asNumber(list[0]) ?? 0, asNumber(list[1]) ?? 0);
}

/// A colour, or the list of colours a property taking one per light
/// may give; [fallback] when there is none.
List<Expr> coloursOf(Object? json, String fallback) {
  if (json is List &&
      json.isNotEmpty &&
      json.every((v) => v is String && Rgba.of(v) != null)) {
    return [for (final v in json) compileExpr(v)];
  }
  return [compileExpr(json ?? fallback)];
}

/// A number, or the list of numbers a property taking one per light may
/// give; [fallback] when there is none.
List<double> numbersOf(Object? json, double fallback) {
  final values = json is List ? json : [json];
  final out = [
    for (final v in values)
      if (asNumber(v) case final n?) n.toDouble(),
  ];
  return out.isEmpty ? [fallback] : out;
}

/// A `line-dasharray` that changes with the zoom, as legacy stops or a
/// `step` on the zoom; empty for any other.
List<(double, Float64List)> dashStopsOf(Object? json) {
  final pairs = <(Object?, Object?)>[];
  if (json case {'stops': final List<Object?> stops}
      when json['property'] == null) {
    for (final s in stops) {
      if (s case [final zoom, final value]) pairs.add((zoom, value));
    }
  } else if (json case ['step', ['zoom'], final first, ...final rest]) {
    pairs.add((double.negativeInfinity, first));
    for (var i = 0; i + 1 < rest.length; i += 2) {
      pairs.add((rest[i], rest[i + 1]));
    }
  } else {
    return const [];
  }
  final out = <(double, Float64List)>[];
  for (final (zoom, value) in pairs) {
    final z = zoom is double && zoom.isInfinite
        ? zoom
        : asNumber(zoom)?.toDouble();
    final d = dashOf(value);
    if (z == null || d == null) return const [];
    out.add((z, d));
  }
  return out;
}

/// The dash arrays written as literals in a dasharray [json], each once.
List<Float64List> dashLiteralsOf(Object? json) {
  final out = <Float64List>[];
  void visit(Object? node) {
    if (node is! List) return;
    if (node.length == 2 && node[0] == 'literal') {
      final d = dashOf(node);
      if (d != null && !out.any((o) => _same(o, d))) out.add(d);
      return;
    }
    for (final child in node) {
      visit(child);
    }
  }

  visit(json);
  return out;
}

bool _same(Float64List a, Float64List b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

Float64List? dashOf(Object? json) {
  var list = json;
  if (list is List && list.length == 2 && list[0] == 'literal') {
    list = list[1];
  }
  if (list is! List || list.length < 2) return null;
  // An odd count is kept as it is: as in MapLibre its last dash runs on
  // into the first, where SVG would repeat the list.
  final out = Float64List(list.length);
  var gaps = 0.0;
  for (var i = 0; i < out.length; i++) {
    final v = asNumber(list[i]);
    if (v == null || v < 0) return null;
    out[i] = v.toDouble();
    if (i.isOdd) gaps += v;
  }
  return gaps <= 0 ? null : out;
}

/// The names in a `text-font`: a list, or a list given as a literal.
List<String> fontStackOf(Object? value) {
  final list = switch (value) {
    ['literal', final List<Object?> names] => names,
    final List<Object?> names => names,
    _ => const <Object?>[],
  };
  return [
    for (final n in list)
      if (n is String) n,
  ];
}

int fontWeightOf(String font) {
  if (font.contains('black') || font.contains('heavy')) return 900;
  if (font.contains('extrabold') || font.contains('extra bold')) return 800;
  if (font.contains('semibold') ||
      font.contains('semi bold') ||
      font.contains('demi')) {
    return 600;
  }
  if (font.contains('bold')) return 700;
  if (font.contains('medium')) return 500;
  if (font.contains('light')) return 300;
  if (font.contains('thin')) return 100;
  return 400;
}
