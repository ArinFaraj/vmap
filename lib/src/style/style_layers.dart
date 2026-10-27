import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'style_model.dart';
import '../tiles/tessellate.dart';
import 'style_reading.dart';

/// The layout properties a symbol reads from each feature or the zoom,
/// which its labels carry and are laid out by.
const _layoutByFeature = [
  'text-transform',
  'text-letter-spacing',
  'text-max-width',
  'text-justify',
  'text-anchor',
  'text-rotate',
  'text-font',
  'icon-anchor',
];

const _symbolPaintReads = [
  'text-color',
  'text-opacity',
  'text-halo-color',
  'text-halo-width',
  'text-halo-blur',
  'icon-color',
  'icon-opacity',
  'icon-halo-color',
  'icon-halo-width',
  'icon-halo-blur',
];

/// The fill, line, circle, heatmap and symbol layers of a style, compiled
/// into the buckets that build them from a tile and the layers that paint
/// what the buckets built.
class VectorLayers {
  VectorLayers(this.nameKeys, String shapeStart)
    : shape = StringBuffer(shapeStart);

  /// The feature properties a name is read from, in place of the style's.
  final List<String>? nameKeys;

  final List<Bucket> buckets = [];
  final List<PaintLayer> layers = [];
  final List<SymbolLayer> symbols = [];
  final List<ExtrusionLayer> extrusions = [];

  /// Every bucket's key and zooms, which two styles share only when they
  /// build the same tiles.
  final StringBuffer shape;
  final Map<String, int> _bucketIndex = {};

  /// Whether a layer of [type] is one of these.
  static bool draws(Object? type) => switch (type) {
    'symbol' || 'heatmap' || 'circle' || 'line' => true,
    'fill' || 'fill-extrusion' => true,
    _ => false,
  };

  void add(VectorLayerJson vector) => switch (vector.layer.type) {
    'symbol' => _symbol(vector),
    'heatmap' => _heatmap(vector),
    'circle' => _circle(vector),
    'line' => _line(vector),
    _ => _fill(vector),
  };

