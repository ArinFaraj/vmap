## 0.1.0

- `VmapGestures` takes the mouse wheel, eased and adding up, a right or
  control drag to turn, a trackpad's slide, pinch and twist, in a browser
  too, and the arrow, plus and minus keys once the map has focus
  (`keyboard`).
- `VmapLayer`, `VmapFlutterMap`, `VmapGestures` and `NamedMarker`, moved out
  of vmap 0.26 so vmap no longer depends on flutter_map. They take vmap's
  option groups: `VmapNetworkOptions`, `VmapRenderOptions`,
  `VmapLabelOptions` and `VmapTextStyle`, and report `VmapError`s.
