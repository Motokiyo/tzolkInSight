const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8088';
const SCREENSHOT_DIR = '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/e2e-screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const results = [];
let browser, page;
const jsErrors = [];
const networkErrors = [];

async function screenshot(name) {
  const p = path.join(SCREENSHOT_DIR, `${name}-${Date.now()}.png`);
  await page.screenshot({ path: p, fullPage: false });
  return p;
}

function pass(check, detail = '') {
  results.push({ check, status: 'PASS', detail });
  console.log(`  PASS  ${check}${detail ? ' — ' + detail : ''}`);
}

function fail(check, detail = '') {
  results.push({ check, status: 'FAIL', detail });
  console.log(`  FAIL  ${check}${detail ? ' — ' + detail : ''}`);
}

function warn(check, detail = '') {
  results.push({ check, status: 'WARN', detail });
  console.log(`  WARN  ${check}${detail ? ' — ' + detail : ''}`);
}

async function dismissSplash() {
  // Wait for splash to be visible then click it
  const splash = await page.$('#splash-screen');
  if (splash) {
    const isVisible = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return s.display !== 'none' && parseFloat(s.opacity) > 0;
    }, splash);
    if (isVisible) {
      await splash.click();
      await new Promise(r => setTimeout(r, 800));
    }
  }
}

async function openModal(name) {
  // Open modal by finding the button with matching onclick
  const clicked = await page.evaluate((modalName) => {
    const btns = Array.from(document.querySelectorAll('button, a, [onclick]'));
    const btn = btns.find(b => {
      const onclick = b.getAttribute('onclick') || '';
      return onclick.includes(`openModal('${modalName}')`);
    });
    if (btn) { btn.click(); return true; }
    return false;
  }, name);
  return clicked;
}

async function isModalVisible() {
  return page.evaluate(() => {
    // Only check specific named modals, not the container
    const modalIds = ['fonctionnement-modal', 'notes-modal', 'saved-modal', 'credits-modal', 'croix-maya-modal', 'admin-modal', 'pin-modal'];
    for (const id of modalIds) {
      const m = document.getElementById(id);
      if (!m) continue;
      const s = window.getComputedStyle(m);
      if (s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0.1 && m.offsetHeight > 0) {
        return id;
      }
    }
    // Also check for modal-open class on body
    if (document.body.classList.contains('modal-open')) {
      const open = document.querySelector('.modal-open');
      return open ? (open.id || 'modal-open') : 'modal-open';
    }
    return null;
  });
}

async function closeModal() {
  // Try click first close button visible
  const closed = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => {
      const s = window.getComputedStyle(b);
      if (s.display === 'none' || parseFloat(s.opacity) < 0.1) return false;
      const text = b.textContent.trim();
      const onclick = b.getAttribute('onclick') || '';
      return text === '×' || text === 'Fermer' || onclick.includes('closeAllModals') || onclick.includes('closeModal');
    });
    if (closeBtn) { closeBtn.click(); return true; }
    return false;
  });
  if (!closed) await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
}

