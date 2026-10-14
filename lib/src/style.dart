import 'dart:convert';

import 'builtin_style.dart';
import 'palette.dart';

/// Which map style to draw: a MapLibre style document, or the style that
/// ships with the package.
class VmapStyle {
  /// A MapLibre style JSON at [url], for example
  /// `https://tiles.openfreemap.org/styles/liberty`.
  const VmapStyle.url(String this.url, {this.nameKeys, this.zoomOffset = 0})
    : json = null,
      palette = null,
      tileJsonUrl = null;

  /// A MapLibre style document already decoded from JSON.
  const VmapStyle.json(
    Map<String, Object?> this.json, {
    this.nameKeys,
    this.zoomOffset = 0,
  }) : url = null,
       palette = null,
       tileJsonUrl = null;

  /// The built in style in the colours of [palette], reading OpenMapTiles
  /// schema tiles from [tileJsonUrl].
  const VmapStyle.builtIn({
    VmapPalette this.palette = VmapPalette.light,
    this.nameKeys,
    this.tileJsonUrl = 'https://tiles.openfreemap.org/planet',
    this.zoomOffset = 0,
  }) : url = null,
       json = null;

  static const light = VmapStyle.builtIn();
  static const dark = VmapStyle.builtIn(palette: VmapPalette.dark);

  final String? url;
  final Map<String, Object?>? json;
  final VmapPalette? palette;
  final String? tileJsonUrl;

  /// Feature properties tried in order for every name on the map, for example
  /// `['name:en', 'name']`. Null keeps what the style asks for.
  final List<String>? nameKeys;

  /// Added to the zoom the style is read at. A style is drawn as MapLibre
  /// draws it for the same view; 1 reads it one level deeper, which is how
  /// vector_map_tiles draws a style.
  final double zoomOffset;

  /// The style document, when it does not have to be downloaded.
  Map<String, Object?>? get document =>
      json ??
      (palette == null
          ? null
          : builtInStyle(
              palette!,
              tileJsonUrl: tileJsonUrl!,
              nameKeys: nameKeys ?? const ['name'],
            ));

  @override
  bool operator ==(Object other) =>
      other is VmapStyle &&
      other.url == url &&
      identical(other.json, json) &&
      identical(other.palette, palette) &&
      other.tileJsonUrl == tileJsonUrl &&
      other.zoomOffset == zoomOffset &&
      (other.nameKeys ?? const []).join('|') ==
          (nameKeys ?? const []).join('|');

  @override
  int get hashCode => Object.hash(
    url,
    json,
    palette,
    tileJsonUrl,
    zoomOffset,
    nameKeys?.join('|'),
  );
}

/// Sources and layers of your own, drawn with the style: a route, a set of
/// points, an area. Both are written as a MapLibre style writes them.
///
/// A GeoJSON source is read again when its `data` is a different object, so
/// build a new document to change what is shown, and keep the overlay itself
/// between builds.
class VmapOverlay {
  const VmapOverlay({this.sources = const {}, this.layers = const []});

  /// By name, for example `{'route': {'type': 'geojson', 'data': {...}}}`.
  final Map<String, Object?> sources;

  /// Drawn above the style's layers, in order. A layer with a `before` entry
  /// naming a style layer is drawn just under that layer instead.
  final List<Map<String, Object?>> layers;

  /// [document] with these sources and layers added.
  Map<String, Object?> applyTo(Map<String, Object?> document) {
    if (sources.isEmpty && layers.isEmpty) return document;
    final merged = [...(document['layers'] as List?) ?? const <Object?>[]];
    for (final layer in layers) {
      final before = layer['before'];
      final at = before == null
          ? -1
          : merged.indexWhere((l) => l is Map && l['id'] == before);
      if (at < 0) {
        merged.add(layer);
      } else {
        merged.insert(at, layer);
      }
    }
    return {
      ...document,
      'sources': {...(document['sources'] as Map?) ?? const {}, ...sources},
      'layers': merged,
    };
  }
}

/// One change to a layer of the style, by the layer's id: what MapLibre's
/// `setPaintProperty`, `setLayoutProperty`, `setFilter` and
/// `setLayerZoomRange` do. It works on a style loaded by address as well as
/// one given as JSON, and on the layers of a [VmapOverlay].
///
/// A change of colour, width or opacity keeps the tiles already loaded. A
/// filter, a zoom range or a layout property builds them again.
class VmapStyleEdit {
  /// Sets paint property [name] of [layer]. A null [value] puts back the
  /// property's default.
  const VmapStyleEdit.paint(this.layer, String this.name, this.value)
    : _part = 'paint';

