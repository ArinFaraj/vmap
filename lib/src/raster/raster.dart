import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show protected;

import '../style/expr.dart';
import '../render/map_renderer.dart' show RasterPiece;
import '../tiles/pmtiles.dart';
import '../style/raster_style.dart';
import '../style/style_model.dart';
import '../options.dart';
import '../tiles/tile_store.dart';
import '../net/net.dart';
import '../platform.dart';
import '../tiles/tile_id.dart';
import '../camera/view.dart';
import 'raster_dem.dart';

class RasterTile {
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

/// Makes [drawings] those of [layers], in order: restyled when [keep],
/// when the layers are of the kinds they were made for, else each made by
/// [make] and the old ones closed.
void reconcileRasters(
  List<RasterDrawing<RasterLayer>> drawings,
  List<RasterLayer> layers, {
  required bool keep,
  required RasterDrawing<RasterLayer> Function(RasterLayer layer) make,
}) {
  if (keep) {
    for (var i = 0; i < drawings.length; i++) {
      drawings[i].restyle(layers[i]);
    }
    return;
  }
  for (final d in drawings) {
    d.close();
  }
  drawings
    ..clear()
    ..addAll([for (final layer in layers) make(layer)]);
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
  @protected
  final ui.Paint layerPaint = ui.Paint()..filterQuality = ui.FilterQuality.low;
  @protected
  bool closed = false;

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
    required MapView view,
    bool drape = false,
  }) {
    drawn.clear();
    final styleZoom = context.zoom;
    if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) return;
    final opacity = (asNumber(layer.opacity(context)) ?? 1).clamp(0.0, 1.0);
    if (opacity <= 0) return;
    layerPaint.color = ui.Color.fromRGBO(255, 255, 255, opacity);
    draw(canvas, context, zoom, origin, size, view, drape: drape);
  }

  @protected
  void draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView view, {
    required bool drape,
  });

  void close() {
    closed = true;
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
    loadTile(layer.picture);
  }

  ui.Image? _picture;
  ui.ImageShader? _shader;

  Future<void> loadTile(String url) async {
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
      if (closed) return frame.image.dispose();
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
      if (!closed) onError?.call(e);
    }
  }

  /// Draws the picture once for every copy of the world in view. Over
  /// raised ground a north-up picture is draped; one at any other angle
  /// lies flat under the ground.
  @override
  void draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView view, {
    required bool drape,
  }) {
    final image = _picture;
    if (image == null) return;
    layerPaint
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
          opacity: layerPaint.color.a,
          filter: layerPaint.colorFilter,
          smooth: !layer.nearestAt(context),
        ));
      }
      return;
    }
    layerPaint.shader = _shader;
    // Impeller leaves a colour filter on drawn vertices out, so the
    // picture's adjustments are laid on through a layer instead.
    final filter = layerPaint.colorFilter;
    if (filter != null) {
      canvas.saveLayer(ui.Offset.zero & size, ui.Paint()..colorFilter = filter);
      layerPaint.colorFilter = null;
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
      canvas.drawVertices(quad, ui.BlendMode.srcOver, layerPaint);
      quad.dispose();
    }
    if (filter != null) {
      canvas.restore();
      layerPaint.colorFilter = filter;
    }
    layerPaint.shader = null;
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
abstract class TileDrawing<L extends TiledRasterLayer>
    extends RasterDrawing<L> {
  TileDrawing(
    super.layer, {
    required super.config,
    required super.onLoaded,
    required super.onError,
  }) : deepestZoom = layer.sourceMaxZoom ?? 22 {
    final TiledRasterLayer(:tiles, :tileJsonUrl, :cover) = layer;
    if (tiles != null) {
      _use(tiles, cover);
    } else if (PmTiles.handles(tileJsonUrl)) {
      _use(tileJsonUrl!, cover);
      if (layer.sourceMaxZoom == null) {
        tileStore!.archive!.maxZoom.then((deepest) {
          deepestZoom = deepest;
          if (!closed) onLoaded();
        }, onError: (_) {});
      }
    } else if (tileJsonUrl != null) {
      _resolve(tileJsonUrl, cover);
    }
  }

  @protected
  static const int maxTiles = 48;
  static const int _maxLoading = 4;

  @protected
  TileStore? tileStore;
  @protected
  final Map<int, RasterTile> heldTiles = {};
  @protected
  final Stopwatch clock = Stopwatch()..start();
  @protected
  String? urlTemplate;
  @protected
  int deepestZoom;
  int _loading = 0;

  /// The credit the layer's TileJSON asks for, once it has been read.
  String? attribution;
  @protected
  int frameNumber = 0;

  /// The tiles the last frame drew without a picture yet: fetching,
  /// decoding or shading, not those that failed a moment ago. A map is not
  /// settled while any is.
  int waiting = 0;

  /// How far each tile is drawn past its right and bottom edge, so no gap
  /// shows between neighbours.
  @protected
  double get overlap;

  /// The cells around the edge of a tile's image that belong to the tiles
  /// beside it.
  @protected
  double get ringCells;

  /// Sets up [layerPaint] for this frame's tiles.
  @protected
  void setUpPaint(EvalContext context);

  /// Keeps a tile's decoded [image], or what it is made from.
  @protected
  Future<void> keepDecoded(
    RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  );

  Future<void> _resolve(String tileJsonUrl, TileCover cover) async {
    try {
      final reply = await _client.get(
        tileJsonUrl,
        config.headers,
        timeout: const Duration(seconds: 10),
      );
      final json = jsonDecode(utf8.decode(reply.bytes)) as Map<String, dynamic>;
      final deepest = json['maxzoom'];
      if (deepest is num) deepestZoom = deepest.toInt();
      if (json['attribution'] case final String credit) attribution = credit;
      if (tileTemplate(json['tiles']) case final template?) {
        _use(template, cover);
      }
      if (!closed) onLoaded();
    } catch (e) {
      if (!closed) onError?.call(e);
    }
  }

  /// The zoom of the tiles drawn at map zoom [zoom].
  int tileZoom(double zoom) =>
      (zoom + math.log(256 / layer.tileSize) / math.ln2).round().clamp(
        0,
        deepestZoom,
      );

  void _use(String template, TileCover cover) {
    urlTemplate = template;
    tileStore?.close();
    tileStore = TileStore.raster(template, cover: cover, config: config);
  }

  /// Fetches tile [z]/[x]/[y] into the cache directory unless it is there
  /// already, and returns whether it had to.
  Future<bool> keep(int z, int x, int y) async =>
      await tileStore?.keep(z, x, y) ?? false;

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
    MapView view, {
    bool variable = false,
  }) sync* {
    final spread = variable || view.pitch > 60;
    // The hold takes the cover to [z] whatever the view's own zoom; spread
    // out, each tile's zoom is rounded from the source's own, as MapLibre's
    // raster tiles, tiles nearer the camera going deeper.
    for (final t in view.cover(
      maxZoom: spread ? deepestZoom : z,
      minZoom: spread ? math.min(layer.cover.minZoom, z) : z,
      hold: spread
          ? math.log(512 / layer.tileSize) / math.ln2 + 0.5
          : z + 0.5 - view.zoom,
      variableZoom: spread,
      beyond: variable ? view.height : 0,
    )) {
      yield (t.z, t.x, t.y);
    }
  }

  @override
  void draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView view, {
    required bool drape,
  }) {
    if (urlTemplate == null) return;
    frameNumber++;
    final top = tileZoom(zoom);
    setUpPaint(context);
    final lap = overlap, ring = ringCells;
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
      final tile = heldTiles[key] ??= RasterTile();
      tile.usedFrame = frameNumber;
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
        final failed = tile.resting(clock.elapsedMilliseconds);
        if (!tile.missing) {
          loadTile(tile, z, x % n, y);
          final covered = tileStore?.cover.has(z, x % n, y) ?? false;
          if (covered && !failed) waiting++;
        }
        final stand = _standIn(z, x % n, y, ask: tile.missing || failed);
        if (stand == null) continue;
        (image, source) = stand;
      }
      final opacity = layerPaint.color.a;
      var shown = 1.0;
      if (own && _fadeMs > 0) {
        final now = clock.elapsedMilliseconds;
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
    if (heldTiles.length > maxTiles) {
      final stale = [
        for (final e in heldTiles.entries)
          if (e.value.usedFrame != frameNumber && !e.value.loading) e.key,
      ];
      for (final key in stale) {
        heldTiles.remove(key)?.image?.dispose();
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
      filter: layerPaint.colorFilter,
      smooth: layerPaint.filterQuality != ui.FilterQuality.none,
    ));
    if (drape) return;
    final color = layerPaint.color;
    layerPaint.color = color.withValues(alpha: opacity);
    canvas.drawImageRect(image, source, target, layerPaint);
    layerPaint.color = color;
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
    final opacity = layerPaint.color.a;
    if (_standIn(z, x, y, ask: false) case (final image, final source)) {
      _put(canvas, image, source, target, opacity, drape);
    }
    final ring = ringCells;
    final w = target.width / 2, h = target.height / 2;
    for (var j = 0; j < 2; j++) {
      for (var i = 0; i < 2; i++) {
        final child = heldTiles[tileKey(z + 1, x * 2 + i, y * 2 + j)];
        final image = child?.image;
        if (child == null || image == null) continue;
        child.usedFrame = frameNumber;
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
      var above = heldTiles[key];
      if (above == null && ask && (tileStore?.cover.has(pz, px, py) ?? false)) {
        above = heldTiles[key] = RasterTile();
      }
      if (above == null) continue;
      above.usedFrame = frameNumber;
      final image = above.image;
      if (image == null) {
        if (ask && !above.missing && !above.empty) {
          loadTile(above, pz, px, py);
          if (above.loading) waiting++;
          ask = false;
        }
        continue;
      }
      final ring = ringCells;
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
  static (double, double) _snap(ui.Offset origin, MapView view) {
    final b = -view.bearing * math.pi / 180;
    final cos = math.cos(b), sin = math.sin(b);
    final xShift = (view.width % 2) / 2, yShift = (view.height % 2) / 2;
    final cx = view.center.x, cy = view.center.y;
    final dx = cx - cx.roundToDouble() + cos * xShift + sin * yShift;
    final dy = cy - cy.roundToDouble() + cos * yShift + sin * xShift;
    return (dx > 0.5 ? dx - 1 : dx, dy > 0.5 ? dy - 1 : dy);
  }

  @protected
  Future<void> loadTile(RasterTile tile, int z, int x, int y) async {
    if (tile.loading || tile.empty || tile.missing) return;
    if (_loading >= _maxLoading) return;
    if (!(tileStore?.cover.has(z, x, y) ?? false)) return;
    if (tile.resting(clock.elapsedMilliseconds)) return;
    tile.loading = true;
    _loading++;
    try {
      final bytes = await tileStore!.read(z, x, y);
      if (bytes == null) {
        tile.missing = true;
        if (!closed) onLoaded();
        return;
      }
      if (bytes.isEmpty) {
        tile.empty = true;
        return;
      }
      final codec = await ui.instantiateImageCodec(bytes);
      final frame = await codec.getNextFrame();
      codec.dispose();
      await keepDecoded(tile, frame.image, z, x, y);
      tile.failures = 0;
    } catch (e) {
      tile
        ..failedAtMs = clock.elapsedMilliseconds
        ..failures += 1;
      if (!closed) onError?.call(e);
    } finally {
      tile.loading = false;
      _loading--;
    }
  }

  @override
  void close() {
    super.close();
    tileStore?.close();
    for (final t in heldTiles.values) {
      t.image?.dispose();
    }
    heldTiles.clear();
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
  double get overlap => 0;

  @override
  double get ringCells => 0;

  /// Smoothed with mipmaps, as MapLibre samples raster tiles, so far
  /// tiles of a pitched map average out instead of shimmering.
  @override
  void setUpPaint(EvalContext context) => layerPaint
    ..filterQuality = layer.nearestAt(context)
        ? ui.FilterQuality.none
        : ui.FilterQuality.medium
    ..isAntiAlias = false
    ..colorFilter = layer.adjust?.filter(context);

  @override
  Future<void> keepDecoded(
    RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    if (closed) return image.dispose();
    tile.image = image;
    onLoaded();
  }
}
