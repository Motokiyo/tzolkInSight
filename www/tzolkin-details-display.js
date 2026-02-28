/**
 * Tzolk'in Details Display - Affichage des détails sous le widget
 * Version: 2.0
 * Auteur: Alexandre Ferran + Claude AI
 *
 * Ce fichier affiche les textes courts (de tzolkin-widget.php) dans la section #tzolkin-details
 * avec des flèches cliquables pour ouvrir la modale avec les textes longs complets (de tzolkin-details.php)
 */

/**
 * Mettre à jour l'affichage des détails avec les textes courts complets (de WordPress)
 * et des flèches cliquables pour ouvrir la modale avec les textes longs
 */
function updateTzolkinDetails() {
    console.log('updateTzolkinDetails appelé', {
        hasWidget: !!window.tzolkinWidget,
        hasSummaryData: !!window.TZOLKIN_SUMMARY_DATA,
        hasTzolkinCore: !!window.TzolkinCore
    });

    if (!window.tzolkinWidget || !window.TZOLKIN_SUMMARY_DATA || !window.TzolkinCore) {
        console.warn('Tzolk\'in Details Display: Données non disponibles, réessai dans 500ms');
        setTimeout(updateTzolkinDetails, 500);
        return;
    }

    const day = window.tzolkinWidget.getCurrentDay();
    const detailsContainer = document.getElementById('tzolkin-details-content');

    if (!detailsContainer || !day) {
        console.error('Tzolk\'in Details Display: Éléments manquants', { detailsContainer, day });
        return;
    }

    const glyph = window.TZOLKIN_SUMMARY_DATA.glyphs[day.glyphId];
    const number = window.TZOLKIN_SUMMARY_DATA.numbers[day.numberId];
    const trecena = window.TZOLKIN_SUMMARY_DATA.trecenas[day.trecenaGlyphId];

    // URLs des images
    const glyphURL = window.TzolkinCore.getGlyphURL(day.glyphId);
    const numberURL = window.TzolkinCore.getNumberURL(day.numberId);
    const trecenaURL = window.TzolkinCore.getGlyphURL(day.trecenaGlyphId);

    const html = `
        <div style="font-family: 'Simplifica', sans-serif; position: relative;">
            <!-- Jour actuel -->
            <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: rgba(193, 148, 52, 0.1); border-radius: 20px; border: 1px solid rgba(193, 148, 52, 0.2);">
                <h3 style="margin: 0 0 5px 0; font-size: 28px; color: #c19434; font-family: 'Summer', cursive;">
                    ${day.gregorian}
                </h3>
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: 10px;">
                    <img src="${numberURL}" alt="Nombre" style="height: 40px; filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));">
                    <img src="${glyphURL}" alt="Glyphe" style="height: 60px; filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));">
                </div>
                <p style="margin: 10px 0 0 0; font-size: 22px; color: #333; font-weight: bold; letter-spacing: 1px; font-family: 'Summer', cursive;">
                    ${day.numberId} ${window.TzolkinCore.GLYPHS[day.glyphId].name} (${window.TzolkinCore.GLYPHS[day.glyphId].translation})
                </p>
            </div>

            <!-- Glyphe avec flèche cliquable -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${glyphURL}" alt="" style="width: 30px; height: 30px; opacity: 0.8;">
                        <h4 style="margin: 0; font-size: 24px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">
                            ${glyph.titre}
                        </h4>
                    </div>
                    <button onclick="window.tzolkinDetailsDisplay.openDetailModal('glyph', ${day.glyphId})"
                            style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                        &rsaquo;
                    </button>
                </div>
                <div style="font-size: 16px; color: #333; line-height: 1.6;">
                    <div style="margin-bottom: 8px;">${glyph.description}</div>
                    <p style="margin: 6px 0;"><strong>Mots-clés :</strong> ${glyph.mots_cles}</p>
                    <p style="margin: 0;"><strong>Animal de pouvoir :</strong> ${glyph.animal_pouvoir}</p>
                </div>
            </div>

            <!-- Nombre avec flèche cliquable -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${numberURL}" alt="" style="width: 25px; height: 25px; opacity: 0.8;">
                        <h4 style="margin: 0; font-size: 24px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">
                            ${number.titre}
                        </h4>
                    </div>
                    <button onclick="window.tzolkinDetailsDisplay.openDetailModal('number', ${day.numberId})"
                            style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                        &rsaquo;
                    </button>
                </div>
                <div style="font-size: 16px; color: #333; line-height: 1.6;">
                    ${number.description}
                </div>
            </div>

            <!-- Trécéna avec flèche cliquable -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${trecenaURL}" alt="" style="width: 30px; height: 30px; opacity: 0.6;">
                        <h4 style="margin: 0; font-size: 24px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">
                            Trécéna de ${trecena.nawal_maya} (${trecena.traduction})
                        </h4>
                    </div>
                    <button onclick="window.tzolkinDetailsDisplay.openDetailModal('trecena', ${day.trecenaGlyphId})"
                            style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                        &rsaquo;
                    </button>
                </div>
                <div style="font-size: 16px; color: #333; line-height: 1.6;">
                    ${trecena.description}
                </div>
            </div>

            <!-- Porteur d'Année avec flèche cliquable -->
            ${(() => {
                const bearerGlyphId = window.TzolkinCore.getYearBearerGlyph(new Date().getFullYear());
                const bearerGlyph   = window.TzolkinCore.GLYPHS[bearerGlyphId];
                const bearerURL     = window.TzolkinCore.getGlyphURL(bearerGlyphId);
                const porteurData    = window.TZOLKIN_DETAILS_DATA && window.TZOLKIN_DETAILS_DATA.porteurs
                                       ? window.TZOLKIN_DETAILS_DATA.porteurs[bearerGlyphId] : null;
                const summaryPorteur = window.TZOLKIN_SUMMARY_DATA && window.TZOLKIN_SUMMARY_DATA.porteurs
                                       ? window.TZOLKIN_SUMMARY_DATA.porteurs[bearerGlyphId] : null;
                const shortDesc  = summaryPorteur ? summaryPorteur.description : '';
                // Construire le titre : "Porteur Année N°1 Manik - Kej"
                let titre;
                if (porteurData) {
                    const parts    = porteurData.titre.split(' · ');
                    const num      = (parts[0] || '').replace('Porteur ', '').trim();
                    const rest     = (parts[1] || '').split(' — ');
                    const mainName = rest[0] || bearerGlyph.name;
                    const otherOrtho = rest[1] || '';
                    titre = `Porteur Année N°${num} ${mainName}${otherOrtho ? ' - ' + otherOrtho : ''}`;
                } else {
                    titre = `Porteur Année ${bearerGlyph.name}`;
                }
                return `
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${bearerURL}" alt="" style="width: 30px; height: 30px; opacity: 0.8;">
                            <div>
                                <h4 style="margin: 0; font-size: 24px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">${titre}</h4>
                            </div>
                        </div>
                        <button onclick="window.tzolkinDetailsDisplay.openDetailModal('porteur', ${bearerGlyphId})"
                                style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                            &rsaquo;
                        </button>
                    </div>
                    ${shortDesc ? `<div style="font-size: 16px; color: #333; line-height: 1.6;">${shortDesc}</div>` : ''}
                </div>`;
            })()}

            ${day.matchingPeople.length > 0 ? `
                <div style="margin-top: 10px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 18px; color: #444; font-family: 'Summer', cursive;">
                        👤 Jour important pour :
                    </h4>
                    ${day.matchingPeople.map((p, idx) => {
                        const css = window.TzolkinCore.getGlyphColorCSS(p.personGlyphId);
                        const colorName = window.TzolkinCore.getGlyphColor(p.personGlyphId);
                        const LABEL_TEXT = { entree: 'Entrée de cycle', central: 'Jour central', sortie: 'Sortie de cycle' };
                        const labelText = LABEL_TEXT[p.cycleLabel] || '';
                        const glyphImg = window.TzolkinCore.getGlyphURL(p.personGlyphId);
                        return `
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding: 12px 16px; background:${css.bg}; border-radius:12px; border-left:5px solid ${css.border}; margin-bottom:8px; box-shadow:0 2px 8px rgba(0,0,0,0.07);">
                            <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                                <img src="${glyphImg}" alt="${window.TzolkinCore.GLYPHS[p.personGlyphId].name}" style="width:28px; height:28px; flex-shrink:0; opacity:0.85;">
                                <div style="min-width:0;">
                                    <div style="font-size:17px; font-weight:bold; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
                                    <div style="font-size:13px; color:${css.text}; margin-top:2px; font-style:italic;">${labelText}</div>
                                </div>
                            </div>
                            <button onclick="openCroixMayaModalByIndex(${idx})"
                                style="flex-shrink:0; padding:6px 12px; background:${css.border}; color:white; border:none; border-radius:8px; cursor:pointer; font-size:13px; font-family:'Simplifica',sans-serif; white-space:nowrap;">
                                Croix Maya →
                            </button>
                        </div>`;
                    }).join('')}
                </div>
            ` : ''}
            
            <div style="height: 60px;"></div> <!-- Spacer for bottom menu -->
        </div>
    `;

    // Stocker les matchingPeople pour l'accès par index depuis les boutons Croix Maya
    window._tzolkinLastMatchingPeople = day.matchingPeople;

    detailsContainer.innerHTML = html;
    console.log('✅ Tzolk\'in Details Display: Section détails mise à jour', {
        date: day.gregorian,
        glyph: glyph.titre,
        number: number.titre
    });
}

/**
 * Ouvrir la modale avec les textes longs complets
 */
window.tzolkinDetailsDisplay = {
    openDetailModal: function (type, id) {
        // Utiliser la fonction showDetail de tzolkin-details.js
        if (window.showDetail) {
            window.showDetail(type, id);
        } else {
            console.error('Tzolk\'in: showDetail function not found');
        }
    }
};

// Écouter les changements de date du widget
document.addEventListener('tzolkin-date-change', () => {
    updateTzolkinDetails();
});

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Initialisation de Tzolk\'in Details Display');
    // Attendre que tout soit chargé
    setTimeout(() => {
        console.log('Tentative d\'affichage des détails...');
        updateTzolkinDetails();
    }, 1000); // Augmenté à 1 seconde pour laisser le temps au widget de s'initialiser
});

console.log('✅ Tzolk\'in Details Display chargé');
