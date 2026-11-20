import 'dart:io';

/// A fingerprint of the Dart files under [lib] that the web worker,
/// `web_worker.dart`, is compiled from, which the compiled worker records
/// so a test can tell when it was built from older code. Changing a file
/// the worker does not import leaves it alone. It leaves out the
/// dependencies compiled into the worker, so a test cannot tell when only
/// those moved.
String workerSourceHash(Directory lib) {
  final files = _workerFiles(lib).toList()..sort();
  var hash = 0x811c9dc5;
  void add(List<int> bytes) {
    for (final b in bytes) {
      hash ^= b;
      hash = (hash * 16777619) & 0xffffffff;
    }
  }

  final root = lib.absolute.uri;
  for (final path in files) {
    final file = File(path);
    add(file.uri.toString().substring(root.toString().length).codeUnits);
    add(file.readAsStringSync().replaceAll('\r\n', '\n').codeUnits);
  }
  return hash.toRadixString(16).padLeft(8, '0');
}

/// The first line of the compiled worker, naming the code it came from.
String workerHeader(String hash) => '// vmap web worker, built from lib $hash';

final _directive = RegExp(
  r'^\s*(?:import|export|part)\b[^;]*;',
  multiLine: true,
);
final _uri = RegExp(r'''['"]([^'"]+\.dart)['"]''');

/// Every file under [lib] that `web_worker.dart` reaches through imports,
/// exports and parts, each branch of a conditional import included.
Set<String> _workerFiles(Directory lib) {
  final root = lib.absolute.uri;
  final seen = <String>{};
  final todo = [root.resolve('web_worker.dart')];
  while (todo.isNotEmpty) {
    final file = todo.removeLast();
    if (!seen.add(file.toFilePath())) continue;
    final text = File.fromUri(file).readAsStringSync();
    for (final directive in _directive.allMatches(text)) {
      for (final m in _uri.allMatches(directive[0]!)) {
        final target = m[1]!;
        if (target.startsWith('package:vmap/')) {
          todo.add(root.resolve(target.substring('package:vmap/'.length)));
        } else if (!target.contains(':')) {
          todo.add(file.resolve(target));
        }
      }
    }
  }
  return seen;
}
