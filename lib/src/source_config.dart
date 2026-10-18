/// How tiles are fetched and kept.
class TileSourceConfig {
  const TileSourceConfig({
    this.cacheDirectory,
    this.userAgent = 'vmap',
    this.headers = const {},
    this.workers = 2,
    this.spritePixelRatio,
  });

  /// Downloaded tiles are kept here between runs. Null disables the disk
  /// cache.
  final String? cacheDirectory;
  final String userAgent;

  /// Sent with every request for a style, its tiles and its pictures, for a
  /// server that wants a key or a token in a header.
  final Map<String, String> headers;
  final int workers;

  /// Above 1 the style's double density sprite sheet is loaded, as MapLibre
  /// picks it. Null takes the screen's.
  final double? spritePixelRatio;
}
