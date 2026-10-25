import 'dart:typed_data';

import '../tiles/cluster.dart';
import 'expr.dart';
import '../net/net.dart';
import 'raster_style.dart';
import 'style_model.dart';
import 'style_layers.dart';
import 'style_reading.dart';

/// Turns a MapLibre style document into a [StyleSheet], one layer at a time.
class StyleCompiler {
  StyleCompiler(this.json, {this.nameKeys, this.zoomOffset = 0})
    : _sources = jsonMap(json['sources']),
      _vectors = VectorLayers(
        nameKeys,
        StyleProjection.of(json['projection']).isGlobe
            ? '$zoomOffset globe'
            : '$zoomOffset',
      );

  final Map<String, Object?> json;
  final List<String>? nameKeys;
  final double zoomOffset;

  final Map<Object?, Object?> _sources;
  final List<VectorSource> _vectorSources = [];
  final Map<Object?, int?> _sourceIndex = {};
  final VectorLayers _vectors;
  final List<RasterLayer> _rasters = [];

  final List<BackgroundLayer> _backgrounds = [];

  /// Each raster and background layer's run, with how many paint layers
  /// come before it.
  final List<(int, StyleRun)> _alone = [];

  StyleSheet compile() {
    for (final raw in jsonList(json['layers'])) {
      if (raw is! Map) continue;
      final layer = LayerJson(raw);
      if (layer.hidden) continue;
      if (VectorLayers.draws(layer.type)) {
        final before = _vectors.layers.length;
        if (_vector(layer) case final vector?) _vectors.add(vector);
        if (layer.type == 'symbol') {
          _aboveLabels = _vectors.layers.length;
          _labelsAt = (_backgrounds.length, _rasters.length);
        }
        final whole = layer.paint['${layer.type}-layer-opacity'];
        if (whole != null) {
          final opacity = compileExpr(whole);
          for (var i = before; i < _vectors.layers.length; i++) {
            _layerOpacity[i] = opacity;
          }
        }
      } else if (layer.type == 'background') {
        _addBackground(layer);
      } else if (layer.type == 'raster' ||
          layer.type == 'hillshade' ||
          layer.type == 'color-relief') {
        _addRaster(layer);
      }
    }
    final runs = _runs();
    final sprite = json['sprite'];
    final footprints = _vectors.footprints();
    return StyleSheet(
      terrain: _terrain(),
      sky: json['sky'] == null ? null : SkyPaint.of(json['sky']),
      projection: StyleProjection.of(json['projection']),
      light: ExtrusionLight.of(json['light']),
      layerOpacity: _layerOpacity,
      aboveLabels: _aboveLabels,
      backgrounds: _backgrounds,
      buckets: _vectors.buckets,
      layers: _vectors.layers,
      symbols: _vectors.symbols,
      sources: _vectorSources,
      runs: runs,
      labelsRun: _labelsRun(runs),
      zoomOffset: zoomOffset,
      shape: _vectors.shape.toString(),
      sprite: switch (sprite) {
        final String url => url,
        [{'url': final String url}, ...] => url,
        _ => null,
      },
      spriteSheets: [
        if (sprite is String) ('', sprite),
        if (sprite is List)
          for (final s in sprite)
            if (s case {'id': final String id, 'url': final String url})
              (id == 'default' ? '' : '$id:', url),
      ],
      glyphs: jsonString(json['glyphs']),
      rasters: _rasters,
      extrusions: _vectors.extrusions,
      footprints: footprints,
      attributions: {
        for (final s in _sources.values)
          if (s is Map && s['attribution'] is String)
            s['attribution'] as String,
      }.toList(),
    );
  }

  VectorLayerJson? _vector(LayerJson layer) {
    final source = _sourceOf(layer.raw['source']);
    if (source == null) return null;
    final named = layer.raw['source-layer'];
    if (named is! String && _vectorSources[source] is! GeoJsonSource) {
      return null;
    }
    return VectorLayerJson(layer, source, named is String ? named : '');
  }

  int? _sourceOf(Object? name) => _sourceIndex.putIfAbsent(name, () {
    final from = _sources[name];
    if (from is! Map) return null;
    final geoJson = from['type'] == 'geojson';
    if (!geoJson && from['type'] != 'vector') return null;
    final direct = tileTemplate(from['tiles']);
    final data = from['data'];
    final maxZoom = jsonInt(from['maxzoom']);
    final cluster = geoJson && from['cluster'] == true
        ? ClusterOptions(
            radius: asNumber(from['clusterRadius'])?.toDouble() ?? 50,
            maxZoom: (jsonInt(from['clusterMaxZoom']) ?? (maxZoom ?? 18) - 1)
                .clamp(0, 24),
            minPoints: jsonInt(from['clusterMinPoints']) ?? 2,
            properties: switch (from['clusterProperties']) {
              final Map<Object?, Object?> named => {
                for (final e in named.entries) '${e.key}': e.value,
              },
              _ => const {},
            },
          )
        : null;
    _vectorSources.add(
      geoJson
          ? GeoJsonSource(
              name: '$name',
              data: data,
              maxZoom: maxZoom,
              cluster: cluster,
              promoteId: from['promoteId'],
              generateId: from['generateId'] == true,
              filter: from['filter'],
              buffer: asNumber(from['buffer'])?.toDouble(),
              signature:
                  'g|${data is String ? data : identityHashCode(data)}'
                  '|${cluster?.signature}|${from['promoteId']}'
                  '|${from['generateId']}|${jsonText(from['filter'])}'
                  '|${from['buffer']}',
            )
          : TiledSource(
              name: '$name',
              tileJsonUrl: jsonString(from['url']),
              tiles: direct,
              maxZoom: maxZoom,
              promoteId: from['promoteId'],
              cover: TileCover.of(from),
              mlt: from['encoding'] == 'mlt',
              signature:
                  'v|${from['url']}|$direct|${from['promoteId']}'
                  '|${TileCover.of(from).signature}|${from['encoding']}',
            ),
    );
    return _vectorSources.length - 1;
  });

