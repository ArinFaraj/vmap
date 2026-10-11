## 0.10.0

- `line-join`: bevel and miter corners beside the round ones. A line with no
  `line-join` now has miter corners, which is the default of the style
  specification. Until now every corner was round.
- `line-offset`: a line drawn to one side of where it runs.
- `text-rotate` for the text of a point.
- `background-pattern`.
- The benchmark app reads `style_file=<path on the device>` from
  `flags.txt`, so a lap can run with any style without a rebuild.

## 0.9.0

- Heatmaps follow their whole colour ramp. Points add up to a density the
  way MapLibre's do, across tile edges, and the density is coloured stop by
  stop.
- `clusterProperties`: a cluster adds up, or takes the largest of, a
  property of its points, for the style to read.

## 0.8.0

- `text-variable-anchor` and `text-radial-offset`: a name that does not fit
  on one side of its point is tried on the others, and stays on the side it
  found while it still fits.
- `icon-anchor` and `icon-offset`.
- `symbol-sort-key`: of two labels in a layer wanting the same room, the one
  with the lower number gets it.

## 0.7.0

- PMTiles: a source whose address starts with `pmtiles://` is read from one
  archive file, over HTTP range requests or from the device, for vector,
  raster and hillshade sources. A file on the device makes an offline map.
- Raster layers read `raster-hue-rotate`, `raster-saturation`,
  `raster-contrast` and `raster-brightness-min` and `-max`.
- `fill-translate`, `line-translate` and `circle-translate`.
- `promoteId` on a source and `generateId` on a GeoJSON source, so features
  without an id of their own can be given state.

## 0.6.1

- Hillshade tiles meet without a line: each is shaded with the heights of
  the tiles around it and blends into them, and the shading is no longer
  doubled where two tiles touch.

## 0.6.0

- GeoJSON sources cluster their points: `cluster`, `clusterRadius`,
  `clusterMaxZoom` and `clusterMinPoints`, with `point_count` and the other
  cluster properties for the style to read.
- `featureStates` and the `feature-state` expression: paint a feature by
  state the app gives it, such as the one that was tapped, without
  rebuilding tiles. `VmapFeature` carries the feature's `id`.
- Circles are no longer cut where two tiles meet.
- Two points of an app's own data a few pixels apart can carry the same
  text. Only one of them was labelled.

## 0.5.1

- A road name on a bend is laid along the road every frame, so its letters
  keep their spacing while the map zooms. They used to drift apart until
  the labels were next placed.
- Changing the data of an overlay source keeps what was drawn until the new
  data is ready, and leaves the map's labels alone when the overlay's layers
  are the same. A moving dot no longer blinks.

## 0.5.0

- Rotation: two fingers turn the map in `VmapGestures` and `VmapMap`, and
  labels are laid out upright on a turned map.
- Every vector source of a style is drawn, not only the busiest one, and
  layers keep the style's order across sources and raster layers.
- GeoJSON sources, inline or by address.
- `VmapOverlay`: sources and layers of your own on top of any style.
- `onFeatureTap` and `featuresAt`: what the style draws at a point.
- Road names bend along curves. `curvedLabels: false` turns it off.
- Polygons are labelled.
- `hillshade` and `heatmap` layers, `line-pattern`, and `icon-color` for SDF
  icons.
- More expressions: `let`, `var`, `slice`, `index-of`, `typeof`, `id`,
  trigonometry and cubic-bezier interpolation.
- `VmapLayer`'s state class is public as `VmapLayerState`.

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
