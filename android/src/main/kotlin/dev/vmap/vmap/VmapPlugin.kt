package dev.vmap.vmap

import android.app.Activity
import android.os.Build
import android.view.Surface
import android.view.SurfaceHolder
import android.view.SurfaceView
import android.view.View
import android.view.ViewGroup
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

/**
 * Asks Android to draw the app at the display's fastest refresh rate while
 * the map moves, and lets it go when the map rests.
 *
 * Android 15 draws a surface that casts no frame rate vote at the display's
 * "normal" category, 60 Hz on many phones, even when the window prefers a
 * faster mode. The vote has to be cast on Flutter's own surface.
 */
class VmapPlugin : FlutterPlugin, MethodChannel.MethodCallHandler, ActivityAware {
    private var channel: MethodChannel? = null
    private var activity: Activity? = null
    private var fast = false
    private val watched = java.util.WeakHashMap<SurfaceView, Boolean>()

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(binding.binaryMessenger, "vmap/frame_rate").also {
            it.setMethodCallHandler(this)
        }
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel?.setMethodCallHandler(null)
        channel = null
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
    }

    override fun onDetachedFromActivityForConfigChanges() {
        activity = null
    }

    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {
        activity = binding.activity
    }

    override fun onDetachedFromActivity() {
        activity = null
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "vote" -> {
                vote(call.argument<Boolean>("fast") ?: false)
                result.success(null)
            }
            else -> result.notImplemented()
        }
    }

    private fun vote(fast: Boolean) {
        this.fast = fast
        val activity = activity ?: return
        forEachSurfaceView(activity.window.decorView) { view ->
            // A surface made or remade later gets the current vote too: a vote
            // cast before Flutter's surface exists would otherwise be lost.
            if (watched.put(view, true) == null) {
                view.holder.addCallback(object : SurfaceHolder.Callback {
                    override fun surfaceCreated(holder: SurfaceHolder) = apply(holder.surface)
                    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) =
                        apply(holder.surface)
                    override fun surfaceDestroyed(holder: SurfaceHolder) {}
                })
            }
            view.holder.surface?.let { apply(it) }
        }
    }

    private fun apply(surface: Surface?) {
        if (Build.VERSION.SDK_INT < 30 || surface == null || !surface.isValid) return
        val activity = activity ?: return
        val display = activity.display ?: return
        val rate = if (fast) display.supportedModes
            .filter { it.physicalWidth == display.mode.physicalWidth && it.physicalHeight == display.mode.physicalHeight }
            .maxOfOrNull { it.refreshRate } ?: 0f
        else 0f
        if (Build.VERSION.SDK_INT >= 31) {
            surface.setFrameRate(
                rate,
                Surface.FRAME_RATE_COMPATIBILITY_DEFAULT,
                if (fast) Surface.CHANGE_FRAME_RATE_ALWAYS else Surface.CHANGE_FRAME_RATE_ONLY_IF_SEAMLESS,
            )
        } else {
            surface.setFrameRate(rate, Surface.FRAME_RATE_COMPATIBILITY_DEFAULT)
        }
    }

    private fun forEachSurfaceView(view: View, action: (SurfaceView) -> Unit) {
        if (view is SurfaceView) action(view)
        if (view is ViewGroup) {
            for (i in 0 until view.childCount) forEachSurfaceView(view.getChildAt(i), action)
        }
    }
}
