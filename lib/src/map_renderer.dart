import 'dart:ui' as ui;

import 'expr.dart';
import 'sprites.dart';
import 'style_model.dart';
import 'tiles.dart' show TileDraw;
import 'view.dart';

/// Draws a tilted map's fill and line layers and its buildings in place of
/// the canvas, from each tile's GPU stream. Labels, icons and raster
/// layers stay on the canvas.
abstract class MapRenderer {
  /// Whether it draws [sheet]'s layers in the right order; when it does
  /// not, the canvas draws the map.
  bool supports(StyleSheet sheet);

  /// Draws the [ideal] tiles and, where none of them is, the [fallback]
  /// tiles standing in for missing ones, and returns true when it held
  /// work back for the next frame.
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    List<TileDraw> fallback,
    List<TileDraw> ideal,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
    SpriteSheet? sprites,
  );

  void dispose();
}
