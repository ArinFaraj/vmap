import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:vmap/vmap.dart';

/// A style the demo offers.
class DemoStyle {
  const DemoStyle(this.name, {this.url, this.builtIn});

  final String name;

  /// An OpenFreeMap style, fetched so the globe and sky can be set on it.
  final String? url;
  final VmapStyle? builtIn;

  bool get canGlobe => url != null;

  /// The style layer hillshading goes under, the first of its water.
  String? get shadeBefore => url == null ? null : 'water';
}

const demoStyles = [
  DemoStyle('Liberty', url: 'https://tiles.openfreemap.org/styles/liberty'),
  DemoStyle('Bright', url: 'https://tiles.openfreemap.org/styles/bright'),
  DemoStyle('Positron', url: 'https://tiles.openfreemap.org/styles/positron'),
  DemoStyle('vmap dark', builtIn: VmapStyle.dark),
  DemoStyle('vmap light', builtIn: VmapStyle.light),
];

/// Label languages: the name keys tried in order.
const demoLanguages = {
  'Local': ['name'],
  'English': ['name:en', 'name:latin', 'name'],
  'Kurdish': ['name:ckb', 'name:ku', 'name'],
  'Arabic': ['name:ar', 'name'],
};

final _documents = <String, Future<Map<String, Object?>>>{};

Future<Map<String, Object?>> _document(String url) => _documents[url] ??= http
    .get(Uri.parse(url))
    .then((r) => jsonDecode(r.body) as Map<String, Object?>);

const _sky = {
  'sky-color': '#7DB7F0',
  'horizon-color': '#D9ECFB',
  'fog-color': '#EEF5FB',
  'sky-horizon-blend': 0.6,
  'horizon-fog-blend': 0.7,
  'fog-ground-blend': 0.4,
};

/// [style] in [language], on the globe at low zooms when [globe].
Future<VmapStyle> resolveStyle(
  DemoStyle style, {
  required bool globe,
  required List<String> language,
}) async {
  final builtIn = style.builtIn;
  if (builtIn != null) {
    return builtIn == VmapStyle.dark
        ? VmapStyle.builtIn(palette: VmapPalette.dark, nameKeys: language)
        : VmapStyle.builtIn(nameKeys: language);
  }
  final document = Map<String, Object?>.of(await _document(style.url!));
  document['sky'] = _sky;
  if (globe) {
    document['projection'] = {'type': 'globe'};
  } else {
    document.remove('projection');
  }
  return VmapStyle.json(document, nameKeys: language);
}
