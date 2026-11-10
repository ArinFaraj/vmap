#!/usr/bin/env bash
# Draws the README's pictures with the bench app on macOS into
# doc/screenshots, all of them or the ones named.
#
#     tool/readme_shots.sh
#     tool/readme_shots.sh hero globe
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
all=(hero erbil builtin dark globe terrain)

# The width of the finished picture, then the bench app's settings.
settings() {
  case $1 in
    hero) echo 1600 LAT=40.7069 LON=-74.0113 ZOOM=15.7 PITCH=72 BEARING=28 \
      WIDTH=1200 HEIGHT=600 WAIT=20 ;;
    erbil) echo 1200 ;;
    builtin) echo 1200 STYLE=builtin ZOOM=13.2 PITCH=0 BEARING=0 ;;
    dark) echo 1200 STYLE=dark ZOOM=13.2 PITCH=0 BEARING=0 ;;
    globe) echo 1200 GLOBE=true LAT=24 LON=40 ZOOM=1.85 PITCH=0 BEARING=0 ;;
    terrain) echo 1200 TERRAIN=true LAT=45.9763 LON=7.6586 ZOOM=12.6 \
      PITCH=63 BEARING=222 WAIT=25 ;;
    *) echo "no picture named $1" >&2 && exit 1 ;;
  esac
}

cd "$root/bench"
if (($# == 0)); then set -- "${all[@]}"; fi
for name in "$@"; do
  line="$(settings "$name")"
  read -r width defines <<<"$line"
  flags=(--dart-define=NAME="$name")
  for d in $defines; do flags+=(--dart-define="$d"); done
  flutter build macos --debug -t lib/readme_shot.dart "${flags[@]}" >/dev/null
  report="$(./build/macos/Build/Products/Debug/vmap_bench.app/Contents/MacOS/vmap_bench |
    grep SHOT_)"
  echo "$report"
  cwebp -quiet -q 82 -resize "$width" 0 "${report##* }" \
    -o "$root/doc/screenshots/$name.webp"
done
