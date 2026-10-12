import 'dart:math' as math;
import 'dart:ui' as ui;

import 'platform.dart';
import 'stats.dart';

/// A label's text drawn once, to be placed every frame.
sealed class LabelSprite {
  LabelSprite(
    this.width,
    this.height,
    this.textWidth,
    this.textHeight,
    this.fontSize,
  );

  /// The size of what is drawn in its own units: the image's pixels, or the
  /// logical pixels of the recording.
  double get pixelW;
  double get pixelH;

  void dispose() => dropped = true;

  /// The size the text was drawn at. The image is scaled while the label's
  /// size stays close to it.
  final double fontSize;
  final double width;
  final double height;
  final double textWidth;
  final double textHeight;
  int usedPass = 0;

  /// Evicted from the cache; its image is gone.
  bool dropped = false;
}

/// Text turned into an image, which can be cut into strips along a road.
final class ImageSprite extends LabelSprite {
  ImageSprite(
    this.image,
    super.width,
    super.height,
    super.textWidth,
    super.textHeight,
    super.fontSize,
  );

  final ui.Image image;

  @override
  double get pixelW => image.width.toDouble();

  @override
  double get pixelH => image.height.toDouble();

  @override
  void dispose() {
    super.dispose();
    image.dispose();
  }
}

/// Text kept as a recording, played back sharp at any size.
final class PictureSprite extends LabelSprite {
  PictureSprite(
    this.picture,
    this.paragraphs,
    super.width,
    super.height,
    super.textWidth,
    super.textHeight,
    super.fontSize,
  );

  final ui.Picture picture;

  /// The text [picture] plays, kept for as long as it is.
  final List<ui.Paragraph> paragraphs;

  @override
  double get pixelW => width;

  @override
  double get pixelH => height;

  @override
  void dispose() {
    super.dispose();
    picture.dispose();
    for (final paragraph in paragraphs) {
      paragraph.dispose();
    }
  }
}

/// How one label's text is drawn.
class TextLook {
  const TextLook({
    required this.text,
    required this.fontSize,
    required this.color,
    required this.halo,
    required this.haloWidth,
    required this.haloBlur,
    required this.weight,
    required this.italic,
    required this.letterSpacing,
    required this.lineHeight,
    required this.align,
    required this.rightToLeft,
    required this.road,
    required this.layoutWidth,
    required this.fontFamily,
    required this.fontFamilyFallback,
  });

  final String text;
  final double fontSize;
  final int color;

  /// The colour of the ring around the text, or null for none.
  final int? halo;
  final double haloWidth;
  final double haloBlur;
  final int weight;
  final bool italic;

  /// In ems.
  final double letterSpacing;
  final double lineHeight;
  final ui.TextAlign align;
  final bool rightToLeft;

  /// A road's name: one line, and always an image so it can bend.
  final bool road;

  /// The width lines wrap at, in logical pixels.
  final double layoutWidth;
  final String? fontFamily;
  final List<String>? fontFamilyFallback;
}

/// The drawn labels, one for each text and look, shared by every label
/// that shows it.
class LabelSprites {
  LabelSprites(this.work);

  final VmapLabelWork work;
  final Map<String, LabelSprite> _byKey = {};
  final Stopwatch _clock = Stopwatch()..start();

  /// Kept when more are drawn than this, only those used in the last pass.
  static const int _max = 1400;

  /// Clear space drawn around the text for its halo.
  static const double haloPad = 4;

  /// The halo is the text redrawn in the background colour around itself.
  /// A blurred shadow looks the same and stalls the raster thread for tens of
  /// milliseconds per label image.
  static const List<ui.Offset> _haloOffsets = [
    ui.Offset(1.5, 0),
    ui.Offset(-1.5, 0),
    ui.Offset(0, 1.5),
    ui.Offset(0, -1.5),
    ui.Offset(1.1, 1.1),
    ui.Offset(-1.1, 1.1),
    ui.Offset(1.1, -1.1),
    ui.Offset(-1.1, -1.1),
  ];

  LabelSprite? operator [](String key) => _byKey[key];

  int get length => _byKey.length;

  void clear() {
    for (final sprite in _byKey.values) {
      sprite.dispose();
    }
    _byKey.clear();
  }

  /// Drops sprites not used in [pass] once there are too many.
  void trim(int pass) {
    if (_byKey.length <= _max) return;
    final unused = [
      for (final e in _byKey.entries)
        if (e.value.usedPass != pass) e.key,
    ];
    for (final key in unused) {
      if (_byKey.length <= _max * 3 ~/ 4) break;
      work.evicted++;
      _byKey.remove(key)!.dispose();
    }
  }

