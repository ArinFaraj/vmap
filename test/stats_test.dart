import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';

void main() {
  test('resetting the timers starts every running count again', () {
    final stats = VmapStats()
      ..paintMicros = 5
      ..labelRasterMicros = 5
      ..labelsRasterized = 5
      ..labelLayoutMicros = 5
      ..labelImageMicros = 5
      ..labelImages = 5
      ..labelStatesWalked = 5
      ..labelsResized = 5
      ..labelsEvicted = 5
      ..maxUnpackMicros = 5
      ..slowPaints.add('slow');
    stats.resetTimers();
    expect([
      stats.paintMicros,
      stats.labelRasterMicros,
      stats.labelsRasterized,
      stats.labelLayoutMicros,
      stats.labelImageMicros,
      stats.labelImages,
      stats.labelStatesWalked,
      stats.labelsResized,
      stats.labelsEvicted,
      stats.maxUnpackMicros,
    ], everyElement(0));
    expect(stats.slowPaints, isEmpty);
  });
}
