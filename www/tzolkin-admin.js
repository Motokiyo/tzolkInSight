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
        const modalHTML = `
            <div id="admin-modal" class="modal" style="z-index:1400; padding: 0; position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch; background: rgba(222, 210, 179, 0.95);">
                <div class="modal-content" style="background: transparent; border: none; border-radius: 0; box-shadow: none; width: 100%; height: auto; min-height: 100%; max-height: none; max-width: 100%; margin: 0; overflow-y: visible; padding: 20px; padding-top: calc(env(safe-area-inset-top, 0px) + 20px); padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 20px); box-sizing: border-box; position: relative;">
                    <button class="close-modal" onclick="window.tzolkinAdmin.closeAdminModal()" style="position:absolute; top: calc(env(safe-area-inset-top, 0px) + 15px); right:15px; background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
                    <div class="header" style="text-align:center; padding-bottom: 20px; border-bottom: 2px solid rgba(0,0,0,0.1);">
                        <h2 style="font-family: 'Summer', cursive; font-size: 32px; color: #c19434; margin:0;">Admin - Mes Contacts</h2>
                    </div>

                    <!-- Formulaire d'ajout/modification -->
                    <div class="admin-form">
                        <h3 id="form-title">Ajouter un contact</h3>

                        <div class="form-group">
                            <label for="person-name">Nom :</label>
                            <input type="text" id="person-name" placeholder="Nom de la personne" required>
                        </div>

                        <div class="form-group">
                            <label for="person-birthdate">Date de naissance :</label>
                            <input type="text" id="person-birthdate" placeholder="jj/mm/aaaa" inputmode="numeric" autocomplete="off" required>
                            <small>Le glyphe et le nombre seront calculés automatiquement</small>
                        </div>

                        <div class="form-group">
                            <label for="person-color">Couleur :</label>
                            <input type="color" id="person-color" value="#ffeedd">
                            <button type="button" id="generate-color-btn" class="btn-secondary">Couleur aléatoire</button>
                        </div>

                        <div class="tzolkin-preview" id="tzolkin-preview" style="display:none;">
                            <p><strong>Jour Tzolk'in :</strong> <span id="preview-tzolkin"></span></p>
                            <img id="preview-glyph" src="" alt="Glyphe" style="width:60px;height:60px;">
                            <img id="preview-number" src="" alt="Nombre" style="width:40px;height:40px;">
                        </div>

                        <div class="form-actions">
                            <button type="button" id="save-person-btn" class="button button-primary">Enregistrer</button>
                            <button type="button" id="cancel-edit-btn" class="button button-secondary" style="display:none;">Annuler</button>
                        </div>
                    </div>

                    <!-- Liste des contacts -->
                    <div class="contacts-list">
                        <h3>Contacts enregistrés</h3>
                        <div id="contacts-table"></div>
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
                    <img src="./assets/boutons/SVG/ahau-bt.svg" alt="Admin">
                    <span>Admin</span>
                </div>
            `;

            menu.insertAdjacentHTML('beforeend', adminButton);
            console.log('✅ Bouton Admin ajouté au menu');
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
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        const dateParts = rawDate.split('/');
        if (dateParts.length !== 3 || dateParts[2].length !== 4) {
            alert('Format de date invalide. Utilisez jj/mm/aaaa');
            return;
        }
        const birthDateObj = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        if (isNaN(birthDateObj.getTime())) {
            alert('Date invalide. Vérifiez le jour, le mois et l\'année');
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
                alert(`Contact "${name}" modifié avec succès !`);
            }
        } else {
            // Mode ajout
            const success = window.TzolkinStorage.addPerson(person);
            if (success) {
                alert(`Contact "${name}" ajouté avec succès !`);
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

        document.getElementById('form-title').textContent = 'Ajouter un contact';
        document.getElementById('person-name').value = '';
        document.getElementById('person-birthdate').value = '';
        document.getElementById('person-color').value = '#ffeedd';
        document.getElementById('tzolkin-preview').style.display = 'none';

        document.getElementById('save-person-btn').textContent = 'Enregistrer';
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
            container.innerHTML = '<p>Aucun contact enregistré.</p>';
            return;
        }

        let html = '<table class="contacts-table"><thead><tr><th>Nom</th><th>Date de naissance</th><th>Tzolk\'in</th><th>Couleur</th><th>Actions</th></tr></thead><tbody>';

        people.forEach((person, index) => {
            const glyphName = window.TzolkinCore.GLYPHS[person.glyph].name;
            const numberName = person.number;

            html += `
                <tr>
                    <td>${person.name}</td>
                    <td>${new Date(person.birthDate).toLocaleDateString('fr-FR')}</td>
                    <td>${numberName} ${glyphName}</td>
                    <td><span style="display:inline-block;width:30px;height:30px;background:${person.color};border-radius:4px;border:1px solid #ccc;"></span></td>
                    <td>
                        <button onclick="window.tzolkinAdmin.editPerson(${index})" class="btn-edit">Modifier</button>
                        <button onclick="window.tzolkinAdmin.deletePerson(${index})" class="btn-delete">Supprimer</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
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

        document.getElementById('form-title').textContent = 'Modifier le contact';
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

        document.getElementById('save-person-btn').textContent = 'Enregistrer les modifications';
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

        if (!confirm(`Voulez-vous vraiment supprimer "${person.name}" ?`)) {
            return;
        }

        const success = window.TzolkinStorage.deletePerson(index);
        if (success) {
            alert(`Contact "${person.name}" supprimé`);
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

        window.history.pushState({}, '', '#calendar');
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

// Créer l'instance globale au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    window.tzolkinAdmin = new TzolkinAdmin();
    console.log('✅ Admin initialisé et accessible via window.tzolkinAdmin');
});

console.log('✅ Tzolk\'in Admin chargé - Module de gestion des contacts prêt');
