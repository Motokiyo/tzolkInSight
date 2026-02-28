package org.leparede.tzolkinsight;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(SettingsPlugin.class);
        registerPlugin(FileDownloaderPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
