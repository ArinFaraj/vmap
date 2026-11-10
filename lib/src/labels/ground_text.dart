import 'dart:math' as math;

import '../text/glyphs/glyph_pbf.dart' show GlyphPbf;
import 'glyph_geometry.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'sdf_text.dart';

/// Draws text laid on the flat map's ground from glyphs laid out once and
/// kept, which the renderer projects and sizes in each frame.
class GroundTextPainter {
  GroundTextPainter(this._view, this._geometry);

  final LabelView _view;
  final GlyphGeometry _geometry;

  /// How far a name on a bend may grow or shrink from the size its glyphs
  /// were spaced at before it is laid out again: scaled about its anchor
  /// in between, its ends leave the road by under half a pixel.
  static const _bendDrift = 0.02;

  /// Queues [st]'s text, [em] logical pixels an em. False when it is to be
  /// queued glyph by glyph instead: off the flat ground, moved on the
  /// screen, holding an image, or waiting for a glyph.
  bool draw(
    SdfText sdf,
    LabelState st,
    RangeSprite sprite,
    double em,
    int layer, {
    required bool overlap,
  }) {
    if (!_view.onFlatGround || st.dx != 0 || st.dy != 0) return false;
    _view.project(st.worldX, st.worldY);
    // As MapLibre sizes text pitched with the map: by half its anchor's
    // depth and a half.
    final atCentre = em / math.max(st.perspective, 1e-6) / _view.world;
    final unit = atCentre * (0.5 + 0.5 * _view.depth);
    final flip = _geometry.flipped(st);
    var kept = st.ground;
    if (kept == null ||
        !kept.fits(st, sprite, flip) ||
        (st.curve != null && (unit / kept.unit - 1).abs() > _bendDrift)) {
      kept = st.ground = _layOut(sdf, st, sprite, unit, flip);
      if (kept == null) return false;
    }
    final view = _view.tilted;
    kept.text.draw(
      st.worldX - view.centerX,
      st.worldY - view.centerY,
      kept.unit / atCentre,
      st.opacity,
      layer,
      overlap: overlap,
    );
    return true;
  }

  /// [st]'s glyphs on the ground, [unit] of the world an em, from its
  /// anchor; null when one is an image or has not arrived.
  GroundText? _layOut(
    SdfText sdf,
    LabelState st,
    RangeSprite sprite,
    double unit,
    bool flip,
  ) {
    final look = sprite.look;
    final shaped = sprite.shaped;
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      if (g[i] < 0) return null;
    }
    final scales = shaped.scales, colors = shaped.colors;
    final halo = SdfLook.haloOf(look.halo, look.haloWidth, 1);
    final fontScale = unit * _view.world / GlyphPbf.em;
    SdfLook lookOf(int argb) => SdfLook(
      SdfLook.rgba(argb, 1),
      halo,
      look.haloWidth,
      look.haloBlur,
      fontScale,
    );
    final plain = lookOf(look.color);
    final text = sdf.keep(g.length ~/ 5);
    var whole = true;
    _geometry.eachOnGround(st, sprite, unit, (i, px, py, tx, ty, nx, ny) {
      final own = colors?[i ~/ 5] ?? 0;
      whole &= text.add(
        g[i].toInt(),
        g[i + 1].toInt(),
        px - st.worldX,
        py - st.worldY,
        tx,
        ty,
        unit * (scales?[i ~/ 5] ?? 1.0) / GlyphPbf.em,
        own == 0 ? plain : lookOf(own),
      );
    });
    return whole ? GroundText(text, unit, sprite, st, flip) : null;
  }
}
