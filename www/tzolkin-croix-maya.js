/**
 * Tzolk'in Croix Maya - Affichage de la Croix Maya personnelle
 * Version: 1.1
 * Auteur: Alexandre Ferran + Claude AI
 * Date: Février 2026
 * Tradition : K'iche' classique
 */

// ============================================================================
// TEXTES EXPLICATIFS PAR POSITION
// ============================================================================

const POSITION_TEXTS = {
    centre: {
        title: "Kin de Naissance — Centre",
        text: "Votre nawal de naissance est l'essence fondamentale de votre être. Il révèle vos dons naturels et la couleur énergétique qui teinte toute votre existence. C'est votre identité profonde dans le calendrier sacré K'iche'."
    },
    est: {
        title: "Est — Conception",
        text: "L'énergie de l'Est représente votre conception, l'impulsion originelle qui vous a mis en mouvement. C'est l'énergie de l'aube et du premier souffle — le courage qui vous a fait naître. Elle révèle vos origines profondes et la force initiale de votre existence."
    },
    ouest: {
        title: "Ouest — Mission",
        text: "L'énergie de l'Ouest représente votre mission dans cette vie, le chemin que vous êtes venu accomplir. C'est l'énergie du couchant et de la transformation. Elle révèle ce vers quoi vous tendez naturellement — votre destination profonde."
    },
    nord: {
        title: "Nord — Guide",
        text: "L'énergie du Nord est votre guide intérieur, la sagesse des ancêtres qui vous oriente. C'est le souffle froid porteur de mémoire et de clarté. Cette énergie vous oriente dans vos choix et éclaire votre chemin de vie."
    },
    sud: {
        title: "Sud — Soutien",
        text: "L'énergie du Sud est votre soutien naturel, la chaleur qui vous nourrit et vous renforce. C'est l'énergie du corps, de l'abondance et de la communauté. Elle représente vos alliés et les ressources sur lesquelles vous pouvez vous appuyer."
    },
    trecena: {
        title: "Trécéna de Naissance",
        text: "La trécéna est la période de 13 jours à laquelle appartient votre kin de naissance. Elle commence toujours au ton 1 et colore l'ensemble du cycle. Le nawal qui ouvre votre trécéna est votre maître de période — il oriente l'énergie fondamentale dans laquelle vous avez émergé."
    },
    porteur: {
        title: "Porteur d'Année K'iche'",
        text: "Le porteur d'année gouverne le cycle annuel pour toute la collectivité. Il colore l'énergie collective et influence le contexte dans lequel se déroulent les événements. L'année de naissance révèle dans quel souffle cosmique vous êtes arrivé."
    },
    seigneur: {
        title: "Seigneur de la Nuit",
        text: "Les Bolontiku — les Neuf Seigneurs de la Nuit — forment un cycle de 9 nuits qui court en permanence en parallèle du Tzolk'in. La nuit de votre naissance était placée sous le règne de l'un d'eux : une énergie souterraine, nocturne et intérieure qui complète votre kin solaire. Là où le nawal du jour révèle qui vous êtes dans la lumière — vos dons, votre mission, votre dynamique sociale —, le Seigneur de la Nuit révèle qui vous êtes dans l'ombre : votre monde intérieur, vos rêves, vos processus invisibles, votre rapport à l'inconscient et aux forces cachées de la vie. Ensemble, ils forment le double fil de votre être."
    }
};

// ============================================================================
// PALETTES DE COULEURS (fonds solides pour les paragraphes)
// ============================================================================

// Fonds solides par direction/couleur du peuple maïs
const COLOR_PALETTES = {
    rouge: { bg: '#e57373', border: '#c0392b', textColor: '#4a0f0f' },  // Est
    blanc: { bg: '#f0f0f0', border: '#9e9e9e', textColor: '#333333' },  // Nord
    bleu:  { bg: '#64b5f6', border: '#2471a3', textColor: '#0d2d4a' },  // Ouest
    jaune: { bg: '#ffd54f', border: '#c9a010', textColor: '#3a2400' },  // Sud
    noir:  { bg: '#1a1a1a', border: '#444',    textColor: '#ffffff'  }   // Seigneurs de la Nuit uniquement
};

// ============================================================================
// OUVERTURE DE LA MODALE
// ============================================================================

