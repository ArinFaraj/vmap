# Performance plan

Written 2026-11-10 from a profile of vmap 0.28.0. It replaces "make each
slow thing a little faster" with one rule for the whole engine, and orders
the work by what the profile says costs the most.

## What was measured

The demo, built `--wasm --release`, in Chrome on a Mac with a 120 Hz screen,
Liberty style, tiles from OpenFreeMap. The Mac was running other work, so
read the shape of the numbers and not the last digit.

| Scene | Frames a second | Notes |
| --- | --- | --- |
| Tour, holds | 60 to 100 | never holds 120 |
| Tour, flights and the terrain stop | 34 to 65 | gaps of 50 to 100 ms |
| Lower Manhattan, steady orbit and zoom, everything loaded | 82 to 94 | half the frames 8.5 ms, one in ten 17 ms or more |

One frame of the Manhattan view makes about 200 draw calls, 1,850 WebGL
calls and 226 buffer writes carrying 367 KB.

Where the engine's own paint time goes in that steady view (CPU profile of
the main thread, function names kept, `performance.mark` stubbed out):

| Share | Work | Why it costs |
| --- | --- | --- |
| 42% | Labels | Every glyph of every label is laid out on the CPU and sent to the GPU again each frame. Road names walk their line and project four corners per glyph (20%). Placement runs every frame (8.5%), and so does the sort of candidates (4%). |
| 25% | Building the GPU pass | Flat layers 9%, one stencil square and one uniform write per tile 7%, buildings 6%. Each draw sets up its vertex attributes and writes its own uniform block. |
| 11% | Handing the frame to Flutter | On the web the map's texture becomes an `ImageBitmap` and is posted to Flutter's renderer thread every frame. That thread then spends most of its own time posting the finished frame back. |
| 2.6% | Tile cover | Computed from the root tile every frame, sorted, with new lists each time. |
| 2.4% | Messages to tile workers | A zoom crossing asks for every visible tile again in its new layout. |
| rest | Scheduling, backgrounds, uploads, glue | |

Not measured yet: native platforms, a phone, Safari, Firefox, and 0.27.0
for comparison. So this does not say which commit made the tour slower. On
the frame path 0.28.0 added a stencil square per stand-in tile and the rule
that a ready tile waits until all its children in view are ready.

`dart:developer`'s `Timeline` calls run in release builds: about ten
`performance.mark` calls a frame, more while tiles load. They cost roughly
half a millisecond a frame and much more while DevTools records.

## Done so far

