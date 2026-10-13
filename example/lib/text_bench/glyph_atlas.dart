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
  const PlacedGlyph(this.source, this.dx, this.dy);

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
  GlyphAtlas._(this.image, this.labels, this.buildMicros, this.glyphCount);

  final ui.Image image;
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
          for (var i = 0; i < l.length; i += 7)
            PlacedGlyph(
              ui.Rect.fromLTWH(l[i], l[i + 1], l[i + 2], l[i + 3]),
              l[i + 4],
              l[i + 5],
            ),
        ], l.isEmpty ? 0 : l.last),
    ];
    return GlyphAtlas._(image, labels, watch.elapsedMicroseconds, built.glyphs);
  }
}

class _Built {
  _Built(this.rgba, this.width, this.height, this.labels, this.glyphs);

  final Uint8List rgba;
  final int width, height;

  /// Per label, seven numbers per glyph: atlas left, top, width, height,
  /// dx, dy, and the label's width.
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
        rgba[o] = 255;
        rgba[o + 1] = 255;
        rgba[o + 2] = 255;
        rgba[o + 3] = f.alpha[j * f.width + i];
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
        ]);
      }
      pen += p.xAdvance * scale;
    }
    labels.add(Float64List.fromList(out));
  }
  return _Built(rgba, atlasWidth, atlasHeight, labels, fields.length);
}
