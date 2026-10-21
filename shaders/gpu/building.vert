uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
  vec4 fog_color;
  vec4 fog_range;
  vec4 fog_horizon;
  // The style's light: xyz the direction it falls from, w its intensity;
  // light_color.rgb its colour.
  vec4 light;
  vec4 light_color;
}
frame_info;

// The ground the tile stands on, laid out as terrain.vert's DemInfo; scale.w
// is how far below the ground a building standing on it starts, as
// MapLibre's basement, so a slope shows no gap under it.
uniform DemInfo {
  vec4 place;
  vec4 scale;
}
dem_info;

uniform sampler2D heights;

// On the globe, which a tile width in tile.z marks: the tile's corner and
// width as fractions of the mercator world and in tile.w how far from the
// flat map to the globe; mvp the matrix from the unit sphere to clip space;
// camera.xyz the camera on the unit sphere's scale; shift.xy the layer's
// translate in tile units; light.xyz the light turned to the map's middle on
// the sphere, MapLibre's u_lightpos_globe.
uniform GlobeInfo {
  vec4 tile;
  mat4 mvp;
  vec4 camera;
  vec4 shift;
  vec4 light;
}
globe_info;

const float PI = 3.141592653589793;

// The patterns of fill-extrusion-pattern: each one's place in the sprite
// sheet, in its pixels, in ratio.x how many of those a tile unit is, and in
// ratio.w how far up a wall a metre moves the pattern, in tile units.
uniform PatternInfo {
  vec4 rect[16];
  vec4 ratio[16];
}
pattern_info;

in vec3 position;
in vec2 color_data;
// A wall's outward normal across the ground, none on a roof, and how much
// its vertical gradient keeps of the light.
in vec3 normal_data;
// Where the vertex is on its pattern, in tile units, and one more than its
// pattern's index, zero for none.
in vec3 pattern_data;
// The middle of the vertex's polygon, in tile units: as MapLibre, raised
// ground lifts a building whole by its height there, its roof flat.
in vec2 middle;
out vec4 v_color;
out vec2 v_uv;
out vec4 v_rect;
// On the globe, the vertex on the unit sphere's scale and, in w, 1.
out vec4 v_sphere;
out vec3 v_camera;

float height_at(vec2 p) {
  float size = dem_info.place.w;
  vec2 f = clamp(p - 0.5, vec2(0.0), vec2(size - 1.001));
  vec2 i = floor(f);
  vec2 t = f - i;
  float a = texture(heights, (i + vec2(0.5, 0.5)) / size).r;
  float b = texture(heights, (i + vec2(1.5, 0.5)) / size).r;
  float c = texture(heights, (i + vec2(0.5, 1.5)) / size).r;
  float d = texture(heights, (i + vec2(1.5, 1.5)) / size).r;
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y) * dem_info.scale.x;
}

// The tile point p on the unit sphere, MapLibre's projectToSphere.
vec3 to_sphere(vec2 p) {
  vec2 m = globe_info.tile.xy + p / 4096.0 * globe_info.tile.z;
  float lng = m.x * PI * 2.0 + PI;
  float t = exp(PI - m.y * PI * 2.0);
  float d = t * t + 1.0;
  float c = 2.0 * t / d;
  return vec3(sin(lng) * c, (t * t - 1.0) / d, cos(lng) * c);
}

// How square on to the light a surface facing [normal] is; on the globe its
// normal turned to the sphere at [s], as MapLibre's globeGetRotationMatrix.
float facing(vec3 normal, vec3 s) {
  float d = clamp(dot(normal, frame_info.light.xyz), 0.0, 1.0);
  if (globe_info.tile.z > 0.0) {
    vec3 right = vec3(s.z, 0.0, -s.x);
    vec3 down = normalize(cross(right, s));
    vec3 turned = mat3(normalize(right), down, s) * vec3(normal.x, -normal.y, normal.z);
    float g = clamp(dot(turned, globe_info.light.xyz), 0.0, 1.0);
    d = mix(d, g, globe_info.tile.w);
  }
  return d;
}

void main() {
  vec3 s = globe_info.tile.z > 0.0
      ? to_sphere(position.xy + globe_info.shift.xy)
      : vec3(0.0);
  float rgb = color_data.x;
  float b = floor(rgb / 65536.0);
  float g = floor((rgb - b * 65536.0) / 256.0);
  float r = rgb - b * 65536.0 - g * 256.0;
  vec3 color = vec3(r, g, b) / 255.0;
  // MapLibre's fill-extrusion lighting.
  float value = dot(color, vec3(0.2126, 0.7152, 0.0722));
  bool roof = normal_data.x == 0.0 && normal_data.y == 0.0;
  vec3 normal = roof ? vec3(0.0, 0.0, 1.0) : vec3(normal_data.xy, 0.0);
  float intensity = frame_info.light.w;
  float directional = facing(normal, s);
  directional = mix(1.0 - intensity, max(1.0 - value + intensity, 1.0), directional);
  if (!roof) {
    directional *= normal_data.z;
  }
  vec3 tint = frame_info.light_color.rgb;
  vec3 lit = clamp((color + 0.03) * directional * tint, 0.3 * (1.0 - tint), vec3(1.0));
  vec2 p = dem_info.place.xy + middle / 4096.0 * dem_info.place.z;
  float ground = height_at(p) - dem_info.scale.z;
  if (position.z < 0.01) {
    ground -= dem_info.scale.w;
  }
  v_rect = vec4(0.0);
  v_uv = vec2(0.0);
  if (pattern_data.z > 0.5) {
    // MapLibre's fill_extrusion_pattern lighting, which does not weigh the
    // colour, the pattern being the colour.
    int i = int(pattern_data.z - 0.5);
    float d = facing(normal, s);
    d = mix(1.0 - intensity, max(0.5 + intensity, 1.0), d);
    if (!roof) {
      d *= normal_data.z;
    }
    lit = clamp(d * tint, mix(vec3(0.0), vec3(0.3), 1.0 - tint), vec3(1.0));
    v_rect = pattern_info.rect[i];
    v_uv = pattern_data.xy * pattern_info.ratio[i].x + pattern_info.ratio[i].yz;
    if (!roof) {
      // As MapLibre, a wall's pattern is laid up from sea level: the
      // height raised ground lifts the wall by moves it too.
      v_uv.y += (ground + dem_info.scale.z) * pattern_info.ratio[i].w *
          pattern_info.ratio[i].x;
    }
  }
  v_color = vec4(lit, color_data.y / 255.0);
  v_color.a *= frame_info.fade.x;
  float h = position.z + ground;
  vec4 flat_pos = frame_info.mvp * vec4(position.xy, h, 1.0);
  gl_Position = flat_pos;
  v_sphere = vec4(0.0);
  v_camera = globe_info.camera.xyz;
  if (globe_info.tile.z > 0.0) {
    // MapLibre's projectTileFor3D: raised from the sphere by the height
    // over the earth's radius.
    vec3 raised = s * (1.0 + h / 6371008.8);
    v_sphere = vec4(raised, 1.0);
    vec4 globe = globe_info.mvp * vec4(raised, 1.0);
    float amount = globe_info.tile.w;
    gl_Position = amount >= 0.999 ? globe : mix(flat_pos, globe, amount);
  }
}
