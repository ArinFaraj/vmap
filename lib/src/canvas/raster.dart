import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../style/expr.dart';
import '../gpu/map_renderer.dart' show RasterPiece;
import '../tiles/pmtiles.dart';
import '../style/raster_style.dart';
import '../style/style_model.dart';
import '../terrain/dem_tile.dart';
import '../options.dart';
import '../tiles/tile_store.dart';
import '../tiles/net.dart';
import '../platform.dart';
import '../tiles/tile_id.dart';
import '../camera/mercator.dart';
import '../camera/view.dart';

class _RasterTile {
  ui.Image? image;
  int usedFrame = 0;
  int failedAtMs = -1;
  int failures = 0;
  bool loading = false;

  /// When the tile was first drawn with its own picture, on its layer's
  /// clock, which it fades in from.
  int? shownAtMs;

  /// Whether the tile failed too lately to load again: five seconds after
  /// the first failure, twice as long after each one more, up to about five
  /// minutes.
  bool resting(int nowMs) =>
      failedAtMs >= 0 && nowMs - failedAtMs < 5000 << math.min(failures - 1, 6);

  /// The server has no such tile, which a sparse source leaves out: the
  /// tile above it is drawn in its place.
  bool missing = false;

  /// The server answered with nothing, a tile with nothing to draw.
  bool empty = false;

  /// A tile of heights as it was downloaded, kept until it has been shaded
  /// with all four tiles around it.
  Uint8List? pixels;
  int width = 0;
  int height = 0;

  /// The two rows or columns of heights along the top, bottom, left and
  /// right edge, which the tiles around this one shade their own edge with.
  List<Uint8List>? edges;
  bool shading = false;
  bool shadeAgain = false;
}

/// Draws one raster layer of the style: the picture of an `image` source,
/// picture tiles, or tiles of heights shaded as a hillshade.
sealed class RasterDrawing<L extends RasterLayer> {
  RasterDrawing(
    this._layer, {
    required this.config,
    required this.onLoaded,
    required this.onError,
  });

  /// The drawing for [layer].
  static RasterDrawing<RasterLayer> of(
    RasterLayer layer, {
    required VmapNetworkOptions config,
    required void Function() onLoaded,
    void Function(Object error)? onError,
  }) => switch (layer) {
    ImageLayer() => PictureDrawing(
      layer,
      config: config,
      onLoaded: onLoaded,
      onError: onError,
    ),
    PictureTileLayer() => PictureTiles(
      layer,
      config: config,
      onLoaded: onLoaded,
      onError: onError,
    ),
    HillshadeLayer() => ShadedTiles(
      layer,
      config: config,
      onLoaded: onLoaded,
      onError: onError,
    ),
    ColorReliefLayer() => ReliefTiles(
      layer,
      config: config,
      onLoaded: onLoaded,
      onError: onError,
    ),
    TerrainLayer() => TerrainTiles(
      layer,
      config: config,
      onLoaded: onLoaded,
      onError: onError,
    ),
  };

  L _layer;
  L get layer => _layer;

  /// Takes over [next] from a restyled style. The engine keeps a drawing
  /// only for a layer with the same [RasterLayer.signature], which names
  /// the layer's kind, so [next] is an [L] whose paint alone can differ.
  void restyle(RasterLayer next) {
    assert(next.signature == _layer.signature);
    _layer = next as L;
  }

  /// How pictures are fetched and kept.
  final VmapNetworkOptions config;
  final void Function() onLoaded;
  final void Function(Object error)? onError;

  late final Net _client = Net(userAgent: config.userAgent, perHost: 4);
  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;
  bool _closed = false;

  /// The tiles the last [paint] laid down.
  final List<RasterPiece> drawn = [];

  /// Draws the layer for the view. [zoom] is the slippy-map zoom, [origin]
  /// the world pixel at the canvas origin, and [view] what a tilted screen
  /// shows. With [drape], a tiled layer only gathers its tiles into
  /// [drawn], for the GPU to lay over raised ground.
  void paint(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size, {
    MapView? view,
    bool drape = false,
  }) {
    drawn.clear();
    final styleZoom = context.zoom;
    if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) return;
    final opacity = (asNumber(layer.opacity(context)) ?? 1).clamp(0.0, 1.0);
    if (opacity <= 0) return;
    _paint.color = ui.Color.fromRGBO(255, 255, 255, opacity);
    _draw(canvas, context, zoom, origin, size, view, drape: drape);
  }

  void _draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView? view, {
    required bool drape,
  });

  void close() {
    _closed = true;
    _client.close();
  }
}

/// The one picture of an `image` source, stretched between its corners.
final class PictureDrawing extends RasterDrawing<ImageLayer> {
  PictureDrawing(
    super.layer, {
    required super.config,
    required super.onLoaded,
    required super.onError,
  }) {
    _load(layer.picture);
  }

  ui.Image? _picture;
  ui.ImageShader? _shader;

  Future<void> _load(String url) async {
    try {
      final reply = await _client.get(
        url,
        config.headers,
        timeout: const Duration(seconds: 30),
      );
      if (reply.status != 200) throw HttpFailure(reply.status, url);
      final codec = await ui.instantiateImageCodec(reply.bytes);
      final frame = await codec.getNextFrame();
      codec.dispose();
      if (_closed) return frame.image.dispose();
      _picture = frame.image;
      _shader = ui.ImageShader(
        forShader(frame.image),
        ui.TileMode.clamp,
        ui.TileMode.clamp,
        Float64List(16)
          ..[0] = 1
          ..[5] = 1
          ..[10] = 1
          ..[15] = 1,
        filterQuality: layer.nearest
            ? ui.FilterQuality.none
            : ui.FilterQuality.low,
      );
      onLoaded();
    } catch (e) {
      if (!_closed) onError?.call(e);
    }
  }

