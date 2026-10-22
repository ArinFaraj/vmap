import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';

Map<String, Object?> _doc() => {
  'version': 8,
  'sources': <String, Object?>{},
  'layers': [
    {
      'id': 'land',
      'type': 'background',
      'paint': {'background-color': '#eeeeee'},
    },
  ],
};

void main() {
  test('a style decoded again with the same content is the same style', () {
    expect(VmapStyle.json(_doc()), VmapStyle.json(_doc()));
    final changed = _doc();
    (((changed['layers']! as List).first as Map)['paint']
            as Map)['background-color'] =
        '#000000';
    expect(VmapStyle.json(changed), isNot(VmapStyle.json(_doc())));
  });

  test('an overlay built again with the same content is the same overlay', () {
    VmapOverlay build(List<double> at) => VmapOverlay(
      sources: {
        'spot': {
          'type': 'geojson',
          'data': {
            'type': 'Point',
            'coordinates': [...at],
          },
        },
      },
      layers: const [
        {'id': 'spot', 'type': 'circle', 'source': 'spot'},
      ],
    );
    expect(build([44, 36]), build([44, 36]));
    expect(build([44, 36]), isNot(build([44, 37])));
  });

  test('feature states compare by what they say', () {
    VmapFeatureState state(bool picked) =>
        VmapFeatureState(source: 'mine', id: 7, state: {'picked': picked});
    expect(state(true), state(true));
    expect(state(true), isNot(state(false)));
  });
}
