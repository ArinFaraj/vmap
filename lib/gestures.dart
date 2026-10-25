/// vmap's gestures, for a map widget other than `Vmap` that draws with a
/// `VmapEngine`: the flutter_map layer takes them from here. Implement
/// [MapGestureTarget] for the widget's camera, give it to a
/// [MapGestureRecognizer], and put a [MapGestureDetector] over the map.
library;

export 'src/gestures/gesture_options.dart' show VmapGestureOptions;
export 'src/gestures/gesture_target.dart'
    show MapGestureStep, MapGestureTarget, MapGlide;
export 'src/gestures/map_gestures.dart'
    show MapGestureDetector, MapGestureRecognizer;
