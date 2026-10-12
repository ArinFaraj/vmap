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
      minZoom = asNumber(raw['minzoom']) ?? 0,
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
      _shape = StringBuffer('$zoomOffset');

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

  /// For each raster layer, how many paint layers come before it.
  final List<int> _rasterAt = [];
  final StringBuffer _shape;

  Expr _background = (_) => null;
  Expr? _backgroundPattern;
  Expr _backgroundOpacity = (_) => 1;

  StyleSheet compile() {
    for (final raw in (json['layers'] as List?) ?? const []) {
      if (raw is! Map) continue;
      final layer = _Layer(raw);
      if (layer.hidden) continue;
      switch (layer.type) {
        case 'background':
          _addBackground(layer);
        case 'raster' || 'hillshade':
          _addRaster(layer);
        case 'symbol' ||
            'line' ||
            'circle' ||
            'heatmap' ||
            'fill' ||
            'fill-extrusion':
          final vector = _vector(layer);
          if (vector == null) continue;
          switch (layer.type) {
            case 'symbol':
              _addSymbol(vector);
            case 'heatmap':
              _addHeatmap(vector);
            case 'circle':
              _addCircle(vector);
            case 'line':
              _addLine(vector);
            default:
              _addFill(vector);
          }
      }
    }
    final sprite = json['sprite'];
    return StyleSheet(
      background: _background,
      buckets: _buckets,
      layers: _layers,
      symbols: _symbols,
      sources: _vectorSources,
      runs: _runs(),
      zoomOffset: zoomOffset,
      shape: _shape.toString(),
      sprite: switch (sprite) {
        final String url => url,
        [{'url': final String url}, ...] => url,
        _ => null,
      },
      rasters: _rasters,
      backgroundPattern: _backgroundPattern,
      backgroundOpacity: _backgroundOpacity,
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
    final color = compileExpr(paint['background-color']);
    final opacity = compileExpr(paint['background-opacity'] ?? 1);
    final picture = paint['background-pattern'];
    _backgroundPattern = picture == null ? null : compileText(picture);
    _backgroundOpacity = opacity;
    _background = (c) {
      final v = Rgba.of(color(c));
      final o = asNumber(opacity(c)) ?? 1;
      return v == null ? null : Rgba(v.r, v.g, v.b, v.a * o);
    };
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
            hueRotate: compileExpr(paint['raster-hue-rotate'] ?? 0),
            saturation: compileExpr(paint['raster-saturation'] ?? 0),
            contrast: compileExpr(paint['raster-contrast'] ?? 0),
            brightnessMin: compileExpr(paint['raster-brightness-min'] ?? 0),
            brightnessMax: compileExpr(paint['raster-brightness-max'] ?? 1),
          );
    final nearest = paint['raster-resampling'] == 'nearest';
    final opacity = compileExpr(paint['raster-opacity'] ?? 1);
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
          exaggeration: compileExpr(paint['hillshade-exaggeration'] ?? 0.5),
          shadow: compileExpr(paint['hillshade-shadow-color'] ?? '#000000'),
          highlight: compileExpr(
            paint['hillshade-highlight-color'] ?? '#ffffff',
          ),
          accent: _maybe(paint['hillshade-accent-color']),
          direction: asNumber(paint['hillshade-illumination-direction']) ?? 335,
        ),
      ),
      _ => null,
    };
    if (made == null) return;
    _rasterAt.add(_layers.length);
    _rasters.add(made);
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
    final anchors = layout['text-variable-anchor'];
    final iconAnchor = layout['icon-anchor'];
    final iconOffset = _pair(layout['icon-offset']);
    final paintKeys = <String>{};
    for (final p in _symbolPaintReads) {
      _reads(paint[p], paintKeys);
    }
    _reads(layout['text-size'], paintKeys);
    _reads(layout['icon-size'], paintKeys);
    final sortedKeys = paintKeys.toList()..sort();
    _symbols.add(
      SymbolLayer(
        id: layer.id,
        source: source,
        sourceLayer: sourceLayer,
        filter: compileFilter(filter),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        text: hasText ? compileText(field) : (_) => '',
        icon: hasIcon ? compileText(image) : null,
        placement: compileExpr(placement),
        size: compileExpr(layout['text-size'] ?? 16),
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
        radialOffset: asNumber(layout['text-radial-offset'])?.toDouble() ?? 0,
        iconAnchor: iconAnchor is String ? iconAnchor : 'center',
        iconOffsetX: iconOffset.$1,
        iconOffsetY: iconOffset.$2,
        sortKey: _maybe(layout['symbol-sort-key']),
        paintKeys: sortedKeys,
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
    // Everything the tile builder reads from the layer: a change to any of
    // it builds the tiles again.
    _shape.write(
      jsonEncode([
        's',
        source,
        sourceLayer,
        filter,
        field,
        image,
        placement,
        spacing,
        textUpright,
        iconUpright,
        layer.minZoom,
        layer.maxZoom,
        layout['symbol-sort-key'],
        layout['icon-rotate'],
        sortedKeys,
      ]),
    );
  }

  void _addHeatmap(_VectorLayer vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final radius = compileExpr(paint['heatmap-radius'] ?? 30);
    _layers.add(
      HeatmapLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(
          vector,
          BucketKind.circle,
          _readsOf(paint, const ['heatmap-weight']),
        ),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: compileExpr('#ffffff'),
        opacity: compileExpr(paint['heatmap-opacity'] ?? 1),
        width: (c) => (asNumber(radius(c)) ?? 30) * 2,
        heat: HeatPaint.of(
          weight: compileExpr(paint['heatmap-weight'] ?? 1),
          intensity: compileExpr(paint['heatmap-intensity'] ?? 1),
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
    ]);
    final radius = compileExpr(paint['circle-radius'] ?? 5);
    final ring = paint['circle-stroke-width'];
    _layers.add(
      CircleLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(vector, BucketKind.circle, names),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: compileExpr(paint['circle-color'] ?? '#000000'),
        opacity: compileExpr(paint['circle-opacity'] ?? 1),
        width: (c) => (asNumber(radius(c)) ?? 5) * 2,
        ring: ring == null
            ? null
            : CircleRing(
                color: compileExpr(paint['circle-stroke-color'] ?? '#000000'),
                width: compileExpr(ring),
                opacity: compileExpr(paint['circle-stroke-opacity'] ?? 1),
              ),
        perFeature: names.isNotEmpty,
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
    ]);
    final beside = paint['line-offset'];
    final blur = paint['line-blur'];
    final dash = _dash(paint['line-dasharray']);
    final own = compileExpr(paint['line-width'] ?? 1);
    final gap = paint['line-gap-width'];
    Expr width = own;
    if (gap != null) {
      final between = compileExpr(gap);
      width = (c) => (asNumber(own(c)) ?? 1) * 2 + (asNumber(between(c)) ?? 0);
    }
    final picture = paint['line-pattern'];
    final ramp = dash == null && picture == null
        ? paint['line-gradient']
        : null;
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
          caps:
              dash == null && picture == null && layout['line-cap'] == 'round',
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
        color: compileExpr(
          picture == null && ramp == null
              ? paint['line-color'] ?? '#000000'
              : '#ffffff',
        ),
        gradient: _maybe(ramp),
        opacity: compileExpr(paint['line-opacity'] ?? 1),
        width: width,
        offset: _maybe(beside),
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
  }

  void _addFill(_VectorLayer vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final prefix = layer.type as String;
    final color = paint['$prefix-color'] ?? '#000000';
    final opacity = paint['$prefix-opacity'] ?? 1;
    final names = _readsOf(paint, ['$prefix-color', '$prefix-opacity']);
    final image = paint['fill-pattern'];
    _layers.add(
      FillLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(vector, BucketKind.fill, names),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: compileExpr(image == null ? color : '#ffffff'),
        opacity: compileExpr(opacity),
        pattern: image == null ? null : compileText(image),
        perFeature: names.isNotEmpty,
      ),
    );
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
      ),
    );
  }

  /// The bucket that builds what [vector] draws, shared with every other
  /// layer that draws the same features the same way.
  int _bucket(
    _VectorLayer vector,
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
    final _VectorLayer(:layer, :source, :sourceLayer, :filter) = vector;
    final keys = reads.toList()..sort();
    final key = jsonEncode([
      kind.index,
      source,
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
    final index = _bucketIndex.putIfAbsent(key, () {
      _buckets.add(
        Bucket(
          source,
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
  List<StyleRun> _runs() {
    final layers = _layers;
    final runs = <StyleRun>[];
    var nextRaster = 0;
    var runStart = 0;
    int sourceAt(int i) => _buckets[layers[i].bucket].source;
    void closeRun(int end) {
      if (end > runStart) {
        runs.add(StyleRun.vector(sourceAt(runStart), runStart, end));
      }
      runStart = end;
    }

    for (var i = 0; i <= layers.length; i++) {
      while (nextRaster < _rasterAt.length && _rasterAt[nextRaster] == i) {
        closeRun(i);
        runs.add(StyleRun.raster(nextRaster++));
      }
      if (i == layers.length ||
          (i > runStart &&
              (sourceAt(i) != sourceAt(runStart) ||
                  layers[i].spills != layers[runStart].spills ||
                  layers[i] is HeatmapLayer ||
                  layers[runStart] is HeatmapLayer))) {
        closeRun(i);
      }
    }
    return runs;
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
      out[i * 2] = worldX(lng.toDouble());
      out[i * 2 + 1] = worldY(lat.toDouble());
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
