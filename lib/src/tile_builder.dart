import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'glyphs/glyph_ranges.dart';
import 'glyphs/glyph_pbf.dart';
import 'glyphs/arabic_forms.dart';
import 'glyphs/glyph_layout.dart';
import 'gpu_stream.dart';
import 'extrusion.dart';
import 'mvt.dart';
import 'platform.dart';
import 'style_model.dart';
import 'subdivide.dart';
import 'tessellate.dart';
import 'mercator.dart';

const double tileExtent = 4096;

class BuiltMesh {
  BuiltMesh(this.bucket, this.chunk, [this.props]);

  /// Index into the style's buckets.
  final int bucket;
  final MeshChunk chunk;

  /// The property values every feature in the mesh shares, for a bucket
  /// whose paint reads them.
  final Map<String, Object?>? props;
}

class BuiltLabel {
  BuiltLabel(
    this.layer,
    this.priority,
    this.text,
    this.x,
    this.y,
    this.line, {
    this.icon = '',
    this.angle = 0,
    this.spaced = false,
    this.turns = false,
  });

  /// Index into the style's symbol layers. Negative for a label the app
  /// supplies.
  final int layer;

  /// Lower wins a collision.
  final int priority;
  final String text;
  final double x;
  final double y;

  /// The line the text runs along, as x,y pairs in tile units. Null for point
  /// labels.
  final Float32List? line;

  /// The name of the sprite image drawn at the anchor. Empty for none.
  final String icon;

  /// How far the icon is turned, in radians.
  final double angle;

  /// The icon's angle is measured on the map, so it turns with the map.
  final bool turns;

  /// One of several placed along a line, which keeps its distance from
  /// others with the same text.
  final bool spaced;

  /// What makes this label the same label in another tile: its layer, text
  /// and place for a point, its tile and number otherwise.
  String key = '';

  /// The feature's values of what its layer's paint reads. Null when the
  /// paint reads nothing from the feature.
  Map<String, Object?>? props;

  /// The text shaped by the worker, or null when it was not.
  ShapedText? shaped;
}

class BuiltTile {
  BuiltTile(this.meshes, this.labels, [this.extrusions = const [], this.gpu]);

  /// The tile's fill and line layers for the GPU renderer, when asked for.
  final GpuStream? gpu;

  final List<BuiltMesh> meshes;
  final List<BuiltLabel> labels;
  final List<BuiltExtrusion> extrusions;

  /// Names every label for the tile at [z], [x], [y]. A point's place is
  /// taken to [grid] steps across the world: coarse for vector tiles, where
  /// a place sits a little differently from zoom to zoom, fine for an app's
  /// own points, where two a few pixels apart can carry the same text.
  void keyLabels(int z, int x, int y, {int grid = 1024}) {
    final span = 1 / (1 << z);
    final tx = x * span;
    final ty = y * span;
    for (var i = 0; i < labels.length; i++) {
      final l = labels[i];
      l.key = l.line != null || l.spaced || l.text.isEmpty
          ? 'r|$z/$x/$y|${l.layer}|$i'
          : 'p|${l.layer}|${l.text}|${((tx + l.x / tileExtent * span) * grid).floor()}|${((ty + l.y / tileExtent * span) * grid).floor()}';
    }
  }

  /// A sendable form whose buffers move between isolates without a copy on
  /// the receiving side.
  List<Object?> toMessage() => [
    [
      for (final m in meshes)
        [
          m.bucket,
          pack(m.chunk.positions),
          if (m.chunk.extrusions case final e?) pack(e) else null,
          pack(m.chunk.indices),
          if (m.chunk.distances case final d?) pack(d) else null,
          m.props,
          if (m.chunk.offsets case final o?) pack(o) else null,
        ],
    ],
    [
      for (final l in labels)
        [
          l.layer,
          l.priority,
          l.text,
          l.x,
          l.y,
          l.line,
          l.icon,
          l.angle,
          l.spaced,
          l.key,
          l.turns,
          l.props,
          if (l.shaped case final s?)
            [s.width, s.height, s.lines, s.glyphs.length]
          else
            null,
        ],
    ],
    [for (final e in extrusions) e.toMessage()],
    _glyphMessage(),
    gpu?.toMessage(),
  ];

