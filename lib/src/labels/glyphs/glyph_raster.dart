import 'dart:async';
import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';

// payv exports the command type but not its cases.
// ignore: implementation_imports
import 'package:payv/src/font/glyph_path.dart';

import '../../tiles/typed_buffer.dart';
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
  final Map<int, GlyphPath?> _outlines = {};
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

  GlyphPath? _outline(int face, int weight, int glyph) {
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
    final lines = _flatten(outline, s, slant);
    if (lines.isEmpty) return null;
    var minX = double.infinity, minY = double.infinity;
    var maxX = -double.infinity, maxY = -double.infinity;
    for (var i = 0; i < lines.length; i += 2) {
      minX = math.min(minX, lines[i]);
      maxX = math.max(maxX, lines[i]);
      minY = math.min(minY, lines[i + 1]);
      maxY = math.max(maxY, lines[i + 1]);
    }
    final halo = key.halo / 4, blur = key.blur / 4;
    final pad = (halo + blur * 2 + 2).ceilToDouble();
    final w = (maxX - minX + pad * 2).ceil();
    final h = (maxY - minY + pad * 2).ceil();
    final dx = pad - minX, dy = pad - minY;
    final coverage = _coverage(lines, w, h, dx, dy);
    final ink = Uint8List(w * h);
    for (var i = 0; i < ink.length; i++) {
      ink[i] = (coverage[i] * 255 + 0.5).toInt();
    }
    return _Bitmap(
      w,
      h,
      ink,
      key.halo > 0 ? _halo(coverage, w, h, halo, blur) : null,
      minX - pad,
      minY - pad,
    );
  }

  /// The outline as polylines in pixels, y down: flat pairs of points,
  /// each contour closed, consecutive points joined.
  static DoubleBuffer _flatten(GlyphPath outline, double s, double slant) {
    final out = DoubleBuffer();
    var cx = 0.0, cy = 0.0, sx = 0.0, sy = 0.0;
    var open = false;
    void close() {
      if (open && (cx != sx || cy != sy)) out.add4(cx, cy, sx, sy);
      open = false;
    }

    double px(double x, double y) => x * s + y * slant;
    double py(double y) => -y * s;
    for (final c in outline.commands) {
      switch (c) {
        case MoveTo():
          close();
          cx = sx = px(c.x, c.y);
          cy = sy = py(c.y);
          open = true;
        case LineTo():
          final x = px(c.x, c.y), y = py(c.y);
          out.add4(cx, cy, x, y);
          cx = x;
          cy = y;
        case QuadTo():
          final qx = px(c.cx, c.cy), qy = py(c.cy);
          final x = px(c.x, c.y), y = py(c.y);
          final dd = _len(cx - 2 * qx + x, cy - 2 * qy + y);
          final n = math.max(1, math.min(32, math.sqrt(dd * 2).ceil()));
          var lx = cx, ly = cy;
          for (var i = 1; i <= n; i++) {
            final t = i / n, u = 1 - t;
            final nx = u * u * cx + 2 * u * t * qx + t * t * x;
            final ny = u * u * cy + 2 * u * t * qy + t * t * y;
            out.add4(lx, ly, nx, ny);
            lx = nx;
            ly = ny;
          }
          cx = x;
          cy = y;
        case CubicTo():
          final ax = px(c.c1x, c.c1y), ay = py(c.c1y);
          final bx = px(c.c2x, c.c2y), by = py(c.c2y);
          final x = px(c.x, c.y), y = py(c.y);
          final dd = math.max(
            _len(cx - 2 * ax + bx, cy - 2 * ay + by),
            _len(ax - 2 * bx + x, ay - 2 * by + y),
          );
          final n = math.max(1, math.min(48, math.sqrt(dd * 3).ceil()));
          var lx = cx, ly = cy;
          for (var i = 1; i <= n; i++) {
            final t = i / n, u = 1 - t;
            final nx =
                u * u * u * cx +
                3 * u * u * t * ax +
                3 * u * t * t * bx +
                t * t * t * x;
            final ny =
                u * u * u * cy +
                3 * u * u * t * ay +
                3 * u * t * t * by +
                t * t * t * y;
            out.add4(lx, ly, nx, ny);
            lx = nx;
            ly = ny;
          }
          cx = x;
          cy = y;
        case ClosePath():
          close();
          cx = sx;
          cy = sy;
      }
    }
    close();
    return out;
  }

  static double _len(double x, double y) => math.sqrt(x * x + y * y);

  /// Exact area coverage of the outline, nonzero, clamped to one: each
  /// edge adds its signed area to the cells it crosses, and a running sum
  /// along each row turns that into coverage.
  static Float32List _coverage(
    DoubleBuffer segments,
    int w,
    int h,
    double dx,
    double dy,
  ) {
    final acc = Float32List(w * h + 2);
    for (var i = 0; i < segments.length; i += 4) {
      _line(
        acc,
        w,
        h,
        segments[i] + dx,
        segments[i + 1] + dy,
        segments[i + 2] + dx,
        segments[i + 3] + dy,
      );
    }
    final out = Float32List(w * h);
    var sum = 0.0;
    for (var i = 0; i < out.length; i++) {
      sum += acc[i];
      final a = sum.abs();
      // Rounding leaves crumbs where there is no ink, which the halo's
      // distance transform would take for edges.
      out[i] = a < 1 / 512 ? 0 : (a > 1 - 1 / 512 ? 1 : a);
    }
    return out;
  }

  static void _line(
    Float32List acc,
    int w,
    int h,
    double x0,
    double y0,
    double x1,
    double y1,
  ) {
    if (y0 == y1) return;
    double dir;
    if (y0 < y1) {
      dir = 1;
    } else {
      dir = -1;
      final tx = x0, ty = y0;
      x0 = x1;
      y0 = y1;
      x1 = tx;
      y1 = ty;
    }
    final dxdy = (x1 - x0) / (y1 - y0);
    var x = x0;
    if (y0 < 0) x -= y0 * dxdy;
    final yEnd = math.min(h, y1.ceil());
    for (var y = math.max(0, y0.floor()); y < yEnd; y++) {
      final ls = y * w;
      final dy = math.min(y + 1.0, y1) - math.max(y.toDouble(), y0);
      final xNext = x + dxdy * dy;
      final d = dy * dir;
      final xa = x < xNext ? x : xNext, xb = x < xNext ? xNext : x;
      final xaFloor = xa.floorToDouble();
      final xai = xaFloor.toInt();
      final xbCeil = xb.ceilToDouble();
      final xbi = xbCeil.toInt();
      if (xbi <= xai + 1) {
        final xmf = 0.5 * (x + xNext) - xaFloor;
        acc[ls + xai] += d - d * xmf;
        acc[ls + xai + 1] += d * xmf;
      } else {
        final s = 1 / (xb - xa);
        final xaf = xa - xaFloor;
        final a0 = 0.5 * s * (1 - xaf) * (1 - xaf);
        final xbf = xb - xbCeil + 1;
        final am = 0.5 * s * xbf * xbf;
        acc[ls + xai] += d * a0;
        if (xbi == xai + 2) {
          acc[ls + xai + 1] += d * (1 - a0 - am);
        } else {
          final a1 = s * (1.5 - xaf);
          acc[ls + xai + 1] += d * (a1 - a0);
          for (var xi = xai + 2; xi < xbi - 1; xi++) {
            acc[ls + xi] += d * s;
          }
          final a2 = a1 + (xbi - xai - 3) * s;
          acc[ls + xbi - 1] += d * (1 - a2 - am);
        }
        acc[ls + xbi] += d * am;
      }
      x = xNext;
    }
  }

  static const _far = 1e20;

  /// The halo: everything within [width] pixels of the ink, its edge
  /// softened over about three [blur] sigmas, as a blurred stroke would be.
  static Uint8List _halo(
    Float32List coverage,
    int w,
    int h,
    double width,
    double blur,
  ) {
    final n = w * h;
    final outer = Float64List(n), inner = Float64List(n);
    for (var i = 0; i < n; i++) {
      final a = coverage[i];
      if (a >= 1) {
        outer[i] = 0;
        inner[i] = _far;
      } else if (a <= 0) {
        outer[i] = _far;
        inner[i] = 0;
      } else {
        final d = 0.5 - a;
        outer[i] = d > 0 ? d * d : 0;
        inner[i] = d < 0 ? d * d : 0;
      }
    }
    final size = math.max(w, h);
    final f = Float64List(size), z = Float64List(size + 1);
    final v = Int32List(size);
    _edt(outer, w, h, f, v, z);
    _edt(inner, w, h, f, v, z);
    final out = Uint8List(n);
    final soft = math.max(0.5, blur * 1.5);
    for (var i = 0; i < n; i++) {
      final d = math.sqrt(outer[i]) - math.sqrt(inner[i]);
      var a = (width + soft - d) / (2 * soft);
      a = a < 0 ? 0 : (a > 1 ? 1 : a);
      a = a * a * (3 - 2 * a);
      out[i] = (a * 255 + 0.5).toInt();
    }
    return out;
  }

  static void _edt(
    Float64List grid,
    int w,
    int h,
    Float64List f,
    Int32List v,
    Float64List z,
  ) {
    for (var x = 0; x < w; x++) {
      _edt1(grid, x, w, h, f, v, z);
    }
    for (var y = 0; y < h; y++) {
      _edt1(grid, y * w, 1, w, f, v, z);
    }
  }

  /// Felzenszwalb and Huttenlocher's squared distance transform along one
  /// row or column.
  static void _edt1(
    Float64List grid,
    int offset,
    int stride,
    int length,
    Float64List f,
    Int32List v,
    Float64List z,
  ) {
    for (var q = 0; q < length; q++) {
      f[q] = grid[offset + q * stride];
    }
    v[0] = 0;
    z[0] = -_far;
    z[1] = _far;
    var k = 0;
    for (var q = 1; q < length; q++) {
      double s;
      do {
        final r = v[k];
        s = (f[q] - f[r] + q * q - r * r) / (q - r) / 2;
      } while (s <= z[k] && --k > -1);
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = _far;
    }
    k = 0;
    for (var q = 0; q < length; q++) {
      while (z[k + 1] < q) {
        k++;
      }
      final r = v[k];
      grid[offset + q * stride] = f[r] + (q - r) * (q - r);
    }
  }
}

