/**
 * Tzolk'in Core - Moteur de calcul du calendrier Maya
 * Version: 2.0 (conversion JavaScript autonome)
 * Auteur: Alexandre Ferran + Claude AI
 * Date: Février 2026
 */

// ============================================================================
// DONNÉES DU CALENDRIER TZOLK'IN
// ============================================================================

/**
 * Les 20 glyphes Maya (Nawals)
 * Chaque glyphe a un nom, un fichier SVG et une signification
 */
// Peuple Maïs K'iche' — 4 familles de nawals :
// rouge = Est  (Chuen, Chicchan, Manik, Men, Ahau)
// blanc = Nord (Imix, Kan, Muluc, Eb, Ben)
// bleu  = Ouest/Nuit (Akbal, Cimi, Cib, Caban, Etznab)  ← 'noir' réservé aux Seigneurs de la Nuit
// jaune = Sud  (Ik, Lamat, Oc, Ix, Cauac)
const GLYPHS = {
    1:  { name: 'Imix',    file: 'MAYA-g-log-cal-D01-Imix.svg',    translation: 'Crocodile',           color: 'blanc' },
    2:  { name: 'Ik',      file: 'MAYA-g-log-cal-D02-Ik.svg',      translation: 'Vent',                color: 'jaune' },
    3:  { name: 'Akbal',   file: 'MAYA-g-log-cal-D03-Akbal.svg',   translation: 'Nuit',                color: 'rouge' },
    4:  { name: 'Kan',     file: 'MAYA-g-log-cal-D04-Kan.svg',     translation: 'Graine',              color: 'bleu'  },
    5:  { name: 'Chicchan',file: 'MAYA-g-log-cal-D05-Chikchan.svg',translation: 'Serpent Céleste',     color: 'blanc' },
    6:  { name: 'Cimi',    file: 'MAYA-g-log-cal-D06-Kimi.svg',    translation: 'Mort',                color: 'jaune' },
    7:  { name: 'Manik',   file: 'MAYA-g-log-cal-D07-Manik.svg',   translation: 'Cerf',                color: 'rouge' },
    8:  { name: 'Lamat',   file: 'MAYA-g-log-cal-D08-Lamat.svg',   translation: 'Lapin',               color: 'bleu'  },
    9:  { name: 'Muluc',   file: 'MAYA-g-log-cal-D09-Muluk.svg',   translation: 'Eau',                 color: 'blanc' },
    10: { name: 'Oc',      file: 'MAYA-g-log-cal-D10-Ok_b.svg',    translation: 'Chien',               color: 'jaune' },
    11: { name: 'Chuen',   file: 'MAYA-g-log-cal-D11-Chuwen.svg',  translation: 'Singe',               color: 'rouge' },
    12: { name: 'Eb',      file: 'MAYA-g-log-cal-D12-Eb.svg',      translation: 'Route',               color: 'bleu'  },
    13: { name: 'Ben',     file: 'MAYA-g-log-cal-D13-Ben.svg',     translation: 'Roseau',              color: 'blanc' },
    14: { name: 'Ix',      file: 'MAYA-g-log-cal-D14-Ix.svg',      translation: 'Jaguar',              color: 'jaune' },
    15: { name: 'Men',     file: 'MAYA-g-log-cal-D15-Men.svg',     translation: 'Aigle',               color: 'rouge' },
    16: { name: 'Cib',     file: 'MAYA-g-log-cal-D16-Kib.svg',     translation: 'Vautour',             color: 'bleu'  },
    17: { name: 'Caban',   file: 'MAYA-g-log-cal-D17-Kaban.svg',   translation: 'Terre',               color: 'blanc' },
    18: { name: 'Etznab',  file: 'MAYA-g-log-cal-D18-Etznab.svg',  translation: "Couteau d'Obsidienne",color: 'jaune' },
    19: { name: 'Cauac',   file: 'MAYA-g-log-cal-D19-Kawak.svg',   translation: 'Tempête',             color: 'rouge' },
    20: { name: 'Ahau',    file: 'MAYA-g-log-cal-D20-Ajaw.svg',    translation: 'Soleil',              color: 'bleu'  }
};

