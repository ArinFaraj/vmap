@TestOn('vm')
library;

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import '../tool/worker_hash.dart';

void main() {
  test('the web worker vmap ships was built from the code it ships with', () {
    final first = File('assets/vmap_worker.js').readAsLinesSync().first;
    expect(
      first,
      workerHeader(workerSourceHash(Directory('lib'))),
      reason: 'Run dart run tool/build_web_worker.dart and commit the result.',
    );
  });
}
