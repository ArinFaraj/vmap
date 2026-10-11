import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';

import 'mvt.dart';
import 'style.dart';
import 'tessellate.dart';

const double tileExtent = 4096;

class BuiltMesh {
  BuiltMesh(this.group, this.chunk, {this.isPolyline = false});

  final int group;
  final MeshChunk chunk;

  /// True when [chunk] holds raw polylines rather than triangles.
  final bool isPolyline;
}

class BuiltLabel {
  BuiltLabel(
    this.kind,
    this.labelClass,
    this.priority,
    this.text,
    this.x,
    this.y,
    this.line,
  );

  final int kind;
  final int labelClass;
  final int priority;
  final String text;
  final double x;
  final double y;

  /// The road's centre line as x,y pairs in tile units. Null for point labels.
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
          m.isPolyline ? -1 - m.group : m.group,
          TransferableTypedData.fromList([m.chunk.positions]),
          if (m.chunk.extrusions case final e?)
            TransferableTypedData.fromList([e])
          else
            null,
          TransferableTypedData.fromList([m.chunk.indices]),
        ],
    ],
    [
      for (final l in labels)
        [l.kind, l.labelClass, l.priority, l.text, l.x, l.y, l.line],
    ],
  ];

  static BuiltTile fromMessage(List<Object?> message) {
    final meshes = <BuiltMesh>[];
    for (final m in message[0]! as List) {
      final parts = m as List;
      final tag = parts[0] as int;
      meshes.add(
        BuiltMesh(
          tag < 0 ? -1 - tag : tag,
          isPolyline: tag < 0,
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
          parts[2] as int,
          parts[3] as String,
          parts[4] as double,
          parts[5] as double,
          parts[6] as Float32List?,
        ),
      );
    }
    return BuiltTile(meshes, labels);
  }
}

class TileBuilder {
  TileBuilder(this.nameKeys, {this.linesAsPolylines = false});

  /// Emit lines as raw polylines for path stroking instead of triangles.
  final bool linesAsPolylines;

  /// Feature properties tried in order for a label's text.
  final List<String> nameKeys;

  final GeometrySink _sink = GeometrySink();
  Float64List _ring = Float64List(4096);
  final List<int> _holes = [];

