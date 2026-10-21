import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../../platform.dart';
import 'glyph_layout.dart';
import 'glyph_pbf.dart';
import 'glyph_raster.dart';

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

/// One look's glyphs, rasterized from the fonts' own outlines in another
/// isolate. Glyphs asked for and missing are sent off as one batch when
/// [flush] runs and come back as a new image; once a page has many images,
/// one batch packs all its glyphs into a single image again.
class GlyphPage {
  GlyphPage(this.key, this._worker, this._changed) : em = pageEm(key);

  final PageKey key;
  final GlyphRasterWorker _worker;
  final void Function() _changed;

  /// Device pixels per em.
  final double em;
  final Map<int, GlyphCell?> _cells = {};
  final List<int> _pending = [];
  final List<ui.Image> _chunks = [];
  int usedFrame = 0;
  int _inFlight = 0;
  bool _merging = false;
  bool _disposed = false;

  static int _id(int face, int glyph) => face << 20 | glyph;

  /// The cell of [glyph] in [face], or null while it is being drawn.
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
  bool get busy => _inFlight > 0;

  /// The cell of [glyph] if it is drawn already, without asking for it.
  GlyphCell? peek(int face, int glyph) => _cells[_id(face, glyph)];

  /// Sends up to [most] of the glyphs asked for since the last flush to be
  /// drawn, and returns how many it sent.
  int flush([int most = 1 << 30]) {
    if (_pending.isEmpty || _merging) return 0;
    if (_chunks.length >= 6 && _inFlight == 0) {
      final all = _cells.keys.toList();
      _pending.clear();
      _merging = true;
      _send(all, merge: true);
      return all.length;
    }
    final take = math.min(most, _pending.length);
    final ids = _pending.sublist(0, take);
    _pending.removeRange(0, take);
    _send(ids, merge: false);
    return take;
  }

  Future<void> _send(List<int> ids, {required bool merge}) async {
    _inFlight++;
    try {
      final r = await _worker.draw(key, ids);
      final image = await _image(r);
      if (_disposed) {
        image?.dispose();
        return;
      }
      if (merge) {
        for (final c in _chunks) {
          c.dispose();
        }
        _chunks.clear();
      }
      if (image != null) {
        _chunks.add(image);
        _place(image, r.cells);
      }
      if (merge) _changed();
    } catch (_) {
      // A batch that failed leaves its glyphs undrawn, not the page stuck.
    } finally {
      _inFlight--;
      if (merge) _merging = false;
    }
  }

  void _place(ui.Image image, Float64List cells) {
    for (var i = 0; i < cells.length; i += GlyphRaster.stride) {
      final x = cells[i + 1], y = cells[i + 2];
      final w = cells[i + 3], h = cells[i + 4];
      final haloX = cells[i + 5];
      _cells[cells[i].toInt()] = GlyphCell(
        image,
        ui.Rect.fromLTWH(x, y, w, h),
        haloX < 0 ? null : ui.Rect.fromLTWH(haloX, y, w, h),
        cells[i + 6],
        cells[i + 7],
      );
    }
  }

  static Future<ui.Image?> _image(GlyphRaster r) async {
    if (r.cells.isEmpty) return null;
    return imageFromRgba(r.pixels, r.width, r.height);
  }

  void dispose() {
    _disposed = true;
    for (final c in _chunks) {
      c.dispose();
    }
    _chunks.clear();
    _cells.clear();
    _pending.clear();
    _worker.forget(key);
  }
}

/// Every page in use, and the batches of glyphs one frame draws from them:
/// all halos first, then all text, one atlas draw per image.
class GlyphPages {
  GlyphPages(this.fonts) : _worker = GlyphRasterWorker(fonts);

  final GlyphFonts fonts;
  final GlyphRasterWorker _worker;
  final Map<PageKey, GlyphPage> _pages = {};
  final Map<ui.Image, _Batch> _halos = {};
  final Map<ui.Image, _Batch> _inks = {};
  final Map<ui.Image, _Quads> _haloQuads = {};
  final Map<ui.Image, _Quads> _inkQuads = {};
  int _frame = 0;

  /// Moves on whenever a cell handed out may have gone stale: a page was
  /// dropped, glyphs arrived, or a page was packed into one image.
  int generation = 0;

  void _landed() => generation++;

  static int sizeOf(double devicePixelsPerEm) =>
      (math.log(math.max(devicePixelsPerEm, 1)) / math.ln2 * 4).ceil();

  GlyphPage page(PageKey key) {
    final page = _pages[key] ??= GlyphPage(key, _worker, _landed);
    page.usedFrame = _frame;
    return page;
  }

