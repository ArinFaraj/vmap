# vmap_flutter_map

[vmap](https://github.com/ArinFaraj/vmap)'s maps inside
[flutter_map](https://pub.dev/packages/flutter_map).

- `VmapLayer` draws any MapLibre style. Put it where a `TileLayer` would go.
- `VmapFlutterMap` is a whole map in one widget: a `FlutterMap` with a `VmapLayer`,
  the markers above it, and `VmapGestures` in place of flutter_map's own.
- `NamedMarker` is a flutter_map `Marker` with a name the map writes beside
  it, placed so it never covers another label.

```dart
FlutterMap(
  options: const MapOptions(initialCenter: LatLng(36.19, 44.01)),
  children: [
    VmapLayer(
      style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'),
      markers: markers,
    ),
    MarkerLayer(markers: markers),
  ],
)
```

flutter_map's camera does not tilt, so buildings are drawn flat here. Use
vmap's own `VMap` widget for tilt, 3D buildings, terrain and the globe.