  BuiltTile build(Uint8List bytes, int z) {
    final tile = MvtTile.decode(bytes);
    final fills = List<FillMesher?>.filled(Group.fillCount, null);
    final lines = List<LineMesher?>.filled(Group.count, null);
    final polylines_ = List<PolylineCollector?>.filled(Group.count, null);
    final labels = <BuiltLabel>[];
    final overzoomed = z >= 14;
    final lineTolerance = overzoomed ? 0.75 : 2.0;
    final ringTolerance = overzoomed ? 0.0 : 2.0;

    FillMesher fill(int group) => fills[group] ??= FillMesher();
    LineMesher line(int group) => lines[group] ??= LineMesher();

    void polygons(
      String layerName,
      int Function(MvtLayer layer, MvtFeature f) classify, {
      required List<String> keys,
    }) {
      final layer = tile.layers[layerName];
      if (layer == null) return;
      _keyCache = [for (final k in keys) layer.keyIndex(k)];
      final scale = tileExtent / layer.extent;
      for (final f in layer.features) {
        if (f.type != mvtPolygon) continue;
        final group = classify(layer, f);
        if (group < 0) continue;
        _sink.clear();
        f.readGeometry(_sink);
        _addPolygons(fill(group), scale, ringTolerance);
      }
    }

    void polylines(
      String layerName,
      int Function(MvtLayer layer, MvtFeature f) classify, {
      required List<String> keys,
      bool caps = true,
    }) {
      final layer = tile.layers[layerName];
      if (layer == null) return;
      _keyCache = [for (final k in keys) layer.keyIndex(k)];
      final scale = tileExtent / layer.extent;
      for (final f in layer.features) {
        if (f.type != mvtLine) continue;
        final group = classify(layer, f);
        if (group < 0) continue;
        _sink.clear();
        f.readGeometry(_sink);
        if (scale != 1) _scaleSink(scale);
        if (linesAsPolylines) {
          final collector = polylines_[group] ??= PolylineCollector();
          for (var r = 0; r < _sink.ringCount; r++) {
            collector.addLine(
              _sink.coords,
              _sink.ringStart(r),
              _sink.ringEnd(r),
              lineTolerance,
            );
          }
          continue;
        }
        final mesher = line(group);
        for (var r = 0; r < _sink.ringCount; r++) {
          mesher.addLine(
            _sink.coords,
            _sink.ringStart(r),
            _sink.ringEnd(r),
            lineTolerance,
            caps: caps,
          );
        }
      }
    }

    polygons('landuse', keys: const ['class'], (l, f) {
      return switch (f.tag(l, _keyCache[0])) {
        'residential' ||
        'suburb' ||
        'neighbourhood' ||
        'quarter' => Group.residential,
        'commercial' || 'retail' || 'industrial' => Group.commercial,
        'school' || 'university' || 'college' || 'kindergarten' => Group.school,
        'hospital' => Group.hospital,
        'cemetery' => Group.grass,
        'pitch' || 'stadium' || 'playground' || 'track' => Group.pitch,
        _ => -1,
      };
    });
    polygons('landcover', keys: const ['class'], (l, f) {
      return switch (f.tag(l, _keyCache[0])) {
        'grass' || 'wetland' => Group.grass,
        'wood' => Group.wood,
        'sand' => Group.sand,
        _ => -1,
      };
    });
    polygons('park', keys: const [], (l, f) => Group.park);
    polygons('water', keys: const [], (l, f) => Group.water);
    polygons('aeroway', keys: const ['class'], (l, f) {
      final c = f.tag(l, _keyCache[0]);
      return c == 'runway' || c == 'taxiway' || c == 'apron'
          ? Group.aeroway
          : -1;
    });
    polygons('transportation', keys: const ['class'], (l, f) {
      return f.tag(l, _keyCache[0]) == 'path' ? Group.pedestrian : -1;
    });
    polygons('building', keys: const [], (l, f) => Group.building);

    polylines('waterway', keys: const ['brunnel'], (l, f) {
      return f.tag(l, _keyCache[0]) == 'tunnel' ? -1 : Group.waterway;
    });
    polylines('aeroway', keys: const ['class'], (l, f) {
      return switch (f.tag(l, _keyCache[0])) {
        'runway' => Group.runway,
        'taxiway' => Group.taxiway,
        _ => -1,
      };
    });
    polylines('transportation', keys: const ['class', 'brunnel', 'ramp'], (
      l,
      f,
    ) {
      var group = switch (f.tag(l, _keyCache[0])) {
        'motorway' => Group.motorway,
        'trunk' => Group.trunk,
        'primary' => Group.primary,
        'secondary' || 'tertiary' => Group.secondary,
        'minor' => Group.minor,
        'service' || 'track' => Group.service,
        'path' => Group.path,
        'rail' || 'transit' => Group.rail,
        _ => -1,
      };
      if (group < 0) return -1;
      if (f.tag(l, _keyCache[2]) == 1 &&
          (group == Group.motorway || group == Group.trunk)) {
        group = Group.primary;
      }
      return f.tag(l, _keyCache[1]) == 'bridge'
          ? group + Group.bridgeOffset
          : group;
    });
    polylines(
      'boundary',
      keys: const ['admin_level', 'maritime'],
      caps: false,
      (l, f) {
        if (f.tag(l, _keyCache[1]) == 1) return -1;
        final level = f.tag(l, _keyCache[0]);
        if (level is! int) return -1;
        if (level <= 2) return Group.boundaryCountry;
        return level <= 4 ? Group.boundaryRegion : -1;
      },
    );

    _placeLabels(tile, labels);
    _roadLabels(tile, labels);
    _waterLabels(tile, labels);

    final meshes = <BuiltMesh>[];
    for (var g = 0; g < Group.fillCount; g++) {
      for (final chunk in fills[g]?.finish() ?? const <MeshChunk>[]) {
        meshes.add(BuiltMesh(g, chunk));
      }
    }
    for (var g = Group.fillCount; g < Group.count; g++) {
      for (final chunk in lines[g]?.finish() ?? const <MeshChunk>[]) {
        meshes.add(BuiltMesh(g, chunk));
      }
      for (final chunk in polylines_[g]?.finish() ?? const <MeshChunk>[]) {
        meshes.add(BuiltMesh(g, chunk, isPolyline: true));
      }
    }
    return BuiltTile(meshes, labels);
  }

  List<int> _keyCache = const [];

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

  String? _name(MvtLayer layer, MvtFeature f, List<int> keyIndices) {
    for (final k in keyIndices) {
      final v = f.tag(layer, k);
      if (v is String && v.isNotEmpty) return v;
    }
    return null;
  }