  /// Draws the picture once for every copy of the world in view. Over
  /// raised ground a north-up picture is draped; one at any other angle
  /// lies flat under the ground.
  @override
  void _draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView? view, {
    required bool drape,
  }) {
    final image = _picture;
    if (image == null) return;
    _paint
      ..isAntiAlias = true
      ..colorFilter = layer.adjust?.filter(context);
    final corners = layer.corners;
    final world = 256.0 * math.pow(2, zoom);
    final w = image.width.toDouble(), h = image.height.toDouble();
    final first = (origin.dx / world).floor() - 1;
    final last = ((origin.dx + size.width) / world).floor() + 1;
    final northUp =
        corners[1] == corners[3] &&
        corners[5] == corners[7] &&
        corners[0] == corners[6] &&
        corners[2] == corners[4];
    if (drape && northUp) {
      for (var copy = first; copy <= last; copy++) {
        drawn.add((
          image: image,
          source: ui.Rect.fromLTWH(0, 0, w, h),
          target: ui.Rect.fromLTRB(
            (corners[0] + copy) * world - origin.dx,
            corners[1] * world - origin.dy,
            (corners[2] + copy) * world - origin.dx,
            corners[5] * world - origin.dy,
          ),
          opacity: _paint.color.a,
          filter: _paint.colorFilter,
          smooth: !layer.nearestAt(context),
        ));
      }
      return;
    }
    _paint.shader = _shader;
    // Impeller leaves a colour filter on drawn vertices out, so the
    // picture's adjustments are laid on through a layer instead.
    final filter = _paint.colorFilter;
    if (filter != null) {
      canvas.saveLayer(ui.Offset.zero & size, ui.Paint()..colorFilter = filter);
      _paint.colorFilter = null;
    }
    for (var copy = first; copy <= last; copy++) {
      final at = Float64List(8);
      var left = double.infinity, right = -double.infinity;
      for (var i = 0; i < 4; i++) {
        final x = (corners[i * 2] + copy) * world - origin.dx;
        at[i * 2] = x;
        at[i * 2 + 1] = corners[i * 2 + 1] * world - origin.dy;
        left = math.min(left, x);
        right = math.max(right, x);
      }
      if (right < 0 || left > size.width) continue;
      final quad = warpedQuad(at, w, h);
      canvas.drawVertices(quad, ui.BlendMode.srcOver, _paint);
      quad.dispose();
    }
    if (filter != null) {
      canvas.restore();
      _paint.colorFilter = filter;
    }
    _paint.shader = null;
  }

  @override
  void close() {
    super.close();
    _shader?.dispose();
    _picture?.dispose();
  }
}

/// A picture [w] by [h] laid on the quad [corners], x, y pairs from the
/// top left clockwise, as MapLibre warps an image source: as the
/// perspective view of a flat picture, blended towards a sheet pinned at
/// its corners as the quad stops looking like one. A parallelogram is two
/// triangles; any other quad is a grid fine enough that its triangles
/// follow the warp.
ui.Vertices warpedQuad(Float64List corners, double w, double h) {
  final [x0, y0, x1, y1, x2, y2, x3, y3] = corners;
  final texture = Float32List.fromList([0, 0, w, 0, w, h, 0, h]);
  if (x0 + x2 == x1 + x3 && y0 + y2 == y1 + y3) {
    return ui.Vertices.raw(
      ui.VertexMode.triangles,
      Float32List.fromList([x0, y0, x1, y1, x2, y2, x3, y3]),
      textureCoordinates: texture,
      indices: Uint16List.fromList(const [0, 1, 2, 0, 2, 3]),
    );
  }
  final (px, py, blend) = _imageWarp(corners);
  const cells = 16;
  final positions = Float32List((cells + 1) * (cells + 1) * 2);
  final coords = Float32List(positions.length);
  var o = 0;
  for (var j = 0; j <= cells; j++) {
    final fy = j / cells;
    for (var i = 0; i <= cells; i++) {
      final fx = i / cells;
      final bx = (x0 + (x1 - x0) * fx) * (1 - fy) + (x3 + (x2 - x3) * fx) * fy;
      final by = (y0 + (y1 - y0) * fx) * (1 - fy) + (y3 + (y2 - y3) * fx) * fy;
      final d = px * fx + py * fy + 1;
      final ax = x1 - x0 + px * x1, ay = y1 - y0 + px * y1;
      final dx = x3 - x0 + py * x3, dy = y3 - y0 + py * y3;
      final qx = (ax * fx + dx * fy + x0) / d;
      final qy = (ay * fx + dy * fy + y0) / d;
      positions[o] = qx + (bx - qx) * blend;
      positions[o + 1] = qy + (by - qy) * blend;
      coords[o] = fx * w;
      coords[o + 1] = fy * h;
      o += 2;
    }
  }
  final indices = Uint16List(cells * cells * 6);
  var k = 0;
  for (var j = 0; j < cells; j++) {
    for (var i = 0; i < cells; i++) {
      final a = j * (cells + 1) + i, b = a + cells + 1;
      indices.setAll(k, [a, a + 1, b + 1, a, b + 1, b]);
      k += 6;
    }
  }
  return ui.Vertices.raw(
    ui.VertexMode.triangles,
    positions,
    textureCoordinates: coords,
    indices: indices,
  );
}

/// MapLibre's `calculateImageWarp` for `auto`: the perspective terms of the
/// projective map from the unit square onto [corners], and how far it is
/// blended towards the bilinear one.
(double, double, double) _imageWarp(Float64List corners) {
  final [x0, y0, x1, y1, x2, y2, x3, y3] = corners;
  final sumX = x0 - x1 + x2 - x3, sumY = y0 - y1 + y2 - y3;
  final rightX = x1 - x2, rightY = y1 - y2, downX = x3 - x2, downY = y3 - y2;
  final determinant = rightX * downY - downX * rightY;
  final px = (sumX * downY - downX * sumY) / determinant;
  final py = (rightX * sumY - sumX * rightY) / determinant;
  final denominators = [1.0, 1 + px, 1 + px + py, 1 + py];
  final foreshortening =
      denominators.reduce(math.max) / denominators.reduce(math.min);
  const projective = 4.0, bilinear = 512.0;
  final blend = math.max(
    0.0,
    (1 - projective / foreshortening) / (1 - projective / bilinear),
  );
  if (!(foreshortening >= 1 && foreshortening <= bilinear) || blend >= 1) {
    return (0, 0, 1);
  }
  return (px, py, blend);
}

