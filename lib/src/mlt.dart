import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

import 'mvt.dart';

/// Reads a tile in the MapLibre Tile format, MLT, which a source with
/// `"encoding": "mlt"` serves, into the same layers an MVT tile gives.
///
/// A column of a kind it does not read, such as a nested MAP property,
/// ends its reading of that layer: the layer's features keep their
/// geometry and the properties read before it.
List<TileLayer> decodeMltTile(Uint8List bytes) {
  final layers = <TileLayer>[];
  final c = _Cursor(bytes);
  try {
    while (c.pos < bytes.length) {
      final length = c.varint();
      final end = c.pos + length;
      if (end > bytes.length) {
        throw const FormatException('An MLT block runs past its tile');
      }
      final tag = c.varint();
      if (tag == 1 || tag == 2) {
        final layer = _readLayer(c);
        if (layer != null) layers.add(layer);
      }
      c.pos = end;
    }
  } on RangeError {
    throw const FormatException('An MLT tile reads past its end');
  }
  return layers;
}

/// More values than this in one stream mark a corrupt tile, which would
/// otherwise ask for gigabytes.
const _maxValues = 1 << 24;

const _present = 0;
const _data = 1;
const _offset = 2;
const _length = 3;

const _delta = 1;
const _componentwiseDelta = 2;
const _rle = 3;
const _morton = 4;

const _fastPfor = 1;
const _varint = 2;

const _dictionarySingle = 1;
const _dictionaryShared = 2;
const _dictionaryMorton = 4;
const _dictionaryFsst = 5;

const _lengthGeometries = 1;
const _lengthParts = 2;
const _lengthRings = 3;
const _lengthSymbol = 5;
const _lengthDictionary = 6;

const _offsetVertex = 0;
const _offsetIndex = 1;

const _typeGeometry = 4;
const _typeScalars = 10;
const _typeStruct = 30;
const _typeMap = 31;

class _Column {
  _Column(this.code, this.name, this.children);

  static _Column read(_Cursor c, {required bool field}) {
    final code = c.varint();
    final String name;
    if (code >= _typeScalars) {
      name = c.string();
    } else if (field) {
      throw FormatException('MLT field type $code');
    } else {
      name = code < _typeGeometry ? 'id' : 'geometry';
    }
    final children = <_Column>[];
    if (code == _typeStruct || code == _typeMap) {
      for (var i = 0, n = c.varint(); i < n; i++) {
        children.add(read(c, field: true));
      }
    }
    return _Column(code, name, children);
  }

  final int code;
  final String name;
  final List<_Column> children;

  bool get isId => code < _typeGeometry;
  bool get isScalar => code >= _typeScalars && code < _typeStruct;
  bool get nullable => isId || isScalar ? code & 1 == 1 : code == _typeMap;

  /// For a scalar: boolean, int8, uint8, int32, uint32, int64, uint64,
  /// float, double or string, from 0 to 9.
  int get scalar => (code - _typeScalars) >> 1;
}

class _Meta {
  _Meta(_Cursor c) {
    final kind = c.bytes[c.pos++];
    physical = kind >> 4;
    sub = kind & 0xf;
    final encodings = c.bytes[c.pos++];
    logical1 = encodings >> 5;
    logical2 = (encodings >> 2) & 7;
    technique = encodings & 3;
    numValues = c.varint();
    byteLength = c.varint();
    count = numValues;
    if (logical1 == _morton) {
      numBits = c.varint();
      shift = c.varint();
    } else if ((logical1 == _rle || logical2 == _rle) && technique != 0) {
      runs = c.varint();
      count = c.varint();
    }
    if (numValues > _maxValues ||
        count > _maxValues ||
        byteLength > c.bytes.length - c.pos) {
      throw const FormatException('An MLT stream is larger than its tile');
    }
  }

  late final int physical;

  /// The dictionary, offset or length type, as [physical] has one.
  late final int sub;
  late final int logical1;
  late final int logical2;
  late final int technique;
  late final int numValues;
  late final int byteLength;

  /// The number of values once decoded.
  late int count;
  int? runs;
  int numBits = 0;
  int shift = 0;
}

