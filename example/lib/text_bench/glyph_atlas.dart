import 'dart:async';
import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:payv/payv.dart';

import 'sdf.dart';

/// One glyph of a shaped label: where its field sits in the atlas, and
/// where its top left goes relative to the label's centre, in texels.
class PlacedGlyph {
  const PlacedGlyph(this.glyphId, this.source, this.dx, this.dy);

  final int glyphId;
  final ui.Rect source;
  final double dx, dy;
}

/// A label shaped once, ready to draw at any size from the atlas.
class ShapedLabel {
  ShapedLabel(this.glyphs, this.width);

  final List<PlacedGlyph> glyphs;

  /// In texels at [emTexels] per em.
  final double width;
}

/// Shapes labels with payv and draws them from one atlas of glyph distance
/// fields, built off the UI thread.
class GlyphAtlas {
  GlyphAtlas._(
    this.image,
    this.labels,
    this.buildMicros,
    this.glyphCount,
    this.fields,
  );

  final ui.Image image;

  /// The distance fields, kept for baking pages of fixed size.
  final List<GlyphField> fields;
  final List<ShapedLabel> labels;
  final int buildMicros;
  final int glyphCount;

  static Future<GlyphAtlas> build(
    Uint8List fontBytes,
    List<String> texts,
  ) async {
    final watch = Stopwatch()..start();
    final built = await Isolate.run(() => _shapeAndRender(fontBytes, texts));
    final completer = Completer<ui.Image>();
    ui.decodeImageFromPixels(
      built.rgba,
      built.width,
      built.height,
      ui.PixelFormat.rgba8888,
      completer.complete,
    );
    final image = await completer.future;
    final labels = [
      for (final l in built.labels)
        ShapedLabel([
          for (var i = 0; i < l.length; i += 8)
            PlacedGlyph(
              l[i + 7].toInt(),
              ui.Rect.fromLTWH(l[i], l[i + 1], l[i + 2], l[i + 3]),
              l[i + 4],
              l[i + 5],
            ),
        ], l.isEmpty ? 0 : l[l.length - 2]),
    ];
    return GlyphAtlas._(
      image,
      labels,
      watch.elapsedMicroseconds,
      built.glyphs,
      built.fields,
    );
  }
}

class _Built {
  _Built(
    this.rgba,
    this.width,
    this.height,
    this.labels,
    this.glyphs,
    this.fields,
  );

  final List<GlyphField> fields;

  final Uint8List rgba;
  final int width, height;

  /// Per label, eight numbers per glyph: atlas left, top, width, height,
  /// dx, dy, the label's width and the glyph id.
  final List<Float64List> labels;
  final int glyphs;
}

_Built _shapeAndRender(Uint8List fontBytes, List<String> texts) {
  final font = OpenTypeFont.parse(fontBytes);
  final shaper = Shaper(font);
  final scale = emTexels / font.unitsPerEm;
  final fields = <int, GlyphField?>{};
  final runs = <(ShapedRun, double)>[];
  for (final text in texts) {
    final run = shaper.shape(text);
    for (final g in run.infos) {
      fields.putIfAbsent(g.glyphId, () => glyphField(font, g.glyphId));
    }
    runs.add((run, run.totalXAdvance * scale));
  }

  const atlasWidth = 1024;
  var x = 0, y = 0, row = 0;
  final slots = <int, (int, int)>{};
  final sorted = fields.values.whereType<GlyphField>().toList()
    ..sort((a, b) => b.height - a.height);
  for (final f in sorted) {
    if (x + f.width > atlasWidth) {
      x = 0;
      y += row + 1;
      row = 0;
    }
    slots[f.glyphId] = (x, y);
    x += f.width + 1;
    row = math.max(row, f.height);
  }
  final atlasHeight = y + row + 1;
  final rgba = Uint8List(atlasWidth * atlasHeight * 4);
  for (final f in sorted) {
    final (sx, sy) = slots[f.glyphId]!;
    for (var j = 0; j < f.height; j++) {
      for (var i = 0; i < f.width; i++) {
        final o = ((sy + j) * atlasWidth + sx + i) * 4;
        final a = f.alpha[j * f.width + i];
        rgba[o] = rgba[o + 1] = rgba[o + 2] = rgba[o + 3] = a;
      }
    }
  }

  final ascent = 0.35 * emTexels;
  final labels = <Float64List>[];
  for (final (run, width) in runs) {
    final out = <double>[];
    var pen = -width / 2;
    for (var i = 0; i < run.length; i++) {
      final p = run.positions[i];
      final f = fields[run.infos[i].glyphId];
      if (f != null) {
        final (sx, sy) = slots[f.glyphId]!;
        out.addAll([
          sx.toDouble(),
          sy.toDouble(),
          f.width.toDouble(),
          f.height.toDouble(),
          pen + p.xOffset * scale + f.left,
          ascent - p.yOffset * scale + f.top,
          width,
          f.glyphId.toDouble(),
        ]);
      }
      pen += p.xAdvance * scale;
    }
    labels.add(Float64List.fromList(out));
  }
  return _Built(rgba, atlasWidth, atlasHeight, labels, fields.length, sorted);
}

