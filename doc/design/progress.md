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

### Text bake-off (D9)

`example/lib/text_bench`: 500 OpenStreetMap place names around Erbil (381
in Arabic script), shaped by `payv`, drawn over a map tilted 55 degrees
that orbits and zooms for 12 s, about 52 labels in view per frame. The
atlas of 242 glyph distance fields builds in 110 to 270 ms off the UI
thread; 16 baked sizes take another 90 to 130 ms.

Phone (Vivo V2514, Impeller Vulkan), the run where the phone was idle:

| Variant | Label paint p50 / p99 | Raster p50 / p99 | Janky frames | Label images redrawn |
| --- | --- | --- | --- | --- |
| Distance fields, colour matrix per draw | 0.46 / 1.5 ms | 8.5 / 13.0 ms | 47% | 0 |
| Same atlas, no colour matrix (soft edges) | 0.55 / 1.3 ms | 4.4 / 6.2 ms | 1% | 0 |
| Paragraph image per label (vmap today) | 0.61 / 5.0 ms | 4.1 / 6.2 ms | 26% | 336, 678 ms |

- A colour matrix on `drawRawAtlas` doubles raster time on the phone, so
  thresholding a distance field at draw time is out for the canvas tier.
- Per-label images cost about 2 ms each to redraw on the phone, on the UI
  thread, and a tilted, moving map redraws about 28 a second.
- Baked pages (sharp glyph and halo images per eighth of an octave of size,
  made from the distance fields off the UI thread, tinted by vertex colour)
  look the same as Paragraph images at rest (emulator screenshots). Their
  phone raster time is not measured yet: the one phone run with them was
  taken while the phone was busy, and every variant's raster time doubled.
- Emulator raster times are not usable: the same variant measured 3 ms and
  16 ms in two runs. Only its UI thread times and screenshots are.
- Two traps: `decodeImageFromPixels` wants premultiplied pixels (white
  pixels at zero alpha drew a white box around every glyph), and a 1.5 px
  halo on small text needs a field reaching 8 texels, not 4.
