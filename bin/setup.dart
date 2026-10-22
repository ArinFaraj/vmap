// Switches Flutter GPU on in the Flutter app this is run in, so vmap draws
// with it, and lets the app load tiles.
//
//     dart run vmap:setup          # makes the changes
//     dart run vmap:setup --check  # reports what is missing, and fails if any
import 'dart:io';

import 'package:vmap/src/setup.dart';

void main(List<String> args) {
  final check = args.contains('--check');
  final root = Directory.current;
  if (!File('${root.path}/pubspec.yaml').existsSync()) {
    stderr.writeln('Run this in the folder of your Flutter app.');
    exit(64);
  }
  final steps = setUpApp(root, check: check);
  var missing = false, byHand = false;
  for (final s in steps) {
    if (s.result == SetupResult.absent) continue;
    final (mark, note) = switch (s.result) {
      SetupResult.ready => ('ok', 'already on'),
      SetupResult.changed => ('+', 'switched on'),
      SetupResult.missing => ('!', 'missing'),
      SetupResult.unrecognised => ('?', 'not found; add it by hand'),
      SetupResult.absent => ('', ''),
    };
    if (s.result == SetupResult.missing) missing = true;
    if (s.result == SetupResult.unrecognised) byHand = true;
    stdout.writeln(
      '${mark.padRight(3)}${s.platform.padRight(8)} ${s.what.padRight(20)} $note  (${s.file})',
    );
  }
  stdout.writeln(
    'Web needs nothing. Build it with `flutter build web --wasm`; the vmap '
    'README says how to serve it.',
  );
  if (byHand) {
    stdout.writeln(
      'Some files were not as Flutter makes them; the vmap README shows '
      'what to add.',
    );
  }
  if (check && missing) exit(1);
}
