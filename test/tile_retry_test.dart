import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/tile_id.dart';
import 'package:vmap/src/tiles/tiles.dart';

void main() {
  final retries = TileRetries();
  const id = TileId(3, 1, 2);

  test('a tile that keeps failing is asked for less and less often', () {
    retries.fail(id, 0, corrupt: false);
    expect(retries.resting(id, 2999), isTrue);
    expect(retries.resting(id, 3000), isFalse);
    retries.fail(id, 3000, corrupt: false);
    expect(retries.resting(id, 8999), isTrue);
    expect(retries.resting(id, 9000), isFalse);
    for (var i = 0; i < 20; i++) {
      retries.fail(id, 0, corrupt: false);
    }
    expect(retries.resting(id, 383999), isTrue);
    expect(retries.resting(id, 384000), isFalse);
  });

  test('a tile that cannot be read waits the longest at once', () {
    const other = TileId(3, 2, 2);
    retries.fail(other, 0, corrupt: true);
    expect(retries.resting(other, 383999), isTrue);
  });
}
