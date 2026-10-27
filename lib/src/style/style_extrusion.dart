import 'dart:math' as math;

import 'expr.dart';

/// What a `fill-extrusion` layer reads per building.
class Extrude {
  const Extrude(
    this.height,
    this.base,
    this.color, {
    this.verticalGradient = true,
    this.roundedCorners,
    this.pattern,
    this.readsState = false,
  });

  final Expr height;
  final Expr base;
  final Expr color;

  /// `fill-extrusion-vertical-gradient`: walls darker towards their feet.
  final bool verticalGradient;

  /// `fill-extrusion-rounded-corner-distance`, in metres.
  final Expr? roundedCorners;

  /// `fill-extrusion-pattern`: the sprite image the walls and roofs are
  /// covered in.
  final Expr? pattern;

  /// Whether [height], [base] or [color] read `feature-state`, so the
  /// buildings are built again when the app changes a feature's state.
  final bool readsState;
}

/// A style's root `light`, which shades buildings as MapLibre's
/// `fill_extrusion.vertex.glsl` does.
class ExtrusionLight {
  const ExtrusionLight({
    this.intensity = 0.5,
    this.color = const Rgba(1, 1, 1, 1),
    this.position = const [1.15, 210, 30],
    this.viewport = true,
  });

  /// Reads [json], the style's `light`, with MapLibre's defaults.
  factory ExtrusionLight.of(Object? json) {
    final light = json is Map ? json : const {};
    final context = EvalContext();
    final position = compileExpr(light['position'] ?? [1.15, 210, 30])(context);
    return ExtrusionLight(
      intensity:
          (asNumber(compileExpr(light['intensity'] ?? 0.5)(context)) ?? 0.5)
              .toDouble(),
      color:
          Rgba.of(compileExpr(light['color'] ?? '#ffffff')(context)) ??
          const Rgba(1, 1, 1, 1),
      position: position is List && position.length == 3
          ? [for (final v in position) (asNumber(v) ?? 0).toDouble()]
          : const [1.15, 210, 30],
      viewport: light['anchor'] != 'map',
    );
  }

  final double intensity;
  final Rgba color;

  /// Distance, azimuth and polar angle in degrees, as MapLibre takes them.
  final List<double> position;

  /// The light turns with the map's bearing, staying put on the screen.
  final bool viewport;

  /// How much a wall's vertical gradient keeps of its light at [t], 1 at
  /// the top and 0 at the foot, of a building from [base] to [height]
  /// metres: all of it when the gradient is not [on].
  double gradient({
    required double t,
    required double base,
    required double height,
    bool on = true,
  }) => on
      ? ((t + math.max(0.0, base)) * math.sqrt(math.max(0.0, height) / 150))
            .clamp(0.7 + (0.98 - 0.7) * (1 - intensity), 1.0)
      : 1;

  /// The direction light falls from, as MapLibre's `sphericalToCartesian`
  /// gives it, turned by [bearing] degrees for a [viewport] light, in tile
  /// units: across the ground, then up. MapLibre's light points the other
  /// way across the ground from the walls' outward normals here.
  (double, double, double) direction(double bearing) {
    final azimuth = (position[1] + 90) * math.pi / 180;
    final polar = position[2] * math.pi / 180;
    var lx = position[0] * math.cos(azimuth) * math.sin(polar);
    var ly = position[0] * math.sin(azimuth) * math.sin(polar);
    final lz = position[0] * math.cos(polar);
    if (viewport && bearing != 0) {
      final a = bearing * math.pi / 180;
      final c = math.cos(a), s = math.sin(a);
      (lx, ly) = (c * lx - s * ly, s * lx + c * ly);
    }
    return (-lx, -ly, lz);
  }

  /// [r], [g], [b] lit on a face whose normal is [nx], [ny], [nz], in tile
  /// units with y down, as packed RGB. On a wall [t] is 1 at the top and 0
  /// at the foot, [base] and [height] the building's in metres, and
  /// [gradient] darkens it towards the foot. [bearing] in degrees turns a
  /// [viewport] light.
  int shade(
    double r,
    double g,
    double b,
    double nx,
    double ny,
    double nz, {
    double t = 1,
    double base = 0,
    double height = 0,
    bool gradient = true,
    double bearing = 0,
  }) {
    final (lx, ly, lz) = direction(bearing);
    final length = math.sqrt(nx * nx + ny * ny + nz * nz);
    final value = r * 0.2126 + g * 0.7152 + b * 0.0722;
    var directional = length == 0
        ? 0.0
        : ((nx * lx + ny * ly + nz * lz) / length).clamp(0.0, 1.0);
    directional =
        (1 - intensity) +
        (math.max(1 - value + intensity, 1.0) - (1 - intensity)) * directional;
    if (nz == 0) {
      directional *= this.gradient(
        t: t,
        base: base,
        height: height,
        on: gradient,
      );
    }
    int channel(double c, double light) {
      final lowest = 0.3 * (1 - light);
      return (((c + 0.03) * directional * light).clamp(lowest, 1.0) * 255)
          .round();
    }

    return channel(r, color.r) << 16 |
        channel(g, color.g) << 8 |
        channel(b, color.b);
  }
}

/// A `fill-extrusion` layer drawn standing up on a tilted map, from its
/// [bucket] of buildings. [fill] is the flat fill drawn in its place when
/// the map is not.
class ExtrusionLayer {
  const ExtrusionLayer({
    required this.id,
    required this.bucket,
    required this.fill,
    required this.minZoom,
    required this.maxZoom,
    required this.opacity,
    this.translate,
    this.translateOnScreen = false,
  });

  final String id;
  final int bucket;
  final int fill;
  final double minZoom;
  final double maxZoom;
  final Expr opacity;

  /// `fill-extrusion-translate`, in pixels, turned with the map unless
  /// [translateOnScreen].
  final Expr? translate;
  final bool translateOnScreen;

  /// Whether the buildings are drawn at map zoom [zoom]: at once, as
  /// MapLibre's `isHidden` decides.
  bool showsAt(double zoom) => zoom >= minZoom && zoom < maxZoom;

  /// How far [translate] moves the buildings at [context], in world pixels
  /// across the ground, on a map turned [bearing] degrees.
  (double, double) moved(EvalContext context, double bearing) {
    final by = translate?.call(context);
    if (by is! List || by.length != 2) return (0, 0);
    final x = (asNumber(by[0]) ?? 0).toDouble();
    final y = (asNumber(by[1]) ?? 0).toDouble();
    if (!translateOnScreen || bearing == 0) return (x, y);
    final turn = bearing * math.pi / 180;
    final c = math.cos(turn), s = math.sin(turn);
    return (x * c - y * s, x * s + y * c);
  }
}
