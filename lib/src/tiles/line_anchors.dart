import 'dart:math' as math;
import 'dart:typed_data';

import 'built_tile.dart';

/// A name to lay along the [rings] of one feature, x and y in turn in tile
/// units.
class NamedLine {
  NamedLine({
    required this.priority,
    required this.text,
    required this.spacing,
    required this.labelLength,
    required this.em,
    required this.maxBend,
    required this.props,
    required this.rings,
    this.icon = '',
    this.spin = 0,
  });

  /// The text's own turn, `text-rotate`, for a name kept level on the
  /// screen.
  final double spin;

  final int priority;
  final String text;
  final double spacing, labelLength, em, maxBend;
  final Map<String, Object?>? props;
  List<Float32List> rings;

  /// The sprite image drawn at each anchor, empty for none.
  final String icon;
}

/// [lines] with the first line of each joined to the first lines of the
/// same name that meet it end to start, as MapLibre's `mergeLines` joins a
/// road cut into many ways before naming it, so a name has the whole road
/// to fit on. A joined line keeps the first feature's properties.
List<NamedLine> mergeNamedLines(List<NamedLine> lines) {
  final merged = <(NamedLine, List<Float32List>)?>[];
  final leftIndex = <String, int>{};
  final rightIndex = <String, int>{};
  String key(String text, Float32List line, {required bool end}) => end
      ? '$text:${line[line.length - 2]}:${line[line.length - 1]}'
      : '$text:${line[0]}:${line[1]}';

  for (final named in lines) {
    final chunks = [named.rings.first];
    final leftKey = key(named.text, chunks.first, end: false);
    final rightKey = key(named.text, chunks.last, end: true);
    final before = rightIndex[leftKey];
    final after = leftIndex[rightKey];
    if (before != null && after != null && before != after) {
      // Lines of the same name meet both ends: all three become one.
      final target = merged[before]!;
      final tail = merged[after]!;
      target.$2
        ..addAll(chunks)
        ..addAll(tail.$2);
      merged[after] = null;
      rightIndex.remove(leftKey);
      leftIndex.remove(rightKey);
      rightIndex[key(named.text, target.$2.last, end: true)] = before;
    } else if (before != null) {
      merged[before]!.$2.addAll(chunks);
      rightIndex.remove(leftKey);
      rightIndex[rightKey] = before;
    } else if (after != null) {
      merged[after]!.$2.insertAll(0, chunks);
      leftIndex.remove(rightKey);
      leftIndex[leftKey] = after;
    } else {
      merged.add((named, chunks));
      leftIndex[leftKey] = merged.length - 1;
      rightIndex[rightKey] = merged.length - 1;
    }
  }
  return [
    for (final entry in merged)
      if (entry case (final named, final chunks))
        named..rings = [_joinChunks(chunks), ...named.rings.skip(1)],
  ];
}

Float32List _joinChunks(List<Float32List> chunks) {
  if (chunks.length == 1) return chunks.first;
  final out = <double>[...chunks.first];
  for (final chunk in chunks.skip(1)) {
    out.addAll(chunk.skip(2));
  }
  return Float32List.fromList(out);
}

