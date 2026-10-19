import 'dart:typed_data';
import 'dart:ui' as ui;

import 'glyphs/glyph_pbf.dart';

/// Text from a style's glyph ranges drawn as MapLibre draws it: each glyph
/// a quad sampling its signed distance field, its edge and halo cut by
/// MapLibre's `symbol_sdf` shader. A renderer that can draws it; labels
/// queue their glyphs during a frame and the renderer lays the result on
/// the canvas at [end].
abstract class SdfText {
  /// Starts a frame [size] logical pixels at [devicePixelRatio], its glyphs
  /// looked up by [glyph].
  void begin(
    ui.Size size,
    double devicePixelRatio,
    PbfGlyph? Function(int face, int codePoint) glyph,
  );

  /// Queues glyph [codePoint] of [face] with its pen origin on the shaped
  /// line, MapLibre's positioned glyph, at [ox], [oy] logical pixels; one
  /// glyph pixel along the line is [ax], [ay] and one down it [bx], [by].
  /// [look] is how it is drawn, [layer] the style layer it belongs to.
  void glyph(
    int face,
    int codePoint,
    double ox,
    double oy,
    double ax,
    double ay,
    double bx,
    double by,
    SdfLook look,
    int layer,
  );

  /// Queues an icon from the style's sprite sheet: the sheet's texels in
  /// [source] drawn on the quad from [ox], [oy], one texel across it [ax],
  /// [ay] and one down it [bx], [by], in logical pixels. Past [clip], the
  /// icon's own place in the sheet, it is clear, as MapLibre pads its
  /// icons. A distance field icon takes [look]'s colours; any other is
  /// drawn faded by [look]'s ink alpha. [linear] samples between texels.
  /// False when the sheet is not on the GPU yet, and the caller draws it.
  bool icon(
    ui.Rect source,
    ui.Rect clip,
    double ox,
    double oy,
    double ax,
    double ay,
    double bx,
    double by, {
    required bool sdf,
    required bool linear,
    required SdfLook look,
    required int layer,
  });

  /// Lays what was queued since [begin] on [canvas]: each layer's icons,
  /// then its text, as MapLibre draws a symbol layer. True while a glyph
  /// is still on its way to the GPU.
  bool end(ui.Canvas canvas);
}

/// How a run of glyphs is drawn: colours premultiplied and faded, halo
/// width and blur in logical pixels, [fontScale] logical pixels a glyph
/// pixel, and [gammaScale] how much farther than the screen's middle it
/// lies, which softens its edge.
class SdfLook {
  SdfLook(
    this.ink,
    this.halo,
    this.haloWidth,
    this.haloBlur,
    this.fontScale, {
    this.gammaScale = 1,
    this.overlap = false,
  });

  /// Red, green, blue and alpha, premultiplied.
  final Float32List ink;

  /// As [ink], null for none.
  final Float32List? halo;
  final double haloWidth, haloBlur, fontScale, gammaScale;

  /// Drawn in two passes, every halo then every glyph, as MapLibre draws a
  /// wide halo or letters that overlap.
  final bool overlap;

  /// [argb] premultiplied and faded by [opacity].
  static Float32List rgba(int argb, double opacity) {
    final a = (argb >> 24 & 255) / 255 * opacity;
    return Float32List.fromList([
      (argb >> 16 & 255) / 255 * a,
      (argb >> 8 & 255) / 255 * a,
      (argb & 255) / 255 * a,
      a,
    ]);
  }
}
