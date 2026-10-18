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

Not yet: line gradients and line patterns (left out), fill translate,
`line-gap-width`, and phone measurements.

Also today, from phone traces: two script labels (name, newline, local
name) no longer fall back to Paragraph images; labels cache their glyph
cells; projections and tile glyph transfers stopped allocating per point
and per label (young collections down a third in the zoom test); the map
is out of the semantics tree.

Later the same day: fill patterns (from the sprite sheet texture), circle
layers (a square per point, cut round in the shader), and stencil clipping
of every tile to its square, which also clips fallback tiles to where no
ideal tile is. Styles with more than one source draw in the style's run
order: each tile's stream records where each style layer starts, the
renderer draws each run's slice from the tiles of its source, and the
stencil is rewritten when the source changes. The stencil squares draw
with blending on, since a transparent square drawn with blending off
erases what is already there. Checked with a GeoJSON circle overlay on
Liberty on macOS (Metal) and the emulator (OpenGL ES).

## 2026-10-13, evening: phone smoothness

Measured on the phone (121 Hz) with timeline recordings, scripted and by
hand, until Arin called it smooth.

- Label glyphs are rasterized on the CPU in an isolate (coverage plus a
  distance transform for halos), not by Flutter on the raster thread: 195
  raster snapshots of up to 260 ms in a 30 s zoom test went to 1.
- Tile and glyph isolates share the UI isolate's heap, so their garbage
  pauses the UI thread. Builders grow typed buffers instead of
  List<double>: missed vsyncs 1.8% to 0.3%, longest scavenge 20 to 6 ms.
