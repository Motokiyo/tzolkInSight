/**
 * Capture les 3 screenshots IAP pour App Store Connect review.
 * Usage: node tools/screenshot-iap.js
 */
const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const path = require('path');

const PORT = 8765;
const OUTPUT_DIR = path.join(__dirname, '..', 'tools', 'screenshots-iap');

async function run() {
    // Start local server
    const server = exec(`python3 -m http.server ${PORT}`, { cwd: path.join(__dirname, '..') });
    await new Promise(r => setTimeout(r, 1500));

    const fs = require('fs');
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // iPhone-like viewport
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });

    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait for splash to disappear and app to load
    await new Promise(r => setTimeout(r, 4000));

    // Click away splash if still visible
    await page.evaluate(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
    });
    await new Promise(r => setTimeout(r, 1000));

    // Open credits modal
    await page.evaluate(() => {
        if (typeof openModal === 'function') openModal('credits');
    });
    await new Promise(r => setTimeout(r, 1500));

    // Force show IAP buttons (normally only on iOS)
    await page.evaluate(() => {
        const iapEl = document.getElementById('tip-jar-iap');
        const revEl = document.getElementById('tip-jar-revolut');
        if (iapEl) iapEl.style.display = 'block';
        if (revEl) revEl.style.display = 'none';
    });
    await new Promise(r => setTimeout(r, 500));

    // Scroll to make tip buttons visible
    await page.evaluate(() => {
        const iapEl = document.getElementById('tip-jar-iap');
        if (iapEl) iapEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 500));

    // Screenshot 1: Full credits modal with all 3 tip buttons visible
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'iap-credits-modal.png'), fullPage: false });
    console.log('✅ Screenshot 1: iap-credits-modal.png');

    // Screenshot 2: Highlight petit_cafe button
    const btn1 = await page.evaluate(() => {
        const btns = document.querySelectorAll('#tip-jar-iap button');
        if (btns[0]) {
            btns[0].style.outline = '3px solid #e53935';
            btns[0].style.outlineOffset = '2px';
            btns[0].scrollIntoView({ behavior: 'instant', block: 'center' });
            return true;
        }
        return false;
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'iap-petit-cafe.png'), fullPage: false });
    console.log('✅ Screenshot 2: iap-petit-cafe.png (petit_cafe)');

    // Reset highlight, highlight soutien
    await page.evaluate(() => {
        const btns = document.querySelectorAll('#tip-jar-iap button');
        btns.forEach(b => { b.style.outline = 'none'; b.style.outlineOffset = '0'; });
        if (btns[1]) {
            btns[1].style.outline = '3px solid #e53935';
            btns[1].style.outlineOffset = '2px';
            btns[1].scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'iap-soutien.png'), fullPage: false });
    console.log('✅ Screenshot 3: iap-soutien.png (soutien)');

    // Reset, highlight grand_soutien
    await page.evaluate(() => {
        const btns = document.querySelectorAll('#tip-jar-iap button');
        btns.forEach(b => { b.style.outline = 'none'; b.style.outlineOffset = '0'; });
        if (btns[2]) {
            btns[2].style.outline = '3px solid #e53935';
            btns[2].style.outlineOffset = '2px';
            btns[2].scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'iap-grand-soutien.png'), fullPage: false });
    console.log('✅ Screenshot 4: iap-grand-soutien.png (grand_soutien)');

    await browser.close();
    server.kill();
    console.log(`\n📁 Screenshots dans: ${OUTPUT_DIR}`);
}

run().catch(err => { console.error(err); process.exit(1); });
