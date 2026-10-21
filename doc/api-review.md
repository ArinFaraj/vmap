# API review before the first release

The public API as it stood on 2026-10-21 (`lib/vmap.dart`, `lib/renderer.dart`,
`vmap_gpu`), read for what a new user meets first: the names, the defaults,
how a map loads, and what it tells the app. Each finding says where it was
seen. Proposals are for approval; nothing here has been changed yet.

## Findings

### Names

1. **Three spellings of the prefix.** `VMap` and `VMapController` (capital M)
   beside `VmapEngine`, `VmapStyle`, `VmapLayer` and twenty other `Vmap*`
   classes (`lib/vmap.dart`).
2. **Unprefixed names that collide easily.** `MapView`, `MapCameraPosition`,
   `EdgeInsets2`, `FlyPath`, `Tone`, `defaultEasing` and `standardPins` are
   exported bare; `MapView` and `MapCameraPosition` clash with names in other
   map packages, and `EdgeInsets2` reads as a stopgap.
3. **`VmapMap` and `VmapLayer`** are the flutter_map integration, but their
   names do not say so; they move to the adapter package anyway.
4. **Statistics types are public.** `VmapStats`, `VmapTimings` and
   `VmapLabelWork` are benchmark internals, exported from the main library.

### Defaults that still point at the canvas era

5. **The GPU renderer is opt in.** An app passes `renderer: GpuMap.create()`
   from a second package (`README.md`, "3D buildings"). For a GPU first engine
   it should be the default, with the canvas taken automatically when Flutter
   GPU is missing.
6. **Text defaults to the app's fonts drawn as images or paragraphs**
   (`VmapEngine(glyphText: false, styleGlyphs: false)`, `engine.dart`). The
   MapLibre accurate path, glyphs from the style drawn on the GPU, is behind
   `styleGlyphs: true`. The default path is the one where road names went
   missing on flat maps and ignored `text-offset` until this session's fixes.
   Two booleans for one choice (where glyphs come from) also invite
   contradictions.
7. **The built in style is the default** (`VMap(style: VmapStyle.light)`), so a
   map without a style shows vmap's own look rather than asking for one.

### Loading and errors

8. **Nothing to show while loading.** `VMap` has no placeholder or builder; the
   map is its background colour until tiles and glyphs arrive
   (`vmap_widget.dart`, constructor). Tiles appear as they land, labels fade in
   after.
9. **No events for state.** No callback for the style loaded, the map settled
   (idle), or tiles failing. Tools poll `engine.stats` and `styleLoaded`
   (`example/lib/render_suite.dart`, `_settle`).
10. **Errors are a field set after construction** (`engine.onError = ...`),
    easy to miss, and only on the engine, not the widget.
11. **`onTap` gives only a latitude and longitude.** Finding what was tapped
    needs a second call to `engine.featuresAt`.

### Configuration

12. **Global state.** `VmapEngine.webWorker` is a static set before the first
    map (`engine.dart`).
13. **Platform setup is manual and spread out.** Flutter GPU has to be switched
    on per platform (manifest, `Info.plist`, Windows and Linux runner calls);
    the README mentions only Android and the Apple platforms.
14. **The engine constructor mixes concerns**: style, tile source settings,
    text, cache size, labels on or off, pins, overlay, edits, curved labels,
    two glyph switches, fonts and the renderer, in one flat list.

### Wording

15. **The pub.dev description and README open with flutter_map and the
    canvas** ("Vector maps for flutter_map ... with the plain Flutter canvas"),
    which no longer describes the project.

## Proposals

Grouped as they would land in 0.1. The prefix below stands for the new
package name, once chosen.

- **One prefix.** Every public type takes the new name's prefix and one
  spelling: the widget, its controller, the engine, styles, camera types,
  insets. Bare names (`MapView`, `MapCameraPosition`, `EdgeInsets2`, `Tone`)
  get the prefix or become nested where they belong.
- **GPU by default.** The engine makes the GPU renderer itself and falls back
  to the canvas when Flutter GPU is missing, reporting which one it uses.
  `renderer:` stays only to force one for tests.
- **Glyphs from the style by default**, one setting for where glyphs come from
  (the style, the app's fonts, or the style with the app's fonts as fallback)
  in place of `glyphText` and `styleGlyphs`.
- **A style is required**, or an explicit choice of the built in one, so a
  blank map never surprises.
- **Loading and state on the widget**: an optional builder shown until the
  first frame with tiles, and callbacks for style loaded, idle, camera moved
  and errors, on the widget as well as the engine.
- **`onTap` with the features**, under the finger, topmost first, with the
  plain position for taps on empty map.
- **Options grouped**: tile and cache settings, text settings and label
  settings as small value classes, so the engine constructor reads in a
  glance.
- **The web worker setting** moves into the engine's options.
- **Statistics** move to a separate `.../debug.dart` library.
- **Setup docs and a check**: the README's platform table with every switch,
  and a debug message naming the missing switch when Flutter GPU is off.
- **The description and README** rewritten around the engine: 3D, MapLibre
  styles, every platform, flutter_map as an adapter.

## Not proposed

- Changing the camera model or the style edit API; both work and are tested.
- Removing the canvas renderer; it stays frozen (see `ROADMAP.md`).
