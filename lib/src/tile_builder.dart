import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';

import 'expr.dart';
import 'mvt.dart';
import 'style.dart';
import 'tessellate.dart';

const double tileExtent = 4096;

class BuiltMesh {
  BuiltMesh(this.bucket, this.chunk);

  /// Index into the style's buckets.
  final int bucket;
  final MeshChunk chunk;
}

class BuiltLabel {
  BuiltLabel(this.layer, this.priority, this.text, this.x, this.y, this.line);

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
}

class BuiltTile {
  BuiltTile(this.meshes, this.labels);

  final List<BuiltMesh> meshes;
  final List<BuiltLabel> labels;

  /// A sendable form whose buffers move between isolates without a copy on
  /// the receiving side.
  List<Object?> toMessage() => [
    [
      for (final m in meshes)
        [
          m.bucket,
          TransferableTypedData.fromList([m.chunk.positions]),
          if (m.chunk.extrusions case final e?)
            TransferableTypedData.fromList([e])
          else
            null,
          TransferableTypedData.fromList([m.chunk.indices]),
        ],
    ],
    [
      for (final l in labels) [l.layer, l.priority, l.text, l.x, l.y, l.line],
    ],
  ];

  static BuiltTile fromMessage(List<Object?> message) {
    final meshes = <BuiltMesh>[];
    for (final m in message[0]! as List) {
      final parts = m as List;
      meshes.add(
        BuiltMesh(
          parts[0] as int,
          MeshChunk(
            (parts[1] as TransferableTypedData).materialize().asFloat32List(),
            (parts[2] as TransferableTypedData?)?.materialize().asFloat32List(),
            (parts[3] as TransferableTypedData).materialize().asUint16List(),
          ),
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
          parts[3] as double,
          parts[4] as double,
          parts[5] as Float32List?,
        ),
      );
    }
    return BuiltTile(meshes, labels);
  }
}

/// Turns one vector tile into the meshes and labels a style asks for.
class TileBuilder {
  TileBuilder(this.sheet) {
    for (var i = 0; i < sheet.buckets.length; i++) {
      (_buckets[sheet.buckets[i].sourceLayer] ??= []).add(i);
    }
    for (var i = 0; i < sheet.symbols.length; i++) {
      (_symbols[sheet.symbols[i].sourceLayer] ??= []).add(i);
    }
  }

  final StyleSheet sheet;
  final Map<String, List<int>> _buckets = {};
  final Map<String, List<int>> _symbols = {};
  final EvalContext _context = EvalContext();
  final GeometrySink _sink = GeometrySink();
  Float64List _ring = Float64List(4096);
  final List<int> _holes = [];

