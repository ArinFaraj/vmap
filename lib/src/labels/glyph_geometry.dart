import 'dart:math' as math;
import 'dart:typed_data';

import 'label_path.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_view.dart';

/// Where the glyphs of a placed label go on the screen: along its road,
/// turned upright, or laid on the ground of a tilted map, as MapLibre's
/// getGlyphQuads places them.
class GlyphGeometry {
  GlyphGeometry(this._view);

  final LabelView _view;

  /// A name along a line's `text-offset` across the line, in ems.
  double lift(GlyphSprite sprite) => sprite.look.lineShift?.$4 ?? 0;

  /// Whether [st]'s text reads backwards along its line on the screen and
  /// is turned over to stay upright.
  bool flipped(LabelState st) =>
      st.keepUpright &&
      math.cos(_view.screenAngle(st.worldX, st.worldY, st.angle)) < 0;

  /// Calls [glyph] for each glyph of [st]'s text bent along its road on the
  /// screen, [em] pixels an em: the glyph's middle on the line at [cx],
  /// [cy], the line's direction there [c], [s], and its box's corner at
  /// [lx], [ly] from the middle along and across that direction.
  void eachBent(
    LabelState st,
    GlyphSprite sprite,
    double em,
    void Function(
      int i,
      double cx,
      double cy,
      double c,
      double s,
      double lx,
      double ly,
    )
    glyph,
  ) {
    final shaped = sprite.shaped;
    final line = onScreenOffset(st, sprite, st.curve!, em);
    final lift = this.lift(sprite);
    final flip = flipped(st);
    final half = shaped.width * em / 2;
    final top = -shaped.height * em / 2;
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      final advance = g[i + 4] * em;
      var mid = g[i + 2] * em + advance / 2 - half;
      if (flip) mid = -mid;
      final reach = math.max(advance / 2, 1.0);
      line.at(mid - reach, _along);
      final x0 = _along[0], y0 = _along[1];
      line.at(mid + reach, _along);
      final x1 = _along[0], y1 = _along[1];
      var angle = math.atan2(y1 - y0, x1 - x0);
      if (flip) angle += math.pi;
      glyph(
        i,
        (x0 + x1) / 2 + st.dx,
        (y0 + y1) / 2 + st.dy,
        math.cos(angle),
        math.sin(angle),
        -advance / 2,
        top + (g[i + 3] - lift) * em,
      );
    }
  }

  /// The size of an em of [st]'s text, [em] pixels facing the viewer, laid
  /// on the ground at its anchor, in pixels of the world at the camera's
  /// zoom, and the anchor's clip w.
  (double, double) groundSize(LabelState st, double em) {
    _view.project(st.worldX, st.worldY);
    final depth = _view.depth;
    return (
      em /
          math.max(st.perspective, 1e-6) *
          (0.5 + 0.5 * depth) *
          _view.groundScale(st.worldY),
      depth,
    );
  }

  /// Calls [glyph] for each glyph of [st]'s text laid on the ground,
  /// [unit] world units an em: its box's corner at [px], [py], along the
  /// line by [tx], [ty] and across it by [nx], [ny].
  void eachOnGround(
    LabelState st,
    GlyphSprite sprite,
    double unit,
    void Function(
      int i,
      double px,
      double py,
      double tx,
      double ty,
      double nx,
      double ny,
    )
    glyph,
  ) {
    final shaped = sprite.shaped;
    final half = shaped.width * unit / 2;
    final Float64List path;
    final double middle;
    if (st.curve case final curve?) {
      path = curve;
      middle = st.curveMid;
    } else {
      final dx = math.cos(st.angle) * half * 2;
      final dy = math.sin(st.angle) * half * 2;
      path = Float64List.fromList([
        st.worldX - dx,
        st.worldY - dy,
        st.worldX + dx,
        st.worldY + dy,
      ]);
      middle = half * 2;
    }
    final lift = this.lift(sprite);
    final line = offsetPath(path, middle, lift * unit);
    final flip = flipped(st);
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      final advance = g[i + 4] * unit;
      var along = g[i + 2] * unit + advance / 2 - half;
      if (flip) along = -along;
      line.at(along, _along);
      var angle = _along[2];
      if (flip) angle += math.pi;
      final tx = math.cos(angle), ty = math.sin(angle);
      final nx = -ty, ny = tx;
      final down = (g[i + 3] - lift - shaped.height / 2) * unit;
      glyph(
        i,
        _along[0] - tx * advance / 2 + nx * down,
        _along[1] - ty * advance / 2 + ny * down,
        tx,
        ty,
        nx,
        ny,
      );
    }
  }

  /// A square [k] world units a side at [px], [py] on the ground, its
  /// sides along [tx], [ty] and [nx], [ny], on the screen: its corner and
  /// the steps of its two sides.
  (double, double, double, double, double, double) groundQuad(
    double px,
    double py,
    double tx,
    double ty,
    double nx,
    double ny,
    double k,
  ) {
    _view.project(px, py);
    final ox = _view.x, oy = _view.y;
    _view.project(px + tx * k, py + ty * k);
    final ax = _view.x - ox, ay = _view.y - oy;
    _view.project(px + nx * k, py + ny * k);
    return (ox, oy, ax, ay, _view.x - ox, _view.y - oy);
  }

  /// The angle [st]'s text is drawn at. A straight road name on a tilted
  /// map is turned to its road every frame: its angle on the screen moves
  /// with the camera, and the one placement found goes stale between
  /// placements, so the name would lag and jump while the map turns.
  double turnOf(LabelState st) {
    final c = st.candidate;
    if (st.curve != null || c.road == null) {
      return st.screenAngle;
    }
    return _view.uprightAngle(
      st.worldX,
      st.worldY,
      st.angle,
      keep: st.keepUpright,
    );
  }

  final Float64List _along = Float64List(3);

  /// [path] on the screen, moved across by [st]'s `text-offset`, and where
  /// its middle lands along it.
  OffsetLine onScreenOffset(
    LabelState st,
    GlyphSprite sprite,
    Float64List path,
    double em,
  ) {
    final (onScreen, middle) = _view.onScreen(path, st.curveMid);
    return offsetPath(onScreen, middle, lift(sprite) * em);
  }
}
