import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'builtin_style.dart';
import 'cluster.dart';
import 'expr.dart';
import 'tessellate.dart';

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

enum BucketKind { fill, line, circle }

/// Features of one source layer that pass one filter, built into one mesh.
/// Style layers that select the same features share it.
class Bucket {
  Bucket(
    this.source,
    this.sourceLayer,
    this.filter,
    this.kind, {
    this.caps = false,
    this.dashed = false,
    this.outline = false,
    this.offset = false,
    this.join = LineJoin.miter,
    this.variantKeys = const [],
  });

  /// Index into the style's sources.
  final int source;
  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final BucketKind kind;
  final bool caps;

  /// Keeps each vertex's distance along its line, which dashes are drawn by.
  final bool dashed;

  /// The edges of polygons only, a pixel wide, so corners need no rounding.
  final bool outline;

  /// Keeps what each vertex needs to draw the line beside its centre line.
  final bool offset;
  final LineJoin join;

  /// The feature properties the paint of its layers reads. Features are
  /// split into one mesh per combination of their values.
  final List<String> variantKeys;
  double minZoom = 30;
  double maxZoom = 0;

  bool get isLine => kind == BucketKind.line;
}

/// A fill, line or circle layer of the style, in drawing order.
class PaintLayer {
  PaintLayer({
    required this.id,
    required this.bucket,
    required this.kind,
    required this.minZoom,
    required this.maxZoom,
    required this.color,
    required this.opacity,
    this.width,
    this.offset,
    this.dash,
    this.pattern,
    this.strokeColor,
    this.strokeWidth,
    this.strokeOpacity,
    this.heat,
    this.translate,
    this.perFeature = false,
  });

  /// The layer's name in the style.
  final String id;
  final int bucket;
  final BucketKind kind;
  final double minZoom;
  final double maxZoom;
  final Expr color;
  final Expr opacity;

  /// A line's total width or a circle's diameter, in logical pixels.
  final Expr? width;

  /// How far to the right of its centre line a line is drawn, in logical
  /// pixels.
  final Expr? offset;

  /// Lengths of dashes and gaps in turn, in line widths.
  final Float64List? dash;

  /// The name of the sprite image that fills the shape, or that is repeated
  /// along the line.
  final Expr? pattern;

  /// The ring around a circle.
  final Expr? strokeColor;
  final Expr? strokeWidth;
  final Expr? strokeOpacity;

  /// Set for a heatmap layer, whose points are drawn as glows that add up.
  final HeatPaint? heat;

  /// How far the layer is drawn from its place, as x and y in logical
  /// pixels.
  final Expr? translate;

  /// The paint reads feature properties, so it is worked out per mesh.
  final bool perFeature;

  /// Circles and glows reach past the edge of their tile, so they are drawn
  /// unclipped and in a run of their own, after everything under them in
  /// every tile.
  bool get spills => kind == BucketKind.circle;

  bool get isLine => kind == BucketKind.line;
}

/// How a heatmap layer turns its points into colour.
class HeatPaint {
  HeatPaint({
    required this.weight,
    required this.intensity,
    required this.ramp,
    required this.stops,
  });

  /// Reads a layer's `heatmap-color`.
  factory HeatPaint.of({
    required Expr weight,
    required Expr intensity,
    required Object? color,
  }) {
    final json = color ?? _defaultRamp;
    final stops = <double>[];
    if (json is List &&
        json.length > 4 &&
        json[0] == 'interpolate' &&
        jsonEncode(json[1]) == '["linear"]' &&
        jsonEncode(json[2]) == '["heatmap-density"]') {
      for (var i = 3; i + 1 < json.length; i += 2) {
        final at = asNumber(json[i]);
        if (at != null) stops.add(at.toDouble().clamp(0.0, 1.0));
      }
    }
    if (stops.length < 2) {
      stops
        ..clear()
        ..addAll([for (var i = 0; i <= 8; i++) i / 8]);
    }
    return HeatPaint(
      weight: weight,
      intensity: intensity,
      ramp: compileExpr(json),
      stops: stops,
    );
  }

  static const _defaultRamp = [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(0,0,255,0)',
    0.3,
    'royalblue',
    0.6,
    'lime',
    1,
    'red',
  ];

  /// How much one point adds, which may read the point's properties.
  final Expr weight;
  final Expr intensity;

  /// The colour for a density from 0 to 1, read through `heatmap-density`.
  final Expr ramp;

