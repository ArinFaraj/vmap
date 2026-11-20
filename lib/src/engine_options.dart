import 'package:flutter/foundation.dart';

import 'labels/text_style.dart';
import 'options.dart';
import 'style/pins.dart';
import 'style/style.dart';
import 'text/glyphs/vmap_font.dart';
import 'tiles/query.dart';

/// What an engine is made with. [network], [rendering] and [fonts] are read
/// once, when the engine is made; an engine follows changes to the rest
/// through [VmapEngine.update].
@immutable
class VmapEngineOptions {
  const VmapEngineOptions({
    this.style = VmapStyle.light,
    this.overlay,
    this.styleEdits = const [],
    this.featureStates = const [],
    this.pins,
    this.textStyle = const VmapTextStyle(),
    this.labels = const VmapLabelOptions(),
    this.network = const VmapNetworkOptions(),
    this.rendering = const VmapRenderOptions(),
    this.fonts = const [],
  });

  /// The style to draw: one of MapLibre's, by address or as JSON, or the
  /// built in one, which needs no key.
  final VmapStyle style;

  /// Sources and layers of the app's own, drawn with the style.
  final VmapOverlay? overlay;

  /// Changes to single layers of the style: a colour, a filter, whether a
  /// layer is shown.
  final List<VmapStyleEdit> styleEdits;

  /// State for single features, which the style reads with
  /// `['feature-state', name]`: the way to highlight what was tapped.
  final List<VmapFeatureState> featureStates;

  /// Draws places of interest as round pins instead of the style's icons.
  final VmapPins? pins;

  /// The fonts of labels, their scale, and the look of markers' names.
  final VmapTextStyle textStyle;

  /// Which labels are written and how they are placed.
  final VmapLabelOptions labels;

  /// How the map fetches and keeps what it loads. Set its user agent to the
  /// app's name.
  final VmapNetworkOptions network;

  /// What draws the map.
  final VmapRenderOptions rendering;

  /// Fonts labels may be shaped with, beyond the app's own.
  final List<VmapFont> fonts;
}
