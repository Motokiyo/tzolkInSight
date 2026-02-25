# Tzolkin Analysis Engine — Plan d'Architecture

Version 1.0 — Février 2026

---

## Philosophie centrale

Le Tzolkin est la colonne vertébrale. Le glyphe et le ton du jour sont le **premier niveau de lecture**. Toutes les autres couches (solaire, lunaire, planétaire) viennent en enrichissement secondaire — jamais en remplacement.

Le système accepte deux lectures du monde comme **également valides** :
- **Matérialiste** : les corrélations ont des causes physiques mesurables (UV/EUV, mélatonine, rythme circadien)
- **Idéaliste** : les synchronicités sont des données, le monde est un miroir, les coïncidences ont un sens

Aucune hiérarchie entre ces deux lectures. Le système les formule toutes les deux, chaque fois.

Le profil de l'utilisateur émerge de ses données — jamais d'un questionnaire. Ce que la personne écrit révèle qui elle est plus fidèlement que ce qu'elle dit d'elle-même.

---

## Structure des modules

### Module 0 — Extraction du profil personnel
**Input :** `corpus_for_profile_extraction.json`
**Prompt :** `prompts/profile_extraction_prompt.json`
**Output :** `profil/profil.json`

Le LLM lit l'ensemble du corpus (textes bruts + scores) et en extrait un profil de lecture : vision du monde, domaines de vie actifs, registre émotionnel réel (tempérant la roue standard), patterns de contenu récurrents, axes de sens, vocabulaire signature.

**Garde-fous stricts :**
- Aucune inférence sans 3 occurrences minimum
- Aucun diagnostic ou jugement
- Scores de confiance obligatoires sur toutes les inférences
- Distinction permanente : "a écrit X" ≠ "est X"

---

### Module 1 — Collecteurs API
Scripts indépendants, sortie JSON, un par source.

| Script | Source | Output |
|--------|--------|--------|
| `collectors/tzolkin.js` | Calcul algorithmique pur | glyphe, ton, jour 1-260 |
| `collectors/solar.py` | NOAA SWPC JSON API | F10.7, SSN, éruptions M/X (J, J-1, J-2, J-3) |
| `collectors/lunar.py` | Astronomy API ou AstroPy | phase, illumination, signe, distance km |
| `collectors/planetary.py` | Ephemeris (AstroPy/Skyfield) | distances UA, rétrogrades actifs |

Chaque script sort son bloc JSON autonome. Ils s'assemblent en un seul objet `context_YYYYMMDD.json`.

---

### Module 2 — Analyse d'entrée (cœur du système)
**Input :** texte brut + `context_YYYYMMDD.json` + `profil/profil.json` + stats historiques du corpus
**Prompt :** `prompts/entry_analysis_prompt.json`
**Output :** `corpus/entree_YYYYMMDD.json`

Le LLM analyse l'entrée en 9 tâches séquentielles :

1. Lecture du texte brut (faits et états rapportés)
2. Score affiné -5/+5 + émotion **tempérée par le texte réel et le profil** (pas la roue standard brute)
3. Thème jungien
4. Patterns de contenu détectés (croisés avec le profil)
5. **Concordance Tzolkin** — glyphe + ton — double lecture symbolique/statistique
6. **Concordance Solaire** — éruptions M/X en J, J-1, J-2 — double lecture
7. **Concordance Lunaire** — phase + signe — double lecture
8. **Concordance Planétaire** — rétrogrades, distance Soleil — optionnel, si notable
9. Synthèse de convergence (score 0-3, jamais causale)

---

### Module 3 — Agrégateur de corpus
**Input :** tous les `corpus/entree_*.json`
**Script :** `analyzers/aggregate_corpus.py`
**Output :** `stats/corpus.json` + `stats/stats_by_layer.json`

Calcule automatiquement les statistiques par :
- **Glyphe (20)** : n, score moyen, min/max, patterns dominants, thèmes jungiens fréquents
- **Ton (13)** : même chose
- **Phase lunaire** (4 phases) : n, score moyen
- **Signe lunaire** (12) : n, score moyen (avec flag si n < 3)
- **Éruptions M/X** : effet fenêtre J, J-1, J-2, J-3 (delta scores)
- **Mois / Saison** : évolution temporelle

Ces stats alimentent le champ `stats_corpus_historique` de chaque nouvelle analyse d'entrée.

---

### Module 4 — Synthèse narrative
**Input :** `stats/corpus.json` + `stats/stats_by_layer.json` + `profil/profil.json`
**Script :** `analyzers/synthesize.py`
**Output :** texte narratif + JSON structuré

