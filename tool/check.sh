#!/usr/bin/env bash
# Runs what CI's check job runs: formatting, the analyzer, the tests of the
# package, the flutter_map adapter and the example, and the publish dry run.
#
#     tool/check.sh          everything
#     tool/check.sh --gpu    also the tests that draw with Flutter GPU (macOS)
set -euo pipefail
cd "$(dirname "$0")/.."

for dir in . vmap_flutter_map example bench demo; do
  flutter pub get --directory "$dir" >/dev/null
done
dart format --output=none --set-exit-if-changed \
  lib test tool bench/lib example/lib example/test demo/lib vmap_flutter_map
flutter analyze
flutter test
(cd vmap_flutter_map && flutter test)
(cd example && flutter test)
if [ "${1:-}" = "--gpu" ]; then
  flutter test --enable-impeller --enable-flutter-gpu --tags gpu
fi
dart pub publish --dry-run
