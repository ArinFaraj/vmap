import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'builtin_style.dart';
import 'cluster.dart';
import 'expr.dart';
import 'net.dart';
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

  /// The `id` of the style layer changed.
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
    if (edits.isEmpty) return document;
    final layers = [...(document['layers'] as List?) ?? const <Object?>[]];
    final at = <String, int>{
      for (var i = 0; i < layers.length; i++)
        if (layers[i] case {'id': final String id}) id: i,
    };
    final copied = <int>{};
    for (final edit in edits) {
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
    return {...document, 'layers': layers};
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
    this.edged = false,
    this.metered = false,
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

  /// The rim of every cap and join counts as the line's edge, which a line
  /// that fades out towards its edges needs.
  final bool edged;

  /// Each vertex keeps its share of the way along the whole line instead
  /// of a distance, which a gradient along the line is drawn by.
  final bool metered;
  final LineJoin join;

  /// The feature properties the paint of its layers reads. Features are
  /// split into one mesh per combination of their values.
  final List<String> variantKeys;
  double minZoom = 30;
  double maxZoom = 0;

  bool get isLine => kind == BucketKind.line;
}

/// How the ends of a dash are drawn.
enum DashCap { butt, round, square }

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
    this.blur,
    this.dash,
    this.dashCap = DashCap.butt,
    this.pattern,
    this.strokeColor,
    this.strokeWidth,
    this.strokeOpacity,
    this.heat,
    this.translate,
    this.translateOnScreen = false,
    this.gradient,
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

  /// How far in from its edges a line fades out, in logical pixels.
  final Expr? blur;

  /// Lengths of dashes and gaps in turn, in line widths.
  final Float64List? dash;

  /// A round or square cap makes every dash half a line width longer at
  /// each end.
  final DashCap dashCap;

  /// The name of the sprite image that fills the shape, or that is repeated
  /// along the line.
  final Expr? pattern;

  /// `line-gradient`: the colour at each share of the way along a line,
  /// read with `line-progress`.
  final Expr? gradient;

  /// The ring around a circle.
  final Expr? strokeColor;
  final Expr? strokeWidth;
  final Expr? strokeOpacity;

  /// Set for a heatmap layer, whose points are drawn as glows that add up.
  final HeatPaint? heat;

  /// How far the layer is drawn from its place, as x and y in logical
  /// pixels.
  final Expr? translate;

  /// The move is along the screen's sides and not the map's, which differ
  /// once the map is turned.
  final bool translateOnScreen;

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
    this.textTranslate,
    this.textTranslateOnScreen = false,
    this.iconTranslate,
    this.iconTranslateOnScreen = false,
    this.maxBend,
    this.iconHaloColor,
    this.iconHaloWidth,
    this.iconHaloBlur,
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

  /// How far the text and the icon are drawn from their place, in logical
  /// pixels, along the map's sides or the screen's.
  final Expr? textTranslate;
  final bool textTranslateOnScreen;
  final Expr? iconTranslate;
  final bool iconTranslateOnScreen;

  /// The rim drawn around an icon that takes a colour, and how far out it
  /// reaches in logical pixels. Null when the style names none.
  final Expr? iconHaloColor;
  final Expr? iconHaloWidth;
  final Expr? iconHaloBlur;

  /// `text-max-angle` in radians: the sharpest turn a name bent along a
  /// line takes. Null for the package's own.
  final double? maxBend;

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
/// The tiles a source has: from which zoom, over which part of the world,
/// and in which order its rows are numbered.
class TileCover {
  const TileCover({this.minZoom = 0, this.bounds, this.tms = false});

  /// Reads `minzoom`, `bounds` and `scheme` from a style's source.
  factory TileCover.of(Map<Object?, Object?> source) {
    final bounds = source['bounds'];
    return TileCover(
      minZoom: asNumber(source['minzoom'])?.toInt() ?? 0,
      bounds:
          bounds is List && bounds.length == 4 && bounds.every((b) => b is num)
          ? [for (final b in bounds) (b as num).toDouble()]
          : null,
      tms: source['scheme'] == 'tms',
    );
  }

  final int minZoom;

  /// West, south, east and north in degrees. Null for the whole world.
  final List<double>? bounds;

  /// Rows are numbered from the south, as a TMS server does.
  final bool tms;

