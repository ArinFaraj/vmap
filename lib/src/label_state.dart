import 'dart:math' as math;
import 'dart:typed_data';

import 'label_sprites.dart';
import 'pins.dart';
import 'sprites.dart';
import 'tile_builder.dart';

/// A label a tile or a marker offers, which the label engine may place.
class LabelCandidate {
  LabelCandidate(this.key, this.source, this.tileX, this.tileY, this.tileSpan)
    : marker = null,
      worldX = tileX + source.x / tileExtent * tileSpan,
      worldY = tileY + source.y / tileExtent * tileSpan,
      _line = source.line;

  /// The name of marker number [marker], written beside it at [worldX],
  /// [worldY] ahead of every map label.
  LabelCandidate.marker(int this.marker, String name, this.worldX, this.worldY)
    : key = 'm|$marker|$name',
      source = BuiltLabel(-1, 0, name, 0, 0, null),
      tileX = worldX,
      tileY = worldY,
      tileSpan = 0,
      _line = null;

  final String key;

  /// The number of the marker this names, in the order the markers were
  /// given. Null for a label of the map.
  final int? marker;

  /// Lower is placed first. Markers' names come before every map label.
  int get rank => switch (marker) {
    final index? => _markersFirst + index,
    null => source.priority,
  };

  static const int _markersFirst = -(1 << 30);
  late String spriteKey = '${source.layer}|${source.text}';

  /// The colours the text was last asked for in, when they come from the
  /// feature. One picture is kept for each.
  int ink = 0;

  /// Whether the text reads right to left, so its first letter is at its
  /// right edge.
  late final bool startsRight = _startsRight(source.text);

  static bool _startsRight(String text) {
    for (final unit in text.codeUnits) {
      if (unit >= 0x0590 && unit <= 0x08ff) return true;
      if ((unit >= 0x41 && unit <= 0x5a) || (unit >= 0x61 && unit <= 0x7a)) {
        return false;
      }
    }
    return false;
  }

  final BuiltLabel source;
  late final bool hasText = source.text.isNotEmpty;

  /// The owning tile's corner and width, as fractions of the world.
  final double tileX;
  final double tileY;
  final double tileSpan;
  final double worldX;
  final double worldY;
  final Float32List? _line;
  late final double lineLength = _length(_line);

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
