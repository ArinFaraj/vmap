import 'dart:math' as math;
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
  const Extrude(
    this.height,
    this.base,
    this.color, {
    this.verticalGradient = true,
  });

  final Expr height;
  final Expr base;
  final Expr color;

  /// `fill-extrusion-vertical-gradient`: walls darker towards their feet.
  final bool verticalGradient;
}

/// A style's root `light`, which shades buildings as MapLibre's
/// `fill_extrusion.vertex.glsl` does.
class ExtrusionLight {
  const ExtrusionLight({
    this.intensity = 0.5,
    this.color = const Rgba(1, 1, 1, 1),
    this.position = const [1.15, 210, 30],
    this.viewport = true,
  });

  /// Reads [json], the style's `light`, with MapLibre's defaults.
  factory ExtrusionLight.of(Object? json) {
    final light = json is Map ? json : const {};
    final context = EvalContext();
    final position = compileExpr(light['position'] ?? [1.15, 210, 30])(context);
    return ExtrusionLight(
      intensity:
          (asNumber(compileExpr(light['intensity'] ?? 0.5)(context)) ?? 0.5)
              .toDouble(),
      color:
          Rgba.of(compileExpr(light['color'] ?? '#ffffff')(context)) ??
          const Rgba(1, 1, 1, 1),
      position: position is List && position.length == 3
          ? [for (final v in position) (asNumber(v) ?? 0).toDouble()]
          : const [1.15, 210, 30],
      viewport: light['anchor'] != 'map',
    );
  }

  final double intensity;
  final Rgba color;

  /// Distance, azimuth and polar angle in degrees, as MapLibre takes them.
  final List<double> position;

  /// The light turns with the map's bearing, staying put on the screen.
  final bool viewport;

  /// How much a wall's vertical gradient keeps of its light at [t], 1 at
  /// the top and 0 at the foot, of a building from [base] to [height]
  /// metres: all of it when the gradient is not [on].
  double gradient({
    required double t,
    required double base,
    required double height,
    bool on = true,
  }) => on
      ? ((t + math.max(0.0, base)) * math.sqrt(math.max(0.0, height) / 150))
            .clamp(0.7 + (0.98 - 0.7) * (1 - intensity), 1.0)
      : 1;

  /// The direction light falls from, as MapLibre's `sphericalToCartesian`
  /// gives it, turned by [bearing] degrees for a [viewport] light, in tile
  /// units: across the ground, then up. MapLibre's light points the other
  /// way across the ground from the walls' outward normals here.
  (double, double, double) direction(double bearing) {
    final azimuth = (position[1] + 90) * math.pi / 180;
    final polar = position[2] * math.pi / 180;
    var lx = position[0] * math.cos(azimuth) * math.sin(polar);
    var ly = position[0] * math.sin(azimuth) * math.sin(polar);
    final lz = position[0] * math.cos(polar);
    if (viewport && bearing != 0) {
      final a = bearing * math.pi / 180;
      final c = math.cos(a), s = math.sin(a);
      (lx, ly) = (c * lx - s * ly, s * lx + c * ly);
    }
    return (-lx, -ly, lz);
  }

