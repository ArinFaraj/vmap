import 'dart:convert';

import 'builtin_style.dart';
import 'expr.dart';

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

abstract final class Tone {
  static const background = 0;
  static const residential = 1;
  static const commercial = 2;
  static const school = 3;
  static const hospital = 4;
  static const sand = 5;
  static const grass = 6;
  static const park = 7;
  static const wood = 8;
  static const pitch = 9;
  static const water = 10;
  static const aeroway = 11;
  static const pedestrian = 12;
  static const building = 13;
  static const casing = 14;
  static const road = 15;
  static const roadMajor = 16;
  static const trunk = 17;
  static const trunkCasing = 18;
  static const motorway = 19;
  static const motorwayCasing = 20;
  static const path = 21;
  static const rail = 22;
  static const boundary = 23;
  static const labelPrimary = 24;
  static const labelSecondary = 25;
  static const labelRoad = 26;
  static const labelWater = 27;
  static const halo = 28;
  static const labelMarker = 29;
  static const count = 30;
}

/// The colours of the built in style as 0xAARRGGBB, indexed by [Tone].
class VmapPalette {
  const VmapPalette(this.colors);

  final List<int> colors;

  /// Quiet surfaces and inks: paper land, white roads on hairline edges,
  /// teal greens, blue water and a soft gold for highways. Saturated blue is
  /// left for the app's own markers.
  static const light = VmapPalette([
    0xFFF4F6F8,
    0xFFF1F3F6,
    0xFFF0F1F6,
    0xFFF6F2E6,
    0xFFF8ECEE,
    0xFFF3EEDD,
    0xFFCFECDF,
    0xFFB6E4D1,
    0xFFA3DBC4,
    0xFF90D2B7,
    0xFFB9DFFA,
    0xFFE7EAEE,
    0xFFFAFBFC,
    0xFFE9ECF0,
    0xFFDADFE5,
    0xFFFFFFFF,
    0xFFFFFFFF,
    0xFFFFF4D6,
    0xFFEAD9A8,
    0xFFFFE9B0,
    0xFFE6C878,
    0xFFFFFFFF,
    0xFFCBD1D8,
    0xFFA9B1BC,
    0xFF4B515B,
    0xFF8C929C,
    0xFF7C828C,
    0xFF0A84CC,
    0xFFFFFFFF,
    0xFF0073BF,
  ]);

  static const dark = VmapPalette([
    0xFF121212,
    0xFF141414,
    0xFF151517,
    0xFF181713,
    0xFF191516,
    0xFF191812,
    0xFF142820,
    0xFF18352A,
    0xFF153026,
    0xFF1D4233,
    0xFF062E46,
    0xFF191919,
    0xFF171717,
    0xFF1B1B1C,
    0xFF080808,
    0xFF262626,
    0xFF303030,
    0xFF3A3526,
    0xFF080808,
    0xFF4A4128,
    0xFF080808,
    0xFF222222,
    0xFF323232,
    0xFF555A62,
    0xFFA9AEB7,
    0xFF6C717A,
    0xFF6E737C,
    0xFF3FA9EA,
    0xFF121212,
    0xFF58B9F5,
  ]);
}

/// Features of one source layer that pass one filter, built into one mesh.
/// Style layers that select the same features share it.
class Bucket {
  Bucket(this.sourceLayer, this.filter, this.isLine, this.caps);

  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final bool isLine;
  final bool caps;
  double minZoom = 30;
  double maxZoom = 0;
}

/// A fill or line layer of the style, in drawing order.
class PaintLayer {
  PaintLayer({
    required this.bucket,
    required this.isLine,
    required this.minZoom,
    required this.maxZoom,
    required this.color,
    required this.opacity,
    required this.width,
    required this.coverage,
  });

  final int bucket;
  final bool isLine;
  final double minZoom;
  final double maxZoom;
  final Expr color;
  final Expr opacity;

  /// Total stroke width in logical pixels. Null for fills.
  final Expr? width;

  /// The share of a dashed line that is drawn. Dashes are not cut into the
  /// mesh: the line is drawn whole at this opacity, which reads the same from
  /// a distance.
  final double coverage;
}

/// A text layer of the style.
class SymbolLayer {
  SymbolLayer({
    required this.sourceLayer,
    required this.filter,
    required this.minZoom,
    required this.maxZoom,
    required this.text,
    required this.placement,
    required this.size,
    required this.color,
    required this.opacity,
    required this.haloColor,
    required this.haloWidth,
    required this.weight,
    required this.italic,
    required this.uppercase,
    required this.letterSpacing,
    required this.maxWidth,
  });

  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final double minZoom;
  final double maxZoom;
  final Expr text;
  final Expr placement;
  final Expr size;
  final Expr color;
  final Expr opacity;
  final Expr haloColor;
  final Expr haloWidth;
  final int weight;
  final bool italic;
  final bool uppercase;

  /// In ems.
  final double letterSpacing;
  final double maxWidth;
}

/// A style document compiled for drawing.
class StyleSheet {
  StyleSheet._(
    this.background,
    this.buckets,
    this.layers,
    this.symbols,
    this.tileJsonUrl,
    this.tiles,
    this.maxZoom,
    this.zoomOffset,
    this.shape,
  );

  final Expr background;
  final List<Bucket> buckets;
  final List<PaintLayer> layers;
  final List<SymbolLayer> symbols;

  /// Where the vector tiles come from: a TileJSON address, or the tile
  /// address itself.
  final String? tileJsonUrl;
  final String? tiles;
  final int? maxZoom;
  final double zoomOffset;

  /// Equal for two styles whose tiles are built the same way, so a change of
  /// colours alone keeps the tiles already loaded.
  final String shape;

