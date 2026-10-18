import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/label_view.dart';
import 'package:vmap/src/view.dart';

void main() {
  test(
    'a translate along the map turns with the bearing of a projected view',
    () {
      final view = LabelView()
        ..frame(
          rotation: 0,
          size: const ui.Size(256, 256),
          world: 256,
          origin: ui.Offset.zero,
          tilted: MapView(
            centerX: 0.5,
            centerY: 0.5,
            zoom: 0,
            width: 256,
            height: 256,
            bearing: 90,
          ),
        );
      final (x, y) = view.moved((_) => [10, 10], false, EvalContext());
      expect(x, closeTo(10, 1e-9));
      expect(y, closeTo(-10, 1e-9));
      expect(view.moved((_) => [10, 10], true, EvalContext()), (10.0, 10.0));
    },
  );
}
