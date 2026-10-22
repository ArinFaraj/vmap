import 'platform/types.dart' show HttpFailure;

/// What a [VmapError] failed to load or draw.
enum VmapErrorKind {
  /// The style document.
  style,

  /// A vector, raster or elevation tile, or a source's TileJSON.
  tiles,

  /// The style's sprite sheet.
  sprite,

  /// The fonts labels are shaped with, or the style's glyph ranges.
  fonts,

  /// Flutter GPU: it is switched off, or a shader, pipeline or texture
  /// could not be made. The map is drawn with the canvas instead.
  gpu,
}

/// Something the map could not load or draw. The map keeps trying where
/// trying again can help; this is for the app to log or show.
class VmapError implements Exception {
  /// A failure of [kind], caused by [cause], fetching [url] when given.
  VmapError(this.kind, this.cause, {String? url})
    : url = url ?? (cause is HttpFailure ? cause.url : null);

  /// What failed: the style, tiles, a sprite, fonts or the GPU.
  final VmapErrorKind kind;

  /// The address that failed, when there was one.
  final String? url;

  /// What was thrown.
  final Object cause;

  @override
  String toString() =>
      'VmapError(${kind.name}${url == null ? '' : ', $url'}): $cause';
}
