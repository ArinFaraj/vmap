#!/usr/bin/env bash
# Runs the tests tagged gpu, which draw with Flutter GPU and are skipped by
# a plain `flutter test`. Needs a machine with Impeller, such as a Mac.
set -euo pipefail
cd "$(dirname "$0")/.."
flutter test --enable-impeller --enable-flutter-gpu --tags gpu "$@"
