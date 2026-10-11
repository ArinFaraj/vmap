# vmap example and benchmark

`flutter run` shows the map with a few markers. Compile time switches select
the rest:

- `--dart-define=MODE=ours|vmt|raster` picks the renderer: vmap,
  vector_map_tiles, or flutter_map's raster `TileLayer`.
- `--dart-define=TOUR=true` flies the scripted tour and prints frame timings.
- `--dart-define=DARK=true` uses the dark palette.
- `--dart-define=NAMES=name:en,name` sets the label language order.
- `--dart-define=ZOOM=125` sets the starting zoom, times ten.

`tool/bench_device.sh` in the repository root builds, runs the tour on an
Android device and prints the summary.
