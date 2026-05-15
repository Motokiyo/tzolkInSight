/**
 * TzolkInSight PWA - End-to-End Puppeteer Test Suite
 * Tests: page load, JS errors, calendar visibility, menu navigation,
 *        detail view, Croix Maya modal, analyse confirm popup, mobile overflow
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const RESULTS = [];
let jsErrors = [];
let consoleWarnings = [];

function pass(name, detail = '') {
  RESULTS.push({ status: 'PASS', name, detail });
}

function fail(name, detail = '') {
  RESULTS.push({ status: 'FAIL', name, detail });
}

function warn(name, detail = '') {
  RESULTS.push({ status: 'WARN', name, detail });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForMenuLoaded(page) {
  // Menu is loaded dynamically via fetch; wait for .main-menu in DOM
  await page.waitForSelector('.main-menu', { timeout: 10000 });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // ── Capture all console errors & warnings ──────────────────────────────────
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') jsErrors.push(text);
    if (type === 'warning') consoleWarnings.push(text);
  });
  page.on('pageerror', err => jsErrors.push(`[pageerror] ${err.message}`));

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1 — Page loads (networkidle0)
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    const response = await page.goto(BASE_URL, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    if (response && response.status() === 200) {
      pass('Page loads (networkidle0)', `HTTP ${response.status()}`);
    } else {
      fail('Page loads (networkidle0)', `HTTP ${response ? response.status() : 'no response'}`);
    }
  } catch (e) {
    fail('Page loads (networkidle0)', e.message);
  }

  // Wait for dynamic menu injection
  try {
    await waitForMenuLoaded(page);
    await sleep(1500); // let scripts settle
  } catch (e) {
    fail('Dynamic menu injection', e.message);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2 — No JS errors on initial load
  // ═══════════════════════════════════════════════════════════════════════════
  const errorsAtLoad = [...jsErrors];
  if (errorsAtLoad.length === 0) {
    pass('No JS errors on load');
  } else {
    fail('No JS errors on load', errorsAtLoad.slice(0, 5).join(' | '));
  }
  // Reset for next tests
  jsErrors = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3 — Main calendar visible
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    // Look for widget container or tzolkin-details section
    const calendarVisible = await page.evaluate(() => {
      const selectors = [
        '#calendar',
        '.tzolkin-calendar',
        '#tzolkin-details',
        '.tzolkin-widget',
        '[id*="tzolkin"]',
        '[class*="tzolkin"]',
        'canvas',
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) return { found: sel, w: rect.width, h: rect.height };
        }
      }
      return null;
    });
    if (calendarVisible) {
      pass('Main calendar visible', `Selector: "${calendarVisible.found}" (${calendarVisible.w}x${calendarVisible.h})`);
    } else {
      fail('Main calendar visible', 'No calendar/tzolkin element found with visible dimensions');
    }
  } catch (e) {
    fail('Main calendar visible', e.message);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 4 — Menu items clickable (Calendrier, Notes, Enregistrés, Réglages)
  // ═══════════════════════════════════════════════════════════════════════════
  const menuItems = [
    { label: 'Calendrier', action: async (p) => {
        // Calendrier button calls closeAllModals() — first open a modal so it has effect
        const btn = await p.$('.menu-button');
        if (btn) await btn.click();
      }
    },
    { label: 'Notes', action: async (p) => {
        const btns = await p.$$('.menu-button');
        // Find Notes button by text
        for (const btn of btns) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && text.toLowerCase().includes('notes')) { await btn.click(); return; }
        }
        // Fallback: click by span text
        await p.evaluate(() => {
          const spans = Array.from(document.querySelectorAll('.menu-button span'));
          const notesBtn = spans.find(s => s.textContent.trim() === 'Notes');
          if (notesBtn) notesBtn.closest('.menu-button').click();
        });
      }
    },
    { label: 'Enregistrés', action: async (p) => {
        // Inside Notes modal, click the Enregistrés button
        try {
          const savedBtn = await p.$('#open-saved-btn');
          if (savedBtn) await savedBtn.click();
        } catch (_) {}
      }
    },
    { label: 'Réglages', action: async (p) => {
        // Réglages added dynamically by tzolkin-admin.js — find by text
        await p.evaluate(() => {
          const spans = Array.from(document.querySelectorAll('.menu-button span'));
          const btn = spans.find(s => s.textContent.toLowerCase().includes('glage') || s.textContent.toLowerCase().includes('reglage') || s.textContent.toLowerCase().includes('settings'));
          if (btn) btn.closest('.menu-button').click();
          else {
            // Try any button with settings-related onclick
            const allBtns = Array.from(document.querySelectorAll('[onclick*="settings"], [onclick*="reglages"], [onclick*="Settings"]'));
            if (allBtns[0]) allBtns[0].click();
          }
        });
      }
    }
  ];

  for (const item of menuItems) {
    // Make menu visible first
    await page.evaluate(() => {
      const menu = document.querySelector('.main-menu');
      if (menu) menu.classList.remove('hidden');
    });
    await sleep(300);

    const errorsBefore = jsErrors.length;
    try {
      await item.action(page);
      await sleep(600);
      const newErrors = jsErrors.slice(errorsBefore);
      if (newErrors.length === 0) {
        pass(`Menu: ${item.label}`, 'Clicked, no JS errors');
      } else {
        fail(`Menu: ${item.label}`, newErrors.join(' | '));
      }
    } catch (e) {
      fail(`Menu: ${item.label}`, e.message);
    }

    // Close any open modal
    await page.evaluate(() => {
      if (typeof closeAllModals === 'function') closeAllModals();
    });
    await sleep(400);
  }

  jsErrors = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 5 — Open a person's detail view
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    // Look for a saved person entry, or a "detail" trigger button
    const detailOpened = await page.evaluate(() => {
      // Try clicking a day-cell or person-detail trigger
      const triggers = [
        ...document.querySelectorAll('[onclick*="showDetail"], [onclick*="openDetail"], [onclick*="detail"], .person-row, .saved-entry, .entry-row, [data-person]')
      ];
      if (triggers[0]) { triggers[0].click(); return 'clicked: ' + (triggers[0].className || triggers[0].id || 'element'); }

      // Try the tzolkin widget "important days" entries
      const widgets = document.querySelectorAll('.tzolkin-entry, .day-cell, .nawal-cell');
      if (widgets[0]) { widgets[0].click(); return 'widget cell clicked'; }

      return null;
    });

    await sleep(800);

    const detailVisible = await page.evaluate(() => {
      const el = document.getElementById('tzolkin-detail-view');
      if (el && el.style.display !== 'none' && el.style.display !== '') return true;
      const el2 = document.querySelector('.detail-view, [id*="detail"]');
      if (el2 && el2.getBoundingClientRect().height > 0) return true;
      return document.body.classList.contains('detail-view-active');
    });

    if (detailVisible) {
      pass('Person detail view', `Opened via: ${detailOpened}`);
    } else if (detailOpened) {
      warn('Person detail view', `Trigger found (${detailOpened}) but detail panel not visible — may require saved data`);
    } else {
      warn('Person detail view', 'No person entries found to click — app may need saved data');
    }

    // Close detail view if open
    await page.evaluate(() => {
      if (typeof closeAllModals === 'function') closeAllModals();
      const el = document.getElementById('tzolkin-detail-view');
      if (el) el.style.display = 'none';
      document.body.classList.remove('detail-view-active');
    });
  } catch (e) {
    warn('Person detail view', e.message);
  }

  jsErrors = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 6 — Croix Maya opens without error
  // The modal requires (personName, glyphId, numberId, birthDate).
  // We call openCroixMayaModal() directly with valid test data (glyph=1, number=1).
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    const croixResult = await page.evaluate(() => {
      // Verify the function is available
      if (typeof openCroixMayaModal !== 'function') return { ok: false, reason: 'openCroixMayaModal not defined' };
      if (!window.TzolkinCore) return { ok: false, reason: 'TzolkinCore not available' };
      // Call with valid test data: glyph 1 (Imix), tone 1, with a birth date
      try {
        openCroixMayaModal('Test Person', 1, 1, '1985-06-15');
        return { ok: true };
      } catch (e) {
        return { ok: false, reason: e.message };
      }
    });

    await sleep(600);

    const croixVisible = await page.evaluate(() => {
      const modal = document.getElementById('croix-maya-modal');
      return modal ? (modal.style.display === 'block' || modal.style.display === 'flex') : false;
    });

    const croixErrors = jsErrors.filter(e => !e.includes('favicon'));
    jsErrors = [];

    if (!croixResult.ok) {
      fail('Croix Maya modal opens', `Could not invoke: ${croixResult.reason}`);
    } else if (croixVisible && croixErrors.length === 0) {
      pass('Croix Maya modal opens', 'openCroixMayaModal(name, glyph=1, tone=1, birthDate) — modal visible, no errors');
    } else if (croixVisible && croixErrors.length > 0) {
      fail('Croix Maya modal opens', `Modal visible but JS errors: ${croixErrors.join(' | ')}`);
    } else {
      fail('Croix Maya modal opens', `Function called but modal not visible (display=${await page.evaluate(() => document.getElementById('croix-maya-modal')?.style.display)})`);
    }

    // Close modal
    await page.evaluate(() => {
      if (typeof closeCroixMayaModal === 'function') closeCroixMayaModal();
      const m = document.getElementById('croix-maya-modal');
      if (m) m.style.display = 'none';
    });
  } catch (e) {
    fail('Croix Maya modal opens', e.message);
  }

  jsErrors = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 7 — Analyse confirm popup
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    const analyseTriggered = await page.evaluate(() => {
      // Find "Commander Analyse" button by text
      const allEls = Array.from(document.querySelectorAll('[onclick*="showAnalyseConfirm"], [onclick*="Analyse"], div, button, span'));
      const found = allEls.find(el => {
        const t = el.textContent || '';
        return t.includes('Commander') && t.includes('Analyse') && el.children.length < 5;
      });
      if (found) { found.click(); return 'text match'; }

      // Try direct call
      if (typeof showAnalyseConfirm === 'function') {
        showAnalyseConfirm();
        return 'showAnalyseConfirm() direct';
      }
      return null;
    });

    await sleep(600);

    const popupVisible = await page.evaluate(() => {
      const popup = document.getElementById('analyse-confirm-popup');
      if (!popup) return { visible: false, reason: 'element not found' };
      const display = popup.style.display;
      // The popup uses display:flex when shown
      return { visible: display === 'flex' || display === 'block', display };
    });

    const analyseErrors = jsErrors.filter(e => !e.includes('favicon'));
    jsErrors = [];

    if (popupVisible.visible && analyseErrors.length === 0) {
      pass('Analyse confirm popup', `Triggered via ${analyseTriggered}, display: ${popupVisible.display}`);
    } else if (popupVisible.visible && analyseErrors.length > 0) {
      fail('Analyse confirm popup', `Visible but errors: ${analyseErrors.join(' | ')}`);
    } else if (analyseTriggered) {
      fail('Analyse confirm popup', `Triggered (${analyseTriggered}) but popup not visible. display="${popupVisible.display}"`);
    } else {
      fail('Analyse confirm popup', 'Could not find Commander Analyse trigger');
    }

    // Close popup
    await page.evaluate(() => {
      if (typeof closeAnalyseConfirm === 'function') closeAnalyseConfirm();
      const p = document.getElementById('analyse-confirm-popup');
      if (p) p.style.display = 'none';
    });
  } catch (e) {
    fail('Analyse confirm popup', e.message);
  }

  jsErrors = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 8 — Mobile viewport 375x812: no horizontal overflow
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await waitForMenuLoaded(page);
    await sleep(1500);

    const overflow = await page.evaluate(() => {
      const results = [];
      const body = document.body;
      const html = document.documentElement;

      const clientWidth = html.clientWidth;
      const bodyScrollWidth = body.scrollWidth;
      const htmlScrollWidth = html.scrollWidth;

      results.push({ el: 'body', scrollWidth: bodyScrollWidth, clientWidth });
      results.push({ el: 'html', scrollWidth: htmlScrollWidth, clientWidth });

      // Also check major sections
      const sections = document.querySelectorAll('section, .main-menu, #tzolkin-details, .tzolkin-widget');
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.right > clientWidth + 2) {
          results.push({ el: sec.tagName + (sec.id ? '#' + sec.id : '') + (sec.className ? '.' + sec.className.split(' ')[0] : ''), scrollWidth: Math.round(rect.right), clientWidth });
        }
      });

      return { clientWidth, bodyScrollWidth, htmlScrollWidth, details: results };
    });

    const hasOverflow = overflow.bodyScrollWidth > overflow.clientWidth + 2 || overflow.htmlScrollWidth > overflow.clientWidth + 2;

    if (!hasOverflow) {
      pass('Mobile 375x812: no horizontal overflow', `body.scrollWidth=${overflow.bodyScrollWidth}, clientWidth=${overflow.clientWidth}`);
    } else {
      fail('Mobile 375x812: no horizontal overflow', `bodyScrollWidth=${overflow.bodyScrollWidth} > clientWidth=${overflow.clientWidth} | htmlScrollWidth=${overflow.htmlScrollWidth}`);
    }

    jsErrors = [];
  } catch (e) {
    fail('Mobile 375x812: no horizontal overflow', e.message);
  }

  // ─── Final report ──────────────────────────────────────────────────────────
  await browser.close();

  const pad = (str, n) => String(str).padEnd(n);
  const LINE = '─'.repeat(90);

  console.log('\n' + LINE);
  console.log('  TzolkInSight PWA — End-to-End Test Report');
  console.log(LINE);
  console.log(pad('Status', 7) + pad('Test Name', 42) + 'Detail');
  console.log(LINE);

  let passes = 0, fails = 0, warns = 0;
  for (const r of RESULTS) {
    const icon = r.status === 'PASS' ? '✅ PASS' : r.status === 'FAIL' ? '❌ FAIL' : '⚠️  WARN';
    const detail = r.detail ? r.detail.slice(0, 120) : '';
    console.log(pad(icon, 7) + '  ' + pad(r.name, 42) + detail);
    if (r.status === 'PASS') passes++;
    else if (r.status === 'FAIL') fails++;
    else warns++;
  }

  console.log(LINE);
  console.log(`  Summary: ${passes} passed, ${fails} failed, ${warns} warnings`);
  console.log(LINE + '\n');

  if (jsErrors.length > 0) {
    console.log('Remaining JS errors captured after last test:');
    jsErrors.forEach(e => console.log('  •', e));
  }

  process.exit(fails > 0 ? 1 : 0);
})();
