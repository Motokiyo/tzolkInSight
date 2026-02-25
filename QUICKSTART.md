# ⚡ QUICKSTART - Tzolk'in App Autonome

## 🚀 Démarrage Immédiat (1 minute)

### Méthode 1 : Serveur local Python (recommandé)

```bash
# Dans le dossier tzolkin-app-autonome/
cd /Users/alexandre/CascadeProjects/Tzolkin/tzolkin-app-autonome

# Lancer le serveur
python3 -m http.server 8000

# Ouvrir dans le navigateur
open http://localhost:8000
```

### Méthode 2 : Serveur PHP

```bash
# Dans le dossier tzolkin-app-autonome/
php -S localhost:8000

# Ouvrir
open http://localhost:8000
```

### Méthode 3 : Double-clic (peut ne pas marcher partout)

- Ouvrez `index.html` directement dans votre navigateur
- ⚠️ Certaines fonctionnalités peuvent ne pas marcher (CORS, Service Worker)

---

## ✅ Vérification que ça marche

Une fois l'app ouverte, vous devriez voir :

1. ✨ **Splash screen** (3 secondes) avec le logo Tzolk'in
2. 📅 **Widget calendrier** avec le jour actuel (glyphe + nombre maya)
3. 🔽 **Menu fixe en bas** avec 5 boutons :
   - Calendrier
   - Fonctionnement
   - Notes
   - Crédits
   - Admin

**Testez :**
- Cliquez sur les flèches `<` et `>` pour naviguer entre les jours
- Cliquez sur "Notes" pour ouvrir le journal
- Cliquez sur "Admin" pour ajouter un contact

---

## 🧪 Test Complet (5 minutes)

### Test 1 : Navigation du calendrier

```
1. Ouvrez l'app
2. Cliquez sur ">" plusieurs fois
   → Le jour et la date doivent changer
3. Cliquez sur le bouton "Reset" (↻ en haut à droite)
   → Retour au jour actuel
4. Cliquez sur la date grégorienne
   → Un champ de saisie apparaît
5. Entrez "01/01/2026" et appuyez sur Entrée
   → Le calendrier se positionne sur cette date
```

**✅ Succès si :** Le calendrier affiche correctement les différents jours Tzolk'in

---

### Test 2 : Ajouter une note

```
1. Cliquez sur le bouton "Notes" (menu du bas)
2. Entrez une clé personnelle : "test1234"
3. Cliquez sur "Valider"
4. Cliquez sur "ROUE DES EMOTIONS..."
5. Choisissez "Joie, Sérénité, Extase"
   → Le fond devient jaune
6. Écrivez "Test de ma première note"
7. Attendez 1 seconde (sauvegarde automatique)
```

**✅ Succès si :** Le fond du textarea devient jaune

---

### Test 3 : Voir les notes enregistrées (avec PIN)

```
1. Dans la modale "Notes", cliquez sur "Enregistrés"
2. Un écran de code PIN apparaît :
   - Première fois : cliquez sur "Créer un code PIN"
   - Entrez "1234" puis confirmez "1234"
3. La modale "Enregistrés" s'ouvre
4. Vous devez voir votre note "Test de ma première note"
5. Cliquez sur "Télécharger CSV"
   → Un fichier tzolkin-notes.csv se télécharge
```

**✅ Succès si :** Vous voyez votre note et pouvez l'exporter

---

### Test 4 : Ajouter un contact

```
1. Cliquez sur "Admin" (menu du bas)
2. Remplissez :
   - Nom : Marie
   - Date de naissance : 15/03/1990
   - Laissez la couleur par défaut ou choisissez une autre
3. Cliquez sur "Enregistrer"
4. Marie apparaît dans la liste avec son jour Tzolk'in
5. Fermez la modale Admin
6. Naviguez dans le calendrier jusqu'à trouver le jour de Marie
   → Le fond du widget se colore !
7. Survolez le carré central
   → Le nom "Marie" s'affiche en haut
```

**✅ Succès si :** Les jours de Marie sont colorés sur le calendrier

---

## 🐛 Problèmes Courants

### Problème : "Cannot read property of undefined"

