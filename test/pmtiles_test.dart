import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/pmtiles.dart';

List<int> _varint(int value) {
  final out = <int>[];
  var v = value;
  while (v >= 0x80) {
    out.add((v & 0x7f) | 0x80);
    v >>= 7;
  }
  return out..add(v);
}

/// A directory of entries given as (tile id, run, offset, length).
List<int> _directory(List<(int, int, int, int)> entries) {
  final out = <int>[..._varint(entries.length)];
  var last = 0;
  for (final e in entries) {
    out.addAll(_varint(e.$1 - last));
    last = e.$1;
  }
  for (final e in entries) {
    out.addAll(_varint(e.$2));
  }
  for (final e in entries) {
    out.addAll(_varint(e.$4));
  }
  for (final e in entries) {
    out.addAll(_varint(e.$3 + 1));
  }
  return out;
}

/// An archive with a root directory that holds tile 0/0/0 itself and sends
/// zoom 1 on to a leaf directory, where two tiles in a row share their
/// bytes. The leaf and the tiles are gzipped, the root is not.
Uint8List _archive() {
  final world = gzip.encode([1, 2, 3]);
  final shared = gzip.encode([9, 9]);
  final leaf = _directory([(1, 2, world.length, shared.length)]);
  final root = _directory([(0, 1, 0, world.length), (1, 0, 0, leaf.length)]);
  const rootAt = 127;
  final leavesAt = rootAt + root.length;
  final tilesAt = leavesAt + leaf.length;
  final header = ByteData(127);
  'PMTiles'.codeUnits.asMap().forEach(header.setUint8);
  header
    ..setUint8(7, 3)
    ..setUint64(8, rootAt, Endian.little)
    ..setUint64(16, root.length, Endian.little)
    ..setUint64(40, leavesAt, Endian.little)
    ..setUint64(48, leaf.length, Endian.little)
    ..setUint64(56, tilesAt, Endian.little)
    ..setUint8(97, 1)
    ..setUint8(98, 2)
    ..setUint8(99, 1)
    ..setUint8(100, 0)
    ..setUint8(101, 1);
  return Uint8List.fromList([
    ...header.buffer.asUint8List(),
    ...root,
    ...leaf,
    ...world,
    ...shared,
  ]);
}

void main() {
  test('tiles are numbered zoom by zoom along a Hilbert curve', () {
    expect(PmTiles.tileId(0, 0, 0), 0);
    expect(PmTiles.tileId(1, 0, 0), 1);
    expect(PmTiles.tileId(1, 0, 1), 2);
    expect(PmTiles.tileId(1, 1, 1), 3);
    expect(PmTiles.tileId(1, 1, 0), 4);
    expect(PmTiles.tileId(2, 0, 0), 5);
    expect(PmTiles.tileId(12, 3423, 1763), 19078479);
  });

  test('a tile is read out of an archive on disk', () async {
    final directory = Directory.systemTemp.createTempSync('vmap_pmtiles');
    addTearDown(() => directory.deleteSync(recursive: true));
    final file = File('${directory.path}/tiny.pmtiles')
      ..writeAsBytesSync(_archive());
    final archive = PmTiles('pmtiles://${file.path}');
    addTearDown(archive.close);

    expect(archive.local, isTrue);
    expect(await archive.maxZoom, 1);
    expect(await archive.tile(0, 0, 0), [1, 2, 3]);
    expect(await archive.tile(1, 0, 0), [9, 9]);
    expect(await archive.tile(1, 0, 1), [9, 9]);
    expect(await archive.tile(1, 1, 1), isEmpty);
    expect(await archive.tile(2, 0, 0), isEmpty);
  }, testOn: 'vm');

  test('only archives are taken for archives', () {
    expect(PmTiles.handles('pmtiles://https://example.org/a.pmtiles'), isTrue);
    expect(PmTiles.handles('https://example.org/planet'), isFalse);
    expect(PmTiles.handles(null), isFalse);
  });
}
