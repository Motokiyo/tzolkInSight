package org.leparede.tzolkinsight;

import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(SettingsPlugin.class);
        registerPlugin(FileDownloaderPlugin.class);
        super.onCreate(savedInstanceState);

        // Android 12+ (predictive back gesture) ne laisse pas la WebView gérer
        // le back button automatiquement. On le fait explicitement ici.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = getBridge().getWebView();
                if (webView != null && webView.canGoBack()) {
                    webView.goBack(); // → déclenche popstate en JS
                } else {
                    finish(); // → ferme l'app
                }
            }
        });
    }
}
