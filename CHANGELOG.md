## 0.3.0

- Icons: `icon-image` from the style's sprite sheet, with text placed by
  `text-anchor` and `text-offset`, road shields, and arrows repeated along a
  line.
- Real dashes for `line-dasharray`.
- `fill-outline-color`, `fill-pattern`, `circle` layers and `raster` layers.
- Fill, line and circle paint may read a feature's properties.
- `text-anchor` and `text-offset` now move every point label, so a town's
  name sits above its point as the style asks.

## 0.2.0

- Draws any MapLibre style: `VmapStyle.url`, `VmapStyle.json`, or the built in
  `VmapStyle.light` and `VmapStyle.dark`. The style names the tile source.
- `VmapLayer` goes where a `TileLayer` goes and owns its engine. Use
  `VmapLayer.engine` to share one.
- Markers are flutter_map `Marker`s. `NamedMarker` adds a name the map writes
  beside it. `VmapMarker` is gone.
- Fonts are given as a `TextStyle`. `VmapLabelFont`, `TileSourceConfig.nameKeys`
  and `TileSourceConfig.tileJsonUrl` are gone: name keys and the tile source
  belong to the style.
- The example is a small showcase, and the benchmark runs both renderers on
  the same style.

## 0.1.0

- First release: a vector tile layer for flutter_map drawn with the Flutter
  canvas, with label placement, marker names, a light and a dark palette, a
  disk cache and its own gesture handling.
