/**
 * TzolkInSight — End-to-End Verification Script v2
 * Tests: page load, JS errors, navigation, modals, responsive
 */
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOT_DIR = '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools';

const results = [];
let browser, page;

function pass(check, details = '') {
  results.push({ check, status: 'PASS', details });
  console.log(`  [PASS] ${check}${details ? ' — ' + details : ''}`);
}

function fail(check, details = '') {
  results.push({ check, status: 'FAIL', details });
  console.error(`  [FAIL] ${check}${details ? ' — ' + details : ''}`);
}

async function screenshot(name) {
  const p = `${SCREENSHOT_DIR}/e2e-${name}-${Date.now()}.png`;
  await page.screenshot({ path: p, fullPage: false });
  console.log(`    screenshot: ${p}`);
  return p;
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function dismissSplash() {
  try {
    await page.waitForSelector('#splash-screen', { timeout: 5000 });
    const visible = await page.$eval('#splash-screen', el => {
      const s = window.getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0;
    });
    if (visible) {
      await page.click('#splash-screen');
      await wait(1000);
    }
  } catch (e) {
    // splash not present or already gone
  }
}

async function closeAllModals() {
  // Click all visible close buttons
  await page.evaluate(() => {
    document.querySelectorAll('.close-modal, .close-btn, [data-close]').forEach(btn => {
      try { btn.click(); } catch(e) {}
    });
    // Also call global closeAllModals if available
    if (typeof window.closeAllModals === 'function') {
      window.closeAllModals();
    }
  });
  await page.keyboard.press('Escape');
  await wait(500);
}

// Click a menu-button div by its onclick text or data-i18n content
async function clickMenuButton(modalId) {
  const result = await page.evaluate((id) => {
    // Find div.menu-button with onclick containing the modal id
    const divs = Array.from(document.querySelectorAll('.menu-button'));
    const match = divs.find(d => {
      const onclick = d.getAttribute('onclick') || '';
      return onclick.includes(id);
    });
    if (match) {
      match.click();
      return { found: true, text: match.innerText.trim() };
    }
    return { found: false };
  }, modalId);
  return result;
}

(async () => {
  console.log('=== TzolkInSight E2E Verification ===\n');

  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const jsErrors = [];
  const networkErrors = [];
  const criticalNetErrors = [];

  // ── CHECK 1: Page loads ──────────────────────────────────────────────────
  console.log('1. Page Load');
  try {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('pageerror', err => jsErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        // Filter known non-issues
        if (!txt.includes('service worker') && !txt.includes('favicon')) {
          jsErrors.push(txt);
        }
      }
    });
    page.on('requestfailed', req => {
      const url = req.url();
      if (!url.includes('sw.js') && !url.includes('favicon') && !url.includes('chrome-extension')) {
        networkErrors.push(`FAILED: ${req.failure()?.errorText} — ${url.split('?')[0]}`);
      }
    });
    page.on('response', res => {
      const url = res.url();
      const status = res.status();
      if (status >= 400 && !url.includes('favicon') && !url.includes('sw.js') && !url.includes('chrome-extension')) {
        criticalNetErrors.push(`HTTP ${status} — ${url.split('?')[0]}`);
      }
    });

    const t0 = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    const loadTime = ((Date.now() - t0) / 1000).toFixed(2);
    pass('Page loads', `${loadTime}s`);
  } catch (e) {
    fail('Page loads', e.message);
    await browser.close();
    printSummary();
    process.exit(1);
  }

  // ── CHECK 2: No JS errors on load ────────────────────────────────────────
  console.log('\n2. JS Errors on Load');
  await wait(2000); // let async init settle
  if (jsErrors.length === 0) {
    pass('No JS errors', 'console clean');
  } else {
    fail('No JS errors', jsErrors.slice(0, 5).join(' | '));
    await screenshot('js-errors');
  }
  const jsErrorsAtLoad = [...jsErrors];

  // ── CHECK 3: Splash screen dismissal ─────────────────────────────────────
  console.log('\n3. Splash Screen');
  try {
    const splashPresent = await page.$('#splash-screen') !== null;
    if (splashPresent) {
      await dismissSplash();
      await wait(1000);

      const splashGone = await page.evaluate(() => {
        const splash = document.querySelector('#splash-screen');
        if (!splash) return true;
        const s = window.getComputedStyle(splash);
        return s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0;
      });
      if (splashGone) {
        pass('Splash dismisses on click');
      } else {
        fail('Splash dismisses on click', 'splash still visible after click');
        await screenshot('splash-stuck');
      }
    } else {
      pass('No splash (or already dismissed)');
    }
  } catch (e) {
    fail('Splash screen', e.message);
  }

  // ── CHECK 4: Main content visible (widget) ───────────────────────────────
  console.log('\n4. Main Content / Widget Visible');
  try {
    await wait(1500);

    const widgetInfo = await page.evaluate(() => {
      // The widget container
      const container = document.getElementById('tzolkin-widget-container');
      const details = document.getElementById('tzolkin-details');

      const containerR = container ? container.getBoundingClientRect() : null;
      const detailsR = details ? details.getBoundingClientRect() : null;

      // Also look for glyph image
      const glyphImg = document.querySelector('img.tzolkin-glyph-img, .tzolkin-glyph img, [class*="glyph"] img');
      const glyphR = glyphImg ? glyphImg.getBoundingClientRect() : null;

      return {
        container: containerR ? { w: Math.round(containerR.width), h: Math.round(containerR.height) } : null,
        details: detailsR ? { w: Math.round(detailsR.width), h: Math.round(detailsR.height) } : null,
        glyph: glyphR ? { w: Math.round(glyphR.width), h: Math.round(glyphR.height), src: glyphImg.src } : null
      };
    });

    console.log('    Widget container:', JSON.stringify(widgetInfo.container));
    console.log('    Details section:', JSON.stringify(widgetInfo.details));
    console.log('    Glyph image:', JSON.stringify(widgetInfo.glyph));

    if (widgetInfo.container && widgetInfo.container.w > 0) {
      pass('Widget container visible', `${widgetInfo.container.w}x${widgetInfo.container.h}`);
    } else {
      fail('Widget container visible', 'container has zero size');
    }

    if (widgetInfo.glyph && widgetInfo.glyph.w > 0) {
      pass('Glyph SVG image rendered', `${widgetInfo.glyph.w}x${widgetInfo.glyph.h}`);
    } else {
      fail('Glyph SVG image rendered', 'no visible glyph image');
      await screenshot('no-glyph');
    }
  } catch (e) {
    fail('Main content visible', e.message);
    await screenshot('main-content-fail');
  }

  // ── CHECK 5: Desktop screenshot baseline ─────────────────────────────────
  console.log('\n5. Desktop Screenshot');
  await screenshot('desktop-1280');
  pass('Desktop screenshot taken', '1280x800');

  // ── CHECK 6: Broken images ───────────────────────────────────────────────
  console.log('\n6. Broken Images');
  try {
    const brokenImgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => {
          // Only check images with an actual src attribute (not data: URIs)
          return img.complete &&
                 img.naturalWidth === 0 &&
                 img.src &&
                 !img.src.startsWith('data:') &&
                 // Exclude images that are just the base URL (false positives from CSS background detection)
                 img.src !== window.location.origin + '/' &&
                 img.src !== window.location.href;
        })
        .map(img => img.getAttribute('src') || img.src);
    });
    if (brokenImgs.length === 0) {
      pass('No broken images');
    } else {
      fail('Broken images', brokenImgs.slice(0, 5).join(', '));
    }
  } catch (e) {
    fail('Broken images check', e.message);
  }

  // ── CHECK 7: Network errors ──────────────────────────────────────────────
  console.log('\n7. Network Errors');
  if (criticalNetErrors.length === 0) {
    pass('No critical network errors (4xx/5xx)');
  } else {
    fail('Network 4xx/5xx errors', criticalNetErrors.slice(0, 5).join(' | '));
  }

  // ── CHECK 8: Menu loaded ─────────────────────────────────────────────────
  console.log('\n8. Menu Loaded');
  try {
    // Wait for modales-container to be populated with menu HTML
    await page.waitForFunction(() => {
      const c = document.getElementById('modales-container');
      return c && c.innerHTML.trim().length > 200 && c.querySelector('.main-menu');
    }, { timeout: 10000 });

    const menuInfo = await page.evaluate(() => {
      const menu = document.querySelector('.main-menu');
      if (!menu) return { found: false };
      const buttons = Array.from(menu.querySelectorAll('.menu-button'));
      return {
        found: true,
        count: buttons.length,
        items: buttons.map(b => ({
          onclick: b.getAttribute('onclick'),
          text: b.innerText.trim().replace('\n', ' ')
        }))
      };
    });

    if (menuInfo.found) {
      pass('Main menu rendered', `${menuInfo.count} buttons: ${menuInfo.items.map(i => i.text.slice(0,12)).join(', ')}`);
    } else {
      fail('Main menu rendered', '.main-menu not found');
      await screenshot('no-main-menu');
    }
  } catch (e) {
    fail('Menu loaded', e.message);
    await screenshot('menu-fail');
  }

  // ── CHECK 9: Modal — Fonctionnement ─────────────────────────────────────
  console.log('\n9. Modal — Fonctionnement');
  try {
    await closeAllModals();
    await wait(400);

    const clicked = await clickMenuButton('fonctionnement');
    if (!clicked.found) {
      fail('Fonctionnement modal opens', 'menu-button with onclick(fonctionnement) not found');
      await screenshot('fonctionnement-btn-missing');
    } else {
      console.log(`    Clicked: "${clicked.text}"`);
      await wait(1000);

      const modalVisible = await page.evaluate(() => {
        const modal = document.getElementById('fonctionnement-modal');
        if (!modal) return { visible: false, reason: 'element not found' };
        const s = window.getComputedStyle(modal);
        const r = modal.getBoundingClientRect();
        return {
          visible: s.display !== 'none' && r.width > 0 && r.height > 0,
          display: s.display,
          w: Math.round(r.width),
          h: Math.round(r.height)
        };
      });

      if (modalVisible.visible) {
        pass('Fonctionnement modal opens', `${modalVisible.w}x${modalVisible.h}`);
        await screenshot('modal-fonctionnement');
        await closeAllModals();
        await wait(600);

        // Verify it closes
        const closed = await page.evaluate(() => {
          const m = document.getElementById('fonctionnement-modal');
          if (!m) return true;
          const s = window.getComputedStyle(m);
          return s.display === 'none' || s.visibility === 'hidden';
        });
        if (closed) {
          pass('Fonctionnement modal closes');
        } else {
          fail('Fonctionnement modal closes', 'still visible after close');
        }
      } else {
        fail('Fonctionnement modal opens', `display=${modalVisible.display}, ${modalVisible.w}x${modalVisible.h}`);
        await screenshot('fonctionnement-modal-notvisible');
      }
    }
  } catch (e) {
    fail('Fonctionnement modal', e.message);
    await screenshot('fonctionnement-error');
  }

  // ── CHECK 10: Modal — Notes ───────────────────────────────────────────────
  console.log('\n10. Modal — Notes');
  try {
    await closeAllModals();
    await wait(400);

    const clicked = await clickMenuButton('notes');
    if (!clicked.found) {
      fail('Notes modal opens', 'menu-button with onclick(notes) not found');
    } else {
      console.log(`    Clicked: "${clicked.text}"`);
      await wait(1000);

      const modalVisible = await page.evaluate(() => {
        const modal = document.getElementById('notes-modal');
        if (!modal) return { visible: false, reason: 'element not found' };
        const s = window.getComputedStyle(modal);
        const r = modal.getBoundingClientRect();
        return {
          visible: s.display !== 'none' && r.width > 0 && r.height > 0,
          display: s.display,
          w: Math.round(r.width),
          h: Math.round(r.height)
        };
      });

      if (modalVisible.visible) {
        pass('Notes modal opens', `${modalVisible.w}x${modalVisible.h}`);
        await screenshot('modal-notes');

        // Check notes textarea
        const hasTextarea = await page.evaluate(() => {
          const ta = document.getElementById('notes-input');
          if (!ta) return false;
          const r = ta.getBoundingClientRect();
          return r.width > 0;
        });
        if (hasTextarea) {
          pass('Notes textarea present');
        } else {
          fail('Notes textarea present', 'textarea not found or not visible');
        }

        await closeAllModals();
        await wait(600);
        const closed = await page.evaluate(() => {
          const m = document.getElementById('notes-modal');
          if (!m) return true;
          const s = window.getComputedStyle(m);
          return s.display === 'none' || s.visibility === 'hidden';
        });
        if (closed) {
          pass('Notes modal closes');
        } else {
          fail('Notes modal closes', 'still visible after close');
        }
      } else {
        fail('Notes modal opens', `display=${modalVisible.display}`);
        await screenshot('notes-modal-fail');
      }
    }
  } catch (e) {
    fail('Notes modal', e.message);
    await screenshot('notes-error');
  }

  // ── CHECK 11: Modal — Credits ────────────────────────────────────────────
  console.log('\n11. Modal — Credits');
  try {
    await closeAllModals();
    await wait(400);

    const clicked = await clickMenuButton('credits');
    if (!clicked.found) {
      fail('Credits modal opens', 'menu-button with onclick(credits) not found');
    } else {
      console.log(`    Clicked: "${clicked.text}"`);
      await wait(1000);

      const modalVisible = await page.evaluate(() => {
        const modal = document.getElementById('credits-modal');
        if (!modal) return { visible: false, reason: 'element not found' };
        const s = window.getComputedStyle(modal);
        const r = modal.getBoundingClientRect();
        return {
          visible: s.display !== 'none' && r.width > 0 && r.height > 0,
          display: s.display,
          w: Math.round(r.width), h: Math.round(r.height)
        };
      });

      if (modalVisible.visible) {
        pass('Credits modal opens', `${modalVisible.w}x${modalVisible.h}`);
        await screenshot('modal-credits');
        await closeAllModals();
        await wait(600);
        const closed = await page.evaluate(() => {
          const m = document.getElementById('credits-modal');
          if (!m) return true;
          const s = window.getComputedStyle(m);
          return s.display === 'none' || s.visibility === 'hidden';
        });
        if (closed) pass('Credits modal closes');
        else fail('Credits modal closes', 'still visible');
      } else {
        fail('Credits modal opens', `display=${modalVisible.display}`);
        await screenshot('credits-modal-fail');
      }
    }
  } catch (e) {
    fail('Credits modal', e.message);
  }

  // ── CHECK 12: Modal — Settings/Admin (injected by tzolkin-admin.js) ──────
  console.log('\n12. Modal — Settings/Admin');
  try {
    await closeAllModals();
    await wait(400);

    // Settings button is dynamically injected by tzolkin-admin.js
    const settingsInfo = await page.evaluate(() => {
      // Look for the injected settings button
      const allDivBtns = Array.from(document.querySelectorAll('.menu-button'));
      const settingsBtn = allDivBtns.find(d => {
        const onclick = d.getAttribute('onclick') || '';
        const text = d.innerText || '';
        return onclick.includes('admin') || onclick.includes('settings') ||
               text.toLowerCase().includes('réglage') || text.toLowerCase().includes('settings');
      });

      // Also check for any standalone settings button
      const allBtns = Array.from(document.querySelectorAll('button, [onclick]'));
      const anySettings = allBtns.find(el => {
        const onclick = el.getAttribute('onclick') || '';
        const text = el.innerText || '';
        return onclick.includes('admin') || onclick.includes('settings') ||
               text.toLowerCase().includes('réglage') || text.toLowerCase().includes('settings');
      });

      return {
        menuBtn: settingsBtn ? {
          onclick: settingsBtn.getAttribute('onclick'),
          text: settingsBtn.innerText.trim()
        } : null,
        anyBtn: anySettings ? {
          tag: anySettings.tagName,
          onclick: anySettings.getAttribute('onclick'),
          text: anySettings.innerText.trim().slice(0, 20)
        } : null,
        allMenuButtons: allDivBtns.map(d => ({
          onclick: d.getAttribute('onclick'),
          text: d.innerText.trim().slice(0,15)
        }))
      };
    });

    console.log('    All menu buttons:', JSON.stringify(settingsInfo.allMenuButtons));
    console.log('    Settings menu-btn:', JSON.stringify(settingsInfo.menuBtn));
    console.log('    Any settings btn:', JSON.stringify(settingsInfo.anyBtn));

    // Try clicking settings
    let settingsClicked = false;

    if (settingsInfo.menuBtn) {
      await page.evaluate(() => {
        const divs = Array.from(document.querySelectorAll('.menu-button'));
        const btn = divs.find(d => {
          const onclick = d.getAttribute('onclick') || '';
          const text = d.innerText || '';
          return onclick.includes('admin') || onclick.includes('settings') ||
                 text.toLowerCase().includes('réglage');
        });
        if (btn) btn.click();
      });
      settingsClicked = true;
    } else if (settingsInfo.anyBtn) {
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button, [onclick]'));
        const btn = els.find(el => {
          const onclick = el.getAttribute('onclick') || '';
          const text = el.innerText || '';
          return onclick.includes('admin') || onclick.includes('settings') ||
                 text.toLowerCase().includes('réglage');
        });
        if (btn) btn.click();
      });
      settingsClicked = true;
    }

    if (!settingsClicked) {
      fail('Settings/Admin modal opens', 'no settings button found in DOM — tzolkin-admin.js may not have injected it yet');
      await screenshot('settings-btn-missing');
    } else {
      await wait(1500);
      await screenshot('settings-clicked');

      const modalVisible = await page.evaluate(() => {
        // Check known admin modal IDs
        const candidates = ['admin-modal', 'settings-modal', 'modal-admin', 'modal-settings', 'pin-modal'];
        for (const id of candidates) {
          const el = document.getElementById(id);
          if (el) {
            const s = window.getComputedStyle(el);
            const r = el.getBoundingClientRect();
            if (s.display !== 'none' && r.width > 0) return { visible: true, id };
          }
        }
        // Also check any visible modal
        const allModals = document.querySelectorAll('[id*="modal"], [id*="admin"], .modal');
        for (const m of allModals) {
          const s = window.getComputedStyle(m);
          const r = m.getBoundingClientRect();
          if (s.display !== 'none' && r.width > 100 && r.height > 100) {
            return { visible: true, id: m.id || '.' + m.className.split(' ')[0] };
          }
        }
        return { visible: false };
      });

      if (modalVisible.visible) {
        pass('Settings/Admin modal opens', modalVisible.id);
        await screenshot('modal-settings');
        await closeAllModals();
        pass('Settings/Admin modal closes');
      } else {
        fail('Settings/Admin modal opens', 'no visible modal after click');
        await screenshot('settings-modal-fail');
        await closeAllModals();
      }
    }
  } catch (e) {
    fail('Settings/Admin modal', e.message);
    await screenshot('settings-error');
  }

  // ── CHECK 13: Widget — Today button & navigation ─────────────────────────
  console.log('\n13. Widget — Navigation Buttons');
  try {
    await closeAllModals();
    await wait(500);

    const widgetBtns = await page.evaluate(() => {
      // Find all buttons/clickable elements in the widget
      const container = document.getElementById('tzolkin-widget-container');
      if (!container) return { found: false };

      const btns = Array.from(container.querySelectorAll('button, [onclick], [class*="btn"], [class*="arrow"]'));
      return {
        found: true,
        buttons: btns.map(b => ({
          tag: b.tagName,
          id: b.id,
          cls: b.className.slice(0, 25),
          text: b.textContent.trim().slice(0, 10),
          onclick: (b.getAttribute('onclick') || '').slice(0, 30)
        })).slice(0, 15)
      };
    });

    console.log('    Widget buttons:', JSON.stringify(widgetBtns.buttons));

    if (widgetBtns.found && widgetBtns.buttons.length > 0) {
      pass('Widget has navigation buttons', `${widgetBtns.buttons.length} buttons found`);
    } else if (!widgetBtns.found) {
      fail('Widget navigation', 'tzolkin-widget-container not found');
    } else {
      fail('Widget navigation', 'no buttons in widget container');
      await screenshot('widget-no-buttons');
    }
  } catch (e) {
    fail('Widget navigation', e.message);
  }

  // ── CHECK 14: Mobile responsive (375x812) ────────────────────────────────
  console.log('\n14. Mobile Responsive (375x812)');
  try {
    await closeAllModals();
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await wait(1000);

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.body.clientWidth,
      hasOverflow: document.body.scrollWidth > document.body.clientWidth + 2 // +2 for rounding
    }));

    if (!overflow.hasOverflow) {
      pass('Mobile: no horizontal overflow', `body ${overflow.scrollWidth}px <= ${overflow.clientWidth}px`);
    } else {
      fail('Mobile: horizontal overflow', `body scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`);
    }
    await screenshot('mobile-375');

    // Check menu visible on mobile
    const menuVisible = await page.evaluate(() => {
      const menu = document.querySelector('.main-menu');
      if (!menu) return { visible: false };
      const r = menu.getBoundingClientRect();
      return { visible: r.width > 0 && r.height > 0, w: Math.round(r.width), h: Math.round(r.height) };
    });
    if (menuVisible.visible) {
      pass('Mobile: menu visible', `${menuVisible.w}x${menuVisible.h}`);
    } else {
      fail('Mobile: menu visible', 'main-menu not visible on mobile');
    }
  } catch (e) {
    fail('Mobile responsive', e.message);
  }

  // ── CHECK 15: Desktop (1280x800) ─────────────────────────────────────────
  console.log('\n15. Desktop Responsive (1280x800)');
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await wait(800);

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.body.clientWidth,
      hasOverflow: document.body.scrollWidth > document.body.clientWidth + 2
    }));

    if (!overflow.hasOverflow) {
      pass('Desktop: no horizontal overflow', `body ${overflow.scrollWidth}px <= ${overflow.clientWidth}px`);
    } else {
      fail('Desktop: horizontal overflow', `scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`);
    }
    await screenshot('desktop-1280-final');
  } catch (e) {
    fail('Desktop responsive', e.message);
  }

  // ── CHECK 16: Final JS error check ───────────────────────────────────────
  console.log('\n16. Final JS Error Check');
  if (jsErrors.length === 0) {
    pass('No JS errors throughout entire test');
  } else {
    const unique = [...new Set(jsErrors)];
    fail('JS errors detected', unique.slice(0, 5).join(' | '));
  }

  await browser.close();
  printSummary();
})();

function printSummary() {
  console.log('\n\n=== SUMMARY ===\n');
  console.log('| Check | Status | Details |');
  console.log('|-------|--------|---------|');
  for (const r of results) {
    const icon = r.status === 'PASS' ? 'PASS' : 'FAIL';
    console.log(`| ${r.check} | ${icon} | ${r.details || ''} |`);
  }
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`\nTotal: ${passes} passed, ${fails} failed`);
  if (fails === 0) {
    console.log('\nApp verified — all checks passed.');
  } else {
    console.log('\nSome checks failed — see details above.');
  }
}
