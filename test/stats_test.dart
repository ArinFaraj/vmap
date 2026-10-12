import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';

void main() {
  test('resetting the timers starts every running count again', () {
    final stats = VmapStats();
    stats.timings
      ..frame(
        paint: 9000,
        labels: 1,
        place: 1,
        raster: 1,
        prep: 1,
        draw: 1,
        unpack: 1,
        describe: () => 'slow',
      )
      ..stroke(5)
      ..tileSetup(5)
      ..labels.rasterized = 5;
    expect(stats.timings.slowPaints, ['slow']);
    stats.resetTimers();
    expect(stats.timings.frames, 0);
    expect(stats.timings.maxPaintMicros, 0);
    expect(stats.timings.labels.rasterized, 0);
    expect(stats.timings.slowPaints, isEmpty);
  });

  test('label work is added in and started again', () {
    final into = VmapLabelWork();
    final from = VmapLabelWork()
      ..images = 2
      ..evicted = 1;
    into.take(from);
    into.take(from..images = 3);
    expect(into.images, 5);
    expect(into.evicted, 1);
    expect(from.images, 0);
  });
}
