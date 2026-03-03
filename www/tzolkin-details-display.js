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

    // Seigneur de la Nuit du jour (même référence que tzolkin-core.js)
    const BASE_DATE_LOCAL = new Date(2025, 3, 22);
    const tdLord = new Date(day.currentDate.getFullYear(), day.currentDate.getMonth(), day.currentDate.getDate());
    const diffDaysLord = Math.round((tdLord - BASE_DATE_LOCAL) / (1000 * 60 * 60 * 24));
    const lordNum = window.TzolkinCore.calculateLordOfNight(diffDaysLord);
    const lordData = window.TzolkinCore.LORDS_OF_NIGHT[lordNum];
    const lordURL = window.TzolkinCore.getLordOfNightURL(lordNum);

    const html = `
        <div style="font-family: 'Simplifica', sans-serif; position: relative;">
            <!-- Jour actuel — bulle tripartite : Trécéna | Glyphe+Ton | Seigneur de la Nuit -->
            <!-- Couleur + étiquette verticale = famille de maïs K'iche' du glyphe du jour -->
            ${(() => {
                const css = window.TzolkinCore.getGlyphColorCSS(day.glyphId);
                const colorName = window.TzolkinCore.getGlyphColor(day.glyphId);
                const FAMILY = { rouge: 'MAÏS ROUGE', blanc: 'MAÏS BLANC', bleu: 'MAÏS NOIR', jaune: 'MAÏS JAUNE' };
                const DIR_ELEM = { rouge: 'EST • FEU', blanc: 'NORD • AIR', bleu: 'OUEST • EAU', jaune: 'SUD • TERRE' };
                const labelLeft  = FAMILY[colorName]   || colorName.toUpperCase();
                const labelRight = DIR_ELEM[colorName] || '';
                const textColor = colorName === 'blanc' ? '#333' : '#fff';
                return `
            <div style="margin-bottom: 25px; padding: 14px 46px 16px 46px; background: ${css.bg}; border-radius: 20px; border: 2px solid ${css.border}; position: relative; overflow: hidden;">
                <!-- Bande gauche : famille Maïs (bas → haut) -->
                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 34px; background: ${css.border}; display: flex; align-items: center; justify-content: center;">
                    <span style="writing-mode: vertical-rl; transform: rotate(180deg); color: ${textColor}; font-family: 'Summer', cursive; font-size: clamp(1.3rem, 5.5vw, 1.7rem); letter-spacing: 2px; white-space: nowrap;">${labelLeft}</span>
                </div>
                <!-- Bande droite : direction • élément (haut → bas) -->
                <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 34px; background: ${css.border}; display: flex; align-items: center; justify-content: center;">
                    <span style="writing-mode: vertical-lr; color: ${textColor}; font-family: 'Summer', cursive; font-size: clamp(1.3rem, 5.5vw, 1.7rem); letter-spacing: 2px; white-space: nowrap;">${labelRight}</span>
                </div>`; })()}
                <!-- Date en haut, pleine largeur -->
                <h3 style="margin: 0 0 12px 0; font-size: clamp(1.3rem, 5.5vw, 1.7rem); color: #222; font-family: 'Summer', cursive; text-align: center;">
                    ${day.gregorian}
                </h3>
                <!-- Trois colonnes -->
                <div style="display: flex; align-items: flex-end; justify-content: space-around; gap: 6px;">

                    <!-- Gauche : Trécéna -->
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <span style="font-size: clamp(0.75rem, 3vw, 0.95rem); font-family: 'Summer', cursive; color: #222; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; line-height: 1;">Trécéna</span>
                        <img src="${trecenaURL}" alt="${window.TzolkinCore.GLYPHS[day.trecenaGlyphId].name}" style="height: clamp(40px, 11vw, 54px); filter: drop-shadow(0 0 4px rgba(0,0,0,0.2));">
                        <span style="font-size: clamp(0.8rem, 3.2vw, 1rem); font-family: 'Summer', cursive; color: #333; text-align: center; line-height: 1.2;">${window.TzolkinCore.GLYPHS[day.trecenaGlyphId].name}</span>
                    </div>

                    <!-- Centre : Glyphe + Ton du jour -->
                    <div style="flex: 1.4; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <img src="${numberURL}" alt="Nombre ${day.numberId}" style="height: clamp(32px, 9vw, 46px); filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));">
                            <img src="${glyphURL}" alt="${window.TzolkinCore.GLYPHS[day.glyphId].name}" style="height: clamp(46px, 13vw, 64px); filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));">
                        </div>
                        <span style="font-size: clamp(1rem, 4vw, 1.25rem); color: #333; font-weight: bold; font-family: 'Summer', cursive; text-align: center;">${day.numberId} ${window.TzolkinCore.GLYPHS[day.glyphId].name}</span>
                    </div>

                    <!-- Droite : Seigneur de la Nuit -->
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <span style="font-size: clamp(0.75rem, 3vw, 0.95rem); font-family: 'Summer', cursive; color: #222; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; line-height: 1;">S. de Nuit</span>
                        ${lordURL
                            ? `<img src="${lordURL}" alt="G${lordNum}" style="height: clamp(40px, 11vw, 54px); filter: drop-shadow(0 0 4px rgba(0,0,0,0.15));">`
                            : `<span style="font-size: clamp(1.5rem, 6vw, 2rem); line-height: 1; color: #333;">G${lordNum}</span>`
                        }
                        <span style="font-size: clamp(0.8rem, 3.2vw, 1rem); font-family: 'Summer', cursive; color: #333; text-align: center; line-height: 1.2;">G${lordNum} ${lordData.name}</span>
                    </div>
                </div>
            </div>

            <!-- Glyphe avec flèche cliquable -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${glyphURL}" alt="" style="width: 30px; height: 30px; opacity: 0.8;">
                        <h4 style="margin: 0; font-size: 26px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">
                            ${glyph.titre}
                        </h4>
                    </div>
                    <button onclick="window.tzolkinDetailsDisplay.openDetailModal('glyph', ${day.glyphId})"
                            style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 18px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                        &rsaquo;
                    </button>
                </div>
                <div style="font-size: 18px; color: #333; line-height: 1.6;">
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
                        <h4 style="margin: 0; font-size: 26px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">
                            ${number.titre}
                        </h4>
                    </div>
                    <button onclick="window.tzolkinDetailsDisplay.openDetailModal('number', ${day.numberId})"
                            style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 18px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                        &rsaquo;
                    </button>
                </div>
                <div style="font-size: 18px; color: #333; line-height: 1.6;">
                    ${number.description}
                </div>
            </div>

            <!-- Seigneur de la Nuit — texte complet inline (pas de vue détail) -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    ${lordURL
                        ? `<img src="${lordURL}" alt="G${lordNum}" style="width: 30px; height: 30px; opacity: 0.85;">`
                        : `<span style="font-size: 22px; color: #333;">G${lordNum}</span>`
                    }
                    <h4 style="margin: 0; font-size: 26px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">
                        G${lordNum} — ${lordData.name}
                    </h4>
                </div>
                <div style="font-size: 16px; color: #555; font-style: italic; margin-bottom: 6px;">
                    ${lordData.domain}
                </div>
                <div style="font-size: 18px; color: #333; line-height: 1.6;">
                    ${lordData.description}
                </div>
            </div>

            <!-- Trécéna avec flèche cliquable -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${trecenaURL}" alt="" style="width: 30px; height: 30px; opacity: 0.6;">
                        <h4 style="margin: 0; font-size: 26px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">
                            Trécéna de ${trecena.nawal_maya} (${trecena.traduction})
                        </h4>
                    </div>
                    <button onclick="window.tzolkinDetailsDisplay.openDetailModal('trecena', ${day.trecenaGlyphId})"
                            style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 18px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                        &rsaquo;
                    </button>
                </div>
                <div style="font-size: 18px; color: #333; line-height: 1.6;">
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
                                <h4 style="margin: 0; font-size: 26px; font-weight: bold; color: #333; font-family: 'Summer', cursive; text-transform: uppercase;">${titre}</h4>
                            </div>
                        </div>
                        <button onclick="window.tzolkinDetailsDisplay.openDetailModal('porteur', ${bearerGlyphId})"
                                style="padding: 8px 12px; background: #5e832a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 18px; font-family: 'Simplifica', sans-serif; flex-shrink: 0; line-height: 1;">
                            &rsaquo;
                        </button>
                    </div>
                    ${shortDesc ? `<div style="font-size: 18px; color: #333; line-height: 1.6;">${shortDesc}</div>` : ''}
                </div>`;
            })()}

            ${day.matchingPeople.length > 0 ? `
                <div style="margin-top: 10px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 20px; color: #444; font-family: 'Summer', cursive;">
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
                                    <div style="font-size:19px; font-weight:bold; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
                                    <div style="font-size:15px; color:${css.text}; margin-top:2px; font-style:italic;">${labelText}</div>
                                </div>
                            </div>
                            <button onclick="openCroixMayaModalByIndex(${idx})"
                                style="flex-shrink:0; padding:6px 12px; background:${css.border}; color:white; border:none; border-radius:8px; cursor:pointer; font-size:15px; font-family:'Simplifica',sans-serif; white-space:nowrap;">
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
