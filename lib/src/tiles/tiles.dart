import 'dart:developer' show Timeline;
import 'dart:math' as math;
import 'dart:ui' as ui;

import '../camera/camera.dart';
import 'extrusion.dart';
import 'gpu_stream.dart';
import '../labels/label_state.dart';
import '../render/map_renderer.dart';
import '../style/style_model.dart';
import 'built_tile.dart';
import 'worker.dart';
import 'tile_id.dart';
import '../camera/view.dart';

class LoadedTile {
  LoadedTile(this.id, BuiltTile built, this.sheet)
    : _built = built,
      extrusions = built.extrusions,
      gpu = built.gpu;

  /// The buildings to stand up on a tilted map.
  final List<BuiltExtrusion> extrusions;

  /// The fill and line layers for the GPU renderer, when it is on.
  final GpuStream? gpu;

  final TileId id;
  final StyleSheet sheet;
  BuiltTile? _built;

  /// The worker's meshes, which a renderer makes the tile drawable from;
  /// null once it is.
  List<BuiltMesh>? get builtMeshes => _built?.meshes;
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
  RendererTileData? get rendererData => _rendererData;
  RendererTileData? _rendererData;

  /// Keeps [data] for the renderer that made it, until [releaseRenderer].
  void keepForRenderer(RendererTileData data) {
    assert(_rendererData == null);
    _rendererData = data;
  }

  /// Lets go of what the renderer kept, so the next [prepare] makes the
  /// tile ready for its renderer again.
  void releaseRenderer() {
    _rendererData?.dispose();
    _rendererData = null;
    _ready = false;
  }

  bool get prepared => _ready;
  bool _ready = false;

  /// Made ready once, then let go by its renderer, which makes it ready
  /// again from what it kept.
  bool get waitsForRenderer => !_ready && _built == null;

  int _labelAt = 0;

  /// Gets the tile ready to draw, so the first frame that draws it has
  /// nothing left to compute: its labels, and what [renderer] draws it
  /// from, at [scale] tile units to a pixel.
  /// Works in steps and returns once [clock] passes [deadline]; call again
  /// to continue.
  void prepare(
    double scale,
    Stopwatch clock,
    int deadline, {
    required MapRenderer renderer,
  }) {
    if (_ready) return;
    final built = _built;
    if (built != null && !_labels(built, clock, deadline)) return;
    if (!renderer.makeReady(this, scale, clock, deadline)) return;
    _built = null;
    _ready = true;
    Timeline.instantSync(
      'vmap.tile.ready',
      arguments: {'id': '${id.z}/${id.x}/${id.y}'},
    );
  }

  /// Puts [built] in place of the tile's labels, which come late when the
  /// glyph ranges they are measured with did.
  void replaceLabels(List<BuiltLabel> built) {
    final span = 1 / (1 << id.z);
    labels
      ..clear()
      ..addAll([
        for (final l in built)
          TileLabel(l.key, l, id.x * span, id.y * span, span),
      ]);
    _copies.clear();
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

  void dispose() => releaseRenderer();
}

class TileDraw {
  TileDraw(this.tile, this.left, this.top, this.size);

  final LoadedTile tile;
  final double left;
  final double top;
  final double size;
  List<ui.Rect>? clips;
}

/// The sources of [defs] in order: each one of [sources] with the same
/// signature kept when [keep], the rest made by [make] from its index, each
/// new one showing the tiles of the source of its name it replaces until
/// its own are ready. The sources not kept are disposed.
List<TileSource> reconcileSources(
  List<TileSource> sources,
  List<VectorSource> defs, {
  required bool keep,
  required TileSource Function(int index) make,
}) {
  final byName = <String, TileSource>{
    if (keep)
      for (final s in sources) s.def.name: s,
  };
  final kept = <String, TileSource>{
    if (keep)
      for (final s in sources) s.def.signature: s,
  };
  final next = <TileSource>[];
  for (var i = 0; i < defs.length; i++) {
    final def = defs[i];
    final reused = kept.remove(def.signature);
    if (reused != null) {
      next.add(reused);
      continue;
    }
    final made = make(i);
    if (byName[def.name] case final before?) made._takeOver(before);
    next.add(made);
  }
  for (final s in sources) {
    if (!next.contains(s)) s.dispose();
  }
  return next;
}

/// When each tile that failed may be asked for again.
class TileRetries {
  final Map<TileId, ({int atMs, int times})> _failed = {};

  /// Notes that tile [id] could not be had at [nowMs]. Data it could not
  /// read will not read better soon, so it waits the longest at once.
  void fail(TileId id, int nowMs, {required bool corrupt}) {
    final times = corrupt ? _doublings + 1 : (_failed[id]?.times ?? 0) + 1;
    _failed[id] = (atMs: nowMs, times: times);
  }

  /// Forgets that tile [id] failed, now that it loaded.
  void loaded(TileId id) => _failed.remove(id);

