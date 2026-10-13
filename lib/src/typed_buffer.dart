import 'dart:typed_data';

/// A growable list of doubles kept in one typed array. A `List<double>`
/// holds each element as its own heap object, and the tile and glyph
/// isolates share the UI isolate's heap, so their garbage is collected in
/// pauses the UI thread waits out.
class DoubleBuffer {
  DoubleBuffer([int capacity = 256]) : _data = Float64List(capacity);

  Float64List _data;
  int length = 0;

  bool get isEmpty => length == 0;

  double operator [](int i) => _data[i];

  void add(double v) {
    if (length == _data.length) _grow(length + 1);
    _data[length++] = v;
  }

  void add2(double a, double b) {
    if (length + 2 > _data.length) _grow(length + 2);
    _data[length++] = a;
    _data[length++] = b;
  }

  void add4(double a, double b, double c, double d) {
    if (length + 4 > _data.length) _grow(length + 4);
    _data[length++] = a;
    _data[length++] = b;
    _data[length++] = c;
    _data[length++] = d;
  }

  void addBuffer(DoubleBuffer other) {
    if (length + other.length > _data.length) _grow(length + other.length);
    _data.setRange(length, length + other.length, other._data);
    length += other.length;
  }

  void clear() => length = 0;

  void _grow(int need) {
    var size = _data.length * 2;
    while (size < need) {
      size *= 2;
    }
    _data = Float64List(size)..setRange(0, length, _data);
  }

  Float32List toFloat32List() =>
      Float32List.fromList(Float64List.sublistView(_data, 0, length));

  Float64List toFloat64List() => _data.sublist(0, length);
}

/// A growable list of unsigned 32 bit indices kept in one typed array.
class IndexBuffer {
  IndexBuffer([int capacity = 256]) : _data = Uint32List(capacity);

  Uint32List _data;
  int length = 0;

  bool get isEmpty => length == 0;

  void add(int v) {
    if (length == _data.length) {
      _data = Uint32List(_data.length * 2)..setRange(0, length, _data);
    }
    _data[length++] = v;
  }

  Uint32List toList() => _data.sublist(0, length);
}
