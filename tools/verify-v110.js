/**
 * TzolkInSight v1.1.0 — Vérification Puppeteer
 * Checks: page load, JS errors, splash version, Notes modal / micro button,
 *         no Capacitor/SpeechRecognition errors, other modals, speech files HTTP 200,
 *         zero network errors.
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8765';
const SCREENSHOT_DIR = '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools';

const results = [];
const jsErrors = [];
const networkErrors = [];
const allRequests = [];

function pass(name, detail = '') {
  results.push({ name, status: 'PASS', detail });
  console.log(`  ✅ ${name}${detail ? ' — ' + detail : ''}`);
}

function fail(name, detail = '') {
  results.push({ name, status: 'FAIL', detail });
  console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`);
}

async function shot(page, name) {
  const path = `${SCREENSHOT_DIR}/verify-${name}-${Date.now()}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`     Screenshot: ${path}`);
  return path;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // Collect JS errors
  page.on('pageerror', err => jsErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') jsErrors.push('[console.error] ' + msg.text());
  });

  // Collect network events
  page.on('requestfailed', req => {
    networkErrors.push(`${req.failure().errorText} — ${req.url()}`);
  });
  page.on('response', resp => {
    allRequests.push({ url: resp.url(), status: resp.status() });
  });

  // ─────────────────────────────────────────────
  // CHECK 1 — Page load
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 1] Page load');
  try {
    const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    if (resp && resp.status() === 200) {
      pass('Page loads', `HTTP ${resp.status()}`);
    } else {
      fail('Page loads', `HTTP ${resp ? resp.status() : 'no response'}`);
      await shot(page, 'pageload');
    }
  } catch (e) {
    fail('Page loads', e.message);
  }

  // Wait a bit for dynamic content
  await new Promise(r => setTimeout(r, 2000));

  // ─────────────────────────────────────────────
  // CHECK 2 — Splash "Version 1.1.0"
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 2] Splash version');
  try {
    // Look for version text in splash
    const versionText = await page.evaluate(() => {
      // Try splash screen
      const splash = document.querySelector('#splash-screen, .splash, [class*="splash"]');
      if (splash) {
        const vEl = splash.querySelector('[class*="version"], p, span');
        if (vEl) return vEl.textContent.trim();
      }
      // Fallback: search entire page for version pattern
      const all = Array.from(document.querySelectorAll('p, span, div'))
        .find(el => el.textContent.trim().match(/Version\s+1\.1\.0/));
      return all ? all.textContent.trim() : null;
    });

    if (versionText && versionText.includes('1.1.0')) {
      pass('Splash version', `Found: "${versionText}"`);
    } else {
      // Check if splash has already auto-hidden
      const pageVersion = await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll('*')).find(e =>
          e.textContent.trim() === 'Version 1.1.0'
        );
        return el ? el.textContent.trim() : null;
      });
      if (pageVersion) {
        pass('Splash version', `Found in DOM: "${pageVersion}"`);
      } else {
        fail('Splash version', `Not found, got: "${versionText}"`);
        await shot(page, 'splash-version');
      }
    }
  } catch (e) {
    fail('Splash version', e.message);
    await shot(page, 'splash-version-err');
  }

  // ─────────────────────────────────────────────
  // CHECK 3 — speech files HTTP 200
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 3] Speech files HTTP 200');
  const speechFiles = ['tzolkin-speech.js', 'tzolkin-speech.css'];
  for (const file of speechFiles) {
    const req = allRequests.find(r => r.url.includes(file));
    if (req) {
      if (req.status === 200) {
        pass(`${file} HTTP 200`, `status ${req.status}`);
      } else {
        fail(`${file} HTTP 200`, `status ${req.status}`);
      }
    } else {
      // Try direct fetch
      try {
        const resp2 = await page.evaluate(async (url) => {
          const r = await fetch(url);
          return r.status;
        }, `${BASE_URL}/${file}`);
        if (resp2 === 200) {
          pass(`${file} HTTP 200`, `fetched directly: ${resp2}`);
        } else {
          fail(`${file} HTTP 200`, `fetched directly: ${resp2}`);
        }
      } catch (e) {
        fail(`${file} HTTP 200`, `not found in requests and fetch failed: ${e.message}`);
      }
    }
  }

  // ─────────────────────────────────────────────
  // CHECK 4 — Dismiss splash, open menu
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 4] Dismiss splash & open Notes modal');
  try {
    // Click on splash to dismiss it
    const splashVisible = await page.evaluate(() => {
      const s = document.querySelector('#splash-screen');
      return s && getComputedStyle(s).display !== 'none' && getComputedStyle(s).opacity !== '0';
    });
    if (splashVisible) {
      await page.click('#splash-screen');
      await new Promise(r => setTimeout(r, 1500));
    }

    // Wait for menu to appear
    await page.waitForSelector('#modales-container, .menu-fixed, [id*="menu"]', {
      timeout: 10000,
      visible: false,
    }).catch(() => {});

    await new Promise(r => setTimeout(r, 1000));
    await shot(page, 'after-splash');
  } catch (e) {
    console.log(`     Splash dismiss note: ${e.message}`);
  }

  // ─────────────────────────────────────────────
  // CHECK 5 — Notes modal
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 5] Notes modal + micro button');
  try {
    // Find the Notes button (pencil icon / notes)
    const notesBtn = await page.evaluate(() => {
      // Look for button with data-i18n containing "notes" or text "Notes"
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], .menu-btn, .nav-btn'));
      const btn = buttons.find(b =>
        b.getAttribute('data-i18n') === 'menu.notes' ||
        b.textContent.trim().toLowerCase().includes('note') ||
        b.id === 'btn-notes' ||
        b.className.includes('notes')
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!notesBtn) {
      // Try clicking menu item by position — look for any clickable element
      const found = await page.evaluate(() => {
        const el = document.querySelector('[data-modal="notes"], #open-notes, .btn-notes, [onclick*="notes"]');
        if (el) { el.click(); return el.id || el.className; }
        return null;
      });
      console.log(`     Notes button search result: ${found}`);
    }

    await new Promise(r => setTimeout(r, 2000));
    await shot(page, 'notes-modal-attempt');

    // Check if notes modal is open
    const notesOpen = await page.evaluate(() => {
      const modal = document.querySelector('#modal-notes, .modal-notes, [id*="notes"]');
      if (!modal) return { found: false, allModals: Array.from(document.querySelectorAll('[id*="modal"]')).map(m => m.id) };
      const style = getComputedStyle(modal);
      return {
        found: true,
        display: style.display,
        visible: style.display !== 'none' && style.opacity !== '0',
        id: modal.id
      };
    });
    console.log(`     Notes modal state:`, JSON.stringify(notesOpen));

    if (notesOpen.visible) {
      pass('Notes modal opens');

      // Check for micro button
      const microBtn = await page.evaluate(() => {
        const btn = document.querySelector(
          '#speech-btn, .speech-btn, [id*="speech"], [id*="micro"], [class*="micro"], button[title*="oix"], button[aria-label*="oix"]'
        );
        if (btn) return { found: true, id: btn.id, class: btn.className, visible: getComputedStyle(btn).display !== 'none' };
        return { found: false };
      });
      console.log(`     Micro button:`, JSON.stringify(microBtn));

      if (microBtn.found && microBtn.visible) {
        pass('Micro button visible in Notes', `id="${microBtn.id}" class="${microBtn.class}"`);
      } else if (microBtn.found) {
        fail('Micro button visible in Notes', 'found but hidden');
        await shot(page, 'micro-hidden');
      } else {
        fail('Micro button visible in Notes', 'not found in DOM');
        await shot(page, 'micro-missing');
      }
    } else {
      fail('Notes modal opens', JSON.stringify(notesOpen));
      await shot(page, 'notes-not-open');
    }
  } catch (e) {
    fail('Notes modal', e.message);
    await shot(page, 'notes-error');
  }

  // ─────────────────────────────────────────────
  // CHECK 6 — Other modals (Fonctionnement, Crédits, Réglages)
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 6] Other modals');
  const modalsToTest = [
    { name: 'Fonctionnement', selectors: ['[data-modal="fonctionnement"]', '#open-fonctionnement', '.btn-fonctionnement', '[data-i18n="menu.how_it_works"]'] },
    { name: 'Credits', selectors: ['[data-modal="credits"]', '#open-credits', '.btn-credits', '[data-i18n="menu.credits"]'] },
    { name: 'Settings', selectors: ['#admin-menu-btn', '[data-modal="settings"]', '#open-settings', '.btn-settings', '[data-i18n="menu.settings"]', '#btn-reglages'] },
  ];

  for (const modal of modalsToTest) {
    try {
      // First close any open modal
      await page.evaluate(() => {
        const closeBtns = document.querySelectorAll('.close-modal, .btn-close, [data-action="close"]');
        closeBtns.forEach(b => b.click());
      });
      await new Promise(r => setTimeout(r, 500));

      // Try each selector
      let clicked = false;
      for (const sel of modal.selectors) {
        const found = await page.evaluate((s) => {
          const el = document.querySelector(s);
          if (el) { el.click(); return true; }
          return false;
        }, sel);
        if (found) { clicked = true; break; }
      }

      // Also try text matching
      if (!clicked) {
        clicked = await page.evaluate((name) => {
          const lower = name.toLowerCase();
          const btns = Array.from(document.querySelectorAll('button, a, .menu-btn'));
          const btn = btns.find(b => b.textContent.toLowerCase().includes(lower));
          if (btn) { btn.click(); return true; }
          return false;
        }, modal.name);
      }

      await new Promise(r => setTimeout(r, 1500));

      // Check something is open/visible
      const anyModalOpen = await page.evaluate(() => {
        const modals = document.querySelectorAll('.modal, [id*="modal"], .popup, [class*="modal"]');
        return Array.from(modals).some(m => {
          const s = getComputedStyle(m);
          return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
        });
      });

      if (clicked && anyModalOpen) {
        pass(`${modal.name} modal`, 'opens OK');
      } else if (!clicked) {
        fail(`${modal.name} modal`, 'button not found');
        await shot(page, `modal-${modal.name.toLowerCase()}-notfound`);
      } else {
        fail(`${modal.name} modal`, 'clicked but modal not visible');
        await shot(page, `modal-${modal.name.toLowerCase()}-notopen`);
      }
    } catch (e) {
      fail(`${modal.name} modal`, e.message);
    }
  }

  // ─────────────────────────────────────────────
  // CHECK 7 — No JS errors (especially Capacitor/SpeechRecognition)
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 7] JS errors analysis');
  const capacitorErrors = jsErrors.filter(e =>
    e.toLowerCase().includes('capacitor') ||
    e.toLowerCase().includes('speechrecognition') ||
    e.toLowerCase().includes('speech') ||
    e.toLowerCase().includes('plugin')
  );
  const otherErrors = jsErrors.filter(e =>
    !e.toLowerCase().includes('capacitor') &&
    !e.toLowerCase().includes('speechrecognition') &&
    !e.toLowerCase().includes('speech') &&
    !e.toLowerCase().includes('plugin')
  );

  if (capacitorErrors.length === 0) {
    pass('No Capacitor/Speech JS errors');
  } else {
    fail('No Capacitor/Speech JS errors', capacitorErrors.join(' | '));
  }

  if (otherErrors.length === 0) {
    pass('No other JS errors');
  } else {
    // Filter known non-critical errors
    const critical = otherErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('net::ERR_ABORTED') &&
      !e.includes('sw.js') // SW may not work in headless
    );
    if (critical.length === 0) {
      pass('No critical JS errors', `${otherErrors.length} non-critical ignored`);
    } else {
      fail('No other JS errors', critical.slice(0, 3).join(' | '));
    }
  }

  // ─────────────────────────────────────────────
  // CHECK 8 — Network errors
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 8] Network errors');
  const critical4xx5xx = allRequests.filter(r =>
    r.status >= 400 &&
    !r.url.includes('favicon') &&
    !r.url.includes('nominatim') // GPS not expected in headless
  );

  if (networkErrors.length === 0 && critical4xx5xx.length === 0) {
    pass('Zero network errors');
  } else {
    const details = [
      ...networkErrors.slice(0, 3),
      ...critical4xx5xx.slice(0, 3).map(r => `${r.status} ${r.url}`)
    ].join(' | ');
    fail('Zero network errors', details);
  }

  // ─────────────────────────────────────────────
  // CHECK 9 — Mobile responsive (no horizontal overflow)
  // ─────────────────────────────────────────────
  console.log('\n[CHECK 9] Mobile responsive (375×812)');
  try {
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 500));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (!overflow) {
      pass('Mobile no horizontal overflow');
    } else {
      fail('Mobile no horizontal overflow', `scrollWidth=${document.documentElement.scrollWidth} > clientWidth=${document.documentElement.clientWidth}`);
      await shot(page, 'mobile-overflow');
    }
  } catch (e) {
    fail('Mobile responsive', e.message);
  }

  // ─────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));
  console.log(`${'Check'.padEnd(40)} ${'Status'.padEnd(8)} Details`);
  console.log('─'.repeat(60));
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${r.name.padEnd(38)} ${r.status.padEnd(8)} ${r.detail.slice(0, 60)}`);
  }

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log('\n' + '─'.repeat(60));
  console.log(`Total: ${passed} PASS, ${failed} FAIL`);

  if (jsErrors.length > 0) {
    console.log('\nAll JS errors collected:');
    jsErrors.forEach((e, i) => console.log(`  [${i+1}] ${e.slice(0, 120)}`));
  }

  if (critical4xx5xx && critical4xx5xx.length > 0) {
    console.log('\nHTTP errors:');
    critical4xx5xx.forEach(r => console.log(`  ${r.status} ${r.url}`));
  }

  await browser.close();

  if (failed === 0) {
    console.log('\n✅ App verified — all checks passed.');
  } else {
    console.log(`\n⚠️  ${failed} check(s) failed — see details above.`);
    process.exit(1);
  }
})();
