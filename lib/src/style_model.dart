import 'dart:convert';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'cluster.dart';
import 'expr.dart';
import 'mercator.dart';
import 'raster_style.dart';
import 'style_compiler.dart';
import 'tessellate.dart';

enum BucketKind { fill, line, circle, extrusion }

/// What a `fill-extrusion` layer reads per building.
class Extrude {
  const Extrude(this.height, this.base, this.color);

  final Expr height;
  final Expr base;
  final Expr color;
}

/// A `fill-extrusion` layer drawn standing up on a tilted map, from its
/// [bucket] of buildings. [fill] is the flat fill drawn in its place when
/// the map is not.
class ExtrusionLayer {
  const ExtrusionLayer({
    required this.id,
    required this.bucket,
    required this.fill,
    required this.minZoom,
    required this.maxZoom,
    required this.opacity,
  });

  final String id;
  final int bucket;
  final int fill;
  final double minZoom;
  final double maxZoom;
  final Expr opacity;
}

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
    this.extrude,
  });

  /// Set for a bucket of buildings to stand up.
  final Extrude? extrude;

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

/// A fill, line, circle or heatmap layer of the style, in drawing order.
sealed class PaintLayer {
  PaintLayer({
    required this.id,
    required this.bucket,
    required this.minZoom,
    required this.maxZoom,
    required this.color,
    required this.opacity,
    this.translate,
    this.translateOnScreen = false,
    this.perFeature = false,
  });

  /// The layer's name in the style.
  final String id;
  final int bucket;
  final double minZoom;
  final double maxZoom;
  final Expr color;
  final Expr opacity;

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
  bool get spills => false;
}

/// A layer with a width: a line's total width, or the diameter of a circle
/// or a glow, in logical pixels.
abstract interface class StrokedLayer {
  Expr get width;
}

/// A layer that can be painted with a sprite image: one that fills the
/// shape, or that is repeated along the line.
abstract interface class PatternedLayer {
  Expr? get pattern;
}

/// A layer drawn mesh by mesh from its bucket.
sealed class MeshLayer extends PaintLayer {
  MeshLayer({
    required super.id,
    required super.bucket,
    required super.minZoom,
    required super.maxZoom,
    required super.color,
    required super.opacity,
    super.translate,
    super.translateOnScreen,
    super.perFeature,
  });
}

final class FillLayer extends MeshLayer implements PatternedLayer {
  FillLayer({
    required super.id,
    required super.bucket,
    required super.minZoom,
    required super.maxZoom,
    required super.color,
    required super.opacity,
    super.translate,
    super.translateOnScreen,
    super.perFeature,
    this.pattern,
    this.extruded = false,
  });

  @override
  final Expr? pattern;

  /// The flat stand-in of a `fill-extrusion` layer, left out where the
  /// buildings are drawn standing.
  final bool extruded;
}

final class LineLayer extends MeshLayer
    implements StrokedLayer, PatternedLayer {
  LineLayer({
    required super.id,
    required super.bucket,
    required super.minZoom,
    required super.maxZoom,
    required super.color,
    required super.opacity,
    required this.width,
    super.translate,
    super.translateOnScreen,
    super.perFeature,
    this.offset,
    this.blur,
    this.dash,
    this.dashCap = DashCap.butt,
    this.pattern,
    this.gradient,
    this.gap,
  });

  @override
  final Expr width;

  @override
  final Expr? pattern;

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

  /// `line-gradient`: the colour at each share of the way along a line,
  /// read with `line-progress`.
  final Expr? gradient;

  /// `line-gap-width`: the width of the gap down the middle of a line drawn
  /// as two, in logical pixels. [width] spans both sides and the gap.
  final Expr? gap;
}

final class CircleLayer extends MeshLayer implements StrokedLayer {
  CircleLayer({
    required super.id,
    required super.bucket,
    required super.minZoom,
    required super.maxZoom,
    required super.color,
    required super.opacity,
    required this.width,
    super.translate,
    super.translateOnScreen,
    super.perFeature,
    this.ring,
  });

  @override
  final Expr width;

  /// The ring around each circle, when the style draws one.
  final CircleRing? ring;

  @override
  bool get spills => true;
}

