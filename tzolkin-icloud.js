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
    var DEBOUNCE_MS = 1000; // 1s d'inactivité avant push vers iCloud

    var KVS = null;
    var _onExternalChange = null;
    var _isApplyingExternal = false; // empêche les boucles de sync
    var _syncTimer = null;           // debounce timer pour syncToCloud

    function isIOSNative() {
        return typeof Capacitor !== 'undefined'
            && Capacitor.isNativePlatform()
            && Capacitor.getPlatform() === 'ios';
    }

    function isSyncableKey(key) {
        return SYNC_KEYS.indexOf(key) >= 0 || key.indexOf(NOTES_PREFIX) === 0;
    }

    // Clé d'identité pour un item : idProp (ex: 'id', 'date'), fallback 'name' (migration
    // contacts sans UUID), fallback JSON.stringify comme dernier recours.
    function keyOf(item, idProp) {
        return item[idProp] || item.name || JSON.stringify(item);
    }

    /**
     * Merge deux tableaux d'objets en prenant le plus récent par clé identité.
     * @param {Array} local  — items locaux
     * @param {Array} cloud  — items distants
     * @param {string} idProp — propriété servant d'identifiant (ex: 'date', 'id')
     * @returns {Array}
     */
    function mergeByKey(local, cloud, idProp) {
        var merged = {};
        local.forEach(function (item) { merged[keyOf(item, idProp)] = item; });
        cloud.forEach(function (item) {
            var k = keyOf(item, idProp);
            var existing = merged[k];
            if (!existing || (item.updatedAt || 0) > (existing.updatedAt || 0)) {
                merged[k] = item;
            }
        });
        return Object.keys(merged).map(function (k) { return merged[k]; });
    }

    function applyCloudValue(key, cloudValue) {
        var idProp;
        if (key.indexOf(NOTES_PREFIX) === 0) {
            idProp = 'date';
        } else if (key === 'tzolkin_people_cycles') {
            idProp = 'id';
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

    /** Push effectif (sans debounce) — appelé par le timer */
    function _pushAllToCloud() {
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
        console.log('[iCloud] Push vers cloud terminé');
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

                // Écoute les changements externes (autre device)
                // Règle Apple : appliquer en local, NE PAS repousser
                // reason: 0=server change, 1=initial sync, 2=quota violation
                KVS.addListener('icloudChanged', function (data) {
                    if (data.reason === 2) {
                        console.error('[iCloud] QUOTA DÉPASSÉ — sync iCloud désactivée');
                        self.available = false;
                        return;
                    }
                    console.log('[iCloud] Changement externe détecté', data.keys);
                    self._applyExternalChanges(data.keys);
                });

                // Sync initiale : pull cloud → merge → push le résultat fusionné vers iCloud
                // C'est une action locale (lancement), pas une réponse à notification externe
                this._pullAndMerge().then(function () {
                    _pushAllToCloud();
                    console.log('[iCloud] Sync initiale terminée (pull + merge + push)');
                });

                // Au retour foreground : pull → merge → push (comme à l'init)
                document.addEventListener('visibilitychange', function () {
                    if (document.visibilityState === 'visible') {
                        console.log('[iCloud] Retour foreground — sync');
                        KVS.synchronize();
                        self._pullAndMerge().then(function (changed) {
                            if (changed) _pushAllToCloud();
                        });
                    }
                });

                console.log('[iCloud] KVS initialisé');
            } catch (e) {
                console.warn('[iCloud] Plugin non disponible', e);
            }
        },

        /**
         * Envoie les données locales vers iCloud KVS (debounced).
         * Ignoré si on est en train d'appliquer des changements externes.
         */
        syncToCloud: function () {
            if (!this.available) return;
            if (_isApplyingExternal) return; // pas de push pendant un apply externe

            // Debounce : attend 1s d'inactivité avant push effectif
            clearTimeout(_syncTimer);
            _syncTimer = setTimeout(function () {
                _pushAllToCloud();
            }, DEBOUNCE_MS);
        },

        /** Pull depuis le cloud et merge dans localStorage. Retourne une Promise<boolean>. */
        _pullAndMerge: function () {
            if (!this.available) return Promise.resolve(false);

            _isApplyingExternal = true;

            return KVS.getAllKeys().then(function (result) {
                var keys = (result.keys || []).filter(isSyncableKey);
                var promises = keys.map(function (key) {
                    return KVS.get({ key: key }).then(function (data) {
                        return { key: key, value: data.value };
                    });
                });

                return Promise.all(promises).then(function (entries) {
                    var changed = false;
                    entries.forEach(function (entry) {
                        if (!entry.value) return;
                        var local = localStorage.getItem(entry.key);
                        if (local !== entry.value) {
                            applyCloudValue(entry.key, entry.value);
                            changed = true;
                        }
                    });
                    _isApplyingExternal = false;
                    if (changed && _onExternalChange) {
                        _onExternalChange();
                    }
                    return changed;
                });
            }).catch(function (e) {
                _isApplyingExternal = false;
                console.error('[iCloud] Erreur pullAndMerge', e);
                return false;
            });
        },

        /**
         * Applique les changements reçus via notification iCloud.
         * Règle Apple : on applique en local + refresh UI, on ne repousse PAS.
         */
        _applyExternalChanges: function (changedKeys) {
            if (!changedKeys || !changedKeys.length) return;

            _isApplyingExternal = true;

            var promises = changedKeys.filter(isSyncableKey).map(function (key) {
                return KVS.get({ key: key }).then(function (data) {
                    if (data.value) {
                        applyCloudValue(key, data.value);
                    }
                });
            });

            Promise.all(promises).then(function () {
                _isApplyingExternal = false;
                if (_onExternalChange) _onExternalChange();
            }).catch(function () {
                _isApplyingExternal = false;
            });
        },

        onExternalChange: function (cb) { _onExternalChange = cb; }
    };
})();
