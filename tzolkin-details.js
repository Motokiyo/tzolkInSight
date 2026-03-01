// Définir les maps globalement
const glyphMap = {
    'Imix': './assets/glyphs/MAYA-g-log-cal-D01-Imix.svg',
    'Ik': './assets/glyphs/MAYA-g-log-cal-D02-Ik.svg',
    'Akbal': './assets/glyphs/MAYA-g-log-cal-D03-Akbal.svg',
    'Kan': './assets/glyphs/MAYA-g-log-cal-D04-Kan.svg',
    'Chicchan': './assets/glyphs/MAYA-g-log-cal-D05-Chikchan.svg',
    'Cimi': './assets/glyphs/MAYA-g-log-cal-D06-Kimi.svg',
    'Manik': './assets/glyphs/MAYA-g-log-cal-D07-Manik.svg',
    'Lamat': './assets/glyphs/MAYA-g-log-cal-D08-Lamat.svg',
    'Muluc': './assets/glyphs/MAYA-g-log-cal-D09-Muluk.svg',
    'Oc': './assets/glyphs/MAYA-g-log-cal-D10-Ok_b.svg',
    'Chuen': './assets/glyphs/MAYA-g-log-cal-D11-Chuwen.svg',
    'Eb': './assets/glyphs/MAYA-g-log-cal-D12-Eb.svg',
    'Ben': './assets/glyphs/MAYA-g-log-cal-D13-Ben.svg',
    'Ix': './assets/glyphs/MAYA-g-log-cal-D14-Ix.svg',
    'Men': './assets/glyphs/MAYA-g-log-cal-D15-Men.svg',
    'Cib': './assets/glyphs/MAYA-g-log-cal-D16-Kib.svg',
    'Caban': './assets/glyphs/MAYA-g-log-cal-D17-Kaban.svg',
    'Etznab': './assets/glyphs/MAYA-g-log-cal-D18-Etznab.svg',
    'Cauac': './assets/glyphs/MAYA-g-log-cal-D19-Kawak.svg',
    'Ahau': './assets/glyphs/MAYA-g-log-cal-D20-Ajaw.svg'
};

const numberMap = {
    'Hun': './assets/numbers/Maya_1.svg',
    'Ca\'': './assets/numbers/Maya_2.svg',
    'Ox': './assets/numbers/Maya_3.svg',
    'Can': './assets/numbers/Maya_4.svg',
    'Ho': './assets/numbers/Maya_5.svg',
    'Wak': './assets/numbers/Maya_6.svg',
    'Wuk': './assets/numbers/Maya_7.svg',
    'Waxak': './assets/numbers/Maya_8.svg',
    'Bolon': './assets/numbers/Maya_9.svg',
    'Lajun': './assets/numbers/Maya_10.svg',
    'Junlajun': './assets/numbers/Maya_11.svg',
    'Kablajun': './assets/numbers/Maya_12.svg',
    'Oxlajun': './assets/numbers/Maya_13.svg'
};

