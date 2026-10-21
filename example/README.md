# vmap example

One screen: a map of Erbil you can drag, pinch, turn and tilt, with a style
switcher, a marker with a name, a tap that tells what is under it, a button
that frames the old town, and one that flies to a view of 3D buildings.

```bash
flutter run
```

Flutter GPU is switched on for every platform here: in the Android
manifest, the iOS and macOS `Info.plist`, and the Windows and Linux
runners. Where it does not run, the map is drawn with the canvas instead.
