# Plan d'internationalisation — TzolkInSight

## Objectif
Rendre l'app disponible en francais (existant), anglais et espagnol.
Systeme extensible pour ajouter des langues et des pages sans tout casser.

---

## Architecture technique

### Structure des fichiers

```
tzolkInSight/
  i18n/
    i18n-loader.js      # Module central
    fr.json              # Francais (langue source)
    en.json              # Anglais
    es.json              # Espagnol
```

### i18n-loader.js — Fonctionnalites

```javascript
// API publique
window.i18n = {
  currentLang: 'fr',           // langue active
  setLang(lang),                // change la langue, sauve dans localStorage, recharge les textes
  t(key, params),               // traduit une cle, supporte interpolation : t('hello', {name: 'Alex'})
  getLang(),                     // retourne la langue courante
  getAvailableLangs(),           // ['fr', 'en', 'es']
  onLangChange(callback),       // hook pour reagir au changement
};
```

**Detection automatique** (ordre de priorite) :
1. `localStorage.getItem('tzolkin-lang')`
2. `navigator.language` (fr-FR → fr, en-US → en, es-* → es)
3. Fallback : `'fr'`

**Chargement** : fetch async du JSON au demarrage + cache en memoire.

### Structure JSON (par module)

```json
{
  "menu": {
    "calendar": "Calendrier",
    "notes": "Notes",
    "saved": "Enregistres",
    "credits": "Credits"
  },
  "widget": {
    "today": "Aujourd'hui",
    "prev": "Precedent",
    "next": "Suivant"
  },
  "details": {
    "corn_family": "Famille de mais",
    "maya_cross": "Croix Maya",
    "lord_of_night": "Seigneur de la Nuit"
  },
  "notes": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "confirm_date": "Vous souhaitez enregistrer un message pour le {date} ?",
    "time_label": "Heure",
    "location_label": "Ville"
  },
  "export": {
    "download": "Telecharger",
    "upload": "Uploader",
    "csv": "CSV",
    "txt": "TXT",
    "pdf": "PDF"
  },
  "splash": { ... },
  "credits": { ... },
  "corn_family": { ... },
  "maya_cross": { ... }
}
```

### Selecteur de langue

- Ajoute dans le menu (tzolkin-menu-standalone.html) un selecteur FR | EN | ES
- Visuellement : drapeaux ou codes langue, discret en bas du menu
- Changement = rechargement des textes sans reload de page (DOM update)

### Integration HTML

Deux strategies complementaires :
1. **data-i18n="key"** sur les elements statiques → le loader les met a jour automatiquement
2. **t('key')** dans le JS pour les strings dynamiques (alerts, texte genere)

```html
<!-- Avant -->
<button>Enregistrer</button>

<!-- Apres -->
<button data-i18n="notes.save">Enregistrer</button>
```

### Contenu specialise (donnees maya)

Les descriptions des glyphes, trecenas, familles de mais etc. sont dans des fichiers JS de data.
Deux approches possibles :
- **A) Cles i18n** : chaque description a une cle → gros JSONs mais coherent
- **B) Fichiers data par langue** : `tzolkin-details-data-fr.js`, `-en.js`, `-es.js`

**Recommandation** : Option A pour les strings courtes (UI), Option B pour les gros blocs de contenu (descriptions, paragraphes). Cela evite des JSONs de 5000 lignes.

---

## Phases et agents

### Phase 1 — Architecture (Agent Architecte)
- Creer `i18n/i18n-loader.js`
- Creer la structure JSON vide
- Ajouter le selecteur de langue au menu
- Charger le module dans index.html
- **Critere** : `t('test.hello')` retourne la bonne valeur selon la langue

### Phase 2 — Extraction (Agent Extracteur)
- Parcourir CHAQUE fichier JS/HTML
- Extraire TOUTES les strings francaises visibles par l'utilisateur
- Generer `fr.json` complet avec cles semantiques
- Generer un rapport : fichier → strings trouvees → cles assignees
- **Critere** : fr.json contient toutes les strings, aucun oubli

### Phase 3 — Traduction (Agents Traducteur EN + ES, en parallele)
- Traduire `fr.json` → `en.json` et `es.json`
- Contexte : terminologie maya, spiritualite, calendrier sacre
- Garder les termes mayas tels quels (Imix, Ik, Akbal, K'iche'...)
- Adapter les dates au format local (DD/MM/YYYY vs MM/DD/YYYY)
- **Critere** : memes cles dans les 3 fichiers, traductions naturelles

### Phase 4 — Injection (Agent Injecteur)
- Remplacer les strings hardcodees par `t('cle')` ou `data-i18n="cle"`
- Fichiers concernes (par priorite) :
  1. `tzolkin-menu-standalone.html` (menu, modales)
  2. `tzolkin-details-display.js` (resume du jour)
  3. `tzolkin-details.js` (vue detail)
  4. `tzolkin-widget.js` (widget calendrier)
  5. `tzolkin-croix-maya.js` (croix maya)
  6. `tzolkin-app-interactive.js` (notes, popups)
  7. `index.html` (splash, structure)
  8. `sw-detector.js` (messages SW)
- **Critere** : zero string FR hardcodee dans le code (sauf noms propres mayas)

### Phase 5 — Verification (Agent Verificateur)
- Comparer les 3 JSON : cles manquantes ?
- Scanner le code : strings FR residuelles ?
- Verifier les longueurs (un bouton EN trop long qui casse le layout ?)
- Tester le selecteur de langue
- **Critere** : rapport vert, aucune cle manquante

### Phase 6 — Test & Integration (Agent Testeur)
- Lancer le serveur local, tester chaque langue
- Verifier le cache SW (ajout des JSON au cache)
- Tester offline
- `npx cap sync android`
- Build APK debug
- **Critere** : app fonctionnelle dans les 3 langues, online et offline

---

## Scalabilite : ajouter une page ou une langue

### Ajouter une page
1. Creer la page avec `data-i18n="section.key"` sur les textes statiques
2. Ajouter les cles dans `fr.json`, `en.json`, `es.json`
3. Utiliser `t('section.key')` pour les textes dynamiques en JS
4. Lancer l'agent Verificateur pour confirmer la coherence

### Ajouter une langue
1. Copier `fr.json` → `{lang}.json`
2. Traduire toutes les valeurs
3. Ajouter le code langue dans `i18n-loader.js` (liste des langues disponibles)
4. Ajouter le drapeau/bouton dans le selecteur
5. Lancer l'agent Verificateur

---

## Fichiers impactes (estimation)

| Fichier | Type de changement |
|---------|-------------------|
| index.html | Ajout script i18n-loader.js, data-i18n sur textes statiques |
| tzolkin-menu-standalone.html | Selecteur langue, data-i18n sur tout le menu/modales |
| tzolkin-widget.js | t() sur labels jours/mois/navigation |
| tzolkin-details-display.js | t() sur descriptions, labels |
| tzolkin-details.js | t() sur titres, boutons |
| tzolkin-details-data.js | Nouveau : fichiers data par langue OU cles i18n |
| tzolkin-croix-maya.js | t() sur labels, descriptions |
| tzolkin-app-interactive.js | t() sur popups, confirmations, labels notes |
| sw-detector.js | t() sur messages mise a jour |
| sw.js | Ajout des JSON i18n au cache |
| manifest.json | Potentiellement dupliquer pour chaque langue (optionnel) |
