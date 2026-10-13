import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'glyphs/glyph_pages.dart';
import 'label_path.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'pins.dart';
import 'road_labels.dart';
import 'sprites.dart';
import 'style_model.dart';
import 'tile_builder.dart' show BuiltLabel;

/// Draws placed labels: pins, icons, and text straight or bent along roads.
class LabelPainter {
  LabelPainter(this._view, this._roads);

  final LabelView _view;
  final RoadLabels _roads;

  /// Where glyph text is drawn from, once vmap's fonts are loaded.
  GlyphPages? glyphs;
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

  void paintPin(
    ui.Canvas canvas,
    LabelState st,
    VmapPin pin,
    VmapPins pins,
    double devicePixelRatio,
  ) {
    if (_pinRatio != devicePixelRatio) {
      dropPins();
      _pinRatio = devicePixelRatio;
    }
    final image = _pinImages[pin] ??= drawPin(pin, pins.size, devicePixelRatio);
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    final extent = pins.size + pinPad * 2;
    _view.project(st.worldX, st.worldY);
    final px = _view.x - extent / 2;
    final py = _view.y - extent / 2;
    canvas.drawImageRect(
      image,
      ui.Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
      ui.Rect.fromLTWH(
        (px * devicePixelRatio).roundToDouble() / devicePixelRatio,
        (py * devicePixelRatio).roundToDouble() / devicePixelRatio,
        extent,
        extent,
      ),
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
    double devicePixelRatio,
    double rotation,
  ) {
    _imagePaint.color = ui.Color.fromRGBO(
      255,
      255,
      255,
      st.opacity * st.iconOpacity,
    );
    final (fill, rim) = tint == null || symbol == null
        ? (null, null)
        : _tint(st, icon, symbol, tint, devicePixelRatio);
    final fit = symbol?.textFit ?? false;
    _view.project(st.worldX, st.worldY);
    final ix = _view.x + (fit ? st.dx : st.iconDx);
    final iy = _view.y + (fit ? st.dy : st.iconDy);
    final turn = switch (st.candidate) {
      TileLabel(tile: BuiltLabel(:final angle, :final turns)) =>
        turns ? angle + rotation : angle,
      MarkerName() => 0.0,
    };
    final area = ui.Rect.fromLTWH(
      -st.iconW / 2,
      -st.iconH / 2,
      st.iconW,
      st.iconH,
    );
    for (final filter in [?rim, fill]) {
      _imagePaint.colorFilter = filter;
      if (turn == 0) {
        canvas.drawImageRect(
          sheet.image,
          icon.source,
          area.translate(
            (ix * devicePixelRatio).roundToDouble() / devicePixelRatio,
            (iy * devicePixelRatio).roundToDouble() / devicePixelRatio,
          ),
          _imagePaint,
        );
      } else {
        canvas
          ..save()
          ..translate(ix, iy)
          ..rotate(turn)
          ..drawImageRect(sheet.image, icon.source, area, _imagePaint)
          ..restore();
      }
    }
    _imagePaint.colorFilter = null;
  }

  /// Draws a label's text: an image cut into strips along a bent road, a
  /// recording played back, or an image. A road's name is always an image,
  /// so only an image follows a bend.
  void paintText(
    ui.Canvas canvas,
    LabelState st,
    LabelSprite sprite,
    double devicePixelRatio,
    double rotation,
  ) {
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    switch (sprite) {
      case GlyphSprite() when st.curve != null:
        _glyphsBent(st, sprite, devicePixelRatio, rotation);
      case GlyphSprite():
        _glyphs(st, sprite, devicePixelRatio);
      case ImageSprite() when st.curve != null:
        _drawBent(canvas, st, sprite, rotation);
      case PictureSprite():
        _drawRecording(canvas, st, sprite, devicePixelRatio);
      case ImageSprite():
        _drawImage(canvas, st, sprite, devicePixelRatio);
    }
  }

  void _drawBent(
    ui.Canvas canvas,
    LabelState st,
    ImageSprite sprite,
    double rotation,
  ) {
    final pixelW = sprite.pixelW;
    final pixelH = sprite.pixelH;
    final textW = sprite.textWidth * st.scale;
    final n = RoadLabels.stripCount(textW, sprite.textHeight * st.scale);
    final strips = _roads.strips(st, n, textW / n / _view.world);
    final flip = math.cos(st.angle + rotation) < 0;
    final pad = LabelSprites.haloPad * pixelW / sprite.width;
    final slice = (pixelW - pad * 2) / n;
    final k = sprite.width * st.scale / pixelW;
    final transforms = Float32List(n * 4);
    final rects = Float32List(n * 4);
    for (var j = 0; j < n; j++) {
      final i = flip ? n - 1 - j : j;
      final a = strips[i * 3 + 2] + rotation + (flip ? math.pi : 0);
      _view.project(strips[i * 3], strips[i * 3 + 1]);
      final left = j == 0 ? 0.0 : pad + j * slice - 0.5;
      final right = j == n - 1 ? pixelW : pad + (j + 1) * slice + 0.5;
      final anchorX = pad + (j + 0.5) * slice - left;
      final anchorY = pixelH / 2;
      final scos = math.cos(a) * k;
      final ssin = math.sin(a) * k;
      transforms[j * 4] = scos;
      transforms[j * 4 + 1] = ssin;
      transforms[j * 4 + 2] = _view.x + st.dx - scos * anchorX + ssin * anchorY;
      transforms[j * 4 + 3] = _view.y + st.dy - ssin * anchorX - scos * anchorY;
      rects[j * 4] = left;
      rects[j * 4 + 1] = 0;
      rects[j * 4 + 2] = right;
      rects[j * 4 + 3] = pixelH;
    }
    canvas.drawRawAtlas(
      sprite.image,
      transforms,
      rects,
      null,
      null,
      null,
      _imagePaint,
    );
  }

  static int _faded(int argb, double opacity) =>
      (((argb >>> 24) * opacity).round() << 24) | (argb & 0xFFFFFF);

  /// The page [sprite] draws from at [fontPx] logical pixels to the em.
  GlyphPage _page(GlyphSprite sprite, double fontPx, double devicePixelRatio) {
    final look = sprite.look;
    final halo = look.halo == null ? 0.0 : look.haloWidth;
    return glyphs!.page((
      size: GlyphPages.sizeOf(fontPx * devicePixelRatio),
      weight: look.weight,
      italic: look.italic,
      halo: (halo * devicePixelRatio * 4).round(),
      blur: halo == 0 ? 0 : (look.haloBlur * devicePixelRatio * 4).round(),
    ));
  }

  void _glyphs(LabelState st, GlyphSprite sprite, double devicePixelRatio) {
    final pages = glyphs!;
    final (sx, sy, _, _) = _textBox(st, sprite);
    final em = sprite.fontSize * st.scale;
    final page = _page(sprite, em, devicePixelRatio);
    final k = em / page.em;
    final turn = st.screenAngle;
    final c = math.cos(turn), s = math.sin(turn);
    final shaped = sprite.shaped;
    final left = -shaped.width * em / 2, top = -shaped.height * em / 2;
    var ox = sx, oy = sy;
    if (turn == 0) {
      ox = _snap(sx + left, devicePixelRatio) - left;
      oy = _snap(sy + top, devicePixelRatio) - top;
    }
    final ink = _faded(sprite.look.color, st.opacity);
    final halo = sprite.look.halo == null
        ? null
        : _faded(sprite.look.halo!, st.opacity);
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      final cell = page.cell(g[i].toInt(), g[i + 1].toInt());
      if (cell == null) continue;
      final lx = left + g[i + 2] * em, ly = top + g[i + 3] * em;
      pages.add(
        cell,
        ox + c * lx - s * ly,
        oy + s * lx + c * ly,
        turn,
        k,
        ink,
        halo,
      );
    }
  }