/// A layer drawn from tiles, fetched through a [TileStore].
sealed class TileDrawing<L extends TiledRasterLayer> extends RasterDrawing<L> {
  TileDrawing(
    super.layer, {
    required super.config,
    required super.onLoaded,
    required super.onError,
  }) : _maxZoom = layer.sourceMaxZoom ?? 22 {
    final TiledRasterLayer(:tiles, :tileJsonUrl, :cover) = layer;
    if (tiles != null) {
      _use(tiles, cover);
    } else if (PmTiles.handles(tileJsonUrl)) {
      _use(tileJsonUrl!, cover);
      if (layer.sourceMaxZoom == null) {
        _store!.archive!.maxZoom.then((deepest) {
          _maxZoom = deepest;
          if (!_closed) onLoaded();
        }, onError: (_) {});
      }
    } else if (tileJsonUrl != null) {
      _resolve(tileJsonUrl, cover);
    }
  }

  static const int _maxTiles = 48;
  static const int _maxLoading = 4;

  TileStore? _store;
  final Map<int, _RasterTile> _tiles = {};
  final Stopwatch _clock = Stopwatch()..start();
  String? _template;
  int _maxZoom;
  int _loading = 0;

  /// The credit the layer's TileJSON asks for, once it has been read.
  String? attribution;
  int _frame = 0;

  /// The tiles the last frame drew without a picture yet: fetching,
  /// decoding or shading, not those that failed a moment ago. A map is not
  /// settled while any is.
  int waiting = 0;

  /// How far each tile is drawn past its right and bottom edge, so no gap
  /// shows between neighbours.
  double get _lap;

  /// The cells around the edge of a tile's image that belong to the tiles
  /// beside it.
  double get _ring;

  /// Sets up [_paint] for this frame's tiles.
  void _setUpPaint(EvalContext context);

  /// Keeps a tile's decoded [image], or what it is made from.
  Future<void> _decoded(_RasterTile tile, ui.Image image, int z, int x, int y);

  Future<void> _resolve(String tileJsonUrl, TileCover cover) async {
    try {
      final reply = await _client.get(
        tileJsonUrl,
        config.headers,
        timeout: const Duration(seconds: 10),
      );
      final json = jsonDecode(utf8.decode(reply.bytes)) as Map<String, dynamic>;
      final deepest = json['maxzoom'];
      if (deepest is num) _maxZoom = deepest.toInt();
      if (json['attribution'] case final String credit) attribution = credit;
      if (tileTemplate(json['tiles']) case final template?) {
        _use(template, cover);
      }
      if (!_closed) onLoaded();
    } catch (e) {
      if (!_closed) onError?.call(e);
    }
  }

  /// The zoom of the tiles drawn at map zoom [zoom].
  int tileZoom(double zoom) =>
      (zoom + math.log(256 / layer.tileSize) / math.ln2).round().clamp(
        0,
        _maxZoom,
      );

  void _use(String template, TileCover cover) {
    _template = template;
    _store?.close();
    _store = TileStore.raster(template, cover: cover, config: config);
  }

  /// Fetches tile [z]/[x]/[y] into the cache directory unless it is there
  /// already, and returns whether it had to.
  Future<bool> keep(int z, int x, int y) async =>
      await _store?.keep(z, x, y) ?? false;

