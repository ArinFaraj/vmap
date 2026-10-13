# Open questions

Every design choice so far is settled in [decisions.md](decisions.md). What
is left are questions only measurement answers. Each names the decision it
could reopen.

## The first spike

1. Text (D9): 500 labels on a tilted map during a fly, multi-channel distance
   field glyphs against Flutter `Paragraph` images, on the cheap OpenGL ES
   phone: frame time, memory, sharpness. Shaping time per label.
2. Text on the canvas tier (D9, D10): a way to draw from a distance field
   atlas with the Flutter canvas, on Skia and on the web.
3. Tilt on the canvas tier (D6): a 4x4 perspective transform on the canvas
   for flat layers, with labels projected on the CPU, holding the frame
   budget during a fly.
4. Flutter GPU on OpenGL ES (D2): pipelines created after the first frame,
   on a Huawei, a MediaTek and an Adreno 610 phone, with no hang
   (flutter/flutter#193890).

## Data, before the 3D work

5. Kurdish names (D11): how many places in Kurdistan carry `name:ckb` and
   `name:kmr` in OpenStreetMap.
6. Building heights (D11): how many buildings in Kurdistan carry a height or
   a level count in OSM or Overture. If few, buildings get heights estimated
   from footprint and area type, flagged as estimates in the tiles.
7. Terrain (D12): Mapterhorn's attribution terms and its real resolution over
   the Zagros.

## Kernels, as they are written

8. Each kernel's time against its budget on the cheap phone (D15): tile
   decode (MVT and MLT), tessellation, shaping, distance fields, collision.
   A kernel more than 2x over after optimisation moves to Rust.
