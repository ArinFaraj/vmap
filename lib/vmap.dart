/// Maps for Flutter in any MapLibre style, drawn on the GPU.
///
/// [Vmap] is the map widget and [VmapController] moves it. A [VmapStyle]
/// says what to draw: a MapLibre style by address or as JSON, or the
/// built in one, which needs no key. [VmapOverlay] adds the app's own
/// sources and layers, [VmapMarker] places widgets on the map, and
/// [VmapController.featuresAt] tells what is under a tap.
///
/// Statistics for benchmarks are in `package:vmap/debug.dart`; the
/// flutter_map layer is the `vmap_flutter_map` package.
library;

export 'package:latlong2/latlong.dart' show LatLng;

export 'src/engine.dart' show VmapEngine;
export 'src/errors.dart' show VmapError, VmapErrorKind;
export 'src/glyphs/vmap_font.dart' show VmapFont;
export 'src/map_camera.dart' show VmapCamera;
export 'src/marker.dart' show VmapMarker;
export 'src/options.dart'
    show
        VmapGlyphs,
        VmapLabelOptions,
        VmapNetworkOptions,
        VmapRenderOptions,
        VmapRenderer;
export 'src/palette.dart' show VmapPalette;
export 'src/pins.dart' show VmapPin, VmapPins;
export 'src/query.dart'
    show VmapClusterMember, VmapDownload, VmapFeature, VmapFeatureState;
export 'src/sprites.dart' show VmapImage;
export 'src/style.dart' show VmapOverlay, VmapStyle, VmapStyleEdit;
export 'src/text_style.dart' show VmapTextStyle;
export 'src/widget/vmap.dart' show Vmap;
export 'src/widget/vmap_controller.dart' show VmapBounds, VmapController;
