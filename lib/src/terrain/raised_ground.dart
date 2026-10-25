import 'dart:math' as math;

import '../camera/view.dart';
import '../raster/raster.dart';
import '../raster/raster_dem.dart';
import '../options.dart';
import '../style/raster_style.dart';
import '../tiles/tile_id.dart';
import 'terrain.dart';

/// The ground the style's root `terrain` raises: its tiles of heights, and
/// the height the map's middle stands at, eased as heights arrive.
class RaisedGround {
  RaisedGround(this._network, {required this.onLoaded, required this.onError});

  final VmapNetworkOptions _network;
  final void Function() onLoaded;
  final void Function(Object error) onError;

  /// The heights, while the style raises the ground.
  TerrainTiles? tiles;

  /// The height in metres the map's middle stands at, as MapLibre's center
  /// elevation with centerClampedToGround off; null keeps it on the ground
  /// under it.
  double? centerElevation;

  double _centre = 0;

  /// Raises the ground by [layer]'s heights, or lays it flat for null.
  void use(TerrainLayer? layer) {
    if (layer?.signature == tiles?.layer.signature) {
      if (layer != null) tiles!.restyle(layer);
      return;
    }
    tiles?.close();
    tiles = layer == null
        ? null
        : RasterDrawing.of(
            layer,
            config: _network,
            onLoaded: onLoaded,
            onError: onError,
          ) as TerrainTiles;
  }

  /// The heights the last [raise] stood the map on, or null on flat ground.
  Terrain? terrain;

  /// Asks for the heights under [view] and keeps them in [terrain]. Returns
  /// the view over that ground, and whether the ground is still easing to
  /// its height.
  ({MapView view, bool easing}) raise(MapView view) {
    final terrain = tiles;
    if (terrain == null) {
      this.terrain = null;
      return (view: view, easing: false);
    }
    final exaggeration = terrain.layer.exaggeration;
    final shallower = terrain.shallower;
    final zoom = math.max(
      0,
      math.min(view.zoom.floor() - shallower, terrain.maxZoom),
    );
    final perMetre = perMetreAt(view);
    final eye = view.eye;
    final belowEye =
        terrain.heights.heightAt(
          eye.x / view.worldSize,
          eye.y / view.worldSize,
          zoom,
        ) *
        exaggeration;
    // The ground under the map's middle, raised further when a hill would
    // otherwise reach the camera's near plane: everything sinks instead, as
    // MapLibre lifts its camera over terrain.
    final near = view.height / 50;
    final under = math.max(
      terrain.heights.heightAt(view.centerX, view.centerY, zoom) * exaggeration,
      belowEye + (near - eye.height) / perMetre,
    );
    // Eased, so an arriving tile of heights does not make the map jump.
    final fixed = centerElevation;
    final centre = fixed != null
        ? _centre = fixed
        : _centre += (under - _centre) * 0.15;
    final easing = fixed == null && (under - centre).abs() > 0.5;
    final centreTile = terrain.heights.locate(view.centerX, view.centerY, zoom);
    final raised = view.withGround(
      centre,
      (centreTile?.$1.min ?? 0) * exaggeration,
    );
    terrain.want(
      {
        for (final t in raised.cover(
          maxZoom: terrain.maxZoom + shallower,
          variableZoom: true,
          beyond: view.height,
        ))
          if (t.z >= shallower)
            TileId(
              t.z - shallower,
              (t.x % (1 << t.z)) >> shallower,
              t.y >> shallower,
            ),
      }.toList(),
    );
    this.terrain = Terrain(
      terrain.heights,
      exaggeration,
      terrain.maxZoom,
      centre,
      shallower: shallower,
    );
    return (view: raised, easing: easing);
  }

  void close() => tiles?.close();
}
