import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu_stream.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tessellate.dart';
import 'package:vmap/src/tile_builder.dart' show BuiltMesh;

void main() {
  final sheet = StyleSheet.compile({
    'version': 8,
    'sources': {
      'mine': {
        'type': 'geojson',
        'data': {'type': 'FeatureCollection', 'features': <Object>[]},
      },
    },
    'layers': [
      {
        'id': 'plain',
        'type': 'line',
        'source': 'mine',
        'paint': {'line-color': '#f00'},
      },
      {
        'id': 'patterned',
        'type': 'line',
        'source': 'mine',
        'paint': {'line-pattern': 'dots'},
      },
      {
        'id': 'gradient',
        'type': 'line',
        'source': 'mine',
        'paint': {
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            '#000',
            1,
            '#fff',
          ],
        },
      },
    ],
  });

  BuiltMesh mesh(int layer) {
    final bucket = sheet.buckets[sheet.layers[layer].bucket];
    final mesher = LineMesher(distances: bucket.dashed)
      ..addLine(
        Float64List.fromList([0, 0, 100, 0, 200, 50]),
        0,
        3,
        0,
        cap: LineCap.butt,
        shareBefore: bucket.metered ? 0 : null,
        sharePer: bucket.metered ? 1 / 300 : 0,
      );
    return BuiltMesh(sheet.layers[layer].bucket, mesher.finish().single);
  }

  /// Each vertex of [layer]'s geometry as its kind, where it sits across
  /// the line in 127ths, and its distance along it.
  List<(int, int, double)> vertices(GpuStream stream, int layer) {
    final seen = <int>{};
    for (
      var i = stream.layerFirst[layer];
      i < stream.layerFirst[layer + 1];
      i++
    ) {
      seen.add(stream.indices[i]);
    }
    return [
      for (final v in seen)
        () {
          final packed = stream.vertices[v * GpuStream.floatsPerVertex + 4];
          final across = packed ~/ 131072;
          final kind = (packed - across * 131072) ~/ 16384;
          return (
            kind,
            across,
            stream.vertices[v * GpuStream.floatsPerVertex + 5].toDouble(),
          );
        }(),
    ];
  }

  test('patterned and gradient lines go to the GPU as kinds of their own', () {
    final stream = GpuStream.build(sheet, [mesh(0), mesh(1), mesh(2)])!;
    expect(vertices(stream, 0).map((v) => v.$1).toSet(), {GpuStream.line});
    expect(vertices(stream, 1).map((v) => v.$1).toSet(), {
      GpuStream.patternedLine,
    });
    expect(vertices(stream, 2).map((v) => v.$1).toSet(), {
      GpuStream.gradientLine,
    });
  });

  test('a line carries where each vertex sits across it', () {
    final stream = GpuStream.build(sheet, [mesh(1)])!;
    final across = vertices(stream, 1).map((v) => v.$2).toSet();
    expect(across, containsAll([0, 127]));
    expect(across.every((a) => a >= 0 && a <= 127), isTrue);
    final plain = GpuStream.build(sheet, [mesh(0)])!;
    expect(vertices(plain, 0).map((v) => v.$2).toSet(), {0, 127});
  });

  test('the packed slot stays an exact float', () {
    final stream = GpuStream.build(sheet, [mesh(1), mesh(2)])!;
    for (var v = 4; v < stream.vertices.length; v += 6) {
      expect(stream.vertices[v], lessThan(1 << 24));
    }
  });

  test('a gradient line runs from nought to the progress span', () {
    final stream = GpuStream.build(sheet, [mesh(2)])!;
    final along = vertices(stream, 2).map((v) => v.$3);
    expect(along.reduce((a, b) => a < b ? a : b), 0);
    expect(
      along.reduce((a, b) => a > b ? a : b),
      closeTo(GpuStream.progressSpan * (100 + 111.8) / 300, 1),
    );
  });
}
