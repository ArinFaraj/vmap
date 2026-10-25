## 0.1.0

- `VmapGestures` runs vmap's own gesture recognizer, so a flutter_map map
  pans, zooms, turns and glides as a `Vmap` does: touch, the mouse wheel, a
  right or control drag to turn, a shift drag to zoom to a box, a
  trackpad's slide, pinch and twist, and the arrow, plus and minus keys
  once the map has focus.
- `VmapGestures(options:)` and `VmapFlutterMap(gestures:)` take a
  `VmapGestureOptions` to switch gestures off one by one.
- `VmapLayer`, `VmapFlutterMap`, `VmapGestures` and `NamedMarker`, moved out
  of vmap 0.26 so vmap no longer depends on flutter_map. They take vmap's
  option groups: `VmapNetworkOptions`, `VmapRenderOptions`,
  `VmapLabelOptions` and `VmapTextStyle`, and report `VmapError`s.
