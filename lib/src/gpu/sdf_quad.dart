import 'dart:typed_data';
import 'dart:ui' as ui;

import '../labels/sdf_text.dart';

/// One glyph or icon as sdf.vert reads it, an instance of [floats] floats
/// in eight attributes of four. A quad placed on the screen and a glyph
/// kept on the ground share the texels and the look; the shader tells them
/// apart by the size in [anchor].
abstract final class SdfQuad {
  static const floats = 32;
  static const bytes = floats * 4;

  /// Where each attribute starts in an instance.
  static const placement = 0,
      axes = 4,
      extent = 8,
      ink = 12,
      halo = 16,
      params = 20,
      clip = 24,
      anchor = 28;

  /// A quad from [ox], [oy] on the screen spanning [tw] texels by [ax],
  /// [ay] and [th] texels by [bx], [by], sampling from texel [tx], [ty].
  /// [kind] is 0 for a glyph, 1 for a distance field icon and 2 for any
  /// other; past [within] an icon is clear.
  static void onScreen(
    Float32List out,
    int o,
    double ox,
    double oy,
    double ax,
    double ay,
    double bx,
    double by,
    double tx,
    double ty,
    double tw,
    double th,
    SdfLook look, {
    int kind = 0,
    bool linear = true,
    ui.Rect within = ui.Rect.zero,
  }) {
    _texelsAndLook(out, o, tx, ty, tw, th, look, kind, linear);
    out
      ..[o + placement] = ox
      ..[o + placement + 1] = oy
      ..[o + axes] = tw * ax
      ..[o + axes + 1] = tw * ay
      ..[o + axes + 2] = th * bx
      ..[o + axes + 3] = th * by
      ..[o + clip] = within.left
      ..[o + clip + 1] = within.top
      ..[o + clip + 2] = within.right
      ..[o + clip + 3] = within.bottom
      ..[o + anchor] = 0
      ..[o + anchor + 1] = 0
      ..[o + anchor + 2] = 0
      ..[o + anchor + 3] = 1;
  }

  /// A glyph laid on the ground: its pen origin [x], [y] from its label's
  /// anchor in fractions of the world, the line running along [dirX],
  /// [dirY] there, a glyph pixel [pixel] of the world wide, and its quad's
  /// corner [left], [top] glyph pixels from the pen origin. [atAnchor]
  /// places it in a frame.
  static void onGround(
    Float32List out,
    int o,
    double x,
    double y,
    double dirX,
    double dirY,
    double pixel,
    double left,
    double top,
    double tx,
    double ty,
    double tw,
    double th,
    SdfLook look,
  ) {
    _texelsAndLook(out, o, tx, ty, tw, th, look, 0, true);
    out
      ..[o + placement] = x
      ..[o + placement + 1] = y
      ..[o + axes] = dirX
      ..[o + axes + 1] = dirY
      ..[o + axes + 2] = pixel
      ..[o + axes + 3] = 0
      ..[o + clip] = left
      ..[o + clip + 1] = top
      ..[o + clip + 2] = 0
      ..[o + clip + 3] = 0;
  }

  /// Places a glyph written by [onGround] for a frame: its label anchored
  /// [x], [y] from the camera's centre in fractions of the world, laid out
  /// at [size] times its size at the centre now, faded to [opacity].
  static void atAnchor(
    Float32List out,
    int o,
    double x,
    double y,
    double size,
    double opacity,
  ) {
    out
      ..[o + anchor] = x
      ..[o + anchor + 1] = y
      ..[o + anchor + 2] = size
      ..[o + anchor + 3] = opacity;
  }

  static void _texelsAndLook(
    Float32List out,
    int o,
    double tx,
    double ty,
    double tw,
    double th,
    SdfLook look,
    int kind,
    bool linear,
  ) {
    final inkOf = look.ink, haloOf = look.halo;
    out
      ..[o + placement + 2] = tx
      ..[o + placement + 3] = ty
      ..[o + extent] = tw
      ..[o + extent + 1] = th
      ..[o + extent + 2] = kind.toDouble()
      ..[o + extent + 3] = linear ? 1 : 0
      ..[o + ink] = inkOf[0]
      ..[o + ink + 1] = inkOf[1]
      ..[o + ink + 2] = inkOf[2]
      ..[o + ink + 3] = inkOf[3]
      ..[o + halo] = haloOf?[0] ?? 0
      ..[o + halo + 1] = haloOf?[1] ?? 0
      ..[o + halo + 2] = haloOf?[2] ?? 0
      ..[o + halo + 3] = haloOf?[3] ?? 0
      ..[o + params] = look.haloWidth
      ..[o + params + 1] = look.haloBlur
      ..[o + params + 2] = look.fontScale
      ..[o + params + 3] = look.gammaScale;
  }
}
