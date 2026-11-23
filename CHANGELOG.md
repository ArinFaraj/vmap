## 0.30.2

- When the GPU refuses the texture or command buffer used for label text, the map falls back to the canvas instead of throwing on every frame ("Texture overwrite failed", "Failed to submit CommandBuffer").

## 0.30.1

- Right-to-left names that wrap keep their direction on every line.

## 0.30.0

- Fixed: on Android phones using Vulkan the map was blank under its labels (0.27.0 to 0.29.3).
- Fixed: road shield numbers were missing on Android phones using OpenGL ES.
- Tile geometry is kept only on the GPU, for about a quarter less memory. The GPU heap holds up to 256 MB, and `maxCachedTiles` decides which tiles stay.
- Chrome: frames go to the page with no copy. Page memory went from about 1.1 GB to 250 MB, and a tilted Erbil from about 80 to 160 fps uncapped.
- Firefox runs close to the screen's rate (81 to 120 fps on a 120 Hz screen, was 22 to 52).
- Fixed: in Firefox and Safari a place's main label could be missing.
- Widget markers stay on the map while it moves on the web.
- Text shaped from fonts (Kurdish, Arabic) is drawn on the GPU from distance fields too.
- Unscaled icons are sampled pixel for pixel, as in MapLibre.
- Depends on `material_ui` for pin icons, since Flutter 3.50 deprecates `package:flutter/material.dart`.
- Fixed a web crash when the sky shaders compiled at startup.

## 0.29.3

- Fixed: thin light lines at the joins of Arabic, Kurdish and other cursive letters on the GPU renderer.
- A freshly loaded map finishes its labels much sooner (a tilted Erbil in 3.0 s, was 8.7 s).
- 16 raster tiles load at once, up from 4.

## 0.29.2

- A heatmap is drawn into the image below it: one image a frame instead of three, and a web globe with a heatmap paints in 2 to 3 ms instead of 10.

## 0.29.1

- Web: about a third less memory allocated per frame.
- Less work per frame on every platform.

## 0.29.0

- In views tilted past 60 degrees, buildings reach the far edge of the view. `VmapRenderOptions(farBuildings: false)` keeps MapLibre's behavior.
- Road names on a tilted map are laid out once and projected on the GPU.
- Timeline marks are off unless built with `--dart-define=VMAP_TIMELINE=true`.

## 0.28.0

- `VmapController.headFor` preloads tiles where your own camera code is heading.
- Something always stays drawn while tiles load, on the flat map, the globe and raised ground.
- Tiles load the way MapLibre loads them: shared downloads, requests for tiles left behind are cancelled, and raster tiles are cached by zoom.
- Layers show and hide at their zoom range at once instead of fading.
- Fixed: raster tiles on the globe or terrain flashed white on the web, and changing the overlay's paint dropped the labels.
- Includes the 0.27.2 fixes.

## 0.27.2

- A pixel image the GPU refuses to decode fails its load instead of hanging.
- A GPU that refuses a texture or command buffer hands the map to the canvas instead of throwing out of paint.

## 0.27.1

- `toLatLng` and `toScreen` return null before the map is laid out instead of throwing.

## 0.27.0

vmap is now its own map engine, drawn on the GPU. flutter_map support moved to the `vmap_flutter_map` package.

**Breaking:**

- `VmapLayer`, `VmapMap` (now `VmapFlutterMap`), `VmapGestures` and `NamedMarker` moved to `vmap_flutter_map`.
- `VMap` and `VMapController` are `Vmap` and `VmapController`. `MapCameraPosition` is `VmapCamera`, with a `LatLng` center.
- Settings are grouped in `VmapNetworkOptions` (was `TileSourceConfig`), `VmapRenderOptions` and `VmapLabelOptions`.
- Zoom levels follow MapLibre, one below flutter_map.
- `onError` receives a `VmapError`. Stats moved to `package:vmap/debug.dart`.
- `interactive`, `rotate`, `tilt` and `keyboard` are replaced by `gestures: VmapGestureOptions(...)`.

**New:**

- The `Vmap` widget: style, overlay, style edits, feature state, widget markers, pins, 3D buildings, terrain, the globe, sky and fog, with MapLibre's gestures for touch, mouse, trackpad and keyboard.
- The GPU renderer is the default, with the canvas where Flutter GPU isn't available. Needs Flutter 3.47.1 or newer.
- `VmapController`: `flyTo`, `easeTo`, `fitBounds`, `featuresAt`, `featuresIn`, cluster queries, `downloadRegion`, `toScreen` and `toLatLng`.
- `Vmap.onFeatureTap`, limited by `tappableLayers`.
- Labels use the style's glyph ranges by default, with vmap's own OpenType shaper and Unicode bidi for the rest.
- MapLibre Tile (MLT) sources, `VmapOverlay.images` (like `addImage`), raster fade and buildings that follow `feature-state`.
- `package:vmap/gestures.dart` exports the gesture recognizer.

