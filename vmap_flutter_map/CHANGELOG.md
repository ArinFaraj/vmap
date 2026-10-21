## 0.1.0

- `VmapLayer`, `VmapFlutterMap`, `VmapGestures` and `NamedMarker`, moved out
  of vmap 0.26 so vmap no longer depends on flutter_map. They take vmap's
  option groups: `VmapNetworkOptions`, `VmapRenderOptions`,
  `VmapLabelOptions` and `VmapTextStyle`, and report `VmapError`s.
