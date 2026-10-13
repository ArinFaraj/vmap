# vmap design

vmap grows from a flutter_map layer into a map engine of its own: all Dart,
2D and 3D, with a Flutter GPU renderer where the device has one and the
Flutter canvas everywhere else.

The bar is the best map on a phone, measured against Apple Maps, Google Maps,
Waze and Maps.me, not against other Flutter packages: smoother camera, cleaner
labels, better routes and lines, and 3D that looks deliberate.

| File | What it holds |
| --- | --- |
| [decisions.md](decisions.md) | Decisions that are settled, with the reason for each |
| [open-decisions.md](open-decisions.md) | Questions only measurement answers, and which decision each could reopen |
| [research/renderers.md](research/renderers.md) | Flutter GPU, Impeller backends per device, and the existing Flutter map packages |
| [research/labels-in-3d.md](research/labels-in-3d.md) | How MapLibre, Mapbox, Google, Apple and Cesium place labels and pins in 3D |
| [research/text-shaping.md](research/text-shaping.md) | What a complete shaper does, and how it is proven against HarfBuzz |
| [research/data-and-terrain.md](research/data-and-terrain.md) | MapLibre Tile, the Protomaps basemap, Overture buildings, Mapterhorn terrain |
| [research/lines-and-routes.md](research/lines-and-routes.md) | The line features Mapbox v3 has over MapLibre, and what vmap draws |
| [research/native-code.md](research/native-code.md) | Rust through build hooks, flutter_rust_bridge, Nitro, plain FFI |

## Where it goes past MapLibre

- Correct shaping for every script, proven against HarfBuzz's suite, and any
  font including colour and variable fonts.
- Labels and Flutter widgets in the same frame as the map, never lagging.
- One collision system for base map labels, data layers and widget pins.
- The Mapbox v3 line set (route trim, occlusion, elevated lines) and animated
  routes.
- Custom 3D objects and shaders in map space from Dart.
- One codebase on every platform, the web included, with a canvas tier that
  still tilts where the GPU path is missing.

A decision moves from `open-decisions.md` to `decisions.md` when it is made,
with its date. Research notes record what a source said and where, so a claim
can be checked again later.