/// The stroke around a circle.
class CircleRing {
  const CircleRing({
    required this.color,
    required this.width,
    required this.opacity,
  });

  final Expr color;
  final Expr width;
  final Expr opacity;
}

/// Points drawn as glows that add up, then coloured by how much they add up
/// to.
final class HeatmapLayer extends PaintLayer implements StrokedLayer {
  HeatmapLayer({
    required super.id,
    required super.bucket,
    required super.minZoom,
    required super.maxZoom,
    required super.color,
    required super.opacity,
    required this.width,
    required this.heat,
    super.translate,
    super.translateOnScreen,
  });

  @override
  final Expr width;
  final HeatPaint heat;

  @override
  bool get spills => true;
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

/// What the tile builder reads from a symbol layer, made from the JSON it
/// came from. [signature] is that JSON, so two layers that build the same
/// labels have the same signature, and a change to anything the builder
/// reads changes it.
class SymbolBuild {
  /// The keys of the JSON a build is made from.
  static const sourceKey = 'source';
  static const sourceLayerKey = 'sourceLayer';
  static const filterKey = 'filter';
  static const textKey = 'text';
  static const iconKey = 'icon';
  static const placementKey = 'placement';
  static const spacingKey = 'spacing';
  static const textUprightKey = 'textUpright';
  static const iconUprightKey = 'iconUpright';
  static const minZoomKey = 'minZoom';
  static const maxZoomKey = 'maxZoom';
  static const sortKeyKey = 'sortKey';
  static const iconRotateKey = 'iconRotate';
  static const paintKeysKey = 'paintKeys';

  SymbolBuild(Map<String, Object?> json)
    : signature = jsonEncode(json),
      source = json[sourceKey]! as int,
      sourceLayer = json[sourceLayerKey]! as String,
      filter = compileFilter(json[filterKey]),
      text = switch (json[textKey]) {
        null => (_) => '',
        final field => compileText(field),
      },
      icon = switch (json[iconKey]) {
        null => null,
        final image => compileText(image),
      },
      placement = compileExpr(json[placementKey]),
      spacing = (json[spacingKey]! as num).toDouble(),
      textUpright = json[textUprightKey] == true,
      iconUpright = json[iconUprightKey] == true,
      minZoom = (json[minZoomKey]! as num).toDouble(),
      maxZoom = (json[maxZoomKey]! as num).toDouble(),
      sortKey = switch (json[sortKeyKey]) {
        null => null,
        final key => compileExpr(key),
      },
      iconRotate = (json[iconRotateKey]! as num).toDouble(),
      paintKeys = (json[paintKeysKey]! as List).cast<String>();

  final String signature;

  /// Index into the style's sources.
  final int source;
  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final Expr text;

  /// The name of the sprite image, or null when the layer has none.
  final Expr? icon;
  final Expr placement;

  /// Space between labels repeated along a line, in logical pixels.
  final double spacing;

  /// Text or icons along a line stay upright on the screen instead of
  /// following the line.
  final bool textUpright;
  final bool iconUpright;
  final double minZoom;
  final double maxZoom;

  /// `symbol-sort-key`: of two labels in this layer wanting the same room,
  /// the one with the lower number gets it.
  final Expr? sortKey;

  /// In degrees.
  final double iconRotate;