2026-11-10, after 0.28.0, measured on the same Mac in Chrome with
`window.compare.bench` in `bench/web/compare.html` (Manhattan, zoom 15.7,
pitch 72, a 12 second orbit, the page's tab in front). The Mac ran at a
load of 15 to 30 throughout, so runs of the same build differ by half;
the best and worst of each are given. "Before" is 0.28.0 with far
buildings off and on, in a window at a pixel ratio of 1; "now" was
measured after the window moved to a screen at a ratio of 2, four times
the pixels, so the two are not like for like and the gain is understated
if anything. One fast run only.

| | Frames a second | Late frames of about 1,450 | Engine paint, mean |
| --- | --- | --- | --- |
| Before, slow orbit | 103 to 123 | 3 to 248 | 6.0 to 9.1 ms |
| Now, slow orbit | 117 to 125 | 1 to 79 | 4.3 to 7.6 ms |
| Before, fast orbit with zoom | 102 to 107 | 207 to 249 | 8.6 to 9.0 ms |
| Now, fast orbit with zoom | 124 | 2 | 5.1 ms |
| MapLibre GL JS, slow orbit | 73 to 120 | 1 to 406 | |
| After the code quality pass, slow orbit | 119 | 7 to 12 | 5.5 to 5.9 ms |
| After the code quality pass, fast orbit with zoom | 119 | 16 | 5.9 ms |
| MapLibre GL JS, slow orbit, same session | 117 | 8 | |

The last three rows were measured at a load of 38, after the bench's
clock was fixed. Until then it took its start time from the page and its
frame times from the map's frame, whose clocks start apart, so a run
lasted up to a second longer than it was divided by: the frame rates in
the rows above are a few percent off either way, and none over 120 is
real on this 120 Hz screen. Late frames and paint times were not
affected.

What changed:

- **Far buildings (step 4).** Buildings-only tiles of the building zoom
  out to `MapView.buildingReach`, heights sinking to zero over its last
  30 percent in `building.vert`, and a 350 ms rise when a tile becomes
  ready. The frame carries the decision as one `FarBuildings` value.
  `VmapRenderOptions.farBuildings` switches it off, and the render suite
  runs with it off.
- **Road names kept on the GPU (step 1, the first part).** A name laid on
  the ground is laid out once into quads from its anchor
  (`GroundTextPainter`, `SdfQuad`), and `sdf.vert` projects and sizes
  them. A name on a
  bend is laid out again when its size drifts 2 percent. The picture is
  the same to the pixel as the CPU path's. Label drawing went from about
  2.8 ms to 1.9 ms a frame.
- **Tile uniforms (step 2, a part).** Each tile's frame block is written
  once a pass, the blocks of the runs drawn together are written before
  the first of them is drawn so the web sends them together, and blocks
  pack tightly in the arena. The WebGL layer keys vertex arrays by numbers and finds a
  pipeline's uniform blocks by identity.
- **Timeline marks (step 0).** Behind `VMAP_TIMELINE`.

What the profile says is left, in order: placement passes that take 4 to
5 ms when they run (the slice budget does not hold the first pass), the
glyphs of upright labels still queued every frame, the label sort and
the sprite key built as a string per label per frame, one frame block
and one slot block bound per draw (the camera block and instanced tiles
of step 2), and the copy to present (step 3). Not done: the tour replay
with captured frames, anything on a phone or natively, and the "ground
missing while zooming" report.

## The two drawing faults reported

**Buildings missing at the back of a tilted view.** Verified, and fixed by
far buildings (see "Done so far"). Past 60
degrees the far tiles are picked a zoom or more coarser, as MapLibre picks
them. OpenFreeMap's zoom 13 tile over Midtown has one building feature and
no heights; its zoom 14 tile has 1,524 buildings, all with heights. So the
buildings stop at the edge of the last zoom 14 tile, in a straight line,
and that edge moves as the camera turns. MapLibre has the same edge. The
rule that a parent stays until all four children are ready makes it worse
while tiles arrive: a whole zoom 13 square stays flat until the last of its
four is on the GPU.

**Ground missing while zooming in, streets still drawn.** Not reproduced as
a held state. Still views at zoom 15.7 to 19 over Manhattan were whole.
During the flight into New York the frames show square patches at mixed
detail while tiles arrive, which is the stand-in logic and the likely
place. It needs the frame capture of step 0 to pin down.

**Labels arrive late over Tokyo.** Found 2026-11-10 by
`tool/compare_style.sh`, the same at 0.28.0. A debug build on macOS opened
on Tokyo at zoom 14 in the Liberty style shows no label at all after 4
seconds and every label after 8, Latin names and road shields included.
Opened on Erbil it has its labels within 4 seconds. The cause is not
traced. The render suite's harness takes its picture once the engine
reports nothing loading, which over Tokyo is before the labels, so the
engine's own count of what is loading misses whatever they wait for.

The pale shapes seen through the towers are not a fault: Liberty draws its
buildings at less than full opacity, so the FDR and Battery Park show
through them.

## The rule

A frame in which only the camera moved does no work per feature, per glyph
or per label on the CPU. It writes the camera once and draws from what the
GPU already holds. Everything else happens when data changes, in a worker
or in slices under a budget, never because the camera moved.

MapLibre GL JS does not meet this rule either: it projects the glyphs of
line labels on the CPU each frame and runs placement on the main thread.
Meeting it is how vmap gets ahead instead of level.

## Targets

- Engine paint under 2 ms at the median and 4 ms at the 99th percentile
  for the Manhattan view on the reference Mac in Chrome.
- The whole tour at the screen's rate with no gap over two frames once
  tiles are cached, and no gap over 50 ms on a cold cache.
- On the reference Android phone, 60 frames a second with the slowest 1
  percent under 12 ms on each thread.
- Side by side with MapLibre GL JS on the same camera path
  (`tool/web_compare.sh`): at least its frame rate, fewer long frames.
- No frame with a hole, a cut building or a patch at the wrong detail in
  the tour's captured frames.

"Never a dropped frame" cannot be promised on a machine doing other work;
these are the numbers that stand in for it, and each step is done when its
number is met.

## Steps, in order

### 0. A harness that makes the tour a measurement

- A tour replay on a fixed clock that writes, per stop and per flight:
  frame time percentiles, long frames, draw calls, bytes uploaded, glyphs
  laid out, labels placed.
- The same camera path flown in MapLibre GL JS for the comparison.
- Frames captured at fixed times of the replay, compared between builds,
  so a hole or a cut is a failing test and not a report.
- `Timeline` behind a compile time flag, off in release.

### 1. Labels the GPU keeps

The largest share, and it helps every platform.

- A label's glyph quads are built once when it is placed, in world
  coordinates for names on the ground and as an anchor plus pixel offsets
  for upright ones. The vertex shader projects them.
- Per frame a label has one small record: opacity, and for a road name
  which way up it reads. Only records that changed are written.
- Placement runs when the camera has moved enough or new tiles came, in
  slices, and its result fades in, as MapLibre's does every 300 ms.
- Candidates are sorted when the set changes, not each frame.

Expected: 42% of the frame to under 5%.

### 2. Tiles drawn from retained state

- One camera block per frame. A tile's block (origin, scale, paint slots)
  is written when the tile or a zoom dependent paint value changes.
- Zoom dependent paint interpolated in the shader from its stops, so a
  zoom change rewrites nothing per tile.
- A vertex array object per tile buffer on the web.
- Tiles clipped to their squares in the shader, with the stencil kept only
  for frames that have stand-ins, drawn as one instanced call.
- Cover computed incrementally and without allocation.

Expected: 25% to under 8%, and under 60 draw calls for the Manhattan view.

### 3. No copy to present on the web

The map's WebGL canvas becomes a page element under Flutter's own canvas
in every browser, as it already is in Safari and Firefox, with the labels
drawn into the map's image. Flutter then repaints only when a widget
changes. This removes the 11% on the main thread and most of the renderer
thread's work. Widget markers can then trail the map by a frame, as
MapLibre's DOM markers do; pins and labels drawn by the engine do not.

### 4. Buildings

- Far buildings: building tiles keep their data zoom to a set distance
  past where the ground coarsens, and heights fall smoothly to zero before
  that distance ends. No edge, nothing that pops as the camera turns. A
  switch keeps MapLibre's exact behaviour for the render tests.
- A building rises from the ground when its tile arrives instead of
  waiting for its three neighbours.
- The vertex packed from 13 floats to 6 or 8 (already on the roadmap).

### 5. Tiles in transit

- A new tile fades in over the stand-in it replaces, so mixed detail is
  never a hard square.
- A zoom crossing reuses a tile's fills, lines and buildings and builds
  only its symbol layout again.
- The step 0 captures decide what is left of the "ground missing" report.

### 6. Native and the long tail

- Steps 1, 2, 4 and 5 are shared code, so the phone gets them. Measure
  with `tool/bench_device.sh` after each.
- Per frame allocation audit: lists and closures made per draw.
- Safari, Firefox and Impeller's OpenGL ES backend run through the
  harness.

## Decisions to make

1. **Web presentation (step 3).** Recommended: yes, the page element in
   every browser.
2. **Far buildings past MapLibre (step 4).** Recommended: on by default,
   MapLibre's behaviour behind a switch.
3. **Placement on a cadence with a fade (step 1).** Recommended: yes.
4. **Order.** Recommended: 0, 1, 2, 3, 4, 5, 6. Step 3 can move ahead of 1
   if the web demo is the priority, since it is the smallest change with a
   visible gain there.

## How the profile was taken

```bash
cd demo
flutter build web --wasm --release --no-strip-wasm --no-web-resources-cdn
```

Served with `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`, opened at `?stop=2&still`,
and orbited with synthetic pointer and wheel events so the view is steady.
A DevTools performance trace of that gives the main thread's functions by
name. Stub `performance.mark` and `performance.measure` first: recording
makes them cost a tenth of the frame.
