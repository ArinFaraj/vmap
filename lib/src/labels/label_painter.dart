import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../style/expr.dart';
import 'glyphs/glyph_layout.dart';
import 'glyphs/glyph_pages.dart';
import 'glyphs/glyph_pbf.dart' show GlyphPbf;
import 'glyphs/glyph_raster.dart' show PageKey;
import 'icon_stretch.dart';
import 'label_path.dart';
import 'label_rules.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_view.dart';
import '../style/pins.dart';
import 'road_labels.dart';
import 'sdf_text.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../tiles/tile_builder.dart' show BuiltLabel;

/// Draws placed labels: pins, icons, and text straight or bent along roads.
class LabelPainter {
  LabelPainter(this._view, this._roads);

  final LabelView _view;
  final RoadLabels _roads;

  /// Where glyph text is drawn from, once vmap's fonts are loaded.
  GlyphPages? glyphs;

  /// Draws text from a style's glyph ranges as distance fields for the
  /// frame being drawn, when the renderer can.
  SdfText? sdfText;

  LabelRules rules = LabelRules.vmap;

  /// The map is zooming, when MapLibre samples icons smoothly.
  bool moving = false;

  /// The camera stands where it stood the frame before. Only then do
  /// labels sit on whole device pixels to stay crisp: on a moving map a
  /// label held to the pixels steps while the map under it glides.
  bool still = true;

