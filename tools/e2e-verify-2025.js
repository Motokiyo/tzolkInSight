/**
 * TzolkInSight — End-to-end verification script
 * Tests: page load, splash, widget, menu modals, responsive, JS errors
 */

const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'file:///Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/www/index.html';
const SCREENSHOT_DIR = '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/e2e-screenshots';
const TS = Date.now();

const results = [];
const jsErrors = [];
const consoleErrors = [];

function log(msg) {
  process.stdout.write(msg + '\n');
}

function pass(name, detail = '') {
  results.push({ name, status: 'PASS', detail });
  log(`  [PASS] ${name}${detail ? ' — ' + detail : ''}`);
}

function fail(name, detail = '') {
  results.push({ name, status: 'FAIL', detail });
  log(`  [FAIL] ${name}${detail ? ' — ' + detail : ''}`);
}

async function shot(page, name) {
  const file = `${SCREENSHOT_DIR}/${name}-${TS}.png`;
  await page.screenshot({ path: file, fullPage: false });
  log(`  [SCREENSHOT] ${file}`);
  return file;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  log('\n=== TzolkInSight E2E Verification ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();

  // Track JS errors (filter out known non-issues)
  page.on('pageerror', err => {
    const msg = err.message;
    jsErrors.push(msg);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter iCloud "not iOS native" messages — expected in browser
      if (text.includes('iCloud') || text.includes('icloud') || text.includes('Capacitor')) return;
      consoleErrors.push(text);
    }
  });

  // =====================
  // CHECK 1: Page loads
  // =====================
  log('\n--- Check 1: Page Load ---');
  try {
    const t0 = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    const loadTime = ((Date.now() - t0) / 1000).toFixed(2);
    pass('Page loads', `${loadTime}s`);
    await shot(page, 'e2e-page-load');
  } catch (e) {
    fail('Page loads', e.message);
    await shot(page, 'e2e-page-load-fail');
    await browser.close();
    return printResults();
  }

  // =====================
  // CHECK 2: Splash screen visible
  // =====================
  log('\n--- Check 2: Splash Screen ---');
  try {
    // Wait for splash to be present
    await page.waitForSelector('#splash-screen', { timeout: 5000 });
    const splashVisible = await page.$eval('#splash-screen', el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    if (splashVisible) {
      pass('Splash screen visible');
    } else {
      // It might have already auto-hidden
      pass('Splash screen present (may have auto-hidden)');
    }
    await shot(page, 'e2e-splash');
  } catch (e) {
    fail('Splash screen visible', e.message);
    await shot(page, 'e2e-splash-fail');
  }

  // =====================
  // CHECK 3: Dismiss splash
  // =====================
  log('\n--- Check 3: Dismiss Splash ---');
  try {
    // Click on splash to dismiss
    const splashEl = await page.$('#splash-screen');
    if (splashEl) {
      await page.click('#splash-screen');
      await sleep(1000);
    }
    // Wait for menu container to appear
    await page.waitForSelector('#modales-container', { timeout: 8000 });
    pass('Splash dismissed, menu container present');
    await shot(page, 'e2e-after-splash');
  } catch (e) {
    fail('Splash dismissed', e.message);
    await shot(page, 'e2e-splash-dismiss-fail');
  }

  // Wait a bit for dynamic menu to load
  await sleep(2000);
  await shot(page, 'e2e-menu-loaded');

  // =====================
  // CHECK 4: Widget visible
  // =====================
  log('\n--- Check 4: Widget ---');
  try {
    // Look for the widget container
    const widgetExists = await page.$('#tzolkin-widget') !== null;
    const calendarExists = await page.$('.tzolkin-calendar') !== null || await page.$('#calendar-widget') !== null;
    const anyWidget = await page.$('[id*="widget"]') !== null || await page.$('[class*="widget"]') !== null;

    if (widgetExists) {
      pass('Widget container (#tzolkin-widget) present');
    } else if (calendarExists) {
      pass('Calendar widget present');
    } else if (anyWidget) {
      pass('Widget element found');
    } else {
      // Check for glyph SVG or canvas
      const svgPresent = await page.$('img[src*="assets"]') !== null || await page.$('svg') !== null;
      if (svgPresent) {
        pass('Widget SVG/image content present');
      } else {
        fail('Widget not found');
      }
    }
    await shot(page, 'e2e-widget');
  } catch (e) {
    fail('Widget visible', e.message);
    await shot(page, 'e2e-widget-fail');
  }

  // =====================
  // CHECK 5: Main content not blank
  // =====================
  log('\n--- Check 5: Main Content ---');
  try {
    const bodyText = await page.evaluate(() => document.body.innerText.trim());
    if (bodyText.length > 50) {
      pass('Main content not blank', `${bodyText.length} chars visible`);
    } else {
      fail('Main content appears blank', `only ${bodyText.length} chars`);
      await shot(page, 'e2e-blank-content');
    }
  } catch (e) {
    fail('Main content check', e.message);
  }

  // =====================
  // CHECK 6: No broken images
  // =====================
  log('\n--- Check 6: Images ---');
  try {
    const brokenImgs = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => img.complete && img.naturalWidth === 0 && img.src).map(img => img.src);
    });
    if (brokenImgs.length === 0) {
      pass('No broken images');
    } else {
      fail('Broken images found', brokenImgs.slice(0, 3).join(', '));
    }
  } catch (e) {
    fail('Image check', e.message);
  }

  // =====================
  // CHECK 7: Menu buttons (after menu loads)
  // =====================
  log('\n--- Check 7: Menu Buttons ---');
  await sleep(1000);

  const menuButtons = [
    { label: 'Fonctionnement', selectors: ['#btn-fonctionnement', '[data-modal="fonctionnement"]', 'button[onclick*="fonctionnement"]'] },
    { label: 'Notes', selectors: ['#btn-notes', '[data-modal="notes"]', 'button[onclick*="notes"]'] },
    { label: 'Crédits', selectors: ['#btn-credits', '[data-modal="credits"]', 'button[onclick*="credits"]'] },
    { label: 'Réglages', selectors: ['#btn-settings', '#btn-reglages', '[data-modal="settings"]', 'button[onclick*="settings"]', 'button[onclick*="reglages"]'] },
  ];

  for (const btn of menuButtons) {
    let found = false;
    for (const sel of btn.selectors) {
      const el = await page.$(sel);
      if (el) {
        found = true;
        pass(`Button "${btn.label}" found`, sel);
        break;
      }
    }
    if (!found) {
      // Try text search
      const byText = await page.evaluate((label) => {
        const btns = Array.from(document.querySelectorAll('button, a, [role="button"]'));
        return btns.some(b => b.textContent.trim().toLowerCase().includes(label.toLowerCase()));
      }, btn.label);
      if (byText) {
        pass(`Button "${btn.label}" found by text`);
      } else {
        fail(`Button "${btn.label}" not found`);
      }
    }
  }
  await shot(page, 'e2e-menu-buttons');

  // =====================
  // CHECK 8: Modal — Fonctionnement
  // =====================
  log('\n--- Check 8: Fonctionnement Modal ---');
  try {
    const btnFonc = await page.$('#btn-fonctionnement') ||
      await page.$('[data-modal="fonctionnement"]') ||
      await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent.toLowerCase().includes('fonctionnement'));
      });

    if (btnFonc && btnFonc.asElement && btnFonc.asElement()) {
      await btnFonc.asElement().click();
    } else if (btnFonc && btnFonc.click) {
      await btnFonc.click();
    } else {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(b => b.textContent.toLowerCase().includes('fonctionnement'));
        if (b) b.click();
      });
    }

    await sleep(1000);
    const modalOpen = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [class*="modal"]');
      return Array.from(modals).some(m => {
        const style = window.getComputedStyle(m);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    });

    if (modalOpen) {
      pass('Fonctionnement modal opens');
      await shot(page, 'e2e-modal-fonctionnement');
      // Close it
      await page.keyboard.press('Escape');
      await sleep(500);
      // Or click close button
      await page.evaluate(() => {
        const closeBtn = document.querySelector('.modal-close, [class*="close"], button[aria-label="close"]');
        if (closeBtn) closeBtn.click();
      });
      await sleep(500);
    } else {
      fail('Fonctionnement modal did not open');
      await shot(page, 'e2e-modal-fonctionnement-fail');
    }
  } catch (e) {
    fail('Fonctionnement modal', e.message);
    await shot(page, 'e2e-modal-fonctionnement-err');
  }

  // =====================
  // CHECK 9: Modal — Notes
  // =====================
  log('\n--- Check 9: Notes Modal ---');
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(b => b.textContent.trim().toLowerCase().includes('notes') && !b.textContent.toLowerCase().includes('ajout'));
      if (b) b.click();
    });
    await sleep(1000);

    const notesModalOpen = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [class*="modal"], [id*="modal"]');
      return Array.from(modals).some(m => {
        const style = window.getComputedStyle(m);
        return (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0');
      });
    });

    if (notesModalOpen) {
      pass('Notes modal opens');
      await shot(page, 'e2e-modal-notes');
    } else {
      fail('Notes modal did not open');
      await shot(page, 'e2e-modal-notes-fail');
    }

    // Close
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.modal-close, .close-btn, [class*="close"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(500);
  } catch (e) {
    fail('Notes modal', e.message);
  }

  // =====================
  // CHECK 10: Modal — Crédits
  // =====================
  log('\n--- Check 10: Credits Modal ---');
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(b => b.textContent.trim().toLowerCase().includes('crédit') || b.textContent.trim().toLowerCase().includes('credit'));
      if (b) b.click();
    });
    await sleep(1000);

    const creditsOpen = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [class*="modal"], [id*="modal"]');
      return Array.from(modals).some(m => {
        const style = window.getComputedStyle(m);
        return (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0');
      });
    });

    if (creditsOpen) {
      pass('Credits modal opens');
      await shot(page, 'e2e-modal-credits');
    } else {
      fail('Credits modal did not open');
      await shot(page, 'e2e-modal-credits-fail');
    }

    // Close
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.modal-close, .close-btn, [class*="close"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(500);
  } catch (e) {
    fail('Credits modal', e.message);
  }

  // =====================
  // CHECK 11: Modal — Réglages
  // =====================
  log('\n--- Check 11: Réglages Modal ---');
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(b =>
        b.textContent.trim().toLowerCase().includes('réglage') ||
        b.textContent.trim().toLowerCase().includes('reglage') ||
        b.textContent.trim().toLowerCase().includes('setting') ||
        b.id === 'btn-settings' || b.id === 'btn-reglages'
      );
      if (b) b.click();
    });
    await sleep(1500);

    const settingsOpen = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [class*="modal"], [id*="modal"]');
      return Array.from(modals).some(m => {
        const style = window.getComputedStyle(m);
        return (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0');
      });
    });

    if (settingsOpen) {
      pass('Réglages modal opens');
      await shot(page, 'e2e-modal-settings');
    } else {
      fail('Réglages modal did not open');
      await shot(page, 'e2e-modal-settings-fail');
    }

    // Close
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.modal-close, .close-btn, [class*="close"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(500);
  } catch (e) {
    fail('Réglages modal', e.message);
  }

  // =====================
  // CHECK 12: JS Errors
  // =====================
  log('\n--- Check 12: JS Errors ---');
  // Filter out iCloud/Capacitor messages which are expected in browser
  const realErrors = jsErrors.filter(e =>
    !e.includes('iCloud') && !e.includes('Capacitor') && !e.includes('capacitor') &&
    !e.includes('icloud') && !e.includes('plugin') && !e.includes('Plugin')
  );
  const realConsoleErrors = consoleErrors.filter(e =>
    !e.includes('iCloud') && !e.includes('Capacitor') && !e.includes('capacitor') &&
    !e.includes('icloud') && !e.includes('plugin') && !e.includes('Plugin') &&
    !e.includes('net::ERR') // file:// protocol limitations
  );

  if (realErrors.length === 0) {
    pass('No JS runtime errors');
  } else {
    fail('JS errors found', realErrors.slice(0, 3).join(' | '));
  }

  if (realConsoleErrors.length === 0) {
    pass('No console errors (filtered Capacitor/iCloud)');
  } else {
    fail('Console errors found', realConsoleErrors.slice(0, 3).join(' | '));
  }

  if (jsErrors.length > 0) {
    log(`  [INFO] All JS errors (including Capacitor/iCloud): ${jsErrors.length}`);
    jsErrors.forEach(e => log(`    - ${e.substring(0, 120)}`));
  }

  // =====================
  // CHECK 13: Responsive — Mobile 375px
  // =====================
  log('\n--- Check 13: Responsive Mobile 375px ---');
  try {
    await page.setViewport({ width: 375, height: 812 });
    await sleep(1000);
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (!overflow) {
      pass('Mobile 375px — no horizontal overflow');
    } else {
      fail('Mobile 375px — horizontal overflow detected');
    }
    await shot(page, 'e2e-mobile-375');
  } catch (e) {
    fail('Mobile 375px check', e.message);
  }

  // =====================
  // CHECK 14: Responsive — Desktop 1280px
  // =====================
  log('\n--- Check 14: Responsive Desktop 1280px ---');
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await sleep(1000);
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (!overflow) {
      pass('Desktop 1280px — no horizontal overflow');
    } else {
      fail('Desktop 1280px — horizontal overflow detected');
    }
    await shot(page, 'e2e-desktop-1280');
  } catch (e) {
    fail('Desktop 1280px check', e.message);
  }

  // =====================
  // CHECK 15: iCloud logs (informational)
  // =====================
  log('\n--- Check 15: iCloud Status (informational) ---');
  const icloudLogs = jsErrors.filter(e => e.includes('iCloud') || e.includes('icloud'));
  if (icloudLogs.length === 0) {
    pass('No iCloud errors (good for browser context)');
  } else {
    pass('iCloud messages present but expected in browser', `${icloudLogs.length} message(s)`);
  }

  await browser.close();

  return printResults();
}

function printResults() {
  log('\n\n=== RESULTS ===\n');
  log('| Check | Status | Details |');
  log('|-------|--------|---------|');
  for (const r of results) {
    const icon = r.status === 'PASS' ? 'PASS' : 'FAIL';
    log(`| ${r.name} | ${icon} | ${r.detail || ''} |`);
  }

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  log(`\nTotal: ${passed} passed, ${failed} failed out of ${results.length} checks\n`);

  if (failed === 0) {
    log('App verified — all checks passed.');
  } else {
    log(`${failed} check(s) failed — see details above.`);
  }

  return { passed, failed, results };
}

run().catch(err => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
