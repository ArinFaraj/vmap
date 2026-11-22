@TestOn('vm')
library;

import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/camera/camera.dart';
import 'package:vmap/src/camera/forecast.dart';
import 'package:vmap/src/camera/map_camera.dart';
import 'package:vmap/src/camera/view.dart' show BuildingReach;
import 'package:vmap/src/net/net.dart';
import 'package:vmap/src/options.dart';
import 'package:vmap/src/render/map_renderer.dart';
import 'package:vmap/src/style/expr.dart' show Rgba;
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/tiles/built_tile.dart';
import 'package:vmap/src/tiles/extrusion.dart';
import 'package:vmap/src/tiles/gpu_stream.dart';
import 'package:vmap/src/tiles/tile_fade.dart';
import 'package:vmap/src/tiles/tile_id.dart';
import 'package:vmap/src/tiles/tiles.dart';
import 'package:vmap/src/tiles/worker.dart';

class _Renderer extends MapRenderer {
  @override
  bool supports(StyleSheet sheet) => true;

  @override
  bool paint(ui.Canvas canvas, RenderFrame frame) => false;

  @override
  bool makeReady(LoadedTile tile, double scale, Stopwatch clock, int deadline) {
    return true;
  }

  @override
  bool canBuild(LoadedTile tile) => true;

  @override
  void dispose() {}
}

GpuStream _stream() => GpuStream(
  Float32List(3 * GpuStream.floatsPerVertex),
  Uint32List.fromList([0, 1, 2]),
  [(0, null)],
  Int32List.fromList([0, 3, 0]),
  Int32List.fromList([0, 3]),
);

const _size = ui.Size(512, 512);

MapFrame _frame(
  double zoom, {
  double x = 0.5,
  double y = 0.5,
  VmapCamera? soon,
  VmapCamera? ahead,
}) {
  final view = cameraAt(x: x, y: y, zoom: zoom).view(_size.width, _size.height);
  final center = view.center, screen = view.screenCenter;
  return MapFrame(
    zoom: zoom + 1,
    origin: ui.Offset(center.x - screen.x, center.y - screen.y),
    size: _size,
    rotation: 0,
    devicePixelRatio: 1,
    view: view,
    soon: soon?.view(_size.width, _size.height),
    ahead: ahead?.view(_size.width, _size.height),
  );
}

