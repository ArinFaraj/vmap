part of '_webgl.dart';

/// The WebGL2 backend's integration with the Flutter host.
///
/// Rendered output reaches Flutter through `OffscreenCanvas`, but the framework
/// rasterizes with its own WebGL context and browsers do not share textures
/// across contexts, so nothing crosses back the other way.
final class WebGlHost extends GpuHost {
  const WebGlHost._();

  /// See [GpuCapabilities].
  @override
  GpuCapabilities get capabilities => const GpuCapabilities(
    textureToImage: true,
    // Browsers do not share textures across WebGL contexts.
    imageToTexture: false,
    presentAsImage: true,
    // WebGL2 has no compute shaders and never will.
    compute: false,
  );

  /// Hands [texture] to Flutter as a `ui.Image`.
  @override
  ui.Image textureToImage(Texture texture) => texture.asImage();

  /// Always null here. See [capabilities].
  @override
  Texture? imageToTexture(ui.Image image) => null;

  @override
  PageHost<Texture> get page => const _WebGlPage();

  /// Presents [texture] through the backend's own offscreen canvas path.
  @override
  Future<ui.Image> present(Texture texture, {bool transferOwnership = false}) =>
      _presentTextureAsImage(texture, transferOwnership: transferOwnership);
}

/// The WebGL2 backend's host integration.
const WebGlHost webGlHost = WebGlHost._();

final class _WebGlPage implements PageHost<Texture> {
  const _WebGlPage();

  @override
  PageBitmap bitmap(Texture texture) =>
      PageBitmap(webGlContext.textureBitmap(texture));

  @override
  PageImage frame(
    Texture texture, {
    required Object shower,
    required bool whole,
  }) => webGlContext._presenter.frame(
    webGlContext,
    texture,
    shower,
    whole: whole,
  );

  @override
  void left(Object shower) => webGlContext._presenter.forget(shower);

  @override
  void showsOnce(Texture texture) => texture.webGl._showsOnce = true;
}
