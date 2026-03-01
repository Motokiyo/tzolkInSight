/**
 * Tzolk'in PIN - Système de code PIN à 4 chiffres
 * Protection de la page "Enregistrés" (notes sauvegardées)
 * Version: 2.0
 * Auteur: Alexandre Ferran + Claude AI
 * Date: Février 2026
 */

// ============================================================================
// CLASSE GESTIONNAIRE DE PIN
// ============================================================================

class TzolkinPIN {
    constructor() {
        this.pinModalId = 'pin-modal';
        this.pinAttempts = 0;
        this.maxAttempts = 3;
        this.lockoutTime = 300000; // 5 minutes de verrouillage après 3 échecs

        this.init();
    }

    /**
     * Initialiser le module PIN
     */
    init() {
        this.ensureModalExists();
        console.log('✅ Module PIN initialisé');
    }

    /**
     * S'assurer que la modale PIN existe dans le DOM
     */
    ensureModalExists() {
        if (document.getElementById(this.pinModalId)) {
            return;
        }

        const modalHTML = `
            <div id="${this.pinModalId}" class="modal pin-modal">
                <div class="modal-content pin-content">
                    <div class="header">
                        <h2>Code PIN requis</h2>
                    </div>

                    <div class="pin-body">
                        <p id="pin-message">Entrez votre code PIN à 4 chiffres pour accéder aux notes enregistrées.</p>

                        <div class="pin-input-container">
                            <input type="password"
                                   id="pin-digit-1"
                                   class="pin-digit"
                                   maxlength="1"
                                   pattern="[0-9]"
                                   inputmode="numeric"
                                   autocomplete="off" />
                            <input type="password"
                                   id="pin-digit-2"
                                   class="pin-digit"
                                   maxlength="1"
                                   pattern="[0-9]"
                                   inputmode="numeric"
                                   autocomplete="off" />
                            <input type="password"
                                   id="pin-digit-3"
                                   class="pin-digit"
                                   maxlength="1"
                                   pattern="[0-9]"
                                   inputmode="numeric"
                                   autocomplete="off" />
                            <input type="password"
                                   id="pin-digit-4"
                                   class="pin-digit"
                                   maxlength="1"
                                   pattern="[0-9]"
                                   inputmode="numeric"
                                   autocomplete="off" />
                        </div>

                        <div class="pin-error" id="pin-error" style="display:none;"></div>

                        <div class="pin-actions">
                            <button type="button" id="pin-submit-btn" class="button button-primary" style="display:none;">Valider</button>
                            <button type="button" id="pin-cancel-btn" class="button button-secondary">Annuler</button>
                        </div>

                        <div class="pin-setup" id="pin-setup-section" style="display:none;">
                            <hr />
                            <p><strong>Aucun code PIN défini.</strong></p>
                            <p>Voulez-vous en créer un pour protéger vos notes ?</p>
                            <button type="button" id="pin-create-btn" class="button button-primary">Créer un code PIN</button>
                            <button type="button" id="pin-skip-btn" class="button button-secondary">Accéder sans code</button>
                        </div>

                        <!-- Section création de PIN (formulaire masqué avec œil) -->
                        <div class="pin-setup" id="pin-create-section" style="display:none;">
                            <hr />
                            <p style="margin:0 0 4px;"><strong>Nouveau code PIN (4 chiffres)</strong></p>
                            <div class="pin-input-container" style="margin:10px 0;">
                                <input type="password" id="pin-new-1" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                                <input type="password" id="pin-new-2" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                                <input type="password" id="pin-new-3" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                                <input type="password" id="pin-new-4" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                            </div>
                            <p style="margin:0 0 4px;"><strong>Confirmer le code PIN</strong></p>
                            <div class="pin-input-container" style="margin:10px 0 8px;">
                                <input type="password" id="pin-conf-1" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                                <input type="password" id="pin-conf-2" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                                <input type="password" id="pin-conf-3" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                                <input type="password" id="pin-conf-4" class="pin-digit pin-create-digit" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                            </div>
                            <button type="button" id="pin-eye-btn" class="pin-eye-btn" title="Afficher / masquer">
                                <svg id="pin-eye-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <div class="pin-actions">
                                <button type="button" id="pin-confirm-create-btn" class="button button-primary">Créer</button>
                                <button type="button" id="pin-cancel-create-btn" class="button button-secondary">Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Styles pour la modale PIN -->
            <style>
                #pin-modal {
                    z-index: 2500;
                }

                .pin-modal .pin-content {
                    max-width: 400px;
                    font-family: 'Simplifica', Arial, sans-serif;
                }

                .pin-modal h2 {
                    font-family: 'Simplifica', Arial, sans-serif;
                }

                .pin-input-container {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin: 20px 0;
                }

                .pin-digit {
                    width: 60px;
                    height: 60px;
                    font-size: 32px;
                    font-family: 'Simplifica', Arial, sans-serif;
                    text-align: center;
                    border: 2px solid #ccc;
                    border-radius: 8px;
                    background: #fff;
                    transition: border-color 0.3s;
                }

                .pin-digit:focus {
                    outline: none;
                    border-color: #4CAF50;
                    box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
                }

                .pin-error {
                    color: #FF5555;
                    font-weight: bold;
                    text-align: center;
                    margin: 10px 0;
                }

                .pin-actions {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }

                .pin-setup {
                    margin-top: 20px;
                    padding-top: 20px;
                    text-align: center;
                }

                .pin-eye-btn {
                    background: none;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 6px 14px;
                    cursor: pointer;
                    color: #555;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 4px;
                    font-size: 0.85em;
                    transition: background 0.2s;
                }

                .pin-eye-btn:hover {
                    background: #f0ece0;
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.attachPinEventListeners();
    }

    /**
     * Attacher les événements de la modale PIN
     */
    attachPinEventListeners() {
        // Navigation automatique — saisie du PIN (entrée seulement, pas les champs création)
        const entryInputs = [
            document.getElementById('pin-digit-1'),
            document.getElementById('pin-digit-2'),
            document.getElementById('pin-digit-3'),
            document.getElementById('pin-digit-4')
        ].filter(Boolean);

        entryInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value && index < entryInputs.length - 1) {
                    entryInputs[index + 1].focus();
                } else if (e.target.value && index === entryInputs.length - 1) {
                    this.verifyPin();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    entryInputs[index - 1].focus();
                }
                if (e.key === 'Enter') this.verifyPin();
            });
            input.addEventListener('focus', (e) => e.target.select());
        });

        // Navigation dans les champs de création (new-1..4 puis conf-1..4)
        const newInputs = [1,2,3,4].map(i => document.getElementById(`pin-new-${i}`)).filter(Boolean);
        const confInputs = [1,2,3,4].map(i => document.getElementById(`pin-conf-${i}`)).filter(Boolean);
        const createInputs = [...newInputs, ...confInputs];

        createInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value && index < createInputs.length - 1) {
                    createInputs[index + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    createInputs[index - 1].focus();
                }
                if (e.key === 'Enter') this.confirmCreatePin();
            });
            input.addEventListener('focus', (e) => e.target.select());
        });

        // Bouton valider (entrée)
        const submitBtn = document.getElementById('pin-submit-btn');
        if (submitBtn) submitBtn.addEventListener('click', () => this.verifyPin());

        // Bouton annuler (entrée)
        const cancelBtn = document.getElementById('pin-cancel-btn');
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.cancelPin());

        // Bouton créer PIN (setup)
        const createBtn = document.getElementById('pin-create-btn');
        if (createBtn) createBtn.addEventListener('click', () => this.showCreatePinDialog());

        // Bouton ignorer (setup)
        const skipBtn = document.getElementById('pin-skip-btn');
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipPin());

        // Bouton œil (afficher/masquer lors de la création)
        const eyeBtn = document.getElementById('pin-eye-btn');
        if (eyeBtn) eyeBtn.addEventListener('click', () => this.toggleCreatePinVisibility());

        // Bouton confirmer création
        const confirmCreateBtn = document.getElementById('pin-confirm-create-btn');
        if (confirmCreateBtn) confirmCreateBtn.addEventListener('click', () => this.confirmCreatePin());

        // Bouton annuler création
        const cancelCreateBtn = document.getElementById('pin-cancel-create-btn');
        if (cancelCreateBtn) cancelCreateBtn.addEventListener('click', () => this.cancelCreatePin());
    }

    /**
     * Demander le code PIN avant d'accéder à une page
     *
     * @param {Function} onSuccess - Fonction à exécuter si le PIN est correct
     * @param {Function} onCancel - Fonction à exécuter si l'utilisateur annule
     */
    async requestPin(onSuccess, onCancel) {
        // Vérifier si un PIN est défini
        const hasPin = window.TzolkinStorage.hasPinCode();

        if (!hasPin) {
            // Aucun PIN défini : proposer d'en créer un
            this.showSetupOption(onSuccess, onCancel);
            return;
        }

        // Vérifier le verrouillage
        const lockoutEnd = localStorage.getItem('tzolkin_pin_lockout');
        if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
            const remainingMs = parseInt(lockoutEnd) - Date.now();
            const remainingMin = Math.ceil(remainingMs / 60000);
            alert(`Trop de tentatives échouées. Veuillez patienter encore ${remainingMin} minute(s).`);
            if (onCancel) onCancel();
            return;
        }

        // Afficher la modale PIN
        this.showPinModal(onSuccess, onCancel);
    }

    /**
     * Afficher la modale PIN
     */
    showPinModal(onSuccess, onCancel) {
        const modal = document.getElementById(this.pinModalId);
        if (!modal) return;

        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Cacher la section setup
        document.getElementById('pin-setup-section').style.display = 'none';

        // Réinitialiser les champs
        this.resetPinInputs();

        // Stocker les callbacks
        this.onPinSuccess = onSuccess;
        this.onPinCancel = onCancel;

        // Focus sur le premier champ
        setTimeout(() => {
            document.getElementById('pin-digit-1').focus();
        }, 100);
    }

    /**
     * Afficher l'option de création de PIN
     */
    showSetupOption(onSuccess, onCancel) {
        const modal = document.getElementById(this.pinModalId);
        if (!modal) return;

        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Afficher la section setup
        document.getElementById('pin-setup-section').style.display = 'block';

        // Cacher le formulaire de saisie
        document.querySelector('.pin-input-container').style.display = 'none';
        document.getElementById('pin-submit-btn').style.display = 'none';
        document.getElementById('pin-cancel-btn').style.display = 'none';

        // Stocker les callbacks
        this.onPinSuccess = onSuccess;
        this.onPinCancel = onCancel;
    }

    /**
     * Vérifier le code PIN saisi
     */
    async verifyPin() {
        const pin = this.getPinFromInputs();

        if (pin.length !== 4) {
            this.showError('Veuillez entrer les 4 chiffres');
            return;
        }

        const isValid = await window.TzolkinStorage.verifyPinCode(pin);

        if (isValid) {
            // PIN correct
            this.pinAttempts = 0;
            this.closePinModal();

            if (this.onPinSuccess) {
                this.onPinSuccess();
            }
        } else {
            // PIN incorrect
            this.pinAttempts++;

            if (this.pinAttempts >= this.maxAttempts) {
                // Verrouiller temporairement
                const lockoutEnd = Date.now() + this.lockoutTime;
                localStorage.setItem('tzolkin_pin_lockout', lockoutEnd.toString());

                this.showError(`Code PIN incorrect. ${this.maxAttempts} tentatives échouées. Verrouillage pendant 5 minutes.`);

                setTimeout(() => {
                    this.closePinModal();
                    if (this.onPinCancel) this.onPinCancel();
                }, 2000);
            } else {
                const remaining = this.maxAttempts - this.pinAttempts;
                this.showError(`Code PIN incorrect. ${remaining} tentative(s) restante(s).`);
                this.resetPinInputs();
            }
        }
    }

    /**
     * Annuler la saisie du PIN
     */
    cancelPin() {
        this.closePinModal();
        if (this.onPinCancel) {
            this.onPinCancel();
        }
    }

    /**
     * Ignorer le PIN (accès sans protection)
     */
    skipPin() {
        this.closePinModal();
        if (this.onPinSuccess) {
            this.onPinSuccess();
        }
    }

    /**
     * Ouvrir la modale directement en mode création (depuis Admin)
     */
    openForCreation(onSuccess) {
        const modal = document.getElementById(this.pinModalId);
        if (!modal) return;
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.querySelector('.pin-input-container').style.display = 'none';
        document.getElementById('pin-submit-btn').style.display = 'none';
        document.getElementById('pin-cancel-btn').style.display = 'none';
        document.getElementById('pin-setup-section').style.display = 'none';
        this.onPinSuccess = onSuccess;
        this.showCreatePinDialog();
    }

    /**
     * Afficher le formulaire de création de PIN (champs masqués, sans prompt)
     */
    showCreatePinDialog() {
        document.getElementById('pin-setup-section').style.display = 'none';
        document.getElementById('pin-create-section').style.display = 'block';
        this.hideError();
        // Réinitialiser tous les champs de création
        [1,2,3,4].forEach(i => {
            const n = document.getElementById(`pin-new-${i}`);
            const c = document.getElementById(`pin-conf-${i}`);
            if (n) { n.value = ''; n.type = 'password'; }
            if (c) { c.value = ''; c.type = 'password'; }
        });
        // Remettre l'icône œil en mode "masqué"
        const icon = document.getElementById('pin-eye-icon');
        if (icon) icon.setAttribute('data-visible', 'false');
        setTimeout(() => document.getElementById('pin-new-1')?.focus(), 100);
    }

    /**
     * Confirmer la création du PIN (valide et enregistre)
     */
    async confirmCreatePin() {
        const pin  = [1,2,3,4].map(i => document.getElementById(`pin-new-${i}`)?.value || '').join('');
        const conf = [1,2,3,4].map(i => document.getElementById(`pin-conf-${i}`)?.value || '').join('');

        if (!/^\d{4}$/.test(pin)) {
            this.showError('Entrez 4 chiffres pour le nouveau code');
            return;
        }
        if (pin !== conf) {
            this.showError('Les deux codes ne correspondent pas');
            return;
        }

        const success = await window.TzolkinStorage.setPinCode(pin);
        if (success) {
            this.closePinModal();
            if (this.onPinSuccess) this.onPinSuccess();
        }
    }

    /**
     * Annuler la création du PIN → revenir à l'option de setup
     */
    cancelCreatePin() {
        document.getElementById('pin-create-section').style.display = 'none';
        document.getElementById('pin-setup-section').style.display = 'block';
        this.hideError();
    }

    /**
     * Afficher / masquer les chiffres pendant la création
     */
    toggleCreatePinVisibility() {
        const inputs = document.querySelectorAll('.pin-create-digit');
        const isHidden = inputs[0]?.type === 'password';
        inputs.forEach(input => { input.type = isHidden ? 'text' : 'password'; });
        // Mettre à jour l'icône SVG (barrer l'œil quand visible)
        const icon = document.getElementById('pin-eye-icon');
        if (icon) {
            if (isHidden) {
                // Œil barré (code visible)
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';
            } else {
                // Œil normal (code masqué)
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
            }
        }
    }

    /**
     * Obtenir le PIN depuis les inputs
     */
    getPinFromInputs() {
        const digit1 = document.getElementById('pin-digit-1').value;
        const digit2 = document.getElementById('pin-digit-2').value;
        const digit3 = document.getElementById('pin-digit-3').value;
        const digit4 = document.getElementById('pin-digit-4').value;

        return `${digit1}${digit2}${digit3}${digit4}`;
    }

    /**
     * Réinitialiser les champs de saisie
     */
    resetPinInputs() {
        for (let i = 1; i <= 4; i++) {
            const input = document.getElementById(`pin-digit-${i}`);
            if (input) {
                input.value = '';
            }
        }

        document.getElementById('pin-digit-1').focus();
        this.hideError();
    }

    /**
     * Afficher un message d'erreur
     */
    showError(message) {
        const errorDiv = document.getElementById('pin-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    /**
     * Masquer le message d'erreur
     */
    hideError() {
        const errorDiv = document.getElementById('pin-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    /**
     * Fermer la modale PIN
     */
    closePinModal() {
        const modal = document.getElementById(this.pinModalId);
        if (!modal) return;

        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        this.resetPinInputs();
        this.pinAttempts = 0;

        // Remettre l'affichage par défaut
        document.querySelector('.pin-input-container').style.display = 'flex';
        document.getElementById('pin-submit-btn').style.display = 'none';
        document.getElementById('pin-cancel-btn').style.display = 'inline-block';
        document.getElementById('pin-setup-section').style.display = 'none';
        document.getElementById('pin-create-section').style.display = 'none';
    }

    /**
     * Supprimer le code PIN (fonction admin)
     */
    async removePinWithConfirmation() {
        const confirmed = confirm('Voulez-vous vraiment supprimer votre code PIN ?\nVos notes ne seront plus protégées.');

        if (!confirmed) {
            return;
        }

        // Demander le PIN actuel pour confirmation
        this.requestPin(() => {
            window.TzolkinStorage.removePinCode();
            alert('Code PIN supprimé avec succès.');
        }, null);
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

// Créer l'instance globale au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    window.tzolkinPIN = new TzolkinPIN();
    console.log('✅ Module PIN initialisé et accessible via window.tzolkinPIN');
});

console.log('✅ Tzolk\'in PIN chargé - Système de protection par code prêt');
