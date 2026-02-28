package org.leparede.tzolkinsight;

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "AppSettings")
public class SettingsPlugin extends Plugin {

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.fromParts("package", getActivity().getPackageName(), null));
        getActivity().startActivity(intent);
        call.resolve();
    }
}
