import 'dart:async';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show kIsWeb;

import '../camera/mercator.dart';
import '../camera/view.dart';
import '../platform.dart';
import '../style/expr.dart';
import '../style/raster_style.dart';
import '../terrain/dem_tile.dart';
import '../tiles/tile_id.dart';
import 'raster.dart';

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
  double get overlap => 0;

  /// A shaded tile carries a ring one cell wide of what lies past its edge,
  /// so the picture blends into the next tile's.
  @override
  double get ringCells => 1;

  @override
  void setUpPaint(EvalContext context) => layerPaint
    ..filterQuality = layer.nearestAt(context)
        ? ui.FilterQuality.none
        : ui.FilterQuality.low
    ..isAntiAlias = false
    ..colorFilter = null;

  @override
  Future<void> keepDecoded(
    RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    final data = await imagePixels(image);
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

  /// Above, below, left and right, in the order a tile's [RasterTile.edges]
  /// are kept.
  static const List<(int, int)> _around = [(0, -1), (0, 1), (-1, 0), (1, 0)];

  RasterTile? _beside(int z, int x, int y) {
    final n = 1 << z;
    if (y < 0 || y >= n) return null;
    return heldTiles[tileKey(z, x % n, y)];
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
  Future<void> _reshade(RasterTile tile, int z, int x, int y) async {
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
        if (closed || !identical(_beside(z, x, y), tile)) {
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
    RasterTile tile,
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
    if (kIsWeb) {
      final raster = await ShadeWorker.instance.shade(
        pixels,
        width,
        height,
        relief.terrarium,
        light,
        sides,
      );
      return imageFromRaster(raster, width + 2, height + 2, readable: true);
    }
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
    return imageFromRgba(shaded, width + 2, height + 2, readable: true);
  }
}

/// Shades tiles of heights in the worker vmap ships, in a browser, where
/// [runAside] has no thread to give but the page's own; the page gets an
/// image back without copying its pixels.
class ShadeWorker {
  ShadeWorker._() {
    startWorker(
      shadeWorkerMain,
      const [tag],
      _reply,
      script: workerScript,
      debugName: 'vmap shading',
    ).then((worker) {
      _worker = worker;
      for (final m in _queued) {
        worker.send(m);
      }
      _queued.clear();
    });
  }

  static final instance = ShadeWorker._();

  /// What the first message to a worker that shades heights is.
  static const tag = 'vmap shade';

  Worker? _worker;
  final List<List<Object?>> _queued = [];
  final Map<int, Completer<Object>> _waiting = {};
  int _next = 0;

  /// [pixels] shaded as [shadeHeights] shades them, ready for
  /// [imageFromRaster].
  Future<Object> shade(
    Uint8List pixels,
    int width,
    int height,
    bool terrarium,
    ShadeLight light,
    List<Uint8List?> sides,
  ) {
    final id = _next++;
    final done = _waiting[id] = Completer<Object>();
    final message = <Object?>[
      id,
      pixels,
      width,
      height,
      terrarium ? 1 : 0,
      light.method,
      light.intensity,
      light.zoom,
      light.north,
      light.south,
      Float64List.fromList(light.accent),
      Float64List.fromList(light.lights),
      ...sides,
    ];
    final worker = _worker;
    if (worker == null) {
      _queued.add(message);
    } else {
      worker.send(message);
    }
    return done.future;
  }

  void _reply(Object? message) {
    final m = message! as List<Object?>;
    _waiting.remove(m[0]! as int)?.complete(m[1]!);
  }
}

/// What a worker shading heights runs: [ShadeWorker]'s other half.
Future<void> shadeWorkerMain(
  List<Object?> init,
  void Function(Object? message) send,
  Stream<Object?> inbox,
) async {
  await for (final request in inbox) {
    final m = request! as List<Object?>;
    final width = m[2]! as int, height = m[3]! as int;
    final shaded = shadeHeights(
      m[1]! as Uint8List,
      width,
      height,
      m[4] == 1,
      ShadeLight(
        method: m[5]! as int,
        intensity: (m[6]! as num).toDouble(),
        zoom: m[7]! as int,
        north: (m[8]! as num).toDouble(),
        south: (m[9]! as num).toDouble(),
        accent: m[10]! as Float64List,
        lights: m[11]! as Float64List,
      ),
      sides: [for (var i = 12; i < 16; i++) m[i] as Uint8List?],
    );
    send([m[0], await rasterForPage(shaded, width + 2, height + 2)]);
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
  double get overlap => 0;

  @override
  double get ringCells => 0;

  @override
  void setUpPaint(EvalContext context) => layerPaint
    ..filterQuality = layer.resampling(context) == 'nearest'
        ? ui.FilterQuality.none
        : ui.FilterQuality.low
    ..isAntiAlias = false
    ..colorFilter = null;

  @override
  Future<void> keepDecoded(
    RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    final data = await imagePixels(image);
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
    final picture = await imageFromRgba(
      coloured,
      width,
      height,
      readable: true,
    );
    if (closed) return picture.dispose();
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
  int get maxZoom => deepestZoom;

  /// [Terrain.shallower] for this source's tile size.
  int get shallower =>
      (math.log(layer.tileSize / 128) / math.ln2).round().clamp(0, 8);

  @override
  double get overlap => 0;

  @override
  double get ringCells => 0;

  @override
  void setUpPaint(EvalContext context) {}

  @override
  void draw(
    ui.Canvas canvas,
    EvalContext context,
    double zoom,
    ui.Offset origin,
    ui.Size size,
    MapView view, {
    required bool drape,
  }) {}

  /// Fetches the tiles [ids] that are not here yet, each taken to the
  /// source's deepest zoom where it is deeper, and lets go of those not
  /// asked for in a while.
  void want(Iterable<TileId> ids) {
    waiting = 0;
    if (urlTemplate == null) return;
    frameNumber++;
    // Each tile's ancestor four zooms up comes too: a handful of small
    // tiles whose heights stand in wherever a deep one is missing.
    final asked = <TileId>{
      for (final id in ids) ...[
        id,
        if (id.z > 4) TileId(id.z - 4, id.x >> 4, id.y >> 4),
      ],
    };
    for (final id in asked) {
      final up = math.max(0, id.z - deepestZoom);
      final z = id.z - up, x = id.x >> up, y = id.y >> up;
      final tile = heldTiles[tileKey(z, x, y)] ??= RasterTile();
      tile.usedFrame = frameNumber;
      if (!heights.has(TileId(z, x, y)) &&
          !_empty.contains(tileKey(z, x, y)) &&
          !tile.empty &&
          !tile.missing) {
        loadTile(tile, z, x, y);
        final failed = tile.resting(clock.elapsedMilliseconds);
        if (!failed && (tileStore?.cover.has(z, x, y) ?? false)) waiting++;
      }
    }
    if (heldTiles.length > TileDrawing.maxTiles) {
      final stale = [
        for (final e in heldTiles.entries)
          if (e.value.usedFrame != frameNumber && !e.value.loading) e.key,
      ];
      for (final key in stale) {
        heldTiles.remove(key);
        heights.remove(tileIdOf(key));
      }
    }
  }

  @override
  Future<void> keepDecoded(
    RasterTile tile,
    ui.Image image,
    int z,
    int x,
    int y,
  ) async {
    final data = await imagePixels(image);
    final dim = image.width;
    image.dispose();
    if (data == null || closed) return;
    final bytes = data.buffer.asUint8List();
    final terrarium = layer.terrarium;
    final dem = await runAside(
      () => DemTile.decode(bytes, dim, terrarium: terrarium),
    );
    if (closed) return;
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
