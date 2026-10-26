import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../style/expr.dart';
import 'icon_stretch.dart';
import 'label_style.dart';
import 'label_state.dart';
import 'label_view.dart';
import '../style/pins.dart';
import 'sdf_text.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../tiles/built_tile.dart';

/// Draws placed labels' pins and icons, and the collision boxes and
/// circles of the debug overlay.
class LabelPainter {
  LabelPainter(this._view, this._style);

  final LabelView _view;
  final LabelStyle _style;

  final ui.Paint _imagePaint = ui.Paint()
    ..filterQuality = ui.FilterQuality.medium;
  final Map<VmapPin, ui.Image> _pinImages = {};
  double _pinRatio = 0;

  void dropPins() {
    for (final image in _pinImages.values) {
      image.dispose();
    }
    _pinImages.clear();
  }

  /// Queues [st]'s icon for the GPU, each of its [pieces] a quad about
  /// [ix], [iy] turned by [turn], a single piece padded by a clear texel
  /// as MapLibre pads its icons. False when the GPU cannot draw it yet.
  bool _gpuIcon(
    SdfText gpu,
    LabelState st,
    SpriteImage icon,
    SymbolLayer? symbol,
    EvalContext? tint,
    List<(ui.Rect, ui.Rect)> pieces,
    double ix,
    double iy,
    (double, double, double, double) basis, {
    required bool linear,
  }) {
    final (ux, uy, vx, vy) = basis;
    final opacity = st.opacity * st.iconOpacity;
    final layer = switch (st.candidate) {
      TileLabel(:final tile) => tile.layer,
      _ => -1,
    };
    final SdfLook look;
    if (icon.sdf && symbol != null && tint != null) {
      final haloWidth = (asNumber(symbol.iconHaloWidth?.call(tint)) ?? 0)
          .toDouble();
      final haloColor = Rgba.of(symbol.iconHaloColor?.call(tint));
      final color = Rgba.of(symbol.iconColor(tint)) ?? Rgba.black;
      look = SdfLook(
        SdfLook.rgba(color.toArgb(), opacity),
        haloWidth > 0 && haloColor != null
            ? SdfLook.rgba(haloColor.toArgb(), opacity)
            : null,
        haloWidth,
        (asNumber(symbol.iconHaloBlur?.call(tint)) ?? 0).toDouble(),
        st.iconScale,
        overlap: haloWidth > 1,
      );
    } else {
      look = SdfLook(
        Float32List.fromList([opacity, opacity, opacity, opacity]),
        null,
        0,
        0,
        1,
      );
    }
    final single = pieces.length == 1;
    for (final (from, to) in pieces) {
      if (from.width <= 0 || from.height <= 0) continue;
      final kx = to.width / from.width, ky = to.height / from.height;
      var source = from;
      var ox = ix + ux * to.left + vx * to.top,
          oy = iy + uy * to.left + vy * to.top;
      final ax = ux * kx, ay = uy * kx, bx = vx * ky, by = vy * ky;
      if (single) {
        source = from.inflate(1);
        ox -= ax + bx;
        oy -= ay + by;
      }
      if (!gpu.icon(
        source,
        icon.source,
        ox,
        oy,
        ax,
        ay,
        bx,
        by,
        sdf: icon.sdf,
        linear: icon.sdf || linear,
        look: look,
        layer: layer,
      )) {
        return false;
      }
    }
    return true;
  }

  /// Where a step of one pixel right and one down in [st]'s icon land on the
  /// screen, the icon lying on the ground of the tilted map at [onMap]
  /// radians, as MapLibre lays an icon pitched with the map: its size on
  /// the ground its size facing the viewer times half its anchor's
  /// distance ratio and a half, foreshortened by the tilt. Leaves [LabelView.x]
  /// and [LabelView.y] at the anchor.
  (double, double, double, double) _groundBasis(LabelState st, double onMap) {
    _view.project(st.worldX, st.worldY);
    final x0 = _view.x, y0 = _view.y;
    final unit =
        (0.5 + 0.5 * _view.depth) /
        math.max(st.perspective, 1e-6) /
        _view.world *
        _view.groundScale(st.worldY);
    final c = math.cos(onMap) * unit, s = math.sin(onMap) * unit;
    _view.project(st.worldX + c, st.worldY + s);
    final ux = _view.x - x0, uy = _view.y - y0;
    _view.project(st.worldX - s, st.worldY + c);
    final vx = _view.x - x0, vy = _view.y - y0;
    _view.project(st.worldX, st.worldY);
    return (ux, uy, vx, vy);
  }