function openCroixMayaModal(personName, glyphId, numberId, birthDate) {
    if (!window.TzolkinCore) { console.error('TzolkinCore non disponible'); return; }
    const modal = document.getElementById('croix-maya-modal');
    if (!modal) { console.error('Modale croix-maya-modal introuvable'); return; }

    // Calculs de base
    const cross   = window.TzolkinCore.calculateCroixMaya(glyphId, numberId);
    const thisYear = new Date().getFullYear();

    // Seigneur de la nuit (nécessite la date complète)
    let lordNum     = null;
    let birthYear   = null;
    let birthBearer = null;

    if (birthDate) {
        const ref      = new Date('2025-04-22');
        const bd       = new Date(birthDate);
        const diffDays = Math.floor((bd - ref) / (1000 * 60 * 60 * 24));
        lordNum        = window.TzolkinCore.calculateLordOfNight(diffDays);
        birthYear      = bd.getFullYear();
        birthBearer    = window.TzolkinCore.getYearBearerGlyph(birthYear);
    }

    const currentBearer = window.TzolkinCore.getYearBearerGlyph(thisYear);

    // --- Nom ---
    document.getElementById('croix-maya-person-name').textContent = personName;

    // --- Seigneur de la Nuit (au-dessus de la grille) ---
    renderLordOfNight('croix-lord-section', lordNum);

    // --- Grille en croix (Nord haut, Ouest-Centre-Est milieu, Sud bas) ---
    renderCrossPosition('croix-nord',    cross.nord,   'Nord · Guide');
    renderCrossPosition('croix-ouest',   cross.ouest,  'Ouest · Mission');
    renderCrossPosition('croix-centre',  cross.centre, 'Kin de Naissance');
    renderCrossPosition('croix-est',     cross.est,    'Est · Conception');
    renderCrossPosition('croix-sud',     cross.sud,    'Sud · Soutien');

    // --- Porteur d'année (glyph uniquement, avant les paragraphes) ---
    renderYearBearerGlyphs('croix-bearers-section', currentBearer, thisYear, birthBearer, birthYear);

    // --- Paragraphes explicatifs ---
    renderParagraphs('croix-paragraphs', cross, lordNum, currentBearer, birthBearer, birthYear);

    modal.style.display = 'block';
    modal.scrollTop = 0;
}

function closeCroixMayaModal() {
    const modal = document.getElementById('croix-maya-modal');
    if (modal) modal.style.display = 'none';
    closeLordDetail();
}

// ============================================================================
// RENDU — SEIGNEUR DE LA NUIT (au-dessus de la grille)
// ============================================================================

function renderLordOfNight(containerId, lordNum) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!lordNum) {
        el.style.display = 'none';
        return;
    }

    const lord   = window.TzolkinCore.LORDS_OF_NIGHT[lordNum];
    const imgURL = window.TzolkinCore.getLordOfNightURL(lordNum);
    el.style.display = '';
    el.style.cursor = 'pointer';
    el.onclick = () => openLordDetail(lordNum);

    el.innerHTML = `
        <div style="display:flex; align-items:center; gap:14px; padding:12px 16px; background:#1a1a1a; border-radius:12px; border:2px solid #444; margin-bottom:12px;">
            <div style="flex:1; text-align:right;">
                <div style="font-size:14px; color:#ccc; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:2px;">Seigneur de la Nuit · G${lordNum}</div>
                <div style="font-size:18px; font-weight:bold; color:#fff; font-family:'Summer',cursive;">${lord.name}</div>
                <div style="font-size:15px; color:#eee; margin-top:2px;">${lord.domain}</div>
            </div>
            ${imgURL
                ? `<img src="${imgURL}" alt="G${lordNum}" style="height:52px; width:auto; flex-shrink:0; filter:invert(1);">`
                : `<div style="width:52px; height:52px; flex-shrink:0; border-radius:8px; background:#333; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold; color:#aaa;">G${lordNum}</div>`}
        </div>
    `;
}

// ============================================================================
// RENDU — POSITION DE LA CROIX
// ============================================================================