  /// The tiles in view as zoom, column and row: at zoom [z] those under
  /// the screen, or under the tilted screen when [view] is set. Over raised
  /// ground ([variable]) or past 60 degrees of pitch, as MapLibre covers
  /// them, each at the zoom its distance from the camera asks for, up to
  /// the source's deepest.
  Iterable<(int, int, int)> _inView(
    int z,
    double span,
    ui.Offset origin,
    ui.Size size,
    MapView? view, {
    bool variable = false,
  }) sync* {
    if (view != null) {
      final spread = variable || view.pitch > 60;
      // The hold takes the cover to [z] whatever the view's own zoom; spread
      // out, each tile's zoom is rounded from the source's own, as
      // MapLibre's raster tiles, tiles nearer the camera going deeper.
      for (final t in view.cover(
        maxZoom: spread ? _maxZoom : z,
        minZoom: spread ? math.min(layer.cover.minZoom, z) : z,
        hold: spread
            ? math.log(512 / layer.tileSize) / math.ln2 + 0.5
            : z + 0.5 - view.zoom,
        variableZoom: spread,
        beyond: variable ? view.height : 0,
      )) {
        yield (t.z, t.x, t.y);
      }
      return;
    }
    final TileRange(:x0, :x1, :y0, :y1) = TileRange(
      z,
      origin.dx,
      origin.dy,
      origin.dx + size.width,
      origin.dy + size.height,
      tileSpan: span,
    );
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        yield (z, x, y);
      }
    }
  }

  @override
  void _draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView? view, {
    required bool drape,
  }) {
    if (_template == null) return;
    _frame++;
    final top = tileZoom(zoom);
    _setUpPaint(context);
    final lap = _lap, ring = _ring;
    final (snapX, snapY) = _snap(origin, view);
    waiting = 0;
    fading = false;
    for (final (z, x, y) in _inView(
      top,
      256.0 * math.pow(2, zoom - top),
      origin,
      size,
      view,
      variable: drape,
    )) {
      final n = 1 << z;
      final span = 256.0 * math.pow(2, zoom - z);
      final key = tileKey(z, x % n, y);
      final tile = _tiles[key] ??= _RasterTile();
      tile.usedFrame = _frame;
      // A tile shaded again once its neighbours land is still on its way.
      if (tile.shading) waiting++;
      final target = ui.Rect.fromLTRB(
        x * span - origin.dx + snapX,
        y * span - origin.dy + snapY,
        (x + 1) * span - origin.dx + snapX + lap,
        (y + 1) * span - origin.dy + snapY + lap,
      );
      var image = tile.image;
      ui.Rect source;
      final own = image != null;
      if (image != null) {
        source = ui.Rect.fromLTRB(
          ring,
          ring,
          image.width - ring,
          image.height - ring,
        );
      } else if (tile.empty) {
        continue;
      } else {
        final failed = tile.resting(_clock.elapsedMilliseconds);
        if (!tile.missing) {
          _load(tile, z, x % n, y);
          final covered = _store?.cover.has(z, x % n, y) ?? false;
          if (covered && !failed) waiting++;
        }
        final stand = _standIn(z, x % n, y, ask: tile.missing || failed);
        if (stand == null) continue;
        (image, source) = stand;
      }
      final opacity = _paint.color.a;
      var shown = 1.0;
      if (own && _fadeMs > 0) {
        final now = _clock.elapsedMilliseconds;
        shown = (now - (tile.shownAtMs ??= now)) / _fadeMs;
        if (shown < 1) {
          fading = true;
          _underlay(canvas, z, x % n, y, target, drape: drape);
        }
      }
      _put(canvas, image, source, target, opacity * math.min(shown, 1), drape);
    }
    final fadedNow = fading;
    fading = fadedNow || _fadedBefore;
    _fadedBefore = fadedNow;
    if (_tiles.length > _maxTiles) {
      final stale = [
        for (final e in _tiles.entries)
          if (e.value.usedFrame != _frame && !e.value.loading) e.key,
      ];
      for (final key in stale) {
        _tiles.remove(key)?.image?.dispose();
      }
    }
  }

  /// Draws [image]'s [source] over [target] at [opacity], or keeps it for
  /// the GPU with [drape].
  void _put(
    ui.Canvas canvas,
    ui.Image image,
    ui.Rect source,
    ui.Rect target,
    double opacity,
    bool drape,
  ) {
    if (opacity <= 0) return;
    drawn.add((
      image: image,
      source: source,
      target: target,
      opacity: opacity,
      filter: _paint.colorFilter,
      smooth: _paint.filterQuality != ui.FilterQuality.none,
    ));
    if (drape) return;
    final color = _paint.color;
    _paint.color = color.withValues(alpha: opacity);
    canvas.drawImageRect(image, source, target, _paint);
    _paint.color = color;
  }

  /// `raster-fade-duration`, in milliseconds; 0 for tiles that do not fade.
  double get _fadeMs => switch (layer) {
    PictureTileLayer(:final fadeMs) => fadeMs,
    _ => 0,
  };

  /// A tile of the last frame or the one before drawn faded in: over
  /// raised ground the GPU lays a frame's tiles the frame after.
  bool fading = false;
  bool _fadedBefore = false;

  /// What tile [z]/[x]/[y], fading in over [target], stands over until it
  /// is wholly there, as MapLibre keeps tiles for its cross-fade: the tile
  /// above it, zooming in, and those under it, zooming out.
  void _underlay(
    ui.Canvas canvas,
    int z,
    int x,
    int y,
    ui.Rect target, {
    required bool drape,
  }) {
    final opacity = _paint.color.a;
    if (_standIn(z, x, y, ask: false) case (final image, final source)) {
      _put(canvas, image, source, target, opacity, drape);
    }
    final ring = _ring;
    final w = target.width / 2, h = target.height / 2;
    for (var j = 0; j < 2; j++) {
      for (var i = 0; i < 2; i++) {
        final child = _tiles[tileKey(z + 1, x * 2 + i, y * 2 + j)];
        final image = child?.image;
        if (child == null || image == null) continue;
        child.usedFrame = _frame;
        _put(
          canvas,
          image,
          ui.Rect.fromLTRB(ring, ring, image.width - ring, image.height - ring),
          ui.Rect.fromLTWH(target.left + i * w, target.top + j * h, w, h),
          opacity,
          drape,
        );
      }
    }
  }

  /// The part of the deepest loaded tile above [z]/[x]/[y] that covers it,
  /// to draw while that tile loads or where it has none. With [ask], the
  /// nearest tile above that may come is asked for, as the tile itself will
  /// not come. As MapLibre's `maxUnderzooming`, no more than ten zoom
  /// levels up.
  (ui.Image, ui.Rect)? _standIn(int z, int x, int y, {required bool ask}) {
    for (var dz = 1; dz <= math.min(z, 10); dz++) {
      final pz = z - dz, px = x >> dz, py = y >> dz;
      final key = tileKey(pz, px, py);
      var above = _tiles[key];
      if (above == null && ask && (_store?.cover.has(pz, px, py) ?? false)) {
        above = _tiles[key] = _RasterTile();
      }
      if (above == null) continue;
      above.usedFrame = _frame;
      final image = above.image;
      if (image == null) {
        if (ask && !above.missing && !above.empty) {
          _load(above, pz, px, py);
          if (above.loading) waiting++;
          ask = false;
        }
        continue;
      }
      final ring = _ring;
      final part = 1 << dz;
      final w = (image.width - 2 * ring) / part;
      final h = (image.height - 2 * ring) / part;
      final left = ring + (x - (px << dz)) * w;
      final top = ring + (y - (py << dz)) * h;
      return (image, ui.Rect.fromLTWH(left, top, w, h));
    }
    return null;
  }

  /// How far to move the tiles so the world's pixels fall on the screen's,
  /// as MapLibre's `alignedProjMatrix` aligns a map at rest: a tile at its
  /// own zoom is then drawn pixel for pixel instead of blurred across two,
  /// turned a quarter or a half included. The centre is rounded to a whole
  /// world pixel, plus half of one turned with the map along a side of the
  /// screen an odd number of pixels long.
  static (double, double) _snap(ui.Offset origin, MapView? view) {
    double nearest(double v) => v.roundToDouble() - v;
    if (view == null) return (nearest(-origin.dx), nearest(-origin.dy));
    final b = -view.bearing * math.pi / 180;
    final cos = math.cos(b), sin = math.sin(b);
    final xShift = (view.width % 2) / 2, yShift = (view.height % 2) / 2;
    final cx = view.center.x, cy = view.center.y;
    final dx = cx - cx.roundToDouble() + cos * xShift + sin * yShift;
    final dy = cy - cy.roundToDouble() + cos * yShift + sin * xShift;
    return (dx > 0.5 ? dx - 1 : dx, dy > 0.5 ? dy - 1 : dy);
  }

  Future<void> _load(_RasterTile tile, int z, int x, int y) async {
    if (tile.loading || tile.empty || tile.missing) return;
    if (_loading >= _maxLoading) return;
    if (!(_store?.cover.has(z, x, y) ?? false)) return;
    if (tile.resting(_clock.elapsedMilliseconds)) return;
    tile.loading = true;
    _loading++;
    try {
      final bytes = await _store!.read(z, x, y);
      if (bytes == null) {
        tile.missing = true;
        if (!_closed) onLoaded();
        return;
      }
      if (bytes.isEmpty) {
        tile.empty = true;
        return;
      }
      final codec = await ui.instantiateImageCodec(bytes);
      final frame = await codec.getNextFrame();
      codec.dispose();
      await _decoded(tile, frame.image, z, x, y);
      tile.failures = 0;
    } catch (e) {
      tile
        ..failedAtMs = _clock.elapsedMilliseconds
        ..failures += 1;
      if (!_closed) onError?.call(e);
    } finally {
      tile.loading = false;
      _loading--;
    }
  }

  @override
  void close() {
    super.close();
    _store?.close();
    for (final t in _tiles.values) {
      t.image?.dispose();
    }
    _tiles.clear();
  }
}