  /// Whether the source has the tile [x], [y] at zoom [z].
  bool has(int z, int x, int y) {
    if (z < minZoom) return false;
    final bounds = this.bounds;
    if (bounds == null) return true;
    final n = 1 << z;
    int column(double lon) => ((lon + 180) / 360 * n).floor();
    int row(double lat) {
      final r = lat.clamp(-85.0511, 85.0511) * math.pi / 180;
      return ((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n)
          .floor();
    }

    return x >= column(bounds[0]) &&
        x <= column(bounds[2]) &&
        y >= row(bounds[3]) &&
        y <= row(bounds[1]);
  }

  /// The row to ask the server for.
  int row(int z, int y) => tms ? (1 << z) - 1 - y : y;

  String get signature => '$minZoom|${bounds?.join(',')}|$tms';
}

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
    this.cover = const TileCover(),
  });

  final String name;
  final bool geoJson;
  final TileCover cover;

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
    this.attributions,
  );

  /// The credit each source asks for in its `attribution`, without repeats.
  final List<String> attributions;

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
      final direct = tileTemplate(from['tiles']);
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
          cover: geoJson ? const TileCover() : TileCover.of(from),
          signature: geoJson
              ? 'g|${data is String ? data : identityHashCode(data)}'
                    '|${cluster?.signature}|${from['promoteId']}'
                    '|${from['generateId']}'
              : 'v|${from['url']}|$direct|${from['promoteId']}'
                    '|${TileCover.of(from).signature}',
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
      final translateOnScreen =
          paint['${raw['type']}-translate-anchor'] == 'viewport';
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
        if (from is! Map) continue;
        final corners = relief || from['type'] != 'image'
            ? null
            : _corners(from['coordinates']);
        if (corners == null &&
            from['type'] != (relief ? 'raster-dem' : 'raster')) {
          continue;
        }
        rasterAt.add(layers.length);
        rasters.add(
          RasterLayer(
            tileJsonUrl: corners == null ? from['url'] as String? : null,
            picture: corners == null ? null : from['url'] as String?,
            corners: corners,
            nearest: paint['raster-resampling'] == 'nearest',
            tiles: tileTemplate(from['tiles']),
            tileSize: asNumber(from['tileSize']) ?? 512,
            sourceMaxZoom: asNumber(from['maxzoom'])?.toInt(),
            cover: TileCover.of(from),
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
                    accent: paint['hillshade-accent-color'] == null
                        ? null
                        : compileExpr(paint['hillshade-accent-color']),
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
            textTranslate: _maybe(paint['text-translate']),
            textTranslateOnScreen: paint['text-translate-anchor'] == 'viewport',
            iconHaloColor: paint['icon-halo-color'] == null
                ? null
                : compileExpr(paint['icon-halo-color']),
            iconHaloWidth: paint['icon-halo-width'] == null
                ? null
                : compileExpr(paint['icon-halo-width']),
            iconTranslate: _maybe(paint['icon-translate']),
            iconHaloBlur: _maybe(paint['icon-halo-blur']),
            iconTranslateOnScreen: paint['icon-translate-anchor'] == 'viewport',
            maxBend: switch (asNumber(layout['text-max-angle'])) {
              final degrees? => degrees * math.pi / 180,
              null => null,
            },
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
        bool edged = false,
        bool metered = false,
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
          edged,
          metered,
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
              edged: edged,
              metered: metered,
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
            translateOnScreen: translateOnScreen,
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
            translateOnScreen: translateOnScreen,
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
        final blur = paint['line-blur'];
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
        final ramp = dash == null && picture == null
            ? paint['line-gradient']
            : null;
        final soft = blur != null && picture == null && ramp == null;
        layers.add(
          PaintLayer(
            id: id,
            translate: translate,
            translateOnScreen: translateOnScreen,
            bucket: bucketFor(
              kind,
              names,
              caps:
                  dash == null &&
                  picture == null &&
                  layout['line-cap'] == 'round',
              dashed: dash != null || picture != null || soft || ramp != null,
              edged: soft && dash == null,
              metered: ramp != null,
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
            color: compileExpr(
              picture == null && ramp == null ? color : '#ffffff',
            ),
            gradient: ramp == null ? null : compileExpr(ramp),
            opacity: compileExpr(opacity),
            width: width,
            offset: beside == null ? null : compileExpr(beside),
            blur: soft ? compileExpr(blur) : null,
            dash: picture == null ? dash : null,
            dashCap: switch (layout['line-cap']) {
              'round' => DashCap.round,
              'square' => DashCap.square,
              _ => DashCap.butt,
            },
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
          translateOnScreen: translateOnScreen,
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
            translateOnScreen: translateOnScreen,
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
      {
        for (final s in sources.values)
          if (s is Map && s['attribution'] is String)
            s['attribution'] as String,
      }.toList(),
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

  static Float64List? _corners(Object? json) {
    if (json is! List || json.length != 4) return null;
    final out = Float64List(8);
    for (var i = 0; i < 4; i++) {
      final at = json[i];
      if (at is! List || at.length < 2) return null;
      final lng = asNumber(at[0]), lat = asNumber(at[1]);
      if (lng == null || lat == null) return null;
      final turn = lat.clamp(-85.0511, 85.0511) * math.pi / 180;
      out[i * 2] = (lng + 180) / 360;
      out[i * 2 + 1] =
          (1 - math.log(math.tan(turn) + 1 / math.cos(turn)) / math.pi) / 2;
    }
    return out;
  }

  static Expr? _maybe(Object? json) => json == null ? null : compileExpr(json);

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
    this.accent,
  });

  /// The heights are in the Terrarium encoding instead of Mapbox's.
  final bool terrarium;
  final Expr exaggeration;
  final Expr shadow;
  final Expr highlight;

  /// The colour steep ground is tinted whichever way it faces. Null when
  /// the style names none.
  final Expr? accent;

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
    this.cover = const TileCover(),
    this.picture,
    this.corners,
    this.nearest = false,
  });

  final TileCover cover;

  /// For an `image` source: the address of its one picture, and where the
  /// picture's corners sit as x,y pairs in a world one unit wide, from the
  /// top left clockwise.
  final String? picture;
  final Float64List? corners;

  /// `raster-resampling` nearest: a picture drawn larger than it is shows
  /// its pixels as squares instead of being smoothed.
  final bool nearest;

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
