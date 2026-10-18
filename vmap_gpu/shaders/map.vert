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
out vec4 v_pattern;
out vec3 v_uv;
out vec4 v_circle;
out vec3 v_edge;

// Two 12 bit numbers packed in one float as the stream writes them.
vec2 unpack_pair(float v) {
  float high = floor(v / 4096.0);
  float low = v - high * 4096.0;
  return (vec2(low, high) - 2048.0) / 128.0;
}

void main() {
  // Kinds: 0 a fill, 1 a line, 2 a patterned fill, 3 a circle, 4 a
  // patterned line, 5 a gradient line.
  float across = floor(packed_data.z / 131072.0);
  float slot_kind = packed_data.z - across * 131072.0;
  float kind = floor(slot_kind / 16384.0);
  int s = int(slot_kind - kind * 16384.0 + 0.5);
  vec4 color = slot_info.slot[s * 2];
  vec4 p = slot_info.slot[s * 2 + 1];
  bool is_line = abs(kind - 1.0) < 0.5 || kind > 3.5;
  bool patterned_line = abs(kind - 4.0) < 0.5;
  bool gradient_line = kind > 4.5;
  bool circle = abs(kind - 3.0) < 0.5;
  // A patterned line keeps its pattern's place in the sprite sheet in p,
  // so its half width and offset are in the colour's place.
  vec2 stroke = patterned_line ? color.xy : p.xy;
  vec2 pos = position;
  v_edge = vec3(0.0);
  float line_pixel = 1.0;
  if (kind < 0.5) {
    // A fill: p.xy is how far it is moved, in tile units.
    pos += p.xy;
  }
  if (is_line) {
    // A line is drawn half a device pixel wider and its outermost pixel
    // faded, as MapLibre does, so its edges are smooth without
    // multisampling. fade.y is screen pixels per tile unit at the centre of
    // a flat view, w how much farther than the centre a point is, and
    // fog_range.z the device pixel ratio: one device pixel here is this
    // many tile units.
    vec2 ext = unpack_pair(packed_data.x);
    vec2 centre = pos + unpack_pair(packed_data.y) * stroke.y;
    float w = (frame_info.mvp * vec4(centre, 0.0, 1.0)).w;
    float pixel = w / max(frame_info.fade.y * frame_info.fog_range.z, 1e-6);
    float outer = stroke.x + pixel * 0.5;
    line_pixel = pixel;
    pos = centre + ext * outer;
    // A mitre corner reaches past the edge; faded by its own length, the
    // segment after it would thin to a wedge. MapLibre fades by the side
    // alone.
    v_edge = vec3(ext / max(length(ext), 1.0), outer / pixel);
  }
  // A circle: p.x its radius and p.y its ring's width in tile units, p.z
  // its ring's colour packed as red plus 256 green plus 65536 blue, p.w the
  // ring's alpha.
  // packed_data.w: 1 when it faces the screen, plus 2 when it keeps its
  // size however far it is. fade.zw turns screen pixels into clip space.
  vec2 corner = unpack_pair(packed_data.x);
  float facing = circle ? packed_data.w : 0.0;
  bool on_screen = mod(facing, 2.0) > 0.5;
  bool fixed_size = facing > 1.5;
  if (circle && !on_screen) {
    float grow = fixed_size ? (frame_info.mvp * vec4(pos, 0.0, 1.0)).w : 1.0;
    pos += corner * (p.x + p.y) * grow;
  }
  // v_uv.z tells the fragment shader what to sample. 1, a patterned fill:
  // p is the pattern's place in the sprite sheet in its pixels, colour.r
  // its pixel ratio, and fade.y the tile's screen pixels per tile unit.
  // 2, a patterned line: colour.z is the pattern's length along the line in
  // tile units. 3, a gradient line: colour.x is its row in the gradient
  // texture and colour.y one over the distance along a whole line.
  v_pattern = p;
  if (patterned_line) {
    v_uv = vec3(packed_data.w / color.z, across / 127.0, 2.0);
  } else if (gradient_line) {
    v_uv = vec3(packed_data.w * color.y, color.x, 3.0);
  } else {
    v_uv = vec3(pos * color.r * frame_info.fade.y, abs(kind - 2.0) < 0.5 ? 1.0 : 0.0);
  }
  v_color = color;
  // A line: p.z its dash row plus twice its cap, p.w one repeat in tile
  // units, zero when undashed; then p.z is a line drawn as two's gap.
  // v_dash is how many repeats along, p.z, and the repeat in device pixels.
  bool plain_line = abs(kind - 1.0) < 0.5;
  bool dashed = plain_line && p.w > 0.0;
  v_dash = vec3(
    dashed ? packed_data.w / p.w : 0.0,
    plain_line ? p.z : 0.0,
    dashed ? p.w / line_pixel : 0.0);
  // v_circle.z: one for a circle, plus its blur, packed_data.y.
  v_circle = vec4(corner, circle ? 1.0 + packed_data.y : 0.0, 1.0 / max(frame_info.fade.y, 1e-6));
  gl_Position = frame_info.mvp * vec4(pos, 0.0, 1.0);
  if (on_screen) {
    vec2 off = corner * (p.x + p.y) * frame_info.fade.y * frame_info.fade.zw;
    gl_Position.xy += off * (fixed_size ? gl_Position.w : 1.0);
  }
}
