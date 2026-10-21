# vmap example and benchmark

`flutter run` shows a map of Erbil's old town. The bar along the top picks
the style, the place icons (none, the style's own, or vmap's pins), and the
layers: a few demo places with cards, a walking route, clusters, road names
that follow bends, and rotation. The compass button turns north up.

Compile time switches select the rest:

- `--dart-define=STYLE=liberty` starts on an OpenFreeMap style: `liberty`,
  `bright`, `positron`, `dark` or `fiord`. Without it the built in style is
  used, and `--dart-define=DARK=true` picks its dark palette.
- `--dart-define=NAMES=name:en,name` sets the label language order.
- `--dart-define=ZOOM=158`, `LAT` and `LON` (in millionths of a degree) set
  the starting camera. The zoom is times ten.
- `--dart-define=PLAIN=true` hides the bar and the demo places.
- `--dart-define=PINS=false` starts with the style's own icons instead of
  pins.
- `--dart-define=OVERLAY=true`, `LIVE=true` and `CLUSTER=true` start with the
  walking route, the route with a moving dot, or the clusters switched on.
- `--dart-define=SHOT=/path/file.png` saves a picture after twelve seconds and
  quits. On a desktop the map is shown at phone size, or at
  `--dart-define=FRAME=1200x560` logical pixels.
- `--dart-define=MODE=vmt` draws with vector_map_tiles instead, and
  `MODE=raster` with flutter_map's raster `TileLayer` in the benchmark.
- `--dart-define=ZOFF=1` reads a style one zoom level deeper, the way
  vector_map_tiles does.
- `--dart-define=TOUR=true` flies the scripted tour and prints frame timings.
  `STRESS=true` swaps in a tour of fast zooms.
- `--dart-define=HUD=true` shows the engine's counters over a bare map.

`tool/bench_device.sh` in the repository root builds a profile app, runs the
tour on an Android device with nothing cached and then again with the cache,
and prints both summaries.

`tool/quick_bench.sh` runs one lap again with the app already installed. It
writes `flags.txt` into the app's external files directory, which the app
reads at start: `laps=1` sets the number of laps, `labels=off` hides the
labels, and `style_file=<path on the device>` draws a style document from a
file.

`tool/readme_shots.sh <dir>` takes every screenshot the README needs, on
macOS, and `tool/readme_images.py <dir>` composes the pictures from them.

In a browser: `flutter run -d chrome -t lib/main_web.dart`.
