/**
 * Tzolk'in Storage - Gestion du stockage local (notes, contacts, PIN)
 * Version: 2.0
 * Auteur: Alexandre Ferran + Claude AI
 * Date: Février 2026
 */

// ============================================================================
// IMPLÉMENTATION SHA256 SIMPLE
// ============================================================================

/**
 * Hashage SHA256 simplifié pour le navigateur
 * Utilise l'API Web Crypto si disponible, sinon fallback basique
 *
 * @param {string} message - Message à hasher
 * @returns {Promise<string>} Hash hexadécimal
 */
async function sha256(message) {
    // Utiliser l'API Web Crypto si disponible (moderne)
    if (window.crypto && window.crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback simple (moins sécurisé mais fonctionne partout)
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
        const char = message.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir en 32bit
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
}

// ============================================================================
// GESTION DU CODE PIN
// ============================================================================

/**
 * Vérifie si un code PIN est défini
 *
 * @returns {boolean} True si un PIN est configuré
 */
function hasPinCode() {
    return localStorage.getItem('tzolkin_pin_hash') !== null;
}

/**
 * Définir un nouveau code PIN
 *
 * @param {string} pin - Code PIN à 4 chiffres
 * @returns {Promise<boolean>} True si succès
 */
async function setPinCode(pin) {
    if (!/^\d{4}$/.test(pin)) {
        console.error('Le PIN doit être composé de 4 chiffres');
        return false;
    }

    const hash = await sha256(pin);
    localStorage.setItem('tzolkin_pin_hash', hash);
    console.log('✅ Code PIN défini avec succès');
    return true;
}

/**
 * Vérifier un code PIN
 *
 * @param {string} pin - Code PIN à vérifier
 * @returns {Promise<boolean>} True si correct
 */
async function verifyPinCode(pin) {
    const storedHash = localStorage.getItem('tzolkin_pin_hash');
    if (!storedHash) {
        // Aucun PIN défini = accès libre
        return true;
    }

    const inputHash = await sha256(pin);
    return inputHash === storedHash;
}

/**
 * Supprimer le code PIN
 */
function removePinCode() {
    localStorage.removeItem('tzolkin_pin_hash');
    console.log('✅ Code PIN supprimé');
}

// ============================================================================
// GESTION DES NOTES
// ============================================================================

/**
 * Sauvegarder une note
 * Utilise une clé utilisateur pour identifier le stockage
 *
 * @param {string} userKey - Clé personnelle de l'utilisateur
 * @param {Object} note - Note à sauvegarder { date, glyphId, numberId, text, emotion, color }
 * @returns {Promise<boolean>} True si succès
 */
async function saveNote(userKey, note) {
    if (!userKey || userKey.length < 4) {
        console.error('La clé utilisateur doit contenir au moins 4 caractères');
        return false;
    }

    try {
        // Hasher la clé utilisateur
        const hash = await sha256(userKey);
        const storageKey = `tzolkin_notes_${hash}`;

        // Charger notes existantes
        let notes = JSON.parse(localStorage.getItem(storageKey) || '[]');

        // Fusionner par date (même logique que PHP)
        const existingIndex = notes.findIndex(n => n.date === note.date);

        // Ajouter timestamp pour sync iCloud
        note.updatedAt = Date.now();

        if (existingIndex >= 0) {
            // Mettre à jour note existante
            notes[existingIndex] = note;
        } else {
            // Ajouter nouvelle note
            notes.push(note);
        }

        // Sauvegarder
        localStorage.setItem(storageKey, JSON.stringify(notes));

        // Sync iCloud
        syncToCloud();

        // Enregistrer la clé utilisateur si nouvelle
        registerUserKey(hash, userKey);

        console.log(`✅ Note sauvegardée pour ${note.date}`);
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la note:', error);
        return false;
    }
}

/**
 * Charger toutes les notes d'un utilisateur
 *
 * @param {string} userKey - Clé personnelle de l'utilisateur
 * @returns {Promise<Array>} Tableau de notes
 */
async function loadNotes(userKey) {
    if (!userKey) {
        return [];
    }

    try {
        const hash = await sha256(userKey);
        const storageKey = `tzolkin_notes_${hash}`;
        const notes = JSON.parse(localStorage.getItem(storageKey) || '[]');

        console.log(`✅ ${notes.length} note(s) chargée(s)`);
        return notes;
    } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
        return [];
    }
}

/**
 * Supprimer une note spécifique
 *
 * @param {string} userKey - Clé personnelle de l'utilisateur
 * @param {string} date - Date de la note à supprimer (format YYYY-MM-DD)
 * @returns {Promise<boolean>} True si succès
 */
