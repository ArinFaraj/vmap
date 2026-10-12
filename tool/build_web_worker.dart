import 'dart:convert';
import 'dart:io';

import 'worker_hash.dart';

/// Compiles the script that builds tiles off the page's thread in a browser
/// into `assets/vmap_worker.js`, which vmap ships and loads by itself.
/// Run it from the package root after changing anything under `lib`:
///
///     dart run tool/build_web_worker.dart
///
/// `--flutter <directory>` names the Flutter SDK when `flutter` is not on
/// the PATH and `FLUTTER_ROOT` is unset.
Future<void> main(List<String> arguments) async {
  String? option(String name) {
    final at = arguments.indexOf(name);
    return at < 0 || at + 1 >= arguments.length ? null : arguments[at + 1];
  }

  const output = 'assets/vmap_worker.js';
  final root =
      option('--flutter') ??
      Platform.environment['FLUTTER_ROOT'] ??
      await _flutterRoot();
  if (root == null) {
    stderr.writeln('Flutter was not found. Pass --flutter <directory>.');
    exit(2);
  }
  final sdk = '$root/bin/cache/flutter_web_sdk';
  if (!File('$sdk/libraries.json').existsSync()) {
    stderr.writeln(
      'No web SDK in $sdk. Run "flutter precache --web" and try again.',
    );
    exit(2);
  }
  final entry = File('.dart_tool/vmap/worker_entry.dart')
    ..createSync(recursive: true)
    ..writeAsStringSync(
      "import 'package:vmap/web_worker.dart';\n\n"
      'void main() => runVmapWorker();\n',
    );
  final result = await Process.run('$root/bin/dart', [
    'compile',
    'js',
    '-O2',
    '--no-source-maps',
    '--libraries-spec=$sdk/libraries.json',
    '--platform-binaries=$sdk/kernel',
    '-o',
    output,
    entry.path,
  ]);
  stdout.write(result.stdout);
  stderr.write(result.stderr);
  final leftover = File('$output.deps');
  if (leftover.existsSync()) leftover.deleteSync();
  if (result.exitCode == 0) {
    final script = File(output);
    script.writeAsStringSync(
      '${workerHeader(workerSourceHash(Directory('lib')))}\n'
      '${script.readAsStringSync()}',
    );
  }
  exit(result.exitCode);
}

Future<String?> _flutterRoot() async {
  try {
    final result = await Process.run('flutter', ['--version', '--machine']);
    if (result.exitCode != 0) return null;
    final json = jsonDecode(result.stdout as String) as Map<String, dynamic>;
    return json['flutterRoot'] as String?;
  } on Object {
    return null;
  }
}
