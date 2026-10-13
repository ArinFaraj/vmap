uniform FrameInfo {
  mat4 mvp;
}
frame_info;

// Three vec4 per slot: colour, premultiplied; half width, offset and
// translate in tile units; dash length and period in tile units.
uniform SlotInfo {
  vec4 slot[360];
}
slot_info;

in uvec4 packed_vertex;
out vec4 v_color;
out vec3 v_dash;

float signed16(uint v) {
  int i = int(v & 65535u);
  if (i > 32767) {
    i -= 65536;
  }
  return float(i) / 2048.0;
}

void main() {
  uint w0 = packed_vertex.x;
  vec2 pos = vec2(float(w0 & 65535u), float(w0 >> 16u)) * 0.5 - 8192.0;
  uint w2 = packed_vertex.z;
  int s = int(w2 & 16383u);
  uint kind = (w2 >> 14u) & 3u;
  vec4 p = slot_info.slot[s * 3 + 1];
  pos += p.zw;
  if (kind == 1u) {
    vec2 ext = vec2(signed16(packed_vertex.y), signed16(packed_vertex.y >> 16u));
    vec2 off = vec2(signed16(packed_vertex.w), signed16(packed_vertex.w >> 16u));
    pos += ext * p.x + off * p.y;
  }
  vec4 dash = slot_info.slot[s * 3 + 2];
  v_color = slot_info.slot[s * 3];
  v_dash = vec3(float(w2 >> 16u) * 0.5, dash.x, dash.y);
  gl_Position = frame_info.mvp * vec4(pos, 0.0, 1.0);
}