  /// [r], [g], [b] lit on a face whose normal is [nx], [ny], [nz], in tile
  /// units with y down, as packed RGB. On a wall [t] is 1 at the top and 0
  /// at the foot, [base] and [height] the building's in metres, and
  /// [gradient] darkens it towards the foot. [bearing] in degrees turns a
  /// [viewport] light.
  int shade(
    double r,
    double g,
    double b,
    double nx,
    double ny,
    double nz, {
    double t = 1,
    double base = 0,
    double height = 0,
    bool gradient = true,
    double bearing = 0,
  }) {
    final (lx, ly, lz) = direction(bearing);
    final length = math.sqrt(nx * nx + ny * ny + nz * nz);
    final value = r * 0.2126 + g * 0.7152 + b * 0.0722;
    var directional = length == 0
        ? 0.0
        : ((nx * lx + ny * ly + nz * lz) / length).clamp(0.0, 1.0);
    directional =
        (1 - intensity) +
        (math.max(1 - value + intensity, 1.0) - (1 - intensity)) * directional;
    if (nz == 0) {
      directional *= this.gradient(
        t: t,
        base: base,
        height: height,
        on: gradient,
      );
    }
    int channel(double c, double light) {
      final lowest = 0.3 * (1 - light);
      return (((c + 0.03) * directional * light).clamp(lowest, 1.0) * 255)
          .round();
    }

    return channel(r, color.r) << 16 |
        channel(g, color.g) << 8 |
        channel(b, color.b);
  }
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
    this.translate,
    this.translateOnScreen = false,
  });

  final String id;
  final int bucket;
  final int fill;
  final double minZoom;
  final double maxZoom;
  final Expr opacity;

  /// `fill-extrusion-translate`, in pixels, turned with the map unless
  /// [translateOnScreen].
  final Expr? translate;
  final bool translateOnScreen;

  /// How far [translate] moves the buildings at [context], in world pixels
  /// across the ground, on a map turned [bearing] degrees.
  (double, double) moved(EvalContext context, double bearing) {
    final by = translate?.call(context);
    if (by is! List || by.length != 2) return (0, 0);
    final x = (asNumber(by[0]) ?? 0).toDouble();
    final y = (asNumber(by[1]) ?? 0).toDouble();
    if (!translateOnScreen || bearing == 0) return (x, y);
    final turn = bearing * math.pi / 180;
    final c = math.cos(turn), s = math.sin(turn);
    return (x * c - y * s, x * s + y * c);
  }
}

