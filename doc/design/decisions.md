# Decisions

## D1. Our own engine, built from vmap (2026-10-13)

vmap's data, style, geometry and label code is reused; only four of its 46
source files import flutter_map (`engine.dart`, `gestures.dart`, `layer.dart`,
`map.dart`). The camera, the tile cover, the renderer and the map widget are
rewritten.

Why: every Flutter package with tilt runs MapLibre Native underneath, which
caps the features at what Native ships (no 3D terrain yet) and puts a native
SDK between us and every bug. Every package without MapLibre Native sits on
flutter_map, which has no tilt and declined to add it. See
[research/renderers.md](research/renderers.md).

## D2. Two renderers behind one interface (2026-10-13)

- Flutter GPU where `gpuContext` can be read: depth buffer, lit buildings,
  terrain, custom 3D objects, shader effects.
- The Flutter canvas everywhere else: Android 8 and 9, Vivante GPUs, web, and
  any device switched off remotely. It still tilts, rotates and animates.

The choice is made when the map first opens, not in `main()`, because creating
a Flutter GPU pipeline before the app has a surface can deadlock on OpenGL ES
(flutter/flutter#193890, open on 2026-10-06).

## D3. Labels and pins are screen facing, placed by the camera (2026-10-13)

Labels and pins are sprites or Flutter widgets anchored to a 3D point and
drawn in the same frame as the map, so they never lag it. Only road names are
laid out in map space, one glyph at a time. This is what every engine studied
does. Details and the rules adopted: [research/labels-in-3d.md](research/labels-in-3d.md).

## D4. The MapLibre style spec is the contract (2026-10-13)

Existing MapLibre styles keep working unchanged, including
`text-pitch-alignment` and `text-rotation-alignment`. Features the spec does
not have are added as extensions, never as changes to what a spec property
means.

## D5. The engine first; navigation is a separate package (2026-10-13)

Two packages. This one draws and animates. Routing, search, traffic and
guidance live in a second package built on top of it, later.

## D6. The canvas tier tilts, with flat 3D (2026-10-13)

On the canvas renderer the map tilts, rotates and flies like on Flutter GPU.
Buildings are flat or simple walls sorted back to front, terrain is hillshade
only, and labels draw on top. A style never fails on this tier; it looks
plainer.

## D7. Camera for the first version (2026-10-13)

Pitch up to 60 degrees, the limit kept movable. `flyTo` along the van Wijk and
Nuij path. Gestures on springs, any animation interrupted by a touch. Globe
later.

## D8. Our own text shaper, as its own package (2026-10-13)

A pure Dart OpenType shaper that the map engine uses and any other package can
(PDFs included). Not tied to `payv`, though its Apache-2.0 code may be
borrowed with attribution, and HarfBuzz (Old MIT) is the reference whose
behaviour it ports.

"Supports everything" is defined by tests, not by claim: HarfBuzz's own
shaping suite (`test/shape/data`: 128 `aots`, 86 `in-house` and 94
`text-rendering-tests` files) runs against it, and its output is diffed with
`hb-shape` over real map names in every script. Scope and order:
[research/text-shaping.md](research/text-shaping.md).

## D9. Text: our shaper, multi-channel distance field glyphs, every font (2026-10-13)

Labels are shaped by our shaper (D8) and drawn from an atlas of
multi-channel signed distance fields, one per glyph, built in an isolate and
cached. One atlas draws any size, distance scale, rotation and tilt sharply;
halo, colour and blur are shader inputs. Road names are laid out glyph by
glyph along the projected line.

No font is out of reach: fonts bundled with the app, the app's own fonts,
fonts downloaded at run time, the platform's fonts where the OS lets us read
them, and a style's `glyphs` URL for compatibility with existing MapLibre
styles. Colour glyphs (`COLR` v0 and v1, `sbix`, `CBDT`) are drawn as
coloured images in the same atlas. A fallback chain per label covers any
character the first font lacks.

On the canvas tier the fields are not thresholded at draw time (a colour
matrix on `drawRawAtlas` doubled raster time on a phone); they are baked
off the UI thread into sharp glyph and halo pages, one per eighth of an
octave of size, drawn with `drawRawAtlas` tinted by vertex colour. On the
Flutter GPU tier a fragment shader reads the fields directly. Measured in
[progress.md](progress.md); the baked pages' phone raster time is still to
confirm.

## D10. Two tiers, as specified (2026-10-13)

| | Flutter GPU | Canvas |
| --- | --- | --- |
| Tilt, rotate, fly | yes | yes |
| Buildings | lit, with depth | flat, or walls sorted back to front |
| Terrain | 3D | hillshade only |
| Labels behind buildings | faded | always on top |
| Custom 3D objects | yes | sprites |

## D11. Tiles: any source in; our own tiles out (2026-10-13)

The engine reads MVT and MLT (MapLibre Tile 1.0, released January 2026),
PMTiles archives, TileJSON, GeoJSON and raster, and is tied to no schema.

The tiles we serve are built with Planetiler from OpenStreetMap, with
Overture buildings merged in where they carry heights, every `name:*` kept
(`ckb`, `kmr`, `ar`, `en` and the rest), written as PMTiles to a CDN with no
tile server, and cut into regional extracts for offline use. Until that
profile exists, the Protomaps basemap (OSM, ODbL, daily builds, about 120 GB
for the planet at zoom 0 to 15) is the stand in. Research:
[research/data-and-terrain.md](research/data-and-terrain.md).

## D12. Elevation: any raster DEM; Mapterhorn by default (2026-10-13)

Terrarium and Mapbox RGB encodings from any source. The default is
Mapterhorn: open terrain tiles, global at 30 m with finer national data where
it exists, BSD-3 code, per source data attribution.

## D13. Lines and routes: the Mapbox v3 line set and more (2026-10-13)

Every MapLibre line property, plus as extensions the line properties Mapbox
GL v3 has and MapLibre lacks (trim for route progress, occlusion opacity
behind buildings, height above ground, borders, emissive strength), plus our
own: animated route changes, flowing dashes, data driven traffic colours
along one line, and the route showing through buildings. Research:
[research/lines-and-routes.md](research/lines-and-routes.md).

## D14. Annotations: widgets and data layers, one collision system (2026-10-13)

- Any Flutter widget as a pin, for tens of pins, drawn in the map's frame.
- Data driven symbol layers for thousands of points, with clustering.
- Both take part in the same collision pass, with three levels: required,
  required and hiding optional ones (base map labels included), optional.
- Pins have an altitude mode (ground, above ground, above whatever is
  highest, absolute) and an optional line to the ground.
- Distance scaling per pin or layer; constant size by default for app pins.
- Selection and callouts on both.

## D15. Dart first; Rust only for a kernel that misses its budget (2026-10-13)

The engine is Dart: one language, the web for free, hot reload, isolates for
parallel work. Every heavy kernel (tile decode, tessellation, shaping,
distance fields, collision) sits behind an interface with a benchmark and a
frame budget. A kernel that misses its budget by more than 2x on the cheap
test phone after optimisation is rewritten in Rust, built by Dart build hooks
(`native_toolchain_rust`), called through plain `dart:ffi` leaf calls on
shared typed buffers, and compiled to WebAssembly for the web. Research:
[research/native-code.md](research/native-code.md).

## D16. The bar, in numbers and against references (2026-10-13)

- Frame time: p99 under the refresh interval during a fly, a pinch and a
  tilted pan, on a 120 Hz flagship, a mid phone, and a cheap OpenGL ES phone
  (Adreno 610 class), each in a scripted tour.
- First full frame from cache, memory high water, battery per minute of
  panning.
- Style conformance: MapLibre GL JS's render test suite
  (`test/integration/render/tests`, 195 groups, a style and an expected image
  each) runs against the engine.
- Shaping conformance: HarfBuzz's suite (D8).
- Reference scenes rendered by Apple Maps, Google Maps and MapLibre beside
  ours, reviewed by eye.

## D17. The name stays vmap (2026-10-13)

vmap 1.0 is the engine with its own `VMap` widget. The flutter_map layer stays
as a separate library in the package, 2D only, for apps already on
flutter_map.