/**
 * Les 13 nombres Maya
 * Chaque nombre a un nom maya et un fichier SVG
 */
const NUMBERS = {
    1: { name: 'Hun', file: 'Maya_1.svg' },
    2: { name: 'Ca', file: 'Maya_2.svg' },
    3: { name: 'Ox', file: 'Maya_3.svg' },
    4: { name: 'Can', file: 'Maya_4.svg' },
    5: { name: 'Ho', file: 'Maya_5.svg' },
    6: { name: 'Wak', file: 'Maya_6.svg' },
    7: { name: 'Uuc', file: 'Maya_7.svg' },
    8: { name: 'Waxak', file: 'Maya_8.svg' },
    9: { name: 'Bolon', file: 'Maya_9.svg' },
    10: { name: 'Lahun', file: 'Maya_10.svg' },
    11: { name: 'Buluc', file: 'Maya_11.svg' },
    12: { name: 'Lahca', file: 'Maya_12.svg' },
    13: { name: 'Oxlahun', file: 'Maya_13.svg' }
};

/**
 * Les 20 trécénas (périodes de 13 jours)
 * Chaque trécéna est nommée d'après son premier jour (glyphe)
 */
const TRECENAS = {
    1: {
        name: 'Imix',
        translation: 'Crocodile',
        description: 'Imix est associé à la création, aux rêves et à l\'énergie primordiale de la Mère. C\'est une période pour faire confiance à l\'univers et se connecter avec la terre et l\'eau.'
    },
    2: {
        name: 'Ik\'',
        translation: 'Vent',
        description: 'Ik\' est lié à la communication, à l\'imagination et à l\'inspiration. C\'est un moment propice aux nouvelles conversations et à l\'ouverture aux changements.'
    },
    3: {
        name: 'Ak\'bal',
        translation: 'Nuit',
        description: 'Ak\'bal traite de l\'ombre et de la lumière, ainsi que de la dualité. C\'est une période pour la réflexion et la recherche de la sagesse intérieure.'
    },
    4: {
        name: 'Kan',
        translation: 'Graine',
        description: 'Kan est associé à la sagesse, au pouvoir et à la force vitale. C\'est un moment propice à l\'apprentissage et à l\'évolution spirituelle.'
    },
    5: {
        name: 'Chicchan',
        translation: 'Serpent Céleste',
        description: 'Chicchan met en lumière l\'énergie vitale et la passion. C\'est un moment puissant et potentiellement transformateur.'
    },
    6: {
        name: 'Cimi',
        translation: 'Mort',
        description: 'Cimi aborde les thèmes de la mort et du lâcher-prise. C\'est une période de changement profond et de renouveau spirituel.'
    },
    7: {
        name: 'Manik',
        translation: 'Cerf',
        description: 'Manik incarne la liberté, l\'équilibre et la connexion avec la nature. Ce glyphe symbolise l\'honneur et l\'harmonie.'
    },
    8: {
        name: 'Lamat',
        translation: 'Lapin',
        description: 'Lamat représente l\'étoile, la beauté et l\'harmonie cosmique. Ce glyphe est associé à la créativité et à la prospérité.'
    },
    9: {
        name: 'Muluc',
        translation: 'Eau',
        description: 'Muluc symbolise les émotions, la purification et le flux de la vie. Ce glyphe invite à écouter son intuition.'
    },
    10: {
        name: 'Oc',
        translation: 'Chien',
        description: 'Oc représente la loyauté, l\'amour et la protection. Ce glyphe incarne la fidélité et les connexions émotionnelles.'
    },
    11: {
        name: 'Chuen',
        translation: 'Singe',
        description: 'Chuen symbolise la créativité, le jeu et l\'humour. Ce glyphe incarne l\'esprit artistique et la spontanéité.'
    },
    12: {
        name: 'Eb',
        translation: 'Humain',
        description: 'Eb représente l\'humain, la route de la vie et les relations. Ce glyphe est lié à la gratitude et à la communauté.'
    },
    13: {
        name: 'Ben',
        translation: 'Roseau',
        description: 'Ben symbolise la croissance, l\'autorité spirituelle et la connexion entre la terre et le ciel.'
    },
    14: {
        name: 'Ix',
        translation: 'Jaguar',
        description: 'Ix incarne la magie, la puissance et la connexion avec la terre. Ce glyphe représente la sagesse chamanique.'
    },
    15: {
        name: 'Men',
        translation: 'Aigle',
        description: 'Men représente la vision, la liberté et la conscience supérieure. Ce glyphe est lié à l\'inspiration et à la perspective élevée.'
    },
    16: {
        name: 'Cib',
        translation: 'Vautour',
        description: 'Cib symbolise la patience, la purification et la sagesse ancestrale. Ce glyphe invite à accepter les cycles naturels.'
    },
    17: {
        name: 'Caban',
        translation: 'Terre',
        description: 'Caban représente le mouvement, l\'évolution et la synchronicité. Ce glyphe incarne l\'énergie planétaire.'
    },
    18: {
        name: 'Etznab',
        translation: 'Couteau d\'Obsidienne',
        description: 'Etznab symbolise la vérité, la réflexion et la clarté. Ce glyphe invite à affronter ses ombres.'
    },
    19: {
        name: 'Cauac',
        translation: 'Orage',
        description: 'Cauac représente l\'orage, la transformation et l\'énergie purificatrice. Ce glyphe apporte le renouveau à travers le chaos.'
    },
    20: {
        name: 'Ahau',
        translation: 'Soleil',
        description: 'Ahau incarne le soleil, la lumière et la maîtrise. Ce glyphe symbolise l\'illumination et l\'accomplissement.'
    }
};

