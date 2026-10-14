import 'dart:typed_data';

import 'package:flutter/foundation.dart';
import 'package:flutter_gpu/gpu.dart' as gpu;
import 'package:vmap/renderer.dart';

/// Every gradient line layer's colours from the start of a line to its
/// end, a row of [width] texels each in one texture, made again when the
/// style changes.
class GradientRamps {
  static const width = 256;

  StyleSheet? _sheet;
  final Map<int, double> _rows = {};

  /// Null while the style has no gradient lines.
  gpu.Texture? texture;

  /// Where the row of style layer [layer] is, from 0 at the texture's top
  /// to 1 at its bottom; null for a layer without a gradient.
  double? rowOf(int layer) => _rows[layer];

  void update(StyleSheet sheet, EvalContext context) {
    if (identical(sheet, _sheet)) return;
    _sheet = sheet;
    _rows.clear();
    texture = null;
    final ramps = [
      for (var i = 0; i < sheet.layers.length; i++)
        if (sheet.layers[i] case LineLayer(:final gradient?)) (i, gradient),
    ];
    if (ramps.isEmpty) return;
    final bytes = Uint8List(width * ramps.length * 4);
    int byte(double v) => (v.clamp(0.0, 1.0) * 255).round();
    for (var row = 0; row < ramps.length; row++) {
      final (layer, gradient) = ramps[row];
      _rows[layer] = (row + 0.5) / ramps.length;
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
    try {
      texture = gpu.gpuContext.createTexture(
        gpu.StorageMode.hostVisible,
        width,
        ramps.length,
        format: gpu.PixelFormat.r8g8b8a8UNormInt,
      )..overwrite(ByteData.sublistView(bytes));
    } catch (e) {
      _rows.clear();
      debugPrint('vmap_gpu: the line gradients are not on the GPU: $e');
    }
  }
}
