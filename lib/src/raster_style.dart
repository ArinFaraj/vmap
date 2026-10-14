import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'style_model.dart' show TileCover;

/// How a hillshade layer turns heights into shading, as MapLibre's
/// `hillshade-*` paint properties say. Several lights, each with its
/// direction, altitude, shadow and highlight, are used by the
/// `multidirectional` method; the others use the first.
class ReliefPaint {
  ReliefPaint({
    required this.terrarium,
    required this.exaggeration,
    required Expr shadow,
    required Expr highlight,
    required double direction,
    this.accent,
    this.method = 'standard',
    List<double>? directions,
    List<double>? altitudes,
    List<Expr>? shadows,
    List<Expr>? highlights,
  }) : directions = directions ?? [direction],
       altitudes = altitudes ?? const [45],
       shadows = shadows ?? [shadow],
       highlights = highlights ?? [highlight];

  /// The heights are in the Terrarium encoding instead of Mapbox's.
  final bool terrarium;
  final Expr exaggeration;

  /// The colour steep ground is tinted whichever way it faces, by the
  /// standard method. Black when the style names none.
  final Expr? accent;

  /// `standard`, `basic`, `combined`, `igor` or `multidirectional`.
  final String method;

  /// Where each light comes from, in degrees clockwise from north, and how
  /// high above the horizon.
  final List<double> directions, altitudes;
  final List<Expr> shadows, highlights;
}

/// How a raster layer changes the colours of its pictures: `raster-hue-rotate`,
/// `raster-saturation`, `raster-contrast` and the two ends of
/// `raster-brightness`.
class RasterAdjust {
  RasterAdjust({
    required this.hueRotate,
    required this.saturation,
    required this.contrast,
    required this.brightnessMin,
    required this.brightnessMax,
  });

  final Expr hueRotate;
  final Expr saturation;
  final Expr contrast;
  final Expr brightnessMin;
  final Expr brightnessMax;

  String? _key;
  ui.ColorFilter? _filter;

  /// The colour filter for the zoom in [context], or null when it changes
  /// nothing.
  ui.ColorFilter? filter(EvalContext context) {
    final hue = (asNumber(hueRotate(context)) ?? 0).toDouble();
    final sat = (asNumber(saturation(context)) ?? 0).clamp(-1.0, 1.0);
    final con = (asNumber(contrast(context)) ?? 0).clamp(-1.0, 1.0);
    final low = (asNumber(brightnessMin(context)) ?? 0).clamp(0.0, 1.0);
    final high = (asNumber(brightnessMax(context)) ?? 1).clamp(0.0, 1.0);
    final key = '$hue|$sat|$con|$low|$high';
    if (key == _key) return _filter;
    _key = key;
    if (hue == 0 && sat == 0 && con == 0 && low == 0 && high == 1) {
      return _filter = null;
    }
    return _filter = ui.ColorFilter.matrix(
      rasterColorMatrix(
        hue,
        sat.toDouble(),
        con.toDouble(),
        low.toDouble(),
        high.toDouble(),
      ),
    );
  }
}

/// The colour matrix MapLibre's raster shader works out to: the hue turned
/// by [hue] degrees, then saturation, contrast, and brightness stretched
/// between [low] and [high].
List<double> rasterColorMatrix(
  double hue,
  double saturation,
  double contrast,
  double low,
  double high,
) {
  final angle = hue * math.pi / 180;
  final c = math.cos(angle), s = math.sin(angle);
  // Rows of the matrix that turns a colour around the grey axis.
  var m = <List<double>>[
    [
      (2 * c + 1) / 3,
      (-math.sqrt(3) * s - c + 1) / 3,
      (math.sqrt(3) * s - c + 1) / 3,
    ],
    [
      (math.sqrt(3) * s - c + 1) / 3,
      (2 * c + 1) / 3,
      (-math.sqrt(3) * s - c + 1) / 3,
    ],
    [
      (-math.sqrt(3) * s - c + 1) / 3,
      (math.sqrt(3) * s - c + 1) / 3,
      (2 * c + 1) / 3,
    ],
  ];
  final grey = saturation > 0 ? 1 - 1 / (1.001 - saturation) : -saturation;
  final sharp = contrast > 0 ? 1 / (1 - contrast) : 1 + contrast;
  // Saturation pulls each channel towards the mean of the three.
  m = [
    for (var row = 0; row < 3; row++)
      [
        for (var col = 0; col < 3; col++)
          m[row][col] * (1 - grey) +
              (m[0][col] + m[1][col] + m[2][col]) / 3 * grey,
      ],
  ];
  final scale = sharp * (high - low);
  final offset = ((0.5 * (1 - sharp)) * (high - low) + low) * 255;
  return [
    for (var row = 0; row < 3; row++) ...[
      m[row][0] * scale,
      m[row][1] * scale,
      m[row][2] * scale,
      0,
      offset,
    ],
    0, 0, 0, 1, 0, //
  ];
}

