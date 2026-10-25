import 'dart:typed_data';

import 'mlt_streams.dart';

class MltGeometry {
  MltGeometry(this.types, this.xy, this.rings, this.featureRings);

  static MltGeometry read(MltCursor c, int streams, int count) {
    final typeMeta = MltStream(c);
    var types = mltInts(c, typeMeta, signed: false);
    if (types.length == 1 && count > 1) {
      types = Uint32List(count)..fillRange(0, count, types[0]);
    }
    List<int>? geometryLengths;
    List<int>? partLengths;
    List<int>? ringLengths;
    List<int>? vertexOffsets;
    List<int>? vertices;
    var tessellated = false;
    MltStream? mortonMeta;
    for (var i = 0; i < streams - 1; i++) {
      final m = MltStream(c);
      switch (m.physical) {
        case mltLength:
          final lengths = mltInts(c, m, signed: false);
          switch (m.sub) {
            case mltLengthGeometries:
              geometryLengths = lengths;
            case mltLengthParts:
              partLengths = lengths;
            case mltLengthRings:
              ringLengths = lengths;
          }
        case mltOffset:
          final offsets = mltInts(c, m, signed: false);
          if (m.sub == mltOffsetVertex) vertexOffsets = offsets;
          if (m.sub == mltOffsetIndex) tessellated = true;
        case mltData:
          if (m.sub == mltDictionaryMorton) {
            mortonMeta = m;
            vertices = mltInts(c, m, signed: false);
          } else {
            vertices = mltInts(c, m, signed: true);
          }
        default:
          c.pos += m.byteLength;
      }
    }
    // A tessellated tile's vertices are in drawing order already.
    if (tessellated) vertexOffsets = null;
    List<int>? geometryOffsets;
    List<int>? partOffsets;
    List<int>? ringOffsets;
    if (geometryLengths != null) {
      geometryOffsets = _root(types, geometryLengths, 2);
      if (partLengths != null && ringLengths != null) {
        partOffsets = _level1(types, geometryOffsets, partLengths, false);
        ringOffsets = _level2(types, geometryOffsets, partOffsets, ringLengths);
      } else if (partLengths != null) {
        partOffsets = _level1(types, geometryOffsets, partLengths, null);
      }
    } else if (partLengths != null && ringLengths != null) {
      partOffsets = _root(types, partLengths, 1);
      ringOffsets = _level1(types, partOffsets, ringLengths, true);
    } else if (partLengths != null) {
      partOffsets = _root(types, partLengths, 0);
    }
    return _Builder(
      types,
      geometryOffsets,
      partOffsets,
      ringOffsets,
      vertexOffsets,
      vertices ?? Int32List(0),
      mortonMeta,
    ).build();
  }

  final List<int> types;
  final Int32List xy;

  /// The first vertex of each ring, and the end of the last.
  final Int32List rings;

  /// The first ring of each feature, and the end of the last.
  final Int32List featureRings;
}

/// For each geometry, where its entries in the next level start: a
/// geometry of a type above [level] has a stored length, the rest one.
List<int> _root(List<int> types, List<int> lengths, int level) {
  final out = Uint32List(types.length + 1);
  var k = 0;
  for (var i = 0; i < types.length; i++) {
    out[i + 1] =
        out[i] + (types[i] > level && k < lengths.length ? lengths[k++] : 1);
  }
  return out;
}

/// The same one level down. Polygons always have stored lengths here,
/// lines when [lines] is true, and when [lines] is null there are no
/// rings, so lines have them and polygons do not occur.
List<int> _level1(
  List<int> types,
  List<int> root,
  List<int> lengths,
  bool? lines,
) {
  if (root.last > mltMaxValues) {
    throw const FormatException('An MLT geometry has too many parts');
  }
  final out = Uint32List(root.last + 1);
  var o = 1;
  var k = 0;
  for (var i = 0; i < types.length; i++) {
    final t = types[i];
    final stored = lines == null
        ? t == 1 || t == 4
        : t == 5 || t == 2 || (lines && (t == 4 || t == 1));
    for (var j = root[i]; j < root[i + 1]; j++) {
      out[o] = out[o - 1] + (stored && k < lengths.length ? lengths[k++] : 1);
      o++;
    }
  }
  return out;
}