- GPU memory comes from 4 MB slabs grown one a frame ahead of need, under
  a 96 MB cap; tiles unseen for ten seconds give theirs back. Uniforms use
  our own arena (Flutter's HostBuffer has two open bugs). Pipelines are
  warmed and the sprite sheet is copied in off the frame.
- A tile shows only once its geometry and buildings are on the GPU; until
  then its parent or children stand in. Buildings fade in at full
  height over their footprints, which fade out per tile as they do.
- A camera move fetches and prepares the tiles where it ends; twelve
  tiles are fetched at once. In a recording a fetch took 160 ms and a
  build 18 ms, so the network sets how fast a new city fills.
- Every tile is marked in the timeline as asked, fetched, built and ready.

Tried and dropped the same evening: crossfading tiles when the zoom level
swaps (7dfc0b7, reverted in 5fbbe35). Fading every swap made roads and
lines visibly shift during each change; a clean swap read better on the
phone.

## 2026-10-14: patterned and gradient lines on the GPU

`line-pattern` and `line-gradient` draw on the GPU, so a style with
either no longer falls back to the canvas. Checked on macOS (Metal)
against the canvas with the spike's `LINES` overlay on Liberty: the same
sprite at the same size and spacing, and the same colours along the
route. Not yet seen on the phone.

Known gap, found in the same check: the GPU draws 3D buildings opaque
and ignores `fill-extrusion-opacity`. Liberty asks for 0.8, so the canvas
shows the ground faintly through buildings while the GPU does not.


## 2026-10-14: MapLibre's render tests

`tool/render_suite.sh <maplibre-gl-js checkout>` runs MapLibre GL JS's
render tests (1,730 tests in 195 groups, `test/integration/render/tests`)
through the engine on macOS and scores them as MapLibre's runner does:
pixelmatch at the test's threshold (0.1285 by default) against each
expected image, passing when the share of differing pixels is within the
test's `allowed` (0.025% by default). The tests' style operations go
through the engine's own edit API. A report with expected, ours and the
diff side by side lands in the output directory.

Baseline on the GPU renderer, before global state and glyph ranges:
**396 of 1,730 (22.9%)**. The first run, on the canvas renderer before
the colour space and function fixes, was 338; part of it ran with the Mac
asleep, so it is not comparable.

Where the failures are, largest first:

| Area | Tests | Cause |
| --- | --- | --- |
| Text and symbols | about 300 | Labels came from our fonts, not the style's glyph ranges. Glyph ranges now load behind `styleGlyphs`; what is left is MapLibre's layout rules (anchors, offsets, max width, variable anchors, icon-text-fit, writing mode) and a second resample that softens vertical stems by a fraction of a pixel. |
| Globe projection | about 130 | Not built. |
| Terrain and sky | about 64 | Not built. |
| Live style changes | 210 errored | Fixed in the harness: paint, layout, filter, zoom range, layers, sources, feature state, camera. `addImage` and custom layers remain. |
| Whole layer opacity | about 34 | `line-layer-opacity` and `fill-layer-opacity` are not read. |
| Global state | 44 | Fixed: `["global-state", name]` and `setGlobalStateProperty`. |
| Near misses | many | Line edges within about 0.1% of MapLibre's pixels. |

Fixed from the first runs: `interpolate-hcl`, `interpolate-lab` and
`colorSpace` blend through CIELAB as MapLibre does; legacy functions of
zoom and a property; an unset background is black; zero width lines draw
nothing on the GPU; point labels of one name in one key cell were merged
into one, now told apart by distance (two shops of one name both show).

After glyph ranges (with MapLibre's line breaking, line height and one
sample per glyph at its quarter pixel), global state and the label fixes:
**466 of 1,730 (26.9%)** on the GPU renderer. The text, icon and symbol
groups alone went from 14 to 58 of 449 before line breaking. Two cautions
from that run: icon tests could be scored before their sprite sheet
arrived (the harness now waits for sprites and glyph ranges), and
`regressions/mapbox-gl-js#6919` now fails because a `line-center` label
too long for its line is drawn where MapLibre drops it.

Found on the phone the same day and fixed: bent road names crammed far
from a tilted camera (letters are now spaced along the road as it falls
on the screen), layers vanishing instead of fading when zooming out past
a tile zoom (the finer tiles are kept for 300 ms), and straight road
names jittering while a tilted map turns (their angle is now found every
frame).

Later the same day: **537 of 1,730 (31.0%)** on the GPU renderer, with
whole-layer opacity (`line-layer-opacity`, `fill-layer-opacity`),
see-through buildings at `fill-extrusion-opacity` drawn in the style's
order, zero-height buildings, `icon-text-fit` with stretchable sprites,
road names repeated every `symbol-spacing`, `text-keep-upright` and
`line-center`. The harness now runs six tests at a time and scores each
once the engine reports nothing left to load or draw: a full run takes
about five minutes instead of fifty, and gave the same result for every
one of the 815 tests compared against the slow run.

2026-10-14, a sweep of the near misses: **609 of 1,730 (35.2%)** on the
GPU renderer. About 190 tests missed by under half a percent of their
pixels; a few shared causes explained most of them. A circle's edge now
fades over the device pixel inside its radius; labels of one tile are
never joined as copies of each other, only across tiles; a
`text-radial-offset` of 0 wins over `text-offset`; raster tiles meet edge
to edge instead of being stretched half a pixel; and a line's edge fade
reads only the side, so a segment after a mitred corner no longer thins
to a wedge (seen on real roads, not only in tests).

Then **619 of 1,730**: dashes drawn from a distance ramp with real caps,
point labels placed in MapLibre's order and spots, and Arabic-script text
from glyph ranges joined and ordered right to left. The Kurdish letters
ڵ, ڕ, ێ and ە have no presentation forms, so glyph ranges cannot join
them and MapLibre draws Sorani broken; vmap shapes those labels with its
fonts instead.

Then **627 of 1,730**, and a second measure: `tool/compare_style.sh`
renders eleven views of Liberty over Kurdistan in MapLibre GL JS 6.14
and in vmap and diffs them, which shows what the suite cannot, what a
user of this style sees. It found tiles away from the middle of a flat
map drawn from the zoom below (MapLibre covers a plain map at one zoom),
and road shields placed along their line where MapLibre stands one at
each line's first vertex; both are fixed, and the eleven views differ
from MapLibre by 0.7 to 6.2 percent. Hillshade follows MapLibre's
methods.

Later: **629 of 1,730**, and the eleven Liberty views a summed 36.5
percent from MapLibre, down from 37.3. Road names and symbols along lines
stand at MapLibre's getAnchors, measured as MapLibre measures them, from
the style's glyph ranges, which the tile workers now load; the half em a
letter they guessed before made names a third too long. On a tilted map
road names lie on the ground, foreshortened, drawn as projected glyph
quads. Every label of a dense view is weighed, against a grid of boxes.
Liberty's place names wrap as MapLibre wraps them even where their
Kurdish line is shaped with the fonts. A map with raster tiles on their
way is no longer reported settled.

Tried and set aside: MapLibre's order of tiles for symbols, and dropping
vmap's same-name spacing and extra room around road names; each made the
Liberty views further from MapLibre's, by its own measure. Ground text
shrinks on the screen by half its distance, as upright text does; only
its shape changes.

Left: names along tilted roads (MapLibre still places more), icon widths
in the tile workers, and the Latin line of a Kurdish place name, drawn
with the fonts in Vazirmatn rather than the style's own glyphs.

Terrain is built: see `terrain.md`.

2026-10-15: **715 of 1,730**. Every background layer is drawn in the
style's order; patterns grow with the zoom between whole zooms; the
app's own images are drawn by name (`VmapOverlay.images`, MapLibre's
`addImage`); all CSS colour names are read, which had left heatmaps with
only the red end of their ramp; `heatmap-opacity` works (a packed colour
read back as signed lost any alpha of a half or more); circles and
heatmap glows stand on every vertex of lines and polygons; and
`color-relief` layers are drawn. The render suite had been waiting out a
20 second limit on some tests since its window was hidden, as the engine
asks for frames through the scheduler; it paints for itself now.

