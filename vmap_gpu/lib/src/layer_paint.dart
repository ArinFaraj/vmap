import 'dart:math' as math;
import 'dart:typed_data';

import 'package:vmap/renderer.dart';

/// A fill or line layer's paint for one frame, in screen pixels.
class LayerPaint {
  /// What a fill outline's line gives in place of its gap.
  static const outlineCode = 6.0;

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
    this.blur = 0,
    this.translateOnScreen = false,
    this.tint,
  ]);

  /// A circle: [halfWidth] is its radius, [offset] its ring's width,
  /// [dashOn] its ring's colour packed as red plus 256 green plus 65536
  /// blue and [dashPeriod] the ring's alpha. A dashed line: [dashOn] is its
  /// cap's index in [DashCap] and [dashPeriod] one repeat's length in
  /// logical pixels.
  final bool circle;

  /// The sprite a patterned fill or line repeats.
  final String? pattern;

  /// A line drawn as two: the share of its half width the gap down its
  /// middle takes.
  final double gapShare;

  /// `line-blur`, in screen pixels.
  final double blur;

  /// The translate is along the screen's sides, not the map's.
  final bool translateOnScreen;

  /// A patterned fill's colour, premultiplied, for a pattern that is a
  /// distance field.
  final Rgba? tint;

  final double r, g, b, a;
  final double halfWidth, offset, translateX, translateY, dashOn, dashPeriod;

  static final clear = LayerPaint(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  /// Floats a shader slot takes: three vec4.
  static const slotFloats = 12;

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
          blur,
          translateOnScreen,
          tint,
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
      var gapShare = 0.0, blur = 0.0;
      if (layer is LineLayer) {
        blur = math.max(
          0,
          (asNumber(layer.blur?.call(context)) ?? 0).toDouble(),
        );
        width = (asNumber(layer.width(context)) ?? 0).toDouble();
        if (width <= 0) return clear;
        final gap = (asNumber(layer.gap?.call(context)) ?? 0).toDouble();
        if (gap > 0 && width > 0) gapShare = (gap / width).clamp(0.0, 1.0);
        if (layer.outline) gapShare = -outlineCode;
        offset = (asNumber(layer.offset?.call(context)) ?? 0).toDouble();
        if (layer.dashAt(styleZoom) case final dash?) {
          // As MapLibre's line-floorwidth: dashes are as long as the line
          // is wide at the zoom level's floor.
          final zoom = context.zoom;
          context.zoom = styleZoom.floorToDouble();
          final floorWidth = (asNumber(layer.width(context)) ?? 0).toDouble();
          context.zoom = zoom;
          dashOn = layer.dashCap.index.toDouble();
          dashPeriod = dash.fold(0.0, (a, b) => a + b) * floorWidth;
        }
      }
      var tx = 0.0, ty = 0.0;
      if (layer is MeshLayer) {
        final moved = layer.translate?.call(context);
        if (moved is List && moved.length == 2) {
          tx = (asNumber(moved[0]) ?? 0).toDouble();
          ty = (asNumber(moved[1]) ?? 0).toDouble();
        }
      }
      if (layer is HeatmapLayer) {
        // Its opacity is laid on when the density is coloured.
        final strength =
            (asNumber(layer.heat.weight(context)) ?? 1) *
            (asNumber(layer.heat.intensity(context)) ?? 1);
        if (strength <= 0) return clear;
        final diameter = (asNumber(layer.width(context)) ?? 0).toDouble();
        if (diameter <= 0) return clear;
        return LayerPaint(
          strength.toDouble(),
          0,
          0,
          1,
          diameter / 2,
          0,
          0,
          0,
          0,
          0,
        );
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
          tx,
          ty,
          ringRgb,
          ringAlpha,
          null,
          true,
          0,
          0,
          layer.translateOnScreen,
        );
      }
      final pattern = switch (layer) {
        PatternedLayer(:final pattern?) => pattern(context),
        _ => null,
      };
      final tint = switch (layer) {
        FillLayer(:final patternTint?) => Rgba.of(patternTint(context)),
        FillLayer(:final outline?) => switch (Rgba.of(outline(context))) {
          final c? => Rgba(
            c.r,
            c.g,
            c.b,
            (c.a * (asNumber(layer.opacity(context)) ?? 1)).clamp(0.0, 1.0),
          ),
          null => null,
        },
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
        blur,
        layer.translateOnScreen,
        tint,
      );
    } finally {
      if (props != null) context.props = const {};
    }
  }

  /// Writes this paint into the [slotFloats] of a shader slot at [o], laid
  /// out for [kind] as `map.vert` reads them; lengths in tile units for a
  /// tile [scale] screen pixels to the unit on a map turned [bearing]
  /// degrees. [sprites] places patterns, [rampRow] is a gradient line's row
  /// in the line ramps and [dashRow] a dashed line's. A patterned fill's
  /// pattern is [growth] times its size.
  void writeSlot(
    Float32List out,
    int o,
    int kind,
    double scale,
    SpriteSheet? sprites,
    double? rampRow,
    double? dashRow, {
    double growth = 1,
    double bearing = 0,
  }) {
    var tx = translateX, ty = translateY;
    if (translateOnScreen && bearing != 0) {
      final turn = bearing * math.pi / 180;
      final c = math.cos(turn), s = math.sin(turn);
      (tx, ty) = (tx * c - ty * s, tx * s + ty * c);
    }
    out
      ..[o + 8] = tx / scale
      ..[o + 9] = ty / scale
      ..[o + 10] = blur / scale
      ..[o + 11] = 0;
    void put(
      double a,
      double b,
      double c,
      double d,
      double e,
      double f,
      double g,
      double h,
    ) {
      out
        ..[o] = a
        ..[o + 1] = b
        ..[o + 2] = c
        ..[o + 3] = d
        ..[o + 4] = e
        ..[o + 5] = f
        ..[o + 6] = g
        ..[o + 7] = h;
    }

    final entry = pattern == null ? null : sprites?.entries[pattern];
    final source = entry?.source;
    switch (kind) {
      case GpuStream.circle:
        // dashOn and dashPeriod carry the ring's colour and alpha.
        put(r, g, b, a, halfWidth / scale, offset / scale, dashOn, dashPeriod);
      case GpuStream.heat:
        // A heatmap's point: its weight times the intensity, and its
        // radius.
        put(r, 0, 0, 1, halfWidth / scale, 0, 0, 0);
      case GpuStream.gradientLine:
        put(
          rampRow ?? 0,
          1 / GpuStream.progressSpan,
          0,
          rampRow == null ? 0 : a,
          halfWidth / scale,
          offset / scale,
          0,
          0,
        );
      case GpuStream.patternedLine:
        // Stretched across the line's width and repeated along it, as the
        // canvas draws it.
        final length = source == null || source.height <= 0
            ? 0.0
            : source.width / source.height * halfWidth * 2 / scale;
        put(
          halfWidth / scale,
          offset / scale,
          length > 0 ? length : 1,
          length > 0 ? a : 0,
          source?.left ?? 0,
          source?.top ?? 0,
          source?.width ?? 1,
          source?.height ?? 1,
        );
      case GpuStream.patterned:
        // A distance field pattern takes the fill's colour, packed as red
        // plus 256 green plus 65536 blue, and q.w says so.
        final tint = this.tint;
        final sdf = entry != null && entry.sdf && tint != null;
        if (sdf) out[o + 11] = 1;
        put(
          (entry?.pixelRatio ?? 1) / growth,
          entry?.pixelRatio ?? 1,
          sdf ? _packed(tint) : 0,
          entry == null ? 0 : (sdf ? a * tint.a : a),
          source?.left ?? 0,
          source?.top ?? 0,
          source?.width ?? 1,
          source?.height ?? 1,
        );
      case GpuStream.fill:
        // p.zw: the outline's colour, packed as a ring's, and its alpha.
        final tint = this.tint;
        put(
          r,
          g,
          b,
          a,
          tx / scale,
          ty / scale,
          tint == null ? 0 : _packed(tint),
          tint?.a ?? 0,
        );
      default:
        // A dashed line gives its dash row plus twice its cap's index and
        // the length of one repeat. Otherwise the repeat is zero, and a
        // line drawn as two gives its gap's share of the half width,
        // negated, and a fill's outline [outlineCode].
        final dashed = dashRow != null && dashPeriod > 0;
        put(
          r,
          g,
          b,
          a,
          halfWidth / scale,
          offset / scale,
          dashed ? dashRow + 2 * dashOn : -gapShare,
          dashed ? dashPeriod / scale : 0,
        );
    }
  }

  static double _packed(Rgba c) {
    int byte(double v) => (v * 255).round().clamp(0, 255);
    return (byte(c.r) + byte(c.g) * 256 + byte(c.b) * 65536).toDouble();
  }
}
