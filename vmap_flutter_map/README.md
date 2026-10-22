# vmap_flutter_map

[vmap](https://github.com/ArinFaraj/vmap)'s maps inside
[flutter_map](https://pub.dev/packages/flutter_map), for apps that already
use flutter_map.

- `VmapLayer` draws any MapLibre style. Put it where a `TileLayer` would go.
- `VmapFlutterMap` is a whole map in one widget: a `FlutterMap` with a
  `VmapLayer`, the markers above it, and `VmapGestures` in place of
  flutter_map's own: touch with a glide, the mouse wheel, a right drag to
  turn, a trackpad's slide, pinch and twist, and the arrow, plus and minus
  keys.
- `NamedMarker` is a flutter_map `Marker` with a name the map writes beside
  it, placed so it never covers another label.

```dart
FlutterMap(
  options: const MapOptions(initialCenter: LatLng(36.19, 44.01)),
  children: [
    VmapLayer(
      style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'),
      network: const VmapNetworkOptions(userAgent: 'com.example.app'),
      markers: markers,
    ),
    MarkerLayer(markers: markers),
  ],
)
```

The layer takes the same options as vmap's `Vmap` widget. Pass the list of
markers to both layers: map labels keep clear of them.

flutter_map's camera looks straight down, so the map does not tilt here.
vmap's own `Vmap` widget tilts, and draws 3D buildings, terrain and the
globe.

flutter_map's zoom is one above vmap's: its tiles are 256 pixels across,
MapLibre's 512. The engine behind a layer, `GlobalKey<VmapLayerState>` and
`key.currentState!.engine`, takes and gives vmap's zooms, so add one before
moving a flutter_map `MapController` to a zoom it answers, such as
`clusterExpansionZoom`.
