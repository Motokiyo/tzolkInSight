# INDEX.md — Catalogue wiki TzolkInSight

> Lis ceci EN PREMIER. Ouvre les fichiers SEULEMENT pour les sections liees a ta tache.
> Mis a jour : 18/04/2026

## CLAUDE.md — instructions dev

- Architecture : PWA vanilla JS, Capacitor 8 Android+iOS, i18n 3 langues (fr/en/es)
- Fichiers source a la racine, `www/` = miroir genere par `build.sh`, ne jamais editer www/
- Pipeline i18n obligatoire : extracteur -> injecteur -> traducteurs -> verificateur
- Regles : termes mayas jamais traduits, zero string FR hardcodee, build.sh apres toute modif
- Pieges connus : `const t` vs `_tc`, Android back button, menu dynamique, i18n race condition

## Fichiers JS principaux (racine, ~9200 lignes)

- `tzolkin-core.js` — moteur calcul Tzolk'in, glyphes, nombres, trecenas, Seigneurs de la Nuit
- `tzolkin-widget.js` — widget calendrier, navigation, input date, gradient contacts
- `tzolkin-details.js` + `tzolkin-details-display.js` — routage et carte resume vue detail
- `tzolkin-details-data.js` + `tzolkin-details-summary-data.js` — descriptions longues/courtes FR
- `tzolkin-croix-maya.js` — Croix Maya K'iche' 5 positions + Seigneur de la Nuit + porteurs
- `tzolkin-admin.js` — contacts/profils, formulaire, cards, gestion PIN
- `tzolkin-storage.js` — localStorage CRUD, notes, contacts, CSV/PDF export, GPS cache
- `tzolkin-pin.js` — PIN 4 chiffres SHA256, 3 tentatives, lockout
- `tzolkin-app-interactive.js` — menu/modales/navigation, auto-hide, splash
- `tzolkin-iap.js` — IAP iOS StoreKit (3 tips consumables)
- `sw.js` — Service Worker v4.15, cache 100+ assets

## HTML

- `index.html` — point d'entree : splash, widget, detail-view
- `tzolkin-menu-standalone.html` — tout le contenu modal (~1500 lignes JS embarque)

## i18n/ — internationalisation

- `i18n-loader.js` — detection langue, charge JSON, `window.i18n.t(key)`, reload au resume
- `ui-{fr,en,es}.json` — strings UI 3 langues
- `details-data-{en,es}.js`, `summary-data-{en,es}.js`, `core-data-{en,es}.js`, `corn-family-{en,es}.js` — overlays donnees traduites

## CSS (8 fichiers)

- `style.css` (principal), widget, details, page, splash, menu, croix-maya, standalone-fixes

## Donnees JSON

- `glyphes.json` (20), `chiffres.json` (13), `trecenas.json` (20), `porteurs.json` (4)

## docs/

- `ios-deployment.md` — procedure build/upload iOS
- `keystore.md` — info keystore Android
- `PLAN-I18N.md` — plan internationalisation

## context.md — etat courant projet

- Versions, bugs en cours, historique sessions recentes

## Deploiement

- Play Store : v1.1.5 versionCode 3, test ferme (AAB 18/04/2026 pret a uploader)
- App Store : v1.1.5 build 14 (IPA uploade via Transporter 18/04/2026)
- GitHub Pages : docs/ (privacy, support)

## Pieges dev a connaitre (ajoutes le 18/04/2026)

- `saveCurrentNote` calcule tzolkin depuis `dateStr`, JAMAIS `currentDate` (offset non fiable en mode edition)
- `tzolkin-storage.updatePerson` lit `updatedPerson.glyph` / `.number` (pas `.glyphId` / `.numberId`)
- iOS WebKit : sur un div non-link dans modale a z-index mixte, ajouter `role=button` + `tabindex=0` + `pointer-events:none` sur les enfants pour fiabiliser le tap
- `android/local.properties` TZOLKIN_KEYSTORE_PATH pointe vers `/Applications/Galaad/TzolkInSight/tzolkin-release.keystore` (migration dossier 15/04/2026)
- xcodebuild : utiliser `-project ios/App/App.xcodeproj` (pas `-workspace`, pas de xcworkspace)
