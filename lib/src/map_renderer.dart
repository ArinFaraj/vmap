import 'dart:ui' as ui;

import 'expr.dart';
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

  /// Draws [tiles], those standing in for missing ones first, and returns
  /// true when it held work back for the next frame.
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    List<TileDraw> tiles,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
  );

  void dispose();
}
