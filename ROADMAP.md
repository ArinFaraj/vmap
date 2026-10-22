# Roadmap

vmap started as a flutter_map layer drawn with the canvas, because Flutter GPU
did not run on the web. The WebGL2 shim taken from flutter_scene runs it
there, Impeller is the default on every native platform as of Flutter 3.47,
and the GPU renderer now passes 1,394 of the 1,519 MapLibre render tests in
scope (92%; 1,401 of all 1,730, including ones out of scope). So the
project becomes its own map engine for Flutter: GPU first, 3D, its own widget
and camera, and a small adapter for apps that use flutter_map.

Where each platform stands, with sources: [doc/platform-support.md](doc/platform-support.md).
What the API looks like and what should change before release:
[doc/api-review.md](doc/api-review.md).

## Status

- **Done, 2026-10-21:** steps 1 to 5 and 7 below, and the fixes from
  [doc/review.md](doc/review.md), whose last table gives each finding's
  state. vmap is 0.27.0 on the `engine` branch, unpublished.
- **Done, 2026-10-22 and 23:** the web made fast (uniform blocks, shared
  fetches, earlier loading), gestures matching MapLibre GL JS, vmap's own
  OpenType shaper in place of payv, and the release pass: `vmap:setup`,
  `onFeatureTap`, content comparison of styles and overlays, no refresh
  rate requests, all six platforms in the pubspec, the README rewritten.
- **Open before publishing:** step 6 (runs on an iPhone, Windows, Linux,
  Safari and Firefox). The web, JavaScript and WebAssembly builds both,
  was checked in headless Chrome.
- **Then:** step 8, publishing, which waits for Arin's yes: merging
  `engine` to `main` and tagging publishes vmap to pub.dev.
- Work happens on the `engine` branch of `ArinFaraj/vmap`.

Keep this section current: update it whenever a step starts or finishes.

## Decided

- **vmap becomes the engine**, under its existing name (decided 2026-10-21,
  [doc/naming.md](doc/naming.md)): the map widget, the camera, styles, tiles,
  labels and the GPU renderer, built in rather than in a second package.
- **GPU first.** All new work is on the GPU renderer. The canvas renderer is
  frozen: kept so a map still draws on Android 9 and older, Vivante devices,
  browsers without WebGL2 and in `flutter test`, but given no new features.
  Standing 3D buildings, globe and terrain are GPU only; the canvas draws a
  tilted map with its buildings flat.
- **flutter_map is optional.** Its layers move to a separate adapter package
  built on the engine, so apps that do not use flutter_map do not pull it in.
- **Flutter 3.47.1 or newer**, the first release where Windows and Linux can
  switch Flutter GPU on.
- **MapLibre is the reference.** Its render tests and the real-style
  comparison (`tool/compare_style.sh`) stay the measure of correctness.

## Still to decide

- **Whether the canvas renderer goes entirely**, once we know whether
  `flutter test` can run Flutter GPU and how Impeller's OpenGL ES backend
  copes on old phones.

## 0.1: the first release

The engine as it stands, packaged and run on every platform.

Already in, from the work so far:

- Any MapLibre style: 1,394 of the 1,519 render tests that must pass, and at
  most 4.3% of pixels different from MapLibre over 21 views of the
  OpenFreeMap liberty, bright and positron styles.
- GPU drawing: fills, lines, gradients, dashes and patterns in one draw per
  tile; 3D buildings with a depth buffer; globe, terrain, sky and fog;
  heatmaps; raster and hillshade layers.
- Labels in every script, Arabic and Kurdish shaped correctly (MapLibre, with
  its right-to-left plugin and OpenFreeMap's fonts, leaves some of their
  letters unjoined), with MapLibre's placement and collision circles,
  smooth motion while panning, zooming and tilting, and an old frame warped to
  the new camera when the GPU falls behind.
- Vector tiles in MVT and MLT, PMTiles archives, GeoJSON with clustering, a
  disk cache and regions downloaded for offline use.
- The `Vmap` widget with gestures for touch, mouse, trackpad and keyboard,
  `flyTo`, `easeTo` and `fitBounds`, markers that are widgets, feature
  lookup under a tap, and feature state for highlighting.

To do before publishing:

1. Done: the GPU renderer is part of `vmap`, the flutter_map layers are the
   `vmap_flutter_map` adapter beside it, and the canvas is a renderer of
   the same shape, kept as the fallback.
2. Done: the API and first impression, per
   [doc/api-review.md](doc/api-review.md) and [doc/review.md](doc/review.md).
3. Done: `example/` targets every platform with Flutter GPU switched on;
   the benchmark app is `bench/`.
4. Done: a `.pubignore`, version 0.27.0 and its changelog,
   and the shader bundle shown to land when vmap comes as published files.
   `vmap_flutter_map` depends on vmap by path and has `publish_to: none`
   until it is published after vmap.