/// [line], x and y in turn, cut where it leaves the tile into the pieces
/// inside it, as MapLibre's `clipLine` cuts a line before placing names.
List<Float32List> clipLineToTile(Float32List line) {
  const x1 = 0.0, y1 = 0.0, x2 = tileExtent, y2 = tileExtent;
  // MapLibre's Point._round, on its tile's grid of twice as many units.
  double round(double v) => (v * 2 + 0.5).floorToDouble() / 2;
  final out = <Float32List>[];
  List<double>? piece;
  void flush() {
    final done = piece;
    if (done != null && done.length >= 4) out.add(Float32List.fromList(done));
  }

  for (var i = 2; i < line.length; i += 2) {
    var ax = line[i - 2].toDouble(), ay = line[i - 1].toDouble();
    var bx = line[i].toDouble(), by = line[i + 1].toDouble();
    if (ax < x1 && bx < x1) continue;
    if (ax < x1) {
      (ax, ay) = (x1, round(ay + (by - ay) * ((x1 - ax) / (bx - ax))));
    } else if (bx < x1) {
      (bx, by) = (x1, round(ay + (by - ay) * ((x1 - ax) / (bx - ax))));
    }
    if (ay < y1 && by < y1) continue;
    if (ay < y1) {
      (ax, ay) = (round(ax + (bx - ax) * ((y1 - ay) / (by - ay))), y1);
    } else if (by < y1) {
      (bx, by) = (round(ax + (bx - ax) * ((y1 - ay) / (by - ay))), y1);
    }
    if (ax >= x2 && bx >= x2) continue;
    if (ax >= x2) {
      (ax, ay) = (x2, round(ay + (by - ay) * ((x2 - ax) / (bx - ax))));
    } else if (bx >= x2) {
      (bx, by) = (x2, round(ay + (by - ay) * ((x2 - ax) / (bx - ax))));
    }
    if (ay >= y2 && by >= y2) continue;
    if (ay >= y2) {
      (ax, ay) = (round(ax + (bx - ax) * ((y2 - ay) / (by - ay))), y2);
    } else if (by >= y2) {
      (bx, by) = (round(ax + (bx - ax) * ((y2 - ay) / (by - ay))), y2);
    }
    final last = piece;
    if (last == null ||
        last[last.length - 2] != ax ||
        last[last.length - 1] != ay) {
      flush();
      piece = [ax, ay];
    }
    piece!.addAll([bx, by]);
  }
  flush();
  return out;
}

