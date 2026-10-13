import 'dart:ui' as ui;

import 'expr.dart';
import 'sprites.dart';
import 'style_model.dart';
import 'tiles.dart' show LoadedTile, TileDraw;
import 'view.dart';

/// Draws the map's fill, line and circle layers and its buildings in place
/// of the canvas, from each tile's GPU stream, flat or tilted, whenever the
/// camera has a view. Labels, icons and raster layers stay on the canvas.
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

  void dispose();
}

/// What a [MapRenderer] keeps for one tile, released with the tile.
abstract interface class RendererTileData {
  void dispose();
}
