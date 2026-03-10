# Keystore TzolkInSight — Play Store

## Générer le keystore (une seule fois)

```
keytool -genkey -v -keystore /Users/alexandre/Galaad-Motokiyo-Ferran/tzolkInSight/tzolkin-release.keystore -alias tzolkin -keyalg RSA -keysize 2048 -validity 10000
```

## Après génération

- Sauvegarder `tzolkin-release.keystore` dans un endroit sûr (Google Drive, etc.)
- Ne jamais commiter le keystore ni les mots de passe dans git

## Infos à retenir

- Keystore path : `tzolkin-release.keystore` (racine du projet)
- Alias : `tzolkin`
- App ID : `org.leparede.tzolkinsight`
