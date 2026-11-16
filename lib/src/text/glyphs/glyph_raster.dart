import 'dart:math' as math;
import 'dart:typed_data';

import '../font/font.dart';
import 'glyph_ink.dart';
import 'glyph_layout.dart';
import 'glyph_pbf.dart';

/// The look a page is drawn in: glyphs this many device pixels to the em,
/// this weight and slant, with a halo this many device pixels wide and
/// soft, the last two in quarter pixels. Sizes come in quarters of an
/// octave and a glyph is rasterized at the step at or above the size it is
/// drawn at, so it is only ever shrunk, by at most 16%, which keeps it
/// sharp.
///
/// A page of glyph range text is made at an exact size instead, in
/// [sixteenths] of a device pixel to the em, and for one eighth pixel
/// [phase] its glyphs' origins fall on: x in the low three bits, y in the
/// next three. Font pages leave both 0.
typedef PageKey = ({
  int size,
  int weight,
  bool italic,
  int halo,
  int blur,
  int sixteenths,
  int phase,
});

/// Device pixels to the em of a font page of [size].
double emOf(int size) => math.pow(2, size / 4).toDouble();

/// The key [step] sizes from [key], in its own kind of size: quarter
/// octaves for a font page, sixteenths of a pixel for a range page.
PageKey nearbyKey(PageKey key, int step) => key.sixteenths > 0
    ? (
        size: key.size,
        weight: key.weight,
        italic: key.italic,
        halo: key.halo,
        blur: key.blur,
        sixteenths: key.sixteenths + step,
        phase: key.phase,
      )
    : (
        size: key.size + step,
        weight: key.weight,
        italic: key.italic,
        halo: key.halo,
        blur: key.blur,
        sixteenths: 0,
        phase: 0,
      );

/// Device pixels to the em of the page [key].
double pageEm(PageKey key) =>
    key.sixteenths > 0 ? key.sixteenths / 16 : emOf(key.size);

/// One drawn batch: a premultiplied white RGBA image [width] wide, and per
/// glyph [stride] numbers: its id, the ink cell's x, y, width and height, the
/// halo cell's x (negative without a halo; same y and size), and the cell's
/// left and top from the glyph origin. Ids with no outline are left out.
class GlyphRaster {
  GlyphRaster(this.width, this.height, this.pixels, this.cells);

  final int width, height;
  final Uint8List pixels;
  final Float64List cells;

  static const stride = 8;
}

class _Bitmap {
  _Bitmap(this.w, this.h, this.ink, this.halo, this.left, this.top);

  final int w, h;
  final Uint8List ink;
  final Uint8List? halo;
  final double left, top;
}

/// Draws glyph outlines into coverage bitmaps on the CPU, with halos from a
/// distance transform, and packs them into pages. Bitmaps are kept per page,
/// so packing a page again from glyphs drawn before costs only copies.
class GlyphRasterizer {
  GlyphRasterizer(this.fonts);

  final GlyphFonts fonts;

  /// The glyphs of the style's glyph ranges by face, faces from
  /// [GlyphPbf.firstFace] up.
  final Map<int, Map<int, PbfGlyph>> ranges = {};
  final Map<int, GlyphOutline?> _outlines = {};
  final Map<PageKey, Map<int, _Bitmap?>> _bitmaps = {};

  void forget(PageKey key) => _bitmaps.remove(key);

  GlyphRaster draw(PageKey key, List<int> ids) {
    final kept = _bitmaps.putIfAbsent(key, () => {});
    final drawn = <(int, _Bitmap)>[];
    const width = 1024;
    final twin = key.halo > 0;
    for (final id in ids) {
      final b = kept.containsKey(id) ? kept[id] : kept[id] = _tryGlyph(key, id);
      if (b != null && (twin ? b.w * 2 + 1 : b.w) <= width) drawn.add((id, b));
    }
    var x = 0, y = 0, row = 0;
    final places = <(int, int)>[];
    for (final (_, b) in drawn) {
      final need = twin ? b.w * 2 + 1 : b.w;
      if (x + need > width) {
        x = 0;
        y += row + 1;
        row = 0;
      }
      places.add((x, y));
      x += need + 1;
      row = math.max(row, b.h);
    }
    final height = math.max(1, y + row + 1);
    final pixels = Uint8List(width * height * 4);
    final cells = Float64List(drawn.length * GlyphRaster.stride);
    for (final (i, (id, b)) in drawn.indexed) {
      final (px, py) = places[i];
      _blit(pixels, width, px, py, b, b.ink);
      final halo = b.halo;
      if (halo != null) _blit(pixels, width, px + b.w + 1, py, b, halo);
      cells.setAll(i * GlyphRaster.stride, [
        id.toDouble(),
        px.toDouble(),
        py.toDouble(),
        b.w.toDouble(),
        b.h.toDouble(),
        halo == null ? -1 : (px + b.w + 1).toDouble(),
        b.left,
        b.top,
      ]);
    }
    return GlyphRaster(width, height, pixels, cells);
  }

  static void _blit(
    Uint8List out,
    int width,
    int x,
    int y,
    _Bitmap b,
    Uint8List alpha,
  ) {
    for (var r = 0; r < b.h; r++) {
      var o = ((y + r) * width + x) * 4;
      var i = r * b.w;
      for (var c = 0; c < b.w; c++, i++, o += 4) {
        final a = alpha[i];
        out[o] = a;
        out[o + 1] = a;
        out[o + 2] = a;
        out[o + 3] = a;
      }
    }
  }

