// verify-speech.js — Vérification de la fonctionnalité dictée vocale
const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'http://localhost:8082';
const SCREENSHOT_DIR = '/Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tools';

const results = [];
const jsErrors = [];

function pass(check, detail) {
    results.push({ check, status: 'PASS', detail: detail || '' });
    console.log(`[PASS] ${check}${detail ? ' — ' + detail : ''}`);
}

function fail(check, detail) {
    results.push({ check, status: 'FAIL', detail: detail || '' });
    console.log(`[FAIL] ${check}${detail ? ' — ' + detail : ''}`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function screenshot(page, name) {
    const p = path.join(SCREENSHOT_DIR, `verify-speech-${name}-${Date.now()}.png`);
    await page.screenshot({ path: p, fullPage: false });
    console.log(`  -> screenshot: ${p}`);
    return p;
}

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });

    // Capture JS errors
    page.on('pageerror', err => {
        jsErrors.push(err.message);
        console.log(`  [JS ERROR] ${err.message}`);
    });
    page.on('console', msg => {
        if (msg.type() === 'error') {
            jsErrors.push(msg.text());
            console.log(`  [CONSOLE ERROR] ${msg.text()}`);
        }
    });
    const failedRequests = [];
    page.on('response', res => {
        const status = res.status();
        const url = res.url();
        if (status >= 400 && !url.includes('nominatim') && !url.includes('favicon')) {
            failedRequests.push(`${status} ${url}`);
        }
    });

    // ---- CHECK 1: Page load ----
    try {
        const t0 = Date.now();
        await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        pass('Page load', `${elapsed}s`);
    } catch (e) {
        fail('Page load', e.message);
        await screenshot(page, 'load-fail');
        await browser.close();
        printSummary();
        process.exit(1);
    }

    // ---- CHECK 2: Wait for menu injection ----
    try {
        await page.waitForSelector('#modales-container', { timeout: 8000 });
        await page.waitForFunction(() => {
            const mc = document.querySelector('#modales-container');
            return mc && mc.innerHTML.length > 100;
        }, { timeout: 10000 });
        pass('Menu container loaded');
    } catch (e) {
        fail('Menu container loaded', e.message);
        await screenshot(page, 'menu-fail');
    }
    await sleep(500);

    // ---- CHECK 3: No JS errors on load ----
    const errsBefore = jsErrors.length;
    if (jsErrors.length === 0) {
        pass('No JS errors on load');
    } else {
        fail('No JS errors on load', jsErrors.join(' | '));
        await screenshot(page, 'js-errors');
    }

    // ---- CHECK 4: Click Notes menu button (DIV.menu-button) ----
    try {
        const clicked = await page.evaluate(() => {
            const divs = Array.from(document.querySelectorAll('div.menu-button'));
            const notes = divs.find(d => d.textContent.trim() === 'Notes');
            if (notes) { notes.click(); return true; }
            return false;
        });
        await sleep(1500);
        if (clicked) {
            pass('Notes menu button clicked');
        } else {
            fail('Notes menu button clicked', 'DIV.menu-button[Notes] not found');
            await screenshot(page, 'notes-btn-fail');
        }
    } catch (e) {
        fail('Notes menu button clicked', e.message);
        await screenshot(page, 'notes-btn-fail');
    }

    // ---- CHECK 5: Notes modal is visible (#notes-modal.active) ----
    try {
        const notesVisible = await page.evaluate(() => {
            const modal = document.getElementById('notes-modal');
            if (!modal) return false;
            const style = window.getComputedStyle(modal);
            const rect = modal.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.height > 0;
        });
        if (notesVisible) {
            pass('Notes modal visible');
        } else {
            fail('Notes modal visible', '#notes-modal not visible');
            await screenshot(page, 'notes-modal-invisible');
        }
    } catch (e) {
        fail('Notes modal visible', e.message);
    }
    await screenshot(page, 'notes-modal-open');

    // ---- CHECK 6: Speech button present and visible in Notes ----
    try {
        const speechAvailable = await page.evaluate(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));
        console.log(`  -> Web Speech API available in headless: ${speechAvailable}`);

        const speechInfo = await page.evaluate(() => {
            const btn = document.getElementById('speech-btn');
            if (!btn) return { found: false };
            const style = window.getComputedStyle(btn);
            const rect = btn.getBoundingClientRect();
            return {
                found: true,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                inlineDisplay: btn.style.display,
                width: rect.width,
                height: rect.height,
                onclick: btn.getAttribute('onclick')
            };
        });
        console.log(`  -> #speech-btn: ${JSON.stringify(speechInfo)}`);

        if (!speechInfo.found) {
            fail('Speech button in DOM', '#speech-btn element not found — check tzolkin-menu-standalone.html');
        } else if (speechInfo.display === 'none' && !speechAvailable) {
            pass('Speech button hidden (API unavailable in headless)', 'expected — init() hides btn when API absent');
        } else if (speechInfo.display === 'none') {
            fail('Speech button visible', 'display:none even though SpeechRecognition available');
            await screenshot(page, 'speech-btn-hidden');
        } else if (speechInfo.width > 0 && speechInfo.height > 0) {
            pass('Speech button visible and sized', `${speechInfo.width}x${speechInfo.height}px, onclick="${speechInfo.onclick}"`);
            await screenshot(page, 'speech-btn-visible');
        } else {
            fail('Speech button has size', `display:${speechInfo.display} but ${speechInfo.width}x${speechInfo.height}px`);
            await screenshot(page, 'speech-btn-zero-size');
        }
    } catch (e) {
        fail('Speech button check', e.message);
    }

    // ---- CHECK 7: No new JS errors after Notes opened ----
    const errsAfterNotes = jsErrors.length;
    if (errsAfterNotes === errsBefore) {
        pass('No JS errors after opening Notes');
    } else {
        fail('No JS errors after opening Notes', jsErrors.slice(errsBefore).join(' | '));
    }

    // ---- CHECK 8: Close Notes, open Fonctionnement ----
    try {
        await page.evaluate(() => {
            const closeBtns = document.querySelectorAll('.close-modal, [onclick="closeAllModals()"]');
            if (closeBtns.length) closeBtns[0].click();
        });
        await sleep(600);
        const opened = await page.evaluate(() => {
            const divs = Array.from(document.querySelectorAll('div.menu-button'));
            const btn = divs.find(d => d.textContent.trim() === 'Fonctionnement');
            if (btn) { btn.click(); return true; }
            return false;
        });
        await sleep(1000);
        if (opened) {
            const visible = await page.evaluate(() => {
                const m = document.getElementById('fonctionnement-modal') || document.getElementById('modal-fonctionnement');
                if (m) {
                    const s = window.getComputedStyle(m);
                    return s.display !== 'none' && m.getBoundingClientRect().height > 0;
                }
                // Fallback: any active modal
                const active = document.querySelector('.modal.active');
                return !!active && active.getBoundingClientRect().height > 0;
            });
            if (visible) {
                pass('Fonctionnement modal opened and visible');
            } else {
                fail('Fonctionnement modal visible', 'Modal opened but not visible');
            }
        } else {
            fail('Fonctionnement modal opened', 'DIV.menu-button[Fonctionnement] not found');
        }
        await screenshot(page, 'fonctionnement');
    } catch (e) {
        fail('Fonctionnement modal', e.message);
        await screenshot(page, 'fonctionnement-fail');
    }

    // ---- CHECK 9: Credits modal ----
    try {
        await page.evaluate(() => {
            const closeBtns = document.querySelectorAll('.close-modal, [onclick="closeAllModals()"]');
            if (closeBtns.length) closeBtns[0].click();
        });
        await sleep(600);
        const opened = await page.evaluate(() => {
            const el = document.getElementById('credits-menu-btn');
            if (el) { el.click(); return true; }
            const divs = Array.from(document.querySelectorAll('div.menu-button'));
            const btn = divs.find(d => d.textContent.trim() === 'Crédits');
            if (btn) { btn.click(); return true; }
            return false;
        });
        await sleep(1000);
        if (opened) {
            const visible = await page.evaluate(() => {
                const active = document.querySelector('.modal.active');
                return !!active && active.getBoundingClientRect().height > 0;
            });
            if (visible) {
                pass('Credits modal opened and visible');
            } else {
                fail('Credits modal visible', 'Opened but not visible');
            }
        } else {
            fail('Credits modal opened', 'Button not found');
        }
        await screenshot(page, 'credits');
    } catch (e) {
        fail('Credits modal', e.message);
    }

    // ---- CHECK 10: Réglages modal ----
    try {
        await page.evaluate(() => {
            const closeBtns = document.querySelectorAll('.close-modal, [onclick="closeAllModals()"]');
            if (closeBtns.length) closeBtns[0].click();
        });
        await sleep(600);
        const opened = await page.evaluate(() => {
            const el = document.getElementById('admin-menu-btn');
            if (el) { el.click(); return true; }
            return false;
        });
        await sleep(1000);
        if (opened) {
            const visible = await page.evaluate(() => {
                const active = document.querySelector('.modal.active');
                return !!active && active.getBoundingClientRect().height > 0;
            });
            if (visible) {
                pass('Reglages modal opened and visible');
            } else {
                fail('Reglages modal visible', 'Opened but not visible');
            }
        } else {
            fail('Reglages modal opened', '#admin-menu-btn not found');
        }
        await screenshot(page, 'reglages');
    } catch (e) {
        fail('Reglages modal', e.message);
    }

    // ---- CHECK 11: Mobile no horizontal overflow ----
    try {
        await page.evaluate(() => {
            const closeBtns = document.querySelectorAll('.close-modal, [onclick="closeAllModals()"]');
            if (closeBtns.length) closeBtns[0].click();
        });
        await sleep(500);
        await page.setViewport({ width: 375, height: 812 });
        await sleep(300);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        if (!overflow) {
            pass('Mobile 375px — no horizontal overflow');
        } else {
            const dims = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
            fail('Mobile 375px — no horizontal overflow', `scrollWidth:${dims.scroll} > clientWidth:${dims.client}`);
            await screenshot(page, 'overflow-mobile');
        }
    } catch (e) {
        fail('Mobile no horizontal overflow', e.message);
    }

    // ---- CHECK 12: Desktop layout ----
    try {
        await page.setViewport({ width: 1280, height: 800 });
        await sleep(400);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        if (!overflow) {
            pass('Desktop 1280px — no horizontal overflow');
        } else {
            fail('Desktop 1280px — no horizontal overflow');
        }
        await screenshot(page, 'desktop');
    } catch (e) {
        fail('Desktop layout', e.message);
    }

    // ---- CHECK 13: No failed network requests ----
    const criticalFails = failedRequests.filter(u =>
        !u.includes('nominatim') && !u.includes('favicon') &&
        !u.includes('google-analytics') && !u.includes('analytics')
    );
    if (criticalFails.length === 0) {
        pass('No failed critical network requests');
    } else {
        fail('No failed critical network requests', criticalFails.slice(0, 5).join(' | '));
    }

    await browser.close();
    printSummary();
})();

function printSummary() {
    console.log('\n' + '='.repeat(65));
    console.log('VERIFICATION SUMMARY — TzolkInSight Speech Feature');
    console.log('='.repeat(65));
    let passes = 0, fails = 0;
    for (const r of results) {
        const icon = r.status === 'PASS' ? 'PASS' : 'FAIL';
        const line = `${r.check.padEnd(42)} ${icon}  ${r.detail}`;
        console.log(line);
        if (r.status === 'PASS') passes++; else fails++;
    }
    console.log('='.repeat(65));
    console.log(`Total: ${passes} PASS, ${fails} FAIL`);
    if (fails === 0) {
        console.log('App verified — all checks passed.');
    } else {
        console.log(`${fails} check(s) need attention.`);
    }
}