  /// Every label's shaped glyphs in one buffer, so a tile of hundreds of
  /// labels crosses to the page as one transfer, not one per label.
  Object? _glyphMessage() {
    var n = 0;
    for (final l in labels) {
      n += l.shaped?.glyphs.length ?? 0;
    }
    if (n == 0) return null;
    final all = Float32List(n);
    var at = 0;
    for (final l in labels) {
      final g = l.shaped?.glyphs;
      if (g == null) continue;
      all.setAll(at, g);
      at += g.length;
    }
    return pack(all);
  }

  static BuiltTile fromMessage(List<Object?> message) {
    final glyphs = message.length > 3 && message[3] != null
        ? unpackFloats(message[3]!)
        : null;
    var glyphAt = 0;
    final meshes = <BuiltMesh>[];
    for (final m in message[0]! as List) {
      final parts = m as List;
      meshes.add(
        BuiltMesh(
          parts[0] as int,
          MeshChunk(
            unpackFloats(parts[1]! as Object),
            _floats(parts[2]),
            unpackShorts(parts[3]! as Object),
            _floats(parts[4]),
            _floats(parts[6]),
          ),
          (parts[5] as Map?)?.cast<String, Object?>(),
        ),
      );
    }
    final labels = <BuiltLabel>[];
    for (final l in message[1]! as List) {
      final parts = l as List;
      labels.add(
        BuiltLabel(
            parts[0] as int,
            parts[1] as int,
            parts[2] as String,
            (parts[3]! as num).toDouble(),
            (parts[4]! as num).toDouble(),
            parts[5] as Float32List?,
            icon: parts[6] as String,
            angle: (parts[7]! as num).toDouble(),
            spaced: parts[8] as bool,
            turns: parts[10] as bool,
          )
          ..key = parts[9] as String
          ..props = (parts[11] as Map?)?.cast<String, Object?>()
          ..shaped = parts.length > 12 && parts[12] != null && glyphs != null
              ? () {
                  final s = parts[12]! as List;
                  final length = s[3]! as int;
                  final view = Float32List.sublistView(
                    glyphs,
                    glyphAt,
                    glyphAt + length,
                  );
                  glyphAt += length;
                  return ShapedText(
                    view,
                    (s[0]! as num).toDouble(),
                    (s[1]! as num).toDouble(),
                    s[2]! as int,
                  );
                }()
              : null,
      );
    }
    return BuiltTile(
      meshes,
      labels,
      [
        if (message.length > 2)
          for (final e in message[2]! as List)
            BuiltExtrusion.fromMessage(e as List<Object?>),
      ],
      message.length > 4 && message[4] != null
          ? GpuStream.fromMessage(message[4]! as List<Object?>)
          : null,
    );
  }
}

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
  }

  final StyleSheet sheet;
  final int source;

  /// Shapes label text while the tile is built, so the page never has to.
  final GlyphFonts? fonts;

  /// The style's glyph ranges, which a name along a line is measured with
  /// as MapLibre measures it, when the labels are drawn from them.
  final GlyphRanges? ranges;

  /// The last build measured a name with a range still on its way: built
  /// again once it arrives, its names are where MapLibre puts them.
  bool missedGlyphs = false;

  /// Builds each tile's GPU stream as well.
  final bool gpu;

  void _shape(List<BuiltLabel> labels) {
    final fonts = this.fonts;
    if (fonts == null) return;
    for (final l in labels) {
      if (l.layer < 0 || l.text.isEmpty) continue;
      final symbol = sheet.symbols[l.layer];
      final text = symbol.uppercase ? l.text.toUpperCase() : l.text;
      final rtl = textIsRightToLeft(text);
      final road = l.line != null;
      l.shaped = layoutText(
        fonts,
        text,
        weight: symbol.weight,
        letterSpacing: symbol.letterSpacing,
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

  BuiltTile buildLayers(
    Iterable<TileLayer> tileLayers,
    int z, {
    int x = 0,
    int y = 0,
    int maxZoom = 14,
  }) {
    final plain = List<_Group?>.filled(sheet.buckets.length, null);
    final varied = <String, _Group>{};
    final variantCount = List<int>.filled(sheet.buckets.length, 0);
    final lastVariant = List<_Group?>.filled(sheet.buckets.length, null);
    final groups = <_Group>[];
    final labels = <BuiltLabel>[];
    final namedLines = <int, List<NamedLine>>{};
    final extruders = <int, ExtrusionBuilder>{};
    final deepest = z >= maxZoom;
    final lineTolerance = deepest ? 0.75 : 2.0;
    final ringTolerance = deepest ? 0.0 : 2.0;
    final styleZoom = z + sheet.zoomOffset;
    missedGlyphs = false;
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
      final values = [for (final k in keys) context.props[k]];
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
      for (final f in layer.features) {
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
            for (var i = 0; i < _sink.coordCount; i += 2) ...[
              longitudeAt((x + _sink.coords[i] * across) / tiles),
              latitudeAt((y + _sink.coords[i + 1] * across) / tiles),
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
            )).add(
              _sink.coords,
              _starts,
              _ends,
              height.toDouble(),
              base.toDouble(),
              color,
            );
            continue;
          }
          final group = groupFor(b, bucket);
          if (bucket.kind == BucketKind.fill) {
            geometry();
            _addPolygons(group.fill ??= FillMesher(), pending, ringTolerance);
            continue;
          }
          scaled();
          if (bucket.kind == BucketKind.circle) {
            final points = group.points ??= [];
            void add(int i) {
              final x = _sink.coords[i];
              final y = _sink.coords[i + 1];
              if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) return;
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
              mesher.addLine(
                _sink.coords,
                start,
                end,
                lineTolerance,
                caps: bucket.caps,
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
            mesher.addLine(
              _ring,
              0,
              count + 1,
              lineTolerance,
              caps: false,
              join: bucket.outline ? LineJoin.none : null,
            );
          }
        }

        for (final s in symbols) {
          final symbol = sheet.symbols[s];
          if (!symbol.build.filter(context)) continue;
          final text = symbol.build.text(context) as String;
          final icon = symbol.build.icon == null
              ? ''
              : symbol.build.icon!(context) as String;
          if (text.isEmpty && icon.isEmpty) continue;
          final placement = '${symbol.build.placement(context)}';
          final along = placement.startsWith('line');
          final base = (sheet.symbols.length - 1 - s) * 4096;
          final order = _order(symbol, context);
          final carried = symbol.build.paintKeys.isEmpty
              ? null
              : {for (final k in symbol.build.paintKeys) k: context.props[k]};
          if (f.type == mvtPolygon) {
            if (along) continue;
            scaled();
            final at = _inside();
            if (at == null) continue;
            labels.add(
              BuiltLabel(
                s,
                base + order,
                text,
                at.$1,
                at.$2,
                null,
                icon: icon,
                spaced: true,
              )..props = carried,
            );
            continue;
          }
          if (f.type == mvtPoint) {
            if (along) continue;
            scaled();
            final label = _pointLabel(s, base + order, text, icon);
            if (label != null) labels.add(label..props = carried);
            continue;
          }
          scaled();
          final deeper = math.max(0, (symbol.minZoom - styleZoom).ceil());
          // line-center names a line once, at its middle.
          final spacing = placement == 'line-center'
              ? double.infinity
              : symbol.build.spacing * 8 / (1 << deeper);
          final zoom = context.zoom;
          context.zoom = styleZoom + 1;
          final size = finiteOr(symbol.size(context), 16);
          context.zoom = zoom;
          final em = size * tileExtent / 512;
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
              labelLength: _textEms(symbol, text) * em,
              em: em,
              maxBend: symbol.maxBend ?? math.pi / 4,
              props: carried,
              rings: rings,
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
                  angle: symbol.build.iconRotate * math.pi / 180,
                )..props = carried,
              );
            }
            continue;
          }
          final turns = text.isEmpty && !symbol.build.iconUpright;
          _anchorsAlong(
            spacing,
            text.isEmpty ? 0 : _textEms(symbol, text) * em,
            em,
            symbol.maxBend ?? math.pi / 4,
            placement == 'line-center',
            (x, y, angle) => labels.add(
              BuiltLabel(
                s,
                base + (symbol.build.sortKey == null ? 50 : order),
                text,
                x,
                y,
                null,
                icon: icon,
                angle: turns
                    ? angle + symbol.build.iconRotate * math.pi / 180
                    : symbol.build.iconRotate * math.pi / 180,
                spaced: true,
                turns: turns,
              )..props = carried,
            ),
          );
        }
      }
    }

    for (final MapEntry(key: layer, value: lines) in namedLines.entries) {
      for (final named in mergeNamedLines(lines)) {
        labels.addAll(_lineLabels(layer, named));
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
      for (final e in extruders.values) ?e.finish(),
    ], gpu ? _stream(meshes, z) : null);
  }

  /// The tile's GPU stream, cut finer for a style drawn on the globe.
  GpuStream? _stream(List<BuiltMesh> meshes, int z) {
    if (!sheet.projection.isGlobe) return GpuStream.build(sheet, meshes);
    return GpuStream.build(
      sheet,
      meshes,
      fillCells: fillCells(z),
      lineCells: lineCells(z),
    );
  }

  /// Calls [place] at the anchors MapLibre's `getAnchors` gives a symbol
  /// [labelLength] tile units long, an [em] tall, on each line of the sink
  /// cut to the tile, [spacing] apart; with [center], at each line's middle.
  void _anchorsAlong(
    double spacing,
    double labelLength,
    double em,
    double maxBend,
    bool center,
    void Function(double x, double y, double angle) place,
  ) {
    for (var r = 0; r < _sink.ringCount; r++) {
      final ring = Float32List.fromList(
        _sink.coords.sublist(_sink.ringStart(r) * 2, _sink.ringEnd(r) * 2),
      );
      for (final line in clipLineToTile(ring)) {
        final anchors = center
            ? centerAnchor(line, labelLength, 3 / 5 * em, maxBend)
            : lineAnchors(
                line,
                spacing,
                labelLength,
                2 * em,
                3 / 5 * em,
                maxBend,
              );
        for (final (x, y, angle) in anchors) {
          place(x, y, angle);
        }
      }
    }
  }

  /// A point well inside the largest ring in the sink, for a polygon's label:
  /// the spot on a grid over the ring that is furthest from its edge. Null
  /// when that spot is outside the tile, so a polygon cut by a tile edge is
  /// named by the tile holding its middle.
  (double, double)? _inside() {
    final c = _sink.coords;
    var best = -1;
    var bestArea = 0.0;
    for (var r = 0; r < _sink.ringCount; r++) {
      final start = _sink.ringStart(r), end = _sink.ringEnd(r);
      if (end - start < 3) continue;
      var area = 0.0;
      var px = c[end * 2 - 2], py = c[end * 2 - 1];
      for (var i = start; i < end; i++) {
        area += px * c[i * 2 + 1] - c[i * 2] * py;
        px = c[i * 2];
        py = c[i * 2 + 1];
      }
      if (area > bestArea) {
        bestArea = area;
        best = r;
      }
    }
    if (best < 0) return null;
    final start = _sink.ringStart(best), end = _sink.ringEnd(best);
    var minX = double.infinity, minY = double.infinity;
    var maxX = -double.infinity, maxY = -double.infinity;
    for (var i = start; i < end; i++) {
      minX = math.min(minX, c[i * 2]);
      maxX = math.max(maxX, c[i * 2]);
      minY = math.min(minY, c[i * 2 + 1]);
      maxY = math.max(maxY, c[i * 2 + 1]);
    }

    /// How far inside the ring a point is, squared. Negative when outside.
    double depth(double x, double y) {
      var inside = false;
      var nearest = double.infinity;
      var ax = c[end * 2 - 2], ay = c[end * 2 - 1];
      for (var i = start; i < end; i++) {
        final bx = c[i * 2], by = c[i * 2 + 1];
        if ((ay > y) != (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) {
          inside = !inside;
        }
        final dx = bx - ax, dy = by - ay;
        final length = dx * dx + dy * dy;
        var t = length == 0 ? 0.0 : ((x - ax) * dx + (y - ay) * dy) / length;
        t = t.clamp(0.0, 1.0);
        final qx = ax + dx * t - x, qy = ay + dy * t - y;
        nearest = math.min(nearest, qx * qx + qy * qy);
        ax = bx;
        ay = by;
      }
      return inside ? nearest : -nearest;
    }

    var bx = (minX + maxX) / 2, by = (minY + maxY) / 2;
    var bestDepth = depth(bx, by);
    var stepX = (maxX - minX) / 8, stepY = (maxY - minY) / 8;
    var fromX = minX + stepX / 2, fromY = minY + stepY / 2;
    for (var pass = 0; pass < 3; pass++) {
      final cx = bx, cy = by;
      for (var gy = 0; gy < 8; gy++) {
        for (var gx = 0; gx < 8; gx++) {
          final x = pass == 0 ? fromX + gx * stepX : cx + (gx - 3.5) * stepX;
          final y = pass == 0 ? fromY + gy * stepY : cy + (gy - 3.5) * stepY;
          final d = depth(x, y);
          if (d > bestDepth) {
            bestDepth = d;
            bx = x;
            by = y;
          }
        }
      }
      stepX /= 4;
      stepY /= 4;
      fromX = 0;
      fromY = 0;
    }
    if (bestDepth <= 0) return null;
    if (bx < 0 || by < 0 || bx >= tileExtent || by >= tileExtent) return null;
    return (bx, by);
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

  /// Where a label stands among its layer's own, lowest first: by
  /// `symbol-sort-key`, and without one in the order of the features.
  static int _order(SymbolLayer symbol, EvalContext context) {
    final key = symbol.build.sortKey;
    if (key == null) return 50;
    final value = key(context);
    return value is num ? value.round().clamp(0, 4095) : 50;
  }

  BuiltLabel? _pointLabel(int layer, int priority, String text, String icon) {
    if (_sink.coordCount < 2) return null;
    final x = _sink.coords[0];
    final y = _sink.coords[1];
    if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) return null;
    return BuiltLabel(layer, priority, text, x, y, null, icon: icon);
  }

  /// How long [text] is in ems at [symbol]'s letter spacing, as MapLibre
  /// measures a label: from the style's glyph ranges, its letters joined,
  /// when the labels are drawn from them; else as the fonts set it, or
  /// about half an em a letter.
  double _textEms(SymbolLayer symbol, String text) {
    final label = symbol.uppercase ? text.toUpperCase() : text;
    final ranges = this.ranges;
    if (ranges != null) {
      final face = ranges.face(symbol.fontStack);
      final forms = [
        for (final c in joinedForms(label.runes.toList()))
          if (c >= 0) c,
      ];
      if (ranges.ready(face, String.fromCharCodes(forms))) {
        var width = 0.0;
        for (final c in forms) {
          final g = ranges.glyph(face, c);
          if (g != null) {
            width += g.advance / GlyphPbf.em + symbol.letterSpacing;
          }
        }
        return width;
      }
      missedGlyphs = true;
    }
    return _fontEms[text] ??= () {
      final fonts = this.fonts;
      if (fonts == null) return text.runes.length * 0.55;
      return layoutText(
            fonts,
            label,
            weight: symbol.weight,
            letterSpacing: symbol.letterSpacing,
            singleLine: true,
            stack: symbol.fontStack,
          )?.width ??
          text.runes.length * 0.55;
    }();
  }

  final Map<String, double> _fontEms = {};

  /// A name along each line of [named], as MapLibre's `getAnchors` places
  /// them: the line cut to the tile, anchors its spacing apart from an
  /// offset of half the label's length and two ems, where the whole name
  /// fits on the line and the line turns no more than its bend allows
  /// under it; at the middle when none does. With [center], once at the
  /// middle.
  List<BuiltLabel> _lineLabels(
    int layer,
    NamedLine named, {
    bool center = false,
  }) {
    final out = <BuiltLabel>[];
    final window = 3 / 5 * named.em;
    final extra = 2 * named.em;
    for (final ring in named.rings) {
      for (final line in clipLineToTile(ring)) {
        for (final (x, y, _)
            in center
                ? centerAnchor(line, named.labelLength, window, named.maxBend)
                : lineAnchors(
                    line,
                    named.spacing,
                    named.labelLength,
                    extra,
                    window,
                    named.maxBend,
                  )) {
          out.add(
            BuiltLabel(layer, named.priority, named.text, x, y, line)
              ..props = named.props,
          );
        }
      }
    }
    return out;
  }
}

