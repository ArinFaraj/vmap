# Package review before 0.1

A critical read of the whole repository on 2026-10-21, after the restructure
(`0c442eb`, `616d997`), asking one question: would this make a good first
impression as a production map engine? Each finding names where it was
seen. "Confirmed" means read in the code and traced; "check" means likely,
to be proven before fixing.

## Verdict

The rendering core is the strongest part: 1,399 of 1,530 MapLibre render
tests, real styles within a few percent of MapLibre, labels in scripts
MapLibre gets wrong, smooth motion. Everything around that core is still the
flutter_map canvas package the project began as, with the engine attached
to it. A new user meets that outer layer first: the README, the example,
the widget, the defaults, the names. Today it reads as two products in one,
and in places they disagree about basic facts such as what a zoom level is.

The work before 0.1 is not more rendering. It is making the outside match
the inside: one camera model, one zoom scale, one text path per renderer,
the GPU on by default, a widget with a complete API, honest packaging, and
tests for the parts users touch.

## 1. Bugs (confirmed)

1. **Two zoom scales in one API.** `VMap`, `VMapController` and
   `MapCameraPosition` use MapLibre's zoom (512 pixel tiles). The engine
   and its public methods use flutter_map's (256), one level higher:
   `VmapCamera.zoom` (`camera.dart`, "256 * 2^zoom"), the `+ 1` the widget
   adds when it paints (`vmap_widget.dart:793`), and `tileZoomAt`
   (`mercator.dart:39`, `mapZoom - 1`). So for a `VMap` user:
   - `clusterExpansionZoom` (`engine.dart:998`, `zoom + 1.0`) answers a
     zoom one level too deep; flying there overshoots the cluster.
   - `downloadRegion(minZoom: 10, maxZoom: 16)` (`offline.dart:33`) fetches
     tile zooms 9 to 15, so the map at zoom 16 offline has no tiles.
   The README's examples are written for the flutter_map widgets, where the
   numbers happen to work.
2. **`easeTo` drops padding, roll and field of view.** It builds each step
   with `MapCameraPosition.world(x, y, zoom, bearing, pitch)`
   (`vmap_widget.dart:129`), the last step included, so the camera ends
   with `pad` zero, `roll` zero and the default `fov`, whatever `to` asked.
   The double tap zoom uses `easeTo` (`_zoomBy`, line 729): with padding set
   for a bottom sheet, one double tap throws the padding away.
   `_Motion.carrying` (line 261) drops the same three while a moving camera
   carries its speed into an animation.
3. **`flyTo` resets roll mid-flight.** `FlyPath.at` (`map_camera.dart:271`)
   never sets `roll`, so it is 0 for the whole flight and jumps to the
   target's roll on the last frame.
4. **The GPU renderer's life is not owned by anyone.** `engine.dispose()`
   (`engine.dart:1542`) never disposes `renderer`, and the README's own
   example passes `renderer: GpuMap.create()` inline, so every engine
   thrown away keeps its GPU textures until the garbage collector finds
   them. Meanwhile the `buildingRenderer` setter (`engine.dart:137`) does
   dispose `renderer`, which the engine keeps using; it survives only
   because `GpuMap` happens to rebuild what it freed.
5. **The engine branch fails CI.** `flutter analyze` treats infos as
   errors, and six remain (`expr.dart:945`, `format.dart:71`,
   `tile_builder.dart:475`, `:597`, `:712`, `tile_id.dart:3`). CI only runs
   on `main` and pull requests, so `engine` has never been checked; it
   would go red on merge.

## 2. The first impression

6. **The README describes the old product.** It opens with "Vector maps for
   flutter_map, drawn with the plain Flutter canvas", "No GPU package",
   "Runs on the stable channel, on Skia or Impeller", and every example uses
   `VmapMap`, `VmapLayer` and `NamedMarker` imported from `package:vmap`,
   which no longer exports them. The engine appears at the very end as a
   "preview". `example/example.md` (the pub.dev Example tab) has the same
   problem. The pubspec description and topics (`flutter-map`) too.
7. **The default `VMap` does not use the GPU.** Its own engine is
   `VmapEngine(style: ..., glyphText: true)` (`vmap_widget.dart:364`), no
   renderer: the headline widget of a GPU first engine draws on the canvas
   unless the app builds an engine itself with `GpuMap.create()`.
8. **The same app gets different text depending on the widget.** `VMap`
   turns on `glyphText`; `VmapLayer` and `VmapMap` leave it off and draw
   labels as images. `styleGlyphs` is a third mode. See section 4.
