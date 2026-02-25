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
            <div id="admin-modal" class="modal" style="z-index:1400;">
                <div class="modal-content" style="background: rgba(222, 210, 179, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 2px solid #222; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                    <button class="close-modal" onclick="window.tzolkinAdmin.closeAdminModal()" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
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
                            <input type="date" id="person-birthdate" required>
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

        // Aperçu Tzolk'in quand on change la date de naissance
        const birthdateInput = document.getElementById('person-birthdate');
        if (birthdateInput) {
            birthdateInput.addEventListener('change', () => {
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

        if (!birthdateInput.value) {
            preview.style.display = 'none';
            return;
        }

        const birthDate = new Date(birthdateInput.value);
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
        const birthDate = document.getElementById('person-birthdate').value;
        const color = document.getElementById('person-color').value;

        if (!name || !birthDate) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Calculer Tzolk'in
        const birthDateObj = new Date(birthDate);
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
        document.getElementById('person-birthdate').value = person.birthDate;
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
        const modal = document.getElementById('admin-modal');
        if (!modal) return;

        modal.classList.add('active');
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
