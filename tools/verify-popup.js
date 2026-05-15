/**
 * TzolkInSight — verify-popup.js
 * Tests the "Commander Analyse" confirmation popup in fr / en / es
 * Usage: node tools/verify-popup.js
 */

'use strict';

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// ── result tracking ──────────────────────────────────────────────────────────
const LANGS = ['fr', 'en', 'es'];
const CHECK_NAMES = [
    'popup_visible',
    'title_translated',
    'list_items_3_nonempty',
    'checkbox_label_nonempty',
    'cancel_btn_nonempty',
    'ok_btn_nonempty',
    'ok_btn_disabled_before_check',
    'ok_btn_enabled_after_check',
    'cancel_closes_popup',
    'ok_closes_popup_no_jserror',
];

const results = {};
for (const l of LANGS) {
    results[l] = {};
    for (const c of CHECK_NAMES) results[l][c] = { ok: false, detail: '' };
}

function pass(lang, check, detail) {
    results[lang][check] = { ok: true, detail: detail || '' };
    console.log(`  [${lang}] ✅ ${check}${detail ? ' — ' + detail : ''}`);
}

function fail(lang, check, detail) {
    results[lang][check] = { ok: false, detail: detail || '' };
    console.log(`  [${lang}] ❌ ${check}${detail ? ' — ' + detail : ''}`);
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ── page setup ────────────────────────────────────────────────────────────────

/**
 * Load the main page, wait for the dynamic menu injection, then swap i18n strings.
 */
async function loadPage(page) {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });

    // Hide splash
    await page.evaluate(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) { splash.style.display = 'none'; splash.style.visibility = 'hidden'; }
        document.body.classList.remove('splash-active');
    });

    // Wait for the dynamic menu to be injected (#analyse-confirm-popup)
    try {
        await page.waitForSelector('#analyse-confirm-popup', { timeout: 10000 });
    } catch (e) {
        console.log('  [WARN] Timed out waiting for #analyse-confirm-popup — proceeding anyway');
    }

    // Wait for i18n to be ready
    await page.evaluate(() => {
        return new Promise((resolve) => {
            if (!window.i18n) { resolve(); return; }
            if (window.i18n.ready) { resolve(); return; }
            window.i18n.onReady(resolve);
        });
    });

    await sleep(500);
}

/**
 * Inject i18n strings for a given language.
 */
async function setLang(page, lang) {
    const jsonUrl = `${BASE_URL}/i18n/ui-${lang}.json`;
    await page.evaluate(async (url, targetLang) => {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Could not fetch ' + url);
        const data = await resp.json();
        window.i18n.strings = data;
        window.i18n.lang = targetLang;
        document.documentElement.lang = targetLang;
        if (typeof window.i18n.applyToDOM === 'function') {
            window.i18n.applyToDOM();
        }
    }, jsonUrl, lang);
    await sleep(300);
}

// ── test runner for one language ──────────────────────────────────────────────

