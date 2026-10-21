import 'dart:typed_data';
import 'dart:ui' as ui;

import '../camera/view.dart';
import '../gpu/map_renderer.dart';
import '../style/expr.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../tiles/extrusion.dart';
import '../tiles/tiles.dart';
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

  late MapView _view;
  late StyleSheet _sheet;
  late ui.Offset _origin;
  late List<List<TileDraw>> _fallback, _ideal;
  late EvalContext _context;
  late Float64List _matrix;
  double _styleZoom = 0, _devicePixelRatio = 1;

  /// The first run not drawn yet this frame.
  int _next = 0;
  bool _buildingsDrawn = false;

  /// Paths and vertex lists drawn this frame.
  int drawCalls = 0;

  @override
  bool supports(StyleSheet sheet) => true;

  @override
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
  ) {
    _view = view;
    _origin = origin;
    _sheet = sheet;
    _fallback = fallback;
    _ideal = ideal;
    _context = context;
    _styleZoom = styleZoom;
    _devicePixelRatio = devicePixelRatio;
    _matrix = view.matrix(originX: origin.dx, originY: origin.dy);
    _next = 0;
    _buildingsDrawn = false;
    drawCalls = 0;
    return false;
  }

  @override
  bool upload(LoadedTile tile, Stopwatch clock, int deadline) => true;

  @override
  bool presentUntil(ui.Canvas canvas, int run) {
    final sheet = _sheet;
    if (run > _next) _drawRuns(canvas, run);
    if (_buildingsDrawn || run < sheet.labelsRun) return false;
    _buildingsDrawn = true;
    if (sheet.extrusions.isEmpty) return false;
    return _buildings.paint(
      canvas,
      _view,
      _origin,
      sheet,
      [for (final tiles in _ideal) ...tiles],
      _context,
      _styleZoom,
      _devicePixelRatio,
    );
  }

  void _drawRuns(ui.Canvas canvas, int run) {
    final sheet = _sheet;
    final size = ui.Size(_view.width, _view.height);
    canvas
      ..save()
      ..transform(_matrix);
    for (var index = _next; index < run; index++) {
      final r = sheet.runs[index];
      if (r.background >= 0 || r.raster >= 0) continue;
      final whole = sheet.runOpacity(r, _context);
      if (whole == 0) continue;
      final faded = whole != null && whole < 1;
      if (faded) {
        canvas.saveLayer(
          null,
          _layerPaint..color = ui.Color.fromRGBO(0, 0, 0, whole),
        );
      }
      drawCalls += _meshes.drawRun(
        canvas,
        sheet,
        r,
        _fallback[r.source].followedBy(_ideal[r.source]),
        states.length > r.source ? states[r.source] : null,
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
