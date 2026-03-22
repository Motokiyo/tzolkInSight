// tzolkin-icloud.js — Sync iCloud KVS (iPhone ↔ iPad)
// Utilise NSUbiquitousKeyValueStore via plugin Capacitor natif
(function () {
    'use strict';

    // Clés localStorage fixes à synchroniser
    var SYNC_KEYS = [
        'tzolkin_user_key',
        'tzolkin_user_keys',
        'tzolkin_people_cycles',
        'tzolkin_pin_hash'
    ];

    var NOTES_PREFIX = 'tzolkin_notes_';

    var KVS = null;
    var _onExternalChange = null;

    function isIOSNative() {
        return typeof Capacitor !== 'undefined'
            && Capacitor.isNativePlatform()
            && Capacitor.getPlatform() === 'ios';
    }

    function isSyncableKey(key) {
        return SYNC_KEYS.indexOf(key) >= 0 || key.indexOf(NOTES_PREFIX) === 0;
    }

    /**
     * Merge deux tableaux d'objets en prenant le plus récent par clé identité.
     * @param {Array} local  — items locaux, chacun ayant la propriété `idProp`
     * @param {Array} cloud  — items distants
     * @param {string} idProp — propriété servant d'identifiant (ex: 'date', 'name')
     * @returns {Array}
     */
    function mergeByKey(local, cloud, idProp) {
        var merged = {};
        local.forEach(function (item) { merged[item[idProp]] = item; });
        cloud.forEach(function (item) {
            var existing = merged[item[idProp]];
            if (!existing || (item.updatedAt || 0) > (existing.updatedAt || 0)) {
                merged[item[idProp]] = item;
            }
        });
        return Object.keys(merged).map(function (k) { return merged[k]; });
    }

    function applyCloudValue(key, cloudValue) {
        var idProp;
        if (key.indexOf(NOTES_PREFIX) === 0) {
            idProp = 'date';
        } else if (key === 'tzolkin_people_cycles') {
            idProp = 'name';
        } else {
            localStorage.setItem(key, cloudValue);
            return;
        }

        try {
            var localItems = JSON.parse(localStorage.getItem(key) || '[]');
            var cloudItems = JSON.parse(cloudValue);
            localStorage.setItem(key, JSON.stringify(mergeByKey(localItems, cloudItems, idProp)));
        } catch (e) {
            console.error('[iCloud] Erreur merge ' + key, e);
        }
    }

    window.TzolkinICloud = {
        available: false,

        /** Initialise le plugin iCloud KVS si disponible */
        init: function () {
            if (!isIOSNative()) return;
            try {
                KVS = window.Capacitor.Plugins.ICloudKVS;
                if (!KVS) return;
                this.available = true;

                var self = this;
                KVS.addListener('icloudChanged', function (data) {
                    console.log('[iCloud] Changement externe détecté', data.keys);
                    self._applyExternalChanges(data.keys);
                });

                this.syncFromCloud();
                console.log('[iCloud] KVS initialisé');
            } catch (e) {
                console.warn('[iCloud] Plugin non disponible', e);
            }
        },

        /** Envoie toutes les données syncables vers iCloud KVS */
        syncToCloud: function () {
            if (!this.available) return;

            SYNC_KEYS.forEach(function (key) {
                var value = localStorage.getItem(key);
                if (value !== null) {
                    KVS.set({ key: key, value: value });
                }
            });

            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.indexOf(NOTES_PREFIX) === 0) {
                    KVS.set({ key: key, value: localStorage.getItem(key) });
                }
            }

            KVS.synchronize();
        },

        /** Récupère les données depuis iCloud KVS et les merge dans localStorage */
        syncFromCloud: function () {
            if (!this.available) return;

            KVS.getAllKeys().then(function (result) {
                var keys = (result.keys || []).filter(isSyncableKey);
                var promises = keys.map(function (key) {
                    return KVS.get({ key: key }).then(function (data) {
                        return { key: key, value: data.value };
                    });
                });

                Promise.all(promises).then(function (entries) {
                    var changed = false;
                    entries.forEach(function (entry) {
                        if (!entry.value) return;
                        var local = localStorage.getItem(entry.key);
                        if (local !== entry.value) {
                            applyCloudValue(entry.key, entry.value);
                            changed = true;
                        }
                    });
                    if (changed && _onExternalChange) {
                        _onExternalChange();
                    }
                });
            });
        },

        /** Applique les changements reçus via notification iCloud */
        _applyExternalChanges: function (changedKeys) {
            if (!changedKeys || !changedKeys.length) return;

            var promises = changedKeys.filter(isSyncableKey).map(function (key) {
                return KVS.get({ key: key }).then(function (data) {
                    if (data.value) {
                        applyCloudValue(key, data.value);
                    }
                });
            });

            Promise.all(promises).then(function () {
                if (_onExternalChange) _onExternalChange();
            });
        },

        onExternalChange: function (cb) { _onExternalChange = cb; }
    };
})();
