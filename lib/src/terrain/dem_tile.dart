import 'dart:math' as math;
import 'dart:typed_data';

import '../tile_id.dart';

/// One tile of a raster DEM as heights in metres, with a border one pixel
/// wide on every side. The border starts as a copy of the edge, and takes
/// the neighbouring tile's heights once it arrives ([backfill]), as
/// MapLibre's `DEMData.backfillBorder` does, so heights sampled across a
/// tile's edge meet the next tile's without a seam.
class DemTile {
  DemTile._(this.dim, this._heights, this.min, this.max);

  /// Decodes [rgba], [dim] pixels on a side, in Terrarium (`terrarium`) or
  /// Mapbox Terrain-RGB encoding.
  factory DemTile.decode(Uint8List rgba, int dim, {required bool terrarium}) {
    final stride = dim + 2;
    final heights = Float32List(stride * stride);
    var lo = double.infinity, hi = -double.infinity;
    for (var y = 0; y < dim; y++) {
      for (var x = 0; x < dim; x++) {
        final o = (y * dim + x) * 4;
        final r = rgba[o], g = rgba[o + 1], b = rgba[o + 2];
        final metres = terrarium
            ? r * 256 + g + b / 256 - 32768
            : -10000 + (r * 65536 + g * 256 + b) * 0.1;
        heights[(y + 1) * stride + x + 1] = metres;
        lo = math.min(lo, metres);
        hi = math.max(hi, metres);
      }
    }
    final tile = DemTile._(dim, heights, lo, hi);
    for (var y = -1; y <= dim; y++) {
      final row = y.clamp(0, dim - 1);
      tile._set(-1, y, tile.at(0, row));
      tile._set(dim, y, tile.at(dim - 1, row));
    }
    for (var x = 0; x < dim; x++) {
      tile._set(x, -1, tile.at(x, 0));
      tile._set(x, dim, tile.at(x, dim - 1));
    }
    return tile;
  }

  /// Pixels on a side, not counting the border.
  final int dim;
  final Float32List _heights;

  /// The lowest and highest height in the tile, in metres.
  final double min, max;

  int _index(int x, int y) => (y + 1) * (dim + 2) + x + 1;

  void _set(int x, int y, double metres) => _heights[_index(x, y)] = metres;

  /// The height of pixel [x], [y], from -1 to [dim] inclusive.
  double at(int x, int y) => _heights[_index(x, y)];

  /// Copies into this tile's border the facing edge of [other], the tile
  /// [dx], [dy] steps away (each -1, 0 or 1, not both 0).
  void backfill(DemTile other, int dx, int dy) {
    if (other.dim != dim) return;
    final xs = dx < 0 ? -1 : (dx > 0 ? dim : null);
    final ys = dy < 0 ? -1 : (dy > 0 ? dim : null);
    int theirs(int v, int d) => d < 0 ? v + dim : (d > 0 ? v - dim : v);
    for (var y = ys ?? 0; y <= (ys ?? dim - 1); y++) {
      for (var x = xs ?? 0; x <= (xs ?? dim - 1); x++) {
        _set(x, y, other.at(theirs(x, dx), theirs(y, dy)));
      }
    }
  }

  /// The height at [x], [y] in pixels from the tile's corner, pixel centres
  /// at half pixels, blended from the four nearest.
  double sample(double x, double y) {
    final fx = (x - 0.5).clamp(-1.0, dim.toDouble());
    final fy = (y - 0.5).clamp(-1.0, dim.toDouble());
    final x0 = fx.floor().clamp(-1, dim - 1),
        y0 = fy.floor().clamp(-1, dim - 1);
    final tx = fx - x0, ty = fy - y0;
    final top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
    final bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
    return top * (1 - ty) + bottom * ty;
  }
}

/// The DEM tiles loaded so far, and the height of any point of the world
/// from the deepest of them that covers it.
class DemTiles {
  final Map<TileId, DemTile> _tiles = {};

  /// Moves on whenever a tile arrives or goes, so what was made from the
  /// heights can tell it is stale.
  int generation = 0;

  int get length => _tiles.length;

  /// Keeps [tile] as [id], filling its border and its neighbours' from each
  /// other.
  void add(TileId id, DemTile tile) {
    generation++;
    _tiles[id] = tile;
    final n = 1 << id.z;
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        final y = id.y + dy;
        if (y < 0 || y >= n) continue;
        final other = _tiles[TileId(id.z, (id.x + dx) % n, y)];
        if (other == null) continue;
        tile.backfill(other, dx, dy);
        other.backfill(tile, -dx, -dy);
      }
    }
  }

  void remove(TileId id) {
    if (_tiles.remove(id) != null) generation++;
  }

  bool has(TileId id) => _tiles.containsKey(id);

  /// The height in metres at [wx], [wy] in fractions of the world, from the
  /// deepest loaded tile at or above [maxZoom]; 0 where none is loaded.
  double heightAt(double wx, double wy, int maxZoom) {
    for (var z = maxZoom; z >= 0; z--) {
      final n = 1 << z;
      final tx = wx * n, ty = wy * n;
      final x = tx.floor(), y = ty.floor();
      if (y < 0 || y >= n) continue;
      final tile = _tiles[TileId(z, x % n, y)];
      if (tile == null) continue;
      return tile.sample((tx - x) * tile.dim, (ty - y) * tile.dim);
    }
    return 0;
  }
}