function renderCrossPosition(containerId, pos, label) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const g        = pos.glyphId;
    const n        = pos.numberId;
    const glyph    = window.TzolkinCore.GLYPHS[g];
    const css      = window.TzolkinCore.getGlyphColorCSS(g);
    const glyphURL = window.TzolkinCore.getGlyphURL(g);
    const numURL   = window.TzolkinCore.getNumberURL(n);
    const isCentre = containerId === 'croix-centre';

    // Tous les blocs : couleur du maïs. Centre : bordure épaisse pour le distinguer.
    el.style.background  = css.bg;
    el.style.borderColor = css.border;
    el.style.borderWidth = isCentre ? '3px' : '2px';
    el.style.cursor = 'pointer';
    el.onclick = () => { if (typeof showDetail === 'function') showDetail('glyph', g); };

    el.innerHTML = `
        <div style="font-size:13px; color:${css.text}; margin-bottom:4px; font-style:italic; text-align:center; line-height:1.2;">${label}</div>
        <div style="display:flex; align-items:center; justify-content:center; gap:3px; margin-bottom:3px;">
            <img src="${numURL}"   alt="${n}"          style="height:22px; width:auto;">
            <img src="${glyphURL}" alt="${glyph.name}" style="height:36px; width:auto;">
        </div>
        <div style="font-size:15px; font-weight:bold; color:${css.text}; text-align:center; line-height:1.2;">${n} ${glyph.name}</div>
        <div style="font-size:13px; color:${css.text}; text-align:center;">${glyph.translation}</div>
    `;
}

// ============================================================================
// RENDU — PORTEURS D'ANNÉE (glyphes visuels, avant les paragraphes)
// ============================================================================

function renderYearBearerGlyphs(containerId, currentBearer, currentYear, birthBearer, birthYear) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const renderOne = (bearerGlyphId, year, label) => {
        const glyph    = window.TzolkinCore.GLYPHS[bearerGlyphId];
        const glyphURL = window.TzolkinCore.getGlyphURL(bearerGlyphId);
        const pal      = COLOR_PALETTES[glyph.color];
        return `
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer;"
                 onclick="if(typeof showDetail==='function') showDetail('glyph', ${bearerGlyphId})">
                <div style="font-size:15px; color:#222; text-align:center;">${label} ${year}</div>
                <div style="background:${pal.bg}; border:2px solid ${pal.border}; border-radius:12px; padding:6px 10px;">
                    <img src="${glyphURL}" alt="${glyph.name}" style="height:50px; width:auto; display:block;">
                </div>
                <div style="font-size:16px; font-weight:bold; color:#222; text-align:center; font-family:'Summer',cursive;">${glyph.name}</div>
            </div>`;
    };

    el.innerHTML = `
        <p style="font-family:'Summer',cursive; font-size:16px; color:#222; margin:0 0 10px 0; text-align:center; font-weight:bold;">🏔 Porteurs d'Année K'iche'</p>
        <div style="display:flex; justify-content:center; gap:24px; flex-wrap:wrap;">
            ${renderOne(currentBearer, currentYear, 'Année en cours')}
            ${birthBearer ? renderOne(birthBearer, birthYear, 'Année de naissance') : ''}
        </div>
    `;
}

// ============================================================================
// RENDU — PARAGRAPHES EXPLICATIFS
// ============================================================================