  void paintPin(ui.Canvas canvas, LabelState st, VmapPin pin, VmapPins pins) {
    final devicePixelRatio = _view.devicePixelRatio;
    if (_pinRatio != devicePixelRatio) {
      dropPins();
      _pinRatio = devicePixelRatio;
    }
    final image = _pinImages[pin] ??= drawPin(pin, pins.size, devicePixelRatio);
    _view.drewBelowText = true;
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    final extent = pins.size + pinPad * 2;
    _view.project(st.worldX, st.worldY);
    final px = _view.x - extent / 2;
    final py = _view.y - extent / 2;
    canvas.drawImageRect(
      image,
      ui.Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
      ui.Rect.fromLTWH(_view.onPixel(px), _view.onPixel(py), extent, extent),
      _imagePaint,
    );
  }

  /// Draws [st]'s icon from the sprite sheet, tinted by its layer's paint
  /// read in [tint] when it is an SDF icon.
  void paintIcon(
    ui.Canvas canvas,
    LabelState st,
    SpriteImage icon,
    SpriteSheet sheet,
    SymbolLayer? symbol,
    EvalContext? tint,
  ) {
    final LabelView(:devicePixelRatio, :still, :moving) = _view;
    _imagePaint.color = ui.Color.fromRGBO(
      255,
      255,
      255,
      st.opacity * st.iconOpacity,
    );
    final (fill, rim) = tint == null || symbol == null
        ? (null, null)
        : _tint(st, icon, symbol, tint);
    final fit = symbol?.textFit ?? false;
    _view.project(st.worldX, st.worldY);
    final ax = _view.x, ay = _view.y;
    final turn = switch (st.candidate) {
      // An icon on a name along a line lies along the line at its anchor.
      TileLabel(tile: BuiltLabel(line: _?)) => _view.screenAngle(
        st.worldX,
        st.worldY,
        st.angle,
      ),
      TileLabel(tile: BuiltLabel(:final angle, :final turns)) =>
        turns ? _view.screenAngle(st.worldX, st.worldY, angle) : angle,
      MarkerName() => 0.0,
    };
    var basis = (
      math.cos(turn),
      math.sin(turn),
      -math.sin(turn),
      math.cos(turn),
    );
    if (st.iconOnGround) {
      final onMap = switch (st.candidate) {
        TileLabel(tile: BuiltLabel(line: _?)) => st.angle,
        TileLabel(tile: BuiltLabel(:final angle, :final turns)) =>
          turns || (symbol?.iconAlongMap ?? false)
              ? angle
              : angle - _view.mapTurn,
        MarkerName() => -_view.mapTurn,
      };
      basis = _groundBasis(st, onMap);
    }
    // As MapLibre's getIconQuads, an icon's offset and anchor are in its
    // own frame, turned and laid down with it; a fitted icon's follow its
    // text, which already has been.
    final (ux, uy, vx, vy) = basis;
    final ox = st.iconDx - st.iconMoveX, oy = st.iconDy - st.iconMoveY;
    final ix = st.iconMoveX + ax + (fit ? ox : ux * ox + vx * oy);
    final iy = st.iconMoveY + ay + (fit ? oy : uy * ox + vy * oy);
    final area = ui.Rect.fromLTWH(
      -st.iconW / 2,
      -st.iconH / 2,
      st.iconW,
      st.iconH,
    );
    final pieces = fit
        ? stretchedIcon(
            icon,
            area,
            st.iconScale,
            anchor: ui.Offset(-st.iconDx, -st.iconDy),
          )
        : [(icon.source, area)];
    final (from0, to0) = pieces.first;
    final texelForPixel =
        still &&
        turn == 0 &&
        !icon.sdf &&
        _view.tilted.pitch == 0 &&
        !(symbol?.iconSizeByFeature ?? false) &&
        pieces.length == 1 &&
        to0.width * devicePixelRatio == from0.width &&
        to0.height * devicePixelRatio == from0.height;
    // As MapLibre, an icon at its own size and density, upright and not
    // zooming, is sampled nearest, its pieces stretched or not.
    final nearest =
        still &&
        !moving &&
        turn == 0 &&
        !icon.sdf &&
        _view.tilted.pitch == 0 &&
        st.iconScale == 1 &&
        !(symbol?.iconSizeByFeature ?? false) &&
        icon.pixelRatio == devicePixelRatio;
    if (_view.sdf case final gpu?
        when _gpuIcon(
          gpu,
          st,
          icon,
          symbol,
          tint,
          pieces,
          ix,
          iy,
          basis,
          linear: !(nearest || texelForPixel),
        )) {
      return;
    }
    _view.drewBelowText = true;
    final onGround = st.iconOnGround;
    for (final filter in [?rim, fill]) {
      _imagePaint.colorFilter = filter;
      if (onGround) {
        final (ux, uy, vx, vy) = basis;
        canvas
          ..save()
          ..transform(
            Float64List(16)
              ..[0] = ux
              ..[1] = uy
              ..[4] = vx
              ..[5] = vy
              ..[10] = 1
              ..[12] = ix
              ..[13] = iy
              ..[15] = 1,
          );
        for (final (from, to) in pieces) {
          canvas.drawImageRect(sheet.image, from, to, _imagePaint);
        }
        canvas.restore();
      } else if (nearest && !texelForPixel) {
        _imagePaint.filterQuality = ui.FilterQuality.none;
        for (final (from, to) in pieces) {
          final (snappedFrom, snappedTo) = _toPixelCentres(
            from,
            to.translate(ix, iy),
            devicePixelRatio,
          );
          if (snappedTo.isEmpty) continue;
          canvas.drawImageRect(
            sheet.image,
            snappedFrom,
            snappedTo,
            _imagePaint,
          );
        }
        _imagePaint.filterQuality = ui.FilterQuality.medium;
      } else if (texelForPixel) {
        // MapLibre samples an unscaled icon nearest, which puts its corner
        // on the device pixel at or below the half.
        final x = ((ix + to0.left) * devicePixelRatio - 0.5).ceilToDouble();
        final y = ((iy + to0.top) * devicePixelRatio - 0.5).ceilToDouble();
        canvas.drawImageRect(
          sheet.image,
          from0,
          ui.Rect.fromLTWH(
            x / devicePixelRatio,
            y / devicePixelRatio,
            to0.width,
            to0.height,
          ),
          _imagePaint,
        );
      } else if (turn == 0 && _style.rules.snapIcons && still) {
        final dx = _view.onPixel(ix);
        final dy = _view.onPixel(iy);
        for (final (from, to) in pieces) {
          canvas.drawImageRect(
            sheet.image,
            from,
            to.translate(dx, dy),
            _imagePaint,
          );
        }
      } else {
        canvas
          ..save()
          ..translate(ix, iy)
          ..rotate(turn);
        for (final (from, to) in pieces) {
          canvas.drawImageRect(sheet.image, from, to, _imagePaint);
        }
        canvas.restore();
      }
    }
    _imagePaint.colorFilter = null;
  }

