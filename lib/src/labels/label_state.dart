import 'dart:math' as math;
import 'dart:typed_data';

import 'label_sprites.dart';
import '../style/pins.dart';
import '../style/sprites.dart';
import '../tiles/built_tile.dart';

/// A label a tile or a marker offers, which the label engine may place.
sealed class LabelCandidate {
  LabelCandidate(this.key, this.text, this.rank, this.worldX, this.worldY);

  final String key;

  /// The text written.
  final String text;

  /// Lower is placed first. Markers' names come before every map label.
  final int rank;

  /// Where the label's point is, as fractions of the world.
  final double worldX;
  final double worldY;

  /// Its layer's `symbol-height-offset` for its feature, in metres, once
  /// worked out: as MapLibre's, read once, whatever the zoom.
  double? heightMetres;

  /// Names the picture of the text, shared by labels that look the same.
  late String spriteKey = '$_kind|$text';
  String get _kind;

  /// This label when it is a name along a road.
  TileLabel? get road => null;

  /// This label when it is a map label at a point, not along a road.
  TileLabel? get point => null;

  /// The colours the text was last asked for in, when they come from the
  /// feature. One picture is kept for each.
  int ink = 0;

  late final bool hasText = text.isNotEmpty;

  /// Whether the text reads right to left, so its first letter is at its
  /// right edge.
  late final bool startsRight = _startsRight(text);

  static bool _startsRight(String text) {
    for (final unit in text.codeUnits) {
      if (unit >= 0x0590 && unit <= 0x08ff) return true;
      if ((unit >= 0x41 && unit <= 0x5a) || (unit >= 0x61 && unit <= 0x7a)) {
        return false;
      }
    }
    return false;
  }
}

/// A label a tile built, for a feature of the map.
final class TileLabel extends LabelCandidate {
  TileLabel(String key, this.tile, this.tileX, this.tileY, this.tileSpan)
    : super(
        key,
        tile.text,
        tile.priority,
        tileX + tile.x / tileExtent * tileSpan,
        tileY + tile.y / tileExtent * tileSpan,
      );

  final BuiltLabel tile;

  /// The owning tile's corner and width, as fractions of the world.
  final double tileX;
  final double tileY;
  final double tileSpan;

  @override
  String get _kind => '${tile.layer}';

  @override
  TileLabel? get road => tile.line != null ? this : null;

  @override
  TileLabel? get point => tile.line == null ? this : null;

  /// The length of the road the name runs along, in tile units. Zero for a
  /// point.
  late final double lineLength = _length(tile.line);

  /// How far along the road the name's anchor lies, in tile units: where
  /// the name is centred. A road named every `symbol-spacing` has one
  /// label per anchor.
  late final double anchorAlong = _along(tile.line, tile.x, tile.y);

  static double _along(Float32List? line, double x, double y) {
    if (line == null) return 0;
    var walked = 0.0, best = 0.0, nearest = double.infinity;
    for (var i = 2; i < line.length; i += 2) {
      final ax = line[i - 2], ay = line[i - 1];
      final dx = line[i] - ax, dy = line[i + 1] - ay;
      final seg2 = dx * dx + dy * dy;
      final t = seg2 == 0
          ? 0.0
          : (((x - ax) * dx + (y - ay) * dy) / seg2).clamp(0.0, 1.0);
      final px = ax + dx * t - x, py = ay + dy * t - y;
      final d = px * px + py * py;
      final seg = math.sqrt(seg2);
      if (d < nearest) {
        nearest = d;
        best = walked + seg * t;
      }
      walked += seg;
    }
    return best;
  }

  static double _length(Float32List? line) {
    if (line == null) return 0;
    var total = 0.0;
    for (var i = 2; i < line.length; i += 2) {
      final dx = line[i] - line[i - 2];
      final dy = line[i + 1] - line[i - 1];
      total += math.sqrt(dx * dx + dy * dy);
    }
    return total;
  }
}

/// The name of marker number [index], written beside it ahead of every map
/// label.
final class MarkerName extends LabelCandidate {
  MarkerName(this.index, String name, double worldX, double worldY)
    : super('m|$index|$name', name, _first + index, worldX, worldY);

  /// The marker's place in the order the markers were given.
  final int index;

  static const int _first = -(1 << 30);

  @override
  String get _kind => 'marker';
}

/// A label's text as one placement pass weighs it, in screen pixels with
/// its perspective: its font size, the box of its text, and the padding
/// kept around its text and its icon.
typedef LabelSize = ({
  double fontSize,
  double width,
  double height,
  double textPad,
  double iconPad,
});

/// What one label is across frames: whether it is placed, how far it has
/// faded, and where it sits.
class LabelState {
  LabelState(this.candidate);

  /// How far across its road a road name drawn as an image is moved, in
  /// pixels: its `text-offset` at its size, as placement weighed it.
  double roadLift = 0;