TileLayer? _readLayer(_Cursor c) {
  final name = c.string();
  final extent = c.varint();
  final columns = [
    for (var i = 0, n = c.varint(); i < n; i++) _Column.read(c, field: false),
  ];
  List<int?>? ids;
  _Geometry? geometry;
  final names = <String>[];
  final values = <List<Object?>>[];
  var count = 0;
  for (final column in columns) {
    if (column.isId) {
      final present = column.nullable ? _bools(c, _Meta(c)) : null;
      final m = _Meta(c);
      count = present?.length ?? m.count;
      final long = column.code & 2 != 0;
      final read = long ? _ints64(c, m) : _ints(c, m, signed: false);
      ids = _spread(_constant(read, count, present), present).cast<int?>();
    } else if (column.code == _typeGeometry) {
      final streams = c.varint();
      geometry = _Geometry.read(c, streams, count);
      if (count == 0) count = geometry.types.length;
    } else if (column.isScalar) {
      final streams = column.scalar == 9 ? c.varint() : 1;
      if (streams == 0) continue;
      final present = column.nullable ? _bools(c, _Meta(c)) : null;
      names.add(column.name);
      values.add(
        _scalar(
          c,
          column.scalar,
          column.nullable ? streams - 1 : streams,
          present,
          count,
        ),
      );
    } else if (column.code == _typeStruct) {
      final streams = c.varint();
      if (streams == 0) continue;
      for (final (childName, childValues) in _sharedDictionary(c, column)) {
        names.add(childName);
        values.add(childValues);
      }
    } else {
      break;
    }
  }
  if (geometry == null) return null;
  return _MltLayer(name, extent, ids, names, values, geometry);
}

List<Object?> _scalar(
  _Cursor c,
  int scalar,
  int streams,
  Uint8List? present,
  int count,
) {
  if (scalar == 9) return _strings(c, streams, present);
  final m = _Meta(c);
  final start = c.pos;
  final List<Object?> read;
  switch (scalar) {
    case 0:
      read = [for (final b in _bools(c, m)) b == 1];
    case 1 || 3:
      read = _constant(_ints(c, m, signed: true), count, present);
    case 2 || 4:
      read = _constant(_ints(c, m, signed: false), count, present);
    case 5:
      read = _constant(_ints64(c, m, signed: true), count, present);
    case 6:
      read = _constant(_ints64(c, m), count, present);
    case 7:
      final view = ByteData.sublistView(c.bytes, start, start + m.byteLength);
      read = [
        for (var i = 0; i < m.numValues; i++)
          view.getFloat32(i * 4, Endian.little),
      ];
    case 8:
      final view = ByteData.sublistView(c.bytes, start, start + m.byteLength);
      read = [
        for (var i = 0; i < m.numValues; i++)
          view.getFloat64(i * 8, Endian.little),
      ];
    default:
      throw FormatException('MLT scalar type $scalar');
  }
  c.pos = start + m.byteLength;
  return _spread(read, present);
}

/// A single stored value stands for every feature, as MLT writes a
/// column whose features all share one value.
List<int> _constant(List<int> values, int count, Uint8List? present) {
  final wanted = present == null
      ? count
      : present.fold<int>(0, (sum, p) => sum + p);
  if (values.length != 1 || wanted <= 1) return values;
  return List<int>.filled(wanted, values[0]);
}

/// [values] holds only the present ones; nulls fill in the rest.
List<Object?> _spread(List<Object?> values, Uint8List? present) {
  if (present == null) return values;
  var k = 0;
  return [
    for (final p in present)
      if (p == 1 && k < values.length) values[k++] else null,
  ];
}

List<Object?> _strings(_Cursor c, int streams, Uint8List? present) {
  List<int>? index;
  List<int>? dictionaryOffsets;
  List<int>? symbolOffsets;
  List<int>? plainOffsets;
  Uint8List? dictionary;
  Uint8List? symbols;
  Uint8List? plain;
  var bits = present;
  for (var i = 0; i < streams; i++) {
    final m = _Meta(c);
    switch (m.physical) {
      case _present:
        final read = _bools(c, m);
        bits ??= read;
      case _offset:
        index = _ints(c, m, signed: false);
      case _length:
        final offsets = _offsets(_ints(c, m, signed: false));
        switch (m.sub) {
          case _lengthDictionary:
            dictionaryOffsets = offsets;
          case _lengthSymbol:
            symbolOffsets = offsets;
          default:
            plainOffsets = offsets;
        }
      case _data:
        final data = Uint8List.sublistView(
          c.bytes,
          c.pos,
          c.pos + m.byteLength,
        );
        c.pos += m.byteLength;
        switch (m.sub) {
          case _dictionaryFsst:
            symbols = data;
          case _dictionarySingle || _dictionaryShared:
            dictionary = data;
          case 0:
            plain = data;
        }
      default:
        c.pos += m.byteLength;
    }
  }
  if (symbols != null && dictionary != null) {
    dictionary = _fsst(symbols, symbolOffsets!, dictionary);
  }
  if (dictionary != null) {
    return _lookUp(_texts(dictionary, dictionaryOffsets!), index!, bits);
  }
  if (plain == null || plainOffsets == null) return const [];
  final texts = _texts(plain, plainOffsets);
  if (index != null) return _lookUp(texts, index, bits);
  return _spread(texts, bits);
}