  void _addBackground(LayerJson layer) {
    final paint = layer.paint;
    final picture = paint['background-pattern'];
    _alone.add((
      _vectors.layers.length,
      StyleRun.background(_backgrounds.length),
    ));
    _backgrounds.add(
      BackgroundLayer(
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: exprOr(paint['background-color'], '#000000'),
        opacity: exprOr(paint['background-opacity'], 1),
        pattern: picture == null ? null : compileImage(picture),
      ),
    );
  }

  static const _adjustKeys = {
    'raster-hue-rotate',
    'raster-saturation',
    'raster-contrast',
    'raster-brightness-min',
    'raster-brightness-max',
  };

  void _addRaster(LayerJson layer) {
    final paint = layer.paint;
    final from = _sources[layer.raw['source']];
    if (from is! Map) return;
    final adjust = !paint.keys.any(_adjustKeys.contains)
        ? null
        : RasterAdjust(
            hueRotate: exprOr(paint['raster-hue-rotate'], 0),
            saturation: exprOr(paint['raster-saturation'], 0),
            contrast: exprOr(paint['raster-contrast'], 0),
            brightnessMin: exprOr(paint['raster-brightness-min'], 0),
            brightnessMax: exprOr(paint['raster-brightness-max'], 1),
          );
    final nearest = paint['raster-resampling'] == 'nearest';
    final resampling = exprOrNull(paint['resampling']);
    final opacity = exprOr(paint['raster-opacity'], 1);
    final tileJsonUrl = jsonString(from['url']);
    final tiles = tileTemplate(from['tiles']);
    final tileSize = asNumber(from['tileSize']) ?? 512;
    final sourceMaxZoom = jsonInt(from['maxzoom']);
    final RasterLayer? made = switch ((layer.type, from['type'])) {
      ('raster', 'image') => switch (cornersOf(from['coordinates'])) {
        final corners? when tileJsonUrl != null => ImageLayer(
          minZoom: layer.minZoom,
          maxZoom: layer.maxZoom,
          opacity: opacity,
          picture: tileJsonUrl,
          corners: corners,
          nearest: nearest,
          adjust: adjust,
          resampling: resampling,
        ),
        _ => null,
      },
      ('raster', 'raster') => PictureTileLayer(
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        opacity: opacity,
        tileJsonUrl: tileJsonUrl,
        tiles: tiles,
        tileSize: tileSize,
        sourceMaxZoom: sourceMaxZoom,
        cover: TileCover.of(from),
        nearest: nearest,
        adjust: adjust,
        resampling: resampling,
        fadeMs: (asNumber(paint['raster-fade-duration']) ?? 300)
            .toDouble()
            .clamp(0, double.infinity),
      ),
      ('hillshade', 'raster-dem') => HillshadeLayer(
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        opacity: compileExpr(1),
        tileJsonUrl: tileJsonUrl,
        tiles: tiles,
        tileSize: tileSize,
        sourceMaxZoom: sourceMaxZoom,
        cover: TileCover.of(from),
        resampling: resampling,
        relief: ReliefPaint(
          terrarium: from['encoding'] == 'terrarium',
          exaggeration: exprOr(paint['hillshade-exaggeration'], 0.5),
          shadow: compileExpr('#000000'),
          highlight: compileExpr('#ffffff'),
          direction: 335,
          shadows: coloursOf(paint['hillshade-shadow-color'], '#000000'),
          highlights: coloursOf(paint['hillshade-highlight-color'], '#ffffff'),
          accent: exprOrNull(paint['hillshade-accent-color']),
          method: '${paint['hillshade-method'] ?? 'standard'}',
          directions: numbersOf(paint['hillshade-illumination-direction'], 335),
          altitudes: numbersOf(paint['hillshade-illumination-altitude'], 45),
        ),
      ),
      ('color-relief', 'raster-dem') => _colorRelief(
        layer,
        from,
        tileJsonUrl: tileJsonUrl,
        tiles: tiles,
        tileSize: tileSize,
        sourceMaxZoom: sourceMaxZoom,
      ),
      _ => null,
    };
    if (made == null) return;
    _alone.add((_vectors.layers.length, StyleRun.raster(_rasters.length)));
    _rasters.add(made);
  }

