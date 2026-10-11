#!/bin/bash
# Builds the benchmark app for one renderer, runs the scripted tour on an
# Android device and prints the frame-time summary.
#   tool/bench_device.sh <device-serial> <ours|vmt|raster> [extra flutter build args]
set -euo pipefail
SERIAL="$1"; MODE="$2"; shift 2
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PKG=dev.vmap.bench
cd "$HERE/example"
fvm spawn stable build apk --profile --dart-define=MODE="$MODE" --dart-define=TOUR=true "$@" >/dev/null
adb -s "$SERIAL" install -r build/app/outputs/flutter-apk/app-profile.apk >/dev/null
OUT="/sdcard/Android/data/$PKG/files/bench.json"
adb -s "$SERIAL" shell rm -f "$OUT"
adb -s "$SERIAL" shell am start -n "$PKG/.MainActivity" >/dev/null
LINE=""
for _ in $(seq 1 240); do
  LINE="$(adb -s "$SERIAL" shell cat "$OUT" 2>/dev/null || true)"
  if [ -n "$LINE" ]; then break; fi
  sleep 1
done
adb -s "$SERIAL" shell screencap -p "/sdcard/vmap_$MODE.png" && adb -s "$SERIAL" pull "/sdcard/vmap_$MODE.png" "/tmp/vmap_phone_$MODE.png" >/dev/null
adb -s "$SERIAL" shell am force-stop "$PKG"
echo "$LINE"
