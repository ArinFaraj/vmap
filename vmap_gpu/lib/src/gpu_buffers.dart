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

/// A tile on the GPU: its flat layers' stream in one pooled buffer,
/// vertices then indices, and its buildings in pieces. Filled over as
/// many frames as the engine's budget needs; drawn once [ready].
class TileGpu implements RendererTileData {
  TileGpu(LoadedTile tile, this._pool)
    : stream = tile.gpu,
      buildings = [for (final e in tile.extrusions) BuildingGpu(e)] {
    final stream = this.stream;
    if (stream != null) {
      indexOffset = _align(stream.vertices.lengthInBytes);
      buffer = _pool.take(indexOffset + stream.indices.lengthInBytes);
    }
  }

  final BufferPool _pool;
  final GpuStream? stream;
  final List<BuildingGpu> buildings;
  gpu.DeviceBuffer? buffer;
  int indexOffset = 0;
  int _sent = 0;

  static const _piece = 256 * 1024;

  static int _align(int bytes) => (bytes + 255) & ~255;

  bool get _streamSent {
    final stream = this.stream;
    return stream == null ||
        _sent >= stream.vertices.lengthInBytes + stream.indices.lengthInBytes;
  }

  bool get ready => _streamSent && buildings.every((b) => b.ready);

  /// Sends pieces until [clock] passes [deadline], at least one, and returns
  /// [ready].
  bool send(Stopwatch clock, int deadline) {
    do {
      if (!_streamSent) {
        _sendPiece();
      } else {
        final next = buildings.where((b) => !b.ready).firstOrNull;
        if (next == null) break;
        next.sendChunk();
      }
    } while (clock.elapsedMicroseconds < deadline);
    return ready;
  }

  void _sendPiece() {
    final stream = this.stream!;
    final vertexBytes = stream.vertices.lengthInBytes;
    final inVertices = _sent < vertexBytes;
    final source = inVertices
        ? ByteData.sublistView(stream.vertices)
        : ByteData.sublistView(stream.indices);
    final from = inVertices ? _sent : _sent - vertexBytes;
    final n = math.min(_piece, source.lengthInBytes - from);
    final at = inVertices ? from : indexOffset + from;
    buffer!
      ..overwrite(
        ByteData.sublistView(source, from, from + n),
        destinationOffsetInBytes: at,
      )
      ..flush(offsetInBytes: at, lengthInBytes: n);
    _sent += n;
  }

  @override
  void dispose() {
    final buffer = this.buffer;
    if (buffer != null) _pool.give(buffer);
    this.buffer = null;
  }
}

/// One tile's buildings of one layer, sent in pieces so no frame copies
/// megabytes.
class BuildingGpu {
  BuildingGpu(this.extrusion)
    : chunks =
          (extrusion.vertices.length ~/ BuiltExtrusion.floatsPerVertex +
              BuiltExtrusion.chunk -
              1) ~/
          BuiltExtrusion.chunk;

  final BuiltExtrusion extrusion;
  final int chunks;
  final List<gpu.DeviceBuffer> buffers = [];

  /// When the buildings were first drawn, on the renderer's clock.
  int shownAt = -1;

  bool get ready => buffers.length >= chunks;

  static const stride = BuiltExtrusion.floatsPerVertex * 4;

  int chunkBytes(int c) {
    final vertices =
        extrusion.vertices.length ~/ BuiltExtrusion.floatsPerVertex;
    final from = c * BuiltExtrusion.chunk;
    return math.min(BuiltExtrusion.chunk, vertices - from) * stride;
  }

  void sendChunk() {
    final c = buffers.length;
    final from = c * BuiltExtrusion.chunk * BuiltExtrusion.floatsPerVertex;
    buffers.add(
      gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(
          extrusion.vertices,
          from,
          from + chunkBytes(c) ~/ 4,
        ),
      ),
    );
  }
}
