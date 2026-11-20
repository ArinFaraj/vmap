/// vmap's maps inside flutter_map: a layer to put where a `TileLayer` would
/// go, markers with names the map writes, and gestures that move the map as
/// a `Vmap` moves.
library;

export 'src/gestures.dart' show VmapGestures;
export 'src/layer.dart' show NamedMarker, VmapLayer, VmapLayerState;
