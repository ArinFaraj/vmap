import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../style/expr.dart';
import '../text/bidi.dart' show textIsRightToLeft;
import '../text/glyphs/cursive.dart';
import '../text/glyphs/glyph_ranges.dart';
import '../text/glyphs/glyph_pbf.dart';
import '../text/glyphs/glyph_layout.dart';
import 'gpu_stream.dart';
import 'extrusion.dart';
import '../style/format.dart';
import 'mvt.dart';
import 'pole.dart';
import 'round_corners.dart';
import '../style/style_model.dart';
import '../camera/subdivide.dart';
import 'tessellate.dart';
import 'built_tile.dart';
import 'label_measure.dart';
import 'line_anchors.dart';

import '../camera/mercator.dart';

/// The geometry one bucket collects, or one combination of property values
/// within it.
class _Group {
  _Group(this.bucket, this.props);

  final int bucket;
  final Map<String, Object?>? props;
  FillMesher? fill;
  LineMesher? line;
  List<double>? points;
}

/// Turns one vector tile into the meshes and labels a style asks for.
class TileBuilder {
  /// Builds the tiles of the style's source number [source].
  TileBuilder(
    this.sheet, {
    this.source = 0,
    this.fonts,
    this.gpu = false,
    this.ranges,
  }) {
    for (var i = 0; i < sheet.buckets.length; i++) {
      if (sheet.buckets[i].source != source) continue;
      (_buckets[sheet.buckets[i].sourceLayer] ??= []).add(i);
    }
    for (var i = 0; i < sheet.symbols.length; i++) {
      if (sheet.symbols[i].source != source) continue;
      (_symbols[sheet.symbols[i].sourceLayer] ??= []).add(i);
    }
    if (gpu) {
      for (final layer in sheet.layers) {
        if (layer case FillLayer(outline: _?)) _outlined.add(layer.bucket);
      }
    }
  }

  /// The fill buckets a layer outlines, whose rings are kept as edges.
  final Set<int> _outlined = {};

  late final LabelMeasure _measure = LabelMeasure(fonts: fonts, ranges: ranges);

  /// The size of each sprite image in logical pixels, by name, once the
  /// style's sprite indexes are read: icons along a line are spaced by it.
  Map<String, (double, double)> get iconSizes => _measure.iconSizes;
  set iconSizes(Map<String, (double, double)> value) =>
      _measure.iconSizes = value;

  /// The state the app gave each feature, by id, which buildings whose
  /// paint reads `feature-state` are built from.
  Map<Object?, Map<String, Object?>> states = const {};

  final StyleSheet sheet;
  final int source;

  /// Shapes label text while the tile is built, so the page never has to.
  final GlyphFonts? fonts;

  /// The style's glyph ranges, which a name along a line is measured with
  /// as MapLibre measures it, when the labels are drawn from them.
  final GlyphRanges? ranges;

  /// The last build measured a name with a range still on its way: built
  /// again once it arrives, its names are where MapLibre puts them.
  bool get missedGlyphs => _measure.missedGlyphs;

  /// Builds each tile's GPU stream as well.
  final bool gpu;

  void _shape(List<BuiltLabel> labels) {
    final fonts = this.fonts;
    if (fonts == null) return;
    for (final l in labels) {
      if (l.layer < 0 || l.text.isEmpty) continue;
      final symbol = sheet.symbols[l.layer];
      final plain = plainText(l.text);
      final text = symbol.uppercase ? plain.toUpperCase() : plain;
      final rtl = textIsRightToLeft(text);
      final road = l.line != null;
      l.shaped = layoutText(
        fonts,
        text,
        weight: symbol.weight,
        letterSpacing: letterSpacingFor(text, symbol.letterSpacing),
        lineHeight: symbol.lineHeight ?? 1.15,
        maxWidth: road ? 60 : symbol.maxWidth,
        align: switch (symbol.justify) {
          ui.TextAlign.left => rtl ? 1 : -1,
          ui.TextAlign.right => rtl ? -1 : 1,
          ui.TextAlign.start => rtl ? 1 : -1,
          ui.TextAlign.end => rtl ? -1 : 1,
          _ => 0,
        },
        singleLine: road,
        stack: symbol.fontStack,
      );
    }
  }