// ============================================================================
// CONSTANTES DE CALCUL
// ============================================================================

/**
 * Date de référence du calendrier Tzolk'in
 * Cette date correspond à 11 Chicchan dans le calendrier
 */
const BASE_DATE = new Date('2025-04-22');
const BASE_GLYPH = 5;  // Chicchan
const BASE_NUMBER = 11; // 11

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Modulo ajusté pour le calendrier Maya
 * Garantit un résultat entre 1 et m (au lieu de 0 et m-1)
 *
 * @param {number} x - Valeur à calculer
 * @param {number} m - Modulo
 * @returns {number} Résultat entre 1 et m
 */
function modAdjust(x, m) {
    let result = x % m;
    if (result <= 0) result += m;
    return result;
}

/**
 * Calcule le jour Tzolk'in pour une date donnée
 *
 * @param {Date} date - Date grégorienne
 * @returns {Object} { glyphId, numberId, glyphName, numberName, gregorian }
 */
function calculateTzolkin(date) {
    // Calculer le nombre de jours depuis la date de référence
    const diffTime = date - BASE_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculer glyphe et nombre
    const glyphId = modAdjust(BASE_GLYPH + diffDays, 20);
    const numberId = modAdjust(BASE_NUMBER + diffDays, 13);

    return {
        glyphId,
        numberId,
        glyphName: GLYPHS[glyphId].name,
        numberName: NUMBERS[numberId].name,
        gregorian: date.toLocaleDateString('fr-FR')
    };
}

/**
 * Calcule la trécéna pour un jour Tzolk'in donné
 * La trécéna commence au jour 1 du glyphe
 *
 * @param {number} glyphId - ID du glyphe (1-20)
 * @param {number} numberId - ID du nombre (1-13)
 * @returns {number} ID du glyphe de la trécéna
 */
function getTrecenaGlyph(glyphId, numberId) {
    // La trécéna est le glyphe du jour 1
    // On soustrait (numberId - 1) pour revenir au jour 1
    const daysToSubtract = numberId - 1;
    return modAdjust(glyphId - daysToSubtract, 20);
}

