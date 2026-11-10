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
      final symbol = _style.symbolOf(candidate);
      st
        ..drawLayer = layerOf(candidate)
        ..drawnByKey = symbol?.drawnByKey == true
        ..drawnByScreenY = symbol?.drawnByScreenY == true;
      if (candidate is! TileLabel) {
        st.tileWidth = -1;
        if (!st.drawnByScreenY) continue;
        _style.stand(candidate);
        _view.project(st.worldX, st.worldY);
        _view.standAt(0);
        st.drawY = _view.y.roundToDouble();
        continue;
      }
      // MapLibre draws a layer's symbols tile by tile: deepest zoom first,
      // then in rows down the turned screen, each row from left to right
      // (`getRenderableIds` for symbol layers, reversed by the painter).
      final span = candidate.tileSpan;
      final tx = candidate.tileX / span, ty = candidate.tileY / span;
      st
        ..tileWidth = span
        ..tileRow = -ts * tx + tc * ty
        ..tileColumn = tc * tx + ts * ty;
      if (!st.drawnByScreenY) continue;
      // As MapLibre's getSortedSymbolIndexes: the anchor's turned y in
      // whole tile units.
      final x = (st.worldX - candidate.tileX) / span;
      final y = (st.worldY - candidate.tileY) / span;
      st.drawY = ((-ts * x + tc * y) * _sortExtent).roundToDouble();
    }
    drawn.sort(_drawingOrder);
  }

  static int _drawingOrder(LabelState a, LabelState b) {
    final byLayer = a.drawLayer - b.drawLayer;
    if (byLayer != 0) return byLayer;
    if (!a.drawnByKey && a.tileWidth >= 0 && b.tileWidth >= 0) {
      if (a.tileWidth != b.tileWidth) {
        return a.tileWidth.compareTo(b.tileWidth);
      }
      final byRow = a.tileRow.compareTo(b.tileRow);
      if (byRow != 0) return byRow;
      final byColumn = a.tileColumn.compareTo(b.tileColumn);
      if (byColumn != 0) return byColumn;
    }
    if (!a.drawnByScreenY) return a.sortKey - b.sortKey;
    final byY = a.drawY.compareTo(b.drawY);
    return byY != 0 ? byY : b.sortKey - a.sortKey;
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
}
