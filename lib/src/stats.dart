import 'dart:math' as math;

/// What the last frame drew, and what the UI thread has spent since
/// [resetTimers].
class VmapStats {
  int tilesDrawn = 0;
  int fallbackTiles = 0;
  int tilesCached = 0;
  int tilesLoading = 0;
  int drawCalls = 0;
  int labelStates = 0;
  int labelSprites = 0;

  /// Running totals and longest single costs, in microseconds unless named
  /// otherwise.
  VmapTimings timings = VmapTimings();

  /// Starts every running total again.
  void resetTimers() => timings = VmapTimings();
}

/// What the UI thread has spent, added up over frames.
class VmapTimings {
  int frames = 0;
  int paintMicros = 0;
  int maxPaintMicros = 0;
  int paintsOver4ms = 0;
  int paintsOver8ms = 0;
  int labelMicros = 0;
  int maxLabelMicros = 0;
  int placeMicros = 0;
  int maxPlaceMicros = 0;
  int labelRasterMicros = 0;
  int maxLabelRasterMicros = 0;
  int maxPrepMicros = 0;
  int maxDrawMicros = 0;
  int maxUnpackMicros = 0;
  int strokeMicros = 0;
  int strokesBuilt = 0;
  int tileSetupMicros = 0;
  int maxTileSetupMicros = 0;

  /// What drawing label text cost.
  final VmapLabelWork labels = VmapLabelWork();

  /// One line per paint that took over 5 ms, newest last.
  final List<String> slowPaints = [];

  /// Adds one frame that took [paint] in all, of which [labels] on labels:
  /// [place] placing them and [raster] drawing their text, [prep] preparing
  /// tiles and [draw] drawing the rest.
  void frame({
    required int paint,
    required int labels,
    required int place,
    required int raster,
    required int prep,
    required int draw,
    required int unpack,
    required String Function() describe,
  }) {
    frames++;
    paintMicros += paint;
    maxPaintMicros = math.max(maxPaintMicros, paint);
    if (paint > 4000) paintsOver4ms++;
    if (paint > 8000) paintsOver8ms++;
    if (paint > 5000) {
      if (slowPaints.length >= 300) slowPaints.removeAt(0);
      slowPaints.add(describe());
    }
    labelMicros += labels;
    maxLabelMicros = math.max(maxLabelMicros, labels);
    placeMicros += place;
    maxPlaceMicros = math.max(maxPlaceMicros, place);
    labelRasterMicros += raster;
    maxLabelRasterMicros = math.max(maxLabelRasterMicros, raster);
    maxPrepMicros = math.max(maxPrepMicros, prep);
    maxDrawMicros = math.max(maxDrawMicros, draw);
    maxUnpackMicros = math.max(maxUnpackMicros, unpack);
  }

  void stroke(int micros) {
    strokeMicros += micros;
    strokesBuilt++;
  }

  void tileSetup(int micros) {
    tileSetupMicros += micros;
    maxTileSetupMicros = math.max(maxTileSetupMicros, micros);
  }
}

/// What drawing label text cost.
class VmapLabelWork {
  int rasterized = 0;

  /// Time spent laying label text out, and turning it into images.
  int layoutMicros = 0;
  int imageMicros = 0;

  /// How many images labels were drawn into.
  int images = 0;
  int resized = 0;
  int evicted = 0;
  int statesWalked = 0;

  /// Adds [other] to this and starts [other] again.
  void take(VmapLabelWork other) {
    rasterized += other.rasterized;
    layoutMicros += other.layoutMicros;
    imageMicros += other.imageMicros;
    images += other.images;
    resized += other.resized;
    evicted += other.evicted;
    statesWalked += other.statesWalked;
    other
      ..rasterized = 0
      ..layoutMicros = 0
      ..imageMicros = 0
      ..images = 0
      ..resized = 0
      ..evicted = 0
      ..statesWalked = 0;
  }
}
