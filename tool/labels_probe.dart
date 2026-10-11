import 'dart:io';
import 'dart:typed_data';

import 'package:vmap/src/mvt.dart';
import 'package:vmap/src/tile_builder.dart';

void main(List<String> a) {
  for (final f in a) {
    final z = int.parse(f.split('/').last.split('-').first);
    final bytes = File(f).readAsBytesSync();
    final t = TileBuilder(const ['name']).build(bytes, z);
    final by = <int, int>{};
    for (final l in t.labels) {
      by[l.labelClass] = (by[l.labelClass] ?? 0) + 1;
    }
    stdout.writeln('$f labels=${t.labels.length} $by');
    final tile = MvtTile.decode(Uint8List.fromList(bytes));
    final sink = GeometrySink();
    for (final name in ['place', 'poi']) {
      final layer = tile.layers[name];
      if (layer == null) continue;
      for (final ft in layer.features.take(14)) {
        sink.clear();
        ft.readGeometry(sink);
        final tags = ft.allTags(layer);
        stdout.writeln(
          '  $name ${tags['class']}/${tags['subclass']} rank=${tags['rank']} "${tags['name']}" at ${sink.coords[0].round()},${sink.coords[1].round()}',
        );
      }
    }
  }
}
