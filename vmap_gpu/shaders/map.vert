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
  // x 1 while fills' outlines are drawn, as lines through their vertices.
  vec4 outline_info;
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

// The raised ground under the tile, laid out as terrain.vert's DemInfo:
// circles and heatmap points stand on it, as MapLibre draws them over
// terrain. Flat at sea level off raised ground.
uniform DemInfo {
  vec4 place;
  vec4 scale;
}
dem_info;

uniform sampler2D heights;

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
// x 1 for a fill's outline, and where the vertex lands in device pixels.
out vec3 v_outline;

const float PI = 3.141592653589793;
const float HEAT_ZERO = 1.0 / 255.0 / 16.0;
const float GAUSS_COEF = 0.3989422804014327;

// How far above the map's middle the ground stands at tile point p, in
// metres.
float lift = 0.0;

float ground_at(vec2 p) {
  float size = dem_info.place.w;
  vec2 at = dem_info.place.xy + p / 4096.0 * dem_info.place.z;
  vec2 f = clamp(at - 0.5, vec2(0.0), vec2(size - 1.001));
  vec2 i = floor(f);
  vec2 t = f - i;
  float a = texture(heights, (i + vec2(0.5, 0.5)) / size).r;
  float b = texture(heights, (i + vec2(1.5, 0.5)) / size).r;
  float c = texture(heights, (i + vec2(0.5, 1.5)) / size).r;
  float d = texture(heights, (i + vec2(1.5, 1.5)) / size).r;
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y) * dem_info.scale.x - dem_info.scale.z;
}

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

// MapLibre's globeRotateVector: vec turned on the sphere by angles, east
// and south.
vec3 rotate_on_sphere(vec3 vec, vec2 angles) {
  vec3 right = vec3(vec.z, 0.0, -vec.x);
  vec3 up = normalize(cross(right, vec));
  right = normalize(right);
  vec2 t = tan(angles);
  return normalize(vec + right * t.x + up * t.y);
}

