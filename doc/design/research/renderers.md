# Renderers and existing packages

Checked 2026-10-13 against the Flutter SDK source on the stable channel
(engine commit `deb287481e`) and the packages' published archives.

## Which renderer an Android device gets

From `shell/platform/android/flutter_main.cc` and
`android_context_dynamic_impeller.cc`:

1. API 29 (Android 10) and above, GPU not Vivante: Impeller.
2. Below API 29, or Vivante: Skia OpenGL ES. Flutter GPU throws here
   (`lib/gpu/context.cc`: "Flutter GPU requires the Impeller rendering
   backend").
3. Under Impeller, Vulkan is tried first. Emulators, Huawei, MediaTek with a
   vendor API below 32, denylisted boards, and any device whose Vulkan context
   fails get Impeller OpenGL ES. Flutter GPU works there, with the issues
   below.

The docs page (docs.flutter.dev/perf/impeller) says only that older devices
fall back to "the legacy OpenGL renderer".

## Flutter GPU on OpenGL ES

- flutter/flutter#193890 (open, 2026-10-06): pipeline creation with no
  onscreen surface deadlocks the main and raster threads.
- flutter/flutter#192147 (closed as completed 2026-10-02): the GLES backend
  re-issued all GL state per draw, 2 to 3 times slower than Skia on Adreno
  610. Which release carries the fix was not checked.
- `GpuContext` has no backend getter. `doesSupportFramebufferRenderMipmap` is
  documented as false on GLES, the only indirect signal.
- `doesSupportOffscreenMSAA` is false on some GLES devices, and Flutter GPU
  only renders offscreen, so antialiasing needs a fallback.

## Web

Flutter on the web renders with Skia and has no Flutter GPU, so the canvas
renderer is the web renderer.

## The existing packages

| Package | Engine | Tilt | Web | Notes |
| --- | --- | --- | --- | --- |
| `maplibre_flutter_gpu` 0.1.1 | MapLibre Native core, drawn through Flutter GPU | 0 to 60 degrees | no | Beta, one author. Labels are widgets, custom 3D in map space |
| `flutter_map_maplibre_gpu` 0.0.1 | the above, as a flutter_map layer | no | no | |
| `maplibre_gl` | MapLibre Native in a platform view, GL JS on web | yes | yes | Widgets on top lag the map |
| `maplibre` | MapLibre Native over FFI and JNI, GL JS on web | yes | yes | |
| `flutter_map_maplibre` 0.0.5 | `maplibre` with flutter_map | no, its example sets `maxPitch: 0` | yes | |
| `vector_map_tiles` | flutter_map layer | no | not listed | latest stable 8.0.0, two years old |
| vmap 0.26 | flutter_map layer, Flutter canvas | no | yes | `fill-extrusion` drawn flat |

MapLibre Native has no 3D terrain in a release: maplibre/maplibre-native#252
"Terrain3D" is open since 2022, and the September 2026 newsletter calls it a
work in progress on a feature branch.

flutter_map tilt: fleaflet/flutter_map#1268 was closed as not planned in 2022.
The person prototyping it wrote that "getting the math right for both tiles
and for markers" was the blocker.