  /// The feature properties the layer's colours, opacities and sizes read.
  /// Each label carries its feature's values of them.
  final List<String> paintKeys;
}

/// A text and icon layer of the style.
class SymbolLayer {
  SymbolLayer({
    required this.id,
    required this.build,
    required this.size,
    required this.color,
    required this.opacity,
    required this.haloColor,
    required this.haloWidth,
    required this.weight,
    required this.italic,
    this.fontStack = const [],
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
    required this.textRotate,
    required this.anchor,
    required this.offsetX,
    required this.offsetY,
    required this.textOptional,
    required this.iconOptional,
    required this.iconOverlaps,
    required this.textOverlaps,
    required this.textFit,
    this.iconTextFit = 'none',
    this.iconTextFitPadding = const [0, 0, 0, 0],
    this.anchors = const [],
    this.radialOffset = 0,
    this.iconAnchor = 'center',
    this.iconOffsetX = 0,
    this.iconOffsetY = 0,
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

  /// Everything the tile builder reads from the layer.
  final SymbolBuild build;

  int get source => build.source;
  String get sourceLayer => build.sourceLayer;
  bool Function(EvalContext) get filter => build.filter;
  double get minZoom => build.minZoom;
  double get maxZoom => build.maxZoom;

  final Expr size;
  final Expr color;
  final Expr opacity;
  final Expr haloColor;
  final Expr haloWidth;
  final int weight;
  final bool italic;

  /// The style's `text-font`: the fonts to try first, by name.
  final List<String> fontStack;
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

  /// The icon is stretched to sit behind the text.
  final bool textFit;

  /// `icon-text-fit`: none, width, height or both.
  final String iconTextFit;

  /// `icon-text-fit-padding`: top, right, bottom and left, in pixels.
  final List<double> iconTextFitPadding;
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
    int column(double lon) => tileColumn(lon, z);
    int row(double lat) => tileRow(lat, z);

    return x >= column(bounds[0]) &&
        x <= column(bounds[2]) &&
        y >= row(bounds[3]) &&
        y <= row(bounds[1]);
  }

  /// The row to ask the server for.
  int row(int z, int y) => tms ? (1 << z) - 1 - y : y;

  String get signature => '$minZoom|${bounds?.join(',')}|$tms';
}

/// A source of vector features: tiles, or GeoJSON the package cuts into
/// tiles.
sealed class VectorSource {
  VectorSource({
    required this.name,
    required this.signature,
    this.maxZoom,
    this.promoteId,
  });

  final String name;
  final int? maxZoom;

  /// The deepest zoom there are tiles for when the style does not say.
  int get defaultMaxZoom;

  /// The source's `promoteId`: the property used as a feature's id, as one
  /// name or as a name per source layer.
  final Object? promoteId;

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

final class GeoJsonSource extends VectorSource {
  GeoJsonSource({
    required super.name,
    required super.signature,
    required this.data,
    super.maxZoom,
    super.promoteId,
    this.cluster,
    this.generateId = false,
  });

  /// A GeoJSON document, or the address of one.
  final Object? data;

  /// Set when the source asks for its points to be clustered.
  final ClusterOptions? cluster;

  /// The features are numbered in order, as `generateId` asks.
  final bool generateId;

  @override
  int get defaultMaxZoom => 18;
}

final class TiledSource extends VectorSource {
  TiledSource({
    required super.name,
    required super.signature,
    this.tileJsonUrl,
    this.tiles,
    super.maxZoom,
    super.promoteId,
    this.cover = const TileCover(),
  });

  /// A TileJSON address, or a `pmtiles://` archive.
  final String? tileJsonUrl;

  /// The tile addresses, when the style lists them itself.
  final String? tiles;
  final TileCover cover;

  @override
  int get defaultMaxZoom => 14;
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
  StyleSheet({
    required this.background,
    required this.buckets,
    required this.layers,
    required this.symbols,
    required this.sources,
    required this.runs,
    required this.zoomOffset,
    required this.shape,
    required this.sprite,
    this.glyphs,
    required this.rasters,
    required this.backgroundPattern,
    required this.backgroundOpacity,
    required this.attributions,
    this.extrusions = const [],
    this.footprints = const {},
  });

  /// The style's `fill-extrusion` layers, in order.
  final List<ExtrusionLayer> extrusions;

  /// Flat fill layers the buildings replace, by paint layer index: they read
  /// the same data as a building layer and end at the zoom it starts. Their
  /// tiles keep them a zoom longer, for them to fade as the buildings rise.
  final Map<int, ExtrusionLayer> footprints;

  /// Compiles a MapLibre style document. [nameKeys] are the properties a
  /// label's name is read from, in turn, in place of the style's own.
  static StyleSheet compile(
    Map<String, Object?> json, {
    List<String>? nameKeys,
    double zoomOffset = 0,
  }) =>
      StyleCompiler(json, nameKeys: nameKeys, zoomOffset: zoomOffset).compile();

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

  /// The style's glyph ranges, with `{fontstack}` and `{range}` in it.
  final String? glyphs;

  /// Raster layers, each drawn where [runs] puts it.
  final List<RasterLayer> rasters;
}
