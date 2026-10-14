in vec2 v_uv;
in vec4 v_fog;

uniform sampler2D drape;
out vec4 frag_color;

void main() {
  vec4 color = texture(drape, v_uv);
  frag_color = vec4(mix(color.rgb, v_fog.rgb * color.a, v_fog.a), color.a);
}
