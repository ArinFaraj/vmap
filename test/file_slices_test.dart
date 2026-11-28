@TestOn('vm')
library;

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/platform/io.dart';

void main() {
  test('concurrent reads each return their requested file slice', () async {
    final directory = await Directory.systemTemp.createTemp('vmap_slices');
    addTearDown(() => directory.delete(recursive: true));
    final contents = List.generate(4096, (index) => index % 251);
    final archive = File('${directory.path}/tiles.pmtiles');
    await archive.writeAsBytes(contents);
    final slices = FileSlices(archive.path);
    addTearDown(slices.close);
    await slices.read(0, 1);

    const ranges = [(71, 19), (492, 104), (3041, 35), (192, 80)];
    final results = await Future.wait([
      for (final (offset, length) in ranges) slices.read(offset, length),
    ]);
    expect(results, [
      for (final (offset, length) in ranges)
        contents.sublist(offset, offset + length),
    ]);
  });
}
