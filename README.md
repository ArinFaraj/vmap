<h1 align="center">vmap</h1>

<p align="center">
  Vector tiles for <a href="https://pub.dev/packages/flutter_map">flutter_map</a>,
  drawn with the plain Flutter canvas.<br>
  Any MapLibre style. No GPU package, no minimum Android version of its own.
</p>

![vmap showing three styles](doc/images/hero.png)

## From raster to vector in one line

vmap is a flutter_map layer. Keep your `FlutterMap`, your `MapController`,
your `MarkerLayer` and your gestures, and swap the tile layer:

```diff
 FlutterMap(
   options: MapOptions(initialCenter: LatLng(36.19, 44.01), initialZoom: 14),
   children: [
-    TileLayer(
-      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
-      userAgentPackageName: 'com.example.app',
-    ),
+    VmapLayer(
+      style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'),
+      userAgentPackageName: 'com.example.app',
+    ),
     MarkerLayer(markers: markers),
   ],
 )
```

## Any MapLibre style

Point it at a style JSON, yours or a tile server's. The style decides the
colours, the widths, the text, the icons and where the tiles come from.

![The same place in six styles](doc/images/styles.png)

```dart
VmapLayer(style: VmapStyle.url('https://tiles.openfreemap.org/styles/bright'))
VmapLayer(style: VmapStyle.json(jsonDecode(myStyle)))
VmapLayer(style: VmapStyle.light) // the built in style, and VmapStyle.dark
```

A style is drawn as MapLibre draws it for the same view. Two styles that
differ only in colour, like a light and a dark version, switch without
reloading a tile.

![One style from a country down to a street](doc/images/zooms.png)

Shaded relief from a raster source, dashed borders and park edges, road
shields, icons from the style's sprite sheet, patterned fills and one way
arrows all come from the style. Nothing here is drawn by the app.

## Why another vector layer

- **It runs wherever Flutter runs.** It draws with `Canvas.drawVertices`, on
  Skia or Impeller, on the stable channel. No `flutter_gpu`, so no Impeller
  requirement and no Android version floor beyond Flutter's own.
- **The UI thread only draws.** Tiles are downloaded, decoded, filtered by the
  style and turned into triangles on background isolates.
- **Sharp at every zoom.** The map is redrawn from vectors every frame, so
  roads and names never go soft between zoom levels.
- **Text in any script.** Labels are laid out by Flutter's own text engine, in
  your app's fonts, so Arabic, Kurdish and other joined or right to left
  scripts come out right.
- **Labels that know about your markers.** Hand the layer the same markers you
  give `MarkerLayer`: map labels keep clear of them, and a marker can have its
  name written beside it.

## Compared with vector_map_tiles

