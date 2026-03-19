/**
 * tzolkin-iap.js — In-App Purchase (consumable tips) via cordova-plugin-purchase
 * iOS uniquement — sur Android/web, le lien Revolut reste affiché.
 */

const IAP_PRODUCT_IDS = ['petit_cafe', 'soutien', 'grand_soutien'];
let iapReady = false;

function isIOSNative() {
    return typeof Capacitor !== 'undefined'
        && Capacitor.isNativePlatform()
        && Capacitor.getPlatform() === 'ios';
}

/**
 * Initialise le store IAP — appeler une fois au démarrage
 */
function initIAP() {
    if (!isIOSNative()) return;
    if (typeof CdvPurchase === 'undefined') {
        console.warn('[IAP] CdvPurchase non disponible');
        return;
    }

    const { store, ProductType, Platform } = CdvPurchase;

    store.register(IAP_PRODUCT_IDS.map(id => ({
        id: id,
        type: ProductType.CONSUMABLE,
        platform: Platform.APPLE_APPSTORE,
    })));

    store.when().approved(transaction => {
        transaction.finish();
    });

    store.when().finished(transaction => {
        const productId = transaction.products?.[0]?.id || '';
        const _ti = k => (window.i18n?.t(k)) || k;
        const thankKey = { 'petit_cafe': 'small', 'soutien': 'medium', 'grand_soutien': 'large' }[productId] || '';
        const msg = (thankKey && _ti('tips.thank_you_' + thankKey)) || _ti('tips.thank_you');
        showTipThankYou(msg);
    });

    store.error(err => {
        if (err.code !== CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
            console.error('[IAP] Erreur:', err.code, err.message);
        }
    });

    store.initialize([Platform.APPLE_APPSTORE])
        .then(() => {
            iapReady = true;
            updateIAPPrices();
        });
}

/**
 * Met à jour les prix affichés avec les vrais prix App Store
 */
function updateIAPPrices() {
    if (!iapReady) return;
    const { store } = CdvPurchase;
    IAP_PRODUCT_IDS.forEach(id => {
        const product = store.get(id);
        if (!product) return;
        const offer = product.getOffer();
        if (!offer) return;
        const price = offer.pricingPhases[0]?.price;
        const el = document.querySelector(`[data-iap-price="${id}"]`);
        if (el && price) el.textContent = price;
    });
}

/**
 * Acheter un tip — appelé depuis le bouton
 */
function purchaseTip(productId) {
    if (!isIOSNative() || !iapReady) return;
    const { store } = CdvPurchase;
    const product = store.get(productId);
    if (!product) return;
    const offer = product.getOffer();
    if (!offer) return;
    store.order(offer);
}

/**
 * Affiche un message de remerciement
 */
function showTipThankYou(msg) {
    const popup = document.getElementById('tip-thank-you-popup');
    if (popup) {
        const msgEl = popup.querySelector('.tip-thank-you-msg');
        if (msgEl) msgEl.textContent = msg;
        popup.style.display = 'flex';
    }
}

function closeTipThankYou() {
    const popup = document.getElementById('tip-thank-you-popup');
    if (popup) popup.style.display = 'none';
}
