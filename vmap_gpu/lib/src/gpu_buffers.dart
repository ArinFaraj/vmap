import 'dart:developer' show Timeline;
import 'dart:math' as math;
import 'dart:typed_data';

import 'package:flutter_gpu/gpu.dart' as gpu;
import 'package:vmap/renderer.dart';

/// Frames the GPU may still be reading while the next one is written.
const framesInFlight = 4;

/// Uniform data for the frames the GPU may still be reading, in host
/// visible blocks reused frame after frame. Flutter's HostBuffer checks a
/// block's room without the write's length and never reuses a block it
/// added (flutter/flutter#186526, #192392).
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
      blocks.add(
        gpu.gpuContext.createDeviceBuffer(
          gpu.StorageMode.hostVisible,
          math.max(_blockBytes, length),
        ),
      );
    }
    final buffer = blocks[_block];
    buffer.overwrite(bytes, destinationOffsetInBytes: at);
    _offset = at + length;
    return gpu.BufferView(buffer, offsetInBytes: at, lengthInBytes: length);
  }
}

/// Host visible memory in slabs, handed out in ranges, so a tile on its
/// way to the GPU rarely makes the driver allocate: an allocation stalls
/// the frame that asks, about a millisecond for every 2 MB on a phone. A
/// range given back waits out the frames still in flight before it is
/// handed out again.
class GpuHeap {
  static const _slabBytes = 4 << 20;
  static const align = 256;

  /// The most it holds; past three quarters, tiles not drawn lately let
  /// their ranges go.
  static const capBytes = 96 << 20;

  /// Free room kept ahead of what uploads ask for.
  static const _headroom = 12 << 20;

  final List<_Slab> _slabs = [];
  final List<(GpuRange, int)> _given = [];
  int used = 0;

  /// The renderer's frame count, which a given back range is stamped with.
  int frame = 0;

  int get _total => _slabs.length * _slabBytes;

  /// Adds a slab while free room is short, one a frame, so uploads find
  /// room without allocating.
  void topUp() {
    _release();
    if (_total - used < _headroom && _total + _slabBytes <= capBytes) {
      _slabs.add(_Slab(_create(_slabBytes), _slabBytes));
    }
  }

  GpuRange take(int bytes) {
    _release();
    final size = (bytes + align - 1) ~/ align * align;
    used += size;
    if (size > _slabBytes) return GpuRange(_create(size), 0, size, null);
    for (final slab in _slabs) {
      final at = slab.take(size);
      if (at >= 0) return GpuRange(slab.buffer, at, size, slab);
    }
    final slab = _Slab(_create(_slabBytes), _slabBytes);
    _slabs.add(slab);
    return GpuRange(slab.buffer, slab.take(size), size, slab);
  }

  void give(GpuRange range) {
    used -= range.size;
    _given.add((range, frame));
  }

  void _release() {
    while (_given.isNotEmpty && frame - _given.first.$2 > framesInFlight) {
      final range = _given.removeAt(0).$1;
      range.slab?.give(range.offset, range.size);
    }
  }

  static gpu.DeviceBuffer _create(int bytes) => Timeline.timeSync(
    'vmap.gpu.alloc',
    () => gpu.gpuContext.createDeviceBuffer(gpu.StorageMode.hostVisible, bytes),
  );

  void clear() {
    _slabs.clear();
    _given.clear();
    used = 0;
  }
}

/// Part of a [GpuHeap] slab, or a buffer of its own when too big for one.
class GpuRange {
  GpuRange(this.buffer, this.offset, this.size, this.slab);

  final gpu.DeviceBuffer buffer;
  final int offset, size;
  final _Slab? slab;
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

/// A tile on the GPU, all in one range of a [GpuHeap]: its flat layers'
/// vertices and indices, then each building layer's vertices. Filled over
/// as many frames as the engine's budget needs; drawn once [ready].
class TileGpu implements RendererTileData {
  factory TileGpu(LoadedTile tile, GpuHeap heap) {
    final parts = <(ByteData, int)>[];
    var at = 0;
    int part(TypedData data) {
      final start = at;
      parts.add((ByteData.sublistView(data), at));
      at =
          (at + data.lengthInBytes + GpuHeap.align - 1) ~/
          GpuHeap.align *
          GpuHeap.align;
      return start;
    }

    final stream = tile.gpu;
    var indexAt = 0;
    if (stream != null) {
      part(stream.vertices);
      indexAt = part(stream.indices);
    }
    final buildingsAt = [
      for (final e in tile.extrusions) (e, part(e.vertices)),
    ];
    final range = at > 0 ? heap.take(at) : null;
    final base = range?.offset ?? 0;
    return TileGpu._(
      tile,
      heap,
      stream,
      range,
      base + indexAt,
      [for (final (e, offset) in buildingsAt) BuildingGpu(e, base + offset)],
      [for (final (data, offset) in parts) (data, base + offset)],
    );
  }

  TileGpu._(
    this.tile,
    this._heap,
    this.stream,
    this._range,
    this.indexOffset,
    this.buildings,
    this._parts,
  ) : drawnFrame = _heap.frame;

  final LoadedTile tile;
  final GpuHeap _heap;
  final GpuStream? stream;

  /// The renderer's frame this tile was last drawn in, or sent in when it
  /// has not been drawn yet.
  int drawnFrame;
  GpuRange? _range;
  final List<BuildingGpu> buildings;

  /// Where the flat layers' vertices and indices start in [buffer].
  int get vertexOffset => _range?.offset ?? 0;
  final int indexOffset;

  gpu.DeviceBuffer? get buffer => _range?.buffer;

  /// What to copy, each with where it goes in [buffer], in order.
  final List<(ByteData, int)> _parts;
  int _part = 0, _sent = 0;

  static const _piece = 256 * 1024;

  bool get ready => _part >= _parts.length;

  /// Copies pieces until [clock] passes [deadline], at least one, and
  /// returns [ready].
  bool send(Stopwatch clock, int deadline) {
    while (!ready) {
      final (source, at) = _parts[_part];
      final n = math.min(_piece, source.lengthInBytes - _sent);
      buffer!
        ..overwrite(
          ByteData.sublistView(source, _sent, _sent + n),
          destinationOffsetInBytes: at + _sent,
        )
        ..flush(offsetInBytes: at + _sent, lengthInBytes: n);
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
    final range = _range;
    if (range != null) _heap.give(range);
    _range = null;
  }
}

/// One building layer's vertices in a [TileGpu]'s buffer, from [offset].
class BuildingGpu {
  BuildingGpu(this.extrusion, this.offset);

  final BuiltExtrusion extrusion;
  final int offset;

  /// When the buildings were first drawn, on the renderer's clock.
  int shownAt = -1;

  static const stride = BuiltExtrusion.floatsPerVertex * 4;

  int get vertexCount =>
      extrusion.vertices.length ~/ BuiltExtrusion.floatsPerVertex;
}
