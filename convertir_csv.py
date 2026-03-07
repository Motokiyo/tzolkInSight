#!/usr/bin/env python3
"""
Convertisseur CSV : ancien format (point-virgule) → nouveau format (virgule, tout quoté)
Usage : python3 convertir_csv.py <fichier_entree.csv> [fichier_sortie.csv]
Si fichier_sortie omis, crée automatiquement <fichier_entree>_converti.csv
"""

import csv
import sys
import os

# Mapping noms mayas (Yucatec) → chiffre numérique
# Mapping couleurs hex (ancienne app) → émotions (nouvelle app)
COULEUR_VERS_EMOTION = {
    '#ffff99': 'Joie,Sérénité,Extase',
    '#99ccff': 'Tristesse,Songerie,Chagrin',
    '#ff9999': 'Colère,Contrariété,Rage',
    '#99ff99': 'Peur,Appréhension,Terreur',
    '#cc99ff': 'Surprise,Distraction,Stupéfaction',
    '#ccffcc': 'Confiance,Acceptation,Admiration',
    '#999966': 'Dégoût,Aversion,Ennui',
    '#ffcc99': 'Anticipation,Intérêt,Vigilance',
}

def couleur_vers_emotion(valeur):
    """Convertit un code hex couleur en nom d'émotion."""
    if not valeur:
        return ''
    return COULEUR_VERS_EMOTION.get(valeur.strip().lower(), '')

# Mapping glyphe nom → id (1-20), d'après GLYPHS dans tzolkin-core.js
GLYPHE_ID = {
    'Imix':1,'Ik':2,'Akbal':3,'Kan':4,'Chicchan':5,'Cimi':6,'Manik':7,'Lamat':8,
    'Muluc':9,'Oc':10,'Chuen':11,'Eb':12,'Ben':13,'Ix':14,'Men':15,'Cib':16,
    'Caban':17,'Etznab':18,'Cauac':19,'Ahau':20
}
ID_GLYPHE = {v: k for k, v in GLYPHE_ID.items()}

def calcul_trecena(glyphe, ton):
    """Calcule le glyphe de la trécéna à partir du glyphe et du ton.
    Formule de tzolkin-core.js : tgId = ((glyphId - numberId) % 20 + 20) % 20 + 1
    """
    g = GLYPHE_ID.get(glyphe)
    if not g or not ton:
        return ''
    try:
        t = int(ton)
    except (ValueError, TypeError):
        return ''
    tg_id = ((g - t) % 20 + 20) % 20 + 1
    return ID_GLYPHE.get(tg_id, '')

# Mapping noms mayas (Yucatec) → chiffre numérique
NOMS_VERS_CHIFFRE = {
    'hun': 1, 'ca': 2, 'ox': 3, 'can': 4, 'ho': 5,
    'uac': 6, 'wak': 6, 'uuc': 7, 'uaxac': 8, 'waxak': 8, 'bolon': 9, 'lahun': 10,
    'buluc': 11, 'lahca': 12, 'oxlahun': 13,
    # Variantes K'iche'
    'jun': 1, "ka'i": 2, "ka'i'": 2, "oxi'": 3, "kaji'": 4, "jo'": 5,
    "waki'": 6, "wuqu'": 7, "waqxaqi'": 8, "b'eleje'": 9, "laju'": 10,
    "junlaju'": 11, "kab'laju'": 12, "oxlaju'": 13,
    # Chiffres déjà numériques
    '1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,
    '8':8,'9':9,'10':10,'11':11,'12':12,'13':13
}

def chiffre_vers_ton(valeur):
    """Convertit un nom maya ou un chiffre texte en entier 1-13."""
    if not valeur:
        return ''
    v = valeur.strip().lower()
    if v in NOMS_VERS_CHIFFRE:
        return str(NOMS_VERS_CHIFFRE[v])
    # Essai numérique direct
    try:
        n = int(float(v))
        if 1 <= n <= 13:
            return str(n)
    except ValueError:
        pass
    return valeur  # Retourne tel quel si inconnu

def convertir(fichier_entree, fichier_sortie=None):
    if fichier_sortie is None:
        base, ext = os.path.splitext(fichier_entree)
        fichier_sortie = base + "_converti.csv"

    # Colonnes attendues dans les deux formats
    colonnes = ["Date", "Heure", "Lieu", "Lat", "Lon", "Glyphe", "Ton", "Trecena", "Emotion", "Texte"]

    lignes_lues = 0
    lignes_ecrites = 0
    erreurs = []

    with open(fichier_entree, newline='', encoding='utf-8-sig') as f_in, \
         open(fichier_sortie, 'w', newline='', encoding='utf-8') as f_out:

        # Détection automatique du séparateur
        debut = f_in.read(2048)
        f_in.seek(0)
        separateur = ';' if debut.count(';') > debut.count(',') else ','
        print(f"Séparateur détecté : '{separateur}'")

        lecteur = csv.DictReader(f_in, delimiter=separateur)
        ecrivain = csv.DictWriter(
            f_out,
            fieldnames=colonnes,
            delimiter=',',
            quoting=csv.QUOTE_ALL,
            lineterminator='\n'
        )
        # En-têtes sans guillemets (format de la nouvelle app)
        f_out.write(','.join(colonnes) + '\n')

        for i, ligne in enumerate(lecteur, start=2):
            lignes_lues += 1
            try:
                # Colonnes de l'ancien format : Date, Glyphe, Chiffre, Glyphe+Chiffre, Couleur, Note
                # Colonnes du nouveau format  : Date, Heure, Lieu, Lat, Lon, Glyphe, Ton, Trecena, Emotion, Texte
                date    = (ligne.get("Date")    or "").strip()
                heure   = ""
                lieu    = ""
                lat     = ""
                lon     = ""
                glyphe  = (ligne.get("Glyphe")  or "").strip()
                ton     = chiffre_vers_ton(ligne.get("Chiffre") or "")
                trecena = calcul_trecena(glyphe, ton)
                emotion = couleur_vers_emotion(ligne.get("Couleur") or "")
                texte   = (ligne.get("Note")    or "").strip()

                # Validation minimale
                if not date:
                    erreurs.append(f"Ligne {i} : date manquante, ignorée")
                    continue

                ecrivain.writerow({
                    "Date":    date,
                    "Heure":   heure,
                    "Lieu":    lieu,
                    "Lat":     lat,
                    "Lon":     lon,
                    "Glyphe":  glyphe,
                    "Ton":     ton,
                    "Trecena": trecena,
                    "Emotion": emotion,
                    "Texte":   texte,
                })
                lignes_ecrites += 1

            except Exception as e:
                erreurs.append(f"Ligne {i} : erreur ({e})")

    print(f"\n✓ {lignes_ecrites} notes converties → {fichier_sortie}")
    if erreurs:
        print(f"⚠ {len(erreurs)} problème(s) :")
        for e in erreurs:
            print(f"  - {e}")
    return fichier_sortie


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage : python3 convertir_csv.py <fichier.csv> [sortie.csv]")
        sys.exit(1)
    entree = sys.argv[1]
    sortie = sys.argv[2] if len(sys.argv) > 2 else None
    convertir(entree, sortie)
