import 'json_equals.dart';

import 'dart:typed_data';

import 'expr.dart';
import 'raster_style.dart';
import 'style_compiler.dart';
import 'style_extrusion.dart';
import 'style_sources.dart';
import 'style_symbols.dart';
import '../tiles/tessellate.dart';

export 'style_symbols.dart';
export 'style_sources.dart';
export 'style_extrusion.dart';

enum BucketKind { fill, line, circle, extrusion }

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
    this.joinBy,
    this.capBy,
    this.miterLimit,
    this.roundLimit,
    this.variantKeys = const [],
    this.extrude,
    this.sortKey,
  });

  /// Set for a bucket of buildings to stand up.
  final Extrude? extrude;

  /// `fill-sort-key` and the like: the features are drawn by it, lowest
  /// first.
  final Expr? sortKey;

  /// Index into the style's sources.
  final int source;
  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final BucketKind kind;

  /// How its lines end.
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

  /// `line-join`, `line-miter-limit` and `line-round-limit` read from each
  /// feature; null where the style gives the join as a constant or leaves
  /// a limit at its default.
  final Expr? joinBy, miterLimit, roundLimit;

  /// `line-cap` read from each feature; null for a constant.
  final Expr? capBy;

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
    this.patternTint,
    this.outline,
  });

  @override
  final Expr? pattern;

  /// `fill-color` of a patterned fill, which tints a pattern that is a
  /// distance field and is left out of any other.
  final Expr? patternTint;

  /// The colour of the outline MapLibre draws round an antialiased fill
  /// that names no `fill-outline-color`; null for none.
  final Expr? outline;

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
    this.dashStops = const [],
    this.dashChoices = const [],
    this.dashPick,
    this.dashCap = DashCap.butt,
    this.pattern,
    this.gradient,
    this.gradientSteps = false,
    this.gap,
    this.outline = false,
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

  /// Lengths of dashes and gaps in turn, in line widths; the first of
  /// [dashStops] when the dashes change with the zoom.
  final Float64List? dash;

  /// The dashes from each zoom up, in order, when they change with it.
  final List<(double, Float64List)> dashStops;

  /// The dash arrays a dasharray read from each feature can take, and the
  /// expression that reads it; empty and null otherwise.
  final List<Float64List> dashChoices;
  final Expr? dashPick;

  /// Which of [dashChoices] the feature [context] is bound to takes, or
  /// null for a dasharray not read from features or none it names.
  int? dashChoiceAt(EvalContext context) {
    final pick = dashPick;
    if (pick == null) return null;
    final value = pick(context);
    if (value is! List) return null;
    for (var i = 0; i < dashChoices.length; i++) {
      final d = dashChoices[i];
      if (d.length != value.length) continue;
      var same = true;
      for (var k = 0; k < d.length && same; k++) {
        same = asNumber(value[k]) == d[k];
      }
      if (same) return i;
    }
    return null;
  }

  /// The dashes for the feature [context] is bound to at [zoom].
  Float64List? dashFor(EvalContext context, double zoom) {
    if (dashPick == null) return dashAt(zoom);
    final i = dashChoiceAt(context);
    return i == null ? null : dashChoices[i];
  }

  /// The dashes at [zoom]. As MapLibre's dash arrays, which do not
  /// blend, each holds from its zoom to the next.
  Float64List? dashAt(double zoom) {
    var at = dash;
    for (final (from, d) in dashStops) {
      if (zoom < from) break;
      at = d;
    }
    return at;
  }

  /// A round or square cap makes every dash half a line width longer at
  /// each end.
  final DashCap dashCap;

  /// `line-gradient`: the colour at each share of the way along a line,
  /// read with `line-progress`.
  final Expr? gradient;

  /// The gradient steps from colour to colour instead of blending, which
  /// MapLibre draws from a ramp as fine as the GPU allows so short steps
  /// along a long line are kept.
  final bool gradientSteps;

  /// `line-gap-width`: the width of the gap down the middle of a line drawn
  /// as two, in logical pixels. [width] spans both sides and the gap.
  final Expr? gap;

  /// A fill's antialiasing outline, drawn as MapLibre's one pixel lines.
  final bool outline;
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
    this.pitchWithMap = false,
    this.scaleWithMap = true,
    this.blur,
  });

  @override
  final Expr width;

  /// The ring around each circle, when the style draws one.
  final CircleRing? ring;

  /// `circle-pitch-alignment` is `map`: on a tilted map the circles lie on
  /// the ground rather than face the screen.
  final bool pitchWithMap;

  /// `circle-pitch-scale` is `map`: farther circles are drawn smaller.
  final bool scaleWithMap;

  /// `circle-blur`, as a share of the radius, when the style sets it.
  final Expr? blur;

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
        jsonEquals(json[1], const ['linear']) &&
        jsonEquals(json[2], const ['heatmap-density'])) {
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
    required this.atmosphereBlend,
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
      atmosphereBlend: compileExpr(sky['atmosphere-blend'] ?? 0.8),
    );
  }

  final Expr skyColor, horizonColor, skyHorizonBlend;
  final Expr fogColor, fogGroundBlend, horizonFogBlend;

  /// How much of the globe's atmosphere is drawn, from 0 to 1.
  final Expr atmosphereBlend;
}

