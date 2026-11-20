/// The engine of a map widget other than `Vmap`: the flutter_map layer
/// owns its engine through [VmapEngineOwner], as `Vmap` does, and takes
/// its gestures from `package:vmap/gestures.dart`. The options it makes an
/// engine with are `VmapEngineOptions`, from `package:vmap/vmap.dart`.
library;

export 'src/widget/engine_owner.dart' show VmapEngineOwner;
