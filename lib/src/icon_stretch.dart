import 'dart:math' as math;
import 'dart:ui' as ui;

import 'sprites.dart';

/// The pieces [icon] is drawn in when fitted to [box], each a rectangle of
/// the sprite sheet and where it goes, as MapLibre's `getIconQuads` cuts a
/// fitted icon: the parts outside its stretch spans keep their size, times
/// [scale], the stretch spans share the rest, and the icon's content area,
/// when it has one, is what lands on [box]. A box too short for the fixed
/// parts grows about [anchor] until they fit, as MapLibre's
/// `minFontScale` grows it.
List<(ui.Rect, ui.Rect)> stretchedIcon(
  SpriteImage icon,
  ui.Rect box,
  double scale, {
  ui.Offset anchor = ui.Offset.zero,
}) {
  final source = icon.source;
  final ratio = icon.pixelRatio;
  final xs = _Axis.of(
    icon.stretchX,
    source.width,
    icon.content?[0],
    icon.content?[2],
  );
  final ys = _Axis.of(
    icon.stretchY,
    source.height,
    icon.content?[1],
    icon.content?[3],
  );
  final xCuts = xs.cuts(icon.stretchX != null || icon.stretchY != null);
  final yCuts = ys.cuts(icon.stretchX != null || icon.stretchY != null);
  final out = <(ui.Rect, ui.Rect)>[];
  for (var i = 0; i + 1 < xCuts.length; i++) {
    final (l, r) = (xCuts[i], xCuts[i + 1]);
    final x1 = l.$1 + l.$2, x2 = r.$1 + r.$2;
    if (x2 <= x1) continue;
    for (var j = 0; j + 1 < yCuts.length; j++) {
      final (t, b) = (yCuts[j], yCuts[j + 1]);
      final y1 = t.$1 + t.$2, y2 = b.$1 + b.$2;
      if (y2 <= y1) continue;
      out.add((
        ui.Rect.fromLTRB(
          source.left + x1,
          source.top + y1,
          source.left + x2,
          source.top + y2,
        ),
        ui.Rect.fromLTRB(
          xs.at(l, box.left, box.width, ratio, scale, anchor.dx),
          ys.at(t, box.top, box.height, ratio, scale, anchor.dy),
          xs.at(r, box.left, box.width, ratio, scale, anchor.dx),
          ys.at(b, box.top, box.height, ratio, scale, anchor.dy),
        ),
      ));
    }
  }
  return out;
}

/// One axis of a stretchable icon, in its own pixels. A cut is a place in
/// the picture as (fixed, stretch): how much of the parts that keep their
/// size and of the stretch spans lie before it.
class _Axis {
  _Axis({
    required this.spans,
    required this.size,
    required this.stretch,
    required this.stretchBefore,
    required this.stretchContent,
    required this.fixedBefore,
    required this.fixedContent,
  });

  /// The axis of an icon [size] long with [given] stretch spans, its
  /// content running [from] to [to] when it has a content area.
  factory _Axis.of(
    List<(double, double)>? given,
    double size,
    double? from,
    double? to,
  ) {
    final spans = given ?? [(0.0, size)];
    double within(double lo, double hi) {
      var sum = 0.0;
      for (final (a, b) in spans) {
        sum += b.clamp(lo, hi) - a.clamp(lo, hi);
      }
      return sum;
    }

    final stretch = within(0, size);
    if (from == null || to == null) {
      return _Axis(
        spans: spans,
        size: size,
        stretch: stretch,
        stretchBefore: 0,
        stretchContent: stretch,
        fixedBefore: 0,
        fixedContent: size - stretch,
      );
    }
    final before = within(0, from), inside = within(from, to);
    return _Axis(
      spans: spans,
      size: size,
      stretch: stretch,
      stretchBefore: before,
      stretchContent: inside,
      fixedBefore: from - before,
      fixedContent: to - from - inside,
    );
  }

  final List<(double, double)> spans;
  final double size, stretch;
  final double stretchBefore, stretchContent, fixedBefore, fixedContent;

  /// The cuts between pieces: just the two ends when the icon has no
  /// stretch spans, so it scales as one piece.
  List<(double, double)> cuts(bool stretchable) {
    if (!stretchable) return [(0, 0), (0, stretch)];
    final out = <(double, double)>[(0, 0)];
    for (final (a, b) in spans) {
      final last = out.last.$2;
      out
        ..add((a - last, last))
        ..add((a - last, last + (b - a)));
    }
    out.add((size - stretch, stretch));
    return out;
  }

  /// Where cut [c] lands along a box starting at [start], [length] long,
  /// for an icon of pixel ratio [ratio] drawn [scale] times its size: the
  /// stretch part spread over the box, the fixed part kept to size, the
  /// box grown about [anchor] when the fixed part is longer.
  double at(
    (double, double) c,
    double start,
    double length,
    double ratio,
    double scale,
    double anchor,
  ) {
    final (fixed, stretched) = c;
    final grow = length <= 0
        ? 1.0
        : math.max(1.0, fixedContent / ratio * scale / length);
    final em = stretchContent == 0
        ? start
        : (stretched - stretchBefore) / stretchContent * length + start;
    final px = stretch == 0
        ? fixed - fixedBefore
        : fixed - fixedBefore - fixedContent * stretched / stretch;
    return anchor + (em - anchor) * grow + px / ratio * scale;
  }
}
