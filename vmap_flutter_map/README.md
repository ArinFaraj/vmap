# vmap_flutter_map

[vmap](https://github.com/ArinFaraj/vmap)'s maps inside
[flutter_map](https://pub.dev/packages/flutter_map), for apps that already
use flutter_map.

- `VmapLayer` draws any MapLibre style. Put it where a `TileLayer` would go.
- `NamedMarker` is a flutter_map `Marker` with a name the map writes beside
  it, placed so it never covers another label.
- `VmapGestures` moves a `FlutterMap` with vmap's gestures in place of
  flutter_map's own: the same touches, mouse, trackpad and keys as a
  `Vmap`, with the same glide.

```dart
FlutterMap(
  options: const MapOptions(initialCenter: LatLng(36.19, 44.01)),
  children: [
    VmapLayer(
      options: VmapEngineOptions(
        style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'),
        network: const VmapNetworkOptions(userAgent: 'com.example.app'),
      ),
      markers: markers,
    ),
    MarkerLayer(markers: markers),
  ],
)
```

The layer takes vmap's `VmapEngineOptions`: the style, overlay, labels,
fonts and the rest that `Vmap` takes one by one. To keep loaded tiles
across pages, make the engine yourself with `VmapEngine.withOptions` and
pass it as `VmapLayer(engine: ...)`. Pass the list of markers to
both layers: map labels keep clear of them.

For vmap's gestures, switch flutter_map's off and wrap the map:

```dart
VmapGestures(
  controller: controller,
  child: FlutterMap(
    mapController: controller,
    options: const MapOptions(
      initialCenter: LatLng(36.19, 44.01),
      interactionOptions: InteractionOptions(flags: InteractiveFlag.none),
    ),
    children: [...],
  ),
)
```

They keep to the zooms the map's `MapOptions` allow, and
`options: VmapGestureOptions(...)` switches them off one by one.

flutter_map's camera looks straight down, so the map does not tilt here.
vmap's own `Vmap` widget tilts, and draws 3D buildings, terrain and the
globe.

flutter_map's zoom is one above vmap's: its tiles are 256 pixels across,
MapLibre's 512. The engine behind a layer, `GlobalKey<VmapLayerState>` and
`key.currentState!.engine`, takes and gives vmap's zooms, so add one before
moving a flutter_map `MapController` to a zoom it answers, such as
`clusterExpansionZoom`. Ask it what is under a tap with `featuresAt`.
