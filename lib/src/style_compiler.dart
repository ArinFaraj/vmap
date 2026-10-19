import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'cluster.dart';
import 'expr.dart';
import 'mercator.dart';
import 'net.dart';
import 'raster_style.dart';
import 'style_model.dart';
import 'tessellate.dart';

/// What every layer of a style document says the same way.
class _Layer {
  _Layer(Map<Object?, Object?> raw)
    : id = '${raw['id'] ?? ''}',
      type = raw['type'],
      raw = raw,
      paint = (raw['paint'] as Map?) ?? const {},
      layout = (raw['layout'] as Map?) ?? const {},
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
class _VectorLayer {
  _VectorLayer(this.layer, this.source, this.sourceLayer)
    : filter = layer.raw['filter'];

  final _Layer layer;
  final int source;
  final String sourceLayer;
  final Object? filter;
}

/// Turns a MapLibre style document into a [StyleSheet], one layer at a time.
class StyleCompiler {
  StyleCompiler(this.json, {this.nameKeys, this.zoomOffset = 0})
    : _sources = (json['sources'] as Map?) ?? const {},
      _shape = StringBuffer(
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
  final List<Bucket> _buckets = [];
  final Map<String, int> _bucketIndex = {};
  final List<PaintLayer> _layers = [];
  final List<SymbolLayer> _symbols = [];
  final List<RasterLayer> _rasters = [];
  final List<ExtrusionLayer> _extrusions = [];

  final List<BackgroundLayer> _backgrounds = [];

  /// Each raster and background layer's run, with how many paint layers
  /// come before it.
  final List<(int, StyleRun)> _alone = [];
  final StringBuffer _shape;

  /// See [StyleSheet.footprints]. Widens each footprint's bucket by a zoom,
  /// so tiles past the footprints' range still carry them.
  Map<int, ExtrusionLayer> _footprints() {
    final found = <int, ExtrusionLayer>{};
    for (final (p, layer) in _layers.indexed) {
      if (layer is! FillLayer || layer.extruded) continue;
      final flat = _buckets[layer.bucket];
      for (final building in _extrusions) {
        final tall = _buckets[building.bucket];
        if (layer.maxZoom != building.minZoom ||
            flat.source != tall.source ||
            flat.sourceLayer != tall.sourceLayer) {
          continue;
        }
        found[p] = building;
        flat.maxZoom = math.max(flat.maxZoom, layer.maxZoom + 1);
        break;
      }
    }
    return found;
  }

  StyleSheet compile() {
    for (final raw in (json['layers'] as List?) ?? const []) {
      if (raw is! Map) continue;
      final layer = _Layer(raw);
      if (layer.hidden) continue;
      final add = switch (layer.type) {
        'symbol' => _addSymbol,
        'heatmap' => _addHeatmap,
        'circle' => _addCircle,
        'line' => _addLine,
        'fill' || 'fill-extrusion' => _addFill,
        _ => null,
      };
      if (add != null) {
        final before = _layers.length;
        if (_vector(layer) case final vector?) add(vector);
        if (layer.type == 'symbol') {
          _aboveLabels = _layers.length;
          _labelsAt = (_backgrounds.length, _rasters.length);
        }
        final whole = layer.paint['${layer.type}-layer-opacity'];
        if (whole != null) {
          final opacity = compileExpr(whole);
          for (var i = before; i < _layers.length; i++) {
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
    final footprints = _footprints();
    return StyleSheet(
      terrain: _terrain(),
      sky: json['sky'] == null ? null : SkyPaint.of(json['sky']),
      projection: StyleProjection.of(json['projection']),
      light: ExtrusionLight.of(json['light']),
      layerOpacity: _layerOpacity,
      aboveLabels: _aboveLabels,
      backgrounds: _backgrounds,
      buckets: _buckets,
      layers: _layers,
      symbols: _symbols,
      sources: _vectorSources,
      runs: runs,
      labelsRun: _labelsRun(runs),
      zoomOffset: zoomOffset,
      shape: _shape.toString(),
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
      glyphs: json['glyphs'] as String?,
      rasters: _rasters,
      extrusions: _extrusions,
      footprints: footprints,
      attributions: {
        for (final s in _sources.values)
          if (s is Map && s['attribution'] is String)
            s['attribution'] as String,
      }.toList(),
    );
  }

  _VectorLayer? _vector(_Layer layer) {
    final source = _sourceOf(layer.raw['source']);
    if (source == null) return null;
    final named = layer.raw['source-layer'];
    if (named is! String && _vectorSources[source] is! GeoJsonSource) {
      return null;
    }
    return _VectorLayer(layer, source, named is String ? named : '');
  }

  int? _sourceOf(Object? name) => _sourceIndex.putIfAbsent(name, () {
    final from = _sources[name];
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
    _vectorSources.add(
      geoJson
          ? GeoJsonSource(
              name: '$name',
              data: data,
              maxZoom: maxZoom,
              cluster: cluster,
              promoteId: from['promoteId'],
              generateId: from['generateId'] == true,
              signature:
                  'g|${data is String ? data : identityHashCode(data)}'
                  '|${cluster?.signature}|${from['promoteId']}'
                  '|${from['generateId']}',
            )
          : TiledSource(
              name: '$name',
              tileJsonUrl: from['url'] as String?,
              tiles: direct,
              maxZoom: maxZoom,
              promoteId: from['promoteId'],
              cover: TileCover.of(from),
              signature:
                  'v|${from['url']}|$direct|${from['promoteId']}'
                  '|${TileCover.of(from).signature}',
            ),
    );
    return _vectorSources.length - 1;
  });

  void _addBackground(_Layer layer) {
    final paint = layer.paint;
    final picture = paint['background-pattern'];
    _alone.add((_layers.length, StyleRun.background(_backgrounds.length)));
    _backgrounds.add(
      BackgroundLayer(
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: _withDefault(paint['background-color'], '#000000'),
        opacity: _withDefault(paint['background-opacity'], 1),
        pattern: picture == null ? null : compileText(picture),
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

  void _addRaster(_Layer layer) {
    final paint = layer.paint;
    final from = _sources[layer.raw['source']];
    if (from is! Map) return;
    final adjust = !paint.keys.any(_adjustKeys.contains)
        ? null
        : RasterAdjust(
            hueRotate: _withDefault(paint['raster-hue-rotate'], 0),
            saturation: _withDefault(paint['raster-saturation'], 0),
            contrast: _withDefault(paint['raster-contrast'], 0),
            brightnessMin: _withDefault(paint['raster-brightness-min'], 0),
            brightnessMax: _withDefault(paint['raster-brightness-max'], 1),
          );
    final nearest = paint['raster-resampling'] == 'nearest';
    final opacity = _withDefault(paint['raster-opacity'], 1);
    final tileJsonUrl = from['url'] as String?;
    final tiles = tileTemplate(from['tiles']);
    final tileSize = asNumber(from['tileSize']) ?? 512;
    final sourceMaxZoom = asNumber(from['maxzoom'])?.toInt();
    final RasterLayer? made = switch ((layer.type, from['type'])) {
      ('raster', 'image') => switch (_corners(from['coordinates'])) {
        final corners? when tileJsonUrl != null => ImageLayer(
          minZoom: layer.minZoom,
          maxZoom: layer.maxZoom,
          opacity: opacity,
          picture: tileJsonUrl,
          corners: corners,
          nearest: nearest,
          adjust: adjust,
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
        relief: ReliefPaint(
          terrarium: from['encoding'] == 'terrarium',
          exaggeration: _withDefault(paint['hillshade-exaggeration'], 0.5),
          shadow: compileExpr('#000000'),
          highlight: compileExpr('#ffffff'),
          direction: 335,
          shadows: _colours(paint['hillshade-shadow-color'], '#000000'),
          highlights: _colours(paint['hillshade-highlight-color'], '#ffffff'),
          accent: _maybe(paint['hillshade-accent-color']),
          method: '${paint['hillshade-method'] ?? 'standard'}',
          directions: _numbers(paint['hillshade-illumination-direction'], 335),
          altitudes: _numbers(paint['hillshade-illumination-altitude'], 45),
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
    _alone.add((_layers.length, StyleRun.raster(_rasters.length)));
    _rasters.add(made);
  }

  ColorReliefLayer _colorRelief(
    _Layer layer,
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
      opacity: _withDefault(paint['color-relief-opacity'], 1),
      tileJsonUrl: tileJsonUrl,
      tiles: tiles,
      tileSize: tileSize.toDouble(),
      sourceMaxZoom: sourceMaxZoom,
      cover: TileCover.of(from),
      encoding: DemEncoding.of(from),
      elevations: Float64List.fromList(elevations),
      colors: Float64List.fromList(colors),
      resampling: _withDefault(paint['resampling'], 'linear'),
    );
  }

  static const _symbolPaintReads = [
    'text-color',
    'text-opacity',
    'text-halo-color',
    'text-halo-width',
    'text-halo-blur',
    'icon-color',
    'icon-opacity',
  ];

  void _addSymbol(_VectorLayer vector) {
    final _VectorLayer(:layer, :source, :sourceLayer, :filter) = vector;
    final paint = layer.paint;
    final layout = layer.layout;
    var field = layout['text-field'];
    final image = layout['icon-image'];
    final hasText = field != null && field != '';
    final hasIcon = image != null && image != '';
    if (!hasText && !hasIcon) return;
    final nameKeys = this.nameKeys;
    if (hasText && nameKeys != null && jsonEncode(field).contains('name')) {
      field = [
        'coalesce',
        for (final k in nameKeys) ['get', k],
      ];
    }
    final font = jsonEncode(layout['text-font'] ?? '').toLowerCase();
    final offset = _pair(layout['text-offset']);
    final placement = layout['symbol-placement'] ?? 'point';
    final spacing = asNumber(layout['symbol-spacing']) ?? 250;
    final textUpright = layout['text-rotation-alignment'] == 'viewport';
    final iconUpright = layout['icon-rotation-alignment'] == 'viewport';
    final anchor = layout['text-anchor'];
    final (anchors, anchorOffsets) = _anchorOffsets(
      layout['text-variable-anchor-offset'],
      layout['text-variable-anchor'],
    );
    final iconAnchor = layout['icon-anchor'];
    final iconOffset = _pair(layout['icon-offset']);
    final paintKeys = <String>{};
    for (final p in _symbolPaintReads) {
      _reads(paint[p], paintKeys);
    }
    _reads(layout['text-size'], paintKeys);
    _reads(layout['icon-size'], paintKeys);
    _reads(layout['icon-offset'], paintKeys);
    _reads(layout['text-offset'], paintKeys);
    final build = SymbolBuild({
      SymbolBuild.sourceKey: source,
      SymbolBuild.sourceLayerKey: sourceLayer,
      SymbolBuild.filterKey: filter,
      SymbolBuild.textKey: hasText ? field : null,
      SymbolBuild.iconKey: hasIcon ? image : null,
      SymbolBuild.placementKey: placement,
      SymbolBuild.spacingKey: spacing,
      SymbolBuild.textUprightKey: textUpright,
      SymbolBuild.iconUprightKey: iconUpright,
      SymbolBuild.minZoomKey: layer.minZoom,
      SymbolBuild.maxZoomKey: layer.maxZoom,
      SymbolBuild.sortKeyKey: layout['symbol-sort-key'],
      SymbolBuild.iconRotateKey: layout['icon-rotate'] ?? 0,
      SymbolBuild.paintKeysKey: paintKeys.toList()..sort(),
    });
    _symbols.add(
      SymbolLayer(
        id: layer.id,
        build: build,
        size: _withDefault(layout['text-size'], 16),
        color: _withDefault(paint['text-color'], '#000000'),
        opacity: _withDefault(paint['text-opacity'], 1),
        haloColor: compileExpr(paint['text-halo-color']),
        haloWidth: _withDefault(paint['text-halo-width'], 0),
        weight: _weight(font),
        italic: font.contains('italic') || font.contains('oblique'),
        fontStack: _fontStack(layout['text-font']),
        uppercase: layout['text-transform'] == 'uppercase',
        writingModes: placement == 'point'
            ? switch (layout['text-writing-mode']) {
                final List modes => [
                  for (final m in modes)
                    if (m == 'vertical' || m == 'horizontal') m == 'vertical',
                ],
                _ => const [],
              }
            : const [],
        letterSpacing: asNumber(layout['text-letter-spacing']) ?? 0,
        lineHeight: asNumber(layout['text-line-height']),
        justify: switch (layout['text-justify']) {
          'left' => ui.TextAlign.left,
          'right' => ui.TextAlign.right,
          _ => ui.TextAlign.center,
        },
        justifyAuto: layout['text-justify'] == 'auto',
        textPadding: asNumber(layout['text-padding']),
        textAlongMap: layout['text-rotation-alignment'] == 'map',
        iconPadding: asNumber(layout['icon-padding']),
        textIgnored: layout['text-ignore-placement'] == true,
        textOnGround: switch (layout['text-pitch-alignment']) {
          'map' => true,
          'viewport' => false,
          _ => switch (layout['text-rotation-alignment']) {
            'map' => true,
            'viewport' => false,
            _ => placement is String && placement.startsWith('line'),
          },
        },
        keepUpright: layout['text-keep-upright'] != false,
        iconIgnored: layout['icon-ignore-placement'] == true,
        haloBlur: _withDefault(paint['text-halo-blur'], 0),
        maxWidth: asNumber(layout['text-max-width']) ?? 10,
        iconSize: _withDefault(layout['icon-size'], 1),
        iconOpacity: _withDefault(paint['icon-opacity'], 1),
        iconColor: _withDefault(paint['icon-color'], '#000000'),
        textRotate: asNumber(layout['text-rotate']) ?? 0,
        anchor: anchor is String ? anchor : 'center',
        offsetX: offset.$1,
        offsetY: offset.$2,
        offsetBy: _isPair(layout['text-offset'])
            ? null
            : compileExpr(layout['text-offset']),
        textOptional: layout['text-optional'] == true,
        iconOptional: layout['icon-optional'] == true,
        iconOverlaps: _overlap(layout, 'icon') == 'always',
        textOverlaps: _overlap(layout, 'text') == 'always',
        iconCooperative: _overlap(layout, 'icon') == 'cooperative',
        textCooperative: _overlap(layout, 'text') == 'cooperative',
        drawnByScreenY: _drawnByScreenY(layout),
        drawnByKey: layout['symbol-sort-key'] != null,
        iconSizeByFeature: _readsAny(layout['icon-size']),
        textFit: (layout['icon-text-fit'] ?? 'none') != 'none',
        iconTextFit: switch (layout['icon-text-fit']) {
          final String fit => fit,
          _ => 'none',
        },
        iconTextFitPadding: switch (layout['icon-text-fit-padding']) {
          [final num t, final num r, final num b, final num l] => [
            t.toDouble(),
            r.toDouble(),
            b.toDouble(),
            l.toDouble(),
          ],
          _ => const [0, 0, 0, 0],
        },
        anchors: anchors,
        anchorOffsets: anchorOffsets,
        radialOffset: asNumber(layout['text-radial-offset'])?.toDouble(),
        iconAnchor: iconAnchor is String ? iconAnchor : 'center',
        iconOffsetX: iconOffset.$1,
        iconOffsetBy: _isPair(layout['icon-offset'])
            ? null
            : compileExpr(layout['icon-offset']),
        iconOffsetY: iconOffset.$2,
        textTranslate: _maybe(paint['text-translate']),
        textTranslateOnScreen: paint['text-translate-anchor'] == 'viewport',
        iconHaloColor: _maybe(paint['icon-halo-color']),
        iconHaloWidth: _maybe(paint['icon-halo-width']),
        iconTranslate: _maybe(paint['icon-translate']),
        iconHaloBlur: _maybe(paint['icon-halo-blur']),
        iconTranslateOnScreen: paint['icon-translate-anchor'] == 'viewport',
        maxBend: switch (asNumber(layout['text-max-angle'])) {
          final degrees? => degrees * math.pi / 180,
          null => null,
        },
      ),
    );
    _shape.write(jsonEncode(['s', build.signature]));
  }

  void _addHeatmap(_VectorLayer vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final radius = _withDefault(paint['heatmap-radius'], 30);
    _layers.add(
      HeatmapLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(
          vector,
          BucketKind.circle,
          _readsOf(paint, const ['heatmap-weight', 'heatmap-radius']),
        ),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: compileExpr('#ffffff'),
        opacity: _withDefault(paint['heatmap-opacity'], 1),
        width: (c) => (asNumber(radius(c)) ?? 30) * 2,
        heat: HeatPaint.of(
          weight: _withDefault(paint['heatmap-weight'], 1),
          intensity: _withDefault(paint['heatmap-intensity'], 1),
          color: paint['heatmap-color'],
        ),
      ),
    );
  }

  void _addCircle(_VectorLayer vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final names = _readsOf(paint, const [
      'circle-color',
      'circle-opacity',
      'circle-radius',
      'circle-stroke-color',
      'circle-stroke-width',
      'circle-stroke-opacity',
      'circle-blur',
    ]);
    final radius = _withDefault(paint['circle-radius'], 5);
    final ring = paint['circle-stroke-width'];
    _layers.add(
      CircleLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(vector, BucketKind.circle, names),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: _withDefault(paint['circle-color'], '#000000'),
        opacity: _withDefault(paint['circle-opacity'], 1),
        width: (c) => (asNumber(radius(c)) ?? 5) * 2,
        ring: ring == null
            ? null
            : CircleRing(
                color: _withDefault(paint['circle-stroke-color'], '#000000'),
                width: compileExpr(ring),
                opacity: _withDefault(paint['circle-stroke-opacity'], 1),
              ),
        perFeature: names.isNotEmpty,
        pitchWithMap: paint['circle-pitch-alignment'] == 'map',
        scaleWithMap: paint['circle-pitch-scale'] != 'viewport',
        blur: paint['circle-blur'] == null
            ? null
            : compileExpr(paint['circle-blur']),
      ),
    );
  }

  void _addLine(_VectorLayer vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final layout = layer.layout;
    final names = _readsOf(paint, const [
      'line-color',
      'line-opacity',
      'line-width',
      'line-gap-width',
      'line-offset',
      'line-blur',
      'line-pattern',
      'line-dasharray',
    ]);
    final beside = paint['line-offset'];
    final blur = paint['line-blur'];
    // A gradient line drawn beside its centre line keeps its gradient and
    // drops its dashes: its vertices have room for one or the other.
    final dashJson = paint['line-gradient'] != null && beside != null
        ? null
        : paint['line-dasharray'];
    final dashStops = _dashStops(dashJson);
    // A dasharray read from each feature is one of the arrays written in
    // its expression.
    final dashChoices = dashStops.isEmpty && _dash(dashJson) == null
        ? _dashLiterals(dashJson)
        : const <Float64List>[];
    final dash = dashStops.isNotEmpty
        ? dashStops.first.$2
        : dashChoices.isNotEmpty
        ? dashChoices.first
        : _dash(dashJson);
    final own = _withDefault(paint['line-width'], 1);
    final gap = paint['line-gap-width'];
    Expr width = own;
    final between = gap == null ? null : compileExpr(gap);
    if (between != null) {
      width = (c) => (asNumber(own(c)) ?? 1) * 2 + (asNumber(between(c)) ?? 0);
    }
    final picture = paint['line-pattern'];
    final ramp = picture == null ? paint['line-gradient'] : null;
    final soft = blur != null && picture == null && ramp == null;
    _layers.add(
      LineLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(
          vector,
          BucketKind.line,
          names,
          cap: picture != null
              ? LineCap.butt
              : switch (layout['line-cap']) {
                  'round' => LineCap.round,
                  'square' => LineCap.square,
                  _ => LineCap.butt,
                },
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
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: picture == null && ramp == null
            ? _withDefault(paint['line-color'], '#000000')
            : compileExpr('#ffffff'),
        gradient: _maybe(ramp),
        gap: between,
        opacity: _withDefault(paint['line-opacity'], 1),
        width: width,
        offset: _maybe(beside),
        blur: soft ? compileExpr(blur) : null,
        dash: picture == null ? dash : null,
        dashStops: picture == null ? dashStops : const [],
        dashChoices: picture == null ? dashChoices : const [],
        dashPick: picture == null && dashChoices.isNotEmpty
            ? compileExpr(dashJson)
            : null,
        dashCap: switch (layout['line-cap']) {
          'round' => DashCap.round,
          'square' => DashCap.square,
          _ => DashCap.butt,
        },
        pattern: picture == null ? null : compileText(picture),
        perFeature: names.isNotEmpty,
      ),
    );
  }

  void _addFill(_VectorLayer vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final prefix = layer.type as String;
    final color = paint['$prefix-color'] ?? '#000000';
    final opacity = paint['$prefix-opacity'] ?? 1;
    final names = _readsOf(paint, [
      '$prefix-color',
      '$prefix-opacity',
      '$prefix-pattern',
    ]);
    final image = paint['$prefix-pattern'];
    _layers.add(
      FillLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(vector, BucketKind.fill, names),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: (image == null
            ? _withDefault(color, '#000000')
            : compileExpr('#ffffff')),
        opacity: compileExpr(opacity),
        pattern: image == null ? null : compileText(image),
        patternTint: image == null ? null : _withDefault(color, '#000000'),
        // As MapLibre, an antialiased fill is outlined in its own colour
        // when it names no outline colour, and a patterned one in its
        // pattern: one pixel lines the GPU draws.
        outline:
            prefix == 'fill' &&
                paint['fill-antialias'] != false &&
                (image != null || paint['fill-outline-color'] == null)
            ? (image == null
                  ? _withDefault(color, '#000000')
                  : compileExpr('#ffffff'))
            : null,
        perFeature: names.isNotEmpty,
        extruded: prefix == 'fill-extrusion',
      ),
    );
    if (prefix == 'fill-extrusion') {
      final key = jsonEncode([
        'extrusion',
        vector.source,
        vector.sourceLayer,
        vector.filter,
        paint['fill-extrusion-height'],
        paint['fill-extrusion-base'],
        color,
        paint['fill-extrusion-vertical-gradient'],
        layer.layout['fill-extrusion-rounded-corner-distance'],
        image,
      ]);
      final index = _bucketIndex.putIfAbsent(key, () {
        _buckets.add(
          Bucket(
            vector.source,
            vector.sourceLayer,
            compileFilter(vector.filter),
            BucketKind.extrusion,
            extrude: Extrude(
              _withDefault(paint['fill-extrusion-height'], 0),
              _withDefault(paint['fill-extrusion-base'], 0),
              (image == null
                  ? _withDefault(color, '#000000')
                  : compileExpr('#ffffff')),
              verticalGradient:
                  paint['fill-extrusion-vertical-gradient'] != false,
              roundedCorners: compileExpr(
                layer.layout['fill-extrusion-rounded-corner-distance'] ?? 0,
              ),
              pattern: image == null ? null : compileText(image),
            ),
          ),
        );
        return _buckets.length - 1;
      });
      final bucket = _buckets[index];
      if (layer.minZoom < bucket.minZoom) bucket.minZoom = layer.minZoom;
      if (layer.maxZoom > bucket.maxZoom) bucket.maxZoom = layer.maxZoom;
      _shape.write(jsonEncode([key, layer.minZoom, layer.maxZoom]));
      _extrusions.add(
        ExtrusionLayer(
          id: layer.id,
          bucket: index,
          fill: _layers.length - 1,
          minZoom: layer.minZoom,
          maxZoom: layer.maxZoom,
          opacity: compileExpr(opacity),
          translate: layer.translate,
          translateOnScreen: layer.translateOnScreen,
        ),
      );
    }
    final edge = paint['fill-outline-color'];
    if (edge == null || image != null || paint['fill-antialias'] == false) {
      return;
    }
    final edgeNames = _readsOf(paint, const [
      'fill-outline-color',
      'fill-opacity',
    ]);
    _layers.add(
      LineLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(vector, BucketKind.line, edgeNames, outline: true),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: compileExpr(edge),
        opacity: compileExpr(opacity),
        width: (_) => 1,
        perFeature: edgeNames.isNotEmpty,
        outline: true,
      ),
    );
  }

  /// The bucket that builds what [vector] draws, shared with every other
  /// layer that draws the same features the same way.
  int _bucket(
    _VectorLayer vector,
    BucketKind kind,
    Set<String> reads, {
    LineCap cap = LineCap.butt,
    bool dashed = false,
    bool outline = false,
    bool offset = false,
    bool edged = false,
    bool metered = false,
    LineJoin join = LineJoin.miter,
  }) {
    final _VectorLayer(:layer, :source, :sourceLayer, :filter) = vector;
    final keys = reads.toList()..sort();
    final sortKey = layer.layout['${layer.type}-sort-key'];
    final key = jsonEncode([
      sortKey,
      kind.index,
      source,
      sourceLayer,
      filter,
      cap.index,
      dashed,
      outline,
      offset,
      edged,
      metered,
      join.index,
      keys,
    ]);
    final index = _bucketIndex.putIfAbsent(key, () {
      _buckets.add(
        Bucket(
          source,
          sourceLayer,
          compileFilter(filter),
          kind,
          cap: cap,
          dashed: dashed,
          outline: outline,
          offset: offset,
          edged: edged,
          metered: metered,
          join: join,
          variantKeys: keys,
          sortKey: sortKey == null ? null : compileExpr(sortKey),
        ),
      );
      return _buckets.length - 1;
    });
    final bucket = _buckets[index];
    if (layer.minZoom < bucket.minZoom) bucket.minZoom = layer.minZoom;
    if (layer.maxZoom > bucket.maxZoom) bucket.maxZoom = layer.maxZoom;
    _shape.write(jsonEncode([key, layer.minZoom, layer.maxZoom]));
    return index;
  }

  /// The feature properties the paint [properties] read.
  static Set<String> _readsOf(
    Map<Object?, Object?> paint,
    List<String> properties,
  ) {
    final names = <String>{};
    for (final p in properties) {
      _reads(paint[p], names);
    }
    return names;
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
      tileJsonUrl: from['url'] as String?,
      tiles: tileTemplate(from['tiles']),
      tileSize: asNumber(from['tileSize']) ?? 512,
      sourceMaxZoom: asNumber(from['maxzoom'])?.toInt(),
      cover: TileCover.of(from),
      terrarium: from['encoding'] == 'terrarium',
      exaggeration: (asNumber(terrain['exaggeration']) ?? 1).toDouble(),
    );
  }

  static bool _standsAlone(PaintLayer layer) =>
      layer is FillLayer && layer.extruded;

  List<StyleRun> _runs() {
    final layers = _layers;
    final runs = <StyleRun>[];
    var nextAlone = 0;
    var runStart = 0;
    int sourceAt(int i) => _buckets[layers[i].bucket].source;
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

  /// Collects the feature properties an expression reads.
  static bool _readsAny(Object? json) {
    final keys = <String>{};
    _reads(json, keys);
    return keys.isNotEmpty;
  }

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
      if (json.isNotEmpty && (json[0] == 'within' || json[0] == 'distance')) {
        into.add(geometryKey(json));
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
      out[i * 2] = worldX(lng.toDouble());
      out[i * 2 + 1] = worldY(lat.toDouble());
    }
    return out;
  }

  /// A property read from [json], or [fallback] when it is unset or comes
  /// out null, as MapLibre falls back to a property's default.
  static Expr _withDefault(Object? json, Object fallback) {
    final otherwise = compileExpr(fallback);
    if (json == null) return otherwise;
    final expr = compileExpr(json);
    return (c) => expr(c) ?? otherwise(c);
  }

  static Expr? _maybe(Object? json) => json == null ? null : compileExpr(json);

  static bool _drawnByScreenY(Map<Object?, Object?> layout) {
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
  static String _overlap(Map<Object?, Object?> layout, String kind) =>
      switch (layout['$kind-overlap']) {
        final String mode => mode,
        _ => layout['$kind-allow-overlap'] == true ? 'always' : 'never',
      };

  /// The anchors a symbol may take and, from `text-variable-anchor-offset`,
  /// which wins over [anchors], the offset in ems of each.
  static (List<String>, List<(double, double)>?) _anchorOffsets(
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
          offsets.add(_pair(list[i + 1]));
        }
      }
      if (names.isNotEmpty) return (names, offsets);
    }
    return (
      anchors is List ? anchors.whereType<String>().toList() : const [],
      null,
    );
  }

  static bool _isPair(Object? json) =>
      json == null ||
      (json is List && json.length == 2 && json.every((v) => v is num));

  static (double, double) _pair(Object? json) {
    var list = json;
    if (list is List && list.length == 2 && list[0] == 'literal') {
      list = list[1];
    }
    if (list is! List || list.length != 2) return (0, 0);
    return (asNumber(list[0]) ?? 0, asNumber(list[1]) ?? 0);
  }

  /// A colour, or the list of colours a property taking one per light
  /// may give; [fallback] when there is none.
  static List<Expr> _colours(Object? json, String fallback) {
    if (json is List &&
        json.isNotEmpty &&
        json.every((v) => v is String && Rgba.of(v) != null)) {
      return [for (final v in json) compileExpr(v)];
    }
    return [compileExpr(json ?? fallback)];
  }

  /// A number, or the list of numbers a property taking one per light may
  /// give; [fallback] when there is none.
  static List<double> _numbers(Object? json, double fallback) {
    final values = json is List ? json : [json];
    final out = [
      for (final v in values)
        if (asNumber(v) case final n?) n.toDouble(),
    ];
    return out.isEmpty ? [fallback] : out;
  }

  /// A `line-dasharray` that changes with the zoom, as legacy stops or a
  /// `step` on the zoom; empty for any other.
  static List<(double, Float64List)> _dashStops(Object? json) {
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
      final d = _dash(value);
      if (z == null || d == null) return const [];
      out.add((z, d));
    }
    return out;
  }

  /// The dash arrays written as literals in a dasharray [json], each once.
  static List<Float64List> _dashLiterals(Object? json) {
    final out = <Float64List>[];
    void visit(Object? node) {
      if (node is! List) return;
      if (node.length == 2 && node[0] == 'literal') {
        final d = _dash(node);
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

  static bool _same(Float64List a, Float64List b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  static Float64List? _dash(Object? json) {
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
  static List<String> _fontStack(Object? value) {
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
