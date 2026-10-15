in vec2 v_uv;
in vec4 v_fog;
in float v_opacity;

uniform sampler2D drape;
out vec4 frag_color;

void main() {
  vec4 color = texture(drape, v_uv);
  if (v_fog.a > 0.0) {
    vec3 surface = pow(color.rgb, vec3(2.2));
    color.rgb = pow(mix(surface, v_fog.rgb * color.a, v_fog.a), vec3(1.0 / 2.2));
  }
  frag_color = color * v_opacity;
}
