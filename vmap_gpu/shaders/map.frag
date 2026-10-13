in vec4 v_color;
in vec3 v_dash;
in vec4 v_fog;
in vec4 v_pattern;
in vec3 v_uv;
in vec4 v_circle;
in vec3 v_edge;

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
  if (v_circle.z > 0.5) {
    float radius = v_pattern.x;
    float ring = v_pattern.y;
    float outer = radius + ring;
    float d = length(v_circle.xy) * outer;
    float pixel = v_circle.w;
    float shape = clamp((outer - d) / pixel + 0.5, 0.0, 1.0);
    if (shape <= 0.0) {
      discard;
    }
    float rgb = v_pattern.z;
    float b = floor(rgb / 65536.0);
    float g = floor((rgb - b * 65536.0) / 256.0);
    float r = rgb - b * 65536.0 - g * 256.0;
    vec4 rim = vec4(vec3(r, g, b) / 255.0 * v_pattern.w, v_pattern.w);
    float inside = ring > 0.0 ? clamp((radius - d) / pixel + 0.5, 0.0, 1.0) : 1.0;
    color = mix(rim, v_color, inside) * shape;
  } else if (v_uv.z > 0.5) {
    vec2 at = v_pattern.xy + mod(v_uv.xy, v_pattern.zw);
    color = texture(sprite_sheet, at / frag_info.sheet_size.xy) * v_color.a;
  }
  // Toward the haze with distance, the colour staying premultiplied.
  // A line's outermost device pixel fades to its edge; v_edge.z is its
  // half width in device pixels, zero for anything not a line.
  if (v_edge.z > 0.0) {
    color *= clamp(v_edge.z * (1.0 - length(v_edge.xy)), 0.0, 1.0);
  }
  frag_color = vec4(mix(color.rgb, v_fog.rgb * color.a, v_fog.a), color.a);
}
