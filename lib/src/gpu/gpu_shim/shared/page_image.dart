/// What a page shows a GPU texture from.
sealed class PageImage {
  const PageImage();
}

/// An `ImageBitmap` taken from the texture, [source], the page's to show
/// and close.
final class PageBitmap extends PageImage {
  const PageBitmap(this.source);

  final Object source;
}

/// The `HTMLCanvasElement` the backend draws in, [source], with the
/// texture's frame left in it. There is one, so one place in the page
/// shows it.
final class PageCanvas extends PageImage {
  const PageCanvas(this.source);

  final Object source;
}

/// The image the place it is handed to showed last, shown again: the
/// frame it stands for may have gone straight from the canvas to the page,
/// leaving nothing in its texture to take it from again.
final class PageKept extends PageImage {
  const PageKept();
}

/// How a GPU host puts its textures, of type [T], in the page it runs in.
abstract interface class PageHost<T> {
  /// Copies [texture] into the context's canvas and hands that over as an
  /// `ImageBitmap`: a page canvas shows it without the copy into
  /// Flutter's own WebGL context an image of it costs, which Safari makes
  /// on the CPU.
  PageBitmap bitmap(T texture);

  /// Hands a frame of [shower], the map drawing it, over for the page to
  /// show: [whole] when [texture] is all of the frame. Where the host's
  /// canvas is a page element, a whole frame of the only map showing in
  /// the page is left in it, which costs no copy; any other is a bitmap.
  PageImage frame(T texture, {required Object shower, required bool whole});

  /// Says [shower] shows no more frames in the page.
  void left(Object shower);

  /// Says [texture] is a frame: drawn whole from a clear, then shown once,
  /// by [frame] or as an image, and not read after. Where the host can, a
  /// frame is drawn in the canvas those take it from, which saves the copy
  /// into it.
  void showsOnce(T texture);
}