/// [index] holds a dictionary entry for each present value.
List<Object?> _lookUp(
  List<String> texts,
  List<int> index,
  Uint8List? present,
) => _spread([
  for (final i in index) i < texts.length ? texts[i] : null,
], present);

List<String> _texts(Uint8List data, List<int> offsets) => [
  for (var i = 0; i + 1 < offsets.length; i++)
    utf8.decode(
      Uint8List.sublistView(
        data,
        math.min(offsets[i], data.length),
        math.min(offsets[i + 1], data.length),
      ),
      allowMalformed: true,
    ),
];

/// Lengths to the offsets where each value starts, with the end last.
List<int> _offsets(List<int> lengths) {
  final out = Uint32List(lengths.length + 1);
  for (var i = 0; i < lengths.length; i++) {
    out[i + 1] = out[i] + lengths[i];
  }
  return out;
}

/// The string columns of a struct, which share one dictionary.
List<(String, List<Object?>)> _sharedDictionary(_Cursor c, _Column column) {
  List<int>? dictionaryOffsets;
  List<int>? symbolOffsets;
  Uint8List? dictionary;
  Uint8List? symbols;
  while (dictionary == null) {
    final m = _Meta(c);
    if (m.physical == _length) {
      final offsets = _offsets(_ints(c, m, signed: false));
      if (m.sub == _lengthDictionary) {
        dictionaryOffsets = offsets;
      } else {
        symbolOffsets = offsets;
      }
    } else {
      final data = Uint8List.sublistView(c.bytes, c.pos, c.pos + m.byteLength);
      c.pos += m.byteLength;
      if (m.physical == _data &&
          (m.sub == _dictionarySingle || m.sub == _dictionaryShared)) {
        dictionary = data;
      } else {
        symbols = data;
      }
    }
  }
  if (symbols != null) dictionary = _fsst(symbols, symbolOffsets!, dictionary);
  final texts = _texts(dictionary, dictionaryOffsets!);
  final out = <(String, List<Object?>)>[];
  for (final child in column.children) {
    final streams = c.varint();
    if (streams == 0) continue;
    final present = child.nullable ? _bools(c, _Meta(c)) : null;
    final index = _ints(c, _Meta(c), signed: false);
    out.add(('${column.name}${child.name}', _lookUp(texts, index, present)));
  }
  return out;
}

/// Expands FSST compressed bytes: each byte is a symbol's index, or 255
/// followed by a literal byte.
Uint8List _fsst(Uint8List symbols, List<int> symbolOffsets, Uint8List data) {
  final buffer = Uint8List(data.length * 8);
  var n = 0;
  for (var i = 0; i < data.length; i++) {
    final code = data[i];
    if (code == 255) {
      if (++i < data.length) buffer[n++] = data[i];
    } else if (code + 1 < symbolOffsets.length) {
      for (var s = symbolOffsets[code]; s < symbolOffsets[code + 1]; s++) {
        buffer[n++] = symbols[s];
      }
    }
  }
  return Uint8List.sublistView(buffer, 0, n);
}

/// Bits stored as ORC's byte run length encoding, one 0 or 1 for each of
/// the stream's values.
Uint8List _bools(_Cursor c, _Meta m) {
  final n = m.numValues;
  final packed = Uint8List((n + 7) >> 3);
  final end = c.pos + m.byteLength;
  var i = 0;
  while (i < packed.length && c.pos < end) {
    final header = c.bytes[c.pos++];
    if (header <= 0x7f) {
      final value = c.bytes[c.pos++];
      final stop = math.min(i + header + 3, packed.length);
      packed.fillRange(i, stop, value);
      i = stop;
    } else {
      for (var k = 256 - header; k > 0 && i < packed.length; k--) {
        packed[i++] = c.bytes[c.pos++];
      }
    }
  }
  c.pos = end;
  final out = Uint8List(n);
  for (var j = 0; j < n; j++) {
    out[j] = (packed[j >> 3] >> (j & 7)) & 1;
  }
  return out;
}

