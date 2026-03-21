/**
 * Tzolk'in Admin - Gestion des contacts (personnes)
 * Version: 2.0
 * Auteur: Alexandre Ferran + Claude AI
 * Date: Février 2026
 */

// ============================================================================
// CLASSE ADMIN CONTACTS
// ============================================================================

class TzolkinAdmin {
    constructor() {
        this.currentEditIndex = -1;
        this.t = window.i18n ? window.i18n.t.bind(window.i18n) : k => k;
        this.init();
    }

    /**
     * Initialiser le module admin
     */
    init() {
        // Créer la modale si elle n'existe pas
        this.ensureModalExists();

        // Attacher les événements
        this.attachEventListeners();

        console.log('✅ Module Admin initialisé');
    }

    /**
     * S'assurer que la modale admin existe dans le DOM
     */
    ensureModalExists() {
        // Vérifier si la modale existe déjà
        if (document.getElementById('admin-modal')) {
            return;
        }

        // Créer la modale
        const t = this.t;
        const modalHTML = `
            <div id="admin-modal" class="modal" style="z-index:1400; padding: 0; position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch; background: rgba(222, 210, 179, 0.95);">
                <div class="modal-content" style="background: transparent; border: none; border-radius: 0; box-shadow: none; width: 100%; height: auto; min-height: 100%; max-height: none; max-width: 100%; margin: 0; overflow-y: visible; padding: 20px; padding-top: calc(env(safe-area-inset-top, 0px) + 20px); padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 20px); box-sizing: border-box; position: relative;">
                    <button class="close-modal" onclick="window.tzolkinAdmin.closeAdminModal()" style="position:absolute; top: calc(env(safe-area-inset-top, 0px) + 15px); right:15px; background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
                    <div class="header" style="text-align:center; padding-bottom: 20px; border-bottom: 2px solid rgba(0,0,0,0.1);">
                        <h2 style="font-family: 'Summer', cursive; font-size: 32px; color: #c19434; margin:0;">${t('settings.contacts_title')}</h2>
                    </div>

                    <!-- Formulaire d'ajout/modification -->
                    <div class="admin-form">
                        <h3 id="form-title">${t('settings.add_contact')}</h3>

                        <div class="form-group">
                            <label for="person-name">${t('settings.name')}</label>
                            <input type="text" id="person-name" placeholder="${t('settings.name').replace(' :', '')}" required>
                        </div>

                        <div class="form-group">
                            <label for="person-birthdate">${t('settings.birthdate')}</label>
                            <input type="text" id="person-birthdate" placeholder="${t('widget.date_placeholder')}" inputmode="numeric" autocomplete="off" required>
                            <small>${t('settings.auto_glyph')}</small>
                        </div>

                        <div class="form-group">
                            <label for="person-color">${t('settings.color')}</label>
                            <input type="color" id="person-color" value="#ffeedd">
                            <button type="button" id="generate-color-btn" class="btn-secondary">${t('settings.random_color')}</button>
                        </div>

                        <div class="tzolkin-preview" id="tzolkin-preview" style="display:none;">
                            <p><strong>${t('settings.tzolkin_day')}</strong> <span id="preview-tzolkin"></span></p>
                            <img id="preview-glyph" src="" alt="Glyphe" style="width:60px;height:60px;">
                            <img id="preview-number" src="" alt="Nombre" style="width:40px;height:40px;">
                        </div>

                        <div class="form-actions">
                            <button type="button" id="save-person-btn" class="button button-primary">${t('settings.save')}</button>
                            <button type="button" id="cancel-edit-btn" class="button button-secondary" style="display:none;">${t('settings.cancel')}</button>
                        </div>
                    </div>

                    <!-- Section Code PIN -->
                    <div id="pin-admin-section" style="margin: 24px 0; padding: 18px 0; border-top: 2px solid rgba(0,0,0,0.1); border-bottom: 2px solid rgba(0,0,0,0.1);">
                        <h3 style="font-family:'Summer',cursive; font-size:20px; color:#c19434; margin:0 0 10px 0;">${t('pin.title')}</h3>
                        <p id="pin-admin-status" style="font-size:16px; color:#222; margin:0 0 14px 0;">${t('settings.loading')}</p>
                        <div id="pin-admin-buttons" style="display:flex; gap:12px; flex-wrap:wrap;"></div>
                    </div>

                    <!-- Liste des contacts -->
                    <div class="contacts-list">
                        <h3>${t('settings.saved_contacts')}</h3>
                        <div id="contacts-table"></div>
                        <div style="height: 80px;"></div>
                    </div>
                </div>
            </div>
        `;

        // Ajouter au body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Le bouton Admin sera ajouté par index.html après le chargement du menu
    }