  /// [to] cut to the device pixels whose centres it covers, as GL fills a
  /// quad, with [from] cut to match: sampled nearest, each pixel shows the
  /// texel it would have, and no edge pixel is blended.
  static (ui.Rect, ui.Rect) _toPixelCentres(
    ui.Rect from,
    ui.Rect to,
    double devicePixelRatio,
  ) {
    final l = to.left * devicePixelRatio, r = to.right * devicePixelRatio;
    final t = to.top * devicePixelRatio, b = to.bottom * devicePixelRatio;
    final pl = (l - 0.5).ceilToDouble(), pr = (r - 0.5).ceilToDouble();
    final pt = (t - 0.5).ceilToDouble(), pb = (b - 0.5).ceilToDouble();
    if (pr <= pl || pb <= pt || r <= l || b <= t) {
      return (from, ui.Rect.zero);
    }
    final kx = from.width / (r - l), ky = from.height / (b - t);
    return (
      ui.Rect.fromLTRB(
        from.left + (pl - l) * kx,
        from.top + (pt - t) * ky,
        from.left + (pr - l) * kx,
        from.top + (pb - t) * ky,
      ),
      ui.Rect.fromLTRB(
        pl / devicePixelRatio,
        pt / devicePixelRatio,
        pr / devicePixelRatio,
        pb / devicePixelRatio,
      ),
    );
  }

