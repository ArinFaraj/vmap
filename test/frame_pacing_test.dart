import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/render/frame_pacing.dart';

void main() {
  /// Adds [frames] frames of [micros] to [pacing].
  void run(FramePacing pacing, int frames, int micros) {
    for (var i = 0; i < frames; i++) {
      pacing.addFrame(micros);
    }
  }

  test('a map that has not been measured works at the shares it always has', () {
    final pacing = FramePacing();
    expect(pacing.pressure, 1);
    expect(pacing.prepMicros, 1500);
    expect(pacing.labelRasterMicros, 1000);
    expect(pacing.placeSliceMicros, 1000);
  });

  test('a fast map gives tiles and label text more of each frame', () {
    final pacing = FramePacing();
    run(pacing, 20, 4000);
    expect(pacing.pressure, 0);
    expect(pacing.prepMicros, 2500);
    expect(pacing.labelRasterMicros, 2000);
    expect(pacing.placeSliceMicros, 1500);
  });

  test('a slow map keeps to what shows, and no more', () {
    final pacing = FramePacing();
    run(pacing, 20, 13000);
    expect(pacing.pressure, 2);
    expect(pacing.prepMicros, 750);
    expect(pacing.labelRasterMicros, 500);
    expect(pacing.placeSliceMicros, 600);
  });

  test('one slow frame among fast ones holds nothing back', () {
    final pacing = FramePacing();
    run(pacing, 19, 4000);
    pacing.addFrame(20000);
    // A frame of 20 ms among nineteen of 4 ms averages 4.8 ms, which is
    // room to spare: the one slow frame is not answered by holding work
    // back, which would only make the map fill in more slowly.
    expect(pacing.frameMicros, (19 * 4000 + 20000) ~/ 20);
    expect(pacing.pressure, 0);
    expect(pacing.prepMicros, 2500);
  });

  test('a level is left well past where it was entered', () {
    final pacing = FramePacing();
    run(pacing, 20, 13000);
    expect(pacing.pressure, 2);
    // Under the tight limit but not yet relaxed: still at the tightest.
    run(pacing, 20, 11000);
    expect(pacing.pressure, 2);
    run(pacing, 20, 9000);
    expect(pacing.pressure, 1);
    // Above the calm limit: the middle level holds.
    run(pacing, 20, 8000);
    expect(pacing.pressure, 1);
    run(pacing, 20, 6000);
    expect(pacing.pressure, 0);
  });

  test('the average follows the last twenty frames only', () {
    final pacing = FramePacing();
    run(pacing, 20, 13000);
    expect(pacing.frameMicros, 13000);
    run(pacing, 20, 3000);
    expect(pacing.frameMicros, 3000);
    expect(pacing.pressure, 0);
  });
}