/// Picture tiles, drawn as they come.
final class PictureTiles extends TileDrawing<PictureTileLayer> {
  PictureTiles(
    super.layer, {
    required super.config,
    required super.onLoaded,
    required super.onError,
  });

  /// Tiles meet edge to edge, unsmoothed, so neither a gap nor a stretched
  /// picture shows between them, as on MapLibre's GPU.
  @override
  double get _lap => 0;

  @override
  double get _ring => 0;

  /// Smoothed with mipmaps, as MapLibre samples raster tiles, so far
  /// tiles of a pitched map average out instead of shimmering.
  @override
  void _setUpPaint(EvalContext context) => _paint
    ..filterQuality = layer.nearestAt(context)
        ? ui.FilterQuality.none
        : ui.FilterQuality.medium
    ..isAntiAlias = false
    ..colorFilter = layer.adjust?.filter(context);

  @override
  Future<void> _decoded(
    _RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    if (_closed) return image.dispose();
    tile.image = image;
    onLoaded();
  }
}

/// Tiles of heights, shaded as light falling on the ground. Each tile is
/// shaded again as the tiles around it arrive, so its edges blend.
final class ShadedTiles extends TileDrawing<HillshadeLayer> {
  ShadedTiles(
    super.layer, {
    required super.config,
    required super.onLoaded,
    required super.onError,
  });

  /// See-through shading would be twice as dark where tiles lap, so the
  /// tiles share their edges exactly, drawn without anti-aliasing so every
  /// pixel belongs to one tile.
  @override
  double get _lap => 0;

  /// A shaded tile carries a ring one cell wide of what lies past its edge,
  /// so the picture blends into the next tile's.
  @override
  double get _ring => 1;

  @override
  void _setUpPaint(EvalContext context) => _paint
    ..filterQuality = layer.nearestAt(context)
        ? ui.FilterQuality.none
        : ui.FilterQuality.low
    ..isAntiAlias = false
    ..colorFilter = null;

  @override
  Future<void> _decoded(
    _RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    final data = await image.toByteData();
    tile
      ..pixels = data!.buffer.asUint8List()
      ..width = image.width
      ..height = image.height
      ..edges = _edgesOf(data.buffer.asUint8List(), image.width, image.height);
    image.dispose();
    await _reshade(tile, z, x, y);
    for (final (dx, dy) in _around) {
      final beside = _beside(z, x + dx, y + dy);
      if (beside != null && beside.pixels != null) {
        unawaited(_reshade(beside, z, (x + dx) % (1 << z), y + dy));
      }
    }
  }

  /// Above, below, left and right, in the order a tile's [_RasterTile.edges]
  /// are kept.
  static const List<(int, int)> _around = [(0, -1), (0, 1), (-1, 0), (1, 0)];

  _RasterTile? _beside(int z, int x, int y) {
    final n = 1 << z;
    if (y < 0 || y >= n) return null;
    return _tiles[tileKey(z, x % n, y)];
  }

  /// The two rows along the top and bottom and the two columns along the
  /// left and right of a tile of heights.
  static List<Uint8List> _edgesOf(Uint8List pixels, int width, int height) {
    Uint8List rows(int first) => Uint8List.sublistView(
      pixels,
      first * width * 4,
      (first + 2) * width * 4,
    );
    Uint8List columns(int first) {
      final out = Uint8List(height * 8);
      for (var y = 0; y < height; y++) {
        final from = (y * width + first) * 4;
        out.setRange(y * 8, y * 8 + 8, pixels, from);
      }
      return out;
    }

    return [
      Uint8List.fromList(rows(0)),
      Uint8List.fromList(rows(height - 2)),
      columns(0),
      columns(width - 2),
    ];
  }

  /// Shades [tile] with what is known of the tiles around it, and again
  /// when one of them arrived meanwhile.
  Future<void> _reshade(_RasterTile tile, int z, int x, int y) async {
    if (tile.shading) {
      tile.shadeAgain = true;
      return;
    }
    tile.shading = true;
    try {
      do {
        tile.shadeAgain = false;
        final relief = layer.relief;
        final pixels = tile.pixels;
        if (pixels == null) return;
        final n = 1 << z;
        var complete = true;
        final sides = <Uint8List?>[
          for (var i = 0; i < 4; i++)
            () {
              final (dx, dy) = _around[i];
              if (y + dy < 0 || y + dy >= n) return null;
              final beside = _beside(z, x + dx, y + dy);
              final edges = beside?.edges;
              if (edges == null ||
                  beside!.width != tile.width ||
                  beside.height != tile.height) {
                complete = false;
                return null;
              }
              // The side of the other tile that faces this one.
              return edges[i ^ 1];
            }(),
        ];
        final image = await _shade(tile, pixels, sides, relief, z, y);
        if (_closed || !identical(_beside(z, x, y), tile)) {
          image.dispose();
          return;
        }
        tile.image?.dispose();
        tile.image = image;
        if (complete && !tile.shadeAgain) tile.pixels = null;
        onLoaded();
      } while (tile.shadeAgain);
    } finally {
      tile.shading = false;
    }
  }

