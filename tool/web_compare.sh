#!/usr/bin/env bash
# Builds bench/web/compare.html, vmap and MapLibre GL JS side by side on
# one camera, and serves it.
#
#     tool/web_compare.sh [port] [--wasm]
#
# MapLibre and its RTL text plugin come from tool/style_compare.
set -euo pipefail

port=${1:-8780}
wasm=
if [ "${2:-}" = "--wasm" ]; then wasm=--wasm; fi
here="$(cd "$(dirname "$0")" && pwd)"
out=/tmp/vmap_web_compare
(cd "$here/style_compare" && [ -d node_modules ] || npm install --silent)
(cd "$here/../bench" && flutter build web $wasm --no-tree-shake-icons \
  -t lib/compare_web.dart -o "$out")
mkdir -p "$out/dist"
cp "$here"/style_compare/node_modules/maplibre-gl/dist/maplibre-gl{.mjs,-shared.mjs,-worker.mjs,.css} "$out/dist/"
cp "$here/style_compare/node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js" "$out/rtl.js"
echo "http://127.0.0.1:$port/compare.html"
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$out"
