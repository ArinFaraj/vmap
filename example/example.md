# vmap example

A map with vmap's built in style, as a flutter_map layer:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:vmap/vmap.dart';

void main() => runApp(const MaterialApp(home: MapPage()));

class MapPage extends StatelessWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    body: FlutterMap(
      options: const MapOptions(
        initialCenter: LatLng(36.19, 44.01),
        initialZoom: 13,
      ),
      children: [
        VmapLayer(
          style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'),
          userAgentPackageName: 'com.example.app',
        ),
      ],
    ),
  );
}
```

Or the whole map in one widget, with vmap's own gestures:

```dart
VmapMap(
  initialCenter: const LatLng(36.19, 44.01),
  style: VmapStyle.light,
)
```

The [showcase app](https://github.com/ArinFaraj/vmap/tree/main/example) in
this folder switches between styles, place icons and layers, and runs the
benchmark.
