import 'dart:ui' as ui;

import '../camera/camera.dart';
import '../camera/view.dart';
import 'built_tile.dart' show tileExtent;
import 'tile_id.dart';
import 'tiles.dart';

/// One picture of a source's tiles laid out for a frame: the view's tiles
/// that joined a picture up to [newest], or every ready tile when that is
/// null, and what stands in for the rest.
class TileLayout {
  TileLayout(
    this.source,
    this.into, {
    required this.newest,
    required this.frame,
    required this.nowMs,
    required this.prepare,
  }) {
    into.clear();
  }

  final TileSource source;
  final TilePicture into;
  final int? newest;
  final int frame, nowMs;
  final void Function(LoadedTile tile, double scale) prepare;

  /// The stand-ins laid so far, by [tileKey] of the tile each is.
  final Map<int, TileDraw> _fallbackByKey = {};

  Map<TileId, LoadedTile> get _tiles => source.tiles;
  int get _maxZoom => source.maxDataZoom;

  /// Whether [tile] is ready to draw and in this picture.
  bool has(LoadedTile? tile) =>
      tile != null && tile.prepared && tile.inPicture(newest);

  /// Notes that [tile], ready to draw, was left out of this picture: one
  /// that has joined none waits for the fade that runs to end.
  void leftOut(LoadedTile tile) {
    if (tile.joined == null) into.held = true;
  }

