/// Where a map's frames are shown, decided in one place from the browser
/// and what the last frame drew.
enum MapShowing {
  /// On Flutter's canvas, GPU images and all.
  canvas,

  /// GPU images in page elements, beside a canvas the browser shows in the
  /// same frame.
  page,

  /// GPU images in page elements, ahead of a canvas that reaches the page a
  /// frame later and draws nothing that moves with the map.
  pageAhead,

  /// GPU images in page elements, each held a frame so it lands with the
  /// canvas drawn with it, which widgets laid over the map are on.
  pageWithCanvas;

  /// Whether Flutter's own frame reaches the page later than a page
  /// element does.
  bool get canvasTrails => this == pageAhead || this == pageWithCanvas;
}
