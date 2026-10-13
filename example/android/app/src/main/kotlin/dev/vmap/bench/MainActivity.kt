package dev.vmap.bench

import android.os.Build
import android.os.Bundle
import android.view.Surface
import android.view.SurfaceHolder
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.android.FlutterSurfaceView

class MainActivity : FlutterActivity() {
    private var fastestRate = 60f

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Several vendors hold an app at 60 Hz until it names a display mode.
        val display = if (Build.VERSION.SDK_INT >= 30) display else @Suppress("DEPRECATION") windowManager.defaultDisplay
        val current = display?.mode ?: return
        val fastest = display.supportedModes
            .filter { it.physicalWidth == current.physicalWidth && it.physicalHeight == current.physicalHeight }
            .maxByOrNull { it.refreshRate } ?: return
        fastestRate = fastest.refreshRate
        window.attributes = window.attributes.apply {
            preferredDisplayModeId = fastest.modeId
            preferredRefreshRate = fastest.refreshRate
        }
    }

    // Android 15 draws a surface that does not vote for a rate at the
    // display's "normal" category, 60 Hz on many phones, whatever mode the
    // window prefers. The surface has to ask for the rate itself.
    override fun onFlutterSurfaceViewCreated(flutterSurfaceView: FlutterSurfaceView) {
        super.onFlutterSurfaceViewCreated(flutterSurfaceView)
        if (Build.VERSION.SDK_INT < 30) return
        flutterSurfaceView.holder.addCallback(object : SurfaceHolder.Callback {
            override fun surfaceCreated(holder: SurfaceHolder) = vote(holder)
            override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) = vote(holder)
            override fun surfaceDestroyed(holder: SurfaceHolder) {}
        })
    }

    private fun vote(holder: SurfaceHolder) {
        val surface = holder.surface ?: return
        if (!surface.isValid) return
        if (Build.VERSION.SDK_INT >= 31) {
            surface.setFrameRate(
                fastestRate,
                Surface.FRAME_RATE_COMPATIBILITY_DEFAULT,
                Surface.CHANGE_FRAME_RATE_ALWAYS,
            )
        } else {
            surface.setFrameRate(fastestRate, Surface.FRAME_RATE_COMPATIBILITY_DEFAULT)
        }
    }
}
