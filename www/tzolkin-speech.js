// tzolkin-speech.js — Dictée vocale
// Natif : @capacitor-community/speech-recognition (iOS Siri / Android Google)
// Fallback web : Web Speech API (Chrome, Edge, Safari 14.5+)
(function () {
    'use strict';

    var LANG_MAP = { fr: 'fr-FR', en: 'en-US', es: 'es-ES' };
    var WebSR = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Capacitor plugin (disponible après cap sync)
    var CapSR = null;
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try {
            CapSR = window.Capacitor.Plugins.SpeechRecognition;
        } catch (e) { /* plugin non enregistré */ }
    }

    var useNative = !!CapSR;
    var available = useNative || !!WebSR;

    function _t(key) {
        return window.i18n ? window.i18n.t(key) : key;
    }

    window.TzolkinSpeech = {
        available: available,
        listening: false,
        _recognition: null,
        _onResult: null,
        _onError: null,

        /** Affiche le bouton micro si speech est disponible */
        init: function () {
            if (!available) return;
            var btn = document.getElementById('speech-btn');
            if (btn) btn.style.display = '';
        },

        getLocale: function () {
            var lang = (window.i18n && window.i18n.lang) || 'fr';
            return LANG_MAP[lang] || 'fr-FR';
        },

        /** Toggle écoute on/off */
        toggle: function () {
            if (this.listening) { this.stop(); } else { this.start(); }
        },

        /** Lance la reconnaissance vocale */
        start: function () {
            if (!available || this.listening) return;
            if (useNative) {
                this._startNative();
            } else {
                this._startWeb();
            }
        },

        /** Arrête la reconnaissance vocale */
        stop: function () {
            if (useNative) {
                this._stopNative();
            } else {
                this._stopWeb();
            }
        },

        // ===== NATIVE (Capacitor plugin) =====

        _startNative: function () {
            var self = this;
            CapSR.requestPermissions().then(function (perm) {
                if (perm.speechRecognition !== 'granted') {
                    if (self._onError) self._onError('not-allowed');
                    return;
                }
                self._setListening(true);

                CapSR.addListener('partialResults', function (data) {
                    if (data.matches && data.matches.length && self._onResult) {
                        self._onResult(data.matches[0]);
                    }
                });

                CapSR.start({
                    language: self.getLocale(),
                    maxResults: 1,
                    prompt: _t('speech.listening'),
                    partialResults: true,
                    popup: false
                }).catch(function (err) {
                    self._setListening(false);
                    if (self._onError) self._onError(err.message || 'error');
                });
            }).catch(function () {
                if (self._onError) self._onError('not-allowed');
            });
        },

        _stopNative: function () {
            CapSR.stop().catch(function () {});
            CapSR.removeAllListeners().catch(function () {});
            this._setListening(false);
        },

        // ===== WEB (Web Speech API fallback) =====

        _startWeb: function () {
            if (!WebSR) return;
            var self = this;

            var recognition = new WebSR();
            recognition.lang = this.getLocale();
            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.onresult = function (event) {
                var transcript = '';
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                if (transcript && self._onResult) self._onResult(transcript);
            };

            recognition.onerror = function (event) {
                self._setListening(false);
                if (self._onError) self._onError(event.error);
            };

            recognition.onend = function () {
                self._setListening(false);
            };

            recognition.start();
            this._recognition = recognition;
            this._setListening(true);
        },

        _stopWeb: function () {
            if (this._recognition) {
                this._recognition.stop();
                this._recognition = null;
            }
            this._setListening(false);
        },

        // ===== UI =====

        /** Met à jour l'état visuel (bouton + status text) */
        _setListening: function (val) {
            this.listening = val;
            var btn = document.getElementById('speech-btn');
            if (btn) btn.classList.toggle('listening', val);
            var status = document.getElementById('speech-status');
            if (status) status.textContent = val ? _t('speech.listening') : '';
        },

        onResult: function (cb) { this._onResult = cb; },
        onError: function (cb) { this._onError = cb; }
    };
})();
