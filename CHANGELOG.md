## 0.31.0

- Tiles fade in instead of popping in, over `VmapRenderOptions.tileFade` (200 ms
  by default).
- Fewer blank layers and missing buildings while tiles load.
- Tiles along a `flyTo` or `headFor` load sooner, and a turning camera stops
  rebuilding tiles.
- Web: about 40% fewer WebGL calls a frame, and no flash where the globe meets
  the flat map.
- The cache keeps glyph ranges, writes files whole, and fetches broken files
  again.
- `flyTo`, `easeTo` and `fitBounds` take the short way across the antimeridian.
- `markers`, `styleEdits` and `featureStates` edited in place are picked up.
- A map drawing with an app's `engine` hands it its `markers`.
- New: `featuresAt(layers:)`, `VmapEngineOptions` and `VmapEngineOwner`.
- Android needs no setup.
- **Breaking:** `dart run vmap:setup` is removed. The README lists the steps for
  other platforms.

## 0.30.2

- Fixed: a GPU that refused the label text's texture or command buffer made
  every frame throw. The map now falls back to the canvas.

## 0.30.1

- Fixed: right-to-left names that wrap lost their direction on later lines.

## 0.30.0

- Fixed: a blank map on Android phones using Vulkan (since 0.27.0).
- Fixed: missing road shield numbers on Android phones using OpenGL ES.
- Fixed: a place's main label could be missing in Firefox and Safari.
- About a quarter less memory.
- Much faster in Chrome and Firefox.
- Pin icons come from `material_ui`.

## 0.29.3

- Fixed: thin lines at the joins of Arabic and Kurdish letters.
- Labels finish drawing much sooner after the map loads.

## 0.29.2

- Heatmaps and layers above the labels cost less to draw, and the web allocates
  less each frame.

## 0.29.0

- Buildings reach the horizon in views tilted past 60 degrees.
  `farBuildings: false` turns it off.
- Timeline marks are off unless built with `--dart-define=VMAP_TIMELINE=true`.

## 0.28.0

- `VmapController.headFor` loads tiles ahead of your own camera code.
- Something always stays drawn while tiles load.
- Tiles load and cache the way MapLibre does.
- Layers show and hide at their zoom range at once instead of fading.

## 0.27.2

- Fixed: a GPU that refused a texture or command buffer made paint throw. The
  map now falls back to the canvas.
- Fixed: an image the GPU could not decode left its load waiting forever.

## 0.27.1

- Fixed: `toLatLng` and `toScreen` threw before the map was laid out.

## 0.27.0

vmap is now its own map engine, drawn on the GPU. flutter_map support moved to
`vmap_flutter_map`.

- New `Vmap` widget with 3D buildings, terrain, the globe and MapLibre's
  gestures.
- New `VmapController`: `flyTo`, `fitBounds`, `featuresAt`, `downloadRegion` and
  more.
- Labels use the style's glyph ranges, with vmap's own shaper for the rest.
- Much faster on the web, and `--wasm` works.
- **Breaking:** most of the API changed:
  - `VMap` and `VMapController` are `Vmap` and `VmapController`, and
    `MapCameraPosition` is `VmapCamera`.
  - `VmapLayer`, `VmapMap` (now `VmapFlutterMap`), `VmapGestures` and
    `NamedMarker` moved to `vmap_flutter_map`.
  - Settings are in `VmapNetworkOptions`, `VmapRenderOptions`,
    `VmapLabelOptions` and `VmapGestureOptions`.
  - Zoom levels follow MapLibre, one below flutter_map.
  - `onError` receives a `VmapError`, and stats moved to
    `package:vmap/debug.dart`.
  - Needs Flutter 3.47.1 or newer.

## 0.26.0

- First release on pub.dev.
- On the web, tiles are built in a web worker that ships with vmap.

## Before 0.26.0

Not published. vmap grew from a flutter_map vector tile layer into a MapLibre
style renderer with icons, clustering, PMTiles, heatmaps, hillshade, data-driven
styling, offline downloads and web support.
