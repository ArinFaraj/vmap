import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tile_id.dart';
import 'package:vmap/src/tiles.dart';

void main() {
  final source = TileSource(
    GeoJsonSource(name: 'g', signature: 'g', data: const <String, Object?>{}),
  );
  const id = TileId(3, 1, 2);

  test('a tile that keeps failing is asked for less and less often', () {
    source.fail(id, 0, corrupt: false);
    expect(source.resting(id, 2999), isTrue);
    expect(source.resting(id, 3000), isFalse);
    source.fail(id, 3000, corrupt: false);
    expect(source.resting(id, 8999), isTrue);
    expect(source.resting(id, 9000), isFalse);
    for (var i = 0; i < 20; i++) {
      source.fail(id, 0, corrupt: false);
    }
    expect(source.resting(id, 383999), isTrue);
    expect(source.resting(id, 384000), isFalse);
  });

  test('a tile that cannot be read waits the longest at once', () {
    const other = TileId(3, 2, 2);
    source.fail(other, 0, corrupt: true);
    expect(source.resting(other, 383999), isTrue);
  });
}