/// One size of glyph images baked from the distance fields: sharp edges and
/// halos with no filter at draw time. [scale] is device pixels per texel.
class BakedPage {
  BakedPage(this.scale, this.ink, this.halo, this.rects);

  final double scale;
  final ui.Image ink, halo;

  /// Per glyph id: its rectangle in both images.
  final Map<int, ui.Rect> rects;
}

class _Field {
  _Field(this.id, this.w, this.h, this.alpha);

  final int id, w, h;
  final Uint8List alpha;
}

class _Bake {
  _Bake(this.ink, this.halo, this.width, this.height, this.rects);

  final Uint8List ink, halo;
  final int width, height;
  final Map<int, (int, int, int, int)> rects;
}

_Bake _bake(List<_Field> fields, double scale, double haloTexels) {
  const pageWidth = 1024;
  var x = 0, y = 0, row = 0;
  final slots = <int, (int, int, int, int)>{};
  for (final f in fields) {
    final w = (f.w * scale).ceil(), h = (f.h * scale).ceil();
    if (x + w > pageWidth) {
      x = 0;
      y += row + 1;
      row = 0;
    }
    slots[f.id] = (x, y, w, h);
    x += w + 1;
    row = math.max(row, h);
  }
  final height = y + row + 1;
  final ink = Uint8List(pageWidth * height * 4);
  final halo = Uint8List(pageWidth * height * 4);
  final k = 2 * spread * scale;
  final haloEdge = 0.5 - haloTexels / (2 * spread);
  for (final f in fields) {
    final (sx, sy, w, h) = slots[f.id]!;
    for (var j = 0; j < h; j++) {
      final v = (j + 0.5) / scale - 0.5;
      final v0 = v.floor().clamp(0, f.h - 1), v1 = (v0 + 1).clamp(0, f.h - 1);
      final fv = (v - v0).clamp(0.0, 1.0);
      for (var i = 0; i < w; i++) {
        final u = (i + 0.5) / scale - 0.5;
        final u0 = u.floor().clamp(0, f.w - 1), u1 = (u0 + 1).clamp(0, f.w - 1);
        final fu = (u - u0).clamp(0.0, 1.0);
        double at(int a, int b) => f.alpha[b * f.w + a] / 255;
        final a =
            (at(u0, v0) * (1 - fu) + at(u1, v0) * fu) * (1 - fv) +
            (at(u0, v1) * (1 - fu) + at(u1, v1) * fu) * fv;
        final o = ((sy + j) * pageWidth + sx + i) * 4;
        final inkA = ((a - 0.5) * k + 0.5).clamp(0.0, 1.0);
        final haloA = ((a - haloEdge) * k + 0.5).clamp(0.0, 1.0);
        ink[o] = ink[o + 1] = ink[o + 2] = ink[o + 3] = (inkA * 255).round();
        halo[o] = halo[o + 1] = halo[o + 2] = halo[o + 3] = (haloA * 255)
            .round();
      }
    }
  }
  return _Bake(ink, halo, pageWidth, height, slots);
}

extension Baking on GlyphAtlas {
  /// Bakes pages at each of [scales] in an isolate, with a halo reaching
  /// [haloPixels] device pixels past each glyph.
  Future<List<BakedPage>> bake(List<double> scales, double haloPixels) async {
    final fields = [
      for (final f in this.fields)
        _Field(f.glyphId, f.width, f.height, f.alpha),
    ];
    final baked = await Isolate.run(
      () => [for (final s in scales) _bake(fields, s, haloPixels / s)],
    );
    Future<ui.Image> image(Uint8List rgba, int w, int h) {
      final c = Completer<ui.Image>();
      ui.decodeImageFromPixels(rgba, w, h, ui.PixelFormat.rgba8888, c.complete);
      return c.future;
    }

    return [
      for (final (i, b) in baked.indexed)
        BakedPage(
          scales[i],
          await image(b.ink, b.width, b.height),
          await image(b.halo, b.width, b.height),
          {
            for (final MapEntry(:key, value: (x, y, w, h)) in b.rects.entries)
              key: ui.Rect.fromLTWH(
                x.toDouble(),
                y.toDouble(),
                w.toDouble(),
                h.toDouble(),
              ),
          },
        ),
    ];
  }
}
