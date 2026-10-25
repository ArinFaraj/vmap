import 'dart:math' as math;

/// How much larger than its own size a pattern is drawn at style zoom
/// [zoom]: as in MapLibre, a pattern is held to the tiles of the whole zoom
/// below, so it grows to twice its size and starts again at each zoom.
double patternGrowth(double zoom) =>
    math.pow(2, zoom - zoom.floor()).toDouble();
