# The GPU map renderer

How the Flutter GPU tier draws the map itself, not only its buildings.
Decided 2026-10-13 from measurements; see the end for them.

## One draw per tile

A Flutter GPU draw costs the UI thread about 2 us on an M-series Mac
(`example/lib/gpu/draw_bench.dart`), several times that on a phone. A
map drawn one call per layer per tile, as the canvas tier does, is 300 to
500 calls a frame: 3 to 5 ms of a phone's 8.3 ms at 120 Hz before any
other work. So the renderer draws each tile in one call, or a few when
its geometry passes a buffer's size:

- Tiles do not overlap, so a tile can draw all its layers itself, in the
  style's order, and still come out in order across the whole map.
- The tile worker writes one vertex stream per tile with every fill,
  line and circle layer's geometry in style order. A layer that reads
  the same bucket as another (a road and its casing) repeats the
  geometry; that is the price of one call.
- Each vertex carries a style slot: one per layer, or one per data group
  of a layer whose paint reads feature properties.
- A frame evaluates every slot's paint (colour, opacity, width, offset,
  translate, blur) at the current zoom and uploads them as a small data
  texture the vertex shader reads. Nothing about a tile's geometry is
  rebuilt when the zoom changes.

## Vertex format

Six floats a vertex, every one an exact integer or a value the shader
can unpack with arithmetic alone, since OpenGL ES 2 shaders have no
integers or bit operations (`GpuStream` in `lib/src/tiles/gpu_stream.dart` is
the reference):

- position: x and y in tile units;
- extrusion: a line vertex's direction from its centre line, two 12 bit
  numbers in one float;
- the offset direction for a line's `line-offset`, packed the same way;
- the slot within its draw, plus 16384 times the kind (fill, line,
  patterned fill, circle, patterned line, gradient line), plus for a
  patterned line 131072 times where the vertex sits across it in 127ths.
  The largest value stays under 2^24, so the float is exact;
- distance along a line in tile units, or for a gradient line its share
  of the whole line times 256.

The shader puts a line vertex at `base + extrusion * halfWidth[slot]`,
so a width change is a texture write, not a rebuild.

## Clipping

A tile standing in for a missing child is clipped to the child's area
with the stencil buffer: each ideal tile writes its own reference value
over its square first, and draws test equal. Scissor rectangles stop
being rectangles once the map tilts, so they are not used.

## What stays on the canvas

Labels and icons (drawn over the GPU image), raster and hillshade layers
in the middle of the vector layers, and heatmaps. A style using a
heatmap is drawn by the canvas tier entirely, so order is never wrong.

Patterned lines stretch their sprite across the line's width and repeat
it along the line, as the canvas tier draws them. Gradient lines read a
texture with one 256 pixel row per gradient layer, made when the style
changes.

## Depth

Buildings draw in the same pass after the flat layers, with depth test
and write on; flat layers write no depth. Labels behind buildings can
then be faded with one depth read per label anchor.

## Measured

| | UI thread per draw |
| --- | --- |
| Flutter GPU, M-series Mac, 100 to 1000 draws a frame | 2.5 to 1.6 us |
| Phone | to measure |

## Learned from other Flutter GPU projects

Read 2026-10-13: hyshu/maplibre_flutter_gpu (MapLibre core replayed through
Flutter GPU), bdero/flutter_scene, definev/gputext, and the Flutter GPU
package source on our pinned SDK.

- Uniforms: Flutter's `HostBuffer` checks a block's room without the
  write's length and adds a new block every frame once one fills
  (flutter/flutter#186526 and #192392, both open). flutter_scene keeps its
  own arena; so do we (`_Uniforms`), reusing blocks across four frames.
- Frame pacing: Vulkan and Metal encode on the thread that submits, so a
  GPU that falls behind blocks the UI thread. flutter_scene submits with a
  completion callback and shows the last image while frames are in flight;
  we allow two.
- Presenting: make each ring texture's `ui.Image` once (hyshu), not every
  frame. Flutter now has `GpuImageSurface` (flutter/flutter#187358, merged
  2026-06-13), which manages that ring safely; not on our pinned SDK yet.
- Keep depth, MSAA and resolve textures created together: Vulkan's
  framebuffer cache keys on the colour attachment alone
  (flutter/flutter#192538, open), so a resolve texture met with another
  depth texture can crash on Mali.
- Big buffers: hyshu packs small uploads into 1 MB host visible pages with
  `overwrite` and `flush`; we pool power of two buffers per tile and fill
  them within a per-frame budget, which none of the projects does.
- Text: gputext and the PDF renderer draw glyphs from curve data in the
  shader (Slug style), no halos. Nobody draws haloed map labels on Flutter
  GPU; ours are CPU rasterized in an isolate with distance field halos.
- GLES: hyshu and gputext compile shaders for GLSL ES 3.00, which allows
  integer attributes and bit operations; we target 1.00 with exact float
  packing. Whether moving to 3.00 drops any device we care about is not
  checked.
