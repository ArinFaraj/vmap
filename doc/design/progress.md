# Progress

## 2026-10-13

Measured, on the `engine` branch:

- Canvas tilt (D6): vmap's existing meshes drawn under a 4x4 perspective
  `Canvas.transform` render correctly on macOS with Impeller. The web is
  not checked yet.
- `MapView` (`lib/src/view.dart`): MapLibre's conventions (512 pixel tiles,
  field of view 0.6435 rad from GL JS `transform_helper.ts`, camera at
  `0.5 / tan(fov / 2) * height`). Projection, unprojection and the canvas
  matrix agree to 1e-6 px. The cover walks the tile tree against the
  visible ground: 8 tiles flat, 21 to 23 at 60 degrees on a 1080 by 2200
  screen at zoom 15.5, the far ones a zoom coarser.
- Labels on a tilted map are projected, sized by MapLibre's perspective
  ratio, and dropped below 0.6. Road names are off on a tilted map until
  the glyph by glyph layout lands.
- `VMap` and `VMapController`: pan with fling, pinch and turn about the
  fingers, two finger tilt, double tap zoom, `easeTo`, and `flyTo` ported
  from GL JS `camera.ts`. On macOS (profile build) flights between Erbil,
  Sulaymaniyah and Duhok ran at about 119 fps: build p99 about 2.2 ms,
  raster p99 about 2.5 ms. Phone numbers are still to come.

OpenStreetMap, Kurdistan Region (relation 5392650), counted with Overpass:

| | Total | `name:ckb` | `name:kmr` | `name:ku` | `name:ar` | `name:en` |
| --- | --- | --- | --- | --- | --- | --- |
| Places (`place=*`) | 6,724 | 2,157 (32%) | 13 | 1,206 | 4,673 (69%) | 5,276 (78%) |
| Named roads | 19,217 | 4,831 (25%) | | | | |

| Governorate | Buildings | With `height` | With `building:levels` |
| --- | --- | --- | --- |
| Erbil | 177,045 | 4,418 (2.5%) | 5,994 (3.4%) |
| Duhok | 26,272 | 2,127 (8.1%) | 2,012 (7.7%) |
| Halabja | 17,505 | 0 | 21 |
| Sulaymaniyah | not counted, the query timed out | | |

So heights are mostly missing: buildings need estimated heights (from
footprint, area type and neighbours), marked as estimates, with OSM and
Overture heights used where they exist. Kurdish names cover a third of
places; the plain `name` tag, often already in Kurdish or Arabic script,
fills the rest.
