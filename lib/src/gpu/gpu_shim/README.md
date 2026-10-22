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
- `web/webgl/render_pass.dart`: a uniform member crosses to WebGL as just
  its floats. Under dart2wasm `toJS` copied the whole uniform block for each
  member of each draw.
- `shared/glsl_transpile.dart`: a GLSL ES 1.00 uniform struct becomes a
  std140 uniform block, so `render_pass.dart` binds a draw's uniforms with
  one `bindBufferRange` instead of a `uniform*` call per member.
- `createUniformBuffer`: a host-visible buffer for uniform data written every
  frame, on the web typed and hinted `DYNAMIC_DRAW`; `_initializeTyped`
  takes the usage hint.
- `render_pass_compat.dart` and `raster_sync.dart` are left out; they reach
  into flutter_scene's renderer.
