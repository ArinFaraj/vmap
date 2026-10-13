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

### Glyph text in the engine

`lib/src/glyphs/`: `GlyphFonts` and `layoutText` (bidi, script runs, first
font with every glyph, wrapping into even lines, alignment, weight through
the variable font), and `GlyphPages` (outlines rasterized by Flutter per
size, halo stroked beside each glyph, one `drawRawAtlas` per page image per
frame). `GlyphSprite` is the label kind that uses them; `VMap` turns them
on, `VmapLayer` keeps the images. Road names place each glyph on its own
point of the road, turned along the projected road, so they bend without
slices and show on a tilted map (viewport aligned; map aligned glyphs that
lie on the road are not done).

On the emulator, flat and tilted Erbil look as sharp as the image path,
and road names appear where the image path had none drawn. Layout is about
125 us a label in a JIT run; it runs inside the existing per frame label
budget, not yet in the tile worker.

### 3D buildings on the canvas tier

`lib/src/extrusion.dart`: a `fill-extrusion` layer gets a bucket of
buildings built in the tile worker (walls, roof triangles, height, base,
colour per building). With a tilted view the engine leaves out the flat
stand-in and draws the buildings in view in one `drawVertices`: projected
on the CPU through `MapView.project3`, farthest first, walls facing away
from the camera dropped, walls shaded by where they face (light from the
north west) and darker at the foot.

On the emulator with OpenFreeMap's Liberty style, Sulaymaniyah and Erbil
stand up. Dense Erbil at pitch 60 costs a build p50 of 3.8 ms and p99 of
14 ms on the emulator's CPU, after culling buildings off screen and those
reaching behind the camera (which flipped and covered the screen before).

Known limit, the reason for the Flutter GPU tier: painter's order sorts by
each building's centre, so a low building inside a tall one's footprint
and nearer the camera (houses inside Erbil's citadel) draws over the tall
one's roof. A depth buffer fixes it; the canvas tier keeps it.

### Buildings on the GPU

`BuildingRenderer` (in `extrusion.dart`) is the seam; the canvas painter is
the default. `example/lib/gpu/gpu_buildings.dart` is the Flutter GPU one:
each tile's walls and roofs, lit once in world space, go to a device buffer
the first time the tile is drawn; a frame binds one matrix per tile
(`MapView.clipMatrix` times the tile's placement) and draws into an image
surface with a depth buffer and 4x MSAA where `doesSupportOffscreenMSAA`
holds. The pipeline is made on the first frame drawn, never before, so the
OpenGL ES deadlock (flutter/flutter#193890) cannot happen. Shaders are a
`flutter_gpu_shaders` bundle built by the example's hook.

On the emulator (Impeller OpenGL ES) it draws Erbil correctly: the houses
inside the citadel no longer show through its roof. It lives in the
example until it moves into a package of its own, so vmap itself needs no
shader hook and still builds for the web.

### Profiling on the phone (Vivo V2514, Vulkan)

Scripted zoom and fly test, `--dart-define=ZOOMTEST=true`, with variants:

| Run | fps | Frames over 16.7 ms | Build p50 / p95 / p99 | Raster p50 / p95 |
| --- | --- | --- | --- | --- |
| full, 60 Hz | 59 | 98 | 3.7 / 6.9 / 10.1 ms | 3.7 / 6.6 ms |
| no labels, 60 Hz | 60 | 3 | 3.1 / 6.7 / 9.4 ms | 4.0 / 5.8 ms |
| full, surface voting 120 Hz | 114 | 103 | 2.4 / 4.9 / 7.8 ms | 3.3 / 5.1 ms |

- Android 15 draws a surface that casts no frame rate vote at the display's
  normal category, 60 Hz here, even with a 120 Hz preferred display mode.
  Voting with `Surface.setFrameRate` on Flutter's surface gives 120 Hz.
  This belongs in vmap itself (a small Android plugin), not each app.
- `GpuImageSurface.acquireNextFrame` blocked the UI thread 2 to 5 ms in
  most frames, waiting on the GPU. A ring of three textures shown with
  `Texture.asImage` avoids the wait; its phone numbers are still to take.
- Labels are the other cost: shaping new labels (up to 6 ms in one frame)
  and placing them, on the UI thread.

### The GPU map renderer (vmap_gpu)

`vmap_gpu/` draws a tilted map's fill and line layers and its buildings
with Flutter GPU, one call per tile (or per 120 style slots): tile workers
write a vertex stream per tile in style order (`lib/src/gpu_stream.dart`),
each vertex naming its style slot, and a frame only writes the slots'
colour, width, offset and dash into a uniform table. Lines are widened and
dashes cut in the shader, so a zoom rebuilds nothing on the CPU. Raster
layers, labels and icons stay on the canvas; styles with circles, heatmaps
or rasters above the map fall back to the canvas entirely.

Vertices are exact floats (pairs of 12 bit numbers in one float) because
Impeller's OpenGL ES shaders are GLSL ES 1.00, without integers. Checked on
macOS (Metal) and the emulator (OpenGL ES) with OpenFreeMap's Liberty: on
macOS the raster thread went from about 0.8 ms to 0.3 ms a frame.

Not yet: fill patterns and line gradients (left out), fill translate,
`line-gap-width`, stencil clipping of fallback tiles (they draw first and
are overdrawn), and phone measurements.

Also today, from phone traces: two script labels (name, newline, local
name) no longer fall back to Paragraph images; labels cache their glyph
cells; projections and tile glyph transfers stopped allocating per point
and per label (young collections down a third in the zoom test); the map
is out of the semantics tree.