/// A name to lay along the [rings] of one feature, x and y in turn in tile
/// units.
class NamedLine {
  NamedLine({
    required this.priority,
    required this.text,
    required this.spacing,
    required this.labelLength,
    required this.em,
    required this.maxBend,
    required this.props,
    required this.rings,
  });

  final int priority;
  final String text;
  final double spacing, labelLength, em, maxBend;
  final Map<String, Object?>? props;
  List<Float32List> rings;
}

/// [lines] with the first line of each joined to the first lines of the
/// same name that meet it end to start, as MapLibre's `mergeLines` joins a
/// road cut into many ways before naming it, so a name has the whole road
/// to fit on. A joined line keeps the first feature's properties.
List<NamedLine> mergeNamedLines(List<NamedLine> lines) {
  final merged = <(NamedLine, List<Float32List>)?>[];
  final leftIndex = <String, int>{};
  final rightIndex = <String, int>{};
  String key(String text, Float32List line, {required bool end}) => end
      ? '$text:${line[line.length - 2]}:${line[line.length - 1]}'
      : '$text:${line[0]}:${line[1]}';

  for (final named in lines) {
    final chunks = [named.rings.first];
    final leftKey = key(named.text, chunks.first, end: false);
    final rightKey = key(named.text, chunks.last, end: true);
    final before = rightIndex[leftKey];
    final after = leftIndex[rightKey];
    if (before != null && after != null && before != after) {
      // Lines of the same name meet both ends: all three become one.
      final target = merged[before]!;
      final tail = merged[after]!;
      target.$2
        ..addAll(chunks)
        ..addAll(tail.$2);
      merged[after] = null;
      rightIndex.remove(leftKey);
      leftIndex.remove(rightKey);
      rightIndex[key(named.text, target.$2.last, end: true)] = before;
    } else if (before != null) {
      merged[before]!.$2.addAll(chunks);
      rightIndex.remove(leftKey);
      rightIndex[rightKey] = before;
    } else if (after != null) {
      merged[after]!.$2.insertAll(0, chunks);
      leftIndex.remove(rightKey);
      leftIndex[leftKey] = after;
    } else {
      merged.add((named, chunks));
      leftIndex[leftKey] = merged.length - 1;
      rightIndex[rightKey] = merged.length - 1;
    }
  }
  return [
    for (final entry in merged)
      if (entry case (final named, final chunks))
        named..rings = [_joinChunks(chunks), ...named.rings.skip(1)],
  ];
}

