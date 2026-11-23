@Tags(['gpu'])
library;

import 'dart:async';
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/camera/view.dart';
import 'package:vmap/src/gpu/sdf_text_gpu.dart';
import 'package:vmap/src/labels/sdf_text.dart';
import 'package:vmap/src/text/glyphs/font_fields.dart';
import 'package:vmap/src/text/glyphs/glyph_layout.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';
import 'package:vmap/src/text/glyphs/glyph_raster.dart';
import 'package:vmap/src/text/glyphs/glyph_worker.dart';

import 'support/gpu.dart';

const _width = 240.0, _height = 60.0;
const _penX = 20.0, _top = 12.0;

/// Ink by device pixel, 0 to 255.
class _Ink {
  _Ink(this.width, this.height) : alpha = Uint8List(width * height);

  final int width, height;
  final Uint8List alpha;

  int get total => alpha.fold(0, (a, b) => a + b);

  /// The inked columns from the left, as (first, last) runs.
  List<(int, int)> get runs {
    final out = <(int, int)>[];
    var from = -1;
    for (var x = 0; x <= width; x++) {
      var inked = false;
      if (x < width) {
        for (var y = 0; y < height && !inked; y++) {
          inked = alpha[y * width + x] > 127;
        }
      }
      if (inked && from < 0) from = x;
      if (!inked && from >= 0) {
        out.add((from, x - 1));
        from = -1;
      }
    }
    return out;
  }

  (int, int) get rows {
    var first = height, last = -1;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (alpha[y * width + x] > 127) {
          first = math.min(first, y);
          last = math.max(last, y);
        }
      }
    }
    return (first, last);
  }
}

void main() {
  final fonts = GlyphFonts([
    File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync(),
  ]);
  late SdfTextGpu text;
  late GlyphRasterWorker worker;
  late FieldGlyphs fields;
  var landed = Completer<void>();

  setUpAll(() async {
    if (!hasGpu) return;
    final (library, device) = await gpuDevice();
    text = SdfTextGpu(device, library, guard: unguarded);
    worker = GlyphRasterWorker(fonts);
    fields = FieldGlyphs(worker, () {
      landed.complete();
      landed = Completer<void>();
    });
  });

  tearDownAll(() {
    if (!hasGpu) return;
    fields.dispose();
    worker.dispose();
  });

  /// [shaped] drawn from its fonts' distance fields, a device pixel to
  /// [em] of them the em.
  Future<_Ink> drawn(ShapedText shaped, int weight, double em) async {
    const dpr = 2.0;
    final fontLook = FontLook(weight, false);
    while (fields.state(shaped.glyphs, fontLook) != FieldsState.ready) {
      await landed.future.timeout(const Duration(seconds: 20));
    }
    final size = em / dpr, scale = size / GlyphPbf.em;
    final view = MapView(
      centerX: 0.5,
      centerY: 0.5,
      zoom: 3,
      width: _width,
      height: _height,
    );
    text.begin(const ui.Size(_width, _height), dpr, fields, view);
    final look = SdfLook(SdfLook.rgba(0xFF000000, 1), null, 0, 0, scale);
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      text.glyph(
        fontLook.face(g[i].toInt()),
        g[i + 1].toInt(),
        _penX + g[i + 2] * size,
        _top + g[i + 3] * size,
        scale,
        0,
        0,
        scale,
        look,
        0,
      );
    }
    final recorder = ui.PictureRecorder();
    text.end(ui.Canvas(recorder)..scale(dpr));
    final w = (_width * dpr).round(), h = (_height * dpr).round();
    final image = await recorder.endRecording().toImage(w, h);
    final pixels = (await image.toByteData())!;
    final ink = _Ink(w, h);
    for (var i = 0; i < w * h; i++) {
      ink.alpha[i] = pixels.getUint8(i * 4 + 3);
    }
    return ink;
  }

  /// The same text as the outlines' own coverage, each glyph on the
  /// nearest whole pixel.
  _Ink outlined(ShapedText shaped, int weight, int pageSize) {
    const dpr = 2.0;
    final em = emOf(pageSize);
    final key = (
      size: pageSize,
      weight: weight,
      italic: false,
      halo: 0,
      blur: 0,
      sixteenths: 0,
      phase: 0,
    );
    final g = shaped.glyphs;
    final raster = GlyphRasterizer(fonts).draw(key, [
      for (var i = 0; i < g.length; i += 5)
        g[i].toInt() << 20 | g[i + 1].toInt(),
    ]);
    final cells = <int, int>{
      for (var c = 0; c < raster.cells.length; c += GlyphRaster.stride)
        raster.cells[c].toInt(): c,
    };
    final ink = _Ink((_width * dpr).round(), (_height * dpr).round());
    for (var i = 0; i < g.length; i += 5) {
      final c = cells[g[i].toInt() << 20 | g[i + 1].toInt()];
      if (c == null) continue;
      final cx = raster.cells[c + 1].toInt(), cy = raster.cells[c + 2].toInt();
      final w = raster.cells[c + 3].toInt(), h = raster.cells[c + 4].toInt();
      final x0 = (_penX * dpr + g[i + 2] * em + raster.cells[c + 6]).round();
      final y0 = (_top * dpr + g[i + 3] * em + raster.cells[c + 7]).round();
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          final a = raster.pixels[((cy + y) * raster.width + cx + x) * 4 + 3];
          final at = (y0 + y) * ink.width + x0 + x;
          ink.alpha[at] = math.max(ink.alpha[at], a);
        }
      }
    }
    return ink;
  }

  for (final (name, word) in [('Kurdish', 'هەولێر'), ('Latin', 'Erbil')]) {
    for (final weight in [400, 700]) {
      for (final pageSize in [18, 20, 22]) {
        final em = emOf(pageSize);
        test(
          '$name at weight $weight, ${em.round()} pixels an em, is inked as '
          'its outlines are',
          skip: gpuSkip,
          () async {
            final shaped = layoutText(fonts, word)!;
            final field = await drawn(shaped, weight, em);
            final outline = outlined(shaped, weight, pageSize);
            expect(outline.total, greaterThan(0));
            expect(field.total / outline.total, closeTo(1, 0.08));
            final fieldRuns = field.runs, outlineRuns = outline.runs;
            expect(
              fieldRuns.length,
              outlineRuns.length,
              reason: 'letters join and part where the font has them',
            );
            for (var i = 0; i < fieldRuns.length; i++) {
              expect(fieldRuns[i].$1, closeTo(outlineRuns[i].$1, 1.5));
              expect(fieldRuns[i].$2, closeTo(outlineRuns[i].$2, 1.5));
            }
            expect(field.rows.$1, closeTo(outline.rows.$1, 1.5));
            expect(field.rows.$2, closeTo(outline.rows.$2, 1.5));
          },
        );
      }
    }
  }
}