  /// Draws [look] once and keeps it under [key]. The halo is the text
  /// redrawn in the halo colour around itself, so the text is laid out a
  /// single time.
  LabelSprite draw(
    String key,
    TextLook look, {
    required double dpr,
    required int pass,
  }) {
    final fontSize = look.fontSize;
    final halo = look.halo;
    final haloWidth = look.haloWidth;
    final haloBlur = look.haloBlur;
    ui.Paragraph lay([ui.Paint? foreground]) {
      final started = _clock.elapsedMicroseconds;
      final builder =
          ui.ParagraphBuilder(
              ui.ParagraphStyle(
                textAlign: look.align,
                textDirection: look.rightToLeft
                    ? ui.TextDirection.rtl
                    : ui.TextDirection.ltr,
                maxLines: look.road ? 1 : 3,
                fontFamily: look.fontFamily,
                fontSize: fontSize,
                height: look.lineHeight,
              ),
            )
            ..pushStyle(
              ui.TextStyle(
                color: foreground == null ? ui.Color(look.color) : null,
                foreground: foreground,
                fontSize: fontSize,
                fontFamily: look.fontFamily,
                fontFamilyFallback: look.fontFamilyFallback,
                fontWeight:
                    ui.FontWeight.values[(look.weight ~/ 100 - 1).clamp(0, 8)],
                fontVariations: [
                  ui.FontVariation('wght', look.weight.toDouble()),
                ],
                fontStyle: look.italic
                    ? ui.FontStyle.italic
                    : ui.FontStyle.normal,
                letterSpacing: look.letterSpacing * fontSize,
                height: look.lineHeight,
              ),
            )
            ..addText(look.text);
      final laid = builder.build()
        ..layout(ui.ParagraphConstraints(width: look.layoutWidth));
      work.layoutMicros += _clock.elapsedMicroseconds - started;
      return laid;
    }

    final paragraph = lay();
    final textW = math.max(1, paragraph.longestLine).ceilToDouble();
    final textH = paragraph.height.ceilToDouble();
    final pixelW = ((textW + haloPad * 2) * dpr).ceil();
    final pixelH = ((textH + haloPad * 2) * dpr).ceil();
    final recorder = ui.PictureRecorder();
    final at = ui.Offset(switch (look.align) {
      ui.TextAlign.left => haloPad,
      ui.TextAlign.right => haloPad + textW - look.layoutWidth,
      _ => haloPad + textW / 2 - look.layoutWidth / 2,
    }, haloPad);
    // Where text is drawn straight to the page the halo is the text again
    // with its outline stroked, which costs far less than a layer of shifted
    // copies does.
    final outline = !directLabels || halo == null || haloWidth <= 0
        ? null
        : lay(
            ui.Paint()
              ..style = ui.PaintingStyle.stroke
              ..strokeWidth = haloWidth * 2 / 1.5
              ..strokeJoin = ui.StrokeJoin.round
              ..color = ui.Color(halo)
              ..maskFilter = haloBlur > 0
                  ? ui.MaskFilter.blur(ui.BlurStyle.normal, haloBlur / 2)
                  : null,
          );
    // A name along a road stays an image: turned text is drawn as outlines
    // every frame, which a turned image is not.
    if (directLabels && !look.road) {
      final canvas = ui.Canvas(recorder);
      if (outline != null) canvas.drawParagraph(outline, at);
      canvas.drawParagraph(paragraph, at);
      return _keep(
        key,
        PictureSprite(
          recorder.endRecording(),
          [paragraph, ?outline],
          textW + haloPad * 2,
          textH + haloPad * 2,
          textW,
          textH,
          fontSize,
        )..usedPass = pass,
      );
    }
    final canvas = ui.Canvas(recorder)..scale(dpr);
    if (outline != null) {
      canvas.drawParagraph(outline, at);
    } else if (halo != null) {
      canvas.saveLayer(
        null,
        ui.Paint()
          ..colorFilter = ui.ColorFilter.mode(
            ui.Color(halo),
            ui.BlendMode.srcIn,
          )
          ..imageFilter = haloBlur > 0
              ? ui.ImageFilter.blur(sigmaX: haloBlur / 2, sigmaY: haloBlur / 2)
              : null,
      );
      // A ring of copies a pixel apart leaves no gap between the strokes of
      // thin letters, which one ring of a wide halo does.
      final rings = haloWidth.ceil();
      for (var ring = 1; ring <= rings; ring++) {
        final reach = haloWidth * ring / rings / 1.5;
        for (final offset in _haloOffsets) {
          canvas.drawParagraph(paragraph, at + offset * reach);
        }
      }
      canvas.restore();
    }
    canvas.drawParagraph(paragraph, at);
    final picture = recorder.endRecording();
    final imageStart = _clock.elapsedMicroseconds;
    final image = picture.toImageSync(pixelW, pixelH);
    work
      ..imageMicros += _clock.elapsedMicroseconds - imageStart
      ..images += 1;
    picture.dispose();
    paragraph.dispose();
    outline?.dispose();
    return _keep(
      key,
      ImageSprite(image, pixelW / dpr, pixelH / dpr, textW, textH, fontSize)
        ..usedPass = pass,
    );
  }

  LabelSprite _keep(String key, LabelSprite sprite) {
    _byKey.remove(key)?.dispose();
    return _byKey[key] = sprite;
  }
}
