import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'pmtiles.dart';
import 'style.dart';

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

/// Downloads and draws the picture tiles of one raster layer.
class RasterTiles {
  RasterTiles(
    this.layer, {
    required this.cacheDirectory,
    required this.userAgent,
    required this.onLoaded,
  }) : _template =
           layer.tiles ??
           (PmTiles.handles(layer.tileJsonUrl) ? layer.tileJsonUrl : null),
       _maxZoom = layer.sourceMaxZoom ?? 22 {
    if (PmTiles.handles(_template)) {
      final archive = _archive = PmTiles(_template!, client: _client);
      if (layer.sourceMaxZoom == null) {
        archive.maxZoom.then((deepest) {
          _maxZoom = deepest;
          if (!_closed) onLoaded();
        }, onError: (_) {});
      }
    } else if (_template == null && layer.tileJsonUrl != null) {
      _resolve();
    }
  }

  PmTiles? _archive;

  RasterLayer layer;
  final String? cacheDirectory;
  final String userAgent;
  final void Function() onLoaded;

  static const int _maxTiles = 48;
  static const int _maxLoading = 4;

  late final HttpClient _client = HttpClient()
    ..userAgent = userAgent
    ..maxConnectionsPerHost = 4;
  final Map<int, _RasterTile> _tiles = {};
  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;
  final Stopwatch _clock = Stopwatch()..start();
  String? _template;
  int _maxZoom;
  int _loading = 0;
  int _frame = 0;
  bool _closed = false;

  Future<void> _resolve() async {
    try {
      final request = await _client.getUrl(Uri.parse(layer.tileJsonUrl!));
      final response = await request.close().timeout(
        const Duration(seconds: 10),
      );
      final json =
          jsonDecode(await utf8.decodeStream(response)) as Map<String, dynamic>;
      final deepest = json['maxzoom'];
      if (deepest is num) _maxZoom = deepest.toInt();
      _template = (json['tiles'] as List).first as String;
      if (!_closed) onLoaded();
    } catch (_) {}
  }

