# 🌟 Tzolk'in du Parédé - Application Autonome

Version 2.0 - Février 2026
Auteur : Alexandre Ferran + Claude AI

---

## 📖 Description

**Tzolk'in du Parédé** est une application web progressive (PWA) dédiée au calendrier sacré Maya, le **Tzolk'in**, un cycle de 260 jours combinant 20 glyphes (Nawals) et 13 nombres.

Cette application vous permet de :
- 📅 Découvrir votre jour Tzolk'in quotidien
- 📝 Tenir un journal spirituel avec émotions
- 👥 Gérer vos contacts (famille, amis) et voir leurs jours importants
- 🔐 Protéger vos notes par un code PIN à 4 chiffres
- 💾 Stocker toutes vos données **localement** sur votre appareil (aucun serveur nécessaire)

---

## 🚀 Installation et Utilisation

### Option 1 : Utilisation Web (navigateur)

1. **Ouvrir l'application :**
   - Double-cliquez sur `index.html`
   - OU utilisez un serveur local :
     ```bash
     python3 -m http.server 8000
     # Puis visitez http://localhost:8000
     ```

2. **Installer comme PWA (app standalone) :**
   - Sur **Android Chrome** : Menu > "Ajouter à l'écran d'accueil"
   - Sur **iOS Safari** : Partager > "Sur l'écran d'accueil"
   - Sur **Desktop Chrome** : Icône "Installer" dans la barre d'adresse

### Option 2 : Compilation Android (APK)

