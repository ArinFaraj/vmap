uniform SdfFrame {
  // x, y: the screen in logical pixels; z: the device pixel ratio; w: 1
  // drawing halos only, 2 glyphs only, 3 both.
  vec4 screen;
  // x, y: the glyph atlas's size in texels; z, w: the sprite sheet's.
  vec4 atlas;
}
sdf_frame;

in vec2 position;
in vec2 texel;
in vec4 ink;
in vec4 halo;
in vec4 params;
in vec4 clip;
in vec4 kind;

out vec2 v_uv;
out vec4 v_ink;
out vec4 v_halo;
out vec4 v_params;
out vec4 v_clip;
out vec4 v_kind;

void main() {
  // A glyph samples the atlas by its share; an icon keeps its texel.
  v_uv = kind.x < 0.5 ? texel / sdf_frame.atlas.xy : texel;
  v_ink = ink;
  v_halo = halo;
  v_params = params;
  v_clip = clip;
  v_kind = kind;
  gl_Position = vec4(
    position.x / sdf_frame.screen.x * 2.0 - 1.0,
    1.0 - position.y / sdf_frame.screen.y * 2.0,
    0.0,
    1.0);
}