// Fonction showDetail exposée globalement
function showDetail(type, id) {
    const mainView = document.querySelector('.tzolkin-app');
    const widgetContainer = document.getElementById('tzolkin-widget-container');
    const summarySection = document.getElementById('tzolkin-details');
    const detailView = document.getElementById('tzolkin-detail-view');
    const detailContent = document.getElementById('tzolkin-detail-content');
    const mainMenu = document.querySelector('.main-menu');

    // Accès aux données locales depuis window.TZOLKIN_DETAILS_DATA
    const details = window.TZOLKIN_DETAILS_DATA || { glyphs: {}, numbers: {}, trecenas: {} };
    const item = details[type + 's']?.[id.toString()];

    if (!item || !mainView || !detailView || !detailContent) {
        console.error('Tzolk\'in: Missing elements or item', { item, mainView, detailView, detailContent, type, id });
        return;
    }

    // Titre avec capitalisation des noms si présents
    const titleSpan = document.querySelector('.tzolkin-title-span');
    const namesStr = titleSpan ? (titleSpan.dataset.names || '') : '';
    let displayTitle = item.titre;

    if (namesStr) {
        // Capitaliser les noms (ALL CAPS)
        const capitalizedNames = namesStr.toUpperCase();
        displayTitle += ` - ${capitalizedNames}`;
    }

    detailContent.innerHTML = `
        <div style="padding: 20px; max-width: 800px; margin: 0 auto; position: relative;">
            <button id="tzolkin-back-btn" style="padding: 8px 16px; background: #222; color: #ded2b3; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 20px; font-family: 'Summer', cursive; font-size: 18px; display: inline-block;">← Retour</button>

            <div style="background: #ded2b3; border: 2px solid #222; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.09); max-width: 500px; margin: 0 auto;">
                <img src="${item.image}" alt="${item.titre}" class="tzolkin-detail-img" style="max-width: 100px; height: auto; display: block; margin: 0 auto 10px;">
                <h3 style="text-align: center; font-size: 1.5em; margin: 10px 0 5px; color: #333; font-family: 'Summer', cursive;">${displayTitle}</h3>
                ${item.sous_titre ? `<p style="text-align:center; font-size:13px; color:#888; margin:0 0 20px; font-style:italic;">${item.sous_titre}</p>` : '<div style="margin-bottom:20px;"></div>'}
                <div class="detailed-html" style="font-family: 'Simplifica', sans-serif; font-size: 20px; color: #555; line-height: 1.6;">
                    ${item.detailed_description}
                </div>
            </div>

            <div style="height: 80px;"></div>
        </div>

        <div id="tzolkin-scroll-top" style="position: fixed; bottom: 40px; right: 30px; width: 44px; height: 44px; background: #222; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 2000;">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="36px" height="22px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" fill="#ded2b3" style="transform: rotate(180deg); transform-origin: 70px 43px;"/>
            </svg>
        </div>
    `;

    const backBtn = document.getElementById('tzolkin-back-btn');
    const scrollTopBtn = document.getElementById('tzolkin-scroll-top');

    if (backBtn) {
        backBtn.addEventListener('click', showMain);
    }

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            detailView.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Ajouter les images aux liens dans les listes (Nawals d'Amour, Nawals d'Amitié, etc.)
    const listItems = detailContent.querySelectorAll('ul li');
    listItems.forEach(li => {
        const text = li.textContent.trim();
        if (glyphMap[text]) {
            li.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin: 5px 0;">
                    <img src="${glyphMap[text]}" alt="${text}" style="width: 20px; height: 20px; vertical-align: middle;">
                    <span>${text}</span>
                </div>
            `;
            li.style.listStyle = 'none';
        } else if (numberMap[text]) {
            li.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin: 5px 0;">
                    <img src="${numberMap[text]}" alt="${text}" style="width: 20px; height: 20px; vertical-align: middle;">
                    <span>${text}</span>
                </div>
            `;
            li.style.listStyle = 'none';
        }
    });

    // Masquer les composants principaux et afficher la vue détail
    if (widgetContainer) widgetContainer.style.display = 'none';
    if (summarySection) summarySection.style.display = 'none';

    // S'assurer que la vue détail est visible
    detailView.style.display = 'flex';
    detailView.style.opacity = '1';
    window.scrollTo(0, 0);

    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
    document.body.classList.add('detail-view-active');

    console.log('✅ Tzolk\'in Detail: Vue affichée', { type, id, titre: item.titre });
}

function showMain() {
    const widgetContainer = document.getElementById('tzolkin-widget-container');
    const summarySection = document.getElementById('tzolkin-details');
    const detailView = document.getElementById('tzolkin-detail-view');
    const mainMenu = document.querySelector('.main-menu');

    if (widgetContainer) widgetContainer.style.display = 'block';
    if (summarySection) summarySection.style.display = 'block';
    if (detailView) detailView.style.display = 'none';

    // Rétablir le scroll du body
    document.body.style.overflow = 'auto';
    document.body.classList.remove('detail-view-active');
    window.scrollTo(0, 0);

    console.log('✅ Tzolk\'in Detail: Vue principale restaurée');
}

// Exposer les fonctions globalement
window.showDetail = showDetail;
window.showMain = showMain;

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Charger les détails depuis le fichier local tzolkin-details-data.js (Android compatible)
    const details = window.TZOLKIN_DETAILS_DATA || { glyphs: {}, numbers: {}, trecenas: {} };

    console.log('✅ Tzolk\'in Details: Données locales chargées', {
        glyphs: Object.keys(details.glyphs).length,
        numbers: Object.keys(details.numbers).length,
        trecenas: Object.keys(details.trecenas || {}).length
    });

    // Gestionnaire de clics pour les éléments clickables (si nécessaire)
    document.addEventListener('click', e => {
        const el = e.target.closest('.clickable');
        if (!el) {
            return;
        }
        const type = el.dataset.type;
        const id = el.dataset.id;
        if (type && id && (type === 'glyph' || type === 'number' || type === 'trecena')) {
            showDetail(type, id);
        } else {
            console.log('Tzolk\'in: Invalid type or id', { type, id });
        }
    });
});

console.log('✅ Tzolk\'in Details chargé - Système de modales avec textes longs complets prêt');