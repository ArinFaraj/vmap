uniform FrameInfo {
  mat4 mvp;
  vec4 fade;
  vec4 fog_color;
  vec4 fog_range;
}
frame_info;

// Where this tile of ground lies in its tile of heights: x and y its
// corner and z its width, in the heights' pixels counted from the corner of
// their border; w the heights' width with the border. scale.x is the
// exaggeration, scale.y the metres one height pixel spans and scale.z the
// height drawn at sea level: the ground under the map's middle.
uniform DemInfo {
  vec4 place;
  vec4 scale;
}
dem_info;

uniform sampler2D heights;

// A corner of the shared grid, 0 to 1 across the tile; x is 2 more on the
// skirt hanging below an edge, which hides the gaps between tiles of
// different zoom.
in vec2 position;
out vec2 v_uv;
out vec4 v_fog;
// fog_range.w: how opaque the picture laid on the ground is.
out float v_opacity;

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
  bool skirt = position.x > 1.5;
  vec2 at = skirt ? position - vec2(2.0, 0.0) : position;
  vec2 p = dem_info.place.xy + at * dem_info.place.z;
  float h = height_at(p) - dem_info.scale.z;
  if (skirt) {
    h -= 0.1 * dem_info.place.z * dem_info.scale.y * max(dem_info.scale.x, 1.0);
  }
  v_opacity = frame_info.fog_range.w;
  v_uv = frame_info.fade.xy + at * frame_info.fade.zw;
  gl_Position = frame_info.mvp * vec4(at * 4096.0, h, 1.0);
  float far = smoothstep(frame_info.fog_range.x, frame_info.fog_range.y, gl_Position.w);
  v_fog = vec4(frame_info.fog_color.rgb, far * frame_info.fog_color.a);
}
