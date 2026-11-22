# Roadmap

vmap is a map engine for Flutter: its own widget and camera, MapLibre
styles, and a renderer on Flutter GPU, with a small adapter for apps that
use flutter_map. It began as a flutter_map layer drawn with the canvas; the
[changelog](CHANGELOG.md) has that history, and
[doc/design/history](doc/design/history) the reviews and the naming that
shaped the engine.

## Status

- **On pub.dev since 0.27.0.** It runs on Android phones on Vulkan and on
  OpenGL ES, an iPhone, a Mac, and in Chrome, Safari and Firefox. Windows
  and Linux are built by CI but not run yet. Where each platform stands,
  with sources: [doc/platform-support.md](doc/platform-support.md).
- **Correctness.** The GPU renderer passes 1,394 of the 1,519 MapLibre
  render tests in scope (92%; 1,401 of all 1,730, including ones out of
  scope). On 2026-11-10, over the 21 views of the OpenFreeMap liberty,
  bright and positron styles, 19 differed from MapLibre GL JS by 4.1% of
  pixels or less and two of those not at all. The two Tokyo views differed
  by 6.4% and 8.8% because the harness took their pictures before any label
  was drawn (see "Labels arrive late over Tokyo" in
  [doc/performance-plan.md](doc/performance-plan.md)).
- **Speed.** At the screen's rate it holds 60 frames a second in Chrome and
  about 120 on the phones and the iPhone tried. With the frame rate uncapped,
  MapLibre GL JS is still ahead in Chrome; the numbers are in the
  [changelog](CHANGELOG.md) and [doc/performance-plan.md](doc/performance-plan.md).
- Work happens on the `main` branch of `ArinFaraj/vmap`.

## Decided

- **vmap is the engine**, under the name it had as a flutter_map layer
  (decided 2026-10-21,
  [doc/design/history/naming.md](doc/design/history/naming.md)): the map
  widget, the camera, styles, tiles, labels and the GPU renderer, built in
  rather than in a second package.
- **GPU first.** All new work is on the GPU renderer. The canvas renderer is
  frozen: kept so a map still draws on Android 9 and older, Vivante devices,
  browsers without WebGL2 and in `flutter test`, but given no new features.
  Standing 3D buildings, globe and terrain are GPU only; the canvas draws a
  tilted map with its buildings flat.
- **flutter_map is optional.** Its layer is the `vmap_flutter_map` adapter
  package beside the engine, so apps that do not use flutter_map do not
  pull it in.
- **Flutter 3.47.1 or newer**, the first release where Windows and Linux can
  switch Flutter GPU on.
- **MapLibre is the reference.** Its render tests and the real-style
  comparison (`tool/compare_style.sh`) stay the measure of correctness.

## Still to decide

- **One list of engine options.** `Vmap` and `VmapEngine` take the style,
  overlay, labels and the rest one by one, as `VmapEngineOptions` holds
  them, so the list is written out in `Vmap`, `VmapEngineOptions` and
  the engine's constructor. Taking a `VmapEngineOptions` in both would
  leave one, but breaks every app that builds a `Vmap`: for a release that
  breaks the API anyway.
- **Whether the canvas renderer goes entirely**, once we know whether
  `flutter test` can run Flutter GPU and how Impeller's OpenGL ES backend
  copes on old phones.

## Next: steady on real devices

- **Windows and Linux** run on real machines.
- **Impeller's OpenGL ES backend.** Force it on an Android phone with
  `io.flutter.embedding.android.ImpellerBackend=opengles` and run everything:
  32 bit indices, depth and stencil, multisampling, buildings, terrain, globe.
  Fix or work around what it lacks, and write down the limits.
- **Old phones.** An Android 9 phone and a cheap Android 10+ phone, forced to
  OpenGL ES and not.
- **Phone benchmark.** The tour on a phone with peak memory and the count of
  frames reused because the GPU fell behind (both already reported), and at
  120 Hz.
- **Building memory.** Pack the 13 floats of a building vertex tighter; a
  dense tile still holds about 9 MB of building vertices.
- **`flutter test`.** Find out whether the tester can run Flutter GPU. If it
  can, golden tests draw the real renderer; if not, the canvas stays for tests.
- **The flutter_map adapter** published on pub.dev, after vmap.

## Then: your own 3D

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

## After that: the rest of MapLibre

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
  phone.
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
  `icon-size/property-function-plain` pass or fail with timing. A local
  checkout with probe tests of our own in it counts a few more; the canvas
  renderer passes 1,074 in such a checkout.
- `tool/compare_style.sh`: real OpenFreeMap styles over real places against
  MapLibre GL JS with its right-to-left plugin.
- The bench app's tour on a phone for frame times and memory
  ([doc/benchmark.md](doc/benchmark.md)).
