#!/bin/bash
# Build script — copie les fichiers web dans www/ pour Capacitor

set -e
echo "🔨 Build TzolkinSight..."

rm -rf www
mkdir -p www

rsync -a \
  --exclude='www/' \
  --exclude='android/' \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='package.json' \
  --exclude='package-lock.json' \
  --exclude='capacitor.config.json' \
  --exclude='build.sh' \
  --exclude='*.md' \
  --exclude='*.php' \
  --exclude='*.wp-backup' \
  --exclude='glyphes.json' \
  --exclude='chiffres.json' \
  --exclude='trecenas.json' \
  --exclude='porteurs.json' \
  . www/

echo "✅ www/ prêt — $(find www -type f | wc -l | tr -d ' ') fichiers"
