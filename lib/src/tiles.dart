import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'camera.dart';
import 'label_state.dart';
import 'style_model.dart';
import 'tessellate.dart';
import 'tile_builder.dart';
import 'worker.dart';
import 'mercator.dart';
import 'tile_id.dart';

class MeshStroke {
  MeshStroke(this.pass, this.halfWidth, this.offset, this.vertices);

  final int pass;
  final double halfWidth;
  final double offset;
  final ui.Vertices vertices;
}

class TileMesh {
  TileMesh.fill(MeshChunk chunk, this.props)
    : fill = ui.Vertices.raw(
        ui.VertexMode.triangles,
        chunk.positions,
        indices: chunk.indices,
      ),
      points = null,
      _base = null,
      _ext = null,
      _off = null,
      _along = null,
      _indices = null;

  TileMesh.points(MeshChunk chunk, this.props)
    : fill = null,
      points = chunk.positions,
      _base = null,
      _ext = null,
      _off = null,
      _along = null,
      _indices = null;

  TileMesh.line(MeshChunk chunk, this.props)
    : fill = null,
      points = null,
      _along = chunk.distances,
      _base = chunk.positions.buffer.asFloat32x4List(
        chunk.positions.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _ext = chunk.extrusions!.buffer.asFloat32x4List(
        chunk.extrusions!.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _off = chunk.offsets?.buffer.asFloat32x4List(
        chunk.offsets!.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _indices = chunk.indices;

  final ui.Vertices? fill;

  /// The centres of a circle layer's circles.
  final Float32List? points;

  /// What the features in the mesh have in common, for paint that reads it.
  final Map<String, Object?>? props;
  final Float32List? _along;
  final Float32x4List? _base;
  final Float32x4List? _ext;
  final Float32x4List? _off;
  final Uint16List? _indices;
  final List<MeshStroke> _strokes = [];

  static Float32x4List _scratch = Float32x4List(0);

  MeshStroke? existing(int pass) {
    for (final s in _strokes) {
      if (s.pass == pass) return s;
    }
    return null;
  }

  /// Widens the line mesh to [halfWidth] tile units for [pass], [offset] tile
  /// units to the right of its centre line, replacing whatever that pass had.
  ui.Vertices build(int pass, double halfWidth, [double offset = 0]) {
    for (var i = 0; i < _strokes.length; i++) {
      if (_strokes[i].pass == pass) {
        _strokes.removeAt(i).vertices.dispose();
        break;
      }
    }
    final base = _base!;
    final ext = _ext!;
    final n = base.length;
    if (_scratch.length < n) _scratch = Float32x4List(n);
    final out = _scratch;
    final w = Float32x4.splat(halfWidth);
    final off = _off;
    if (off == null || offset == 0) {
      for (var i = 0; i < n; i++) {
        out[i] = base[i] + ext[i] * w;
      }
    } else {
      final o = Float32x4.splat(offset);
      for (var i = 0; i < n; i++) {
        out[i] = base[i] + ext[i] * w + off[i] * o;
      }
    }
    final vertices = ui.Vertices.raw(
      ui.VertexMode.triangles,
      out.buffer.asFloat32List(0, n * 4),
      indices: _indices,
      textureCoordinates: _along,
    );
    _strokes.add(MeshStroke(pass, halfWidth, offset, vertices));
    return vertices;
  }

  void dispose() {
    fill?.dispose();
    for (final s in _strokes) {
      s.vertices.dispose();
    }
    _strokes.clear();
  }
}

class LoadedTile {
  LoadedTile(this.id, BuiltTile built, this.sheet)
    : _built = built,
      groups = List.filled(sheet.buckets.length, null);

  final TileId id;
  final StyleSheet sheet;
  BuiltTile? _built;
  final List<List<TileMesh>?> groups;
  final List<LabelCandidate> labels = [];
  int usedFrame = 0;

  bool get prepared => _step < 0;

  /// 0 uploads the geometry, 1..layers widen one line layer each, then
  /// labels.
  int _step = 0;
  int _uploaded = 0;
  int _labelAt = 0;

  /// Uploads the geometry and widens every line to [widths], so the first
  /// frame that draws this tile has nothing left to compute. Works in steps
  /// and returns once [clock] passes [deadline]; call again to continue.
  void prepare(
    Float64List widths,
    double scale,
    Stopwatch clock,
    int deadline,
  ) {
    final built = _built!;
    if (_step == 0) {
      while (_uploaded < built.meshes.length) {
        if (_uploaded > 0 && clock.elapsedMicroseconds > deadline) return;
        final m = built.meshes[_uploaded++];
        (groups[m.bucket] ??= []).add(switch (sheet.buckets[m.bucket].kind) {
          BucketKind.line => TileMesh.line(m.chunk, m.props),
          BucketKind.circle => TileMesh.points(m.chunk, m.props),
          BucketKind.fill => TileMesh.fill(m.chunk, m.props),
        });
      }
      _step = 1;
      if (clock.elapsedMicroseconds > deadline) return;
    }
    while (_step <= sheet.layers.length) {
      final p = _step - 1;
      final layer = sheet.layers[p];
      final meshes = groups[layer.bucket];
      _step++;
      if (layer is! LineLayer ||
          layer.perFeature ||
          meshes == null ||
          widths[p] <= 0) {
        continue;
      }
      final halfWidth = widths[p] / 2 / scale;
      for (final m in meshes) {
        m.build(p, halfWidth);
      }
      if (clock.elapsedMicroseconds > deadline) return;
    }
    final span = 1 / (1 << id.z);
    final tx = id.x * span;
    final ty = id.y * span;
    while (_labelAt < built.labels.length) {
      final l = built.labels[_labelAt++];
      labels.add(LabelCandidate(l.key, l, tx, ty, span));
      if (_labelAt & 127 == 0 && clock.elapsedMicroseconds > deadline) return;
    }
    _built = null;
    _step = -1;
  }

  void dispose() {
    for (final g in groups) {
      if (g == null) continue;
      for (final m in g) {
        m.dispose();
      }
    }
  }
}

class TileDraw {
  TileDraw(this.tile, this.left, this.top, this.size);

  final LoadedTile tile;
  final double left;
  final double top;
  final double size;
  List<ui.Rect>? clips;
}

/// The tiles of one of the style's sources.
class TileSource {
  TileSource(this.def);

  final VectorSource def;
  late TilePool pool;
  final Map<TileId, LoadedTile> tiles = {};

  /// Tiles of the data this source had before it changed, shown until the
  /// tiles of the new data are ready.
  final Map<TileId, LoadedTile> previous = {};
  final Map<TileId, int> failedAt = {};
  final List<TileDraw> ideal = [];
  final List<TileDraw> fallback = [];
  final Map<int, TileDraw> fallbackByKey = {};
  final List<TileId> wanted = [];
  final List<(TileId, double)> missing = [];
  bool hadWanted = false;

  /// A tile that failed is being held back before it is asked for again.
  bool retrying = false;
  int maxDataZoom = 14;

  void dispose() {
    pool.close();
    for (final t in tiles.values) {
      t.dispose();
    }
    tiles.clear();
    dropPrevious();
  }

  void dropPrevious() {
    for (final t in previous.values) {
      t.dispose();
    }
    previous.clear();
  }

  /// Works out which of the source's tiles cover the view, asks for the
  /// missing ones, and returns whether a tile is still being prepared.
  bool cover(
    VmapCamera camera,
    double dataZoom, {
    required int frame,
    required int nowMs,
    required void Function(LoadedTile tile, double scale) prepare,
  }) {
    retrying = false;
    final size = camera.size;
    maxDataZoom = pool.maxZoom;
    final tz = dataZoom.floor().clamp(0, maxDataZoom);
    final tileSize = 256.0 * math.pow(2, camera.zoom - tz);
    final TileRange(:n, :x0, :x1, :y0, :y1) = _inView(camera, tz, tileSize);
    final centerX = (camera.origin.dx + size.width / 2) / tileSize - 0.5;
    final centerY = (camera.origin.dy + size.height / 2) / tileSize - 0.5;

    ideal.clear();
    fallback.clear();
    fallbackByKey.clear();
    missing.clear();
    var waiting = false;
    var covered = true;
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        final id = TileId(tz, x % n, y);
        final left = x * tileSize - camera.origin.dx;
        final top = y * tileSize - camera.origin.dy;
        final tile = tiles[id];
        if (tile != null) {
          tile.usedFrame = frame;
          if (!tile.prepared) prepare(tile, tileSize / tileExtent);
          if (tile.prepared) {
            ideal.add(TileDraw(tile, left, top, tileSize));
            continue;
          }
          waiting = true;
        } else {
          covered = false;
          final dx = x - centerX;
          final dy = y - centerY;
          missing.add((id, dx * dx + dy * dy));
        }
        final before = previous[id];
        if (before != null && before.prepared) {
          ideal.add(TileDraw(before, left, top, tileSize));
          continue;
        }
        _addFallback(frame, id, x, y, left, top, tileSize, camera.origin);
      }
    }
    if (covered && !waiting) dropPrevious();
    _updateWanted(tz, camera, size, frame, nowMs);
    return waiting;
  }

  /// Covers a missing tile with the nearest loaded ancestor, or failing that
  /// with whichever of its children are loaded.
  void _addFallback(
    int frame,
    TileId id,
    int x,
    int y,
    double left,
    double top,
    double tileSize,
    ui.Offset origin,
  ) {
    var ancestor = id;
    for (var dz = 1; dz <= 6 && ancestor.z > 0; dz++) {
      ancestor = ancestor.parent;
      final tile = tiles[ancestor];
      if (tile == null) continue;
      tile.usedFrame = frame;
      if (!tile.prepared) continue;
      final ax = x >> dz;
      final ay = y >> dz;
      final key = tileKey(ancestor.z, ax, ay);
      final big = tileSize * (1 << dz);
      final draw = fallbackByKey[key] ??= () {
        final d = TileDraw(
          tile,
          ax * big - origin.dx,
          ay * big - origin.dy,
          big,
        )..clips = [];
        fallback.add(d);
        return d;
      }();
      draw.clips!.add(ui.Rect.fromLTWH(left, top, tileSize, tileSize));
      return;
    }
    if (id.z >= maxDataZoom) return;
    final half = tileSize / 2;
    for (var cy = 0; cy < 2; cy++) {
      for (var cx = 0; cx < 2; cx++) {
        final child = tiles[TileId(id.z + 1, id.x * 2 + cx, id.y * 2 + cy)];
        if (child == null || !child.prepared) continue;
        child.usedFrame = frame;
        fallback.add(TileDraw(child, left + cx * half, top + cy * half, half));
      }
    }
  }

  void _updateWanted(
    int tz,
    VmapCamera camera,
    ui.Size size,
    int frame,
    int nowMs,
  ) {
    wanted.clear();
    missing.sort((a, b) => a.$2.compareTo(b.$2));
    for (final (id, _) in missing) {
      final failed = failedAt[id];
      if (failed != null && nowMs - failed < 3000) {
        retrying = true;
        continue;
      }
      wanted.add(id);
    }
    void cover(int z, {required bool fetch}) {
      final span = 256.0 * math.pow(2, camera.zoom - z);
      final TileRange(:n, :x0, :x1, :y0, :y1) = _inView(camera, z, span);
      for (var y = y0; y <= y1; y++) {
        for (var x = x0; x <= x1; x++) {
          final id = TileId(z, x % n, y);
          final tile = tiles[id];
          if (tile != null) {
            tile.usedFrame = frame;
          } else if (fetch && !wanted.contains(id)) {
            wanted.add(id);
          }
        }
      }
    }

    final bz = math.max(0, tz - 3);
    if (bz < tz) cover(bz, fetch: true);
    // The level above the view is kept alive and, past the middle of a zoom
    // level, the level below is fetched, so crossing into the next level in
    // either direction finds its tiles ready.
    if (tz > 0) cover(tz - 1, fetch: false);
    if (tz < maxDataZoom && camera.zoom - 1 - tz > 0.55) {
      cover(tz + 1, fetch: true);
    }
    if (wanted.isNotEmpty || hadWanted) {
      pool.want(List.of(wanted));
    }
    hadWanted = wanted.isNotEmpty;
  }

  /// Drops the tiles longest out of use until at most [keep] are held.
  void evict(int keep, int frame) {
    if (tiles.length <= keep) return;
    final stale = tiles.values.where((t) => t.usedFrame != frame).toList()
      ..sort((a, b) => a.usedFrame - b.usedFrame);
    for (final t in stale) {
      if (tiles.length <= keep) break;
      tiles.remove(t.id);
      t.dispose();
    }
  }

  /// The tiles of zoom [z], [span] logical pixels wide, that cover the view.
  static TileRange _inView(VmapCamera camera, int z, double span) => TileRange(
    z,
    camera.origin.dx,
    camera.origin.dy,
    camera.origin.dx + camera.size.width,
    camera.origin.dy + camera.size.height,
    tileSpan: span,
  );
}