void main() {
  const style = <String, Object?>{
    'version': 8,
    'sources': {
      'roads': {
        'type': 'vector',
        'tiles': ['http://127.0.0.1:9/{z}/{x}/{y}'],
        'maxzoom': 14,
      },
    },
    'layers': [
      {
        'id': 'road',
        'type': 'line',
        'source': 'roads',
        'source-layer': 'road',
        'minzoom': 5,
        'maxzoom': 6,
      },
    ],
  };
  final sheet = StyleSheet.compile(style);
  final renderer = _Renderer();
  final clock = Stopwatch()..start();

  late TileSource source;
  late TileFade fade;
  var frame = 0;

  setUp(() {
    final pool = TilePool(
      const VmapNetworkOptions(workers: 1),
      style: style,
      nameKeys: null,
      sheet: sheet,
      source: 0,
      onLoaded: (_, _) {},
      shared: SharedFetches().fetch,
      onFailed: (_, _) {},
    );
    addTearDown(pool.close);
    source = TileSource(sheet.sources.first, pool);
    fade = TileFade(200);
    frame = 0;
  });

  void prepare(LoadedTile tile, double scale) =>
      tile.prepare(scale, clock, 1 << 40, renderer: renderer);

  LoadedTile ready(TileId id) {
    final tile = LoadedTile(
      id,
      BuiltTile(const [], const [], const [], _stream()),
      sheet,
    );
    prepare(tile, 1);
    return source.tiles[id] = tile;
  }

  LoadedTile built(TileId id) {
    final building =
        (ExtrusionBuilder(0)..add(
              Float64List.fromList([0, 0, 9, 0, 9, 9, 0, 9, 0, 0]),
              [0],
              [5],
              12,
              0,
              const Rgba(1, 0, 0, 1),
            ))
            .finish()!;
    final tile = LoadedTile(
      id,
      BuiltTile(const [], const [], [building], _stream()),
      sheet,
    );
    prepare(tile, 1);
    return source.tiles[id] = tile;
  }

  bool cover(MapFrame camera) => source.cover(
    camera,
    camera.zoom - 1,
    frame: ++frame,
    nowMs: 0,
    prepare: prepare,
  );

  /// One frame at [nowMs], as the painter draws it: the fade moves on, the
  /// source covers the view, and the fade settles.
  ({bool waiting, bool rising}) step(
    MapFrame camera, {
    int nowMs = 0,
    bool fades = true,
    double? dataZoom,
    bool standing = false,
    BuildingReach? farBuildings,
  }) {
    fade.advance(nowMs, fades: fades, pressed: source.shown.held);
    final waiting = source.cover(
      camera,
      dataZoom ?? camera.zoom - 1,
      frame: ++frame,
      nowMs: nowMs,
      prepare: prepare,
      standing: standing,
      farBuildings: farBuildings,
      newest: fade.newest,
    );
    final (:rising, before: _) = fade.settle(
      [source],
      camera,
      frame: frame,
      nowMs: nowMs,
      prepare: prepare,
    );
    return (waiting: waiting, rising: rising);
  }

  Iterable<LoadedTile> tilesOf(TilePicture picture) =>
      picture.ideal.followedBy(picture.fallback).map((d) => d.tile);

  MapFrame tilted() {
    const n = 1 << 15;
    final view = cameraAt(
      x: 16000.5 / n,
      y: 16000.5 / n,
      zoom: 15.3,
      pitch: 70,
    ).view(_size.width, _size.height);
    final center = view.center, screen = view.screenCenter;
    return MapFrame(
      zoom: 16.3,
      origin: ui.Offset(center.x - screen.x, center.y - screen.y),
      size: _size,
      rotation: 0,
      devicePixelRatio: 1,
      view: view,
    );
  }

  test('a tile ready where the view already looked fades in', () {
    final camera = _frame(5.2);
    step(camera);
    expect(fade.running, isFalse);

    final tile = ready(source.missing.first.$1);
    step(camera);
    expect(tile.joined, 1);
    expect(fade.running, isTrue);
    expect(tilesOf(source.shown), contains(tile));
    expect(tilesOf(source.before), isNot(contains(tile)));
    step(camera);
    expect(tilesOf(source.shown), contains(tile));
  });

  test('a tile at a place the view has just reached shows at once', () {
    step(_frame(5.2));
    final far = _frame(5.2, x: 0.9, y: 0.3);
    step(far);
    step(_frame(5.2));
    final tile = ready(source.missing.first.$1);
    for (final (id, _) in [...source.missing]) {
      if (id != tile.id) ready(id);
    }
    source.tiles.removeWhere((_, t) => !identical(t, tile));

    step(far);
    expect(fade.running, isFalse);

    final arrived = ready(source.missing.first.$1);
    step(_frame(5.2, x: 0.1, y: 0.7));
    step(far);
    expect(tilesOf(source.shown), contains(arrived));
    expect(fade.running, isFalse);
    expect(arrived.joined, 0);
  });

  test('with no fade every tile joins at once', () {
    final camera = _frame(5.2);
    step(camera, fades: false);
    final tile = ready(source.missing.first.$1);
    step(camera, fades: false);
    expect(fade.running, isFalse);
    expect(tile.joined, 0);
  });

  test('a tile ready while others fade in waits for the next picture', () {
    final camera = _frame(5.2);
    step(camera);
    final ids = [for (final (id, _) in source.missing) id];
    final first = ready(ids[0]);
    step(camera);
    expect(fade.picture, 1);
    expect(source.shown.held, isFalse);

    final late = ready(ids[1]);
    expect(step(camera).waiting, isTrue, reason: 'still waiting');
    expect(source.shown.held, isTrue);
    expect(tilesOf(source.shown), contains(first));
    expect(tilesOf(source.shown), isNot(contains(late)));
    expect(late.joined, isNull);

    expect(step(camera, nowMs: 1000).waiting, isFalse);
    expect(fade.picture, 2);
    expect(late.joined, 2);
    expect(tilesOf(source.before), contains(first));
    expect(tilesOf(source.before), isNot(contains(late)));
  });

  test('a tile standing in for ones on their way keeps its own layers', () {
    final parent = ready(const TileId(5, 16, 16))..joined = 0;
    final camera = _frame(6.4, x: 16.5 / 32, y: 16.5 / 32);
    cover(camera);
    final standIn = source.shown.ideal
        .followedBy(source.shown.fallback)
        .firstWhere((d) => identical(d.tile, parent));
    expect(standIn.builtFor, (5.0, 6.0));
    expect(standIn.gate(6.4), lessThan(6));
    expect(standIn.gate(6.4), greaterThan(5.99));
    expect(standIn.gate(5.5), 5.5);
    expect(standIn.gate(4.2), 5);

    final road = sheet.layers.single;
    expect(road.showsAt(6.4), isFalse);
    expect(road.showsAt(standIn.gate(6.4)), isTrue);
  });

  test('a tile standing in for ones that failed shows the view\'s layers', () {
    final parent = ready(const TileId(5, 16, 16))..joined = 0;
    final camera = _frame(6.4, x: 16.5 / 32, y: 16.5 / 32);
    cover(camera);
    for (final (id, _) in source.missing) {
      source.retries.fail(id, 0, corrupt: false);
    }
    cover(camera);
    final standIn = source.shown.ideal
        .followedBy(source.shown.fallback)
        .firstWhere((d) => identical(d.tile, parent));
    expect(standIn.builtFor, isNull);
    expect(standIn.gate(6.4), 6.4);
  });

  test('a tile of the deepest zoom keeps its layers at every zoom past it', () {
    cover(_frame(3));
    final z = source.maxDataZoom, n = 1 << z;
    final deepest = ready(TileId(z, n ~/ 2, n ~/ 2))..joined = 0;
    final camera = _frame(z + 1.4, x: 0.5 + 0.5 / n, y: 0.5 + 0.5 / n);
    cover(camera);
    final standIn = source.shown.ideal
        .followedBy(source.shown.fallback)
        .firstWhere((d) => identical(d.tile, deepest));
    expect(standIn.builtFor, (z.toDouble(), double.infinity));
    expect(standIn.gate(z + 1.4), z + 1.4);
    expect(standIn.gate(z - 1.0), z);
  });

  test('buildings past the ground tiles stand at once', () {
    final camera = tilted();
    ready(const TileId(14, 8000, 8000)).joined = 0;
    final ahead = built(const TileId(15, 16000, 16000));

    step(
      camera,
      nowMs: 5000,
      dataZoom: 15.3,
      standing: true,
      farBuildings: camera.view.buildingReach(),
    );
    final far = source.shown.far.single;
    expect(far.tile, same(ahead));
    expect(far.sunk, 0);
  });

  test('buildings past the ground tiles fade in with the next picture', () {
    final camera = tilted();
    void stepAt(int nowMs) => step(
      camera,
      nowMs: nowMs,
      dataZoom: 15.3,
      standing: true,
      farBuildings: camera.view.buildingReach(),
    );

    ready(const TileId(14, 8000, 8000)).joined = 0;
    final ahead = built(const TileId(15, 16000, 16000));
    fade
      ..start(0)
      ..start(0);

    stepAt(0);
    expect(source.shown.far, isEmpty);
    expect(source.shown.held, isTrue);

    stepAt(1000);
    expect(ahead.joined, 3);
    expect(source.shown.far.single.tile, same(ahead));
    expect(source.before.far, isEmpty);
  });

  test('four ready tiles stand in for their parent, not a coarser one', () {
    final grand = ready(const TileId(5, 16, 16))..joined = 0;
    final camera = _frame(6.4, x: 16.5 / 32, y: 16.5 / 32);
    cover(camera);
    final wanted = [for (final (id, _) in source.missing) id];
    expect(wanted, isNotEmpty);
    final children = [
      for (final id in wanted)
        for (var c = 0; c < 4; c++)
          ready(TileId(id.z + 1, id.x * 2 + (c & 1), id.y * 2 + (c >> 1)))
            ..joined = 0,
    ];
    cover(camera);
    final drawn = tilesOf(source.shown).toList();
    expect(drawn, isNot(contains(grand)));
    for (final child in children) {
      expect(drawn, contains(child));
    }
  });

  test('the buildings of a tile fading in stand up as it does', () {
    final camera = _frame(5.2);
    step(camera);
    final ids = [for (final (id, _) in source.missing) id];
    final fading = built(ids[0]);
    TileDraw drawOf(LoadedTile tile) =>
        source.shown.ideal.firstWhere((d) => identical(d.tile, tile));

    expect(step(camera, nowMs: 1000).rising, isTrue);
    expect(drawOf(fading).sunk, 1);
    expect(step(camera, nowMs: 1175).rising, isTrue);
    expect(drawOf(fading).sunk, closeTo(0.5, 1e-9));
    expect(step(camera, nowMs: 1350).rising, isFalse);
    expect(drawOf(fading).sunk, 0);

    final atOnce = built(ids[1]);
    expect(step(camera, nowMs: 2000, fades: false).rising, isFalse);
    expect(atOnce.joined, 0);
    expect(drawOf(atOnce).sunk, 0);
  });

  test('buildings that take the place of buildings do not sink first', () {
    built(const TileId(5, 16, 16))
      ..joined = 0
      ..stoodSinceMs = 0;
    final camera = _frame(6.4, x: 16.5 / 32, y: 16.5 / 32);
    step(camera, nowMs: 1000);
    final finer = [
      for (final (id, _) in [...source.missing]) built(id),
    ];
    expect(step(camera, nowMs: 1000).rising, isFalse);
    expect(fade.picture, 1);
    expect(finer.every((t) => t.stoodSinceMs == 650), isTrue);
  });

  test('the tiles the view will need by the time they come go first', () {
    const here = 6.2;
    final soon = cameraAt(x: 0.5, y: 0.5, zoom: 7.3);
    cover(_frame(here, soon: soon));
    expect(source.wantedNow, isNotEmpty);
    expect(source.wantedNow.every((id) => id.z == 7), isTrue);
    expect(source.wantedLater, isNotEmpty);
    expect(source.wantedLater.every((id) => id.z == 6), isTrue);
  });

  test('the cache holds five of the largest views of the last ten seconds', () {
    final tiles = [for (var x = 0; x < 120; x++) ready(TileId(9, x, 7))];
    void show(int count) => source.shown
      ..clear()
      ..ideal.addAll([
        for (final t in tiles.take(count)) TileDraw(t, 0, 0, 512),
      ]);

    show(22);
    source.evictBeyondScreens(56, 1, 0);
    expect(source.tiles, hasLength(110));
    show(20);
    source.evictBeyondScreens(56, 2, 9000);
    expect(source.tiles, hasLength(110));
    source.evictBeyondScreens(56, 3, 10500);
    expect(source.tiles, hasLength(100));
  });

  test('headed for a place, the tiles over it at every zoom are asked for', () {
    final ahead = cameraAt(x: 0.31, y: 0.42, zoom: 10.5);
    cover(_frame(4.2, ahead: ahead));
    final levels = {
      for (final id in source.wantedLater)
        if (id.z > 4) id.z,
    };
    expect(levels, {5, 6, 7, 8, 9, 10});
    final over = source.wantedLater.where((id) => id.z == 7).toList();
    expect(over, isNotEmpty);
    for (final id in over) {
      final n = 1 << id.z;
      expect((0.31 * n).floor() - id.x, inInclusiveRange(-1, 1));
      expect((0.42 * n).floor() - id.y, inInclusiveRange(-1, 1));
    }
  });

  group('the fade', () {
    test('eases from the picture before to the one after', () {
      final fade = TileFade(200);
      expect(fade.running, isFalse);
      expect(fade.mix, 1);
      fade.start(1000);
      expect(fade.picture, 1);
      expect(fade.mix, 0);
      fade.advance(1050, fades: true, pressed: false);
      expect(fade.mix, lessThan(0.25));
      fade.advance(1100, fades: true, pressed: false);
      expect(fade.mix, closeTo(0.5, 1e-9));
      fade.advance(1199, fades: true, pressed: false);
      expect(fade.running, isTrue);
      fade.advance(1200, fades: true, pressed: false);
      expect(fade.running, isFalse);
      expect(fade.mix, 1);
    });

    test('ends in half the time while tiles wait for it', () {
      final fade = TileFade(200)..start(0);
      fade.advance(50, fades: true, pressed: true);
      expect(fade.mix, closeTo(0.5, 1e-9));
      fade.advance(99, fades: true, pressed: true);
      expect(fade.running, isTrue);
      fade.advance(100, fades: true, pressed: true);
      expect(fade.running, isFalse);
    });

    test('ends at once where tiles do not fade', () {
      final fade = TileFade(200)..start(0);
      fade.advance(10, fades: false, pressed: false);
      expect(fade.running, isFalse);
      expect(fade.newest, isNull);
    });
  });

  group('the forecast', () {
    VmapCamera at(double zoom, {double x = 0.5, double bearing = 0}) =>
        cameraAt(x: x, y: 0.5, zoom: zoom, bearing: bearing);

    test('a camera at rest has none', () {
      final forecast = CameraForecast();
      expect(forecast.after(0.5), isNull);
      forecast.see(at(5), 0);
      forecast.see(at(5), 16000);
      expect(forecast.after(0.5), isNull);
    });

    test('a camera zooming is taken to go on, but not far', () {
      final forecast = CameraForecast();
      for (var i = 0; i < 10; i++) {
        forecast.see(at(5 + i * 0.016), i * 16000);
      }
      final last = 5 + 9 * 0.016;
      expect(forecast.after(0.5)!.zoom, closeTo(last + 0.5, 0.01));
      expect(forecast.after(10)!.zoom, closeTo(last + 1.5, 1e-9));
    });

    test('a camera headed for a place does not pass it', () {
      final forecast = CameraForecast();
      for (var i = 0; i < 10; i++) {
        forecast.see(at(5 + i * 0.016), i * 16000);
      }
      final soon = forecast.after(10, target: at(8))!;
      expect(soon.zoom, 8);
      expect(forecast.after(0.5, target: at(8))!.zoom, lessThan(6));
    });

    test('a long gap between frames is no movement', () {
      final forecast = CameraForecast();
      forecast.see(at(5), 0);
      forecast.see(at(5.1), 16000);
      expect(forecast.after(0.5), isNotNull);
      forecast.see(at(6), 900000);
      expect(forecast.after(0.5), isNull);
    });

    test('a turn across north goes the short way', () {
      final forecast = CameraForecast();
      for (var i = 0; i < 10; i++) {
        forecast.see(at(5, bearing: (350 + i * 2) % 360), i * 16000);
      }
      final soon = forecast.after(0.1)!;
      expect(soon.bearing % 360, closeTo((368 + 12.5) % 360, 1));
    });
  });
}