async function deleteNote(userKey, date) {
    try {
        const hash = await sha256(userKey);
        const storageKey = `tzolkin_notes_${hash}`;

        let notes = JSON.parse(localStorage.getItem(storageKey) || '[]');
        notes = notes.filter(n => n.date !== date);

        localStorage.setItem(storageKey, JSON.stringify(notes));

        // Sync iCloud
        syncToCloud();

        console.log(`✅ Note du ${date} supprimée`);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        return false;
    }
}

/**
 * Enregistrer une clé utilisateur dans le registre
 * Permet de lister tous les utilisateurs (admin)
 *
 * @param {string} hash - Hash de la clé utilisateur
 * @param {string} userKey - Clé en clair (pour affichage partiel)
 */
function registerUserKey(hash, userKey) {
    const keysData = JSON.parse(localStorage.getItem('tzolkin_user_keys') || '{}');

    if (!keysData[hash]) {
        const userCount = Object.keys(keysData).length + 1;
        keysData[hash] = {
            label: `Utilisateur ${userCount}`,
            keyPreview: userKey.substring(0, 2) + '***',
            registeredAt: new Date().toISOString()
        };

        localStorage.setItem('tzolkin_user_keys', JSON.stringify(keysData));
    }
}

/**
 * Obtenir la liste de tous les utilisateurs (admin)
 *
 * @returns {Array} Liste des utilisateurs avec leurs hashs
 */
function getAllUserKeys() {
    const keysData = JSON.parse(localStorage.getItem('tzolkin_user_keys') || '{}');
    return Object.entries(keysData).map(([hash, data]) => ({
        hash: hash.substring(0, 8) + '...',
        label: data.label,
        keyPreview: data.keyPreview,
        registeredAt: data.registeredAt
    }));
}

// ============================================================================
// GESTION DES CONTACTS (Personnes)
// ============================================================================

/**
 * Ajouter un nouveau contact
 *
 * @param {Object} person - { name, birthDate, color, glyphId, numberId }
 * @returns {boolean} True si succès
 */
function addPerson(person) {
    try {
        // Valider les données
        if (!person.name || !person.birthDate) {
            console.error('Nom et date de naissance requis');
            return false;
        }

        // Calculer glyphe et nombre si pas fournis
        if (!person.glyphId || !person.numberId) {
            const birthDate = new Date(person.birthDate);
            const tzolkin = window.TzolkinCore.calculateTzolkin(birthDate);
            person.glyphId = tzolkin.glyphId;
            person.numberId = tzolkin.numberId;
        }

        // Générer couleur automatique si pas fournie
        if (!person.color) {
            person.color = window.TzolkinCore.generatePastelColor();
        }

        // Charger contacts existants
        let people = JSON.parse(localStorage.getItem('tzolkin_people_cycles') || '[]');

        // Ajouter le nouveau contact
        people.push({
            name: person.name,
            birthDate: person.birthDate,
            color: person.color,
            glyph: person.glyphId,
            number: person.numberId,
            updatedAt: Date.now()
        });

        // Sauvegarder
        localStorage.setItem('tzolkin_people_cycles', JSON.stringify(people));

        // Sync iCloud
        syncToCloud();

        console.log(`✅ Contact "${person.name}" ajouté`);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du contact:', error);
        return false;
    }
}

/**
 * Charger tous les contacts
 *
 * @returns {Array} Tableau de contacts
 */
function loadPeople() {
    try {
        const people = JSON.parse(localStorage.getItem('tzolkin_people_cycles') || '[]');
        console.log(`✅ ${people.length} contact(s) chargé(s)`);
        return people;
    } catch (error) {
        console.error('Erreur lors du chargement des contacts:', error);
        return [];
    }
}

/**
 * Supprimer un contact
 *
 * @param {number} index - Index du contact à supprimer
 * @returns {boolean} True si succès
 */
function deletePerson(index) {
    try {
        let people = JSON.parse(localStorage.getItem('tzolkin_people_cycles') || '[]');

        if (index < 0 || index >= people.length) {
            console.error('Index invalide');
            return false;
        }

        const deletedName = people[index].name;
        people.splice(index, 1);

        localStorage.setItem('tzolkin_people_cycles', JSON.stringify(people));

        // Sync iCloud
        syncToCloud();

        console.log(`✅ Contact "${deletedName}" supprimé`);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du contact:', error);
        return false;
    }
}

/**
 * Modifier un contact existant
 *
 * @param {number} index - Index du contact à modifier
 * @param {Object} updatedPerson - Nouvelles données
 * @returns {boolean} True si succès
 */
