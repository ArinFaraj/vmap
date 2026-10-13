in vec4 v_color;
in vec3 v_dash;
in vec4 v_fog;
in vec4 v_pattern;
in vec3 v_uv;

uniform FragInfo {
  vec4 sheet_size;
}
frag_info;

uniform sampler2D sprite_sheet;
out vec4 frag_color;

void main() {
  if (v_dash.z > 0.0 && mod(v_dash.x, v_dash.z) > v_dash.y) {
    discard;
  }
  vec4 color = v_color;
  if (v_uv.z > 0.5) {
    vec2 at = v_pattern.xy + mod(v_uv.xy, v_pattern.zw);
    color = texture(sprite_sheet, at / frag_info.sheet_size.xy) * v_color.a;
  }
  // Toward the haze with distance, the colour staying premultiplied.
  frag_color = vec4(mix(color.rgb, v_fog.rgb * color.a, v_fog.a), color.a);
}
