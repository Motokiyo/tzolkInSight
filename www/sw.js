// sw.js : Service Worker pour Tzolkin
const APP_VERSION = '4.9';
const CACHE_NAME = `tzolkin-v${APP_VERSION}`;

// Journalisation
const log = (message, data = null) => {
  console.log(`[SW v${APP_VERSION}] ${message}`, data || '');
};

// Installation
self.addEventListener('install', event => {
  log('Installation en cours...');
  const resourcesToCache = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-app-512.png',
    './icons/icon-app-192.png',
    './icons/icon-ios.png',
    './style.css',
    './tzolkin-splash.css',
    './tzolkin-menu.css',
    './tzolkin-details.css',
    './tzolkin-page.css',
    './tzolkin-widget-styles.css',
    './tzolkin-standalone-fixes.css',
    './tzolkin-core.js',
    './tzolkin-storage.js',
    './tzolkin-widget.js',
    './tzolkin-admin.js',
    './tzolkin-pin.js',
    './tzolkin-app-interactive.js',
    './tzolkin-details-summary-data.js',
    './tzolkin-details-data.js',
    './tzolkin-details.js',
    './tzolkin-details-display.js',
    './tzolkin-croix-maya.js',
    './tzolkin-iap.js',
    './tzolkin-croix-maya.css',
    './tzolkin-menu-standalone.html',
    './imask.js',
    './assets/x-balanque.png',
    './assets/tzolkin-splash.png',
    // Seigneurs de la Nuit
    './assets/seigneurs_de_la_nuit/G1.svg',
    './assets/seigneurs_de_la_nuit/G2.svg',
    './assets/seigneurs_de_la_nuit/G3.svg',
    './assets/seigneurs_de_la_nuit/G4.svg',
    './assets/seigneurs_de_la_nuit/G5.svg',
    './assets/seigneurs_de_la_nuit/G6.svg',
    './assets/seigneurs_de_la_nuit/G7.svg',
    './assets/seigneurs_de_la_nuit/G8.svg',
    './assets/seigneurs_de_la_nuit/G9.svg',
    // Boutons SVG
    './assets/boutons/SVG/ahau-bt.svg',
    './assets/boutons/SVG/akbal-bt.svg',
    './assets/boutons/SVG/ik-bt.svg',
    './assets/boutons/SVG/lamat-bt.svg',
    './assets/boutons/SVG/manik-bt.svg',
    './assets/boutons/SVG/men-bt.svg',
    // Polices
    './fonts/Summer/Summer.woff2',
    './fonts/Simplifica/Simplifica.woff2',
    './fonts/AmaticSC/AmaticSC-Regular.woff2',
    // 20 glyphes
    './assets/glyphs/MAYA-g-log-cal-D01-Imix.svg',
    './assets/glyphs/MAYA-g-log-cal-D02-Ik.svg',
    './assets/glyphs/MAYA-g-log-cal-D03-Akbal.svg',
    './assets/glyphs/MAYA-g-log-cal-D04-Kan.svg',
    './assets/glyphs/MAYA-g-log-cal-D05-Chikchan.svg',
    './assets/glyphs/MAYA-g-log-cal-D06-Kimi.svg',
    './assets/glyphs/MAYA-g-log-cal-D07-Manik.svg',
    './assets/glyphs/MAYA-g-log-cal-D08-Lamat.svg',
    './assets/glyphs/MAYA-g-log-cal-D09-Muluk.svg',
    './assets/glyphs/MAYA-g-log-cal-D10-Ok_b.svg',
    './assets/glyphs/MAYA-g-log-cal-D11-Chuwen.svg',
    './assets/glyphs/MAYA-g-log-cal-D12-Eb.svg',
    './assets/glyphs/MAYA-g-log-cal-D13-Ben.svg',
    './assets/glyphs/MAYA-g-log-cal-D14-Ix.svg',
    './assets/glyphs/MAYA-g-log-cal-D15-Men.svg',
    './assets/glyphs/MAYA-g-log-cal-D16-Kib.svg',
    './assets/glyphs/MAYA-g-log-cal-D17-Kaban.svg',
    './assets/glyphs/MAYA-g-log-cal-D18-Etznab.svg',
    './assets/glyphs/MAYA-g-log-cal-D19-Kawak.svg',
    './assets/glyphs/MAYA-g-log-cal-D20-Ajaw.svg', // Vérifié
    // 14 chiffres
    './assets/numbers/Maya_0.svg',
    './assets/numbers/Maya_1.svg',
    './assets/numbers/Maya_2.svg',
    './assets/numbers/Maya_3.svg',
    './assets/numbers/Maya_4.svg',
    './assets/numbers/Maya_5.svg',
    './assets/numbers/Maya_6.svg',
    './assets/numbers/Maya_7.svg',
    './assets/numbers/Maya_8.svg',
    './assets/numbers/Maya_9.svg',
    './assets/numbers/Maya_10.svg',
    './assets/numbers/Maya_11.svg',
    './assets/numbers/Maya_12.svg',
    './assets/numbers/Maya_13.svg'
  ];

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        resourcesToCache.map(url => fetch(url, { cache: 'no-store' })
          .then(response => {
            if (!response.ok) {
              log(`Échec du chargement de ${url}: ${response.status}`);
              return Promise.resolve();
            }
            log(`Mise en cache réussie: ${url}`);
            return cache.put(url, response);
          })
          .catch(err => {
            log(`Erreur lors de la mise en cache de ${url}:`, err);
            return Promise.resolve();
          })
        )
      ))
      .then(() => {
        log('Installation terminée - skipWaiting activé');
        self.skipWaiting();
      })
      .catch(err => log('Erreur lors de l\'installation', err))
  );
});

