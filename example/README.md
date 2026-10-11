# vmap example and benchmark

`flutter run` shows a small map of Erbil's old town with a few places on it.
Tap a pin for its card, and the button at the top to walk through the styles.

Compile time switches select the rest:

- `--dart-define=STYLE=liberty` starts on an OpenFreeMap style: `liberty`,
  `bright`, `positron`, `dark` or `fiord`. Without it the built in style is
  used, and `--dart-define=DARK=true` picks its dark palette.
- `--dart-define=NAMES=name:en,name` sets the label language order.
- `--dart-define=ZOOM=158`, `LAT` and `LON` (in millionths of a degree) set
  the starting camera. The zoom is times ten.
- `--dart-define=PLAIN=true` hides the pins and the controls.
- `--dart-define=SHOT=/path/file.png` saves a picture after twelve seconds and
  quits. On a desktop the map is shown at phone size.
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

`tool/readme_images.py` composes the pictures in the README from `SHOT`
screenshots.