  ColorReliefLayer _colorRelief(
    LayerJson layer,
    Map<Object?, Object?> from, {
    required String? tileJsonUrl,
    required String? tiles,
    required num tileSize,
    required int? sourceMaxZoom,
  }) {
    final paint = layer.paint;
    final elevations = <double>[];
    final colors = <double>[];
    // As MapLibre, the ramp is the colours at the stops of an `interpolate`
    // over the elevation, blended in straight lines between them.
    if (paint['color-relief-color'] case [
      'interpolate',
      _,
      ['elevation'],
      ...final stops,
    ]) {
      final context = EvalContext();
      for (var i = 0; i + 1 < stops.length; i += 2) {
        final at = asNumber(stops[i]);
        if (at == null) continue;
        final c =
            Rgba.of(compileExpr(stops[i + 1])(context)) ?? Rgba.transparent;
        elevations.add(at.toDouble());
        colors.addAll([c.r * c.a, c.g * c.a, c.b * c.a, c.a]);
      }
    }
    if (elevations.isEmpty) {
      elevations.add(0);
      colors.addAll([0, 0, 0, 0]);
    }
    if (elevations.length < 2) {
      elevations.add(elevations.first + 1);
      colors.addAll(colors.sublist(0, 4));
    }
    return ColorReliefLayer(
      minZoom: layer.minZoom,
      maxZoom: layer.maxZoom,
      opacity: exprOr(paint['color-relief-opacity'], 1),
      tileJsonUrl: tileJsonUrl,
      tiles: tiles,
      tileSize: tileSize.toDouble(),
      sourceMaxZoom: sourceMaxZoom,
      cover: TileCover.of(from),
      encoding: DemEncoding.of(from),
      elevations: Float64List.fromList(elevations),
      colors: Float64List.fromList(colors),
      resampling: exprOr(paint['resampling'], 'linear'),
    );
  }

  /// Paint layers in runs of one source, broken by every raster layer and
  /// around layers that spill past their tiles or glow.
  final Map<int, Expr> _layerOpacity = {};

  /// The first paint layer after the style's last symbol layer.
  int _aboveLabels = -1;

  /// The backgrounds and rasters there were when the last symbol layer
  /// came, those after it being drawn over the labels.
  (int, int)? _labelsAt;

  /// The first of [runs] drawn over the labels: the first after the
  /// style's last symbol layer, or the run count when nothing is.
  int _labelsRun(List<StyleRun> runs) {
    final at = _labelsAt;
    if (at == null) return runs.length;
    final (backgrounds, rasters) = at;
    for (var i = 0; i < runs.length; i++) {
      final run = runs[i];
      if ((run.source >= 0 && run.first >= _aboveLabels) ||
          (run.background >= 0 && run.background >= backgrounds) ||
          (run.raster >= 0 && run.raster >= rasters)) {
        return i;
      }
    }
    return runs.length;
  }

  /// The root `terrain`: its `raster-dem` source and exaggeration.
  TerrainLayer? _terrain() {
    final terrain = json['terrain'];
    if (terrain is! Map) return null;
    final from = _sources[terrain['source']];
    if (from is! Map || from['type'] != 'raster-dem') return null;
    return TerrainLayer(
      opacity: compileExpr(1),
      tileJsonUrl: jsonString(from['url']),
      tiles: tileTemplate(from['tiles']),
      tileSize: asNumber(from['tileSize']) ?? 512,
      sourceMaxZoom: jsonInt(from['maxzoom']),
      cover: TileCover.of(from),
      terrarium: from['encoding'] == 'terrarium',
      exaggeration: (asNumber(terrain['exaggeration']) ?? 1).toDouble(),
    );
  }

  static bool _standsAlone(PaintLayer layer) =>
      layer is FillLayer && layer.extruded;

  List<StyleRun> _runs() {
    final layers = _vectors.layers;
    final runs = <StyleRun>[];
    var nextAlone = 0;
    var runStart = 0;
    int sourceAt(int i) => _vectors.buckets[layers[i].bucket].source;
    void closeRun(int end) {
      if (end > runStart) {
        runs.add(StyleRun.vector(sourceAt(runStart), runStart, end));
      }
      runStart = end;
    }

    for (var i = 0; i <= layers.length; i++) {
      while (nextAlone < _alone.length && _alone[nextAlone].$1 == i) {
        closeRun(i);
        runs.add(_alone[nextAlone++].$2);
      }
      if (i == layers.length ||
          (i > runStart &&
              (sourceAt(i) != sourceAt(runStart) ||
                  i == _aboveLabels ||
                  layers[i].spills != layers[runStart].spills ||
                  layers[i] is HeatmapLayer ||
                  layers[runStart] is HeatmapLayer ||
                  ((_layerOpacity.containsKey(i) ||
                          _layerOpacity.containsKey(runStart)) &&
                      layers[i].id != layers[i - 1].id) ||
                  _standsAlone(layers[i]) ||
                  _standsAlone(layers[runStart])))) {
        closeRun(i);
      }
    }
    return runs;
  }
}
