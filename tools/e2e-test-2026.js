/**
 * TzolkInSight E2E Test — April 2026
 * Tests all 10 checkpoints requested
 * v2 — uses div.menu-button, div[onclick], fixed broken-image false positives
 */

const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:8090';
const SS_DIR = '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/e2e-2026';

try { execSync(`mkdir -p ${SS_DIR}`); } catch(e) {}

async function screenshot(page, name) {
  const p = `${SS_DIR}/${name}.png`;
  await page.screenshot({ path: p, fullPage: false });
  console.log(`  [screenshot] ${p}`);
  return p;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const results = [];
function report(check, status, details) {
  results.push({ check, status, details });
  console.log(`[${status.padEnd(4)}] ${check}: ${details}`);
}

// ---- helpers used inside page.evaluate ----
const FIND_MENU_BTN = (text) => `
  (function() {
    var all = Array.from(document.querySelectorAll('.menu-button, [onclick], button, a'));
    return all.find(function(el) {
      return el.textContent.toLowerCase().includes('${text.toLowerCase()}');
    });
  })()
`;

async function clickMenuButton(page, textFragment) {
  return page.evaluate((txt) => {
    var all = Array.from(document.querySelectorAll('.menu-button, [onclick], button, a'));
    var found = all.find(function(el) {
      return el.textContent.toLowerCase().includes(txt.toLowerCase());
    });
    if (found) { found.click(); return true; }
    return false;
  }, textFragment);
}

async function anyModalVisible(page) {
  return page.evaluate(() => {
    var modals = Array.from(document.querySelectorAll('.modal, [id*="modal"], [class*="modal"]'));
    var visible = modals.find(function(el) {
      var s = window.getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0.1
             && el.getBoundingClientRect().height > 50;
    });
    return visible ? { id: visible.id, cls: visible.className.substring(0, 60) } : null;
  });
}

async function closeModal(page) {
  // Use JS click to avoid "not clickable" errors from overlapping elements
  await page.evaluate(() => {
    // Try close-modal button first
    var closeBtn = document.querySelector('.close-modal');
    if (closeBtn) { closeBtn.click(); return; }
    // Try closeAllModals
    if (typeof closeAllModals === 'function') { closeAllModals(); return; }
    // Try clicking backdrop
    var backdrop = document.querySelector('.modal-backdrop, .modal-overlay');
    if (backdrop) { backdrop.click(); return; }
  });
  await sleep(400);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  const jsErrors = [];
  page.on('pageerror', err => jsErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') jsErrors.push('[console.error] ' + msg.text());
  });

  // -------------------------------------------------------
  // CHECK 1: Page load
  // -------------------------------------------------------
  console.log('\n=== CHECK 1: Page load ===');
  const t0 = Date.now();
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  const loadTime = Date.now() - t0;
  await screenshot(page, '01-page-load');
  report('Page loads', 'PASS', `${loadTime}ms`);

  // -------------------------------------------------------
  // CHECK 2: No JS errors at load
  // -------------------------------------------------------
  console.log('\n=== CHECK 2: JS errors at load ===');
  await sleep(500);
  const criticalErrors = jsErrors.filter(e =>
    !e.includes('service worker') && !e.includes('ServiceWorker') &&
    !e.includes('sw.js') && !e.includes('Failed to fetch') &&
    !e.includes('NetworkError') && !e.includes('net::ERR')
  );
  if (criticalErrors.length === 0) {
    report('No JS errors at load', 'PASS', 'Clean console');
  } else {
    report('No JS errors at load', 'FAIL', criticalErrors.slice(0, 3).join(' | '));
    await screenshot(page, '02-js-errors');
  }

  // -------------------------------------------------------
  // CHECK 3: Splash screen visible + dismisses
  // -------------------------------------------------------
  console.log('\n=== CHECK 3: Splash screen ===');
  const splashInfo = await page.evaluate(() => {
    var el = document.getElementById('splash-screen');
    if (!el) return { found: false };
    var s = window.getComputedStyle(el);
    return { found: true, display: s.display, opacity: s.opacity };
  });
  await screenshot(page, '03a-splash-before');

  if (splashInfo.found && splashInfo.display !== 'none') {
    report('Splash visible at start', 'PASS', `display:${splashInfo.display}`);
    // Click to dismiss
    await page.click('#splash-screen');
    await sleep(600);
    const splashAfter = await page.evaluate(() => {
      var el = document.getElementById('splash-screen');
      return el ? window.getComputedStyle(el).display : 'gone';
    });
    await screenshot(page, '03b-splash-dismissed');
    if (splashAfter === 'none' || splashAfter === 'gone') {
      report('Splash dismisses on click', 'PASS', 'Hidden after click');
    } else {
      // auto-dismiss after 10s
      console.log('  Waiting for auto-hide (12s)...');
      await sleep(12000);
      const splashAutoHide = await page.evaluate(() => {
        var el = document.getElementById('splash-screen');
        return el ? window.getComputedStyle(el).display : 'gone';
      });
      if (splashAutoHide === 'none' || splashAutoHide === 'gone') {
        report('Splash auto-hides', 'PASS', 'Hidden after 12s');
      } else {
        report('Splash dismisses', 'FAIL', `Still: display=${splashAutoHide}`);
        await screenshot(page, '03c-splash-stuck');
      }
    }
  } else {
    report('Splash screen', 'WARN', 'Not visible at load (already hidden or missing)');
  }

  // Wait for menu to load (it's fetched dynamically)
  await sleep(1500);

  // -------------------------------------------------------
  // CHECK 4: Widget calendrier (glyphe + nombre SVG)
  // -------------------------------------------------------
  console.log('\n=== CHECK 4: Widget calendrier ===');
  await screenshot(page, '04a-widget');
  const widgetInfo = await page.evaluate(() => {
    var svgImgs = Array.from(document.querySelectorAll('img[src*=".svg"]'))
      .filter(img => img.naturalWidth > 0 || img.complete);
    var glyphImgs = svgImgs.filter(i => i.src.includes('/glyphs/'));
    var numImgs = svgImgs.filter(i => i.src.includes('/numbers/'));
    var widget = document.getElementById('tzolkin-widget-php') || document.querySelector('[id*="widget"]');
    // Check for broken images (ignore root URL hits)
    var broken = Array.from(document.querySelectorAll('img'))
      .filter(img => img.naturalWidth === 0 && img.src &&
              !img.src.endsWith('/') && !img.src.match(/localhost:\d+\/$/) &&
              !img.src.startsWith('data:'))
      .map(img => img.src);
    return {
      glyphCount: glyphImgs.length,
      numberCount: numImgs.length,
      hasWidget: !!widget,
      brokenImgs: broken,
      svgTotal: svgImgs.length,
    };
  });
  console.log('  Widget:', JSON.stringify(widgetInfo));

  if (widgetInfo.glyphCount > 0 && widgetInfo.numberCount > 0) {
    report('Widget glyph SVG visible', 'PASS', `${widgetInfo.glyphCount} glyphs, ${widgetInfo.numberCount} numbers`);
  } else if (widgetInfo.svgTotal > 0) {
    report('Widget SVG visible', 'WARN', `${widgetInfo.svgTotal} SVGs but glyphs=${widgetInfo.glyphCount} numbers=${widgetInfo.numberCount}`);
  } else {
    report('Widget SVG visible', 'FAIL', 'No SVG images found');
    await screenshot(page, '04-widget-fail');
  }

  if (widgetInfo.brokenImgs.length === 0) {
    report('No broken images', 'PASS', 'All images load');
  } else {
    report('Broken images', 'FAIL', widgetInfo.brokenImgs.slice(0, 3).join(', '));
  }

  // -------------------------------------------------------
  // CHECK 5: Menu bas (5 boutons div.menu-button)
  // -------------------------------------------------------
  console.log('\n=== CHECK 5: Menu bas (5 boutons) ===');
  // Click on screen to make menu appear if auto-hidden
  await page.click('body');
  await sleep(400);

  const menuInfo = await page.evaluate(() => {
    var menuBtns = Array.from(document.querySelectorAll('.menu-button'));
    var analyseBtn = document.querySelector('[onclick*="showAnalyseConfirm"], [onclick*="Analyse"]');
    var mainMenu = document.querySelector('.main-menu');
    return {
      menuBtnCount: menuBtns.length,
      menuBtnLabels: menuBtns.map(b => b.textContent.trim().replace(/\s+/g, ' ').substring(0, 30)),
      hasAnalyseBtn: !!analyseBtn,
      hasMainMenu: !!mainMenu,
      mainMenuDisplay: mainMenu ? window.getComputedStyle(mainMenu).display : 'n/a',
    };
  });
  console.log('  Menu:', JSON.stringify(menuInfo));
  await screenshot(page, '05a-menu');

  // The menu may be auto-hidden — try clicking somewhere to reveal
  if (!menuInfo.hasMainMenu || menuInfo.mainMenuDisplay === 'none') {
    await page.evaluate(() => document.querySelector('.tzolkin-widget-reset')?.click());
    await sleep(300);
  }

  const menuCount = menuInfo.menuBtnCount;
  if (menuCount >= 5) {
    report('5 menu buttons (div.menu-button)', 'PASS', `${menuCount} buttons: ${menuInfo.menuBtnLabels.join(', ')}`);
  } else if (menuCount >= 4) {
    report('Menu buttons', 'WARN', `Only ${menuCount} div.menu-button found (Profils may not yet be injected)`);
  } else {
    report('Menu buttons', 'FAIL', `Only ${menuCount} div.menu-button found`);
    await screenshot(page, '05-menu-fail');
  }

  // -------------------------------------------------------
  // CHECK 6a: Modal Fonctionnement
  // -------------------------------------------------------
  console.log('\n=== CHECK 6a: Modal Fonctionnement ===');
  const clickedFonct = await clickMenuButton(page, 'Fonctionnement');
  console.log('  Clicked Fonctionnement:', clickedFonct);
  await sleep(800);
  await screenshot(page, '06a-modal-fonctionnement');

  const modalFonct = await anyModalVisible(page);
  if (modalFonct) {
    report('Modal Fonctionnement opens', 'PASS', modalFonct.id || modalFonct.cls);
    await closeModal(page);
  } else {
    report('Modal Fonctionnement opens', 'FAIL', 'No modal visible after click');
    await screenshot(page, '06a-fonct-fail');
  }

  // -------------------------------------------------------
  // CHECK 6b: Modal Notes
  // -------------------------------------------------------
  console.log('\n=== CHECK 6b: Modal Notes ===');
  await clickMenuButton(page, 'Notes');
  await sleep(800);
  await screenshot(page, '06b-modal-notes');
  const modalNotes = await anyModalVisible(page);
  if (modalNotes) {
    report('Modal Notes opens', 'PASS', modalNotes.id || modalNotes.cls);
    await closeModal(page);
  } else {
    report('Modal Notes opens', 'FAIL', 'No modal visible');
  }

  // -------------------------------------------------------
  // CHECK 6c: Modal Enregistres (PIN)
  // -------------------------------------------------------
  console.log('\n=== CHECK 6c: Modal Enregistres (PIN) ===');
  await clickMenuButton(page, 'Enregistrés');
  await sleep(1000);
  await screenshot(page, '06c-modal-enregistres');
  const modalSaved = await anyModalVisible(page);
  if (modalSaved) {
    report('Modal Enregistres/PIN opens', 'PASS', modalSaved.id || modalSaved.cls);
    await closeModal(page);
  } else {
    report('Modal Enregistres/PIN opens', 'FAIL', 'No modal visible');
  }

  // -------------------------------------------------------
  // CHECK 6d: Modal Credits
  // -------------------------------------------------------
  console.log('\n=== CHECK 6d: Modal Credits ===');
  await clickMenuButton(page, 'Crédits');
  await sleep(800);
  await screenshot(page, '06d-modal-credits');
  const modalCreds = await anyModalVisible(page);
  if (modalCreds) {
    report('Modal Credits opens', 'PASS', modalCreds.id || modalCreds.cls);
    await closeModal(page);
  } else {
    report('Modal Credits opens', 'FAIL', 'No modal visible');
  }

  // -------------------------------------------------------
  // CHECK 7: Bouton "Profils" (injected by tzolkin-admin.js)
  // -------------------------------------------------------
  console.log('\n=== CHECK 7: Bouton "Profils" (not "Reglages") ===');
  const profilsCheck = await page.evaluate(() => {
    var menuBtns = Array.from(document.querySelectorAll('.menu-button'));
    var labels = menuBtns.map(b => b.textContent.trim().replace(/\s+/g, ' '));
    var hasProfiles = labels.some(l => l.toLowerCase().includes('profils') || l.toLowerCase().includes('profiles'));
    var hasSettings = labels.some(l => l.toLowerCase() === 'réglages' || l.toLowerCase() === 'settings' || l.toLowerCase() === 'reglages');
    var adminBtn = document.getElementById('admin-menu-btn');
    var adminLabel = adminBtn ? adminBtn.textContent.trim() : null;
    return { labels, hasProfiles, hasSettings, adminBtnLabel: adminLabel };
  });
  console.log('  Profils check:', JSON.stringify(profilsCheck));

  if (profilsCheck.hasProfiles) {
    report('Button labeled "Profils"', 'PASS', `Label: "${profilsCheck.adminBtnLabel}"`);
  } else if (profilsCheck.hasSettings) {
    report('Button labeled "Profils"', 'FAIL', `Found "Réglages/Settings" instead of "Profils". Labels: ${profilsCheck.labels.join(', ')}`);
  } else if (!profilsCheck.adminBtnLabel) {
    report('Button labeled "Profils"', 'WARN', `admin-menu-btn not injected yet. Labels: ${profilsCheck.labels.join(', ')}`);
  } else {
    report('Button labeled "Profils"', 'WARN', `admin-menu-btn="${profilsCheck.adminBtnLabel}". Labels: ${profilsCheck.labels.join(', ')}`);
  }

  // -------------------------------------------------------
  // CHECK 8: Modal Profils (contacts + form + PIN section)
  // -------------------------------------------------------
  console.log('\n=== CHECK 8: Modal Profils content ===');
  const clickedProfils = await clickMenuButton(page, 'Profils');
  console.log('  Clicked Profils:', clickedProfils);
  if (!clickedProfils) {
    // Try via admin btn directly
    await page.evaluate(() => {
      var btn = document.getElementById('admin-menu-btn');
      if (btn) btn.click();
    });
  }
  await sleep(1000);
  await screenshot(page, '08a-modal-profils');

  const profilsModal = await page.evaluate(() => {
    // Target admin-modal directly (tzolkin-admin.js injects it with id="admin-modal")
    var modal = document.getElementById('admin-modal');
    if (!modal) {
      // Fallback: find any visible .modal with height > 200
      var modals = Array.from(document.querySelectorAll('.modal'));
      modal = modals.find(function(el) {
        var s = window.getComputedStyle(el);
        return s.display !== 'none' && el.getBoundingClientRect().height > 200;
      });
    }
    if (!modal) return { found: false };
    var s = window.getComputedStyle(modal);
    if (s.display === 'none') return { found: false };
    var text = modal.innerText || '';
    return {
      found: true,
      id: modal.id,
      hasContactsText: text.toLowerCase().includes('contact') || text.toLowerCase().includes('aucun'),
      hasInputForm: modal.querySelectorAll('input[type="text"], input[name], input:not([type="hidden"])').length > 0,
      hasPIN: text.toLowerCase().includes('pin') || text.toLowerCase().includes('code pin'),
      inputCount: modal.querySelectorAll('input').length,
      textPreview: text.substring(0, 250).replace(/\n+/g, ' | '),
    };
  });
  console.log('  Profils modal:', JSON.stringify(profilsModal, null, 2));

  if (!profilsModal.found) {
    report('Modal Profils opens', 'FAIL', 'No modal visible after click');
    await screenshot(page, '08-profils-fail');
  } else {
    report('Modal Profils opens', 'PASS', `#${profilsModal.id}`);
    report('Contacts section', profilsModal.hasContactsText ? 'PASS' : 'WARN',
      profilsModal.hasContactsText ? 'Contact text found' : `No "contact/aucun" in text: "${profilsModal.textPreview}"`);
    report('Add contact form', profilsModal.hasInputForm ? 'PASS' : 'WARN',
      profilsModal.hasInputForm ? `${profilsModal.inputCount} inputs` : 'No text inputs found');
    report('PIN section', profilsModal.hasPIN ? 'PASS' : 'WARN',
      profilsModal.hasPIN ? 'PIN mention found' : 'No PIN mention in visible text');
  }

  // Close profils modal
  await closeModal(page);

  // -------------------------------------------------------
  // CHECK 9: "Commander Analyse" button visible
  // -------------------------------------------------------
  console.log('\n=== CHECK 9: Commander Analyse button ===');
  const analyseInfo = await page.evaluate(() => {
    // It's a div with onclick="showAnalyseConfirm()"
    var el = document.querySelector('[onclick*="showAnalyseConfirm"], [onclick*="Analyse"]');
    if (!el) {
      // Also search by text content
      var all = Array.from(document.querySelectorAll('*'));
      el = all.find(function(e) {
        return e.textContent.toLowerCase().includes('commander') &&
               e.textContent.toLowerCase().includes('analyse') &&
               e.children.length <= 3;
      });
    }
    if (!el) return { found: false };
    var rect = el.getBoundingClientRect();
    var s = window.getComputedStyle(el);
    return {
      found: true,
      tag: el.tagName,
      onclick: el.getAttribute('onclick'),
      text: el.textContent.trim().replace(/\s+/g, ' ').substring(0, 50),
      visible: rect.width > 0 && rect.height > 0 && s.display !== 'none',
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
    };
  });
  console.log('  Analyse btn:', JSON.stringify(analyseInfo));
  await screenshot(page, '09-analyse-btn');

  if (analyseInfo.found && analyseInfo.visible) {
    report('Commander Analyse button visible', 'PASS', `${analyseInfo.tag} "${analyseInfo.text}"`);
  } else if (analyseInfo.found) {
    report('Commander Analyse button', 'WARN', `Found but rect=${JSON.stringify(analyseInfo.rect)}`);
  } else {
    report('Commander Analyse button', 'FAIL', 'Not found in DOM');
  }

  // -------------------------------------------------------
  // CHECK 10: Responsive Mobile 375x812
  // -------------------------------------------------------
  console.log('\n=== CHECK 10a: Responsive Mobile 375x812 ===');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 20000 });
  await sleep(800);
  // Dismiss splash
  const splashEl = await page.$('#splash-screen');
  if (splashEl) await splashEl.click();
  await sleep(600);
  await screenshot(page, '10a-mobile-375');

  const mobileOverflow = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
    hasOverflow: document.body.scrollWidth > document.body.clientWidth,
    hasContent: document.body.innerText.trim().length > 20,
  }));
  console.log('  Mobile:', JSON.stringify(mobileOverflow));

  if (!mobileOverflow.hasOverflow) {
    report('Mobile 375px no overflow', 'PASS', `scrollW=${mobileOverflow.scrollWidth} = clientW=${mobileOverflow.clientWidth}`);
  } else {
    report('Mobile 375px no overflow', 'FAIL', `Overflow: ${mobileOverflow.scrollWidth} > ${mobileOverflow.clientWidth}`);
  }
  report('Mobile content visible', mobileOverflow.hasContent ? 'PASS' : 'FAIL',
    mobileOverflow.hasContent ? 'Content present' : 'Body empty');

  // CHECK 10b: Desktop 1280x800
  console.log('\n=== CHECK 10b: Responsive Desktop 1280x800 ===');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 20000 });
  await sleep(800);
  const splashEl2 = await page.$('#splash-screen');
  if (splashEl2) await splashEl2.click();
  await sleep(600);
  await screenshot(page, '10b-desktop-1280');

  const desktopInfo = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
    hasOverflow: document.body.scrollWidth > document.body.clientWidth,
    hasContent: document.body.innerText.trim().length > 20,
  }));
  console.log('  Desktop:', JSON.stringify(desktopInfo));
  report('Desktop 1280px content visible', desktopInfo.hasContent ? 'PASS' : 'FAIL',
    desktopInfo.hasContent ? 'Content present' : 'Body empty');
  report('Desktop 1280px no overflow', !desktopInfo.hasOverflow ? 'PASS' : 'WARN',
    `scrollW=${desktopInfo.scrollWidth} clientW=${desktopInfo.clientWidth}`);

  // -------------------------------------------------------
  // CHECK 11: Final JS errors tally
  // -------------------------------------------------------
  console.log('\n=== CHECK 11: Final JS errors ===');
  const finalCritical = jsErrors.filter(e =>
    !e.includes('service worker') && !e.includes('ServiceWorker') &&
    !e.includes('sw.js') && !e.includes('Failed to fetch') &&
    !e.includes('NetworkError') && !e.includes('net::ERR') &&
    !e.includes('Cross-Origin')
  );
  if (finalCritical.length === 0) {
    report('No critical JS errors (full run)', 'PASS', 'Clean');
  } else {
    report('No critical JS errors (full run)', 'FAIL', finalCritical.join(' | '));
  }
  if (jsErrors.length > 0) {
    console.log('\n  All JS errors:', JSON.stringify(jsErrors, null, 2));
  }

  await browser.close();
  printReport();
}

function printReport() {
  console.log('\n\n========================================');
  console.log('       TzolkInSight E2E TEST REPORT');
  console.log('========================================');
  const w1 = 44, w2 = 6;
  console.log(`${'Check'.padEnd(w1)} ${'Status'.padEnd(w2)} Details`);
  console.log('-'.repeat(110));
  let passes = 0, fails = 0, warns = 0;
  for (const r of results) {
    console.log(`${r.check.padEnd(w1)} ${r.status.padEnd(w2)} ${r.details}`);
    if (r.status === 'PASS') passes++;
    else if (r.status === 'FAIL') fails++;
    else warns++;
  }
  console.log('-'.repeat(110));
  console.log(`Total: ${passes} PASS, ${fails} FAIL, ${warns} WARN`);
  if (fails === 0 && warns === 0) {
    console.log('\nApp verified — all checks passed.');
  } else if (fails === 0) {
    console.log(`\nAll hard checks passed. ${warns} warning(s) to review.`);
  } else {
    console.log(`\n${fails} check(s) FAILED — investigation needed.`);
  }
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
