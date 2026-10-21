import '../platform.dart';

export '../platform.dart' show HttpFailure, Net, Reply;

/// The addresses a source lists for its tiles, as one template. `{s}` in an
/// address stands for the hosts a, b and c.
String? tileTemplate(Object? tiles) {
  if (tiles is! List) return null;
  final all = [
    for (final address in tiles.whereType<String>())
      if (address.contains('{s}'))
        for (final host in const ['a', 'b', 'c'])
          address.replaceFirst('{s}', host)
      else
        address,
  ];
  return all.isEmpty ? null : all.join(' ');
}

/// Where a tile is at each address of [template], the one to ask first
/// leading. Tiles are spread over the addresses so no one host serves all.
List<String> tileUrls(String template, int z, int x, int row) {
  final all = template.split(' ');
  final first = (x + row) % all.length;
  return [
    for (var i = 0; i < all.length; i++)
      all[(first + i) % all.length]
          .replaceFirst('{z}', '$z')
          .replaceFirst('{x}', '$x')
          .replaceFirst('{y}', '$row'),
  ];
}

/// Asks each address of [template] for a tile until one answers that it has
/// it or that there is none. The last answer or error stands when all fail.
Future<(String, Reply)> getTile(
  Net client,
  String template,
  int z,
  int x,
  int row,
  Map<String, String> headers,
) async {
  final urls = tileUrls(template, z, x, row);
  for (var i = 0; ; i++) {
    final last = i == urls.length - 1;
    try {
      final reply = await client.get(urls[i], headers);
      final status = reply.status;
      if (last || status == 200 || status == 204 || status == 404) {
        return (urls[i], reply);
      }
    } catch (_) {
      if (last) rethrow;
    }
  }
}

/// A short name for [text] that stays the same across runs and Dart
/// versions, for naming what is kept in the cache directory.
String cacheKey(String text) {
  var hash = 0x811c9dc5;
  for (final unit in text.codeUnits) {
    hash ^= unit;
    hash =
        (hash +
            (hash << 1) +
            (hash << 4) +
            (hash << 7) +
            (hash << 8) +
            (hash << 24)) &
        0xffffffff;
  }
  return hash.toRadixString(36);
}