  /// The densities between which the ramp is drawn as straight blends: its
  /// own stops when it is a plain linear ramp, an even ladder otherwise.
  final List<double> stops;
}

/// A text and icon layer of the style.
class SymbolLayer {
  SymbolLayer({
    required this.id,
    required this.source,
    required this.sourceLayer,
    required this.filter,
    required this.minZoom,
    required this.maxZoom,
    required this.text,
    required this.icon,
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
    required this.haloBlur,
    this.lineHeight,
    this.justify = ui.TextAlign.center,
    this.textPadding,
    this.iconPadding,
    this.textIgnored = false,
    this.iconIgnored = false,
    required this.maxWidth,
    required this.iconSize,
    required this.iconOpacity,
    required this.iconColor,
    required this.iconRotate,
    required this.textRotate,
    required this.anchor,
    required this.offsetX,
    required this.offsetY,
    required this.textOptional,
    required this.iconOptional,
    required this.iconOverlaps,
    required this.textOverlaps,
    required this.spacing,
    required this.textUpright,
    required this.iconUpright,
    required this.textFit,
    this.anchors = const [],
    this.radialOffset = 0,
    this.iconAnchor = 'center',
    this.iconOffsetX = 0,
    this.iconOffsetY = 0,
    this.sortKey,
    this.paintKeys = const [],
  });

  final String id;

  /// Index into the style's sources.
  final int source;
  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final double minZoom;
  final double maxZoom;
  final Expr text;

  /// The name of the sprite image, or null when the layer has none.
  final Expr? icon;
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

  /// The height of a line of text in ems. Null for the package's own.
  final double? lineHeight;

  /// The side the lines of a text of several lines are flush on.
  final ui.TextAlign justify;

  /// Clear space kept around the text and the icon where labels are
  /// weighed against each other, in logical pixels. Null for the package's
  /// own.
  final double? textPadding;
  final double? iconPadding;

  /// The text or icon takes no room from the labels placed after it.
  final bool textIgnored;
  final bool iconIgnored;

  /// How far the edge of the halo fades out, in logical pixels.
  final Expr haloBlur;
  final double maxWidth;
  final Expr iconSize;
  final Expr iconOpacity;

  /// The colour of an icon that takes one.
  final Expr iconColor;

  /// In degrees.
  final double iconRotate;

  /// Degrees a point's text is turned clockwise.
  final double textRotate;

  /// Which part of the text sits on the anchor point: `center`, `top`,
  /// `bottom-left` and so on.
  final String anchor;

  /// How far the text is moved from the anchor, in ems.
  final double offsetX;
  final double offsetY;

  /// `text-variable-anchor`: the anchors tried in turn until the text fits.
  /// Empty when the text has the one [anchor].
  final List<String> anchors;

  /// `text-radial-offset`: how far the text sits from its point whichever
  /// way it lies, in ems.
  final double radialOffset;

  /// Which part of the icon sits on the point.
  final String iconAnchor;

  /// How far the icon is moved, in pixels at an icon size of 1.
  final double iconOffsetX;
  final double iconOffsetY;

  /// `symbol-sort-key`: of two labels in this layer wanting the same room,
  /// the one with the lower number gets it.
  final Expr? sortKey;

  /// The feature properties the layer's colours, opacities and sizes read.
  /// Each label carries its feature's values of them.
  final List<String> paintKeys;

  /// The icon may show without its text, or the text without its icon.
  final bool textOptional;
  final bool iconOptional;
  final bool iconOverlaps;
  final bool textOverlaps;

  /// Distance between repeats along a line, in logical pixels.
  final double spacing;

  /// Along a line the text or icon stays upright instead of turning with it.
  final bool textUpright;
  final bool iconUpright;

  /// The icon is stretched to sit behind the text.
  final bool textFit;
}

/// Where features come from: vector tiles, or GeoJSON cut into tiles here.
class VectorSource {
  VectorSource({
    required this.name,
    required this.geoJson,
    required this.tileJsonUrl,
    required this.tiles,
    required this.maxZoom,
    required this.data,
    required this.signature,
    this.cluster,
    this.promoteId,
    this.generateId = false,
  });

  final String name;
  final bool geoJson;

  /// A TileJSON address, or the tile address itself.
  final String? tileJsonUrl;
  final String? tiles;
  final int? maxZoom;

  /// A GeoJSON document, or the address of one.
  final Object? data;

  /// Set when a GeoJSON source asks for its points to be clustered.
  final ClusterOptions? cluster;