Float32List _joinChunks(List<Float32List> chunks) {
  if (chunks.length == 1) return chunks.first;
  final out = <double>[...chunks.first];
  for (final chunk in chunks.skip(1)) {
    out.addAll(chunk.skip(2));
  }
  return Float32List.fromList(out);
}

/// [line], x and y in turn, cut where it leaves the tile into the pieces
/// inside it, as MapLibre's `clipLine` cuts a line before placing names.
List<Float32List> clipLineToTile(Float32List line) {
  const lo = 0.0, hi = tileExtent + 0.0;
  final out = <Float32List>[];
  var piece = <double>[];
  void flush() {
    if (piece.length >= 4) out.add(Float32List.fromList(piece));
    piece = <double>[];
  }

  for (var i = 2; i < line.length; i += 2) {
    var x0 = line[i - 2].toDouble(), y0 = line[i - 1].toDouble();
    var x1 = line[i].toDouble(), y1 = line[i + 1].toDouble();
    var t0 = 0.0, t1 = 1.0;
    final dx = x1 - x0, dy = y1 - y0;
    var inside = true;
    for (final (p, q) in [
      (-dx, x0 - lo),
      (dx, hi - x0),
      (-dy, y0 - lo),
      (dy, hi - y0),
    ]) {
      if (p == 0) {
        if (q < 0) inside = false;
        continue;
      }
      final r = q / p;
      if (p < 0) {
        if (r > t1) inside = false;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) inside = false;
        if (r < t1) t1 = r;
      }
    }
    if (!inside) {
      flush();
      continue;
    }
    final ax = x0 + dx * t0, ay = y0 + dy * t0;
    final bx = x0 + dx * t1, by = y0 + dy * t1;
    if (piece.isEmpty || piece[piece.length - 2] != ax || piece.last != ay) {
      flush();
      piece.addAll([ax, ay]);
    }
    piece.addAll([bx, by]);
    if (t1 < 1) flush();
  }
  flush();
  return out;
}

