import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tessellate.dart';

MeshChunk _corner(LineJoin join, {bool offsets = false}) {
  final mesher = LineMesher(
    join: join,
    offsets: offsets,
  )..addLine(Float64List.fromList([0, 0, 10, 0, 10, 10]), 0, 3, 0, caps: false);
  return mesher.finish().single;
}

StyleSheet _sheet(Map<String, Object?> layout, Map<String, Object?> paint) =>
    StyleSheet.compile({
      'version': 8,
      'sources': {
        'mine': {
          'type': 'geojson',
          'data': {'type': 'FeatureCollection', 'features': <Object>[]},
        },
      },
      'layers': [
        {
          'id': 'road',
          'type': 'line',
          'source': 'mine',
          'layout': layout,
          'paint': paint,
        },
      ],
    });

void main() {
  test('a mitre join shares its corner and reaches past it', () {
    final chunk = _corner(LineJoin.miter);
    expect(chunk.indices.length, 12);
    final reach = [
      for (var i = 0; i < chunk.extrusions!.length; i += 2)
        chunk.extrusions![i].abs() + chunk.extrusions![i + 1].abs(),
    ];
    expect(reach.reduce((a, b) => a > b ? a : b), closeTo(2, 1e-6));
  });

  test('a bevel join closes the corner with one triangle', () {
    expect(_corner(LineJoin.bevel).indices.length, 12 + 3);
    expect(_corner(LineJoin.round).indices.length, greaterThan(12 + 3));
    expect(_corner(LineJoin.none).indices.length, 12);
  });

  test('a mitre join gives way to a bevel on a hairpin', () {
    final mesher = LineMesher(
      join: LineJoin.miter,
    )..addLine(Float64List.fromList([0, 0, 10, 0, 0, 1]), 0, 3, 0, caps: false);
    expect(mesher.finish().single.indices.length, 12 + 3);
  });

  test('offsets point to the right of the line and meet at the corner', () {
    final chunk = _corner(LineJoin.miter, offsets: true);
    final offsets = chunk.offsets!;
    final positions = chunk.positions;
    for (var i = 0; i < positions.length; i += 2) {
      final x = positions[i];
      final y = positions[i + 1];
      if (x == 0 && y == 0) {
        expect([offsets[i], offsets[i + 1]], [0, 1]);
      } else if (x == 10 && y == 0) {
        expect([offsets[i], offsets[i + 1]], [-1, 1]);
      } else if (x == 10 && y == 10) {
        expect([offsets[i], offsets[i + 1]], [-1, 0]);
      }
    }
    expect(_corner(LineJoin.miter).offsets, isNull);
  });

  test('the style reads line-join and line-offset', () {
    final plain = _sheet({}, {});
    expect(plain.buckets.single.join, LineJoin.miter);
    expect(plain.buckets.single.offset, isFalse);
    expect((plain.layers.single as LineLayer).offset, isNull);

    final moved = _sheet({'line-join': 'round'}, {'line-offset': 3});
    expect(moved.buckets.single.join, LineJoin.round);
    expect(moved.buckets.single.offset, isTrue);
    expect((moved.layers.single as LineLayer).offset, isNotNull);
    expect(moved.shape, isNot(plain.shape));
  });

  test('the style reads dash caps and line-blur', () {
    final dashed = _sheet(
      {'line-cap': 'round'},
      {
        'line-dasharray': [2, 2],
        'line-blur': 1,
      },
    );
    expect((dashed.layers.single as LineLayer).dashCap, DashCap.round);
    expect((dashed.layers.single as LineLayer).dash, [2, 2]);
    expect((dashed.layers.single as LineLayer).blur, isNotNull);
    expect(dashed.buckets.single.edged, isFalse);
    expect(dashed.buckets.single.caps, isFalse);

    final solid = _sheet(
      {'line-cap': 'round'},
      {
        'line-dasharray': [12, 0],
      },
    );
    expect((solid.layers.single as LineLayer).dash, isNull);
    expect(solid.buckets.single.caps, isTrue);

    final soft = _sheet({}, {'line-blur': 1});
    expect((soft.layers.single as LineLayer).blur, isNotNull);
    expect(soft.buckets.single.edged, isTrue);
    expect(soft.buckets.single.dashed, isTrue);
    expect(_sheet({}, {}).buckets.single.edged, isFalse);
  });

  test('the rim of a cap sits on the edge of a line that fades out', () {
    MeshChunk capped({required bool edged}) => (LineMesher(
      distances: true,
      edged: edged,
    )..addLine(Float64List.fromList([0, 0, 10, 0]), 0, 2, 0)).finish().single;
    int onTheMiddle(MeshChunk chunk) => [
      for (var i = 1; i < chunk.distances!.length; i += 2)
        if (chunk.distances![i] == 0.5) i,
    ].length;

    expect(
      onTheMiddle(capped(edged: false)),
      greaterThan(onTheMiddle(capped(edged: true))),
    );
  });

  test('the style reads text-rotate and background-pattern', () {
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
          'id': 'ground',
          'type': 'background',
          'paint': {'background-pattern': 'sand', 'background-opacity': 0.5},
        },
        {
          'id': 'names',
          'type': 'symbol',
          'source': 'mine',
          'layout': {'text-field': 'x', 'text-rotate': 30},
        },
      ],
    });
    final context = EvalContext();
    expect(sheet.backgroundPattern!(context), 'sand');
    expect(sheet.backgroundOpacity(context), 0.5);
    expect(sheet.symbols.single.textRotate, 30);
    expect(_sheet({}, {}).backgroundPattern, isNull);
  });
}
