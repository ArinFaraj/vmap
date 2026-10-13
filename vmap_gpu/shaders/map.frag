in vec4 v_color;
in vec3 v_dash;
in vec4 v_fog;
out vec4 frag_color;

void main() {
  if (v_dash.z > 0.0 && mod(v_dash.x, v_dash.z) > v_dash.y) {
    discard;
  }
  // Toward the haze with distance, the colour staying premultiplied.
  frag_color = vec4(mix(v_color.rgb, v_fog.rgb * v_color.a, v_fog.a), v_color.a);
}
