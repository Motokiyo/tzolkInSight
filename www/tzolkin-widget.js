/**
 * Tzolk'in Widget - Génération dynamique du calendrier
 * Version: 2.0
 * Auteur: Alexandre Ferran + Claude AI
 * Date: Février 2026
 */

// ============================================================================
// CLASSE WIDGET TZOLK'IN
// ============================================================================

class TzolkinWidget {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error(`Container "${containerSelector}" not found`);
            return;
        }

        // Toujours démarrer à la date du jour à chaque ouverture de l'app
        this.offset = 0;
        window.TzolkinStorage.saveOffset(0);
        this.init();
    }

    /**
     * Initialiser le widget
     */
    init() {
        this.render();
        this.attachEventListeners();
        console.log('✅ Widget Tzolk\'in initialisé');
    }

    /**
     * Calculer les données du jour Tzolk'in actuel
     *
     * @returns {Object} Données complètes du jour
     */
    getCurrentDay() {
        // Date actuelle + offset
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + this.offset);

        // Calculer Tzolk'in
        const tzolkin = window.TzolkinCore.calculateTzolkin(currentDate);

        // Calculer trécéna
        const trecenaGlyphId = window.TzolkinCore.getTrecenaGlyph(
            tzolkin.glyphId,
            tzolkin.numberId
        );

        // Trouver les personnes correspondantes
        const matchingPeople = window.TzolkinStorage.getMatchingPeople(
            tzolkin.glyphId,
            tzolkin.numberId
        );

        return {
            ...tzolkin,
            trecenaGlyphId,
            trecenaGlyphName: window.TzolkinCore.GLYPHS[trecenaGlyphId].name,
            matchingPeople,
            currentDate
        };
    }

    /**
     * Générer le CSS du fond coloré pour les personnes
     *
     * @param {Array} matchingPeople - Personnes dont c'est un jour important
     * @returns {string} Style CSS inline
     */
    getBackgroundStyle(matchingPeople) {
        const n = matchingPeople.length;

        if (n === 0) {
            return '';
        }

        if (n === 1) {
            return `background: ${matchingPeople[0].color};`;
        }

        // Plusieurs personnes = gradient conique (camembert de couleurs)
        const step = 360 / n;
        let gradient = 'background: conic-gradient(';

        matchingPeople.forEach((person, idx) => {
            const angle = idx * step;
            const nextAngle = angle + step;
            gradient += `${person.color} ${angle}deg ${nextAngle}deg`;
            if (idx < n - 1) gradient += ', ';
        });

        gradient += ');';
        return gradient;
    }

    /**
     * Obtenir les noms des personnes pour affichage (en majuscules)
     *
     * @param {Array} matchingPeople - Personnes du jour
     * @returns {string} Noms séparés par des virgules
     */
    getPeopleNames(matchingPeople) {
        return matchingPeople
            .map(p => p.name.toUpperCase())
            .join(', ');
    }

    /**
     * Rendre le widget HTML
     */
    // Calcule si le fond des personnes est clair (pour adapter le filtre glyph/ton)
    isBgLight(matchingPeople) {
        if (!matchingPeople || matchingPeople.length === 0) return false;
        let totalLuma = 0, count = 0;
        for (const p of matchingPeople) {
            const hex = (p.color || '').replace('#', '');
            if (hex.length >= 6) {
                const r = parseInt(hex.substr(0,2), 16);
                const g = parseInt(hex.substr(2,2), 16);
                const b = parseInt(hex.substr(4,2), 16);
                totalLuma += (0.299*r + 0.587*g + 0.114*b) / 255;
                count++;
            }
        }
        return count > 0 && (totalLuma / count) > 0.8;
    }

    render() {
        const day = this.getCurrentDay();
        const bgStyle = this.getBackgroundStyle(day.matchingPeople);
        const bgLight = this.isBgLight(day.matchingPeople);
        const imgFilter = bgLight ? 'brightness(0) contrast(1.5)' : 'invert(1) brightness(2) contrast(1.2)';
        const namesStr = this.getPeopleNames(day.matchingPeople);

        // URLs des images
        const glyphURL = window.TzolkinCore.getGlyphURL(day.glyphId);
        const numberURL = window.TzolkinCore.getNumberURL(day.numberId);
        const trecenaURL = window.TzolkinCore.getGlyphURL(day.trecenaGlyphId);

        // Template HTML (identique au PHP)
        const html = `
            <div id="tzolkin-widget-php" class="tzolkin-widget-container"
                 data-offset="${this.offset}"
                 style="border-radius:16px;border:2px solid #222;width:100%;max-width:400px;min-width:0;margin:0 auto;background:#ded2b3;box-shadow:0 2px 12px rgba(0,0,0,0.09);padding:0;padding-bottom:clamp(8%,2vw,12%);box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;aspect-ratio:1/1;overflow:hidden;">

                <!-- Glyphe de la trécéna en arrière-plan -->
                <img src="${trecenaURL}"
                     alt="Glyphe trécéna"
                     class="tzolkin-trecena-glyph trecena-image"
                     draggable="false"
                     data-lightbox="none" />

                <!-- Bouton Reset -->
                <button class="tzolkin-widget-reset"
                        title="retour au jour d'aujourd'hui"
                        type="button"
                        style="position:absolute;top:8px;right:8px;width:28px;height:28px;min-width:0;min-height:0;max-width:32px;max-height:32px;padding:0;margin:0;background:#111;border-radius:8px;border:none;outline:none;z-index:20;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M10 2a8 8 0 1 1-7.32 4.906" stroke="#fff" stroke-width="2" fill="none"/>
                        <polyline points="2 2 2 7 7 7" stroke="#fff" stroke-width="2" fill="none"/>
                    </svg>
                </button>

                <!-- Titre (affiche "Tzolk'in" ou les noms au survol) -->
                <div class="tzolkin-title"
                     style="text-align:center;font-weight:bold;font-size:1.2em;position:absolute;top:0;left:0;right:0;z-index:12;background:transparent;width:100%;overflow-wrap:break-word;transition:.2s;margin-top:0;margin-bottom:0;">
                    <span class="tzolkin-title-span"
                          data-title="Tzolk'in"
                          data-names="${namesStr}"
                          style="display:inline-flex;align-items:center;justify-content:center;padding:0 0.12em;line-height:1;background:#ded2b3;border-radius:0.4em;border:none;vertical-align:middle;">Tzolk'in</span>
                </div>

                <!-- Carré central avec glyphe et nombre -->
                <div class="tzolkin-square"
                     style="width:76%;height:65%;margin:calc(2.2em + 1vw) auto clamp(5%,2vw,8%) auto;position:relative;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:16px;border:2px solid #222;z-index:2;cursor:pointer;overflow:hidden;">

                    <!-- Fond noir semi-transparent -->
                    <div style="position:absolute;inset:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1;pointer-events:none;"></div>

                    <!-- Fond coloré si personnes -->
                    ${day.matchingPeople.length > 0 ? `
                        <div class="tzolkin-bg-overlay"
                             style="position:absolute;inset:0;width:100%;height:100%;${bgStyle}z-index:1;pointer-events:none;"></div>
                    ` : ''}

                    <!-- Glyphe et Nombre -->
                    <div class="tzolkin-chiffre-glyphe"
                         style="display:flex;flex-direction:row;align-items:center;justify-content:stretch;width:100%;height:100%;gap:0;margin-top:clamp(8px,2vw,18px);margin-bottom:clamp(4px,1vw,12px);z-index:2;position:relative;">

                        <!-- Nombre -->
                        <div class="tzolkin-number"
                             style="display:flex;align-items:center;justify-content:flex-end;flex-basis:33.333%;flex-shrink:1;flex-grow:0;height:100%;padding-right:3%;">
                            <img src="${numberURL}"
                                 alt="Chiffre maya ${day.numberId}"
                                 class="tzolkin-number-img"
                                 style="width:94%;height:auto;max-width:100%;max-height:100%;display:block;z-index:2;filter:${imgFilter};"
                                 onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=\\'font-size:clamp(1.1em,2vw,2em);color:#fff;\\'>${day.numberId}</span>');"
                                 data-lightbox="none" />
                        </div>

                        <!-- Glyphe -->
                        <div class="tzolkin-glyph"
                             style="display:flex;align-items:center;justify-content:center;flex-basis:66.666%;flex-shrink:1;flex-grow:1;height:100%;">
                            <img src="${glyphURL}"
                                 alt="Glyphe maya ${day.glyphName}"
                                 class="tzolkin-glyph-img"
                                 style="width:98%;height:auto;max-width:100%;max-height:100%;display:block;filter:${imgFilter};"
                                 data-lightbox="none" />
                        </div>
                    </div>
                </div>

                <!-- Navigation en bas -->
                <div class="tzolkin-bottom"
                     style="width:100%;position:absolute;left:0;right:0;bottom:0;z-index:20;">
                    <div class="tzolkin-nav-form"
                         style="display:flex;flex-wrap:nowrap;align-items:center;justify-content:center;gap:8px;overflow:hidden;white-space:nowrap;width:100%;background:#ded2b3;z-index:20;position:relative;">

                        <!-- Bouton Précédent -->
                        <button type="button"
                                class="tzolkin-nav-prev"
                                style="width:40px;min-width:40px;height:100%;padding:0;display:flex;align-items:center;justify-content:center;background:transparent;border:none;box-shadow:none;cursor:pointer;position:relative;z-index:2;"><</button>

                        <!-- Date grégorienne (cliquable) -->
                        <span class="tzolkin-gregorian tzolkin-gregorian-clickable"
                              tabindex="0"
                              title="cliquer pour entrer une date">${day.gregorian}</span>
                        <input type="text"
                               class="tzolkin-date-input"
                               placeholder="jj/mm/aaaa"
                               value="${day.gregorian}"
                               title="Aller à une date (Entrée)"
                               style="display:none;" />

                        <!-- Bouton Suivant -->
                        <button type="button"
                                class="tzolkin-nav-next"
                                style="width:40px;min-width:40px;height:100%;padding:0;display:flex;align-items:center;justify-content:center;background:transparent;border:none;box-shadow:none;cursor:pointer;position:relative;z-index:2;">></button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Attacher les événements aux boutons
     */
    attachEventListeners() {
        // Boutons navigation
        const prevBtn = this.container.querySelector('.tzolkin-nav-prev');
        const nextBtn = this.container.querySelector('.tzolkin-nav-next');
        const resetBtn = this.container.querySelector('.tzolkin-widget-reset');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigatePrevious();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateNext();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.reset();
            });
        }

        // Gestion du survol pour afficher les noms
        const square = this.container.querySelector('.tzolkin-square');
        const titleSpan = this.container.querySelector('.tzolkin-title-span');

        if (square && titleSpan) {
            const namesStr = titleSpan.dataset.names || '';
            const defaultTitle = titleSpan.dataset.title || 'Tzolk\'in';
            this._nameLocked = false;

            // Survol (desktop) : affiche le nom tant que la souris est dessus
            square.addEventListener('mouseenter', () => {
                if (namesStr) titleSpan.textContent = namesStr;
            });

            square.addEventListener('mouseleave', () => {
                // Revient au titre par défaut sauf si verrouillé par un clic
                if (!this._nameLocked) titleSpan.textContent = defaultTitle;
            });

            // Clic / tap : toggle — 1er clic = prénom, 2ème clic = retour Tzolk'in
            square.addEventListener('click', (e) => {
                e.stopPropagation();
                if (namesStr) {
                    this._nameLocked = !this._nameLocked;
                    titleSpan.textContent = this._nameLocked ? namesStr : defaultTitle;
                }
            });
        }

        // Gestion de la sélection de date
        const gregorianSpan = this.container.querySelector('.tzolkin-gregorian');
        const dateInput = this.container.querySelector('.tzolkin-date-input');

        if (gregorianSpan && dateInput) {
            gregorianSpan.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                gregorianSpan.style.display = 'none';
                dateInput.style.display = 'inline-block';
                dateInput.value = '';
                dateInput.focus();

                // Appliquer le masque IMask si disponible
                if (window.IMask) {
                    const mask = window.IMask(dateInput, {
                        mask: '00/00/0000',
                        placeholderChar: '_',
                        lazy: false
                    });
                }
            });

            dateInput.addEventListener('blur', () => {
                dateInput.style.display = 'none';
                gregorianSpan.style.display = 'inline-block';
            });

            dateInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.navigateToDate(dateInput.value);
                    dateInput.style.display = 'none';
                    gregorianSpan.style.display = 'inline-block';
                }
            });
        }
    }

    /**
     * Naviguer au jour précédent
     */
    navigatePrevious() {
        this.offset--;
        window.TzolkinStorage.saveOffset(this.offset);
        this.render();
        this.attachEventListeners();
        this.dispatchChangeEvent();
    }

    /**
     * Naviguer au jour suivant
     */
    navigateNext() {
        this.offset++;
        window.TzolkinStorage.saveOffset(this.offset);
        this.render();
        this.attachEventListeners();
        this.dispatchChangeEvent();
    }

    /**
     * Réinitialiser au jour actuel
     */
    reset() {
        this.offset = 0;
        window.TzolkinStorage.saveOffset(this.offset);
        this.render();
        this.attachEventListeners();
        this.dispatchChangeEvent();
    }

    /**
     * Naviguer vers une date spécifique
     *
     * @param {string} dateStr - Date au format jj/mm/aaaa
     */
    navigateToDate(dateStr) {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(dateStr)) {
            alert('Format de date incorrect. Utilisez jj/mm/aaaa.');
            return;
        }

        const [, day, month, year] = dateStr.match(dateRegex);
        const targetDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(targetDate.getTime())) {
            alert('Date invalide. Veuillez entrer une date valide.');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate - today;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        this.offset = diffDays;
        window.TzolkinStorage.saveOffset(this.offset);
        this.render();
        this.attachEventListeners();
        this.dispatchChangeEvent();
    }

    /**
     * Déclencher un événement quand le widget change
     * Permet aux autres modules de réagir au changement de date
     */
    dispatchChangeEvent() {
        const event = new CustomEvent('tzolkin-date-change', {
            detail: {
                offset: this.offset,
                ...this.getCurrentDay()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Forcer le rafraîchissement du widget
     * Utile quand les contacts changent
     */
    refresh() {
        this.render();
        this.attachEventListeners();
    }
}

// ============================================================================
// EXPORT
// ============================================================================

window.TzolkinWidget = TzolkinWidget;

console.log('✅ Tzolk\'in Widget chargé - Générateur de calendrier prêt');
