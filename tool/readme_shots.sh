#!/usr/bin/env bash
# Takes the screenshots tool/readme_images.py composes the README pictures
# from, by running the example on macOS once per picture.
#
#     tool/readme_shots.sh <out dir> [name ...]
#
# With names, only those pictures are taken again.
set -euo pipefail

out=${1:?usage: tool/readme_shots.sh <out dir> [name ...]}
shift
mkdir -p "$out"
cd "$(dirname "$0")/../bench"

shots=(
  "hero-default|"
  "hero-night|DARK=true OVERLAY=true"
  "plain-default|PLAIN=true PINS=false"
  "plain-liberty|PLAIN=true PINS=false STYLE=liberty"
  "plain-bright|PLAIN=true PINS=false STYLE=bright"
  "plain-night|PLAIN=true PINS=false DARK=true"
  "plain-positron|PLAIN=true PINS=false STYLE=positron"
  "plain-fiord|PLAIN=true PINS=false STYLE=fiord"
  "far-liberty|PLAIN=true PINS=false STYLE=liberty ZOOM=80"
  "wide-liberty|PLAIN=true PINS=false STYLE=liberty ZOOM=120"
  "plain-liberty-deep|PLAIN=true PINS=false STYLE=liberty ZOOM=172"
  "names-local|PLAIN=true PINS=false NAMES=name"
  "names-en|PLAIN=true PINS=false NAMES=name:en,name"
  "pins-default|PLAIN=true"
  "pins-liberty|PLAIN=true STYLE=liberty ZOOM=165"
  "route|PLAIN=true PINS=false OVERLAY=true ZOOM=162"
  "clusters|PLAIN=true PINS=false CLUSTER=true ZOOM=128"
  "banner-liberty|PLAIN=true STYLE=liberty OVERLAY=true FRAME=1200x560 ZOOM=156"
  "banner-night|PLAIN=true DARK=true OVERLAY=true FRAME=1200x560 ZOOM=156"
  "banner-positron|PLAIN=true STYLE=positron OVERLAY=true FRAME=1200x560 ZOOM=156"
)

for shot in "${shots[@]}"; do
  name=${shot%%|*}
  defines=${shot#*|}
  if [ $# -gt 0 ] && [[ " $* " != *" $name "* ]]; then continue; fi
  args=(--dart-define=SHOT="$out/$name.png")
  for define in $defines; do args+=(--dart-define="$define"); done
  echo "== $name"
  rm -f "$out/$name.png"
  flutter run -d macos --profile "${args[@]}" >"$out/$name.log" 2>&1 || true
  if [ -f "$out/$name.png" ]; then echo "   saved"; else echo "   FAILED, see $out/$name.log"; fi
done
