uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
}
frame_info;

in vec3 position;
in vec2 color_data;
out vec4 v_color;

void main() {
  float rgb = color_data.x;
  float b = floor(rgb / 65536.0);
  float g = floor((rgb - b * 65536.0) / 256.0);
  float r = rgb - b * 65536.0 - g * 256.0;
  v_color = vec4(r, g, b, color_data.y) / 255.0;
  v_color.a *= frame_info.fade.x;
  gl_Position = frame_info.mvp * vec4(position, 1.0);
}
