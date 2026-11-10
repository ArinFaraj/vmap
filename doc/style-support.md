# What vmap reads from a MapLibre style

The measure is MapLibre's own render tests: CI draws them on the GPU and
1,394 of the 1,519 that apply to vmap pass. The tests left out, each with its
reason, are in `tool/render_suite_out_of_scope.tsv`, and the ones that apply
but do not have to pass yet are in `tool/render_suite_exceptions.tsv`.

| | |
| --- | --- |
| Root | `projection` (`mercator`, `globe`, `vertical-perspective`, and a change between them by zoom), `sky`, `terrain`, `light`, `sprite`, `glyphs`, `transition` |
| Layers | `background` with `background-pattern`, `fill`, `line`, `circle`, `symbol`, `raster`, `hillshade`, `color-relief`, `heatmap`, `fill-extrusion` (standing on a tilted `Vmap`, flat under flutter_map and on the canvas renderer) |
| Sources | any number of `vector`, `geojson`, `raster`, `raster-dem` and `image` sources. Tiles by TileJSON `url` or `tiles` templates (several addresses are spread over and fall back to one another), with the source's `minzoom`, `maxzoom`, `bounds` and `scheme`, GeoJSON inline or by address, with `cluster`, `clusterRadius`, `clusterMaxZoom`, `clusterMinPoints` and `clusterProperties`. `pmtiles://` archives over HTTP or on disk. Vector tiles as Mapbox Vector Tiles, or in the MapLibre Tile format for a source with `"encoding": "mlt"`. `promoteId`, and `generateId` for GeoJSON |
| Order | layers are drawn in the style's order, across sources and with raster layers where the style puts them |
| Fills | colour, opacity, `fill-outline-color`, `fill-pattern`, `fill-translate` with `fill-translate-anchor` |
| Raster | opacity, `raster-hue-rotate`, `raster-saturation`, `raster-contrast`, `raster-brightness-min` and `-max`, `raster-resampling`. An `image` source is one picture stretched between its four `coordinates` |
| Lines | colour, opacity, width, gap width, `line-offset`, round caps, `line-join` round, bevel and miter, `line-dasharray` with butt, round and square dash caps, `line-blur`, `line-pattern`, `line-gradient` on a GeoJSON source, `line-translate` with `line-translate-anchor` |
| Color relief | `color-relief-color` over `['elevation']`, `color-relief-opacity`, `resampling`, and a source's `custom` encoding |
| Buildings | `fill-extrusion` height, base, colour, opacity and `fill-extrusion-vertical-gradient`, lit by the style's root `light` (anchor, position, colour, intensity) as MapLibre lights them |
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
`feature-state`.

## What it does not read

- HTML `canvas` and `video` sources, and custom layers drawn by JavaScript.
- The `identity` projection, a camera pitch beyond 90 degrees, and the
  `font-faces` style property.
- Dashes on a `line-gradient` line as MapLibre measures them. MapLibre sizes
  them by their share of the whole line; vmap keeps the lengths the style
  gives.
- A `line-pattern` stretched along the line between whole zooms. vmap keeps
  the image's shape.
- A heatmap seen through opaque layers drawn above it, which MapLibre shows.
- Vertical CJK names along steep roads.
- 3D under flutter_map: its camera does not tilt, so the adapter draws flat
  buildings.
- On the canvas renderer, the fallback where Flutter GPU does not run:
  standing buildings, terrain and the globe.

The [roadmap](../ROADMAP.md) lists the kinds of render tests that still
fail.

A style is changed while it is shown with `styleEdits`: a paint or layout
property, a filter, or the zoom range of a layer named by its `id`. Adding
and removing layers and sources is done with the overlay.

## How it draws

1. Worker isolates download each tile, decode it (Mapbox Vector Tiles or
   the MapLibre Tile format), run the style's filters, triangulate polygons
   with earcut and turn roads into strips that can be widened to any width.
   Layers that select the same features share one mesh. The result crosses
   to the UI isolate without a copy and is uploaded to the GPU once.
2. Every frame the engine picks the tiles the camera sees, evaluates the
   style for the zoom, and draws each tile's layers from the buffers the GPU
   already holds. A tile that is still loading is stood in for by its
   nearest loaded ancestor or by its children. Buildings are drawn with a
   depth buffer, and terrain and the globe move the same meshes in the
   vertex shader.
3. Labels are collected across tiles and placed on the screen as a whole,
   as MapLibre places them, so they never collide or get cut at a tile edge.
   Letters are distance fields from the style's glyph ranges, or shaped from
   the app's fonts by vmap's own OpenType shaper for what the ranges cannot
   join. Names laid on the ground are laid out once and projected by the
   GPU.
4. A GeoJSON source is cut into tiles on a worker as they are needed and
   then takes the same path as a vector tile. A lookup at a point asks the
   worker to read the tile again and test its features against the point.

A browser gives Dart no isolates, so on the web steps 1 and 4 run in the web
worker vmap ships. With `VmapEngine.useWebWorker(null)`, or a worker the
browser will not start, they run on the page's own thread, a tile at a time
between frames.

Where Flutter GPU does not run, the canvas renderer draws the same tiles
with `Canvas.drawVertices`: a tilted map with flat buildings, and no terrain
or globe.
