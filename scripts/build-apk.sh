#!/usr/bin/env bash
set -e

PROJECT_ROOT="$(pwd)"

echo "=== 1. 버전 정보 로드 ==="
VERSION_FILE="$PROJECT_ROOT/public/version.json"

CURRENT_VERSION_CODE=$(node -e "try { const v = JSON.parse(require('fs').readFileSync('$VERSION_FILE', 'utf8')); console.log(v.versionCode || 15); } catch(e) { console.log(15); }")
CURRENT_VERSION_NAME=$(node -e "try { const v = JSON.parse(require('fs').readFileSync('$VERSION_FILE', 'utf8')); console.log(v.version || '1.0.14'); } catch(e) { console.log('1.0.14'); }")

echo ">> 빌드 버전: $CURRENT_VERSION_NAME (Code: $CURRENT_VERSION_CODE)"

echo "=== 2. Vite 웹 프로덕션 빌드 실행 ==="
npx vite build

# Sync version.json into dist
if [ -d "$PROJECT_ROOT/dist" ]; then
  cp "$VERSION_FILE" "$PROJECT_ROOT/dist/version.json"
fi

echo "=== 3. 한양도시락 Android APK 빌드 시작 ==="

BUILD_DIR="/tmp/apk_build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/hanyang/dosirak"
mkdir -p "$BUILD_DIR/res/drawable"
mkdir -p "$BUILD_DIR/res/drawable-hdpi"
mkdir -p "$BUILD_DIR/res/drawable-xhdpi"
mkdir -p "$BUILD_DIR/res/drawable-xxhdpi"
mkdir -p "$BUILD_DIR/res/drawable-xxxhdpi"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/assets/www"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/gen"

# 1. 고화질 앱 런처 아이콘 복사 (밀도별 최적화)
cp public/pwa-192x192.png "$BUILD_DIR/res/drawable/ic_launcher.png"
cp public/pwa-192x192.png "$BUILD_DIR/res/drawable-hdpi/ic_launcher.png"
cp public/pwa-192x192.png "$BUILD_DIR/res/drawable-xhdpi/ic_launcher.png"
cp public/pwa-512x512.png "$BUILD_DIR/res/drawable-xxhdpi/ic_launcher.png"
cp public/pwa-512x512.png "$BUILD_DIR/res/drawable-xxxhdpi/ic_launcher.png"

