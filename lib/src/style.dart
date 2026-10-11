import 'dart:convert';
import 'dart:typed_data';

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

enum BucketKind { fill, line, circle }

/// Features of one source layer that pass one filter, built into one mesh.
/// Style layers that select the same features share it.
class Bucket {
  Bucket(
    this.sourceLayer,
    this.filter,
    this.kind, {
    this.caps = false,
    this.dashed = false,
    this.outline = false,
    this.variantKeys = const [],
  });

  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final BucketKind kind;
  final bool caps;

  /// Keeps each vertex's distance along its line, which dashes are drawn by.
  final bool dashed;

  /// The edges of polygons only, a pixel wide, so corners need no rounding.
  final bool outline;

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
    required this.bucket,
    required this.kind,
    required this.minZoom,
    required this.maxZoom,
    required this.color,
    required this.opacity,
    this.width,
    this.dash,
    this.pattern,
    this.strokeColor,
    this.strokeWidth,
    this.strokeOpacity,
    this.perFeature = false,
  });

  final int bucket;
  final BucketKind kind;
  final double minZoom;
  final double maxZoom;
  final Expr color;
  final Expr opacity;

  /// A line's total width or a circle's diameter, in logical pixels.
  final Expr? width;

  /// Lengths of dashes and gaps in turn, in line widths.
  final Float64List? dash;

  /// The name of the sprite image that fills the shape.
  final Expr? pattern;

  /// The ring around a circle.
  final Expr? strokeColor;
  final Expr? strokeWidth;
  final Expr? strokeOpacity;

  /// The paint reads feature properties, so it is worked out per mesh.
  final bool perFeature;

  bool get isLine => kind == BucketKind.line;
}

/// A text and icon layer of the style.
class SymbolLayer {
  SymbolLayer({
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
    required this.maxWidth,
    required this.iconSize,
    required this.iconOpacity,
    required this.iconRotate,
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
  });

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
  final double maxWidth;
  final Expr iconSize;
  final Expr iconOpacity;

  /// In degrees.
  final double iconRotate;

  /// Which part of the text sits on the anchor point: `center`, `top`,
  /// `bottom-left` and so on.
  final String anchor;

  /// How far the text is moved from the anchor, in ems.
  final double offsetX;
  final double offsetY;

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
    this.sprite,
    this.rasters,
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

  /// The address of the sprite sheet, without `.json` or `.png`.
  final String? sprite;

  /// Raster layers, drawn under the vector ones.
  final List<RasterLayer> rasters;

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
    final rasters = <RasterLayer>[];
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
      if (type == 'raster') {
        final from = sources[raw['source']];
        if (from is! Map || from['type'] != 'raster') continue;
        final direct = from['tiles'];
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
            opacity: compileExpr(paint['raster-opacity'] ?? 1),
          ),
        );
        continue;
      }
      final sourceLayer = raw['source-layer'];
      if (raw['source'] != sourceName || sourceLayer is! String) continue;
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
        symbols.add(
          SymbolLayer(
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
            maxWidth: asNumber(layout['text-max-width']) ?? 10,
            iconSize: compileExpr(layout['icon-size'] ?? 1),
            iconOpacity: compileExpr(paint['icon-opacity'] ?? 1),
            iconRotate: asNumber(layout['icon-rotate']) ?? 0,
            anchor: anchor is String ? anchor : 'center',
            offsetX: offset.$1,
            offsetY: offset.$2,
            textOptional: layout['text-optional'] == true,
            iconOptional: layout['icon-optional'] == true,
            iconOverlaps:
                layout['icon-allow-overlap'] == true ||
                layout['icon-ignore-placement'] == true,
            textOverlaps: layout['text-allow-overlap'] == true,
            spacing: spacing.toDouble(),
            textUpright: textUpright,
            iconUpright: iconUpright,
            textFit: (layout['icon-text-fit'] ?? 'none') != 'none',
          ),
        );
        shape.write(
          jsonEncode([
            's',
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
          ]),
        );
        continue;
      }

      final kind = switch (type) {
        'line' => BucketKind.line,
        'circle' => BucketKind.circle,
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
      }) {
        final keys = reads.toList()..sort();
        final key = jsonEncode([
          kind.index,
          sourceLayer,
          filter,
          caps,
          dashed,
          outline,
          keys,
        ]);
        final index = bucketIndex.putIfAbsent(key, () {
          buckets.add(
            Bucket(
              sourceLayer,
              compileFilter(filter),
              kind,
              caps: caps,
              dashed: dashed,
              outline: outline,
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
        ]);
        final dash = _dash(paint['line-dasharray']);
        final own = compileExpr(paint['line-width'] ?? 1);
        final gap = paint['line-gap-width'];
        Expr width = own;
        if (gap != null) {
          final between = compileExpr(gap);
          width = (c) =>
              (asNumber(own(c)) ?? 1) * 2 + (asNumber(between(c)) ?? 0);
        }
        if (paint['line-pattern'] != null) continue;
        layers.add(
          PaintLayer(
            bucket: bucketFor(
              kind,
              names,
              caps: dash == null && layout['line-cap'] == 'round',
              dashed: dash != null,
            ),
            kind: kind,
            minZoom: minZoom,
            maxZoom: maxZoom,
            color: compileExpr(color),
            opacity: compileExpr(opacity),
            width: width,
            dash: dash,
            perFeature: names.isNotEmpty,
          ),
        );
        continue;
      }

      final names = reads(['$prefix-color', '$prefix-opacity']);
      final image = paint['fill-pattern'];
      layers.add(
        PaintLayer(
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

    final sprite = json['sprite'];
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
      switch (sprite) {
        final String url => url,
        [{'url': final String url}, ...] => url,
        _ => null,
      },
      rasters,
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
  });

  final String? tileJsonUrl;
  final String? tiles;
  final double tileSize;
  final int? sourceMaxZoom;
  final double minZoom;
  final double maxZoom;
  final Expr opacity;
}