/// Features of one source layer that pass one filter, built into one mesh.
/// Style layers that select the same features share it.
class Bucket {
  Bucket(
    this.source,
    this.sourceLayer,
    this.filter,
    this.kind, {
    this.cap = LineCap.butt,
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

  /// How its lines end. Dashed lines end as their dashes do instead.
  final LineCap cap;
  bool get caps => cap == LineCap.round;

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
    'rgba(0, 0, 255, 0)',
    0.1,
    'royalblue',
    0.3,
    'cyan',
    0.5,
    'lime',
    0.7,
    'yellow',
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
    this.justifyAuto = false,
    this.textPadding,
    this.iconPadding,
    this.textIgnored = false,
    this.keepUpright = true,
    this.textOnGround = false,
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
    this.radialOffset,
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

  /// `text-justify: auto`: lines are flush on the side of the anchor the
  /// text takes, in place of [justify].
  final bool justifyAuto;

  /// Clear space kept around the text and the icon where labels are
  /// weighed against each other, in logical pixels. Null for the package's
  /// own.
  final double? textPadding;
  final double? iconPadding;

  /// The text or icon takes no room from the labels placed after it.
  final bool textIgnored;

  /// `text-keep-upright`: a name along a line is turned half round when it
  /// would read upside down.
  final bool keepUpright;

  /// The text lies on the ground of a tilted map, as MapLibre lays it for
  /// `text-pitch-alignment: map`, or `auto` with text turning with the map,
  /// a name along a line by default: foreshortened, and on the screen as
  /// large as text facing the viewer.
  final bool textOnGround;
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
  /// way it lies, in ems. Set, even to 0, it is used instead of
  /// `text-offset` with variable anchors.
  final double? radialOffset;

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

/// A `background` layer: the whole map filled with a colour or a repeated
/// sprite image.
class BackgroundLayer {
  BackgroundLayer({
    required this.minZoom,
    required this.maxZoom,
    required this.color,
    required this.opacity,
    this.pattern,
  });

  final double minZoom;
  final double maxZoom;
  final Expr color;
  final Expr opacity;

  /// The name of the sprite image repeated over the map, which then takes
  /// the colour's place.
  final Expr? pattern;

  /// The colour at [context] with the layer's opacity, or null where the
  /// layer is not drawn.
  Rgba? colorAt(EvalContext context) {
    if (context.zoom < minZoom || context.zoom >= maxZoom) return null;
    final c = Rgba.of(color(context));
    final o = (asNumber(opacity(context)) ?? 1).clamp(0.0, 1.0);
    return c == null ? null : Rgba(c.r, c.g, c.b, c.a * o);
  }
}

/// A stretch of the style drawn in one go: one raster layer, one background
/// layer, or consecutive paint layers of one source.
class StyleRun {
  const StyleRun.raster(this.raster)
    : background = -1,
      source = -1,
      first = 0,
      end = 0;
  const StyleRun.background(this.background)
    : raster = -1,
      source = -1,
      first = 0,
      end = 0;
  const StyleRun.vector(this.source, this.first, this.end)
    : raster = -1,
      background = -1;

  final int raster;
  final int background;

  /// The vector source of a run of paint layers, or -1.
  final int source;

  /// The paint layers from [first] up to [end].
  final int first;
  final int end;
}

/// A style's root `sky`: the colour above the horizon, and the colour it
/// blends to near the horizon, over a share of half the screen's height;
/// and the fog raised ground fades into towards the horizon.
class SkyPaint {
  SkyPaint({
    required this.skyColor,
    required this.horizonColor,
    required this.skyHorizonBlend,
    required this.fogColor,
    required this.fogGroundBlend,
    required this.horizonFogBlend,
  });

  /// Reads [json], the style's `sky`, with MapLibre's defaults.
  factory SkyPaint.of(Object? json) {
    final sky = json is Map ? json : const {};
    return SkyPaint(
      skyColor: compileExpr(sky['sky-color'] ?? '#88C6FC'),
      horizonColor: compileExpr(sky['horizon-color'] ?? '#ffffff'),
      skyHorizonBlend: compileExpr(sky['sky-horizon-blend'] ?? 0.8),
      fogColor: compileExpr(sky['fog-color'] ?? '#ffffff'),
      fogGroundBlend: compileExpr(sky['fog-ground-blend'] ?? 0.5),
      horizonFogBlend: compileExpr(sky['horizon-fog-blend'] ?? 0.8),
    );
  }

  final Expr skyColor, horizonColor, skyHorizonBlend;
  final Expr fogColor, fogGroundBlend, horizonFogBlend;
}

/// A style document compiled for drawing.
class StyleSheet {
  StyleSheet({
    required this.backgrounds,
    required this.buckets,
    required this.layers,
    required this.symbols,
    required this.sources,
    required this.runs,
    required this.zoomOffset,
    required this.shape,
    required this.sprite,
    this.glyphs,
    this.layerOpacity = const {},
    this.terrain,
    this.sky,
    this.light = const ExtrusionLight(),
    required this.rasters,
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

  /// The heights the root `terrain` raises the ground by, when it has one.
  final TerrainLayer? terrain;

  /// The root `light` buildings are shaded by.
  final ExtrusionLight light;

  /// The root `sky`, drawn above the horizon of a steeply pitched map.
  /// Without one, as in MapLibre, nothing is drawn there.
  final SkyPaint? sky;

  /// The paint layers drawn as a whole at an opacity, `line-layer-opacity`
  /// and the like, by index: each is a run of its own, drawn apart and
  /// laid over what is under it, so its own overlaps do not darken.
  final Map<int, Expr> layerOpacity;

  /// The building layer [run] stands for: a run of its own at the place of
  /// the building layer's fill in the style, so buildings are drawn in the
  /// style's order. Null for any other run.
  ExtrusionLayer? extrusionAt(StyleRun run) =>
      run.source >= 0 ? _extrusionByFill[run.first] : null;

  late final Map<int, ExtrusionLayer> _extrusionByFill = {
    for (final e in extrusions) e.fill: e,
  };

  /// [run]'s opacity as a whole at [context], or null when it is drawn
  /// straight onto the map.
  double? runOpacity(StyleRun run, EvalContext context) {
    if (run.source < 0) return null;
    final opacity = layerOpacity[run.first];
    if (opacity == null) return null;
    return (asNumber(opacity(context)) ?? 1).clamp(0.0, 1.0);
  }

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

  /// The style's `background` layers, in order.
  final List<BackgroundLayer> backgrounds;

  /// The colour of the lowest background layer drawn at [context].
  Rgba? background(EvalContext context) {
    for (final b in backgrounds) {
      if (b.colorAt(context) case final color?) return color;
    }
    return null;
  }

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
