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
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${glyphURL}" alt="" style="width: 30px; height: 30px; opacity: 0.8;">
                        <h4 style="margin: 0; font-size: 22px; color: #c19434; font-family: 'Summer', cursive;">
                            ${glyph.titre}
                        </h4>
                    </div>
                    <button class="tzolkin-details-arrow"
                            onclick="window.tzolkinDetailsDisplay.openDetailModal('glyph', ${day.glyphId})"
                            style="background: #c19434; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(193, 148, 52, 0.3); transition: transform 0.2s;"
                            onmouseover="this.style.transform='scale(1.1)'"
                            onmouseout="this.style.transform='scale(1)'"
                            title="Voir les détails complets">
                        →
                    </button>
                </div>
                <div style="font-size: 18px; color: #333; line-height: 1.5;">
                    <div style="margin-bottom: 10px; font-style: italic; color: #555;">${glyph.description}</div>
                    <p style="margin: 10px 0 8px 0;"><strong>✨ Mots-clés:</strong> ${glyph.mots_cles}</p>
                    <p style="margin: 0;"><strong>🐾 Animal de pouvoir:</strong> ${glyph.animal_pouvoir}</p>
                </div>
            </div>

            <!-- Nombre avec flèche cliquable -->
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${numberURL}" alt="" style="width: 25px; height: 25px; opacity: 0.8;">
                        <h4 style="margin: 0; font-size: 22px; color: #c19434; font-family: 'Summer', cursive;">
                            ${number.titre}
                        </h4>
                    </div>
                    <button class="tzolkin-details-arrow"
                            onclick="window.tzolkinDetailsDisplay.openDetailModal('number', ${day.numberId})"
                            style="background: #c19434; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(193, 148, 52, 0.3); transition: transform 0.2s;"
                            onmouseover="this.style.transform='scale(1.1)'"
                            onmouseout="this.style.transform='scale(1)'"
                            title="Voir les détails complets">
                        →
                    </button>
                </div>
                <div style="font-size: 18px; color: #333; line-height: 1.5;">
                    ${number.description}
                </div>
            </div>

            <!-- Trécéna (sans lien détail) -->
            <div style="margin-bottom: 25px; padding: 15px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <img src="${trecenaURL}" alt="" style="width: 30px; height: 30px; opacity: 0.6;">
                    <h4 style="margin: 0; font-size: 22px; color: #c19434; font-family: 'Summer', cursive;">
                        Trécéna de ${trecena.nawal_maya} (${trecena.traduction})
                    </h4>
                </div>
                <div style="font-size: 18px; color: #333; line-height: 1.5;">
                    ${trecena.description}
                </div>
            </div>

            ${day.matchingPeople.length > 0 ? `
                <div style="margin-top: 10px; padding: 20px; background: rgba(193, 148, 52, 0.15); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 16px; border-left: 6px solid #c19434; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h4 style="margin: 0 0 10px 0; font-size: 20px; color: #444; font-family: 'Summer', cursive;">
                        👤 Jours importants pour :
                    </h4>
                    <p style="margin: 0; font-size: 20px; color: #333; font-weight: bold;">
                        ${day.matchingPeople.map(p => p.name).join(', ')}
                    </p>
                </div>
            ` : ''}
            
            <div style="height: 60px;"></div> <!-- Spacer for bottom menu -->
        </div>
    `;

    detailsContainer.innerHTML = html;

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