  /// The fill an SDF icon is tinted with, and the rim drawn under it.
  (ui.ColorFilter, ui.ColorFilter?) _tint(
    LabelState st,
    SpriteImage icon,
    SymbolLayer symbol,
    EvalContext context,
  ) {
    final devicePixelRatio = _view.devicePixelRatio;
    final by = st.iconScale;
    final fill = sdf(
      Rgba.of(symbol.iconColor(context)) ?? Rgba.black,
      by * devicePixelRatio,
    );
    final reach = asNumber(symbol.iconHaloWidth?.call(context)) ?? 0;
    final around = Rgba.of(symbol.iconHaloColor?.call(context));
    if (reach <= 0 || around == null || by <= 0) return (fill, null);
    return (
      fill,
      sdf(
        around,
        by * devicePixelRatio,
        edge: (0.75 - reach / (8 * by)).clamp(0.1, 0.75),
        blur:
            (asNumber(symbol.iconHaloBlur?.call(context)) ?? 0) * 1.19 / 8 / by,
      ),
    );
  }

  /// Turns a distance field into a crisp shape in [tint]. The edge of the
  /// shape is where the field is [edge] full, three quarters for the shape
  /// itself and less for a rim around it; [scale] is how many screen pixels
  /// one pixel of the field covers, which sets how sharp the edge may be.
  /// A halo's [blur], in the field's range, widens the fade as MapLibre's
  /// gamma_halo does.
  static ui.ColorFilter sdf(
    Rgba tint,
    double scale, {
    double edge = 0.75,
    double blur = 0,
  }) {
    // smoothstep's slope at the edge in MapLibre's symbol_sdf shader: 0.75
    // over its gamma, 0.105 per screen pixel of field plus the blur.
    final gain = (0.75 / (blur + 0.105 / scale)).clamp(0.5, 24.0);
    return ui.ColorFilter.matrix([
      0, 0, 0, 0, tint.r * 255, //
      0, 0, 0, 0, tint.g * 255,
      0, 0, 0, 0, tint.b * 255,
      0, 0, 0, gain * tint.a, (0.5 - edge * gain) * 255 * tint.a,
    ]);
  }

  /// Draws [boxes] as [PointLabels.debugBoxes] holds them, one device pixel
  /// wide as MapLibre's GL lines, blue where placed and red where not.
  /// Draws [circles], x, y, radius and whether it ran into something in
  /// turn, as MapLibre's collision_circle shader rings them.
  void paintCollisionCircles(ui.Canvas canvas, List<double> circles) {
    if (circles.isEmpty) return;
    final placed = ui.Paint()
      ..style = ui.PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = const ui.Color(0x400000FF);
    final hit = ui.Paint()
      ..style = ui.PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = const ui.Color(0x80FF0000);
    for (var i = 0; i + 3 < circles.length; i += 4) {
      canvas.drawCircle(
        ui.Offset(circles[i], circles[i + 1]),
        circles[i + 2],
        circles[i + 3] > 0 ? hit : placed,
      );
    }
  }

  void paintCollisionBoxes(ui.Canvas canvas, List<double> boxes) {
    final devicePixelRatio = _view.devicePixelRatio;
    final placed = ui.Paint()
      ..isAntiAlias = false
      ..color = const ui.Color(0x400000FF);
    final hit = ui.Paint()
      ..isAntiAlias = false
      ..color = const ui.Color(0x80FF0000);
    canvas
      ..save()
      ..scale(1 / devicePixelRatio);
    for (var i = 0; i + 4 < boxes.length; i += 5) {
      final paint = boxes[i + 4] > 0 ? placed : hit;
      final l = ((boxes[i] + 0.5) * devicePixelRatio).floorToDouble();
      final t = ((boxes[i + 1] + 0.5) * devicePixelRatio).floorToDouble();
      final r = ((boxes[i + 2] + 0.5) * devicePixelRatio).floorToDouble();
      final b = ((boxes[i + 3] + 0.5) * devicePixelRatio).floorToDouble();
      canvas
        ..drawRect(ui.Rect.fromLTRB(l, t, r, t + 1), paint)
        ..drawRect(ui.Rect.fromLTRB(r, t, r + 1, b), paint)
        ..drawRect(ui.Rect.fromLTRB(l + 1, b, r + 1, b + 1), paint)
        ..drawRect(ui.Rect.fromLTRB(l, t + 1, l + 1, b + 1), paint);
    }
    canvas.restore();
  }
}