/// The 32 bit integers of a stream, unpacked and with its logical
/// encoding undone.
List<int> _ints(_Cursor c, _Meta m, {required bool signed}) {
  final start = c.pos;
  final Uint32List raw;
  switch (m.technique) {
    case _fastPfor:
      raw = _FastPfor.decode(c.bytes, start, m.byteLength, m.numValues);
    case _varint:
      raw = Uint32List(m.numValues);
      for (var i = 0; i < raw.length; i++) {
        raw[i] = c.varint();
      }
    default:
      final view = ByteData.sublistView(c.bytes, start, start + m.byteLength);
      raw = Uint32List(m.numValues);
      for (var i = 0; i < raw.length; i++) {
        raw[i] = view.getUint32(i * 4, Endian.little);
      }
  }
  c.pos = start + m.byteLength;
  final List<int> out = signed ? Int32List(m.count) : Uint32List(m.count);
  switch (m.logical1) {
    case _delta:
      final deltas = m.logical2 == _rle ? _expand(raw, m) : raw;
      var sum = 0;
      for (var i = 0; i < out.length && i < deltas.length; i++) {
        sum += _zigzag(deltas[i]);
        out[i] = sum;
      }
    case _rle:
      final values = _expand(raw, m);
      for (var i = 0; i < out.length && i < values.length; i++) {
        out[i] = signed ? _zigzag(values[i]) : values[i];
      }
    case _morton:
      var sum = 0;
      for (var i = 0; i < out.length && i < raw.length; i++) {
        sum += raw[i];
        out[i] = sum;
      }
    case _componentwiseDelta:
      var x = 0;
      var y = 0;
      for (var i = 0; i + 1 < out.length && i + 1 < raw.length; i += 2) {
        x += _zigzag(raw[i]);
        y += _zigzag(raw[i + 1]);
        out[i] = x;
        out[i + 1] = y;
      }
    default:
      for (var i = 0; i < out.length && i < raw.length; i++) {
        out[i] = signed ? _zigzag(raw[i]) : raw[i];
      }
  }
  return out;
}

/// The same for 64 bit integers, which are stored as varints or as plain
/// little endian words.
List<int> _ints64(_Cursor c, _Meta m, {bool signed = false}) {
  final start = c.pos;
  final List<int> raw;
  if (m.technique == _varint) {
    raw = [for (var i = 0; i < m.numValues; i++) c.varint()];
  } else {
    final view = ByteData.sublistView(c.bytes, start, start + m.byteLength);
    raw = [
      for (var i = 0; i < m.numValues; i++)
        view.getUint32(i * 8 + 4, Endian.little) * 0x100000000 +
            view.getUint32(i * 8, Endian.little),
    ];
  }
  c.pos = start + m.byteLength;
  final out = List<int>.filled(m.count, 0);
  switch (m.logical1) {
    case _delta:
      final deltas = m.logical2 == _rle ? _expand(raw, m) : raw;
      var sum = 0;
      for (var i = 0; i < out.length && i < deltas.length; i++) {
        sum += _zigzag64(deltas[i]);
        out[i] = sum;
      }
    case _rle:
      final values = _expand(raw, m);
      for (var i = 0; i < out.length && i < values.length; i++) {
        out[i] = signed ? _zigzag64(values[i]) : values[i];
      }
    default:
      for (var i = 0; i < out.length && i < raw.length; i++) {
        out[i] = signed ? _zigzag64(raw[i]) : raw[i];
      }
  }
  return out;
}

/// Runs stored as their lengths, then their values.
List<int> _expand(List<int> raw, _Meta m) {
  final runs = m.runs ?? raw.length ~/ 2;
  final out = List<int>.filled(m.count, 0);
  var o = 0;
  for (var i = 0; i < runs && i + runs < raw.length; i++) {
    final end = math.min(o + raw[i], out.length);
    out.fillRange(o, end, raw[i + runs]);
    o = end;
  }
  return out;
}

