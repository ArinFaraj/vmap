import 'dart:typed_data';

import 'gpu_shim/gpu.dart' as gpu;

/// Grid cells on a side of the ground every tile shares.
const _grid = 128;

const globeMainCount = _grid * _grid * 6, globeCapCount = _grid * 6;

gpu.DeviceBuffer globeGridCorners() {
  const side = _grid + 1;
  final out = Float32List((side * side + 2 * side) * 2);
  var o = 0;
  for (var j = 0; j <= _grid; j++) {
    for (var i = 0; i <= _grid; i++) {
      out
        ..[o++] = i / _grid
        ..[o++] = j / _grid;
    }
  }
  for (final pole in const [-1.0, 2.0]) {
    for (var i = 0; i <= _grid; i++) {
      out
        ..[o++] = i / _grid
        ..[o++] = pole;
    }
  }
  return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
}

gpu.DeviceBuffer globeGridIndices() {
  const side = _grid + 1;
  final out = Uint16List(globeMainCount + 2 * globeCapCount);
  var o = 0;
  void quad(int a, int b, int c, int d) => out
    ..[o++] = a
    ..[o++] = c
    ..[o++] = d
    ..[o++] = a
    ..[o++] = d
    ..[o++] = b;
  for (var j = 0; j < _grid; j++) {
    for (var i = 0; i < _grid; i++) {
      final a = j * side + i;
      quad(a, a + 1, a + side, a + side + 1);
    }
  }
  const north = side * side, south = north + side;
  for (var i = 0; i < _grid; i++) {
    quad(north + i, north + i + 1, i, i + 1);
  }
  for (var i = 0; i < _grid; i++) {
    final edge = _grid * side + i;
    quad(edge, edge + 1, south + i, south + i + 1);
  }
  return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
}

const gridIndexCount = _grid * _grid * 6 + 4 * _grid * 6;

/// The grid's corners in rows, then a skirt corner under each corner of
/// the edge, walking it round: top, right, bottom, left.
List<(int, int)> get _edge => [
  for (var i = 0; i < _grid; i++) (i, 0),
  for (var j = 0; j < _grid; j++) (_grid, j),
  for (var i = _grid; i > 0; i--) (i, _grid),
  for (var j = _grid; j > 0; j--) (0, j),
];

gpu.DeviceBuffer gridCorners() {
  final edge = _edge;
  final out = Float32List(((_grid + 1) * (_grid + 1) + edge.length) * 2);
  var o = 0;
  for (var j = 0; j <= _grid; j++) {
    for (var i = 0; i <= _grid; i++) {
      out
        ..[o++] = i / _grid
        ..[o++] = j / _grid;
    }
  }
  for (final (i, j) in edge) {
    out
      ..[o++] = 2 + i / _grid
      ..[o++] = j / _grid;
  }
  return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
}

gpu.DeviceBuffer gridIndices() {
  final out = Uint16List(gridIndexCount);
  var o = 0;
  void quad(int a, int b, int c, int d) => out
    ..[o++] = a
    ..[o++] = c
    ..[o++] = d
    ..[o++] = a
    ..[o++] = d
    ..[o++] = b;
  for (var j = 0; j < _grid; j++) {
    for (var i = 0; i < _grid; i++) {
      final a = j * (_grid + 1) + i;
      quad(a, a + 1, a + _grid + 1, a + _grid + 2);
    }
  }
  final edge = _edge;
  final skirts = (_grid + 1) * (_grid + 1);
  for (var k = 0; k < edge.length; k++) {
    final next = (k + 1) % edge.length;
    int top(int k) => edge[k].$2 * (_grid + 1) + edge[k].$1;
    quad(top(k), top(next), skirts + k, skirts + next);
  }
  return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
}
