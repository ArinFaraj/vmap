import 'dart:ui' as ui;

import '../style/expr.dart';
import '../labels/sdf_text.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../terrain/terrain.dart';
import '../tiles/tiles.dart' show LoadedTile, TileDraw;
import '../camera/view.dart';
import '../stats.dart';
import 'frame_planes.dart';
import 'zoom_history.dart';

/// One tile of a raster layer as drawn this frame: [source] of [image]
/// laid on [target], in pixels from the canvas origin, at [opacity] through
/// [filter], smoothed unless the layer asks for its nearest pixels. A GPU
/// that has no texture of [image] yet draws [meanwhile] in its place: the
/// image it replaced, or the tile standing in for it.
typedef RasterPiece = ({
  ui.Image image,
  ui.Rect source,
  ui.Rect target,
  double opacity,
  ui.ColorFilter? filter,
  bool smooth,
  (ui.Image, ui.Rect)? meanwhile,
});

/// Raster images the GPU has a texture of.
final Expando<bool> onGpu = Expando();

/// Everything a [MapRenderer] draws one frame from.
class RenderFrame {
  const RenderFrame({
    required this.view,
    required this.origin,
    required this.sheet,
    required this.fallback,
    required this.ideal,
    required this.context,
    required this.styleZoom,
    required this.devicePixelRatio,
    required this.stats,
    this.planes,
    this.sprites,
    this.terrain,
    this.rasters = const [],
    this.states = const [],
    this.dashFade = ZoomHistory.settled,
  });

  final MapView view;
  final ui.Offset origin;
  final StyleSheet sheet;

  /// Each source's tiles drawn at the zoom the camera asks for, and those
  /// standing in where one of them is missing, indexed by the style's
  /// sources.
  final List<List<TileDraw>> ideal, fallback;
  final EvalContext context;
  final double styleZoom, devicePixelRatio;
  final SpriteSheet? sprites;

  /// The ground's heights when the style raises it, null for flat ground.
  final Terrain? terrain;

  /// Each raster layer's tiles, by its place in the style's rasters, to lay
  /// over the raised ground with the map's other flat layers; empty when
  /// the engine draws them.
  final List<List<RasterPiece>> rasters;

  /// The state the app gave single features, by their ids, indexed by the
  /// style's sources, for `feature-state`.
  final List<Map<Object, Map<String, Object?>>?> states;

  /// How the frame's dashes cross-fade from the zoom level before.
  final DashFade dashFade;

  /// What the renderer counts as it draws the frame.
  final VmapStats stats;

  /// Where the GPU's images go on the web, as page elements between the
  /// canvas's pictures; null to draw them on the canvas.
  final FramePlanes? planes;
}

/// Draws the map's fill, line and circle layers and its buildings: the GPU
/// renderer from each tile's GPU stream, the canvas renderer from its
/// meshes. Backgrounds, raster layers and labels are the engine's, except
/// tiled raster layers over raised ground, which the GPU drapes.
abstract class MapRenderer {
  /// Whether it draws [sheet]'s layers in the right order; when the GPU
  /// does not, the canvas draws the map.
  bool supports(StyleSheet sheet);

  /// Starts drawing [frame] on [canvas], and returns true when it held work
  /// back for the next frame.
  bool paint(ui.Canvas canvas, RenderFrame frame);

  /// Whether it draws the globe, raised ground and buildings standing in a
  /// depth buffer. The canvas draws such a style flat, and cuts what it
  /// draws at the horizon.
  bool get drawsIn3d => false;

  /// Makes [tile] drawable, at [scale] tile units to a pixel, until
  /// [clock] passes [deadline]: at least a piece of it. Returns true once
  /// all of it is; what it keeps goes in [LoadedTile.rendererData].
  bool makeReady(LoadedTile tile, double scale, Stopwatch clock, int deadline);

  /// Whether it can make [tile] ready from what the tile still holds,
  /// after another renderer made it ready. A tile it cannot is dropped and
  /// fetched again.
  bool canBuild(LoadedTile tile);

  /// Draws on [canvas] the vector layers before the style's run [run] that
  /// are not drawn yet, and the buildings once [run] reaches the labels: a
  /// background or raster run is drawn between them, and the labels after
  /// the style's labels run. Returns true when it held work back for the
  /// next frame.
  bool presentUntil(ui.Canvas canvas, int run) => false;

  /// Has [sdfText] draw this frame's text into the last image laid down
  /// before style run [run], over the map, and returns whether it does:
  /// the caller then lays the images before [run] down after the labels,
  /// and what the labels drew on the canvas over them.
  bool textInto(int run) => false;

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

  /// Draws text from a style's glyph ranges as distance fields, as MapLibre
  /// does; null when this renderer cannot.
  SdfText? get sdfText => null;

  void dispose();
}

/// What a [MapRenderer] keeps for one tile, released with the tile.
abstract interface class RendererTileData {
  void dispose();
}