/// Written without an exclusive or, which comes out unsigned in
/// JavaScript.
@pragma('vm:prefer-inline')
int _zigzag(int v) => (v & 1) == 0 ? v >>> 1 : -(v >>> 1) - 1;

int _zigzag64(int v) => v.isEven ? v ~/ 2 : -((v + 1) ~/ 2);

class _Geometry {
  _Geometry(this.types, this.xy, this.rings, this.featureRings);

  static _Geometry read(_Cursor c, int streams, int count) {
    final typeMeta = _Meta(c);
    var types = _ints(c, typeMeta, signed: false);
    if (types.length == 1 && count > 1) {
      types = Uint32List(count)..fillRange(0, count, types[0]);
    }
    List<int>? geometryLengths;
    List<int>? partLengths;
    List<int>? ringLengths;
    List<int>? vertexOffsets;
    List<int>? vertices;
    var tessellated = false;
    _Meta? mortonMeta;
    for (var i = 0; i < streams - 1; i++) {
      final m = _Meta(c);
      switch (m.physical) {
        case _length:
          final lengths = _ints(c, m, signed: false);
          switch (m.sub) {
            case _lengthGeometries:
              geometryLengths = lengths;
            case _lengthParts:
              partLengths = lengths;
            case _lengthRings:
              ringLengths = lengths;
          }
        case _offset:
          final offsets = _ints(c, m, signed: false);
          if (m.sub == _offsetVertex) vertexOffsets = offsets;
          if (m.sub == _offsetIndex) tessellated = true;
        case _data:
          if (m.sub == _dictionaryMorton) {
            mortonMeta = m;
            vertices = _ints(c, m, signed: false);
          } else {
            vertices = _ints(c, m, signed: true);
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
  if (root.last > _maxValues) {
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
  if (level1.last > _maxValues) {
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
  final _Meta? morton;
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

  _Geometry build() {
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
    return _Geometry(
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

class _MltLayer implements TileLayer {
  _MltLayer(
    this.name,
    this.extent,
    this.ids,
    this.names,
    this.values,
    this.geometry,
  ) {
    features = [
      for (var i = 0; i < geometry.types.length; i++) _MltFeature(this, i),
    ];
  }

  @override
  final String name;
  @override
  final int extent;
  final List<int?>? ids;
  final List<String> names;
  final List<List<Object?>> values;
  final _Geometry geometry;

  @override
  late final List<TileFeature> features;
}

class _MltFeature implements TileFeature {
  _MltFeature(this._layer, this._index);

  final _MltLayer _layer;
  final int _index;

  @override
  int get type => switch (_layer.geometry.types[_index]) {
    0 || 3 => mvtPoint,
    1 || 4 => mvtLine,
    _ => mvtPolygon,
  };

  @override
  Map<String, Object?> allTags(TileLayer layer) {
    final ids = _layer.ids;
    final id = ids != null && _index < ids.length ? ids[_index] : null;
    final out = <String, Object?>{r'$id': ?id};
    for (var c = 0; c < _layer.names.length; c++) {
      final column = _layer.values[c];
      final value = _index < column.length ? column[_index] : null;
      if (value != null) out[_layer.names[c]] = value;
    }
    return out;
  }

  @override
  void readGeometry(GeometrySink out) {
    final g = _layer.geometry;
    final xy = g.xy;
    for (var r = g.featureRings[_index]; r < g.featureRings[_index + 1]; r++) {
      out.beginRing();
      for (var v = g.rings[r]; v < g.rings[r + 1]; v++) {
        out.add(xy[v * 2], xy[v * 2 + 1]);
      }
    }
    out.end();
  }
}

/// FastPFOR, as MLT stores it: big endian words holding pages of 256
/// value blocks bit packed at a width each, with wider outliers patched
/// in, and a variable byte tail.
abstract final class _FastPfor {
  static const _block = 256;
  static const _page = 65536;

  static Uint32List decode(Uint8List bytes, int start, int length, int count) {
    final words = Uint32List(length >> 2);
    for (var i = 0, b = start; i < words.length; i++, b += 4) {
      words[i] =
          bytes[b] << 24 |
          bytes[b + 1] << 16 |
          bytes[b + 2] << 8 |
          bytes[b + 3];
    }
    final out = Uint32List(count);
    var inPos = 0;
    var outPos = 0;
    if (words.isNotEmpty) {
      final aligned = words[inPos++];
      if (aligned % _block != 0 || aligned > count) {
        throw const FormatException('A FastPFOR stream is misaligned');
      }
      while (outPos < aligned) {
        final size = math.min(_page, aligned - outPos);
        inPos = _decodePage(words, out, inPos, outPos, size);
        outPos += size;
      }
    }
    var acc = 0;
    var shift = 0;
    var bit = 0;
    while (outPos < count && inPos < words.length) {
      final byte = (words[inPos] >>> bit) & 0xff;
      bit += 8;
      if (bit == 32) {
        bit = 0;
        inPos++;
      }
      acc |= (byte & 0x7f) << shift;
      if (byte & 0x80 != 0) {
        out[outPos++] = acc;
        acc = 0;
        shift = 0;
      } else {
        shift += 7;
      }
    }
    return out;
  }

  static int _decodePage(
    Uint32List w,
    Uint32List out,
    int pageStart,
    int outPos,
    int size,
  ) {
    final packedEnd = pageStart + w[pageStart];
    final byteSize = w[packedEnd];
    final metaStart = packedEnd + 1;
    final meta = Uint8List(byteSize);
    for (var k = 0; k < byteSize; k++) {
      meta[k] = (w[metaStart + (k >> 2)] >>> ((k & 3) * 8)) & 0xff;
    }
    var at = metaStart + ((byteSize + 3) >> 2);
    final bitmap = w[at++];
    final exceptions = List<Uint32List?>.filled(33, null);
    final taken = List<int>.filled(33, 0);
    for (var width = 2; width <= 32; width++) {
      if ((bitmap >>> (width - 1)) & 1 == 0) continue;
      final n = w[at++];
      final stream = Uint32List((n + 31) & ~31);
      var j = 0;
      for (; j < n; j += 32) {
        _unpack32(w, at, stream, j, width);
        at += width;
      }
      at -= ((j - n) * width) >> 5;
      exceptions[width] = stream;
    }
    var p = pageStart + 1;
    var m = 0;
    for (var block = 0; block < size ~/ _block; block++) {
      final width = meta[m++];
      final count = meta[m++];
      final o = outPos + block * _block;
      if (width == 32) {
        out.setRange(o, o + _block, w, p);
        p += _block;
      } else if (width > 0) {
        for (var g = 0; g < 8; g++) {
          _unpack32(w, p, out, o + g * 32, width);
          p += width;
        }
      }
      if (count == 0) continue;
      final extra = meta[m++] - width;
      if (extra == 1) {
        for (var k = 0; k < count; k++) {
          out[o + meta[m++]] |= 1 << width;
        }
      } else {
        final stream = exceptions[extra];
        if (stream == null) {
          throw const FormatException('A FastPFOR exception is missing');
        }
        for (var k = 0; k < count; k++) {
          out[o + meta[m++]] |= stream[taken[extra]++] << width;
        }
      }
    }
    return at;
  }

  static void _unpack32(
    Uint32List w,
    int inPos,
    Uint32List out,
    int outPos,
    int width,
  ) {
    final mask = width == 32 ? 0xffffffff : (1 << width) - 1;
    for (var i = 0; i < 32; i++) {
      final bit = i * width;
      final word = inPos + (bit >> 5);
      final offset = bit & 31;
      var v = w[word] >>> offset;
      if (offset + width > 32) v |= w[word + 1] << (32 - offset);
      out[outPos + i] = v & mask;
    }
  }
}

class _Cursor {
  _Cursor(this.bytes);

  final Uint8List bytes;
  int pos = 0;

  /// The first four bytes by shifting, the rest by multiplying: a shift
  /// keeps only 32 bits in JavaScript.
  int varint() {
    var result = 0;
    for (var shift = 0; shift < 28; shift += 7) {
      final b = bytes[pos++];
      result |= (b & 0x7f) << shift;
      if (b < 0x80) return result;
    }
    var scale = 0x10000000;
    for (var i = 4; i < 10; i++) {
      final b = bytes[pos++];
      result += (b & 0x7f) * scale;
      if (b < 0x80) return result;
      scale *= 128;
    }
    throw const FormatException('A varint runs over ten bytes');
  }

  String string() {
    final length = varint();
    if (length > bytes.length - pos) {
      throw const FormatException('A string runs past its tile');
    }
    final s = utf8.decode(
      Uint8List.sublistView(bytes, pos, pos + length),
      allowMalformed: true,
    );
    pos += length;
    return s;
  }
}
