import 'dart:developer' show Timeline;
import 'dart:math' as math;
import 'dart:typed_data';

import 'gpu_shim/gpu.dart' as gpu;

import '../tiles/extrusion.dart';
import '../tiles/gpu_stream.dart';
import 'map_renderer.dart';
import '../tiles/tiles.dart';

/// Frames the GPU may still be reading while the next one is written.
const framesInFlight = 4;

/// Uniform data for the frames the GPU may still be reading, in host
/// visible blocks reused frame after frame. Flutter's HostBuffer checks a
/// block's room without the write's length and never reuses a block it
/// added (flutter/flutter#186526, #192392). The blocks are typed buffers,
/// so on the web each write reaches WebGL as the floats it is.
class UniformArena {
  static const _blockBytes = 1 << 20;
  final List<List<gpu.DeviceBuffer>> _blocks = [
    for (var i = 0; i < framesInFlight; i++) [],
  ];
  late final int _align = math.max(
    16,
    gpu.gpuContext.minimumUniformByteAlignment,
  );
  int _frame = 0, _block = 0, _offset = 0;

  void reset() {
    _frame = (_frame + 1) % framesInFlight;
    _block = 0;
    _offset = 0;
  }

  gpu.BufferView emplace(ByteData bytes) {
    final length = bytes.lengthInBytes;
    var at = (_offset + _align - 1) ~/ _align * _align;
    final blocks = _blocks[_frame];
    if (blocks.isEmpty || at + length > _blockBytes) {
      if (blocks.isNotEmpty) _block++;
      at = 0;
    }
    while (blocks.length <= _block) {
      blocks.add(gpu.createUniformBuffer(math.max(_blockBytes, length)));
    }
    final buffer = blocks[_block];
    gpu.writeGeometryData(
      buffer,
      bytes.offsetInBytes % 4 == 0 && length % 4 == 0
          ? bytes.buffer.asFloat32List(bytes.offsetInBytes, length ~/ 4)
          : bytes,
      destinationOffsetInBytes: at,
    );
    _offset = at + length;
    return gpu.BufferView(buffer, offsetInBytes: at, lengthInBytes: length);
  }
}

/// Host visible memory in slabs, handed out in ranges, so a tile on its
/// way to the GPU rarely makes the driver allocate: an allocation stalls
/// the frame that asks, about a millisecond for every 2 MB on a phone. A
/// range given back waits until every frame submitted before it has
/// finished on the GPU, which may still read it, before it is handed out
/// again. Indices come from slabs of their own: WebGL never lets a buffer
/// that has held indices hold vertices.
class GpuHeap {
  static const _slabBytes = 4 << 20;
  static const align = 256;

  /// The most it holds; past three quarters, tiles not drawn lately let
  /// their ranges go.
  static const capBytes = 96 << 20;

  /// Free room kept ahead of what uploads ask for.
  static const _headroom = 12 << 20;

  final List<_Slab> _slabs = [];
  final List<_Slab> _indexSlabs = [];
  final List<(GpuRange, int)> _given = [];
  int used = 0;
  int _oversize = 0;

  /// The renderer's paint count, which a tile's last draw is stamped with.
  int frame = 0;

  /// Frames handed to the GPU, and frames it has finished.
  int submitted = 0, completed = 0;

  int get _total =>
      (_slabs.length + _indexSlabs.length) * _slabBytes + _oversize;

  /// Adds a slab while free room is short, one a frame, so uploads find
  /// room without allocating.
  void topUp() {
    _release();
    if (_total - used < _headroom && _total + _slabBytes <= capBytes) {
      _slabs.add(_Slab(_create(_slabBytes, indices: false), _slabBytes));
    }
  }

  /// [bytes] of room, from the slabs for [indices] or for vertices.
  GpuRange take(int bytes, {bool indices = false}) {
    _release();
    final size = (bytes + align - 1) ~/ align * align;
    used += size;
    if (size > _slabBytes) {
      _oversize += size;
      return GpuRange._(_create(size, indices: indices), 0, size, null);
    }
    final slabs = indices ? _indexSlabs : _slabs;
    for (final slab in slabs) {
      final at = slab.take(size);
      if (at >= 0) return GpuRange._(slab.buffer, at, size, slab);
    }
    final slab = _Slab(_create(_slabBytes, indices: indices), _slabBytes);
    slabs.add(slab);
    return GpuRange._(slab.buffer, slab.take(size), size, slab);
  }

