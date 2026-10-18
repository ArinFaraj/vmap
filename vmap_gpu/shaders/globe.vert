uniform FrameInfo {
  mat4 mvp;
  mat4 flat_mvp;
  vec4 fade;
  // x and y the tile's corner and z its width, as fractions of the
  // mercator world; w how far from the flat map to the globe.
  vec4 tile;
  vec4 plane;
  vec4 extra;
}
frame_info;

// A corner of the shared grid, 0 to 1 across the tile; y is -1 at the north
// pole and 2 at the south pole, under a corner of the tile's edge.
in vec2 position;
out vec2 v_uv;
out vec4 v_bounds;
out float v_opacity;

const float PI = 3.141592653589793;

void main() {
  bool north = position.y < -0.5;
  bool south = position.y > 1.5;
  vec2 at = vec2(position.x, clamp(position.y, 0.0, 1.0));
  vec2 mercator = frame_info.tile.xy + at * frame_info.tile.z;
  float lng = mercator.x * PI * 2.0 + PI;
  // MapLibre's projectToSphere: the latitude's sine and cosine from exp
  // alone, which keeps float precision near the equator.
  float t = exp(PI - mercator.y * PI * 2.0);
  float t2 = t * t;
  vec3 pos = vec3(sin(lng) * 2.0 * t / (t2 + 1.0), (t2 - 1.0) / (t2 + 1.0), cos(lng) * 2.0 * t / (t2 + 1.0));
  if (north) {
    pos = vec3(0.0, 1.0, 0.0);
  }
  if (south) {
    pos = vec3(0.0, -1.0, 0.0);
  }
  vec4 globe = frame_info.mvp * vec4(pos, 1.0);
  // The side of the sphere behind MapLibre's clipping plane lands past the
  // far plane.
  globe.z = (1.0 - (dot(pos, frame_info.plane.xyz) + frame_info.plane.w)) * globe.w;
  float amount = frame_info.tile.w;
  vec4 result = globe;
  if (amount < 0.999) {
    vec4 flat_pos = frame_info.flat_mvp * vec4(at * 4096.0, 0.0, 1.0);
    result.xyw = mix(flat_pos.xyw, globe.xyw, amount);
    result.z = mix(0.0, globe.z, clamp((amount - 0.2) / 0.8, 0.0, 1.0));
    if (north || south) {
      result = globe;
      result.z = mix(globe.z, 100.0, pow(max((1.0 - amount) / 0.02, 0.0), 8.0));
    }
  }
  gl_Position = result;
  v_uv = frame_info.fade.xy + at * frame_info.fade.zw;
  vec2 texel = frame_info.extra.yz;
  v_bounds = vec4(frame_info.fade.xy + texel, frame_info.fade.xy + frame_info.fade.zw - texel);
  v_opacity = frame_info.extra.x;
}
