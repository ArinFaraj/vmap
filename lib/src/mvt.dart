import 'dart:convert';
import 'dart:typed_data';

const int mvtPoint = 1;
const int mvtLine = 2;
const int mvtPolygon = 3;

/// One feature of a tile, whatever the tile was read from.
abstract interface class TileFeature {
  int get type;

  Map<String, Object?> allTags(TileLayer layer);

  /// Appends this feature's rings to [out]. A point feature yields one ring
  /// holding every point.
  void readGeometry(GeometrySink out);
}

/// A feature that knows how far along its whole line each of its pieces
/// starts, which `line-gradient` is drawn by.
abstract interface class MeasuredFeature {
  /// For each ring in turn: the share of the whole line that lies before
  /// the ring, and the share one unit of the ring's length is. Null for a
  /// feature that is not a line.
  List<double>? get lineMetrics;
}

abstract interface class TileLayer {
  String get name;
  int get extent;
  List<TileFeature> get features;
}

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

class MvtLayer implements TileLayer {
  MvtLayer._(this.name, this.extent, this.keys, this.values, this.features);

  @override
  final String name;
  @override
  final int extent;
  final List<String> keys;
  final List<Object?> values;
  @override
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
          value = v.isEven ? v ~/ 2 : -((v + 1) ~/ 2);
        case 56:
          value = r.varint() != 0;
        default:
          r.skip(tag & 7);
      }
    }
    return value;
  }
}

class MvtFeature implements TileFeature {
  MvtFeature._(
    this._bytes,
    this.type,
    this.id,
    this._tagsStart,
    this._tagsEnd,
    this._geomStart,
    this._geomEnd,
  );

  final Uint8List _bytes;
  @override
  final int type;

  /// The feature's id in the tile, or null when it has none.
  final int? id;
  final int _tagsStart;
  final int _tagsEnd;
  final int _geomStart;
  final int _geomEnd;

  static MvtFeature _decode(Uint8List bytes, int start, int end) {
    var type = 0;
    int? id;
    var tagsStart = 0;
    var tagsEnd = 0;
    var geomStart = 0;
    var geomEnd = 0;
    final r = _Reader(bytes, start, end);
    while (r.hasMore) {
      final tag = r.varint();
      switch (tag) {
        case 8:
          id = r.varint();
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
    return MvtFeature._(
      bytes,
      type,
      id,
      tagsStart,
      tagsEnd,
      geomStart,
      geomEnd,
    );
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

  @override
  Map<String, Object?> allTags(TileLayer layer) {
    layer as MvtLayer;
    final out = <String, Object?>{r'$id': ?id};
    final r = _Reader(_bytes, _tagsStart, _tagsEnd);
    while (r.hasMore) {
      final k = r.varint();
      final v = r.varint();
      out[layer.keys[k]] = layer.values[v];
    }
    return out;
  }

  @override
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
          x += _zigzag(dx);
          y += _zigzag(dy);
          if (!isPoint) out.beginRing();
          out.add(x, y);
        }
      } else if (id == 2) {
        for (var i = 0; i < count; i++) {
          final dx = r.varint();
          final dy = r.varint();
          x += _zigzag(dx);
          y += _zigzag(dy);
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

  void add(int x, int y) => addPoint(x.toDouble(), y.toDouble());

  void addPoint(double x, double y) {
    if (coordCount + 2 > coords.length) {
      final grown = Float64List(coords.length * 2)
        ..setRange(0, coordCount, coords);
      coords = grown;
    }
    coords[coordCount++] = x;
    coords[coordCount++] = y;
  }

  void end() => ringStarts.add(coordCount >> 1);
}

/// Written without an exclusive or with a negative number, which comes out
/// unsigned in JavaScript.
@pragma('vm:prefer-inline')
int _zigzag(int v) => (v & 1) == 0 ? v >>> 1 : -(v >>> 1) - 1;

class _Reader {
  _Reader(this.bytes, this.pos, this.end);

  final Uint8List bytes;
  int pos;
  final int end;

  bool get hasMore => pos < end;

  /// The first four bytes by shifting, which is quick, and the rest by
  /// multiplying: a shift keeps only 32 bits in JavaScript.
  int varint() {
    var result = 0;
    for (var shift = 0; shift < 28; shift += 7) {
      final b = bytes[pos++];
      result |= (b & 0x7f) << shift;
      if (b < 0x80) return result;
    }
    var scale = 0x10000000;
    while (true) {
      final b = bytes[pos++];
      result += (b & 0x7f) * scale;
      if (b < 0x80) return result;
      scale *= 128;
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