async function testLang(browser, lang) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  LANGUE : ${lang.toUpperCase()}`);
    console.log('─'.repeat(60));

    const page = await browser.newPage();
    page.setDefaultTimeout(15000);

    const jsErrors = [];
    page.on('pageerror', err => {
        jsErrors.push(err.message);
        console.log(`  [JS ERROR] ${err.message}`);
    });

    try {
        // ── Load & inject lang ────────────────────────────────────────
        await loadPage(page);
        await setLang(page, lang);

        // ── Check that showAnalyseConfirm is available ────────────────
        const fnType = await page.evaluate(() => typeof showAnalyseConfirm);
        if (fnType !== 'function') {
            console.log(`  [WARN] showAnalyseConfirm typeof = "${fnType}", will try window.showAnalyseConfirm`);
        }

        // ── 1. Open popup ─────────────────────────────────────────────
        await page.evaluate(() => {
            if (typeof showAnalyseConfirm === 'function') showAnalyseConfirm();
            else if (typeof window.showAnalyseConfirm === 'function') window.showAnalyseConfirm();
        });
        await sleep(400);

        // CHECK: popup visible (display:flex)
        const popupDisplay = await page.evaluate(() => {
            const el = document.getElementById('analyse-confirm-popup');
            if (!el) return 'MISSING';
            return el.style.display || window.getComputedStyle(el).display;
        });
        const popupVisible = popupDisplay === 'flex' || popupDisplay === 'block';
        if (popupVisible) {
            pass(lang, 'popup_visible', `display=${popupDisplay}`);
        } else {
            fail(lang, 'popup_visible', `display=${popupDisplay}`);
        }

        // Screenshot
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `verify-popup-${lang}.png`) });
        console.log(`  📸 screenshots/verify-popup-${lang}.png`);

        // ── 2. Title translated ───────────────────────────────────────
        const titleText = await page.evaluate(() => {
            const h2 = document.querySelector('#analyse-confirm-popup h2');
            return h2 ? h2.textContent.trim() : '';
        });
        if (titleText && titleText !== 'analysis.confirm_title') {
            pass(lang, 'title_translated', `"${titleText}"`);
        } else {
            fail(lang, 'title_translated', titleText ? `raw key "${titleText}"` : 'empty');
        }

        // ── 3. List items (3, non-empty, not raw keys) ────────────────
        const liTexts = await page.evaluate(() => {
            const lis = document.querySelectorAll('#analyse-confirm-popup li');
            return Array.from(lis).map(li => li.textContent.trim());
        });
        const liOk = liTexts.length === 3 && liTexts.every(t => t && !t.match(/^analysis\./));
        if (liOk) {
            pass(lang, 'list_items_3_nonempty', liTexts.map(t => `"${t.slice(0, 40)}"`).join(' | '));
        } else {
            fail(lang, 'list_items_3_nonempty', `count=${liTexts.length}, texts=${JSON.stringify(liTexts)}`);
        }

        // ── 4. Checkbox label non-empty ───────────────────────────────
        const checkboxLabel = await page.evaluate(() => {
            const span = document.querySelector('#analyse-confirm-popup label span[data-i18n]');
            if (span) return span.textContent.trim();
            const label = document.querySelector('#analyse-confirm-popup label');
            if (!label) return '';
            // strip the checkbox text
            return label.textContent.trim();
        });
        if (checkboxLabel && !checkboxLabel.match(/^analysis\./)) {
            pass(lang, 'checkbox_label_nonempty', `"${checkboxLabel.slice(0, 60)}…"`);
        } else {
            fail(lang, 'checkbox_label_nonempty', `"${checkboxLabel}"`);
        }

        // ── 5 & 6. Button texts ───────────────────────────────────────
        const btns = await page.evaluate(() => {
            const popup = document.getElementById('analyse-confirm-popup');
            const allBtns = popup ? popup.querySelectorAll('button') : [];
            return Array.from(allBtns).map(b => ({
                text: b.textContent.trim(),
                id: b.id || '',
                opacity: b.style.opacity,
                pointerEvents: b.style.pointerEvents,
            }));
        });

        const cancelBtn = btns.find(b => b.id !== 'analyse-confirm-ok');
        const okBtn = btns.find(b => b.id === 'analyse-confirm-ok');

        if (cancelBtn && cancelBtn.text && !cancelBtn.text.match(/^analysis\./)) {
            pass(lang, 'cancel_btn_nonempty', `"${cancelBtn.text}"`);
        } else {
            fail(lang, 'cancel_btn_nonempty', cancelBtn ? `"${cancelBtn.text}"` : 'button not found');
        }

        if (okBtn && okBtn.text && !okBtn.text.match(/^analysis\./)) {
            pass(lang, 'ok_btn_nonempty', `"${okBtn.text}"`);
        } else {
            fail(lang, 'ok_btn_nonempty', okBtn ? `"${okBtn.text}"` : 'button not found');
        }

        // ── 7. OK disabled before checkbox ───────────────────────────
        if (okBtn) {
            const disabledOk = okBtn.opacity === '0.5' && okBtn.pointerEvents === 'none';
            if (disabledOk) {
                pass(lang, 'ok_btn_disabled_before_check', `opacity=${okBtn.opacity}, pointerEvents=${okBtn.pointerEvents}`);
            } else {
                fail(lang, 'ok_btn_disabled_before_check', `opacity=${okBtn.opacity}, pointerEvents=${okBtn.pointerEvents}`);
            }
        } else {
            fail(lang, 'ok_btn_disabled_before_check', 'ok button not found');
        }

        // ── 8. Click checkbox → OK enabled ───────────────────────────
        await page.evaluate(() => {
            const cb = document.getElementById('analyse-confirm-checkbox');
            if (cb) {
                cb.checked = true;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await sleep(200);

        const okAfterCheck = await page.evaluate(() => {
            const btn = document.getElementById('analyse-confirm-ok');
            if (!btn) return { opacity: 'MISSING', pointerEvents: 'MISSING' };
            return { opacity: btn.style.opacity, pointerEvents: btn.style.pointerEvents };
        });
        if (okAfterCheck.opacity === '1' && okAfterCheck.pointerEvents === 'auto') {
            pass(lang, 'ok_btn_enabled_after_check', `opacity=${okAfterCheck.opacity}, pointerEvents=${okAfterCheck.pointerEvents}`);
        } else {
            fail(lang, 'ok_btn_enabled_after_check', `opacity=${okAfterCheck.opacity}, pointerEvents=${okAfterCheck.pointerEvents}`);
        }

        // ── 9. Cancel closes popup ────────────────────────────────────
        // First uncheck so we test cancel independently from OK
        await page.evaluate(() => {
            const cb = document.getElementById('analyse-confirm-checkbox');
            if (cb) {
                cb.checked = false;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await page.evaluate(() => {
            if (typeof closeAnalyseConfirm === 'function') closeAnalyseConfirm();
            else if (typeof window.closeAnalyseConfirm === 'function') window.closeAnalyseConfirm();
        });
        await sleep(300);

        const afterCancel = await page.evaluate(() => {
            const el = document.getElementById('analyse-confirm-popup');
            return el ? el.style.display : 'MISSING';
        });
        if (afterCancel === 'none' || afterCancel === '') {
            pass(lang, 'cancel_closes_popup', `display=${afterCancel}`);
        } else {
            fail(lang, 'cancel_closes_popup', `display=${afterCancel}`);
        }

        // ── 10. Reopen, check, click OK → closes, commanderAnalyse called (no JS errors) ──
        // Stub commanderAnalyse to prevent real email sending
        await page.evaluate(() => {
            window.__commanderAnalyseCalled = false;
            // Override in global scope
            window.commanderAnalyse = async function () {
                window.__commanderAnalyseCalled = true;
            };
        });

        // Reopen popup
        await page.evaluate(() => {
            if (typeof showAnalyseConfirm === 'function') showAnalyseConfirm();
            else if (typeof window.showAnalyseConfirm === 'function') window.showAnalyseConfirm();
        });
        await sleep(300);

        // Check checkbox
        await page.evaluate(() => {
            const cb = document.getElementById('analyse-confirm-checkbox');
            if (cb) {
                cb.checked = true;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await sleep(200);

        // Click OK
        const errsBefore = jsErrors.length;
        await page.evaluate(() => {
            if (typeof confirmAnalyse === 'function') confirmAnalyse();
            else if (typeof window.confirmAnalyse === 'function') window.confirmAnalyse();
        });
        await sleep(600);

        const popupAfterOk = await page.evaluate(() => {
            const el = document.getElementById('analyse-confirm-popup');
            return el ? el.style.display : 'MISSING';
        });
        const newJsErrors = jsErrors.slice(errsBefore);
        const commanderCalled = await page.evaluate(() => !!window.__commanderAnalyseCalled);

        if ((popupAfterOk === 'none' || popupAfterOk === '') && newJsErrors.length === 0) {
            pass(lang, 'ok_closes_popup_no_jserror',
                `display=${popupAfterOk}, commanderAnalyse called=${commanderCalled}`);
        } else {
            fail(lang, 'ok_closes_popup_no_jserror',
                `display=${popupAfterOk}, jsErrors=${JSON.stringify(newJsErrors)}, commanderCalled=${commanderCalled}`);
        }

    } catch (e) {
        console.error(`  [FATAL] lang=${lang}:`, e.message);
    } finally {
        await page.close();
    }
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        for (const lang of LANGS) {
            await testLang(browser, lang);
        }
    } finally {
        await browser.close();
    }

    // ── Final report ──────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(72));
    console.log('  RAPPORT FINAL — Popup "Commander Analyse" (fr / en / es)');
    console.log('═'.repeat(72));

    const colW = 14;
    const checkW = 36;
    const header = 'Check'.padEnd(checkW) + LANGS.map(l => l.toUpperCase().padStart(colW)).join('');
    console.log('\n  ' + header);
    console.log('  ' + '─'.repeat(checkW + LANGS.length * colW));

    for (const check of CHECK_NAMES) {
        const row = check.padEnd(checkW) +
            LANGS.map(l => {
                const r = results[l][check];
                return (r.ok ? '✅' : '❌').padStart(colW - 2).padEnd(colW);
            }).join('');
        console.log('  ' + row);
    }

    console.log('\n  ' + '─'.repeat(checkW + LANGS.length * colW));

    for (const lang of LANGS) {
        const total = CHECK_NAMES.length;
        const passed = CHECK_NAMES.filter(c => results[lang][c].ok).length;
        const failed = total - passed;
        console.log(`  ${lang.toUpperCase()} : ${passed}/${total} ✅  ${failed > 0 ? failed + ' ❌' : ''}`);
    }

    const allPassed = LANGS.every(l => CHECK_NAMES.every(c => results[l][c].ok));
    console.log('\n  ' + (allPassed ? '✅ Tous les checks sont passés.' : '❌ Certains checks ont échoué.'));
    console.log('═'.repeat(72));

    // Detailed failures
    const failedItems = [];
    for (const lang of LANGS) {
        for (const check of CHECK_NAMES) {
            const r = results[lang][check];
            if (!r.ok) failedItems.push({ lang, check, detail: r.detail });
        }
    }
    if (failedItems.length > 0) {
        console.log('\n  Détail des échecs :');
        for (const { lang, check, detail } of failedItems) {
            console.log(`  ❌ [${lang}] ${check} → ${detail}`);
        }
    }

    process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(2);
});
