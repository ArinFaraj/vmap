import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:vmap/renderer.dart';

/// Tiles fading into view and out of it. A tile that shows where it did
/// not a moment ago fades in over [micros]; a tile that stops showing is
/// drawn under the tiles fading in over its place until they are opaque,
/// so a swap of zoom levels crossfades instead of jumping.
class TileFade {
  TileFade(this._clock);

  final Stopwatch _clock;

  static const micros = 250000;

  final Map<LoadedTile, _Seen> _seen = Map.identity();
  int _frame = 0;

  /// Whether a later frame would look different.
  bool animating = false;

  /// Per source, the tiles that stopped showing within [micros], placed for
  /// this frame's view.
  List<List<TileDraw>> leaving = const [];

  /// Notes the tiles drawn this frame and finds the ones leaving. [ready]
  /// says whether a tile can still be drawn.
  void begin(
    List<List<TileDraw>> fallback,
    List<List<TileDraw>> ideal,
    MapView view,
    ui.Offset origin,
    bool Function(LoadedTile tile) ready,
  ) {
    _frame++;
    animating = false;
    final now = _clock.elapsedMicroseconds;
    for (var source = 0; source < ideal.length; source++) {
      for (final d in fallback[source].followedBy(ideal[source])) {
        final seen = _seen[d.tile] ??= _Seen(source, now);
        seen
          ..frame = _frame
          ..at = now;
        if (now - seen.shownAt < micros) animating = true;
      }
    }
    final out = [for (var s = 0; s < ideal.length; s++) <TileDraw>[]];
    _seen.removeWhere((tile, seen) {
      if (seen.frame == _frame) return false;
      if (now - seen.at >= micros || !ready(tile)) return true;
      if (seen.source < out.length) {
        final span = view.worldSize / (1 << tile.id.z);
        out[seen.source].add(
          TileDraw(
            tile,
            tile.id.x * span - origin.dx,
            tile.id.y * span - origin.dy,
            span,
          ),
        );
      }
      animating = true;
      return false;
    });
    leaving = out;
  }

  /// [tile]'s opacity this frame.
  double alpha(LoadedTile tile) {
    final seen = _seen[tile];
    if (seen == null) return 1;
    return math.min(1.0, (_clock.elapsedMicroseconds - seen.shownAt) / micros);
  }

  /// Whether tiles [a] and [b] cover any of the same ground: one holds the
  /// other or they are the same.
  static bool overlap(TileId a, TileId b) {
    if (a.z > b.z) return overlap(b, a);
    final dz = b.z - a.z;
    return b.x >> dz == a.x && b.y >> dz == a.y;
  }
}

class _Seen {
  _Seen(this.source, this.shownAt) : at = shownAt;

  final int source;
  final int shownAt;

  /// The frame and the time it was last drawn.
  int frame = 0;
  int at;
}