  /// A glyph of a style's glyph range drawn from its distance field with
  /// the edge and halo of MapLibre's `symbol_sdf.fragment.glsl` for text
  /// facing the screen, so it comes out as MapLibre draws it. The cell is
  /// drawn for the page's phase and placed so its corner lands on a whole
  /// device pixel, so it is sampled once, as MapLibre samples it.
  _Bitmap? _rangeGlyph(PageKey key, int face, int codePoint) {
    final px = (key.phase & 7) / 8, py = (key.phase >> 3) / 8;
    final g = ranges[face]?[codePoint];
    if (g == null || g.width == 0) return null;
    const border = GlyphPbf.border;
    final sw = g.width + 2 * border, sh = g.height + 2 * border;
    if (g.bitmap.length < sw * sh) return null;
    final s = pageEm(key) / GlyphPbf.em;
    final left = (g.left - border) * s, top = (-g.top - border) * s;
    final cellLeft = (px + left).floorToDouble() - px;
    final cellTop = (py + top).floorToDouble() - py;
    final w = (sw * s).ceil() + 2, h = (sh * s).ceil() + 2;
    final gamma = 0.105 / s;
    final haloGamma = (key.blur / 4 * 1.19 / 8 + 0.105) / s;
    final haloEdge = (6 - key.halo / 4 / s) / 8;
    final ink = Uint8List(w * h);
    final halo = key.halo > 0 ? Uint8List(w * h) : null;
    double step(double lo, double hi, double x) {
      final t = ((x - lo) / (hi - lo)).clamp(0.0, 1.0);
      return t * t * (3 - 2 * t);
    }

    double at(int x, int y) =>
        x < 0 || y < 0 || x >= sw || y >= sh ? 0 : g.bitmap[y * sw + x] / 255;
    for (var y = 0; y < h; y++) {
      final v = (cellTop + y + 0.5 - top) / s - 0.5;
      final y0 = v.floor();
      final fy = v - y0;
      for (var x = 0; x < w; x++) {
        final u = (cellLeft + x + 0.5 - left) / s - 0.5;
        final x0 = u.floor();
        final fx = u - x0;
        final d =
            (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) +
            (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
        ink[y * w + x] = (step(0.75 - gamma, 0.75 + gamma, d) * 255).round();
        if (halo != null) {
          final inner = step(0.75, 0.75 + 2 * haloGamma, d);
          final outer = step(haloEdge - haloGamma, haloEdge + haloGamma, d);
          halo[y * w + x] = (math.min(outer, 1 - inner) * 255).round();
        }
      }
    }
    return _Bitmap(w, h, ink, halo, cellLeft, cellTop);
  }

  GlyphOutline? _outline(int face, int weight, int glyph) {
    final key =
        (face * 10 + GlyphFonts.snapWeight(weight) ~/ 100) << 20 | glyph;
    if (_outlines.containsKey(key)) return _outlines[key];
    final o = fonts.font(face, weight).outline(glyph);
    return _outlines[key] = o == null || o.isEmpty ? null : o;
  }

  /// A glyph whose outline cannot be read or drawn is left out, not the
  /// whole batch.
  _Bitmap? _tryGlyph(PageKey key, int id) {
    try {
      return _glyph(key, id);
    } catch (_) {
      return null;
    }
  }

  _Bitmap? _glyph(PageKey key, int id) {
    final face = id >> 20, glyph = id & 0xFFFFF;
    if (face >= GlyphPbf.firstFace) return _rangeGlyph(key, face, glyph);
    final outline = _outline(face, key.weight, glyph);
    if (outline == null) return null;
    final s = emOf(key.size) / fonts.unitsPerEm(face);
    final slant = key.italic ? 0.2 * s : 0.0;
    final lines = flattenOutline(outline, s, slant);
    if (lines.isEmpty) return null;
    final (minX, minY, maxX, maxY) = boundsOf(lines);
    final halo = key.halo / 4, blur = key.blur / 4;
    final pad = (halo + blur * 2 + 2).ceilToDouble();
    final w = (maxX - minX + pad * 2).ceil();
    final h = (maxY - minY + pad * 2).ceil();
    final dx = pad - minX, dy = pad - minY;
    final coverage = coverageOf(lines, w, h, dx, dy);
    final ink = Uint8List(w * h);
    for (var i = 0; i < ink.length; i++) {
      ink[i] = (coverage[i] * 255 + 0.5).toInt();
    }
    return _Bitmap(
      w,
      h,
      ink,
      key.halo > 0 ? haloOf(coverage, w, h, halo, blur) : null,
      minX - pad,
      minY - pad,
    );
  }

  /// Distance fields of [glyphs] of [face] at [weight], one each as
  /// [fieldOf] makes them. A glyph with no outline, or one that cannot be
  /// read, has no ink.
  List<PbfGlyph> fields(int face, int weight, bool italic, List<int> glyphs) =>
      [for (final glyph in glyphs) _field(face, weight, italic, glyph)];

  PbfGlyph _field(int face, int weight, bool italic, int glyph) {
    try {
      final outline = _outline(face, weight, glyph);
      final field = outline == null
          ? null
          : fieldOf(glyph, outline, fonts.unitsPerEm(face), italic: italic);
      return field ?? PbfGlyph.blank(glyph);
    } catch (_) {
      return PbfGlyph.blank(glyph);
    }
  }
}
