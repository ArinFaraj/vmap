# 3D terrain

Hills and valleys drawn from a raster DEM, on the Flutter GPU tier only
(D6, D10: the canvas tier keeps hillshade). Read against MapLibre GL JS
`render/terrain.ts`, `webgl/render_to_texture.ts`, `data/dem_data.ts` and
`shaders/glsl/terrain.*.glsl`.

## The approach: drape, do not displace

Vector meshes have large triangles: a lake can be a handful of vertices,
so moving the map's own vertices up and down cannot follow a hillside.
As MapLibre does, the flat layers of each terrain tile are drawn into a
texture, and that texture is laid over a grid mesh raised by the DEM.
Buildings, labels and the camera take their height from the same DEM.

## Pieces, in the order they are built

1. **Elevation tiles.** The style's root `terrain` names a `raster-dem`
   source and an `exaggeration`. Its tiles are fetched and decoded in the
   tile workers (`raster.dart` already decodes Terrarium and Mapbox RGB).
   Each keeps a one pixel border filled from its neighbours once they
   load, as `DEMData.backfillBorder` does, or every tile seam shows.
2. **Height on the CPU.** A bilinear lookup in metres for any world point,
   from the deepest loaded DEM tile covering it. The camera, label anchors
   and building bases read it.
3. **The grid mesh.** One grid per terrain tile, heights written on the
   worker into the vertex buffer: an OpenGL ES 3 vertex shader may not
   read textures on every phone. One shared index buffer. Skirts hang
   down each edge, a fifth of the tile's width in metres, to hide the
   gaps between tiles of different zoom.
4. **The drape.** All terrain tiles' flat layers are drawn in one render
   pass into an atlas texture, one viewport and scissor per tile
   (`RenderPass.setViewport`, `setScissor`). Hillshade and symbols are not
   drawn into it: hillshade is drawn over the mesh, symbols over the map.
5. **Only what changed.** A tile's atlas slot is drawn again only when
   its tiles, its paint or the zoom changes it. Zooming redraws every
   frame anyway; that is the case to measure on the phone first.
6. **Depth.** The draped ground writes depth, so buildings stand on it
   and labels behind a hill fade as they do behind buildings.
7. **Style and camera.** `terrain.exaggeration`, the `setTerrain` test
   operation, and a camera kept above the ground.

## The first slice

One terrain tile raised and draped, flat lit, on the phone, with its
frame time, before labels or buildings learn about height. The bar is
Arin's smoothness on the phone, not the 38 terrain render tests.

## Open

- Mapterhorn's attribution terms and its real resolution over the Zagros
  (open question 7) before it becomes the default source.

## Where it stands (2026-10-14)

Built: elevation tiles with filled borders and a height lookup; the
style's `terrain` source loaded through the raster tile store; the drape
atlas drawn in one pass; one shared grid raised and lit in the vertex
shader from r32Float height textures; buildings lifted to the ground at
their tile's middle; labels projected standing on the ground.

On the phone (Vivo V2514, Vulkan), flying to Korek mountain with Liberty
and the AWS Terrain Tiles at 1.5 times: 568 frames in 4.8 s, build p99
5.5 ms, raster p99 3.8 ms, the same as without terrain. A first version
that made a mesh per tile on the UI thread fell to 14 frames in 3 s.

Still to come: skirts between tiles of different zoom, raster and
hillshade layers draped instead of left flat under the ground, labels
hidden behind hills, buildings standing on the ground at each building
rather than at its tile's middle, the camera kept above the ground, and
the `setTerrain` test operation.
