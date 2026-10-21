import 'package:flutter/material.dart';

import 'package:vmap/vmap.dart';

import 'main.dart';
import 'showcase.dart';

/// The showcase in a browser, where there is no disk cache to set up. With
/// `--dart-define=TOUR=true` it flies the benchmark tour and prints the
/// result to the console. The address's query sets the same switches a
/// phone reads from `flags.txt`, for example `?labels=off`.
void main() {
  flags.addAll(Uri.base.queryParameters);
  if (flags['worker'] == 'off') VmapEngine.webWorker = null;
  runApp(
    tour
        ? const BenchApp(cacheDirectory: '')
        : const ShowcaseApp(cacheDirectory: ''),
  );
}