Le LLM produit une synthèse en plusieurs voix :
- Ce que dit le Tzolkin sur la période (glyphes dominants, tons récurrents, position dans le cycle 260)
- Ce que dit le contexte cosmique (solaire, lunaire, convergences)
- Ce que dit la personne à travers ses patterns
- Les concordances entre les trois couches
- Sans conclusion définitive — des observations, des questions ouvertes

---

## Résultats clés du corpus pilote (mai 2025 – fév. 2026, n=80)

### Niveau 1 — Tzolkin

**Tons (13) — signal le plus net :**
| Ton | n | Score moyen |
|-----|---|-------------|
| Ton 1 (Hun) | 6 | +3.83 |
| Ton 9 (Bolon) | 6 | +3.67 |
| Ton 2 (Ca) | 6 | +3.17 |
| Ton 3 (Ox) | 5 | +0.60 |
| Ton 10 (Lahun) | 8 | +1.25 |
| Ton 11 (Buluc) | 6 | +1.67 |

Pattern : tons 1-2-9 positifs / tons 10-11-12-13 difficiles

**Glyphes (20) — à consolider avec plus d'entrées :**
- Ix (n=7) : +3.29 — le plus fiable parmi les positifs
- Chuen (n=6) : +0.50 — le plus régulièrement difficile
- Akbal (n=8) : +1.75 — très dispersé (-3 à +5)

### Niveau 2 — Solaire
- Jours avec éruptions M/X : score moyen **+1.88** vs **+2.71** sans (Δ = -0.83)
- Effet concentré sur J (même jour) et J-1 (veille) — disparaît à J-2
- Jours score ≤ 1 précédés de 2.82 éruptions M+X en moyenne vs 1.80 pour score ≥ 3
- Cas extrême : 3 fév. 2026 — tempête Max3=19 M/X, score=0, insomnie

### Niveau 2 — Lunaire
- Nouvelle Lune : score moyen +3.5 (signal à confirmer, n faible)
- Pleine Lune : +1.09

### Niveaux 3+ — Distances planétaires, SSN, Kp
À abandonner ou surveiller uniquement : mécanisme physique absent ou données trop fragmentées.

---

## Structure du dossier

```
tzolkin-analysis/
├── PLAN.md                          ← ce fichier
├── profil/
│   └── profil.json                  ← généré par Module 0 (à créer)
├── prompts/
│   ├── profile_extraction_prompt.json   ← Module 0
│   └── entry_analysis_prompt.json       ← Module 2
├── schemas/
│   ├── schema_entree.json           ← à créer
│   └── schema_corpus.json           ← à créer
├── collectors/
│   ├── tzolkin.js                   ← à coder
│   ├── solar.py                     ← à coder
│   ├── lunar.py                     ← à coder
│   └── planetary.py                 ← à coder
├── analyzers/
│   ├── aggregate_corpus.py          ← à coder
│   └── synthesize.py                ← à coder
├── corpus/
│   ├── corpus_for_profile_extraction.json   ← données pilote pour Module 0
│   └── tzolkin_solar_enriched.csv           ← corpus pilote complet
├── stats/
│   ├── solar_lag_results.json       ← analyse solaire pilote
│   └── solar_analysis_results.json  ← statistiques solaires pilote
└── docs/
    ├── Analyse_Tzolkin_Globale.docx
    ├── Analyse_Activite_Solaire.docx
    └── Analyse_Solaire_Evenementielle.docx
```

---

## Prochaines étapes pour Claude Code

1. Coder `collectors/tzolkin.js` — algorithme Tzolkin pur (date → glyphe + ton)
2. Coder `collectors/solar.py` — NOAA SWPC API temps réel
3. Coder `collectors/lunar.py` — calcul phase et signe lunaire
4. Tester Module 0 : envoyer `corpus_for_profile_extraction.json` + `profile_extraction_prompt.json` à l'API Claude/Grok → obtenir `profil/profil.json`
5. Coder `analyzers/aggregate_corpus.py`
6. Tester Module 2 sur une entrée récente

---

## Sources de données API

| Donnée | Source | URL |
|--------|--------|-----|
| F10.7, SSN, éruptions | NOAA SWPC | `https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json` |
| Éruptions temps réel | NOAA SWPC | `https://services.swpc.noaa.gov/json/goes/primary/xray-flares-6-hour.json` |
| Données historiques | NOAA NGDC DSD | `https://www.ngdc.noaa.gov/stp/space-weather/swpc-products/annual_reports/daily_solar_indices_summaries/daily_solar_data/` |
| Phase lunaire | Astronomy API | `https://astronomyapi.com` (payant) ou AstroPy (local) |
| Positions planétaires | Skyfield (Python) | bibliothèque locale, données NASA JPL |
