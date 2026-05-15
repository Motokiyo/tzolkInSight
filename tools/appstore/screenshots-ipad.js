// screenshots-ipad.js — iPad Pro screenshots (1024×1366, deviceScaleFactor 2 → 2048×2732)

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const OUT_DIR  = path.join(__dirname, 'screenshots-ipad');
const WIDTH    = 1024;
const HEIGHT   = 1366;
const DSF      = 2;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));

const LOCALSTORAGE = {
  "tzolkin-notes": "{\"8945\":{}}",
  "tzolkin_notes_04856d1503527e964e70405c5e2116fe76cecfc75cbd6910610498c9c92c95cd": "[{\"date\":\"2026-03-08\",\"glyphId\":5,\"numberId\":6,\"text\":\"Une drôle de journée...\\n⚠️ Ma directrice m'a encore demandé une tâche étrange ! Poruquoi fait-il qu'on ne respecte pas mes compétences et que j'ai l'impression d'être toujours sous estimée ! \\nJean est rentré tard ce soir. Il est fatigué et n'est pas forcément prêt à m'entendre. Ce n'est pas grave . Je l'aime tellement.❤️\\n\\nEst ce que ce tzolkin est  vraiemnt lié à quelque chose de tangible, de réel où je me berce d'illusions. On verra bien dans le temps. \\nCharles a eu une bonne note et il était très content !🤩 Ca m'a fait plasiir.\\n\\n• Reve de cette nuit : \\n\\nUn dragon 🐲 majestueux est venu me voir et m'a dit qu'il fallait que j'accepte de brûler tous mes oripeaux pour me révéler ! Il est temps !!!\\nJe sens que tout va bien se passe ! Il faut que je m'accroche ! Ce sont les épreuves de la vie et elles nous emmènent sur le chemin de nous-même. Courage !\",\"emotion\":\"Tristesse,Songerie,Chagrin\",\"color\":\"#99CCFF\",\"time\":\"13:34\",\"location\":\"PARIS\",\"lat\":43.0607,\"lon\":0.1139},{\"date\":\"2026-03-07\",\"glyphId\":4,\"numberId\":5,\"text\":\"Ce soir, Simon dormait enfin — ce petit souffle chaud contre mon épaule, ce poids de un an qui pèse exactement le poids du monde. Charles lisait dans sa chambre, cette façon qu'il a maintenant de disparaître dans les livres comme dans une forêt. Je les ai regardés tous les deux sans qu'ils le sachent.\\nJean dormait aussi. La maison respirait.\\nEt moi j'étais là, debout dans la cuisine à 22h, les mains autour d'une tasse froide, à me demander qui je suis quand personne ne me regarde. Pas la maman. Pas la femme de. Juste — moi. Ce prénom que j'ai reçu avant tous les rôles.\\nCorinne.\\nJe ne sais pas toujours ce qu'elle veut, celle-là. Mais ce soir elle voulait le silence, et les étoiles par la fenêtre, et écrire ça quelque part.\\nIci, peut-être. Dans ce calendrier qui me rappelle que le temps tourne autrement que je ne le crois.\",\"emotion\":\"Confiance,Acceptation,Admiration\",\"color\":\"#CCFFCC\",\"time\":\"13:34\",\"location\":\"PARIS\",\"lat\":48.8589,\"lon\":2.32},{\"date\":\"2026-02-26\",\"glyphId\":15,\"numberId\":9,\"text\":\"Simon a dit « mama » ce matin. Vraiment dit. Pas le babillage habituel, pas le cri du réveil — dit. Les yeux dans les yeux.\\nJ'ai pleuré dans la salle de bain pour que personne ne me voie. 🌊\",\"emotion\":\"Joie,Sérénité,Extase\",\"color\":\"#FFFF99\",\"time\":\"14:21\",\"location\":\"PARIS\",\"lat\":48.8589,\"lon\":2.32}]",
  "tzolkin_offset": "0",
  "tzolkin-user-key": "8945",
  "isNoteModalOpen": "false",
  "tzolkin_user_keys": "{\"04856d1503527e964e70405c5e2116fe76cecfc75cbd6910610498c9c92c95cd\":{\"label\":\"Utilisateur 1\",\"keyPreview\":\"tz***\",\"registeredAt\":\"2026-03-08T12:23:43.126Z\"}}",
  "tzolkin_people_cycles": "[{\"name\":\"Corinne\",\"birthDate\":\"1995-12-04\",\"color\":\"#bf99c2\",\"glyph\":5,\"number\":12},{\"name\":\"Jean\",\"birthDate\":\"1997-03-12\",\"color\":\"#3ea84a\",\"glyph\":17,\"number\":13},{\"name\":\"Simon\",\"birthDate\":\"2025-08-09\",\"color\":\"#a8dae1\",\"glyph\":14,\"number\":3},{\"name\":\"Charles\",\"birthDate\":\"2013-06-12\",\"color\":\"#f0a119\",\"glyph\":13,\"number\":8}]"
};

