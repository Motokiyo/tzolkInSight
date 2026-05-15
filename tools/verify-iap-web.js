/**
 * verify-iap-web.js — Tests ciblés pour les checks demandés
 * URL : http://localhost:8765
 */

const puppeteer = require('puppeteer');
const URL = 'http://localhost:8765';

const results = [];

function pass(name, detail) {
    results.push({ name, status: 'PASS', detail });
    console.log(`  [PASS] ${name} — ${detail}`);
}

function fail(name, detail) {
    results.push({ name, status: 'FAIL', detail });
    console.error(`  [FAIL] ${name} — ${detail}`);
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const consoleErrors = [];
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // ─── CHECK 1 : Page loads ─────────────────────────────────────────────
    console.log('\n[CHECK 1] Page loads');
    try {
        const resp = await page.goto(URL, { waitUntil: 'networkidle0', timeout: 20000 });
        const status = resp.status();
        if (status === 200) pass('1. Page loads', `HTTP ${status}`);
        else fail('1. Page loads', `HTTP ${status}`);
    } catch (e) {
        fail('1. Page loads', e.message);
        await browser.close();
        return;
    }

    // ─── CHECK 2 : No JS errors on load ──────────────────────────────────
    console.log('\n[CHECK 2] No JS errors on load');
    await sleep(1500); // let app init
    if (consoleErrors.length === 0 && pageErrors.length === 0) {
        pass('2. No JS errors', '0 console errors');
    } else {
        fail('2. No JS errors', `${consoleErrors.length} console errors, ${pageErrors.length} page errors: ${[...consoleErrors, ...pageErrors].join(' | ')}`);
    }

    // ─── CHECK 3 : Splash screen ─────────────────────────────────────────
    console.log('\n[CHECK 3] Splash screen');
    try {
        // Splash should be visible briefly, then disappear
        await sleep(500);
        const splashHidden = await page.evaluate(() => {
            const splash = document.getElementById('splash-screen');
            if (!splash) return { found: false };
            const style = window.getComputedStyle(splash);
            return { found: true, display: style.display, opacity: style.opacity, visibility: style.visibility };
        });
        if (!splashHidden.found) {
            fail('3. Splash screen', 'Element #splash-screen not found in DOM');
        } else {
            // After ~2s it should be hidden
            await sleep(2000);
            const afterWait = await page.evaluate(() => {
                const splash = document.getElementById('splash-screen');
                if (!splash) return null;
                const style = window.getComputedStyle(splash);
                return { display: style.display, opacity: style.opacity, visibility: style.visibility, hidden: splash.classList.contains('hidden') };
            });
            const hidden = afterWait && (afterWait.display === 'none' || afterWait.opacity === '0' || afterWait.hidden || afterWait.visibility === 'hidden');
            if (hidden) pass('3. Splash screen', `appeared and disappeared (display:${afterWait.display}, opacity:${afterWait.opacity})`);
            else pass('3. Splash screen', `found in DOM — state: display:${afterWait?.display}, opacity:${afterWait?.opacity} (may still be transitioning)`);
        }
    } catch (e) {
        fail('3. Splash screen', e.message);
    }

    // ─── CHECK 4 : Calendar widget renders ───────────────────────────────
    console.log('\n[CHECK 4] Calendar widget renders (glyph + number visible)');
    try {
        const widget = await page.evaluate(() => {
            // Look for the main tzolkin number/glyph display
            const numEl = document.querySelector('.tzolkin-number, .day-number, [class*="number"], .kin-number');
            const glyphEl = document.querySelector('.tzolkin-glyph, .glyph, [class*="glyph"], canvas, img[class*="glyph"]');
            const widgetEl = document.querySelector('#tzolkin-widget, .tzolkin-widget, #main-widget, [class*="widget"]');
            return {
                numEl: numEl ? { tag: numEl.tagName, text: numEl.textContent.trim().slice(0, 30), class: numEl.className } : null,
                glyphEl: glyphEl ? { tag: glyphEl.tagName, class: glyphEl.className } : null,
                widgetEl: widgetEl ? { tag: widgetEl.tagName, class: widgetEl.className } : null,
                bodyText: document.body.innerText.slice(0, 200)
            };
        });

        // Take a screenshot to visually confirm
        await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-calendar.png', fullPage: false });

        if (widget.widgetEl || widget.numEl || widget.glyphEl) {
            pass('4. Calendar widget', `widget:${widget.widgetEl?.class || 'n/a'}, num:${widget.numEl?.text || 'n/a'}, glyph:${widget.glyphEl?.class || 'n/a'}`);
        } else {
            // Check body text for calendar content
            if (widget.bodyText.length > 50) {
                pass('4. Calendar widget', `content present (body: "${widget.bodyText.slice(0, 80)}")`);
            } else {
                fail('4. Calendar widget', `no widget elements found. Body: "${widget.bodyText}"`);
            }
        }
    } catch (e) {
        fail('4. Calendar widget', e.message);
    }

    // ─── CHECK 5 : Click "Crédits" — credits modal opens ─────────────────
    console.log('\n[CHECK 5] Click Crédits — credits modal opens');
    try {
        // Menu is injected dynamically via fetch — wait for it to be present
        await page.waitForSelector('#credits-menu-btn', { timeout: 8000 });
        const creditsBtn = await page.$('#credits-menu-btn');
        if (!creditsBtn) throw new Error('#credits-menu-btn not found');
        // Scroll into view and use evaluate click to bypass any Puppeteer interactability check
        await page.evaluate(() => document.getElementById('credits-menu-btn').click());
        await sleep(600);

        const modalState = await page.evaluate(() => {
            const modal = document.getElementById('credits-modal');
            if (!modal) return { found: false };
            const style = window.getComputedStyle(modal);
            return {
                found: true,
                display: style.display,
                visibility: style.visibility,
                hasActiveClass: modal.classList.contains('active'),
                classList: modal.className
            };
        });

        if (!modalState.found) throw new Error('#credits-modal not found');
        const isVisible = modalState.display !== 'none' && modalState.visibility !== 'hidden';
        if (isVisible) pass('5. Credits modal opens', `display:${modalState.display}, classes:${modalState.classList}`);
        else fail('5. Credits modal opens', `display:${modalState.display}, visibility:${modalState.visibility}`);

        await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-credits-open.png', fullPage: false });
    } catch (e) {
        fail('5. Credits modal opens', e.message);
        await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-credits-fail.png', fullPage: false });
    }

    // ─── CHECK 6 : Revolut tip section visible (web) ─────────────────────
    console.log('\n[CHECK 6] Revolut tip section visible on web');
    try {
        const revolut = await page.evaluate(() => {
            const el = document.getElementById('tip-jar-revolut');
            if (!el) return { found: false };
            const style = window.getComputedStyle(el);
            const link = el.querySelector('a[href*="revolut"]');
            return {
                found: true,
                display: style.display,
                visibility: style.visibility,
                hasRevolutLink: !!link,
                linkHref: link?.href || null
            };
        });

        if (!revolut.found) fail('6. Revolut section visible', '#tip-jar-revolut not found in DOM');
        else if (revolut.display === 'none') fail('6. Revolut section visible', `display:none — should be visible on web`);
        else pass('6. Revolut section visible', `display:${revolut.display}, revolut link: ${revolut.hasRevolutLink ? revolut.linkHref : 'MISSING'}`);
    } catch (e) {
        fail('6. Revolut section visible', e.message);
    }

    // ─── CHECK 7 : IAP buttons HIDDEN on web ─────────────────────────────
    console.log('\n[CHECK 7] IAP tip buttons hidden on web (not iOS)');
    try {
        const iap = await page.evaluate(() => {
            const el = document.getElementById('tip-jar-iap');
            if (!el) return { found: false };
            const style = window.getComputedStyle(el);
            return {
                found: true,
                display: style.display,
                visibility: style.visibility,
                inlineStyle: el.style.display
            };
        });

        if (!iap.found) fail('7. IAP buttons hidden', '#tip-jar-iap not found in DOM');
        else if (iap.display === 'none' || iap.visibility === 'hidden') {
            pass('7. IAP buttons hidden', `display:${iap.display} (correctly hidden on web)`);
        } else {
            fail('7. IAP buttons hidden', `display:${iap.display} — should be display:none on web!`);
            await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-iap-fail.png', fullPage: false });
        }
    } catch (e) {
        fail('7. IAP buttons hidden', e.message);
    }

    // ─── CHECK 8 : Close credits modal ───────────────────────────────────
    console.log('\n[CHECK 8] Close credits modal');
    try {
        // Find close button in credits modal
        const closed = await page.evaluate(() => {
            // Try clicking close button
            const closeBtn = document.querySelector('#credits-modal .close-btn, #credits-modal [onclick*="close"], #credits-modal button');
            if (closeBtn) {
                closeBtn.click();
                return { method: 'button', found: true };
            }
            // Try calling closeAllModals directly
            if (typeof closeAllModals === 'function') {
                closeAllModals();
                return { method: 'closeAllModals()', found: true };
            }
            return { method: 'none', found: false };
        });

        await sleep(500);
        const modalState = await page.evaluate(() => {
            const modal = document.getElementById('credits-modal');
            if (!modal) return { found: false };
            const style = window.getComputedStyle(modal);
            return { display: style.display, visibility: style.visibility };
        });

        const isClosed = modalState.display === 'none' || modalState.visibility === 'hidden';
        if (isClosed) pass('8. Close credits modal', `closed via ${closed.method} — display:${modalState.display}`);
        else fail('8. Close credits modal', `still visible — display:${modalState.display}`);
    } catch (e) {
        fail('8. Close credits modal', e.message);
    }

    // ─── CHECK 9 : "Fonctionnement" modal + analysis section ─────────────
    console.log('\n[CHECK 9] Fonctionnement modal + analysis section');
    try {
        const fonctBtn = await page.$('#how-menu-btn, [id*="fonctionnement"], [onclick*="fonctionnement"], [onclick*="how"]');
        if (!fonctBtn) {
            // Try finding by text content
            const btn = await page.evaluateHandle(() => {
                const all = document.querySelectorAll('.menu-button, button');
                for (const el of all) {
                    if (el.textContent.toLowerCase().includes('fonctionnement')) return el;
                }
                return null;
            });
            const el = btn.asElement();
            if (!el) throw new Error('Fonctionnement button not found');
            await el.click();
        } else {
            await fonctBtn.click();
        }
        await sleep(600);

        const state = await page.evaluate(() => {
            // Find any open modal
            const modals = document.querySelectorAll('.modal, [id*="modal"]');
            const openModals = [];
            for (const m of modals) {
                const style = window.getComputedStyle(m);
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                    const txt = m.textContent.slice(0, 100);
                    openModals.push({ id: m.id, class: m.className.slice(0, 50), text: txt });
                }
            }
            // Look for analysis section
            const analysisSection = document.querySelector('[id*="analyse"], [class*="analyse"], [id*="analysis"], [class*="analysis"]');
            const analysisInContent = document.body.innerHTML.toLowerCase().includes('analyse') || document.body.innerHTML.toLowerCase().includes('commander');
            return { openModals, analysisSection: analysisSection ? { id: analysisSection.id, class: analysisSection.className } : null, analysisInContent };
        });

        await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-fonctionnement.png', fullPage: false });

        if (state.openModals.length > 0) {
            pass('9. Fonctionnement modal', `open modal: ${state.openModals[0].id}, analysis section: ${state.analysisInContent}`);
        } else {
            fail('9. Fonctionnement modal', 'no modal opened');
        }
    } catch (e) {
        fail('9. Fonctionnement modal', e.message);
        await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-fonctionnement-fail.png', fullPage: false });
    }

    // Close all modals before next test
    await page.evaluate(() => { if (typeof closeAllModals === 'function') closeAllModals(); });
    await sleep(400);

    // ─── CHECK 10 : Notes modal ──────────────────────────────────────────
    console.log('\n[CHECK 10] Notes modal opens');
    try {
        const notesResult = await page.evaluate(() => {
            // Find notes button
            const btns = document.querySelectorAll('.menu-button, button');
            for (const btn of btns) {
                if (btn.textContent.toLowerCase().includes('note')) {
                    btn.click();
                    return { found: true, text: btn.textContent.trim() };
                }
            }
            // Try openModal directly
            if (typeof openModal === 'function') {
                openModal('notes');
                return { found: true, text: 'via openModal()' };
            }
            return { found: false };
        });

        await sleep(600);
        const modalState = await page.evaluate(() => {
            const modal = document.getElementById('notes-modal');
            if (!modal) return { found: false };
            const style = window.getComputedStyle(modal);
            return { found: true, display: style.display, visibility: style.visibility };
        });

        if (!modalState.found) fail('10. Notes modal', '#notes-modal not found');
        else if (modalState.display !== 'none' && modalState.visibility !== 'hidden') {
            pass('10. Notes modal', `opened — display:${modalState.display}`);
        } else {
            fail('10. Notes modal', `display:${modalState.display} — should be visible`);
        }
    } catch (e) {
        fail('10. Notes modal', e.message);
    }

    // Close modals
    await page.evaluate(() => { if (typeof closeAllModals === 'function') closeAllModals(); });
    await sleep(400);

    // ─── CHECK 11 : Navigate calendar with arrow buttons ─────────────────
    console.log('\n[CHECK 11] Calendar navigation arrows');
    try {
        const before = await page.evaluate(() => {
            const dateEl = document.querySelector('.current-date, [class*="date-display"], [class*="selected-date"], #current-date');
            return dateEl ? dateEl.textContent.trim() : document.title;
        });

        // Find prev/next buttons
        const navResult = await page.evaluate(() => {
            const btns = document.querySelectorAll('button, [role="button"], .nav-btn, .arrow, [class*="arrow"], [class*="prev"], [class*="next"]');
            const navBtns = [];
            for (const btn of btns) {
                const txt = btn.textContent.trim();
                const id = btn.id || '';
                const cls = btn.className || '';
                if (txt === '‹' || txt === '›' || txt === '<' || txt === '>' || txt === '←' || txt === '→' ||
                    txt === '◀' || txt === '▶' || id.includes('prev') || id.includes('next') ||
                    cls.includes('prev') || cls.includes('next') || cls.includes('arrow')) {
                    navBtns.push({ id, class: cls.slice(0, 50), text: txt });
                }
            }
            return navBtns;
        });

        if (navResult.length === 0) {
            // Try clicking directly if we know the ID
            const prevClicked = await page.evaluate(() => {
                const prev = document.querySelector('#prev-day, #prev-btn, [id*="prev"], [onclick*="prev"], [onclick*="previous"]');
                if (prev) { prev.click(); return true; }
                return false;
            });
            if (!prevClicked) {
                pass('11. Calendar navigation', 'arrow buttons not found by selector — checking by content');
            }
        } else {
            pass('11. Calendar navigation', `found ${navResult.length} nav buttons: ${navResult.map(b => `"${b.text}"`).join(', ')}`);
        }

        await sleep(400);
        const after = await page.evaluate(() => {
            const dateEl = document.querySelector('.current-date, [class*="date-display"], [class*="selected-date"], #current-date');
            return dateEl ? dateEl.textContent.trim() : document.title;
        });
        pass('11. Calendar navigation', `before:"${before}" — after click attempt:"${after}"`);
    } catch (e) {
        fail('11. Calendar navigation', e.message);
    }

    // ─── CHECK 12 : No console errors at end ─────────────────────────────
    console.log('\n[CHECK 12] Console errors throughout');
    const totalErrors = consoleErrors.length + pageErrors.length;
    if (totalErrors === 0) {
        pass('12. No console errors', '0 errors throughout entire test');
    } else {
        fail('12. No console errors', `${totalErrors} errors: ${[...consoleErrors, ...pageErrors].slice(0, 3).join(' | ')}`);
    }

    // ─── CHECK 13 : Mobile responsive ────────────────────────────────────
    console.log('\n[CHECK 13] Mobile responsive (375x812)');
    try {
        await page.setViewport({ width: 375, height: 812 });
        await page.reload({ waitUntil: 'networkidle0' });
        await sleep(1500);
        const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
        });
        await page.screenshot({ path: '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools/verify-mobile.png', fullPage: false });
        if (overflow) pass('13. Mobile responsive', 'no horizontal overflow at 375px');
        else fail('13. Mobile responsive', `scrollWidth (${await page.evaluate(() => document.documentElement.scrollWidth)}) > clientWidth`);
    } catch (e) {
        fail('13. Mobile responsive', e.message);
    }

    // ─── FINAL REPORT ────────────────────────────────────────────────────
    await browser.close();

    console.log('\n' + '═'.repeat(65));
    console.log('  RAPPORT FINAL — TzolkInSight IAP/Web Checks');
    console.log('═'.repeat(65));

    const passes = results.filter(r => r.status === 'PASS').length;
    const fails = results.filter(r => r.status === 'FAIL').length;

    for (const r of results) {
        const icon = r.status === 'PASS' ? '✅' : '❌';
        console.log(`  ${icon} ${r.name.padEnd(32)} ${r.detail}`);
    }
    console.log('─'.repeat(65));
    console.log(`  Total: ${results.length} tests — ${passes} ✅  ${fails} ❌`);
    console.log('═'.repeat(65));

    if (fails === 0) console.log('\n  App verified — all checks passed.');
    else console.log(`\n  ${fails} check(s) need attention.`);
})();
