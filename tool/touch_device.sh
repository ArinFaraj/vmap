#!/bin/bash
# Records frame times while real swipes are injected on an Android device, so
# the gesture path and the display's touch-boosted refresh rate are measured.
#   tool/touch_device.sh <device-serial> <ours|vmt|raster> [extra flutter build args]
set -euo pipefail
SERIAL="$1"; MODE="$2"; shift 2
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PKG=dev.vmap.bench
cd "$HERE/bench"
fvm spawn stable build apk --profile --dart-define=MODE="$MODE" --dart-define=REC=true "$@" >/dev/null
adb -s "$SERIAL" install -r build/app/outputs/flutter-apk/app-profile.apk >/dev/null
OUT="/sdcard/Android/data/$PKG/files/bench.json"
adb -s "$SERIAL" shell rm -f "$OUT"
adb -s "$SERIAL" shell am start -n "$PKG/.MainActivity" >/dev/null
sleep 5
adb -s "$SERIAL" shell '
i=0
while [ $i -lt 9 ]; do
  input swipe 800 1700 250 900 220
  input swipe 250 900 800 1500 160
  input swipe 540 1900 540 700 120
  input swipe 300 800 780 1800 300
  input tap 540 1200; input tap 540 1200
  i=$((i+1))
done' >/dev/null 2>&1 || true
LINE=""
for _ in $(seq 1 60); do
  LINE="$(adb -s "$SERIAL" shell cat "$OUT" 2>/dev/null || true)"
  if [ -n "$LINE" ]; then break; fi
  sleep 1
done
adb -s "$SERIAL" shell am force-stop "$PKG"
echo "$LINE"