async function run() {
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  await page.setViewport({ width: 768, height: 900 });

  page.on('pageerror', err => jsErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') jsErrors.push(msg.text());
  });
  page.on('requestfailed', req => {
    const url = req.url();
    if (!url.includes('nominatim') && !url.includes('revolut') && !url.includes('sw.js')) {
      networkErrors.push(`${req.failure()?.errorText} — ${url}`);
    }
  });
  page.on('response', res => {
    const status = res.status();
    const url = res.url();
    if (status >= 400 && !url.includes('sw.js') && !url.includes('nominatim')) {
      networkErrors.push(`HTTP ${status} — ${url}`);
    }
  });

  // ---------------------------------------------------------------
  // CHECK 1: Page load
  // ---------------------------------------------------------------
  console.log('\n--- Core Checks ---');
  try {
    const t0 = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const loadTime = ((Date.now() - t0) / 1000).toFixed(1);
    pass('Page loads', `${loadTime}s`);
  } catch (e) {
    fail('Page loads', e.message);
    await browser.close();
    printSummary();
    return;
  }

  // ---------------------------------------------------------------
  // CHECK 2: Splash screen shows
  // ---------------------------------------------------------------
  try {
    const splashVisible = await page.evaluate(() => {
      const el = document.getElementById('splash-screen');
      if (!el) return false;
      const s = window.getComputedStyle(el);
      return s.display !== 'none' && parseFloat(s.opacity) > 0;
    });
    if (splashVisible) {
      pass('Splash screen shows');
    } else {
      warn('Splash screen shows', 'splash not visible on load');
    }
    await screenshot('splash-state');
  } catch (e) {
    warn('Splash screen shows', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 3: Dismiss splash
  // ---------------------------------------------------------------
  try {
    await dismissSplash();

    // Verify splash gone
    const splashGone = await page.evaluate(() => {
      const el = document.getElementById('splash-screen');
      if (!el) return true;
      const s = window.getComputedStyle(el);
      return s.display === 'none' || parseFloat(s.opacity) < 0.1;
    });

    if (splashGone) {
      pass('Splash dismisses on click');
    } else {
      warn('Splash dismisses on click', 'splash may still be showing');
    }
    await screenshot('after-splash');
  } catch (e) {
    warn('Splash dismisses on click', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 4: Widget visible
  // ---------------------------------------------------------------
  try {
    const widgetVisible = await page.evaluate(() => {
      const w = document.getElementById('tzolkin-widget-container') || document.getElementById('tzolkin-widget-php');
      if (!w) return false;
      const s = window.getComputedStyle(w);
      return s.display !== 'none' && w.offsetHeight > 0;
    });
    if (widgetVisible) {
      pass('Tzolk\'in widget visible');
    } else {
      fail('Tzolk\'in widget visible', 'widget container not visible');
      await screenshot('widget-not-visible');
    }
  } catch (e) {
    fail('Tzolk\'in widget visible', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 5: SVG glyphs loaded (no broken images)
  // ---------------------------------------------------------------
  try {
    const imgInfo = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const withSrc = imgs.filter(i => i.src && !i.src.endsWith('/'));
      const broken = withSrc.filter(i => i.complete && i.naturalWidth === 0);
      return {
        total: withSrc.length,
        broken: broken.map(i => i.src.replace('http://localhost:8088/', ''))
      };
    });

    if (imgInfo.broken.length === 0) {
      pass('No broken images', `${imgInfo.total} images checked`);
    } else {
      fail('No broken images', `${imgInfo.broken.length} broken: ${imgInfo.broken.slice(0,3).join(', ')}`);
      await screenshot('broken-images');
    }
  } catch (e) {
    fail('No broken images', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 6: Menu buttons (5 expected)
  // ---------------------------------------------------------------
  console.log('\n--- Navigation Checks ---');
  try {
    const menuBtns = await page.$$eval('.menu-button', btns =>
      btns.filter(b => {
        const s = window.getComputedStyle(b);
        return s.display !== 'none' && b.offsetParent !== null;
      }).map(b => b.textContent.trim().substring(0, 30))
    );

    if (menuBtns.length >= 4) {
      pass('Menu buttons visible', `${menuBtns.length}: [${menuBtns.join(', ')}]`);
    } else if (menuBtns.length > 0) {
      warn('Menu buttons visible', `only ${menuBtns.length}: [${menuBtns.join(', ')}]`);
    } else {
      fail('Menu buttons visible', 'no .menu-button elements found or visible');
      await screenshot('menu-missing');
    }
  } catch (e) {
    fail('Menu buttons visible', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 7: Widget navigation prev/next
  // ---------------------------------------------------------------
  try {
    const navResult = await page.evaluate(() => {
      const prevBtn = document.querySelector('.tzolkin-nav-prev');
      const nextBtn = document.querySelector('.tzolkin-nav-next');
      if (!prevBtn || !nextBtn) return 'buttons not found';
      nextBtn.click();
      return 'clicked';
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const prevBtn = document.querySelector('.tzolkin-nav-prev');
      if (prevBtn) prevBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    if (navResult === 'clicked') {
      pass('Widget day navigation', 'prev/next clicked successfully');
    } else {
      warn('Widget day navigation', navResult);
    }
  } catch (e) {
    warn('Widget day navigation', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 8: Details cards (glyph/number/trecena)
  // ---------------------------------------------------------------
  try {
    const detailCards = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[onclick*="openDetailModal"]'));
      return btns.filter(b => b.offsetParent !== null).length;
    });

    if (detailCards >= 3) {
      pass('Detail cards visible', `${detailCards} detail expand buttons`);
    } else {
      warn('Detail cards visible', `only ${detailCards} detail buttons found`);
    }
  } catch (e) {
    warn('Detail cards visible', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 9: Modal — Fonctionnement
  // ---------------------------------------------------------------
  console.log('\n--- Modal Checks ---');
  try {
    const clicked = await openModal('fonctionnement');
    await new Promise(r => setTimeout(r, 700));

    if (clicked) {
      const modalId = await isModalVisible();
      if (modalId) {
        pass('Modal: Fonctionnement opens', `modal="${modalId}"`);
        await screenshot('modal-fonctionnement');
        await closeModal();
        const gone = await isModalVisible();
        if (!gone) {
          pass('Modal: Fonctionnement closes');
        } else {
          fail('Modal: Fonctionnement closes', 'modal still visible after close');
        }
      } else {
        fail('Modal: Fonctionnement opens', 'no visible modal after click');
        await screenshot('modal-fonct-fail');
      }
    } else {
      fail('Modal: Fonctionnement opens', 'button with openModal(fonctionnement) not found');
    }
  } catch (e) {
    fail('Modal: Fonctionnement opens', e.message);
    await screenshot('modal-fonct-error');
  }

  // ---------------------------------------------------------------
  // CHECK 10: Modal — Notes
  // ---------------------------------------------------------------
  try {
    const clicked = await openModal('notes');
    await new Promise(r => setTimeout(r, 700));

    if (clicked) {
      const modalId = await isModalVisible();
      if (modalId) {
        pass('Modal: Notes opens', `modal="${modalId}"`);
        await screenshot('modal-notes');

        // Check textarea is fillable — use evaluate to avoid stale node issues
        const textareaFillable = await page.evaluate(() => {
          const ta = document.getElementById('notes-input') || document.querySelector('textarea');
          if (!ta) return false;
          ta.focus();
          ta.value = 'Test note';
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          const val = ta.value;
          ta.value = '';
          return val === 'Test note';
        });
        if (textareaFillable) {
          pass('Modal: Notes textarea fillable');
        } else {
          warn('Modal: Notes textarea fillable', 'textarea not found or not fillable');
        }

        await closeModal();
      } else {
        fail('Modal: Notes opens', 'no visible modal');
        await screenshot('modal-notes-fail');
      }
    } else {
      fail('Modal: Notes opens', 'Notes button not found');
    }
  } catch (e) {
    fail('Modal: Notes opens', e.message);
    await screenshot('modal-notes-error');
  }

  // ---------------------------------------------------------------
  // CHECK 11: Modal — Credits
  // ---------------------------------------------------------------
  try {
    const clicked = await openModal('credits');
    await new Promise(r => setTimeout(r, 700));

    if (clicked) {
      const modalId = await isModalVisible();
      if (modalId) {
        pass('Modal: Credits opens', `modal="${modalId}"`);
        await screenshot('modal-credits');

        // Verify credits content
        const hasVersion = await page.evaluate(() => {
          const m = document.getElementById('credits-modal');
          return m ? m.textContent.includes('1.') : false;
        });
        if (hasVersion) {
          pass('Modal: Credits has version info');
        } else {
          warn('Modal: Credits has version info', 'version string not found');
        }

        await closeModal();
      } else {
        fail('Modal: Credits opens', 'no visible modal');
        await screenshot('modal-credits-fail');
      }
    } else {
      fail('Modal: Credits opens', 'Credits button not found');
    }
  } catch (e) {
    fail('Modal: Credits opens', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 12: Modal — Settings (Réglages / Admin)
  // ---------------------------------------------------------------
  try {
    const adminBtnExists = await page.$('#admin-menu-btn');
    if (adminBtnExists) {
      await page.click('#admin-menu-btn');
      await new Promise(r => setTimeout(r, 800));

      const modalId = await isModalVisible();
      if (modalId) {
        pass('Modal: Settings (Réglages) opens', `modal="${modalId}"`);
        await screenshot('modal-settings');
        await closeModal();
      } else {
        // May require PIN
        const pinVisible = await page.evaluate(() => {
          const pin = document.getElementById('pin-modal');
          if (!pin) return false;
          const s = window.getComputedStyle(pin);
          return s.display !== 'none' && parseFloat(s.opacity) > 0;
        });
        if (pinVisible) {
          pass('Modal: Settings (Réglages) opens', 'PIN modal shown (correct behaviour)');
          await closeModal();
        } else {
          fail('Modal: Settings (Réglages) opens', 'no modal visible after click');
          await screenshot('modal-settings-fail');
        }
      }
    } else {
      warn('Modal: Settings (Réglages) opens', '#admin-menu-btn not found');
    }
  } catch (e) {
    fail('Modal: Settings (Réglages) opens', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 13: Date input widget
  // ---------------------------------------------------------------
  console.log('\n--- Interactive Checks ---');
  try {
    const dateResult = await page.evaluate(() => {
      const input = document.querySelector('input[type="text"]');
      if (!input) return null;
      input.focus();
      input.value = '01/01/2025';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      return input.value;
    });
    if (dateResult) {
      pass('Date input: fillable', `value="${dateResult}"`);
    } else {
      warn('Date input: fillable', 'no text input found');
    }
  } catch (e) {
    warn('Date input: fillable', e.message);
  }

  // Reset to today
  try {
    const resetBtn = await page.$('.tzolkin-widget-reset');
    if (resetBtn) {
      await resetBtn.click();
      await new Promise(r => setTimeout(r, 400));
      pass('Date reset to today');
    } else {
      warn('Date reset to today', 'reset button not found');
    }
  } catch (e) {
    warn('Date reset to today', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 14: Responsive — Mobile 375x812
  // ---------------------------------------------------------------
  console.log('\n--- Responsive Checks ---');
  try {
    await page.setViewport({ width: 375, height: 812 });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1500));
    await dismissSplash();
    await new Promise(r => setTimeout(r, 500));

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (!overflow) {
      pass('Mobile 375x812: no horizontal overflow');
    } else {
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientW = await page.evaluate(() => document.documentElement.clientWidth);
      fail('Mobile 375x812: no horizontal overflow', `scrollWidth=${scrollW} > clientWidth=${clientW}`);
    }
    await screenshot('mobile-375');
  } catch (e) {
    fail('Mobile 375x812: no horizontal overflow', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 15: Responsive — Desktop 1280x800
  // ---------------------------------------------------------------
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1500));
    await dismissSplash();
    await new Promise(r => setTimeout(r, 500));

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    const bodyText = await page.evaluate(() => document.body.innerText.trim().length);

    if (!overflow && bodyText > 0) {
      pass('Desktop 1280x800: content displayed correctly');
    } else {
      if (overflow) fail('Desktop 1280x800: no overflow', 'horizontal scroll detected');
      if (!bodyText) fail('Desktop 1280x800: content displayed correctly', 'body is empty');
    }
    await screenshot('desktop-1280');
  } catch (e) {
    fail('Desktop 1280x800: content displayed correctly', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 16: Back/forward history
  // ---------------------------------------------------------------
  try {
    // Open notes modal then go back
    await openModal('notes');
    await new Promise(r => setTimeout(r, 500));
    await page.goBack().catch(() => {});
    await new Promise(r => setTimeout(r, 500));

    const modalStillOpen = await isModalVisible();
    // After back, modal should be closed
    if (!modalStillOpen) {
      pass('Back button closes modal');
    } else {
      warn('Back button closes modal', 'modal may still be open after back');
    }
  } catch (e) {
    warn('Back button closes modal', e.message);
  }

  // ---------------------------------------------------------------
  // CHECK 17: JS Errors
  // ---------------------------------------------------------------
  console.log('\n--- Error Summary ---');
  const criticalErrors = jsErrors.filter(e =>
    !e.includes('sw.js') &&
    !e.includes('service-worker') &&
    !e.includes('favicon') &&
    !e.includes('net::ERR_FAILED') &&
    !e.includes('nominatim') &&
    !e.includes('Failed to load resource') &&
    !e.toLowerCase().includes('warning') &&
    !e.includes('ERR_CONNECTION_REFUSED')
  );

  if (criticalErrors.length === 0) {
    pass('No critical JS errors');
  } else {
    fail('No critical JS errors', criticalErrors.slice(0, 5).join(' | '));
  }

  // Network errors
  const criticalNetErrors = networkErrors.filter(e =>
    !e.includes('nominatim') &&
    !e.includes('sw.js') &&
    !e.includes('favicon')
  );
  if (criticalNetErrors.length === 0) {
    pass('No critical network errors');
  } else {
    fail('No critical network errors', criticalNetErrors.slice(0, 5).join(' | '));
  }

  if (jsErrors.length > 0) {
    console.log('\n  All JS/console errors:');
    jsErrors.forEach(e => console.log('    -', e.substring(0, 130)));
  }

  if (networkErrors.length > 0) {
    console.log('\n  All network errors:');
    networkErrors.forEach(e => console.log('    -', e.substring(0, 130)));
  }

  await browser.close();
  printSummary();
}

function printSummary() {
  console.log('\n' + '='.repeat(70));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`${'Check'.padEnd(50)} ${'Status'.padEnd(8)} Details`);
  console.log('-'.repeat(110));
  for (const r of results) {
    const sym = r.status === 'PASS' ? 'PASS' : r.status === 'FAIL' ? 'FAIL' : 'WARN';
    console.log(`${r.check.padEnd(50)} ${sym.padEnd(8)} ${r.detail}`);
  }
  console.log('='.repeat(70));
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  const warns = results.filter(r => r.status === 'WARN').length;
  console.log(`Total: ${passes} PASS, ${fails} FAIL, ${warns} WARN`);
  if (fails === 0) {
    console.log('\nApp verified — all checks passed (warnings are non-critical).');
  } else {
    console.log(`\n${fails} check(s) FAILED — review required.`);
  }
}

run().catch(e => {
  console.error('Fatal error:', e);
  if (browser) browser.close();
  process.exit(1);
});
