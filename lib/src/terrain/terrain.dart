import 'dart:math' as math;

import 'dem_tile.dart';

/// The ground's heights for a renderer: where they come from, how much
/// taller than they are they are drawn, and the height they are drawn
/// from.
class Terrain {
  const Terrain(
    this.heights,
    this.exaggeration,
    this.maxZoom,
    this.centre, {
    this.shallower = 0,
  });

  final DemTiles heights;
  final double exaggeration;

  /// The deepest zoom the heights come at.
  final int maxZoom;

  /// How many zoom levels above a tile of the map the heights it is raised
  /// by come from: as MapLibre, 128 heights span a 512 pixel tile, so a
  /// source of 256 pixel tiles is read a level up.
  final int shallower;

  /// The zoom of the heights a tile of the map at [zoom] is raised by.
  int zoomFor(int zoom) => math.max(0, math.min(zoom - shallower, maxZoom));

  /// The exaggerated height of the ground under the middle of the map,
  /// eased, in metres. Heights are drawn above it, so the ground in view
  /// stays near the height the camera looks at, as MapLibre keeps its
  /// centre on the terrain: ground far above the camera's centre crowds
  /// the near plane and loses depth precision.
  final double centre;

  /// The ground's height in metres, exaggerated, above [centre], at [wx],
  /// [wy] in fractions of the world.
  double at(double wx, double wy, int zoom) =>
      heights.heightAt(wx, wy, zoomFor(zoom)) * exaggeration - centre;
}