9. **No mouse wheel, trackpad or keyboard on `VMap`.** Its `Listener`
   handles pointer down, move, up and cancel only (`vmap_widget.dart:754`):
   no `PointerScrollEvent`, no `PointerPanZoom` (macOS and Windows
   trackpads, which send pinch as pan-zoom, not touches), no keys. On
   desktop and the web, where the roadmap says it runs, the map cannot be
   zoomed with a wheel or a trackpad pinch. The flutter_map adapter has
   wheel zoom (`vmap_flutter_map/lib/src/gestures.dart:383`); the engine's
   own widget does not.
10. **`VMap` is a thin widget over a wide engine.** It takes a style, an
    engine, zoom and pitch limits, two switches and `onTap`. Everything
    else (cache, headers, overlay, edits, feature state, pins, markers,
    `onError`, text style) needs the app to build and own a `VmapEngine`
    and set fields on it. `VmapMap` takes all of them as parameters. The
    adapter is more complete than the engine's own widget.
11. **No feedback while loading, and no events** (also in
    [api-review.md](api-review.md), items 8 to 10): no placeholder, no
    style loaded, camera moved or idle callbacks, errors as a field set
    after construction.
12. **The example is a lab, not an example.** `example/` is named
    `vmap_bench` and holds the benchmark, the render suite, two spikes, a
    text benchmark, a GPU draw benchmark and a web GPU page; its main
    screen uses flutter_map with `VmapGestures` and `VmapLayer`, not `VMap`.
    `example/test/widget_test.dart` is `void main() {}`. There is no small
    "this is how you use it" app.

## 3. Packaging (from `dart pub publish --dry-run`)

13. **The archive is full of things that should not ship:** the stale
    `vmap_gpu/build/shaderbundles/vmap_gpu.shaderbundle` (371 KB),
    `vmap_gpu/pubspec.lock` (still tracked, left by the restructure), the
    whole `vmap_flutter_map/` package nested inside, the untracked `docs/`
    folder, `tool/` with its Node scripts, the scratch `zz_*.dart` files,
    and `doc/design/` with internal progress notes, `naming.md`,
    `api-review.md` and this file.
14. **The shader bundle the GPU needs is not in the archive.** The pubspec
    declares `build/shaderbundles/vmap_gpu.shaderbundle` as an asset, and
    `/build/` is ignored, so it only exists where the build hook writes it.
    Whether the hook can write into a package that lives in the pub cache
    has not been tried. Check before anything else in packaging; if it
    fails, the GPU never loads for anyone installing from pub.dev, and
    falls back silently (item 18).
15. **Every app pays for fonts it may not need.** Vazirmatn (241 KB) and
    Noto Sans Syriac Eastern (67 KB) are package assets, so they are
    bundled into every app that depends on vmap.
16. **`payv` is pinned exactly because vmap imports its private source**
    (`glyph_raster.dart:8`, `package:payv/src/font/glyph_path.dart`). Any
    payv release can break vmap. Export what is needed from payv and
    depend on `^0.1.x`.
17. **`lib/renderer.dart` is public API with no users.** It exports about
    30 internal types (all of `style_model.dart`, tiles, `MapView`, ...) so
    `vmap_gpu` could live in another package. It now lives inside vmap,
    and once published every one of those types is a promise. Remove it
    from the public surface; 0.3's custom layers get a designed API.

## 4. Architecture

18. **Failures are silent in release builds.** Every GPU failure is a
    `debugPrint` (`gpu_map.dart:41, 181, 202, 1080`, `line_ramps.dart:147`,
    `terrain_drape.dart:624`, `sdf_text_gpu.dart:121`) and the map falls
    back to the canvas. An app cannot ask which renderer it got or why.
19. **The canvas renderer is not a renderer.** `GpuMap` implements
    `MapRenderer`; the canvas path is woven through `VmapEngine.paint`
    (436 lines, `engine.dart:1048`) with `if (onGpu)` branches and a
    separate `BuildingRenderer`. "Frozen fallback" is a goal the code does
    not express: there is no seam to freeze it behind.
