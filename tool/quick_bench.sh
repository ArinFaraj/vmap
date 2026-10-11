#!/bin/bash
# Runs the tour once on a device with the app that is already installed, in
# under a minute, and prints its summary. Each argument is a name=value
# switch the app reads at start, for example
#   tool/quick_bench.sh SERIAL labels=off
# Build and install once first with tool/bench_device.sh.
set -euo pipefail
SERIAL="$1"; shift
PKG=dev.vmap.bench
DIR="/sdcard/Android/data/$PKG/files"
adb -s "$SERIAL" shell am force-stop "$PKG"
adb -s "$SERIAL" shell "mkdir -p $DIR; rm -f $DIR/bench.json; printf 'laps=1\n' > $DIR/flags.txt"
for flag in "$@"; do adb -s "$SERIAL" shell "printf '%s\n' '$flag' >> $DIR/flags.txt"; done
adb -s "$SERIAL" shell am start -n "$PKG/.MainActivity" >/dev/null
line=""
for _ in $(seq 1 90); do
  line="$(adb -s "$SERIAL" shell cat "$DIR/bench.json" 2>/dev/null || true)"
  if [ -n "$line" ]; then break; fi
  sleep 1
done
adb -s "$SERIAL" shell am force-stop "$PKG"
adb -s "$SERIAL" shell rm -f "$DIR/flags.txt"
echo "$line"
