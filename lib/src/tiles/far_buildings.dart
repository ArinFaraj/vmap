import 'dart:math' as math;
import 'dart:ui' as ui;

import '../camera/camera.dart';
import '../camera/view.dart';
import 'built_tile.dart' show tileExtent;
import 'tile_id.dart';
import 'tile_layout.dart';
import 'tiles.dart';

/// The most tiles drawn for their buildings alone.
const _mostFar = 40;

/// Fills [layout]'s far tiles with the tiles of the zoom that carries
/// buildings within [reach] that its own tiles leave out. Returns whether
/// one is still being prepared, and the ones not here.
({bool waiting, List<TileId> missing}) layFarBuildings(
  TileLayout layout,
  MapFrame camera,
  BuildingReach reach,
) {
  final TileLayout(:source, :frame, :nowMs) = layout;
  final TilePicture(:ideal, :fallback, :far) = layout.into;
  final missing = <TileId>[];
  final view = camera.view;
  final z = math.min(view.zoom.floor(), source.maxDataZoom);
  if (z < 1) return (waiting: false, missing: missing);
  final origin = camera.origin;
  // A tile standing in for others may be cut to their squares, and with
  // it the buildings it carries past them, so only the view's own tiles
  // already draw all of theirs.
  final drawn = {for (final d in ideal) d.tile};
  final stood = _stoodAbove(ideal.followedBy(fallback), z, origin);
  final standingIn = <int>{};
  var waiting = false, count = 0;

  // Buildings past the ground tiles stand at once, and those still rising
  // as ground stand up whole: there they come in where the ground's own
  // were shown, flat or standing, the frame before.
  void addFar(LoadedTile tile, int tz, int x, int y) {
    tile.standWhole(nowMs);
    final size = view.worldSize / (1 << tz);
    far.add(TileDraw(tile, x * size - origin.dx, y * size - origin.dy, size));
  }

  // Until a tile of zoom z is ready, the coarser one that held its
  // buildings in the last frames keeps them standing, so crossing a zoom
  // level does not empty the distance for the frames it loads in.
  void standIn(CoverTile t) {
    for (var up = 1; up <= 2 && z - up >= 1; up++) {
      final cz = z - up, cx = t.x >> up, cy = t.y >> up;
      final coarse = _anyLayout(source, cz, cx % (1 << cz), cy);
      if (coarse == null || !layout.has(coarse)) continue;
      if (coarse.extrusions.isEmpty || drawn.contains(coarse)) return;
      coarse.usedFrame = frame;
      if (standingIn.add(tileKey(cz, cx, cy))) addFar(coarse, cz, cx, cy);
      return;
    }
  }

  final n = 1 << z;
  final span = view.worldSize / n;
  final picked = view.coverWithin(
    z,
    reach.distance,
    standing: view.standingFor(),
  );
  for (final t in picked) {
    if (t.y < 0 || t.y >= n) continue;
    if (count >= _mostFar) break;
    if (_under(stood, z, t.x, t.y)) continue;
    if (standingIn.contains(tileKey(z, t.x, t.y))) continue;
    final x = t.x % n;
    final tile = _anyLayout(source, z, x, t.y);
    if (tile == null) {
      count++;
      standIn(t);
      missing.add(TileId(z, x, t.y));
      continue;
    }
    if (drawn.contains(tile)) continue;
    count++;
    tile.usedFrame = frame;
    if (!tile.prepared) layout.prepare(tile, span / tileExtent);
    if (!tile.prepared) {
      waiting = true;
      standIn(t);
      continue;
    }
    if (tile.extrusions.isEmpty) continue;
    // A tile not shown yet joins the next picture, to fade in over the
    // distance as the ground does; one joined to a picture after this one,
    // as ground or alone, brings its buildings there.
    if (!tile.inPicture(layout.newest)) {
      layout.leftOut(tile);
      standIn(t);
      continue;
    }
    standingIn.add(tileKey(z, t.x, t.y));
    addFar(tile, z, t.x, t.y);
  }
  return (waiting: waiting, missing: missing);
}

/// The tiles of [ground], coarser than zoom [z], whose own data stands
/// buildings, by [tileKey] of their place in the view.
Set<int> _stoodAbove(Iterable<TileDraw> ground, int z, ui.Offset origin) => {
  for (final d in ground)
    if (d.tile.id.z < z && d.tile.stands)
      tileKey(
        d.tile.id.z,
        ((d.left + origin.dx) / d.size).round(),
        d.tile.id.y,
      ),
};

/// Whether one of [stood] covers the tile [z]/[x]/[y].
bool _under(Set<int> stood, int z, int x, int y) {
  if (stood.isEmpty) return false;
  for (var up = 1; up <= z; up++) {
    if (stood.contains(tileKey(z - up, x >> up, y >> up))) return true;
  }
  return false;
}

/// The tile [z]/[x]/[y] of [source] in whichever layout is here, a ready
/// one first, or null.
LoadedTile? _anyLayout(TileSource source, int z, int x, int y) {
  if (z < source.maxDataZoom) return source.tiles[TileId(z, x, y)];
  LoadedTile? loading;
  for (var over = z; over <= z + 4; over++) {
    final tile = source.tiles[TileId(z, x, y, over: over)];
    if (tile == null) continue;
    if (tile.prepared) return tile;
    loading ??= tile;
  }
  return loading;
}
