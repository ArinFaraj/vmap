/// A tile of a source: its zoom, column and row.
class TileId {
  const TileId(this.z, this.x, this.y);

  final int z;
  final int x;
  final int y;

  TileId get parent => TileId(z - 1, x >> 1, y >> 1);

  @override
  bool operator ==(Object other) =>
      other is TileId && other.z == z && other.x == x && other.y == y;

  @override
  int get hashCode => tileKey(z, x, y);

  @override
  String toString() => '$z/$x/$y';
}

/// One number for a tile down to zoom 22. It stays under the 53 bits a
/// number has in JavaScript.
int tileKey(int z, int x, int y) => (z * 0x400000 + x) * 0x400000 + y;
