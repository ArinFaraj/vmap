import Cocoa
import FlutterMacOS

@main
class AppDelegate: FlutterAppDelegate {
  /// Set by the render scripts, which draw offscreen: the app then runs
  /// without a Dock icon, a window on screen, or taking focus.
  static let inBackground = ProcessInfo.processInfo.environment["VMAP_BACKGROUND"] == "1"

  override func applicationWillFinishLaunching(_ notification: Notification) {
    if AppDelegate.inBackground {
      NSApp.setActivationPolicy(.accessory)
    }
    super.applicationWillFinishLaunching(notification)
  }

  override func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
    return true
  }

  override func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
    return true
  }
}