/// A style's root `projection`, as MapLibre reads it: how far from the
/// flat mercator map to the globe at a zoom. `globe` is the globe to zoom
/// 11, mercator from 12 and between the two in between.
class StyleProjection {
  const StyleProjection._(this._stops);

  /// Zooms and how much globe each is, in order; one stop holds at every
  /// zoom, none is mercator.
  final List<(double, double)> _stops;

  static const mercator = StyleProjection._([]);

  static StyleProjection of(Object? json) {
    final type = json is Map ? json['type'] : null;
    final stops = _stopsOf(type);
    return stops == null || stops.isEmpty || stops.every((s) => s.$2 == 0)
        ? mercator
        : StyleProjection._(stops);
  }

  static double? _amount(Object? type) => switch (type) {
    'mercator' => 0,
    'vertical-perspective' => 1,
    _ => null,
  };

  static List<(double, double)>? _stopsOf(Object? type) {
    if (type == 'globe') return const [(11, 1), (12, 0)];
    if (_amount(type) case final amount?) return [(0, amount)];
    if (type case ['interpolate', _, ['zoom'], ...final rest]) {
      final out = <(double, double)>[];
      for (var i = 0; i + 1 < rest.length; i += 2) {
        final zoom = rest[i], amount = _amount(rest[i + 1]);
        if (zoom is! num || amount == null) return null;
        out.add((zoom.toDouble(), amount));
      }
      return out;
    }
    if (type case ['step', ['zoom'], final first, ...final rest]) {
      final firstAmount = _amount(first);
      if (firstAmount == null) return null;
      final out = <(double, double)>[(double.negativeInfinity, firstAmount)];
      for (var i = 0; i + 1 < rest.length; i += 2) {
        final zoom = rest[i], amount = _amount(rest[i + 1]);
        if (zoom is! num || amount == null) return null;
        final z = zoom.toDouble();
        out
          ..add((z - 1e-9, out.last.$2))
          ..add((z, amount));
      }
      return out;
    }
    return null;
  }

  /// Whether the style asks for the globe at some zoom.
  bool get isGlobe => _stops.isNotEmpty;