  /// The source's `promoteId`: the property used as a feature's id, as one
  /// name or as a name per source layer.
  final Object? promoteId;

  /// A GeoJSON source numbers its features in order, as `generateId` asks.
  final bool generateId;

  /// The property that is the id of the features in [sourceLayer], or null
  /// when they keep the id they come with.
  String? idKey(String sourceLayer) => switch (promoteId) {
    final String name => name,
    final Map<Object?, Object?> names => names[sourceLayer] as String?,
    _ => null,
  };

  /// Equal for two sources that give the same tiles.
  final String signature;
}

/// A stretch of the style drawn in one go: one raster layer, or consecutive
/// paint layers of one source.
class StyleRun {
  const StyleRun.raster(this.raster) : source = -1, first = 0, end = 0;
  const StyleRun.vector(this.source, this.first, this.end) : raster = -1;

  final int raster;
  final int source;

  /// The paint layers from [first] up to [end].
  final int first;
  final int end;
}

/// A style document compiled for drawing.
class StyleSheet {
  StyleSheet._(
    this.background,
    this.buckets,
    this.layers,
    this.symbols,
    this.sources,
    this.runs,
    this.zoomOffset,
    this.shape,
    this.sprite,
    this.rasters,
    this.backgroundPattern,
    this.backgroundOpacity,
  );

  final Expr background;

  /// The name of the sprite image repeated over the background, when the
  /// style asks for one.
  final Expr? backgroundPattern;
  final Expr backgroundOpacity;
  final List<Bucket> buckets;
  final List<PaintLayer> layers;
  final List<SymbolLayer> symbols;

  final List<VectorSource> sources;

  /// The order things are drawn in.
  final List<StyleRun> runs;
  final double zoomOffset;

  /// Equal for two styles whose tiles are built the same way, so a change of
  /// colours alone keeps the tiles already loaded.
  final String shape;

  /// The address of the sprite sheet, without `.json` or `.png`.
  final String? sprite;

  /// Raster layers, each drawn where [runs] puts it.
  final List<RasterLayer> rasters;