/**
 * Calcule les glyphes d'un cycle de 40 jours
 * Utilisé pour identifier les jours importants d'une personne
 *
 * @param {number} glyphId - Glyphe de départ
 * @returns {Array<number>} 4 glyphes du cycle
 */
function getCycleGlyphs(glyphId) {
    return [
        glyphId,
        modAdjust(glyphId + 5, 20),
        modAdjust(glyphId + 10, 20),
        modAdjust(glyphId + 15, 20)
    ];
}

/**
 * Calcule les nombres d'un cycle
 *
 * @param {number} numberId - Nombre de départ
 * @returns {Array<number>} 3 nombres du cycle
 */
function getCycleNumbers(numberId) {
    return [
        modAdjust(numberId - 7, 13),
        numberId,
        modAdjust(numberId - 6, 13)
    ];
}

/**
 * Trouve l'index du jour dans le calendrier Tzolk'in (1-260)
 *
 * @param {number} glyphId - Glyphe (1-20)
 * @param {number} numberId - Nombre (1-13)
 * @returns {number} Position dans le cycle de 260 jours
 */
function findDayIndex(glyphId, numberId) {
    const c1 = numberId - 1;
    const g1 = glyphId - 1;
    return (20 * c1 * 17 + 13 * g1 * 10) % 260 + 1;
}

/**
 * Calcule une fenêtre de 40 jours autour d'un jour central
 * Utilisé pour identifier les périodes énergétiques
 *
 * @param {number} centerDay - Jour central (1-260)
 * @returns {Array<number>} 40 jours autour du centre
 */
function getFortyDayWindow(centerDay) {
    const window = [];
    for (let i = -20; i <= 19; i++) {
        const day = modAdjust(centerDay + i - 1, 260);
        window.push(day);
    }
    return window.sort((a, b) => a - b);
}

/**
 * Calcule tous les jours importants d'un cycle personnel
 * Utilisé pour afficher les couleurs sur le calendrier
 *
 * @param {number} glyphId - Glyphe de naissance
 * @param {number} numberId - Nombre de naissance
 * @param {string} name - Nom de la personne
 * @param {string} color - Couleur associée
 * @returns {Object} Données du cycle complet
 */
function getCycleData(glyphId, numberId, name, color) {
    if (!Number.isInteger(glyphId) || glyphId < 1 || glyphId > 20 ||
        !Number.isInteger(numberId) || numberId < 1 || numberId > 13) {
        return { cycleDays: [], windows: {}, namePlacements: {}, color };
    }

    const cycleGlyphs = getCycleGlyphs(glyphId);
    const cycleNumbers = getCycleNumbers(numberId);
    const startDay = findDayIndex(glyphId, numberId);

    const cycleDays = [];
    const windows = {};
    const namePlacements = {};

    // Calculer les 7 occurrences du cycle
    for (let k = 0; k < 7; k++) {
        const day = modAdjust(startDay + 40 * k - 1, 260);
        const glyph = modAdjust((day - 1) % 20 + 1, 20);
        const number = modAdjust((day - 1) % 13 + 1, 13);

        const cycleNumberSet = cycleNumbers.map(cn => modAdjust(cn + k, 13));

        // Vérifier si ce jour fait partie du cycle
        if (cycleGlyphs.slice(0, 2).includes(glyph) && cycleNumberSet.includes(number)) {
            cycleDays.push({ day, glyph, number });
            windows[day] = getFortyDayWindow(day);

            // Marquer les jours spéciaux
            if (glyph === glyphId && number === numberId) {
                namePlacements[day] = `${name} (Start)`;
            } else if (glyph === cycleGlyphs[1]) {
                namePlacements[day] = `${name} (Next Glyph)`;
            }
        }
    }

    // Ajouter les glyphes supplémentaires du cycle
    for (let k = 0; k < 7; k++) {
        const day = modAdjust(startDay + 40 * k - 1, 260);
        const glyph = modAdjust((day - 1) % 20 + 1, 20);
        const number = modAdjust((day - 1) % 13 + 1, 13);

        const cycleNumberSet = cycleNumbers.map(cn => modAdjust(cn + k, 13));

        if (cycleGlyphs.slice(2).includes(glyph) && cycleNumberSet.includes(number)) {
            cycleDays.push({ day, glyph, number });
            windows[day] = getFortyDayWindow(day);
        }
    }

    // Trier par jour
    cycleDays.sort((a, b) => a.day - b.day);

    return {
        cycleDays,
        windows,
        namePlacements,
        color
    };
}