Later the same day: **779 of 1,730**. Raster and hillshade tiles are laid
on whole pixels of a flat, unturned map, as MapLibre aligns a map at
rest, so a tile at its own zoom is drawn pixel for pixel (46 tests); a
raster tile the server does not have is drawn from the tile above it,
and a loading one shows what is loaded above it instead of a hole; image
sources are warped as the perspective view of a picture; a text size
that is not a finite number is drawn at 16 instead of throwing; and the
ways of one road are joined before it is named, as MapLibre's
mergeLines joins them (the Liberty views: 37.11 to 36.87 summed). The
suite now serves the real-world tiles its six real-world tests read.

Set aside again: dropping the extra room vmap keeps around road names.
On Chicago it placed names MapLibre leaves out while still missing
others; MapLibre tests a name along a line against small boxes along the
road, not one rectangle, which is the difference to chase.

Later: **788 of 1,730**. The map pitches to 85 degrees as MapLibre's
does: the ground ends at MapLibre's far plane, a style's `sky` is drawn
above the horizon, and raised ground fades into the sky's fog. vmap's own
distance haze is gone, since MapLibre never hazes without a sky. Over
terrain, far raster tiles take coarser zooms, hills past the flat
ground's far edge are covered, and a map is not reported settled while
its ground eases to its height. terrain/default went from 44 to 2.8
percent from MapLibre; most terrain tests are now within 10. Tried and
reverted: MapLibre's line-label collision circles (worse on Liberty) and
eighth-pixel glyph phases (broke label placement).

Then **809 of 1,730**. Buildings are lit by the style's root `light` with
MapLibre's fill-extrusion formula and vertical gradient, on the GPU every
frame so a light kept to the screen turns with the map; they take
`fill-extrusion-translate` and its anchor; nothing stands below the
ground; and a colour's alpha darkens a building instead of fading it.
Left for buildings: patterns and rounded corners.

The GPU renderer runs in the browser. Of the WebGPU and GPU packages for
Flutter (flutter3d, gpux, nitro_webgpu, minigpu, flutter_angle), the one
that fits is flutter_scene's internal `flutter_gpu` shim: Flutter GPU on
native and a WebGL2 implementation of the same API on the web, reading the
same shader bundle, so vmap_gpu needed no second renderer and no second
shader language. It is copied into `vmap_gpu/lib/src/gpu_shim` with one
fix. In Chrome on an M4 Pro over Erbil with Liberty, a frame is built in
1.1 ms at the median and 3.5 ms at the 99th percentile on the GPU, against
5.6 and 29.6 on the canvas. Frames on the web are not multisampled: the
shim's multisample resolve leaves vmap's frames empty. The canvas stays as
the fallback where WebGL2 is missing. WebGPU can come later under the same
API.

Known gaps carried forward: road label anchors are spread evenly over a
line where MapLibre steps them at exactly `symbol-spacing` from an
offset of half the label's length (the tile workers do not know label
lengths when drawing with glyph ranges); background layers are drawn
first wherever the style puts them; globe projection and sky are not
built.

Then camera padding, MapLibre's `PaddingOptions`. The camera looks at the
middle of what the padding leaves, so the ground under those edges is off
screen: a pinch or a drag on a tilted map keeps working about that middle
rather than the screen's. The camera's height is still measured from the
whole screen, as MapLibre measures it, so the perspective is unchanged.
`FlyPath` blends padding as it flies, and `MapView.copyWithPad` changes it
on a view that already exists. `EdgeInsets2` in `src/view.dart` carries it
and is exported from `vmap.dart`.

Five `debug` render tests asked for it and now draw the padding overlay
with it: a band at each padding edge in its own colour, red above, green
below, blue on the left, magenta on the right, and a cyan crosshair where
the camera looks, three pixels thick as MapLibre's scissored clears are.
The render suite's `setPadding`, `setVerticalFieldOfView` and `pauseTiles`
operations work too, so three tests that errored now score: 810 of 1,730
on the GPU, 19 errored against 24.

Still off in those five tests: on a pitched map the GPU frame covers the
rows above the ground with its clear colour, where MapLibre's background
layer fills them from the tile mesh. That is a rendering gap of the GPU
tier only, since the same views on the canvas tier are within 0.2%.
