import 'dart:convert';
import 'dart:io';
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

  final RasterLayer layer;
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
      if (_closed) {
        frame.image.dispose();
      } else {
        tile.image = frame.image;
        onLoaded();
      }
    } catch (_) {
      tile.failedAtMs = _clock.elapsedMilliseconds;
    } finally {
      tile.loading = false;
      _loading--;
    }
  }

  void close() {
    _closed = true;
    _client.close(force: true);
    for (final t in _tiles.values) {
      t.image?.dispose();
    }
    _tiles.clear();
  }
}
