import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

// payv exports the command type but not its cases.
// ignore: implementation_imports
import 'package:payv/src/font/glyph_path.dart';

import 'glyph_layout.dart';

/// Where one glyph sits in a page, in the page image's pixels, and where
/// its cell starts relative to the glyph's origin on the baseline.
class GlyphCell {
  const GlyphCell(this.image, this.ink, this.halo, this.left, this.top);

  final ui.Image image;
  final ui.Rect ink;

  /// Null on a page drawn without a halo.
  final ui.Rect? halo;
  final double left, top;
}

/// The look a page is drawn in: glyphs this many device pixels to the em,
/// this weight and slant, with a halo this many device pixels wide and
/// soft. Sizes come in quarters of an octave and a glyph is rasterized at
/// the step at or above the size it is drawn at, so it is only ever shrunk,
/// by at most 16%, which keeps it sharp.
typedef PageKey = ({int size, int weight, bool italic, int halo, int blur});

/// One look's glyphs, rasterized by Flutter from the fonts' own outlines.
/// Glyphs asked for and missing are drawn into a new chunk when [flush]
/// runs, and chunks merge once there are many.
class GlyphPage {
  GlyphPage(this.key, this._fonts, this._paths)
    : em = math.pow(2, key.size / 4).toDouble();

  final PageKey key;
  final GlyphFonts _fonts;
  final OutlineCache _paths;

  /// Device pixels per em.
  final double em;
  final Map<int, GlyphCell?> _cells = {};
  final List<int> _pending = [];
  final List<ui.Image> _chunks = [];
  int usedFrame = 0;

  static int _id(int face, int glyph) => face << 20 | glyph;

  /// The cell of [glyph] in [face], or null while it waits for [flush].
  GlyphCell? cell(int face, int glyph) {
    final id = _id(face, glyph);
    final found = _cells[id];
    if (found != null) return found;
    if (!_cells.containsKey(id)) {
      _cells[id] = null;
      _pending.add(id);
    }
    return null;
  }

  bool get hasPending => _pending.isNotEmpty;

  /// The cell of [glyph] if it is drawn already, without asking for it.
  GlyphCell? peek(int face, int glyph) => _cells[_id(face, glyph)];

  /// Draws up to [most] of the glyphs asked for since the last flush into a
  /// new image, and returns how many it drew.
  int flush([int most = 1 << 30]) {
    if (_pending.isEmpty) return 0;
    final take = math.min(most, _pending.length);
    final ids = _pending.sublist(0, take);
    _pending.removeRange(0, take);
    if (_chunks.length >= 6) {
      for (final c in _chunks) {
        c.dispose();
      }
      _chunks.clear();
      ids.addAll(_cells.keys.where((id) => !ids.contains(id)));
    }
    _draw(ids);
    return take;
  }