  static StyleSheet compile(
    Map<String, Object?> json, {
    List<String>? nameKeys,
    double zoomOffset = 0,
  }) {
    final sources = (json['sources'] as Map?) ?? const {};
    final rawLayers = (json['layers'] as List?) ?? const [];
    final uses = <Object?, int>{};
    for (final l in rawLayers) {
      if (l is Map && (sources[l['source']] as Map?)?['type'] == 'vector') {
        uses[l['source']] = (uses[l['source']] ?? 0) + 1;
      }
    }
    Object? sourceName;
    for (final e in uses.entries) {
      if (sourceName == null || e.value > uses[sourceName]!) sourceName = e.key;
    }
    final source = (sources[sourceName] as Map?) ?? const {};
    final tiles = source['tiles'];

    Expr background = (_) => null;
    final buckets = <Bucket>[];
    final bucketIndex = <String, int>{};
    final layers = <PaintLayer>[];
    final symbols = <SymbolLayer>[];
    final shape = StringBuffer('$zoomOffset');

    for (final raw in rawLayers) {
      if (raw is! Map) continue;
      final type = raw['type'];
      final paint = (raw['paint'] as Map?) ?? const {};
      final layout = (raw['layout'] as Map?) ?? const {};
      if (layout['visibility'] == 'none') continue;
      final minZoom = asNumber(raw['minzoom']) ?? 0;
      final maxZoom = asNumber(raw['maxzoom']) ?? 30;
      if (type == 'background') {
        final color = compileExpr(paint['background-color']);
        final opacity = compileExpr(paint['background-opacity'] ?? 1);
        background = (c) {
          final v = Rgba.of(color(c));
          final o = asNumber(opacity(c)) ?? 1;
          return v == null ? null : Rgba(v.r, v.g, v.b, v.a * o);
        };
        continue;
      }
      final sourceLayer = raw['source-layer'];
      if (raw['source'] != sourceName || sourceLayer is! String) continue;
      final filter = raw['filter'];

      if (type == 'symbol') {
        var field = layout['text-field'];
        if (field == null || field == '') continue;
        if (nameKeys != null && jsonEncode(field).contains('name')) {
          field = [
            'coalesce',
            for (final k in nameKeys) ['get', k],
          ];
        }
        final font = jsonEncode(layout['text-font'] ?? '').toLowerCase();
        final size = layout['text-size'] ?? 16;
        symbols.add(
          SymbolLayer(
            sourceLayer: sourceLayer,
            filter: compileFilter(filter),
            minZoom: minZoom,
            maxZoom: maxZoom,
            text: compileText(field),
            placement: compileExpr(layout['symbol-placement'] ?? 'point'),
            size: compileExpr(size),
            color: compileExpr(paint['text-color'] ?? '#000000'),
            opacity: compileExpr(paint['text-opacity'] ?? 1),
            haloColor: compileExpr(paint['text-halo-color']),
            haloWidth: compileExpr(paint['text-halo-width'] ?? 0),
            weight: _weight(font),
            italic: font.contains('italic') || font.contains('oblique'),
            uppercase: layout['text-transform'] == 'uppercase',
            letterSpacing: asNumber(layout['text-letter-spacing']) ?? 0,
            maxWidth: asNumber(layout['text-max-width']) ?? 10,
          ),
        );
        shape.write(
          jsonEncode(['s', sourceLayer, filter, field, minZoom, maxZoom]),
        );
        continue;
      }

      final isLine = type == 'line';
      if (!isLine && type != 'fill' && type != 'fill-extrusion') continue;
      if (paint['fill-pattern'] != null || paint['line-pattern'] != null) {
        continue;
      }
      final dash = paint['line-dasharray'];
      final caps = isLine && dash == null && layout['line-cap'] == 'round';
      final key = jsonEncode([isLine, sourceLayer, filter, caps]);
      final index = bucketIndex.putIfAbsent(key, () {
        buckets.add(Bucket(sourceLayer, compileFilter(filter), isLine, caps));
        return buckets.length - 1;
      });
      final bucket = buckets[index];
      if (minZoom < bucket.minZoom) bucket.minZoom = minZoom;
      if (maxZoom > bucket.maxZoom) bucket.maxZoom = maxZoom;
      shape.write(jsonEncode([key, minZoom, maxZoom]));

      final prefix = type as String;
      Expr? width;
      if (isLine) {
        final own = compileExpr(paint['line-width'] ?? 1);
        final gap = paint['line-gap-width'];
        if (gap == null) {
          width = own;
        } else {
          final between = compileExpr(gap);
          width = (c) =>
              (asNumber(own(c)) ?? 1) * 2 + (asNumber(between(c)) ?? 0);
        }
      }
      layers.add(
        PaintLayer(
          bucket: index,
          isLine: isLine,
          minZoom: minZoom,
          maxZoom: maxZoom,
          color: compileExpr(paint['$prefix-color'] ?? '#000000'),
          opacity: compileExpr(paint['$prefix-opacity'] ?? 1),
          width: width,
          coverage: _coverage(dash),
        ),
      );
    }

    return StyleSheet._(
      background,
      buckets,
      layers,
      symbols,
      source['url'] as String?,
      tiles is List && tiles.isNotEmpty ? tiles.first as String? : null,
      asNumber(source['maxzoom'])?.toInt(),
      zoomOffset,
      shape.toString(),
    );
  }

  static int _weight(String font) {
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

  static double _coverage(Object? dash) {
    if (dash is! List || dash.length < 2) return 1;
    var drawn = 0.0;
    var total = 0.0;
    for (var i = 0; i < dash.length; i++) {
      final v = asNumber(dash[i]) ?? 0;
      total += v;
      if (i.isEven) drawn += v;
    }
    return total <= 0 ? 1 : drawn / total;
  }
}
