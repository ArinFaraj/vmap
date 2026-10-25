import '../tiles/cluster.dart';
import 'expr.dart';
import '../camera/mercator.dart';

/// Where features come from: vector tiles, or GeoJSON cut into tiles here.
/// The tiles a source has: from which zoom, over which part of the world,
/// and in which order its rows are numbered.
class TileCover {
  const TileCover({this.minZoom = 0, this.bounds, this.tms = false});

  /// Reads `minzoom`, `bounds` and `scheme` from a style's source.
  factory TileCover.of(Map<Object?, Object?> source) {
    final bounds = source['bounds'];
    return TileCover(
      minZoom: asNumber(source['minzoom'])?.toInt() ?? 0,
      bounds:
          bounds is List && bounds.length == 4 && bounds.every((b) => b is num)
          ? [for (final b in bounds) (b as num).toDouble()]
          : null,
      tms: source['scheme'] == 'tms',
    );
  }

  final int minZoom;

  /// West, south, east and north in degrees. Null for the whole world.
  final List<double>? bounds;

  /// Rows are numbered from the south, as a TMS server does.
  final bool tms;

  /// Whether the source has the tile [x], [y] at zoom [z].
  bool has(int z, int x, int y) {
    if (z < minZoom) return false;
    final bounds = this.bounds;
    if (bounds == null) return true;
    int column(double lon) => tileColumn(lon, z);
    int row(double lat) => tileRow(lat, z);

    return x >= column(bounds[0]) &&
        x <= column(bounds[2]) &&
        y >= row(bounds[3]) &&
        y <= row(bounds[1]);
  }

  /// The row to ask the server for.
  int row(int z, int y) => tms ? (1 << z) - 1 - y : y;

  String get signature => '$minZoom|${bounds?.join(',')}|$tms';
}

/// A source of vector features: tiles, or GeoJSON the package cuts into
/// tiles.
sealed class VectorSource {
  VectorSource({
    required this.name,
    required this.signature,
    this.maxZoom,
    this.promoteId,
  });

  final String name;
  final int? maxZoom;

  /// The deepest zoom there are tiles for when the style does not say.
  int get defaultMaxZoom;

  /// The source's `promoteId`: the property used as a feature's id, as one
  /// name or as a name per source layer.
  final Object? promoteId;

  /// The property that is the id of the features in [sourceLayer], or null
  /// when they keep the id they come with.
  String? idKey(String sourceLayer) => switch (promoteId) {
    final String name => name,
    final Map<Object?, Object?> names => names[sourceLayer] as String?,
    _ => null,
  };

  /// Equal for two sources that give the same tiles.
  final String signature;
}

final class GeoJsonSource extends VectorSource {
  GeoJsonSource({
    required super.name,
    required super.signature,
    required this.data,
    super.maxZoom,
    super.promoteId,
    this.cluster,
    this.generateId = false,
    this.filter,
    this.buffer,
  });

  /// A GeoJSON document, or the address of one.
  final Object? data;

  /// The source's `buffer`: how far past a tile's edge its features are
  /// kept, in pixels of a 512 pixel tile. Null for MapLibre's 128.
  final double? buffer;

  /// The source's `filter` expression, which features must pass.
  final Object? filter;

  /// Set when the source asks for its points to be clustered.
  final ClusterOptions? cluster;

  /// The features are numbered in order, as `generateId` asks.
  final bool generateId;

  @override
  int get defaultMaxZoom => 18;
}

final class TiledSource extends VectorSource {
  TiledSource({
    required super.name,
    required super.signature,
    this.tileJsonUrl,
    this.tiles,
    super.maxZoom,
    super.promoteId,
    this.cover = const TileCover(),
    this.mlt = false,
  });

  /// A TileJSON address, or a `pmtiles://` archive.
  final String? tileJsonUrl;

  /// The tile addresses, when the style lists them itself.
  final String? tiles;
  final TileCover cover;

  /// The tiles are in the MapLibre Tile format, as `"encoding": "mlt"`
  /// says, rather than Mapbox Vector Tiles.
  final bool mlt;

  /// As the style spec and MapLibre: a source that names no `maxzoom`,
  /// here or in its TileJSON, has tiles down to 22.
  @override
  int get defaultMaxZoom => 22;
}
