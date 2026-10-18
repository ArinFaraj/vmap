#!/usr/bin/env bash
# Runs MapLibre GL JS's render tests through vmap on macOS and writes a
# report, scored as MapLibre's own runner scores them.
#
#     tool/render_suite.sh <maplibre-gl-js checkout> [out dir] [filter] [--gpu]
#
# The filter is a comma separated list of test id prefixes, for example
# "line-width,fill-color". The checkout only needs test/integration.
set -euo pipefail

checkout=${1:?usage: tool/render_suite.sh <maplibre-gl-js checkout> [out dir] [filter] [--gpu]}
out=${2:-/tmp/vmap_render_suite}
filter=${3:-}
gpu=false
if [ "${4:-}" = "--gpu" ]; then gpu=true; fi
suite="$(cd "$checkout/test/integration" && pwd)"
port=${PORT:-2900}

# The stock server listens with a queue of 5, which drops connections
# when several tests load at once.
# As MapLibre's runner, tiles under sparse204 at zoom 1 answer 204.
python3 -c '
import functools, http.server, sys
class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if "/sparse204/1-" in self.path:
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()
http.server.ThreadingHTTPServer.request_queue_size = 256
handler = functools.partial(Handler, directory=sys.argv[2])
http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), handler).serve_forever()
' "$port" "$suite/assets" >/dev/null 2>&1 &
server=$!
# The real-world tests read @mapbox/mvt-fixtures from a second server, as
# MapLibre's runner serves them; npm install in the checkout provides them.
fixtures="$checkout/node_modules/@mapbox/mvt-fixtures/real-world"
mvt=
if [ -d "$fixtures" ]; then
  python3 -m http.server 2901 --bind 127.0.0.1 --directory "$fixtures" >/dev/null 2>&1 &
  mvt=$!
fi
trap 'kill $server $mvt 2>/dev/null || true' EXIT

mkdir -p "$out"
printf '%s\n' "$filter" >"$out/filter"
scope="$(cd "$(dirname "$0")" && pwd)/render_suite_out_of_scope.tsv"
cd "$(dirname "$0")/../example"
VMAP_BACKGROUND=1 flutter run -d macos --profile -t lib/render_suite.dart \
  --dart-define=SUITE="$suite" \
  --dart-define=OUT="$out" \
  --dart-define=FILTER="$filter" \
  --dart-define=OUT_OF_SCOPE="$scope" \
  --dart-define=PORT="$port" \
  --dart-define=GPU="$gpu" \
  --dart-define=MULTISAMPLE="${MULTISAMPLE:-true}" \
  --dart-define=PARALLEL="${PARALLEL:-6}" >"$out/run.log" 2>&1 || true
grep -E '^flutter: (render suite|in scope):' "$out/run.log" || tail -20 "$out/run.log"
echo "report: $out/index.html"
