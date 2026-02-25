# Tzolkin Analysis Engine — Plan de développement Claude Code

Version 1.0 — Février 2026
Auteur du corpus pilote : Alexandre Ferran
Stack : Python 3.11+ / Node.js 20+ / Claude API (Anthropic)

---

## Vue d'ensemble

Ce projet est un **pipeline d'analyse annuelle** qui prend en entrée un CSV exporté depuis une app journal (date + texte brut), l'enrichit avec des données contextuelles (Tzolkin, solaire, lunaire), puis génère un rapport PDF de 6 parties via une chaîne d'agents LLM spécialisés.

**Ce que ce projet N'EST PAS :**
- Une app mobile (l'app journal est séparée et hors scope)
- Un service en temps réel (tout tourne une fois par an, à la demande)
- Un système de prédiction (corrélations et observations uniquement)

**Philosophie :**
Deux lectures du monde sont acceptées comme également valides : matérialiste (causes physiques mesurables) et idéaliste (synchronicités, symbolique). Les agents formulent toujours les deux. Jamais de hiérarchie.

---

## Stack technique

```
Python 3.11+          → collecteurs, stats, agrégation, orchestration
Node.js 20+           → génération PDF/DOCX (bibliothèque docx)
Anthropic Python SDK  → appels Claude API
python-dotenv         → gestion clés API
skyfield              → calculs astronomiques (lunaire, planètes)
requests              → appels NOAA SWPC
fpdf2 ou weasyprint   → génération PDF final
```

**Fichier `.env` requis à la racine :**
```
ANTHROPIC_API_KEY=sk-...
ASTRONOMY_API_KEY=...   # optionnel si on utilise skyfield en local
```

---

## Structure des fichiers

```
tzolkin-analysis/
├── .env                          ← clés API (ne pas commiter)
├── PLAN.md                       ← architecture générale
├── DEVPLAN.md                    ← ce fichier
├── run_annual.py                 ← script principal (point d'entrée)
├── run_learning.py               ← agent apprentissage (post-annuel)
│
├── collectors/
│   ├── tzolkin.py                ← MODULE 1a : calcul Tzolkin
│   ├── solar.py                  ← MODULE 1b : données solaires NOAA
│   ├── lunar.py                  ← MODULE 1c : phase et signe lunaire
│   └── enrich_csv.py             ← MODULE 1d : enrichissement du CSV complet
│
├── agents/
│   ├── agent_text.py             ← MODULE 2 : analyseur texte (LLM)
│   ├── agent_tzolkin.py          ← MODULE 3 : spécialiste Tzolkin (LLM)
│   ├── agent_psyche.py           ← MODULE 4 : spécialiste psyché (LLM)
│   ├── agent_stats.py            ← MODULE 5 : statisticien (code + LLM)
│   ├── agent_astro.py            ← MODULE 6 : astronome-astrologue (LLM)
│   ├── agent_compiler.py         ← MODULE 7 : compilateur (code)
│   ├── agent_synthesis.py        ← MODULE 8 : synthétiseur final (LLM)
│   └── agent_learning.py         ← MODULE 9 : agent apprentissage (LLM)
│
├── prompts/
│   ├── profile_extraction_prompt.json   ← prompt Module 0
│   ├── entry_analysis_prompt.json       ← prompt Module 2
│   ├── prompt_tzolkin.json              ← prompt Module 3
│   ├── prompt_psyche.json               ← prompt Module 4
│   ├── prompt_stats_commentary.json     ← prompt Module 5 (commentaire LLM)
│   ├── prompt_astro.json                ← prompt Module 6
│   ├── prompt_synthesis.json            ← prompt Module 8
│   └── prompt_learning.json             ← prompt Module 9
│
├── knowledge/
│   ├── tzolkin_glyphs.json       ← les 20 glyphes + symbolique complète
│   ├── tzolkin_tones.json        ← les 13 tons + signification
│   └── astro_events_YYYY.json    ← événements astro de l'année (éclipses,
│                                    rétrogrades, transits majeurs)
│                                    ← à générer avant chaque rapport annuel
│
├── profil/
│   └── profil.json               ← profil utilisateur (généré Module 0)
│
├── corpus/
│   ├── input_YYYY.csv            ← CSV brut exporté depuis l'app
│   ├── enriched_YYYY.csv         ← CSV enrichi (après Module 1)
│   └── entries/
│       └── entry_YYYY-MM-DD.json ← un JSON par entrée (après Module 2)
│
├── reports/
│   ├── agent_tzolkin_YYYY.json   ← output Module 3
│   ├── agent_psyche_YYYY.json    ← output Module 4
│   ├── agent_stats_YYYY.json     ← output Module 5
│   ├── agent_astro_YYYY.json     ← output Module 6
│   ├── corpus_llm_ready_YYYY.json ← output Module 7 (input Module 8)
│   └── final_report_YYYY/
│       ├── part1_tzolkin.md
│       ├── part2_emotions.md
│       ├── part3_psyche.md
│       ├── part4_cosmos.md
│       ├── part5_concordances.md
│       ├── part6_synthese.md
│       └── rapport_annuel_YYYY.pdf
│
└── stats/
    ├── corpus.json               ← stats agrégées du corpus
    └── improvement_proposals.json ← suggestions Module 9
```

---

## MODULE 0 — Extraction du profil utilisateur

**Script :** `python run_annual.py --step profile`
**Input :** `corpus/enriched_YYYY.csv` (ou le CSV brut si première fois)
**Output :** `profil/profil.json`
**LLM :** Claude Sonnet — 1 appel, ~8k tokens
**Fréquence :** Une fois par utilisateur, puis mis à jour si le corpus a plus de 50 nouvelles entrées

**Ce que fait le script :**
1. Lit tout le CSV (colonnes : date, texte_brut, score si disponible)
2. Construit le payload : texte des entrées + instructions du `profile_extraction_prompt.json`
3. Appel API Claude avec system prompt strict (voir `profile_extraction_prompt.json`)
4. Valide le JSON retourné contre le schéma `schema_output` du prompt
5. Écrit `profil/profil.json`

**Règles de sécurité du profil (rappel) :**
- Minimum 3 occurrences pour toute inférence
- Score de confiance obligatoire (0.0-1.0) sur chaque champ
- Aucun diagnostic, aucune pathologie
- Champ `avertissements` : liste ce qui n'a pas pu être inféré

---

## MODULE 1 — Collecteurs et enrichissement CSV

### 1a. collectors/tzolkin.py

**Fonction principale :** `get_tzolkin(date: str) -> dict`

```python
# Retourne :
{
  "glyphe_nom": "Ix",
  "glyphe_numero": 14,        # 1-20
  "ton_nom": "Hun",
  "ton_numero": 1,             # 1-13
  "jour_cycle_260": 209,       # 1-260
  "trecena": 17,               # numéro de trecena 1-20
  "jour_dans_trecena": 1       # 1-13
}
```

**Algorithme :**
- Date de référence connue : 1er janvier 2000 = Ik Ca (glyphe 2, ton 2) = jour 42 du cycle
- `jours_depuis_ref = (date - date_ref).days`
- `jour_cycle = ((jours_depuis_ref + 41) % 260) + 1`
- `glyphe_numero = ((jour_cycle - 1) % 20) + 1`
- `ton_numero = ((jour_cycle - 1) % 13) + 1`
- Mapper avec `knowledge/tzolkin_glyphs.json` et `knowledge/tzolkin_tones.json`

**Valider avec le corpus pilote :** 08/05/2025 doit retourner Imix Hun (glyphe 1, ton 1)

---

### 1b. collectors/solar.py

**Fonction principale :** `get_solar_data(date: str) -> dict`

**Sources NOAA (toutes gratuites, aucune clé API requise) :**

Pour données **temps réel / récentes (< 7 jours)** :
```
https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json
https://services.swpc.noaa.gov/json/goes/primary/xray-flares-6-hour.json
```

Pour données **historiques (archives annuelles)** :
```
https://www.ngdc.noaa.gov/stp/space-weather/swpc-products/annual_reports/
daily_solar_indices_summaries/daily_solar_data/{YYYY}Q{1-4}_DSD.txt
```
Format DSD : `YYYY MM DD  F107  SSN  Area  NewRegions  MeanField  XRayBkgd  C  M  X  S  1  2  3`

**Stratégie de collecte pour un CSV annuel :**
- Télécharger les 4 fichiers trimestriels de l'année (Q1 à Q4) en une seule fois
- Parser chaque ligne, indexer par date
- Retourner F10.7, SSN, flares_c, flares_m, flares_x + lag J-1, J-2, J-3

**Retourne :**
```python
{
  "f107": 138.5,
  "ssn": 142,
  "flares_c": 3,
  "flares_m": 1,
  "flares_x": 0,
  "flares_mx": 1,
  "f107_j1": 135.0, "flares_mx_j1": 2,
  "f107_j2": 141.0, "flares_mx_j2": 0,
  "f107_j3": 129.0, "flares_mx_j3": 1,
  "fmx_max3": 2,     # max éruptions M+X sur fenêtre J à J-3
  "alerte_tempete": False  # True si fmx_max3 >= 5
}
```

---

### 1c. collectors/lunar.py

**Bibliothèque :** `skyfield` (calculs locaux, aucune API externe)
**Dépendances :** `pip install skyfield`

**Fonction principale :** `get_lunar_data(date: str) -> dict`

```python
{
  "phase_degres": 127.3,        # 0=NL, 90=1erQ, 180=PL, 270=DQ
  "phase_nom": "Gibbeuse croissante",
  "illumination_pct": 73.2,
  "signe_zodiacal": "Scorpion",
  "distance_km": 384400,
  "est_nouvelle_lune": False,   # True si phase < 15 ou > 345
  "est_pleine_lune": False      # True si phase entre 165 et 195
}
```

**Calcul du signe zodiacal :**
- Obtenir la longitude écliptique de la Lune via skyfield
- Diviser par 30° pour obtenir le signe (0-11 → Bélier à Poissons)

---

### 1d. collectors/enrich_csv.py

**Script :** `python collectors/enrich_csv.py --input corpus/input_YYYY.csv --output corpus/enriched_YYYY.csv`

**Ce qu'il fait :**
1. Lit le CSV brut (colonnes minimales : `date`, `texte_brut`)
2. Pour chaque ligne, appelle `get_tzolkin()`, `get_solar_data()`, `get_lunar_data()`
3. Ajoute toutes les colonnes contextuelles
4. Écrit le CSV enrichi

**CSV enrichi — colonnes finales :**
```
date, texte_brut,
glyphe, glyphe_numero, ton, ton_numero, jour_cycle_260, trecena,
f107, ssn, flares_m, flares_x, flares_mx, fmx_max3, alerte_tempete,
f107_j1, flares_mx_j1, f107_j2, flares_mx_j2, f107_j3, flares_mx_j3,
phase_lunaire, illumination_pct, signe_lunaire, distance_lune_km,
est_nouvelle_lune, est_pleine_lune
```

**Durée estimée :** < 2 minutes pour 365 entrées (pas d'appel LLM)

---

## MODULE 2 — Analyse textuelle des entrées

**Script :** `python agents/agent_text.py --csv corpus/enriched_YYYY.csv --profil profil/profil.json`
**Output :** un fichier `corpus/entries/entry_YYYY-MM-DD.json` par entrée
**LLM :** Claude Haiku (modèle léger, coût minimal)
**Coût estimé :** ~365 appels × ~500 tokens = ~182k tokens ≈ $0.10 avec Haiku

**Ce que fait chaque appel :**
- Reçoit : texte de l'entrée + profil utilisateur
- System prompt : `prompts/entry_analysis_prompt.json` (tâches A1 à A4 uniquement — pas les concordances, ça vient après)
- Retourne :

```json
{
  "date": "2025-05-08",
  "score": 4,
  "score_justification": "Journée de réalisation avec mise en ligne de l'app",
  "emotion_dominante": "fierté calme",
  "intensite": 75,
  "theme_jungien": "Soi",
  "patterns_detectes": ["accomplissement créatif", "connexion nature"],
  "mots_cles": ["app", "mise en ligne", "débroussaillage"],
  "ton_ecriture": "positif",
  "contradiction_notee": false
}
```

**Optimisation :** Traiter en batch de 10 entrées par appel si le profil utilisateur est court. Réduire le nombre d'appels de 365 à ~37.

---

## MODULE 3 — Agent Spécialiste Tzolkin

**Script :** `python agents/agent_tzolkin.py --year YYYY`
**Input :** tous les `entry_YYYY-MM-DD.json` + `knowledge/tzolkin_glyphs.json` + `knowledge/tzolkin_tones.json` + stats corpus par glyphe/ton
**Output :** `reports/agent_tzolkin_YYYY.json`
**LLM :** Claude Sonnet — 1 appel, ~6k tokens

**Ce que le script prépare avant l'appel LLM :**
- Calcul en code pur : score moyen par glyphe (20), score moyen par ton (13)
- Top 3 glyphes positifs et négatifs de l'année (avec n)
- Top 3 tons positifs et négatifs
- Position dans le grand cycle 260 en début et fin d'année
- Trecenas les plus chargées (positivement et négativement)
- Liste des jours avec scores extrêmes (≥4 ou ≤-2) avec leur glyphe/ton

**L'appel LLM reçoit** ces stats pré-calculées + le contenu de `knowledge/tzolkin_glyphs.json` et `knowledge/tzolkin_tones.json`

**System prompt :** `prompts/prompt_tzolkin.json`
Demande au LLM de formuler :
- La lecture symbolique de l'année dans le calendrier maya
- Les glyphes et tons marquants, dans les deux lectures (symbolique + statistique)
- La position dans les grands cycles (Tzolkin 260 jours, année Haab 365 jours, cycle vénusien si pertinent)
- Toujours : deux voix (matérialiste / idéaliste), jamais de prédiction

**Output JSON :**
```json
{
  "titre_annee": "string — une phrase qui résume l'année du point de vue Tzolkin",
  "glyphes_marquants": [...],
  "tons_marquants": [...],
  "lecture_cycles": "string — 3-5 paragraphes",
  "concordances_notables": [...],
  "pour_rapport_part1": "texte narratif complet prêt pour la Partie 1 du PDF"
}
```

---

## MODULE 4 — Agent Spécialiste Psyché

**Script :** `python agents/agent_psyche.py --year YYYY`
**Input :** tous les `entry_YYYY-MM-DD.json` (champs score, theme_jungien, patterns_detectes, mots_cles)
**Output :** `reports/agent_psyche_YYYY.json`
**LLM :** Claude Sonnet — 1 appel, ~5k tokens

**Ce que le script prépare en code :**
- Distribution des thèmes jungiens sur l'année (% par thème)
- Évolution temporelle des thèmes (par trimestre)
- Patterns de contenu les plus fréquents
- Mots-clés les plus récurrents dans les entrées positives vs négatives
- Score moyen par thème jungien

**System prompt :** `prompts/prompt_psyche.json`
Règles strictes :
- Traduire TOUS les termes jungiens en langage courant
- "L'Ombre" → "les parties de toi que tu n'aimes pas regarder"
- "Anima" → "ta relation à la féminité et à l'émotion"
- "Puer Aeternus" → "l'enfant créatif en toi qui refuse de vieillir"
- Jamais de diagnostic, jamais de prescription
- Toujours formuler en "on observe dans l'écriture que..." jamais "tu es..."
- Parler la langue de la personne (voir profil utilisateur)
- Montrer l'évolution dans le temps, pas un état figé

---

## MODULE 5 — Agent Statisticien

**Script :** `python agents/agent_stats.py --year YYYY`
**Input :** `corpus/enriched_YYYY.csv` + tous les `entry_YYYY-MM-DD.json`
**Output :** `reports/agent_stats_YYYY.json`
**LLM :** Claude Haiku — 1 appel léger (~2k tokens) pour le commentaire uniquement
**Code pur à 90%**

**Calculs statistiques (aucun LLM) :**

```python
# Niveau 1 — Tzolkin
stats_par_glyphe = {glyphe: {n, mean, std, min, max, patterns_dominants} for each of 20}
stats_par_ton = {ton: {n, mean, std, min, max} for each of 13}

# Niveau 2 — Solaire
effet_eruption_j = mean_score_avec_eruption_j - mean_score_sans_eruption_j
effet_eruption_j1 = ...  # lag 1
effet_eruption_j2 = ...  # lag 2
fmx_low_vs_high = {low_score_mean_fmx: x, high_score_mean_fmx: y, delta: z}

# Niveau 2 — Lunaire
stats_par_phase = {phase: {n, mean} for 4 phases}
stats_par_signe = {signe: {n, mean} for 12 signes, avec flag n<3}

# Évolution temporelle
scores_par_mois = {mois: mean for 12}
scores_par_trimestre = {Q1, Q2, Q3, Q4}

# Corrélations
pearson_f107_score = ...
pearson_fmx_score = ...
# Toutes avec p-value et flag "non significatif si n<30"
```

**Le seul appel LLM** reçoit ces stats et demande : "Commente ces chiffres en 2 pages. Ce qui est robuste, ce qui est fragile, les limites du corpus. Jamais de causalité. Toujours les deux lectures."

---

## MODULE 6 — Agent Astronome-Astrologue

**Script :** `python agents/agent_astro.py --year YYYY`
**Input :** `corpus/enriched_YYYY.csv` + `knowledge/astro_events_YYYY.json` + scores des périodes
**Output :** `reports/agent_astro_YYYY.json`
**LLM :** Claude Sonnet — 1 appel, ~5k tokens

**Préparation du fichier `knowledge/astro_events_YYYY.json` :**
À générer UNE FOIS avant le rapport, via un appel LLM ou manuellement :
```json
{
  "annee": 2025,
  "eclipses": [
    {"date": "2025-03-29", "type": "solaire totale", "visible_europe": true},
    {"date": "2025-09-07", "type": "lunaire partielle"}
  ],
  "retrogrades": [
    {"planete": "Mercure", "debut": "2025-03-15", "fin": "2025-04-07"},
    {"planete": "Venus", "debut": "2025-07-23", "fin": "2025-09-04"}
  ],
  "transits_majeurs": [
    {"evenement": "Jupiter entre en Gémeaux", "date": "2025-06-09"},
    {"evenement": "Saturne en Poissons — station directe", "date": "2025-11-15"}
  ],
  "perihelie": "2025-01-04",
  "aphelie": "2025-07-03",
  "maximum_cycle_solaire_25": "pic estimé 2025-2026"
}
```

**Ce que l'agent fait :**
1. Croise les périodes de scores bas/hauts du corpus avec les événements astro
2. Cherche des coïncidences (sans les affirmer)
3. Connaît la symbolique astrologique de base pour chaque configuration
4. Formule en deux voix : astronomique (factuel) + astrologique (symbolique, comme hypothèse)
5. Ne lit PAS le thème natal de la personne — analyse les transits collectifs uniquement

**Exemple d'output attendu :**
"La période de scores bas du 14-17 mai 2025 (score moyen -1.8) coïncide avec la station directe de Mercure le 7 avril — 5 semaines de décalage, hors fenêtre directe. En revanche, les 3 éruptions X de cette période sont une corrélation plus immédiate. Astronomiquement : pic d'activité du Cycle 25 confirmé. Astrologiquement : certaines traditions associent les éruptions solaires intenses à des périodes de tensions archétypales — lecture possible, non vérifiable."

---

## MODULE 7 — Compilateur

**Script :** `python agents/agent_compiler.py --year YYYY`
**Input :** outputs des Modules 3, 4, 5, 6 + profil utilisateur
**Output :** `reports/corpus_llm_ready_YYYY.json`
**LLM :** aucun — code pur

**Ce qu'il fait :**
- Extrait les sections clés de chaque rapport agent
- Élimine les redondances (si Tzolkin et Astro mentionnent tous les deux le même pic solaire, garder une seule référence)
- Formate en JSON compact optimisé pour LLM : dense, structuré, sans prose longue
- Ajoute un index des moments clés de l'année (dates avec score ≥4 ou ≤-2, avec toutes leurs métadonnées)
- Calcule un score de convergence pour chaque période notable (combien de couches pointent vers le même moment)

**Structure du JSON compact :**
```json
{
  "profil": { ... },               // profil complet
  "periode": "2025-05-08/2026-02-25",
  "stats_cles": { ... },           // chiffres essentiels uniquement
  "moments_forts": [ ... ],        // top 10 positifs + top 10 négatifs avec contexte complet
  "patterns_annuels": { ... },     // synthèse des 4 agents
  "convergences_majeures": [ ... ] // moments où ≥3 couches convergent
}
```

---

## MODULE 8 — Synthétiseur Final

**Script :** `python agents/agent_synthesis.py --year YYYY`
**Input :** `reports/corpus_llm_ready_YYYY.json`
**Output :** `reports/final_report_YYYY/part{1-6}.md`
**LLM :** Claude Opus ou Sonnet (le plus capable) — 1 appel par partie = 6 appels
**Coût estimé :** ~6 appels × ~4k tokens = ~24k tokens ≈ $0.50 avec Sonnet

**6 appels séquentiels, un par partie :**

| Appel | Partie | Contenu demandé |
|-------|--------|-----------------|
| 1 | Le Tzolkin de l'année | Lecture cyclique, glyphes/tons marquants, position dans les grands cycles |
| 2 | L'évolution émotionnelle et textuelle | Évolution du score, changements dans l'écriture, comparaison début/fin |
| 3 | La lecture de la Psyché | Archétypes actifs en langage courant, évolution intérieure |
| 4 | La dimension cosmique | Solaire, lunaire, événements astro — deux voix |
| 5 | Les concordances | Moments où plusieurs couches convergent, sans causalité |
| 6 | Synthèse générale | Portrait de l'année, questions ouvertes pour l'an prochain |

**Règles communes à tous les prompts de synthèse :**
- Parler dans la langue de la personne (profil)
- Jamais affirmer une causalité
- Toujours les deux voix pour les corrélations
- Partie 6 = la plus longue et la plus libre — c'est le vrai portrait de l'année

**Génération du PDF :**
Après les 6 .md, un script `generate_pdf.py` assemble le PDF final avec mise en page soignée.

---

## MODULE 9 — Agent Apprentissage

**Script :** `python run_learning.py --year YYYY`
**Input :** tous les outputs de l'année + le rapport final
**Output :** `stats/improvement_proposals.json`
**LLM :** Claude Sonnet — 1 appel
**Fréquence :** une fois après validation du rapport par l'utilisateur

**Ce qu'il cherche :**
- Patterns présents dans le corpus mais non détectés par les agents
- Incohérences entre les lectures des différents agents
- Corrélations visibles en rétrospective mais non capturées par les prompts
- Formulations qui n'ont pas parlé la langue de la personne
- Champs manquants dans les JSONs

**Output :**
```json
{
  "version_actuelle": "1.0",
  "version_proposee": "1.1",
  "propositions": [
    {
      "fichier_cible": "prompts/entry_analysis_prompt.json",
      "section_cible": "taches_analyse.A4",
      "type_changement": "ajout",
      "description": "Ajouter détection du pattern 'connexion animale / signe naturel' — apparu 11 fois sans être répertorié",
      "evidence": "Entrées 09/05, 20/07, 03/08... mentionnent toutes des animaux dans un contexte symbolique",
      "impact_estime": "moyen",
      "validation_requise": true
    }
  ],
  "message_utilisateur": "3 améliorations proposées. Voulez-vous les appliquer ?"
}
```

**Après validation utilisateur :**
Un script `apply_improvements.py` applique les changements approuvés aux fichiers JSON de prompts et incrémente le numéro de version.

---

## Ordre d'exécution complet

```bash
# 1. Enrichissement (code pur, ~2 min)
python collectors/enrich_csv.py --input corpus/input_2025.csv --output corpus/enriched_2025.csv

# 2. Profil utilisateur (LLM, 1 appel, si première fois ou mise à jour)
python run_annual.py --step profile --year 2025

# 3. Analyse textuelle des entrées (LLM, ~37 appels batch, ~$0.10)
python agents/agent_text.py --year 2025

# 4. Agents spécialistes (parallélisables, 4 appels LLM)
python agents/agent_tzolkin.py --year 2025 &
python agents/agent_psyche.py --year 2025 &
python agents/agent_stats.py --year 2025 &
python agents/agent_astro.py --year 2025 &
wait

# 5. Compilation (code pur)
python agents/agent_compiler.py --year 2025

# 6. Synthèse et PDF (6 appels LLM + génération)
python agents/agent_synthesis.py --year 2025

# 7. (Après validation du rapport) Agent apprentissage
python run_learning.py --year 2025
```

**Ou tout d'un coup :**
```bash
python run_annual.py --year 2025 --all
```

---

## Estimation des coûts API (par utilisateur par an)

| Module | Modèle | Tokens estimés | Coût USD |
|--------|--------|----------------|----------|
| Module 0 — Profil | Sonnet | ~8k | ~$0.02 |
| Module 2 — Texte (365 entrées) | Haiku | ~182k | ~$0.10 |
| Module 3 — Tzolkin | Sonnet | ~6k | ~$0.02 |
| Module 4 — Psyché | Sonnet | ~5k | ~$0.01 |
| Module 5 — Stats commentaire | Haiku | ~2k | ~$0.01 |
| Module 6 — Astro | Sonnet | ~5k | ~$0.01 |
| Module 8 — Synthèse (6 parties) | Sonnet | ~24k | ~$0.07 |
| Module 9 — Apprentissage | Sonnet | ~6k | ~$0.02 |
| **TOTAL** | | **~238k tokens** | **~$0.26** |

Prix indicatifs Claude API février 2026. Le coût dominant est l'analyse textuelle des entrées (Module 2).

---

## Fichiers knowledge à créer (hors code)

### knowledge/tzolkin_glyphs.json
20 entrées, une par glyphe :
```json
{
  "numero": 1,
  "nom_maya": "Imix",
  "nom_courant": "Crocodile",
  "element": "Eau",
  "direction": "Est",
  "symbolique": "L'origine, la matière primordiale, la nourrice...",
  "mots_cles": ["origines", "profondeur", "instinct", "abondance"],
  "polarite_positive": "...",
  "polarite_negative": "...",
  "corpus_score_moyen": null,   // rempli automatiquement par agent_stats.py
  "corpus_n": null
}
```

### knowledge/tzolkin_tones.json
13 entrées, une par ton :
```json
{
  "numero": 1,
  "nom_maya": "Hun",
  "nom_courant": "Un / Unité",
  "fonction": "Initiation, source, commencement",
  "question_clé": "Quel est le but ?",
  "mots_cles": ["début", "unité", "intention", "source"],
  "corpus_score_moyen": null,
  "corpus_n": null
}
```

---

## Points d'attention pour Claude Code

1. **Gestion des erreurs API NOAA** : les fichiers trimestriels DSD peuvent être incomplets pour le trimestre en cours. Prévoir fallback sur dernière valeur connue.

2. **Validation des JSONs LLM** : chaque output LLM doit être validé contre son schéma avant d'être écrit sur disque. Si invalide → retry avec message d'erreur dans le prompt.

3. **Respect de la vie privée** : les textes bruts des entrées ne doivent jamais apparaître dans les outputs finaux du rapport PDF. Seules les analyses et métadonnées y figurent.

4. **Le profil ne contient jamais de nom** : utiliser un hash anonyme comme identifiant.

5. **Skyfield et les données d'éphémérides** : au premier lancement, skyfield télécharge des fichiers NASA (~30 MB). Prévoir ce téléchargement dans le setup.

6. **Tzolkin — date de référence à valider** : vérifier l'algorithme sur au moins 5 dates connues du corpus pilote avant de l'utiliser en production.

7. **Le score de l'entrée** : il est calculé par le Module 2 (LLM). Pour le corpus pilote (80 entrées), les scores existent déjà dans le CSV. Le Module 2 ne recalcule que pour les nouvelles entrées.