  final Map<String, List<int>> _buckets = {};
  final Map<String, List<int>> _symbols = {};
  final EvalContext _context = EvalContext();
  final GeometrySink _sink = GeometrySink();
  final List<int> _starts = [];
  final List<int> _ends = [];
  Float64List _ring = Float64List(4096);
  final List<int> _holes = [];

  /// A bucket whose features differ in more ways than this draws the rest
  /// with the paint of the last combination.
  static const int _maxVariants = 64;

  /// The same for a bucket painted by feature id or state, where every
  /// feature is its own combination.
  static const int _maxFeatures = 4096;

  /// [maxZoom] is the deepest zoom the source has tiles for; a tile at that
  /// zoom is drawn at every zoom beyond it.
  BuiltTile build(
    Uint8List bytes,
    int z, {
    int x = 0,
    int y = 0,
    int maxZoom = 14,
  }) => buildLayers(
    MvtTile.decode(bytes).layers.values,
    z,
    x: x,
    y: y,
    maxZoom: maxZoom,
  );

  /// [over], when deeper than [z], is the zoom the tile is laid out for,
  /// as MapLibre lays out an overscaled tile.
  double _overscale = 1;

  BuiltTile buildLayers(
    Iterable<TileLayer> tileLayers,
    int z, {
    int x = 0,
    int y = 0,
    int maxZoom = 14,
    int? over,
  }) {
    final plain = List<_Group?>.filled(sheet.buckets.length, null);
    final varied = <String, _Group>{};
    final variantCount = List<int>.filled(sheet.buckets.length, 0);
    final lastVariant = List<_Group?>.filled(sheet.buckets.length, null);
    final groups = <_Group>[];
    final labels = <BuiltLabel>[];
    final namedLines = <int, List<NamedLine>>{};
    // Text along lines kept level on the screen, joined by name before its
    // anchors are found, as names that follow the line are.
    final levelLines = <int, List<NamedLine>>{};
    final extruders = <int, ExtrusionBuilder>{};
    final deepest = z >= maxZoom;
    final lineTolerance = deepest ? 0.75 : 2.0;
    // On the globe a line is cut along a grid before it is stroked, so the
    // sphere bends it between its own joins.
    final cells = sheet.projection.isGlobe ? lineCells(z) : 0;
    final lineCell = cells > 0 ? tileExtent / cells : 0.0;
    final ringTolerance = deepest ? 0.0 : 2.0;
    final laidOut = over != null && over > z ? over : z;
    final overscale = _overscale = (1 << (laidOut - z)).toDouble();
    final styleZoom = laidOut + sheet.zoomOffset;
    _measure.missedGlyphs = false;
    bool drawnAt(double minZoom, double maxZoom) =>
        maxZoom > styleZoom && (deepest || minZoom < styleZoom + 1);
    final context = _context..zoom = styleZoom;

    _Group groupFor(int b, Bucket bucket) {
      final keys = bucket.variantKeys;
      if (keys.isEmpty) {
        var group = plain[b];
        if (group == null) groups.add(group = plain[b] = _Group(b, null));
        return group;
      }
      final values = [
        for (final k in keys)
          k.startsWith(r'$geometry:')
              ? geometryExpr(k)?.call(context)
              : context.props[k],
      ];
      final key = '$b|${values.join('\u0001')}';
      var group = varied[key];
      if (group != null) return group;
      final most = keys.contains(r'$id') ? _maxFeatures : _maxVariants;
      if (variantCount[b] >= most) return lastVariant[b]!;
      variantCount[b]++;
      group = varied[key] = lastVariant[b] = _Group(b, {
        for (var i = 0; i < keys.length; i++)
          if (values[i] != null) keys[i]: values[i],
      });
      groups.add(group);
      return group;
    }

    for (final layer in tileLayers) {
      final buckets = [
        for (final b in _buckets[layer.name] ?? const <int>[])
          if (drawnAt(sheet.buckets[b].minZoom, sheet.buckets[b].maxZoom)) b,
      ];
      final symbols = [
        for (final s in _symbols[layer.name] ?? const <int>[])
          if (drawnAt(sheet.symbols[s].minZoom, sheet.symbols[s].maxZoom)) s,
      ];
      if (buckets.isEmpty && symbols.isEmpty) continue;
      final scale = tileExtent / layer.extent;
      final from = source < sheet.sources.length ? sheet.sources[source] : null;
      final idKey = from == null || from is GeoJsonSource
          ? null
          : from.idKey(layer.name);
      // A bucket drawn by a sort key takes the features in its own order,
      // apart from the rest, which keep the tile's.
      final passes = <(List<TileFeature>, List<int>, List<int>)>[
        (
          layer.features,
          [
            for (final b in buckets)
              if (sheet.buckets[b].sortKey == null) b,
          ],
          symbols,
        ),
        for (final b in buckets)
          if (sheet.buckets[b].sortKey case final sortKey?)
            (_bySortKey(layer, sortKey, idKey), [b], const <int>[]),
      ];
      for (final (features, buckets, symbols) in passes) {
        for (final f in features) {
          final tags = f.allTags(layer);
          if (idKey != null && tags[idKey] != null) tags[r'$id'] = tags[idKey];
          context
            ..props = tags
            ..geometryType = switch (f.type) {
              mvtPoint => 'Point',
              mvtLine => 'LineString',
              _ => 'Polygon',
            };
          var read = false;
          var pending = scale;
          final unit = scale;
          void geometry() {
            if (read) return;
            read = true;
            _sink.clear();
            f.readGeometry(_sink);
          }

          void scaled() {
            geometry();
            if (pending != 1) {
              _scaleSink(pending);
              pending = 1;
            }
          }

          context.lonLats = () {
            geometry();
            final across = pending / tileExtent;
            final tiles = 1 << z;
            return [
              for (var r = 0; r < _sink.ringCount; r++)
                [
                  for (
                    var i = _sink.ringStart(r);
                    i < _sink.ringEnd(r);
                    i++
                  ) ...[
                    longitudeAt((x + _sink.coords[i * 2] * across) / tiles),
                    latitudeAt((y + _sink.coords[i * 2 + 1] * across) / tiles),
                  ],
                ],
            ];
          };

          for (final b in buckets) {
            final bucket = sheet.buckets[b];
            final fits = switch (bucket.kind) {
              BucketKind.fill || BucketKind.extrusion => f.type == mvtPolygon,
              BucketKind.circle => true,
              BucketKind.line =>
                bucket.outline ? f.type == mvtPolygon : f.type != mvtPoint,
            };
            if (!fits || !bucket.filter(context)) continue;
            if (bucket.extrude case final extrude?) {
              scaled();
              if (extrude.readsState) {
                context.state =
                    states[featureStateKey(context.props[r'$id'])] ?? const {};
              }
              // As MapLibre, nothing stands below the ground.
              final height = math.max(
                0.0,
                asNumber(extrude.height(context)) ?? 0,
              );
              final base = math.max(0.0, asNumber(extrude.base(context)) ?? 0);
              final color = Rgba.of(extrude.color(context)) ?? Rgba.black;
              _starts.clear();
              _ends.clear();
              for (var r = 0; r < _sink.ringCount; r++) {
                _starts.add(_sink.ringStart(r));
                _ends.add(_sink.ringEnd(r));
              }
              (extruders[b] ??= ExtrusionBuilder(
                b,
                light: sheet.light,
                gradient: extrude.verticalGradient,
                patternPerMetre: -(1 << z) / 8192,
              )).add(
                _sink.coords,
                _starts,
                _ends,
                height.toDouble(),
                base.toDouble(),
                color,
                rounding: tileUnitsForMeters(
                  (asNumber(extrude.roundedCorners?.call(context)) ?? 0)
                      .toDouble(),
                  z,
                  y,
                ),
                pattern: switch (extrude.pattern?.call(context)) {
                  final String name when name.isNotEmpty => name,
                  _ => null,
                },
              );
              context.state = const {};
              continue;
            }
            final group = groupFor(b, bucket);
            if (bucket.kind == BucketKind.fill) {
              geometry();
              _addPolygons(
                group.fill ??= FillMesher(
                  outlines: _outlined.contains(b),
                  north: y == 0,
                  south: y == (1 << z) - 1,
                ),
                pending,
                ringTolerance,
              );
              continue;
            }
            scaled();
            if (bucket.kind == BucketKind.circle) {
              final points = group.points ??= [];
              void add(int i) {
                final x = _sink.coords[i];
                final y = _sink.coords[i + 1];
                if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) {
                  return;
                }
                points
                  ..add(x)
                  ..add(y);
              }

              // As MapLibre, a circle or a heatmap glow stands on every vertex
              // of a line or a polygon too, and a ring's first vertex twice.
              for (var r = 0; r < _sink.ringCount; r++) {
                final start = _sink.ringStart(r) * 2;
                final end = _sink.ringEnd(r) * 2;
                for (var i = start; i < end; i += 2) {
                  add(i);
                }
                if (f.type == mvtPolygon &&
                    end - start >= 6 &&
                    (_sink.coords[start] != _sink.coords[end - 2] ||
                        _sink.coords[start + 1] != _sink.coords[end - 1])) {
                  add(start);
                }
              }
              continue;
            }
            final mesher = group.line ??= LineMesher(
              distances: bucket.dashed,
              offsets: bucket.offset,
              edged: bucket.edged,
              join: bucket.join,
            );
            for (var r = 0; r < _sink.ringCount; r++) {
              final start = _sink.ringStart(r);
              final end = _sink.ringEnd(r);
              if (f.type == mvtLine) {
                final shares = bucket.metered && f is MeasuredFeature
                    ? (f as MeasuredFeature).lineMetrics
                    : null;
                final known = shares != null && shares.length > r * 2 + 1;
                final line = lineCell > 0
                    ? cutLine(_sink.coords, start, end, lineCell)
                    : _sink.coords;
                mesher.addLine(
                  line,
                  lineCell > 0 ? 0 : start,
                  lineCell > 0 ? line.length ~/ 2 : end,
                  lineTolerance,
                  cap: switch (bucket.capBy?.call(context)) {
                    'round' => LineCap.round,
                    'square' => LineCap.square,
                    'butt' => LineCap.butt,
                    _ => bucket.cap,
                  },
                  join: switch (bucket.joinBy?.call(context)) {
                    'round' => LineJoin.round,
                    'bevel' => LineJoin.bevel,
                    'miter' => LineJoin.miter,
                    _ => null,
                  },
                  miter: asNumber(bucket.miterLimit?.call(context))?.toDouble(),
                  round: asNumber(bucket.roundLimit?.call(context))?.toDouble(),
                  shareBefore: known
                      ? shares[r * 2]
                      : bucket.metered
                      ? 0
                      : null,
                  sharePer: known ? shares[r * 2 + 1] / unit : 0,
                );
                continue;
              }
              final count = end - start;
              if (count < 3) continue;
              if (_ring.length < (count + 1) * 2) {
                _ring = Float64List((count + 1) * 4);
              }
              _ring.setRange(0, count * 2, _sink.coords, start * 2);
              _ring[count * 2] = _ring[0];
              _ring[count * 2 + 1] = _ring[1];
              final ring = lineCell > 0
                  ? cutLine(_ring, 0, count + 1, lineCell)
                  : _ring;
              final points = lineCell > 0 ? ring.length ~/ 2 : count + 1;
              if (bucket.outline) {
                mesher.addOutline(ring, 0, points);
              } else {
                mesher.addLine(ring, 0, points, lineTolerance, closed: true);
              }
            }
          }

          for (final s in symbols) {
            final symbol = sheet.symbols[s];
            if (!symbol.build.filter(context)) continue;
            final (text, format) = labelText(symbol.build.text(context));
            final icon = symbol.build.icon == null
                ? ''
                : symbol.build.icon!(context) as String;
            if (plainText(text).isEmpty &&
                !text.contains(String.fromCharCode(formatImage)) &&
                icon.isEmpty) {
              continue;
            }
            final placement = '${symbol.build.placement(context)}';
            final along = placement.startsWith('line');
            final base = (sheet.symbols.length - 1 - s) * 4096;
            final order = _order(symbol, context);
            final spin =
                (asNumber(symbol.build.iconRotate(context)) ?? 0) *
                math.pi /
                180;
            final carried = symbol.build.paintKeys.isEmpty && format == null
                ? null
                : {
                    for (final k in symbol.build.paintKeys)
                      k: k.startsWith(r'$geometry:')
                          ? geometryExpr(k)?.call(context)
                          : context.props[k],
                    formatKey: ?format,
                  };
            // As MapLibre, a polygon placed along a line is placed along its
            // rings.
            if (f.type == mvtPolygon && !along) {
              scaled();
              // As MapLibre: each polygon at its pole of inaccessibility,
              // to 2 pixels, when that lies in this tile.
              for (final (x, y) in polygonLabelPoints(_sink)) {
                if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) {
                  continue;
                }
                labels.add(
                  BuiltLabel(
                    s,
                    base + order,
                    text,
                    x,
                    y,
                    null,
                    icon: icon,
                    angle: spin,
                    spaced: true,
                  )..props = carried,
                );
              }
              continue;
            }
            if (f.type == mvtPoint) {
              if (along) continue;
              scaled();
              for (final label in _pointLabels(
                s,
                base + order,
                text,
                icon,
                spin,
              )) {
                labels.add(label..props = carried);
              }
              continue;
            }
            scaled();
            final deeper = math.max(0, (symbol.minZoom - styleZoom).ceil());
            // line-center names a line once, at its middle.
            final spacing = placement == 'line-center'
                ? double.infinity
                : symbol.build.spacing * 8 / (1 << deeper) / overscale;
            // As MapLibre's textMaxBoxScale, anchors are spaced by the text's
            // size at zoom 18, not the size it is laid out at.
            final zoom = context.zoom;
            context.zoom = styleZoom + 1;
            final size = finiteOr(symbol.size(context), 16);
            context.zoom = 18;
            final maxSize = finiteOr(symbol.size(context), size);
            context.zoom = zoom;
            final em = maxSize * tileExtent / 512 / overscale;
            if (along && text.isNotEmpty && !symbol.build.textUpright) {
              final rings = [
                for (var r = 0; r < _sink.ringCount; r++)
                  Float32List.fromList(
                    _sink.coords.sublist(
                      _sink.ringStart(r) * 2,
                      _sink.ringEnd(r) * 2,
                    ),
                  ),
              ];
              final named = NamedLine(
                priority: base + (symbol.build.sortKey == null ? 50 : order),
                text: text,
                spacing: spacing,
                labelLength: _measure.textEms(symbol, text, format, size) * em,
                em: em,
                maxBend: symbol.maxBend ?? math.pi / 4,
                props: carried,
                rings: rings,
                icon: icon,
              );
              if (placement == 'line' && rings.isNotEmpty) {
                (namedLines[s] ??= []).add(named);
              } else {
                labels.addAll(
                  _lineLabels(s, named, center: placement == 'line-center'),
                );
              }
              continue;
            }
            if (!along) {
              // As MapLibre: a point placed on a line stands at the line's
              // first vertex, when that lies in this tile.
              final c = _sink.coords;
              for (var r = 0; r < _sink.ringCount; r++) {
                final at = _sink.ringStart(r) * 2;
                final x = c[at], y = c[at + 1];
                if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) {
                  continue;
                }
                labels.add(
                  BuiltLabel(
                    s,
                    base + (symbol.build.sortKey == null ? 50 : order),
                    text,
                    x,
                    y,
                    null,
                    icon: icon,
                    angle: spin,
                  )..props = carried,
                );
              }
              continue;
            }
            final turns = text.isEmpty && !symbol.build.iconUpright;
            // As MapLibre's getShapedLabelLength: the text or the icon,
            // whichever is longer, both by the text's box scale.
            final iconWidth = icon.isEmpty
                ? 0.0
                : (iconSizes[icon]?.$1 ?? 0) *
                      (asNumber(symbol.iconSize(context)) ?? 1) *
                      em /
                      GlyphPbf.em;
            final labelLength = math.max(
              text.isEmpty
                  ? 0.0
                  : _measure.textEms(symbol, text, format, size) * em,
              iconWidth,
            );
            if (placement == 'line' && text.isNotEmpty) {
              (levelLines[s] ??= []).add(
                NamedLine(
                  priority: base + (symbol.build.sortKey == null ? 50 : order),
                  text: text,
                  spacing: spacing,
                  labelLength: labelLength,
                  em: em,
                  maxBend: symbol.maxBend ?? math.pi / 4,
                  props: carried,
                  rings: _sinkRings(),
                  icon: icon,
                  spin: spin,
                ),
              );
              continue;
            }
            anchorsAlong(
              _sinkRings(),
              spacing: spacing,
              labelLength: labelLength,
              em: em,
              maxBend: symbol.maxBend ?? math.pi / 4,
              overscale: _overscale,
              center: placement == 'line-center',
              place: (x, y, angle, _) => labels.add(
                BuiltLabel(
                  s,
                  base + (symbol.build.sortKey == null ? 50 : order),
                  text,
                  x,
                  y,
                  null,
                  icon: icon,
                  angle: turns ? angle + spin : spin,
                  spaced: true,
                  turns: turns,
                )..props = carried,
              ),
              text: text.isNotEmpty,
            );
          }
        }
      }
    }

    for (final MapEntry(key: layer, value: lines) in levelLines.entries) {
      final seen = <String, List<(double, double)>>{};
      for (final line in mergeNamedLines(lines)) {
        anchorsAlong(
          line.rings,
          spacing: line.spacing,
          labelLength: line.labelLength,
          em: line.em,
          maxBend: line.maxBend,
          overscale: _overscale,
          place: (x, y, angle, _) {
            if (repeatsName(seen, line, x, y)) return;
            labels.add(
              BuiltLabel(
                layer,
                line.priority,
                line.text,
                x,
                y,
                null,
                icon: line.icon,
                angle: line.spin,
                spaced: true,
              )..props = line.props,
            );
          },
        );
      }
    }

    for (final MapEntry(key: layer, value: lines) in namedLines.entries) {
      final seen = <String, List<(double, double)>>{};
      for (final named in mergeNamedLines(lines)) {
        labels.addAll(_lineLabels(layer, named, seen: seen));
      }
    }

    final meshes = <BuiltMesh>[];
    groups.sort((a, b) => a.bucket - b.bucket);
    for (final group in groups) {
      final points = group.points;
      if (points != null && points.isNotEmpty) {
        meshes.add(
          BuiltMesh(
            group.bucket,
            MeshChunk(Float32List.fromList(points), null, Uint16List(0)),
            group.props,
          ),
        );
      }
      final chunks = group.fill?.finish() ?? group.line?.finish();
      if (chunks == null) continue;
      for (final chunk in chunks) {
        meshes.add(BuiltMesh(group.bucket, chunk, group.props));
      }
    }
    _shape(labels);
    return BuiltTile(meshes, labels, [
      for (final e in extruders.values)
        ?e.finish(
          cells: sheet.projection.isGlobe ? fillCells(z) : 0,
          vertices: gpu,
        ),
    ], gpu ? _stream(meshes, z, styleZoom) : null);
  }

  /// The tile's GPU stream, cut finer for a style drawn on the globe.
  GpuStream? _stream(List<BuiltMesh> meshes, int z, double zoom) {
    if (!sheet.projection.isGlobe) {
      return GpuStream.build(sheet, meshes, zoom: zoom);
    }
    return GpuStream.build(sheet, meshes, zoom: zoom, fillCells: fillCells(z));
  }

  /// [layer]'s features by [sortKey], lowest first, ties in the tile's
  /// order.
  List<TileFeature> _bySortKey(TileLayer layer, Expr sortKey, String? idKey) {
    final features = layer.features;
    final keys = List<double>.generate(features.length, (i) {
      final f = features[i];
      final tags = f.allTags(layer);
      if (idKey != null && tags[idKey] != null) tags[r'$id'] = tags[idKey];
      _context.props = tags;
      return (asNumber(sortKey(_context)) ?? 0).toDouble();
    });
    final order = List<int>.generate(features.length, (i) => i)
      ..sort((a, b) {
        final c = keys[a].compareTo(keys[b]);
        return c != 0 ? c : a.compareTo(b);
      });
    return [for (final i in order) features[i]];
  }

  void _scaleSink(double scale) {
    final c = _sink.coords;
    for (var i = 0; i < _sink.coordCount; i++) {
      c[i] *= scale;
    }
  }

  /// Groups the sink's rings into outer-ring-plus-holes polygons by winding
  /// and hands each to [mesher].
  void _addPolygons(FillMesher mesher, double scale, double tolerance) {
    final src = _sink.coords;
    if (_sink.coordCount > _ring.length) {
      _ring = Float64List(_sink.coordCount * 2);
    }
    final out = _ring;
    final minSq = tolerance * tolerance;
    final minArea = tolerance * tolerance * 4;
    var n = 0;
    var polygonStart = -1;
    _holes.clear();

    void flush() {
      if (polygonStart >= 0) mesher.addPolygon(out, polygonStart, n, _holes);
      polygonStart = -1;
      _holes.clear();
    }

    for (var r = 0; r < _sink.ringCount; r++) {
      final start = _sink.ringStart(r);
      final end = _sink.ringEnd(r);
      final ringStart = n;
      for (var i = start; i < end; i++) {
        final x = src[i * 2] * scale;
        final y = src[i * 2 + 1] * scale;
        if (n > ringStart) {
          final dx = x - out[n * 2 - 2];
          final dy = y - out[n * 2 - 1];
          final dSq = dx * dx + dy * dy;
          if (dSq == 0 || dSq < minSq) continue;
        }
        out[n * 2] = x;
        out[n * 2 + 1] = y;
        n++;
      }
      final count = n - ringStart;
      var area = 0.0;
      if (count >= 3) {
        var px = out[n * 2 - 2];
        var py = out[n * 2 - 1];
        for (var i = ringStart; i < n; i++) {
          final x = out[i * 2];
          final y = out[i * 2 + 1];
          area += px * y - x * py;
          px = x;
          py = y;
        }
      }
      final isOuter = area > 0;
      if (count < 3 || area.abs() * 0.5 < minArea) {
        n = ringStart;
        if (isOuter) flush();
        continue;
      }
      if (isOuter) {
        if (polygonStart >= 0) {
          mesher.addPolygon(out, polygonStart, ringStart, _holes);
          _holes.clear();
        }
        polygonStart = ringStart;
      } else if (polygonStart >= 0) {
        _holes.add(ringStart - polygonStart);
      } else {
        n = ringStart;
      }
    }
    flush();
  }

  List<Float32List> _sinkRings() => [
    for (var r = 0; r < _sink.ringCount; r++)
      Float32List.fromList(
        _sink.coords.sublist(_sink.ringStart(r) * 2, _sink.ringEnd(r) * 2),
      ),
  ];

  /// A label at each of the feature's points that lies in the tile, as
  /// MapLibre places one at every point of a MultiPoint.
  Iterable<BuiltLabel> _pointLabels(
    int layer,
    int priority,
    String text,
    String icon,
    double angle,
  ) sync* {
    final c = _sink.coords;
    for (var i = 0; i + 1 < _sink.coordCount; i += 2) {
      final x = c[i], y = c[i + 1];
      if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) continue;
      yield BuiltLabel(
        layer,
        priority,
        text,
        x,
        y,
        null,
        icon: icon,
        angle: angle,
      );
    }
  }

  /// A name along each line of [named], as MapLibre's `getAnchors` places
  /// them; with [center], once at the middle. With [seen], the anchors of
  /// the layer's names so far by their text, an anchor nearer one of the
  /// same name than half the spacing is passed over.
  List<BuiltLabel> _lineLabels(
    int layer,
    NamedLine named, {
    bool center = false,
    Map<String, List<(double, double)>>? seen,
  }) {
    final out = <BuiltLabel>[];
    anchorsAlong(
      named.rings,
      spacing: named.spacing,
      labelLength: named.labelLength,
      em: named.em,
      maxBend: named.maxBend,
      overscale: _overscale,
      center: center,
      place: (x, y, _, line) {
        if (seen != null && repeatsName(seen, named, x, y)) return;
        out.add(
          BuiltLabel(
            layer,
            named.priority,
            named.text,
            x,
            y,
            line,
            icon: named.icon,
          )..props = named.props,
        );
      },
    );
    return out;
  }
}

/// Where a label stands among its layer's own, lowest first: by
/// `symbol-sort-key`, and without one in the order of the features.
int _order(SymbolLayer symbol, EvalContext context) {
  final key = symbol.build.sortKey;
  if (key == null) return 50;
  final value = key(context);
  return value is num ? value.round().clamp(0, 4095) : 50;
}