/// A [GlyphRasterizer] in its own isolate, so glyphs never cost a frame.
class GlyphRasterWorker {
  GlyphRasterWorker(GlyphFonts fonts) {
    final ready = ReceivePort();
    _replies.listen(_reply);
    _gone.listen((_) => _fail());
    Isolate.spawn(
      _main,
      (
        ready.sendPort,
        _replies.sendPort,
        [
          for (final b in fonts.faceBytes) TransferableTypedData.fromList([b]),
        ],
        fonts.familyNames,
      ),
      debugName: 'vmap glyphs',
      onExit: _gone.sendPort,
    ).then((isolate) {
      _isolate = isolate;
      if (_disposed) isolate.kill();
    }, onError: (Object _) => _fail());
    ready.first.then((port) {
      ready.close();
      _port = port as SendPort;
      for (final m in _queued) {
        _port!.send(m);
      }
      _queued.clear();
    });
  }

  final _replies = ReceivePort();
  final _gone = ReceivePort();

  /// The isolate died: every batch waiting and asked for later fails, so
  /// no page waits forever.
  void _fail() {
    _dead = true;
    for (final c in _waiting.values) {
      c.completeError(StateError('vmap glyphs: the isolate is gone'));
    }
    _waiting.clear();
  }

  bool _dead = false;
  final Map<int, Completer<GlyphRaster>> _waiting = {};
  final List<_Request> _queued = [];
  SendPort? _port;
  Isolate? _isolate;
  int _next = 0;
  bool _disposed = false;

