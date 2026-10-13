in vec4 v_color;
in vec3 v_dash;
out vec4 frag_color;

void main() {
  if (v_dash.z > 0.0 && mod(v_dash.x, v_dash.z) > v_dash.y) {
    discard;
  }
  frag_color = v_color;
}
