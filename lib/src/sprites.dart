import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'net.dart' show cacheKey;
import 'platform.dart';

/// A picture of the app's own for the style to draw by name, as an icon or
/// a pattern, as if it were in the style's sprite sheet.
class VmapImage {
  const VmapImage(this.image, {this.pixelRatio = 1, this.sdf = false});

  final ui.Image image;

  /// The picture's pixels to a logical pixel: 2 for a picture drawn for
  /// screens of double density.
  final double pixelRatio;

  /// The picture is a distance field: a shape with no colour of its own,
  /// drawn in the style's `icon-color`.
  final bool sdf;
}

/// One image of a sprite sheet.
class SpriteImage {
  SpriteImage(
    this.source,
    this.width,
    this.height,
    this.pixelRatio, {
    this.sdf = false,
    this.stretchX,
    this.stretchY,
    this.content,
  });

  /// The spans of the picture, in its own pixels, that grow when it is
  /// fitted to text; the rest keeps its size.
  final List<(double, double)>? stretchX, stretchY;

  /// The part of the picture, left, top, right and bottom in its own
  /// pixels, that text is fitted into.
  final List<double>? content;

  /// Where it sits in the sheet, in the sheet's pixels.
  final ui.Rect source;

  /// Its size in logical pixels.
  final double width;
  final double height;
  final double pixelRatio;

  /// The picture is a distance field: a shape with no colour of its own,
  /// drawn in the colour the style gives it.
  final bool sdf;
}

/// The icons and patterns a style draws with.
class SpriteSheet {
  SpriteSheet(this.image, this.entries);

  final ui.Image image;
  final Map<String, SpriteImage> entries;
  final Map<String, ui.Image?> _patterns = {};

  /// The named image on its own, which a repeating fill needs.
  ui.Image? pattern(String name) => _patterns.putIfAbsent(name, () {
    final entry = entries[name];
    if (entry == null) return null;
    final recorder = ui.PictureRecorder();
    ui.Canvas(recorder).drawImageRect(
      image,
      entry.source,
      ui.Offset.zero & entry.source.size,
      ui.Paint(),
    );
    final picture = recorder.endRecording();
    final out = picture.toImageSync(
      entry.source.width.round(),
      entry.source.height.round(),
    );
    picture.dispose();
    return out;
  });

  /// A sheet of [base]'s images and [added] together in one picture, the
  /// added images under the base's and in its place where a name is in
  /// both.
  static SpriteSheet join(SpriteSheet? base, Map<String, VmapImage> added) {
    final width = math.max(
      base?.image.width ?? 0,
      added.values.fold(0, (w, a) => math.max(w, a.image.width)),
    );
    final entries = {...?base?.entries};
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    if (base != null) canvas.drawImage(base.image, ui.Offset.zero, ui.Paint());
    var x = 0, y = base?.image.height ?? 0, shelf = 0;
    for (final MapEntry(key: name, value: a) in added.entries) {
      final w = a.image.width, h = a.image.height;
      if (x + w > width) {
        x = 0;
        y += shelf;
        shelf = 0;
      }
      canvas.drawImage(
        a.image,
        ui.Offset(x.toDouble(), y.toDouble()),
        ui.Paint(),
      );
      entries[name] = SpriteImage(
        ui.Rect.fromLTWH(
          x.toDouble(),
          y.toDouble(),
          w.toDouble(),
          h.toDouble(),
        ),
        w / a.pixelRatio,
        h / a.pixelRatio,
        a.pixelRatio,
        sdf: a.sdf,
      );
      x += w;
      shelf = math.max(shelf, h);
    }
    final picture = recorder.endRecording();
    final image = picture.toImageSync(
      math.max(width, 1),
      math.max(y + shelf, 1),
    );
    picture.dispose();
    return SpriteSheet(image, entries);
  }

  void dispose() {
    image.dispose();
    for (final p in _patterns.values) {
      p?.dispose();
    }
    _patterns.clear();
  }

