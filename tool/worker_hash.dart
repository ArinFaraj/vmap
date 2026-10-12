import 'dart:io';

/// A fingerprint of every Dart file under [lib], which the compiled web
/// worker records so a test can tell when it was built from older code.
/// It leaves out the dependencies compiled into the worker, so a test
/// cannot tell when only those moved.
String workerSourceHash(Directory lib) {
  final files =
      lib
          .listSync(recursive: true)
          .whereType<File>()
          .where((f) => f.path.endsWith('.dart'))
          .toList()
        ..sort((a, b) => a.path.compareTo(b.path));
  var hash = 0x811c9dc5;
  void add(List<int> bytes) {
    for (final b in bytes) {
      hash ^= b;
      hash = (hash * 16777619) & 0xffffffff;
    }
  }

  for (final file in files) {
    add(
      file.uri.pathSegments
          .skip(lib.uri.pathSegments.length - 1)
          .join('/')
          .codeUnits,
    );
    add(file.readAsStringSync().replaceAll('\r\n', '\n').codeUnits);
  }
  return hash.toRadixString(16).padLeft(8, '0');
}

/// The first line of the compiled worker, naming the code it came from.
String workerHeader(String hash) => '// vmap web worker, built from lib $hash';
