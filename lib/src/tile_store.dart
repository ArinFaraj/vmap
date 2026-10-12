import 'dart:async';
import 'dart:typed_data';

import 'net.dart';
import 'platform.dart';
import 'pmtiles.dart';
import 'style.dart' show TileCover;

/// Where the tiles of one tile set come from: the cache directory first,
/// then the archive or the server, and kept on disk once fetched.
class TileStore {
  TileStore(
    this.template, {
    required this.cover,
    required this.folder,
    required this.client,
    String? cacheDirectory,
    this.extension = '',
    this.headers = const {},
    String userAgent = 'vmap',
  }) : archive = PmTiles.handles(template)
           ? PmTiles(
               template,
               client: client,
               userAgent: userAgent,
               headers: headers,
             )
           : null,
       _directory = cacheDirectory;

  /// The name of the folder in the cache directory holding the tiles of
  /// [template], begun with [prefix].
  static String folderOf(String prefix, String template) =>
      '$prefix-${cacheKey(template)}';

  /// The addresses of the tiles, or a `pmtiles://` archive.
  final String template;
  final TileCover cover;

  /// The folder in the cache directory, as [folderOf] names it.
  final String folder;
  final Net client;

  /// Ends the name of a tile's file.
  final String extension;
  final Map<String, String> headers;

  /// The archive the tiles are read from, when they are in one.
  final PmTiles? archive;
  final String? _directory;

  /// Where tile [z]/[x]/[y] is kept, or null when nothing is: there is no
  /// cache directory, or the tiles are in an archive on this device already.
  String? fileOf(int z, int x, int y) {
    final directory = _directory;
    if (directory == null || (archive?.local ?? false)) return null;
    return '$directory/$folder/$z/$x/$y$extension';
  }

  bool onDisk(int z, int x, int y) {
    final file = fileOf(z, x, y);
    return file != null && fileExists(file);
  }

  /// The bytes of tile [z]/[x]/[y], empty when the tile set has no such
  /// tile.
  Future<Uint8List> read(int z, int x, int y) async {
    if (!cover.has(z, x, y)) return Uint8List(0);
    final file = fileOf(z, x, y);
    if (file != null && fileExists(file)) return readFile(file);
    final bytes = await _fetch(z, x, y);
    if (file != null && bytes.isNotEmpty) {
      unawaited(writeFile(file, bytes).then<void>((_) {}, onError: (_) {}));
    }
    return bytes;
  }

  /// Fetches tile [z]/[x]/[y] into the cache directory unless it is there
  /// already, and returns whether it had to.
  Future<bool> keep(int z, int x, int y) async {
    final file = fileOf(z, x, y);
    if (file == null || !cover.has(z, x, y) || fileExists(file)) return false;
    final bytes = await _fetch(z, x, y);
    if (bytes.isEmpty) return false;
    await writeFile(file, bytes);
    return true;
  }

  Future<Uint8List> _fetch(int z, int x, int y) async {
    if (archive case final archive?) return archive.tile(z, x, y);
    final (url, reply) = await getTile(
      client,
      template,
      z,
      x,
      cover.row(z, y),
      headers,
    );
    if (reply.status == 204 || reply.status == 404) return Uint8List(0);
    if (reply.status != 200) throw HttpFailure(reply.status, url);
    return reply.bytes;
  }

  void close() => archive?.close();
}
