import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';

/// Waits until [file] holds [bytes], which a cache writes after the fetch
/// that read them has answered.
Future<void> holds(File file, List<int> bytes) async {
  final watch = Stopwatch()..start();
  while (!_holds(file, bytes)) {
    if (watch.elapsed > const Duration(seconds: 5)) {
      fail('${file.path} does not hold what was fetched');
    }
    await Future<void>.delayed(const Duration(milliseconds: 10));
  }
}

bool _holds(File file, List<int> bytes) {
  if (!file.existsSync()) return false;
  try {
    return listEquals(file.readAsBytesSync(), bytes);
  } on FileSystemException {
    return false;
  }
}
