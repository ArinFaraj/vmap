uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
  vec4 fog_color;
  vec4 fog_range;
  // On the globe, which a tile width in globe_tile.z marks: the tile's
  // corner and width as fractions of the mercator world and how far from
  // the flat map to the globe; MapLibre's clipping plane; the matrix from
  // the unit sphere to clip space; and the cosine of the centre's latitude.
  vec4 globe_tile;
  vec4 globe_plane;
  mat4 globe_mvp;
  vec4 globe_centre;
  // The tile's corner in world pixels at the whole zoom, as MapLibre's
  // u_pixel_coord: x and y over 65536, then x and y less those.
  vec4 pattern_corner;
}
frame_info;

// Three vec4 per slot: the colour, premultiplied; the half width, the
// offset, the dash length and the dash period; and a line's translate and
// blur, all in tile units. 240 vec4 fit the 256 uniform vectors every
// OpenGL ES 3 vertex shader has.
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
out vec2 v_line;
// Where the vertex lies in its tile, and 1 where the fragment shader cuts
// what lies outside the tile, as the stencil does on the flat map.
out vec3 v_clip;

const float PI = 3.141592653589793;

// MapLibre's projectToSphere, the latitude's sine and cosine from exp alone.
vec3 to_sphere(vec2 p) {
  vec2 m = frame_info.globe_tile.xy + p / 4096.0 * frame_info.globe_tile.z;
  float lng = m.x * PI * 2.0 + PI;
  float t = exp(PI - m.y * PI * 2.0);
  float d = t * t + 1.0;
  float c = 2.0 * t / d;
  return vec3(sin(lng) * c, (t * t - 1.0) / d, cos(lng) * c);
}

// The cosine of the latitude at tile point p.
float latitude_cos(vec2 p) {
  float y = frame_info.globe_tile.y + p.y / 4096.0 * frame_info.globe_tile.z;
  float t = exp(PI - y * PI * 2.0);
  return 2.0 * t / (t * t + 1.0);
}

vec4 project(vec2 p) {
  vec4 flat_pos = frame_info.mvp * vec4(p, 0.0, 1.0);
  if (frame_info.globe_tile.z <= 0.0) {
    return flat_pos;
  }
  vec3 s = to_sphere(p);
  vec4 globe = frame_info.globe_mvp * vec4(s, 1.0);
  globe.z = (1.0 - (dot(s, frame_info.globe_plane.xyz) + frame_info.globe_plane.w)) * globe.w;
  float amount = frame_info.globe_tile.w;
  if (amount >= 0.999) {
    return globe;
  }
  vec4 result = globe;
  result.xyw = mix(flat_pos.xyw, globe.xyw, amount);
  result.z = mix(0.0, globe.z, clamp((amount - 0.2) / 0.8, 0.0, 1.0));
  return result;
}

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
  vec4 color = slot_info.slot[s * 3];
  vec4 p = slot_info.slot[s * 3 + 1];
  vec4 q = slot_info.slot[s * 3 + 2];
  bool is_line = abs(kind - 1.0) < 0.5 || kind > 3.5;
  bool patterned_line = abs(kind - 4.0) < 0.5;
  bool gradient_line = kind > 4.5;
  bool circle = abs(kind - 3.0) < 0.5;
  // A patterned line keeps its pattern's place in the sprite sheet in p,
  // so its half width and offset are in the colour's place.
  vec2 stroke = patterned_line ? color.xy : p.xy;
  vec2 pos = position;
  bool globe = frame_info.globe_tile.z > 0.0;
  // A tile unit on the sphere is smaller towards the poles than at the
  // centre, where the sphere has the flat map's scale; widths in tile units
  // grow by as much, as MapLibre's projectLineThickness.
  float grow = globe ? mix(1.0, frame_info.globe_centre.x / latitude_cos(position), frame_info.globe_tile.w) : 1.0;
  stroke *= grow;
  v_edge = vec3(0.0);
  float line_pixel = 1.0;
  if (kind < 0.5) {
    // A fill: p.xy is how far it is moved, in tile units.
    pos += p.xy;
  }
  v_line = vec2(0.0, 1.0);
  float side_v = 0.5;
  if (is_line) {
    // A line is drawn half a device pixel wider and its outermost pixel
    // faded, as MapLibre does, so its edges are smooth without
    // multisampling. A butt end reaches a pixel past the end, and the
    // fragment shader cuts it at pixel centres as MapLibre's falls without
    // multisampling. fade.y is screen pixels per tile unit at the centre of
    // a flat view, w how much farther than the centre a point is, and
    // fog_range.z the device pixel ratio: one device pixel here is this
    // many tile units.
    vec2 ext = unpack_pair(packed_data.x);
    vec2 centre = pos + q.xy + unpack_pair(packed_data.y) * stroke.y;
    float w = project(centre).w;
    float pixel = w * grow / max(frame_info.fade.y * frame_info.fog_range.z, 1e-6);
    float outer = stroke.x + pixel * 0.5;
    line_pixel = pixel;
    // As MapLibre: a vertex on an edge fades by how far across the line a
    // pixel is, whatever its corner's shape; one of a round cap or join by
    // its distance from the centre line point, which cuts the true arc.
    bool round_vertex = abs(across - 64.0) < 0.5;
    bool left = across < 63.5;
    float past = abs(across - 1.0) < 0.5 || abs(across - 125.0) < 0.5 ? 1.0
        : abs(across - 2.0) < 0.5 || abs(across - 126.0) < 0.5 ? -1.0
        : 0.0;
    vec2 n = left ? ext : -ext;
    pos = centre + ext * outer + vec2(n.y, -n.x) * past * pixel;
    // As MapLibre, line-blur fades the line over its blur and a pixel
    // inside its edge, which v_line.y scales the pixel's fade to.
    v_line = vec2(abs(past), pixel / (pixel + q.z));
    side_v = round_vertex ? 0.5 : left ? 0.0 : 1.0;
    vec2 normal = round_vertex ? ext : vec2(0.0, left ? 1.0 : -1.0);
    v_edge = vec3(normal, outer / pixel);
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
  if (circle) {
    pos += q.xy;
  }
  if (circle && !on_screen) {
    grow *= fixed_size ? project(pos).w : 1.0;
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
    v_uv = vec3(packed_data.w / color.z, side_v, 2.0);
  } else if (gradient_line) {
    v_uv = vec3(packed_data.w * color.y, color.x, 3.0);
  } else {
    bool patterned = abs(kind - 2.0) < 0.5;
    vec2 uv = pos * color.r * frame_info.fade.y;
    if (patterned) {
      // As MapLibre's get_pattern_pos: the pattern laid from the world's
      // corner, so it runs on across tiles. color.g is its pixel ratio.
      vec2 size = p.zw / color.g;
      vec4 corner = frame_info.pattern_corner;
      vec2 from = mod(mod(mod(corner.xy, size) * 256.0, size) * 256.0 + corner.zw, size);
      uv += from * color.g;
    }
    // 1.25 for a pattern that is a distance field, its colour in color.b.
    v_uv = vec3(uv, patterned ? (q.w > 0.5 ? 1.25 : 1.0) : 0.0);
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
  v_clip = vec3(pos, globe && !circle ? 1.0 : 0.0);
  gl_Position = project(pos);
  if (on_screen) {
    vec2 off = corner * (p.x + p.y) * frame_info.fade.y * frame_info.fade.zw;
    gl_Position.xy += off * (fixed_size ? gl_Position.w : 1.0);
  }
}
