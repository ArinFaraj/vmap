import 'dart:math' as math;
import 'dart:typed_data';

import 'collision_boxes.dart';
import '../text/glyphs/glyph_pbf.dart' show GlyphPbf;
import 'label_path.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_style.dart';
import 'label_view.dart';
import 'point_labels.dart';
import 'road_labels.dart';
import '../style/style_model.dart';
import '../tiles/built_tile.dart';

/// Weighs a name along its road against what is placed: a box or a bent
/// strip, or MapLibre's row of collision circles.
class RoadPlacement {
  RoadPlacement(
    this._view,
    this._boxes,
    this._roads,
    this._points,
    this._style,
  );

  final LabelView _view;
  final CollisionBoxes _boxes;
  final RoadLabels _roads;
  final PointLabels _points;
  final LabelStyle _style;

  /// With the debug view on, the collision circles of names along lines as
  /// the last placement laid them: x, y, radius and 1 when the name ran
  /// into something.
  List<double>? debugCircles;

  /// Extra clear space kept around street names, so a grid of short streets
  /// names a few of them instead of all of them.
  static const double _minorRoom = 34;
  static const double _majorRoom = 14;

  /// Places a name along its road, when the road can carry it and it runs
  /// into nothing placed before it; true when it shows.
  bool place(
    LabelState st,
    TileLabel road,
    SymbolLayer? layer,
    LabelSprite? sprite,
    LabelSize size,
    double styleZoom,
    int fitKey,
  ) {
    final (:fontSize, width: textW, height: textH, :textPad, iconPad: _) = size;
    // A fit worked out on the text's estimated width is worked out again
    // once its glyphs are laid out.
    // The offset and anchor's move along the road, turned round with a name
    // kept upright that reads against the road.
    final flips = (layer?.keepUpright ?? true) && _roads.flipsAt(road);
    var shift = 0.0;
    if (_style.lineShift(road) case (final alignX, _, final offsetX, _)) {
      shift = alignX * textW + offsetX * fontSize;
      if (flips) shift = -shift;
    }
    var key = sprite == null ? -1 - fitKey : fitKey;
    if (shift < 0) key = ~key;
    if (st.roadFitKey != key) {
      st
        ..roadFitKey = key
        ..roadFits = _roads.fit(
          st,
          road,
          textW,
          textH,
          road.tileSpan * _view.world / tileExtent,
          maxBend: layer?.maxBend,
          mapLibre: _style.rules.roadsAsMapLibre,
          shift: shift,
        );
    }
    if (!st.roadFits) return false;
    final mapLibre = _style.rules.roadsAsMapLibre && layer != null;
    if (_roads.nearSame(st, mapLibre ? 1 : null, mapLibre)) {
      return false;
    }
    final overlaps = mapLibre && layer.textOverlaps;
    final ignored = mapLibre && layer.textIgnored;
    final room = mapLibre
        ? 0.0
        : fontSize <= 12.5
        ? _minorRoom
        : _majorRoom;
    final (translateX, translateY) = layer == null
        ? (0.0, 0.0)
        : _view.moved(
            layer.textTranslate,
            layer.textTranslateOnScreen,
            _style.context..zoom = styleZoom,
          );
    var (roadX, roadY) = (translateX, translateY);
    _view.project(st.worldX, st.worldY);
    final sx = _view.x + roadX;
    final sy = _view.y + roadY;
    st
      ..keepUpright = layer?.keepUpright ?? true
      ..onGround = layer?.textOnGround ?? false
      ..glyphsUpright = layer?.glyphsUpright ?? false;
    final turn = _view.uprightAngle(
      st.worldX,
      st.worldY,
      st.angle,
      keep: st.keepUpright,
    );
    st.screenAngle = turn;
    final lift = (_style.lineShift(st.candidate)?.$4 ?? 0) * fontSize;
    if (st.curve != null) {
      st.roadLift = lift;
    } else {
      st.roadLift = 0;
      // Text shaped from glyphs carries its text-offset; an image of it is
      // moved by it across the text, as MapLibre shapes the offset in.
      if (sprite is! GlyphSprite) {
        roadX -= math.sin(turn) * lift;
        roadY += math.cos(turn) * lift;
      }
    }
    if (mapLibre) {
      if (!_circles(
        st,
        sprite,
        size,
        styleZoom,
        sx: sx,
        sy: sy,
        turn: turn,
        lift: lift,
        check: !overlaps,
        add: !ignored,
      )) {
        return false;
      }
    } else if (st.curve != null) {
      final reach = (textH + room) / 2 + textPad;
      if (_roads.curveHits(
        st,
        textW,
        textH,
        reach,
        check: !overlaps,
        add: !ignored,
        lift: lift,
      )) {
        return false;
      }
    } else {
      final bx = sx + roadX - translateX, by = sy + roadY - translateY;
      if (_boxes.offGridAround(bx, by, textW + room, textH + room)) {
        return false;
      }
      if (!overlaps &&
          _boxes.collides(
            bx,
            by,
            textW + room,
            textH + room,
            turn,
            pad: textPad,
          )) {
        return false;
      }
      if (!ignored) {
        _boxes.take(bx, by, textW + room, textH + room, turn, pad: textPad);
      }
    }
    st
      ..dx = roadX
      ..dy = roadY
      ..moveX = translateX
      ..moveY = translateY;
    if (mapLibre) {
      st.showIcon =
          _points.sizeLineIcon(
            st,
            layer,
            textW,
            textH,
            _style.context..zoom = styleZoom,
          ) !=
          null;
    }
    _roads.placed(st);
    return true;
  }

