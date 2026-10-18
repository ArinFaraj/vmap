import 'dart:ui' as ui;

import 'expr.dart';
import 'sprites.dart';
import 'style_model.dart';
import 'terrain/terrain.dart';
import 'tiles.dart' show LoadedTile, TileDraw;
import 'view.dart';

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

/// Draws the map's fill, line and circle layers and its buildings in place
/// of the canvas, from each tile's GPU stream, flat or tilted, whenever the
/// camera has a view. Labels, icons and raster layers stay on the canvas,
/// except tiled raster layers over raised ground, which it drapes.
abstract class MapRenderer {
  /// Whether it draws [sheet]'s layers in the right order; when it does
  /// not, the canvas draws the map.
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

  /// The tiled raster layers' tiles, in the style's order, to lay over the
  /// raised ground with the map's other flat layers; empty when the canvas
  /// draws them. Set before each [paint].
  List<RasterPiece> rasters = const [];

  /// The state the app gave single features, by their ids, indexed by the
  /// style's sources, for `feature-state`. Set before each [paint].
  List<Map<Object, Map<String, Object?>>?> states = const [];

  /// Lets go of the memory of tiles not drawn in the last frame.
  void trimMemory() {}

  void dispose();
}

/// What a [MapRenderer] keeps for one tile, released with the tile.
abstract interface class RendererTileData {
  void dispose();
}
