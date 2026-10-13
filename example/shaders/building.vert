uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
}
frame_info;

in vec3 position;
in vec4 color;
out vec4 v_color;

void main() {
  v_color = vec4(color.rgb, color.a * frame_info.fade.x);
  gl_Position = frame_info.mvp * vec4(position, 1.0);
}
