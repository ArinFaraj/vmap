import 'dart:typed_data';

import 'package:flutter/services.dart' show rootBundle;

import '../labels/glyphs/glyph_layout.dart';
import '../labels/glyphs/vmap_font.dart';
import '../errors.dart';
import '../labels/labels.dart';
import '../options.dart';
import '../tiles/net.dart';
import 'sprites.dart';

/// What a style draws with besides its tiles: its sprite sheet, the fonts
/// labels are shaped with, and its glyph ranges when it is drawn as
/// MapLibre draws it. Each arrives on its own; [onChange] says so.
class StyleResources {
  StyleResources(
    this._labels,
    this._config, {
    required this.onSprites,
    required this.onChange,
    required this.onError,
  });

  final LabelEngine _labels;
  final VmapNetworkOptions _config;

  /// Called with the sprite sheet whenever it changes, null while none.
  final void Function(SpriteSheet? sheet) onSprites;
  final void Function() onChange;
  final void Function(VmapError error) onError;

  /// The font labels are shaped with when the app gives none: Vazirmatn,
  /// one variable font with every weight, for Arabic script and Latin.
  static const defaultGlyphFont =
      'packages/vmap/assets/fonts/Vazirmatn-Variable.ttf';

  /// Syriac, which Vazirmatn has no letters for: Assyrian names in
  /// Kurdistan, as in Ankawa and Duhok, are written in it.
  static const syriacGlyphFont =
      'packages/vmap/assets/fonts/NotoSansSyriacEastern-Variable.ttf';

  SpriteSheet? _styleSprites;

  /// The style's sheet with the app's images, while there are any.
  SpriteSheet? _joined;
  Map<String, VmapImage> _images = const {};
  String? _spriteUrl;
  int _spritesLoading = 0;
  bool _closed = false;

  /// The fonts' bytes and families, sent to the tile workers so they
  /// shape labels; null when the workers do not shape.
  List<Uint8List>? fontBytes;
  List<String>? families;

  SpriteSheet? get sprites => _joined ?? _styleSprites;

  /// Sprite sheets and glyph ranges asked for and not yet answered.
  int get loading => _spritesLoading + _labels.rangesPending;

  /// Loads [given] and vmap's own fonts for labels. The tile workers shape
  /// with them unless [shapeInWorkers] is false.
  Future<void> loadFonts(
    List<VmapFont> given, {
    required bool shapeInWorkers,
  }) async {
    try {
      final bundled = await Future.wait([
        rootBundle.load(defaultGlyphFont),
        rootBundle.load(syriacGlyphFont),
      ]);
      final all = [
        ...given,
        VmapFont('Vazirmatn', bundled[0].buffer.asUint8List()),
        VmapFont('Noto Sans Syriac Eastern', bundled[1].buffer.asUint8List()),
      ];
      if (_closed) return;
      final faces = [for (final f in all) f.bytes];
      final names = [for (final f in all) f.family];
      if (shapeInWorkers) fontBytes = faces;
      families = names;
      _labels.useGlyphs(GlyphFonts(faces, families: names));
      onChange();
    } catch (e) {
      onError(VmapError(VmapErrorKind.fonts, e));
    }
  }

  /// Draws labels from the glyph ranges at [url], or from font files when
  /// it is null.
  void useGlyphRanges(String? url) => _labels.useRanges(
    url,
    _config,
    () {
      if (!_closed) onChange();
    },
    onError: (e) => onError(VmapError(VmapErrorKind.fonts, e)),
    fetch: shared.fetch,
  );

  /// What the page fetches once for itself and every tile worker.
  late final SharedFetches shared = SharedFetches(
    userAgent: _config.userAgent,
    headers: _config.headers,
  );

  /// Loads the sprite [sheets], each its images' prefix and its address,
  /// when they are not the ones in use.
  void useSprites(List<(String, String)> sheets) {
    final key = sheets.isEmpty
        ? null
        : sheets.map((s) => '${s.$1} ${s.$2}').join('\n');
    if (key != _spriteUrl) _loadSprites(key, sheets);
  }

  /// Draws [images] by name as if they were in the style's sprite sheet.
  void useImages(Map<String, VmapImage> images) {
    if (_sameImages(images, _images)) return;
    _images = images;
    _join();
    onChange();
  }

  static bool _sameImages(Map<String, VmapImage> a, Map<String, VmapImage> b) =>
      a.length == b.length &&
      a.entries.every((e) {
        final o = b[e.key];
        return o != null &&
            identical(o.image, e.value.image) &&
            o.pixelRatio == e.value.pixelRatio &&
            o.sdf == e.value.sdf;
      });

  /// Hands on the style's sheet with the app's images joined to it.
  void _join() {
    _joined?.dispose();
    _joined = _images.isEmpty ? null : SpriteSheet.join(_styleSprites, _images);
    onSprites(sprites);
  }

  /// Makes the next [useSprites] load again whatever it is given.
  void forgetSprites() => _spriteUrl = null;

  Future<void> _loadSprites(String? url, List<(String, String)> sheets) async {
    _spriteUrl = url;
    _styleSprites?.dispose();
    _styleSprites = null;
    _join();
    if (url == null) return;
    SpriteSheet? loaded;
    _spritesLoading++;
    try {
      final each = await Future.wait([
        for (final (_, address) in sheets)
          SpriteSheet.load(
            address,
            cacheDirectory: _config.cacheDirectory,
            userAgent: _config.userAgent,
            headers: _config.headers,
            pixelRatio: _config.spritePixelRatio,
          ),
      ]);
      loaded = each.length == 1 && sheets.single.$1.isEmpty
          ? each.single
          : SpriteSheet.merge([
              for (var i = 0; i < each.length; i++)
                if (each[i] case final sheet?) (sheets[i].$1, sheet),
            ]);
    } catch (e) {
      onError(VmapError(VmapErrorKind.sprite, e));
    } finally {
      _spritesLoading--;
    }
    if (loaded == null) return;
    if (_closed || url != _spriteUrl) {
      loaded.dispose();
      return;
    }
    _styleSprites = loaded;
    _join();
    onChange();
  }

  void dispose() {
    _closed = true;
    shared.close();
    _labels.useRanges(null, _config, () {});
    _joined?.dispose();
    _styleSprites?.dispose();
  }
}
