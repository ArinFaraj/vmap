import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style.dart';

void main() {
  test('zoom stops interpolate geometrically and clamp at the ends', () {
    const stops = ZoomStops([10, 12], [1, 4]);
    expect(stops.at(9), 1);
    expect(stops.at(11), closeTo(2, 1e-9));
    expect(stops.at(13), 4);
  });
}
