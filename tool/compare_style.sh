#!/usr/bin/env bash
# Renders the views in tool/style_compare/views.json in MapLibre GL JS and in
# vmap, and reports how far each is apart, with the pictures side by side.
#
#     tool/compare_style.sh [out dir] [--refresh] [--canvas]
#
# MapLibre's pictures are kept in the out dir and captured again only with
# --refresh: the tiles behind them change as OpenStreetMap does.
set -euo pipefail

out=${1:-/tmp/vmap_style_compare}
refresh=false
gpu=--gpu
for arg in "$@"; do
  case $arg in
    --refresh) refresh=true ;;
    --canvas) gpu= ;;
  esac
done
here="$(cd "$(dirname "$0")" && pwd)"

if $refresh || [ ! -d "$out/references/test" ]; then
  (cd "$here/style_compare" && [ -d node_modules ] || npm install --silent)
  node "$here/style_compare/capture.mjs" "$out/references"
fi
"$here/render_suite.sh" "$out/references" "$out/report" "" $gpu