function renderParagraphs(containerId, cross, lordNum, currentBearer, birthBearer, birthYear) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const blocks = [
        { pos: cross.centre, key: 'centre', posName: 'Kin de Naissance' },
        { pos: cross.nord,   key: 'nord',   posName: 'Nord · Guide'     },
        { pos: cross.ouest,  key: 'ouest',  posName: 'Ouest · Mission'  },
        { pos: cross.est,    key: 'est',    posName: 'Est · Conception' },
        { pos: cross.sud,    key: 'sud',    posName: 'Sud · Soutien'    }
    ];

    let html = '';

    // Bouton ">" vert réutilisable
    const btnDetail = (type, id) =>
        `<button onclick="window.tzolkinDetailsDisplay.openDetailModal('${type}', ${id})"
            style="padding:8px 12px; background:#5e832a; color:white; border:none; border-radius:5px; cursor:pointer; font-size:16px; font-family:'Simplifica',sans-serif; flex-shrink:0; line-height:1;">&rsaquo;</button>`;

    // Paragraphes des 5 positions de la croix
    blocks.forEach(({ pos, key, posName }) => {
        const g      = pos.glyphId;
        const n      = pos.numberId;
        const glyph  = window.TzolkinCore.GLYPHS[g];
        const color  = window.TzolkinCore.getGlyphColor(g);
        const pal    = COLOR_PALETTES[color];
        const pt     = POSITION_TEXTS[key];
        const imgURL = window.TzolkinCore.getGlyphURL(g);

        html += `
        <div style="padding:14px 16px; background:${pal.bg}; border-radius:12px; border-left:4px solid ${pal.border}; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <img src="${imgURL}" alt="${glyph.name}" style="height:30px; width:auto; opacity:0.85;">
                <div style="flex:1;">
                    <div style="font-size:14px; color:${pal.textColor}; font-style:italic;">${pt.title}</div>
                    <div style="font-size:16px; font-weight:bold; color:${pal.textColor}; font-family:'Summer',cursive;">${n} ${glyph.name} · ${glyph.translation}</div>
                </div>
                ${btnDetail('glyph', g)}
            </div>
            <p style="margin:0; font-size:16px; color:${pal.textColor}; line-height:1.6;">${pt.text}</p>
        </div>`;
    });

    // Seigneur de la Nuit — texte générique + bouton détail
    if (lordNum) {
        const lord   = window.TzolkinCore.LORDS_OF_NIGHT[lordNum];
        const imgURL = window.TzolkinCore.getLordOfNightURL(lordNum);
        const pal    = COLOR_PALETTES.noir;
        html += `
        <div style="padding:14px 16px; background:${pal.bg}; border-radius:12px; border-left:4px solid #555; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                ${imgURL
                    ? `<img src="${imgURL}" alt="G${lordNum}" style="height:30px; width:auto; filter:invert(1); opacity:0.85;">`
                    : `<div style="width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:bold; color:#ccc;">G${lordNum}</div>`}
                <div style="flex:1;">
                    <div style="font-size:14px; color:#ddd; font-style:italic;">${POSITION_TEXTS.seigneur.title} · G${lordNum}</div>
                    <div style="font-size:16px; font-weight:bold; color:#fff; font-family:'Summer',cursive;">${lord.name} · ${lord.domain}</div>
                </div>
                <button onclick="openLordDetail(${lordNum})"
                    style="padding:8px 12px; background:#5e832a; color:white; border:none; border-radius:5px; cursor:pointer; font-size:16px; font-family:'Simplifica',sans-serif; flex-shrink:0; line-height:1;">&rsaquo;</button>
            </div>
            <p style="margin:0; font-size:16px; color:#e0e0e0; line-height:1.6;">${POSITION_TEXTS.seigneur.text}</p>
        </div>`;
    }

    // Trécéna de naissance — le nawal qui ouvre la période de 13 jours
    // Formule : trecenaGlyph = modAdjust(glyphId - numberId + 1, 20)
    // En 1-indexé : ((glyphId - numberId) % 20 + 20) % 20 + 1
    const tg     = ((cross.centre.glyphId - cross.centre.numberId) % 20 + 20) % 20 + 1;
    const tGlyph = window.TzolkinCore.GLYPHS[tg];
    const tColor = window.TzolkinCore.getGlyphColor(tg);
    const tPal   = COLOR_PALETTES[tColor];
    const tURL   = window.TzolkinCore.getGlyphURL(tg);
    const tNum   = window.TzolkinCore.getNumberURL(1);
    html += `
    <div style="padding:14px 16px; background:${tPal.bg}; border-radius:12px; border-left:4px solid ${tPal.border}; margin-bottom:10px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:4px;">
                <img src="${tNum}" alt="1" style="height:22px; width:auto; opacity:0.85;">
                <img src="${tURL}" alt="${tGlyph.name}" style="height:30px; width:auto; opacity:0.85;">
            </div>
            <div style="flex:1;">
                <div style="font-size:14px; color:${tPal.textColor}; font-style:italic;">${POSITION_TEXTS.trecena.title}</div>
                <div style="font-size:16px; font-weight:bold; color:${tPal.textColor}; font-family:'Summer',cursive;">1 ${tGlyph.name} · ${tGlyph.translation}</div>
            </div>
            ${btnDetail('trecena', tg)}
        </div>
        <p style="margin:0; font-size:16px; color:${tPal.textColor}; line-height:1.6;">${POSITION_TEXTS.trecena.text}</p>
    </div>`;

    // Porteur d'année — basé sur l'année de naissance (ou année en cours si pas de date)
    const displayBearer = birthBearer || currentBearer;
    const displayYear   = birthBearer ? birthYear : new Date().getFullYear();
    const bearerPal     = COLOR_PALETTES[window.TzolkinCore.getGlyphColor(displayBearer)];
    const bearerGlyph   = window.TzolkinCore.GLYPHS[displayBearer];
    const bearerURL     = window.TzolkinCore.getGlyphURL(displayBearer);
    const pt            = POSITION_TEXTS.porteur;
    html += `
    <div style="padding:14px 16px; background:${bearerPal.bg}; border-radius:12px; border-left:4px solid ${bearerPal.border}; margin-bottom:10px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <img src="${bearerURL}" alt="${bearerGlyph.name}" style="height:30px; width:auto; opacity:0.85;">
            <div style="flex:1;">
                <div style="font-size:14px; color:${bearerPal.textColor}; font-style:italic;">${pt.title} · Naissance ${displayYear}</div>
                <div style="font-size:16px; font-weight:bold; color:${bearerPal.textColor}; font-family:'Summer',cursive;">${bearerGlyph.name} · ${bearerGlyph.translation}</div>
            </div>
            ${btnDetail('porteur', displayBearer)}
        </div>
        <p style="margin:0; font-size:16px; color:${bearerPal.textColor}; line-height:1.6;">${pt.text}</p>
    </div>`;

    el.innerHTML = html;
}

