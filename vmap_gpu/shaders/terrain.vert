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
// exaggeration and scale.y the metres one height pixel spans.
uniform DemInfo {
  vec4 place;
  vec4 scale;
}
dem_info;

uniform sampler2D heights;

// A corner of the shared grid, 0 to 1 across the tile.
in vec2 position;
out vec2 v_uv;
out vec4 v_fog;
out float v_shade;

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
  vec2 p = dem_info.place.xy + position * dem_info.place.z;
  float h = height_at(p);
  // Lit from the north-west 45 degrees up, as a hillshade is: 1 on flat
  // ground, darker facing away from the light.
  float run = 2.0 * dem_info.scale.y;
  float dx = (height_at(p + vec2(1.0, 0.0)) - height_at(p - vec2(1.0, 0.0))) / run;
  float dy = (height_at(p + vec2(0.0, 1.0)) - height_at(p - vec2(0.0, 1.0))) / run;
  float lit = (0.5 * dx + 0.5 * dy + 0.7071) / sqrt(dx * dx + dy * dy + 1.0);
  v_shade = clamp(1.0 + 0.8 * (lit - 0.7071), 0.55, 1.2);
  v_uv = frame_info.fade.xy + position * frame_info.fade.zw;
  gl_Position = frame_info.mvp * vec4(position * 4096.0, h, 1.0);
  float far = smoothstep(frame_info.fog_range.x, frame_info.fog_range.y, gl_Position.w);
  v_fog = vec4(frame_info.fog_color.rgb, far * frame_info.fog_color.a);
}