double _lineLength(Float32List line) {
  var length = 0.0;
  for (var i = 2; i < line.length; i += 2) {
    final dx = line[i] - line[i - 2], dy = line[i + 1] - line[i - 1];
    length += math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

/// The anchors MapLibre's `getAnchors` gives a name [labelLength] long on
/// [line], cut to the tile.
List<(double, double, double)> lineAnchors(
  Float32List line,
  double spacing,
  double labelLength,
  double extra,
  double window,
  double maxBend,
) {
  final continued =
      line[0] == 0 ||
      line[0] == tileExtent ||
      line[1] == 0 ||
      line[1] == tileExtent;
  if (spacing - labelLength < spacing / 4) {
    spacing = labelLength + spacing / 4;
  }
  final offset = continued
      ? (spacing / 2) % spacing
      : (labelLength / 2 + extra) % spacing;
  final anchors = _resample(
    line,
    offset,
    spacing,
    labelLength,
    window,
    maxBend,
  );
  if (anchors.isEmpty && !continued) {
    return _resample(
      line,
      _lineLength(line) / 2,
      spacing,
      labelLength,
      window,
      maxBend,
    );
  }
  return anchors;
}

/// The middle of [line], when a name [labelLength] long fits there.
List<(double, double, double)> centerAnchor(
  Float32List line,
  double labelLength,
  double window,
  double maxBend,
) {
  final middle = _lineLength(line) / 2;
  return _resample(
    line,
    middle,
    double.infinity,
    0,
    window,
    maxBend,
  ).where((_) => labelLength <= middle * 2).toList();
}

List<(double, double, double)> _resample(
  Float32List line,
  double offset,
  double spacing,
  double labelLength,
  double window,
  double maxBend,
) {
  final half = labelLength / 2;
  final length = _lineLength(line);
  final out = <(double, double, double)>[];
  var distance = 0.0;
  var marked = spacing.isFinite ? offset - spacing : offset;
  final step = spacing.isFinite ? spacing : 0.0;
  var done = false;
  for (var i = 2; i < line.length && !done; i += 2) {
    final ax = line[i - 2].toDouble(), ay = line[i - 1].toDouble();
    final bx = line[i].toDouble(), by = line[i + 1].toDouble();
    final segment = math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
    while (marked + step < distance + segment) {
      marked += step;
      final t = (marked - distance) / segment;
      final x = (ax + (bx - ax) * t).roundToDouble();
      final y = (ay + (by - ay) * t).roundToDouble();
      if (x >= 0 &&
          x < tileExtent &&
          y >= 0 &&
          y < tileExtent &&
          marked - half >= 0 &&
          marked + half <= length &&
          _bendsLittle(line, i ~/ 2 - 1, x, y, labelLength, window, maxBend)) {
        out.add((x, y, math.atan2(by - ay, bx - ax)));
      }
      if (!spacing.isFinite) {
        done = true;
        break;
      }
    }
    distance += segment;
  }
  return out;
}

/// MapLibre's `checkMaxAngle`: whether [line] turns no more than
/// [maxBend] within any [window] under a name [labelLength] long whose
/// anchor [x], [y] lies on segment [segment].
bool _bendsLittle(
  Float32List line,
  int segment,
  double x,
  double y,
  double labelLength,
  double window,
  double maxBend,
) {
  if (labelLength == 0) return true;
  double px(int i) => line[i * 2].toDouble();
  double py(int i) => line[i * 2 + 1].toDouble();
  double dist(double ax, double ay, double bx, double by) =>
      math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
  var index = segment + 1;
  var anchorDistance = 0.0;
  var cx = x, cy = y;
  while (anchorDistance > -labelLength / 2) {
    index--;
    if (index < 0) return false;
    anchorDistance -= dist(px(index), py(index), cx, cy);
    cx = px(index);
    cy = py(index);
  }
  anchorDistance += dist(px(index), py(index), px(index + 1), py(index + 1));
  index++;
  final corners = <(double, double)>[];
  var recent = 0.0;
  final count = line.length ~/ 2;
  while (anchorDistance < labelLength / 2) {
    if (index + 1 >= count) return false;
    final before = math.atan2(
      py(index) - py(index - 1),
      px(index) - px(index - 1),
    );
    final after = math.atan2(
      py(index + 1) - py(index),
      px(index + 1) - px(index),
    );
    var delta = before - after;
    delta = (((delta + 3 * math.pi) % (math.pi * 2)) - math.pi).abs();
    corners.add((anchorDistance, delta));
    recent += delta;
    while (anchorDistance - corners.first.$1 > window) {
      recent -= corners.removeAt(0).$2;
    }
    if (recent > maxBend) return false;
    anchorDistance += dist(px(index), py(index), px(index + 1), py(index + 1));
    index++;
  }
  return true;
}

Float32List? _floats(Object? packed) =>
    packed == null ? null : unpackFloats(packed);
