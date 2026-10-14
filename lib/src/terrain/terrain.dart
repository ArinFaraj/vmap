import 'dart:math' as math;

import 'dem_tile.dart';

/// The ground's heights for a renderer: where they come from and how much
/// taller than they are they are drawn.
class Terrain {
  const Terrain(this.heights, this.exaggeration, this.maxZoom);

  final DemTiles heights;
  final double exaggeration;

  /// The deepest zoom the heights come at.
  final int maxZoom;

  /// The ground's height in metres, exaggerated, at [wx], [wy] in fractions
  /// of the world.
  double at(double wx, double wy, int zoom) =>
      heights.heightAt(wx, wy, math.min(zoom, maxZoom)) * exaggeration;
}