  /// Sets layout property [name] of [layer]. A null [value] puts back the
  /// property's default.
  const VmapStyleEdit.layout(this.layer, String this.name, this.value)
    : _part = 'layout';

  /// Shows or hides [layer].
  const VmapStyleEdit.visible(this.layer, bool visible)
    : _part = 'layout',
      name = 'visibility',
      value = visible ? 'visible' : 'none';

  /// Replaces the filter of [layer]. Null draws every feature.
  const VmapStyleEdit.filter(this.layer, this.value)
    : _part = 'filter',
      name = null;

  /// Draws [layer] from zoom [min] up to, but not at, zoom [max].
  VmapStyleEdit.zoomRange(this.layer, {double? min, double? max})
    : _part = 'zoom',
      name = null,
      value = [min, max];

  /// Sets the style's global state [name], which expressions read with
  /// `['global-state', name]`, over the default the style's `state` gives.
  const VmapStyleEdit.state(String this.name, this.value)
    : layer = '',
      _part = 'state';

  /// The `id` of the style layer changed, empty for a state edit.
  final String layer;
  final String? name;
  final Object? value;
  final String _part;

  /// [document] with every one of [edits] made, in order. An edit naming a
  /// layer the style does not have changes nothing.
  static Map<String, Object?> applyAll(
    List<VmapStyleEdit> edits,
    Map<String, Object?> document,
  ) {
    final state = {...?(document['state'] as Map?)?.cast<String, Object?>()};
    for (final edit in edits) {
      if (edit._part == 'state') state[edit.name!] = {'default': edit.value};
    }
    if (edits.isEmpty) return _resolveState(document, state);
    final layers = [...(document['layers'] as List?) ?? const <Object?>[]];
    final at = <String, int>{
      for (var i = 0; i < layers.length; i++)
        if (layers[i] case {'id': final String id}) id: i,
    };
    final copied = <int>{};
    for (final edit in edits) {
      if (edit._part == 'state') continue;
      final i = at[edit.layer];
      if (i == null) continue;
      if (copied.add(i)) layers[i] = {...layers[i]! as Map<String, Object?>};
      final layer = layers[i]! as Map<String, Object?>;
      switch (edit._part) {
        case 'filter':
          _set(layer, 'filter', edit.value);
        case 'zoom':
          final [min, max] = edit.value! as List<double?>;
          _set(layer, 'minzoom', min);
          _set(layer, 'maxzoom', max);
        default:
          final part = {...(layer[edit._part] as Map?) ?? const {}};
          _set(part, edit.name!, edit.value);
          layer[edit._part] = part;
      }
    }
    return _resolveState({...document, 'layers': layers}, state);
  }

  /// [document] with every `['global-state', name]` in its layers replaced
  /// by the value [state] gives that name, so the workers that compile the
  /// layers need no state of their own.
  static Map<String, Object?> _resolveState(
    Map<String, Object?> document,
    Map<String, Object?> state,
  ) {
    final layers = document['layers'];
    if (layers is! List || !jsonEncode(layers).contains('"global-state"')) {
      return document;
    }
    Object? walk(Object? v) => switch (v) {
      ['global-state', final String name] => switch ((state[name]
          as Map?)?['default']) {
        final List<Object?> l => ['literal', l],
        final Map<Object?, Object?> m => ['literal', m],
        final other => other,
      },
      List<Object?> l => [for (final x in l) walk(x)],
      Map<Object?, Object?> m => {
        for (final e in m.entries) e.key: walk(e.value),
      },
      _ => v,
    };
    return {
      ...document,
      'layers': [for (final l in layers) walk(l)],
    };
  }

  static void _set(Map<Object?, Object?> map, String key, Object? value) {
    if (value == null) {
      map.remove(key);
    } else {
      map[key] = value;
    }
  }

  /// Whether [a] and [b] make the same changes.
  static bool same(List<VmapStyleEdit> a, List<VmapStyleEdit> b) {
    if (identical(a, b)) return true;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      final x = a[i], y = b[i];
      if (identical(x, y)) continue;
      if (x.layer != y.layer ||
          x._part != y._part ||
          x.name != y.name ||
          jsonEncode(x.value) != jsonEncode(y.value)) {
        return false;
      }
    }
    return true;
  }
}
