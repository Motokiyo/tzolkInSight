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
        this.lockoutTime = 30000; // 30 secondes de verrouillage après 3 échecs

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
                            <button type="button" id="pin-submit-btn" class="button button-primary">Valider</button>
                            <button type="button" id="pin-cancel-btn" class="button button-secondary">Annuler</button>
                        </div>

                        <div class="pin-setup" id="pin-setup-section" style="display:none;">
                            <hr />
                            <p><strong>Aucun code PIN défini.</strong></p>
                            <p>Voulez-vous en créer un pour protéger vos notes ?</p>
                            <button type="button" id="pin-create-btn" class="button button-primary">Créer un code PIN</button>
                            <button type="button" id="pin-skip-btn" class="button button-secondary">Accéder sans code</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Styles pour la modale PIN -->
            <style>
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
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.attachPinEventListeners();
    }

    /**
     * Attacher les événements de la modale PIN
     */
    attachPinEventListeners() {
        // Navigation automatique entre les champs
        const inputs = document.querySelectorAll('.pin-digit');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                // Ne garder que les chiffres
                e.target.value = e.target.value.replace(/[^0-9]/g, '');

                // Passer au champ suivant si un chiffre est entré
                if (e.target.value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                // Retour arrière : revenir au champ précédent
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }

                // Entrée : valider le PIN
                if (e.key === 'Enter') {
                    this.verifyPin();
                }
            });

            // Sélectionner tout le contenu au focus
            input.addEventListener('focus', (e) => {
                e.target.select();
            });
        });

        // Bouton valider
        const submitBtn = document.getElementById('pin-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.verifyPin());
        }

        // Bouton annuler
        const cancelBtn = document.getElementById('pin-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelPin());
        }

        // Bouton créer PIN
        const createBtn = document.getElementById('pin-create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showCreatePinDialog());
        }

        // Bouton ignorer
        const skipBtn = document.getElementById('pin-skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipPin());
        }
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
            const remainingSeconds = Math.ceil((parseInt(lockoutEnd) - Date.now()) / 1000);
            alert(`Trop de tentatives échouées. Veuillez patienter ${remainingSeconds} secondes.`);
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

                this.showError(`Code PIN incorrect. ${this.maxAttempts} tentatives échouées. Verrouillage pendant 30 secondes.`);

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
     * Afficher le dialogue de création de PIN
     */
    async showCreatePinDialog() {
        const pin = prompt('Créez un code PIN à 4 chiffres :\n(Notez-le bien, il ne pourra pas être récupéré)');

        if (!pin) {
            return; // Annulé
        }

        if (!/^\d{4}$/.test(pin)) {
            alert('Le PIN doit être composé de exactement 4 chiffres.');
            return;
        }

        const confirm = prompt('Confirmez votre code PIN :');

        if (confirm !== pin) {
            alert('Les codes PIN ne correspondent pas.');
            return;
        }

        const success = await window.TzolkinStorage.setPinCode(pin);

        if (success) {
            alert('Code PIN créé avec succès !');
            this.closePinModal();

            if (this.onPinSuccess) {
                this.onPinSuccess();
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
        document.getElementById('pin-submit-btn').style.display = 'inline-block';
        document.getElementById('pin-cancel-btn').style.display = 'inline-block';
        document.getElementById('pin-setup-section').style.display = 'none';
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
