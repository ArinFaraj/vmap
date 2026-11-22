import 'dart:math' as math;

import '../camera/camera.dart';
import '../camera/view.dart';
import 'built_tile.dart' show tileExtent;
import 'tile_id.dart';
import 'tiles.dart';

/// What one source asks its pool for in a frame, into its
/// [TileSource.wantedNow] and [TileSource.wantedLater], and the tiles
/// already here that it keeps in use and gets ready to draw.
class TileAsks {
  TileAsks(
    this._source, {
    required this.frame,
    required this.nowMs,
    required this.prepare,
  });

  final TileSource _source;
  final int frame, nowMs;
  final void Function(LoadedTile tile, double scale) prepare;

  /// Asks for [missing], the view's own tiles not here, the most needed
  /// first, and [far], those of the buildings past them; then for the
  /// tiles of what the screen will show soon, and where the camera is
  /// headed.
  void ask(
    MapFrame camera,
    List<TileId> missing, {
    required List<TileId> far,
    required bool variableZoom,
  }) {
    final source = _source;
    source.wantedNow.clear();
    source.wantedLater.clear();
    // A tile asked for now is here a moment later: while the camera moves,
    // the tiles the view will need by then go first, and those it will
    // have left by then after them.
    final soon = camera.soon;
    final arriving = soon == null ? null : _cover(soon, variableZoom);
    for (final id in missing) {
      _wantInView(id, later: arriving != null && !arriving.contains(id));
    }
    if (soon != null) {
      for (final id in arriving!) {
        _want(id, scale: _scale(soon, id));
      }
    }
    for (final id in far) {
      _wantInView(id, later: true);
    }
    if (camera.ahead case final ahead?) {
      _wantAhead(ahead, camera.view, variableZoom);
    }
  }

  /// Asks for the tiles of [ahead], where the camera seeing [now] is
  /// headed, and those over them on the way.
  void _wantAhead(MapView ahead, MapView now, bool variableZoom) {
    final there = _cover(ahead, variableZoom);
    for (final id in there) {
      _want(id, later: true, scale: _scale(ahead, id));
    }
    // The tiles over the same ground at every zoom between here and there
    // too, the coarsest first: the way down passes through each of them
    // faster than it can be loaded on the way.
    final deepest = _source.maxDataZoom;
    final here = math.min(now.zoom.floor(), deepest);
    for (var z = here + 1; z < deepest; z++) {
      for (final id in there) {
        if (z < id.z) _want(_over(id, z), later: true);
      }
    }
    // And coarser ones than the tiles here, which stand in over ground far
    // from here until those arrive.
    for (final id in there) {
      for (var up = 3; up <= 9 && id.z - up >= 0; up += 3) {
        if (id.z - up <= here) _want(_over(id, id.z - up), later: true);
      }
    }
  }

  /// Asks for [id], a tile the view needs, unless it failed too lately.
  void _wantInView(TileId id, {required bool later}) {
    if (_source.retries.resting(id, nowMs)) {
      _source.retrying = true;
    } else {
      _want(id, later: later);
    }
  }

  /// Asks for tile [id], needed now or [later], unless it is here, failed
  /// lately or is asked for already. One here is kept in use, and made
  /// ready to draw at [scale] when that is given.
  void _want(TileId id, {bool later = false, double? scale}) {
    final source = _source;
    final have = source.tiles[id];
    if (have != null) {
      have.usedFrame = frame;
      if (scale != null && !have.prepared) prepare(have, scale);
    } else if (!source.retries.resting(id, nowMs) &&
        !source.wantedNow.contains(id)) {
      (later ? source.wantedLater : source.wantedNow).add(id);
    }
  }

  /// The tiles [view] covers.
  Set<TileId> _cover(MapView view, bool variableZoom) => {
    for (final t in view.cover(
      maxZoom: _source.maxDataZoom,
      variableZoom: variableZoom,
    ))
      ?_source.idOf(t),
  };

  /// Tile units to a pixel for tile [id] in [view].
  static double _scale(MapView view, TileId id) =>
      view.worldSize / (1 << id.z) / tileExtent;

  /// The tile of zoom [z] over [id].
  static TileId _over(TileId id, int z) {
    final up = id.z - z;
    return TileId(z, id.x >> up, id.y >> up);
  }
}
