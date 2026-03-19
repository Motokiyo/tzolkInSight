#!/bin/bash
# Build script — copie les fichiers web dans www/ pour Capacitor

set -e
echo "🔨 Build TzolkinSight..."

rm -rf www
mkdir -p www

rsync -a \
  --exclude='www/' \
  --exclude='android/' \
  --exclude='ios/' \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='tools/' \
  --exclude='docs/' \
  --exclude='package.json' \
  --exclude='package-lock.json' \
  --exclude='capacitor.config.json' \
  --exclude='build.sh' \
  --exclude='bump-version.sh' \
  --exclude='*.md' \
  --exclude='*.php' \
  --exclude='*.wp-backup' \
  --exclude='*.csv' \
  --exclude='*.py' \
  --exclude='*.txt' \
  --exclude='glyphes.json' \
  --exclude='chiffres.json' \
  --exclude='trecenas.json' \
  --exclude='porteurs.json' \
  --exclude='test-pwa.js' \
  --exclude='feature-graphic.html' \
  --exclude='x-post-visual.html' \
  . www/

echo "✅ www/ prêt — $(find www -type f | wc -l | tr -d ' ') fichiers"