  /// How much globe at [zoom]: 0 is the flat map, 1 the globe.
  double globeAt(double zoom) {
    final stops = _stops;
    if (stops.isEmpty) return 0;
    if (zoom <= stops.first.$1) return stops.first.$2;
    for (var i = 1; i < stops.length; i++) {
      final (z1, a1) = stops[i];
      if (zoom <= z1) {
        final (z0, a0) = stops[i - 1];
        if (a0 == a1) return a0;
        return a0 + (a1 - a0) * (zoom - z0) / (z1 - z0);
      }
    }
    return stops.last.$2;
  }
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
    List<(String, String)>? spriteSheets,
    this.glyphs,
    this.layerOpacity = const {},
    this.aboveLabels = -1,
    int? labelsRun,
    this.terrain,
    this.sky,
    this.projection = StyleProjection.mercator,
    this.light = const ExtrusionLight(),
    required this.rasters,
    required this.attributions,
    this.extrusions = const [],
    this.footprints = const {},
  }) : labelsRun = labelsRun ?? runs.length,
       spriteSheets = spriteSheets ?? [if (sprite != null) ('', sprite)];

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

  /// The root `projection`.
  final StyleProjection projection;

  /// The first of [layers] after the style's last symbol layer, which, as
  /// MapLibre draws in the style's order, goes over the labels; -1 when the
  /// style has no symbol layer.
  final int aboveLabels;

  /// The first of [runs] drawn over the labels, of any kind: the first after
  /// the style's last symbol layer, or the run count.
  final int labelsRun;

  /// Whether [run] is drawn over the labels.
  bool overLabels(StyleRun run) =>
      aboveLabels >= 0 && run.source >= 0 && run.first >= aboveLabels;

  /// The paint layers drawn as a whole at an opacity, `line-layer-opacity`
  /// and the like, by index: each is a run of its own, drawn apart and
  /// laid over what is under it, so its own overlaps do not darken.
  final Map<int, Expr> layerOpacity;

  /// The building layer [run] stands for: a run of its own at the place of
  /// the building layer's fill in the style, so buildings are drawn in the
  /// style's order. Null for any other run.
  ExtrusionLayer? extrusionAt(StyleRun run) =>
      run.source >= 0 ? _extrusionByFill[run.first] : null;

  /// Whether a line layer of the style has dashes.
  late final bool dashed = layers.any(
    (l) =>
        l is LineLayer &&
        (l.dash != null || l.dashStops.isNotEmpty || l.dashChoices.isNotEmpty),
  );

  /// The sources with buildings to stand up.
  late final Set<int> buildingSources = {
    for (final e in extrusions) buckets[e.bucket].source,
  };

  /// The sources whose buildings are built from `feature-state`.
  late final Set<int> stateBuiltSources = {
    for (final b in buckets)
      if (b.extrude?.readsState ?? false) b.source,
  };

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

  /// Every sprite sheet of a style that names several: the prefix its
  /// images are named by, `id:` or none for the one called `default`, and
  /// its address.
  final List<(String, String)> spriteSheets;

  /// The style's glyph ranges, with `{fontstack}` and `{range}` in it.
  final String? glyphs;

  /// Raster layers, each drawn where [runs] puts it.
  final List<RasterLayer> rasters;
}

/// The key a feature's state is kept under, as MapLibre keeps it under
/// `String(id)`: the number 1 and the string "1" name the same feature.
String featureStateKey(Object? id) => switch (id) {
  final double d when d.isFinite && d == d.truncateToDouble() =>
    d.toInt().toString(),
  _ => '$id',
};

/// [style] with each layer that names another in `ref` given that layer's
/// type, source, source layer, zoom range, filter and layout, as the
/// style spec's derefLayers resolves the old `ref` property. Unchanged when
/// no layer has one.
Map<String, Object?> derefLayers(Map<String, Object?> style) {
  final layers = style['layers'];
  if (layers is! List || !layers.any((l) => l is Map && l['ref'] != null)) {
    return style;
  }
  const shared = [
    'type',
    'source',
    'source-layer',
    'minzoom',
    'maxzoom',
    'filter',
    'layout',
  ];
  final byId = {
    for (final l in layers)
      if (l is Map) l['id']: l,
  };
  return {
    ...style,
    'layers': [
      for (final l in layers)
        if (l is Map && l['ref'] != null && byId[l['ref']] is Map)
          <String, Object?>{
            for (final e in l.entries)
              if (e.key != 'ref') '${e.key}': e.value,
            for (final k in shared)
              if ((byId[l['ref']] as Map).containsKey(k))
                k: (byId[l['ref']] as Map)[k],
          }
        else
          l,
    ],
  };
}