// p on the flat map, s the same point on the unit sphere.
vec4 project_to(vec2 p, vec3 s) {
  vec4 flat_pos = frame_info.mvp * vec4(p, lift, 1.0);
  if (frame_info.globe_tile.z <= 0.0) {
    return flat_pos;
  }
  vec4 globe = frame_info.globe_mvp * vec4(s * (1.0 + lift / 6371008.8), 1.0);
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

// A fill's vertex at a pole, MapLibre's NORTH_POLE_Y or SOUTH_POLE_Y: on
// the globe the pole, hidden as the globe turns to the flat map, where it
// is put past the near plane with every triangle it is in.
bool at_pole(vec2 p) {
  return p.y < -32767.5 || p.y > 32766.5;
}

vec4 project(vec2 p) {
  if (at_pole(p)) {
    if (frame_info.globe_tile.z <= 0.0) {
      return vec4(0.0, 0.0, -10000000.0, 1.0);
    }
    vec3 s = vec3(0.0, p.y < 0.0 ? 1.0 : -1.0, 0.0);
    vec4 globe = frame_info.globe_mvp * vec4(s, 1.0);
    globe.z = (1.0 - (dot(s, frame_info.globe_plane.xyz) + frame_info.globe_plane.w)) * globe.w;
    globe.z = mix(globe.z, 100.0, pow(max((1.0 - frame_info.globe_tile.w) / 0.02, 0.0), 8.0));
    return globe;
  }
  return project_to(p, frame_info.globe_tile.z > 0.0 ? to_sphere(p) : vec3(0.0));
}

// Two 12 bit numbers packed in one float as the stream writes them.
vec2 unpack_pair(float v) {
  float high = floor(v / 4096.0);
  float low = v - high * 4096.0;
  return (vec2(low, high) - 2048.0) / 128.0;
}

void main() {
  // Kinds: 0 a fill, 1 a line, 2 a patterned fill, 3 a circle, 4 a
  // patterned line, 5 a gradient line, 6 a heatmap's point.
  float across = floor(packed_data.z / 131072.0);
  float slot_kind = packed_data.z - across * 131072.0;
  float kind = floor(slot_kind / 16384.0);
  int s = int(slot_kind - kind * 16384.0 + 0.5);
  vec4 color = slot_info.slot[s * 3];
  vec4 p = slot_info.slot[s * 3 + 1];
  vec4 q = slot_info.slot[s * 3 + 2];
  bool is_line = abs(kind - 1.0) < 0.5 || (kind > 3.5 && kind < 5.5);
  bool patterned_line = abs(kind - 4.0) < 0.5;
  bool gradient_line = abs(kind - 5.0) < 0.5;
  bool circle = abs(kind - 3.0) < 0.5;
  bool heat = kind > 5.5;
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
  } else if (abs(kind - 2.0) < 0.5) {
    // A patterned fill keeps its pattern in p, its move in q.
    pos += q.xy;
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
  if ((circle || heat) && dem_info.scale.x > 0.0) {
    lift = ground_at(pos);
  }
  if (circle && !on_screen) {
    grow *= fixed_size ? project(pos).w : 1.0;
    pos += corner * (p.x + p.y) * grow;
  }
  // A heatmap's point, as MapLibre's: color.r its weight times the
  // intensity, p.x its radius in tile units. Its square reaches where its
  // kernel falls to HEAT_ZERO, heat_reach radii out.
  float heat_reach = heat
      ? sqrt(max(-2.0 * log(HEAT_ZERO / max(color.r, 1e-9) / GAUSS_COEF), 0.0)) / 3.0
      : 0.0;
  vec2 heat_centre = pos;
  if (heat) {
    pos += corner * heat_reach * p.x * grow;
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
    // A dashed one keeps its share of the line in packed_data.y.
    v_uv = vec3((p.w > 0.0 ? packed_data.y : packed_data.w) * color.y, color.x, 3.0);
  } else {
    bool patterned = abs(kind - 2.0) < 0.5;
    vec2 uv = (patterned ? position : pos) * color.r * frame_info.fade.y;
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
  bool dashed = (plain_line || gradient_line) && p.w > 0.0;
  v_dash = vec3(
    dashed ? packed_data.w / p.w : 0.0,
    plain_line || dashed ? p.z : 0.0,
    dashed ? p.w / line_pixel : 0.0);
  // v_circle.z: one for a circle, plus its blur, packed_data.y.
  v_circle = vec4(corner, circle ? 1.0 + packed_data.y : 0.0, 1.0 / max(frame_info.fade.y, 1e-6));
  v_clip = vec3(pos.x, at_pole(pos) ? clamp(pos.y, 0.0, 4096.0) : pos.y, globe && !circle && !heat ? 1.0 : 0.0);
  if (heat) {
    v_circle = vec4(corner * heat_reach, 0.0, 0.0);
    v_uv = vec3(0.0, 0.0, 4.0);
  }
  gl_Position = project(pos);
  if (heat && globe) {
    // On the sphere the square's corners are turned about its centre by
    // its radius as an angle, as MapLibre's heatmap does: a tile unit is
    // globe_tile.z / 4096 of a turn at the equator, globe_centre.x the
    // scale at the centre's latitude.
    vec2 angles = corner * heat_reach * p.x * (2.0 * PI * frame_info.globe_tile.z / 4096.0) * frame_info.globe_centre.x;
    gl_Position = project_to(pos, rotate_on_sphere(to_sphere(heat_centre), angles));
  }
  v_outline = vec3(0.0);
  if (frame_info.outline_info.x > 0.5) {
    // A fill's outline: p.z its colour, packed as red plus 256 green plus
    // 65536 blue, p.w its alpha. A patterned fill's is its pattern.
    if (kind < 0.5) {
      float rgb = p.z;
      float b = floor(rgb / 65536.0);
      float g = floor((rgb - b * 65536.0) / 256.0);
      float r = rgb - b * 65536.0 - g * 256.0;
      v_color = vec4(vec3(r, g, b) / 255.0 * p.w, p.w);
      v_uv = vec3(0.0);
    }
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float dpr = frame_info.fog_range.z;
    v_outline = vec3(
      1.0,
      (ndc.x + 1.0) / frame_info.fade.z * dpr,
      (1.0 - ndc.y) / frame_info.fade.w * dpr);
  }
  if (on_screen) {
    vec2 off = corner * (p.x + p.y) * frame_info.fade.y * frame_info.fade.zw;
    gl_Position.xy += off * (fixed_size ? gl_Position.w : 1.0);
  }
}