  /// Turns a tile of heights into a picture of shadow and highlight, one
  /// cell larger on every side than the tile.
  Future<ui.Image> _shade(
    _RasterTile tile,
    Uint8List pixels,
    List<Uint8List?> sides,
    ReliefPaint relief,
    int z,
    int y,
  ) async {
    final width = tile.width;
    final height = tile.height;
    final context = EvalContext()..zoom = z.toDouble();
    List<double> premultiplied(Object? colour, Rgba fallback) {
      final c = Rgba.of(colour) ?? fallback;
      return [c.r * c.a, c.g * c.a, c.b * c.a, c.a];
    }

    final count = [
      relief.directions.length,
      relief.altitudes.length,
      relief.shadows.length,
      relief.highlights.length,
    ].reduce(math.max);
    T at<T>(List<T> values, int i) => values[math.min(i, values.length - 1)];
    final n = 1 << z;
    final light = ShadeLight(
      method: ShadeLight.methods.indexOf(relief.method).clamp(0, 4),
      intensity: (asNumber(relief.exaggeration(context)) ?? 0.5).toDouble(),
      zoom: z,
      north: latitudeAt(y / n),
      south: latitudeAt((y + 1) / n),
      accent: premultiplied(relief.accent?.call(context), Rgba.black),
      lights: [
        for (var i = 0; i < count; i++) ...[
          at(relief.directions, i) * math.pi / 180,
          at(relief.altitudes, i) * math.pi / 180,
          ...premultiplied(at(relief.shadows, i)(context), Rgba.black),
          ...premultiplied(at(relief.highlights, i)(context), Rgba.black),
        ],
      ],
    );
    final shaded = await runAside(
      () => shadeHeights(
        pixels,
        width,
        height,
        relief.terrarium,
        light,
        sides: sides,
      ),
    );
    final done = Completer<ui.Image>();
    ui.decodeImageFromPixels(
      shaded,
      width + 2,
      height + 2,
      ui.PixelFormat.rgba8888,
      done.complete,
    );
    return done.future;
  }
}

/// Tiles of heights coloured by a ramp over the elevation.
final class ReliefTiles extends TileDrawing<ColorReliefLayer> {
  ReliefTiles(
    super.layer, {
    required super.config,
    required super.onLoaded,
    required super.onError,
  });

  @override
  double get _lap => 0;

  @override
  double get _ring => 0;

  @override
  void _setUpPaint(EvalContext context) => _paint
    ..filterQuality = layer.resampling(context) == 'nearest'
        ? ui.FilterQuality.none
        : ui.FilterQuality.low
    ..isAntiAlias = false
    ..colorFilter = null;

  @override
  Future<void> _decoded(
    _RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    final data = await image.toByteData();
    final width = image.width, height = image.height;
    image.dispose();
    if (data == null) return;
    final layer = this.layer;
    final pixels = data.buffer.asUint8List();
    final coloured = await runAside(
      () => colorHeights(
        pixels,
        width,
        height,
        layer.encoding,
        layer.elevations,
        layer.colors,
      ),
    );
    final done = Completer<ui.Image>();
    ui.decodeImageFromPixels(
      coloured,
      width,
      height,
      ui.PixelFormat.rgba8888,
      done.complete,
    );
    final picture = await done.future;
    if (_closed) return picture.dispose();
    tile.image?.dispose();
    tile.image = picture;
    onLoaded();
  }
}

/// Colours a tile of heights through a ramp of [elevations] and
/// premultiplied [colors], blended between stops as MapLibre's
/// color-relief shader does.
Uint8List colorHeights(
  Uint8List pixels,
  int width,
  int height,
  DemEncoding encoding,
  Float64List elevations,
  Float64List colors,
) {
  final stops = elevations.length;
  final out = Uint8List(width * height * 4);
  var o = 0;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      final at = (y * width + x) * 4;
      final metres =
          pixels[at] * encoding.red +
          pixels[at + 1] * encoding.green +
          pixels[at + 2] * encoding.blue -
          encoding.baseShift;
      var l = 0, r = stops - 1;
      while (r - l > 1) {
        final m = (l + r) >> 1;
        if (metres < elevations[m]) {
          r = m;
        } else {
          l = m;
        }
      }
      final span = elevations[r] - elevations[l];
      final along = (l + (span == 0 ? 0 : (metres - elevations[l]) / span))
          .clamp(0.0, stops - 1.0);
      final low = along.floor().clamp(0, stops - 2);
      final t = along - low;
      for (var k = 0; k < 4; k++) {
        final a = colors[low * 4 + k], b = colors[(low + 1) * 4 + k];
        out[o++] = ((a + (b - a) * t).clamp(0.0, 1.0) * 255).round();
      }
    }
  }
  return out;
}