// ============================================================================
// ACCÈS PAR INDEX (évite l'échappement des noms dans les attributs HTML)
// ============================================================================

function openCroixMayaModalByIndex(idx) {
    const people = window._tzolkinLastMatchingPeople;
    if (!people || !people[idx]) {
        console.error('Données matchingPeople non disponibles pour index', idx);
        return;
    }
    const p = people[idx];
    openCroixMayaModal(p.name, p.personGlyphId, p.personNumberId, p.birthDate || null);
}

// ============================================================================
// DÉTAIL SEIGNEUR DE LA NUIT — overlay plein écran
// ============================================================================

function openLordDetail(lordNum) {
    if (!window.TzolkinCore) return;
    const lord   = window.TzolkinCore.LORDS_OF_NIGHT[lordNum];
    const imgURL = window.TzolkinCore.getLordOfNightURL(lordNum);
    if (!lord) return;

    let overlay = document.getElementById('lord-detail-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'lord-detail-overlay';
        document.body.appendChild(overlay);
    }

    overlay.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
        'z-index:2300', 'overflow-y:auto', 'display:none',
        'background:url("./assets/x-balanque.png") no-repeat center center fixed',
        'background-size:cover', 'filter:invert(100%)'
    ].join(';');
    overlay.style.paddingTop = 'calc(env(safe-area-inset-top, 0px) + 20px)';
    overlay.style.paddingBottom = 'calc(env(safe-area-inset-bottom, 0px) + 20px)';

    overlay.innerHTML = `
        <div style="padding: 20px; max-width: 800px; margin: 0 auto; position: relative;">
            <button onclick="closeLordDetail()"
                style="padding: 8px 16px; background: #222; color: #ded2b3; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 20px; font-family: 'Summer', cursive; font-size: 18px; display: inline-block;">← Retour</button>

            <div style="background: #ded2b3; border: 2px solid #222; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.09); max-width: 500px; margin: 0 auto;">
                ${imgURL ? `<img src="${imgURL}" alt="G${lordNum}" style="max-width: 100px; height: auto; display: block; margin: 0 auto 10px;">` : ''}
                <h3 style="text-align: center; font-size: 1.5em; margin: 10px 0 5px; color: #333; font-family: 'Summer', cursive;">${lord.name}</h3>
                <p style="text-align: center; font-size: 13px; color: #888; margin: 0 0 20px; font-style: italic;">${lord.domain}</p>
                <div style="font-family: 'Simplifica', sans-serif; font-size: 20px; color: #555; line-height: 1.6;">
                    ${lord.description}
                </div>
            </div>

            <div style="height: 80px;"></div>
        </div>

        <div id="lord-scroll-top" onclick="document.getElementById('lord-detail-overlay').scrollTop=0"
            style="position: fixed; bottom: 40px; right: 30px; width: 44px; height: 44px; background: #222; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 2301;">
            <svg xmlns="http://www.w3.org/2000/svg" width="36px" height="22px" viewBox="57 35.171 26 16.043">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" fill="#ded2b3" style="transform: rotate(180deg); transform-origin: 70px 43px;"/>
            </svg>
        </div>
    `;

    overlay.style.display = 'block';
    overlay.scrollTop = 0;
}

function closeLordDetail() {
    const overlay = document.getElementById('lord-detail-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ============================================================================
// EXPORT GLOBAL
// ============================================================================

window.openCroixMayaModal        = openCroixMayaModal;
window.openCroixMayaModalByIndex  = openCroixMayaModalByIndex;
window.closeCroixMayaModal       = closeCroixMayaModal;
window.openLordDetail            = openLordDetail;
window.closeLordDetail           = closeLordDetail;

console.log("✅ Tzolk'in Croix Maya chargé");
