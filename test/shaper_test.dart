import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/text/font/font.dart';
import 'package:vmap/src/text/shaper.dart';
import 'package:vmap/src/text/unicode.dart';

/// Holds the shaper to HarfBuzz, glyph for glyph, on the cases
/// tool/gen_shaping_fixtures.dart wrote, or on another file of them that
/// SHAPING_FIXTURE names.
void main() {
  final path =
      Platform.environment['SHAPING_FIXTURE'] ?? 'test/fixtures/shaping.json';
  final fixture =
      jsonDecode(File(path).readAsStringSync()) as Map<String, dynamic>;
  final fonts = <String, Font>{};
  final shapers = <(String, int), Shaper>{};
  Shaper shaperFor(String path, int weight) =>
      shapers[(path, weight)] ??= Shaper(
        (fonts[path] ??= Font.parse(
          File(path).readAsBytesSync(),
        )).withAxes({'wght': weight.toDouble()}),
      );

  test('shapes every case as ${fixture['source']} does', () {
    final failures = <String>[];
    for (final c in (fixture['cases'] as List).cast<Map<String, dynamic>>()) {
      final shaper = shaperFor(c['font'] as String, c['wght'] as int);
      final text = c['text'] as String;
      final shaped = shaper.shape(
        text.runes.toList(),
        script: scriptNamed(c['script'] as String),
        rtl: c['rtl'] as bool,
      );
      final want = (c['glyphs'] as List).cast<List<dynamic>>();
      final got = [
        for (var i = 0; i < shaped.length; i++)
          <num>[
            shaped.glyphs[i],
            shaped.advances[i],
            shaped.xOffsets[i],
            shaped.yOffsets[i],
          ],
      ];
      String show(List<List<dynamic>> gs) =>
          [for (final g in gs) '${g[0]}+${g[1]}@${g[2]},${g[3]}'].join(' ');
      bool matches(List<num> g, List<dynamic> w) =>
          g[0] == w[0] &&
          (g[1] - (w[1] as num)).abs() <= 1 &&
          (g[2] - (w[2] as num)).abs() <= 1 &&
          (g[3] - (w[3] as num)).abs() <= 1;
      var same = got.length == want.length;
      for (var i = 0; same && i < got.length; i++) {
        same = matches(got[i], want[i]);
      }
      if (!same) {
        failures.add(
          '"$text" ${c['script']} ${c['wght']} in ${(c['font'] as String).split('/').last}:\n'
          '  got  ${show(got)}\n  want ${show(want)}',
        );
      }
    }
    expect(failures.take(8).join('\n'), isEmpty, reason: '${failures.length}');
  });

  test('measures every glyph as HarfBuzz does', () {
    final failures = <String>[];
    for (final c in (fixture['cases'] as List).cast<Map<String, dynamic>>()) {
      final font = shaperFor(c['font'] as String, c['wght'] as int).font;
      for (final g in (c['glyphs'] as List).cast<List<dynamic>>()) {
        final width = g[6] as int, height = g[7] as int;
        final (left, top, w, h) = font.extents(g[0] as int);
        final box = [left, top, w, h];
        final want = [g[4], g[5], width, height];
        for (var k = 0; k < 4; k++) {
          if ((box[k] - (want[k] as num)).abs() > 1.5) {
            failures.add(
              'glyph ${g[0]} at ${c['wght']} in ${(c['font'] as String).split('/').last}: '
              '${box.map((v) => v.round()).toList()} want $want',
            );
            break;
          }
        }
      }
    }
    expect(failures.toSet().take(8).join('\n'), isEmpty);
  });
}
