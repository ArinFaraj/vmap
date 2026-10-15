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
// is how far below the ground a wall's foot is sunk, so a slope shows no
// gap under it.
uniform DemInfo {
  vec4 place;
  vec4 scale;
}
dem_info;

uniform sampler2D heights;

in vec3 position;
in vec2 color_data;
// A wall's outward normal across the ground, none on a roof, and how much
// its vertical gradient keeps of the light.
in vec3 normal_data;
out vec4 v_color;

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

void main() {
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
  float directional = clamp(dot(normal, frame_info.light.xyz), 0.0, 1.0);
  directional = mix(1.0 - intensity, max(1.0 - value + intensity, 1.0), directional);
  if (!roof) {
    directional *= normal_data.z;
  }
  vec3 tint = frame_info.light_color.rgb;
  vec3 lit = clamp((color + 0.03) * directional * tint, 0.3 * (1.0 - tint), vec3(1.0));
  v_color = vec4(lit, color_data.y / 255.0);
  v_color.a *= frame_info.fade.x;
  vec2 p = dem_info.place.xy + position.xy / 4096.0 * dem_info.place.z;
  float ground = height_at(p) - dem_info.scale.z;
  if (position.z < 0.01) {
    ground -= dem_info.scale.w;
  }
  float h = position.z + ground;
  gl_Position = frame_info.mvp * vec4(position.xy, h, 1.0);
}
