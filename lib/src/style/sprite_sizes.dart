import 'dart:convert';

import '../net/net.dart';

/// The size each image of the style's sprite [sheets] is drawn at, in
/// logical pixels, by its name: the prefix of its sheet and its own name.
/// Read from the sheets' indexes alone, for the tile builder to measure
/// icons by, as MapLibre lays a line's icons out by their size. A sheet
/// that cannot be read adds nothing.
Future<Map<String, (double, double)>> spriteSizes(
  List<(String, String)> sheets,
  FetchBytes fetch,
) async {
  final out = <String, (double, double)>{};
  for (final (prefix, url) in sheets) {
    final query = url.indexOf('?');
    final stem = query < 0 ? url : url.substring(0, query);
    final tail = query < 0 ? '' : url.substring(query);
    for (final density in const ['', '@2x']) {
      try {
        final bytes = await fetch('$stem$density.json$tail');
        if (bytes == null) continue;
        final index = jsonDecode(utf8.decode(bytes)) as Map;
        for (final MapEntry(:key, :value) in index.entries) {
          if (value is! Map) continue;
          final ratio = (value['pixelRatio'] as num? ?? 1).toDouble();
          out['$prefix$key'] = (
            (value['width'] as num? ?? 0) / ratio,
            (value['height'] as num? ?? 0) / ratio,
          );
        }
        break;
      } catch (_) {}
    }
  }
  return out;
}
