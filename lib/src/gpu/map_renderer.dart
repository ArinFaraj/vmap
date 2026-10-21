import 'dart:ui' as ui;

import '../style/expr.dart';
import '../labels/sdf_text.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../terrain/terrain.dart';
import '../tiles/tiles.dart' show LoadedTile, TileDraw;
import '../camera/view.dart';
import '../canvas/zoom_history.dart';

/// One tile of a raster layer as drawn this frame: [source] of [image]
/// laid on [target], in pixels from the canvas origin, at [opacity] through
/// [filter], smoothed unless the layer asks for its nearest pixels.
typedef RasterPiece = ({
  ui.Image image,
  ui.Rect source,
  ui.Rect target,
  double opacity,
  ui.ColorFilter? filter,
  bool smooth,
});

/// Draws the map's fill, line and circle layers and its buildings: the GPU
/// renderer from each tile's GPU stream, the canvas renderer from its
/// meshes. Backgrounds, raster layers and labels are the engine's, except
/// tiled raster layers over raised ground, which the GPU drapes.
abstract class MapRenderer {
  /// Whether it draws [sheet]'s layers in the right order; when the GPU
  /// does not, the canvas draws the map.
  bool supports(StyleSheet sheet);

  /// Draws each source's [ideal] tiles and, where none of them is, its
  /// [fallback] tiles standing in for missing ones, both indexed by the
  /// style's sources, and returns true when it held work back for the next
  /// frame.
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    List<List<TileDraw>> fallback,
    List<List<TileDraw>> ideal,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
    SpriteSheet? sprites,
  );

  /// Sends [tile]'s flat layers and buildings to the GPU until [clock]
  /// passes [deadline], at least a piece of them, and returns true once all
  /// of them are there. What it keeps goes in [LoadedTile.rendererData].
  bool upload(LoadedTile tile, Stopwatch clock, int deadline);

  /// The ground's heights when the style raises it, null for flat ground.
  /// Set before each [paint].
  Terrain? terrain;

  /// Each raster layer's tiles, by its place in the style's rasters, to lay
  /// over the raised ground with the map's other flat layers; empty when
  /// the canvas draws them. Set before each [paint].
  List<List<RasterPiece>> rasters = const [];

  /// The state the app gave single features, by their ids, indexed by the
  /// style's sources, for `feature-state`. Set before each [paint].
  List<Map<Object, Map<String, Object?>>?> states = const [];

  /// How the frame's dashes cross-fade from the zoom level before.
  DashFade dashFade = ZoomHistory.settled;

  /// Draws on [canvas] the vector layers before the style's run [run] that
  /// are not drawn yet, and the buildings once [run] reaches the labels: a
  /// background or raster run is drawn between them, and the labels after
  /// the style's labels run. Returns true when it held work back for the
  /// next frame.
  bool presentUntil(ui.Canvas canvas, int run) => false;

  /// Lets go of the memory of tiles not drawn in the last frame.
  void trimMemory() {}

  /// Told of what failed on the device: a texture or pipeline that could
  /// not be made. Where it can no longer draw, [supports] answers false and
  /// the canvas draws instead.
  void Function(Object error)? onFailure;

  /// Whether it is still getting ready, its shaders loading. The engine
  /// draws only the background meanwhile, rather than the canvas for a
  /// moment and then this.
  bool get loading => false;

  /// Frames it showed its last picture again because the GPU had not
  /// caught up.
  int get framesReused => 0;

  /// Draws text from a style's glyph ranges as distance fields, as MapLibre
  /// does; null when this renderer cannot.
  SdfText? get sdfText => null;

  void dispose();
}

/// What a [MapRenderer] keeps for one tile, released with the tile.
abstract interface class RendererTileData {
  void dispose();
}
