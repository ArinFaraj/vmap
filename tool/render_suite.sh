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
port=2900

# The stock server listens with a queue of 5, which drops connections
# when several tests load at once.
python3 -c '
import functools, http.server, sys
http.server.ThreadingHTTPServer.request_queue_size = 256
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=sys.argv[2])
http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), handler).serve_forever()
' "$port" "$suite/assets" >/dev/null 2>&1 &
server=$!
trap 'kill $server 2>/dev/null || true' EXIT

mkdir -p "$out"
cd "$(dirname "$0")/../example"
VMAP_BACKGROUND=1 flutter run -d macos --profile -t lib/render_suite.dart \
  --dart-define=SUITE="$suite" \
  --dart-define=OUT="$out" \
  --dart-define=FILTER="$filter" \
  --dart-define=PORT="$port" \
  --dart-define=GPU="$gpu" \
  --dart-define=PARALLEL="${PARALLEL:-6}" >"$out/run.log" 2>&1 || true
grep -E '^flutter: render suite:' "$out/run.log" || tail -20 "$out/run.log"
echo "report: $out/index.html"
