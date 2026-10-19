import 'dart:math' as math;
import 'dart:typed_data';

import 'collision_boxes.dart';
import 'label_path.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'tile_builder.dart' show tileExtent;

/// Lays names along roads: straight where the road is straight enough, bent
/// along it where it is not, and not twice close together.
class RoadLabels {
  RoadLabels(this._view, this._boxes);

  final LabelView _view;
  final CollisionBoxes _boxes;

  /// Road names follow bends. Off, a name is only written where the road is
  /// straight enough to carry it.
  bool curved = true;

  final List<LabelState> _placed = [];

  /// Forgets the names placed in the last pass.
  void startPass() => _placed.clear();

  /// Remembers [st] as placed, so the same name keeps away from it.
  void placed(LabelState st) => _placed.add(st);

  /// How close two of the same name may be, in logical pixels.
  static const double _repeatDistance = 260;

  /// Finds a straight enough stretch around the road's middle to carry text
  /// [textW] pixels long, and sets the label's anchor and angle to it.
  bool fit(
    LabelState st,
    TileLabel road,
    double textW,
    double textH,
    double unitPx, {
    double? maxBend,
    bool mapLibre = false,
  }) {
    final line = road.tile.line!;
    final half = textW / 2 / unitPx;
    // As MapLibre's placeGlyphsAlongLine: centred on its anchor, and gone
    // when it runs off either end of the line; its bends were held to the
    // layer's max angle when the anchor was chosen.
    if (mapLibre &&
        (road.anchorAlong - half < 0 ||
            road.anchorAlong + half > road.lineLength)) {
      return false;
    }
    final need = mapLibre ? 2 * half : textW * 1.15 / unitPx;
    if (road.lineLength < need) return false;
    // Centred on its anchor, moved along the road just enough to stay on it.
    final middle = road.anchorAlong.clamp(half, road.lineLength - half);
    final from = middle - half;
    final to = middle + half;
    var walked = 0.0;
    var ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0;
    var first = -1;
    var last = -1;
    final n = line.length ~/ 2;
    for (var i = 1; i < n; i++) {
      final x0 = line[i * 2 - 2];
      final y0 = line[i * 2 - 1];
      final dx = line[i * 2] - x0;
      final dy = line[i * 2 + 1] - y0;
      final seg = math.sqrt(dx * dx + dy * dy);
      if (seg == 0) continue;
      if (first < 0 && walked + seg >= from) {
        final t = (from - walked) / seg;
        ax = x0 + dx * t;
        ay = y0 + dy * t;
        first = i;
      }
      if (walked + seg >= to) {
        final t = (to - walked) / seg;
        bx = x0 + dx * t;
        by = y0 + dy * t;
        last = i;
        break;
      }
      walked += seg;
    }
    if (first < 0 || last < 0) return false;
    final cx = bx - ax;
    final cy = by - ay;
    final chord = math.sqrt(cx * cx + cy * cy);
    if (chord == 0) return false;
    final limit = textH * 0.3 / unitPx;
    for (var i = first; i < last; i++) {
      final px = line[i * 2] - ax;
      final py = line[i * 2 + 1] - ay;
      if (mapLibre || (px * cy - py * cx).abs() / chord > limit) {
        return curved &&
            _bend(
              st,
              road,
              from,
              to,
              textH,
              unitPx,
              mapLibre ? double.infinity : maxBend,
            );
      }
    }
    st.curve = null;
    var angle = math.atan2(cy, cx);
    if (angle > math.pi / 2) angle -= math.pi;
    if (angle < -math.pi / 2) angle += math.pi;
    st
      ..angle = angle
      ..worldX = road.tileX + (ax + bx) / 2 / tileExtent * road.tileSpan
      ..worldY = road.tileY + (ay + by) / 2 / tileExtent * road.tileSpan;
    return true;
  }

  /// The sharpest turn between two neighbouring slices of a bent name.
  static const double _maxBend = 0.42;

