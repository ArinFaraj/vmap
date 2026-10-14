import 'dart:math' as math;

import 'dem_tile.dart';

/// The ground's heights for a renderer: where they come from, how much
/// taller than they are they are drawn, and the height they are drawn
/// from.
class Terrain {
  const Terrain(this.heights, this.exaggeration, this.maxZoom, this.centre);

  final DemTiles heights;
  final double exaggeration;

  /// The deepest zoom the heights come at.
  final int maxZoom;

  /// The exaggerated height of the ground under the middle of the map,
  /// eased, in metres. Heights are drawn above it, so the ground in view
  /// stays near the height the camera looks at, as MapLibre keeps its
  /// centre on the terrain: ground far above the camera's centre crowds
  /// the near plane and loses depth precision.
  final double centre;

  /// The ground's height in metres, exaggerated, above [centre], at [wx],
  /// [wy] in fractions of the world.
  double at(double wx, double wy, int zoom) =>
      heights.heightAt(wx, wy, math.min(zoom, maxZoom)) * exaggeration - centre;
}
