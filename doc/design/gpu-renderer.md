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

Packed into 32 bit words, as the buildings are:

- position: x and y, 16 bits each, half tile units plus 16384;
- extrusion: a line vertex's direction from its centre line, two signed
  bytes scaled to unit length, and the side for a line's offset;
- distance along a line for dashes, 16 bits;
- style slot, 16 bits, and the kind: fill, line, circle.

The shader puts a line vertex at `base + extrusion * halfWidth[slot]`,
so a width change is a texture write, not a rebuild.

## Clipping

A tile standing in for a missing child is clipped to the child's area
with the stencil buffer: each ideal tile writes its own reference value
over its square first, and draws test equal. Scissor rectangles stop
being rectangles once the map tilts, so they are not used.

## What stays on the canvas, at first

Labels and icons (drawn over the GPU image, as now), raster and
hillshade layers, heatmaps, fill and line patterns, line gradients.
A style using them in the middle of its fill and line layers is drawn by
the canvas tier entirely until each moves over, so order is never wrong.

## Depth

Buildings draw in the same pass after the flat layers, with depth test
and write on; flat layers write no depth. Labels behind buildings can
then be faded with one depth read per label anchor.

## Measured

| | UI thread per draw |
| --- | --- |
| Flutter GPU, M-series Mac, 100 to 1000 draws a frame | 2.5 to 1.6 us |
| Phone | to measure |
