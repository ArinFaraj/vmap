import 'package:flutter/material.dart';

import 'main.dart';
import 'showcase.dart';

/// The showcase in a browser, where there is no disk cache to set up. With
/// `--dart-define=TOUR=true` it flies the benchmark tour and prints the
/// result to the console.
void main() => runApp(
  tour
      ? const BenchApp(cacheDirectory: '')
      : const ShowcaseApp(cacheDirectory: ''),
);
