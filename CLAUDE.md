# TzolkInSight — Instructions Claude Code

## Projet
PWA calendrier maya sacré (Tzolk'in) + wrappers Capacitor 8 Android (Play Store) et iOS (App Store).
App gratuite, sans pub, données 100% locales (localStorage + IndexedDB).
Repo GitHub : https://github.com/Motokiyo/tzolkin_PWA (public, GitHub Pages pour docs/)

## Architecture
- **Racine** = source de vérité (HTML, JS, CSS, i18n/)
- `www/` = miroir web, généré par `./build.sh` (rsync). **Ne jamais éditer www/ directement.**
- `android/` = projet Capacitor Android (compileSdk 36, minSdk 24, targetSdk 36)
- `ios/` = projet Capacitor iOS
- `i18n/` = traductions fr/en/es + i18n-loader.js
- `docs/` = privacy-policy.html, support.html, ios-deployment.md, keystore.md, PLAN-I18N.md
- `assets/` = glyphes SVG (×20), nombres SVG (×14, 0-13), Seigneurs de la Nuit SVG (×9, G1-G9), boutons menu, icônes, background

## Fichiers principaux

### HTML
| Fichier | Rôle |
|---|---|
| `index.html` | Point d'entrée : splash screen (10s auto-hide), widget container, detail-view, chargement dynamique de menu-standalone |
| `tzolkin-menu-standalone.html` | Tout le contenu modal : menu fixe bas (5 boutons + Commander Analyse), modales Fonctionnement/Notes/Enregistrés/Crédits/Admin/Croix Maya, popups (date-confirm, time-location, post-csv, analyse-confirm) + ~1500 lignes de JS embarqué |

### JS (17 fichiers racine, ~9200 lignes)
| Fichier | Rôle |
|---|---|
| `tzolkin-core.js` | Moteur calcul : `calculateTzolkin(date)`, `calculateCroixMaya()`, `calculateLordOfNight()`, `getYearBearerGlyph()`. Exporte GLYPHS, NUMBERS, TRECENAS, LORDS_OF_NIGHT. Date ref : 22 avril 2025 = 11 Chicchan |
| `tzolkin-widget.js` | Widget calendrier : navigation ±jours, input date libre, reset today. Gradient conique si multi-contacts. Expose `window.TzolkinWidget` |
| `tzolkin-details.js` | Routage vue détail : `showDetail(type, id)` avec history.pushState |
| `tzolkin-details-display.js` | Carte résumé sous le widget : glyphe, ton, trécéna, "Jour important pour". Helper `const t = k => ...` |
| `tzolkin-details-data.js` | Descriptions longues HTML des glyphes/nombres/trécénas (FR) |
| `tzolkin-details-summary-data.js` | Descriptions courtes pour résumés |
| `tzolkin-croix-maya.js` | Croix Maya K'iche' : 5 positions (Centre/Est/Ouest/Nord/Sud) + Seigneur de la Nuit G1-G9 + Porteurs d'année. Helper `function _tc(key)` |
| `tzolkin-admin.js` | Contacts : formulaire nom/date/couleur, cards flex, boutons modifier/supprimer/croix-maya. Gestion PIN (changer/désactiver). Injecte bouton "Réglages" dans le menu |
| `tzolkin-storage.js` | Couche localStorage : notes CRUD, contacts, PIN SHA256, CSV import/export, PDF (html2pdf), GPS cache (Nominatim) |
| `tzolkin-pin.js` | Code PIN 4 chiffres : SHA256, 3 tentatives max, lockout 5 min |
| `tzolkin-app-interactive.js` | Logique menu/modales/navigation : openModal/closeAllModals, popstate handler (back Android), auto-hide menu (3s inactivité), splash dismiss |
| `email-composer.js` | Wrapper Capacitor EmailComposer : actif sur natif, fallback silencieux sur web |
| `imask.js` | Librairie externe : masquage input dates (DD/MM/YYYY) |
| `sw.js` | Service Worker v4.7 : cache 100+ assets, stratégie stale-while-revalidate |
| `sw-detector.js` | Détection mises à jour SW, modal update, cooldown 12h |

### i18n (12 fichiers, 3 langues)
| Fichier | Rôle |
|---|---|
| `i18n/i18n-loader.js` | Détection langue (localStorage → navigator.language → FR), charge JSON, expose `window.i18n.t(key)`, `applyToDOM()`, `onReady()` |
| `i18n/ui-{fr,en,es}.json` | Strings UI : menu, widget, details, notes, saved, pin, settings, analysis, croix_maya, emotions, how_it_works, credits |
| `i18n/details-data-{en,es}.js` | Descriptions longues traduites (lazy-load si non-FR) |
| `i18n/summary-data-{en,es}.js` | Résumés traduits |
| `i18n/core-data-{en,es}.js` | Données système traduites |
| `i18n/corn-family-{en,es}.js` | Familles de maïs traduites (Popol Vuh, cérémonies, nawals) |

### Données JSON
- `glyphes.json` — 20 glyphes avec descriptions complètes
- `chiffres.json` — 13 nombres mayas
- `trecenas.json` — 20 trécénas (cycles de 13 jours)
- `porteurs.json` — 4 porteurs d'année (Manik/Eb/Caban/Ik)

### CSS (8 fichiers)
`style.css` (principal, polices, fond x-balanque.png), `tzolkin-widget-styles.css`, `tzolkin-details.css`, `tzolkin-page.css`, `tzolkin-splash.css`, `tzolkin-menu.css`, `tzolkin-croix-maya.css`, `tzolkin-standalone-fixes.css` (safe-area, notch)

## Commandes
```bash
./build.sh                    # Génère www/ (rsync, exclut node_modules, android, ios, docs, tools, etc.)
./bump-version.sh <version>   # Bump version dans index.html, sw.js, sw-detector.js, menu-standalone + sync www/
                              # NE TOUCHE PAS android/app/build.gradle (versionCode/versionName = manuel)
npx cap sync android          # Sync www/ → projet Android
npx cap sync ios              # Sync www/ → projet iOS
cd android && ./gradlew bundleRelease  # AAB signé pour Play Store
# iOS : xcodebuild archive → xcodebuild -exportArchive → Transporter → App Store Connect
```

## Fonctionnalités clés

### Widget calendrier
Navigation ±jours, input date, reset. Affiche glyphe SVG + nombre SVG + "Jour important pour" (contacts). Fond gradient conique si multi-contacts.

### Notes (journal spirituel)
Roue des émotions de Plutchik (8×3 intensités). Textarea auto-save. Support jours passés (confirmation date + heure + ville GPS Nominatim). Export CSV/TXT/PDF, import CSV.

### Enregistrés (historique notes)
Protégé par PIN. Filtres par glyphe/nombre/date, tri chrono/antichrono. Actions : éditer, supprimer, copier.

### Croix Maya K'iche'
5 positions depuis date de naissance : Centre (naissance), Est (conception), Ouest (mission), Nord (guide), Sud (soutien). Seigneur de la Nuit G1-G9. Porteurs d'année. Grille 3×3 cliquable.

### Contacts (Réglages)
Formulaire nom/date/couleur avec aperçu Tzolk'in auto. Cards flex. Bouton ⊕ → ouvre Croix Maya du contact.

### Commander Analyse (50€)
Popup confirmation avec checkbox obligatoire → envoie CSV par email à tzolkinsight@leparede.org. Capacitor EmailComposer (natif) ou fetch (web). Paiement externe (lien email).

### Soutenir le projet (tips) — DUAL iOS / web+Android
- **iOS natif** : IAP StoreKit via `cordova-plugin-purchase` v13 — 3 consumables : `petit_cafe` (1,99€), `soutien` (4,99€), `grand_soutien` (9,99€)
  - Code dans `tzolkin-iap.js` : `initIAP()`, `purchaseTip(productId)`, `isIOSNative()`
  - Boutons pilules dans `#tip-jar-iap` (masqué par défaut, affiché si iOS)
  - Popup remerciement `#tip-thank-you-popup`
  - Clés i18n : `tips.small`, `tips.medium`, `tips.large`, `tips.thank_you_*`
- **Web + Android** : lien Revolut (`revolut.me/galaadmf`) dans `#tip-jar-revolut`
- Détection dans `tzolkin-menu-standalone.html` (IIFE au début du script) : `isIOSNative()` → switch affichage

### Modale Crédits ("second splash")
Layout sidebar navy (Galaad company, `padding:0` sur modal-content pour sidebar bord-à-bord) + main beige (app info, version, IA credits, site web, boutons tips, email).

## Détection de plateforme
- `window.Capacitor` — présent sur natif (Android + iOS)
- `window.Capacitor?.isNativePlatform?.()` — true sur natif
- `window.Capacitor?.getPlatform?.()` — retourne `'android'`, `'ios'`, ou `'web'`
- `isIOSNative()` dans `tzolkin-iap.js` — combine les 3 checks ci-dessus

## Liens externes dans l'app
- `https://leparede.org` — site web (crédits)
- `https://nominatim.openstreetmap.org` — reverse geocoding GPS
- `https://revolut.me/galaadmf` — donations (crédits)
- `mailto:tzolkinsight@leparede.org` — support + commandes analyse
- `mailto:motokiyoferran@gmail.com` — contact perso (crédits)

## Équipe d'agents spécialisés (dans `~/.claude/agents/`)

### Pipeline i18n — OBLIGATOIRE quand on ajoute du texte visible utilisateur
| Agent | Rôle | Quand l'invoquer |
|---|---|---|
| `tzolkin-extracteur` | Scanne JS/HTML, identifie les strings FR hardcodées | Nouvelle page/fonctionnalité |
| `tzolkin-injecteur` | Remplace strings par `data-i18n="key"` ou `_t('key')` | Après extraction |
| `tzolkin-traducteur-en` | Traduit ui-fr.json → ui-en.json + overlays data EN | Nouvelles clés FR ajoutées |
| `tzolkin-traducteur-es` | Traduit ui-fr.json → ui-es.json + overlays data ES | Nouvelles clés FR ajoutées (en parallèle avec EN) |
| `tzolkin-verificateur-i18n` | Vérifie cohérence clés entre les 3 JSON, strings FR résiduelles, sync www/ | Avant chaque release |
| `tzolkin-architecte` | Modifie l'architecture i18n (i18n-loader.js, structure JSON, sélecteur langue) | Nouvelle langue ou refonte i18n |

**Workflow i18n obligatoire** : extracteur → injecteur → traducteur-en + traducteur-es (parallèle) → verificateur-i18n

### Règles de traduction
- **Termes mayas JAMAIS traduits** : K'iche', Tzolk'in, Haab, Bolontiku, Pauahtun, Itzamna, Yum Kaax, K'awiil, les 20 nawals (Imix→Ahau), Popol Vuh, nawal, trecena
- **Noms propres JAMAIS traduits** : Galaad Motokiyo Ferran, Alexandre Ferran, tzolkInSight, IA Access
- HTML statique : `data-i18n="key"` (innerText), `data-i18n-html="key"` (innerHTML), `data-i18n-placeholder="key"`
- JS dynamique : `_t('key')` dans menu-standalone, `t('key')` dans details-display, `_tc('key')` dans croix-maya

### Autres agents utiles
| Agent | Rôle |
|---|---|
| `verify-app` | Test end-to-end Puppeteer (page load, JS errors, navigation, modales, responsive) |
| `code-simplifier` | Simplifie/nettoie le code après modifications |

## Règles OBLIGATOIRES

### i18n — à chaque texte ajouté/modifié
1. Ajouter les clés dans `i18n/ui-fr.json`
2. Utiliser `data-i18n="key"` (HTML statique) ou `_t('key')` (JS dynamique)
3. Traduire en parallèle dans ui-en.json et ui-es.json via les agents traducteurs
4. Vérifier la cohérence via `tzolkin-verificateur-i18n`
5. **Ne jamais laisser de string FR hardcodée visible par l'utilisateur dans le code**

### Après toute modification de code
- `./build.sh` pour synchroniser www/
- `npx cap sync android` si modification Android
- `npx cap sync ios` si modification iOS

### Pièges connus
- **`const t` vs `_tc`** : `tzolkin-details-display.js` utilise `const t = k => ...`, `tzolkin-croix-maya.js` utilise `function _tc(key)`. Ne jamais réintroduire `const t` dans croix-maya.
- **Android back button** : `MainActivity.java` a un `OnBackPressedCallback` obligatoire (Capacitor 8 + Android 12+). Sans lui, back ferme l'app.
- **Menu dynamique** : le menu est injecté dans `#modales-container` par fetch, donc les listeners doivent être ajoutés APRÈS injection (pas dans DOMContentLoaded).
- **bump-version.sh** ne touche PAS `android/app/build.gradle` → versionCode/versionName = mise à jour manuelle.
- **build.sh** doit exclure `ios/` (sinon les Info.plist avec `$(PRODUCT_BUNDLE_IDENTIFIER)` non résolu se retrouvent dans www/ → cassent Transporter/altool).

## App Store Connect — RÈGLES CRITIQUES
- **TOUJOURS lire la doc Apple avant d'agir** : https://developer.apple.com/help/app-store-connect/
- Un build ne peut être changé sur une version **que AVANT soumission**. Après soumission (même rejetée), le build est verrouillé.
- Version rejetée : resoumettre via **"Vérification de l'app"** dans le menu latéral (pas créer une nouvelle version).
- Nouvelle version : le "+" n'apparaît que si la version courante est "Ready for Distribution".
- `MARKETING_VERSION` dans pbxproj = doit correspondre au numéro de version dans App Store Connect.
- `CURRENT_PROJECT_VERSION` = build number, incrémenter à chaque upload.
- IAP (première soumission) : doit être inclus avec une version d'app, pas soumis séparément.
- Upload : Transporter (app Mac) d'abord, `xcrun altool` en fallback (nécessite app-specific password de account.apple.com).

## Identifiants & déploiement
- **App ID** : `org.leparede.tzolkinsight`
- **Play Store** : v1.1.8, versionCode 1, beta ouverte
- **App Store** : v1.0.1 build 6, soumise 20 mars 2026 (fix rejet 2.1(a) placeholder buttons + localisations EN/ES)
- **Apple Team ID** : JAH4678AHH, Bundle ID : `org.leparede.tzolkinsight`
- **Keystore Android** : `tzolkin-release.keystore` (racine, exclu du git, sauvegardé Google Drive)
- **Privacy** : https://motokiyo.github.io/tzolkInSight/privacy-policy.html
- **Support** : https://motokiyo.github.io/tzolkInSight/support.html

## Style & conventions
- Vanilla JS (aucun framework), namespace global `window.*`
- Polices : Summer (titres cursifs), Simplifica (corps sans-serif), AmaticSC, MayaDayNames, MayaMonthGlyphs
- Couleur principale : `#c19434` (or maya)
- Fond : `#ded2b3` / `rgba(222,210,179,...)` + texture x-balanque.png
- Modales : fond semi-transparent, backdrop-filter blur, border-radius 16px, border 2px solid
- Termes mayas K'iche' : garder tels quels (Imix, Ik', Ak'bal, K'an, Chicchan, Cimi, Manik, Lamat, Muluc, Oc, Chuen, Eb, Ben, Ix, Men, Cib, Caban, Etznab, Cauac, Ahau)