  static StyleSheet compile(
    Map<String, Object?> json, {
    List<String>? nameKeys,
    double zoomOffset = 0,
  }) {
    final sources = (json['sources'] as Map?) ?? const {};
    final rawLayers = (json['layers'] as List?) ?? const [];
    final vectorSources = <VectorSource>[];
    final sourceIndex = <Object?, int?>{};
    int? sourceOf(Object? name) => sourceIndex.putIfAbsent(name, () {
      final from = sources[name];
      if (from is! Map) return null;
      final geoJson = from['type'] == 'geojson';
      if (!geoJson && from['type'] != 'vector') return null;
      final tiles = from['tiles'];
      final direct = tiles is List && tiles.isNotEmpty
          ? tiles.first as String?
          : null;
      final data = from['data'];
      final maxZoom = asNumber(from['maxzoom'])?.toInt();
      final cluster = geoJson && from['cluster'] == true
          ? ClusterOptions(
              radius: asNumber(from['clusterRadius'])?.toDouble() ?? 50,
              maxZoom:
                  (asNumber(from['clusterMaxZoom'])?.toInt() ??
                          (maxZoom ?? 18) - 1)
                      .clamp(0, 24),
              minPoints: asNumber(from['clusterMinPoints'])?.toInt() ?? 2,
              properties: switch (from['clusterProperties']) {
                final Map<Object?, Object?> named => {
                  for (final e in named.entries) '${e.key}': e.value,
                },
                _ => const {},
              },
            )
          : null;
      vectorSources.add(
        VectorSource(
          name: '$name',
          geoJson: geoJson,
          tileJsonUrl: geoJson ? null : from['url'] as String?,
          tiles: direct,
          maxZoom: maxZoom,
          data: data,
          cluster: cluster,
          promoteId: from['promoteId'],
          generateId: from['generateId'] == true,
          signature: geoJson
              ? 'g|${data is String ? data : identityHashCode(data)}'
                    '|${cluster?.signature}|${from['promoteId']}'
                    '|${from['generateId']}'
              : 'v|${from['url']}|$direct|${from['promoteId']}',
        ),
      );
      return vectorSources.length - 1;
    });
    final rasterAt = <int>[];

    Expr background = (_) => null;
    Expr? backgroundPattern;
    Expr backgroundOpacity = (_) => 1;
    final buckets = <Bucket>[];
    final bucketIndex = <String, int>{};
    final layers = <PaintLayer>[];
    final symbols = <SymbolLayer>[];
    final rasters = <RasterLayer>[];
    final shape = StringBuffer('$zoomOffset');

    for (final raw in rawLayers) {
      if (raw is! Map) continue;
      final id = '${raw['id'] ?? ''}';
      final type = raw['type'];
      final paint = (raw['paint'] as Map?) ?? const {};
      final layout = (raw['layout'] as Map?) ?? const {};
      final moved = paint['${raw['type']}-translate'];
      final translate = moved == null ? null : compileExpr(moved);
      if (layout['visibility'] == 'none') continue;
      final minZoom = asNumber(raw['minzoom']) ?? 0;
      final maxZoom = asNumber(raw['maxzoom']) ?? 30;
      if (type == 'background') {
        final color = compileExpr(paint['background-color']);
        final opacity = compileExpr(paint['background-opacity'] ?? 1);
        final picture = paint['background-pattern'];
        backgroundPattern = picture == null ? null : compileText(picture);
        backgroundOpacity = opacity;
        background = (c) {
          final v = Rgba.of(color(c));
          final o = asNumber(opacity(c)) ?? 1;
          return v == null ? null : Rgba(v.r, v.g, v.b, v.a * o);
        };
        continue;
      }
      if (type == 'raster' || type == 'hillshade') {
        final from = sources[raw['source']];
        final relief = type == 'hillshade';
        if (from is! Map ||
            from['type'] != (relief ? 'raster-dem' : 'raster')) {
          continue;
        }
        final direct = from['tiles'];
        rasterAt.add(layers.length);
        rasters.add(
          RasterLayer(
            tileJsonUrl: from['url'] as String?,
            tiles: direct is List && direct.isNotEmpty
                ? direct.first as String?
                : null,
            tileSize: asNumber(from['tileSize']) ?? 512,
            sourceMaxZoom: asNumber(from['maxzoom'])?.toInt(),
            minZoom: minZoom,
            maxZoom: maxZoom,
            opacity: compileExpr(relief ? 1 : paint['raster-opacity'] ?? 1),
            adjust:
                relief ||
                    !paint.keys.any(
                      (k) =>
                          k == 'raster-hue-rotate' ||
                          k == 'raster-saturation' ||
                          k == 'raster-contrast' ||
                          k == 'raster-brightness-min' ||
                          k == 'raster-brightness-max',
                    )
                ? null
                : RasterAdjust(
                    hueRotate: compileExpr(paint['raster-hue-rotate'] ?? 0),
                    saturation: compileExpr(paint['raster-saturation'] ?? 0),
                    contrast: compileExpr(paint['raster-contrast'] ?? 0),
                    brightnessMin: compileExpr(
                      paint['raster-brightness-min'] ?? 0,
                    ),
                    brightnessMax: compileExpr(
                      paint['raster-brightness-max'] ?? 1,
                    ),
                  ),
            relief: !relief
                ? null
                : ReliefPaint(
                    terrarium: from['encoding'] == 'terrarium',
                    exaggeration: compileExpr(
                      paint['hillshade-exaggeration'] ?? 0.5,
                    ),
                    shadow: compileExpr(
                      paint['hillshade-shadow-color'] ?? '#000000',
                    ),
                    highlight: compileExpr(
                      paint['hillshade-highlight-color'] ?? '#ffffff',
                    ),
                    direction:
                        asNumber(paint['hillshade-illumination-direction']) ??
                        335,
                  ),
          ),
        );
        continue;
      }
      final src = sourceOf(raw['source']);
      if (src == null) continue;
      final named = raw['source-layer'];
      if (named is! String && !vectorSources[src].geoJson) continue;
      final sourceLayer = named is String ? named : '';
      final filter = raw['filter'];

      if (type == 'symbol') {
        var field = layout['text-field'];
        final image = layout['icon-image'];
        final hasText = field != null && field != '';
        final hasIcon = image != null && image != '';
        if (!hasText && !hasIcon) continue;
        if (hasText && nameKeys != null && jsonEncode(field).contains('name')) {
          field = [
            'coalesce',
            for (final k in nameKeys) ['get', k],
          ];
        }
        final font = jsonEncode(layout['text-font'] ?? '').toLowerCase();
        final size = layout['text-size'] ?? 16;
        final offset = _pair(layout['text-offset']);
        final placement = layout['symbol-placement'] ?? 'point';
        final spacing = asNumber(layout['symbol-spacing']) ?? 250;
        final textUpright = layout['text-rotation-alignment'] == 'viewport';
        final iconUpright = layout['icon-rotation-alignment'] == 'viewport';
        final anchor = layout['text-anchor'];
        final anchors = layout['text-variable-anchor'];
        final iconAnchor = layout['icon-anchor'];
        final iconOffset = _pair(layout['icon-offset']);
        final paintKeys = <String>{};
        for (final p in const [
          'text-color',
          'text-opacity',
          'text-halo-color',
          'text-halo-width',
          'text-halo-blur',
          'icon-color',
          'icon-opacity',
        ]) {
          _reads(paint[p], paintKeys);
        }
        _reads(layout['text-size'], paintKeys);
        _reads(layout['icon-size'], paintKeys);
        symbols.add(
          SymbolLayer(
            id: id,
            source: src,
            sourceLayer: sourceLayer,
            filter: compileFilter(filter),
            minZoom: minZoom,
            maxZoom: maxZoom,
            text: hasText ? compileText(field) : (_) => '',
            icon: hasIcon ? compileText(image) : null,
            placement: compileExpr(placement),
            size: compileExpr(size),
            color: compileExpr(paint['text-color'] ?? '#000000'),
            opacity: compileExpr(paint['text-opacity'] ?? 1),
            haloColor: compileExpr(paint['text-halo-color']),
            haloWidth: compileExpr(paint['text-halo-width'] ?? 0),
            weight: _weight(font),
            italic: font.contains('italic') || font.contains('oblique'),
            uppercase: layout['text-transform'] == 'uppercase',
            letterSpacing: asNumber(layout['text-letter-spacing']) ?? 0,
            lineHeight: asNumber(layout['text-line-height']),
            justify: switch (layout['text-justify']) {
              'left' => ui.TextAlign.left,
              'right' => ui.TextAlign.right,
              _ => ui.TextAlign.center,
            },
            textPadding: asNumber(layout['text-padding']),
            iconPadding: asNumber(layout['icon-padding']),
            textIgnored: layout['text-ignore-placement'] == true,
            iconIgnored: layout['icon-ignore-placement'] == true,
            haloBlur: compileExpr(paint['text-halo-blur'] ?? 0),
            maxWidth: asNumber(layout['text-max-width']) ?? 10,
            iconSize: compileExpr(layout['icon-size'] ?? 1),
            iconOpacity: compileExpr(paint['icon-opacity'] ?? 1),
            iconColor: compileExpr(paint['icon-color'] ?? '#000000'),
            iconRotate: asNumber(layout['icon-rotate']) ?? 0,
            textRotate: asNumber(layout['text-rotate']) ?? 0,
            anchor: anchor is String ? anchor : 'center',
            offsetX: offset.$1,
            offsetY: offset.$2,
            textOptional: layout['text-optional'] == true,
            iconOptional: layout['icon-optional'] == true,
            iconOverlaps: layout['icon-allow-overlap'] == true,
            textOverlaps: layout['text-allow-overlap'] == true,
            spacing: spacing.toDouble(),
            textUpright: textUpright,
            iconUpright: iconUpright,
            textFit: (layout['icon-text-fit'] ?? 'none') != 'none',
            anchors: anchors is List
                ? anchors.whereType<String>().toList()
                : const [],
            radialOffset:
                asNumber(layout['text-radial-offset'])?.toDouble() ?? 0,
            iconAnchor: iconAnchor is String ? iconAnchor : 'center',
            iconOffsetX: iconOffset.$1,
            iconOffsetY: iconOffset.$2,
            sortKey: layout['symbol-sort-key'] == null
                ? null
                : compileExpr(layout['symbol-sort-key']),
            paintKeys: paintKeys.toList()..sort(),
          ),
        );
        shape.write(
          jsonEncode([
            's',
            src,
            sourceLayer,
            filter,
            field,
            image,
            placement,
            spacing,
            textUpright,
            iconUpright,
            minZoom,
            maxZoom,
            layout['symbol-sort-key'],
            paintKeys.toList()..sort(),
          ]),
        );
        continue;
      }

      final kind = switch (type) {
        'line' => BucketKind.line,
        'circle' || 'heatmap' => BucketKind.circle,
        'fill' || 'fill-extrusion' => BucketKind.fill,
        _ => null,
      };
      if (kind == null) continue;
      final prefix = type as String;

      int bucketFor(
        BucketKind kind,
        Set<String> reads, {
        bool caps = false,
        bool dashed = false,
        bool outline = false,
        bool offset = false,
        LineJoin join = LineJoin.miter,
      }) {
        final keys = reads.toList()..sort();
        final key = jsonEncode([
          kind.index,
          src,
          sourceLayer,
          filter,
          caps,
          dashed,
          outline,
          offset,
          join.index,
          keys,
        ]);
        final index = bucketIndex.putIfAbsent(key, () {
          buckets.add(
            Bucket(
              src,
              sourceLayer,
              compileFilter(filter),
              kind,
              caps: caps,
              dashed: dashed,
              outline: outline,
              offset: offset,
              join: join,
              variantKeys: keys,
            ),
          );
          return buckets.length - 1;
        });
        final bucket = buckets[index];
        if (minZoom < bucket.minZoom) bucket.minZoom = minZoom;
        if (maxZoom > bucket.maxZoom) bucket.maxZoom = maxZoom;
        shape.write(jsonEncode([key, minZoom, maxZoom]));
        return index;
      }

      Set<String> reads(List<String> properties) {
        final names = <String>{};
        for (final p in properties) {
          _reads(paint[p], names);
        }
        return names;
      }

      final color = paint['$prefix-color'] ?? '#000000';
      final opacity = paint['$prefix-opacity'] ?? 1;

      if (type == 'heatmap') {
        final names = reads(const ['heatmap-weight']);
        final radius = compileExpr(paint['heatmap-radius'] ?? 30);
        layers.add(
          PaintLayer(
            id: id,
            translate: translate,
            bucket: bucketFor(kind, names),
            kind: kind,
            minZoom: minZoom,
            maxZoom: maxZoom,
            color: compileExpr('#ffffff'),
            opacity: compileExpr(opacity),
            width: (c) => (asNumber(radius(c)) ?? 30) * 2,
            heat: HeatPaint.of(
              weight: compileExpr(paint['heatmap-weight'] ?? 1),
              intensity: compileExpr(paint['heatmap-intensity'] ?? 1),
              color: paint['heatmap-color'],
            ),
          ),
        );
        continue;
      }

      if (kind == BucketKind.circle) {
        final names = reads(const [
          'circle-color',
          'circle-opacity',
          'circle-radius',
          'circle-stroke-color',
          'circle-stroke-width',
          'circle-stroke-opacity',
        ]);
        final radius = compileExpr(paint['circle-radius'] ?? 5);
        final ring = paint['circle-stroke-width'];
        layers.add(
          PaintLayer(
            id: id,
            translate: translate,
            bucket: bucketFor(kind, names),
            kind: kind,
            minZoom: minZoom,
            maxZoom: maxZoom,
            color: compileExpr(color),
            opacity: compileExpr(opacity),
            width: (c) => (asNumber(radius(c)) ?? 5) * 2,
            strokeColor: ring == null
                ? null
                : compileExpr(paint['circle-stroke-color'] ?? '#000000'),
            strokeWidth: ring == null ? null : compileExpr(ring),
            strokeOpacity: ring == null
                ? null
                : compileExpr(paint['circle-stroke-opacity'] ?? 1),
            perFeature: names.isNotEmpty,
          ),
        );
        continue;
      }

      if (kind == BucketKind.line) {
        final names = reads(const [
          'line-color',
          'line-opacity',
          'line-width',
          'line-gap-width',
          'line-offset',
        ]);
        final beside = paint['line-offset'];
        final dash = _dash(paint['line-dasharray']);
        final own = compileExpr(paint['line-width'] ?? 1);
        final gap = paint['line-gap-width'];
        Expr width = own;
        if (gap != null) {
          final between = compileExpr(gap);
          width = (c) =>
              (asNumber(own(c)) ?? 1) * 2 + (asNumber(between(c)) ?? 0);
        }
        final picture = paint['line-pattern'];
        layers.add(
          PaintLayer(
            id: id,
            translate: translate,
            bucket: bucketFor(
              kind,
              names,
              caps:
                  dash == null &&
                  picture == null &&
                  layout['line-cap'] == 'round',
              dashed: dash != null || picture != null,
              offset: beside != null,
              join: switch (layout['line-join']) {
                'round' => LineJoin.round,
                'bevel' => LineJoin.bevel,
                _ => LineJoin.miter,
              },
            ),
            kind: kind,
            minZoom: minZoom,
            maxZoom: maxZoom,
            color: compileExpr(picture == null ? color : '#ffffff'),
            opacity: compileExpr(opacity),
            width: width,
            offset: beside == null ? null : compileExpr(beside),
            dash: picture == null ? dash : null,
            pattern: picture == null ? null : compileText(picture),
            perFeature: names.isNotEmpty,
          ),
        );
        continue;
      }

      final names = reads(['$prefix-color', '$prefix-opacity']);
      final image = paint['fill-pattern'];
      layers.add(
        PaintLayer(
          id: id,
          translate: translate,
          bucket: bucketFor(kind, names),
          kind: kind,
          minZoom: minZoom,
          maxZoom: maxZoom,
          color: compileExpr(image == null ? color : '#ffffff'),
          opacity: compileExpr(opacity),
          pattern: image == null ? null : compileText(image),
          perFeature: names.isNotEmpty,
        ),
      );
      final edge = paint['fill-outline-color'];
      if (edge != null && image == null && paint['fill-antialias'] != false) {
        final edgeNames = reads(const ['fill-outline-color', 'fill-opacity']);
        layers.add(
          PaintLayer(
            id: id,
            translate: translate,
            bucket: bucketFor(BucketKind.line, edgeNames, outline: true),
            kind: BucketKind.line,
            minZoom: minZoom,
            maxZoom: maxZoom,
            color: compileExpr(edge),
            opacity: compileExpr(opacity),
            width: (_) => 1,
            perFeature: edgeNames.isNotEmpty,
          ),
        );
      }
    }

    final runs = <StyleRun>[];
    var nextRaster = 0;
    var runStart = 0;
    void closeRun(int end) {
      if (end > runStart) {
        runs.add(
          StyleRun.vector(
            buckets[layers[runStart].bucket].source,
            runStart,
            end,
          ),
        );
      }
      runStart = end;
    }

    for (var i = 0; i <= layers.length; i++) {
      while (nextRaster < rasterAt.length && rasterAt[nextRaster] == i) {
        closeRun(i);
        runs.add(StyleRun.raster(nextRaster++));
      }
      if (i == layers.length ||
          (i > runStart &&
              (buckets[layers[i].bucket].source !=
                      buckets[layers[runStart].bucket].source ||
                  layers[i].spills != layers[runStart].spills ||
                  layers[i].heat != null ||
                  layers[runStart].heat != null))) {
        closeRun(i);
      }
    }

    final sprite = json['sprite'];
    return StyleSheet._(
      background,
      buckets,
      layers,
      symbols,
      vectorSources,
      runs,
      zoomOffset,
      shape.toString(),
      switch (sprite) {
        final String url => url,
        [{'url': final String url}, ...] => url,
        _ => null,
      },
      rasters,
      backgroundPattern,
      backgroundOpacity,
    );
  }