  /// A name along a line whose glyphs stand upright on the screen, as
  /// `text-rotation-alignment: viewport-glyph` asks.
  bool glyphsUpright = false;

  /// Hidden by a building, as last found.
  bool occluded = false;

  /// The [BuildingOcclusion.view] [occluded] was found for.
  int occludedFor = 0;

  LabelCandidate candidate;
  LabelSprite? sprite;

  /// The key [sprite] was drawn under.
  String? spriteKey;

  /// The style zoom [spriteKey] was worked out at, or [keyStale] when it is
  /// not known to still hold. The key reads the layer's layout expressions,
  /// which cost more than the comparison, so a frame skips the working out
  /// while the zoom stays within one level: it changes only when the zoom
  /// crosses a level, or the label's writing mode or anchor side changes.
  double spriteKeyZoom = keyStale;

  /// A [spriteKeyZoom] no zoom equals, for a key that must be worked out
  /// again.
  static const double keyStale = -1e9;

  double opacity = 0;
  bool placed = false;
  int seenPass = -1;
  int sortKey = 0;

  /// Where it falls in its layer's drawing order by screen y.
  double drawY = 0;
  double worldX = 0;
  double worldY = 0;

  /// The angle of the road the text runs along, on the map and on the
  /// screen. The second follows the map's rotation and never reads upside
  /// down.
  double angle = 0;
  double screenAngle = 0;

  /// Its layer's `text-keep-upright`, for a name along a road.
  bool keepUpright = true;

  /// Drawn lying on the ground of a tilted map.
  bool onGround = false;

  /// Its icon drawn lying on the ground of a tilted map.
  bool iconOnGround = false;

  /// Written down the page, in the vertical writing mode.
  bool vertical = false;

  /// For a name that follows a bend: the stretch of road it sits on, as x,y
  /// pairs in fractions of the world, and how far along it the middle of the
  /// text is. Null for a name written straight. The text is laid on it
  /// afresh every frame, so its letters keep their spacing through a zoom.
  Float64List? curve;
  double curveMid = 0;

  /// The label's size now over the size its image was drawn at.
  double scale = 1;

  /// How much a tilted map shrinks the label where it stands.
  double perspective = 1;

  /// The text size placement last weighed the label at, in pixels with its
  /// perspective, and the part of [dx] and [dy] that is its translate,
  /// which does not grow with the text. Between placements the label is
  /// grown to its size in each frame from these.
  double placedSize = 0;
  double moveX = 0, moveY = 0;

  /// The part of [iconDx] and [iconDy] that is the icon's translate, in
  /// screen pixels, not turned or grown with the icon.
  double iconMoveX = 0, iconMoveY = 0;

  /// The image is too far from the label's size and wants drawing again.
  bool resize = false;

  /// Where the label sits relative to its anchor, in screen pixels, after
  /// stepping aside for a reserved area.
  double dx = 0;
  double dy = 0;
  int roadFitKey = -1;
  bool roadFits = false;

  /// The icon at the anchor and the size it is drawn at.
  SpriteImage? icon;

  /// The pin drawn in place of the icon.
  VmapPin? pin;
  double iconW = 0;
  double iconH = 0;
  double iconOpacity = 1;

  /// How far the icon's middle is drawn from the point.
  double iconDx = 0;

  /// The icon's size, by which an icon fitted to the text scales with it.
  double iconScale = 1;
  double iconDy = 0;

  /// Which of the layer's variable anchors the text took last.
  int side = 0;

  /// Its turn in the last placement pass, for comparing with MapLibre's.
  int placeOrder = -1;
  bool showIcon = false;
  bool showText = true;

  /// In the list of labels that are showing or fading.
  bool live = false;

  /// The size of the text before it is laid out, for placing it until it
  /// is: each line's characters at about half an em, a line wrapped at
  /// [maxWidth] ems.
  (double, double) guessSize(double fontSize, {required double maxWidth}) {
    final ems = vertical ? 1.0 : 0.55;
    var widest = 0.0;
    var lines = 0;
    for (final line in candidate.text.split('\n')) {
      final width = line.runes.length * ems;
      if (vertical || width <= maxWidth) {
        lines++;
        widest = math.max(widest, width);
        continue;
      }
      // Words fill a line until the next would pass the width.
      var run = 0.0;
      lines++;
      for (final word in line.split(' ')) {
        final w = word.runes.length * ems;
        if (run > 0 && run + ems + w > maxWidth) {
          widest = math.max(widest, run);
          lines++;
          run = w;
        } else {
          run += (run > 0 ? ems : 0) + w;
        }
      }
      widest = math.max(widest, run);
    }
    final long = widest * fontSize;
    final across = (1.35 + (lines - 1) * 1.2) * fontSize;
    return vertical ? (across, long) : (long, across);
  }
}
