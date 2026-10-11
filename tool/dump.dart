import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'dart:typed_data';

import 'package:vmap/src/mvt.dart';

Future<void> main(List<String> args) async {
  final z = int.parse(args[0]);
  final lat = double.parse(args[1]);
  final lon = double.parse(args[2]);
  final n = 1 << z;
  final x = ((lon + 180) / 360 * n).floor();
  final r = lat * pi / 180;
  final y = ((1 - log(tan(r) + 1 / cos(r)) / pi) / 2 * n).floor();
  final client = HttpClient();
  final tj = await (await client.getUrl(
    Uri.parse('https://tiles.openfreemap.org/planet'),
  )).close();
  final tileJson = jsonDecode(await utf8.decodeStream(tj)) as Map;
  final url = (tileJson['tiles'] as List).first
      .toString()
      .replaceAll('{z}', '$z')
      .replaceAll('{x}', '$x')
      .replaceAll('{y}', '$y');
  final res = await (await client.getUrl(Uri.parse(url))).close();
  final b = BytesBuilder();
  await res.forEach(b.add);
  final bytes = b.takeBytes();
  File('/tmp/ofm/$z-$x-$y.pbf').writeAsBytesSync(bytes);
  print(
    '$url ${bytes.length} bytes headers=${res.headers.value('content-encoding')} cache=${res.headers.value('cache-control')}',
  );
  final sw = Stopwatch()..start();
  final tile = MvtTile.decode(Uint8List.fromList(bytes));
  print('decode ${sw.elapsedMicroseconds}us');
  final sink = GeometrySink();
  for (final layer in tile.layers.values) {
    var pts = 0;
    final classes = <String, int>{};
    for (final f in layer.features) {
      sink.clear();
      f.readGeometry(sink);
      pts += sink.coordCount >> 1;
      final t = f.allTags(layer);
      final c =
          '${f.type}:${t['class']}/${t['subclass'] ?? ''}${t['brunnel'] != null ? ' ${t['brunnel']}' : ''}';
      classes[c] = (classes[c] ?? 0) + 1;
    }
    print(
      '\n== ${layer.name} features=${layer.features.length} points=$pts extent=${layer.extent}',
    );
    print('   keys: ${layer.keys.join(', ')}');
    final sorted = classes.entries.toList()..sort((a, b) => b.value - a.value);
    print('   ${sorted.take(14).map((e) => '${e.key}=${e.value}').join('  ')}');
    if (const [
      'place',
      'transportation_name',
      'water_name',
      'aerodrome_label',
      'park',
    ].contains(layer.name)) {
      for (final f in layer.features.take(3)) {
        print('   e.g. ${f.allTags(layer)}');
      }
    }
  }
  client.close();
}
