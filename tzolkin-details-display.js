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
            <div onclick="window.tzolkinDetailsDisplay.showCornFamily('${colorName}')" style="margin-bottom: 25px; padding: 14px 46px 16px 46px; background: ${css.bg}; border-radius: 20px; border: 2px solid ${css.border}; position: relative; overflow: hidden; cursor: pointer;" title="Découvrir la famille ${FAMILY[colorName] || colorName}">
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
 * Images et infos des 4 porteurs d'année K'iche' (un par famille de maïs)
 */
const PORTEUR_IMAGES = {
    rouge: { kiche: 'Kej',  yucatec: 'Manik', id: 7,  img: './assets/porteurs/manik_pa.png', filter: 'brightness(0) invert(1)', textColor: '#fff',    bg: '#b71c1c', border: '#7f0000' },
    blanc: { kiche: "No'j", yucatec: 'Caban', id: 17, img: './assets/porteurs/caban-pa.png', filter: 'brightness(0)',            textColor: '#333',    bg: '#f5f0e8', border: '#9e9e9e' },
    bleu:  { kiche: 'E',    yucatec: 'Eb',    id: 12, img: './assets/porteurs/eb-pa.png',    filter: 'brightness(0) invert(1)', textColor: '#fff',    bg: '#1a1a2e', border: '#000000' },
    jaune: { kiche: "Iq'",  yucatec: 'Ik',    id: 2,  img: './assets/porteurs/ik-pa.png',    filter: 'brightness(0)',            textColor: '#3a2400', bg: '#e6ac00', border: '#a07800' }
};

/**
 * Données des 4 familles de Maïs K'iche' (Peuple du Maïs / Popol Vuh)
 */