  /// Draws the tiles covering the view. [zoom] is the slippy-map zoom and
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
    if (opacity <= 0 || _template == null) return;
    _frame++;
    final ideal = zoom + math.log(256 / layer.tileSize) / math.ln2;
    final z = ideal.round().clamp(0, _maxZoom);
    final span = 256.0 * math.pow(2, zoom - z);
    final n = 1 << z;
    final x0 = (origin.dx / span).floor();
    final x1 = ((origin.dx + size.width) / span).floor();
    final y0 = math.max(0, (origin.dy / span).floor());
    final y1 = math.min(n - 1, ((origin.dy + size.height) / span).floor());
    // Opaque tiles lap over each other a little so no gap shows between
    // them. See-through shading would be twice as dark in the lap, so its
    // tiles share their edges exactly, drawn without anti-aliasing so every
    // pixel belongs to one tile.
    final shaded = layer.relief != null;
    final lap = shaded ? 0.0 : 0.5;
    _paint
      ..color = ui.Color.fromRGBO(255, 255, 255, opacity)
      ..isAntiAlias = !shaded
      ..colorFilter = layer.adjust?.filter(context);
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        final key = (z << 50) | ((x % n) << 25) | y;
        final tile = _tiles[key] ??= _RasterTile();
        tile.usedFrame = _frame;
        final image = tile.image;
        if (image == null) {
          _load(tile, z, x % n, y);
          continue;
        }
        // A shaded tile carries a ring one cell wide of what lies past its
        // edge, so the picture blends into the next tile's.
        final ring = shaded ? 1.0 : 0.0;
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
    if (!layer.cover.has(z, x, y)) return;
    if (tile.failedAtMs >= 0 &&
        _clock.elapsedMilliseconds - tile.failedAtMs < 5000) {
      return;
    }
    tile.loading = true;
    _loading++;
    try {
      final template = _template!;
      final archive = _archive;
      final file = cacheDirectory == null || (archive?.local ?? false)
          ? null
          : File(
              '$cacheDirectory/raster-${template.hashCode.toRadixString(36)}/$z/$x/$y',
            );
      Uint8List bytes;
      if (file != null && file.existsSync()) {
        bytes = await file.readAsBytes();
      } else if (archive != null) {
        bytes = await archive.tile(z, x, y);
        if (bytes.isEmpty) throw const HttpException('No such tile');
        if (file != null) {
          await file.parent.create(recursive: true);
          await file.writeAsBytes(bytes);
        }
      } else {
        final url = template
            .replaceFirst('{z}', '$z')
            .replaceFirst('{x}', '$x')
            .replaceFirst('{y}', '${layer.cover.row(z, y)}');
        final request = await _client.getUrl(Uri.parse(url));
        final response = await request.close().timeout(
          const Duration(seconds: 20),
        );
        if (response.statusCode != 200) {
          await response.drain<void>();
          throw HttpException('HTTP ${response.statusCode}');
        }
        final builder = BytesBuilder(copy: false);
        await response.forEach(builder.add);
        bytes = builder.takeBytes();
        if (file != null) {
          await file.parent.create(recursive: true);
          await file.writeAsBytes(bytes);
        }
      }
      final codec = await ui.instantiateImageCodec(bytes);
      final frame = await codec.getNextFrame();
      codec.dispose();
      final image = frame.image;
      if (layer.relief != null) {
        final data = await image.toByteData();
        tile
          ..pixels = data!.buffer.asUint8List()
          ..width = image.width
          ..height = image.height
          ..edges = _edgesOf(
            data.buffer.asUint8List(),
            image.width,
            image.height,
          );
        image.dispose();
        await _reshade(tile, z, x, y);
        for (final (dx, dy) in _around) {
          final beside = _beside(z, x + dx, y + dy);
          if (beside != null && beside.pixels != null) {
            unawaited(_reshade(beside, z, (x + dx) % (1 << z), y + dy));
          }
        }
      } else if (_closed) {
        image.dispose();
      } else {
        tile.image = image;
        onLoaded();
      }
    } catch (_) {
      tile.failedAtMs = _clock.elapsedMilliseconds;
    } finally {
      tile.loading = false;
      _loading--;
    }
  }

  /// Above, below, left and right, in the order a tile's [_RasterTile.edges]
  /// are kept.
  static const List<(int, int)> _around = [(0, -1), (0, 1), (-1, 0), (1, 0)];

  _RasterTile? _beside(int z, int x, int y) {
    final n = 1 << z;
    if (y < 0 || y >= n) return null;
    return _tiles[(z << 50) | ((x % n) << 25) | y];
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
        if (relief == null || pixels == null) return;
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
    final latitude = math.atan(_sinh(math.pi * (1 - 2 * (y + 0.5) / n))).abs();
    final metres = 40075016.686 * math.cos(latitude) / (n * width);
    final colours = [
      shadow.r, shadow.g, shadow.b, shadow.a, //
      light.r, light.g, light.b, light.a,
    ];
    final shaded = await Isolate.run(
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

  static double _sinh(double x) => (math.exp(x) - math.exp(-x)) / 2;

  void close() {
    _closed = true;
    _archive?.close();
    _client.close(force: true);
    for (final t in _tiles.values) {
      t.image?.dispose();
    }
    _tiles.clear();
  }
}

/// Shades a grid of heights lit from [direction] degrees: premultiplied RGBA
/// that is the shadow colour on slopes facing away from the light and the
/// highlight colour on slopes facing it, and clear on flat ground.
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
      final at = (y * outWidth + x) * 4;
      out[at] = (colours[o] * alpha * 255).round();
      out[at + 1] = (colours[o + 1] * alpha * 255).round();
      out[at + 2] = (colours[o + 2] * alpha * 255).round();
      out[at + 3] = (alpha * 255).round();
    }
  }
  return out;
}
