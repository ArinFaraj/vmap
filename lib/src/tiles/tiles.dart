import 'dart:developer' show Timeline;
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../camera/camera.dart';
import 'extrusion.dart';
import 'gpu_stream.dart';
import '../labels/label_state.dart';
import '../gpu/map_renderer.dart';
import '../style/style_model.dart';
import 'tessellate.dart';
import 'tile_builder.dart';
import 'worker.dart';
import '../camera/mercator.dart';
import 'tile_id.dart';
import '../camera/view.dart';

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
      extrusions = built.extrusions,
      gpu = built.gpu,
      groups = List.filled(sheet.buckets.length, null);

  /// The buildings to stand up on a tilted map.
  final List<BuiltExtrusion> extrusions;

  /// The fill and line layers for the GPU renderer, when it is on.
  final GpuStream? gpu;

  final TileId id;
  final StyleSheet sheet;
  BuiltTile? _built;
  final List<List<TileMesh>?> groups;
  final List<LabelCandidate> labels = [];
  final Map<int, List<LabelCandidate>> _copies = {};

  /// [labels] in the copy of the world [wrap] worlds east, where the tile
  /// is also drawn: MapLibre places the labels of each copy on its own.
  List<LabelCandidate> labelsIn(int wrap) {
    if (wrap == 0) return labels;
    final copy = _copies[wrap];
    if (copy != null && copy.length == labels.length) return copy;
    return _copies[wrap] = [
      for (final l in labels)
        if (l case TileLabel(
          :final tile,
          :final tileX,
          :final tileY,
          :final tileSpan,
        ))
          TileLabel('w$wrap|${l.key}', tile, tileX + wrap, tileY, tileSpan),
    ];
  }

  int usedFrame = 0;

  /// What a renderer keeps for this tile, let go with it.
  RendererTileData? rendererData;

  bool get prepared => _step < 0;

  /// 0 makes the canvas meshes, 1..layers widen one line layer each, then
  /// labels, then a renderer's upload.
  int _step = 0;
  int _uploaded = 0;
  int _labelAt = 0;

  /// Gets the tile ready to draw, so the first frame that draws it has
  /// nothing left to compute: the canvas meshes with every line widened to
  /// [widths], or with a [renderer] instead its upload, and the labels.
  /// Works in steps and returns once [clock] passes [deadline]; call again
  /// to continue.
  void prepare(
    Float64List widths,
    double scale,
    Stopwatch clock,
    int deadline, {
    MapRenderer? renderer,
  }) {
    final built = _built;
    if (built != null) {
      if (renderer != null && _step <= sheet.layers.length) {
        _step = sheet.layers.length + 1;
      }
      if (!_meshes(built, widths, scale, clock, deadline)) return;
      if (!_labels(built, clock, deadline)) return;
    }
    if (renderer != null && !renderer.upload(this, clock, deadline)) return;
    _built = null;
    _step = -1;
    Timeline.instantSync(
      'vmap.tile.ready',
      arguments: {'id': '${id.z}/${id.x}/${id.y}'},
    );
  }

  /// Opens a ready tile to a renderer's upload: one made ready for the
  /// canvas, or one whose upload the renderer let go.
  void uploadAgain() {
    if (_step < 0 && rendererData == null) _step = 0;
  }

  /// Ready but for a renderer's upload, after [uploadAgain].
  bool get waitsForUpload => _built == null && _step >= 0;

  bool _meshes(
    BuiltTile built,
    Float64List widths,
    double scale,
    Stopwatch clock,
    int deadline,
  ) {
    if (_step == 0) {
      while (_uploaded < built.meshes.length) {
        if (_uploaded > 0 && clock.elapsedMicroseconds > deadline) {
          return false;
        }
        final m = built.meshes[_uploaded++];
        (groups[m.bucket] ??= []).add(switch (sheet.buckets[m.bucket].kind) {
          BucketKind.line => TileMesh.line(m.chunk, m.props),
          BucketKind.circle => TileMesh.points(m.chunk, m.props),
          BucketKind.fill ||
          BucketKind.extrusion => TileMesh.fill(m.chunk, m.props),
        });
      }
      _step = 1;
      if (clock.elapsedMicroseconds > deadline) return false;
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
      if (clock.elapsedMicroseconds > deadline) return false;
    }
    return true;
  }

  bool _labels(BuiltTile built, Stopwatch clock, int deadline) {
    final span = 1 / (1 << id.z);
    final tx = id.x * span;
    final ty = id.y * span;
    while (_labelAt < built.labels.length) {
      final l = built.labels[_labelAt++];
      labels.add(TileLabel(l.key, l, tx, ty, span));
      if (_labelAt & 127 == 0 && clock.elapsedMicroseconds > deadline) {
        return false;
      }
    }
    return true;
  }

  void dispose() {
    for (final g in groups) {
      if (g == null) continue;
      for (final m in g) {
        m.dispose();
      }
    }
    rendererData?.dispose();
    rendererData = null;
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
  final Map<TileId, ({int atMs, int times})> failed = {};

  /// Notes that tile [id] could not be had at [nowMs]. Data it could not
  /// read will not read better soon, so it waits the longest at once.
  void fail(TileId id, int nowMs, {required bool corrupt}) {
    final times = corrupt ? _retryDoublings + 1 : (failed[id]?.times ?? 0) + 1;
    failed[id] = (atMs: nowMs, times: times);
  }

  static const _retryDoublings = 7;

  /// Whether tile [id] failed too lately to ask for it again: three seconds
  /// after the first failure, twice as long after each one more, up to
  /// about six minutes, so a missing tile is not asked for over and over.
  bool resting(TileId id, int nowMs) {
    final f = failed[id];
    if (f == null) return false;
    final wait = 3000 << (math.min(f.times, _retryDoublings + 1) - 1);
    return nowMs - f.atMs < wait;
  }

  final List<TileDraw> ideal = [];
  final List<TileDraw> fallback = [];
  final Map<int, TileDraw> fallbackByKey = {};

  /// Tiles this frame wanted that nothing loaded could stand in for.
  int uncovered = 0;
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
    MapFrame camera,
    double dataZoom, {
    required int frame,
    required int nowMs,
    required void Function(LoadedTile tile, double scale) prepare,
    double hold = 0,
    bool variableZoom = false,
    bool standing = false,
  }) {
    retrying = false;
    final size = camera.size;
    maxDataZoom = pool.coverMaxZoom;
    final view = camera.view;
    if (view != null) {
      return _coverView(
        view,
        camera,
        frame: frame,
        nowMs: nowMs,
        prepare: prepare,
        hold: hold,
        variableZoom: variableZoom,
        standing: standing,
      );
    }
    final tz = dataZoom.floor().clamp(0, maxDataZoom);
    final over = dataZoom.floor();
    final tileSize = 256.0 * math.pow(2, camera.zoom - tz);
    final TileRange(:n, :x0, :x1, :y0, :y1) = _inView(camera, tz, tileSize);
    final centerX = (camera.origin.dx + size.width / 2) / tileSize - 0.5;
    final centerY = (camera.origin.dy + size.height / 2) / tileSize - 0.5;

    ideal.clear();
    fallback.clear();
    fallbackByKey.clear();
    uncovered = 0;
    missing.clear();
    var waiting = false;
    var covered = true;
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        final id = TileId(tz, x % n, y, over: over);
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

  /// [cover] for a tilted view: tiles nearer the camera at the view's zoom,
  /// farther ones a level or more coarser.
  bool _coverView(
    MapView view,
    MapFrame camera, {
    required int frame,
    required int nowMs,
    required void Function(LoadedTile tile, double scale) prepare,
    double hold = 0,
    bool variableZoom = false,
    bool standing = false,
  }) {
    ideal.clear();
    fallback.clear();
    fallbackByKey.clear();
    uncovered = 0;
    missing.clear();
    var waiting = false;
    var covered = true;
    final origin = camera.origin;
    final picked = view.cover(
      maxZoom: maxDataZoom,
      hold: hold,
      variableZoom: variableZoom,
      beyond: variableZoom ? view.height : 0,
      standing: standing ? view.standingFor() : 0,
    );
    for (final (rank, t) in picked.indexed) {
      final n = 1 << t.z;
      if (t.y < 0 || t.y >= n) continue;
      final id = TileId(
        t.z,
        t.x % n,
        t.y,
        over: t.z >= maxDataZoom ? t.over : 0,
      );
      final span = view.worldSize / n;
      final left = t.x * span - origin.dx;
      final top = t.y * span - origin.dy;
      final tile = tiles[id];
      if (tile != null) {
        tile.usedFrame = frame;
        if (!tile.prepared) prepare(tile, span / tileExtent);
        if (tile.prepared) {
          ideal.add(TileDraw(tile, left, top, span));
          continue;
        }
        waiting = true;
      } else {
        covered = false;
        missing.add((id, rank.toDouble()));
      }
      final before = previous[id];
      if (before != null && before.prepared) {
        ideal.add(TileDraw(before, left, top, span));
        continue;
      }
      _addFallback(frame, id, t.x, t.y, left, top, span, origin);
    }
    if (covered && !waiting) dropPrevious();
    wanted.clear();
    missing.sort((a, b) => a.$2.compareTo(b.$2));
    for (final (id, _) in missing) {
      if (resting(id, nowMs)) {
        retrying = true;
        continue;
      }
      wanted.add(id);
    }
    _wantAhead(camera.ahead, frame, nowMs, prepare, variableZoom);
    for (final t in picked) {
      if (t.z == 0) continue;
      final parent = tiles[TileId(t.z - 1, (t.x % (1 << t.z)) >> 1, t.y >> 1)];
      parent?.usedFrame = frame;
    }
    if (wanted.isNotEmpty || hadWanted) {
      pool.want(List.of(wanted));
    }
    hadWanted = wanted.isNotEmpty;
    return waiting;
  }

  /// Asks, after what the screen needs now, for the tiles of [ahead], and
  /// gets those already here ready to draw.
  void _wantAhead(
    MapView? ahead,
    int frame,
    int nowMs,
    void Function(LoadedTile tile, double scale) prepare,
    bool variableZoom,
  ) {
    if (ahead == null) return;
    for (final t in ahead.cover(
      maxZoom: maxDataZoom,
      variableZoom: variableZoom,
    )) {
      final n = 1 << t.z;
      if (t.y < 0 || t.y >= n) continue;
      final id = TileId(
        t.z,
        t.x % n,
        t.y,
        over: t.z >= maxDataZoom ? t.over : 0,
      );
      final have = tiles[id];
      if (have != null) {
        have.usedFrame = frame;
        if (!have.prepared) prepare(have, ahead.worldSize / n / tileExtent);
        continue;
      }
      if (resting(id, nowMs)) continue;
      if (!wanted.contains(id)) wanted.add(id);
    }
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
    // The same tile laid out for a nearby zoom stands in while it is laid
    // out again.
    for (var d = 1; d <= 4; d++) {
      for (final o in [id.over - d, id.over + d]) {
        if (o < id.z) continue;
        final other = tiles[id.at(o)];
        if (other == null || !other.prepared) continue;
        other.usedFrame = frame;
        fallback.add(TileDraw(other, left, top, tileSize));
        return;
      }
    }
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
    if (!_addChildren(frame, id, left, top, tileSize, 3)) uncovered++;
  }

  /// Covers [id] with its loaded descendants down to [depth] levels, as
  /// MapLibre does: zooming out, what was on the screen is often two or
  /// three levels deeper than the tile now wanted. Returns whether any was.
  bool _addChildren(
    int frame,
    TileId id,
    double left,
    double top,
    double tileSize,
    int depth,
  ) {
    if (depth == 0 || id.z >= maxDataZoom) return false;
    final half = tileSize / 2;
    var any = false;
    for (var cy = 0; cy < 2; cy++) {
      for (var cx = 0; cx < 2; cx++) {
        final childId = TileId(id.z + 1, id.x * 2 + cx, id.y * 2 + cy);
        final cl = left + cx * half, ct = top + cy * half;
        final child = tiles[childId];
        if (child != null && child.prepared) {
          child.usedFrame = frame;
          fallback.add(TileDraw(child, cl, ct, half));
          any = true;
        } else if (_addChildren(frame, childId, cl, ct, half, depth - 1)) {
          any = true;
        }
      }
    }
    return any;
  }

  void _updateWanted(
    int tz,
    MapFrame camera,
    ui.Size size,
    int frame,
    int nowMs,
  ) {
    wanted.clear();
    missing.sort((a, b) => a.$2.compareTo(b.$2));
    for (final (id, _) in missing) {
      if (resting(id, nowMs)) {
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
  static TileRange _inView(MapFrame camera, int z, double span) => TileRange(
    z,
    camera.origin.dx,
    camera.origin.dy,
    camera.origin.dx + camera.size.width,
    camera.origin.dy + camera.size.height,
    tileSpan: span,
  );
}

/// How far above the camera's zoom tiles are picked. Zooming out past a
/// tile zoom keeps the finer tiles for [holdMs], so layers they alone carry
/// fade out on them instead of vanishing with them; a fall of a whole
/// level or more lets go at once.
class ZoomOutHold {
  static const holdMs = 300;

  int _level = 0;
  int _until = -1;

  /// The zoom to add when picking tiles for a view at [zoom], at [nowMs];
  /// 0 when not holding, or when there is no view.
  double at(double? zoom, int nowMs) {
    if (zoom == null) return 0;
    final level = zoom.floor();
    if (level >= _level || zoom <= _level - 1) return _release(level);
    if (_until < 0) _until = nowMs + holdMs;
    if (nowMs >= _until) return _release(level);
    return _level - zoom + 1e-6;
  }

  double _release(int level) {
    _level = level;
    _until = -1;
    return 0;
  }
}
