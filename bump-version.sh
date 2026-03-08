#!/bin/bash
# bump-version.sh — Met à jour la version dans TOUS les fichiers concernés
# Usage: ./bump-version.sh 1.1.8
# Le numéro SW cache (sw.js APP_VERSION) est incrémenté automatiquement (+0.1)

set -e

NEW_VERSION=$1
if [ -z "$NEW_VERSION" ]; then
    echo "❌ Usage: ./bump-version.sh <new_version>  (ex: ./bump-version.sh 1.1.8)"
    exit 1
fi

# Lire la version courante depuis sw-detector.js
CURRENT=$(grep "APP_VERSION" sw-detector.js | grep -o "'[0-9.]*'" | tr -d "'")
if [ -z "$CURRENT" ]; then
    echo "❌ Impossible de lire la version courante dans sw-detector.js"
    exit 1
fi

echo "📦 Bump version : $CURRENT → $NEW_VERSION"

# --- Calculer le nouveau numéro de cache SW (ex: 4.6 → 4.7) ---
CURRENT_SW=$(grep "APP_VERSION" sw.js | grep -o "'[0-9.]*'" | tr -d "'")
SW_MAJOR=$(echo $CURRENT_SW | cut -d. -f1)
SW_MINOR=$(echo $CURRENT_SW | cut -d. -f2)
NEW_SW_MINOR=$((SW_MINOR + 1))
NEW_SW="${SW_MAJOR}.${NEW_SW_MINOR}"
echo "🔧 SW cache : $CURRENT_SW → $NEW_SW"

# --- Fichiers racine ---
sed -i '' "s/Version: $CURRENT/Version: $NEW_VERSION/g" tzolkin-menu-standalone.html
sed -i '' "s/Version $CURRENT/Version $NEW_VERSION/g" tzolkin-menu-standalone.html
sed -i '' "s/Version $CURRENT/Version $NEW_VERSION/g" index.html
sed -i '' "s/APP_VERSION = '$CURRENT'/APP_VERSION = '$NEW_VERSION'/g" sw-detector.js
sed -i '' "s/APP_VERSION = '$CURRENT_SW'/APP_VERSION = '$NEW_SW'/g" sw.js

# --- Fichiers www/ (miroir) ---
cp tzolkin-menu-standalone.html www/tzolkin-menu-standalone.html
cp index.html www/index.html
cp sw-detector.js www/sw-detector.js
cp sw.js www/sw.js

echo ""
echo "✅ Version $NEW_VERSION appliquée dans :"
echo "   - index.html + www/index.html (splash)"
echo "   - tzolkin-menu-standalone.html + www/ (crédits + commentaire)"
echo "   - sw-detector.js + www/ (APP_VERSION user-visible)"
echo "   - sw.js + www/ (cache SW : $NEW_SW)"
echo ""
echo "🔍 Vérification :"
grep -r "$CURRENT" --include="*.html" --include="*.js" --exclude-dir="node_modules" --exclude-dir=".git" --exclude-dir="android" -l 2>/dev/null && echo "⚠️  Des occurrences de $CURRENT subsistent (vérifier ci-dessus)" || echo "   Aucune occurrence de $CURRENT restante ✅"
echo ""
echo "👉 Prochaine étape : git add + git commit -m 'v$NEW_VERSION — ...'"
