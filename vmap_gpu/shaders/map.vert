uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
  vec4 fog_color;
  vec4 fog_range;
}
frame_info;

// Two vec4 per slot: the colour, premultiplied; and the half width, the
// offset, the dash length and the dash period, all in tile units. 240 vec4
// fit the 256 uniform vectors every OpenGL ES 3 vertex shader has.
uniform SlotInfo {
  vec4 slot[240];
}
slot_info;

in vec2 position;
in vec4 packed_data;
out vec4 v_color;
out vec3 v_dash;
out vec4 v_fog;

// Two 12 bit numbers packed in one float as the stream writes them.
vec2 unpack_pair(float v) {
  float high = floor(v / 4096.0);
  float low = v - high * 4096.0;
  return (vec2(low, high) - 2048.0) / 128.0;
}

void main() {
  float slot_kind = packed_data.z;
  float kind = floor(slot_kind / 16384.0);
  int s = int(slot_kind - kind * 16384.0 + 0.5);
  vec4 color = slot_info.slot[s * 2];
  vec4 p = slot_info.slot[s * 2 + 1];
  vec2 pos = position;
  if (kind > 0.5) {
    pos += unpack_pair(packed_data.x) * p.x + unpack_pair(packed_data.y) * p.y;
  }
  v_color = color;
  v_dash = vec3(packed_data.w, p.z, p.w);
  gl_Position = frame_info.mvp * vec4(pos, 0.0, 1.0);
  float far = smoothstep(frame_info.fog_range.x, frame_info.fog_range.y, gl_Position.w);
  v_fog = vec4(frame_info.fog_color.rgb, far * frame_info.fog_color.a);
}