  Future<GlyphRaster> draw(PageKey key, List<int> ids) {
    if (_dead) {
      return Future.error(StateError('vmap glyphs: the isolate is gone'));
    }
    final id = _next++;
    final done = _waiting[id] = Completer<GlyphRaster>();
    _send(_Draw(id, key, Int32List.fromList(ids)));
    return done.future;
  }

  void forget(PageKey key) => _send(_Forget(key));

  /// Hands the isolate the glyphs of a style glyph range for [face].
  void addPbf(int face, List<PbfGlyph> glyphs) => _send(_AddPbf(face, glyphs));

  void _send(_Request request) {
    if (_disposed) return;
    final port = _port;
    if (port == null) {
      _queued.add(request);
    } else {
      port.send(request);
    }
  }

  void _reply(Object? message) {
    final drawn = message! as _Drawn;
    _waiting
        .remove(drawn.id)
        ?.complete(
          GlyphRaster(
            drawn.width,
            drawn.height,
            drawn.pixels.materialize().asUint8List(),
            drawn.cells,
          ),
        );
  }

  void dispose() {
    _disposed = true;
    _isolate?.kill();
    _replies.close();
    _gone.close();
    _waiting.clear();
  }

  static void _main(
    (SendPort, SendPort, List<TransferableTypedData>, List<String>?) setup,
  ) {
    final (ready, replies, faces, families) = setup;
    final rasterizer = GlyphRasterizer(
      GlyphFonts([
        for (final f in faces) f.materialize().asUint8List(),
      ], families: families),
    );
    final requests = ReceivePort();
    ready.send(requests.sendPort);
    requests.listen((request) {
      switch (request as _Request) {
        case _Forget(:final key):
          rasterizer.forget(key);
        case _AddPbf(:final face, :final glyphs):
          final known = rasterizer.ranges[face] ??= {};
          for (final g in glyphs) {
            known[g.id] = g;
          }
        case _Draw(:final id, :final key, :final ids):
          GlyphRaster r;
          try {
            r = rasterizer.draw(key, ids);
          } catch (_) {
            r = GlyphRaster(1, 1, Uint8List(4), Float64List(0));
          }
          replies.send(
            _Drawn(
              id,
              r.width,
              r.height,
              TransferableTypedData.fromList([r.pixels]),
              r.cells,
            ),
          );
      }
    });
  }
}

sealed class _Request {}

final class _AddPbf extends _Request {
  _AddPbf(this.face, this.glyphs);

  final int face;
  final List<PbfGlyph> glyphs;
}

final class _Draw extends _Request {
  _Draw(this.id, this.key, this.ids);

  final int id;
  final PageKey key;
  final Int32List ids;
}

final class _Forget extends _Request {
  _Forget(this.key);

  final PageKey key;
}

final class _Drawn {
  _Drawn(this.id, this.width, this.height, this.pixels, this.cells);

  final int id, width, height;
  final TransferableTypedData pixels;
  final Float64List cells;
}
