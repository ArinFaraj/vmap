#version 460 core
// MapLibre's sky.fragment.glsl, in logical pixels from the top.
#include <flutter/runtime_effect.glsl>

precision highp float;

uniform vec2 u_size;
uniform vec3 u_ray_x;
uniform vec3 u_ray_y;
uniform vec3 u_ray_origin;
uniform vec4 u_sky_color;
uniform vec4 u_horizon_color;
uniform float u_horizon;
uniform float u_sky_horizon_blend;
uniform float u_sky_blend;
uniform vec3 u_globe_position;
uniform float u_globe_radius;
uniform float u_atmosphere_blend;
uniform float u_camera_to_center_distance;

out vec4 fragColor;

const float ATMOSPHERE_HEIGHT_TO_GLOBE_RADIUS = 100000.0 / 6371000.0;

void main() {
    vec2 coord = FlutterFragCoord().xy;
    vec2 at = coord / u_size;
    vec3 view_direction = u_ray_x * (at.x * 2.0 - 1.0) + u_ray_y * (1.0 - at.y * 2.0) + u_ray_origin;
    float blend = u_horizon - coord.y;
    float opacity = 1.0;
    if (u_sky_blend > 0.0) {
        vec3 ray = normalize(view_direction);
        float globe_distance = length(u_globe_position);
        float angle_to_globe_center = acos(clamp(dot(ray, u_globe_position) / globe_distance, -1.0, 1.0));
        float horizon_angle = asin(min(u_globe_radius / globe_distance, 1.0));
        blend = mix(blend, (angle_to_globe_center - horizon_angle) * u_camera_to_center_distance + 1.0, u_sky_blend);
        float closest_approach = max(dot(ray, u_globe_position), 0.0);
        float lowest_altitude = sqrt(max(globe_distance * globe_distance - closest_approach * closest_approach, 0.0)) - u_globe_radius;
        float atmosphere_height = u_globe_radius * ATMOSPHERE_HEIGHT_TO_GLOBE_RADIUS;
        float inside_atmosphere = 1.0 - smoothstep(atmosphere_height, 10.0 * atmosphere_height, globe_distance - u_globe_radius);
        float through_atmosphere = 1.0 - smoothstep(0.0, atmosphere_height, lowest_altitude);
        opacity = inside_atmosphere * through_atmosphere * (1.0 - u_atmosphere_blend);
    }
    vec4 color = vec4(0.0);
    if (blend > 0.0) {
        if (blend < u_sky_horizon_blend) {
            color = mix(u_sky_color, u_horizon_color, pow(1.0 - blend / u_sky_horizon_blend, 2.0));
        } else {
            color = u_sky_color;
        }
    }
    fragColor = color * mix(1.0, opacity, u_sky_blend);
}
