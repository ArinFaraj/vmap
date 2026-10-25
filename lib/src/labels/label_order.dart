import 'dart:math' as math;

import 'label_state.dart';
import 'label_style.dart';
import 'label_view.dart';

/// The orders MapLibre places and draws symbols in.
class LabelOrder {
  LabelOrder(this._view, this._style);

  final LabelView _view;
  final LabelStyle _style;

  static int layerOf(LabelCandidate c) => switch (c) {
    TileLabel(:final tile) => tile.layer,
    MarkerName() => 1 << 30,
  };

  /// Sorts [states] into placement order: by rank, then as the sources
  /// list them, or with [byTile] tile by tile as MapLibre does, a layer
  /// placed by screen y going by each label's turned y in tile units. With
  /// [keepPlaced], labels placed in the last pass go first within their
  /// rank, so a map turning or tilting keeps the labels it shows rather
  /// than swapping them for equals at every placement.
  void sortForPlacement(
    List<LabelState> states, {
    required bool byTile,
    bool keepPlaced = false,
  }) {
    _keepPlaced = keepPlaced;
    if (!byTile) {
      states.sort((a, b) => a.sortKey - b.sortKey);
      return;
    }
    final bearing = -_view.mapTurn;
    final ts = math.sin(bearing), tc = math.cos(bearing);
    for (final st in states) {
      final c = st.candidate;
      if (c is TileLabel && (_style.symbolOf(c)?.placedByScreenY ?? false)) {
        final x = (st.worldX - c.tileX) / c.tileSpan;
        final y = (st.worldY - c.tileY) / c.tileSpan;
        st.drawY = ((-ts * x + tc * y) * _sortExtent).roundToDouble();
      }
    }
    states.sort(_placementOrder);
  }

  /// Puts [drawn] in MapLibre's drawing order: layer by layer, and within
  /// a layer in placement order, or top to bottom on the screen for a
  /// layer drawn by screen y, the later feature first on a tie.
  void sortForDrawing(List<LabelState> drawn) {
    final bearing = -_view.mapTurn;
    final ts = math.sin(bearing), tc = math.cos(bearing);
    for (final st in drawn) {
      final candidate = st.candidate;
      if (_style.symbolOf(candidate)?.drawnByScreenY != true) continue;
      if (candidate is TileLabel) {
        // As MapLibre's getSortedSymbolIndexes: the anchor's turned y in
        // whole tile units.
        final x = (st.worldX - candidate.tileX) / candidate.tileSpan;
        final y = (st.worldY - candidate.tileY) / candidate.tileSpan;
        st.drawY = ((-ts * x + tc * y) * _sortExtent).roundToDouble();
        continue;
      }
      _style.stand(candidate);
      _view.project(st.worldX, st.worldY);
      _view.standAt(0);
      st.drawY = _view.y.roundToDouble();
    }
    drawn.sort((a, b) {
      final byLayer = layerOf(a.candidate) - layerOf(b.candidate);
      if (byLayer != 0) return byLayer;
      if (_style.symbolOf(a.candidate)?.drawnByKey != true) {
        final byTile = _tileOrder(a.candidate, b.candidate, ts, tc);
        if (byTile != 0) return byTile;
      }
      if (_style.symbolOf(a.candidate)?.drawnByScreenY != true) {
        return a.sortKey - b.sortKey;
      }
      final byY = a.drawY.compareTo(b.drawY);
      return byY != 0 ? byY : b.sortKey - a.sortKey;
    });
  }

  /// MapLibre's placement order: by priority, then a layer's tiles deepest
  /// first, each copy of the world, column and row in turn (the order
  /// `Style._updatePlacement` sorts them in), then the order the tile lists
  /// its symbols in.
  int _placementOrder(LabelState a, LabelState b) {
    final byRank = (a.sortKey >> 16) - (b.sortKey >> 16);
    if (byRank != 0) return byRank;
    if (_keepPlaced && a.placed != b.placed) return a.placed ? -1 : 1;
    final ca = a.candidate, cb = b.candidate;
    if (ca is TileLabel && cb is TileLabel) {
      if (ca.tileSpan != cb.tileSpan) return ca.tileSpan.compareTo(cb.tileSpan);
      final ax = (ca.tileX / ca.tileSpan).round();
      final bx = (cb.tileX / cb.tileSpan).round();
      final n = (1 / ca.tileSpan).round();
      final aw = (ax / n).floor(), bw = (bx / n).floor();
      if (aw != bw) return aw - bw;
      if (ax != bx) return ax - bx;
      final ay = (ca.tileY / ca.tileSpan).round();
      final by = (cb.tileY / cb.tileSpan).round();
      if (ay != by) return ay - by;
      // As MapLibre's placeLayerBucketPart for symbol-z-order viewport-y:
      // the lowest on the screen first, then the earlier feature.
      if (ca.tile.layer == cb.tile.layer &&
          (_style.symbolOf(ca)?.placedByScreenY ?? false)) {
        final byY = b.drawY.compareTo(a.drawY);
        if (byY != 0) return byY;
      }
    }
    return a.sortKey - b.sortKey;
  }

  bool _keepPlaced = false;

  /// The tile units MapLibre sorts symbols in, `EXTENT`.
  static const _sortExtent = 8192.0;

  /// MapLibre draws a layer's symbols tile by tile: deepest zoom first,
  /// then in rows down the turned screen, each row from left to right
  /// (`getRenderableIds` for symbol layers, reversed by the painter).
  static int _tileOrder(
    LabelCandidate a,
    LabelCandidate b,
    double s,
    double c,
  ) {
    if (a is! TileLabel || b is! TileLabel) return 0;
    if (a.tileSpan != b.tileSpan) return a.tileSpan.compareTo(b.tileSpan);
    if (a.tileX == b.tileX && a.tileY == b.tileY) return 0;
    final ax = a.tileX / a.tileSpan, ay = a.tileY / a.tileSpan;
    final bx = b.tileX / b.tileSpan, by = b.tileY / b.tileSpan;
    final byRow = (-s * ax + c * ay).compareTo(-s * bx + c * by);
    if (byRow != 0) return byRow;
    return (c * ax + s * ay).compareTo(c * bx + s * by);
  }
}