/**
 * Génère une couleur aléatoire pastel
 * Utilisé pour attribuer automatiquement une couleur aux nouveaux contacts
 *
 * @returns {string} Couleur hexadécimale (#RRGGBB)
 */
function generatePastelColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
    const lightness = 70 + Math.floor(Math.random() * 15); // 70-85%

    // Convertir HSL en RGB
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;

    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Obtenir l'URL d'un glyphe SVG
 *
 * @param {number} glyphId - ID du glyphe (1-20)
 * @returns {string} URL du fichier SVG
 */
function getGlyphURL(glyphId) {
    return `./assets/glyphs/${GLYPHS[glyphId].file}`;
}

// ============================================================================
// SEIGNEURS DE LA NUIT (BOLONTIKU) — G1 à G9
// ============================================================================

/**
 * Les 9 Seigneurs de la Nuit mayas
 * Cycle de 9 jours intégré à la Série Supplémentaire Lunaire (inscriptions classiques)
 * G9 = Pauahtun est le seul nom académiquement confirmé (consensus épigraphique)
 * G1, G4, G8 : hypothèses savantes (Kelley 1972, Frumker 1993)
 * G2-G3, G5-G7 : noms mayas du panthéon classique, domaines attestés par les codex
 */
const LORDS_OF_NIGHT = {
    1: {
        name: "K'awiil",
        domain: "Foudre · Lignée royale · Pouvoir sacré",
        description: "K'awiil est le seigneur de la foudre et de la continuité dynastique. Il gouverne les transformations puissantes, les initiations et l'héritage ancestral. Sa présence à la naissance confère un lien profond avec le pouvoir sacré et les forces des ancêtres.",
        file: 'G1.svg'
    },
    2: {
        name: "Chac",
        domain: "Pluie · Abondance · Renouveau",
        description: "Chac est le seigneur des eaux célestes et de la pluie fertilisante. Il incarne l'abondance, le renouveau et la générosité cosmique. Sa présence à la naissance apporte une sensibilité aux cycles naturels et un don pour nourrir et soutenir les autres.",
        file: 'G2.svg'
    },
    3: {
        name: "Kinich Ahau",
        domain: "Soleil · Vision · Chaleur créatrice",
        description: "Kinich Ahau est la face solaire du divin, seigneur du soleil levant et de la vision claire. Il représente la lumière de la conscience et la chaleur créatrice. Naître sous son règne confère une nature rayonnante, une aptitude au leadership et à l'illumination.",
        file: 'G3.svg'
    },
    4: {
        name: "Yum Kaax",
        domain: "Végétation · Maïs sacré · Subsistance",
        description: "Yum Kaax est le seigneur du maïs — aliment sacré des Mayas — et de toute végétation. Il incarne la fertilité, la patience et le lien profond avec la terre. Sa présence confère un talent pour faire croître les projets et nourrir les communautés.",
        file: 'G4.svg'
    },
    5: {
        name: "Ah Puch",
        domain: "Mort · Transition · Mystère du cycle",
        description: "Ah Puch est le seigneur du passage entre les mondes. Il ne représente pas la mort comme fin, mais comme transformation nécessaire dans le grand cycle. Naître sous son règne donne une profondeur particulière, la capacité à traverser les épreuves et à renaître.",
        file: 'G5.svg'
    },
    6: {
        name: "Ix Chel",
        domain: "Lune · Eau · Médecine · Divination",
        description: "Ix Chel est la grande déesse lunaire, maîtresse des eaux, de la médecine et de la divination. Les inscriptions épigraphiques associent G6 aux naissances nobles. Sa présence confère une intuition profonde, des dons de guérison et une connexion forte aux cycles lunaires.",
        file: 'G6.svg'
    },
    7: {
        name: "Buluc Chabtan",
        domain: "Feu sacré · Purification · Courage",
        description: "Buluc Chabtan est associé au feu purificateur et à l'épreuve transformatrice. Sa nature intense pousse à affronter les défis avec courage. Naître sous son règne confère une nature guerrière au sens noble — la capacité de défendre ce qui est juste et de purifier par l'action.",
        file: 'G7.svg'
    },
    8: {
        name: "Itzamna",
        domain: "Sagesse suprême · Écriture · Création",
        description: "Itzamna est le dieu suprême du panthéon maya, maître de la sagesse, de l'écriture et des calendriers sacrés. Sa présence à la naissance est signe d'une intelligence profonde, d'un don pour la connaissance et d'une connexion naturelle avec le divin et le sacré.",
        file: 'G8.svg'
    },
    9: {
        name: "Pauahtun",
        domain: "Vent · Quatre directions · Soutien cosmique",
        description: "Pauahtun est le seul Seigneur de la Nuit formellement identifié par les épigraphistes mayas. Dieu quadripartite — présent aux quatre coins du monde — il soutient le ciel et la terre. Sa présence confère une nature stable, portante, capable d'être un pilier pour les autres.",
        file: 'G9.svg'
    }
};