  void give(GpuRange range) {
    used -= range.size;
    _given.add((range, submitted));
  }

  void _release() {
    while (_given.isNotEmpty && _given.first.$2 <= completed) {
      final range = _given.removeAt(0).$1;
      final slab = range._slab;
      if (slab == null) {
        _oversize -= range.size;
      } else {
        slab.give(range.offset, range.size);
      }
    }
  }

  /// A buffer of [bytes] for indices or for vertices alone. On the web it
  /// is typed for that one role, so uploads cross to WebGL as the lists
  /// they are instead of byte by byte.
  static gpu.DeviceBuffer _create(int bytes, {required bool indices}) =>
      Timeline.timeSync('vmap.gpu.alloc', () {
        final made = gpu.createGeometryBuffers(
          indices ? 0 : bytes,
          indices ? bytes : 0,
        );
        return indices ? made.index : made.vertex;
      });

  /// Lets go of the slabs nothing is held in, and returns true once the
  /// GPU has finished with every range given back.
  bool shrink() {
    _release();
    bool empty(_Slab slab) =>
        slab._free.length == 1 && slab._free.first == (0, _slabBytes);
    _slabs.removeWhere(empty);
    _indexSlabs.removeWhere(empty);
    return _given.isEmpty;
  }

  void clear() {
    _slabs.clear();
    _indexSlabs.clear();
    _given.clear();
    used = 0;
    _oversize = 0;
  }
}

/// Part of a [GpuHeap] slab, or a buffer of its own when too big for one.
class GpuRange {
  GpuRange._(this.buffer, this.offset, this.size, this._slab);

  final gpu.DeviceBuffer buffer;
  final int offset, size;
  final _Slab? _slab;
}

/// One slab's free ranges, by offset, merged where they touch.
class _Slab {
  _Slab(this.buffer, int size) : _free = [(0, size)];

  final gpu.DeviceBuffer buffer;
  final List<(int, int)> _free;

  /// The offset of [size] free bytes, taken, or -1.
  int take(int size) {
    for (var i = 0; i < _free.length; i++) {
      final (at, room) = _free[i];
      if (room < size) continue;
      if (room == size) {
        _free.removeAt(i);
      } else {
        _free[i] = (at + size, room - size);
      }
      return at;
    }
    return -1;
  }

  void give(int at, int size) {
    var i = 0;
    while (i < _free.length && _free[i].$1 < at) {
      i++;
    }
    _free.insert(i, (at, size));
    if (i + 1 < _free.length && at + size == _free[i + 1].$1) {
      _free[i] = (at, size + _free[i + 1].$2);
      _free.removeAt(i + 1);
    }
    if (i > 0 && _free[i - 1].$1 + _free[i - 1].$2 == at) {
      _free[i - 1] = (_free[i - 1].$1, _free[i - 1].$2 + _free[i].$2);
      _free.removeAt(i);
    }
  }
}

/// A tile on the GPU in two ranges of a [GpuHeap]: its flat layers'
/// vertices and then each building layer's vertices in one, the flat
/// layers' indices in the other. Filled over as many frames as the engine's
/// budget needs; drawn once [ready].
class TileGpu implements RendererTileData {
  factory TileGpu(LoadedTile tile, GpuHeap heap) {
    final parts = <(TypedData, int)>[];
    var at = 0;
    int part(TypedData data) {
      final start = at;
      parts.add((data, at));
      at =
          (at + data.lengthInBytes + GpuHeap.align - 1) ~/
          GpuHeap.align *
          GpuHeap.align;
      return start;
    }

    final stream = tile.gpu;
    if (stream != null) part(stream.vertices);
    final buildingsAt = [
      for (final e in tile.extrusions) (e, part(e.vertices)),
    ];
    // The flat layers' indices first, then each building layer's.
    final indexParts = <(TypedData, int)>[];
    var indexAt = 0;
    int indexPart(Uint32List data) {
      final start = indexAt;
      if (data.isNotEmpty) indexParts.add((data, start));
      indexAt += data.lengthInBytes;
      return start;
    }

    if (stream != null) indexPart(stream.indices);
    final buildingIndicesAt = [
      for (final e in tile.extrusions) indexPart(e.indices),
    ];
    final range = at > 0 ? heap.take(at) : null;
    final indices = indexAt > 0 ? heap.take(indexAt, indices: true) : null;
    final base = range?.offset ?? 0;
    final indexBase = indices?.offset ?? 0;
    return TileGpu._(
      tile,
      heap,
      stream,
      range,
      indices,
      [
        for (final (k, (e, offset)) in buildingsAt.indexed)
          BuildingGpu(e, base + offset, indexBase + buildingIndicesAt[k]),
      ],
      [
        for (final (data, offset) in parts)
          (data, range!.buffer, base + offset),
        for (final (data, offset) in indexParts)
          (data, indices!.buffer, indexBase + offset),
      ],
    );
  }

