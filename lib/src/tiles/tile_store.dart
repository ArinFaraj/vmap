import 'dart:async';
import 'dart:typed_data';

import '../net/net.dart';
import '../platform.dart';
import 'pmtiles.dart';
import '../options.dart';
import '../style/style_model.dart' show TileCover;

/// Where the tiles of one tile set come from: the cache directory first,
/// then the archive or the server, and kept on disk once fetched.
class TileStore {
  TileStore._(
    String template, {
    required TileCover cover,
    required String folder,
    required String extension,
    required VmapNetworkOptions config,
    required int perHost,
  }) : this._connected(
         template,
         cover: cover,
         folder: folder,
         extension: extension,
         directory: config.cacheDirectory,
         headers: config.headers,
         client: Net(userAgent: config.userAgent, perHost: perHost),
       );

  TileStore._connected(
    this.template, {
    required this.cover,
    required this.folder,
    required this.extension,
    required this.directory,
    required this.headers,
    required this.client,
  }) : archive = PmTiles.handles(template)
           ? PmTiles(template, client: client, headers: headers)
           : null;

  /// Vector tiles, kept as `.pbf` files.
  TileStore.vector(
    String template, {
    required TileCover cover,
    required VmapNetworkOptions config,
    int perHost = 4,
  }) : this._(
         template,
         cover: cover,
         folder: vectorFolder(template),
         extension: '.pbf',
         config: config,
         perHost: perHost,
       );

  /// Picture tiles, kept as the server sent them.
  TileStore.raster(
    String template, {
    required TileCover cover,
    required VmapNetworkOptions config,
  }) : this._(
         template,
         cover: cover,
         folder: 'raster-${cacheKey(template)}',
         extension: '',
         config: config,
         perHost: 4,
       );

  /// The folder in the cache directory holding the vector tiles of
  /// [template].
  static String vectorFolder(String template) => 'tiles-${cacheKey(template)}';

  /// The addresses of the tiles, or a `pmtiles://` archive.
  final String template;
  final TileCover cover;

  /// The folder in the cache directory holding the tiles.
  final String folder;

  /// The store's own connection, closed with it.
  final Net client;

  /// Ends the name of a tile's file.
  final String extension;
  final Map<String, String> headers;

  /// The archive the tiles are read from, when they are in one.
  final PmTiles? archive;

  /// The cache directory, or null when tiles are not kept.
  final String? directory;

  /// Where tile [z]/[x]/[y] is kept, or null when nothing is: there is no
  /// cache directory, or the tiles are in an archive on this device already.
  String? fileOf(int z, int x, int y) {
    final directory = this.directory;
    if (directory == null || (archive?.local ?? false)) return null;
    return '$directory/$folder/$z/$x/$y$extension';
  }

  bool onDisk(int z, int x, int y) {
    final file = fileOf(z, x, y);
    return file != null && fileExists(file);
  }

  /// The bytes of tile [z]/[x]/[y]: empty for a tile with nothing in it,
  /// or outside the tile set's bounds, and null where the server has no
  /// such tile.
  Future<Uint8List?> read(int z, int x, int y) async {
    if (!cover.has(z, x, y)) return Uint8List(0);
    final file = fileOf(z, x, y);
    if (file != null && fileExists(file)) return readFile(file);
    final bytes = await _fetch(z, x, y);
    if (file != null && bytes != null && bytes.isNotEmpty) {
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
    if (bytes == null || bytes.isEmpty) return false;
    await writeFile(file, bytes);
    return true;
  }

  Future<Uint8List?> _fetch(int z, int x, int y) async {
    if (archive case final archive?) return archive.tile(z, x, y);
    final (url, reply) = await getTile(
      client,
      template,
      z,
      x,
      cover.row(z, y),
      headers,
    );
    if (reply.status == 204) return Uint8List(0);
    if (reply.status == 404) return null;
    if (reply.status != 200) throw HttpFailure(reply.status, url);
    return reply.bytes;
  }

  void close() {
    archive?.close();
    client.close();
  }
}