[vector_map_tiles](https://pub.dev/packages/vector_map_tiles) is the
established vector layer for flutter_map. Both read MapLibre styles. They
differ in how they draw.

| | vmap | vector_map_tiles |
| --- | --- | --- |
| Drawing | vectors, redrawn every frame with `Canvas` | 8.x and 9.x: tiles rendered to images, then drawn. 10.x beta: `flutter_gpu` |
| Flutter channel | stable | 8.x and 9.x: stable. 10.x beta: main channel with Flutter GPU enabled |
| Renderer | Skia or Impeller | 10.x beta needs Impeller, which Flutter enables on Android API 29 and up |
| Icons, sprites and patterns | yes | yes |
| Raster layers | yes | yes |
| Hillshade layers | no | yes |
| Marker aware labels | yes | no |

The 10.x requirements are taken from that version's own README, and the
Impeller availability from
[Flutter's Impeller page](https://docs.flutter.dev/perf/impeller).

![vmap and vector_map_tiles drawing the same style](doc/images/compare.png)

The same style, camera and tiles. vector_map_tiles reads a style one zoom
level deeper than MapLibre does for the same view, so for this picture vmap
was given `zoomOffset: 1` to match. vector_map_tiles shows more shops in
this view than vmap does. The style holds those layers back until zoom 16 and
17, and vmap follows that; I have not traced why vector_map_tiles shows them
earlier.

### Measured

![Frames lost during the tour](doc/images/bench.png)

Both renderers drew the Liberty style on the same phone (Vivo V2514, Android,
profile build) and flew the same scripted tour twice per start: once straight
after a clean install with nothing cached, then again after a restart with the
cache that run left behind. A lost frame is a display refresh that passed
without a new frame.

| | vmap lost | vmap worst gap | vector_map_tiles lost | vector_map_tiles worst gap |
| --- | --- | --- | --- | --- |
| Tour, clean install | 0 of 2778 | 17 ms | 196 of 2779 | 132 ms |
| Tour, cached | 0 of 2775 | 17 ms | 10 of 2779 | 132 ms |
| Fast zooms, clean install | 0 of 1328 | 17 ms | 164 of 1325 | 166 ms |
| Fast zooms, cached | 0 of 1327 | 18 ms | 140 of 1321 | 166 ms |

What this does and does not show:

- The phone ran both apps at 60 Hz, so a frame had 16.6 ms. It was one run
  per row on one phone.
- vmap does more work per frame, because it redraws the vectors every frame:
  about 3 ms on the UI thread and 4 ms on the raster thread at the median,
  against 1 to 2 ms each for vector_map_tiles, which mostly draws finished
  images. In most laps around a fifth of vmap's frames took more than 8 ms,
  so at 120 Hz it would not hold every frame on this phone. That has not been
  measured.
- vector_map_tiles lost its frames in long gaps while waiting for tiles to be
  rendered, not in slow frames of its own.
- vmap's process used about 440 to 490 MB. vector_map_tiles' memory was not
  recorded.

Run it yourself:

```bash
tool/bench_device.sh <adb-serial> ours --dart-define=STYLE=liberty --dart-define=ZOFF=1
tool/bench_device.sh <adb-serial> vmt --dart-define=STYLE=liberty
```

`STYLE` gives both the same style, and `ZOFF=1` makes vmap read it at the
zoom vector_map_tiles does, so both draw the same roads and names. Add
`--dart-define=STRESS=true` for the tour of fast zooms.

## Install

vmap is not on pub.dev yet. Depend on it from git:

```yaml
dependencies:
  flutter_map: ^8.3.0
  vmap:
    git:
      url: https://github.com/ArinFaraj/vmap.git
      ref: v0.3.0
```

## Use

### Markers

Draw markers the way you already do. Pass the same list to the layer and map
labels step out of their way. A `NamedMarker` is a flutter_map `Marker` with a
name, which the map writes beside it wherever there is room.

```dart
final markers = [
  NamedMarker(
    name: 'Machko Chaikhana',
    point: const LatLng(36.18946, 44.00970),
    width: 34,
    height: 34,
    child: const CafePin(),
  ),
  Marker(point: somewhereElse, child: const Pin()),
];

FlutterMap(
  children: [
    VmapLayer(markers: markers),
    MarkerLayer(markers: markers),
  ],
)
```

### Fonts

Labels use the fonts your app bundles. Sizes, weights and colours come from
the style.

```dart
VmapLayer(
  textStyle: const TextStyle(
    fontFamily: 'Inter',
    fontFamilyFallback: ['Vazirmatn'],
  ),
  markerTextStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
)
```

### Label language

A style names the properties its labels read. `nameKeys` replaces them, tried
in order:

```dart
VmapStyle.url(styleUrl, nameKeys: ['name:en', 'name'])
```

![Local names and English names](doc/images/labels.png)

### Cache

Give the layer a directory and it keeps tiles and the style between runs. On
the next start the map draws from disk at once and checks the server in the
background.

```dart
VmapLayer(cacheDirectory: '${cacheDir.path}/vmap')
```

### Gestures

flutter_map's own gestures work as they are. `VmapGestures` is an optional
replacement tuned for a map that redraws every frame: a glide after a drag,
pinch around the fingers, double tap, two finger tap, and double tap then
drag. Wrap the map in it and set `InteractiveFlag.none`.

### Sharing an engine

`VmapLayer` owns what it needs. To keep loaded tiles across pages or read the
frame counters, create a `VmapEngine` yourself and use
`VmapLayer.engine(engine)`.

## What it reads from a style

| | |
| --- | --- |
| Layers | `background`, `fill`, `line`, `circle`, `symbol`, `raster`. `fill-extrusion` is drawn flat |
| Sources | one vector source and any number of raster sources, by TileJSON `url` or `tiles` template |
| Fills | colour, opacity, `fill-outline-color`, `fill-pattern` |
| Lines | colour, opacity, width, gap width, round caps, `line-dasharray` |
| Circles | radius, colour, opacity, and the stroke's width, colour and opacity |
| Text | field, size, font weight and slant, colour, halo, letter spacing, max width, transform, anchor, offset, `text-optional`, `text-allow-overlap` |
| Icons | `icon-image` from the style's sprite sheet (the `@2x` sheet when there is one), size, rotation, opacity, `icon-optional`, `icon-allow-overlap`, `icon-text-fit` |
| Placement | `symbol-placement` point and line, `symbol-spacing`, text along a road, shields and arrows repeated along a line, `minzoom`, `maxzoom`, `visibility` |
| Expressions | `interpolate` (linear and exponential), `step`, `match`, `case`, `coalesce`, `get`, `has`, `zoom`, `geometry-type`, comparisons, `all`, `any`, `!`, `concat`, `to-string`, maths, and the legacy `stops` functions and filters |

Colours, opacities, widths and radii may read a feature's properties, for
example a road coloured by its class. Features are grouped by the values the
paint reads, up to 64 groups per layer in a tile.

## What it does not do

- More than one vector source. The one most layers use is drawn.
- Hillshade and heatmap layers, `line-pattern`, and icons that take a colour
  (SDF icons).
- Text bent along a curve. A road's name is written straight on the
  straightest stretch that fits it, and left out where none does.
- Labels for polygons. Points and lines are labelled.
- Raster layers are drawn under every vector layer, wherever the style puts
  them.
- 3D: buildings are flat and the map does not pitch.
- It has been run on one Android phone and on macOS. iOS, web and low end
  devices are untested.

## Tiles and attribution

The built in style reads [OpenFreeMap](https://openfreemap.org), which needs
no API key. Show the credit your tile source asks for wherever the map is
shown. For OpenFreeMap that is `© OpenFreeMap © OpenMapTiles © OpenStreetMap`.

## How it works

1. Worker isolates download each tile, decode it, run the style's filters,
   triangulate polygons with earcut and turn roads into strips that can be
   widened to any width. Layers that select the same features share one mesh.
   The result crosses to the UI isolate without a copy.
2. Every frame the engine evaluates the style for the zoom and draws the
   visible tiles with `Canvas.drawVertices`, falling back to parent tiles
   while a tile loads. Dashes and patterns are a small repeating image the
   same triangles are drawn through.
3. Labels are collected across tiles and placed on the screen as a whole, so
   they never collide or get cut at a tile edge. Each text is drawn once into
   a small image, icons come straight from the sprite sheet, and both fade in
   and out.

## Example

```bash
cd example
flutter run
```

A small map of Erbil's old town with a few places on it and a button that
walks through the styles. [example/README.md](example/README.md) lists the
switches for the benchmark.

## License

MIT. The example bundles Google Sans Flex and Vazirmatn, both under the SIL
Open Font License; their license texts sit next to the font files. Place names
in the example and the pictures are from OpenStreetMap.