  void _symbol(VectorLayerJson vector) {
    final VectorLayerJson(:layer, :source, :sourceLayer, :filter) = vector;
    final paint = layer.paint;
    final layout = layer.layout;
    var field = layout['text-field'];
    final image = layout['icon-image'];
    final hasText = field != null && field != '';
    final hasIcon = image != null && image != '';
    if (!hasText && !hasIcon) return;
    final nameKeys = this.nameKeys;
    if (hasText && nameKeys != null && jsonText(field).contains('name')) {
      field = [
        'coalesce',
        for (final k in nameKeys) ['get', k],
      ];
    }
    final font = jsonText(layout['text-font'] ?? '').toLowerCase();
    final offset = pairOf(layout['text-offset']);
    final placement = layout['symbol-placement'] ?? 'point';
    final spacing = asNumber(layout['symbol-spacing']) ?? 250;
    final textUpright = layout['text-rotation-alignment'] == 'viewport';
    final iconUpright = layout['icon-rotation-alignment'] == 'viewport';
    final anchor = layout['text-anchor'];
    final (anchors, anchorOffsets) = anchorOffsetsOf(
      layout['text-variable-anchor-offset'],
      layout['text-variable-anchor'],
    );
    final iconAnchor = layout['icon-anchor'];
    final iconOffset = pairOf(layout['icon-offset']);
    final paintKeys = <String>{};
    for (final p in _symbolPaintReads) {
      collectReads(paint[p], paintKeys);
    }
    collectReads(layout['text-size'], paintKeys);
    collectReads(layout['icon-size'], paintKeys);
    collectReads(layout['icon-offset'], paintKeys);
    collectReads(layout['text-offset'], paintKeys);
    collectReads(layout['symbol-height-offset'], paintKeys);
    for (final key in _layoutByFeature) {
      collectReads(layout[key], paintKeys);
    }
    Expr? varying(String key) => switch (layout[key]) {
      final List _ || final Map _ => compileExpr(layout[key]),
      _ => null,
    };
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
    symbols.add(
      SymbolLayer(
        id: layer.id,
        build: build,
        size: exprOr(layout['text-size'], 16),
        color: exprOr(paint['text-color'], '#000000'),
        opacity: exprOr(paint['text-opacity'], 1),
        haloColor: compileExpr(paint['text-halo-color']),
        haloWidth: exprOr(paint['text-halo-width'], 0),
        weight: fontWeightOf(font),
        italic: font.contains('italic') || font.contains('oblique'),
        fontStack: fontStackOf(layout['text-font']),
        uppercase: layout['text-transform'] == 'uppercase',
        layoutAt: SymbolLayout(
          transform:
              varying('text-transform') ??
              (layout['text-transform'] == 'lowercase'
                  ? compileExpr('lowercase')
                  : null),
          letterSpacing: varying('text-letter-spacing'),
          maxWidth: varying('text-max-width'),
          justify: varying('text-justify'),
          anchor: varying('text-anchor'),
          rotate: varying('text-rotate'),
          font: varying('text-font'),
        ),
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
        glyphsUpright: layout['text-rotation-alignment'] == 'viewport-glyph',
        iconAlongMap: layout['icon-rotation-alignment'] == 'map',
        iconPadding: asNumber(layout['icon-padding']),
        iconPaddings: sidesOf(layout['icon-padding']),
        textIgnored: layout['text-ignore-placement'] == true,
        iconOnGround: switch (layout['icon-pitch-alignment']) {
          'map' => true,
          'viewport' => false,
          _ => switch (layout['icon-rotation-alignment']) {
            'map' => true,
            'viewport' => false,
            _ => placement is String && placement.startsWith('line'),
          },
        },
        textOnGround: switch (layout['text-pitch-alignment']) {
          'map' => true,
          'viewport' => false,
          _ => switch (layout['text-rotation-alignment']) {
            'map' => true,
            'viewport' || 'viewport-glyph' => false,
            _ => placement is String && placement.startsWith('line'),
          },
        },
        keepUpright: layout['text-keep-upright'] != false,
        iconIgnored: layout['icon-ignore-placement'] == true,
        haloBlur: exprOr(paint['text-halo-blur'], 0),
        maxWidth: asNumber(layout['text-max-width']) ?? 10,
        iconSize: exprOr(layout['icon-size'], 1),
        iconOpacity: exprOr(paint['icon-opacity'], 1),
        iconColor: exprOr(paint['icon-color'], '#000000'),
        textRotate: asNumber(layout['text-rotate']) ?? 0,
        anchor: anchor is String ? anchor : 'center',
        offsetX: offset.$1,
        offsetY: offset.$2,
        offsetBy: isPair(layout['text-offset'])
            ? null
            : compileExpr(layout['text-offset']),
        textOptional: layout['text-optional'] == true,
        iconOptional: layout['icon-optional'] == true,
        iconOverlaps: overlapOf(layout, 'icon') == 'always',
        textOverlaps: overlapOf(layout, 'text') == 'always',
        iconCooperative: overlapOf(layout, 'icon') == 'cooperative',
        textCooperative: overlapOf(layout, 'text') == 'cooperative',
        drawnByScreenY: drawnByScreenY(layout),
        placedByScreenY: layout['symbol-z-order'] == 'viewport-y',
        drawnByKey: layout['symbol-sort-key'] != null,
        iconSizeByFeature: readsAny(layout['icon-size']),
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
        iconAnchorBy: iconAnchor is List || iconAnchor is Map
            ? compileExpr(iconAnchor)
            : null,
        iconOffsetX: iconOffset.$1,
        iconOffsetBy: isPair(layout['icon-offset'])
            ? null
            : compileExpr(layout['icon-offset']),
        iconOffsetY: iconOffset.$2,
        textTranslate: exprOrNull(paint['text-translate']),
        textTranslateOnScreen: paint['text-translate-anchor'] == 'viewport',
        iconHaloColor: exprOrNull(paint['icon-halo-color']),
        iconHaloWidth: exprOrNull(paint['icon-halo-width']),
        iconTranslate: exprOrNull(paint['icon-translate']),
        iconHaloBlur: exprOrNull(paint['icon-halo-blur']),
        iconTranslateOnScreen: paint['icon-translate-anchor'] == 'viewport',
        heightOffset: switch (layout['symbol-height-offset']) {
          null || 0 => null,
          final offset => compileExpr(offset),
        },
        heightFromSea: layout['symbol-height-anchor'] == 'absolute',
        maxBend: switch (asNumber(layout['text-max-angle'])) {
          final degrees? => degrees * math.pi / 180,
          null => null,
        },
      ),
    );
    shape.write(jsonText(['s', build.signature]));
  }