  void _draw(List<int> ids) {
    final halo = key.halo / 4;
    final blur = key.blur / 4;
    final pad = (halo + blur * 2 + 2).ceilToDouble();
    final slant = key.italic ? 0.2 : 0.0;
    final shapes = <(int, ui.Path, ui.Rect)>[];
    for (final id in ids) {
      final face = id >> 20, glyph = id & 0xFFFFF;
      final path = _paths.path(_fonts, face, key.weight, glyph);
      if (path == null) continue;
      final scale = em / _fonts.unitsPerEm(face);
      final sized = path.transform(
        Float64List.fromList([
          scale, 0, 0, 0, //
          -slant * scale, scale, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ]),
      );
      shapes.add((id, sized, sized.getBounds()));
    }
    if (shapes.isEmpty) {
      for (final id in ids) {
        _cells.remove(id);
      }
      return;
    }
    const width = 1024.0;
    var x = 0.0, y = 0.0, row = 0.0;
    final places = <(double, double)>[];
    final twin = key.halo > 0;
    for (final (_, _, b) in shapes) {
      final w = (b.width + pad * 2).ceilToDouble();
      final h = (b.height + pad * 2).ceilToDouble();
      final need = twin ? w * 2 + 1 : w;
      if (x + need > width) {
        x = 0;
        y += row + 1;
        row = 0;
      }
      places.add((x, y));
      x += need + 1;
      row = math.max(row, h);
    }
    final height = y + row + 1;
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    final fill = ui.Paint()..color = const ui.Color(0xFFFFFFFF);
    final ring = ui.Paint()
      ..color = const ui.Color(0xFFFFFFFF)
      ..style = ui.PaintingStyle.stroke
      ..strokeWidth = halo * 2
      ..strokeJoin = ui.StrokeJoin.round
      ..maskFilter = blur > 0
          ? ui.MaskFilter.blur(ui.BlurStyle.normal, blur)
          : null;
    final ringFill = ui.Paint()
      ..color = const ui.Color(0xFFFFFFFF)
      ..maskFilter = ring.maskFilter;
    for (final (i, (_, path, b)) in shapes.indexed) {
      final (px, py) = places[i];
      final w = (b.width + pad * 2).ceilToDouble();
      canvas
        ..save()
        ..translate(px + pad - b.left, py + pad - b.top)
        ..drawPath(path, fill)
        ..restore();
      if (twin) {
        canvas
          ..save()
          ..translate(px + w + 1 + pad - b.left, py + pad - b.top)
          ..drawPath(path, ring)
          ..drawPath(path, ringFill)
          ..restore();
      }
    }
    final picture = recorder.endRecording();
    final image = picture.toImageSync(width.toInt(), height.ceil());
    picture.dispose();
    _chunks.add(image);
    for (final (i, (id, _, b)) in shapes.indexed) {
      final (px, py) = places[i];
      final w = (b.width + pad * 2).ceilToDouble();
      final h = (b.height + pad * 2).ceilToDouble();
      _cells[id] = GlyphCell(
        image,
        ui.Rect.fromLTWH(px, py, w, h),
        twin ? ui.Rect.fromLTWH(px + w + 1, py, w, h) : null,
        b.left - pad,
        b.top - pad,
      );
    }
  }

  void dispose() {
    for (final c in _chunks) {
      c.dispose();
    }
    _chunks.clear();
    _cells.clear();
    _pending.clear();
  }
}

/// Glyph outlines as paths of one unit per font unit, y down.
class OutlineCache {
  final Map<int, ui.Path?> _byId = {};

  ui.Path? path(GlyphFonts fonts, int face, int weight, int glyph) {
    final id = (face * 10 + GlyphFonts.snapWeight(weight) ~/ 100) << 20 | glyph;
    if (_byId.containsKey(id)) return _byId[id];
    final outline = fonts.font(face, weight).outline(glyph);
    return _byId[id] = outline == null || outline.isEmpty
        ? null
        : _toPath(outline);
  }

  static ui.Path _toPath(GlyphPath outline) {
    final p = ui.Path();
    for (final c in outline.commands) {
      switch (c) {
        case MoveTo():
          p.moveTo(c.x, -c.y);
        case LineTo():
          p.lineTo(c.x, -c.y);
        case QuadTo():
          p.quadraticBezierTo(c.cx, -c.cy, c.x, -c.y);
        case CubicTo():
          p.cubicTo(c.c1x, -c.c1y, c.c2x, -c.c2y, c.x, -c.y);
        case ClosePath():
          p.close();
      }
    }
    return p;
  }
}

/// Every page in use, and the batches of glyphs one frame draws from them:
/// all halos first, then all text, one atlas draw per image.
class GlyphPages {
  GlyphPages(this.fonts);

  final GlyphFonts fonts;
  final _paths = OutlineCache();
  final Map<PageKey, GlyphPage> _pages = {};
  final Map<ui.Image, _Batch> _halos = {};
  final Map<ui.Image, _Batch> _inks = {};
  int _frame = 0;

  static int sizeOf(double devicePixelsPerEm) =>
      (math.log(math.max(devicePixelsPerEm, 1)) / math.ln2 * 4).ceil();

  GlyphPage page(PageKey key) {
    final page = _pages[key] ??= GlyphPage(key, fonts, _paths);
    page.usedFrame = _frame;
    return page;
  }