  /// [maxZoom] is the deepest zoom the source has tiles for; a tile at that
  /// zoom is drawn at every zoom beyond it.
  BuiltTile build(Uint8List bytes, int z, {int maxZoom = 14}) {
    final tile = MvtTile.decode(bytes);
    final fills = <int, FillMesher>{};
    final lines = <int, LineMesher>{};
    final labels = <BuiltLabel>[];
    final deepest = z >= maxZoom;
    final lineTolerance = deepest ? 0.75 : 2.0;
    final ringTolerance = deepest ? 0.0 : 2.0;
    final styleZoom = z + sheet.zoomOffset;
    bool drawnAt(double minZoom, double maxZoom) =>
        maxZoom > styleZoom && (deepest || minZoom < styleZoom + 1);
    final context = _context..zoom = styleZoom;

    for (final layer in tile.layers.values) {
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
      for (final f in layer.features) {
        context
          ..props = f.allTags(layer)
          ..geometryType = switch (f.type) {
            mvtPoint => 'Point',
            mvtLine => 'LineString',
            _ => 'Polygon',
          };
        var read = false;
        var pending = scale;
        void geometry() {
          if (read) return;
          read = true;
          _sink.clear();
          f.readGeometry(_sink);
        }

        for (final b in buckets) {
          final bucket = sheet.buckets[b];
          if (bucket.isLine ? f.type == mvtPoint : f.type != mvtPolygon) {
            continue;
          }
          if (!bucket.filter(context)) continue;
          geometry();
          if (!bucket.isLine) {
            _addPolygons(fills[b] ??= FillMesher(), pending, ringTolerance);
            continue;
          }
          if (pending != 1) {
            _scaleSink(pending);
            pending = 1;
          }
          final mesher = lines[b] ??= LineMesher();
          for (var r = 0; r < _sink.ringCount; r++) {
            final start = _sink.ringStart(r);
            final end = _sink.ringEnd(r);
            if (f.type == mvtLine) {
              mesher.addLine(
                _sink.coords,
                start,
                end,
                lineTolerance,
                caps: bucket.caps,
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
            mesher.addLine(_ring, 0, count + 1, lineTolerance, caps: false);
          }
        }

        for (final s in symbols) {
          if (f.type == mvtPolygon) continue;
          final symbol = sheet.symbols[s];
          if (!symbol.filter(context)) continue;
          final text = symbol.text(context) as String;
          if (text.isEmpty) continue;
          final along = '${symbol.placement(context)}'.startsWith('line');
          if (along != (f.type == mvtLine)) continue;
          geometry();
          if (pending != 1) {
            _scaleSink(pending);
            pending = 1;
          }
          final base = (sheet.symbols.length - 1 - s) * 4096;
          final label = along
              ? _lineLabel(s, base, text)
              : _pointLabel(s, base, text, context.props['rank']);
          if (label != null) labels.add(label);
        }
      }
    }

    final meshes = <BuiltMesh>[];
    for (var b = 0; b < sheet.buckets.length; b++) {
      final chunks = fills[b]?.finish() ?? lines[b]?.finish();
      if (chunks == null) continue;
      for (final chunk in chunks) {
        meshes.add(BuiltMesh(b, chunk));
      }
    }
    return BuiltTile(meshes, labels);
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

  BuiltLabel? _pointLabel(int layer, int base, String text, Object? rank) {
    if (_sink.coordCount < 2) return null;
    final x = _sink.coords[0];
    final y = _sink.coords[1];
    if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) return null;
    return BuiltLabel(
      layer,
      base + (rank is int ? rank.clamp(0, 99) : 50),
      text,
      x,
      y,
      null,
    );
  }

  /// Labels the feature's longest line, anchored at its middle.
  BuiltLabel? _lineLabel(int layer, int base, String text) {
    final c = _sink.coords;
    var best = -1;
    var bestLength = 0.0;
    for (var r = 0; r < _sink.ringCount; r++) {
      var length = 0.0;
      for (var i = _sink.ringStart(r) + 1; i < _sink.ringEnd(r); i++) {
        final dx = c[i * 2] - c[i * 2 - 2];
        final dy = c[i * 2 + 1] - c[i * 2 - 1];
        length += math.sqrt(dx * dx + dy * dy);
      }
      if (length > bestLength) {
        bestLength = length;
        best = r;
      }
    }
    if (best < 0 || bestLength < 160) return null;
    final start = _sink.ringStart(best);
    final count = _sink.ringEnd(best) - start;
    final line = Float32List(count * 2);
    for (var i = 0; i < count * 2; i++) {
      line[i] = c[start * 2 + i];
    }
    var walked = 0.0;
    var mx = line[0].toDouble();
    var my = line[1].toDouble();
    final half = bestLength / 2;
    for (var i = 1; i < count; i++) {
      final dx = line[i * 2] - line[i * 2 - 2];
      final dy = line[i * 2 + 1] - line[i * 2 - 1];
      final seg = math.sqrt(dx * dx + dy * dy);
      if (walked + seg >= half) {
        final t = seg == 0 ? 0.0 : (half - walked) / seg;
        mx = line[i * 2 - 2] + dx * t;
        my = line[i * 2 - 1] + dy * t;
        break;
      }
      walked += seg;
    }
    if (mx < 0 || my < 0 || mx >= tileExtent || my >= tileExtent) return null;
    final lengthBonus = (bestLength / 80).clamp(0, 9).toInt();
    return BuiltLabel(layer, base + 9 - lengthBonus, text, mx, my, line);
  }
}