  final Float64List _along = Float64List(3);

  void _glyphsBent(
    LabelState st,
    GlyphSprite sprite,
    double devicePixelRatio,
    double rotation,
  ) {
    final pages = glyphs!;
    final em = sprite.fontSize * st.scale;
    final page = _page(sprite, em, devicePixelRatio);
    final k = em / page.em;
    final shaped = sprite.shaped;
    final path = st.curve!;
    final world = _view.world;
    final flip = math.cos(st.angle + rotation) < 0;
    final half = shaped.width * em / 2;
    final top = -shaped.height * em / 2;
    final ink = _faded(sprite.look.color, st.opacity);
    final halo = sprite.look.halo == null
        ? null
        : _faded(sprite.look.halo!, st.opacity);
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      final cell = page.cell(g[i].toInt(), g[i + 1].toInt());
      if (cell == null) continue;
      final advance = g[i + 4] * em;
      var mid = g[i + 2] * em + advance / 2 - half;
      if (flip) mid = -mid;
      final reach = math.max(advance / 2, 1.0) / world;
      pointAlong(path, st.curveMid + mid / world - reach, _along);
      _view.project(_along[0], _along[1]);
      final ax = _view.x, ay = _view.y;
      pointAlong(path, st.curveMid + mid / world + reach, _along);
      _view.project(_along[0], _along[1]);
      final bx = _view.x, by = _view.y;
      var angle = math.atan2(by - ay, bx - ax);
      if (flip) angle += math.pi;
      final c = math.cos(angle), s = math.sin(angle);
      final cx = (ax + bx) / 2 + st.dx, cy = (ay + by) / 2 + st.dy;
      final lx = -advance / 2, ly = top + g[i + 3] * em;
      pages.add(
        cell,
        cx + c * lx - s * ly,
        cy + s * lx + c * ly,
        angle,
        k,
        ink,
        halo,
      );
    }
  }

  /// Where the middle of [st]'s text is on the screen, and its size there.
  (double, double, double, double) _textBox(LabelState st, LabelSprite sprite) {
    _view.project(st.worldX, st.worldY);
    return (
      _view.x + st.dx,
      _view.y + st.dy,
      sprite.width * st.scale,
      sprite.height * st.scale,
    );
  }

  /// [at] moved to the nearest device pixel.
  static double _snap(double at, double devicePixelRatio) =>
      (at * devicePixelRatio).roundToDouble() / devicePixelRatio;

  void _drawRecording(
    ui.Canvas canvas,
    LabelState st,
    PictureSprite sprite,
    double devicePixelRatio,
  ) {
    final (sx, sy, w, h) = _textBox(st, sprite);
    final turn = st.screenAngle;
    canvas.save();
    if (turn == 0) {
      canvas.translate(
        _snap(sx - w / 2, devicePixelRatio),
        _snap(sy - h / 2, devicePixelRatio),
      );
    } else {
      canvas
        ..translate(sx, sy)
        ..rotate(turn)
        ..translate(-w / 2, -h / 2);
    }
    canvas.scale(st.scale);
    final fading = st.opacity < 1;
    if (fading) {
      canvas.saveLayer(
        ui.Rect.fromLTWH(0, 0, sprite.width, sprite.height),
        _imagePaint,
      );
    }
    canvas.drawPicture(sprite.picture);
    if (fading) canvas.restore();
    canvas.restore();
  }

  void _drawImage(
    ui.Canvas canvas,
    LabelState st,
    ImageSprite sprite,
    double devicePixelRatio,
  ) {
    final (sx, sy, w, h) = _textBox(st, sprite);
    final turn = st.screenAngle;
    final source = ui.Rect.fromLTWH(0, 0, sprite.pixelW, sprite.pixelH);
    if (turn == 0) {
      canvas.drawImageRect(
        sprite.image,
        source,
        ui.Rect.fromLTWH(
          _snap(sx - w / 2, devicePixelRatio),
          _snap(sy - h / 2, devicePixelRatio),
          w,
          h,
        ),
        _imagePaint,
      );
    } else {
      canvas
        ..save()
        ..translate(sx, sy)
        ..rotate(turn)
        ..drawImageRect(
          sprite.image,
          source,
          ui.Rect.fromLTWH(-w / 2, -h / 2, w, h),
          _imagePaint,
        )
        ..restore();
    }
  }

  /// The fill an SDF icon is tinted with, and the rim drawn under it.
  (ui.ColorFilter, ui.ColorFilter?) _tint(
    LabelState st,
    SpriteImage icon,
    SymbolLayer symbol,
    EvalContext context,
    double devicePixelRatio,
  ) {
    final by = st.iconW / icon.width;
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
        fade: (asNumber(symbol.iconHaloBlur?.call(context)) ?? 0) / (8 * by),
      ),
    );
  }

  /// Turns a distance field into a crisp shape in [tint]. The edge of the
  /// shape is where the field is [edge] full, three quarters for the shape
  /// itself and less for a rim around it; [scale] is how many screen pixels
  /// one pixel of the field covers, which sets how sharp the edge may be.
  /// The edge fades out over [fade] of the field's range.
  static ui.ColorFilter sdf(
    Rgba tint,
    double scale, {
    double edge = 0.75,
    double fade = 0,
  }) {
    final crisp = (6 * scale).clamp(2.0, 24.0);
    final gain = fade > 0 ? math.min(crisp, 1 / fade) : crisp;
    return ui.ColorFilter.matrix([
      0, 0, 0, 0, tint.r * 255, //
      0, 0, 0, 0, tint.g * 255,
      0, 0, 0, 0, tint.b * 255,
      0, 0, 0, gain * tint.a, (0.5 - edge * gain) * 255 * tint.a,
    ]);
  }
}
