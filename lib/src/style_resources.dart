import 'dart:typed_data';

import 'package:flutter/services.dart' show rootBundle;

import 'glyphs/glyph_layout.dart';
import 'glyphs/vmap_font.dart';
import 'labels.dart';
import 'source_config.dart';
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
  final TileSourceConfig _config;

  /// Called with the sprite sheet whenever it changes, null while none.
  final void Function(SpriteSheet? sheet) onSprites;
  final void Function() onChange;
  final void Function(Object error) onError;

  /// The font labels are shaped with when the app gives none: Vazirmatn,
  /// one variable font with every weight, for Arabic script and Latin.
  static const defaultGlyphFont =
      'packages/vmap/assets/fonts/Vazirmatn-Variable.ttf';

  SpriteSheet? _sprites;
  String? _spriteUrl;
  int _spritesLoading = 0;
  bool _closed = false;

  /// The fonts' bytes and families, sent to the tile workers so they
  /// shape labels; null when the workers do not shape.
  List<Uint8List>? fontBytes;
  List<String>? families;

  SpriteSheet? get sprites => _sprites;

  /// Sprite sheets and glyph ranges asked for and not yet answered.
  int get loading => _spritesLoading + _labels.rangesPending;

  /// Loads [given] and vmap's own font for labels. The tile workers shape
  /// with them unless [shapeInWorkers] is false.
  Future<void> loadFonts(
    List<VmapFont> given, {
    required bool shapeInWorkers,
  }) async {
    try {
      final all = [
        ...given,
        VmapFont(
          'Vazirmatn',
          (await rootBundle.load(defaultGlyphFont)).buffer.asUint8List(),
        ),
      ];
      if (_closed) return;
      final faces = [for (final f in all) f.bytes];
      final names = [for (final f in all) f.family];
      if (shapeInWorkers) fontBytes = faces;
      families = names;
      _labels.useGlyphs(GlyphFonts(faces, families: names));
      onChange();
    } catch (e) {
      onError(e);
    }
  }

  /// Draws labels from the glyph ranges at [url], or from font files when
  /// it is null.
  void useGlyphRanges(String? url) => _labels.useRanges(url, _config, () {
    if (!_closed) onChange();
  });

  /// Loads the sprite sheet at [url] when it is not the one in use.
  void useSprites(String? url) {
    if (url != _spriteUrl) _loadSprites(url);
  }

  /// Makes the next [useSprites] load again whatever it is given.
  void forgetSprites() => _spriteUrl = null;

  Future<void> _loadSprites(String? url) async {
    _spriteUrl = url;
    _sprites?.dispose();
    onSprites(_sprites = null);
    if (url == null) return;
    SpriteSheet? loaded;
    _spritesLoading++;
    try {
      loaded = await SpriteSheet.load(
        url,
        cacheDirectory: _config.cacheDirectory,
        userAgent: _config.userAgent,
        headers: _config.headers,
      );
    } catch (e) {
      onError(e);
    } finally {
      _spritesLoading--;
    }
    if (loaded == null) return;
    if (_closed || url != _spriteUrl) {
      loaded.dispose();
      return;
    }
    onSprites(_sprites = loaded);
    onChange();
  }

  void dispose() {
    _closed = true;
    _labels.useRanges(null, _config, () {});
    _sprites?.dispose();
  }
}
