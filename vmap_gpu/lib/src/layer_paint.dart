import 'package:vmap/renderer.dart';

/// A fill or line layer's paint for one frame, in screen pixels.
class LayerPaint {
  LayerPaint(
    this.r,
    this.g,
    this.b,
    this.a,
    this.halfWidth,
    this.offset,
    this.translateX,
    this.translateY,
    this.dashOn,
    this.dashPeriod, [
    this.pattern,
    this.circle = false,
    this.gapShare = 0,
  ]);

  /// A circle: [halfWidth] is its radius, [offset] its ring's width,
  /// [dashOn] its ring's colour packed as red plus 256 green plus 65536
  /// blue and [dashPeriod] the ring's alpha.
  final bool circle;

  /// The sprite a patterned fill or line repeats.
  final String? pattern;

  /// A line drawn as two: the share of its half width the gap down its
  /// middle takes.
  final double gapShare;

  final double r, g, b, a;
  final double halfWidth, offset, translateX, translateY, dashOn, dashPeriod;

  static final clear = LayerPaint(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  /// This paint with its colour, premultiplied, and a circle's ring, times [k].
  LayerPaint scaled(double k) => k >= 1
      ? this
      : LayerPaint(
          r * k,
          g * k,
          b * k,
          a * k,
          halfWidth,
          offset,
          translateX,
          translateY,
          dashOn,
          circle ? dashPeriod * k : dashPeriod,
          pattern,
          circle,
          gapShare,
        );

  static LayerPaint of(
    PaintLayer layer,
    EvalContext context,
    double styleZoom, [
    Map<String, Object?>? props,
  ]) {
    if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) {
      return clear;
    }
    if (props != null) context.props = props;
    try {
      final color = Rgba.of(layer.color(context));
      if (color == null) return clear;
      final a = (color.a * (asNumber(layer.opacity(context)) ?? 1)).clamp(
        0.0,
        1.0,
      );
      var width = 0.0, offset = 0.0, dashOn = 0.0, dashPeriod = 0.0;
      var gapShare = 0.0;
      if (layer is LineLayer) {
        width = (asNumber(layer.width(context)) ?? 0).toDouble();
        if (width <= 0) return clear;
        final gap = (asNumber(layer.gap?.call(context)) ?? 0).toDouble();
        if (gap > 0 && width > 0) gapShare = (gap / width).clamp(0.0, 1.0);
        offset = (asNumber(layer.offset?.call(context)) ?? 0).toDouble();
        final dash = layer.dash;
        if (dash != null && dash.length >= 2 && width > 0) {
          dashOn = dash[0] * width;
          dashPeriod = (dash[0] + dash[1]) * width;
        }
      }
      if (layer is CircleLayer) {
        final diameter = (asNumber(layer.width(context)) ?? 0).toDouble();
        final ring = layer.ring;
        var ringWidth = 0.0, ringRgb = 0.0, ringAlpha = 0.0;
        if (ring != null) {
          ringWidth = (asNumber(ring.width(context)) ?? 0).toDouble();
          final ringColor = Rgba.of(ring.color(context));
          if (ringColor != null && ringWidth > 0) {
            int c(double v) => (v * 255).round().clamp(0, 255);
            ringRgb =
                (c(ringColor.r) + c(ringColor.g) * 256 + c(ringColor.b) * 65536)
                    .toDouble();
            ringAlpha = (ringColor.a * (asNumber(ring.opacity(context)) ?? 1))
                .clamp(0.0, 1.0);
          } else {
            ringWidth = 0;
          }
        }
        return LayerPaint(
          color.r * a,
          color.g * a,
          color.b * a,
          a,
          diameter / 2,
          ringWidth,
          0,
          0,
          ringRgb,
          ringAlpha,
          null,
          true,
        );
      }
      var tx = 0.0, ty = 0.0;
      if (layer is MeshLayer) {
        final moved = layer.translate?.call(context);
        if (moved is List && moved.length == 2) {
          tx = (asNumber(moved[0]) ?? 0).toDouble();
          ty = (asNumber(moved[1]) ?? 0).toDouble();
        }
      }
      final pattern = switch (layer) {
        PatternedLayer(:final pattern?) => pattern(context),
        _ => null,
      };
      return LayerPaint(
        color.r * a,
        color.g * a,
        color.b * a,
        a,
        width / 2,
        offset,
        tx,
        ty,
        dashOn,
        dashPeriod,
        pattern is String && pattern.isNotEmpty ? pattern : null,
        false,
        gapShare,
      );
    } finally {
      if (props != null) context.props = const {};
    }
  }
}
