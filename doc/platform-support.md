# Where the map runs, and on what

What each platform draws the map with, checked against Flutter's own docs and
engine source in October 2026 (Flutter 3.47). Recheck when Flutter moves on:
Flutter GPU is still a preview, and the Android rules below have changed twice
since 3.22.

## The short version

The GPU renderer (Flutter GPU, through the WebGL2 shim on the web) runs on
every platform Flutter ships for. The canvas renderer is only needed for
Android 9 and older, Android devices with a Vivante GPU, browsers without
WebGL2, and Flutter's test runner.

| Platform | Flutter's renderer | Flutter GPU | The map draws with | Run so far |
|---|---|---|---|---|
| iOS | Impeller, the only one | yes, `FLTEnableFlutterGPU` in `Info.plist` | GPU | not yet |
| Android 10+ with Vulkan 1.1 | Impeller on Vulkan | yes, `io.flutter.embedding.android.EnableFlutterGPU` in the manifest | GPU | one phone, the emulator |
| Android 10+ without usable Vulkan | Impeller on OpenGL ES | yes, the same flag | GPU, on OpenGL ES | not yet |
| Android 9 and older | Skia on OpenGL ES, unless forced (below) | no, unless forced | canvas | not yet |
| Android with a Vivante GPU | Skia on OpenGL ES, unless forced | no, unless forced | canvas | not yet |
| macOS | Impeller, default since 3.47 | yes, `FLTEnableFlutterGPU` in `Info.plist` | GPU | yes, most development |
| Windows | Impeller, default since 3.47 | yes from 3.47.1: `project.set_enable_flutter_gpu(true)` on the `DartProject` | GPU | not yet |
| Linux | Impeller, default since 3.47 | yes from 3.47.1: `fl_dart_project_set_enable_flutter_gpu(project, TRUE)` | GPU | not yet |
| Web | Skia (CanvasKit) | not built in; the WebGL2 shim from flutter_scene stands in | GPU, through WebGL2 | Chrome |
| `flutter test` | the tester | not checked | canvas | yes, every unit and golden test |

During development `flutter run --enable-flutter-gpu` switches Flutter GPU on
for one run on any platform.

## Android in detail

From `flutter_main.cc` and `android_context_dynamic_impeller.cc` on Flutter's
`main` branch:

1. With Impeller on, Android 10 (API 29) or newer, and no Vivante GPU, the
   engine auto-selects: it tries a Vulkan context and uses Impeller's OpenGL ES
   backend when Vulkan is missing, older than 1.1, lacks the extensions it
   needs, or is a known bad driver. Known bad drivers include emulators,
   Huawei devices, and MediaTek parts below vendor API 32 (the log says "Known
   bad Vulkan driver encountered, falling back to OpenGLES."). Both backends
   are Impeller, so Flutter GPU and 3D work on either.
2. Below Android 10, or on a Vivante GPU, the engine uses Skia on OpenGL ES.
   There is no Impeller there, so no Flutter GPU, and the map falls back to
   the canvas.
3. An app can force Impeller's OpenGL ES backend on every device with
   `<meta-data android:name="io.flutter.embedding.android.ImpellerBackend"
   android:value="opengles" />`. That brings Flutter GPU to Android 9 and
   older and to Vivante devices, but it also moves Vulkan devices to OpenGL
   ES. There is no setting for "Vulkan where possible, Impeller OpenGL ES
   elsewhere" below Android 10.

The engine's own `impeller/docs/android.md` still says the fallback is Skia
"during the preview period"; the source above is newer than that note.

## What has not been tried

- Impeller's OpenGL ES backend at all. Forcing `ImpellerBackend=opengles` on a
  phone and running everything is planned (see the roadmap). OpenGL ES 2.0
  hardware may lack what the renderer leans on: 32 bit index buffers,
  depth and stencil formats, multisampling.
- iOS, Windows and Linux devices.
- Browsers other than Chrome.
- Whether `flutter test` can run Flutter GPU. Until it can, map screens in
  widget and golden tests draw through the canvas renderer.

## Sources

- [Flutter docs: Impeller rendering engine](https://docs.flutter.dev/perf/impeller),
  updated 2026-08-21 for Flutter 3.47.
- [Flutter-GPU.md](https://github.com/flutter/flutter/blob/main/docs/engine/impeller/Flutter-GPU.md):
  Flutter GPU "requires Impeller" and "is in an early preview state and does
  not guarantee API stability".
- [impeller/docs/android.md](https://github.com/flutter/flutter/blob/main/docs/engine/impeller/docs/android.md).
- [flutter_main.cc](https://github.com/flutter/flutter/blob/main/engine/src/flutter/shell/platform/android/flutter_main.cc),
  [android_context_dynamic_impeller.cc](https://github.com/flutter/flutter/blob/main/engine/src/flutter/shell/platform/android/android_context_dynamic_impeller.cc),
  [FlutterEngineFlags.java](https://github.com/flutter/flutter/blob/main/engine/src/flutter/shell/platform/android/io/flutter/embedding/engine/flags/FlutterEngineFlags.java).
- [flutter_scene on pub.dev](https://pub.dev/packages/flutter_scene): platform
  table, Windows and Linux from Flutter 3.47.1, and the per-platform switches.
