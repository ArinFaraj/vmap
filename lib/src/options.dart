import 'package:flutter/foundation.dart';

/// How the map fetches what it loads (the style, tiles, sprites, glyphs)
/// and keeps it between runs.
@immutable
class VmapNetworkOptions {
  const VmapNetworkOptions({
    this.cacheDirectory,
    this.userAgent = 'vmap',
    this.headers = const {},
    this.workers = 2,
    this.spritePixelRatio,
  });

  /// Downloaded tiles are kept here between runs. Null disables the disk
  /// cache.
  final String? cacheDirectory;

  /// Sent as the user agent, which tile servers such as OpenStreetMap's ask
  /// apps to set to their own name.
  final String userAgent;

  /// Sent with every request for a style, its tiles and its pictures, for a
  /// server that wants a key or a token in a header.
  final Map<String, String> headers;

  /// Background isolates building tiles, on platforms that have isolates.
  final int workers;

  /// Above 1 the style's double density sprite sheet is loaded, as MapLibre
  /// picks it. Null takes the screen's.
  final double? spritePixelRatio;

  @override
  bool operator ==(Object other) =>
      other is VmapNetworkOptions &&
      other.cacheDirectory == cacheDirectory &&
      other.userAgent == userAgent &&
      mapEquals(other.headers, headers) &&
      other.workers == workers &&
      other.spritePixelRatio == spritePixelRatio;

  @override
  int get hashCode => Object.hash(
    cacheDirectory,
    userAgent,
    Object.hashAllUnordered(headers.entries.map((e) => (e.key, e.value))),
    workers,
    spritePixelRatio,
  );
}

/// What draws the map.
enum VmapRenderer {
  /// Flutter GPU, through WebGL2 on the web: buildings with depth, terrain
  /// and the globe. Where it does not run, the canvas draws instead.
  gpu,

  /// Flutter's canvas, which runs everywhere: a tilted map with flat
  /// buildings, and no terrain or globe.
  canvas,
}

/// Where the letters of labels come from.
enum VmapGlyphs {
  /// The style's glyph ranges, as MapLibre draws them, with the app's fonts
  /// for what ranges cannot shape (Arabic script letters that need joining
  /// forms Unicode does not give, such as Kurdish ڵ and ێ) and for styles
  /// without `glyphs`.
  style,

  /// The app's fonts for every label: the families [VmapTextStyle] names,
  /// then fonts given to the engine, then the ones vmap ships for Arabic
  /// script and Syriac.
  fonts,
}

/// How the map is drawn.
@immutable
class VmapRenderOptions {
  const VmapRenderOptions({
    this.renderer = VmapRenderer.gpu,
    this.antialias = true,
    this.glyphs = VmapGlyphs.style,
    this.maxCachedTiles = 56,
  });

  final VmapRenderer renderer;

  /// Smooths the edges of buildings, raised ground and the globe on the
  /// GPU. Off, edges are cut at pixel centres, as MapLibre draws without its
  /// `antialias` option. The web never smooths them this way.
  final bool antialias;

  final VmapGlyphs glyphs;

  /// Tiles kept in memory per source beyond those on screen.
  final int maxCachedTiles;
}

/// Which labels the map writes and how they are placed.
@immutable
class VmapLabelOptions {
  const VmapLabelOptions({
    this.visible = true,
    this.curved = true,
    this.crossSourceCollisions = true,
  });

  final bool visible;

  /// Road names follow bends. Off, a name is written only where its road is
  /// straight enough, which is a little cheaper to draw.
  final bool curved;

  /// Labels of different sources keep clear of each other, as MapLibre's
  /// `crossSourceCollisions` map option. Off, each source's labels only
  /// keep clear of their own.
  final bool crossSourceCollisions;

  @override
  bool operator ==(Object other) =>
      other is VmapLabelOptions &&
      other.visible == visible &&
      other.curved == curved &&
      other.crossSourceCollisions == crossSourceCollisions;

  @override
  int get hashCode => Object.hash(visible, curved, crossSourceCollisions);
}
