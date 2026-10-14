import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/terrain/dem_tile.dart';
import 'package:vmap/src/tile_id.dart';

/// A [dim] square Terrarium tile whose every pixel is [metres] high, or
/// [height] of its x and y when given.
DemTile flat(int dim, double metres, {double Function(int x, int y)? height}) {
  final rgba = Uint8List(dim * dim * 4);
  for (var y = 0; y < dim; y++) {
    for (var x = 0; x < dim; x++) {
      final v = (height?.call(x, y) ?? metres) + 32768;
      final o = (y * dim + x) * 4;
      rgba
        ..[o] = v ~/ 256
        ..[o + 1] = (v % 256).floor()
        ..[o + 2] = ((v - v.floor()) * 256).round()
        ..[o + 3] = 255;
    }
  }
  return DemTile.decode(rgba, dim, terrarium: true);
}

void main() {
  test('Terrarium and Terrain-RGB heights decode to metres', () {
    final t = flat(4, 1234);
    expect(t.at(2, 2), closeTo(1234, 0.01));
    expect([t.min, t.max], [closeTo(1234, 0.01), closeTo(1234, 0.01)]);

    // Terrain-RGB: -10000 + (r * 65536 + g * 256 + b) * 0.1.
    final rgb = Uint8List.fromList([1, 134, 160, 255]);
    expect(DemTile.decode(rgb, 1, terrarium: false).at(0, 0), closeTo(0, 0.01));
  });

  test('the border copies the edge until a neighbour arrives', () {
    final t = flat(4, 0, height: (x, y) => x * 10.0);
    expect(t.at(-1, 0), t.at(0, 0));
    expect(t.at(4, 3), t.at(3, 3));
    final right = flat(4, 500);
    t.backfill(right, 1, 0);
    expect(t.at(4, 1), closeTo(500, 0.01));
    expect(t.at(-1, 1), t.at(0, 1));
  });

  test('a sample blends the nearest pixels', () {
    final t = flat(4, 0, height: (x, y) => x * 10.0);
    expect(t.sample(1.5, 1.5), closeTo(10, 1e-3));
    expect(t.sample(2, 1.5), closeTo(15, 1e-3));
  });

  test('a height comes from the deepest tile loaded', () {
    final tiles = DemTiles()
      ..add(const TileId(0, 0, 0), flat(4, 100))
      ..add(const TileId(1, 1, 1), flat(4, 700));
    expect(tiles.heightAt(0.75, 0.75, 1), closeTo(700, 0.01));
    expect(tiles.heightAt(0.25, 0.25, 1), closeTo(100, 0.01));
    expect(DemTiles().heightAt(0.5, 0.5, 3), 0);
  });

  test('neighbours fill each other\'s borders', () {
    final tiles = DemTiles()
      ..add(const TileId(1, 0, 0), flat(4, 100))
      ..add(const TileId(1, 1, 0), flat(4, 300));
    // Half way across the seam between them, at the left tile's right edge.
    expect(tiles.heightAt(0.5 - 1e-9, 0.25, 1), closeTo(200, 1));
  });
}
