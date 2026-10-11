import 'dart:convert';
import 'dart:typed_data';

const int mvtPoint = 1;
const int mvtLine = 2;
const int mvtPolygon = 3;

class MvtTile {
  MvtTile(this.layers);

  final Map<String, MvtLayer> layers;

  static MvtTile decode(Uint8List bytes) {
    final layers = <String, MvtLayer>{};
    final r = _Reader(bytes, 0, bytes.length);
    while (r.hasMore) {
      final tag = r.varint();
      if (tag == 26) {
        final len = r.varint();
        final layer = MvtLayer._decode(bytes, r.pos, r.pos + len);
        layers[layer.name] = layer;
        r.pos += len;
      } else {
        r.skip(tag & 7);
      }
    }
    return MvtTile(layers);
  }
}

class MvtLayer {
  MvtLayer._(this.name, this.extent, this.keys, this.values, this.features);

  final String name;
  final int extent;
  final List<String> keys;
  final List<Object?> values;
  final List<MvtFeature> features;

  int keyIndex(String key) => keys.indexOf(key);

  static MvtLayer _decode(Uint8List bytes, int start, int end) {
    var name = '';
    var extent = 4096;
    final keys = <String>[];
    final values = <Object?>[];
    final features = <MvtFeature>[];
    final r = _Reader(bytes, start, end);
    while (r.hasMore) {
      final tag = r.varint();
      switch (tag) {
        case 10:
          name = r.string();
        case 18:
          final len = r.varint();
          features.add(MvtFeature._decode(bytes, r.pos, r.pos + len));
          r.pos += len;
        case 26:
          keys.add(r.string());
        case 34:
          final len = r.varint();
          values.add(_decodeValue(bytes, r.pos, r.pos + len));
          r.pos += len;
        case 40:
          extent = r.varint();
        default:
          r.skip(tag & 7);
      }
    }
    return MvtLayer._(name, extent, keys, values, features);
  }

  static Object? _decodeValue(Uint8List bytes, int start, int end) {
    final r = _Reader(bytes, start, end);
    Object? value;
    while (r.hasMore) {
      final tag = r.varint();
      switch (tag) {
        case 10:
          value = r.string();
        case 21:
          value = r.float32();
        case 25:
          value = r.float64();
        case 32:
        case 40:
          value = r.varint();
        case 48:
          final v = r.varint();
          value = (v >>> 1) ^ -(v & 1);
        case 56:
          value = r.varint() != 0;
        default:
          r.skip(tag & 7);
      }
    }
    return value;
  }
}

class MvtFeature {
  MvtFeature._(
    this._bytes,
    this.type,
    this._tagsStart,
    this._tagsEnd,
    this._geomStart,
    this._geomEnd,
  );

  final Uint8List _bytes;
  final int type;
  final int _tagsStart;
  final int _tagsEnd;
  final int _geomStart;
  final int _geomEnd;

  static MvtFeature _decode(Uint8List bytes, int start, int end) {
    var type = 0;
    var tagsStart = 0;
    var tagsEnd = 0;
    var geomStart = 0;
    var geomEnd = 0;
    final r = _Reader(bytes, start, end);
    while (r.hasMore) {
      final tag = r.varint();
      switch (tag) {
        case 18:
          final len = r.varint();
          tagsStart = r.pos;
          tagsEnd = r.pos + len;
          r.pos = tagsEnd;
        case 24:
          type = r.varint();
        case 34:
          final len = r.varint();
          geomStart = r.pos;
          geomEnd = r.pos + len;
          r.pos = geomEnd;
        default:
          r.skip(tag & 7);
      }
    }
    return MvtFeature._(bytes, type, tagsStart, tagsEnd, geomStart, geomEnd);
  }

  /// The value stored under the key at [keyIndex] in [layer], or null.
  Object? tag(MvtLayer layer, int keyIndex) {
    if (keyIndex < 0) return null;
    final r = _Reader(_bytes, _tagsStart, _tagsEnd);
    while (r.hasMore) {
      final k = r.varint();
      final v = r.varint();
      if (k == keyIndex) return layer.values[v];
    }
    return null;
  }

  Map<String, Object?> allTags(MvtLayer layer) {
    final out = <String, Object?>{};
    final r = _Reader(_bytes, _tagsStart, _tagsEnd);
    while (r.hasMore) {
      final k = r.varint();
      final v = r.varint();
      out[layer.keys[k]] = layer.values[v];
    }
    return out;
  }

  /// Appends this feature's rings to [out]. A point feature yields one ring
  /// holding every point.
  void readGeometry(GeometrySink out) {
    final r = _Reader(_bytes, _geomStart, _geomEnd);
    var x = 0;
    var y = 0;
    final isPoint = type == mvtPoint;
    if (isPoint) out.beginRing();
    while (r.hasMore) {
      final cmd = r.varint();
      final id = cmd & 7;
      final count = cmd >>> 3;
      if (id == 1) {
        for (var i = 0; i < count; i++) {
          final dx = r.varint();
          final dy = r.varint();
          x += (dx >>> 1) ^ -(dx & 1);
          y += (dy >>> 1) ^ -(dy & 1);
          if (!isPoint) out.beginRing();
          out.add(x, y);
        }
      } else if (id == 2) {
        for (var i = 0; i < count; i++) {
          final dx = r.varint();
          final dy = r.varint();
          x += (dx >>> 1) ^ -(dx & 1);
          y += (dy >>> 1) ^ -(dy & 1);
          out.add(x, y);
        }
      }
    }
    out.end();
  }
}

/// Reusable flat storage for the rings of one feature.
class GeometrySink {
  Float64List coords = Float64List(4096);
  int coordCount = 0;
  final List<int> ringStarts = [];

  int get ringCount => ringStarts.length - 1;
  int ringStart(int ring) => ringStarts[ring];
  int ringEnd(int ring) => ringStarts[ring + 1];

  void clear() {
    coordCount = 0;
    ringStarts.clear();
  }

  void beginRing() => ringStarts.add(coordCount >> 1);

  void add(int x, int y) {
    if (coordCount + 2 > coords.length) {
      final grown = Float64List(coords.length * 2)
        ..setRange(0, coordCount, coords);
      coords = grown;
    }
    coords[coordCount++] = x.toDouble();
    coords[coordCount++] = y.toDouble();
  }

  void end() => ringStarts.add(coordCount >> 1);
}

class _Reader {
  _Reader(this.bytes, this.pos, this.end);

  final Uint8List bytes;
  int pos;
  final int end;

  bool get hasMore => pos < end;

  int varint() {
    var result = 0;
    var shift = 0;
    while (true) {
      final b = bytes[pos++];
      result |= (b & 0x7f) << shift;
      if (b < 0x80) return result;
      shift += 7;
    }
  }

  String string() {
    final len = varint();
    final s = utf8.decode(Uint8List.sublistView(bytes, pos, pos + len));
    pos += len;
    return s;
  }

  double float32() {
    final v = ByteData.sublistView(
      bytes,
      pos,
      pos + 4,
    ).getFloat32(0, Endian.little);
    pos += 4;
    return v;
  }

  double float64() {
    final v = ByteData.sublistView(
      bytes,
      pos,
      pos + 8,
    ).getFloat64(0, Endian.little);
    pos += 8;
    return v;
  }

  void skip(int wireType) {
    switch (wireType) {
      case 0:
        varint();
      case 1:
        pos += 8;
      case 2:
        pos += varint();
      case 5:
        pos += 4;
    }
  }
}
