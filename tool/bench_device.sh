#!/bin/bash
# Builds the benchmark app for one renderer and runs the scripted tour on an
# Android device twice: once straight after a clean install, with nothing
# cached, and once more with whatever the first run left on disk. Prints one
# line of JSON per run.
#   tool/bench_device.sh <device-serial> <ours|vmt|raster> [extra flutter build args]
# for example
#   tool/bench_device.sh SERIAL ours --dart-define=STYLE=liberty
#   tool/bench_device.sh SERIAL vmt --dart-define=STYLE=liberty --dart-define=STRESS=true
set -euo pipefail
SERIAL="$1"; MODE="$2"; shift 2
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PKG=dev.vmap.bench
OUT="/sdcard/Android/data/$PKG/files/bench.json"
cd "$HERE/bench"
fvm flutter build apk --profile --dart-define=MODE="$MODE" --dart-define=TOUR=true "$@" >/dev/null
adb -s "$SERIAL" uninstall "$PKG" >/dev/null 2>&1 || true
adb -s "$SERIAL" install -r build/app/outputs/flutter-apk/app-profile.apk >/dev/null

run() {
  adb -s "$SERIAL" shell rm -f "$OUT"
  adb -s "$SERIAL" shell am start -n "$PKG/.MainActivity" >/dev/null
  local line=""
  for _ in $(seq 1 240); do
    line="$(adb -s "$SERIAL" shell cat "$OUT" 2>/dev/null || true)"
    if [ -n "$line" ]; then break; fi
    sleep 1
  done
  adb -s "$SERIAL" shell am force-stop "$PKG"
  echo "$line"
}

run
run