  void _heatmap(VectorLayerJson vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final radius = exprOr(paint['heatmap-radius'], 30);
    layers.add(
      HeatmapLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(
          vector,
          BucketKind.circle,
          readsOf(paint, const ['heatmap-weight', 'heatmap-radius']),
        ),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: compileExpr('#ffffff'),
        opacity: exprOr(paint['heatmap-opacity'], 1),
        width: (c) => (asNumber(radius(c)) ?? 30) * 2,
        heat: HeatPaint.of(
          weight: exprOr(paint['heatmap-weight'], 1),
          intensity: exprOr(paint['heatmap-intensity'], 1),
          color: paint['heatmap-color'],
        ),
      ),
    );
  }

  void _circle(VectorLayerJson vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final names = readsOf(paint, const [
      'circle-color',
      'circle-opacity',
      'circle-radius',
      'circle-stroke-color',
      'circle-stroke-width',
      'circle-stroke-opacity',
      'circle-blur',
    ]);
    final radius = exprOr(paint['circle-radius'], 5);
    final ring = paint['circle-stroke-width'];
    layers.add(
      CircleLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(vector, BucketKind.circle, names),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: exprOr(paint['circle-color'], '#000000'),
        opacity: exprOr(paint['circle-opacity'], 1),
        width: (c) => (asNumber(radius(c)) ?? 5) * 2,
        ring: ring == null
            ? null
            : CircleRing(
                color: exprOr(paint['circle-stroke-color'], '#000000'),
                width: compileExpr(ring),
                opacity: exprOr(paint['circle-stroke-opacity'], 1),
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

  void _line(VectorLayerJson vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final layout = layer.layout;
    final names = readsOf(paint, const [
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
    final dashStops = dashStopsOf(dashJson);
    // A dasharray read from each feature is one of the arrays written in
    // its expression.
    final dashChoices = dashStops.isEmpty && dashOf(dashJson) == null
        ? dashLiteralsOf(dashJson)
        : const <Float64List>[];
    final dash = dashStops.isNotEmpty
        ? dashStops.first.$2
        : dashChoices.isNotEmpty
        ? dashChoices.first
        : dashOf(dashJson);
    final own = exprOr(paint['line-width'], 1);
    final gap = paint['line-gap-width'];
    Expr width = own;
    final between = gap == null ? null : compileExpr(gap);
    if (between != null) {
      width = (c) => (asNumber(own(c)) ?? 1) * 2 + (asNumber(between(c)) ?? 0);
    }
    final picture = paint['line-pattern'];
    final ramp = picture == null ? paint['line-gradient'] : null;
    // Built into the tiles' GPU streams, so a change rebuilds them.
    shape.write(jsonText(['l', picture != null, ramp != null]));
    final soft = blur != null && picture == null && ramp == null;
    layers.add(
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
            ? exprOr(paint['line-color'], '#000000')
            : compileExpr('#ffffff'),
        gradient: exprOrNull(ramp),
        gradientSteps: ramp is List && ramp.isNotEmpty && ramp.first == 'step',
        gap: between,
        opacity: exprOr(paint['line-opacity'], 1),
        width: width,
        offset: exprOrNull(beside),
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
        pattern: picture == null ? null : compileImage(picture),
        perFeature: names.isNotEmpty,
      ),
    );
  }

  void _fill(VectorLayerJson vector) {
    final layer = vector.layer;
    final paint = layer.paint;
    final prefix = layer.type as String;
    final color = paint['$prefix-color'] ?? '#000000';
    final opacity = paint['$prefix-opacity'] ?? 1;
    final names = readsOf(paint, [
      '$prefix-color',
      '$prefix-opacity',
      '$prefix-pattern',
    ]);
    final image = paint['$prefix-pattern'];
    shape.write(jsonText(['f', image != null]));
    layers.add(
      FillLayer(
        id: layer.id,
        translate: layer.translate,
        translateOnScreen: layer.translateOnScreen,
        bucket: _bucket(vector, BucketKind.fill, names),
        minZoom: layer.minZoom,
        maxZoom: layer.maxZoom,
        color: (image == null
            ? exprOr(color, '#000000')
            : compileExpr('#ffffff')),
        opacity: compileExpr(opacity),
        pattern: image == null ? null : compileImage(image),
        patternTint: image == null ? null : exprOr(color, '#000000'),
        // As MapLibre, an antialiased fill is outlined in its own colour
        // when it names no outline colour, and a patterned one in its
        // pattern: one pixel lines the GPU draws.
        outline:
            prefix == 'fill' &&
                paint['fill-antialias'] != false &&
                (image != null || paint['fill-outline-color'] == null)
            ? (image == null
                  ? exprOr(color, '#000000')
                  : compileExpr('#ffffff'))
            : null,
        perFeature: names.isNotEmpty,
        extruded: prefix == 'fill-extrusion',
      ),
    );
    if (prefix == 'fill-extrusion') {
      final key = jsonText([
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
      final index = _shared(
        key,
        layer,
        () => Bucket(
          vector.source,
          vector.sourceLayer,
          compileFilter(vector.filter),
          BucketKind.extrusion,
          extrude: Extrude(
            exprOr(paint['fill-extrusion-height'], 0),
            exprOr(paint['fill-extrusion-base'], 0),
            (image == null ? exprOr(color, '#000000') : compileExpr('#ffffff')),
            verticalGradient:
                paint['fill-extrusion-vertical-gradient'] != false,
            roundedCorners: compileExpr(
              layer.layout['fill-extrusion-rounded-corner-distance'] ?? 0,
            ),
            pattern: image == null ? null : compileImage(image),
            readsState: readsState([
              paint['fill-extrusion-height'],
              paint['fill-extrusion-base'],
              if (image == null) color,
            ]),
          ),
        ),
      );
      extrusions.add(
        ExtrusionLayer(
          id: layer.id,
          bucket: index,
          fill: layers.length - 1,
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
    final edgeNames = readsOf(paint, const [
      'fill-outline-color',
      'fill-opacity',
    ]);
    layers.add(
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
    VectorLayerJson vector,
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
    final VectorLayerJson(:layer, :source, :sourceLayer, :filter) = vector;
    // How a line's corners are drawn, read from each feature where the
    // style gives an expression.
    final lineJoin = kind == BucketKind.line ? layer.layout['line-join'] : null;
    final lineCap = kind == BucketKind.line ? layer.layout['line-cap'] : null;
    final capBy = lineCap is List || lineCap is Map ? lineCap : null;
    final miter = kind == BucketKind.line
        ? layer.layout['line-miter-limit']
        : null;
    final round = kind == BucketKind.line
        ? layer.layout['line-round-limit']
        : null;
    final keys = reads.toList()..sort();
    final sortKey = layer.layout['${layer.type}-sort-key'];
    final key = jsonText([
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
      if (lineJoin is List || lineJoin is Map) lineJoin,
      ?capBy,
      ?miter,
      ?round,
    ]);
    return _shared(
      key,
      layer,
      () => Bucket(
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
        joinBy: lineJoin is List || lineJoin is Map
            ? compileExpr(lineJoin)
            : null,
        miterLimit: miter == null ? null : compileExpr(miter),
        capBy: capBy == null ? null : compileExpr(capBy),
        roundLimit: round == null ? null : compileExpr(round),
        variantKeys: keys,
        sortKey: sortKey == null ? null : compileExpr(sortKey),
      ),
    );
  }

  /// The bucket built under [key], made by [make] the first time, widened
  /// to [layer]'s zooms; the key joins the style's shape.
  int _shared(String key, LayerJson layer, Bucket Function() make) {
    final index = _bucketIndex.putIfAbsent(key, () {
      buckets.add(make());
      return buckets.length - 1;
    });
    final bucket = buckets[index];
    if (layer.minZoom < bucket.minZoom) bucket.minZoom = layer.minZoom;
    if (layer.maxZoom > bucket.maxZoom) bucket.maxZoom = layer.maxZoom;
    shape.write(jsonText([key, layer.minZoom, layer.maxZoom]));
    return index;
  }
}