/// Shades a grid of heights as [light] says, the way MapLibre's hillshade
/// shaders do, into premultiplied RGBA that is clear on flat ground.
///
/// The picture is one cell larger on every side than the grid. [sides] are
/// the two rows or columns of the tiles above, below, left and right that
/// face this one, nearest last for above and left, nearest first for below
/// and right. Where one is missing the edge's own slope is carried on
/// outwards, which keeps the edge from being drawn as a line.
Uint8List shadeHeights(
  Uint8List pixels,
  int width,
  int height,
  bool terrarium,
  ShadeLight light, {
  List<Uint8List?> sides = const [null, null, null, null],
}) {
  double metres(Uint8List from, int at) {
    final r = from[at], g = from[at + 1], b = from[at + 2];
    return terrarium
        ? r * 256 + g + b / 256 - 32768
        : -10000 + (r * 65536 + g * 256 + b) * 0.1;
  }

  final w = width + 4;
  final h = height + 4;
  final heights = Float32List(w * h);
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      heights[(y + 2) * w + x + 2] = metres(pixels, (y * width + x) * 4);
    }
  }
  final above = sides[0], below = sides[1], left = sides[2], right = sides[3];
  for (var x = 2; x < w - 2; x++) {
    for (var k = 1; k >= 0; k--) {
      heights[k * w + x] = above != null
          ? metres(above, (k * width + x - 2) * 4)
          : 2 * heights[(k + 1) * w + x] - heights[(k + 2) * w + x];
    }
    for (var k = 0; k < 2; k++) {
      final y = h - 2 + k;
      heights[y * w + x] = below != null
          ? metres(below, (k * width + x - 2) * 4)
          : 2 * heights[(y - 1) * w + x] - heights[(y - 2) * w + x];
    }
  }
  for (var y = 0; y < h; y++) {
    final inside = y >= 2 && y < h - 2;
    for (var k = 1; k >= 0; k--) {
      heights[y * w + k] = inside && left != null
          ? metres(left, ((y - 2) * 2 + k) * 4)
          : 2 * heights[y * w + k + 1] - heights[y * w + k + 2];
    }
    for (var k = 0; k < 2; k++) {
      final x = w - 2 + k;
      heights[y * w + x] = inside && right != null
          ? metres(right, ((y - 2) * 2 + k) * 4)
          : 2 * heights[y * w + x - 1] - heights[y * w + x - 2];
    }
  }
  final outWidth = width + 2;
  final out = Uint8List(outWidth * (height + 2) * 4);
  // MapLibre's prepare pass: the slope from a Sobel kernel, steepened below
  // zoom 15 so hills still show far out, kept to 8 bits as its texture
  // keeps it.
  final z = light.zoom;
  final factor = z < 2 ? 0.4 : (z < 4.5 ? 0.35 : 0.3);
  final steepen = z < 15 ? (z - 15) * factor : 0.0;
  final scale = width / math.pow(2, steepen + 3 + 25.2562 - z);
  double stored(double v) =>
      ((v / 8 + 128 / 255).clamp(0.0, 1.0) * 255).round() / 255 * 8 -
      128 / 255 * 8;
  final colour = Float64List(4);
  for (var y = 0; y < height + 2; y++) {
    // Slopes are shallower on the ground than on the map away from the
    // equator, by the cosine of the latitude.
    final share = (y - 0.5) / height;
    final latitude = light.north + (light.south - light.north) * share;
    final cosine = math.cos(latitude * math.pi / 180);
    for (var x = 0; x < outWidth; x++) {
      final at0 = y * w + x;
      final a = heights[at0];
      final b = heights[at0 + 1];
      final c = heights[at0 + 2];
      final d = heights[at0 + w];
      final f = heights[at0 + w + 2];
      final g = heights[at0 + 2 * w];
      final h = heights[at0 + 2 * w + 1];
      final i = heights[at0 + 2 * w + 2];
      final dx = stored(((c + 2 * f + i) - (a + 2 * d + g)) * scale) / cosine;
      final dy = stored(((g + 2 * h + i) - (a + 2 * b + c)) * scale) / cosine;
      light.shade(dx, dy, colour);
      final o = (y * outWidth + x) * 4;
      for (var k = 0; k < 4; k++) {
        out[o + k] = (colour[k].clamp(0.0, 1.0) * 255).round();
      }
    }
  }
  return out;
}

/// What a hillshade layer lights its ground with, as MapLibre's hillshade
/// shader takes it: plain values, so a tile is shaded off the UI isolate.
class ShadeLight {
  ShadeLight({
    required this.method,
    required this.intensity,
    required this.zoom,
    required this.north,
    required this.south,
    required this.accent,
    required this.lights,
  });

  static const methods = [
    'standard',
    'combined',
    'igor',
    'multidirectional',
    'basic',
  ];

  /// An index into [methods].
  final int method;

  /// `hillshade-exaggeration`.
  final double intensity;

  /// The tile's zoom, and the latitudes of its top and bottom edges.
  final int zoom;
  final double north, south;

  /// The standard method's accent colour, premultiplied.
  final List<double> accent;

  /// Per light: its direction and altitude in radians, then its shadow and
  /// highlight colours, premultiplied.
  final List<double> lights;

  int get _count => lights.length ~/ 10;

  static double _mod(double x, double y) => x - y * (x / y).floorToDouble();

  static double _aspect(double dx, double dy) =>
      dx != 0 ? math.atan2(dy, -dx) : math.pi / 2 * (dy > 0 ? 1 : -1);

  void _mixInto(List<double> out, int light, int at, double by) {
    for (var k = 0; k < 4; k++) {
      out[k] += lights[light * 10 + at + k] * by;
    }
  }

  /// The colour, premultiplied, of ground sloping [dx] east and [dy] south
  /// per unit, into [out].
  void shade(double dx, double dy, List<double> out) {
    out.fillRange(0, 4, 0);
    switch (method) {
      case 1:
        final (sx, sy) = (dx * intensity * 2, dy * intensity * 2);
        final cang = math
            .acos(_lit(0, sx, sy).clamp(-1.0, 1.0))
            .clamp(0.0, math.pi / 2);
        final steep =
            math.atan(math.sqrt(sx * sx + sy * sy)) * 4 / math.pi / math.pi;
        _mixInto(out, 0, 2, cang * steep);
        _mixInto(out, 0, 6, (math.pi / 2 - cang) * steep);
      case 2:
        final (sx, sy) = (dx * intensity * 2, dy * intensity * 2);
        final aspect = _aspect(sx, sy);
        final azimuth = lights[0] + math.pi;
        final slope = math.atan(math.sqrt(sx * sx + sy * sy)) * 2 / math.pi;
        final facing =
            1 - (_mod((aspect + azimuth) / math.pi + 0.5, 2) - 1).abs();
        _mixInto(out, 0, 2, slope * facing);
        _mixInto(out, 0, 6, slope * (1 - facing));
      case 3:
        final (sx, sy) = (dx * intensity * 2, dy * intensity * 2);
        for (var l = 0; l < _count; l++) {
          final shade = _lit(l, sx, sy, multi: true).clamp(0.0, 1.0);
          if (shade > 0.5) {
            _mixInto(out, l, 6, (2 * shade - 1) / _count);
          } else {
            _mixInto(out, l, 2, (1 - 2 * shade) / _count);
          }
        }
      case 4:
        final (sx, sy) = (dx * intensity * 2, dy * intensity * 2);
        final shade = _lit(0, sx, sy).clamp(0.0, 1.0);
        if (shade > 0.5) {
          _mixInto(out, 0, 6, 2 * shade - 1);
        } else {
          _mixInto(out, 0, 2, 1 - 2 * shade);
        }
      default:
        _standard(dx, dy, out);
    }
  }

