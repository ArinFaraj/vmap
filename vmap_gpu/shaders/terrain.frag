in vec2 v_uv;
in vec4 v_fog;
in float v_shade;

uniform sampler2D drape;
out vec4 frag_color;

void main() {
  vec4 color = texture(drape, v_uv);
  color.rgb = min(color.rgb * v_shade, vec3(color.a));
  frag_color = vec4(mix(color.rgb, v_fog.rgb * color.a, v_fog.a), color.a);
}
