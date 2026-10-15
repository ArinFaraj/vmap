# gpu_shim

`package:flutter_gpu` on every platform, the web included: on native it
re-exports Flutter GPU, and on the web it is a WebGL2 implementation of the
same API, reading the same `.shaderbundle`.

Copied from flutter_scene 0.24.3 (`lib/src/gpu/`, and
`lib/src/generated_assets/generated_asset_fetch_web.dart` as
`web/asset_fetch_web.dart`) by Brandon DeRosier, MIT licensed (see
`LICENSE`). flutter_scene keeps it internal, so it is copied rather than
imported.

Changed here:

- `web/webgl/buffer.dart`: an upload into a buffer already used for indices
  drops to the default vertex array first. Bound as it was, it re-pointed
  the index buffer of whichever cached vertex array the last draw left bound.
- `render_pass_compat.dart` and `raster_sync.dart` are left out; they reach
  into flutter_scene's renderer.
