import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'glyphs/glyph_layout.dart';
import 'glyphs/glyph_pages.dart';
import 'glyphs/glyph_raster.dart' show PageKey;
import 'icon_stretch.dart';
import 'label_path.dart';
import 'label_rules.dart';
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

  LabelRules rules = LabelRules.vmap;
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
    final ix = _view.x + st.iconDx;
    final iy = _view.y + st.iconDy;
    final turn = switch (st.candidate) {
      TileLabel(tile: BuiltLabel(:final angle, :final turns)) =>
        turns ? _view.screenAngle(st.worldX, st.worldY, angle) : angle,
      MarkerName() => 0.0,
    };
    final area = ui.Rect.fromLTWH(
      -st.iconW / 2,
      -st.iconH / 2,
      st.iconW,
      st.iconH,
    );
    final pieces = fit
        ? stretchedIcon(icon, area, st.iconScale)
        : [(icon.source, area)];
    for (final filter in [?rim, fill]) {
      _imagePaint.colorFilter = filter;
      if (turn == 0 && rules.snapIcons) {
        final dx = (ix * devicePixelRatio).roundToDouble() / devicePixelRatio;
        final dy = (iy * devicePixelRatio).roundToDouble() / devicePixelRatio;
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

  /// Draws a label's text: an image cut into strips along a bent road, a
  /// recording played back, or an image. A road's name is always an image,
  /// so only an image follows a bend.
  void paintText(
    ui.Canvas canvas,
    LabelState st,
    LabelSprite sprite,
    double devicePixelRatio,
  ) {
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    switch (sprite) {
      case GlyphSprite() when st.onGround && _view.tilted != null:
        _glyphsGround(st, sprite, devicePixelRatio);
      case RangeSprite() when st.curve == null && _turnOf(st) == 0:
        _rangeGlyphs(st, sprite, devicePixelRatio);
      case GlyphSprite() when st.curve != null:
        _glyphsBent(st, sprite, devicePixelRatio);
      case GlyphSprite():
        _glyphs(st, sprite, devicePixelRatio);
      case ImageSprite() when st.curve != null:
        _drawBent(canvas, st, sprite);
      case PictureSprite():
        _drawRecording(canvas, st, sprite, devicePixelRatio);
      case ImageSprite():
        _drawImage(canvas, st, sprite, devicePixelRatio);
    }
  }

  void _drawBent(ui.Canvas canvas, LabelState st, ImageSprite sprite) {
    final pixelW = sprite.pixelW;
    final pixelH = sprite.pixelH;
    final textW = sprite.textWidth * st.scale;
    final n = RoadLabels.stripCount(textW, sprite.textHeight * st.scale);
    final strips = _roads.strips(st, n, textW / n / _view.world);
    final flip =
        st.keepUpright &&
        math.cos(_view.screenAngle(st.worldX, st.worldY, st.angle)) < 0;
    final pad = LabelSprites.haloPad * pixelW / sprite.width;
    final slice = (pixelW - pad * 2) / n;
    final k = sprite.width * st.scale / pixelW;
    final transforms = Float32List(n * 4);
    final rects = Float32List(n * 4);
    for (var j = 0; j < n; j++) {
      final i = flip ? n - 1 - j : j;
      final a =
          _view.screenAngle(
            strips[i * 3],
            strips[i * 3 + 1],
            strips[i * 3 + 2],
          ) +
          (flip ? math.pi : 0);
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

  /// Fills [sprite]'s cells for its size now, from its cache when the look
  /// and the pages are unchanged, so a steady frame allocates nothing.
  void _resolve(GlyphSprite sprite, double em, double devicePixelRatio) {
    final pages = glyphs!;
    final look = sprite.look;
    final haloWidth = look.halo == null ? 0.0 : look.haloWidth;
    final size = GlyphPages.sizeOf(em * devicePixelRatio);
    final halo = (haloWidth * devicePixelRatio * 4).round();
    final int blur = haloWidth == 0
        ? 0
        : (look.haloBlur * devicePixelRatio * 4).round();
    final weight = GlyphFonts.snapWeight(look.weight);
    final int code =
        ((((size + 128) * 10 + weight ~/ 100) * 2 + (look.italic ? 1 : 0)) *
                    256 +
                halo) *
            256 +
        blur;
    if (code == sprite.cellsKey && sprite.cellsGeneration == pages.generation) {
      return;
    }
    final key = (
      size: size,
      weight: look.weight,
      italic: look.italic,
      halo: halo,
      blur: blur,
      sixteenths: 0,
      phase: 0,
    );
    final g = sprite.shaped.glyphs;
    final n = g.length ~/ 5;
    if (sprite.cells.length != n) {
      sprite
        ..cells = List<GlyphCell?>.filled(n, null)
        ..cellEms = Float64List(n);
    }
    var complete = true;
    for (var i = 0; i < n; i++) {
      final cell = pages.cell(key, g[i * 5].toInt(), g[i * 5 + 1].toInt());
      if (cell == null) {
        sprite.cells[i] = null;
        complete = false;
        continue;
      }
      final page = pages.found;
      sprite.cells[i] = cell;
      sprite.cellEms[i] = page.em;
      if (page.key != key) complete = false;
    }
    sprite
      ..cellsKey = complete ? code : -1
      ..cellsGeneration = pages.generation;
  }

  void _glyphs(LabelState st, GlyphSprite sprite, double devicePixelRatio) {
    final pages = glyphs!;
    _view.project(st.worldX, st.worldY);
    final sx = _view.x + st.dx, sy = _view.y + st.dy;
    final em = sprite.fontSize * st.scale;
    _resolve(sprite, em, devicePixelRatio);
    final cells = sprite.cells, ems = sprite.cellEms;
    final turn = _turnOf(st);
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
      final cell = cells[i ~/ 5];
      if (cell == null) continue;
      final k = em / ems[i ~/ 5];
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

  /// Glyph range text drawn upright from cells made at its exact size and
  /// for the eighth pixel each glyph falls on, so every glyph is sampled
  /// once at the place MapLibre puts it.
  void _rangeGlyphs(
    LabelState st,
    RangeSprite sprite,
    double devicePixelRatio,
  ) {
    final pages = glyphs!;
    final look = sprite.look;
    _view.project(st.worldX, st.worldY);
    final em = sprite.fontSize * st.scale;
    final x = _view.x + st.dx - sprite.shaped.width * em / 2;
    final y = _view.y + st.dy - sprite.shaped.height * em / 2;
    final ink = _faded(look.color, st.opacity);
    final halo = look.halo == null ? null : _faded(look.halo!, st.opacity);
    final haloWidth = look.halo == null ? 0.0 : look.haloWidth;
    final sixteenths = (em * devicePixelRatio * 16).round();
    final haloQuarters = (haloWidth * devicePixelRatio * 4).round();
    final blur = haloWidth == 0
        ? 0
        : (look.haloBlur * devicePixelRatio * 4).round();
    final k = 1 / devicePixelRatio;
    final keys = List<PageKey>.generate(
      64,
      (phase) => (
        size: 0,
        weight: 400,
        italic: false,
        halo: haloQuarters,
        blur: blur,
        sixteenths: sixteenths,
        phase: phase,
      ),
    );
    final g = sprite.shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      final dx = (x + g[i + 2] * em) * devicePixelRatio;
      final dy = (y + g[i + 3] * em) * devicePixelRatio;
      var qx = ((dx - dx.floorToDouble()) * 8).round();
      var qy = ((dy - dy.floorToDouble()) * 8).round();
      final ox = dx.floorToDouble() + (qx == 8 ? 1 : 0);
      final oy = dy.floorToDouble() + (qy == 8 ? 1 : 0);
      qx %= 8;
      qy %= 8;
      final cell = pages.cell(
        keys[qx | qy << 3],
        g[i].toInt(),
        g[i + 1].toInt(),
      );
      if (cell == null) continue;
      pages.add(
        cell,
        (ox + qx / 8) * k,
        (oy + qy / 8) * k,
        0,
        k * sixteenths / 16 / pages.found.em,
        ink,
        halo,
      );
    }
  }

  /// The angle [st]'s text is drawn at. A straight road name on a tilted
  /// map is turned to its road every frame: its angle on the screen moves
  /// with the camera, and the one placement found goes stale between
  /// placements, so the name would lag and jump while the map turns.
  double _turnOf(LabelState st) {
    final c = st.candidate;
    if (_view.tilted == null ||
        st.curve != null ||
        c is! TileLabel ||
        c.tile.line == null) {
      return st.screenAngle;
    }
    return _view.uprightAngle(
      st.worldX,
      st.worldY,
      st.angle,
      keep: st.keepUpright,
    );
  }

  final Float64List _along = Float64List(3);
  void _glyphsBent(LabelState st, GlyphSprite sprite, double devicePixelRatio) {
    final pages = glyphs!;
    final em = sprite.fontSize * st.scale;
    _resolve(sprite, em, devicePixelRatio);
    final cells = sprite.cells, ems = sprite.cellEms;
    final shaped = sprite.shaped;
    final path = st.curve!;
    final (onScreen, middle) = _view.onScreen(path, st.curveMid);
    final flip =
        st.keepUpright &&
        math.cos(_view.screenAngle(st.worldX, st.worldY, st.angle)) < 0;
    final half = shaped.width * em / 2;
    final top = -shaped.height * em / 2;
    final ink = _faded(sprite.look.color, st.opacity);
    final halo = sprite.look.halo == null
        ? null
        : _faded(sprite.look.halo!, st.opacity);
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      final cell = cells[i ~/ 5];
      if (cell == null) continue;
      final k = em / ems[i ~/ 5];
      final advance = g[i + 4] * em;
      var mid = g[i + 2] * em + advance / 2 - half;
      if (flip) mid = -mid;
      final reach = math.max(advance / 2, 1.0);
      pointAlong(onScreen, middle + mid - reach, _along);
      final ax = _along[0], ay = _along[1];
      pointAlong(onScreen, middle + mid + reach, _along);
      final bx = _along[0], by = _along[1];
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

  /// Draws [st]'s glyphs lying on the ground of the tilted map, as MapLibre
  /// draws text pitched with the map: laid out along its road on the
  /// ground, its size there its size on the screen times half its anchor's
  /// distance ratio and a half, and each glyph projected corner by corner.
  void _glyphsGround(
    LabelState st,
    GlyphSprite sprite,
    double devicePixelRatio,
  ) {
    final pages = glyphs!;
    final em = sprite.fontSize * st.scale;
    _resolve(sprite, em, devicePixelRatio);
    final cells = sprite.cells, ems = sprite.cellEms;
    final shaped = sprite.shaped;
    _view.project(st.worldX, st.worldY);
    final depth = _view.depth;
    final flip =
        st.keepUpright &&
        math.cos(_view.screenAngle(st.worldX, st.worldY, st.angle)) < 0;
    final unit =
        em / math.max(st.perspective, 1e-6) * (0.5 + 0.5 * depth) / _view.world;
    final half = shaped.width * unit / 2;
    final Float64List path;
    final double middle;
    if (st.curve case final curve?) {
      path = curve;
      middle = st.curveMid;
    } else {
      final dx = math.cos(st.angle) * half * 2,
          dy = math.sin(st.angle) * half * 2;
      path = Float64List.fromList([
        st.worldX - dx,
        st.worldY - dy,
        st.worldX + dx,
        st.worldY + dy,
      ]);
      middle = half * 2;
    }
    final ink = _faded(sprite.look.color, st.opacity);
    final halo = sprite.look.halo == null
        ? null
        : _faded(sprite.look.halo!, st.opacity);
    final g = shaped.glyphs;
    for (var i = 0; i < g.length; i += 5) {
      final cell = cells[i ~/ 5];
      if (cell == null) continue;
      final advance = g[i + 4] * unit;
      var along = g[i + 2] * unit + advance / 2 - half;
      if (flip) along = -along;
      pointAlong(path, middle + along, _along);
      var angle = _along[2];
      if (flip) angle += math.pi;
      final tx = math.cos(angle), ty = math.sin(angle);
      final nx = -ty, ny = tx;
      final down = (g[i + 3] - shaped.height / 2) * unit;
      final px = _along[0] - tx * advance / 2 + nx * down;
      final py = _along[1] - ty * advance / 2 + ny * down;
      _view.project(px, py);
      final ox = _view.x, oy = _view.y;
      final cellUnit = unit / ems[i ~/ 5];
      _view.project(px + tx * cellUnit, py + ty * cellUnit);
      final ax = _view.x - ox, ay = _view.y - oy;
      _view.project(px + nx * cellUnit, py + ny * cellUnit);
      final bx = _view.x - ox, by = _view.y - oy;
      pages.addQuad(cell, ox + st.dx, oy + st.dy, ax, ay, bx, by, ink, halo);
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
    final turn = _turnOf(st);
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
    final turn = _turnOf(st);
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
    // smoothstep's slope at the edge in MapLibre's symbol_sdf shader,
    // 0.75 over a gamma of 0.105 per screen pixel of field.
    final crisp = (0.75 / 0.105 * scale).clamp(2.0, 24.0);
    final gain = fade > 0 ? math.min(crisp, 1 / fade) : crisp;
    return ui.ColorFilter.matrix([
      0, 0, 0, 0, tint.r * 255, //
      0, 0, 0, 0, tint.g * 255,
      0, 0, 0, 0, tint.b * 255,
      0, 0, 0, gain * tint.a, (0.5 - edge * gain) * 255 * tint.a,
    ]);
  }
}
