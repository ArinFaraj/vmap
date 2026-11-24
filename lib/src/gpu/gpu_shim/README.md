# gpu_shim

`package:flutter_gpu` on every platform, the web included: on native it
re-exports Flutter GPU, and on the web it is a WebGL2 implementation of the
same API, reading the same `.shaderbundle`.

It is flutter_scene 0.24.4's `lib/src/gpu/` by Brandon DeRosier, MIT
licensed (see `LICENSE`), with
`lib/src/generated_assets/generated_asset_fetch_web.dart` as
`web/asset_fetch_web.dart`. flutter_scene keeps it internal, so it is
copied rather than imported. When flutter_scene moves on, diff its
`lib/src/gpu/` against this folder and take what helps.

Left out:

- `webgpu/`, the WebGPU backend. It needs WGSL sidecars built with
  `flutter_scene_tint`, has no handling for a lost device, and presents
  through a blit and `transferToImageBitmap`, the copy `presenter.dart`
  avoids.
- `render_pass_compat.dart`, `raster_sync.dart`, `external_targets.dart`,
  `texture_arrays.dart` and the helpers only they use: they reach into
  flutter_scene's renderer.
- `web/host_buffer.dart` and `web/surface_frame.dart`: vmap writes its
  uniforms into buffers of its own and presents through `presenter.dart`.

vmap's own files, all on the web:

- `webgl/pass_record.dart`, `pass_executor.dart`, `pass_framebuffer.dart`:
  a render pass records its calls and makes them when it ends, so every
  uniform block written while it was recorded goes up in one upload
  before its first draw. ANGLE on Metal stalls on an upload into a buffer
  an earlier draw reads.
- `webgl/gl_state.dart`, `gl_enums.dart`: the GL state as last set, so a
  call that sets what is set already is not made.
- `webgl/presenter.dart`: how a frame reaches the page. Chromium draws in
  an `OffscreenCanvas` and hands the frame over with
  `transferToImageBitmap`; Firefox and Safari draw in a page canvas.
- `shared/page_image.dart`: what the page shows a texture from.

Changed from flutter_scene:

- `shared/glsl_transpile.dart`: a GLSL ES 1.00 uniform struct becomes a
  std140 uniform block, so a draw binds its uniforms with one
  `bindBufferRange` instead of a `uniform*` call per member.
- `webgl/pass_executor.dart`: a uniform member crosses to WebGL as just its
  floats. Under dart2wasm `toJS` copies the whole list it is given.
- `createUniformBuffer`: a host-visible buffer for uniform data written
  every frame, on the web typed and hinted `DYNAMIC_DRAW`.
- `checkPipeline`: reads a pipeline's link result, so a renderer that
  starts every pipeline at once can take each one's result where it
  handles a failure.
- `forgetFramebuffers`: lets go of the framebuffers cached for render
  targets, whose keys hold their textures, when a renderer drops its
  targets, as vmap does on a resize.