  /// Collects the feature properties an expression reads.
  static void _reads(Object? json, Set<String> into) {
    if (json is List) {
      if (json.length == 2 &&
          (json[0] == 'get' || json[0] == 'has') &&
          json[1] is String) {
        into.add(json[1] as String);
      }
      if (json.isNotEmpty && (json[0] == 'feature-state' || json[0] == 'id')) {
        into.add(r'$id');
      }
      for (final e in json) {
        _reads(e, into);
      }
    } else if (json is Map) {
      final property = json['property'];
      if (property is String) into.add(property);
    }
  }

  static (double, double) _pair(Object? json) {
    var list = json;
    if (list is List && list.length == 2 && list[0] == 'literal') {
      list = list[1];
    }
    if (list is! List || list.length != 2) return (0, 0);
    return (asNumber(list[0]) ?? 0, asNumber(list[1]) ?? 0);
  }

  static Float64List? _dash(Object? json) {
    var list = json;
    if (list is List && list.length == 2 && list[0] == 'literal') {
      list = list[1];
    }
    if (list is! List || list.length < 2) return null;
    final out = Float64List(list.length.isOdd ? list.length * 2 : list.length);
    var gaps = 0.0;
    for (var i = 0; i < out.length; i++) {
      final v = asNumber(list[i % list.length]);
      if (v == null || v < 0) return null;
      out[i] = v.toDouble();
      if (i.isOdd) gaps += v;
    }
    return gaps <= 0 ? null : out;
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
}

/// How a hillshade layer turns heights into shading.
class ReliefPaint {
  ReliefPaint({
    required this.terrarium,
    required this.exaggeration,
    required this.shadow,
    required this.highlight,
    required this.direction,
  });