List<int> _level2(
  List<int> types,
  List<int> root,
  List<int> level1,
  List<int> lengths,
) {
  if (level1.last > mltMaxValues) {
    throw const FormatException('An MLT geometry has too many rings');
  }
  final out = Uint32List(level1.last + 1);
  var p = 1;
  var o = 1;
  var k = 0;
  for (var i = 0; i < types.length; i++) {
    final t = types[i];
    for (var j = root[i]; j < root[i + 1]; j++) {
      if (t != 0 && t != 3) {
        for (var n = level1[p] - level1[p - 1]; n > 0; n--) {
          out[o] = out[o - 1] + (k < lengths.length ? lengths[k++] : 0);
          o++;
        }
      } else {
        out[o] = out[o - 1] + 1;
        o++;
      }
      p++;
    }
  }
  return out;
}

class _Builder {
  _Builder(
    this.types,
    this.geometries,
    this.parts,
    this.ringsAt,
    this.offsets,
    this.vertices,
    this.morton,
  ) : polygons = types.any((t) => t == 2 || t == 5);

  final List<int> types;
  final List<int>? geometries;
  final List<int>? parts;
  final List<int>? ringsAt;
  final List<int>? offsets;
  final List<int> vertices;
  final MltStream? morton;
  final bool polygons;

  final _xy = <int>[];
  final _rings = <int>[];
  int _v = 0;
  int _g = 1;
  int _p = 1;
  int _r = 1;

  void _vertex() {
    final i = _v++;
    final offsets = this.offsets;
    final morton = this.morton;
    if (offsets == null) {
      _xy
        ..add(_at(i * 2))
        ..add(_at(i * 2 + 1));
    } else if (morton != null) {
      final code = _at(offsets[i]);
      _xy
        ..add(_unmorton(code, morton.numBits) - morton.shift)
        ..add(_unmorton(code >> 1, morton.numBits) - morton.shift);
    } else {
      final o = offsets[i] * 2;
      _xy
        ..add(_at(o))
        ..add(_at(o + 1));
    }
  }

  int _at(int i) => vertices[i];

  void _ring(int n) {
    _rings.add(_xy.length >> 1);
    for (var k = 0; k < n; k++) {
      _vertex();
    }
  }

  int _step(List<int>? at, int i) =>
      at == null || i >= at.length ? 0 : at[i] - at[i - 1];

  int _lineLength() {
    if (polygons) return _step(ringsAt, _r++);
    return _step(parts, _p);
  }

  MltGeometry build() {
    final featureRings = Int32List(types.length + 1);
    for (var i = 0; i < types.length; i++) {
      featureRings[i] = _rings.length;
      switch (types[i]) {
        case 0:
          _ring(1);
          if (geometries != null) _g++;
          if (parts != null) _p++;
          if (ringsAt != null) _r++;
        case 3:
          final n = _step(geometries, _g++);
          _ring(n);
          _p += n;
          _r += n;
        case 1:
          final n = _lineLength();
          _p++;
          _ring(n);
          if (geometries != null) _g++;
        case 2:
          _polygon();
          if (geometries != null) _g++;
        case 4:
          for (var n = _step(geometries, _g++); n > 0; n--) {
            final length = _lineLength();
            _p++;
            _ring(length);
          }
        case 5:
          for (var n = _step(geometries, _g++); n > 0; n--) {
            _polygon();
          }
      }
    }
    featureRings[types.length] = _rings.length;
    _rings.add(_xy.length >> 1);
    return MltGeometry(
      types,
      Int32List.fromList(_xy),
      Int32List.fromList(_rings),
      featureRings,
    );
  }

  void _polygon() {
    for (var n = _step(parts, _p++); n > 0; n--) {
      _ring(_step(ringsAt, _r++));
    }
  }
}

int _unmorton(int code, int bits) {
  var out = 0;
  for (var i = 0; i < bits; i++) {
    out |= ((code >> (2 * i)) & 1) << i;
  }
  return out;
}