// Nettoyage
self.addEventListener('activate', event => {
  log('Nettoyage des anciennes versions');
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => {
        log(`Suppression du cache: ${key}`);
        return caches.delete(key);
      })
    ))
      .then(() => {
        log('Nettoyage terminé - claim() en cours');
        return self.clients.claim();
      })
      .then(() => log('Activation complète'))
      .catch(err => log('Erreur lors du nettoyage', err))
  );
});

// Stratégie de cache
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  const pathname = requestUrl.pathname;

  if (!pathname.includes('/tzolkin/') && !pathname.includes('/wp-content/themes/astra-child/')) {
    return;
  }

  if (pathname.includes('tzolkin-save.php') || pathname.includes('tzolkin-admin.php')) {
    log(`Requête réseau directe: ${pathname}`);
    event.respondWith(fetch(event.request).catch(() => new Response('Hors ligne', { status: 503 })));
    return;
  }

  // PHP dynamiques: réseau prioritaire pour éviter un jour/glyphe obsolète (fallback cache en offline)
  // Exception: le widget principal doit s'afficher instantanément -> cache d'abord, puis mise à jour en arrière-plan
  if (pathname.includes('tzolkin-widget.php')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(network => {
          if (network.ok) {
            const clone = network.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return network;
        }).catch(() => cached || new Response('Hors ligne', { status: 503 }));
        return cached || networkFetch;
      })
    );
    return;
  }

  if (pathname.includes('tzolkin-menu.php') || pathname.includes('tzolkin-widget.php') || pathname.includes('tzolkin-details.php') || pathname.includes('tzolkin-fonctionnement.php') || pathname.includes('tzolkin-api.php')) {
    event.respondWith(
      fetch(event.request)
        .then(network => {
          if (network.ok) {
            const clone = network.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return network;
        })
        .catch(() => caches.match(event.request).then(cached => cached || new Response('Hors ligne', { status: 503 })))
    );
    return;
  }

  log(`Fetch: ${pathname}`);
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        log('Servi depuis le cache', pathname);
        return cached;
      }
      log(`Nouvelle requête réseau: ${pathname}`);
      return fetch(event.request).then(network => {
        if (network.ok && !pathname.includes('tzolkin-splash.php')) {
          const clone = network.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return network;
      }).catch(() => cached || new Response('Hors ligne', { status: 503 }));
    })
  );
});

// Messages
self.addEventListener('message', event => {
  if (event.data?.type === 'UPDATE_ASSETS') {
    log('Mise à jour des assets demandée', event.data.assets);
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => Promise.all(
        event.data.assets.map(asset => fetch(asset, { cache: 'reload' })
          .then(res => {
            if (res.ok && !asset.includes('tzolkin-splash.php') && !asset.includes('tzolkin-save.php') && !asset.includes('tzolkin-admin.php')) {
              log(`Mise à jour asset: ${asset}`);
              return cache.put(asset, res);
            }
          })
          .catch(err => log(`Erreur fetch asset: ${asset}`, err))
        )
      )).then(() => {
        event.source.postMessage({ type: 'UPDATE_CONFIRMED', version: APP_VERSION });
        log('Mise à jour des assets terminée');
      })
    );
  }
});

log('Service Worker initialisé');