function updatePerson(index, updatedPerson) {
    try {
        let people = JSON.parse(localStorage.getItem('tzolkin_people_cycles') || '[]');

        if (index < 0 || index >= people.length) {
            console.error('Index invalide');
            return false;
        }

        // Mettre à jour les données
        people[index] = {
            name: updatedPerson.name || people[index].name,
            birthDate: updatedPerson.birthDate || people[index].birthDate,
            color: updatedPerson.color || people[index].color,
            glyph: updatedPerson.glyphId || people[index].glyph,
            number: updatedPerson.numberId || people[index].number,
            updatedAt: Date.now()
        };

        localStorage.setItem('tzolkin_people_cycles', JSON.stringify(people));

        // Sync iCloud
        syncToCloud();

        console.log(`✅ Contact "${people[index].name}" modifié`);
        return true;
    } catch (error) {
        console.error('Erreur lors de la modification du contact:', error);
        return false;
    }
}

/**
 * Obtenir les personnes correspondant à un jour Tzolk'in
 * Utilisé pour afficher les couleurs sur le calendrier
 *
 * @param {number} glyphId - Glyphe du jour
 * @param {number} numberId - Nombre du jour
 * @returns {Array} Personnes dont c'est un jour important
 */
function getMatchingPeople(glyphId, numberId) {
    const people = loadPeople();
    const matchingPeople = [];

    people.forEach(person => {
        const g = person.glyph;
        const n = person.number;

        if (!g || !n || g < 1 || g > 20 || n < 1 || n > 13) {
            return; // Skip invalid data
        }

        // Calculer les glyphes et nombres du cycle
        const cycleGlyphs = window.TzolkinCore.getCycleGlyphs(g);
        const cycleNumbers = window.TzolkinCore.getCycleNumbers(n);
        // cycleNumbers = [n-7, n, n-6(=n+7)]
        // Index 0 → Entrée de cycle (approche du jour central)
        // Index 1 → Jour central (le nombre de naissance revient)
        // Index 2 → Sortie de cycle (après le jour central)

        // Vérifier si le jour actuel fait partie du cycle de cette personne
        for (let gi = 0; gi < cycleGlyphs.length; gi++) {
            for (let ni = 0; ni < cycleNumbers.length; ni++) {
                if (cycleGlyphs[gi] === glyphId && cycleNumbers[ni] === numberId) {
                    const isExactDay = (g === glyphId && n === numberId);
                    const LABELS = ['entree', 'central', 'sortie'];
                    const cycleLabel = LABELS[ni];

                    // Extraire l'année de naissance pour le porteur d'année
                    let birthYear = null;
                    if (person.birthDate) {
                        birthYear = new Date(person.birthDate).getFullYear();
                    }

                    matchingPeople.push({
                        name: person.name,
                        color: person.color,
                        isExactDay,
                        cycleLabel,
                        cycleGlyphIdx: gi,
                        personGlyphId: g,
                        personNumberId: n,
                        birthYear,
                        birthDate: person.birthDate || null
                    });
                    return; // Stop après avoir trouvé une correspondance
                }
            }
        }
    });

    return matchingPeople;
}

// ============================================================================
// GESTION DES PRÉFÉRENCES
// ============================================================================

/**
 * Sauvegarder l'offset actuel du calendrier
 *
 * @param {number} offset - Offset en jours depuis aujourd'hui
 */
function saveOffset(offset) {
    localStorage.setItem('tzolkin_offset', offset.toString());
}

/**
 * Charger l'offset du calendrier
 *
 * @returns {number} Offset en jours
 */
function loadOffset() {
    return parseInt(localStorage.getItem('tzolkin_offset') || '0');
}

/**
 * Sauvegarder la clé utilisateur pour les notes
 *
 * @param {string} userKey - Clé personnelle
 */
function saveUserKey(userKey) {
    localStorage.setItem('tzolkin_user_key', userKey);
}

/**
 * Charger la clé utilisateur
 *
 * @returns {string|null} Clé utilisateur ou null
 */
function loadUserKey() {
    return localStorage.getItem('tzolkin_user_key');
}

/**
 * Supprimer la clé utilisateur (déconnexion)
 */
function clearUserKey() {
    localStorage.removeItem('tzolkin_user_key');
}

// ============================================================================
// HELPERS INTERNES
// ============================================================================

function syncToCloud() {
    if (window.TzolkinICloud && TzolkinICloud.available) {
        TzolkinICloud.syncToCloud();
    }
}

// ============================================================================
// EXPORT DES FONCTIONS
// ============================================================================

window.TzolkinStorage = {
    // Hashage
    sha256,

    // Gestion PIN
    hasPinCode,
    setPinCode,
    verifyPinCode,
    removePinCode,

    // Gestion Notes
    saveNote,
    loadNotes,
    deleteNote,
    getAllUserKeys,

    // Gestion Contacts
    addPerson,
    loadPeople,
    deletePerson,
    updatePerson,
    getMatchingPeople,

    // Préférences
    saveOffset,
    loadOffset,
    saveUserKey,
    loadUserKey,
    clearUserKey
};

console.log('✅ Tzolk\'in Storage chargé - Gestion du stockage local prête');
