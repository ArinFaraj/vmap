import 'dart:typed_data';

import 'package:flutter/services.dart' show rootBundle;

/// A font labels may be shaped with: a TrueType or OpenType file with
/// TrueType outlines, and the family a style's `text-font` names it by.
/// A style asking for "Noto Sans Bold" finds a font registered as
/// "Noto Sans"; a variable font gives every weight it has.
class VmapFont {
  const VmapFont(this.family, this.bytes);

  final String family;
  final Uint8List bytes;

  /// The font in the app's assets at [key].
  static Future<VmapFont> asset(String family, String key) async =>
      VmapFont(family, (await rootBundle.load(key)).buffer.asUint8List());
}