  TileGpu._(
    this.tile,
    this._heap,
    this.stream,
    this._range,
    this._indices,
    this.buildings,
    this._parts,
  ) : drawnFrame = _heap.frame;

  final LoadedTile tile;
  final GpuHeap _heap;
  final GpuStream? stream;

  /// The renderer's frame this tile was last drawn in, or sent in when it
  /// has not been drawn yet.
  int drawnFrame;
  GpuRange? _range, _indices;
  final List<BuildingGpu> buildings;

  /// Where the flat layers' vertices start in [buffer].
  int get vertexOffset => _range?.offset ?? 0;

  gpu.DeviceBuffer? get buffer => _range?.buffer;

  /// Where the flat layers' indices start in [indexBuffer].
  int get indexOffset => _indices?.offset ?? 0;

  gpu.DeviceBuffer? get indexBuffer => _indices?.buffer;

  /// What to copy, each with the buffer and offset it goes to, in order.
  final List<(TypedData, gpu.DeviceBuffer, int)> _parts;
  int _part = 0, _sent = 0;

  static const _piece = 256 * 1024;

  /// Bytes [from] to [to] of [data], as a list of its own element type:
  /// under dart2wasm a byte view over float storage crosses to WebGL a byte
  /// at a time.
  static TypedData _slice(TypedData data, int from, int to) => switch (data) {
    Float32List() => Float32List.sublistView(data, from ~/ 4, to ~/ 4),
    Uint32List() => Uint32List.sublistView(data, from ~/ 4, to ~/ 4),
    Uint16List() => Uint16List.sublistView(data, from ~/ 2, to ~/ 2),
    _ => Uint8List.sublistView(data, from, to),
  };

  bool get ready => _part >= _parts.length;

  /// Copies pieces until [clock] passes [deadline], at least one, and
  /// returns [ready].
  bool send(Stopwatch clock, int deadline) {
    while (!ready) {
      final (source, buffer, at) = _parts[_part];
      final n = math.min(_piece, source.lengthInBytes - _sent);
      gpu.writeGeometryData(
        buffer,
        _slice(source, _sent, _sent + n),
        destinationOffsetInBytes: at + _sent,
      );
      buffer.flush(offsetInBytes: at + _sent, lengthInBytes: n);
      _sent += n;
      if (_sent >= source.lengthInBytes) {
        _part++;
        _sent = 0;
      }
      if (clock.elapsedMicroseconds >= deadline) break;
    }
    return ready;
  }

  @override
  void dispose() {
    final range = _range, indices = _indices;
    if (range != null) _heap.give(range);
    if (indices != null) _heap.give(indices);
    _range = _indices = null;
  }
}

/// One building layer's vertices in a [TileGpu]'s buffer, from [offset],
/// and its indices in the tile's index buffer, from [indexOffset].
class BuildingGpu {
  BuildingGpu(this.extrusion, this.offset, this.indexOffset);

  final BuiltExtrusion extrusion;
  final int offset, indexOffset;

  int get indexCount => extrusion.indices.length;

  /// When the buildings were first drawn, on the renderer's clock.
  int shownAt = -1;

  static const stride = BuiltExtrusion.floatsPerVertex * 4;

  int get vertexCount =>
      extrusion.vertices.length ~/ BuiltExtrusion.floatsPerVertex;
}
