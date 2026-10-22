#!/usr/bin/env bash
# Builds bench/web/compare.html, vmap and MapLibre GL JS side by side on
# one camera, and serves it.
#
#     tool/web_compare.sh [port] [--js]
#
# vmap is built for WebAssembly, whose renderer draws on a thread of its
# own, unless --js. The page is served cross-origin isolated, which that
# thread needs, with Flutter's engine files beside it rather than from a
# CDN. MapLibre and its RTL text plugin come from tool/style_compare;
# maplibre.html is MapLibre alone, for benchmarks.
set -euo pipefail

port=${1:-8780}
wasm=--wasm
if [ "${2:-}" = "--js" ]; then wasm=; fi
here="$(cd "$(dirname "$0")" && pwd)"
out=/tmp/vmap_web_compare
(cd "$here/style_compare" && [ -d node_modules ] || npm install --silent)
(cd "$here/.." && dart run tool/build_web_worker.dart)
(cd "$here/../bench" && flutter build web $wasm --no-web-resources-cdn \
  --no-tree-shake-icons -t lib/compare_web.dart -o "$out")
mkdir -p "$out/dist"
cp "$here"/style_compare/node_modules/maplibre-gl/dist/maplibre-gl{.mjs,-shared.mjs,-worker.mjs,.css} "$out/dist/"
cp "$here/style_compare/node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js" "$out/rtl.js"
echo "http://127.0.0.1:$port/compare.html"
python3 - "$port" "$out" <<'PY'
import functools, http.server, sys
class Isolated(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()
    def log_message(self, *args):
        pass
handler = functools.partial(Isolated, directory=sys.argv[2])
http.server.ThreadingHTTPServer(('127.0.0.1', int(sys.argv[1])), handler).serve_forever()
PY