1. **Installer Node.js et Capacitor :**
   ```bash
   npm install
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Configurer Capacitor :**
   ```bash
   npx cap init "Tzolk'in du Parédé" org.leparede.tzolkin --web-dir .
   npx cap add android
   ```

3. **Compiler l'APK :**
   ```bash
   npx cap sync
   npx cap open android
   ```

4. **Dans Android Studio :**
   - Build > Build Bundle(s) / APK(s) > Build APK
   - Le fichier APK sera dans `android/app/build/outputs/apk/debug/`

5. **Installer sur Android :**
   - Transférez l'APK sur votre téléphone
   - Activez "Sources inconnues" dans les paramètres
   - Installez l'APK

---

## 📂 Structure des Fichiers

### Fichiers JavaScript Principaux

| Fichier | Description |
|---------|-------------|
| **tzolkin-core.js** | Moteur de calcul Tzolk'in, données des glyphes/nombres/trécénas |
| **tzolkin-storage.js** | Gestion du stockage local (notes, contacts, code PIN) |
| **tzolkin-widget.js** | Génération dynamique du widget calendrier |
| **tzolkin-admin.js** | Modale de gestion des contacts |
| **tzolkin-pin.js** | Système de code PIN à 4 chiffres |

### Fichiers HTML/CSS

| Fichier | Description |
|---------|-------------|
| **index.html** | Point d'entrée de l'application |
| **tzolkin-menu-standalone.html** | Menu et modales (Notes, Enregistrés, Fonctionnement, Crédits) |
| **style.css** | Styles globaux, polices, thème |
| **tzolkin-*.css** | Styles spécifiques (splash, menu, détails, page) |

### Assets

| Dossier | Contenu |
|---------|---------|
| **assets/glyphs/** | 20 SVG des glyphes mayas |
| **assets/numbers/** | 14 SVG des chiffres mayas (0-13) |
| **assets/boutons/** | Boutons du menu (SVG + PNG) |
| **fonts/** | 9 polices personnalisées (maya, déco) |
| **icons/** | Icônes PWA (512px, 192px, 180px) |

---

## 🔧 Fonctionnalités Détaillées

### 1. Calendrier Tzolk'in (Widget Principal)

- **Affichage du jour actuel** : Glyphe + Nombre + Date grégorienne
- **Navigation :**
  - Boutons `<` et `>` pour jour précédent/suivant
  - Clic sur la date pour saisir une date personnalisée
  - Bouton "Reset" pour retourner à aujourd'hui
- **Affichage des jours importants :**
  - Si des contacts ont un jour Tzolk'in correspondant, leur couleur s'affiche en fond
  - Au survol du carré central, les noms des personnes s'affichent

### 2. Module Notes (Journal Spirituel)

Accessible via le menu "Notes" :

- **Saisie de notes quotidiennes**
- **Sélection d'émotion :** Roue de Plutchik à 8 couleurs
  - Joie / Tristesse / Peur / Colère
  - Surprise / Confiance / Dégoût / Anticipation
- **Sauvegarde automatique** : Les notes sont enregistrées en temps réel
- **Clé personnelle** : Vos notes sont associées à une clé que vous choisissez (minimum 4 caractères)

### 3. Module Enregistrés (Archive)

Accessible via le menu "Notes" > "Enregistrés" :

- **Protection par code PIN :** Un code à 4 chiffres est demandé la première fois
- **Liste de toutes les notes** sauvegardées
- **Filtres :**
  - Par glyphe (ex: afficher uniquement les jours Imix)
  - Par nombre (ex: afficher uniquement les jours 13)
  - Par date grégorienne (jj/mm/aaaa)
- **Tri :**
  - Chronologique (ancien → récent)
  - Antichronologique (récent → ancien)
- **Actions :**
  - Modifier une note passée
  - Supprimer une note
  - Exporter tout en CSV

### 4. Module Admin (Gestion des Contacts)

Accessible via le menu "Admin" :

- **Ajouter un contact :**
  - Nom
  - Date de naissance → calcul automatique du glyphe et nombre Tzolk'in
  - Couleur (générée automatiquement mais modifiable)
- **Liste des contacts** avec aperçu de leur jour Tzolk'in
- **Modifier / Supprimer** un contact
- **Effet sur le calendrier :**
  - Les jours importants du contact sont colorés sur le widget
  - Les noms s'affichent au survol

### 5. Module Fonctionnement

Accessible via le menu "Fonctionnement" :

- **Explication du calendrier Tzolk'in**
- **Signification des 20 glyphes**
- **Signification des 13 nombres**
- **Descriptions des 20 trécénas**
- **Manuel d'utilisation** de l'application

### 6. Code PIN (Sécurité)

- **Création optionnelle** d'un code PIN à 4 chiffres
- **Protection de la page "Enregistrés"** uniquement
- **3 tentatives** avant verrouillage de 30 secondes
- **Stockage sécurisé** : Le PIN est hashé en SHA256
- **Réinitialisation** : Possible en supprimant les données de l'app

---

## 💾 Stockage des Données

### LocalStorage (navigateur / app)

Toutes les données sont stockées **localement** sur votre appareil dans `localStorage` :

| Clé | Contenu |
|-----|---------|
| `tzolkin_notes_{HASH}` | Notes d'un utilisateur (JSON) |
| `tzolkin_people_cycles` | Liste des contacts (JSON) |
| `tzolkin_pin_hash` | Hash SHA256 du code PIN |
| `tzolkin_user_key` | Clé personnelle en clair |
| `tzolkin_offset` | Offset de navigation du calendrier |

### Format des Données

**Note :**
```json
{
  "date": "2026-02-01",
  "glyphId": 9,
  "numberId": 9,
  "text": "Belle journée, méditation profonde",
  "emotion": "Joie,Sérénité,Extase",
  "color": "#FFFF99"
}
```

**Contact :**
```json
{
  "name": "Marie",
  "birthDate": "1990-03-15",
  "glyph": 5,
  "number": 9,
  "color": "#FF69B4"
}
```

---

## 🔐 Sécurité et Confidentialité

### Données 100% Locales

- ✅ **Aucun serveur** : Toutes vos données restent sur votre appareil
- ✅ **Aucune connexion internet** nécessaire (sauf installation initiale)
- ✅ **Aucune collecte de données** : Vos notes ne sont JAMAIS envoyées ailleurs
- ✅ **Code PIN optionnel** : Protégez vos notes personnelles

### Hashage des Clés

- Les clés utilisateur sont hashées en **SHA256** avant stockage
- Le code PIN est également hashé (non stocké en clair)
- Impossible de récupérer un PIN ou une clé perdue → notez-les bien !

### Export des Données

- **Export CSV** disponible dans la page "Enregistrés"
- Permet de sauvegarder vos notes hors de l'app
- Format : `Date, Glyphe, Chiffre, Couleur, Note`

---

## 🛠️ Développement

### Technologies Utilisées

- **Frontend :** HTML5, CSS3, JavaScript (Vanilla, aucun framework)
- **PWA :** Service Worker, Manifest, mode hors-ligne
- **Stockage :** localStorage (Web Storage API)
- **Capacitor :** Compilation Android/iOS (optionnel)
- **Polices :** 9 polices personnalisées (Maya, Summer, Simplifica, etc.)

### Architecture

```
index.html (point d'entrée)
├── tzolkin-core.js (données + calculs)
├── tzolkin-storage.js (localStorage)
├── tzolkin-widget.js (génération widget)
├── tzolkin-admin.js (gestion contacts)
├── tzolkin-pin.js (code PIN)
└── tzolkin-menu-standalone.html (modales)
```

### Calcul du Jour Tzolk'in

**Date de référence :**
- 22 avril 2025 = **11 Chicchan**

**Formule :**
```javascript
const diffDays = (dateActuelle - dateReference) / (1000 * 60 * 60 * 24);
const glyphId = modAdjust(baseGlyph + diffDays, 20);
const numberId = modAdjust(baseNumber + diffDays, 13);
```

**Modulo ajusté :**
```javascript
function modAdjust(x, m) {
    let result = x % m;
    if (result <= 0) result += m;
    return result; // Retourne 1 à m (pas 0 à m-1)
}
```

---

## 📱 Compatibilité

### Navigateurs

- ✅ Chrome / Chromium (Desktop + Mobile)
- ✅ Firefox (Desktop + Mobile)
- ✅ Safari (Desktop + iOS)
- ✅ Edge (Desktop + Mobile)

### Systèmes

- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux
- ✅ Android 6.0+
- ✅ iOS 11.3+

### Fonctionnalités Hors-ligne

- ✅ Calendrier Tzolk'in (calculs locaux)
- ✅ Notes et consultation (localStorage)
- ✅ Gestion contacts (localStorage)
- ✅ Toutes les fonctionnalités (100% autonome)

---

## ❓ FAQ

### Comment sauvegarder mes données ?

**Méthode 1 :** Export CSV
- Allez dans "Enregistrés" > "Télécharger CSV"
- Conservez ce fichier en backup

**Méthode 2 :** Backup du localStorage
- Sur Android : Les données persistent sauf si vous désinstallez l'app
- Sur navigateur : Videz pas le cache/cookies du site

### J'ai oublié mon code PIN, que faire ?

Malheureusement, **il n'y a aucun moyen de récupérer un PIN oublié**.

**Solutions :**
1. Attendez 30 secondes après 3 tentatives échouées
2. Dans la console du navigateur, tapez :
   ```javascript
   localStorage.removeItem('tzolkin_pin_hash');
   ```
3. Rechargez la page : le PIN sera supprimé

**⚠️ Notez bien votre PIN lors de sa création !**

### Comment changer mon code PIN ?

Actuellement, il faut :
1. Supprimer l'ancien PIN (voir ci-dessus)
2. Réaccéder à "Enregistrés" pour en créer un nouveau

### Mes couleurs de contacts ne s'affichent pas ?

Vérifiez que :
- Le contact a bien une **date de naissance** renseignée
- Le **glyphe et nombre** ont été calculés automatiquement
- Vous êtes sur un jour faisant partie du **cycle de 40 jours** du contact

### Puis-je utiliser l'app sans connexion internet ?

**OUI** ! Une fois l'app chargée la première fois :
- Toutes les données sont en cache (Service Worker)
- Le calendrier fonctionne 100% hors-ligne
- Vos notes sont stockées localement
- Aucune connexion requise

---

## 📜 Crédits

**Auteur :** Alexandre Mathieu Motokiyo Ferran
**Site web :** [leparede.org](https://leparede.org)
**Assistance IA :** Grok, DeepSeek, Claude (Anthropic)
**Version :** 2.0 (Février 2026)
**Licence :** Usage personnel et éducatif

**Remerciements :**
- Communauté Maya pour la préservation de ce savoir ancestral
- Tous les utilisateurs du Tzolk'in du Parédé

---

## 🐛 Bugs Connus et Limitations

- **iOS Safari :** Le mode plein écran PWA peut avoir des glitches sur anciennes versions
- **Export CSV :** Encodage UTF-8 parfois problématique sur Excel Windows (utiliser Google Sheets)
- **Code PIN :** Pas de récupération possible si oublié (feature de sécurité)

---

## 🔮 Évolutions Futures

- [ ] Synchronisation cloud optionnelle (Google Drive, Dropbox)
- [ ] Notifications push pour les jours importants
- [ ] Thèmes de couleurs personnalisables
- [ ] Widget Android natif (affichage sur l'écran d'accueil)
- [ ] Statistiques émotionnelles (graphiques)
- [ ] Import/Export complet des données

---

## 📞 Support

Pour toute question, suggestion ou bug :
- **Email :** contact@leparede.org
- **GitHub :** [Issues](https://github.com/leparede/tzolkin/issues)

---

**Merci d'utiliser Tzolk'in du Parédé !** 🙏✨

_« Le temps n'est pas linéaire, il est cyclique. Chaque jour Tzolk'in porte une énergie unique. »_