  /// Whether a name along a line clears what is placed, weighed as
  /// MapLibre's `placeCollisionCircles` weighs it, and with [add] takes the
  /// room: a row of circles as tall as its text at its layout size, from
  /// its first glyph's middle to its last's, along its road on the screen
  /// moved [lift] across, spaced at most two and a half radii apart.
  /// [sx], [sy] is the text's middle on the screen, [turn] its angle there.
  bool _circles(
    LabelState st,
    LabelSprite? sprite,
    LabelSize size,
    double styleZoom, {
    required double sx,
    required double sy,
    required double turn,
    required double lift,
    required bool check,
    required bool add,
  }) {
    final (:fontSize, width: textW, :textPad, height: _, iconPad: _) = size;
    final layoutSize = _style.size(st.candidate, styleZoom.floorToDouble() + 1);
    final glyphH = sprite == null
        ? 28.8
        : sprite.textHeight / sprite.fontSize * GlyphPbf.em;
    final radius =
        math.max(10, glyphH) * layoutSize / GlyphPbf.em / 2 * st.perspective +
        textPad;
    // The first and last glyphs' middles, from the text's middle.
    var first = -textW / 2 + fontSize * 0.3, last = -first;
    if (sprite is GlyphSprite) {
      final g = sprite.shaped.glyphs;
      final em = sprite.shaped.width > 0 ? textW / sprite.shaped.width : 0.0;
      int? a, b;
      for (var i = 0; i < g.length; i += 5) {
        a ??= i;
        b = i;
      }
      if (a != null && b != null) {
        first = (g[a + 2] + g[a + 4] / 2) * em - textW / 2;
        last = (g[b + 2] + g[b + 4] / 2) * em - textW / 2;
      }
    }
    // The path from the first glyph's middle to the last's on the screen:
    // laid on the ground and projected for text pitched with the map, as
    // MapLibre lays it in its label plane, else along the road on screen.
    final path = <double>[];
    const samples = 8;
    if (st.onGround) {
      _view.project(st.worldX, st.worldY);
      final k =
          (0.5 + 0.5 * _view.depth) /
          math.max(st.perspective, 1e-6) /
          _view.world *
          _view.groundScale(st.worldY);
      final shiftX = sx - _view.x, shiftY = sy - _view.y;
      OffsetLine? ground;
      if (st.curve case final curve?) {
        ground = offsetPath(curve, st.curveMid, lift * k);
      }
      final c = math.cos(st.angle), sn = math.sin(st.angle);
      final at = Float64List(3);
      for (var q = 0; q <= samples; q++) {
        final along = (first + (last - first) * q / samples) * k;
        double wx, wy;
        if (ground != null) {
          ground.at(along, at);
          wx = at[0];
          wy = at[1];
        } else {
          wx = st.worldX + c * along - sn * lift * k;
          wy = st.worldY + sn * along + c * lift * k;
        }
        _view.project(wx, wy);
        path
          ..add(_view.x + shiftX)
          ..add(_view.y + shiftY);
      }
    } else {
      OffsetLine? line;
      if (st.curve case final curve?) {
        final (screen, middle) = _view.onScreen(curve, st.curveMid);
        line = offsetPath(screen, middle, lift);
      }
      _view.project(st.worldX, st.worldY);
      final shiftX = sx - _view.x, shiftY = sy - _view.y;
      final cos = math.cos(turn), sin = math.sin(turn);
      final at = Float64List(3);
      for (var q = 0; q <= samples; q++) {
        final along = first + (last - first) * q / samples;
        if (line != null) {
          line.at(along, at);
          path
            ..add(at[0] + shiftX)
            ..add(at[1] + shiftY);
        } else {
          path
            ..add(sx + cos * along - sin * lift)
            ..add(sy + sin * along + cos * lift);
        }
      }
    }
    // As MapLibre, only the stretches of the path inside the collision grid
    // carry circles; a path wholly outside it places nothing.
    final pad = radius * 0.25;
    final centres = <double>[];
    var hit = false;
    for (final piece in _boxes.clipToGrid(path)) {
      var length = 0.0;
      for (var q = 2; q < piece.length; q += 2) {
        final dx = piece[q] - piece[q - 2], dy = piece[q + 1] - piece[q - 1];
        length += math.sqrt(dx * dx + dy * dy);
      }
      final count = length <= 0.5 * radius
          ? 1
          : ((length - 2 * pad) / (radius * 2.5)).ceil() + 1;
      final at = Float64List(3);
      for (var k = 0; k < count; k++) {
        final t = k / math.max(count - 1, 1);
        pointAlong(piece, pad + t * (length - 2 * pad), at);
        final x = at[0], y = at[1];
        if (check && !hit && _boxes.hitsCircle(x, y, radius)) {
          // As MapLibre, the debug view still shows every circle of a name
          // that runs into something, in red.
          if (debugCircles == null) return false;
          hit = true;
        }
        centres
          ..add(x)
          ..add(y);
      }
    }
    if (debugCircles case final debug?) {
      for (var k = 0; k < centres.length; k += 2) {
        debug.addAll([centres[k], centres[k + 1], radius, hit ? 1 : 0]);
      }
    }
    if (hit || centres.isEmpty) return false;
    if (add) {
      for (var k = 0; k < centres.length; k += 2) {
        _boxes.addCircle(centres[k], centres[k + 1], radius);
      }
    }
    return true;
  }
}
