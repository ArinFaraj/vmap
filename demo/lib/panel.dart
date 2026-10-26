import 'package:flutter/material.dart';

import 'main.dart';
import 'styles.dart';
import 'tour.dart';

class ExplorePanel extends StatelessWidget {
  const ExplorePanel({
    required this.style,
    required this.globe,
    required this.terrain,
    required this.data,
    required this.language,
    required this.onStyle,
    required this.onGlobe,
    required this.onTerrain,
    required this.onData,
    required this.onLanguage,
    required this.onPlace,
    required this.onTilt,
    required this.onNorth,
    super.key,
  });

  final DemoStyle style;
  final bool globe, terrain;
  final DataLayer data;
  final String language;
  final ValueChanged<DemoStyle> onStyle;
  final ValueChanged<bool> onGlobe, onTerrain;
  final ValueChanged<DataLayer> onData;
  final ValueChanged<String> onLanguage;
  final ValueChanged<TourStop> onPlace;
  final VoidCallback onTilt, onNorth;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 300,
    child: Glass(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const _Heading('Style'),
            _Chips<DemoStyle>(
              values: demoStyles,
              selected: style,
              label: (s) => s.name,
              onPick: onStyle,
            ),
            const SizedBox(height: 8),
            _Switch(
              label: 'Globe at low zooms',
              value: globe && style.canGlobe,
              onChanged: style.canGlobe ? onGlobe : null,
            ),
            _Switch(label: 'Terrain', value: terrain, onChanged: onTerrain),
            const _Heading('Your data'),
            _Chips<DataLayer>(
              values: DataLayer.values,
              selected: data,
              label: (d) => switch (d) {
                DataLayer.none => 'None',
                DataLayer.heatmap => 'Heatmap',
                DataLayer.clusters => 'Clusters',
              },
              onPick: onData,
            ),
            const _Heading('Labels'),
            _Chips<String>(
              values: demoLanguages.keys.toList(),
              selected: language,
              label: (l) => l,
              onPick: onLanguage,
            ),
            const _Heading('Camera'),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                OutlinedButton.icon(
                  onPressed: onTilt,
                  icon: const Icon(Icons.threed_rotation_rounded, size: 18),
                  label: const Text('Tilt'),
                ),
                OutlinedButton.icon(
                  onPressed: onNorth,
                  icon: const Icon(Icons.navigation_rounded, size: 18),
                  label: const Text('North up'),
                ),
              ],
            ),
            const _Heading('Fly to'),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final (name, stop) in [
                  ('World', tourStops[0]),
                  ('Erbil', tourStops[1]),
                  ('Manhattan', tourStops[2]),
                  ('Matterhorn', tourStops[3]),
                ])
                  ActionChip(label: Text(name), onPressed: () => onPlace(stop)),
              ],
            ),
          ],
        ),
      ),
    ),
  );
}

class _Heading extends StatelessWidget {
  const _Heading(this.text);

  final String text;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 14, bottom: 8),
    child: Text(
      text.toUpperCase(),
      style: TextStyle(
        fontSize: 11,
        letterSpacing: 1.2,
        fontWeight: FontWeight.w600,
        color: Colors.white.withValues(alpha: 0.55),
      ),
    ),
  );
}

class _Chips<T> extends StatelessWidget {
  const _Chips({
    required this.values,
    required this.selected,
    required this.label,
    required this.onPick,
  });

  final List<T> values;
  final T selected;
  final String Function(T) label;
  final ValueChanged<T> onPick;

  @override
  Widget build(BuildContext context) => Wrap(
    spacing: 6,
    runSpacing: 6,
    children: [
      for (final v in values)
        ChoiceChip(
          label: Text(label(v)),
          selected: v == selected,
          onSelected: (_) => onPick(v),
        ),
    ],
  );
}

class _Switch extends StatelessWidget {
  const _Switch({
    required this.label,
    required this.value,
    required this.onChanged,
  });

  final String label;
  final bool value;
  final ValueChanged<bool>? onChanged;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(child: Text(label, style: const TextStyle(fontSize: 14))),
      Switch(value: value, onChanged: onChanged),
    ],
  );
}