  /// Loads the sheet at [url], the address without `.json` or `.png`. The
  /// double density sheet is tried first when [pixelRatio], the screen's
  /// when null, is above 1. A copy in [cacheDirectory] is used
  /// when there is one, and replaced for the next run.
  static Future<SpriteSheet?> load(
    String url, {
    String? cacheDirectory,
    String userAgent = 'vmap',
    Map<String, String> headers = const {},
    double? pixelRatio,
  }) async {
    final ratio =
        pixelRatio ??
        ui.PlatformDispatcher.instance.implicitView?.devicePixelRatio ??
        2;
    final densities = ratio > 1 ? const ['@2x', ''] : const ['', '@2x'];
    final base = cacheDirectory == null
        ? null
        : '$cacheDirectory/sprite-${cacheKey('$url${densities.first}')}';
    if (base != null) {
      try {
        if (fileExists('$base.json') && fileExists('$base.png')) {
          final sheet = await _decode(
            utf8.decode(await readFile('$base.json')),
            await readFile('$base.png'),
          );
          _download(url, userAgent, headers, base, densities).ignore();
          return sheet;
        }
      } catch (_) {}
    }
    final fetched = await _download(url, userAgent, headers, base, densities);
    return fetched == null ? null : _decode(fetched.$1, fetched.$2);
  }

  static Future<(String, Uint8List)?> _download(
    String url,
    String userAgent,
    Map<String, String> headers,
    String? saveAs,
    List<String> densities,
  ) async {
    final query = url.indexOf('?');
    final stem = query < 0 ? url : url.substring(0, query);
    final tail = query < 0 ? '' : url.substring(query);
    final client = Net(userAgent: userAgent);
    try {
      for (final density in densities) {
        try {
          final index = await _get(client, headers, '$stem$density.json$tail');
          final picture = await _get(client, headers, '$stem$density.png$tail');
          if (index == null || picture == null) continue;
          final text = utf8.decode(index);
          if (saveAs != null) {
            await writeFile('$saveAs.json', index);
            await writeFile('$saveAs.png', picture);
          }
          return (text, picture);
        } catch (_) {}
      }
      return null;
    } finally {
      client.close();
    }
  }

  static Future<Uint8List?> _get(
    Net client,
    Map<String, String> headers,
    String url,
  ) async {
    final reply = await client.get(url, headers);
    return reply.status == 200 ? reply.bytes : null;
  }

  static Future<SpriteSheet> _decode(String index, Uint8List picture) async {
    final codec = await ui.instantiateImageCodec(picture);
    final frame = await codec.getNextFrame();
    codec.dispose();
    final entries = <String, SpriteImage>{};
    for (final e in (jsonDecode(index) as Map<String, dynamic>).entries) {
      final v = e.value;
      if (v is! Map) continue;
      final ratio = (v['pixelRatio'] as num?)?.toDouble() ?? 1;
      final w = (v['width'] as num).toDouble();
      final h = (v['height'] as num).toDouble();
      entries[e.key] = SpriteImage(
        ui.Rect.fromLTWH(
          (v['x'] as num).toDouble(),
          (v['y'] as num).toDouble(),
          w,
          h,
        ),
        w / ratio,
        h / ratio,
        ratio,
        sdf: v['sdf'] == true,
        stretchX: _spans(v['stretchX']),
        stretchY: _spans(v['stretchY']),
        content: switch (v['content']) {
          [final num l, final num t, final num r, final num b] => [
            l.toDouble(),
            t.toDouble(),
            r.toDouble(),
            b.toDouble(),
          ],
          _ => null,
        },
      );
    }
    return SpriteSheet(frame.image, entries);
  }
}

List<(double, double)>? _spans(Object? value) {
  if (value is! List || value.isEmpty) return null;
  return [
    for (final span in value)
      if (span case [final num from, final num to])
        (from.toDouble(), to.toDouble()),
  ];
}
