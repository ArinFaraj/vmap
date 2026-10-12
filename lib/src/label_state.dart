import 'dart:math' as math;
import 'dart:typed_data';

import 'label_sprites.dart';
import 'pins.dart';
import 'sprites.dart';
import 'tile_builder.dart';

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

  /// Names the picture of the text, shared by labels that look the same.
  late String spriteKey = '$_kind|$text';
  String get _kind;

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

  /// The length of the road the name runs along, in tile units. Zero for a
  /// point.
  late final double lineLength = _length(tile.line);

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

/// What one label is across frames: whether it is placed, how far it has
/// faded, and where it sits.
class LabelState {
  LabelState(this.candidate);

  LabelCandidate candidate;
  LabelSprite? sprite;
  double opacity = 0;
  bool placed = false;
  int seenPass = -1;
  int sortKey = 0;
  double worldX = 0;
  double worldY = 0;

  /// The angle of the road the text runs along, on the map and on the
  /// screen. The second follows the map's rotation and never reads upside
  /// down.
  double angle = 0;
  double screenAngle = 0;

  /// For a name that follows a bend: the stretch of road it sits on, as x,y
  /// pairs in fractions of the world, and how far along it the middle of the
  /// text is. Null for a name written straight. The text is laid on it
  /// afresh every frame, so its letters keep their spacing through a zoom.
  Float64List? curve;
  double curveMid = 0;

  /// The label's size now over the size its image was drawn at.
  double scale = 1;

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
  double iconDy = 0;

  /// Which of the layer's variable anchors the text took last.
  int side = 0;
  bool showIcon = false;
  bool showText = true;

  /// In the list of labels that are showing or fading.
  bool live = false;
}