double _lineLength(Float32List line) {
  var length = 0.0;
  for (var i = 2; i < line.length; i += 2) {
    final dx = line[i] - line[i - 2], dy = line[i + 1] - line[i - 1];
    length += math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

/// The anchors MapLibre's `getAnchors` gives a name [labelLength] long on
/// [line], cut to the tile, in a tile laid out [overscale] times deeper
/// than its data.
List<(double, double, double)> lineAnchors(
  Float32List line,
  double spacing,
  double labelLength,
  double extra,
  double window,
  double maxBend, {
  double overscale = 1,
}) {
  final continued =
      line[0] == 0 ||
      line[0] == tileExtent ||
      line[1] == 0 ||
      line[1] == tileExtent;
  if (spacing - labelLength < spacing / 4) {
    spacing = labelLength + spacing / 4;
  }
  final offset = continued
      ? (spacing / 2 * overscale) % spacing
      : ((labelLength / 2 + extra) * overscale) % spacing;
  final anchors = _resample(
    line,
    offset,
    spacing,
    labelLength,
    window,
    maxBend,
  );
  if (anchors.isEmpty && !continued) {
    return _resample(
      line,
      _lineLength(line) / 2,
      spacing,
      labelLength,
      window,
      maxBend,
    );
  }
  return anchors;
}

/// The middle of [line], when a name [labelLength] long fits there.
List<(double, double, double)> centerAnchor(
  Float32List line,
  double labelLength,
  double window,
  double maxBend,
) {
  return _resample(
    line,
    _lineLength(line) / 2,
    double.infinity,
    labelLength,
    window,
    maxBend,
  );
}

List<(double, double, double)> _resample(
  Float32List line,
  double offset,
  double spacing,
  double labelLength,
  double window,
  double maxBend,
) {
  final half = labelLength / 2;
  final length = _lineLength(line);
  final out = <(double, double, double)>[];
  var distance = 0.0;
  var marked = spacing.isFinite ? offset - spacing : offset;
  final step = spacing.isFinite ? spacing : 0.0;
  var done = false;
  for (var i = 2; i < line.length && !done; i += 2) {
    final ax = line[i - 2].toDouble(), ay = line[i - 1].toDouble();
    final bx = line[i].toDouble(), by = line[i + 1].toDouble();
    final segment = math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
    while (marked + step < distance + segment) {
      marked += step;
      final t = (marked - distance) / segment;
      final x = (ax + (bx - ax) * t).roundToDouble();
      final y = (ay + (by - ay) * t).roundToDouble();
      if (x >= 0 &&
          x < tileExtent &&
          y >= 0 &&
          y < tileExtent &&
          marked - half >= 0 &&
          marked + half <= length &&
          (window == 0 ||
              _bendsLittle(
                line,
                i ~/ 2 - 1,
                x,
                y,
                labelLength,
                window,
                maxBend,
              ))) {
        out.add((x, y, math.atan2(by - ay, bx - ax)));
      }
      if (!spacing.isFinite) {
        done = true;
        break;
      }
    }
    distance += segment;
  }
  return out;
}

/// MapLibre's `checkMaxAngle`: whether [line] turns no more than
/// [maxBend] within any [window] under a name [labelLength] long whose
/// anchor [x], [y] lies on segment [segment].
bool _bendsLittle(
  Float32List line,
  int segment,
  double x,
  double y,
  double labelLength,
  double window,
  double maxBend,
) {
  if (labelLength == 0) return true;
  double px(int i) => line[i * 2].toDouble();
  double py(int i) => line[i * 2 + 1].toDouble();
  double dist(double ax, double ay, double bx, double by) =>
      math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
  var index = segment + 1;
  var anchorDistance = 0.0;
  var cx = x, cy = y;
  while (anchorDistance > -labelLength / 2) {
    index--;
    if (index < 0) return false;
    anchorDistance -= dist(px(index), py(index), cx, cy);
    cx = px(index);
    cy = py(index);
  }
  anchorDistance += dist(px(index), py(index), px(index + 1), py(index + 1));
  index++;
  final corners = <(double, double)>[];
  var recent = 0.0;
  final count = line.length ~/ 2;
  while (anchorDistance < labelLength / 2) {
    if (index + 1 >= count) return false;
    final before = math.atan2(
      py(index) - py(index - 1),
      px(index) - px(index - 1),
    );
    final after = math.atan2(
      py(index + 1) - py(index),
      px(index + 1) - px(index),
    );
    var delta = before - after;
    delta = (((delta + 3 * math.pi) % (math.pi * 2)) - math.pi).abs();
    corners.add((anchorDistance, delta));
    recent += delta;
    while (anchorDistance - corners.first.$1 > window) {
      recent -= corners.removeAt(0).$2;
    }
    if (recent > maxBend) return false;
    anchorDistance += dist(px(index), py(index), px(index + 1), py(index + 1));
    index++;
  }
  return true;
}

/// Calls [place] at the anchors MapLibre's `getAnchors` gives a symbol
/// [labelLength] tile units long, an [em] tall, on each of [rings] cut to
/// the tile, [spacing] apart, in a tile laid out [overscale] times deeper
/// than its data. With [center], once at each ring's middle as the tile
/// holds it, kept by the tile it falls in. A symbol without [text] is not
/// held to the line's bends, as MapLibre's angle window is none without
/// text.
void anchorsAlong(
  List<Float32List> rings, {
  required double spacing,
  required double labelLength,
  required double em,
  required double maxBend,
  required double overscale,
  required void Function(double x, double y, double angle, Float32List line)
  place,
  bool center = false,
  bool text = true,
}) {
  final window = text ? 3 / 5 * em : 0.0;
  for (final ring in rings) {
    for (final line in center ? [ring] : clipLineToTile(ring)) {
      final anchors = center
          ? centerAnchor(line, labelLength, window, maxBend)
          : lineAnchors(
              line,
              spacing,
              labelLength,
              2 * em,
              window,
              maxBend,
              overscale: overscale,
            );
      for (final (x, y, angle) in anchors) {
        if (center && !_inTile(x, y)) continue;
        place(x, y, angle, line);
      }
    }
  }
}

/// Whether an anchor of [named] at [x], [y] lies nearer one of the same
/// text in [seen] than half the spacing, as MapLibre's
/// `anchorIsTooClose`; when not, it joins [seen].
bool repeatsName(
  Map<String, List<(double, double)>> seen,
  NamedLine named,
  double x,
  double y,
) {
  final repeat = named.spacing / 2;
  final others = seen[named.text] ??= [];
  for (final (ox, oy) in others) {
    final dx = ox - x, dy = oy - y;
    if (dx * dx + dy * dy < repeat * repeat) return true;
  }
  others.add((x, y));
  return false;
}

bool _inTile(double x, double y) =>
    x >= 0 && x < tileExtent && y >= 0 && y < tileExtent;
