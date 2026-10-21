import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/camera/mercator.dart';

void main() {
  test('a pole lands on the edge of the world instead of off it', () {
    expect(worldY(90), closeTo(0, 1e-4));
    expect(worldY(-90), closeTo(1, 1e-4));
    expect(worldY(90).isFinite, isTrue);
  });

  test('a position goes to the world and back', () {
    expect(longitudeAt(worldX(44.0)), closeTo(44.0, 1e-9));
    expect(latitudeAt(worldY(36.19)), closeTo(36.19, 1e-9));
  });

  test('tile rows and columns stay inside the zoom', () {
    expect(tileColumn(180, 3), 7);
    expect(tileColumn(-180, 3), 0);
    expect(tileRow(90, 3), 0);
    expect(tileRow(-90, 3), 7);
    expect(tileZoomAt(15.5, 14), 14);
    expect(tileZoomAt(0.5, 14), 0);
  });
}
