## 0.1.0

- `VmapLayer` draws any MapLibre style in a `FlutterMap`, where a
  `TileLayer` would go. It makes its engine from a `VmapEngineOptions`, or
  draws with an app's own as `engine`, and reports `VmapError`s.
- `NamedMarker` is a flutter_map `Marker` with a name the map writes beside
  it, clear of the other labels.
- `VmapGestures` moves a `FlutterMap` as a `Vmap` moves: touch, the mouse
  wheel, a right or control drag to turn, a shift drag to zoom to a box, a
  trackpad's slide, pinch and twist, and the arrow, plus and minus keys
  once the map has focus. It keeps to the zooms of the map's `MapOptions`,
  and `options` switches gestures off one by one.
