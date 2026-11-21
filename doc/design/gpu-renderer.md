# The GPU map renderer

How the Flutter GPU tier draws the map, and what it asks of Flutter GPU.
The code is in `lib/src/gpu/`. First decided on 2026-10-13 from
measurements; brought up to date on 2026-11-21 against Flutter 3.50.

## A frame

`GpuMap.paint` draws one frame for one camera:

1. It sizes the frame's textures, lets idle tiles' memory go past three
   quarters of the heap's cap, and writes the frame's uniform blocks.
2. What the map's own pass samples is drawn first, each in a command
   buffer of its own: every heatmap layer's density, a quarter of the
   screen across, and over raised ground or the globe the drape atlas (see
   below).
3. The map's pass draws the style's runs in order into one image. A layer
   whose opacity applies to it as a whole goes into a texture of its own
   first, which the map's pass then lays over itself at that opacity.
4. A new image begins only where the canvas draws between the GPU's
   layers: a background or a raster layer after vector layers, and what
   the style puts after its last symbol layer. `FrameLayers.splits` says
   where. Most styles need one image.
5. The labels' text and icons are instanced quads cut from distance fields
   (`SdfTextGpu`). They are drawn into the pass of the image under the
   labels, which is held open until the engine has placed them, and that
   pass's commands go to the GPU last.
6. The canvas lays the images down with `drawImageRect`, between what it
   draws itself. On the web they go into page elements instead.

Two frames may be in flight on the GPU. While they are, the last image is
shown again, warped to the camera that has moved on, so the labels drawn
for the new camera stay over their map. Vulkan and Metal encode on the
thread that submits, so a GPU that falls behind would otherwise block the
UI thread.

## One draw per tile

A Flutter GPU draw costs the UI thread about 2 us on an M-series Mac
(`bench/lib/gpu/draw_bench.dart`), several times that on a phone. A map
drawn one call per layer per tile, as the canvas tier does, is 300 to 500
calls a frame: 3 to 5 ms of a phone's 8.3 ms at 120 Hz before any other
work. So the renderer draws each tile in one call, or a few when its
layers name more than 80 style slots:

- Tiles do not overlap, so a tile can draw all its layers itself, in the
  style's order, and still come out in order across the whole map.
- The tile worker writes one vertex stream per tile with every fill, line
  and circle layer's geometry in style order. A layer that reads the same
  bucket as another (a road and its casing) repeats the geometry; that is
  the price of one call.
- Each vertex carries a style slot: one per layer, or one per data group
  of a layer whose paint reads feature properties.
- A frame evaluates every slot's paint (colour, opacity, width, offset,
  translate, blur) at the current zoom and writes them into the uniform
  block the vertex shader reads. Nothing about a tile's geometry is rebuilt
  when the zoom changes.

## Vertex format

Six floats a vertex, every one an exact integer or a value the shader can
unpack with arithmetic alone, since the shaders are GLSL ES 1.00 and have
no integers or bit operations (`GpuStream` in `lib/src/tiles/gpu_stream.dart`
is the reference):

- position: x and y in tile units;
- extrusion: a line vertex's direction from its centre line, two 12 bit
  numbers in one float;
- the offset direction for a line's `line-offset`, packed the same way;
- the slot within its draw, plus 16384 times the kind (fill, line,
  patterned fill, circle, patterned line, gradient line, heat), plus for a
  patterned line 131072 times where the vertex sits across it in 127ths.
  The largest value stays under 2^24, so the float is exact;
- distance along a line in tile units, or for a gradient line its share
  of the whole line times 256.

The shader puts a line vertex at `base + extrusion * halfWidth[slot]`, so
a width change is a uniform write, not a rebuild.

A building vertex is 13 floats (`BuiltExtrusion`). Packing it tighter is on
the roadmap: a dense tile holds about 9 MB of them.

## Clipping

A tile's data runs a little past its square, and a tile standing in for a
missing one must not show through the tiles beside it. Each tile writes
its own number over its square in the stencil buffer, and its draws test
equal. Tilted, a square is no rectangle on the screen, so scissors cannot
do it. Circles and heatmap points are drawn whole, past their tile's
square, as MapLibre draws them.

## Depth

Buildings draw in the same pass after the flat layers, with depth test and
write on and back faces culled; flat layers write no depth. Translucent
buildings are drawn as MapLibre draws them: depth alone first, then colour
where the depth is their own, each pixel once.

Only frames that need it are multisampled: the globe, raised ground, and
buildings on a tilted map. A flat map's edges are smoothed by its fills'
outlines and its lines' faded edges, as MapLibre's are without its
`antialias` option. The web never multisamples.

## Raised ground and the globe

As MapLibre draws terrain, the flat layers of each tile of ground are drawn
from above into a slot of one atlas texture (`Drape`), and a grid per tile,
raised in the vertex shader from its tile of heights, is drawn with depth
and coloured from its slot. A slot is drawn again only when what it shows
changed, a few a frame, so a map at rest or turning over the same ground
costs next to nothing. Buildings, circles and labels stand on the ground
in the frame's own pass. More in [terrain.md](terrain.md).

## Memory