# 2. 웹 앱 전체 최신 빌드 에셋을 APK 내부 assets/www 로 복사 (100% 로컬 구동, 404 에러 원천 차단)
rm -f dist/*.apk
cp -r dist/* "$BUILD_DIR/assets/www/"
rm -f "$BUILD_DIR/assets/www/"*.apk

# 3. Android 리소스 정의
cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">한양도시락</string>
</resources>
EOF

cat << 'EOF' > "$BUILD_DIR/res/values/colors.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#C25E3E</color>
    <color name="primary_dark">#A6482A</color>
    <color name="accent">#E8985E</color>
    <color name="window_background">#FCFAF7</color>
</resources>
EOF

# 4. AndroidManifest.xml 작성
cat << EOF > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.hanyang.dosirak"
    android:versionCode="${CURRENT_VERSION_CODE}"
    android:versionName="${CURRENT_VERSION_NAME}">

    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:theme="@android:style/Theme.Light.NoTitleBar"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 5. Java 소스 작성 (로컬 내장 assets 우선 구동으로 404 에러 원천 방지 및 안전한 구동 보장)
cat << 'EOF' > "$BUILD_DIR/src/com/hanyang/dosirak/MainActivity.java"
package com.hanyang.dosirak;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import java.io.InputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;
    private static final String REMOTE_URL = "@REMOTE_APP_URL@";
    private static final String LOCAL_URL = "https://localhost/index.html";

    private boolean isNetworkAvailable() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                NetworkInfo netInfo = cm.getActiveNetworkInfo();
                return netInfo != null && netInfo.isConnected();
            }
        } catch (Exception ignored) {}
        return false;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                Window window = getWindow();
                window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
                window.setStatusBarColor(0xFFC25E3E);
            }
        } catch (Throwable ignored) {}

        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(0xFFFCFAF7);

        webView = new WebView(this);
        webView.setBackgroundColor(0xFFFCFAF7);

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setVisibility(View.GONE);
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, 8);
        progressBar.setLayoutParams(progressParams);

        rootLayout.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        rootLayout.addView(progressBar);

        setContentView(rootLayout);

        configureWebView();

        // 1. 실시간 동기화 보장: 인터넷 연결 시 라이브 서버에 직접 연결하여 메뉴/카테고리 실시간 자동 동기화
        // 2. 오프라인 안전 구동: 인터넷 미연결 시 내장 로컬 앱(LOCAL_URL)으로 안전하게 0ms 즉시 구동
        if (isNetworkAvailable()) {
            webView.loadUrl(REMOTE_URL);
        } else {
            webView.loadUrl(LOCAL_URL);
        }
    }

    private String getMimeType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".json") || lower.endsWith(".manifest") || lower.endsWith(".webmanifest")) return "application/json";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".ico")) return "image/x-icon";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".woff")) return "font/woff";
        if (lower.endsWith(".ttf")) return "font/ttf";
        return "application/octet-stream";
    }

    private WebResourceResponse handleIntercept(Uri uri) {
        if (uri == null) return null;
        String host = uri.getHost();
        if ("localhost".equalsIgnoreCase(host) || "appassets.androidplatform.net".equalsIgnoreCase(host)) {
            String path = uri.getPath();
            // CRITICAL: Do NOT return index.html for API requests
            if (path != null && path.startsWith("/api/")) {
                return null;
            }
            if (path == null || path.isEmpty() || path.equals("/")) {
                path = "/index.html";
            }
            String assetPath = "www" + (path.startsWith("/") ? path : ("/" + path));
            try {
                InputStream is = getAssets().open(assetPath);
                String mime = getMimeType(assetPath);
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Access-Control-Allow-Origin", "*");
                headers.put("Cache-Control", "no-cache, no-store, must-revalidate");
                return new WebResourceResponse(mime, "UTF-8", 200, "OK", headers, is);
            } catch (IOException e) {
                // Only return index.html for navigation routes (not API or assets)
                if (path.endsWith(".html") || !path.contains(".")) {
                    try {
                        InputStream is = getAssets().open("www/index.html");
                        Map<String, String> headers = new HashMap<String, String>();
                        headers.put("Access-Control-Allow-Origin", "*");
                        headers.put("Cache-Control", "no-cache, no-store, must-revalidate");
                        return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, is);
                    } catch (IOException ex) {
                        return null;
                    }
                }
                return null;
            }
        }
        return null;
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Enable CookieManager so Google Cloud / AI Studio cookie authentication flow works seamlessly
        try {
            CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptCookie(true);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                cookieManager.setAcceptThirdPartyCookies(webView, true);
            }
        } catch (Throwable ignored) {}

        // Bridge to communicate with React Web App
        webView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public String getNativeAppVersion() {
                return "@NEXT_VERSION_NAME@";
            }

            @JavascriptInterface
            public int getNativeVersionCode() {
                return @NEXT_VERSION_CODE@;
            }

            @JavascriptInterface
            public String getServerUrl() {
                return REMOTE_URL;
            }

            @JavascriptInterface
            public void refreshApp() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        webView.reload();
                    }
                });
            }
        }, "HanyangNativeBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;

                // Handle APK downloads directly
                if (url.endsWith(".apk") || url.contains("hanyang-dosirak.apk")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return true;
                    }
                }

                // Internal app URLs stay inside WebView (local, remote server domains, and cookie checks)
                if (url.startsWith("https://localhost") ||
                    url.startsWith("http://localhost") ||
                    url.contains("run.app") ||
                    url.contains("ai.studio") ||
                    url.contains("__cookie_check.html")) {
                    return false;
                }

                // External links (tel:, map, baemin, coupang, etc.) open in external apps
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return true;
                }
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    return handleIntercept(request.getUrl());
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return handleIntercept(Uri.parse(url));
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                // If remote network fails completely (offline, airplane mode), fallback to local offline copy
                if (errorCode == ERROR_HOST_LOOKUP || errorCode == ERROR_CONNECT || errorCode == ERROR_TIMEOUT) {
                    if (failingUrl != null && !failingUrl.startsWith("https://localhost")) {
                        view.loadUrl(LOCAL_URL);
                    }
                }
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                // Only on 404 or 5xx server errors fallback to local offline bundle
                if (request != null && request.isForMainFrame() && errorResponse != null) {
                    int statusCode = errorResponse.getStatusCode();
                    if (statusCode == 404 || statusCode >= 500) {
                        String reqUrl = request.getUrl() != null ? request.getUrl().toString() : "";
                        if (!reqUrl.startsWith("https://localhost")) {
                            view.post(new Runnable() {
                                @Override
                                public void run() {
                                    view.loadUrl(LOCAL_URL);
                                }
                            });
                        }
                    }
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            @Override
            public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
                new AlertDialog.Builder(MainActivity.this)
                    .setTitle("한양도시락")
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            result.confirm();
                        }
                    })
                    .setCancelable(false)
                    .create()
                    .show();
                return true;
            }

            @Override
            public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
                new AlertDialog.Builder(MainActivity.this)
                    .setTitle("한양도시락")
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            result.confirm();
                        }
                    })
                    .setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            result.cancel();
                        }
                    })
                    .setCancelable(false)
                    .create()
                    .show();
                return true;
            }
        });
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }
}
EOF

# Substitute parameters into MainActivity.java
REMOTE_APP_URL="${APP_URL:-https://ais-dev-flee3vxwioyt6xffh6ak3i-3004181187.asia-northeast1.run.app}"
sed -i "s|@NEXT_VERSION_NAME@|${CURRENT_VERSION_NAME}|g" "$BUILD_DIR/src/com/hanyang/dosirak/MainActivity.java"
sed -i "s|@NEXT_VERSION_CODE@|${CURRENT_VERSION_CODE}|g" "$BUILD_DIR/src/com/hanyang/dosirak/MainActivity.java"
sed -i "s|@REMOTE_APP_URL@|${REMOTE_APP_URL}|g" "$BUILD_DIR/src/com/hanyang/dosirak/MainActivity.java"

# Find android.jar
ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"
if [ ! -f "$ANDROID_JAR" ]; then
  ANDROID_JAR=$(find /usr -name "android.jar" 2>/dev/null | head -n 1)
fi

# Check if Android SDK build tools are available
if ! command -v aapt >/dev/null 2>&1; then
  echo "⚠️ aapt 도구가 현재 환경에 설치되어 있지 않아 APK 재생성을 건너뜁니다. (기존 public/hanyang-dosirak.apk 유지)"
  exit 0
fi

echo "=== 4. R.java 생성 ==="
aapt package -f -m \
  -J "$BUILD_DIR/gen" \
  -M "$BUILD_DIR/AndroidManifest.xml" \
  -S "$BUILD_DIR/res" \
  -I "$ANDROID_JAR"

echo "=== 5. Java 소스 컴파일 ==="
javac -source 8 -target 8 \
  -bootclasspath "$ANDROID_JAR" \
  -d "$BUILD_DIR/bin" \
  "$BUILD_DIR/gen/com/hanyang/dosirak/R.java" \
  "$BUILD_DIR/src/com/hanyang/dosirak/MainActivity.java"

echo "=== 6. Dex 바이트코드 변환 ==="
DX_CMD="dalvik-exchange"
if ! command -v dalvik-exchange >/dev/null 2>&1; then
  if command -v dx >/dev/null 2>&1; then
    DX_CMD="dx"
  else
    DX_CMD="/usr/bin/dalvik-exchange"
  fi
fi

$DX_CMD --dex --output="$BUILD_DIR/bin/classes.dex" "$BUILD_DIR/bin"

echo "=== 7. APK 패키징 (최신 웹 앱 assets/www 내장) ==="
aapt package -f \
  -M "$BUILD_DIR/AndroidManifest.xml" \
  -S "$BUILD_DIR/res" \
  -A "$BUILD_DIR/assets" \
  -I "$ANDROID_JAR" \
  -F "$BUILD_DIR/bin/hanyang-unaligned.apk"

cd "$BUILD_DIR/bin"
aapt add -f hanyang-unaligned.apk classes.dex

echo "=== 8. Zipalign 정렬 ==="
zipalign -f -p 4 "$BUILD_DIR/bin/hanyang-unaligned.apk" "$BUILD_DIR/bin/hanyang-aligned.apk"

echo "=== 9. APK 고정 키스토어 전자 서명 ==="
KEYSTORE="$PROJECT_ROOT/scripts/release.keystore"
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkey -v \
    -keystore "$KEYSTORE" \
    -alias hanyang \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass hanyang1234 \
    -keypass hanyang1234 \
    -dname "CN=Hanyang Dosirak, OU=Mobile, O=Hanyang, L=Seoul, ST=Seoul, C=KR"
fi

apksigner sign \
  --ks "$KEYSTORE" \
  --ks-key-alias hanyang \
  --ks-pass pass:hanyang1234 \
  --key-pass pass:hanyang1234 \
  --out "$BUILD_DIR/bin/hanyang-dosirak.apk" \
  "$BUILD_DIR/bin/hanyang-aligned.apk"

cd "$PROJECT_ROOT"
cp "$BUILD_DIR/bin/hanyang-dosirak.apk" "$PROJECT_ROOT/public/hanyang-dosirak.apk"
cp "$BUILD_DIR/bin/hanyang-dosirak.apk" "$PROJECT_ROOT/dist/hanyang-dosirak.apk" 2>/dev/null || true

echo "=== 한양도시락 최신 Android APK 빌드 완료! ==="
ls -lh "$PROJECT_ROOT/public/hanyang-dosirak.apk"
apksigner verify -v "$PROJECT_ROOT/public/hanyang-dosirak.apk" | grep -E "Verifies|Signer" || true
aapt dump badging "$PROJECT_ROOT/public/hanyang-dosirak.apk" | grep -E "package:"
