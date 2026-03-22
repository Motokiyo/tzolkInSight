import Capacitor
import Foundation

@objc(ICloudKVSPlugin)
public class ICloudKVSPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ICloudKVSPlugin"
    public let jsName = "ICloudKVS"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAllKeys", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "synchronize", returnType: CAPPluginReturnPromise),
    ]

    private let store = NSUbiquitousKeyValueStore.default

    override public func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(onStoreChanged(_:)),
            name: NSUbiquitousKeyValueStore.didChangeExternallyNotification,
            object: store
        )
        store.synchronize()
    }

    @objc func set(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Missing key")
            return
        }
        if let value = call.getString("value") {
            store.set(value, forKey: key)
        } else {
            store.removeObject(forKey: key)
        }
        call.resolve()
    }

    @objc func get(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Missing key")
            return
        }
        let value = store.string(forKey: key)
        call.resolve(["value": value as Any])
    }

    @objc func remove(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Missing key")
            return
        }
        store.removeObject(forKey: key)
        call.resolve()
    }

    @objc func getAllKeys(_ call: CAPPluginCall) {
        let keys = Array(store.dictionaryRepresentation.keys)
        call.resolve(["keys": keys])
    }

    @objc func synchronize(_ call: CAPPluginCall) {
        store.synchronize()
        call.resolve()
    }

    @objc private func onStoreChanged(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let reason = userInfo[NSUbiquitousKeyValueStoreChangeReasonKey] as? Int,
              let keys = userInfo[NSUbiquitousKeyValueStoreChangedKeysKey] as? [String] else {
            return
        }
        notifyListeners("icloudChanged", data: [
            "reason": reason,
            "keys": keys
        ])
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
