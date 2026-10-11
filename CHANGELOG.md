## 0.17.2

- Labels in the default JavaScript build no longer wait on images: each is
  drawn as text every frame, with the halo as the text's stroked outline.
  It flew the benchmark tour in Chrome at about 104 frames a second, where
  0.17.0 managed 25 to 32. The `--wasm` build and every other platform draw
  as they did in 0.17.0.
- The 119 frames a second claimed for 0.17.1 did not hold up: later runs of
  the same build gave 23 to 58, because making an image in a browser takes
  longer the busier the machine is. Shared label pages are gone.
- Text in a script whose font the browser fetches late is drawn once the
  font arrives, where it used to stay as empty boxes.

## 0.17.1

- Much faster in a browser. Making an image there costs milliseconds, and a
  label used to get one of its own; labels now share pages of a fixed size
  that fill over a few frames. In Chrome the benchmark tour went from 25
  frames a second to 119 on a 120 Hz screen. Other platforms draw as before.
- The benchmark tour runs in a browser: `--dart-define=TOUR=true` with
  `lib/main_web.dart` prints its result to the console.

## 0.17.0

- Runs on the web. Files, requests and workers sit behind one platform
  layer, and the numbers that needed 64 bits no longer do. In a browser
  there is no disk cache (the browser keeps its own), tiles are built on the
  page's thread, and a PMTiles archive has to be at an `https://` address.
- `clusterExpansionZoom`, `clusterChildren` and `clusterLeaves` on the
  layer's state and on the engine, for zooming in on a tapped cluster or
  listing what is in it.
- `VmapLayer.engine` takes `minZoom` and `maxZoom`.
- A failed load reports an `HttpFailure` with the status and the address.

## 0.16.0

- Dashed lines are drawn in their own colour. They came out white on some
  renderers, which is what made the dark styles look full of dotted lines.
- `line-cap` round and square shape the dashes too, as in MapLibre.
- `line-blur`: a line with a soft edge.
- A label halo wider than a pixel is filled in, with no gaps around thin
  letters.
- `headers` on the map, the layer and `TileSourceConfig`: sent with every
  request for a style, its tiles, sprites and archives.
- `onError` on the map, the layer and the engine tells the app of a style,
  tile or sprite that could not be loaded.
- `reload()` and `clearCache()` on the layer's state and on the engine.
  `clearCache` deletes only what the map itself keeps in the directory.
- A source that lists several `tiles` addresses spreads its tiles over them
  and asks the next when one fails. `{s}` in an address stands for the
  hosts a, b and c.
- `minZoom` and `maxZoom` on `VmapLayer`.

## 0.15.0

- A tile source's `bounds` and `minzoom`: tiles the source does not have
  are not asked for. That matters for a tile set of one region.
- `scheme: tms` for servers that number their rows from the south.
- `attributions` on the layer's state and on the engine lists the credit the style's sources ask for.

## 0.14.0

- `within` and `distance`: a layer can keep the features inside a polygon,
  or within so many metres of a place. `within` used to hide everything.
- `hsl` and `hsla`, `split` and `join`, `number-format` with its fraction
  digits, comparisons with a `collator`, and `get` and `has` on an object.

## 0.13.0

- `text-padding` and `icon-padding`: how much room a label keeps clear of
  the others.
- `text-line-height` and `text-justify` for names of several lines.
- `text-halo-blur`: a halo with a soft edge.
- `text-ignore-placement`. `icon-ignore-placement` now means what the
  specification says: the icon takes no room from other labels. It used to
  be read as `icon-allow-overlap`.

## 0.12.0

- `text-size` and `icon-size` may read the feature's properties, so a city
  can have a larger name than a village from one layer.

## 0.11.0

- A label's colour, opacity and halo, and an icon's opacity and SDF colour, may read
  the feature's properties and `feature-state`, so a picked place can have
  its name in another colour.

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
