# What vmap reads from a MapLibre style

| | |
| --- | --- |
| Layers | `background`, `fill`, `line`, `circle`, `symbol`, `raster`. `fill-extrusion` is drawn flat |
| Sources | one vector source and any number of raster sources, by TileJSON `url` or `tiles` template |
| Fills | colour, opacity, `fill-outline-color`, `fill-pattern` |
| Lines | colour, opacity, width, gap width, round caps, `line-dasharray` |
| Circles | radius, colour, opacity, and the stroke's width, colour and opacity |
| Text | field, size, font weight and slant, colour, halo, letter spacing, max width, transform, anchor, offset, `text-optional`, `text-allow-overlap` |
| Icons | `icon-image` from the style's sprite sheet (the `@2x` sheet when there is one), size, rotation, opacity, `icon-optional`, `icon-allow-overlap`, `icon-text-fit` |
| Placement | `symbol-placement` point and line, `symbol-spacing`, text along a road, shields and arrows repeated along a line, `minzoom`, `maxzoom`, `visibility` |
| Expressions | `interpolate` (linear and exponential), `step`, `match`, `case`, `coalesce`, `get`, `has`, `zoom`, `geometry-type`, comparisons, `all`, `any`, `!`, `concat`, `to-string`, maths, and the legacy `stops` functions and filters |

Colours, opacities, widths and radii may read a feature's properties, for
example a road coloured by its class. Features are grouped by the values the
paint reads, up to 64 groups per layer in a tile.

## What it does not read

- More than one vector source. The one most layers use is drawn.
- Hillshade and heatmap layers, `line-pattern`, and icons that take a colour
  (SDF icons).
- Text bent along a curve. A road's name is written straight on the
  straightest stretch that fits it, and left out where none does.
- Labels for polygons. Points and lines are labelled.
- The place of a raster layer in the stack. Rasters are drawn under every
  vector layer.
- 3D: buildings are flat and the map does not pitch.

## How it draws

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
   and out.
