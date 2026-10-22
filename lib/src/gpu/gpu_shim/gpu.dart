// Flutter GPU on every platform: package:flutter_gpu itself on native, a
// WebGL2 facade on the web, and a throwing stub for the analyzer. Native is
// told by dart:nativewrappers, which flutter_gpu imports, so tools that do
// not know that library find the stub instead of flagging the package.
export 'stub/_gpu.dart'
    if (dart.library.js_interop) 'web/_gpu.dart'
    if (dart.library.nativewrappers) 'impeller/_gpu.dart';

// Platform-independent helpers.
export 'shared/encoded_image_types.dart';
export 'shared/glsl_transpile.dart';
export 'shared/gpu_capabilities.dart';