  /// Fills [into] with the tiles of [picked] and what stands in for the
  /// ones not in the picture. Returns whether a tile in view is still being
  /// prepared or waits to join, whether every tile of [picked] is here,
  /// and the ones not here with their rank in [picked].
  ({bool waiting, bool covered, List<(TileId, double)> missing}) lay(
    MapFrame camera,
    List<CoverTile> picked,
  ) {
    final view = camera.view;
    final origin = camera.origin;
    final ideal = into.ideal;
    final missing = <(TileId, double)>[];
    var waiting = false;
    var covered = true;
    // A ready tile whose children in view are not all ready yet stays in
    // their place until they are, and they then take it over together:
    // one at a time, the tile would stand in for the rest cut to their
    // squares, and with it its buildings standing over the ready ones.
    final holding = <(int, int, int), LoadedTile>{};
    for (final t in picked) {
      if (t.z == 0) continue;
      final id = source.idOf(t);
      if (id == null ||
          _ready(id) != null ||
          source.retries.resting(id, nowMs)) {
        continue;
      }
      // Four ready tiles under it stand in instead, as zooming out they are
      // what the screen showed a frame ago, buildings and all.
      if (_completeChildren(id) != null) continue;
      final parent = _readyAt(t.z - 1, (t.x >> 1) % (1 << (t.z - 1)), t.y >> 1);
      if (parent != null) holding[(t.z - 1, t.x >> 1, t.y >> 1)] = parent;
    }
    final held = <(int, int, int)>{};
    for (final (rank, t) in picked.indexed) {
      final id = source.idOf(t);
      if (id == null) continue;
      // What stands in for a tile still on its way keeps the layers it was
      // built with; one that could not be had follows the view's zoom.
      final keeps = !source.retries.resting(id, nowMs);
      final span = view.worldSize / (1 << t.z);
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
              _standIn(
                parent,
                key.$2 * big - origin.dx,
                key.$3 * big - origin.dy,
                big,
                keeps: keeps,
              ),
            );
          }
          final waits = _tiles[id];
          if (waits == null) {
            covered = false;
            missing.add((id, rank.toDouble()));
          } else {
            waits.usedFrame = frame;
            if (!waits.prepared) prepare(waits, span / tileExtent);
            waiting = true;
            if (waits.prepared && !has(waits)) leftOut(waits);
          }
          continue;
        }
      }
      final tile = _tiles[id];
      if (tile != null) {
        tile.usedFrame = frame;
        if (!tile.prepared) prepare(tile, span / tileExtent);
        if (has(tile)) {
          ideal.add(TileDraw(tile, left, top, span));
          continue;
        }
        waiting = true;
        if (tile.prepared) leftOut(tile);
      } else {
        covered = false;
        missing.add((id, rank.toDouble()));
      }
      if (source.previous[id] case final old? when has(old)) {
        ideal.add(TileDraw(old, left, top, span));
        continue;
      }
      // The same tile laid out for a nearby zoom has the same ground and
      // buildings, so it is drawn as the tile itself, not as a stand-in cut
      // to its square, which would cut its buildings off where they stand
      // over the tiles beside it.
      if (_otherLayout(id) case final other?) {
        other.usedFrame = frame;
        ideal.add(_standIn(other, left, top, span, keeps: keeps));
        continue;
      }
      _addFallback(id, t.x, t.y, left, top, span, origin, keeps: keeps);
    }
    return (waiting: waiting, covered: covered, missing: missing);
  }

  /// [tile] drawn in place of a tile not in the picture, keeping the
  /// layers it was built with when it [keeps] them.
  TileDraw _standIn(
    LoadedTile tile,
    double left,
    double top,
    double size, {
    required bool keeps,
  }) {
    final draw = TileDraw(tile, left, top, size);
    if (keeps) draw.builtFor = _builtFor(tile);
    return draw;
  }

  /// The style zooms [tile]'s layout was built for: its own level, and
  /// every level past it for a tile of the deepest zoom.
  (double, double) _builtFor(LoadedTile tile) {
    final from = (tile.id.over + source.pool.sheet.zoomOffset).toDouble();
    return (from, tile.id.z >= _maxZoom ? double.infinity : from + 1);
  }

  /// Covers a missing tile with its four children when all are ready; else
  /// with the nearest ready ancestor, cut to its square, under whichever
  /// of its descendants are ready, as MapLibre retains both: the detail
  /// that was on the screen stays where it is.
  void _addFallback(
    TileId id,
    int x,
    int y,
    double left,
    double top,
    double tileSize,
    ui.Offset origin, {
    required bool keeps,
  }) {
    // As MapLibre keeps loaded children before parents: zooming out, or as
    // a tilted map's tile zoom moves between two levels with the camera,
    // the four tiles under this one are what the screen showed a frame ago.
    if (_completeChildren(id) case final children?) {
      final half = tileSize / 2;
      for (final (i, child) in children.indexed) {
        child.usedFrame = frame;
        into.fallback.add(
          _standIn(
            child,
            left + (i % 2) * half,
            top + (i ~/ 2) * half,
            half,
            keeps: keeps,
          ),
        );
      }
      return;
    }
    var ancestor = id;
    for (var dz = 1; ancestor.z > 0; dz++) {
      ancestor = ancestor.parent;
      final tile = _tiles[ancestor];
      if (tile == null) continue;
      tile.usedFrame = frame;
      final big = tileSize * (1 << dz);
      // One whose renderer let its data go, idle for long, is sent again.
      if (!tile.prepared) prepare(tile, big / tileExtent);
      if (!has(tile)) continue;
      final ax = x >> dz;
      final ay = y >> dz;
      final draw = _fallbackByKey[tileKey(ancestor.z, ax, ay)] ??= () {
        final d = TileDraw(
          tile,
          ax * big - origin.dx,
          ay * big - origin.dy,
          big,
        )..clips = [];
        into.fallback.add(d);
        return d;
      }();
      if (keeps) draw.builtFor ??= _builtFor(tile);
      draw.clips!.add(ui.Rect.fromLTWH(left, top, tileSize, tileSize));
      _addChildren(id, left, top, tileSize, 3, keeps: keeps);
      return;
    }
    if (!_addChildren(id, left, top, tileSize, 3, keeps: keeps)) {
      into.uncovered++;
    }
  }

  /// Tile [id] or another layout of it in the picture, or null.
  LoadedTile? _ready(TileId id) {
    final tile = _tiles[id];
    if (has(tile)) return tile;
    final old = source.previous[id];
    if (has(old)) return old;
    return _otherLayout(id);
  }

  /// The tile [z]/[x]/[y] in the picture in any layout, or null.
  LoadedTile? _readyAt(int z, int x, int y) {
    if (z < _maxZoom) {
      final tile = _tiles[TileId(z, x, y)];
      return has(tile) ? tile : null;
    }
    for (var over = z; over <= z + 4; over++) {
      final tile = _tiles[TileId(z, x, y, over: over)];
      if (has(tile)) return tile;
    }
    return null;
  }

  /// Tile [id] laid out for a zoom up to four levels away, in the picture,
  /// or null.
  LoadedTile? _otherLayout(TileId id) {
    for (var d = 1; d <= 4; d++) {
      for (final o in [id.over - d, id.over + d]) {
        if (o < id.z) continue;
        final other = _tiles[id.at(o)];
        if (has(other)) return other;
      }
    }
    return null;
  }

  /// The four tiles a level under [id], when all of them are in the
  /// picture.
  List<LoadedTile>? _completeChildren(TileId id) {
    if (id.z >= _maxZoom) return null;
    final children = <LoadedTile>[];
    for (var c = 0; c < 4; c++) {
      final child =
          _tiles[TileId(id.z + 1, id.x * 2 + (c & 1), id.y * 2 + (c >> 1))];
      if (child == null || !has(child)) return null;
      children.add(child);
    }
    return children;
  }

  /// Covers [id] with its descendants in the picture down to [depth]
  /// levels, as MapLibre does: zooming out, what was on the screen is often
  /// two or three levels deeper than the tile now wanted. Returns whether
  /// any was.
  bool _addChildren(
    TileId id,
    double left,
    double top,
    double tileSize,
    int depth, {
    required bool keeps,
  }) {
    if (depth == 0 || id.z >= _maxZoom) return false;
    final half = tileSize / 2;
    var any = false;
    for (var cy = 0; cy < 2; cy++) {
      for (var cx = 0; cx < 2; cx++) {
        final childId = TileId(id.z + 1, id.x * 2 + cx, id.y * 2 + cy);
        final cl = left + cx * half, ct = top + cy * half;
        if (_tiles[childId] case final child? when has(child)) {
          child.usedFrame = frame;
          into.fallback.add(_standIn(child, cl, ct, half, keeps: keeps));
          any = true;
        } else if (_addChildren(
          childId,
          cl,
          ct,
          half,
          depth - 1,
          keeps: keeps,
        )) {
          any = true;
        }
      }
    }
    return any;
  }
}
