import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'net.dart';

/// One image of a sprite sheet.
class SpriteImage {
  SpriteImage(
    this.source,
    this.width,
    this.height,
    this.pixelRatio, {
    this.sdf = false,
  });

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

  void dispose() {
    image.dispose();
    for (final p in _patterns.values) {
      p?.dispose();
    }
    _patterns.clear();
  }

  /// Loads the sheet at [url], the address without `.json` or `.png`. The
  /// double density sheet is tried first. A copy in [cacheDirectory] is used
  /// when there is one, and replaced for the next run.
  static Future<SpriteSheet?> load(
    String url, {
    String? cacheDirectory,
    String userAgent = 'vmap',
    Map<String, String> headers = const {},
  }) async {
    final base = cacheDirectory == null
        ? null
        : '$cacheDirectory/sprite-${url.hashCode.toRadixString(36)}';
    if (base != null) {
      try {
        final index = File('$base.json');
        final picture = File('$base.png');
        if (index.existsSync() && picture.existsSync()) {
          final sheet = await _decode(
            await index.readAsString(),
            await picture.readAsBytes(),
          );
          _download(url, userAgent, headers, base).ignore();
          return sheet;
        }
      } catch (_) {}
    }
    final fetched = await _download(url, userAgent, headers, base);
    return fetched == null ? null : _decode(fetched.$1, fetched.$2);
  }

  static Future<(String, Uint8List)?> _download(
    String url,
    String userAgent,
    Map<String, String> headers,
    String? saveAs,
  ) async {
    final query = url.indexOf('?');
    final stem = query < 0 ? url : url.substring(0, query);
    final tail = query < 0 ? '' : url.substring(query);
    final client = HttpClient()..userAgent = userAgent;
    try {
      for (final density in const ['@2x', '']) {
        try {
          final index = await _get(client, headers, '$stem$density.json$tail');
          final picture = await _get(client, headers, '$stem$density.png$tail');
          if (index == null || picture == null) continue;
          final text = utf8.decode(index);
          if (saveAs != null) {
            await File('$saveAs.json').parent.create(recursive: true);
            await File('$saveAs.json').writeAsString(text);
            await File('$saveAs.png').writeAsBytes(picture);
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
    HttpClient client,
    Map<String, String> headers,
    String url,
  ) async {
    final request = await openGet(
      client,
      url,
      headers,
    ).timeout(const Duration(seconds: 10));
    final response = await request.close().timeout(const Duration(seconds: 10));
    if (response.statusCode != 200) {
      await response.drain<void>();
      return null;
    }
    final bytes = BytesBuilder(copy: false);
    await response.forEach(bytes.add).timeout(const Duration(seconds: 20));
    return bytes.takeBytes();
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
      );
    }
    return SpriteSheet(frame.image, entries);
  }
}