  /// Remembers the road around [from]..[to] tile units from its start as the
  /// path the text bends along, with as much road again on either side so
  /// the text has room when the zoom changes. False when the road turns too
  /// sharply under the text.
  bool _bend(
    LabelState st,
    TileLabel road,
    double from,
    double to,
    double textH,
    double unitPx,
    double? maxBend,
  ) {
    final line = road.tile.line!;
    final room = (to - from) / 2;
    final lo = from - room;
    final hi = to + room;
    final unit = road.tileSpan / tileExtent;
    final path = <double>[];
    var walked = 0.0;
    var before = 0.0;
    final n = line.length ~/ 2;
    for (var i = 1; i < n; i++) {
      final x0 = line[i * 2 - 2];
      final y0 = line[i * 2 - 1];
      final dx = line[i * 2] - x0;
      final dy = line[i * 2 + 1] - y0;
      final seg = math.sqrt(dx * dx + dy * dy);
      if (seg == 0) continue;
      if (walked + seg >= lo && walked <= hi) {
        if (path.isEmpty) {
          before = walked;
          path
            ..add(road.tileX + x0 * unit)
            ..add(road.tileY + y0 * unit);
        }
        path
          ..add(road.tileX + (x0 + dx) * unit)
          ..add(road.tileY + (y0 + dy) * unit);
      }
      walked += seg;
    }
    if (path.length < 4) return false;
    st
      ..curve = Float64List.fromList(path)
      ..curveMid = ((from + to) / 2 - before) * unit;
    final count = math.max(2, ((to - from) * unitPx / (textH * 0.7)).ceil());
    final strips = this.strips(st, count, (to - from) / count * unit);
    final limit = maxBend ?? _maxBend;
    for (var i = 1; i < count; i++) {
      var turn = (strips[i * 3 + 2] - strips[i * 3 - 1]).abs();
      if (turn > math.pi) turn = 2 * math.pi - turn;
      if (turn > limit) {
        st.curve = null;
        return false;
      }
    }
    final last = (count - 1) * 3;
    st
      ..angle = math.atan2(
        strips[last + 1] - strips[1],
        strips[last] - strips[0],
      )
      ..worldX = strips[(count ~/ 2) * 3]
      ..worldY = strips[(count ~/ 2) * 3 + 1];
    return true;
  }

  Float64List _strips = Float64List(96);
  final Float64List _at = Float64List(3);

  /// The middle and angle of each of [count] slices of a bent name, [step]
  /// apart along its road, as x, y and angle in turn.
  Float64List strips(LabelState st, int count, double step) {
    if (_strips.length < count * 3) _strips = Float64List(count * 6);
    layStrips(st.curve!, st.curveMid, count, step, _strips);
    return _strips;
  }

  /// How many slices a bent text [textW] by [textH] pixels is cut into.
  static int stripCount(double textW, double textH) =>
      math.max(2, (textW / (textH * 0.7)).ceil());

  /// Whether a bent name runs into something already placed, and with [add]
  /// the space it takes itself.
  bool curveHits(
    LabelState st,
    double textW,
    double textH,
    double reach, {
    required bool add,
  }) {
    final count = stripCount(textW, textH);
    final (onScreen, middle) = _view.onScreen(st.curve!, st.curveMid);
    final step = textW / count;
    for (var j = 0; j < count; j++) {
      pointAlong(onScreen, middle + (j + 0.5 - count / 2) * step, _at);
      final x = _at[0], y = _at[1];
      if (add) {
        _boxes.add(x - reach, y - reach, x + reach, y + reach);
      } else if (_boxes.hits(x - reach, y - reach, x + reach, y + reach)) {
        return true;
      }
    }
    return false;
  }

  /// Whether a name the same as [st]'s is placed closer than [distance]
  /// logical pixels already, or than vmap's own distance without one.
  bool nearSame(LabelState st, [double? distance]) {
    final world = _view.world;
    final text = st.candidate.text;
    final most = distance ?? _repeatDistance;
    for (final other in _placed) {
      if (other.candidate.text != text) continue;
      final dx = (other.worldX - st.worldX) * world;
      final dy = (other.worldY - st.worldY) * world;
      if (dx * dx + dy * dy < most * most) {
        return true;
      }
    }
    return false;
  }
}