const CORN_FAMILY_DATA = {
    rouge: {
        kicheName: "Kaq Ixim",
        frenchName: "Maïs Rouge",
        direction: "Est",
        dirKiche: "Releb'al Q'ij",
        dirDesc: "Là où se lève le soleil — origine de toute lumière et de tout mouvement",
        element: "Feu",
        elementKiche: "Q'aq'",
        colors: { bg: '#c0392b', border: '#922b21', text: '#fff' },
        popolvuh: "Dans le Popol Vuh, le maïs rouge incarne le <strong>sang des ancêtres</strong> — la chaleur vitale qui anime le corps humain. Les dieux créateurs Tepew et Q'ukumatz façonnèrent les premiers êtres humains avec la chair du maïs rouge mêlée au sang de la tapir et du serpent. C'est la couleur du feu intérieur, de la vie qui s'allume à l'Est avec le soleil levant.",
        elementDesc: "Le Feu (Q'aq') de l'Est est un feu <strong>purificateur et transformateur</strong>. Il ne détruit pas — il transmute. Dans la tradition K'iche' de Momostenango, les cérémonies du feu s'ouvrent toujours vers l'Est, car c'est de là que vient la chaleur primordiale. Le copal brûlé crée un pont (pom) entre le monde visible et le monde des ancêtres. Les porteurs de ce feu sont des passeurs de seuil.",
        nawals: [
            { id: 3, yucatec: "Akbal", kiche: "Aq'ab'al", title: "L'Aube", animal: "Chauve-souris, renard", desc: "Aq'ab'al est le seuil entre la nuit et le jour — l'instant exact où l'obscurité se déchire. En K'iche', aq'ab' signifie 'la nuit', et la particule -al désigne un état transitoire. C'est le nawal de l'ajq'ij (prêtre calendrier) qui voit dans les deux mondes. Force de recommencement, de renaissance après l'épreuve. Particulièrement propice aux nouvelles entreprises et aux guérisons profondes." },
            { id: 7, yucatec: "Manik", kiche: "Kej", title: "Le Cerf", animal: "Cerf", desc: "Kej (cerf) est l'un des quatre porteurs d'année K'iche' et le plus puissant selon la tradition de Momostenango. Les quatre cerfs portent le ciel sur leurs ramures aux quatre coins du monde — ils sont les piliers de l'univers. Barbara Tedlock note que les ajq'ijab' de Kej sont souvent désignés chefs spirituels. Force de leadership, de structure cosmique, de responsabilité sacrée." },
            { id: 11, yucatec: "Chuen", kiche: "B'atz'", title: "Le Fil du Temps", animal: "Singe araignée", desc: "B'atz' (fil, cordon de ombilical, singe araignée) est le nawal par excellence de l'artiste, du tisserand, du musicien. En K'iche', b'atz' désigne à la fois le fil et le singe araignée dont les doigts tissent avec agilité. Le 8 B'atz' (Wajxaqib' B'atz') est le Jour du Tisserand Divin — la plus grande fête du calendrier K'iche', célébrée avec feu et danse. Les ajq'ijab' sont initiés lors de ce jour." },
            { id: 15, yucatec: "Men", kiche: "Tz'ikin", title: "L'Oiseau-Vision", animal: "Aigle, quetzal", desc: "Tz'ikin (oiseau) est le messager entre les dimensions. En K'iche', il désigne tout oiseau, mais le quetzal — oiseau sacré du Popol Vuh — en est l'expression la plus haute. Tz'ikin voit depuis les hauteurs ce que les êtres terrestres ne peuvent voir. C'est le nawal de la fortune matérielle acquise par vision prophétique, du commerce juste, et de la connexion au divin à travers la beauté." },
            { id: 19, yucatec: "Cauac", kiche: "Kawoq", title: "L'Orage Guérisseur", animal: "Tortue, serpent à plumes", desc: "Kawoq est l'orage fécondant — la pluie qui arrive après la sécheresse, la foudre qui purifie l'air. En K'iche', ce nawal est associé aux sages-femmes (iyom) et aux guérisseurs de la communauté (ajq'ij féminin). C'est le nawal de l'abondance collective, du bien commun, de la communauté soudée face à l'adversité. Kawoq protège les enfants et les familles." }
        ],
        ceremony: "Les cérémonies dédiées aux nawals du Maïs Rouge s'allument à l'aube, face à l'Est. Le copal rouge (pom kaq) est l'offrande privilégiée. Les ajq'ijab' K'iche' de Momostenango placent des bougies rouges pour honorer cette famille. Le jour 8 B'atz' est la grande fête annuelle de toute la famille du Maïs Rouge."
    },
    blanc: {
        kicheName: "Saq Ixim",
        frenchName: "Maïs Blanc",
        direction: "Nord",
        dirKiche: "Xaman",
        dirDesc: "Là où naît le vent froid — domaine de la clarté mentale et de la pureté ancestrale",
        element: "Air",
        elementKiche: "Iq'",
        colors: { bg: '#9e9e9e', border: '#616161', text: '#fff' },
        popolvuh: "Le maïs blanc incarne les <strong>os des ancêtres</strong> dans le Popol Vuh — la structure profonde, l'armature invisible qui tient le corps humain debout. Blanc comme les étoiles du Nord, blanc comme les ossements des aïeux qui parlent encore sous la terre. La farine blanche du maïs Saq fut la première nourriture offerte aux dieux après la création des humains.",
        elementDesc: "L'Air (Iq') du Nord est l'élément de la <strong>parole sacrée et de la pensée juste</strong>. En K'iche', iq' désigne à la fois le vent, le souffle et l'âme-esprit. C'est l'air qui traverse le Nawal Iq' (vent-ouragan) mais dans sa dimension septentrionale, il est calme, précis, tranchant comme un cristal de quartz. Les nawals du Nord portent la clarté intellectuelle et la rigueur des ancêtres.",
        nawals: [
            { id: 1, yucatec: "Imix", kiche: "Imox", title: "La Source Primordiale", animal: "Crocodile, nénuphar", desc: "Imox est le premier nawal du Tzolk'in — l'eau primordiale d'avant la création, l'inconscient collectif de toute l'humanité. En K'iche', ce nawal évoque les eaux profondes où baigne la conscience non-formulée. Les ajq'ijab' de Momostenango associent Imox aux personnes visionnaires qui reçoivent des messages dans les rêves. Sa force est immense mais instable — comme l'océan sous la lune." },
            { id: 5, yucatec: "Chicchan", kiche: "Kan", title: "Le Serpent", animal: "Serpent à sonnettes", desc: "Kan (serpent) est l'énergie kundalini du calendrier K'iche' — la force vitale enroulée qui monte de la terre vers le ciel. C'est la sève de vie, le feu sanguin, le mouvement essentiel. Dans la tradition K'iche', Kan représente la connaissance ésotérique transmise par les ancêtres serpents, gardiens des cenotes et des sources. Porteur de médecine et de venin — la même substance peut guérir ou tuer selon l'intention." },
            { id: 9, yucatec: "Muluc", kiche: "Toj", title: "L'Offrande-Paiement", animal: "Requin, poisson", desc: "Toj est le nawal de la <strong>justice cosmique et du paiement sacré</strong>. En K'iche', toj signifie 'payer, offrir, rétablir l'équilibre'. C'est le tribunal invisible qui veille sur les dettes karmiques. Les ajq'ijab' consultent Toj pour les affaires de justice, les conflits familiaux, les procès. Toj demande toujours : qu'est-ce qui doit être rendu ? Quelle offrande rétablira l'harmonie ? C'est aussi le nawal de la gratitude." },
            { id: 13, yucatec: "Ben", kiche: "Aj", title: "La Route Sacrée", animal: "Maïs (plant), boa constrictor", desc: "Aj est le bâton de roseau du pèlerin — le nawal de l'ajq'ij lui-même, car Ajq'ij (gardien du jour) contient Aj en son nom. C'est la route du prêtre calendrier qui marche de village en village, le bâton sacré porté lors des processions. Aj représente aussi la tige du maïs qui relie la terre au ciel, et le roseau dont on fait les flûtes et les pailles rituelles pour appeler la pluie." },
            { id: 17, yucatec: "Caban", kiche: "No'j", title: "La Pensée Tellurique", animal: "Tremblement de terre, faucon", desc: "No'j est la sagesse qui vient des profondeurs de la terre — l'intelligence tellurique, la mémoire ancestrale stockée dans les roches et les grottes sacrées. En K'iche', no'j désigne la pensée, le conseil profond, la réflexion qui précède l'action juste. C'est le nawal des anciens sages (principales) et des gardiens du calendrier. No'j est aussi traduit par 'terre' (sens Yucatèque) et 'mouvement-tremblement' — trois dimensions d'une même profondeur." }
        ],
        ceremony: "Les cérémonies du Maïs Blanc s'accomplissent à minuit ou au lever du jour, tournées vers le Nord. Les bougies blanches dominent les autels. L'encens (pom saq) blanc ou transparent est privilégié. Le 9 Toj est particulièrement propice aux rituels de justice et de rééquilibrage karmique dans la tradition K'iche'."
    },
    bleu: {
        kicheName: "Q'eq Ixim",
        frenchName: "Maïs Noir",
        direction: "Ouest",
        dirKiche: "Ochib'al Q'ij",
        dirDesc: "Là où s'engloutit le soleil — domaine des ancêtres, du voyage intérieur et de la transformation",
        element: "Eau",
        elementKiche: "Ya'",
        colors: { bg: '#2471a3', border: '#1a5276', text: '#fff' },
        popolvuh: "Le maïs noir représente les <strong>yeux et les cheveux</strong> des premiers humains dans le Popol Vuh — les organes de la perception et la couronne de l'être. Noir comme l'obsidienne sacrée, noir comme les eaux profondes de l'Ouest où le soleil plonge chaque soir pour traverser l'inframonde (Xib'alb'a). La famille du Maïs Noir est celle des voyageurs entre les mondes, des âmes profondes.",
        elementDesc: "L'Eau (Ya') de l'Ouest est l'<strong>eau des profondeurs</strong> — non pas l'eau de surface, mais l'eau souterraine qui serpente dans les caves sacrées, les cénotes, les rivières souterraines. Elle symbolise le voyage de l'âme dans l'inframonde et le retour victorieux comme les jumeaux héroïques du Popol Vuh. Les nawals de l'Ouest portent l'abondance matérielle, le sens du voyage et la sagesse des ancêtres.",
        nawals: [
            { id: 4, yucatec: "Kan", kiche: "K'at", title: "Le Filet", animal: "Araignée, lézard", desc: "K'at (filet, toile) est à la fois le piège et l'abondance — car le même filet qui capture aussi recueille la récolte. En K'iche', le filet évoque les liens familiaux, les obligations sociales, les dettes accumulées. Ce nawal apprend à discerner ce qui est fardeau (liens toxiques) de ce qui est richesse (liens aimants). K'at est le nawal du marchand, du tisserand de relations, de celui qui sait tisser sa vie avec sagesse." },
            { id: 8, yucatec: "Lamat", kiche: "Q'anil", title: "La Graine", animal: "Lapin, étoile du soir", desc: "Q'anil (graine, semence) est l'essence même de l'abondance K'iche'. Qa-nil signifie littéralement 'notre graine' — la graine collective, la semence ancestrale que chaque famille garde précieusement. Le glyphe classique de Lamat représente l'étoile de Vénus, et en effet Q'anil est lié aux cycles planétaires et à la germination. Mais son sens profond K'iche' est la sève, la potentialité, la vie en attente d'éclore. Le lapin est son animal totem traditionnel." },
            { id: 12, yucatec: "Eb", kiche: "E", title: "La Route", animal: "Hibou, armadillo", desc: "E (route, chemin) est le nawal du grand voyageur — et en K'iche', ajq'ij signifie 'gardien du jour', et E est la route que ce gardien parcourt. C'est le chemin des ancêtres qui ont marché avant nous, la route qui relie les générations. En K'iche', E est aussi l'échelle en spirale qui monte et descend entre les niveaux du cosmos. Porteur d'année fondamental, E donne à ses enfants un sens inné du chemin juste." },
            { id: 16, yucatec: "Cib", kiche: "Ajmaq", title: "La Faute-Pardon", animal: "Vautour, hibou (non attesté)", desc: "Ajmaq (faute, péché, transgression) est le nawal du pardon et de la réconciliation avec les ancêtres. En K'iche', maq signifie 'faute, offense' — et Ajmaq est celui qui porte la conscience des erreurs collectives pour mieux les transformer. C'est le nawal du pardon profond, de la reconnaissance de nos dettes envers les ancêtres, et de la purification par l'aveu. Le vautour est son animal symbolique — il nettoie ce qui est mort pour libérer le sol." },
            { id: 20, yucatec: "Ahau", kiche: "Ajpu", title: "Le Seigneur-Chasseur", animal: "Chien, jaguar, soleil", desc: "Ajpu est le héros par excellence du Popol Vuh — Junajpu, le Seigneur Chasseur, qui avec son frère Xb'alanke vainquit les seigneurs de Xib'alb'a (inframonde) et se transforma en soleil et en lune. Ajpu est le 20e nawal, le dernier et le plus accompli du cycle — il incarne la victoire sur la peur de la mort, la lumière qui triomphe des ténèbres. C'est le nawal du souverain spirituel, du guerrier qui sait mourir pour renaître." }
        ],
        ceremony: "Les cérémonies du Maïs Noir s'effectuent au coucher du soleil ou en pleine nuit, tournées vers l'Ouest. Les bougies noires ou bleu-nuit dominent. C'est la direction des rituels pour les ancêtres, les commémorations et les passages. Le 8 Q'anil est particulièrement favorable aux semailles et aux demandes d'abondance dans la tradition K'iche'."
    },
    jaune: {
        kicheName: "Q'an Ixim",
        frenchName: "Maïs Jaune",
        direction: "Sud",
        dirKiche: "Nojibe'al",
        dirDesc: "Là où souffle le vent chaud — domaine de la transformation, de la loi et du pouvoir de la terre",
        element: "Terre",
        elementKiche: "Ulew",
        colors: { bg: '#c9a010', border: '#a07800', text: '#fff' },
        popolvuh: "Le maïs jaune incarne les <strong>muscles et la chair</strong> des premiers humains dans le Popol Vuh — la matière active, la force qui agit dans le monde. Jaune comme le soleil au zénith du Sud, jaune comme les épis dorés à maturité. La famille du Maïs Jaune est celle de l'action juste dans le monde, de la loi divine (tz'aqat) et du pouvoir chamanique terrestre.",
        elementDesc: "La Terre (Ulew) du Sud est la <strong>terre vivante, la Grande Mère nourricière</strong>. En K'iche', ulew désigne la terre comme être vivant — non comme objet passif mais comme force active qui donne et reprend. Le Sud est la direction de la maturité, du midi solaire, de la pleine manifestation. Les nawals du Sud portent la puissance de transformation, l'intelligence de la nature et le tranchant de la vérité.",
        nawals: [
            { id: 2, yucatec: "Ik", kiche: "Iq'", title: "Le Vent-Ouragan", animal: "Colibri, aigle", desc: "Iq' (vent, ouragan, âme-souffle) est le nawal de la purification collective par le vent. En K'iche' de Momostenango, Barbara Tedlock décrit Iq' comme 'imprévisible, changeant, purificateur' — la force qui balaie ce qui doit partir. C'est aussi l'un des porteurs d'année K'iche'. Iq' est l'âme divine (le mot iq' désigne à la fois vent et âme) — c'est le souffle divin insufflé par les créateurs dans les premiers humains de maïs." },
            { id: 6, yucatec: "Cimi", kiche: "Kame", title: "La Mort-Transformation", animal: "Chouette, chauve-souris", desc: "Kame (mort, transformation) est l'un des nawals les plus mal compris et les plus précieux. En K'iche', kame ne désigne pas la mort comme fin mais comme <strong>passage initiatique</strong>. Les ajq'ijab' de Kame sont souvent des guérisseurs qui ont traversé une grande épreuve (maladie, perte) et en sont revenus transformés. Kame est le nawal des ancêtres qui parlent, des sages qui connaissent l'inframonde et reviennent avec sa sagesse." },
            { id: 10, yucatec: "Oc", kiche: "Tz'i'", title: "Le Chien-Loi", animal: "Chien, loutre", desc: "Tz'i' (chien) est le nawal de la <strong>loi divine, de la fidélité et de la justice naturelle</strong>. En K'iche', le chien est le guide des morts dans l'inframonde — c'est lui qui connaît le chemin et n'abandonne jamais son maître. Tz'i' est aussi le nawal des autorités traditionnelles, des juges et des ajq'ijab' spécialisés dans la médiation. La loi de Tz'i' est impartiale : elle s'applique à tous sans exception, y compris aux puissants." },
            { id: 14, yucatec: "Ix", kiche: "Ix", title: "La Magie Jaguar", animal: "Jaguar", desc: "Ix (jaguar) est le nawal du pouvoir chamanique terrestre, du <strong>féminin sacré et de la magie positive</strong>. En K'iche', Ix est associé aux montagnes sacrées (witz), aux autels en plein air (mes), et aux femmes aux pouvoirs spirituels exceptionnels. Le jaguar voit dans l'obscurité et se déplace en silence — Ix est la maîtrise du pouvoir invisible. C'est aussi le nawal de la dévotion aux lieux sacrés naturels, aux sources et aux grottes." },
            { id: 18, yucatec: "Etznab", kiche: "Tijax", title: "L'Obsidienne-Chirurgien", animal: "Obsidienne, faucon", desc: "Tijax (obsidienne, couteau sacrificiel) est le nawal du <strong>guérisseur qui coupe ce qui doit être coupé</strong>. L'obsidienne maya était l'instrument chirurgical par excellence — plus tranchant que le métal, elle permettait des incisions précises. En K'iche', Tijax représente la vérité tranchante, la confrontation avec ce qui doit être éliminé (mensonge, maladie, relation toxique). C'est aussi le nawal de l'intelligence analytique et du discernement sans compromis." }
        ],
        ceremony: "Les cérémonies du Maïs Jaune s'accomplissent au midi solaire ou au coucher du soleil, tournées vers le Sud. Les bougies jaunes et l'ambre dominent. Le Sud est la direction des offrandes pour la santé et la guérison. Le 9 Iq' et le 8 B'atz' sont des jours K'iche' majeurs liés à cette famille pour les rituels de purification et de transformation."
    }
};