  /// The cell of a glyph in [key]'s page, or while that page waits, in the
  /// nearest size of the same look that has it, so a label never blinks
  /// out while its size steps. The page the cell came from is returned with
  /// it, for its scale.
  (GlyphCell, GlyphPage)? cell(PageKey key, int face, int glyph) {
    final page = this.page(key);
    final exact = page.cell(face, glyph);
    if (exact != null) return (exact, page);
    for (var step = 1; step <= 4; step++) {
      for (final size in [key.size + step, key.size - step]) {
        final near =
            _pages[(
              size: size,
              weight: key.weight,
              italic: key.italic,
              halo: key.halo,
              blur: key.blur,
            )];
        final found = near?.peek(face, glyph);
        if (found != null) {
          near!.usedFrame = _frame;
          return (found, near);
        }
      }
    }
    return null;
  }

  /// Glyphs rasterized in one frame at most; the rest wait a frame.
  static const glyphsPerFrame = 160;

  /// Queues one glyph: its origin on the baseline at [x], [y] logical
  /// pixels, turned by [angle], [scale] logical pixels per page pixel, in
  /// [ink] with [halo] around it.
  void add(
    GlyphCell cell,
    double x,
    double y,
    double angle,
    double scale,
    int ink,
    int? halo,
  ) {
    final c = math.cos(angle) * scale, s = math.sin(angle) * scale;
    final tx = x + c * cell.left - s * cell.top;
    final ty = y + s * cell.left + c * cell.top;
    final haloRect = cell.halo;
    if (halo != null && haloRect != null) {
      (_halos[cell.image] ??= _Batch()).add(c, s, tx, ty, haloRect, halo);
    }
    (_inks[cell.image] ??= _Batch()).add(c, s, tx, ty, cell.ink, ink);
  }

  static final _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;

  /// Draws what was queued this frame and rasterizes glyphs asked for.
  void flush(ui.Canvas canvas) {
    for (final batches in [_halos, _inks]) {
      for (final MapEntry(key: image, value: b) in batches.entries) {
        if (b.length == 0) continue;
        canvas.drawRawAtlas(
          image,
          Float32List.sublistView(b.transforms, 0, b.length * 4),
          Float32List.sublistView(b.rects, 0, b.length * 4),
          Int32List.sublistView(b.colors, 0, b.length),
          ui.BlendMode.modulate,
          null,
          _paint,
        );
      }
      batches.clear();
    }
  }

  /// Rasterizes waiting glyphs; true when some were, so a frame should
  /// follow to draw them.
  bool rasterizePending() {
    var any = false;
    final watch = Stopwatch()..start();
    var glyphs = 0;
    for (final page in _pages.values) {
      if (!page.hasPending) continue;
      final left = glyphsPerFrame - glyphs;
      if (left <= 0) return true;
      glyphs += page.flush(left);
      any = true;
    }
    lastRasterized = glyphs;
    lastRasterMicros = watch.elapsedMicroseconds;
    return any;
  }

  /// Glyphs rasterized in the last frame, and the UI thread time it took.
  int lastRasterized = 0;
  int lastRasterMicros = 0;
  int get pageCount => _pages.length;

  /// Ends a frame, dropping pages no frame used for a while.
  void endFrame() {
    _frame++;
    if (_frame % 120 != 0) return;
    _pages.removeWhere((key, page) {
      if (_frame - page.usedFrame < 600) return false;
      page.dispose();
      return true;
    });
  }

  void dispose() {
    for (final p in _pages.values) {
      p.dispose();
    }
    _pages.clear();
  }
}

class _Batch {
  Float32List transforms = Float32List(256);
  Float32List rects = Float32List(256);
  Int32List colors = Int32List(64);
  int length = 0;

  void add(double c, double s, double tx, double ty, ui.Rect r, int color) {
    final o = length * 4;
    if (o + 4 > transforms.length) {
      transforms = Float32List(transforms.length * 2)..setAll(0, transforms);
      rects = Float32List(rects.length * 2)..setAll(0, rects);
      colors = Int32List(colors.length * 2)..setAll(0, colors);
    }
    transforms[o] = c;
    transforms[o + 1] = s;
    transforms[o + 2] = tx;
    transforms[o + 3] = ty;
    rects[o] = r.left;
    rects[o + 1] = r.top;
    rects[o + 2] = r.right;
    rects[o + 3] = r.bottom;
    colors[length] = color;
    length++;
  }
}