5. Done: CI checks every push, builds the example for the web, Android,
   iOS, Linux and Windows, and runs MapLibre's render tests on the GPU.
6. Run it on an iPhone, a Windows PC, a Linux PC, Safari and Firefox, and fix
   what breaks.
7. Done: the README is written around the engine, with the platform table
   and a guide for moving from 0.26.
8. Publish vmap, then vmap_flutter_map.

## 0.2: steady on real devices

- **Impeller's OpenGL ES backend.** Force it on an Android phone with
  `io.flutter.embedding.android.ImpellerBackend=opengles` and run everything:
  32 bit indices, depth and stencil, multisampling, buildings, terrain, globe.
  Fix or work around what it lacks, and write down the limits.
- **Old phones.** An Android 9 phone and a cheap Android 10+ phone, forced to
  OpenGL ES and not.
- **Phone benchmark.** The tour on a phone with peak memory and the count of
  frames reused because the GPU fell behind (both already reported), and at
  120 Hz.
- **Labels that blink while turning.** Some labels fade in and back out while
  the map rotates or tilts, as placement changes under motion. Make placement
  keep what it shows unless something clearly wins the space.
- **Building memory.** Pack the 13 floats of a building vertex tighter; a
  dense tile still holds about 9 MB of building vertices.
- **`flutter test`.** Find out whether the tester can run Flutter GPU. If it
  can, golden tests draw the real renderer; if not, the canvas stays for tests.
- **The flutter_map adapter**, brought up to date with the engine.

## 0.3: your own 3D

What makes the engine more than a MapLibre port: apps adding their own 3D
content to the map.

- **Custom GPU layers.** A layer that draws with Flutter GPU in the map's
  render pass, between style layers, with the camera's matrices and the depth
  buffer, as MapLibre's custom layers do in WebGL.
- **3D models on the map.** Place glTF models from flutter_scene at a place,
  with height, heading and scale, lit and depth tested with the buildings.
- **Moving things.** Animated models and markers that follow a path, with the
  camera able to follow them.
- **Custom shaders** for a style layer or a whole tile, and styling hooks the
  MapLibre spec does not have.

## 0.4: the rest of MapLibre

Render tests that still fail and could matter to some styles:

- Vertical CJK names along steep roads (about 8 tests).
- A gradient texture per tile for very fine steps on continent long lines.
- Image sources that are not north up, draped on the globe and on terrain.
- Patterned buildings drawn in MapLibre's two passes, depth then colour once
  per pixel, so overlapping copies at tile edges do not stack.
- Halos and glyphs drawn label by label for sort-key layers.
- Which line names flip to stay upright, decided as MapLibre does.
- Line label collisions that tie with MapLibre's to a fraction of a pixel.
- The globe and terrain tests (about 47).

## Later

- Toward 1.0: an API we promise to keep, every platform run regularly, and
  Flutter GPU out of preview.
- Ideas raised but not planned yet: route and navigation lines, indoor maps,
  more of what the MapLibre spec leaves out.

## Decision log

- 2026-10-18: the goal is passing the MapLibre render tests that make sense
  for vmap, then going past MapLibre.
- 2026-10-20: parity work on the GPU renderer; the canvas only has to draw
  ordinary styles well.
- 2026-10-21: Flutter GPU runs on every platform (Impeller default on native
  as of 3.47, the WebGL2 shim on the web), so a new GPU first package replaces
  vmap, the canvas is frozen as a fallback, and flutter_map becomes an
  adapter. Before release, the API and first impression get a polish pass.
- 2026-10-21: the engine keeps the name vmap.
- 2026-10-21: test Impeller's OpenGL ES backend by forcing it on an Android
  phone (0.2).
- 2026-10-21: after a critical review, one camera and one zoom scale
  (MapLibre's) in the public API, the GPU by default, one glyph setting,
  and the canvas as a renderer behind the same interface as the GPU.
- 2026-10-22: vmap shapes text with its own OpenType shaper and bidi
  algorithm in `lib/src/text/`, held to HarfBuzz and Unicode's conformance
  tests, instead of depending on payv.

## How this is measured

- `tool/render_suite.sh ~/projects/maplibre-gl-js <out> "" --gpu`: MapLibre's
  render tests, hidden, with the exceptions and out-of-scope lists in `tool/`.
  CI runs it on the GPU on macOS against a pinned MapLibre commit and fails
  below `tool/render_suite_floor.txt`, three under its 1,394: on the
  runner `regressions/mapbox-gl-js#2762` and
  `icon-size/property-function-plain` pass or fail with timing. A local checkout with probe tests of our own in it
  counts a few more; the canvas renderer passes 1,074 in such a checkout.
- `tool/compare_style.sh`: real OpenFreeMap styles over real places against
  MapLibre GL JS with its right-to-left plugin.
- The bench app's tour on a phone for frame times and memory
  ([doc/benchmark.md](doc/benchmark.md)).