/**
 * Calculer le Seigneur de la Nuit pour une date donnée
 * Formule validée : 03/08/1974 = G9 (ancre de référence, 18525 jours avant le 22/04/2025)
 *
 * @param {number} diffDaysFromRef - Écart en jours depuis la référence app (22/04/2025)
 * @returns {number} Numéro du seigneur (1-9)
 */
function calculateLordOfNight(diffDaysFromRef) {
    const d = diffDaysFromRef + 18525;
    return ((d - 1) % 9 + 9) % 9 + 1;
}

/**
 * Obtenir l'URL d'une image SVG d'un Seigneur de la Nuit
 * Retourne null si l'image n'est pas disponible
 *
 * @param {number} lordNum - Numéro du seigneur (1-9)
 * @returns {string|null}
 */
function getLordOfNightURL(lordNum) {
    const file = LORDS_OF_NIGHT[lordNum]?.file;
    return file ? `./assets/seigneurs_de_la_nuit/${file}` : null;
}

/**
 * Obtenir la couleur directionnelle d'un glyphe (tradition K'iche')
 * Formule : (glyphId - 1) % 4 → 0=rouge(Est), 1=blanc(Nord), 2=bleu(Ouest), 3=jaune(Sud)
 *
 * @param {number} glyphId - ID du glyphe (1-20)
 * @returns {string} 'rouge' | 'blanc' | 'bleu' | 'jaune'
 */
function getGlyphColor(glyphId) {
    return GLYPHS[glyphId].color;
}

/**
 * Obtenir la couleur CSS rgba pour le fond d'un encart de glyphe
 *
 * @param {number} glyphId
 * @returns {{ bg: string, border: string, text: string }}
 */
function getGlyphColorCSS(glyphId) {
    const c = GLYPHS[glyphId].color;
    const map = {
        rouge: { bg: '#e57373', border: '#c0392b', text: '#4a0f0f' },
        blanc: { bg: '#f0f0f0', border: '#9e9e9e', text: '#333333' },
        bleu:  { bg: '#64b5f6', border: '#2471a3', text: '#0d2d4a' },
        jaune: { bg: '#ffd54f', border: '#c9a010', text: '#3a2400' }
    };
    return map[c];
}