    /**
     * Ajouter le bouton Admin dans le menu principal
     */
    addAdminButton() {
        // Chercher le menu (réessayer si nécessaire)
        const findMenuAndAdd = () => {
            const menu = document.querySelector('.main-menu');
            if (!menu) {
                console.warn('Menu principal non trouvé, nouvelle tentative dans 500ms...');
                setTimeout(findMenuAndAdd, 500);
                return;
            }

            // Vérifier si le bouton existe déjà
            if (document.getElementById('admin-menu-btn')) {
                return;
            }

            const adminButton = `
                <div class="menu-button" id="admin-menu-btn" onclick="window.tzolkinAdmin.openAdminModal()" style="cursor:pointer;">
                    <img src="./assets/boutons/SVG/ahau-bt.svg" alt="${this.t('settings.title')}">
                    <span>${this.t('settings.title')}</span>
                </div>
            `;

            const creditsBtn = document.getElementById('credits-menu-btn');
            if (creditsBtn) {
                creditsBtn.insertAdjacentHTML('beforebegin', adminButton);
            } else {
                menu.insertAdjacentHTML('beforeend', adminButton);
            }
            console.log('✅ Bouton Réglages ajouté au menu');
        };

        findMenuAndAdd();
    }

    /**
     * Attacher les événements
     */
    attachEventListeners() {
        // Bouton générer couleur
        const generateColorBtn = document.getElementById('generate-color-btn');
        if (generateColorBtn) {
            generateColorBtn.addEventListener('click', () => {
                const color = window.TzolkinCore.generatePastelColor();
                document.getElementById('person-color').value = color;
            });
        }

        // Aperçu Tzolk'in quand on saisit la date de naissance (masque jj/mm/aaaa)
        const birthdateInput = document.getElementById('person-birthdate');
        if (birthdateInput && typeof IMask !== 'undefined') {
            this.birthdateMask = IMask(birthdateInput, { mask: '00/00/0000' });
        }
        if (birthdateInput) {
            birthdateInput.addEventListener('input', () => {
                this.updateTzolkinPreview();
            });
        }

        // Bouton sauvegarder
        const saveBtn = document.getElementById('save-person-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePerson();
            });
        }

        // Bouton annuler
        const cancelBtn = document.getElementById('cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelEdit();
            });
        }
    }

    /**
     * Mettre à jour l'aperçu Tzolk'in basé sur la date de naissance
     */
    updateTzolkinPreview() {
        const birthdateInput = document.getElementById('person-birthdate');
        const preview = document.getElementById('tzolkin-preview');
        const previewText = document.getElementById('preview-tzolkin');
        const previewGlyph = document.getElementById('preview-glyph');
        const previewNumber = document.getElementById('preview-number');

        const rawDate = birthdateInput.value;
        if (!rawDate || rawDate.length < 10) {
            preview.style.display = 'none';
            return;
        }
        const parts = rawDate.split('/');
        if (parts.length !== 3 || parts[2].length !== 4) {
            preview.style.display = 'none';
            return;
        }
        const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (isNaN(birthDate.getTime())) {
            preview.style.display = 'none';
            return;
        }
        const tzolkin = window.TzolkinCore.calculateTzolkin(birthDate);

        previewText.textContent = `${tzolkin.numberId} ${tzolkin.glyphName}`;
        previewGlyph.src = window.TzolkinCore.getGlyphURL(tzolkin.glyphId);
        previewNumber.src = window.TzolkinCore.getNumberURL(tzolkin.numberId);
        preview.style.display = 'block';
    }

    /**
     * Sauvegarder ou modifier un contact
     */
    savePerson() {
        const name = document.getElementById('person-name').value.trim();
        const rawDate = document.getElementById('person-birthdate').value;
        const color = document.getElementById('person-color').value;

        if (!name || !rawDate || rawDate.length < 10) {
            alert(this.t('settings.fill_required'));
            return;
        }
        const dateParts = rawDate.split('/');
        if (dateParts.length !== 3 || dateParts[2].length !== 4) {
            alert(this.t('settings.invalid_date_format'));
            return;
        }
        const birthDateObj = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        if (isNaN(birthDateObj.getTime())) {
            alert(this.t('settings.invalid_date'));
            return;
        }
        // Stocker au format YYYY-MM-DD (rétrocompatible)
        const birthDate = `${dateParts[2]}-${dateParts[1].padStart(2,'0')}-${dateParts[0].padStart(2,'0')}`;

        // Calculer Tzolk'in
        const tzolkin = window.TzolkinCore.calculateTzolkin(birthDateObj);

        const person = {
            name,
            birthDate,
            color,
            glyph: tzolkin.glyphId,
            number: tzolkin.numberId
        };

        if (this.currentEditIndex >= 0) {
            // Mode modification
            const success = window.TzolkinStorage.updatePerson(this.currentEditIndex, person);
            if (success) {
                alert(this.t('settings.contact_edited', {name: name}));
            }
        } else {
            // Mode ajout
            const success = window.TzolkinStorage.addPerson(person);
            if (success) {
                alert(this.t('settings.contact_added', {name: name}));
            }
        }

        // Réinitialiser le formulaire
        this.resetForm();

        // Rafraîchir la liste
        this.renderContacts();

        // Rafraîchir le widget (pour mettre à jour les couleurs)
        if (window.tzolkinWidget) {
            window.tzolkinWidget.refresh();
        }
    }

    /**
     * Annuler la modification
     */
    cancelEdit() {
        this.resetForm();
    }

    /**
     * Réinitialiser le formulaire
     */
    resetForm() {
        this.currentEditIndex = -1;

        document.getElementById('form-title').textContent = this.t('settings.add_contact');
        document.getElementById('person-name').value = '';
        document.getElementById('person-birthdate').value = '';
        document.getElementById('person-color').value = '#ffeedd';
        document.getElementById('tzolkin-preview').style.display = 'none';

        document.getElementById('save-person-btn').textContent = this.t('settings.save');
        document.getElementById('cancel-edit-btn').style.display = 'none';
    }

    /**
     * Afficher la liste des contacts
     */
    renderContacts() {
        const container = document.getElementById('contacts-table');
        if (!container) return;

        const people = window.TzolkinStorage.loadPeople();

        if (people.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:20px 10px; color:#888;">
                    <p style="font-size:17px; margin:0 0 8px;">${this.t('settings.no_contacts') || 'Aucun contact enregistré.'}</p>
                    <p style="font-size:14px; margin:0; line-height:1.5;">${this.t('settings.no_contacts_hint') || 'Ajoutez vos proches ci-dessus pour suivre leur jour Tzolk\'in dans le calendrier.'}</p>
                </div>
            `;
            return;
        }

        const locale = this.t('date_format.locale');
        let html = '<div style="display:flex; flex-direction:column; gap:8px;">';

        people.forEach((person, index) => {
            const glyphId = person.glyph;
            const numberId = person.number;
            const glyphURL = window.TzolkinCore.getGlyphURL(glyphId);
            const numberURL = window.TzolkinCore.getNumberURL(numberId);
            const glyphName = window.TzolkinCore.GLYPHS[glyphId].name;
            const css = window.TzolkinCore.getGlyphColorCSS(glyphId);
            const dateStr = new Date(person.birthDate).toLocaleDateString(locale);

            html += `
                <div style="display:flex; align-items:center; gap:8px; padding:10px 12px; background:white; border-radius:10px; border-left:4px solid ${person.color}; box-shadow:0 1px 4px rgba(0,0,0,0.07); overflow:hidden;">
                    <!-- Couleur -->
                    <span style="flex-shrink:0; width:14px; height:14px; border-radius:50%; background:${person.color}; border:1px solid rgba(0,0,0,0.15);"></span>
                    <!-- Info (tronqué si trop long) -->
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:17px; font-weight:bold; color:#222; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${person.name}</div>
                        <div style="font-size:13px; color:#888; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${dateStr} · ${numberId} ${glyphName}</div>
                    </div>
                    <!-- Glyphes Tzolk'in -->
                    <div style="flex-shrink:0; display:flex; align-items:center; gap:2px;">
                        <img src="${numberURL}" alt="${numberId}" style="width:22px;height:22px;opacity:0.85;">
                        <img src="${glyphURL}" alt="${glyphName}" style="width:22px;height:22px;opacity:0.85;">
                    </div>
                    <!-- Actions -->
                    <div style="flex-shrink:0; display:flex; align-items:center; gap:4px;">
                        <button onclick="window.tzolkinAdmin.editPerson(${index})" class="btn-edit" style="padding:6px 10px; font-size:15px; margin-right:0;">${this.t('saved_modal.edit')}</button>
                        <button onclick="window.openCroixMayaModal('${person.name.replace(/'/g,"\\'")}', ${glyphId}, ${numberId}, '${person.birthDate}')" class="btn-edit" title="${this.t('details.maya_cross')}" style="padding:6px 10px; font-size:15px; margin-right:0; background:${css.bg}; color:${css.text}; border-color:${css.border};">✛</button>
                        <span onclick="window.tzolkinAdmin.deletePerson(${index})" title="${this.t('saved_modal.delete')}" style="cursor:pointer; font-size:22px; padding:4px; line-height:1;">🗑</span>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Éditer un contact existant
     *
     * @param {number} index - Index du contact
     */
    editPerson(index) {
        const people = window.TzolkinStorage.loadPeople();
        const person = people[index];

        if (!person) return;

        this.currentEditIndex = index;

        document.getElementById('form-title').textContent = this.t('settings.edit_contact') || 'Modifier le contact';
        document.getElementById('person-name').value = person.name;
        // Convertir YYYY-MM-DD → DD/MM/YYYY pour l'affichage dans le champ texte
        const [y, m, d] = person.birthDate.split('-');
        const displayDate = `${d}/${m}/${y}`;
        if (this.birthdateMask) {
            this.birthdateMask.value = displayDate;
        } else {
            document.getElementById('person-birthdate').value = displayDate;
        }
        document.getElementById('person-color').value = person.color;

        this.updateTzolkinPreview();

        document.getElementById('save-person-btn').textContent = this.t('settings.save_changes') || this.t('settings.save');
        document.getElementById('cancel-edit-btn').style.display = 'inline-block';

        // Scroller vers le formulaire
        document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Supprimer un contact
     *
     * @param {number} index - Index du contact
     */
    deletePerson(index) {
        const people = window.TzolkinStorage.loadPeople();
        const person = people[index];

        if (!person) return;

        if (!confirm(this.t('settings.confirm_delete_contact', {name: person.name}))) {
            return;
        }

        const success = window.TzolkinStorage.deletePerson(index);
        if (success) {
            alert(this.t('settings.contact_deleted', {name: person.name}));
            this.renderContacts();

            // Rafraîchir le widget
            if (window.tzolkinWidget) {
                window.tzolkinWidget.refresh();
            }
        }
    }

    /**
     * Ouvrir la modale admin
     */
    openAdminModal() {
        // Fermer la modale Croix Maya si elle est ouverte
        if (typeof closeCroixMayaModal === 'function') closeCroixMayaModal();

        const modal = document.getElementById('admin-modal');
        if (!modal) return;

        modal.style.display = 'block'; // Force display:block (court-circuite display:flex du CSS)
        modal.classList.add('active');
        modal.scrollTop = 0;
        document.body.classList.add('modal-open');

        // Rafraîchir la liste des contacts
        this.renderContacts();

        // Afficher le statut du PIN
        this.refreshPinStatus();

        // Mettre à jour l'historique
        window.history.pushState({}, '', '#admin');
    }

    /**
     * Fermer la modale admin
     */
    closeAdminModal() {
        const modal = document.getElementById('admin-modal');
        if (!modal) return;

        modal.style.display = ''; // Supprime le display inline → CSS (.modal { display:none }) reprend le contrôle
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        this.resetForm();

        window.history.replaceState({}, '', '#calendar');
    }

    refreshPinStatus() {
        const el = document.getElementById('pin-admin-status');
        if (!el) return;
        const hasPin = window.TzolkinStorage && window.TzolkinStorage.hasPinCode();
        el.textContent = hasPin
            ? (this.t('pin.active_status') || '✓ Code PIN actif — vos notes sont protégées.')
            : (this.t('pin.inactive_status') || 'Aucun code PIN défini — vos notes sont accessibles librement.');
        el.style.color = hasPin ? '#5e832a' : '#888';

        // Adapter les boutons selon l'état du PIN
        const btnContainer = document.getElementById('pin-admin-buttons');
        if (!btnContainer) return;
        if (hasPin) {
            btnContainer.innerHTML = `
                <button onclick="window.tzolkinAdmin.handlePinChange()" class="btn-edit" style="flex:1; font-size:16px; padding:10px;">${this.t('pin.change_pin')}</button>
                <button onclick="window.tzolkinAdmin.handlePinRemove()" class="btn-delete" style="flex:1; font-size:16px; padding:10px;">${this.t('pin.disable_pin')}</button>
            `;
        } else {
            btnContainer.innerHTML = `
                <button onclick="window.tzolkinAdmin.handlePinChange()" class="btn-edit" style="flex:1; font-size:16px; padding:10px;">${this.t('pin.create_pin')}</button>
            `;
        }
    }

    handlePinChange() {
        if (!window.tzolkinPIN) return;
        const hasPin = window.TzolkinStorage && window.TzolkinStorage.hasPinCode();
        if (hasPin) {
            // Vérifier le PIN actuel, puis ouvrir la création du nouveau
            window.tzolkinPIN.requestPin(() => {
                window.tzolkinPIN.openForCreation(() => { this.refreshPinStatus(); });
            }, null);
        } else {
            // Pas de PIN → créer directement
            window.tzolkinPIN.openForCreation(() => { this.refreshPinStatus(); });
        }
    }

    handlePinRemove() {
        if (!window.tzolkinPIN) return;
        const hasPin = window.TzolkinStorage && window.TzolkinStorage.hasPinCode();
        if (!hasPin) { alert(this.t('pin.no_pin_to_disable') || 'Aucun code PIN à désactiver.'); return; }
        if (!confirm(this.t('pin.confirm_delete_pin'))) return;
        window.tzolkinPIN.requestPin(() => {
            window.TzolkinStorage.removePinCode();
            this.refreshPinStatus();
            alert(this.t('pin.pin_deleted'));
        }, null);
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

// Créer l'instance globale quand i18n est prêt (évite la race condition fetch JSON)
function initAdmin() {
    window.tzolkinAdmin = new TzolkinAdmin();
    console.log('✅ Admin initialisé et accessible via window.tzolkinAdmin');
}
if (window.i18n && window.i18n.ready) {
    initAdmin();
} else if (window.i18n && window.i18n.onReady) {
    window.i18n.onReady(initAdmin);
} else {
    document.addEventListener('DOMContentLoaded', initAdmin);
}

console.log('✅ Tzolk\'in Admin chargé - Module de gestion des contacts prêt');
