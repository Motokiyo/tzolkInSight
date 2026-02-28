package org.leparede.tzolkinsight;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * Plugin natif pour sauvegarder des fichiers dans le dossier Téléchargements Android.
 * Android 10+ : MediaStore Downloads API (pas de permission requise)
 * Android 9-  : Environment.DIRECTORY_DOWNLOADS (WRITE_EXTERNAL_STORAGE requis)
 */
@CapacitorPlugin(name = "FileDownloader")
public class FileDownloaderPlugin extends Plugin {

    @PluginMethod
    public void saveFile(PluginCall call) {
        String filename = call.getString("filename");
        String content  = call.getString("content");
        String mimeType = call.getString("mimeType", "text/plain");

        if (filename == null || content == null) {
            call.reject("filename et content sont requis");
            return;
        }

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+ : écriture via MediaStore (sans permission)
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
                values.put(MediaStore.Downloads.IS_PENDING, 1);

                ContentResolver resolver = getActivity().getContentResolver();
                Uri collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
                Uri itemUri = resolver.insert(collection, values);

                if (itemUri == null) {
                    call.reject("Impossible de créer le fichier dans Téléchargements");
                    return;
                }

                try (OutputStream stream = resolver.openOutputStream(itemUri)) {
                    if (stream == null) {
                        call.reject("Impossible d'ouvrir le flux d'écriture");
                        return;
                    }
                    stream.write(content.getBytes("UTF-8"));
                }

                values.clear();
                values.put(MediaStore.Downloads.IS_PENDING, 0);
                resolver.update(itemUri, values, null, null);

            } else {
                // Android 9 et inférieur : écriture directe dans /Downloads
                File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                if (!downloadsDir.exists()) {
                    downloadsDir.mkdirs();
                }
                File file = new File(downloadsDir, filename);
                try (FileOutputStream stream = new FileOutputStream(file)) {
                    stream.write(content.getBytes("UTF-8"));
                }
            }

            JSObject result = new JSObject();
            result.put("success", true);
            result.put("filename", filename);
            call.resolve(result);

        } catch (Exception e) {
            call.reject("Erreur lors de la sauvegarde : " + e.getMessage());
        }
    }
}