/**
 * Obtenir le glyphe porteur d'année K'iche' pour une année donnée
 * Cycle : Ik(2) → Manik(7) → Eb(12) → Caban(17) → ...
 * Référence : 2025 = Ik (glyphId 2)
 *
 * @param {number} year - Année grégorienne
 * @returns {number} glyphId du porteur d'année
 */
function getYearBearerGlyph(year) {
    const BEARERS = [2, 7, 12, 17]; // Ik, Manik, Eb, Caban
    const BASE_YEAR = 2025;
    const diff = year - BASE_YEAR;
    const idx = ((diff % 4) + 4) % 4;
    return BEARERS[idx];
}

/**
 * Calculer la Croix Maya (tradition K'iche') pour un kin donné
 * 5 positions : Centre, Est (conception), Ouest (mission), Nord (guide), Sud (soutien)
 *
 * Formule (index 0-19, tons 1-13) :
 *   Est   : nawal -4, ton -4
 *   Ouest : nawal +4, ton +4
 *   Nord  : nawal +5, même ton
 *   Sud   : nawal -5, même ton
 *
 * Layout de la croix :
 *        Nord (haut)
 *   Ouest  Centre  Est
 *        Sud (bas)
 *
 * @param {number} glyphId  - Glyphe de naissance (1-20)
 * @param {number} numberId - Nombre de naissance (1-13)
 * @returns {Object} { centre, est, ouest, nord, sud }
 *   chaque position = { glyphId, numberId }
 */
function calculateCroixMaya(glyphId, numberId) {
    const centre = { glyphId, numberId };

    // Chaque position = décalage de N jours dans le Tzolk'in
    // glyph ET number avancent du même offset (cycle 20 / cycle 13)

    // Est (droite) — Conception : −8 jours (Imix=1 dans le code, offset identique à 0-indexé Imix=0 donnant -8)
    const est = {
        glyphId:  modAdjust(glyphId  - 8, 20),
        numberId: modAdjust(numberId - 8, 13)
    };

    // Ouest (gauche) — Mission / Destinée : +8 jours
    const ouest = {
        glyphId:  modAdjust(glyphId  + 8, 20),
        numberId: modAdjust(numberId + 8, 13)
    };

    // Nord (haut) — Guide : −6 jours
    const nord = {
        glyphId:  modAdjust(glyphId  - 6, 20),
        numberId: modAdjust(numberId - 6, 13)
    };

    // Sud (bas) — Soutien : +6 jours
    const sud = {
        glyphId:  modAdjust(glyphId  + 6, 20),
        numberId: modAdjust(numberId + 6, 13)
    };

    return { centre, est, ouest, nord, sud };
}

/**
 * Obtenir l'URL d'un nombre SVG
 *
 * @param {number} numberId - ID du nombre (1-13)
 * @returns {string} URL du fichier SVG
 */
function getNumberURL(numberId) {
    return `./assets/numbers/${NUMBERS[numberId].file}`;
}

// ============================================================================
// EXPORT DES FONCTIONS ET DONNÉES
// ============================================================================

// Rendre disponible globalement (pour utilisation dans d'autres fichiers)
window.TzolkinCore = {
    // Données
    GLYPHS,
    NUMBERS,
    TRECENAS,
    BASE_DATE,
    BASE_GLYPH,
    BASE_NUMBER,

    // Fonctions utilitaires
    modAdjust,
    calculateTzolkin,
    getTrecenaGlyph,
    getCycleGlyphs,
    getCycleNumbers,
    findDayIndex,
    getFortyDayWindow,
    getCycleData,
    generatePastelColor,
    getGlyphURL,
    getNumberURL,
    getGlyphColor,
    getGlyphColorCSS,
    getYearBearerGlyph,
    calculateCroixMaya,
    LORDS_OF_NIGHT,
    calculateLordOfNight,
    getLordOfNightURL
};

console.log('✅ Tzolk\'in Core chargé - Moteur de calcul prêt');