- **Tiles** live in `GpuHeap`: host visible 4 MB slabs handed out in
  ranges, so a tile on its way to the GPU rarely makes the driver allocate
  (about a millisecond for every 2 MB on a phone). A range given back waits
  until every frame submitted before it has finished. Uploads go in 256 KB
  pieces within the frame's budget, and a tile's own copy of its geometry
  is let go once it is on the GPU.
- **Uniforms** go through `UniformArena`: blocks reused over four frames.
  Flutter's `HostBuffer` checks a block's room without the write's length
  and adds a new block every frame once one fills (flutter/flutter#186526
  and #192392, both still open on 2026-11-21).
- **Scratch textures** (depth, stencil, the samples of a multisampled
  pass) are `deviceTransient` where the GPU has tile memory.

## What each backend asks

These were found on real phones; none shows on a Mac or in a browser.
[platform-support.md](../platform-support.md) has the sources.

- **Vulkan: one pass a texture a frame, always the same shape.** Impeller
  keeps the first render pass and framebuffer made for a texture and begins
  every later pass on it as that one. So a texture has one `PassTarget` for
  as long as it lives, whatever is drawn over a frame goes into the pass
  still open on it, and depth, samples and resolve textures are made
  together (flutter/flutter#192538, open). `test/frame_passes_gpu_test.dart`
  holds this, since `flutter test --enable-impeller` runs on Vulkan.
- **OpenGL ES: a one-channel texture is alpha.** A red one draws nothing
  on an Adreno 650. The glyph atlas is `a8UNormInt` on native and red on
  the web, and its shader is told which channel to read.
- **OpenGL ES: no pipeline before the first frame.** A pipeline made
  before the app has a surface can deadlock (flutter/flutter#193890, open),
  so the pipelines are made with the first frame drawn. A frame's worth of
  empty draws then warms every pipeline state the map uses, which would
  otherwise stall the first frame that draws in it.

A device that refuses a texture, a pipeline or a command buffer hands the
map to the canvas from the next frame on, and the app's `onError` hears a
`VmapErrorKind.gpu` error.

## The web

`gpu_shim/` is `package:flutter_gpu` on every platform: Flutter GPU itself
on native, and on the web a WebGL2 implementation of the same API reading
the same shader bundle, copied from flutter_scene (see its README for what
was changed). The differences the renderer knows about are few: each tile
has buffers of its own there, uniform blocks are small, and a frame's
images go to the page as elements instead of through Flutter's canvas.

## What stays on the canvas

Backgrounds, raster and hillshade layers on a flat map, the sky and the
globe's atmosphere (Flutter fragment shaders), pins, and labels where the
renderer has no distance field text. Over raised ground the GPU drapes the
backgrounds and tiled rasters itself.

## Flutter GPU features looked at and left

Checked on 2026-11-21 against Flutter 3.50. None is a reason to raise the
minimum Flutter from 3.47.1.

- **`GpuImageSurface`** (3.47, flutter/flutter#187358) hands out the
  textures Flutter shows and never one Flutter still reads. The renderer
  keeps its own ring of three instead: a frame can have several images,
  each with a pass that reads others, the image under the labels keeps its
  pass open after the frame is "presented", and the web shim has no
  surface. With two frames in flight at most, a ring of three is never
  drawn into while the raster thread can still be showing it. Worth
  another look when custom layers bring their own targets.
- **`BindingSet`** (3.50, flutter/flutter#190400) resolves a group of
  bindings once. A tile's uniforms are written to a new place in the arena
  every frame, so a set would be made again per tile per frame, and the
  textures are bound once a pass already.
- **`CommandBuffer.copyBufferToTexture`** (3.47) writes part of a texture.
  The glyph atlas is 2048 texels square and is sent whole on native when a
  glyph is added. On the Mac's test backend that is 135 us against 51 us
  for a region of 64 rows: not worth a second upload path until a phone's
  profile shows it.
- **Compute** has no Dart API yet (flutter/flutter#188474).
- **GLSL ES 3.00** would allow integer attributes and bit operations in
  place of the exact float packing. Whether it drops any device we care
  about is not checked.

## Measured

| | UI thread per draw |
| --- | --- |
| Flutter GPU, M-series Mac, 100 to 1000 draws a frame | 2.5 to 1.6 us |
| Phone | to measure |

## Learned from other Flutter GPU projects

Read 2026-10-13: hyshu/maplibre_flutter_gpu (MapLibre core replayed through
Flutter GPU), bdero/flutter_scene, definev/gputext, and the Flutter GPU
package source.

- Frame pacing: flutter_scene submits with a completion callback and shows
  the last image while frames are in flight; so do we, allowing two.
- Presenting: make each ring texture's `ui.Image` once (hyshu), not every
  frame.
- Big buffers: hyshu packs small uploads into 1 MB host visible pages with
  `overwrite` and `flush`; we pool slabs per role and fill them within a
  per-frame budget, which none of the projects does.
- Text: gputext and the PDF renderer draw glyphs from curve data in the
  shader (Slug style), no halos. Nobody else draws haloed map labels on
  Flutter GPU; ours are distance fields, as MapLibre's are.
- GLES: hyshu and gputext compile shaders for GLSL ES 3.00; we target 1.00.
