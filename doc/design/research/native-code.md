# Native code: Rust, FFI, Nitro

Checked 2026-10-13.

- `native_toolchain_rust` 1.0.4 on pub.dev: Rust built by Dart build hooks
  from a `Cargo.toml` in the package; a `hook/build.dart` calls
  `RustBuilder`. Its docs warn against bare `stable`, `beta` or `nightly`
  channels in `rust-toolchain.toml`.
- `flutter_rust_bridge` 2.13.0: generates bindings and manages memory. Its
  web support was not checked.
- `nitro` 0.7.9 (Nitrogen SDK): generated bindings to Swift, Kotlin and C++,
  WebAssembly on the web. Not Rust. Its own table rates manual FFI at the
  same per call cost as Nitro; what it saves is hand written glue. It suits
  calling platform APIs, not compute kernels.
- Plain `dart:ffi` with leaf calls on typed buffers shared with native code
  is the lowest overhead path for bulk work; per call overhead only matters
  for chatty interfaces, which the kernel boundary avoids by passing whole
  tiles.