  /// How squarely light [l] falls on ground sloping [sx], [sy].
  double _lit(int l, double sx, double sy, {bool multi = false}) {
    final azimuth = lights[l * 10] + (multi ? 0 : math.pi);
    final altitude = lights[l * 10 + 1];
    final cosAz = multi ? -math.cos(azimuth) : math.cos(azimuth);
    final sinAz = multi ? -math.sin(azimuth) : math.sin(azimuth);
    final cosAlt = math.cos(altitude), sinAlt = math.sin(altitude);
    return (sinAlt - (sy * cosAz * cosAlt - sx * sinAz * cosAlt)) /
        math.sqrt(1 + sx * sx + sy * sy);
  }

  /// MapLibre's own method: an accent by steepness under a shadow or
  /// highlight by which way the ground faces.
  void _standard(double dx, double dy, List<double> out) {
    final azimuth = lights[0] + math.pi;
    final slope = math.atan(0.625 * math.sqrt(dx * dx + dy * dy));
    final aspect = _aspect(dx, dy);
    final base = 1.875 - intensity * 1.75;
    const most = math.pi / 2;
    final scaled = intensity != 0.5
        ? (math.pow(base, slope) - 1) / (math.pow(base, most) - 1) * most
        : slope;
    final strength = (intensity * 2).clamp(0.0, 1.0);
    final accentShare = (1 - math.cos(scaled)) * strength;
    final facing = (_mod((aspect + azimuth) / math.pi + 0.5, 2) - 1).abs();
    final shadeShare = math.sin(scaled) * strength;
    final shadeAlpha =
        (lights[5] + (lights[9] - lights[5]) * facing) * shadeShare;
    for (var k = 0; k < 4; k++) {
      final shade =
          (lights[2 + k] + (lights[6 + k] - lights[2 + k]) * facing) *
          shadeShare;
      out[k] = accent[k] * accentShare * (1 - shadeAlpha) + shade;
    }
  }
}

/// The heights of a `terrain` source: the tiles a view asks for, decoded
/// off the UI isolate into [heights], never drawn on the canvas.
final class TerrainTiles extends TileDrawing<TerrainLayer> {
  TerrainTiles(
    super.layer, {
    required super.config,
    required super.onLoaded,
    required super.onError,
  });

  final DemTiles heights = DemTiles();

  /// Tiles that came back holding no heights, kept so they are not asked
  /// for again; their parents' heights stand in.
  final Set<int> _empty = {};

  /// The deepest zoom the source has.
  int get maxZoom => _maxZoom;

  /// [Terrain.shallower] for this source's tile size.
  int get shallower =>
      (math.log(layer.tileSize / 128) / math.ln2).round().clamp(0, 8);

  @override
  double get _lap => 0;

  @override
  double get _ring => 0;

  @override
  void _setUpPaint(EvalContext context) {}

  @override
  void _draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView? view, {
    required bool drape,
  }) {}

  /// Fetches the tiles [ids] that are not here yet, each taken to the
  /// source's deepest zoom where it is deeper, and lets go of those not
  /// asked for in a while.
  void want(Iterable<TileId> ids) {
    waiting = 0;
    if (_template == null) return;
    _frame++;
    // Each tile's ancestor four zooms up comes too: a handful of small
    // tiles whose heights stand in wherever a deep one is missing.
    final asked = <TileId>{
      for (final id in ids) ...[
        id,
        if (id.z > 4) TileId(id.z - 4, id.x >> 4, id.y >> 4),
      ],
    };
    for (final id in asked) {
      final up = math.max(0, id.z - _maxZoom);
      final z = id.z - up, x = id.x >> up, y = id.y >> up;
      final tile = _tiles[tileKey(z, x, y)] ??= _RasterTile();
      tile.usedFrame = _frame;
      if (!heights.has(TileId(z, x, y)) &&
          !_empty.contains(tileKey(z, x, y)) &&
          !tile.empty &&
          !tile.missing) {
        _load(tile, z, x, y);
        final failed = tile.resting(_clock.elapsedMilliseconds);
        if (!failed && (_store?.cover.has(z, x, y) ?? false)) waiting++;
      }
    }
    if (_tiles.length > TileDrawing._maxTiles) {
      final stale = [
        for (final e in _tiles.entries)
          if (e.value.usedFrame != _frame && !e.value.loading) e.key,
      ];
      for (final key in stale) {
        _tiles.remove(key);
        heights.remove(tileIdOf(key));
      }
    }
  }

  @override
  Future<void> _decoded(
    _RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    final data = await image.toByteData();
    final dim = image.width;
    image.dispose();
    if (data == null || _closed) return;
    final bytes = data.buffer.asUint8List();
    final terrarium = layer.terrarium;
    final dem = await runAside(
      () => DemTile.decode(bytes, dim, terrarium: terrarium),
    );
    if (_closed) return;
    // Lower than anywhere on Earth: a tile of no data, all zero bytes in
    // Terrarium, which some servers send where they have no heights.
    if (dem.max < -12000) {
      _empty.add(tileKey(z, x, y));
      return;
    }
    heights.add(TileId(z, x, y), dem);
    onLoaded();
  }
}