  /// The heights are in the Terrarium encoding instead of Mapbox's.
  final bool terrarium;
  final Expr exaggeration;
  final Expr shadow;
  final Expr highlight;

  /// Where the light comes from, in degrees clockwise from north.
  final double direction;
}

/// How a raster layer changes the colours of its pictures: `raster-hue-rotate`,
/// `raster-saturation`, `raster-contrast` and the two ends of
/// `raster-brightness`.
class RasterAdjust {
  RasterAdjust({
    required this.hueRotate,
    required this.saturation,
    required this.contrast,
    required this.brightnessMin,
    required this.brightnessMax,
  });

  final Expr hueRotate;
  final Expr saturation;
  final Expr contrast;
  final Expr brightnessMin;
  final Expr brightnessMax;

  String? _key;
  ui.ColorFilter? _filter;

  /// The colour filter for the zoom in [context], or null when it changes
  /// nothing.
  ui.ColorFilter? filter(EvalContext context) {
    final hue = (asNumber(hueRotate(context)) ?? 0).toDouble();
    final sat = (asNumber(saturation(context)) ?? 0).clamp(-1.0, 1.0);
    final con = (asNumber(contrast(context)) ?? 0).clamp(-1.0, 1.0);
    final low = (asNumber(brightnessMin(context)) ?? 0).clamp(0.0, 1.0);
    final high = (asNumber(brightnessMax(context)) ?? 1).clamp(0.0, 1.0);
    final key = '$hue|$sat|$con|$low|$high';
    if (key == _key) return _filter;
    _key = key;
    if (hue == 0 && sat == 0 && con == 0 && low == 0 && high == 1) {
      return _filter = null;
    }
    return _filter = ui.ColorFilter.matrix(
      rasterColorMatrix(
        hue,
        sat.toDouble(),
        con.toDouble(),
        low.toDouble(),
        high.toDouble(),
      ),
    );
  }
}

/// The colour matrix MapLibre's raster shader works out to: the hue turned
/// by [hue] degrees, then saturation, contrast, and brightness stretched
/// between [low] and [high].
List<double> rasterColorMatrix(
  double hue,
  double saturation,
  double contrast,
  double low,
  double high,
) {
  final angle = hue * math.pi / 180;
  final c = math.cos(angle), s = math.sin(angle);
  // Rows of the matrix that turns a colour around the grey axis.
  var m = <List<double>>[
    [
      (2 * c + 1) / 3,
      (-math.sqrt(3) * s - c + 1) / 3,
      (math.sqrt(3) * s - c + 1) / 3,
    ],
    [
      (math.sqrt(3) * s - c + 1) / 3,
      (2 * c + 1) / 3,
      (-math.sqrt(3) * s - c + 1) / 3,
    ],
    [
      (-math.sqrt(3) * s - c + 1) / 3,
      (math.sqrt(3) * s - c + 1) / 3,
      (2 * c + 1) / 3,
    ],
  ];
  final grey = saturation > 0 ? 1 - 1 / (1.001 - saturation) : -saturation;
  final sharp = contrast > 0 ? 1 / (1 - contrast) : 1 + contrast;
  // Saturation pulls each channel towards the mean of the three.
  m = [
    for (var row = 0; row < 3; row++)
      [
        for (var col = 0; col < 3; col++)
          m[row][col] * (1 - grey) +
              (m[0][col] + m[1][col] + m[2][col]) / 3 * grey,
      ],
  ];
  final scale = sharp * (high - low);
  final offset = ((0.5 * (1 - sharp)) * (high - low) + low) * 255;
  return [
    for (var row = 0; row < 3; row++) ...[
      m[row][0] * scale,
      m[row][1] * scale,
      m[row][2] * scale,
      0,
      offset,
    ],
    0, 0, 0, 1, 0, //
  ];
}

/// A layer of picture tiles.
class RasterLayer {
  RasterLayer({
    required this.tileJsonUrl,
    required this.tiles,
    required this.tileSize,
    required this.sourceMaxZoom,
    required this.minZoom,
    required this.maxZoom,
    required this.opacity,
    this.relief,
    this.adjust,
  });

  /// Set for a hillshade layer, whose tiles hold heights to be shaded.
  final ReliefPaint? relief;

  /// Set when the layer changes the colours of its pictures.
  final RasterAdjust? adjust;
  final String? tileJsonUrl;
  final String? tiles;
  final double tileSize;
  final int? sourceMaxZoom;
  final double minZoom;
  final double maxZoom;
  final Expr opacity;
}
