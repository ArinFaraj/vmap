## 0.4.0

- `VmapMap`: a whole map in one widget, with `VmapGestures` in place of
  flutter_map's gestures.
- `pins`: places of interest drawn as round pins instead of the style's
  icons. `VmapPins.standard` covers the place classes of OpenMapTiles styles.
- The built in style names places of interest from zoom 15.5.
- vmap now depends on latlong2 directly.

## 0.3.2

- A frame that places labels draws no new text images, and a frame draws
  about a millisecond of them at most, so the two costs never land together.
  On the test phone the slowest 1 percent of UI frames went from about 8.5 ms
  to about 7 ms.
- Labels are named on the worker isolates and handed to the placer in steps.
- Meshes are cut at 16000 vertices, so no single upload or re-widening is
  long.
- `tool/quick_bench.sh` reruns the tour on a device in half a minute without
  a rebuild.

## 0.3.1

- Label images are kept for 1400 labels instead of 500, so coming back to a
  place does not draw its names again.
- A frame walks only the labels that are showing or fading.

## 0.3.0

- Icons: `icon-image` from the style's sprite sheet, with text placed by
  `text-anchor` and `text-offset`, road shields, and arrows repeated along a
  line.
- Real dashes for `line-dasharray`.
- `fill-outline-color`, `fill-pattern`, `circle` layers and `raster` layers.
- Fill, line and circle paint may read a feature's properties.
- `text-anchor` and `text-offset` now move every point label, so a town's
  name sits above its point as the style asks.

## 0.2.0

- Draws any MapLibre style: `VmapStyle.url`, `VmapStyle.json`, or the built in
  `VmapStyle.light` and `VmapStyle.dark`. The style names the tile source.
- `VmapLayer` goes where a `TileLayer` goes and owns its engine. Use
  `VmapLayer.engine` to share one.
- Markers are flutter_map `Marker`s. `NamedMarker` adds a name the map writes
  beside it. `VmapMarker` is gone.
- Fonts are given as a `TextStyle`. `VmapLabelFont`, `TileSourceConfig.nameKeys`
  and `TileSourceConfig.tileJsonUrl` are gone: name keys and the tile source
  belong to the style.
- The example is a small showcase, and the benchmark runs both renderers on
  the same style.

## 0.1.0

- First release: a vector tile layer for flutter_map drawn with the Flutter
  canvas, with label placement, marker names, a light and a dark palette, a
  disk cache and its own gesture handling.
