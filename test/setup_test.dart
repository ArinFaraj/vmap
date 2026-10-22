import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/setup.dart';

void main() {
  late Directory app;

  setUp(() {
    app = Directory.systemTemp.createTempSync('vmap_setup');
    void write(String path, String text) => (File(
      '${app.path}/$path',
    )..createSync(recursive: true)).writeAsStringSync(text);
    write('pubspec.yaml', 'name: app\n');
    write(
      'android/app/src/main/AndroidManifest.xml',
      '<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n'
          '    <application\n        android:label="app">\n'
          '    </application>\n</manifest>\n',
    );
    const plist =
        '<?xml version="1.0" encoding="UTF-8"?>\n<plist version="1.0">\n'
        '<dict>\n\t<key>CFBundleName</key>\n\t<string>app</string>\n'
        '</dict>\n</plist>\n';
    write('ios/Runner/Info.plist', plist);
    write('macos/Runner/Info.plist', plist);
    write(
      'macos/Runner/Release.entitlements',
      plist.replaceFirst(
        '<dict>\n',
        '<dict>\n\t<key>com.apple.security.network.client</key>\n\t<false/>\n',
      ),
    );
    write(
      'windows/runner/main.cpp',
      'int main() {\n  flutter::DartProject project(L"data");\n  return 0;\n}\n',
    );
  });

  tearDown(() => app.deleteSync(recursive: true));

  String read(String path) => File('${app.path}/$path').readAsStringSync();

  test('switches Flutter GPU on in every platform the app has', () {
    final steps = setUpApp(app);
    final manifest = read('android/app/src/main/AndroidManifest.xml');
    expect(manifest, contains('io.flutter.embedding.android.EnableFlutterGPU'));
    expect(manifest, contains('android.permission.INTERNET'));
    expect(
      read('ios/Runner/Info.plist'),
      contains('<key>FLTEnableFlutterGPU</key>\n\t<true/>'),
    );
    expect(
      read('macos/Runner/Release.entitlements'),
      contains('<key>com.apple.security.network.client</key>\n\t<true/>'),
    );
    expect(
      read('windows/runner/main.cpp'),
      contains('project(L"data");\n  project.set_enable_flutter_gpu(true);'),
    );
    final linux = steps.singleWhere((s) => s.platform == 'Linux');
    expect(linux.result, SetupResult.absent);
    final debug = steps.singleWhere(
      (s) => s.file.endsWith('DebugProfile.entitlements'),
    );
    expect(debug.result, SetupResult.unrecognised);
  });

  test('changes nothing the second time, and checking finds it all on', () {
    setUpApp(app);
    final before = read('ios/Runner/Info.plist');
    final again = setUpApp(app, check: true);
    expect(again.where((s) => s.result == SetupResult.missing), isEmpty);
    expect(again.where((s) => s.result == SetupResult.changed), isEmpty);
    expect(read('ios/Runner/Info.plist'), before);
  });

  test('checking writes nothing', () {
    final before = read('android/app/src/main/AndroidManifest.xml');
    final steps = setUpApp(app, check: true);
    expect(steps.where((s) => s.result == SetupResult.missing), isNotEmpty);
    expect(read('android/app/src/main/AndroidManifest.xml'), before);
  });
}
