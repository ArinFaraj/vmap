uniform SdfFrame {
  // x, y: the screen in logical pixels; z: the device pixel ratio; w: 1
  // drawing halos only, 2 glyphs only, 3 both.
  vec4 screen;
  // x, y: the glyph atlas's size in texels; z, w: the sprite sheet's.
  vec4 atlas;
}
sdf_frame;

// The quad's corner, (0, 0) to (1, 1), the same for every glyph.
in vec2 corner;

// One glyph or icon, the same for its six corners: where its top left
// corner lands (x, y) and its top left texel (z, w); the screen vectors
// across and down its whole quad; its size in texels (x, y), its kind
// (z) and whether it samples between texels (w).
in vec4 placement;
in vec4 axes;
in vec4 extent;
in vec4 ink;
in vec4 halo;
in vec4 params;
in vec4 clip;

out vec2 v_uv;
out vec4 v_ink;
out vec4 v_halo;
out vec4 v_params;
out vec4 v_clip;
out vec4 v_kind;

void main() {
  vec2 position = placement.xy + corner.x * axes.xy + corner.y * axes.zw;
  vec2 texel = placement.zw + corner * extent.xy;
  // A glyph samples the atlas by its share; an icon keeps its texel.
  v_uv = extent.z < 0.5 ? texel / sdf_frame.atlas.xy : texel;
  v_ink = ink;
  v_halo = halo;
  v_params = params;
  v_clip = clip;
  v_kind = vec4(extent.z, extent.w, 0.0, 0.0);
  gl_Position = vec4(
    position.x / sdf_frame.screen.x * 2.0 - 1.0,
    1.0 - position.y / sdf_frame.screen.y * 2.0,
    0.0,
    1.0);
}
