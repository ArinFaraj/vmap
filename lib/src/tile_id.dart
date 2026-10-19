/// A tile of a source: its zoom, column and row.
class TileId {
  const TileId(this.z, this.x, this.y, {int over = 0}) : _over = over;

  final int z;
  final int x;
  final int y;
  final int _over;

  /// The zoom the tile is laid out for, MapLibre's overscaled zoom: deeper
  /// than [z] when the source has no deeper tiles, so its symbols are
  /// spaced and sized for the zoom it is shown at.
  int get over => _over > z ? _over : z;

  TileId get parent => TileId(z - 1, x >> 1, y >> 1);

  /// The same tile laid out for zoom [zoom].
  TileId at(int zoom) => TileId(z, x, y, over: zoom);

  @override
  bool operator ==(Object other) =>
      other is TileId &&
      other.z == z &&
      other.x == x &&
      other.y == y &&
      other.over == over;

  @override
  int get hashCode => tileKey(z, x, y) + over - z;

  @override
  String toString() => over > z ? '$z/$x/$y@$over' : '$z/$x/$y';
}

/// One number for a tile down to zoom 22. It stays under the 53 bits a
/// number has in JavaScript.
int tileKey(int z, int x, int y) => (z * 0x400000 + x) * 0x400000 + y;

/// The tile [key] names, as [tileKey] made it.
TileId tileIdOf(int key) {
  final rest = key ~/ 0x400000;
  return TileId(rest ~/ 0x400000, rest % 0x400000, key % 0x400000);
}
