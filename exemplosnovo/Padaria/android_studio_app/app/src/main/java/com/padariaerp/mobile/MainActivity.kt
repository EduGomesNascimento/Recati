package com.padariaerp.mobile

import android.annotation.SuppressLint
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.net.http.SslError
import android.os.Build
import android.os.Bundle
import android.view.View
import android.webkit.SslErrorHandler
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var errorOverlay: LinearLayout
    private lateinit var errorMessage: TextView
    private lateinit var loadingOverlay: FrameLayout
    private lateinit var btnConfigServer: Button
    private lateinit var btnRetry: Button
    private lateinit var btnConfigFromError: Button

    private val prefs by lazy { getSharedPreferences(PREFS_NAME, MODE_PRIVATE) }

    companion object {
        private const val PREFS_NAME = "padaria_mobile_prefs"
        private const val KEY_BACKEND_URL = "backend_url"
        private const val KEY_LAST_WORKING_BACKEND_URL = "last_working_backend_url"
        private const val MOBILE_PATH = "/mobile"
        private const val HEALTH_PATH = "/health"
        private const val HEALTH_TIMEOUT_MS = 5000
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefresh)
        errorOverlay = findViewById(R.id.errorOverlay)
        errorMessage = findViewById(R.id.errorMessage)
        loadingOverlay = findViewById(R.id.loadingOverlay)
        btnConfigServer = findViewById(R.id.btnConfigServer)
        btnRetry = findViewById(R.id.btnRetry)
        btnConfigFromError = findViewById(R.id.btnConfigFromError)

        bindActions()
        setupWebView(webView)

        // Se existir estado salvo do WebView, restaura; caso contrario, inicia conexao nova.
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            loadMobileHome(forceReload = true)
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    private fun bindActions() {
        btnConfigServer.setOnClickListener { openServerConfigDialog() }
        btnConfigFromError.setOnClickListener { openServerConfigDialog() }
        btnRetry.setOnClickListener { loadMobileHome(forceReload = true) }

        swipeRefresh.setOnRefreshListener {
            if (webView.url.isNullOrBlank()) {
                loadMobileHome(forceReload = true)
            } else {
                webView.reload()
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView(view: WebView) {
        val settings = view.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.cacheMode = WebSettings.LOAD_NO_CACHE
        settings.allowFileAccess = false
        settings.loadsImagesAutomatically = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        settings.userAgentString = "${settings.userAgentString} PadariaERP-APK/1.0"

        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)

        view.webChromeClient = WebChromeClient()
        view.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val uri = request?.url ?: return false

                if (isBlockedPath(uri)) {
                    redirectToMobileDenied(view)
                    return true
                }

                if (!isHttpOrHttps(uri)) {
                    return true
                }

                if (!isSameBackend(uri)) {
                    openExternal(uri)
                    return true
                }

                return false
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                showLoading(true)
                super.onPageStarted(view, url, favicon)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                showLoading(false)
                hideError()
                swipeRefresh.isRefreshing = false
                super.onPageFinished(view, url)
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    val msg = error?.description?.toString()?.ifBlank { null }
                    showError(msg ?: "Nao foi possivel conectar ao servidor.")
                }
            }

            override fun onReceivedSslError(
                view: WebView?,
                handler: SslErrorHandler?,
                error: SslError?
            ) {
                handler?.cancel()
                showError("Falha de certificado SSL. Verifique o servidor.")
            }
        }
    }

    private fun loadMobileHome(forceReload: Boolean = false) {
        val baseUrl = getBackendBaseUrl()
        val mobileUrl = "$baseUrl$MOBILE_PATH"

        showLoading(true)
        hideError()

        checkBackendHealth(baseUrl) { ok, detail ->
            if (!ok) {
                showLoading(false)
                showError(detail ?: "Servidor indisponivel para o aplicativo.")
                return@checkBackendHealth
            }

            prefs.edit().putString(KEY_LAST_WORKING_BACKEND_URL, baseUrl).apply()
            if (forceReload || webView.url.isNullOrBlank()) {
                webView.loadUrl(mobileUrl)
            } else {
                webView.reload()
            }
        }
    }

    private fun openServerConfigDialog() {
        val input = EditText(this)
        input.hint = "http://192.168.0.10:8000"
        input.setText(getBackendBaseUrl())
        input.setSelection(input.text.length)

        val dialog = AlertDialog.Builder(this)
            .setTitle("Configurar servidor")
            .setMessage("Informe a URL base da API (ex.: http://192.168.0.10:8000).")
            .setView(input)
            .setNegativeButton("Cancelar", null)
            .setPositiveButton("Salvar", null)
            .create()

        dialog.setOnShowListener {
            val saveButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE)
            saveButton.setOnClickListener {
                val normalized = normalizeBaseUrl(input.text?.toString().orEmpty())
                if (normalized == null) {
                    input.error = "URL invalida"
                    return@setOnClickListener
                }

                prefs.edit().putString(KEY_BACKEND_URL, normalized).apply()
                Toast.makeText(this, "Servidor salvo: $normalized", Toast.LENGTH_SHORT).show()
                dialog.dismiss()
                loadMobileHome(forceReload = true)
            }
        }

        dialog.show()
    }

    private fun normalizeBaseUrl(raw: String): String? {
        val trimmed = raw.trim()
        if (trimmed.isBlank()) return null

        val candidate = if (trimmed.startsWith("http://", ignoreCase = true) ||
            trimmed.startsWith("https://", ignoreCase = true)
        ) {
            trimmed
        } else {
            "http://$trimmed"
        }

        return try {
            val uri = Uri.parse(candidate)
            val scheme = uri.scheme?.lowercase() ?: return null
            val host = uri.host ?: return null
            if (scheme != "http" && scheme != "https") return null

            val portPart = if (uri.port > 0) ":${uri.port}" else ""
            "$scheme://$host$portPart"
        } catch (_: Exception) {
            null
        }
    }

    private fun getBackendBaseUrl(): String {
        val saved = prefs.getString(KEY_BACKEND_URL, null)
        val lastWorking = prefs.getString(KEY_LAST_WORKING_BACKEND_URL, null)

        normalizeBaseUrl(saved ?: "")?.let { return it }
        normalizeBaseUrl(lastWorking ?: "")?.let { return it }

        val fallback = if (isProbablyEmulator()) {
            BuildConfig.EMULATOR_BACKEND_URL
        } else {
            BuildConfig.DEFAULT_BACKEND_URL
        }
        return normalizeBaseUrl(fallback) ?: "http://10.0.2.2:8000"
    }

    private fun isProbablyEmulator(): Boolean {
        return Build.FINGERPRINT.startsWith("generic", ignoreCase = true) ||
            Build.FINGERPRINT.contains("emulator", ignoreCase = true) ||
            Build.MODEL.contains("Emulator", ignoreCase = true) ||
            Build.MODEL.contains("Android SDK built for", ignoreCase = true) ||
            Build.MANUFACTURER.contains("Genymotion", ignoreCase = true) ||
            Build.BRAND.startsWith("generic", ignoreCase = true) ||
            Build.DEVICE.startsWith("generic", ignoreCase = true) ||
            Build.PRODUCT.contains("sdk", ignoreCase = true)
    }

    private fun checkBackendHealth(baseUrl: String, callback: (Boolean, String?) -> Unit) {
        Thread {
            if (!hasNetworkConnection()) {
                runOnUiThread { callback(false, "Sem internet/rede. Conecte e tente novamente.") }
                return@Thread
            }

            val url = "$baseUrl$HEALTH_PATH"
            try {
                val connection = URL(url).openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                connection.connectTimeout = HEALTH_TIMEOUT_MS
                connection.readTimeout = HEALTH_TIMEOUT_MS
                connection.instanceFollowRedirects = true

                val statusCode = connection.responseCode
                connection.disconnect()

                runOnUiThread {
                    if (statusCode in 200..299) {
                        callback(true, null)
                    } else {
                        callback(false, "Servidor respondeu com status $statusCode.")
                    }
                }
            } catch (_: Exception) {
                runOnUiThread {
                    callback(
                        false,
                        "Nao foi possivel conectar em $baseUrl. No celular fisico, use o IP da maquina do caixa na mesma rede.",
                    )
                }
            }
        }.start()
    }

    private fun hasNetworkConnection(): Boolean {
        val connectivityManager = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false

        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun isBlockedPath(uri: Uri): Boolean {
        val path = uri.path?.lowercase().orEmpty()
        return path.startsWith("/caixa") ||
            path.startsWith("/docs") ||
            path.startsWith("/redoc") ||
            path.startsWith("/openapi.json")
    }

    private fun redirectToMobileDenied(view: WebView?) {
        val deniedUrl = "${getBackendBaseUrl()}$MOBILE_PATH?acesso=negado"
        view?.loadUrl(deniedUrl)
    }

    private fun isHttpOrHttps(uri: Uri): Boolean {
        val scheme = uri.scheme?.lowercase()
        return scheme == "http" || scheme == "https"
    }

    private fun isSameBackend(uri: Uri): Boolean {
        val backendUri = Uri.parse(getBackendBaseUrl())
        val sameScheme = uri.scheme.equals(backendUri.scheme, ignoreCase = true)
        val sameHost = uri.host.equals(backendUri.host, ignoreCase = true)
        val samePort = normalizePort(uri) == normalizePort(backendUri)
        return sameScheme && sameHost && samePort
    }

    private fun normalizePort(uri: Uri): Int {
        if (uri.port > 0) return uri.port
        return if (uri.scheme.equals("https", ignoreCase = true)) 443 else 80
    }

    private fun openExternal(uri: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (_: Exception) {
            Toast.makeText(this, "Nao foi possivel abrir link externo.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun showLoading(show: Boolean) {
        loadingOverlay.visibility = if (show) View.VISIBLE else View.GONE
        if (!show) {
            swipeRefresh.isRefreshing = false
        }
    }

    private fun showError(message: String) {
        errorMessage.text = message
        errorOverlay.visibility = View.VISIBLE
        showLoading(false)
        swipeRefresh.isRefreshing = false
    }

    private fun hideError() {
        errorOverlay.visibility = View.GONE
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onDestroy() {
        webView.stopLoading()
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = WebViewClient()
        webView.destroy()
        super.onDestroy()
    }
}