**Solution :** Les fichiers JavaScript ne sont pas chargés dans le bon ordre

```bash
# Vérifier que tous les fichiers existent
ls -la *.js
```

Fichiers requis :
- tzolkin-core.js
- tzolkin-storage.js
- tzolkin-widget.js
- tzolkin-admin.js
- tzolkin-pin.js

### Problème : Le widget ne s'affiche pas

**Solution :** Ouvrez la console (F12) et cherchez les erreurs

```javascript
// Dans la console, tapez :
window.TzolkinCore
window.TzolkinStorage
window.TzolkinWidget

// Si undefined, les fichiers ne sont pas chargés
```

### Problème : "Service Worker registration failed"

**Solution :** Normale si vous n'utilisez pas HTTPS ou localhost

- Pas critique, l'app fonctionne quand même
- Le mode hors-ligne ne marchera simplement pas

### Problème : Les notes ne se sauvegardent pas

**Vérification :**

```javascript
// Dans la console :
localStorage.getItem('tzolkin_user_key')
// Doit afficher votre clé

// Voir toutes les clés localStorage
Object.keys(localStorage).filter(k => k.startsWith('tzolkin'))
```

### Problème : Code PIN oublié

**Reset du PIN :**

```javascript
// Dans la console :
localStorage.removeItem('tzolkin_pin_hash');
location.reload();
```

---

## 📱 Installation sur Téléphone

### Android (PWA)

1. Ouvrez l'app sur Chrome Android
2. Menu (⋮) > "Ajouter à l'écran d'accueil"
3. Une icône "Tzolk'in" apparaît sur votre lanceur
4. L'app s'ouvre en plein écran (comme une app native)

### iOS (PWA)

1. Ouvrez l'app sur Safari iOS
2. Bouton Partager > "Sur l'écran d'accueil"
3. L'app est ajoutée à votre springboard

---

## 🔧 Compilation Android APK (Avancé)

```bash
# Installer les dépendances (une seule fois)
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialiser Capacitor
npx cap init "Tzolk'in du Parédé" org.leparede.tzolkin --web-dir .

# Ajouter la plateforme Android
npx cap add android

# Synchroniser les fichiers
npx cap sync

# Ouvrir dans Android Studio
npx cap open android

# Dans Android Studio :
# Build > Build Bundle(s) / APK(s) > Build APK

# L'APK sera dans :
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📊 Vérifier les Données Stockées

### Voir toutes les données dans localStorage

```javascript
// Dans la console du navigateur (F12)

// Notes
const userKey = localStorage.getItem('tzolkin_user_key');
console.log('Clé utilisateur:', userKey);

// Hash de la clé
window.TzolkinStorage.sha256(userKey).then(hash => {
    const storageKey = `tzolkin_notes_${hash}`;
    const notes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    console.log('Notes:', notes);
});

// Contacts
const people = JSON.parse(localStorage.getItem('tzolkin_people_cycles') || '[]');
console.log('Contacts:', people);

// Code PIN (hash)
const pinHash = localStorage.getItem('tzolkin_pin_hash');
console.log('PIN hash:', pinHash);
```

---

## 🎯 Prochaines Étapes

1. **Test complet :** Suivez les 4 tests ci-dessus
2. **Ajoutez vos vrais contacts** (famille, amis, amoureux)
3. **Tenez votre journal** pendant quelques jours
4. **Exportez vos notes** en CSV pour backup
5. **Installez sur mobile** pour utilisation quotidienne

---

## 💡 Astuces

- **Clé personnelle :** Utilisez quelque chose de mémorable mais personnel
- **Code PIN :** Notez-le quelque part, il ne peut PAS être récupéré
- **Backup :** Exportez vos notes en CSV régulièrement
- **Contacts :** Ajoutez tous vos proches pour voir leurs jours importants
- **Couleurs :** Choisissez des couleurs distinctes pour chaque personne

---

## 📞 Besoin d'Aide ?

Consultez le [README.md](README.md) complet pour :
- Documentation détaillée
- Architecture du code
- FAQ complète
- Support et contact

---

**Bon voyage dans le Tzolk'in ! 🌟**
