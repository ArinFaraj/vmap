import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/protocol.dart';
import 'package:vmap/src/tiles/tile_builder.dart';
import 'package:vmap/src/tiles/tile_id.dart';

void main() {
  test('a worker asks the page for an address and is told its bytes', () {
    final wanted = WorkerReply.fromWire(
      const FetchWanted('https://glyphs/a/0-255.pbf').toWire(),
    );
    expect((wanted as FetchWanted).url, 'https://glyphs/a/0-255.pbf');

    final bytes = Uint8List.fromList([1, 2, 3]);
    final fetched = WorkerRequest.fromWire(Fetched('u', bytes).toWire());
    expect((fetched as Fetched).bytes, [1, 2, 3]);
    expect(
      (WorkerRequest.fromWire(
        const Fetched('u', null).toWire(),
      ) as Fetched).bytes,
      isNull,
    );
  });

  test('a worker started early is told its tile address', () {
    final use = WorkerRequest.fromWire(
      const UseTemplate('https://tiles/{z}/{x}/{y}.pbf').toWire(),
    );
    expect((use as UseTemplate).template, 'https://tiles/{z}/{x}/{y}.pbf');
  });

  test('labels sent after their tile name the tile they belong to', () {
    final reply = WorkerReply.fromWire(
      TileRelabeled(
        const TileId(14, 10194, 6422).at(15),
        BuiltTile(const [], const []),
      ).toWire(),
    );
    final relabeled = reply as TileRelabeled;
    expect(relabeled.tile, const TileId(14, 10194, 6422).at(15));
    expect(relabeled.labels.labels, isEmpty);
  });
}