// Charge la page proprement avec données injectées — état zéro garanti
async function freshLoad(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await wait(2500);
  await page.evaluate((data) => {
    // Splash
    const s = document.getElementById('splash-screen');
    if (s) s.style.display = 'none';
    // Injecter localStorage
    localStorage.clear();
    for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
    localStorage.removeItem('tzolkin_pin_hash');
    sessionStorage.setItem('tzolkin_pin_verified', '1');
  }, LOCALSTORAGE);
  // Recharger pour que les données soient prises en compte
  await page.reload({ waitUntil: 'networkidle0' });
  await wait(2000);
  await page.evaluate((data) => {
    const s = document.getElementById('splash-screen');
    if (s) s.style.display = 'none';
    localStorage.removeItem('tzolkin_pin_hash');
    sessionStorage.setItem('tzolkin_pin_verified', '1');
    for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
  }, LOCALSTORAGE);
  await wait(1000);
}

async function shot(page, name) {
  await wait(1500);
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  const size = (fs.statSync(file).size / (1024 * 1024)).toFixed(1);
  console.log(`OK  ${name}.png  (${size} Mo)`);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      `--window-size=${WIDTH},${HEIGHT}`
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: DSF });

  // ── 01. Calendrier — vue principale ──────────────────────────────────────
  console.log('--- 01. Calendrier principal...');
  await freshLoad(page);
  await shot(page, '01-calendrier');

  // ── 02. Détail glyphe — clic sur le glyphe du calendrier ─────────────────
  console.log('--- 02. Detail glyphe (clic)...');
  await freshLoad(page);
  // Essai via showDetail JS (le plus fiable)
  const detailOpened = await page.evaluate(() => {
    if (typeof showDetail === 'function') {
      showDetail('glyph', 5);
      return true;
    }
    return false;
  });
  if (!detailOpened) {
    // Fallback : clic sur l'élément glyphe dans la vue principale
    const glyphEl = await page.$('.glyph-img, .tzolkin-glyph, [data-glyph], .glyph-button, .today-glyph img, .glyph-today');
    if (glyphEl) {
      await glyphEl.click();
    } else {
      console.log('  WARN: aucun element glyphe trouve, capture etat actuel');
    }
  }
  await shot(page, '02-detail-glyph');

  // ── 03. Notes ─────────────────────────────────────────────────────────────
  console.log('--- 03. Notes (modale)...');
  await freshLoad(page);
  await page.evaluate(() => {
    // Forcer offset=0 pour éviter le popup de confirmation date
    if (window.TzolkinStorage) window.TzolkinStorage.saveOffset(0);
    localStorage.setItem('tzolkin_offset', '0');
    if (typeof openModal === 'function') openModal('notes');
  });
  await wait(2000);
  await shot(page, '03-notes');

  // ── 04. Enregistrés / historique ─────────────────────────────────────────
  console.log('--- 04. Enregistres...');
  await freshLoad(page);
  await page.evaluate(async () => {
    // PIN désactivé + session vérifiée → accès direct via openModal
    localStorage.removeItem('tzolkin_pin_hash');
    sessionStorage.setItem('tzolkin_pin_verified', '1');
    // Recharger les notes puis ouvrir
    if (typeof ensureNotesLoaded === 'function') await ensureNotesLoaded();
    if (typeof openModal === 'function') openModal('saved', true);
    if (typeof filterNotes === 'function') filterNotes();
  });
  await wait(2500);
  await shot(page, '04-historique');

  // ── 05. Fonctionnement ────────────────────────────────────────────────────
  console.log('--- 05. Fonctionnement...');
  await freshLoad(page);
  await page.evaluate(() => {
    if (typeof openModal === 'function') openModal('fonctionnement');
  });
  await shot(page, '05-fonctionnement');

  // ── 06. Réglages (admin-modal) ────────────────────────────────────────────
  console.log('--- 06. Reglages (admin-modal)...');
  await freshLoad(page);
  await page.evaluate(() => {
    // La modale "Réglages" est en réalité l'admin-modal
    if (window.tzolkinAdmin && typeof window.tzolkinAdmin.openAdminModal === 'function') {
      window.tzolkinAdmin.openAdminModal();
    }
  });
  await wait(2000);
  await shot(page, '06-reglages');

  // ── 07. Croix Maya — ouvrir depuis la liste contacts ──────────────────────
  console.log('--- 07. Croix Maya (modale)...');
  await freshLoad(page);
  await page.evaluate(() => {
    // S'assurer que tzolkinAdmin est initialisé
    if (window.tzolkinAdmin && typeof window.tzolkinAdmin.openAdminModal === 'function') {
      window.tzolkinAdmin.openAdminModal();
    }
  });
  await wait(1500);
  // Cliquer sur le bouton ✛ (Croix Maya) du premier contact
  const croixBtnClicked = await page.evaluate(() => {
    // Le bouton a onclick="window.openCroixMayaModal(...)" et texte "✛"
    const btns = Array.from(document.querySelectorAll('button[onclick*="openCroixMayaModal"]'));
    if (btns.length > 0) { btns[0].click(); return 'clicked-' + btns.length; }
    // Fallback : appel direct via window
    if (typeof window.openCroixMayaModal === 'function') {
      window.openCroixMayaModal('Corinne', 5, 12, '1995-12-04');
      return 'direct';
    }
    return false;
  });
  console.log('  Croix Maya button:', croixBtnClicked);
  await wait(2500);
  await shot(page, '07-croix-maya');

  await browser.close();
  console.log(`\nDone — 7 screenshots dans tools/appstore/screenshots-ipad/`);
})();
