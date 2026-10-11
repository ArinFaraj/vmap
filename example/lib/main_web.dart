import 'package:flutter/material.dart';

import 'showcase.dart';

/// The showcase in a browser, where there is no disk cache to set up.
void main() => runApp(const ShowcaseApp(cacheDirectory: ''));
