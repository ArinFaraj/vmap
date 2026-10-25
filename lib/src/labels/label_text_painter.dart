import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../text/glyphs/glyph_layout.dart';
import '../text/glyphs/glyph_pages.dart';
import '../text/glyphs/glyph_pbf.dart' show GlyphPbf;
import '../text/glyphs/glyph_raster.dart' show PageKey;
import 'label_path.dart';
import 'label_sprites.dart';
import 'label_style.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'glyph_geometry.dart';
import 'road_labels.dart';
import 'sdf_text.dart';

/// Draws placed labels' text: glyphs straight, turned, bent along roads
/// or laid on the ground, as distance fields when the renderer can, and
/// images and recordings of text drawn ahead of time.
class LabelTextPainter {
  LabelTextPainter(this._view, this._roads, this._style)
    : _geometry = GlyphGeometry(_view);

  final GlyphGeometry _geometry;
  final Float64List _along = Float64List(3);

  final LabelView _view;
  final RoadLabels _roads;
  final LabelStyle _style;

  /// Where glyph text is drawn from, once vmap's fonts are loaded.
  GlyphPages? glyphs;

  final ui.Paint _imagePaint = ui.Paint()
    ..filterQuality = ui.FilterQuality.medium;

  /// Draws a label's text: an image cut into strips along a bent road, a
  /// recording played back, or an image. A road's name is always an image,
  /// so only an image follows a bend.
  void paintText(ui.Canvas canvas, LabelState st, LabelSprite sprite) {
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    if (_view.sdf case final sdf? when sprite is RangeSprite) {
      _sdfText(sdf, st, sprite, canvas);
      return;
    }
    switch (sprite) {
      case GlyphSprite() when st.onGround:
        _glyphsGround(st, sprite);
      case RangeSprite() when st.curve == null && _geometry.turnOf(st) == 0:
        _rangeGlyphs(st, sprite, canvas: canvas);
      case RangeSprite()
          when st.curve == null && _quarters(_geometry.turnOf(st)) > 0:
        _rangeGlyphs(st, sprite, quarters: _quarters(_geometry.turnOf(st)));
      case GlyphSprite() when st.curve != null:
        _glyphsBent(st, sprite);
      case GlyphSprite():
        _glyphs(st, sprite);
      case ImageSprite() when st.curve != null:
        _drawBent(canvas, st, sprite);
      case PictureSprite():
        _drawRecording(canvas, st, sprite);
      case ImageSprite():
        _drawImage(canvas, st, sprite);
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
    final flip = _geometry.flipped(st);
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

  /// Fills [sprite]'s cells for its size now, from its cache when the look
  /// and the pages are unchanged, so a steady frame allocates nothing.
  void _resolve(GlyphSprite sprite, double em) {
    final devicePixelRatio = _view.devicePixelRatio;
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

  void _glyphs(LabelState st, GlyphSprite sprite) {
    final pages = glyphs!;
    _view.project(st.worldX, st.worldY);
    final sx = _view.x + st.dx, sy = _view.y + st.dy;
    final em = sprite.fontSize * st.scale;
    _resolve(sprite, em);
    final cells = sprite.cells, ems = sprite.cellEms;
    final turn = _geometry.turnOf(st);
    final c = math.cos(turn), s = math.sin(turn);
    final shaped = sprite.shaped;
    final left = -shaped.width * em / 2, top = -shaped.height * em / 2;
    var ox = sx, oy = sy;
    if (turn == 0) {
      ox = _view.onPixel(sx + left) - left;
      oy = _view.onPixel(sy + top) - top;
    }
    final (ink, halo) = _inks(sprite.look, st.opacity);
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
    RangeSprite sprite, {
    int quarters = 0,
    ui.Canvas? canvas,
  }) {
    final devicePixelRatio = _view.devicePixelRatio;
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
    final (ink, halo) = _inks(look, st.opacity);
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

  void _glyphsBent(LabelState st, GlyphSprite sprite) {
    final pages = glyphs!;
    final em = sprite.fontSize * st.scale;
    _resolve(sprite, em);
    final cells = sprite.cells, ems = sprite.cellEms;
    final (ink, halo) = _inks(sprite.look, st.opacity);
    _geometry.eachBent(st, sprite, em, (i, cx, cy, c, s, lx, ly) {
      final cell = cells[i ~/ 5];
      if (cell == null) return;
      pages.add(
        cell,
        cx + c * lx - s * ly,
        cy + s * lx + c * ly,
        math.atan2(s, c),
        em / ems[i ~/ 5],
        ink,
        halo,
      );
    });
  }

  /// Draws [st]'s glyphs lying on the ground of the tilted map, as MapLibre
  /// draws text pitched with the map: laid out along its road on the
  /// ground, its size there its size on the screen times half its anchor's
  /// distance ratio and a half, and each glyph projected corner by corner.
  void _glyphsGround(LabelState st, GlyphSprite sprite) {
    final pages = glyphs!;
    final em = sprite.fontSize * st.scale;
    _resolve(sprite, em);
    final cells = sprite.cells, ems = sprite.cellEms;
    final (ink, halo) = _inks(sprite.look, st.opacity);
    final (size, _) = _geometry.groundSize(st, em);
    final unit = size / _view.world;
    _geometry.eachOnGround(st, sprite, unit, (i, px, py, tx, ty, nx, ny) {
      final cell = cells[i ~/ 5];
      if (cell == null) return;
      final (ox, oy, ax, ay, bx, by) = _geometry.groundQuad(
        px,
        py,
        tx,
        ty,
        nx,
        ny,
        unit / ems[i ~/ 5],
      );
      pages.addQuad(cell, ox + st.dx, oy + st.dy, ax, ay, bx, by, ink, halo);
    });
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

    if (st.onGround) {
      final (size, depth) = _geometry.groundSize(st, em);
      final unit = size / _view.world;
      // As MapLibre's u_gamma_scale for text laid on the map: the clip w
      // over the cosine of the pitch, which softens tilted text's edges.
      final soften = depth / math.cos(_view.tilted.pitch * math.pi / 180);
      final look0 = lookOf(0, size / GlyphPbf.em, soften);
      _geometry.eachOnGround(st, sprite, unit, (i, px, py, tx, ty, nx, ny) {
        final gu = unit * (scales?[i ~/ 5] ?? 1) / GlyphPbf.em;
        if (g[i] < 0) {
          // As _inlineImage: a pixel in from the box's corner, three down.
          final (ox, oy, ux, uy, vx, vy) = _geometry.groundQuad(
            px + tx * gu + nx * 3 * gu,
            py + ty * gu + ny * 3 * gu,
            tx,
            ty,
            nx,
            ny,
            gu,
          );
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
          return;
        }
        final (ox, oy, ax, ay, bx, by) = _geometry.groundQuad(
          px,
          py,
          tx,
          ty,
          nx,
          ny,
          gu,
        );
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
      });
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

    if (st.curve != null) {
      _geometry.eachBent(st, sprite, em, (i, cx, cy, c, s, lx, ly) {
        if (g[i] < 0) {
          _turnedInlineImage(sdf, sprite, g, i, cx, cy, lx, ly, c, s, em, st);
        } else if (upright) {
          put(i, cx + lx, cy + ly, 1, 0);
        } else {
          put(i, cx + c * lx - s * ly, cy + s * lx + c * ly, c, s);
        }
      });
      return;
    }
    _view.project(st.worldX, st.worldY);
    final mx = _view.x + st.dx, my = _view.y + st.dy;
    final turn = _geometry.turnOf(st);
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
    final sheet = _style.sheet;
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
    final sheet = _style.sheet;
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

  void _drawRecording(ui.Canvas canvas, LabelState st, PictureSprite sprite) {
    final (sx, sy, w, h) = _textBox(st, sprite);
    final turn = _geometry.turnOf(st);
    canvas.save();
    if (turn == 0) {
      canvas.translate(_view.onPixel(sx - w / 2), _view.onPixel(sy - h / 2));
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

  void _drawImage(ui.Canvas canvas, LabelState st, ImageSprite sprite) {
    final (sx, sy, w, h) = _textBox(st, sprite);
    final turn = _geometry.turnOf(st);
    final source = ui.Rect.fromLTWH(0, 0, sprite.pixelW, sprite.pixelH);
    if (turn == 0) {
      canvas.drawImageRect(
        sprite.image,
        source,
        ui.Rect.fromLTWH(
          _view.onPixel(sx - w / 2),
          _view.onPixel(sy - h / 2),
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
}

int _faded(int argb, double opacity) =>
    (((argb >>> 24) * opacity).round() << 24) | (argb & 0xFFFFFF);

/// [look]'s ink and halo colours faded to [opacity].
(int, int?) _inks(TextLook look, double opacity) => (
  _faded(look.color, opacity),
  look.halo == null ? null : _faded(look.halo!, opacity),
);
