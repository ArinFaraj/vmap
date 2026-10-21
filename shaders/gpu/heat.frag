in vec2 v_uv;

// x: the layer's row in the ramp texture, y: its opacity.
uniform HeatInfo {
  vec4 info;
}
heat_info;

uniform sampler2D density;
uniform sampler2D ramp;
out vec4 frag_color;

// MapLibre's heatmap_texture: the density looked up in the colour ramp.
void main() {
  float t = texture(density, v_uv).r;
  frag_color = texture(ramp, vec2(t, heat_info.info.x)) * heat_info.info.y;
}
