import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'style.dart';

class _RasterTile {
  ui.Image? image;
  int usedFrame = 0;
  int failedAtMs = -1;
  bool loading = false;
}

/// Downloads and draws the picture tiles of one raster layer.
class RasterTiles {
  RasterTiles(
    this.layer, {
    required this.cacheDirectory,
    required this.userAgent,
    required this.onLoaded,
  }) : _template = layer.tiles,
       _maxZoom = layer.sourceMaxZoom ?? 22 {
    if (_template == null && layer.tileJsonUrl != null) _resolve();
  }

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
    _paint.color = ui.Color.fromRGBO(255, 255, 255, opacity);
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
        canvas.drawImageRect(
          image,
          ui.Rect.fromLTWH(
            0,
            0,
            image.width.toDouble(),
            image.height.toDouble(),
          ),
          ui.Rect.fromLTWH(
            x * span - origin.dx,
            y * span - origin.dy,
            span + 0.5,
            span + 0.5,
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
    if (tile.failedAtMs >= 0 &&
        _clock.elapsedMilliseconds - tile.failedAtMs < 5000) {
      return;
    }
    tile.loading = true;
    _loading++;
    try {
      final template = _template!;
      final file = cacheDirectory == null
          ? null
          : File(
              '$cacheDirectory/raster-${template.hashCode.toRadixString(36)}/$z/$x/$y',
            );
      Uint8List bytes;
      if (file != null && file.existsSync()) {
        bytes = await file.readAsBytes();
      } else {
        final url = template
            .replaceFirst('{z}', '$z')
            .replaceFirst('{x}', '$x')
            .replaceFirst('{y}', '$y');
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
      var image = frame.image;
      final relief = layer.relief;
      if (relief != null) image = await _shade(image, relief, z, y);
      if (_closed) {
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

  /// Turns a tile of heights into a picture of shadow and highlight.
  Future<ui.Image> _shade(
    ui.Image heights,
    ReliefPaint relief,
    int z,
    int y,
  ) async {
    final width = heights.width;
    final height = heights.height;
    final data = await heights.toByteData();
    heights.dispose();
    final pixels = data!.buffer.asUint8List();
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
      () => _hillshade(
        pixels,
        width,
        height,
        terrarium,
        metres,
        strength,
        direction,
        colours,
      ),
    );
    final done = Completer<ui.Image>();
    ui.decodeImageFromPixels(
      shaded,
      width,
      height,
      ui.PixelFormat.rgba8888,
      done.complete,
    );
    return done.future;
  }

  static double _sinh(double x) => (math.exp(x) - math.exp(-x)) / 2;

  void close() {
    _closed = true;
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
Uint8List _hillshade(
  Uint8List pixels,
  int width,
  int height,
  bool terrarium,
  double metresPerPixel,
  double strength,
  double direction,
  List<double> colours,
) {
  final heights = Float32List(width * height);
  for (var i = 0; i < heights.length; i++) {
    final r = pixels[i * 4], g = pixels[i * 4 + 1], b = pixels[i * 4 + 2];
    heights[i] = terrarium
        ? r * 256 + g + b / 256 - 32768
        : -10000 + (r * 65536 + g * 256 + b) * 0.1;
  }
  final out = Uint8List(width * height * 4);
  final azimuth = (360 - direction + 90) * math.pi / 180;
  const zenith = math.pi / 4;
  final flat = math.cos(zenith);
  final steep = strength * 2 / (8 * metresPerPixel);
  for (var y = 0; y < height; y++) {
    final up = y == 0 ? 0 : y - 1;
    final down = y == height - 1 ? y : y + 1;
    for (var x = 0; x < width; x++) {
      final left = x == 0 ? 0 : x - 1;
      final right = x == width - 1 ? x : x + 1;
      final a = heights[up * width + left];
      final b = heights[up * width + x];
      final c = heights[up * width + right];
      final d = heights[y * width + left];
      final f = heights[y * width + right];
      final g = heights[down * width + left];
      final h = heights[down * width + x];
      final i = heights[down * width + right];
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
      final at = (y * width + x) * 4;
      out[at] = (colours[o] * alpha * 255).round();
      out[at + 1] = (colours[o + 1] * alpha * 255).round();
      out[at + 2] = (colours[o + 2] * alpha * 255).round();
      out[at + 3] = (alpha * 255).round();
    }
  }
  return out;
}
