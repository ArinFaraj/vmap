import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'pmtiles.dart';
import 'raster_style.dart';
import 'style_model.dart';
import 'source_config.dart';
import 'tile_store.dart';
import 'net.dart';
import 'platform.dart';
import 'tile_id.dart';
import 'mercator.dart';

class _RasterTile {
  ui.Image? image;
  int usedFrame = 0;
  int failedAtMs = -1;
  bool loading = false;

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
    this.layer, {
    required this.config,
    required this.onLoaded,
    required this.onError,
  });

  /// The drawing for [layer].
  static RasterDrawing<RasterLayer> of(
    RasterLayer layer, {
    required TileSourceConfig config,
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
  };

  /// Taken over from a style whose layer draws from the same pictures, so
  /// only its paint can differ.
  L layer;

  /// How pictures are fetched and kept.
  final TileSourceConfig config;
  final void Function() onLoaded;
  final void Function(Object error)? onError;

  late final Net _client = Net(userAgent: config.userAgent, perHost: 4);
  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;
  bool _closed = false;

  /// Draws the layer for the view. [zoom] is the slippy-map zoom and
  /// [origin] the world pixel at the canvas origin.
  void paint(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
  ) {
    final styleZoom = context.zoom;
    if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) return;
    final opacity = (asNumber(layer.opacity(context)) ?? 1).clamp(0.0, 1.0);
    if (opacity <= 0) return;
    _paint.color = ui.Color.fromRGBO(255, 255, 255, opacity);
    _draw(canvas, context, zoom, origin, size);
  }

  void _draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
  );

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

  /// Draws the picture once for every copy of the world in view.
  @override
  void _draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
  ) {
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
    _paint.shader = _shader;
    for (var copy = first; copy <= last; copy++) {
      final at = Float32List(8);
      var left = double.infinity, right = -double.infinity;
      for (var i = 0; i < 4; i++) {
        final x = (corners[i * 2] + copy) * world - origin.dx;
        at[i * 2] = x;
        at[i * 2 + 1] = corners[i * 2 + 1] * world - origin.dy;
        left = math.min(left, x);
        right = math.max(right, x);
      }
      if (right < 0 || left > size.width) continue;
      final quad = ui.Vertices.raw(
        ui.VertexMode.triangles,
        at,
        textureCoordinates: Float32List.fromList([0, 0, w, 0, w, h, 0, h]),
        indices: Uint16List.fromList(const [0, 1, 2, 0, 2, 3]),
      );
      canvas.drawVertices(quad, ui.BlendMode.srcOver, _paint);
      quad.dispose();
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
  int _frame = 0;

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

  @override
  void _draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
  ) {
    if (_template == null) return;
    _frame++;
    final z = tileZoom(zoom);
    final span = 256.0 * math.pow(2, zoom - z);
    final TileRange(:n, :x0, :x1, :y0, :y1) = TileRange(
      z,
      origin.dx,
      origin.dy,
      origin.dx + size.width,
      origin.dy + size.height,
      tileSpan: span,
    );
    _setUpPaint(context);
    final lap = _lap, ring = _ring;
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        final key = tileKey(z, x % n, y);
        final tile = _tiles[key] ??= _RasterTile();
        tile.usedFrame = _frame;
        final image = tile.image;
        if (image == null) {
          _load(tile, z, x % n, y);
          continue;
        }
        canvas.drawImageRect(
          image,
          ui.Rect.fromLTRB(ring, ring, image.width - ring, image.height - ring),
          ui.Rect.fromLTRB(
            x * span - origin.dx,
            y * span - origin.dy,
            (x + 1) * span - origin.dx + lap,
            (y + 1) * span - origin.dy + lap,
          ),
          _paint,
        );
      }
    }
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

  Future<void> _load(_RasterTile tile, int z, int x, int y) async {
    if (tile.loading || _loading >= _maxLoading) return;
    if (!(_store?.cover.has(z, x, y) ?? false)) return;
    if (tile.failedAtMs >= 0 &&
        _clock.elapsedMilliseconds - tile.failedAtMs < 5000) {
      return;
    }
    tile.loading = true;
    _loading++;
    try {
      final bytes = await _store!.read(z, x, y);
      if (bytes.isEmpty) throw HttpFailure(404, '$_template $z/$x/$y');
      final codec = await ui.instantiateImageCodec(bytes);
      final frame = await codec.getNextFrame();
      codec.dispose();
      await _decoded(tile, frame.image, z, x, y);
    } catch (e) {
      tile.failedAtMs = _clock.elapsedMilliseconds;
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

  /// Opaque tiles lap over each other a little so no gap shows between
  /// them.
  @override
  double get _lap => 0.5;

  @override
  double get _ring => 0;

  @override
  void _setUpPaint(EvalContext context) => _paint
    ..filterQuality = layer.nearest
        ? ui.FilterQuality.none
        : ui.FilterQuality.low
    ..isAntiAlias = true
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
    ..filterQuality = ui.FilterQuality.low
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
    final shadow = Rgba.of(relief.shadow(context)) ?? Rgba.black;
    final light = Rgba.of(relief.highlight(context)) ?? Rgba.black;
    final strength = (asNumber(relief.exaggeration(context)) ?? 0.5).toDouble();
    final terrarium = relief.terrarium;
    final direction = relief.direction;
    final n = math.pow(2, z);
    final latitude = latitudeAt((y + 0.5) / n).abs() * math.pi / 180;
    final metres = 40075016.686 * math.cos(latitude) / (n * width);
    final colours = [
      shadow.r, shadow.g, shadow.b, shadow.a, //
      light.r, light.g, light.b, light.a,
      if (Rgba.of(relief.accent?.call(context)) case final accent?) ...[
        accent.r, accent.g, accent.b, accent.a, //
      ],
    ];
    final shaded = await runAside(
      () => shadeHeights(
        pixels,
        width,
        height,
        terrarium,
        metres,
        strength,
        direction,
        colours,
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

/// Shades a grid of heights lit from [direction] degrees: premultiplied RGBA
/// that is the shadow colour on slopes facing away from the light and the
/// highlight colour on slopes facing it, and clear on flat ground. A third
/// colour in [colours] tints ground under the shading by how steep it is.
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
  double metresPerPixel,
  double strength,
  double direction,
  List<double> colours, {
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
  final azimuth = (360 - direction + 90) * math.pi / 180;
  const zenith = math.pi / 4;
  final flat = math.cos(zenith);
  final steep = strength * 2 / (8 * metresPerPixel);
  for (var y = 0; y < height + 2; y++) {
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
      final dx = ((c + 2 * f + i) - (a + 2 * d + g)) * steep;
      final dy = ((g + 2 * h + i) - (a + 2 * b + c)) * steep;
      final slope = math.atan(math.sqrt(dx * dx + dy * dy));
      final aspect = math.atan2(dy, -dx);
      final lit =
          flat * math.cos(slope) +
          math.sin(zenith) * math.sin(slope) * math.cos(azimuth - aspect);
      final delta = lit - flat;
      final o = delta < 0 ? 0 : 4;
      final alpha =
          (delta.abs() * (delta < 0 ? 1.4 : 2.4)).clamp(0.0, 1.0) *
          colours[o + 3];
      final under = colours.length < 12
          ? 0.0
          : (1 - math.cos(slope)) *
                colours[11] *
                (strength * 2).clamp(0.0, 1.0) *
                (1 - alpha);
      final at = (y * outWidth + x) * 4;
      for (var k = 0; k < 3; k++) {
        final tint = under == 0 ? 0.0 : colours[8 + k] * under;
        out[at + k] = ((colours[o + k] * alpha + tint) * 255).round();
      }
      out[at + 3] = ((alpha + under) * 255).round();
    }
  }
  return out;
}