  /// The style's sprite images, which formatted labels show inline.
  SpriteSheet? images;
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
        _onPixel(px, devicePixelRatio),
        _onPixel(py, devicePixelRatio),
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
    if (st.iconOnGround && _view.tilted != null) {
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
        (_view.tilted?.pitch ?? 0) == 0 &&
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
        (_view.tilted?.pitch ?? 0) == 0 &&
        st.iconScale == 1 &&
        !(symbol?.iconSizeByFeature ?? false) &&
        icon.pixelRatio == devicePixelRatio;
    if (sdfText case final gpu?
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
    final onGround = st.iconOnGround && _view.tilted != null;
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
      } else if (turn == 0 && rules.snapIcons && still) {
        final dx = _onPixel(ix, devicePixelRatio);
        final dy = _onPixel(iy, devicePixelRatio);
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
    if (sdfText case final sdf? when sprite is RangeSprite) {
      _sdfText(sdf, st, sprite, canvas);
      return;
    }
    switch (sprite) {
      case GlyphSprite() when st.onGround && _view.tilted != null:
        _glyphsGround(st, sprite, devicePixelRatio);
      case RangeSprite() when st.curve == null && _turnOf(st) == 0:
        _rangeGlyphs(st, sprite, devicePixelRatio, canvas: canvas);
      case RangeSprite() when st.curve == null && _quarters(_turnOf(st)) > 0:
        _rangeGlyphs(
          st,
          sprite,
          devicePixelRatio,
          quarters: _quarters(_turnOf(st)),
        );
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
    OffsetLine? lifted;
    if (st.roadLift != 0) {
      final (screen, middle) = _view.onScreen(st.curve!, st.curveMid);
      lifted = offsetPath(screen, middle, st.roadLift);
    }
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
      final double a, px, py;
      if (lifted != null) {
        // As the glyph path lays a moved name: along a moved copy of the
        // road on the screen, as placement weighed it.
        lifted.at((i + 0.5 - n / 2) * textW / n, _along);
        a = _along[2] + (flip ? math.pi : 0);
        px = _along[0];
        py = _along[1];
      } else {
        a =
            _view.screenAngle(
              strips[i * 3],
              strips[i * 3 + 1],
              strips[i * 3 + 2],
            ) +
            (flip ? math.pi : 0);
        _view.project(strips[i * 3], strips[i * 3 + 1]);
        px = _view.x;
        py = _view.y;
      }
      final left = j == 0 ? 0.0 : pad + j * slice - 0.5;
      final right = j == n - 1 ? pixelW : pad + (j + 1) * slice + 0.5;
      final anchorX = pad + (j + 0.5) * slice - left;
      final anchorY = pixelH / 2;
      final scos = math.cos(a) * k;
      final ssin = math.sin(a) * k;
      transforms[j * 4] = scos;
      transforms[j * 4 + 1] = ssin;
      transforms[j * 4 + 2] = px + st.dx - scos * anchorX + ssin * anchorY;
      transforms[j * 4 + 3] = py + st.dy - ssin * anchorX - scos * anchorY;
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
      ox = _onPixel(sx + left, devicePixelRatio) - left;
      oy = _onPixel(sy + top, devicePixelRatio) - top;
    }
    final ink = _faded(sprite.look.color, st.opacity);
    final halo = sprite.look.halo == null
        ? null
        : _faded(sprite.look.halo!, st.opacity);
    final g = shaped.glyphs;
    final scales = shaped.scales, colors = shaped.colors;
    for (var i = 0; i < g.length; i += 5) {
      final cell = cells[i ~/ 5];
      if (cell == null) continue;
      final own = colors?[i ~/ 5] ?? 0;
      final k = em / ems[i ~/ 5] * (scales?[i ~/ 5] ?? 1);
      final lx = left + g[i + 2] * em, ly = top + g[i + 3] * em;
      pages.add(
        cell,
        ox + c * lx - s * ly,
        oy + s * lx + c * ly,
        turn,
        k,
        own == 0 ? ink : _faded(own, st.opacity),
        halo,
      );
    }
  }

  /// Glyph range text drawn upright from cells made at its exact size and
  /// for the eighth pixel each glyph falls on, so every glyph is sampled
  /// once at the place MapLibre puts it.
  ///
  /// Turned [quarters] quarter turns about its middle, which lays the
  /// pixel grid on itself: a pixel at S samples the glyph at A + Rᵀ(S - A),
  /// A the middle, a whole grid moved by the part of A - RᵀA. Each glyph
  /// takes the cell drawn upright for that phase, turned, so it samples
  /// the field where MapLibre samples the turned glyph.
  void _rangeGlyphs(
    LabelState st,
    RangeSprite sprite,
    double devicePixelRatio, {
    int quarters = 0,
    ui.Canvas? canvas,
  }) {
    final pages = glyphs!;
    final look = sprite.look;
    _view.project(st.worldX, st.worldY);
    final em = sprite.fontSize * st.scale;
    final midX = _view.x + st.dx, midY = _view.y + st.dy;
    final x = midX - sprite.shaped.width * em / 2;
    final y = midY - sprite.shaped.height * em / 2;
    final (cos, sin) = switch (quarters) {
      1 => (0.0, 1.0),
      2 => (-1.0, 0.0),
      3 => (0.0, -1.0),
      _ => (1.0, 0.0),
    };
    final ax = midX * devicePixelRatio, ay = midY * devicePixelRatio;
    final cx = ax - (ax * cos + ay * sin), cy = ay - (-ax * sin + ay * cos);
    final partX = cx - cx.floorToDouble(), partY = cy - cy.floorToDouble();
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
    final scales = sprite.shaped.scales, colors = sprite.shaped.colors;
    final turns = sprite.shaped.turns;
    for (var i = 0; i < g.length; i += 5) {
      if (g[i] < 0) {
        if (quarters == 0 && canvas != null) {
          _inlineImage(canvas, sprite, g, i, scales![i ~/ 5], x, y, em, st);
        }
        continue;
      }
      // A run of a formatted label: its own size and colour.
      final scale = scales?[i ~/ 5] ?? 1;
      final own = colors?[i ~/ 5] ?? 0;
      final size = scale == 1
          ? sixteenths
          : (em * scale * devicePixelRatio * 16).round();
      final dx = (x + g[i + 2] * em) * devicePixelRatio - partX;
      final dy = (y + g[i + 3] * em) * devicePixelRatio - partY;
      var qx = ((dx - dx.floorToDouble()) * 8).round();
      var qy = ((dy - dy.floorToDouble()) * 8).round();
      final ox = dx.floorToDouble() + (qx == 8 ? 1 : 0);
      final oy = dy.floorToDouble() + (qy == 8 ? 1 : 0);
      qx %= 8;
      qy %= 8;
      final key = keys[qx | qy << 3];
      final cell = pages.cell(
        size == sixteenths
            ? key
            : (
                size: 0,
                weight: 400,
                italic: false,
                halo: haloQuarters,
                blur: blur,
                sixteenths: size,
                phase: key.phase,
              ),
        g[i].toInt(),
        g[i + 1].toInt(),
      );
      if (cell == null) continue;
      final ux = ox + qx / 8 + partX - ax, uy = oy + qy / 8 + partY - ay;
      pages.add(
        cell,
        (ax + ux * cos - uy * sin) * k,
        (ay + ux * sin + uy * cos) * k,
        (quarters + (turns?[i ~/ 5] ?? 0)) * math.pi / 2,
        k * size / 16 / pages.found.em,
        own == 0 ? ink : _faded(own, st.opacity),
        halo,
      );
    }
  }

  /// The image run of a formatted label at glyph [i] of [g], from a label
  /// whose box starts at [x], [y], [em] logical pixels an em: placed as
  /// MapLibre's getGlyphQuads places an image, a pixel of it in from its
  /// origin and three down, [perPixel] shaping units a pixel of it.
  void _inlineImage(
    ui.Canvas canvas,
    RangeSprite sprite,
    Float32List g,
    int i,
    double perPixel,
    double x,
    double y,
    double em,
    LabelState st,
  ) {
    final spec = sprite.look.format?[g[i + 1].toInt()];
    final sheet = images;
    if (spec is! List || spec[4] is! String || sheet == null) return;
    final image = sheet.entries[spec[4]];
    if (image == null) return;
    final unit = em / GlyphPbf.em * perPixel;
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    canvas.drawImageRect(
      sheet.image,
      image.source,
      ui.Rect.fromLTWH(
        x + g[i + 2] * em + unit,
        y + g[i + 3] * em + 3 * unit,
        image.width * unit,
        image.height * unit,
      ),
      _imagePaint,
    );
  }

  /// The image run of a formatted label at glyph [i] of [g] on the GPU,
  /// its top left corner at [ox], [oy] and one of its pixels across the
  /// screen by [ux], [uy] and down it by [vx], [vy], as [_inlineImage]
  /// places one.
  void _gpuInlineImage(
    SdfText sdf,
    RangeSprite sprite,
    Float32List g,
    int i,
    double ox,
    double oy,
    double ux,
    double uy,
    double vx,
    double vy,
    LabelState st,
  ) {
    final spec = sprite.look.format?[g[i + 1].toInt()];
    final sheet = images;
    if (spec is! List || spec[4] is! String || sheet == null) return;
    final image = sheet.entries[spec[4]];
    if (image == null) return;
    final k = image.width / image.source.width;
    sdf.icon(
      image.source,
      image.source,
      ox,
      oy,
      ux * k,
      uy * k,
      vx * k,
      vy * k,
      sdf: false,
      linear: true,
      look: SdfLook(
        Float32List.fromList([st.opacity, st.opacity, st.opacity, st.opacity]),
        null,
        0,
        0,
        1,
      ),
      layer: switch (st.candidate) {
        TileLabel(:final tile) => tile.layer,
        _ => -1,
      },
    );
  }

  /// [_gpuInlineImage] for a label turned by [c], [s] about [cx], [cy],
  /// the image's box corner at [lx], [ly] from there.
  void _turnedInlineImage(
    SdfText sdf,
    RangeSprite sprite,
    Float32List g,
    int i,
    double cx,
    double cy,
    double lx,
    double ly,
    double c,
    double s,
    double em,
    LabelState st,
  ) {
    final unit = em / GlyphPbf.em * (sprite.shaped.scales?[i ~/ 5] ?? 1);
    final x = lx + unit, y = ly + 3 * unit;
    _gpuInlineImage(
      sdf,
      sprite,
      g,
      i,
      cx + c * x - s * y,
      cy + s * x + c * y,
      c * unit,
      s * unit,
      -s * unit,
      c * unit,
      st,
    );
  }

  /// How many quarter turns [turn] is, 1 to 3, or 0 when it is none of
  /// them.
  static int _quarters(double turn) {
    final q = turn % (2 * math.pi) / (math.pi / 2);
    final whole = q.round();
    return (q - whole).abs() < 1e-6 && whole % 4 != 0 ? whole % 4 : 0;
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
    final line = _onScreenOffset(st, sprite, path, em);
    final lift = _lift(sprite);
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
      line.at(mid - reach, _along);
      final ax = _along[0], ay = _along[1];
      line.at(mid + reach, _along);
      final bx = _along[0], by = _along[1];
      var angle = math.atan2(by - ay, bx - ax);
      if (flip) angle += math.pi;
      final c = math.cos(angle), s = math.sin(angle);
      final cx = (ax + bx) / 2 + st.dx, cy = (ay + by) / 2 + st.dy;
      final lx = -advance / 2, ly = top + (g[i + 3] - lift) * em;
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
        em /
        math.max(st.perspective, 1e-6) *
        (0.5 + 0.5 * depth) /
        _view.world *
        _view.groundScale(st.worldY);
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
    final lift = _lift(sprite);
    final line = offsetPath(path, middle, lift * unit);
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
      line.at(along, _along);
      var angle = _along[2];
      if (flip) angle += math.pi;
      final tx = math.cos(angle), ty = math.sin(angle);
      final nx = -ty, ny = tx;
      final down = (g[i + 3] - lift - shaped.height / 2) * unit;
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

  /// Queues [st]'s glyphs as distance fields, each placed as MapLibre's
  /// getGlyphQuads places it: upright or turned, along a bend, or laid on
  /// the ground of a tilted map.
  void _sdfText(
    SdfText sdf,
    LabelState st,
    RangeSprite sprite,
    ui.Canvas canvas,
  ) {
    final look = sprite.look;
    final em = sprite.fontSize * st.scale;
    final shaped = sprite.shaped;
    final g = shaped.glyphs;
    final scales = shaped.scales, turns = shaped.turns, colors = shaped.colors;
    final layer = switch (st.candidate) {
      TileLabel(:final tile) => tile.layer,
      _ => -1,
    };
    // As MapLibre's text-rotation-alignment viewport-glyph: along the line,
    // each glyph upright on the screen.
    final upright = st.glyphsUpright;
    final haloColor = look.halo;
    final halo = haloColor == null || look.haloWidth <= 0
        ? null
        : SdfLook.rgba(haloColor, st.opacity);
    final overlap = look.haloWidth > 1 || look.letterSpacing < 0;
    final plain = SdfLook.rgba(look.color, st.opacity);
    SdfLook lookOf(int i, double fontScale, double gammaScale) {
      final own = colors?[i ~/ 5] ?? 0;
      return SdfLook(
        own == 0 ? plain : SdfLook.rgba(own, st.opacity),
        halo,
        look.haloWidth,
        look.haloBlur,
        fontScale,
        gammaScale: gammaScale,
        overlap: overlap,
      );
    }

    if (st.onGround && _view.tilted != null) {
      _view.project(st.worldX, st.worldY);
      final depth = _view.depth;
      final flip =
          st.keepUpright &&
          math.cos(_view.screenAngle(st.worldX, st.worldY, st.angle)) < 0;
      final size =
          em /
          math.max(st.perspective, 1e-6) *
          (0.5 + 0.5 * depth) *
          _view.groundScale(st.worldY);
      final unit = size / _view.world;
      final half = shaped.width * unit / 2;
      final Float64List path;
      final double middle;
      if (st.curve case final curve?) {
        path = curve;
        middle = st.curveMid;
      } else {
        final dx = math.cos(st.angle) * half * 2;
        final dy = math.sin(st.angle) * half * 2;
        path = Float64List.fromList([
          st.worldX - dx,
          st.worldY - dy,
          st.worldX + dx,
          st.worldY + dy,
        ]);
        middle = half * 2;
      }
      final lift = _lift(sprite);
      final line = offsetPath(path, middle, lift * unit);
      // As MapLibre's u_gamma_scale for text laid on the map: the clip w
      // over the cosine of the pitch, which softens tilted text's edges.
      final soften =
          depth / math.cos((_view.tilted?.pitch ?? 0) * math.pi / 180);
      final look0 = lookOf(0, size / GlyphPbf.em, soften);
      for (var i = 0; i < g.length; i += 5) {
        final advance = g[i + 4] * unit;
        var along = g[i + 2] * unit + advance / 2 - half;
        if (flip) along = -along;
        line.at(along, _along);
        var angle = _along[2];
        if (flip) angle += math.pi;
        final tx = math.cos(angle), ty = math.sin(angle);
        final nx = -ty, ny = tx;
        final down = (g[i + 3] - lift - shaped.height / 2) * unit;
        final px = _along[0] - tx * advance / 2 + nx * down;
        final py = _along[1] - ty * advance / 2 + ny * down;
        final gu = unit * (scales?[i ~/ 5] ?? 1) / GlyphPbf.em;
        if (g[i] < 0) {
          // As _inlineImage: a pixel in from the box's corner, three down.
          final qx = px + tx * gu + nx * 3 * gu;
          final qy = py + ty * gu + ny * 3 * gu;
          _view.project(qx, qy);
          final ox = _view.x, oy = _view.y;
          _view.project(qx + tx * gu, qy + ty * gu);
          final ux = _view.x - ox, uy = _view.y - oy;
          _view.project(qx + nx * gu, qy + ny * gu);
          final vx = _view.x - ox, vy = _view.y - oy;
          _gpuInlineImage(
            sdf,
            sprite,
            g,
            i,
            ox + st.dx,
            oy + st.dy,
            ux,
            uy,
            vx,
            vy,
            st,
          );
          continue;
        }
        _view.project(px, py);
        final ox = _view.x, oy = _view.y;
        _view.project(px + tx * gu, py + ty * gu);
        final ax = _view.x - ox, ay = _view.y - oy;
        _view.project(px + nx * gu, py + ny * gu);
        final bx = _view.x - ox, by = _view.y - oy;
        sdf.glyph(
          g[i].toInt(),
          g[i + 1].toInt(),
          ox + st.dx,
          oy + st.dy,
          ax,
          ay,
          bx,
          by,
          colors == null ? look0 : lookOf(i, size / GlyphPbf.em, soften),
          layer,
        );
      }
      return;
    }

    final flat = lookOf(0, em / GlyphPbf.em, 1);
    void put(int i, double ox, double oy, double c, double s) {
      final u = em * (scales?[i ~/ 5] ?? 1) / GlyphPbf.em;
      var ax = c * u, ay = s * u, bx = -s * u, by = c * u;
      // A glyph lying on its side in vertical text turns a quarter more.
      if ((turns?[i ~/ 5] ?? 0) == 1) (ax, ay, bx, by) = (bx, by, -ax, -ay);
      sdf.glyph(
        g[i].toInt(),
        g[i + 1].toInt(),
        ox,
        oy,
        ax,
        ay,
        bx,
        by,
        colors == null ? flat : lookOf(i, em / GlyphPbf.em, 1),
        layer,
      );
    }

    if (st.curve case final path?) {
      final line = _onScreenOffset(st, sprite, path, em);
      final lift = _lift(sprite);
      final flip =
          st.keepUpright &&
          math.cos(_view.screenAngle(st.worldX, st.worldY, st.angle)) < 0;
      final half = shaped.width * em / 2;
      final top = -shaped.height * em / 2;
      for (var i = 0; i < g.length; i += 5) {
        final advance = g[i + 4] * em;
        var mid = g[i + 2] * em + advance / 2 - half;
        if (flip) mid = -mid;
        final reach = math.max(advance / 2, 1.0);
        line.at(mid - reach, _along);
        final x0 = _along[0], y0 = _along[1];
        line.at(mid + reach, _along);
        final x1 = _along[0], y1 = _along[1];
        var angle = math.atan2(y1 - y0, x1 - x0);
        if (flip) angle += math.pi;
        final c = math.cos(angle), s = math.sin(angle);
        final cx = (x0 + x1) / 2 + st.dx, cy = (y0 + y1) / 2 + st.dy;
        final lx = -advance / 2, ly = top + (g[i + 3] - lift) * em;
        if (g[i] < 0) {
          _turnedInlineImage(sdf, sprite, g, i, cx, cy, lx, ly, c, s, em, st);
          continue;
        }
        if (upright) {
          put(i, cx + lx, cy + ly, 1, 0);
        } else {
          put(i, cx + c * lx - s * ly, cy + s * lx + c * ly, c, s);
        }
      }
      return;
    }

    _view.project(st.worldX, st.worldY);
    final mx = _view.x + st.dx, my = _view.y + st.dy;
    final turn = _turnOf(st);
    final c = math.cos(turn), s = math.sin(turn);
    final left = -shaped.width * em / 2, top = -shaped.height * em / 2;
    for (var i = 0; i < g.length; i += 5) {
      final lx = left + g[i + 2] * em, ly = top + g[i + 3] * em;
      if (upright && g[i] >= 0) {
        // Each glyph's middle where the turned name puts it, the glyph
        // itself upright about it.
        final half = g[i + 4] * em / 2;
        put(i, mx + c * (lx + half) - half, my + s * (lx + half) + ly, 1, 0);
        continue;
      }
      if (g[i] < 0) {
        // An image in a formatted label is drawn from the sprite sheet.
        if (turn == 0) {
          _inlineImage(
            canvas,
            sprite,
            g,
            i,
            scales![i ~/ 5],
            mx + left,
            my + top,
            em,
            st,
          );
        } else {
          _turnedInlineImage(sdf, sprite, g, i, mx, my, lx, ly, c, s, em, st);
        }
        continue;
      }
      put(i, mx + c * lx - s * ly, my + s * lx + c * ly, c, s);
    }
  }

  /// A name along a line's `text-offset` across the line, in ems.
  static double _lift(GlyphSprite sprite) => sprite.look.lineShift?.$4 ?? 0;

  /// [path] on the screen, moved across by [st]'s `text-offset`, and where
  /// its middle lands along it.
  OffsetLine _onScreenOffset(
    LabelState st,
    GlyphSprite sprite,
    Float64List path,
    double em,
  ) {
    final (onScreen, middle) = _view.onScreen(path, st.curveMid);
    return offsetPath(onScreen, middle, _lift(sprite) * em);
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

  /// [at] moved to the nearest device pixel while the map is [still].
  double _onPixel(double at, double devicePixelRatio) =>
      still ? (at * devicePixelRatio).roundToDouble() / devicePixelRatio : at;

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
        _onPixel(sx - w / 2, devicePixelRatio),
        _onPixel(sy - h / 2, devicePixelRatio),
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
          _onPixel(sx - w / 2, devicePixelRatio),
          _onPixel(sy - h / 2, devicePixelRatio),
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

  void paintCollisionBoxes(
    ui.Canvas canvas,
    List<double> boxes,
    double devicePixelRatio,
  ) {
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
