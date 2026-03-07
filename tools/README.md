# Agent Expert Tzolk'in K'iche'

Relecteur et vérificateur automatique des textes de l'app tzolkInSight.
Utilise Claude claude-sonnet-4-6 + web search pour pointer toute erreur ou imprécision
sur le calendrier Maya traditionnel K'iche'.

## Installation

```bash
pip3 install anthropic
```

## Configuration de la clé API

**Option 1 — .env (recommandé) :**
```bash
echo 'ANTHROPIC_API_KEY=sk-ant-...' > tools/.env
```

**Option 2 — Variable d'environnement :**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

**Option 3 — Keychain macOS :**
```bash
security add-generic-password -s ANTHROPIC_API_KEY -a api -w sk-ant-...
```

## Usage

```bash
cd tzolkin-app-autonome/tools/

# Analyser toute l'app (tous les fichiers clés)
python3 tzolkin_expert_agent.py

# Construire la base de connaissances via web search (faire 1 fois)
python3 tzolkin_expert_agent.py --search

# Analyser un fichier spécifique
python3 tzolkin_expert_agent.py --file tzolkin-details-data.js

# Analyser un texte direct
python3 tzolkin_expert_agent.py --text "Imix représente le crocodile..."

# Sans web search (plus rapide, hors ligne)
python3 tzolkin_expert_agent.py --no-web
```

## Fichiers analysés par défaut
- `tzolkin-details-data.js` — données détaillées des 260 jours
- `tzolkin-details-summary-data.js` — résumés
- `tzolkin-croix-maya.js` — logique Croix Maya
- `tzolkin-menu-standalone.html` — textes des modales (Fonctionnement, Crédits...)

## Sorties
Les rapports sont sauvegardés dans `tools/rapport_expert_YYYYMMDD_HHMM.md`
La base de connaissances est dans `tools/tzolkin_knowledge_base.md`

## Domaines couverts
- 20 nahuales (noms K'iche', attributs, correspondances)
- 13 tons
- 20 trécénas
- 4 familles de maïs (couleurs directionnelles K'iche')
- Porteurs d'année K'iche' (Iq', Kej, E, No'j)
- 9 Seigneurs de la Nuit (Bolontiku G1-G9)
- Croix Maya K'iche' (calcul B'ixonik Aq'ab'al)

## Sources de référence intégrées
- Barbara Tedlock — *Time and the Highland Maya* (1982/1992)
- Aj Xiloj Peruch — Momostenango
- Dennis Tedlock — *Popol Vuh*
- Allen J. Christenson
- Academia de Lenguas Mayas de Guatemala (ALMG)
- famsi.org, mesoweb.com
