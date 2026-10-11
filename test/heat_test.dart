import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/heat.dart';
import 'package:vmap/src/style.dart';

HeatPaint _heat(Object? color) => HeatPaint.of(
  weight: compileExpr(1),
  intensity: compileExpr(1),
  color: color,
);

/// What the bands make of [density] when drawn one over the other, as red,
/// green, blue and alpha from 0 to 1.
List<double> _colour(List<List<double>> bands, double density) {
  var out = [0.0, 0.0, 0.0, 0.0];
  for (final m in bands) {
    final a = ((m[18] * density * 255 + m[19]) / 255).clamp(0.0, 1.0);
    out = [
      m[4] / 255 * a + out[0] * (1 - a),
      m[9] / 255 * a + out[1] * (1 - a),
      m[14] / 255 * a + out[2] * (1 - a),
      a + out[3] * (1 - a),
    ];
  }
  return out;
}

void main() {
  const ramp = [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(0,0,255,0)',
    0.5,
    'rgb(0,0,255)',
    1,
    'rgb(255,0,0)',
  ];

  test('a linear ramp is drawn between its own stops', () {
    expect(_heat(ramp).stops, [0, 0.5, 1]);
  });

  test('any other ramp is drawn on an even ladder', () {
    final heat = _heat([
      'step',
      ['heatmap-density'],
      'rgba(0,0,0,0)',
      0.5,
      'red',
    ]);
    expect(heat.stops, hasLength(9));
    expect(heat.stops.first, 0);
    expect(heat.stops.last, 1);
  });

  test('the bands on top of each other follow the ramp', () {
    final bands = heatBands(_heat(ramp), EvalContext());
    expect(bands, hasLength(2));
    expect(_colour(bands, 0), [0, 0, 0, 0]);
    final faint = _colour(bands, 0.25);
    expect(faint[3], closeTo(0.5, 1e-9));
    expect(faint[2], closeTo(0.5, 1e-9));
    expect(_colour(bands, 0.5), [0, 0, closeTo(1, 1e-9), closeTo(1, 1e-9)]);
    final warm = _colour(bands, 0.75);
    expect(warm[0], closeTo(0.5, 1e-9));
    expect(warm[2], closeTo(0.5, 1e-9));
    expect(warm[3], closeTo(1, 1e-9));
    expect(_colour(bands, 1)[0], closeTo(1, 1e-9));
    expect(_colour(bands, 3)[0], closeTo(1, 1e-9));
  });

  test('a heatmap layer is drawn in a run of its own', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'mine': {
          'type': 'geojson',
          'data': {'type': 'FeatureCollection', 'features': <Object>[]},
        },
      },
      'layers': [
        {'id': 'dots', 'type': 'circle', 'source': 'mine'},
        {'id': 'heat', 'type': 'heatmap', 'source': 'mine'},
        {'id': 'rings', 'type': 'circle', 'source': 'mine'},
      ],
    });
    expect(sheet.runs, hasLength(3));
  });
}
