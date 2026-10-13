uniform FrameInfo {
  mat4 mvp;
}
frame_info;

in vec3 position;
in vec4 color;
out vec4 v_color;

void main() {
  v_color = color;
  gl_Position = frame_info.mvp * vec4(position, 1.0);
}
