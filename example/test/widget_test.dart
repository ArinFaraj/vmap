import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';
import 'package:vmap_example/main.dart';

void main() {
  testWidgets('the example shows a map with its controls', (tester) async {
    await tester.pumpWidget(const ExampleApp());
    expect(find.byType(Vmap), findsOneWidget);
    expect(find.text('Liberty'), findsOneWidget);
  });
}
