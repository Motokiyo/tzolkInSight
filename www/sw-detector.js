// detector.js : Détecteur pour Tzolkin
const APP_VERSION = '1.1.6';
const CACHE_NAME = `tzolkin-v${APP_VERSION}`;
const UPDATE_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12h pour refus
const CHANGELOG_URL = '/wp-content/themes/astra-child/tzolkin-changelog.html';

// Journalisation
const log = (message, data = null) => {
  console.log(`[Tzolkin v${APP_VERSION}] ${message}`, data || '');
};

// UI de mise à jour (corrigée)
async function showUpdateUI() {
  if (document.getElementById('tzolkin-update-modal')) {
    log('Modal déjà affichée');
    return false;
  }

  let changelogContent = 'Aucun détail disponible.';
  try {
    const response = await fetch(CHANGELOG_URL, { cache: 'no-store' });
    if (response.ok) {
      changelogContent = await response.text();
    }
  } catch (err) {
    log('Erreur lors du chargement du changelog', err);
  }

  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.id = 'tzolkin-update-modal';
    modal.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';
    modal.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px;">
        <h2>Nouvelle version ${APP_VERSION} disponible !</h2>
        <div style="max-height: 200px; overflow-y: auto; margin-bottom: 20px;">
          ${changelogContent}
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="tzolkin-update-oui" style="padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 8px;">Mettre à jour</button>
          <button id="tzolkin-update-non" style="padding: 10px; background: #f44336; color: white; border: none; border-radius: 8px;">Plus tard (12h)</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const handleInteraction = (accept) => {
      modal.remove();
      log(`Utilisateur a choisi: ${accept ? 'Mise à jour' : 'Plus tard'}`);
      resolve(accept);
    };

    modal.querySelector('#tzolkin-update-oui').onclick = () => handleInteraction(true);
    modal.querySelector('#tzolkin-update-non').onclick = () => handleInteraction(false);
    modal.onclick = (e) => e.target === modal && handleInteraction(false);
  });
}

// Détection des assets
function detectUsedAssets() {
  const assets = new Set([
    window.location.pathname,
    '/wp-content/themes/astra-child/tzolkin-widget.php'
  ]);

  const selectors = [
    'link[rel="stylesheet"]',
    'script[src]',
    'img[src]',
    'object[data]'
  ].map(s => `${s}[href*="/tzolkin/"], ${s}[href*="/astra-child/"], ${s}[src*="/tzolkin/"], ${s}[src*="/astra-child/"], ${s}[data*="/tzolkin/"], ${s}[data*="/astra-child/"]`).join(',');

  document.querySelectorAll(selectors).forEach(el => {
    const url = (el.href || el.src || el.data)?.split('?')[0];
    if (url && !url.includes('tzolkin-save.php') && !url.includes('tzolkin-admin.php')) {
      assets.add(url);
    }
  });

  log('Assets détectés', Array.from(assets));
  return Array.from(assets);
}

// Gestion IndexedDB
const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open('TzolkinAssetsDB', 1);

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('assets')) {
      db.createObjectStore('assets', { keyPath: 'id' });
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

async function getStoredAssets() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['assets'], 'readonly');
    const store = transaction.objectStore('assets');
    const request = store.get('current');

    request.onsuccess = () => resolve(request.result?.urls || []);
    request.onerror = () => reject(request.error);
  });
}

async function storeAssets(assets) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['assets'], 'readwrite');
    const store = transaction.objectStore('assets');
    const request = store.put({ id: 'current', urls: assets });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Observation dynamique
function observeDynamicAssets(callback) {
  log('Observation des assets dynamiques activée');
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const selectors = [
              'link[rel="stylesheet"]',
              'script[src]',
              'img[src]',
              'object[data]'
            ].map(s => `${s}[href*="/tzolkin/"], ${s}[href*="/astra-child/"], ${s}[src*="/tzolkin/"], ${s}[src*="/astra-child/"], ${s}[data*="/tzolkin/"], ${s}[data*="/astra-child/"]`).join(',');
            if (node.matches(selectors) || node.querySelector(selectors)) {
              shouldCheck = true;
            }
          }
        });
      }
    });
    if (shouldCheck) {
      log('Changements détectés dans le DOM, vérification des mises à jour...');
      callback();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Vérification des mises à jour
async function checkForUpdates() {
  if (!window.location.pathname.includes('/tzolkin')) {
    log('Page non-Tzolkin ignorée');
    return;
  }

  try {
    const [currentAssets, lastAssets] = await Promise.all([
      detectUsedAssets(),
      getStoredAssets()
    ]);

    const storedVersion = localStorage.getItem('tzolkin-version') || '0.0';
    const versionChanged = APP_VERSION !== storedVersion;
    const assetsChanged = !arraysEqual(currentAssets, lastAssets);
    const updateRefused = localStorage.getItem('tzolkin-update-refused');
    const refusalExpired = !updateRefused || (Date.now() - updateRefused > UPDATE_INTERVAL_MS);

    log('État de la vérification', {
      storedVersion,
      currentVersion: APP_VERSION,
      versionChanged,
      assetsChanged,
      assetsCount: currentAssets.length,
      lastAssetsCount: lastAssets.length,
      currentAssets: currentAssets,
      lastAssets: lastAssets,
      refusalExpired,
      updateRefusedTimestamp: updateRefused
    });

    if (versionChanged || (assetsChanged && refusalExpired)) {
      const accepted = await showUpdateUI();

      if (accepted) {
        await storeAssets(currentAssets);
        localStorage.setItem('tzolkin-version', APP_VERSION);
        localStorage.removeItem('tzolkin-update-refused');

        if (navigator.serviceWorker?.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'UPDATE_ASSETS',
            assets: currentAssets
          });
          window.location.reload();
        }
      } else {
        localStorage.setItem('tzolkin-update-refused', Date.now());
      }
    } else {
      log('Aucune mise à jour nécessaire', { versionChanged, assetsChanged, refusalExpired });
    }
  } catch (error) {
    log('Erreur lors de la vérification', error);
  }
}

// Fonctions utilitaires
function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
  log('Initialisation du détecteur');
  observeDynamicAssets(checkForUpdates);
  setTimeout(checkForUpdates, 2000); // Délai initial
});