import 'dart:async';
import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';

// payv exports the command type but not its cases.
// ignore: implementation_imports
import 'package:payv/src/font/glyph_path.dart';

import 'glyph_layout.dart';

/// A page look as the rasterizer needs it: device pixels to the em, weight,
/// slant, and halo width and softness in quarter pixels.
typedef RasterLook = ({double em, int weight, bool italic, int halo, int blur});

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
/// distance transform, and packs them into pages. Bitmaps are kept per look,
/// so packing a page again from glyphs drawn before costs only copies.
class GlyphRasterizer {
  GlyphRasterizer(this.fonts);

  final GlyphFonts fonts;
  final Map<int, GlyphPath?> _outlines = {};
  final Map<String, Map<int, _Bitmap?>> _bitmaps = {};

  static String lookId(RasterLook look) =>
      '${look.em}/${look.weight}/${look.italic}/${look.halo}/${look.blur}';

  void forget(RasterLook look) => _bitmaps.remove(lookId(look));

  GlyphRaster draw(RasterLook look, List<int> ids) {
    final kept = _bitmaps.putIfAbsent(lookId(look), () => {});
    final drawn = <(int, _Bitmap)>[];
    for (final id in ids) {
      final b = kept.containsKey(id) ? kept[id] : kept[id] = _glyph(look, id);
      if (b != null) drawn.add((id, b));
    }
    const width = 1024;
    final twin = look.halo > 0;
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

  GlyphPath? _outline(int face, int weight, int glyph) {
    final key =
        (face * 10 + GlyphFonts.snapWeight(weight) ~/ 100) << 20 | glyph;
    if (_outlines.containsKey(key)) return _outlines[key];
    final o = fonts.font(face, weight).outline(glyph);
    return _outlines[key] = o == null || o.isEmpty ? null : o;
  }

  _Bitmap? _glyph(RasterLook look, int id) {
    final face = id >> 20, glyph = id & 0xFFFFF;
    final outline = _outline(face, look.weight, glyph);
    if (outline == null) return null;
    final s = look.em / fonts.unitsPerEm(face);
    final slant = look.italic ? 0.2 * s : 0.0;
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
    final halo = look.halo / 4, blur = look.blur / 4;
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
      look.halo > 0 ? _halo(coverage, w, h, halo, blur) : null,
      minX - pad,
      minY - pad,
    );
  }

  /// The outline as polylines in pixels, y down: flat pairs of points,
  /// each contour closed, consecutive points joined.
  static List<double> _flatten(GlyphPath outline, double s, double slant) {
    final out = <double>[];
    var cx = 0.0, cy = 0.0, sx = 0.0, sy = 0.0;
    var open = false;
    void close() {
      if (open && (cx != sx || cy != sy)) _segment(out, cx, cy, sx, sy);
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
          _segment(out, cx, cy, x, y);
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
            _segment(out, lx, ly, nx, ny);
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
            _segment(out, lx, ly, nx, ny);
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

  static void _segment(
    List<double> out,
    double x0,
    double y0,
    double x1,
    double y1,
  ) {
    out
      ..add(x0)
      ..add(y0)
      ..add(x1)
      ..add(y1);
  }

  /// Exact area coverage of the outline, nonzero, clamped to one: each
  /// edge adds its signed area to the cells it crosses, and a running sum
  /// along each row turns that into coverage.
  static Float32List _coverage(
    List<double> segments,
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
    Isolate.spawn(_main, (
      ready.sendPort,
      _replies.sendPort,
      [
        for (final b in fonts.faceBytes) TransferableTypedData.fromList([b]),
      ],
      fonts.familyNames,
    ), debugName: 'vmap glyphs').then(
      (isolate) {
        _isolate = isolate;
        if (_disposed) isolate.kill();
      },
      onError: (Object e) {
        for (final c in _waiting.values) {
          c.completeError(e);
        }
        _waiting.clear();
      },
    );
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
  final Map<int, Completer<GlyphRaster>> _waiting = {};
  final List<Object?> _queued = [];
  SendPort? _port;
  Isolate? _isolate;
  int _next = 0;
  bool _disposed = false;

  Future<GlyphRaster> draw(RasterLook look, List<int> ids) {
    final id = _next++;
    final done = _waiting[id] = Completer<GlyphRaster>();
    _send([
      0,
      id,
      look.em,
      look.weight,
      look.italic,
      look.halo,
      look.blur,
      Int32List.fromList(ids),
    ]);
    return done.future;
  }

  void forget(RasterLook look) =>
      _send([1, look.em, look.weight, look.italic, look.halo, look.blur]);

  void _send(Object? message) {
    if (_disposed) return;
    final port = _port;
    if (port == null) {
      _queued.add(message);
    } else {
      port.send(message);
    }
  }

  void _reply(Object? message) {
    final m = message! as List;
    final done = _waiting.remove(m[0] as int);
    if (done == null) return;
    done.complete(
      GlyphRaster(
        m[1] as int,
        m[2] as int,
        (m[3] as TransferableTypedData).materialize().asUint8List(),
        m[4] as Float64List,
      ),
    );
  }

  void dispose() {
    _disposed = true;
    _isolate?.kill();
    _replies.close();
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
    requests.listen((message) {
      final m = message! as List;
      final look = (
        em: m[m[0] == 0 ? 2 : 1] as double,
        weight: m[m[0] == 0 ? 3 : 2] as int,
        italic: m[m[0] == 0 ? 4 : 3] as bool,
        halo: m[m[0] == 0 ? 5 : 4] as int,
        blur: m[m[0] == 0 ? 6 : 5] as int,
      );
      if (m[0] == 1) {
        rasterizer.forget(look);
        return;
      }
      final r = rasterizer.draw(look, m[7] as Int32List);
      replies.send([
        m[1],
        r.width,
        r.height,
        TransferableTypedData.fromList([r.pixels]),
        r.cells,
      ]);
    });
  }
}
