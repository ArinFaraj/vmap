# What vmap reads from a MapLibre style

| | |
| --- | --- |
| Layers | `background` with `background-pattern`, `fill`, `line`, `circle`, `symbol`, `raster`, `hillshade`, `heatmap`. `fill-extrusion` is drawn flat |
| Sources | any number of `vector`, `geojson`, `raster`, `raster-dem` and `image` sources. Tiles by TileJSON `url` or `tiles` templates (several addresses are spread over and fall back to one another), with the source's `minzoom`, `maxzoom`, `bounds` and `scheme`, GeoJSON inline or by address, with `cluster`, `clusterRadius`, `clusterMaxZoom`, `clusterMinPoints` and `clusterProperties`. `pmtiles://` archives over HTTP or on disk. `promoteId`, and `generateId` for GeoJSON |
| Order | layers are drawn in the style's order, across sources and with raster layers where the style puts them |
| Fills | colour, opacity, `fill-outline-color`, `fill-pattern`, `fill-translate` with `fill-translate-anchor` |
| Raster | opacity, `raster-hue-rotate`, `raster-saturation`, `raster-contrast`, `raster-brightness-min` and `-max`, `raster-resampling`. An `image` source is one picture stretched between its four `coordinates` |
| Lines | colour, opacity, width, gap width, `line-offset`, round caps, `line-join` round, bevel and miter, `line-dasharray` with butt, round and square dash caps, `line-blur`, `line-pattern`, `line-gradient` on a GeoJSON source, `line-translate` with `line-translate-anchor` |
| Hillshade | Mapbox and Terrarium heights, exaggeration, shadow and highlight colours, `hillshade-accent-color` when the style names one, light direction |
| Heatmap | radius, weight, intensity, opacity and `heatmap-color` |
| Circles | radius, colour, opacity, the stroke's width, colour and opacity, `circle-translate` with `circle-translate-anchor` |
| Text | field, size, font weight and slant, colour, halo and `text-halo-blur`, letter spacing, line height, justify, max width, transform, anchor, offset, `text-rotate`, `text-variable-anchor` with `text-radial-offset`, `text-optional`, `text-allow-overlap`, `text-ignore-placement`, `text-padding`, `text-max-angle`, `text-translate` and `text-translate-anchor` for a point's text |
| Icons | `icon-image` from the style's sprite sheet (the `@2x` sheet when there is one), size, rotation, opacity, `icon-color`, `icon-halo-color` and `icon-halo-width` for SDF icons, `icon-translate` with `icon-translate-anchor`, `icon-anchor`, `icon-offset`, `icon-optional`, `icon-allow-overlap`, `icon-ignore-placement`, `icon-padding`, `icon-text-fit` |
| Placement | `symbol-placement` point and line, `symbol-spacing`, text along a road and bent along its curves, labels for polygons, shields and arrows repeated along a line, `minzoom`, `maxzoom`, `visibility` |
| Expressions | `interpolate` (linear, exponential and cubic-bezier), `step`, `match`, `case`, `coalesce`, `let`, `var`, `get`, `has`, `id`, `feature-state`, `zoom`, `geometry-type`, `typeof`, `within`, `distance`, comparisons with or without a `collator`, `all`, `any`, `!`, `concat`, `slice`, `index-of`, `split`, `join`, `to-string`, `number-format`, `to-rgba`, `rgb`, `hsl`, maths and trigonometry, and the legacy `stops` functions and filters |

Colours, opacities, widths and radii may read a feature's properties, for
example a road coloured by its class. So may a label's size, colour, opacity
and halo and an icon's size, colour and opacity, and all of them may read
`feature-state`. Features are grouped by the values the paint reads, up to
64 groups per layer in a tile.

## What it does not read

- 3D: buildings are flat and the map does not pitch. Neither does
  flutter_map, which the camera comes from.
- `video` sources, `icon-halo-blur`, and line patterns on round caps.
- `line-gradient` together with dashes, a pattern, `line-blur`, or a width
  or colour read from the feature. The gradient is drawn alone.
- `text-translate` for a name along a line, and a translate that changes
  with the zoom for text and icons: the style's number is read once.
- `within` and `distance` in what `featuresAt` returns, and for lines a
  `within` that looks at more than the line's corners.
- The style's `glyphs`. Text is drawn in the app's fonts.
- A road name on a bend sharper than about 24 degrees between one slice of
  the text and the next is left out there, unless the style sets
  `text-max-angle`, which is then the limit.

Checked on screen: several sources, GeoJSON, raster order, hillshade,
heatmap, bent road names and rotation. Seen in a hand written style
only: `image` sources, `line-blur` on dashes, `line-gradient`, the translate
anchors and `text-max-angle`. Covered by tests only, not seen drawn: `line-pattern`,
SDF icons and their halos, polygon labels and `hillshade-accent-color`.

## How it draws

On the web, steps 1 and 4 below run on the page's own thread, a tile at a time
between frames, because a browser gives Dart no isolates.

1. Worker isolates download each tile, decode it, run the style's filters,
   triangulate polygons with earcut and turn roads into strips that can be
   widened to any width. Layers that select the same features share one mesh.
   The result crosses to the UI isolate without a copy.
2. Every frame the engine evaluates the style for the zoom and draws the
   visible tiles with `Canvas.drawVertices`, falling back to parent tiles
   while a tile loads. Dashes and patterns are a small repeating image the
   same triangles are drawn through.
3. Labels are collected across tiles and placed on the screen as a whole, so
   they never collide or get cut at a tile edge. Each text is drawn once into
   a small image, icons come straight from the sprite sheet, and both fade in
   and out. A name on a bend is the same image cut into slices, each turned
   to the road, so joined scripts stay shaped as one piece of text.
4. A GeoJSON source is cut into tiles on a worker as they are needed and then
   takes the same path as a vector tile. A lookup at a point asks the worker
   to read the tile again and test its features against the point.
