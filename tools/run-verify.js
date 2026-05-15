const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const jsErrors = [];
  const consoleErrors = [];

  page.on('pageerror', err => jsErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const results = [];

  // ─── CHECK 1: Page loads ───────────────────────────────────────────────────
  try {
    const t0 = Date.now();
    const response = await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0', timeout: 30000 });
    const loadTime = Date.now() - t0;
    const status = response.status();
    results.push({ check: 'Page loads', pass: status < 400, details: `HTTP ${status}, ${loadTime}ms` });
  } catch (e) {
    results.push({ check: 'Page loads', pass: false, details: e.message });
  }

  // Wait a moment, then dismiss splash
  await sleep(2500);

  try {
    await page.evaluate(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.display = 'none';
        splash.style.opacity = '0';
        splash.style.pointerEvents = 'none';
      }
    });
    await sleep(500);
  } catch (e) {}

  // ─── CHECK 2: No JS errors ────────────────────────────────────────────────
  results.push({
    check: 'No JS errors at load',
    pass: jsErrors.length === 0,
    details: jsErrors.length === 0 ? 'Clean' : jsErrors.join(' | ').substring(0, 300)
  });

  results.push({
    check: 'No console errors at load',
    pass: consoleErrors.length === 0,
    details: consoleErrors.length === 0 ? 'Clean' : consoleErrors.join(' | ').substring(0, 400)
  });

  // Screenshot baseline
  await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-baseline.png' });

  // ─── CHECK 3: Main content visible ────────────────────────────────────────
  try {
    const result = await page.evaluate(() => {
      // Try various widget selectors
      const selectors = ['#tzolkin-widget', '.tzolkin-widget', '#widget-container', '.widget-container', '#app', 'main'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) return { found: sel, w: r.width, h: r.height };
        }
      }
      // Fallback: any SVG visible (glyphs)
      const svgs = document.querySelectorAll('svg, img[src*="svg"]');
      for (const svg of svgs) {
        const r = svg.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return { found: 'svg/glyph', w: r.width, h: r.height };
      }
      return null;
    });
    results.push({
      check: 'Main content visible',
      pass: result !== null,
      details: result ? `${result.found} (${result.w}x${result.h})` : 'No visible main content found'
    });
  } catch (e) {
    results.push({ check: 'Main content visible', pass: false, details: e.message });
  }

  // ─── CHECK 4: No broken images ────────────────────────────────────────────
  try {
    const brokenImages = await page.evaluate(() => {
      return Array.from(document.images)
        .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'))
        .map(img => img.src.split('/').slice(-2).join('/'));
    });
    results.push({
      check: 'No broken images',
      pass: brokenImages.length === 0,
      details: brokenImages.length === 0 ? 'All images OK' : `Broken (${brokenImages.length}): ${brokenImages.slice(0, 4).join(', ')}`
    });
  } catch (e) {
    results.push({ check: 'No broken images', pass: false, details: e.message });
  }

  // ─── CHECK 5: Menu buttons ─────────────────────────────────────────────────
  try {
    // Wait for dynamic menu injection
    await page.waitForFunction(() => {
      const btns = document.querySelectorAll('button');
      return btns.length >= 3;
    }, { timeout: 8000 });

    const allBtns = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button'))
        .map(b => b.textContent.trim().replace(/\s+/g, ' '))
        .filter(t => t.length > 0 && t.length < 40);
    });

    const hasCalendrier = allBtns.some(t => t.toLowerCase().includes('calendrier') || t.toLowerCase().includes('calendar'));
    const hasFonctionnement = allBtns.some(t => t.toLowerCase().includes('fonctionnement') || t.toLowerCase().includes('how'));
    const hasNotes = allBtns.some(t => t.toLowerCase().includes('notes') || t.toLowerCase().includes('note'));
    const hasCredits = allBtns.some(t => t.toLowerCase().includes('crédits') || t.toLowerCase().includes('credits') || t.toLowerCase().includes('crédit'));

    results.push({
      check: 'Menu buttons present',
      pass: allBtns.length >= 3,
      details: `${allBtns.length} buttons: ${allBtns.slice(0, 8).join(' | ')}`
    });
    results.push({ check: 'Menu: Calendrier button', pass: hasCalendrier, details: hasCalendrier ? 'Found' : 'Missing' });
    results.push({ check: 'Menu: Fonctionnement button', pass: hasFonctionnement, details: hasFonctionnement ? 'Found' : 'Missing' });
    results.push({ check: 'Menu: Notes button', pass: hasNotes, details: hasNotes ? 'Found' : 'Missing' });
    results.push({ check: 'Menu: Crédits button', pass: hasCredits, details: hasCredits ? 'Found' : 'Missing' });
  } catch (e) {
    results.push({ check: 'Menu buttons present', pass: false, details: e.message });
  }

  // ─── CHECK 6: Open Fonctionnement modal ────────────────────────────────────
  try {
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
        const t = b.textContent.toLowerCase();
        const oc = (b.getAttribute('onclick') || '').toLowerCase();
        return t.includes('fonctionnement') || oc.includes('fonctionnement');
      });
      if (btn) { btn.click(); return true; }
      return false;
    });

    if (clicked) {
      await sleep(1000);
      const modalState = await page.evaluate(() => {
        const modals = document.querySelectorAll('.modal, [class*="modal"], [id*="modal"]');
        for (const m of modals) {
          const id = m.id || '';
          const cls = m.className || '';
          if ((id + cls).toLowerCase().includes('fonctionnement')) {
            const s = window.getComputedStyle(m);
            const isVisible = s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0;
            return { found: true, id, visible: isVisible };
          }
        }
        // Check any visible modal
        for (const m of modals) {
          const s = window.getComputedStyle(m);
          if (s.display !== 'none' && s.visibility !== 'hidden') {
            return { found: true, id: m.id, visible: true, note: 'generic modal' };
          }
        }
        return { found: false };
      });
      results.push({ check: 'Open modal: fonctionnement', pass: modalState.found && modalState.visible, details: JSON.stringify(modalState) });
      await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-fonctionnement.png' });
      // Close
      const closeBtn = await page.$('.modal-close, [class*="close"], button[onclick*="close"]');
      if (closeBtn) await closeBtn.click();
      else await page.keyboard.press('Escape');
      await sleep(500);
    } else {
      results.push({ check: 'Open modal: fonctionnement', pass: false, details: 'Button not found' });
    }
  } catch (e) {
    results.push({ check: 'Open modal: fonctionnement', pass: false, details: e.message });
  }

  // ─── CHECK 7: Open Notes modal ─────────────────────────────────────────────
  let notesModalOpened = false;
  try {
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
        const t = b.textContent.trim().toLowerCase();
        const oc = (b.getAttribute('onclick') || '').toLowerCase();
        return (t === 'notes' || t.includes('notes')) && !oc.includes('admin');
      });
      if (btn) { btn.click(); return btn.textContent.trim(); }
      return false;
    });

    if (clicked) {
      await sleep(1000);
      const modalState = await page.evaluate(() => {
        const modals = document.querySelectorAll('.modal, [id*="modal"]');
        for (const m of modals) {
          if ((m.id || '').toLowerCase().includes('notes')) {
            const s = window.getComputedStyle(m);
            const visible = s.display !== 'none' && s.visibility !== 'hidden';
            const savedBtns = Array.from(m.querySelectorAll('button')).map(b => b.textContent.trim()).filter(t => t);
            return { found: true, visible, id: m.id, buttons: savedBtns };
          }
        }
        return { found: false };
      });
      notesModalOpened = modalState.found && modalState.visible;
      results.push({ check: 'Open modal: notes', pass: notesModalOpened, details: JSON.stringify(modalState) });

      if (notesModalOpened) {
        // Check for Enregistrés button
        const hasSaved = await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.some(b => {
            const t = b.textContent.toLowerCase();
            return t.includes('enregistrés') || t.includes('enregistres') || t.includes('saved') || t.includes('historique');
          });
        });
        results.push({ check: 'Notes: Enregistrés button', pass: hasSaved, details: hasSaved ? 'Button found' : 'Not found' });
        await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-notes.png' });
      }

      const closeBtn = await page.$('.modal-close, button[onclick*="close"], .close-btn');
      if (closeBtn) await closeBtn.click();
      else await page.keyboard.press('Escape');
      await sleep(500);
    } else {
      results.push({ check: 'Open modal: notes', pass: false, details: 'Notes button not found' });
    }
  } catch (e) {
    results.push({ check: 'Open modal: notes', pass: false, details: e.message });
  }

  // ─── CHECK 8: Open Crédits modal ───────────────────────────────────────────
  try {
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
        const t = b.textContent.toLowerCase();
        const oc = (b.getAttribute('onclick') || '').toLowerCase();
        return t.includes('crédit') || t.includes('credit') || oc.includes('credit');
      });
      if (btn) { btn.click(); return true; }
      return false;
    });

    if (clicked) {
      await sleep(1000);
      const modalState = await page.evaluate(() => {
        const modals = document.querySelectorAll('.modal, [id*="modal"]');
        for (const m of modals) {
          if ((m.id || '').toLowerCase().includes('credit')) {
            const s = window.getComputedStyle(m);
            return { found: true, id: m.id, visible: s.display !== 'none' };
          }
        }
        return { found: false };
      });
      results.push({ check: 'Open modal: credits', pass: modalState.found && modalState.visible, details: JSON.stringify(modalState) });
      await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-credits.png' });
      await page.keyboard.press('Escape');
      await sleep(500);
    } else {
      results.push({ check: 'Open modal: credits', pass: false, details: 'Crédits button not found' });
    }
  } catch (e) {
    results.push({ check: 'Open modal: credits', pass: false, details: e.message });
  }

  // ─── CHECK 9: Settings (Réglages) modal ───────────────────────────────────
  try {
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
        const t = b.textContent.toLowerCase();
        const oc = (b.getAttribute('onclick') || '').toLowerCase();
        return t.includes('réglages') || t.includes('reglages') || t.includes('settings') ||
               oc.includes('admin') || oc.includes('settings');
      });
      if (btn) { btn.click(); return btn.textContent.trim(); }
      return false;
    });

    if (clicked) {
      await sleep(1200);
      await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-settings.png' });

      const settingsCheck = await page.evaluate(() => {
        // Find admin/settings modal
        const modal = document.querySelector('#admin-modal') ||
                      document.querySelector('[id*="admin"]') ||
                      document.querySelector('[id*="settings"]') ||
                      document.querySelector('[id*="reglages"]');
        if (!modal) return { found: false, allModalIds: Array.from(document.querySelectorAll('.modal, [id*="modal"]')).map(m => m.id) };

        const s = window.getComputedStyle(modal);
        const visible = s.display !== 'none' && s.visibility !== 'hidden';

        // Contact form fields
        const inputs = Array.from(modal.querySelectorAll('input, textarea, select'));
        const inputNames = inputs.map(i => i.name || i.id || i.placeholder || i.type);

        // PIN buttons
        const allBtns = Array.from(modal.querySelectorAll('button')).map(b => b.textContent.trim()).filter(t => t);
        const hasCreatePin = allBtns.some(t => /créer|creer|create|nouveau/i.test(t));
        const hasChangePin = allBtns.some(t => /changer|change|modifier/i.test(t));
        const hasDisablePin = allBtns.some(t => /désactiver|desactiver|disable/i.test(t));

        // Empty contacts message
        const allText = modal.textContent;
        const hasEmptyMsg = /aucun contact|no contact|ajouter|hint|pas encore/i.test(allText);

        return { found: true, id: modal.id, visible, inputNames, allBtns, hasCreatePin, hasChangePin, hasDisablePin, hasEmptyMsg };
      });

      results.push({ check: 'Settings modal opens', pass: settingsCheck.found && settingsCheck.visible, details: `id=${settingsCheck.id}, visible=${settingsCheck.visible}` });
      results.push({ check: 'Settings: contact form fields', pass: (settingsCheck.inputNames || []).length > 0, details: `Inputs: ${(settingsCheck.inputNames || []).join(', ')}` });
      results.push({
        check: 'Settings: PIN = Créer only (no PIN set)',
        pass: settingsCheck.hasCreatePin === true && settingsCheck.hasChangePin === false,
        details: `Buttons: ${(settingsCheck.allBtns || []).join(' | ')} | hasCreate=${settingsCheck.hasCreatePin} hasChange=${settingsCheck.hasChangePin} hasDisable=${settingsCheck.hasDisablePin}`
      });
      results.push({ check: 'Settings: empty contacts hint', pass: settingsCheck.hasEmptyMsg === true, details: settingsCheck.hasEmptyMsg ? 'Empty state message present' : 'No empty state message' });

      await page.keyboard.press('Escape');
      await sleep(500);
    } else {
      results.push({ check: 'Settings modal opens', pass: false, details: 'Réglages button not found' });
    }
  } catch (e) {
    results.push({ check: 'Settings modal opens', pass: false, details: e.message });
  }

  // ─── CHECK 10: Date input on calendar widget click ─────────────────────────
  try {
    // Look for gregorian date display element
    const dateElInfo = await page.evaluate(() => {
      const candidates = [
        '#gregorian-date', '.gregorian-date', '#current-date', '.current-date',
        '[id*="date"]', '[class*="greg"]', '.date-display', '#date-display'
      ];
      for (const sel of candidates) {
        const el = document.querySelector(sel);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) return { sel, text: el.textContent.trim().substring(0, 30), x: r.x + r.width/2, y: r.y + r.height/2 };
        }
      }
      return null;
    });

    if (dateElInfo) {
      await page.mouse.click(dateElInfo.x, dateElInfo.y);
      await sleep(800);

      const inputAppeared = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="date"], .imask-input, [id*="date-input"]');
        for (const inp of inputs) {
          const s = window.getComputedStyle(inp);
          if (s.display !== 'none' && s.visibility !== 'hidden') return { found: true, id: inp.id, type: inp.type };
        }
        // Also check if any date container became visible
        const containers = document.querySelectorAll('[id*="date-input"], [class*="date-input"], .date-edit');
        for (const c of containers) {
          const s = window.getComputedStyle(c);
          if (s.display !== 'none') return { found: true, id: c.id, note: 'container' };
        }
        return { found: false };
      });

      results.push({
        check: 'Date input appears on gregorian date click',
        pass: inputAppeared.found,
        details: inputAppeared.found ? `Input appeared: ${JSON.stringify(inputAppeared)}` : `No input. Date el: ${dateElInfo.sel} "${dateElInfo.text}"`
      });
      await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-date-input.png' });
      await page.keyboard.press('Escape');
      await sleep(300);
    } else {
      results.push({ check: 'Date input appears on gregorian date click', pass: false, details: 'No date display element found' });
    }
  } catch (e) {
    results.push({ check: 'Date input appears on gregorian date click', pass: false, details: e.message });
  }

  // ─── CHECK 11: Responsive Mobile ──────────────────────────────────────────
  try {
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0', timeout: 20000 });
    await sleep(1500);
    await page.evaluate(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) splash.style.display = 'none';
    });
    await sleep(300);

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth
    }));

    results.push({
      check: 'Mobile 375x812: no horizontal overflow',
      pass: overflow.scrollWidth <= overflow.clientWidth,
      details: `scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`
    });
    await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-mobile.png' });
  } catch (e) {
    results.push({ check: 'Mobile 375x812: no horizontal overflow', pass: false, details: e.message });
  }

  // ─── CHECK 12: Desktop ────────────────────────────────────────────────────
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0', timeout: 20000 });
    await sleep(1500);
    await page.evaluate(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) splash.style.display = 'none';
    });
    await sleep(300);

    const bodySize = await page.evaluate(() => {
      const r = document.body.getBoundingClientRect();
      return { w: r.width, h: document.body.scrollHeight };
    });
    results.push({
      check: 'Desktop 1280x800: content displayed',
      pass: bodySize.w > 0 && bodySize.h > 100,
      details: `body ${bodySize.w}x${bodySize.h}`
    });
    await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-desktop.png' });
  } catch (e) {
    results.push({ check: 'Desktop 1280x800: content displayed', pass: false, details: e.message });
  }

  await browser.close();

  // ─── PRINT RESULTS ────────────────────────────────────────────────────────
  console.log('\n=== TZOLKINSIGHT VERIFICATION RESULTS ===\n');
  let allPass = true;
  for (const r of results) {
    const icon = r.pass ? 'PASS' : 'FAIL';
    if (!r.pass) allPass = false;
    console.log(`[${icon}] ${r.check}`);
    console.log(`       ${r.details}`);
  }
  console.log('\n' + '='.repeat(40));
  console.log(allPass ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED - see above');
  const failed = results.filter(r => !r.pass);
  if (failed.length > 0) {
    console.log(`\nFailed checks (${failed.length}):`);
    failed.forEach(r => console.log(`  - ${r.check}: ${r.details}`));
  }
})();
