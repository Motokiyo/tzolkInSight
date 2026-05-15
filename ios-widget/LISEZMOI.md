# Widget iOS Funding — TzolkInSight

## Fichiers

- `donation-api.php`    → backend à déposer sur le serveur
- `donation-data.json`  → stocke le total reçu (créé auto, ou déposer ce fichier)
- `ios-widget.html`     → le widget à coller dans ta page HTML
- `LISEZMOI.md`         → ce fichier

---

## Installation (5 minutes)

### 1. Configurer le backend

Ouvre `donation-api.php` et modifie :
```php
define('ADMIN_KEY', 'CHANGE_MOI_ICI');
```
Remplace `CHANGE_MOI_ICI` par un mot de passe secret (ex: `galaad2026ios`).

### 2. Déposer sur le serveur

Mettre sur leparede.org (par FTP ou autre) :
```
/tzolkinsight/donation-api.php
/tzolkinsight/donation-data.json
```
Le dossier doit être accessible en écriture par Apache (chmod 755 ou 775).

### 3. Coller le widget dans ta page

Ouvre `ios-widget.html`, copie tout le contenu et colle-le dans ta page HTML
à l'endroit voulu.

Modifie cette ligne dans le script :
```js
const API_URL = 'https://leparede.org/tzolkinsight/donation-api.php';
```
→ adapter selon où tu as déposé le fichier PHP.

---

## Mettre à jour le total reçu

Chaque fois que tu reçois un don via Revolut, ouvre cette URL dans ton navigateur :

```
https://leparede.org/tzolkinsight/donation-api.php?action=set&key=TON_MOT_DE_PASSE&amount=45
```

Remplace `45` par le nouveau total cumulé (pas le montant du don, le TOTAL).

Exemple : tu avais 30€, tu reçois 20€ → tu mets `amount=50`.

---

## Paliers

| Montant | Signification              |
|---------|---------------------------|
| 100 €   | 1ère année Apple Dev       |
| 150 €   | + 1 rapport (buffer)       |
| 200 €   | 2ème année Apple Dev       |
| 250 €   | Objectif final — clôture  |

À 250 €, le bouton Revolut disparaît automatiquement.
