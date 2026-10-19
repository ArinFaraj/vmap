uniform SdfFrame {
  // x, y: the screen in logical pixels; z: the device pixel ratio; w: 1
  // drawing halos only, 2 glyphs only, 3 both.
  vec4 screen;
  // x, y: the atlas's size in texels.
  vec4 atlas;
}
sdf_frame;

in vec2 position;
in vec2 texel;
in vec4 ink;
in vec4 halo;
in vec4 params;

out vec2 v_uv;
out vec4 v_ink;
out vec4 v_halo;
out vec4 v_params;

void main() {
  v_uv = texel / sdf_frame.atlas.xy;
  v_ink = ink;
  v_halo = halo;
  v_params = params;
  gl_Position = vec4(
    position.x / sdf_frame.screen.x * 2.0 - 1.0,
    1.0 - position.y / sdf_frame.screen.y * 2.0,
    0.0,
    1.0);
}