20. **Too many paths through every frame.** Labels have three text modes
    (images, glyphs from the app's fonts, glyphs from the style), each drawn
    two ways (canvas, GPU SDF), under two camera models (flat flutter_map
    camera with `view == null`, and the tilted `MapView`; about 25
    `view == null` branches in `lib/src`). Every label fix has to be right
    in each combination, which is where this session's shaking and missing
    road names came from. Pick one text path per renderer and one camera.
21. **God objects.** `VmapEngine` (1,600 lines) loads styles over the
    network, caches, animates transitions, applies edits and overlays,
    manages tiles, draws, queries features and clusters, and downloads
    regions. `LabelEngine` has about 50 fields and `LabelState` about 45
    mutable ones (several added this session). `buildLayers` in
    `tile_builder.dart` runs from line 383 to 1324.
22. **A flat `lib/src` of 70 files.** Labels are spread over fourteen files
    (`labels`, `label_*`, `point_labels`, `road_labels`, `collision_boxes`,
    `occlusion`, `place`, `pole`, `icon_stretch`), style over nine, tiles
    over twelve. Folders by area (`style/`, `tiles/`, `labels/`,
    `canvas/`, `gpu/`, `camera/`) would make it navigable.
23. **Two gesture implementations.** `VMap`'s gestures
    (`vmap_widget.dart`) and `VmapGestures` in the adapter (402 lines) do
    the same job separately, with different features.
24. **The camera has three public types.** `MapCameraPosition` (where the
    map looks), `MapView` (the projection, exported from both libraries)
    and `VmapCamera` (a flutter_map era frame description with an optional
    `MapView`), plus `EdgeInsets2`, `FlyPath`, `defaultEasing` and the
    unexported `CameraVelocity`, which the public `velocity` getter returns.
25. **A map package changes the app's display rate.** The Android plugin
    (`VmapPlugin.kt`) votes for the display's fastest refresh rate on
    Flutter's surface whenever the map moves. Useful, but an app should
    choose it; today it happens to every app on install.
26. **The core imports Material** (`pins.dart:3`, `Icons`) for the
    standard pins, and asks apps for `uses-material-design: true`.

## 5. API details

27. `VMapController` has the docs for `stop()` on the `destination` getter
    (`vmap_widget.dart:200`); `stop()` has none.
28. `VMapController.minZoom`, `maxZoom` and `maxPitch` are public fields the
    widget overwrites on every build (`_attach`). Two places own them.
29. `VmapEngine` mixes three kinds of configuration: fixed at construction
    (`renderer`, `styleGlyphs`, `source`, fonts), settable with a getter
    (`style`, `pins`, `overlay`), and set only (`markers`, `featureStates`,
    `text`). `showLabels` is a plain field: changing it does not repaint.
30. `VmapFeature` has no geometry, so a tapped road or building cannot be
    outlined or measured. MapLibre's query returns it.
31. Coordinates come in three shapes: `LatLng` in queries, doubles in
    `onTap` and the camera, `latitude`/`longitude` fields on
    `VmapClusterMember`.
32. `VmapStyle.json` compares documents by identity, and the README itself
    shows `VmapStyle.json(jsonDecode(myStyle))` inside a widget's
    parameters, which reloads the whole style on every rebuild.
33. `VmapPalette` is a `List<int>` indexed by `Tone`, a class of int
    constants: an enum or named colours would be Dart.
34. `zoomOffset` is documented as "how vector_map_tiles draws a style", a
    reference to another package in the core API.
35. `featuresAt` answers nothing until the first frame has painted (it
    reads the camera the last frame left), without saying so.
36. Debug and benchmark members sit on the main types: `debugLabels`,
    `debugBoxes`, `stats`, `showCollisionBoxes`, `buildingRenderer` on the
    engine; `framesReused` and `debugReuseFrames` on `GpuMap`.
37. `lib/vmap.dart` has no library documentation, the first thing dartdoc
    shows.

## 6. Tests

38. **No test drives `VMap`.** Gestures, double tap, fling, tilt,
    `flyTo` and `easeTo` have no tests; the only `VMap` test checks memory
    pressure. Items 2 and 3 would have been caught.
39. **The GPU renderer (4,500 lines) has no tests in CI.** It is checked
    only by the render suite, which runs by hand on a Mac. Nothing stops a
    GPU regression from merging.
40. No golden tests at all; test file names such as `more_test.dart` and
    `vmap_test.dart` do not say what they cover.

## 7. Platforms and the web

41. The web needs the JavaScript build: the README says the WebAssembly
    build froze its tab in three of about a dozen runs. Flutter is moving
    the web to WebAssembly, so this needs an answer, not a note.
42. Run on one Android phone, macOS and Chrome only (already in the
    roadmap, steps 3 and 6).
43. **Check:** the GPU's shaders load asynchronously and `supports()` is
    false until they do, so the first frames are drawn by the canvas and
    then switch to the GPU (`engine.dart:1077-1094` disposes or re-uploads
    tiles on that switch). If visible, that is a flash in the first second.

## What this changes in the roadmap

The API review stands, but it is a subset of this list. Before step 2
starts, these come first, in this order, because the rest builds on them:

1. Fix the confirmed bugs (1 to 5).
2. One camera and one zoom scale: MapLibre's, everywhere in the public API.
   The engine's internal 256 convention goes, or stays strictly inside.
3. The engine owns its renderer: GPU by default, the canvas as a real
   `MapRenderer` behind the same seam, the choice and any failure
   reported to the app.
4. One text path per renderer.
5. A complete `VMap`: every engine option as a parameter, desktop input,
   loading and events.
6. Packaging that ships exactly the package, with the shader bundle proven
   from pub.dev.
7. Tests for `VMap` and its controller; the render suite runnable in CI.
8. Then the folder layout and the splitting of the large classes, which
   are easier once the paths above are fewer.
