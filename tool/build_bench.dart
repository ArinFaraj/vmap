import 'dart:io';

import 'package:vmap/src/style.dart';
import 'package:vmap/src/tile_builder.dart';

void main(List<String> args) {
  final bytes = File(args[0]).readAsBytesSync();
  final z = int.parse(args[1]);
  final builder = TileBuilder(const ['name']);
  late BuiltTile tile;
  for (var i = 0; i < 20; i++) {
    tile = builder.build(bytes, z);
  }
  final sw = Stopwatch()..start();
  for (var i = 0; i < 20; i++) {
    tile = builder.build(bytes, z);
  }
  print('build ${(sw.elapsedMicroseconds / 20000).toStringAsFixed(2)} ms');
  var verts = 0;
  var tris = 0;
  final perGroup = <int, List<int>>{};
  for (final m in tile.meshes) {
    verts += m.chunk.positions.length ~/ 2;
    tris += m.chunk.indices.length ~/ 3;
    final g = perGroup.putIfAbsent(m.group, () => [0, 0, 0]);
    g[0]++;
    g[1] += m.chunk.positions.length ~/ 2;
    g[2] += m.chunk.indices.length ~/ 3;
  }
  print(
    'meshes=${tile.meshes.length} vertices=$verts triangles=$tris passes=${passes.length}',
  );
  perGroup.forEach(
    (g, v) => print('  group $g: chunks=${v[0]} verts=${v[1]} tris=${v[2]}'),
  );
  final kinds = <int, int>{};
  for (final l in tile.labels) {
    kinds[l.labelClass] = (kinds[l.labelClass] ?? 0) + 1;
  }
  print('labels=${tile.labels.length} byClass=$kinds');
  print(
    tile.labels
        .where((l) => l.kind == 0)
        .take(6)
        .map((l) => '${l.text}@${l.x.round()},${l.y.round()} p${l.priority}')
        .join(' | '),
  );
  print(
    tile.labels
        .where((l) => l.kind == 1)
        .take(6)
        .map((l) => '${l.text} pts=${l.line!.length ~/ 2} p${l.priority}')
        .join(' | '),
  );
}
