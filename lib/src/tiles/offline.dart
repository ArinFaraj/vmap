import '../camera/mercator.dart';
import 'query.dart';
import '../raster/raster.dart';
import 'tile_id.dart';
import 'worker.dart';

/// Fetches into the cache directory every tile [pools] and [rasters] draw
/// between [west], [south], [east] and [north] at map zooms [minZoom] to
/// [maxZoom], six at a time. See `VmapEngine.downloadRegion`.
Future<VmapDownload> downloadTiles({
  required Iterable<TilePool> pools,
  required Iterable<TileDrawing> rasters,
  required double west,
  required double south,
  required double east,
  required double north,
  required double minZoom,
  required double maxZoom,
  void Function(int done, int total)? onProgress,
  bool Function()? cancelled,
}) async {
  final jobs = <Future<bool> Function()>[];
  void cover(int from, int to, void Function(int z, int x, int y) add) {
    for (var z = from; z <= to; z++) {
      for (var y = tileRow(north, z); y <= tileRow(south, z); y++) {
        for (var x = tileColumn(west, z); x <= tileColumn(east, z); x++) {
          add(z, x, y);
        }
      }
    }
  }

  for (final pool in pools) {
    int at(double zoom) => tileZoomAt(zoom, pool.maxZoom);
    cover(
      at(minZoom),
      at(maxZoom),
      (z, x, y) => jobs.add(() => pool.keep(TileId(z, x, y))),
    );
  }
  for (final r in rasters) {
    cover(
      r.tileZoom(minZoom),
      r.tileZoom(maxZoom),
      (z, x, y) => jobs.add(() => r.keep(z, x, y)),
    );
  }
  var next = 0, done = 0, fetched = 0, failed = 0;
  Future<void> lane() async {
    while (next < jobs.length && !(cancelled?.call() ?? false)) {
      final job = jobs[next++];
      try {
        if (await job()) fetched++;
      } catch (_) {
        failed++;
      }
      onProgress?.call(++done, jobs.length);
    }
  }

  await Future.wait([for (var i = 0; i < 6; i++) lane()]);
  return VmapDownload(tiles: jobs.length, fetched: fetched, failed: failed);
}
