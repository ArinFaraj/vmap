import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

import 'mvt.dart';

import 'mlt_geometry.dart';
import 'mlt_streams.dart';

/// Reads a tile in the MapLibre Tile format, MLT, which a source with
/// `"encoding": "mlt"` serves, into the same layers an MVT tile gives.
///
/// A column of a kind it does not know ends its reading of that layer:
/// the layer's features keep their geometry and the properties read
/// before it.
List<TileLayer> decodeMltTile(Uint8List bytes) {
  final layers = <TileLayer>[];
  final c = MltCursor(bytes);
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

const _typeGeometry = 4;
const _typeScalars = 10;
const _typeStruct = 30;
const _typeMap = 31;

class _Column {
  _Column(this.code, this.name, this.children);

  static _Column read(MltCursor c, {required bool field}) {
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

TileLayer? _readLayer(MltCursor c) {
  final name = c.string();
  final extent = c.varint();
  final columns = [
    for (var i = 0, n = c.varint(); i < n; i++) _Column.read(c, field: false),
  ];
  List<int?>? ids;
  MltGeometry? geometry;
  final names = <String>[];
  final values = <List<Object?>>[];
  var count = 0;
  for (final column in columns) {
    if (column.isId) {
      final present = column.nullable ? mltBools(c, MltStream(c)) : null;
      final m = MltStream(c);
      count = present?.length ?? m.count;
      final long = column.code & 2 != 0;
      final read = long ? mltInts64(c, m) : mltInts(c, m, signed: false);
      ids = _spread(_constant(read, count, present), present).cast<int?>();
    } else if (column.code == _typeGeometry) {
      final streams = c.varint();
      geometry = MltGeometry.read(c, streams, count);
      if (count == 0) count = geometry.types.length;
    } else if (column.isScalar) {
      final streams = column.scalar == 9 ? c.varint() : 1;
      if (streams == 0) continue;
      final present = column.nullable ? mltBools(c, MltStream(c)) : null;
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
    } else if (column.code == _typeMap) {
      final streams = c.varint();
      if (streams == 0) continue;
      for (final (childName, childValues) in _nested(c, column, streams)) {
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
  MltCursor c,
  int scalar,
  int streams,
  Uint8List? present,
  int count,
) {
  if (scalar == 9) return _strings(c, streams, present);
  final m = MltStream(c);
  final start = c.pos;
  final List<Object?> read;
  switch (scalar) {
    case 0:
      read = [for (final b in mltBools(c, m)) b == 1];
    case 1 || 3:
      read = _constant(mltInts(c, m, signed: true), count, present);
    case 2 || 4:
      read = _constant(mltInts(c, m, signed: false), count, present);
    case 5:
      read = _constant(mltInts64(c, m, signed: true), count, present);
    case 6:
      read = _constant(mltInts64(c, m), count, present);
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

List<Object?> _strings(MltCursor c, int streams, Uint8List? present) {
  List<int>? index;
  List<int>? dictionaryOffsets;
  List<int>? symbolOffsets;
  List<int>? plainOffsets;
  Uint8List? dictionary;
  Uint8List? symbols;
  Uint8List? plain;
  var bits = present;
  for (var i = 0; i < streams; i++) {
    final m = MltStream(c);
    switch (m.physical) {
      case mltPresent:
        final read = mltBools(c, m);
        bits ??= read;
      case mltOffset:
        index = mltInts(c, m, signed: false);
      case mltLength:
        final offsets = _offsets(mltInts(c, m, signed: false));
        switch (m.sub) {
          case mltLengthDictionary:
            dictionaryOffsets = offsets;
          case mltLengthSymbol:
            symbolOffsets = offsets;
          default:
            plainOffsets = offsets;
        }
      case mltData:
        final data = Uint8List.sublistView(
          c.bytes,
          c.pos,
          c.pos + m.byteLength,
        );
        c.pos += m.byteLength;
        switch (m.sub) {
          case mltDictionaryFsst:
            symbols = data;
          case mltDictionarySingle || mltDictionaryShared:
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
List<(String, List<Object?>)> _sharedDictionary(MltCursor c, _Column column) {
  List<int>? dictionaryOffsets;
  List<int>? symbolOffsets;
  Uint8List? dictionary;
  Uint8List? symbols;
  while (dictionary == null) {
    final m = MltStream(c);
    if (m.physical == mltLength) {
      final offsets = _offsets(mltInts(c, m, signed: false));
      if (m.sub == mltLengthDictionary) {
        dictionaryOffsets = offsets;
      } else {
        symbolOffsets = offsets;
      }
    } else {
      final data = Uint8List.sublistView(c.bytes, c.pos, c.pos + m.byteLength);
      c.pos += m.byteLength;
      if (m.physical == mltData &&
          (m.sub == mltDictionarySingle || m.sub == mltDictionaryShared)) {
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
    final present = child.nullable ? mltBools(c, MltStream(c)) : null;
    final index = mltInts(c, MltStream(c), signed: false);
    out.add(('${column.name}${child.name}', _lookUp(texts, index, present)));
  }
  return out;
}

const _mapStrings = 1;
const _mapInt32 = 2;
const _mapUint32 = 4;
const _mapInt64 = 8;
const _mapUint64 = 16;
const _mapFloat = 32;
const _mapDouble = 64;
const _mapPresent = 128;

const _tokenFalse = 0;
const _tokenTrue = 1;
const _tokenMap = 2;
const _tokenList = 3;
const _tokenFirstValue = 4;

/// A nested property column: maps, lists and scalars of any shape, one
/// value per feature for each child, or for the column itself without
/// children. Its values are tokens: structure, or an index into one
/// dictionary of every scalar.
List<(String, List<Object?>)> _nested(
  MltCursor c,
  _Column column,
  int streams,
) {
  final names = column.children.isEmpty
      ? [column.name]
      : [for (final child in column.children) '${column.name}${child.name}'];
  final mask = c.bytes[c.pos++];
  final lengths = mltInts(c, MltStream(c), signed: false);
  var left = streams - 1;
  final dictionary = <Object?>[];
  if (mask & _mapStrings != 0) {
    final count = c.bytes[c.pos++];
    dictionary.addAll(_strings(c, count, null));
    left -= count;
  }
  if (mask & _mapInt32 != 0) {
    dictionary.addAll(mltInts(c, MltStream(c), signed: true));
    left--;
  } else if (mask & _mapInt64 != 0) {
    dictionary.addAll(mltInts64(c, MltStream(c), signed: true));
    left--;
  }
  if (mask & _mapUint32 != 0) {
    dictionary.addAll(mltInts(c, MltStream(c), signed: false));
    left--;
  } else if (mask & _mapUint64 != 0) {
    dictionary.addAll(mltInts64(c, MltStream(c)));
    left--;
  }
  for (final (bit, size) in [(_mapFloat, 4), (_mapDouble, 8)]) {
    if (mask & bit == 0) continue;
    final m = MltStream(c);
    final view = ByteData.sublistView(c.bytes, c.pos, c.pos + m.byteLength);
    for (var i = 0; i < m.numValues; i++) {
      dictionary.add(
        size == 4
            ? view.getFloat32(i * 4, Endian.little)
            : view.getFloat64(i * 8, Endian.little),
      );
    }
    c.pos += m.byteLength;
    left--;
  }
  Uint8List? present;
  if (mask & _mapPresent != 0) {
    present = mltBools(c, MltStream(c));
    left--;
  }
  final List<int> tokens = left > 0
      ? mltInts(c, MltStream(c), signed: false)
      : const [];
  final features = (present?.length ?? lengths.length) ~/ names.length;

  var counted = 0;
  var at = 0;
  final out = <(String, List<Object?>)>[];
  for (var child = 0; child < names.length; child++) {
    final values = List<Object?>.filled(features, null);
    for (var f = 0; f < features; f++) {
      if (present != null && present[child * features + f] == 0) continue;
      final end = at + lengths[counted++];
      if (end > tokens.length) {
        throw const FormatException('An MLT map runs past its values');
      }
      values[f] = end - at == 1 || tokens[at] == _tokenList
          ? _NestedReader(tokens, dictionary, end).value(at, end).$1
          : _NestedReader(tokens, dictionary, end).entries(at, end);
      at = end;
    }
    out.add((names[child], values));
  }
  return out;
}

class _NestedReader {
  _NestedReader(this.tokens, this.dictionary, this.end);

  final List<int> tokens;
  final List<Object?> dictionary;
  final int end;

  Object? scalar(int token) {
    final i = token - _tokenFirstValue;
    if (i < 0 || i >= dictionary.length) {
      throw const FormatException('An MLT map value is out of its dictionary');
    }
    return dictionary[i];
  }

  Map<String, Object?> entries(int from, int to) {
    final out = <String, Object?>{};
    var i = from;
    while (i < to) {
      final key = scalar(tokens[i++]);
      if (key is! String) {
        throw const FormatException('An MLT map key is not a string');
      }
      final (item, next) = value(i, to);
      out[key] = item;
      i = next;
    }
    return out;
  }

  (Object?, int) value(int at, int to) {
    if (at >= to) throw const FormatException('An MLT map value is cut off');
    final token = tokens[at];
    switch (token) {
      case _tokenFalse:
        return (false, at + 1);
      case _tokenTrue:
        return (true, at + 1);
      case _tokenMap || _tokenList:
        if (at + 1 >= to || tokens[at + 1] < 2 || at + tokens[at + 1] > to) {
          throw const FormatException('An MLT map nests past its end');
        }
        final stop = at + tokens[at + 1];
        if (token == _tokenMap) return (entries(at + 2, stop), stop);
        final list = <Object?>[];
        var i = at + 2;
        while (i < stop) {
          final (item, next) = value(i, stop);
          list.add(item);
          i = next;
        }
        return (list, stop);
      default:
        return (scalar(token), at + 1);
    }
  }
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
  final MltGeometry geometry;

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
