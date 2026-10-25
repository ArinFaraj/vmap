import 'dart:typed_data';
import 'dart:ui' as ui;

import '../render/map_renderer.dart';
import '../tiles/extrusion.dart';
import '../tiles/tiles.dart' show LoadedTile;
import 'canvas_tile.dart';
import 'mesh_painter.dart';

/// Draws the map's vector layers and buildings with Flutter's canvas, where
/// the GPU renderer does not run: each run straight onto the canvas when the
/// engine reaches it in the style's order, and the buildings, standing on a
/// tilted map but without a depth buffer, before the labels.
class CanvasMap extends MapRenderer {
  CanvasMap(this._meshes);

  final MeshPainter _meshes;
  final ExtrusionPainter _buildings = ExtrusionPainter();
  final ui.Paint _layerPaint = ui.Paint();

  late RenderFrame _frame;
  late Float64List _matrix;

  /// The first run not drawn yet this frame.
  int _next = 0;
  bool _buildingsDrawn = false;

  /// The canvas draws a tile from the worker's meshes, which a tile made
  /// ready for another renderer no longer has.
  @override
  bool canBuild(LoadedTile tile) => tile.builtMeshes != null;

  @override
  bool makeReady(LoadedTile tile, double scale, Stopwatch clock, int deadline) {
    var data = tile.rendererData as CanvasTile?;
    if (data == null) {
      data = CanvasTile(tile.builtMeshes!, tile.sheet);
      tile.keepForRenderer(data);
    }
    return data.build(_meshes.widths, scale, clock, deadline);
  }

  @override
  bool supports(_) => true;

  @override
  bool paint(ui.Canvas canvas, RenderFrame frame) {
    _frame = frame;
    _matrix = frame.view.matrix(
      originX: frame.origin.dx,
      originY: frame.origin.dy,
    );
    _next = 0;
    _buildingsDrawn = false;
    return false;
  }

  @override
  bool presentUntil(ui.Canvas canvas, int run) {
    final f = _frame;
    final sheet = f.sheet;
    if (run > _next) _drawRuns(canvas, run);
    if (_buildingsDrawn || run < sheet.labelsRun) return false;
    _buildingsDrawn = true;
    if (sheet.extrusions.isEmpty) return false;
    return _buildings.paint(
      canvas,
      f.view,
      f.origin,
      sheet,
      [for (final tiles in f.ideal) ...tiles],
      f.context,
      f.styleZoom,
      f.devicePixelRatio,
    );
  }

  void _drawRuns(ui.Canvas canvas, int run) {
    final f = _frame;
    final sheet = f.sheet;
    final size = ui.Size(f.view.width, f.view.height);
    canvas
      ..save()
      ..transform(_matrix);
    for (var index = _next; index < run; index++) {
      final r = sheet.runs[index];
      if (r.background >= 0 || r.raster >= 0) continue;
      final whole = sheet.runOpacity(r, f.context);
      if (whole == 0) continue;
      final faded = whole != null && whole < 1;
      if (faded) {
        canvas.saveLayer(
          null,
          _layerPaint..color = ui.Color.fromRGBO(0, 0, 0, whole),
        );
      }
      f.stats.drawCalls += _meshes.drawRun(
        canvas,
        sheet,
        r,
        f.fallback[r.source].followedBy(f.ideal[r.source]),
        f.states.length > r.source ? f.states[r.source] : null,
        f.sprites,
        size,
      );
      if (faded) canvas.restore();
    }
    canvas.restore();
    _next = run;
  }

  @override
  void dispose() => _buildings.dispose();
}
