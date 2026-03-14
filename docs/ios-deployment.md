# iOS Deployment — TzolkInSight

## Prérequis

- macOS + Xcode (installé via App Store)
- CocoaPods (`brew install cocoapods`)
- Compte Apple Developer ($99/an) — Apple ID : mathieuferran74@gmail.com
- Team ID : `JAH4678AHH`
- Bundle ID : `org.leparede.tzolkinsight`

## Certificats & Provisioning

- **Certificat** : Apple Distribution: Alexandre Ferran (JAH4678AHH)
- **Provisioning Profile** : "TzolkInSight App Store" (App Store Connect distribution)
- Gérés sur https://developer.apple.com/account/resources
- Certificat + clé privée dans le keychain macOS local

## Build & Upload — étapes

```bash
# 1. Modifier le code JS/HTML (commun Android/iOS)

# 2. Bump version
./bump-version.sh <nouvelle_version>

# 3. Build www/
./build.sh

# 4. Sync iOS
npx cap sync ios

# 5. Archive
xcodebuild -workspace ios/App/App.xcodeproj/project.xcworkspace \
  -scheme App -configuration Release \
  -destination "generic/platform=iOS" \
  -archivePath /tmp/tzolkInSight.xcarchive archive \
  CODE_SIGN_IDENTITY="Apple Distribution: Alexandre Ferran (JAH4678AHH)" \
  DEVELOPMENT_TEAM="JAH4678AHH"

# 6. Export IPA
cat > /tmp/ExportOptions.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>teamID</key>
    <string>JAH4678AHH</string>
    <key>signingStyle</key>
    <string>manual</string>
    <key>signingCertificate</key>
    <string>Apple Distribution: Alexandre Ferran (JAH4678AHH)</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>org.leparede.tzolkinsight</key>
        <string>tzolkInSight App    Store</string>
    </dict>
    <key>uploadBitcode</key>
    <false/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
EOF

xcodebuild -exportArchive \
  -archivePath /tmp/tzolkInSight.xcarchive \
  -exportOptionsPlist /tmp/ExportOptions.plist \
  -exportPath /tmp/tzolkInSight-ipa

# 7. Upload via Transporter
open -a Transporter /tmp/tzolkInSight-ipa/App.ipa
# → Cliquer "Deliver" dans Transporter
```

## Build simultané Android + iOS

```bash
./bump-version.sh <version>
./build.sh
npx cap sync ios && npx cap sync android

# Android
cd android && ./gradlew bundleRelease && cd ..
# → Uploader AAB sur Play Console

# iOS (commandes ci-dessus étapes 5-7)
```

## Fichiers importants

| Fichier | Rôle |
|---|---|
| `ios/App/App/Info.plist` | Métadonnées app (bundle ID, encryption, etc.) |
| `ios/App/App/Assets.xcassets/AppIcon.appiconset/` | Icône app 1024×1024 |
| `ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme` | Scheme Xcode (nécessaire pour xcodebuild) |

## En cas de problème de cache

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/App-*
```

## Délais Apple

- Review première soumission : 2-3 jours
- Review mises à jour : 1-2 jours
- Apple vérifie manuellement chaque version

## App Store Connect

- URL : https://appstoreconnect.apple.com
- URL support : https://motokiyo.github.io/tzolkInSight/support.html
- URL privacy : https://motokiyo.github.io/tzolkInSight/privacy-policy.html
- SKU : TZOLKINSIGHT
