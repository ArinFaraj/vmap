uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
}
frame_info;

in uvec3 packed_vertex;
out vec4 v_color;

void main() {
  uint xy = packed_vertex.x;
  float x = float(xy & 65535u) * 0.5 - 8192.0;
  float y = float(xy >> 16u) * 0.5 - 8192.0;
  float z = float(packed_vertex.y & 65535u) * 0.1;
  uint c = packed_vertex.z;
  vec4 color = vec4(
    float(c & 255u),
    float((c >> 8u) & 255u),
    float((c >> 16u) & 255u),
    float(c >> 24u)
  ) / 255.0;
  v_color = vec4(color.rgb, color.a * frame_info.fade.x);
  gl_Position = frame_info.mvp * vec4(x, y, z, 1.0);
}
