/**
 * TzolkInSight — i18n Loader
 * Detects system language and loads appropriate translations.
 * Must be loaded BEFORE all other app scripts.
 *
 * Supported languages: fr (default), en, es
 * Detection: localStorage override > navigator.language > fallback 'fr'
 */
(function () {
    'use strict';

    var SUPPORTED_LANGS = ['fr', 'en', 'es'];
    var DEFAULT_LANG = 'fr';

    // --- 1. Detect language synchronously ---
    var stored = null;
    try { stored = localStorage.getItem('tzolkin-lang'); } catch (e) { /* private browsing */ }

    var browserLang = (navigator.language || navigator.userLanguage || DEFAULT_LANG).slice(0, 2).toLowerCase();
    var lang;

    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
        lang = stored;
    } else if (SUPPORTED_LANGS.indexOf(browserLang) !== -1) {
        lang = browserLang;
    } else {
        lang = DEFAULT_LANG;
    }

    // --- 2. Create global i18n object ---
    var readyCallbacks = [];

    window.i18n = {
        lang: lang,
        strings: {},
        ready: false,

        /**
         * Translate a key. Supports nested keys: t('menu.calendar')
         * Optional interpolation: t('confirm_date', { date: '07/03/2026' })
         * Returns the key itself if not found (safe fallback).
         */
        t: function (key, params) {
            var keys = key.split('.');
            var val = this.strings;
            for (var i = 0; i < keys.length; i++) {
                if (val && typeof val === 'object' && keys[i] in val) {
                    val = val[keys[i]];
                } else {
                    return key; // key not found — return raw key as fallback
                }
            }
            if (typeof val !== 'string') return key;
            if (params) {
                return val.replace(/\{(\w+)\}/g, function (_, k) {
                    return params[k] !== undefined ? params[k] : '{' + k + '}';
                });
            }
            return val;
        },

        /**
         * Register a callback to run when translations are loaded.
         * If already ready, fires immediately.
         */
        onReady: function (cb) {
            if (this.ready) { cb(); }
            else { readyCallbacks.push(cb); }
        },

        /**
         * Apply translations to all DOM elements with data-i18n attribute.
         * <span data-i18n="menu.calendar">Calendrier</span>
         * Also handles data-i18n-placeholder, data-i18n-title.
         */
        applyToDOM: function (root) {
            var container = root || document;

            // Text content
            var elements = container.querySelectorAll('[data-i18n]');
            for (var i = 0; i < elements.length; i++) {
                var key = elements[i].getAttribute('data-i18n');
                var translated = this.t(key);
                if (translated !== key) {
                    elements[i].textContent = translated;
                }
            }

            // innerHTML (for strings containing HTML markup)
            var htmlElements = container.querySelectorAll('[data-i18n-html]');
            for (var j = 0; j < htmlElements.length; j++) {
                var hkey = htmlElements[j].getAttribute('data-i18n-html');
                var htranslated = this.t(hkey);
                if (htranslated !== hkey) {
                    htmlElements[j].innerHTML = htranslated;
                }
            }

            // Placeholders
            var placeholders = container.querySelectorAll('[data-i18n-placeholder]');
            for (var p = 0; p < placeholders.length; p++) {
                var pkey = placeholders[p].getAttribute('data-i18n-placeholder');
                var ptranslated = this.t(pkey);
                if (ptranslated !== pkey) {
                    placeholders[p].placeholder = ptranslated;
                }
            }

            // Title attributes
            var titles = container.querySelectorAll('[data-i18n-title]');
            for (var t = 0; t < titles.length; t++) {
                var tkey = titles[t].getAttribute('data-i18n-title');
                var ttranslated = this.t(tkey);
                if (ttranslated !== tkey) {
                    titles[t].title = ttranslated;
                }
            }
        },

        /** Internal: mark as ready and fire callbacks */
        _setReady: function () {
            this.ready = true;
            for (var i = 0; i < readyCallbacks.length; i++) {
                try { readyCallbacks[i](); } catch (e) { console.error('i18n callback error:', e); }
            }
            readyCallbacks = [];
        }
    };

    // --- 3. Set <html lang="xx"> ---
    document.documentElement.lang = lang;

    // --- 4. Load UI strings ---
    var jsonPath = './i18n/ui-' + lang + '.json';

    fetch(jsonPath)
        .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(function (data) {
            window.i18n.strings = data;
            console.log('[i18n] Loaded UI strings for: ' + lang);
            window.i18n._setReady();
        })
        .catch(function (err) {
            console.warn('[i18n] Failed to load ' + jsonPath + ':', err.message);
            // Fallback to French if not already
            if (lang !== DEFAULT_LANG) {
                console.log('[i18n] Falling back to ' + DEFAULT_LANG);
                fetch('./i18n/ui-' + DEFAULT_LANG + '.json')
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        window.i18n.strings = data;
                        window.i18n._setReady();
                    })
                    .catch(function () {
                        // No translations at all — app still works, t() returns keys
                        window.i18n._setReady();
                    });
            } else {
                window.i18n._setReady();
            }
        });

    // --- 5. Load heavy data translations (details-data, summary-data, core overlay) ---
    if (lang !== DEFAULT_LANG) {
        // These scripts overwrite window.TZOLKIN_DETAILS_DATA etc.
        // They are loaded dynamically and will execute after the default FR versions
        var dataFiles = [
            './i18n/core-data-' + lang + '.js',
            './i18n/details-data-' + lang + '.js',
            './i18n/summary-data-' + lang + '.js',
            './i18n/corn-family-' + lang + '.js'
        ];

        // We need these to load AFTER the main scripts but BEFORE the app renders.
        // Since the splash screen lasts 10s, we have plenty of time.
        var loadDataFile = function (src) {
            var script = document.createElement('script');
            script.src = src;
            script.async = false; // preserve order
            script.onerror = function () {
                console.warn('[i18n] Data file not found: ' + src + ' (will use FR)');
            };
            document.head.appendChild(script);
        };

        // Wait for DOM to ensure default scripts are parsed first
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                dataFiles.forEach(loadDataFile);
            });
        } else {
            dataFiles.forEach(loadDataFile);
        }
    }

    console.log('[i18n] Language detected: ' + lang);

})();
