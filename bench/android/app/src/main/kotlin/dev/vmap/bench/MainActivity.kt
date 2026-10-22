package dev.vmap.bench

import android.os.Build
import android.os.Bundle
import android.view.Surface
import android.view.SurfaceHolder
import android.view.SurfaceView
import android.view.View
import android.view.ViewGroup
import io.flutter.embedding.android.FlutterActivity

/**
 * Draws the app at the display's fastest refresh rate, which a map that
 * pans and zooms shows off. Android 15 draws a surface that casts no frame
 * rate vote at 60 Hz on many phones, whatever the window prefers, so the
 * vote is cast on Flutter's own surface too. An app decides this for
 * itself; vmap leaves it alone, and the benchmark measures at that rate.
 */
class MainActivity : FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return
        val display = display ?: return
        val fastest = display.supportedModes
            .filter {
                it.physicalWidth == display.mode.physicalWidth &&
                    it.physicalHeight == display.mode.physicalHeight
            }
            .maxByOrNull { it.refreshRate } ?: return
        window.attributes = window.attributes.apply { preferredDisplayModeId = fastest.modeId }
        window.decorView.post { voteOn(window.decorView, fastest.refreshRate) }
    }

    private fun voteOn(view: View, rate: Float) {
        if (view is SurfaceView) {
            view.holder.addCallback(object : SurfaceHolder.Callback {
                override fun surfaceCreated(holder: SurfaceHolder) = vote(holder.surface, rate)
                override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) =
                    vote(holder.surface, rate)
                override fun surfaceDestroyed(holder: SurfaceHolder) {}
            })
            vote(view.holder.surface, rate)
        }
        if (view is ViewGroup) {
            for (i in 0 until view.childCount) voteOn(view.getChildAt(i), rate)
        }
    }

    private fun vote(surface: Surface?, rate: Float) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R || surface == null || !surface.isValid) return
        surface.setFrameRate(rate, Surface.FRAME_RATE_COMPATIBILITY_DEFAULT)
    }
}
