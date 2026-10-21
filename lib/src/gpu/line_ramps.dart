import 'dart:math' as math;

import 'package:flutter/foundation.dart';

import 'gpu_shim/gpu.dart' as gpu;

import 'package:vmap/renderer.dart';

/// What lines read along their length, a row of [width] texels each in one
/// texture, made again when the style changes: a gradient line layer's
/// colours from its start to its end, a heatmap layer's colours from no
/// density to full, and a dashed layer's pattern as the signed distance to
/// the nearest dash end.
class LineRamps {
  /// Texels a row, as MapLibre's ramp: 256, or for a stepped gradient as
  /// many as a long line's short steps need, which MapLibre takes up to the
  /// GPU's limit.
  int width = 256;
  static const _stepWidth = 4096;

  StyleSheet? _sheet;
  final Map<int, double> _gradients = {};
  final Map<int, List<double>> _dashes = {};

  /// How many rows the ramp texture has.
  int rowCount = 0;

  /// Null while the style has no gradient or dashed lines.
  gpu.Texture? texture;

  /// Where the gradient or heatmap row of style layer [layer] is, from 0 at
  /// the texture's top to 1 at its bottom; null for a layer without one.
  double? gradientOf(int layer) => _gradients[layer];

  /// [gradientOf], negated for a stepped gradient, which is sampled at the
  /// nearest texel.
  double? gradientRowOf(int layer) {
    final row = _gradients[layer];
    if (row == null) return null;
    final steps = switch (_sheet?.layers[layer]) {
      final LineLayer line => line.gradientSteps,
      _ => false,
    };
    return steps ? -row : row;
  }

  /// Where the dash row of style layer [layer] at style zoom [zoom] is, as
  /// [gradientOf]; null for a layer without dashes.
  /// A dasharray read from each feature gives the row of its [choice].
  double? dashOf(int layer, double zoom, {int? choice}) {
    final rows = _dashes[layer];
    if (rows == null) return null;
    if (choice != null) return choice < rows.length ? rows[choice] : null;
    final line = _sheet!.layers[layer] as LineLayer;
    var at = 0;
    for (var i = 0; i < line.dashStops.length; i++) {
      if (zoom >= line.dashStops[i].$1) at = i;
    }
    return rows[math.min(at, rows.length - 1)];
  }

  void update(StyleSheet sheet, EvalContext context) {
    if (identical(sheet, _sheet)) return;
    _sheet = sheet;
    _gradients.clear();
    _dashes.clear();
    texture = null;
    final ramps = <(int, Expr)>[];
    final dashes = <(int, LineLayer)>[];
    for (var i = 0; i < sheet.layers.length; i++) {
      if (sheet.layers[i] case final LineLayer line
          when line.gradient != null) {
        ramps.add((i, line.gradient!));
      } else if (sheet.layers[i] case final HeatmapLayer heat) {
        ramps.add((i, heat.heat.ramp));
      }
      if (sheet.layers[i] case final LineLayer line
          when (line.dash?.fold(0.0, (a, b) => a + b) ?? 0) > 0) {
        dashes.add((i, line));
      }
    }
    final patterns = [
      for (final (_, line) in dashes)
        line.dashChoices.isNotEmpty
            ? line.dashChoices
            : line.dashStops.isEmpty
            ? [line.dash!]
            : [for (final (_, d) in line.dashStops) d],
    ];
    width = sheet.layers.any((l) => l is LineLayer && l.gradientSteps)
        ? _stepWidth
        : 256;
    final rows = ramps.length + patterns.fold<int>(0, (n, p) => n + p.length);
    rowCount = rows;
    if (rows == 0) return;
    final bytes = Uint8List(width * rows * 4);
    int byte(double v) => (v.clamp(0.0, 1.0) * 255).round();
    for (var row = 0; row < ramps.length; row++) {
      final (layer, gradient) = ramps[row];
      _gradients[layer] = (row + 0.5) / rows;
      for (var x = 0; x < width; x++) {
        context.progress = x / (width - 1);
        final c = Rgba.of(gradient(context));
        if (c == null) continue;
        final o = (row * width + x) * 4;
        bytes
          ..[o] = byte(c.r * c.a)
          ..[o + 1] = byte(c.g * c.a)
          ..[o + 2] = byte(c.b * c.a)
          ..[o + 3] = byte(c.a);
      }
    }
    context.progress = 0;
    var row = ramps.length;
    for (var k = 0; k < dashes.length; k++) {
      final (layer, line) = dashes[k];
      final at = _dashes[layer] = [];
      for (final dash in patterns[k]) {
        at.add((row + 0.5) / rows);
        final distances = dashDistances(
          dash,
          width,
          dots: line.dashCap == DashCap.round,
        );
        for (var x = 0; x < width; x++) {
          final v = byte(0.5 + distances[x] * 254 / 255);
          final o = (row * width + x) * 4;
          bytes
            ..[o] = v
            ..[o + 1] = v
            ..[o + 2] = v
            ..[o + 3] = v;
        }
        row++;
      }
    }
    try {
      texture = gpu.gpuContext.createTexture(
        gpu.StorageMode.hostVisible,
        width,
        rows,
        format: gpu.PixelFormat.r8g8b8a8UNormInt,
      )..overwrite(ByteData.sublistView(bytes));
    } catch (e) {
      _gradients.clear();
      _dashes.clear();
      debugPrint('vmap: the line ramps are not on the GPU: $e');
    }
  }

  /// At [samples] points over one repeat of [dash], dashes and gaps in
  /// turn, the signed distance to the nearest dash end as a share of the
  /// repeat: positive inside a dash, negative in a gap. Dashes that touch
  /// are one dash. A dash of length 0 is a point when [dots], which round
  /// caps draw as a dot, and nothing otherwise.
  @visibleForTesting
  static Float64List dashDistances(
    Float64List dash,
    int samples, {
    bool dots = false,
  }) {
    final period = dash.fold(0.0, (a, b) => a + b);
    var spans = <(double, double)>[];
    var at = 0.0;
    for (var i = 0; i < dash.length; i++) {
      if (i.isEven) spans.add((at, at + dash[i]));
      at += dash[i];
    }
    // An odd count ends on a dash, which runs on into the first.
    if (dash.length.isOdd && spans.length > 1) {
      final (start, _) = spans.removeLast();
      spans[0] = (start - period, spans[0].$2);
    }
    if (!dots) spans.removeWhere((s) => s.$2 <= s.$1);
    final out = Float64List(samples);
    if (spans.isEmpty) return out..fillRange(0, samples, -0.5);
    final merged = <(double, double)>[spans.first];
    for (final span in spans.skip(1)) {
      final (from, to) = merged.last;
      if (span.$1 <= to) {
        merged.last = (from, math.max(to, span.$2));
      } else {
        merged.add(span);
      }
    }
    if (merged.length > 1 && merged.last.$2 >= merged.first.$1 + period) {
      final (from, _) = merged.removeLast();
      merged[0] = (from - period, merged[0].$2);
    }
    spans = merged;
    if (spans.any((s) => s.$2 - s.$1 >= period)) {
      return out..fillRange(0, samples, 0.5);
    }
    for (var s = 0; s < samples; s++) {
      final x = (s + 0.5) / samples * period;
      var best = -double.infinity;
      for (final (from, to) in spans) {
        for (final shift in [-period, 0.0, period]) {
          final a = from + shift, b = to + shift;
          final d = x < a ? x - a : (x > b ? b - x : math.min(x - a, b - x));
          if (d > best) best = d;
        }
      }
      out[s] = (best / period).clamp(-0.5, 0.5);
    }
    return out;
  }
}