  void _placeLabels(MvtTile tile, List<BuiltLabel> out) {
    final layer = tile.layers['place'];
    if (layer == null) return;
    final names = [for (final k in nameKeys) layer.keyIndex(k)];
    final classKey = layer.keyIndex('class');
    final rankKey = layer.keyIndex('rank');
    final capitalKey = layer.keyIndex('capital');
    final scale = tileExtent / layer.extent;
    for (final f in layer.features) {
      if (f.type != mvtPoint) continue;
      final labelClass = switch (f.tag(layer, classKey)) {
        'country' => LabelClasses.country,
        'state' || 'province' => LabelClasses.state,
        'city' =>
          f.tag(layer, capitalKey) == 2
              ? LabelClasses.capital
              : LabelClasses.city,
        'town' => LabelClasses.town,
        'village' || 'hamlet' || 'isolated_dwelling' => LabelClasses.village,
        'suburb' || 'quarter' => LabelClasses.suburb,
        'neighbourhood' => LabelClasses.neighbourhood,
        _ => -1,
      };
      if (labelClass < 0) continue;
      final text = _name(layer, f, names);
      if (text == null) continue;
      _sink.clear();
      f.readGeometry(_sink);
      if (_sink.coordCount < 2) continue;
      final x = _sink.coords[0] * scale;
      final y = _sink.coords[1] * scale;
      if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) continue;
      final rank = f.tag(layer, rankKey);
      final priority =
          LabelClasses.all[labelClass].priority +
          (rank is int ? rank.clamp(0, 99) : 50);
      out.add(
        BuiltLabel(LabelKind.place, labelClass, priority, text, x, y, null),
      );
    }
  }

  void _waterLabels(MvtTile tile, List<BuiltLabel> out) {
    final layer = tile.layers['water_name'];
    if (layer == null) return;
    final names = [for (final k in nameKeys) layer.keyIndex(k)];
    final scale = tileExtent / layer.extent;
    for (final f in layer.features) {
      if (f.type != mvtPoint) continue;
      final text = _name(layer, f, names);
      if (text == null) continue;
      _sink.clear();
      f.readGeometry(_sink);
      if (_sink.coordCount < 2) continue;
      final x = _sink.coords[0] * scale;
      final y = _sink.coords[1] * scale;
      if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) continue;
      out.add(
        BuiltLabel(
          LabelKind.water,
          LabelClasses.water,
          LabelClasses.all[LabelClasses.water].priority,
          text,
          x,
          y,
          null,
        ),
      );
    }
  }

  void _roadLabels(MvtTile tile, List<BuiltLabel> out) {
    final layer = tile.layers['transportation_name'];
    if (layer == null) return;
    final names = [for (final k in nameKeys) layer.keyIndex(k)];
    final classKey = layer.keyIndex('class');
    final scale = tileExtent / layer.extent;
    for (final f in layer.features) {
      if (f.type != mvtLine) continue;
      final roadClass = f.tag(layer, classKey);
      final int labelClass;
      final int classRank;
      switch (roadClass) {
        case 'motorway' || 'trunk':
          labelClass = LabelClasses.roadMajor;
          classRank = 0;
        case 'primary':
          labelClass = LabelClasses.roadMajor;
          classRank = 10;
        case 'secondary' || 'tertiary':
          labelClass = LabelClasses.roadMajor;
          classRank = 20;
        case 'minor' || 'service' || 'track':
          labelClass = LabelClasses.roadMinor;
          classRank = 0;
        default:
          continue;
      }
      final text = _name(layer, f, names);
      if (text == null) continue;
      _sink.clear();
      f.readGeometry(_sink);
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
      if (best < 0 || bestLength * scale < 160) continue;
      final start = _sink.ringStart(best);
      final count = _sink.ringEnd(best) - start;
      final line = Float32List(count * 2);
      for (var i = 0; i < count * 2; i++) {
        line[i] = c[start * 2 + i] * scale;
      }
      var walked = 0.0;
      var mx = line[0].toDouble();
      var my = line[1].toDouble();
      final half = bestLength * scale / 2;
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
      if (mx < 0 || my < 0 || mx >= tileExtent || my >= tileExtent) continue;
      final lengthBonus = (bestLength * scale / 80).clamp(0, 9).toInt();
      out.add(
        BuiltLabel(
          LabelKind.road,
          labelClass,
          LabelClasses.all[labelClass].priority + classRank + 9 - lengthBonus,
          text,
          mx,
          my,
          line,
        ),
      );
    }
  }
}
