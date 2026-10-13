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

/// Host visible buffers kept for reuse in power of two sizes, so a new
/// tile rarely asks the driver for memory. A buffer given back waits out
/// the frames still in flight before it is handed out again.
class BufferPool {
  final Map<int, List<(gpu.DeviceBuffer, int)>> _free = {};
  int _freeBytes = 0;
  static const _keepBytes = 32 << 20;

  /// The renderer's frame count, which a given back buffer is stamped with.
  int frame = 0;

  static int _size(int bytes) {
    var size = 64 << 10;
    while (size < bytes) {
      size <<= 1;
    }
    return size;
  }

  gpu.DeviceBuffer take(int bytes) {
    final size = _size(bytes);
    final list = _free[size];
    if (list != null &&
        list.isNotEmpty &&
        frame - list.first.$2 > framesInFlight) {
      _freeBytes -= size;
      return list.removeAt(0).$1;
    }
    return gpu.gpuContext.createDeviceBuffer(gpu.StorageMode.hostVisible, size);
  }

  void give(gpu.DeviceBuffer buffer) {
    final size = buffer.sizeInBytes;
    if (_freeBytes + size > _keepBytes) return;
    (_free[size] ??= []).add((buffer, frame));
    _freeBytes += size;
  }

  void clear() {
    _free.clear();
    _freeBytes = 0;
  }
}

/// A tile on the GPU, all in one pooled buffer: its flat layers' vertices
/// and indices, then each building layer's vertices. Filled over as many
/// frames as the engine's budget needs; drawn once [ready].
class TileGpu implements RendererTileData {
  TileGpu(LoadedTile tile, this._pool) : stream = tile.gpu {
    var at = 0;
    void part(TypedData data) {
      _parts.add((ByteData.sublistView(data), at));
      at = _align(at + data.lengthInBytes);
    }

    final stream = this.stream;
    if (stream != null) {
      part(stream.vertices);
      indexOffset = at;
      part(stream.indices);
    }
    for (final e in tile.extrusions) {
      buildings.add(BuildingGpu(e, at));
      part(e.vertices);
    }
    if (at > 0) {
      buffer = Timeline.timeSync('vmap.gpu.alloc', () => _pool.take(at));
    }
  }

  final BufferPool _pool;
  final GpuStream? stream;
  final List<BuildingGpu> buildings = [];
  gpu.DeviceBuffer? buffer;
  int indexOffset = 0;

  /// What to copy, each with where it goes in [buffer], in order.
  final List<(ByteData, int)> _parts = [];
  int _part = 0, _sent = 0;

  static const _piece = 256 * 1024;

  static int _align(int bytes) => (bytes + 255) & ~255;

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
    final buffer = this.buffer;
    if (buffer != null) _pool.give(buffer);
    this.buffer = null;
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
