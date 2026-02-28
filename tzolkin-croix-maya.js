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
        text: "Les Bolontiku (Neuf Dieux) gouvernent un cycle de 9 nuits en rotation permanente. Chaque naissance tombe sous le règne de l'un d'eux — énergie souterraine et nocturne qui agit en arrière-plan, révélant la face cachée de votre être."
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

    el.innerHTML = `
        <div style="display:flex; align-items:center; gap:14px; padding:12px 16px; background:#1a1a1a; border-radius:12px; border:2px solid #444; margin-bottom:12px;">
            <div style="flex:1; text-align:right;">
                <div style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:2px;">Seigneur de la Nuit · G${lordNum}</div>
                <div style="font-size:18px; font-weight:bold; color:#fff; font-family:'Summer',cursive;">${lord.name}</div>
                <div style="font-size:12px; color:#bbb; margin-top:2px;">${lord.domain}</div>
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

    el.innerHTML = `
        <div style="font-size:10px; color:${css.text}; margin-bottom:4px; font-style:italic; text-align:center; line-height:1.2;">${label}</div>
        <div style="display:flex; align-items:center; justify-content:center; gap:3px; margin-bottom:3px;">
            <img src="${numURL}"   alt="${n}"          style="height:22px; width:auto;">
            <img src="${glyphURL}" alt="${glyph.name}" style="height:36px; width:auto;">
        </div>
        <div style="font-size:12px; font-weight:bold; color:${css.text}; text-align:center; line-height:1.2;">${n} ${glyph.name}</div>
        <div style="font-size:10px; color:${css.text}; text-align:center; opacity:0.8;">${glyph.translation}</div>
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
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <div style="font-size:11px; color:#888; text-align:center;">${label} ${year}</div>
                <div style="background:${pal.bg}; border:2px solid ${pal.border}; border-radius:12px; padding:6px 10px;">
                    <img src="${glyphURL}" alt="${glyph.name}" style="height:50px; width:auto; display:block;">
                </div>
                <div style="font-size:14px; font-weight:bold; color:#333; text-align:center; font-family:'Summer',cursive;">${glyph.name}</div>
            </div>`;
    };

    el.innerHTML = `
        <p style="font-family:'Summer',cursive; font-size:16px; color:#c19434; margin:0 0 10px 0; text-align:center;">🏔 Porteurs d'Année K'iche'</p>
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
                    <div style="font-size:12px; color:${pal.textColor}; opacity:0.75; font-style:italic;">${pt.title}</div>
                    <div style="font-size:16px; font-weight:bold; color:${pal.textColor}; font-family:'Summer',cursive;">${n} ${glyph.name} · ${glyph.translation}</div>
                </div>
                ${btnDetail('glyph', g)}
            </div>
            <p style="margin:0; font-size:14px; color:${pal.textColor}; line-height:1.6;">${pt.text}</p>
        </div>`;
    });

    // Seigneur de la Nuit (pas de bouton ">" — pas de fiche détail)
    if (lordNum) {
        const lord   = window.TzolkinCore.LORDS_OF_NIGHT[lordNum];
        const imgURL = window.TzolkinCore.getLordOfNightURL(lordNum);
        const pal    = COLOR_PALETTES.noir;
        html += `
        <div style="padding:14px 16px; background:${pal.bg}; border-radius:12px; border-left:4px solid #555; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                ${imgURL
                    ? `<img src="${imgURL}" alt="G${lordNum}" style="height:30px; width:auto; filter:invert(1); opacity:0.85;">`
                    : `<div style="width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:bold; color:#aaa;">G${lordNum}</div>`}
                <div>
                    <div style="font-size:12px; color:#aaa; font-style:italic;">${POSITION_TEXTS.seigneur.title} · G${lordNum}</div>
                    <div style="font-size:16px; font-weight:bold; color:#fff; font-family:'Summer',cursive;">${lord.name} · ${lord.domain}</div>
                </div>
            </div>
            <p style="margin:0; font-size:14px; color:#e0e0e0; line-height:1.6;">${lord.description}</p>
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
                <div style="font-size:12px; color:${tPal.textColor}; opacity:0.75; font-style:italic;">${POSITION_TEXTS.trecena.title}</div>
                <div style="font-size:16px; font-weight:bold; color:${tPal.textColor}; font-family:'Summer',cursive;">1 ${tGlyph.name} · ${tGlyph.translation}</div>
            </div>
            ${btnDetail('trecena', tg)}
        </div>
        <p style="margin:0; font-size:14px; color:${tPal.textColor}; line-height:1.6;">${POSITION_TEXTS.trecena.text}</p>
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
                <div style="font-size:12px; color:${bearerPal.textColor}; opacity:0.75; font-style:italic;">${pt.title} · Naissance ${displayYear}</div>
                <div style="font-size:16px; font-weight:bold; color:${bearerPal.textColor}; font-family:'Summer',cursive;">${bearerGlyph.name} · ${bearerGlyph.translation}</div>
            </div>
            ${btnDetail('porteur', displayBearer)}
        </div>
        <p style="margin:0; font-size:14px; color:${bearerPal.textColor}; line-height:1.6;">${pt.text}</p>
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
// EXPORT GLOBAL
// ============================================================================

window.openCroixMayaModal       = openCroixMayaModal;
window.openCroixMayaModalByIndex = openCroixMayaModalByIndex;
window.closeCroixMayaModal      = closeCroixMayaModal;

console.log("✅ Tzolk'in Croix Maya chargé");