/// A layer drawn from pictures: the one picture of an `image` source, or
/// picture tiles, or tiles of heights shaded as a hillshade.
sealed class RasterLayer {
  RasterLayer({
    required this.minZoom,
    required this.maxZoom,
    required this.opacity,
  });

  final double minZoom;
  final double maxZoom;
  final Expr opacity;

  /// Equal for two layers drawn from the same pictures the same way.
  String get signature;
}

final class ImageLayer extends RasterLayer {
  ImageLayer({
    required super.minZoom,
    required super.maxZoom,
    required super.opacity,
    required this.picture,
    required this.corners,
    this.nearest = false,
    this.adjust,
  });

  /// The address of the picture.
  final String picture;

  /// Where the picture's corners sit as x,y pairs in a world one unit wide,
  /// from the top left clockwise.
  final Float64List corners;

  /// `raster-resampling` nearest: a picture drawn larger than it is shows
  /// its pixels as squares instead of being smoothed.
  final bool nearest;

  /// Set when the layer changes the colours of its picture.
  final RasterAdjust? adjust;

  @override
  String get signature => 'image|$picture';
}

/// A layer drawn from tiles.
sealed class TiledRasterLayer extends RasterLayer {
  TiledRasterLayer({
    required super.minZoom,
    required super.maxZoom,
    required super.opacity,
    required this.tileJsonUrl,
    required this.tiles,
    required this.tileSize,
    required this.sourceMaxZoom,
    this.cover = const TileCover(),
  });

  /// A TileJSON address, or a `pmtiles://` archive.
  final String? tileJsonUrl;

  /// The tile addresses, when the style lists them itself.
  final String? tiles;
  final double tileSize;
  final int? sourceMaxZoom;
  final TileCover cover;

  String get _source => '$tileJsonUrl|$tiles|$tileSize|${cover.signature}';
}

final class PictureTileLayer extends TiledRasterLayer {
  PictureTileLayer({
    required super.minZoom,
    required super.maxZoom,
    required super.opacity,
    required super.tileJsonUrl,
    required super.tiles,
    required super.tileSize,
    required super.sourceMaxZoom,
    super.cover,
    this.nearest = false,
    this.adjust,
  });

  /// `raster-resampling` nearest: tiles drawn larger than they are show
  /// their pixels as squares instead of being smoothed.
  final bool nearest;

  /// Set when the layer changes the colours of its tiles.
  final RasterAdjust? adjust;

  @override
  String get signature => 'tiles|$_source';
}

/// Tiles of heights, shaded as light falling on the ground.
final class HillshadeLayer extends TiledRasterLayer {
  HillshadeLayer({
    required super.minZoom,
    required super.maxZoom,
    required super.opacity,
    required super.tileJsonUrl,
    required super.tiles,
    required super.tileSize,
    required super.sourceMaxZoom,
    required this.relief,
    super.cover,
  });

  final ReliefPaint relief;

  @override
  String get signature => 'hillshade|$_source';
}

/// The heights the ground is raised by: the `raster-dem` source the
/// style's root `terrain` names, never drawn itself.
final class TerrainLayer extends TiledRasterLayer {
  TerrainLayer({
    required super.opacity,
    required super.tileJsonUrl,
    required super.tiles,
    required super.tileSize,
    required super.sourceMaxZoom,
    required this.terrarium,
    required this.exaggeration,
    super.cover,
  }) : super(minZoom: 0, maxZoom: 24);

  /// Terrarium encoding; Mapbox Terrain-RGB otherwise.
  final bool terrarium;

  /// How many times taller than they are the hills are drawn.
  final double exaggeration;

  @override
  String get signature => 'terrain|$_source';
}