/**
 * Afficher la page détail d'une famille de Maïs K'iche'
 */
function showCornFamilyDetail(colorName) {
    const data = CORN_FAMILY_DATA[colorName];
    if (!data) return;

    // Masquer widget + résumé, afficher vue détail (même pattern que showDetail)
    const widgetContainer = document.getElementById('tzolkin-widget-container');
    const detailsSection = document.getElementById('tzolkin-details');
    const detailView = document.getElementById('tzolkin-detail-view');
    const detailContent = document.getElementById('tzolkin-detail-content');

    if (!detailView || !detailContent) {
        console.error('showCornFamilyDetail: #tzolkin-detail-view or #tzolkin-detail-content not found');
        return;
    }

    if (widgetContainer) widgetContainer.style.display = 'none';
    if (detailsSection) detailsSection.style.display = 'none';
    detailView.style.display = 'block';

    const nawalRowsHTML = data.nawals.map(n => {
        const glyphURL = window.TzolkinCore ? window.TzolkinCore.getGlyphURL(n.id) : '';
        return `
        <div style="margin-bottom: 16px; padding: 14px 16px; background: #ccc; border-radius: 10px; border-left: 4px solid #555;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                ${glyphURL ? `<img src="${glyphURL}" alt="${n.kiche}" style="width:32px; height:32px; opacity:0.85;">` : ''}
                <div>
                    <span style="font-family: 'Summer', cursive; font-size: 20px; font-weight: bold; color: #222;">${n.kiche} <span style="font-size: 14px; color: #666;">(${n.yucatec})</span></span>
                    <span style="font-family: 'Simplifica', sans-serif; font-size: 16px; color: #555; margin-left: 8px;">— ${n.title}</span>
                </div>
            </div>
            <p style="margin: 0; font-family: 'Simplifica', sans-serif; font-size: 17px; line-height: 1.6; color: #444;">${n.desc}</p>
        </div>`;
    }).join('');

    detailContent.innerHTML = `
        <div style="font-family: 'Simplifica', sans-serif; padding: 16px;">

            <!-- Bouton Retour -->
            <button onclick="window.showMain ? window.showMain() : (document.getElementById('tzolkin-detail-view').style.display='none', document.getElementById('tzolkin-widget-container').style.display='', document.getElementById('tzolkin-details').style.display='')"
                style="padding: 8px 16px; background: #222; color: #ded2b3; border: none; border-radius: 8px; cursor: pointer; font-family: 'Summer', cursive; font-size: 18px; margin-bottom: 20px; display: inline-block;">
                ← Retour
            </button>

            <div style="background: #ded2b3; border: 2px solid #222; border-radius: 16px; padding: 20px; max-width: 500px; margin: 0 auto;">

                <!-- En-tête famille -->
                <div style="text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #999;">
                    <img src="${PORTEUR_IMAGES[colorName].img}" style="width: clamp(70px, 18vw, 96px); height: auto; margin-bottom: 10px; filter: brightness(0);">
                    <h3 style="font-family: 'Summer', cursive; font-size: clamp(1.5rem, 6.5vw, 2rem); margin: 0 0 4px 0; color: #222; letter-spacing: 2px;">${data.frenchName}</h3>
                    <div style="font-family: 'Summer', cursive; font-size: clamp(1rem, 4vw, 1.3rem); color: #555; margin-bottom: 10px;">${data.kicheName}</div>
                    <div style="font-family: 'Simplifica', sans-serif; font-size: 15px; color: #666; margin-bottom: 12px;">Porteur d'année : <strong>${PORTEUR_IMAGES[colorName].kiche}</strong> (${PORTEUR_IMAGES[colorName].yucatec})</div>
                    <div style="display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                        <span style="padding: 3px 12px; border-radius: 20px; background: #444; color: #ded2b3; font-size: 14px; font-family: 'Simplifica', sans-serif;">${data.direction} · ${data.dirKiche}</span>
                        <span style="padding: 3px 12px; border-radius: 20px; background: #444; color: #ded2b3; font-size: 14px; font-family: 'Simplifica', sans-serif;">${data.element} · ${data.elementKiche}</span>
                    </div>
                    <p style="margin: 10px 0 0 0; font-size: 15px; color: #666; font-style: italic; font-family: 'Simplifica', sans-serif;">${data.dirDesc}</p>
                </div>

                <!-- Popol Vuh -->
                <div style="margin-bottom: 20px;">
                    <h3 style="font-family: 'Summer', cursive; font-size: 19px; margin: 0 0 8px 0; color: #333; text-transform: uppercase; letter-spacing: 1px;">Popol Vuh</h3>
                    <p style="margin: 0; font-size: 17px; line-height: 1.65; color: #555;">${data.popolvuh}</p>
                </div>

                <!-- Élément -->
                <div style="margin-bottom: 20px; padding: 14px 16px; background: #c8c4b8; border-radius: 10px;">
                    <h3 style="font-family: 'Summer', cursive; font-size: 19px; margin: 0 0 8px 0; color: #333; text-transform: uppercase; letter-spacing: 1px;">L'Élément ${data.element} (${data.elementKiche})</h3>
                    <p style="margin: 0; font-size: 17px; line-height: 1.65; color: #555;">${data.elementDesc}</p>
                </div>

                <!-- Les 5 Nawals -->
                <div style="margin-bottom: 20px;">
                    <h3 style="font-family: 'Summer', cursive; font-size: 19px; margin: 0 0 12px 0; color: #333; text-transform: uppercase; letter-spacing: 1px;">Les 5 Nawals K'iche'</h3>
                    ${nawalRowsHTML}
                </div>

                <!-- Cérémonies -->
                <div style="padding: 14px 16px; background: #c8c4b8; border-radius: 10px;">
                    <h3 style="font-family: 'Summer', cursive; font-size: 19px; margin: 0 0 8px 0; color: #333; text-transform: uppercase; letter-spacing: 1px;">Cérémonies K'iche'</h3>
                    <p style="margin: 0; font-size: 17px; line-height: 1.65; color: #555;">${data.ceremony}</p>
                </div>

            </div>
            <div style="height: 60px;"></div>
        </div>
    `;

    detailView.scrollTop = 0;
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
    },
    showCornFamily: function (colorName) {
        showCornFamilyDetail(colorName);
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