  static const _doublings = 7;

  /// Whether tile [id] failed too lately to ask for it again: three seconds
  /// after the first failure, twice as long after each one more, up to
  /// about six minutes, so a missing tile is not asked for over and over.
  bool resting(TileId id, int nowMs) {
    final f = _failed[id];
    if (f == null) return false;
    final wait = 3000 << (math.min(f.times, _doublings + 1) - 1);
    return nowMs - f.atMs < wait;
  }
}

/// The tiles of one of the style's sources.
class TileSource {
  TileSource(this.def, this.pool);

  /// Shows [before]'s tiles until this source's own are ready.
  void _takeOver(TileSource before) {
    previous
      ..addAll(before.previous)
      ..addAll(before.tiles);
    before.previous.clear();
    before.tiles.clear();
  }

  /// Keeps every tile shown, as one that changed, until it is built again.
  void rebuildAll() {
    for (final MapEntry(:key, :value) in tiles.entries) {
      previous.remove(key)?.dispose();
      previous[key] = value;
    }
    tiles.clear();
  }

  final VectorSource def;
  final TilePool pool;
  final Map<TileId, LoadedTile> tiles = {};

  /// Tiles of the data this source had before it changed, shown until the
  /// tiles of the new data are ready.
  final Map<TileId, LoadedTile> previous = {};
  final TileRetries retries = TileRetries();

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
  /// missing ones, and returns whether a tile is still being prepared. A
  /// tilted view takes tiles nearer the camera at the view's zoom, farther
  /// ones a level or more coarser.
  bool cover(
    MapFrame camera,
    double dataZoom, {
    required int frame,
    required int nowMs,
    required void Function(LoadedTile tile, double scale) prepare,
    bool variableZoom = false,
    bool standing = false,
  }) {
    retrying = false;
    maxDataZoom = pool.coverMaxZoom;
    final view = camera.view;
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
      variableZoom: variableZoom,
      beyond: variableZoom ? view.height : 0,
      standing: standing ? view.standingFor() : 0,
    );
    TileId idOf(CoverTile t) => TileId(
      t.z,
      t.x % (1 << t.z),
      t.y,
      over: t.z >= maxDataZoom ? t.over : 0,
    );
    // A ready tile whose children in view are not all ready yet stays in
    // their place until they are, and they then take it over together:
    // one at a time, the tile would stand in for the rest cut to their
    // squares, and with it its buildings standing over the ready ones.
    final holding = <(int, int, int), LoadedTile>{};
    for (final t in picked) {
      if (t.z == 0 || t.y < 0 || t.y >= 1 << t.z) continue;
      final id = idOf(t);
      if (_ready(id) != null || retries.resting(id, nowMs)) continue;
      final parent = _readyAt(t.z - 1, (t.x >> 1) % (1 << (t.z - 1)), t.y >> 1);
      if (parent != null) holding[(t.z - 1, t.x >> 1, t.y >> 1)] = parent;
    }
    final held = <(int, int, int)>{};
    for (final (rank, t) in picked.indexed) {
      final n = 1 << t.z;
      if (t.y < 0 || t.y >= n) continue;
      final id = idOf(t);
      final span = view.worldSize / n;
      final left = t.x * span - origin.dx;
      final top = t.y * span - origin.dy;
      if (holding.isNotEmpty) {
        final up1 = (t.z - 1, t.x >> 1, t.y >> 1);
        final up2 = (t.z - 2, t.x >> 2, t.y >> 2);
        final key = holding.containsKey(up1)
            ? up1
            : holding.containsKey(up2)
            ? up2
            : null;
        if (key != null) {
          final parent = holding[key]!;
          parent.usedFrame = frame;
          if (held.add(key)) {
            final big = view.worldSize / (1 << key.$1);
            ideal.add(
              TileDraw(
                parent,
                key.$2 * big - origin.dx,
                key.$3 * big - origin.dy,
                big,
              ),
            );
          }
          final waits = tiles[id];
          if (waits == null) {
            covered = false;
            missing.add((id, rank.toDouble()));
          } else {
            waits.usedFrame = frame;
            if (!waits.prepared) prepare(waits, span / tileExtent);
            waiting = true;
          }
          continue;
        }
      }
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
      // The same tile laid out for a nearby zoom has the same ground and
      // buildings, so it is drawn as the tile itself, not as a stand-in cut
      // to its square, which would cut its buildings off where they stand
      // over the tiles beside it.
      if (_otherLayout(frame, id) case final other?) {
        ideal.add(TileDraw(other, left, top, span));
        continue;
      }
      _addFallback(frame, id, t.x, t.y, left, top, span, origin, prepare);
    }
    if (covered && !waiting) dropPrevious();
    wanted.clear();
    missing.sort((a, b) => a.$2.compareTo(b.$2));
    for (final (id, _) in missing) {
      if (retries.resting(id, nowMs)) {
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
    if (wanted.isNotEmpty || hadWanted || pool.loading) {
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
      if (retries.resting(id, nowMs)) continue;
      if (!wanted.contains(id)) wanted.add(id);
      // Coarser tiles over the same ground too, so the way down to it has
      // something to stand in while the tiles of each zoom arrive.
      for (var up = 3; up <= 9 && id.z - up >= 0; up += 3) {
        final above = TileId(id.z - up, id.x >> up, id.y >> up);
        final kept = tiles[above];
        if (kept != null) {
          kept.usedFrame = frame;
        } else if (!retries.resting(above, nowMs) && !wanted.contains(above)) {
          wanted.add(above);
        }
      }
    }
  }

  /// Covers a missing tile with its four children when all are loaded; else
  /// with the nearest loaded ancestor, cut to its square, under whichever
  /// of its descendants are loaded, as MapLibre retains both: the detail
  /// that was on the screen stays where it is.
  void _addFallback(
    int frame,
    TileId id,
    int x,
    int y,
    double left,
    double top,
    double tileSize,
    ui.Offset origin,
    void Function(LoadedTile tile, double scale) prepare,
  ) {
    // As MapLibre keeps loaded children before parents: zooming out, or as
    // a tilted map's tile zoom moves between two levels with the camera,
    // the four tiles under this one are what the screen showed a frame ago.
    if (_addCompleteChildren(frame, id, left, top, tileSize)) return;
    var ancestor = id;
    for (var dz = 1; ancestor.z > 0; dz++) {
      ancestor = ancestor.parent;
      final tile = tiles[ancestor];
      if (tile == null) continue;
      tile.usedFrame = frame;
      final big = tileSize * (1 << dz);
      // One whose renderer let its data go, idle for long, is sent again.
      if (!tile.prepared) prepare(tile, big / tileExtent);
      if (!tile.prepared) continue;
      final ax = x >> dz;
      final ay = y >> dz;
      final key = tileKey(ancestor.z, ax, ay);
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
      _addChildren(frame, id, left, top, tileSize, 3);
      return;
    }
    if (!_addChildren(frame, id, left, top, tileSize, 3)) uncovered++;
  }

  /// Tile [id] or another layout of it, ready to draw, or null.
  LoadedTile? _ready(TileId id) {
    final tile = tiles[id] ?? previous[id];
    if (tile != null && tile.prepared) return tile;
    return _otherLayout(-1, id);
  }

  /// The ready tile [z]/[x]/[y] in any layout, or null.
  LoadedTile? _readyAt(int z, int x, int y) {
    if (z < maxDataZoom) {
      final tile = tiles[TileId(z, x, y)];
      return tile != null && tile.prepared ? tile : null;
    }
    for (var over = z; over <= z + 4; over++) {
      final tile = tiles[TileId(z, x, y, over: over)];
      if (tile != null && tile.prepared) return tile;
    }
    return null;
  }

  /// Tile [id] laid out for a zoom up to four levels away, ready to draw,
  /// kept as used in [frame] unless it is negative.
  LoadedTile? _otherLayout(int frame, TileId id) {
    for (var d = 1; d <= 4; d++) {
      for (final o in [id.over - d, id.over + d]) {
        if (o < id.z) continue;
        final other = tiles[id.at(o)];
        if (other == null || !other.prepared) continue;
        if (frame >= 0) other.usedFrame = frame;
        return other;
      }
    }
    return null;
  }

  /// Covers [id] with the four tiles one level under it when all of them
  /// are ready. Returns whether they were.
  bool _addCompleteChildren(
    int frame,
    TileId id,
    double left,
    double top,
    double tileSize,
  ) {
    if (id.z >= maxDataZoom) return false;
    final children = [
      for (var cy = 0; cy < 2; cy++)
        for (var cx = 0; cx < 2; cx++)
          tiles[TileId(id.z + 1, id.x * 2 + cx, id.y * 2 + cy)],
    ];
    if (children.any((c) => c == null || !c.prepared)) return false;
    final half = tileSize / 2;
    for (final (i, child) in children.indexed) {
      child!.usedFrame = frame;
      fallback.add(
        TileDraw(child, left + (i % 2) * half, top + (i ~/ 2) * half, half),
      );
    }
    return true;
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

  /// Drops the tiles longest out of use until at most [keep] are held.
  /// The tiles of the [keptZoom] coarsest levels stay, at most 21 of them:
  /// they stand in anywhere on the world, so a flight over ground not yet
  /// loaded never shows it bare.
  void evict(int keep, int frame) {
    if (tiles.length <= keep) return;
    final stale =
        tiles.values
            .where((t) => t.usedFrame != frame && t.id.z > keptZoom)
            .toList()
          ..sort((a, b) => a.usedFrame - b.usedFrame);
    for (final t in stale) {
      if (tiles.length <= keep) break;
      tiles.remove(t.id);
      t.dispose();
    }
  }
}
