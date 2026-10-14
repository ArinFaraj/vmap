uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
  vec4 fog_color;
  vec4 fog_range;
}
frame_info;

// x and y in tile units, the height in metres.
in vec3 position;
out vec2 v_uv;
out vec4 v_fog;

void main() {
  // fade carries the tile's place in the drape atlas: its corner, then its
  // size, as fractions of the atlas.
  v_uv = frame_info.fade.xy + position.xy / 4096.0 * frame_info.fade.zw;
  gl_Position = frame_info.mvp * vec4(position, 1.0);
  float far = smoothstep(frame_info.fog_range.x, frame_info.fog_range.y, gl_Position.w);
  v_fog = vec4(frame_info.fog_color.rgb, far * frame_info.fog_color.a);
}
