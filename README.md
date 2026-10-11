<h1 align="center">vmap</h1>

<p align="center">
  Vector maps for Flutter, drawn with the plain Flutter canvas.<br>
  Works with <a href="https://pub.dev/packages/flutter_map">flutter_map</a>
  and any MapLibre style.
</p>

![vmap showing three styles](doc/images/hero.png)

- Reads any MapLibre style: colours, roads, labels, icons, dashes, patterns.
- Runs on the stable channel, on Skia or Impeller. No GPU package.
- Redraws from vectors every frame, so nothing goes soft between zoom levels.
- Tiles are loaded and built on background isolates.
- Labels in any script, in your app's own fonts.
- Its own gestures, and optional round pins for places.

## Install

vmap is not on pub.dev yet. Depend on it from git:

```yaml
dependencies:
  flutter_map: ^8.3.0
  latlong2: ^0.9.1
  vmap:
    git:
      url: https://github.com/ArinFaraj/vmap.git
      ref: v0.4.0
```

## Quick start

```dart
import 'package:latlong2/latlong.dart';
import 'package:vmap/vmap.dart';

VmapMap(
  initialCenter: const LatLng(36.19, 44.01),
  initialZoom: 14,
)
```

That is a full map: the built in style, tiles from
[OpenFreeMap](https://openfreemap.org) (no API key), and gestures.

### Already using flutter_map?

Keep your `FlutterMap` and swap the tile layer:

```diff
 FlutterMap(
   options: MapOptions(initialCenter: LatLng(36.19, 44.01), initialZoom: 14),
   children: [
-    TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
+    VmapLayer(),
     MarkerLayer(markers: markers),
   ],
 )
```

`VmapMap` and `VmapLayer` take the same options below. The snippets leave out
`initialCenter` to stay short.

## Styles

![The same place in six styles](doc/images/styles.png)

```dart
VmapMap(style: VmapStyle.light)  // built in, the default
VmapMap(style: VmapStyle.dark)   // built in
VmapMap(style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'))
VmapMap(style: VmapStyle.json(jsonDecode(myStyle)))
```

The style decides the look and where the tiles come from. Light and dark
versions of one style switch without reloading a tile.

![One style from a country down to a street](doc/images/zooms.png)

## Pins

Styles draw places with small sprite icons. Pass `pins` to draw them as round
pins instead:

```dart
VmapMap(pins: VmapPins.standard)
```

![Places drawn as pins on two styles](doc/images/pins.png)

The standard set covers the usual kinds of place: food, cafes, hotels, shops,
parks, sights, health, transport. It uses Material icons, so the app needs
`uses-material-design: true` in its pubspec.

To change it:

```dart
const pins = VmapPins(
  size: 26,
  byIcon: {
    ...standardPins,
    'cafe': VmapPin(Icons.coffee_rounded, Color(0xFF6F4E37)),
  },
);
```

A pin is looked up by the icon name the style gives a place. For OpenMapTiles
styles that is the place's class, such as `cafe` or `lodging`. Places with no
pin of their own get `other`, a grey pin; set `other: null` to leave them
with the style's icon.

These pins are part of the map and do not take taps. For places the user can
tap, use markers.

## Markers

Markers are flutter_map `Marker`s. Map labels keep out of their way. A
`NamedMarker` also gets its name written beside it, wherever there is room.

```dart
VmapMap(
  markers: [
    NamedMarker(
      name: 'Machko Chaikhana',
      point: const LatLng(36.18946, 44.00970),
      width: 34,
      height: 34,
      child: const CafePin(),
    ),
  ],
)
```

With `VmapLayer`, pass the same list to both layers:

```dart
VmapLayer(markers: markers),
MarkerLayer(markers: markers),
```

## Gestures

`VmapMap` comes with its own gestures: drag with a glide, pinch around the
fingers, double tap, two finger tap, and double tap then drag. It does not
rotate the map.

Move the map from code with a flutter_map `MapController`:

```dart
final controller = MapController();

VmapMap(controller: controller, onTap: (point) {})

controller.move(const LatLng(36.19, 44.01), 15);
```

To get the same gestures on your own `FlutterMap`, wrap it in `VmapGestures`
and set `InteractionOptions(flags: InteractiveFlag.none)`. flutter_map's own
gestures also work with `VmapLayer`.

## Fonts and language

Labels use the fonts your app bundles. Sizes and colours come from the style.

```dart
VmapMap(
  textStyle: const TextStyle(
    fontFamily: 'Inter',
    fontFamilyFallback: ['Vazirmatn'],
  ),
)
```

`nameKeys` picks the label language, tried in order:

```dart
VmapStyle.url(styleUrl, nameKeys: ['name:en', 'name'])
```

![Local names and English names](doc/images/labels.png)

## Cache

Give it a directory and tiles and the style are kept between runs. The next
start draws from disk at once and checks the server in the background.

```dart
VmapMap(cacheDirectory: '${cacheDir.path}/vmap')
```

## Compared with vector_map_tiles

[vector_map_tiles](https://pub.dev/packages/vector_map_tiles) is the
established vector layer for flutter_map.

| | vmap | vector_map_tiles |
| --- | --- | --- |
| Drawing | vectors, every frame, with `Canvas` | 9.x: tiles rendered to images. 10.x beta: `flutter_gpu` |
| Flutter channel | stable | 9.x: stable. 10.x beta: main, with Flutter GPU on |
| Renderer | Skia or Impeller | 10.x beta needs Impeller |
| Hillshade layers | no | yes |
| Labels that avoid your markers | yes | no |
| Pins for places | yes | no |

The 10.x rows are taken from that version's own README.

On one Android phone at 60 Hz, flying the same tour over the same style, vmap
lost 0 frames in each of four runs and vector_map_tiles 9.0.0-beta.13 lost
between 10 and 196. vmap does more work per frame to get there. The full
table, the caveats and how to run it are in
[doc/benchmark.md](doc/benchmark.md).

## Limits

- One vector source per style.
- No hillshade or heatmap layers, no `line-pattern`, no SDF icons.
- Road names are written straight, not bent along curves.
- No 3D: buildings are flat and the map does not pitch or rotate by gesture.
- Run so far on one Android phone and on macOS. iOS, web and low end devices
  are untested.

The full list of what is read from a style, and how the renderer works, is in
[doc/style-support.md](doc/style-support.md).

## Attribution

Show the credit your tile source asks for. For OpenFreeMap that is
`© OpenFreeMap © OpenMapTiles © OpenStreetMap`.

## Example

```bash
cd example
flutter run
```

A map of Erbil's old town with a few places and a button that walks through
the styles. [example/README.md](example/README.md) lists its switches.

## License

MIT. The example bundles Google Sans Flex and Vazirmatn under the SIL Open
Font License. Place names in the example and the pictures are from
OpenStreetMap.
