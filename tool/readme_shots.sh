#!/usr/bin/env bash
# Draws the README's pictures with the bench app on macOS, once per picture,
# into doc/images/hero.png and doc/screenshots.
#
#     tool/readme_shots.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
container="$HOME/Library/Containers/dev.vmap.bench/Data/tmp"
cd "$root/bench"

shot() {
  local name=$1
  shift
  local defines=(--dart-define=NAME="$name")
  for d in "$@"; do defines+=(--dart-define="$d"); done
  flutter build macos --debug -t lib/readme_shot.dart "${defines[@]}" >/dev/null
  ./build/macos/Build/Products/Debug/vmap_bench.app/Contents/MacOS/vmap_bench |
    grep SHOT_
}

shot hero
shot builtin STYLE=builtin ZOOM=13.2 PITCH=0 BEARING=0

cp "$container/hero.png" "$root/doc/images/hero.png"
cwebp -quiet -q 80 -resize 1200 0 "$container/hero.png" \
  -o "$root/doc/screenshots/hero.webp"
cwebp -quiet -q 80 -resize 900 0 "$container/builtin.png" \
  -o "$root/doc/screenshots/builtin.webp"
