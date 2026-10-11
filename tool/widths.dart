import 'package:vmap/src/style.dart';

void main() {
  for (var p = 0; p < passes.length; p++) {
    final w = passes[p].width;
    // ignore: avoid_print
    print(
      '$p group=${passes[p].group} tone=${passes[p].tone} w14.5=${w?.at(14.5).toStringAsFixed(2)} ${w.runtimeType}',
    );
  }
}