**Web:**

- About 6x faster in Safari, the `--wasm` build works, fast zooming no longer freezes the page, and the map loads sooner.

## 0.26.0

- Published on pub.dev.
- On the web, tiles are built in a web worker that ships with vmap. Nothing to set up.
- **Breaking:** `dart run vmap:build_web_worker` is gone. Needs Flutter 3.41 or newer.

## 0.25.0

- **Breaking:** engine methods are called on `VmapLayerState.engine`. `VmapStats` holds the last frame, with running totals in `stats.timings`. Web workers must be rebuilt, and cached tiles are fetched again once.
- Fixes for `icon-rotate`, markers at the poles, cluster lookups, the PMTiles user agent and cache cleanup.

## 0.24.0

- `featuresIn(southWest, northEast)`: the features in a box.

## 0.23.0

- `text-translate` along lines, `text-translate` and `icon-translate` by zoom, and `icon-halo-blur`.

## 0.22.0

- `styleEdits`: change a style layer's paint, layout, filter, zoom range or visibility by its `id`.

## 0.21.1

- Web: road names are images again, for fewer skipped frames.

## 0.21.0

- An optional web worker for building tiles (`VmapEngine.webWorker`).

## 0.20.0

- `line-gradient`.

## 0.19.0

- `downloadRegion`, for offline maps.

## 0.18.0

- `image` sources, `*-translate-anchor`, `text-max-angle`, `line-blur` on dashes, SDF icon halos, `hillshade-accent-color` and `raster-resampling`.

## 0.17.2

- Web: labels are drawn as text every frame, about 104 fps on the benchmark tour (was 25 to 32).

## 0.17.1

- Web: labels share image pages.

## 0.17.0

- Runs on the web.
- Cluster queries, `minZoom` and `maxZoom` on `VmapLayer.engine`, and `HttpFailure` errors.

## 0.16.0

- Dashed lines in their own colour, `line-cap` on dashes, `line-blur` and solid wide halos.
- `headers`, `onError`, `reload()`, `clearCache()`, several `tiles` addresses with `{s}`, and `minZoom` and `maxZoom` on `VmapLayer`.

## 0.15.0

- A source's `bounds`, `minzoom` and `scheme: tms`, and `attributions`.

## 0.14.0

- `within`, `distance`, `hsl`, `hsla`, `split`, `join`, `number-format`, collators, and `get` and `has` on objects.

## 0.13.0

- `text-padding`, `icon-padding`, `text-line-height`, `text-justify`, `text-halo-blur` and `text-ignore-placement`. `icon-ignore-placement` follows the spec.

## 0.12.0

- `text-size` and `icon-size` can read feature properties.

## 0.11.0

- Label colours, opacity and halos can read feature properties and `feature-state`.

## 0.10.0

- `line-join` (miter by default, as the spec says), `line-offset`, `text-rotate` and `background-pattern`.

## 0.9.0

- Heatmaps follow their whole colour ramp, and `clusterProperties`.

## 0.8.0

- `text-variable-anchor`, `text-radial-offset`, `icon-anchor`, `icon-offset` and `symbol-sort-key`.

## 0.7.0

- PMTiles (`pmtiles://`), raster colour adjustments, `*-translate`, `promoteId` and `generateId`.

## 0.6.1

- Hillshade tiles meet without a seam.

## 0.6.0

- GeoJSON clustering, `featureStates` and `feature-state`, and circles across tile edges.

## 0.5.1

- Curved road names keep their spacing while zooming, and overlay data updates without blinking.

## 0.5.0

- Rotation, every vector source, GeoJSON, `VmapOverlay`, `onFeatureTap` and `featuresAt`, curved road names, polygon labels, hillshade, heatmaps, `line-pattern` and more expressions.

## 0.4.0

- The `VmapMap` widget and `pins`.

## 0.3.2

- Smoother frames: label text drawing is spread over frames.

## 0.3.1

- A bigger label image cache.

## 0.3.0

- Icons, road shields, real dashes, patterns, and circle and raster layers.

## 0.2.0

- Any MapLibre style, `VmapLayer`, and flutter_map `Marker`s with `NamedMarker`.

## 0.1.0

- First release: a vector tile layer for flutter_map drawn on the canvas.
