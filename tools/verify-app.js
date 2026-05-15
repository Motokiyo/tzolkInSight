/**
 * TzolkInSight — End-to-end verification script
 * Usage: node tools/verify-app.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Ensure screenshots dir exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const LOCALSTORAGE_DATA = {
    tzolkin_people_cycles: '[{"name":"Test","birthDate":"1990-06-15","color":"#c19434","glyph":7,"number":4}]',
    tzolkin_user_key: 'testkey123'
};

const results = [];
const jsErrors = [];

async function screenshot(page, name) {
    const file = path.join(SCREENSHOTS_DIR, `verify-${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  📸 Screenshot: ${file}`);
}

function pass(name, detail = '') {
    results.push({ name, ok: true, detail });
    console.log(`  ✅ ${name}${detail ? ' — ' + detail : ''}`);
}

function fail(name, detail = '') {
    results.push({ name, ok: false, detail });
    console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`);
}

async function runTest(name, fn) {
    console.log(`\n[TEST] ${name}`);
    try {
        await fn();
    } catch (e) {
        fail(name, e.message);
    }
}

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    let page;
    try {
        page = await browser.newPage();
        page.setDefaultTimeout(15000);

        // Capture JS errors
        page.on('pageerror', (err) => {
            jsErrors.push(err.message);
            console.log(`  [JS ERROR] ${err.message}`);
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 1: Load page
        // ─────────────────────────────────────────────────────────────
        await runTest('1. Page charge', async () => {
            const response = await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 20000 });
            const status = response ? response.status() : 0;
            if (!response || status >= 400) {
                await screenshot(page, '1-page-charge');
                throw new Error(`HTTP status ${status}`);
            }

            // Hide splash screen
            await page.evaluate(() => {
                const splash = document.getElementById('splash-screen');
                if (splash) splash.style.display = 'none';
                document.body.classList.remove('splash-active');
            });

            // Inject localStorage data
            await page.evaluate((data) => {
                Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
            }, LOCALSTORAGE_DATA);

            // Wait a bit for scripts to settle
            await new Promise(r => setTimeout(r, 1500));

            // Check body is not blank
            const bodyText = await page.evaluate(() => document.body.innerText.trim().length);
            if (bodyText < 10) {
                await screenshot(page, '1-page-charge');
                throw new Error('Page body appears empty/blank');
            }
            pass('1. Page charge', `HTTP ${status}, body length OK`);
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 2: No JS errors
        // ─────────────────────────────────────────────────────────────
        await runTest('2. Pas d\'erreur JS', async () => {
            // Wait a bit more for deferred scripts
            await new Promise(r => setTimeout(r, 1000));
            if (jsErrors.length > 0) {
                await screenshot(page, '2-js-errors');
                throw new Error(`${jsErrors.length} erreur(s) JS: ${jsErrors.slice(0, 3).join(' | ')}`);
            }
            pass('2. Pas d\'erreur JS', '0 erreur console');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 3: openCroixMayaModal exists
        // ─────────────────────────────────────────────────────────────
        await runTest('3. openCroixMayaModal existe', async () => {
            const typeOf = await page.evaluate(() => typeof window.openCroixMayaModal);
            if (typeOf !== 'function') {
                await screenshot(page, '3-openCroixMayaModal');
                throw new Error(`typeof openCroixMayaModal === '${typeOf}' (expected 'function')`);
            }
            pass('3. openCroixMayaModal existe', 'typeof === function');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 4: Croix Maya opens
        // ─────────────────────────────────────────────────────────────
        await runTest('4. Croix Maya s\'ouvre', async () => {
            await page.evaluate(() => window.openCroixMayaModal('Test', 7, 4, '1990-06-15'));
            await new Promise(r => setTimeout(r, 500));
            const display = await page.evaluate(() => {
                const modal = document.getElementById('croix-maya-modal');
                if (!modal) return 'MISSING';
                return window.getComputedStyle(modal).display;
            });
            if (display !== 'block') {
                await screenshot(page, '4-croix-maya-ouvre');
                throw new Error(`croix-maya-modal display === '${display}' (expected 'block')`);
            }
            pass('4. Croix Maya s\'ouvre', 'display === block');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 5: Croix Maya closes
        // ─────────────────────────────────────────────────────────────
        await runTest('5. Croix Maya se ferme', async () => {
            await page.evaluate(() => window.closeCroixMayaModal());
            await new Promise(r => setTimeout(r, 500));
            const display = await page.evaluate(() => {
                const modal = document.getElementById('croix-maya-modal');
                if (!modal) return 'MISSING';
                return window.getComputedStyle(modal).display;
            });
            if (display !== 'none') {
                await screenshot(page, '5-croix-maya-ferme');
                throw new Error(`croix-maya-modal display === '${display}' (expected 'none')`);
            }
            pass('5. Croix Maya se ferme', 'display === none');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 6: showDetail works
        // ─────────────────────────────────────────────────────────────
        await runTest('6. showDetail fonctionne', async () => {
            const typeOf = await page.evaluate(() => typeof window.showDetail);
            if (typeOf !== 'function') {
                await screenshot(page, '6-showDetail');
                throw new Error(`typeof showDetail === '${typeOf}' (expected 'function')`);
            }
            await page.evaluate(() => window.showDetail('glyph', 1));
            await new Promise(r => setTimeout(r, 800));
            const hasClass = await page.evaluate(() => document.body.classList.contains('detail-view-active'));
            if (!hasClass) {
                await screenshot(page, '6-showDetail');
                throw new Error('body.classList does not contain detail-view-active after showDetail()');
            }
            pass('6. showDetail fonctionne', 'detail-view-active présent');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 7: Back from detail view
        // ─────────────────────────────────────────────────────────────
        await runTest('7. Retour depuis détail', async () => {
            await page.goBack();
            await new Promise(r => setTimeout(r, 1000));

            // Re-inject localStorage after navigation
            await page.evaluate((data) => {
                Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
                const splash = document.getElementById('splash-screen');
                if (splash) splash.style.display = 'none';
                document.body.classList.remove('splash-active');
            }, LOCALSTORAGE_DATA);

            await new Promise(r => setTimeout(r, 1000));

            const stillActive = await page.evaluate(() => document.body.classList.contains('detail-view-active'));
            if (stillActive) {
                await screenshot(page, '7-retour-detail');
                throw new Error('body.classList still contains detail-view-active after goBack()');
            }
            pass('7. Retour depuis détail', 'detail-view-active absent');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 8: Notes modal
        // ─────────────────────────────────────────────────────────────
        await runTest('8. Modale Notes', async () => {
            // Wait for menu to be loaded (dynamically injected)
            await new Promise(r => setTimeout(r, 1500));

            const typeOf = await page.evaluate(() => typeof window.openModal);
            if (typeOf !== 'function') {
                // openModal might be scoped inside menu iframe or dynamic HTML
                await screenshot(page, '8-notes-modal');
                throw new Error(`typeof openModal === '${typeOf}' (not available globally)`);
            }
            await page.evaluate(() => window.openModal('notes'));
            await new Promise(r => setTimeout(r, 500));
            const hasActive = await page.evaluate(() => {
                const modal = document.getElementById('notes-modal');
                if (!modal) return 'MISSING';
                return modal.classList.contains('active');
            });
            if (!hasActive) {
                await screenshot(page, '8-notes-modal');
                throw new Error(`notes-modal.classList.contains('active') === false (or modal missing)`);
            }
            pass('8. Modale Notes', 'notes-modal active');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 9: Admin modal
        // ─────────────────────────────────────────────────────────────
        await runTest('9. Admin s\'ouvre', async () => {
            // Close notes modal first
            await page.evaluate(() => {
                if (typeof window.closeModal === 'function') window.closeModal();
                if (typeof window.closeAllModals === 'function') window.closeAllModals();
                // fallback: remove active class from all modals
                document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
            });

            const typeOf = await page.evaluate(() => typeof window.tzolkinAdmin);
            if (typeOf === 'undefined') {
                await screenshot(page, '9-admin');
                throw new Error('window.tzolkinAdmin is undefined');
            }
            await page.evaluate(() => window.tzolkinAdmin.openAdminModal());
            await new Promise(r => setTimeout(r, 500));
            const visible = await page.evaluate(() => {
                const modal = document.getElementById('admin-modal');
                if (!modal) return 'MISSING';
                const style = window.getComputedStyle(modal);
                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            });
            if (!visible) {
                await screenshot(page, '9-admin');
                throw new Error('admin-modal not visible after openAdminModal()');
            }
            pass('9. Admin s\'ouvre', 'admin-modal visible');
        });

        // ─────────────────────────────────────────────────────────────
        // STEP 10: i18n works
        // ─────────────────────────────────────────────────────────────
        await runTest('10. i18n fonctionne', async () => {
            const result = await page.evaluate(() => {
                if (!window.i18n) return { ok: false, reason: 'window.i18n is undefined' };
                if (typeof window.i18n.t !== 'function') return { ok: false, reason: 'window.i18n.t is not a function' };
                const val = window.i18n.t('menu.calendar');
                if (!val || typeof val !== 'string' || val.trim() === '' || val === 'menu.calendar') {
                    return { ok: false, reason: `i18n.t('menu.calendar') returned '${val}'` };
                }
                return { ok: true, val };
            });
            if (!result.ok) {
                await screenshot(page, '10-i18n');
                throw new Error(result.reason);
            }
            pass('10. i18n fonctionne', `i18n.t('menu.calendar') === '${result.val}'`);
        });

    } finally {
        await browser.close();
    }

    // ─────────────────────────────────────────────────────────────────
    // FINAL REPORT
    // ─────────────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(60));
    console.log('  RAPPORT FINAL — TzolkInSight E2E');
    console.log('═'.repeat(60));
    const maxLen = Math.max(...results.map(r => r.name.length));
    let passed = 0;
    let failed = 0;
    for (const r of results) {
        const icon = r.ok ? '✅' : '❌';
        const pad = r.name.padEnd(maxLen + 2);
        console.log(`  ${icon} ${pad} ${r.detail}`);
        if (r.ok) passed++; else failed++;
    }
    console.log('─'.repeat(60));
    console.log(`  Total: ${passed + failed} tests — ${passed} ✅  ${failed} ❌`);
    console.log('═'.repeat(60));

    if (failed > 0) process.exit(1);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(2);
});