  /// The cell of a glyph in [key]'s page, or while that page waits, in the
  /// nearest size of the same look that has it, so a label never blinks
  /// out while its size steps. The page the cell came from is left in
  /// [found], for its scale.
  GlyphCell? cell(PageKey key, int face, int glyph) {
    final page = this.page(key);
    final exact = page.cell(face, glyph);
    if (exact != null) {
      found = page;
      return exact;
    }
    for (var step = 1; step <= 4; step++) {
      for (var sign = 1; sign >= -1; sign -= 2) {
        final near = _pages[nearbyKey(key, step * sign)];
        final cell = near?.peek(face, glyph);
        if (cell != null) {
          near!.usedFrame = _frame;
          found = near;
          return cell;
        }
      }
    }
    return null;
  }

  /// Hands the rasterizer the glyphs of a style glyph range.
  void addPbf(int face, List<PbfGlyph> glyphs) => _worker.addPbf(face, glyphs);

  /// The page of the cell [cell] last returned.
  late GlyphPage found;

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

  /// Queues [cell] drawn by an affine map, for text laid on the ground of
  /// a tilted map: the cell's pixel at u, v lands on the screen at [ox],
  /// [oy] plus u times [ax], [ay] plus v times [bx], [by].
  void addQuad(
    GlyphCell cell,
    double ox,
    double oy,
    double ax,
    double ay,
    double bx,
    double by,
    int ink,
    int? halo,
  ) {
    final x = ox + ax * cell.left + bx * cell.top;
    final y = oy + ay * cell.left + by * cell.top;
    final haloRect = cell.halo;
    if (halo != null && haloRect != null) {
      (_haloQuads[cell.image] ??= _Quads()).add(
        x,
        y,
        ax,
        ay,
        bx,
        by,
        haloRect,
        halo, //
      );
    }
    (_inkQuads[cell.image] ??= _Quads()).add(
      x,
      y,
      ax,
      ay,
      bx,
      by,
      cell.ink,
      ink, //
    );
  }

  static final _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;

  /// Draws what was queued this frame and rasterizes glyphs asked for.
  void flush(ui.Canvas canvas) {
    for (final (batches, quads) in [(_halos, _haloQuads), (_inks, _inkQuads)]) {
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
      for (final MapEntry(key: image, value: q) in quads.entries) {
        if (q.length == 0) continue;
        final vertices = ui.Vertices.raw(
          ui.VertexMode.triangles,
          Float32List.sublistView(q.positions, 0, q.length * 12),
          textureCoordinates: Float32List.sublistView(q.uvs, 0, q.length * 12),
          colors: Int32List.sublistView(q.colors, 0, q.length * 6),
        );
        canvas.drawVertices(
          vertices,
          ui.BlendMode.modulate,
          ui.Paint()
            ..filterQuality = ui.FilterQuality.low
            ..shader = ui.ImageShader(
              forShader(image),
              ui.TileMode.clamp,
              ui.TileMode.clamp,
              _identity,
            ),
        );
        vertices.dispose();
      }
      quads.clear();
    }
  }

  static final Float64List _identity = Float64List(16)
    ..[0] = 1
    ..[5] = 1
    ..[10] = 1
    ..[15] = 1;

  /// Sends waiting glyphs to be drawn; true while any are being drawn, so
  /// frames go on until they land.
  bool rasterizePending() {
    var any = false;
    final watch = Stopwatch()..start();
    var glyphs = 0;
    for (final page in _pages.values) {
      if (page.hasPending && glyphs < glyphsPerFrame) {
        glyphs += page.flush(glyphsPerFrame - glyphs);
      }
      if (page.busy || page.hasPending) any = true;
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
      generation++;
      return true;
    });
  }

  void dispose() {
    for (final p in _pages.values) {
      p.dispose();
    }
    _pages.clear();
    _worker.dispose();
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

/// Glyph quads of one image, two triangles each.
class _Quads {
  Float32List positions = Float32List(384);
  Float32List uvs = Float32List(384);
  Int32List colors = Int32List(192);
  int length = 0;

  void add(
    double x,
    double y,
    double ax,
    double ay,
    double bx,
    double by,
    ui.Rect r,
    int color,
  ) {
    final o = length * 12;
    if (o + 12 > positions.length) {
      positions = Float32List(positions.length * 2)..setAll(0, positions);
      uvs = Float32List(uvs.length * 2)..setAll(0, uvs);
      colors = Int32List(colors.length * 2)..setAll(0, colors);
    }
    final w = r.width, h = r.height;
    final corners = [
      (0.0, 0.0), (w, 0.0), (w, h), //
      (0.0, 0.0), (w, h), (0.0, h),
    ];
    for (var k = 0; k < 6; k++) {
      final (u, v) = corners[k];
      positions[o + k * 2] = x + ax * u + bx * v;
      positions[o + k * 2 + 1] = y + ay * u + by * v;
      uvs[o + k * 2] = r.left + u;
      uvs[o + k * 2 + 1] = r.top + v;
      colors[length * 6 + k] = color;
    }
    length++;
  }
}
