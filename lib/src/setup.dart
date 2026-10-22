import 'dart:io';

/// What setting up one platform found or did.
enum SetupResult {
  /// Already set up.
  ready,

  /// Set up now.
  changed,

  /// Would be set up, when only checking.
  missing,

  /// The app has no folder for the platform.
  absent,

  /// The file is there but not as Flutter makes it: set it up by hand.
  unrecognised,
}

/// One change made, or wanted, in a file of the app.
class SetupStep {
  const SetupStep(this.platform, this.file, this.what, this.result);

  final String platform;
  final String file;
  final String what;
  final SetupResult result;
}

/// Switches Flutter GPU on in the Flutter app at [root], and lets it load
/// tiles: the Android manifest's meta-data and internet permission, the iOS
/// and macOS Info.plist keys and the macOS network entitlements, and the
/// Windows and Linux runners. Writes nothing when [check] is true.
List<SetupStep> setUpApp(Directory root, {bool check = false}) {
  final steps = <SetupStep>[];
  void edit(
    String platform,
    String path,
    String what,
    String? Function(String text) change,
    bool Function(String text) done,
  ) {
    final file = File('${root.path}/$path');
    if (!file.existsSync()) {
      final folder = Directory('${root.path}/${path.split('/').first}');
      steps.add(
        SetupStep(
          platform,
          path,
          what,
          folder.existsSync() ? SetupResult.unrecognised : SetupResult.absent,
        ),
      );
      return;
    }
    final text = file.readAsStringSync();
    if (done(text)) {
      steps.add(SetupStep(platform, path, what, SetupResult.ready));
      return;
    }
    final changed = change(text);
    if (changed == null) {
      steps.add(SetupStep(platform, path, what, SetupResult.unrecognised));
      return;
    }
    if (!check) file.writeAsStringSync(changed);
    steps.add(
      SetupStep(
        platform,
        path,
        what,
        check ? SetupResult.missing : SetupResult.changed,
      ),
    );
  }

  const manifest = 'android/app/src/main/AndroidManifest.xml';
  edit(
    'Android',
    manifest,
    'Flutter GPU',
    (text) => _after(
      text,
      RegExp(r'<application\b[^>]*>'),
      '\n        <meta-data\n'
      '            android:name="io.flutter.embedding.android.EnableFlutterGPU"\n'
      '            android:value="true" />',
    ),
    (text) => text.contains('io.flutter.embedding.android.EnableFlutterGPU'),
  );
  edit(
    'Android',
    manifest,
    'internet permission',
    (text) => _after(
      text,
      RegExp(r'<manifest\b[^>]*>'),
      '\n    <uses-permission android:name="android.permission.INTERNET"/>',
    ),
    (text) => text.contains('android.permission.INTERNET'),
  );
  for (final platform in const ['iOS', 'macOS']) {
    edit(
      platform,
      '${platform.toLowerCase()}/Runner/Info.plist',
      'Flutter GPU',
      (text) => _plistTrue(text, 'FLTEnableFlutterGPU'),
      (text) => _plistIsTrue(text, 'FLTEnableFlutterGPU'),
    );
  }
  for (final name in const ['DebugProfile', 'Release']) {
    edit(
      'macOS',
      'macos/Runner/$name.entitlements',
      'network access',
      (text) => _plistTrue(text, 'com.apple.security.network.client'),
      (text) => _plistIsTrue(text, 'com.apple.security.network.client'),
    );
  }
  edit('Windows', 'windows/runner/main.cpp', 'Flutter GPU', (text) {
    final m = RegExp(
      r'^([ \t]*)flutter::DartProject (\w+)\(.*\);[ \t]*$',
      multiLine: true,
    ).firstMatch(text);
    if (m == null) return null;
    return text.replaceRange(
      m.end,
      m.end,
      '\n${m[1]}${m[2]}.set_enable_flutter_gpu(true);',
    );
  }, (text) => text.contains('set_enable_flutter_gpu(true)'));
  edit('Linux', 'linux/runner/my_application.cc', 'Flutter GPU', (text) {
    final m = RegExp(
      r'^([ \t]*).*FlDartProject\) (\w+) = fl_dart_project_new\(\);[ \t]*$',
      multiLine: true,
    ).firstMatch(text);
    if (m == null) return null;
    return text.replaceRange(
      m.end,
      m.end,
      '\n${m[1]}fl_dart_project_set_enable_flutter_gpu(${m[2]}, TRUE);',
    );
  }, (text) => text.contains('fl_dart_project_set_enable_flutter_gpu('));
  return steps;
}

/// [text] with [insert] right after the first match of [pattern], or null.
String? _after(String text, RegExp pattern, String insert) {
  final m = pattern.firstMatch(text);
  return m == null ? null : text.replaceRange(m.end, m.end, insert);
}

bool _plistIsTrue(String text, String key) =>
    RegExp('<key>${RegExp.escape(key)}</key>\\s*<true\\s*/>').hasMatch(text);

/// [text], a property list, with [key] set to true: a false value turned,
/// or the key added at the top of the root dictionary.
String? _plistTrue(String text, String key) {
  final existing = RegExp('(<key>${RegExp.escape(key)}</key>\\s*)<false\\s*/>')
      .firstMatch(text);
  if (existing != null) {
    return text.replaceRange(
      existing.start,
      existing.end,
      '${existing[1]}<true/>',
    );
  }
  return _after(text, RegExp(r'<dict>'), '\n\t<key>$key</key>\n\t<true/>');
}
