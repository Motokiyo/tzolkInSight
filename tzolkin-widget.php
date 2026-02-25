<?php
/*
 * Widget Tzolk'in Maya
 * Description: Widget WordPress affichant le jour courant du calendrier Tzolk'in avec navigation, chiffre maya et glyphe maya.
 * Author: Alexandre Mathieu Motokiyo Ferran pour le Parédé 2025 (12 CAUAC)
 * Version: 0.9.9
 */
error_log("Tzolk'in: Loading tzolkin-widget.php");
require_once __DIR__ . '/tzolkin-details.php';
// Définir les données des trécénas
function tzolkin_load_data() {
    $trecenas = array(
        1 => array(
            "nom_francais" => "Imix",
            "nawal_maya" => "Imix",
            "traduction" => "Crocodile",
            "description" => "<p>Imix, qu'on peut traduire par Crocodile, est associé à la création, aux rêves et à l'énergie primordiale de la Mère. C'est une période pour faire confiance à l'univers et se connecter avec la terre et l'eau. Mots clés : création, rêves, inspiration, énergie primordiale.</p>"
        ),
        2 => array(
            "nom_francais" => "Ik'",
            "nawal_maya" => "Ik'",
            "traduction" => "Vent",
            "description" => "<p>Ik', qu'on peut traduire par Vent, est lié à la communication, à l'imagination et à l'inspiration. C'est un moment propice aux nouvelles conversations et à l'ouverture aux changements. Mots clés : communication, imagination, inspiration, changement.</p>"
        ),
        3 => array(
            "nom_francais" => "Ak'bal",
            "nawal_maya" => "Ak'bal",
            "traduction" => "Nuit",
            "description" => "<p>Ak'bal, qu'on peut traduire par Nuit ou Maison, traite de l'ombre et de la lumière, ainsi que de la dualité. C'est une période pour la réflexion et la recherche de la sagesse intérieure. Mots clés : ombre, lumière, dualité, sagesse intérieure.</p>"
        ),
        4 => array(
            "nom_francais" => "Graine",
            "nawal_maya" => "Kan",
            "traduction" => "Graine",
            "description" => "<p>Kan, qu'on peut traduire par Graine ou Maïs, est associé à la sagesse, au pouvoir et à la force vitale. C'est un moment propice à l'apprentissage et à l'évolution spirituelle. Mots clés : sagesse, pouvoir, force vitale, transformation.</p>"
        ),
        5 => array(
            "nom_francais" => "Chicchan",
            "nawal_maya" => "Chicchan",
            "traduction" => "Serpent Céleste",
            "description" => "<p>Chicchan, qu'on peut traduire par Serpent Céleste, met en lumière l'énergie vitale et la passion. C'est un moment puissant et potentiellement transformateur. Mots clés : énergie vitale, passion, force primale.</p>"
        ),
        6 => array(
            "nom_francais" => "Cimi",
            "nawal_maya" => "Cimi",
            "traduction" => "Mort",
            "description" => "<p>Cimi, qu'on peut traduire par Mort ou Transformation, aborde les thèmes de la mort et du lâcher-prise. C'est une période de changement profond et de renouveau spirituel. Mots clés : mort, transformation, lâcher-prise, renouveau spirituel.</p>"
        ),
        7 => array(
            "nom_francais" => "Manik",
            "nawal_maya" => "Manik",
            "traduction" => "Cerf",
            "description" => "<p>Manik, qu'on peut traduire par Cerf, symbolise l'autorité, le respect et l'équilibre cosmique. C'est un moment pour honorer nos dons et servir avec humilité. Mots clés : autorité, respect, équilibre cosmique, guérison.</p>"
        ),
        8 => array(
            "nom_francais" => "Lamat",
            "nawal_maya" => "Lamat",
            "traduction" => "Lapin",
            "description" => "<p>Lamat, qu'on peut traduire par Lapin ou Vénus, est associé à la fertilité et à l'abondance. C'est un moment propice à la plantation de nouvelles idées et à la croissance. Mots clés : fertilité, abondance, croissance, prospérité.</p>"
        ),
        9 => array(
            "nom_francais" => "Muluc",
            "nawal_maya" => "Muluc",
            "traduction" => "Eau",
            "description" => "<p>Muluc, qu'on peut traduire par Eau ou Offrande, est lié à la purification et au flux de la vie. C'est un moment pour lâcher prise et suivre le rythme naturel des cycles. Mots clés : eau, purification, flux, lâcher-prise.</p>"
        ),
        10 => array(
            "nom_francais" => "Oc",
            "nawal_maya" => "Oc",
            "traduction" => "Chien",
            "description" => "<p>Oc, qu'on peut traduire par Chien, souligne l'amour, la vérité et la loyauté. Le chien est un symbole de fidélité et de protection. Mots clés : amour, vérité, justice, loyauté, autorité.</p>"
        ),
        11 => array(
            "nom_francais" => "Chuen",
            "nawal_maya" => "Chuen",
            "traduction" => "Singe",
            "description" => "<p>Chuen, qu'on peut traduire par Singe ou Fil, est lié à la créativité, à la gaieté et aux arts. C'est un moment d'expression artistique et de joie de vivre. Mots clés : créativité, gaieté, arts, temps, ancêtres.</p>"
        ),
        12 => array(
            "nom_francais" => "Eb",
            "nawal_maya" => "Eb",
            "traduction" => "Route",
            "description" => "<p>Eb, qu'on peut traduire par Route ou Herbe, met en évidence le chemin spirituel et le voyage. C'est un moment pour se concentrer sur son propre parcours de vie. Mots clés : chemin spirituel, voyage, destin, gratitude.</p>"
        ),
        13 => array(
            "nom_francais" => "Ben",
            "nawal_maya" => "Ben",
            "traduction" => "Roseau",
            "description" => "<p>Ben, qu'on peut traduire par Roseau ou Maïs, met l'accent sur la maison, la famille et la communauté. C'est un bon moment pour reconnaître les bénédictions de la vie. Mots clés : maison, famille, communauté, fertilité, destin.</p>"
        ),
        14 => array(
            "nom_francais" => "Ix",
            "nawal_maya" => "Ix",
            "traduction" => "Jaguar",
            "description" => "<p>Ix, qu'on peut traduire par Jaguar ou Magicien, est consacré à la magie terrestre et au pouvoir féminin. Le jaguar symbolise la force et l'intuition. Mots clés : magie terrestre, pouvoir féminin, connexion à la nature.</p>"
        ),
        15 => array(
            "nom_francais" => "Men",
            "nawal_maya" => "Men",
            "traduction" => "Aigle",
            "description" => "<p>Men, qu'on peut traduire par Aigle ou Vision, est dédié à la vision et à la prospérité. L'aigle représente une perspective supérieure et la liberté. Mots clés : vision, prospérité, vue d'ensemble, abondance.</p>"
        ),
        16 => array(
            "nom_francais" => "Cib",
            "nawal_maya" => "Cib",
            "traduction" => "Vautour",
            "description" => "<p>Cib, qu'on peut traduire par Vautour ou Hibou, est associé à la sagesse ancestrale et au pardon. C'est un moment pour se connecter avec les ancêtres et guérir le passé. Mots clés : sagesse ancestrale, pardon, force cosmique.</p>"
        ),
        17 => array(
            "nom_francais" => "Caban",
            "nawal_maya" => "Caban",
            "traduction" => "Terre",
            "description" => "<p>Caban, qu'on peut traduire par Terre ou Mouvement, est dédié à l'intelligence et aux idées. C'est un moment propice à l'introspection et à la réflexion. Mots clés : intelligence, idées, sagesse, connaissance, mémoire.</p>"
        ),
        18 => array(
            "nom_francais" => "Etz'nab",
            "nawal_maya" => "Etz'nab",
            "traduction" => "Couteau d'Obsidienne",
            "description" => "<p>Etz'nab, qu'on peut traduire par Couteau d'Obsidienne ou Miroir, est dédié à la guérison et au lâcher-prise. Le couteau d'obsidienne symbolise la clarté et la vérité. Mots clés : guérison, lâcher-prise, vérité, clarté.</p>"
        ),
        19 => array(
            "nom_francais" => " Cauac",
            "traduction" => "Tempête",
            "description" => "<p>Cauac, qu'on peut traduire par Pluie ou Tempête, est axé sur la naissance et la renaissance. La pluie symbolise la purification et le potentiel de nouveaux départs. Mots clés : naissance, renaissance, nouveaux commencements, purification.</p>"
        ),
        20 => array(
            "nom_francais" => "Ahau",
            "nawal_maya" => "Ahau",
            "traduction" => "Soleil",
            "description" => "<p>Ahau, qu'on peut traduire par Soleil ou Seigneur, est dédié à l'expérience humaine divine et à la lumière dorée. C'est un moment pour la découverte de soi et la connexion avec le divin. Mots clés : expérience humaine divine, lumière intérieure, héroïsme, illumination.</p>"
        )
    );

    // Définir les données des glyphes
    $glyph_texts = array(
        1 => array(
            'titre' => 'Imix, le Dragon',
            'description' => '<p>Imix peut se traduire par Crocodile. Il représente la source de vie, l’énergie primordiale et la création. Ce glyphe est lié à la fertilité, à l’eau et à la nature nourricière.</p>',
            'mots_cles' => 'création, origine, potentiel, intégrité',
            'animal_pouvoir' => '<strong>Crocodile</strong> ou <strong>Nénuphar</strong>'
        ),
        2 => array(
            'titre' => 'Ik, le Vent',
            'description' => '<p>Ik ou Ik\' peut se traduire par Vent. Il symbolise le souffle de vie, la communication et l’inspiration. Ce glyphe porte l’énergie du mouvement et de la spiritualité.</p>',
            'mots_cles' => 'communication, esprit, inspiration, changement',
            'animal_pouvoir' => '<strong>Colibri</strong> ou <strong>Vent</strong>'
        ),
        3 => array(
            'titre' => 'Akbal, la Nuit',
            'description' => '<p>Akbal ou Ak\'bal peut se traduire par Nuit. Il représente les rêves, l’introspection et l’obscurité. Ce glyphe invite à explorer l’intériorité et les mystères cachés.</p>',
            'mots_cles' => 'obscurité, mystère, intuition, refuge',
            'animal_pouvoir' => '<strong>Chauve-souris</strong> ou <strong>Nuit</strong>'
        ),
        4 => array(
            'titre' => 'Kan, la Graine',
            'description' => '<p>Kan peut se traduire par Maïs. Il symbolise la graine, le potentiel de croissance et la créativité. Ce glyphe représente le développement et l’abondance.</p>',
            'mots_cles' => 'abondance, croissance, potentiel, sagesse',
            'animal_pouvoir' => '<strong>Graine</strong> ou <strong>Lézard</strong>'
        ),
        5 => array(
            'titre' => 'Chicchan, le Serpent',
            'description' => '<p>Chicchan ou Chikchan peut se traduire par Serpent. Il incarne l’énergie vitale, l’instinct et la transformation. Ce glyphe est lié à la passion et à la sagesse corporelle.</p>',
            'mots_cles' => 'énergie, passion, transformation, intuition',
            'animal_pouvoir' => '<strong>Serpent</strong>'
        ),
        6 => array(
            'titre' => 'Cimi, la Mort',
            'description' => '<p>Cimi ou Kimi peut se traduire par Mort. Il symbolise la transformation, le renouveau et le lâcher-prise. Ce glyphe représente le cycle de la vie et la libération.</p>',
            'mots_cles' => 'mort, transformation, libération, pardon',
            'animal_pouvoir' => '<strong>Hibou</strong>, <strong>Mort</strong> ou <strong>Transformation</strong>'
        ),
        7 => array(
            'titre' => 'Manik, le Cerf',
            'description' => '<p>Manik ou Manik\' peut se traduire par Cerf. Il incarne la liberté, l’équilibre et la connexion avec la nature. Ce glyphe symbolise l’honneur et l’harmonie.</p>',
            'mots_cles' => 'autorité, équilibre, intégrité, don',
            'animal_pouvoir' => '<strong>Cerf</strong> ou <strong>Guérisseur</strong>'
        ),
        8 => array(
            'titre' => 'Lamat, l\'Étoile',
            'description' => '<p>Lamat peut se traduire par Lapin. Il représente l’étoile, la beauté et l’harmonie cosmique. Ce glyphe est associé à la créativité et à la prospérité.</p>',
            'mots_cles' => 'abondance, fertilité, chance, harmonie',
            'animal_pouvoir' => '<strong>Lapin</strong> ou <strong>Planète Vénus</strong>'
        ),
        9 => array(
            'titre' => 'Muluc, l\'Eau',
            'description' => '<p>Muluc ou Muluk peut se traduire par Eau. Il symbolise les émotions, la purification et le flux de la vie. Ce glyphe invite à écouter son intuition.</p>',
            'mots_cles' => 'eau, purification, flux, offrande',
            'animal_pouvoir' => '<strong>Poisson</strong>, <strong>Eau</strong> ou <strong>Lune</strong>'
        ),
        10 => array(
            'titre' => 'Oc, le Chien',
            'description' => '<p>Oc ou Ok peut se traduire par Chien. Il représente la loyauté, l’amour et la protection. Ce glyphe incarne la fidélité et les connexions émotionnelles.</p>',
            'mots_cles' => 'loyauté, protection, guidance, fidélité',
            'animal_pouvoir' => '<strong>Chien</strong>'
        ),
        11 => array(
            'titre' => 'Chuen, le Singe',
            'description' => '<p>Chuen ou Chuwen peut se traduire par Singe. Il symbolise la créativité, le jeu et l’humour. Ce glyphe incarne l’esprit artistique et la spontanéité.</p>',
            'mots_cles' => 'créativité, jeu, habileté, humour',
            'animal_pouvoir' => '<strong>Singe</strong>'
        ),
        12 => array(
            'titre' => 'Eb, l\'Humain',
            'description' => '<p>Eb peut se traduire par Herbe. Il représente l’humain, la route de la vie et les relations. Ce glyphe est lié à la gratitude et à la communauté.</p>',
            'mots_cles' => 'chemin, gratitude, humilité, connexion',
            'animal_pouvoir' => '<strong>Herbe</strong> ou <strong>Route</strong>'
        ),
        13 => array(
            'titre' => 'Ben, le Roseau',
            'description' => '<p>Ben peut se traduire par Roseau. Il symbolise la croissance, l’autorité spirituelle et la connexion entre la terre et le ciel.</p>',
            'mots_cles' => 'autorité, croissance, fondation, bénédiction',
            'animal_pouvoir' => '<strong>Roseau</strong> ou <strong>Maïs</strong>'
        ),
        14 => array(
            'titre' => 'Ix, le Jaguar',
            'description' => '<p>Ix peut se traduire par Jaguar. Il incarne la magie, la puissance et la connexion avec la terre. Ce glyphe représente la sagesse chamanique.</p>',
            'mots_cles' => 'magie, féminin, nature, intuition',
            'animal_pouvoir' => '<strong>Jaguar</strong> ou <strong>Ocelot</strong>'
        ),
        15 => array(
            'titre' => 'Men, l\'Aigle',
            'description' => '<p>Men peut se traduire par Ashear Aigle. Il représente la vision, la liberté et la conscience supérieure. Ce glyphe est lié à l’inspiration et à la perspective élevée.</p>',
            'mots_cles' => 'vision, liberté, conscience, prospérité',
            'animal_pouvoir' => '<strong>Aigle</strong>'
        ),
        16 => array(
            'titre' => 'Cib, le Vautour',
            'description' => '<p>Cib ou Kib peut se traduire par Hibou ou Vautour. Il symbolise la patience, la purification et la sagesse ancestrale. Ce glyphe invite à accepter les cycles naturels.</p>',
            'mots_cles' => 'sagesse, pardon, destin, connexion',
            'animal_pouvoir' => '<strong>Vautour</strong> ou <strong>Chouette</strong>'
        ),
        17 => array(
            'titre' => 'Caban, la Terre',
            'description' => '<p>Caban ou Kab\'an peut se traduire par Terre. Il représente le mouvement, l’évolution et la synchronicité. Ce glyphe incarne l’énergie planétaire.</p>',
            'mots_cles' => 'mouvement, intelligence, synchronicité, évolution',
            'animal_pouvoir' => '<strong>Terre</strong> ou <strong>Pic-vert</strong>'
        ),
        18 => array(
            'titre' => 'Etznab, le Couteau d\'Obsidienne',
            'description' => '<p>Etznab ou Etz\'nab peut se traduire par Couteau d’Obsidienne. Il symbolise la vérité, la réflexion et la clarté. Ce glyphe invite à affronter ses ombres.</p>',
            'mots_cles' => 'vérité, clarté, guérison, discernement',
            'animal_pouvoir' => '<strong>Miroir</strong> ou <strong>Obsidienne</strong>'
        ),
        19 => array(
            'titre' => 'Cauac, l\'Orage',
            'description' => '<p>Cauac ou Kawak peut se traduire par Pluie. Il représente l’orage, la transformation et l’énergie purificatrice. Ce glyphe apporte le renouveau à travers le chaos.</p>',
            'mots_cles' => 'pluie, purification, transformation, communauté',
            'animal_pouvoir' => '<strong>Tortue</strong>, <strong>Pluie</strong> ou <strong>Tempête</strong>'
        ),
        20 => array(
            'titre' => 'Ahau, le Soleil',
            'description' => '<p>Ahau ou Ajaw peut se traduire par Seigneur. Il incarne le soleil, la lumière et la maîtrise. Ce glyphe symbolise l’illumination et l’accomplissement.</p>',
            'mots_cles' => 'lumière, conscience, leadership, unité',
            'animal_pouvoir' => '<strong>Soleil</strong>, <strong>Roi</strong> ou <strong>Fleur</strong>'
        )
    );

    // Définir les données des chiffres
    $number_texts = array(
        1 => array(
            'titre' => '1, Hun',
            'description' => '<p><strong>Unité</strong> : le chiffre 1, Hun, incarne les commencements, l’unité et l’intention primordiale. Il représente la source de l’énergie créatrice et l’initiation des cycles. Sa fonction est d’initier les cycles et de donner le ton à une trécéna.</p>'
        ),
        2 => array(
            'titre' => '2, Ca’',
            'description' => '<p><strong>Dualité</strong> : le chiffre 2, Ca’, symbolise la dualité, l’équilibre et le partenariat. Il évoque le mystère, le charisme et la connexion spirituelle. Sa fonction est de représenter l’interaction des forces opposées, favorisant l’équilibre.</p>'
        ),
        3 => array(
            'titre' => '3, Ox',
            'description' => '<p><strong>Mouvement</strong> : le chiffre 3, Ox, est associé à l’action, à la créativité et au mouvement. Il représente le rythme et l’expression de soi. Sa fonction est d’injecter du dynamisme et une expression artistique.</p>'
        ),
        4 => array(
            'titre' => '4, Kan',
            'description' => '<p><strong>Stabilité</strong> : le chiffre 4, Kan, incarne la stabilité, la fondation et la complétude. Il représente les quatre directions et le monde matériel. Sa fonction est de fournir un sentiment d’ancrage et de structure.</p>'
        ),
        5 => array(
            'titre' => '5, Ho’',
            'description' => '<p><strong>Centre</strong> : le chiffre 5, Ho’, symbolise l’action humaine à travers les cinq doigts et les cinq sens. Il représente l’intelligence, la communication et la manifestation. Sa fonction est de représenter le pouvoir de la volonté et de l’intellect humains.</p>'
        ),
        6 => array(
            'titre' => '6, Wak',
            'description' => '<p><strong>Flux</strong> : le chiffre 6, Wak, représente l’harmonie, l’équilibre et le flux. Il est associé à la compréhension des commencements et des fins. Sa fonction est de faciliter l’équilibre et l’harmonie.</p>'
        ),
        7 => array(
            'titre' => '7, Uuc',
            'description' => '<p><strong>Réflexion</strong> : le chiffre 7, Uuc, est lié à l’introspection, à la réflexion et à la spiritualité. Il représente le questionnement et un point tournant. Sa fonction est d’encourager la réflexion intérieure et l’exploration spirituelle.</p>'
        ),
        8 => array(
            'titre' => '8, Waxak',
            'description' => '<p><strong>Harmonie</strong> : le chiffre 8, Waxak, symbolise l’achèvement, la plénitude et le tissage de la vie. Il représente le fil du temps et l’interconnexion. Sa fonction est de signifier la culmination des énergies et le potentiel de transformation.</p>'
        ),
        9 => array(
            'titre' => '9, Bolon',
            'description' => '<p><strong>Accomplissement</strong> : le chiffre 9, Bolon, est connu comme le nombre de la vie et représente les neuf mois de gestation. Il est associé aux femmes et au principe féminin. Sa fonction est de représenter la force vitale et l’énergie féminine nourricière.</p>'
        ),
        10 => array(
            'titre' => '10, Lahun',
            'description' => '<p><strong>Manifestation</strong> : le chiffre 10, Lahun, représente les deux mains et les dix doigts, symbolisant la coopération humaine. Il est associé à l’union et à la loi universelle. Sa fonction est de souligner l’importance de la collaboration et de la communauté.</p>'
        ),
        11 => array(
            'titre' => '11, Buluc',
            'description' => '<p><strong>Libération</strong> : le chiffre 11, Buluc, est considéré comme intense et représente de nouveaux commencements après un défi. Il est associé à une énergie élevée et à l’instabilité potentielle. Sa fonction est de faciliter l’abandon des schémas obsolètes.</p>'
        ),
        12 => array(
            'titre' => '12, Lahca',
            'description' => '<p><strong>Compréhension</strong> : le chiffre 12, Lahca, symbolise l’achèvement d’un cycle plus vaste et l’harmonie. Il représente la culmination et la sagesse. Sa fonction est de signifier la fin de cycles importants et la transition.</p>'
        ),
        13 => array(
            'titre' => '13, Oxlahun',
            'description' => '<p><strong>Transcendance</strong> : le chiffre 13, Oxlahun, représente l’achèvement ultime, l’ascension et l’autorité. Il est associé à l’intensité et à la connexion divine. Sa fonction est de représenter le plus haut niveau d’accomplissement.</p>'
        )
    );

    return array(
        'trecenas' => $trecenas,
        'glyph_texts' => $glyph_texts,
        'number_texts' => $number_texts
    );

    error_log("Tzolk'in: Data arrays defined - trecenas: " . count($trecenas) . ", glyph_texts: " . count($glyph_texts) . ", number_texts: " . count($number_texts));

    return array(
        'trecenas' => $trecenas,
        'glyph_texts' => $glyph_texts,
        'number_texts' => $number_texts
    );
}

function modAdjust($x, $m) {
    $result = $x % $m;
    if ($result <= 0) $result += $m;
    return $result;
}

if (!function_exists('getCycleGlyphs')) {
    function getCycleGlyphs($g) {
        return array(
            $g,
            modAdjust($g + 5, 20),
            modAdjust($g + 10, 20),
            modAdjust($g + 15, 20)
        );
    }
}

if (!function_exists('getCycleNumbers')) {
    function getCycleNumbers($c) {
        return array(
            modAdjust($c - 7, 13),
            $c,
            modAdjust($c - 6, 13)
        );
    }
}

if (!function_exists('findDayIndex')) {
    function findDayIndex($g, $c) {
        $c1 = $c - 1;
        $g1 = $g - 1;
        return (20 * $c1 * 17 + 13 * $g1 * 10) % 260 + 1;
    }
}

if (!function_exists('getFortyDayWindow')) {
    function getFortyDayWindow($centerDay) {
        $window = array();
        for ($i = -20; $i <= 19; $i++) {
            $day = modAdjust($centerDay + $i - 1, 260);
            $window[] = $day;
        }
        sort($window);
        return $window;
    }
}

if (!function_exists('getCycleData')) {
    function getCycleData($g, $c, $name, $color) {
        if (!is_int($g) || $g < 1 || $g > 20 || !is_int($c) || $c < 1 || $c > 13) {
            return array('cycleDays' => [], 'windows' => [], 'namePlacements' => [], 'color' => $color);
        }
        $cycleGlyphs = getCycleGlyphs($g);
        $cycleNumbers = getCycleNumbers($c);
        $startDay = findDayIndex($g, $c);
        $cycleDays = array();
        $windows = array();
        $namePlacements = array();
        
        for ($k = 0; $k < 7; $k++) {
            $day = modAdjust($startDay + 40 * $k - 1, 260);
            $glyph = modAdjust(($day - 1) % 20 + 1, 20);
            $number = modAdjust(($day - 1) % 13 + 1, 13);
            $cycleNumberSet = array_map(function($cn) use ($k) { return modAdjust($cn + $k, 13); }, $cycleNumbers);
            if (in_array($glyph, array_slice($cycleGlyphs, 0, 2)) && in_array($number, $cycleNumberSet)) {
                $cycleDays[] = array('day' => $day, 'glyph' => $glyph, 'number' => $number);
                $windows[$day] = getFortyDayWindow($day);
                if ($glyph === $g && $number === $c) {
                    $namePlacements[$day] = $name . ' (Start)';
                } elseif ($glyph === $cycleGlyphs[1]) {
                    $namePlacements[$day] = $name . ' (Next Glyph)';
                }
            }
        }
        
        for ($k = 0; $k < 7; $k++) {
            $day = modAdjust($startDay + 40 * $k - 1, 260);
            $glyph = modAdjust(($day - 1) % 20 + 1, 20);
            $number = modAdjust(($day - 1) % 13 + 1, 13);
            $cycleNumberSet = array_map(function($cn) use ($k) { return modAdjust($cn + $k, 13); }, $cycleNumbers);
            if (in_array($glyph, array_slice($cycleGlyphs, 2)) && in_array($number, $cycleNumberSet)) {
                $cycleDays[] = array('day' => $day, 'glyph' => $glyph, 'number' => $number);
                $windows[$day] = getFortyDayWindow($day);
            }
        }
        
        usort($cycleDays, function($a, $b) { return $a['day'] - $b['day']; });
        return array(
            'cycleDays' => $cycleDays,
            'windows' => $windows,
            'namePlacements' => $namePlacements,
            'color' => $color
        );
    }
}

class Tzolkin_Maya_Widget extends WP_Widget {
    public $glyphs = [
        1 => 'MAYA-g-log-cal-D01-Imix.svg',
        2 => 'MAYA-g-log-cal-D02-Ik.svg',
        3 => 'MAYA-g-log-cal-D03-Akbal.svg',
        4 => 'MAYA-g-log-cal-D04-Kan.svg',
        5 => 'MAYA-g-log-cal-D05-Chikchan.svg',
        6 => 'MAYA-g-log-cal-D06-Kimi.svg',
        7 => 'MAYA-g-log-cal-D07-Manik.svg',
        8 => 'MAYA-g-log-cal-D08-Lamat.svg',
        9 => 'MAYA-g-log-cal-D09-Muluk.svg',
        10 => 'MAYA-g-log-cal-D10-Ok_b.svg',
        11 => 'MAYA-g-log-cal-D11-Chuwen.svg',
        12 => 'MAYA-g-log-cal-D12-Eb.svg',
        13 => 'MAYA-g-log-cal-D13-Ben.svg',
        14 => 'MAYA-g-log-cal-D14-Ix.svg',
        15 => 'MAYA-g-log-cal-D15-Men.svg',
        16 => 'MAYA-g-log-cal-D16-Kib.svg',
        17 => 'MAYA-g-log-cal-D17-Kaban.svg',
        18 => 'MAYA-g-log-cal-D18-Etznab.svg',
        19 => 'MAYA-g-log-cal-D19-Kawak.svg',
        20 => 'MAYA-g-log-cal-D20-Ajaw.svg',
    ];
    public $numbers = [
        1 => 'Maya_1.svg',
        2 => 'Maya_2.svg',
        3 => 'Maya_3.svg',
        4 => 'Maya_4.svg',
        5 => 'Maya_5.svg',
        6 => 'Maya_6.svg',
        7 => 'Maya_7.svg',
        8 => 'Maya_8.svg',
        9 => 'Maya_9.svg',
        10 => 'Maya_10.svg',
        11 => 'Maya_11.svg',
        12 => 'Maya_12.svg',
        13 => 'Maya_13.svg',
    ];

    public function __construct() {
        parent::__construct(
            'tzolkin-app-interactive',
            __('Tzolk’in Maya', 'astra-child'),
            array('description' => __('Affiche le jour courant du calendrier Tzolk’in maya avec navigation.', 'astra-child'))
        );
    }

    public function get_numbers() {
        return $this->numbers;
    }

    public function get_glyphs() {
        return $this->glyphs;
    }

    public function get_number_svg_url($number) {
        $number_file = isset($this->numbers[$number]) ? $this->numbers[$number] : 'Maya_' . $number . '.svg';
        return get_stylesheet_directory_uri() . '/assets/numbers/' . $number_file;
    }

    public function get_glyph_svg_url($glyph) {
        return get_stylesheet_directory_uri() . '/assets/glyphs/' . $this->glyphs[$glyph];
    }

    public function widget($args, $instance) {
        global $trecenas, $glyph_texts, $number_texts;
        $glyphNames = array(
            '', 'Imix', 'Ik', 'Ak\'bal', 'K\'an', 'Chicchan', 'Kimi', 'Manik', 'Lamat', 'Muluk',
            'Ok', 'Chuwen', 'Eb\'', 'Ben', 'Ix', 'Men', 'Kib\'', 'Kab\'an', 'Etz\'nab', 'Kawak', 'Ajaw'
        );

        // Récupérer l'offset
        $offset = isset($instance['tzolkin_offset']) ? intval($instance['tzolkin_offset']) : 0;
        date_default_timezone_set('Europe/Paris');
        $today = new DateTime('today');
        $target_date = clone $today;
        if ($offset !== 0) {
            $target_date->modify(($offset >= 0 ? '+' : '') . $offset . ' days');
        }

        $base_date = new DateTime('2025-04-22');
        $base_number = 11;
        $base_glyph = 5;
        $interval = $base_date->diff($target_date)->days;
        if ($target_date < $base_date) $interval *= -1;
        $number = modAdjust($base_number + $interval, 13);
        $glyph = modAdjust($base_glyph + $interval, 20);

        $number_svg_url = $this->get_number_svg_url($number);
        $glyph_svg_url = $this->get_glyph_svg_url($glyph);
        $gregorian = $target_date->format('d/m/Y');

        $days_to_subtract = $number - 1;
        $trecena_glyph = modAdjust($glyph - $days_to_subtract, 20);
        $trecena_glyph_url = $this->get_glyph_svg_url($trecena_glyph);

        $people = get_option('tzolkin_people_cycles', array());
        $matching_people = array();
        $names_today = array();
        foreach ($people as $p) {
            $g = isset($p['glyph']) ? intval($p['glyph']) : 0;
            $n = isset($p['number']) ? intval($p['number']) : 0;
            if ($g < 1 || $g > 20 || $n < 1 || $n > 13) continue;
            $name = isset($p['name']) ? $p['name'] : '';
            $color = isset($p['color']) ? $p['color'] : '#FF0000';
            $cycleGlyphs = getCycleGlyphs($g);
            $cycleNumbers = getCycleNumbers($n);
            $cycle_couples = array();
            foreach ($cycleGlyphs as $cg) {
                foreach ($cycleNumbers as $cn) {
                    $cycle_couples[] = array('glyph' => $cg, 'number' => $cn);
                }
            }
            foreach ($cycle_couples as $cc) {
                if ($cc['glyph'] == $glyph && $cc['number'] == $number) {
                    $matching_people[] = array('name' => $name, 'color' => $color);
                    if ($g == $glyph && $n == $number) {
                        $names_today[] = $name;
                    }
                    break;
                }
            }
        }

        $bg_css = '';
        $n_people = count($matching_people);
        if ($n_people == 1) {
            $bg_css = 'background:' . esc_attr($matching_people[0]['color']) . ';';
        } elseif ($n_people > 1) {
            $step = 360 / $n_people;
            $bg_css = 'background:conic-gradient(';
            $angle = 0;
            foreach ($matching_people as $idx => $p) {
                $next_angle = $angle + $step;
                $bg_css .= esc_attr($p['color']) . ' ' . $angle . 'deg ' . ($next_angle) . 'deg';
                if ($idx < $n_people - 1) $bg_css .= ', ';
                $angle += $step;
            }
            $bg_css .= ');';
        }

        echo $args['before_widget'];
        $names_str = '';
        if (!empty($matching_people)) {
            $all_names = array_map(function($p) { return isset($p['name']) ? esc_html($p['name']) : ''; }, $matching_people);
            $names_str = implode(', ', array_filter($all_names));
        }
        echo '<div id="tzolkin-widget-php" class="tzolkin-widget-container" data-offset="' . esc_attr($offset) . '" style="border-radius:16px;border:2px solid #222;width:100%;max-width:400px;min-width:0;margin:0 auto;background:#ded2b3;box-shadow:0 2px 12px rgba(0,0,0,0.09);padding:0;padding-bottom:clamp(8%,2vw,12%);box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;aspect-ratio:1/1;overflow:hidden;">';

        // Préchargement des images avec exclusion de lightbox
        echo '<div style="display:none;" aria-hidden="true">';
        foreach ($this->glyphs as $index => $glyph_file) {
            $glyph_url = get_stylesheet_directory_uri() . '/assets/glyphs/' . $glyph_file;
            echo '<img src="' . esc_url($glyph_url) . '" alt="Glyph ' . esc_attr($glyphNames[$index]) . '" data-lightbox="none" style="pointer-events:none;" />';
        }
        foreach ($this->numbers as $index => $number_file) {
            $number_url = get_stylesheet_directory_uri() . '/assets/numbers/' . $number_file;
            echo '<img src="' . esc_url($number_url) . '" alt="Number ' . esc_attr($index) . '" data-lightbox="none" style="pointer-events:none;" />';
        }
        echo '</div>';

        echo '<img src="' . esc_url($trecena_glyph_url) . '" alt="Glyphe trecena" class="tzolkin-trecena-glyph trecena-image" style="position:absolute;top:0;left:0;width:100%;max-width:400px;height:100%;max-height:400px;object-fit:contain;opacity:0.65;z-index:1;pointer-events:none;user-select:none;" draggable="false" data-lightbox="none" />';
        echo '<button class="tzolkin-widget-reset" title="retour au jour d\'aujourd\'hui" type="button" style="position:absolute;top:8px;right:8px;width:28px;height:28px;min-width:0;min-height:0;max-width:32px;max-height:32px;padding:0;margin:0;background:#111;border-radius:7px;border:none;outline:none;z-index:20;display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 2a8 8 0 1 1-7.32 4.906" stroke="#fff" stroke-width="2" fill="none"/><polyline points="2 2 2 7 7 7" stroke="#fff" stroke-width="2" fill="none"/></svg>
        </button>';

        echo '<div class="tzolkin-title" style="text-align:center;font-weight:bold;font-size:1.2em;position:absolute;top:0;left:0;right:0;z-index:12;background:transparent;width:100%;overflow-wrap:break-word;transition:.2s;margin-top:0;margin-bottom:0;">
            <span class="tzolkin-title-span" data-title="Tzolk’in" data-names="' . htmlspecialchars($names_str, ENT_QUOTES, 'UTF-8') . '" style="display:inline-flex;align-items:center;justify-content:center;padding:0 0.12em;line-height:1;background:#ded2b3;border-radius:0.4em;border:none;vertical-align:middle;">Tzolk’in</span>
        </div>';

        echo '<div class="tzolkin-square" style="width:76%;height:65%;margin:calc(2.2em + 1vw) auto clamp(5%,2vw,8%) auto;position:relative;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:16px;border:2px solid #222;z-index:2;cursor:pointer;overflow:hidden;">';
        echo '<div style="position:absolute;inset:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1;pointer-events:none;"></div>';
        if ($n_people > 0) {
            echo '<div class="tzolkin-bg-overlay" style="position:absolute;inset:0;width:100%;height:100%;' . $bg_css . 'z-index:1;pointer-events:none;"></div>';
        }
        echo '<div class="tzolkin-chiffre-glyphe" style="display:flex;flex-direction:row;align-items:center;justify-content:stretch;width:100%;height:100%;gap:0;margin-top:clamp(8px,2vw,18px);margin-bottom:clamp(4px,1vw,12px);z-index:2;position:relative;">';
        echo '<div class="tzolkin-number" style="display:flex;align-items:center;justify-content:flex-end;flex-basis:33.333%;flex-shrink:1;flex-grow:0;height:100%;padding-right:3%;">';
        echo '<img src="' . esc_url($number_svg_url) . '" alt="Chiffre maya ' . esc_attr($number) . '" class="tzolkin-number-img" style="width:94%;height:auto;max-width:100%;max-height:100%;display:block;z-index:2;" onerror="this.style.display=\'none\';this.insertAdjacentHTML(\'afterend\',\'<span style=\\\'font-size:clamp(1.1em,2vw,2em);color:#fff;\\\'>' . intval($number) . '</span>\');" data-lightbox="none" />';
        echo '</div>';
        echo '<div class="tzolkin-glyph" style="display:flex;align-items:center;justify-content:center;flex-basis:66.666%;flex-shrink:1;flex-grow:1;height:100%;">';
        echo '<img src="' . esc_url($glyph_svg_url) . '" alt="Glyphe maya ' . esc_attr($glyph) . '" class="tzolkin-glyph-img" style="width:98%;height:auto;max-width:100%;max-height:100%;display:block;" data-lightbox="none" />';
        echo '</div>';
        echo '</div>';
        echo '</div>';

        echo '<div class="tzolkin-bottom" style="width:100%;position:absolute;left:0;right:0;bottom:0;z-index:20;">';
        echo '<div class="tzolkin-nav-form" style="display:flex;flex-wrap:nowrap;align-items:center;justify-content:center;gap:8px;overflow:hidden;white-space:nowrap;width:100%;background:#ded2b3;z-index:20;position:relative;">';
        echo '<button type="button" class="tzolkin-nav-prev" style="width:40px;min-width:40px;height:100%;padding:0;display:flex;align-items:center;justify-content:center;background:transparent;border:none;box-shadow:none;cursor:pointer;position:relative;z-index:2;"><</button>';
        echo '<span class="tzolkin-gregorian tzolkin-gregorian-clickable" tabindex="0" title="cliquer pour entrer une date">' . esc_html($gregorian) . '</span>
            <input type="text" class="tzolkin-date-input" placeholder="jj/mm/aaaa" value="' . esc_attr($gregorian) . '" title="Aller à une date (Entrée)" style="display:none;" />';
        echo '<button type="button" class="tzolkin-nav-next" style="width:40px;min-width:40px;height:100%;padding:0;display:flex;align-items:center;justify-content:center;background:transparent;border:none;box-shadow:none;cursor:pointer;position:relative;z-index:2;">></button>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
        echo $args['after_widget'];
    }
}

add_action('widgets_init', function() {
    register_widget('Tzolkin_Maya_Widget');
});
add_action('wp_head', function() {
    echo '<style>
        #tzolkin-widget-php.tzolkin-widget-container {
            border-radius: 16px;
            border: 2px solid #222;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            background: #ded2b3;
            box-shadow: 0 2px 12px rgba(0,0,0,0.09);
            aspect-ratio: 1/1;
            isolation: isolate;
        }
        #tzolkin-widget-php .tzolkin-bg-overlay {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
            display: block;
            opacity: 1;
        }
        #tzolkin-widget-php .tzolkin-glyph-img,
        #tzolkin-widget-php .tzolkin-number-img {
            filter: invert(1) brightness(2) contrast(1.2);
        }
        .tzolkin-trecena, .tzolkin-glyphe, .tzolkin-chiffre {
            overflow: auto;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        .tzolkin-shortcode-img {
            height: 1.2em;
            width: auto;
            float: left;
            margin-right: 0.5em;
            vertical-align: middle;
            border-radius: 0;
            display: inline-block;
        }
        .tzolkin-trecena .tzolkin-shortcode-img.tzolkin-trecena-img {
            height: 1.5em;
        }
        .tzolkin-chiffre .tzolkin-shortcode-img.tzolkin-chiffre-img {
            height: 1.1em;
        }
        .tzolkin-glyphe .tzolkin-shortcode-img.tzolkin-glyphe-img,
        .tzolkin-chiffre .tzolkin-shortcode-img.tzolkin-chiffre-img {
            border-radius: 0 !important;
        }
        .tzolkin-trecena h3, .tzolkin-glyphe h3, .tzolkin-chiffre h3 {
            display: inline-block;
            vertical-align: middle;
            margin: 0;
            font-size: 1.2em;
            line-height: 1.2;
        }
        .tzolkin-trecena p, .tzolkin-glyphe p, .tzolkin-chiffre p {
            margin-top: 0.5em;
            margin-bottom: 0;
            line-height: 1.2;
            font-size: 1em;
        }
        .tzolkin-trecena p:last-child {
            //font-style: italic;
            margin-top: 0;
        }
        @media screen and (max-width: 600px) {
            #tzolkin-widget-php.tzolkin-widget-container {
                max-width: 300px;
            }
            #tzolkin-widget-php .tzolkin-square {
                width: 80%;
                height: 60%;
                margin-bottom: clamp(6%, 3vw, 10%);
            }
            #tzolkin-widget-php .tzolkin-nav-form {
                gap: 4px;
            }
            #tzolkin-widget-php .tzolkin-nav-form button {
                width: 32px;
                min-width: 32px;
            }
            #tzolkin-widget-php .tzolkin-gregorian {
                font-size: 0.9em;
            }
            .tzolkin-trecena .tzolkin-shortcode-img.tzolkin-trecena-img {
                height: 1.3em;
            }
            .tzolkin-chiffre .tzolkin-shortcode-img.tzolkin-chiffre-img {
                height: 1.0em;
            }
            .tzolkin-trecena h3, .tzolkin-glyphe h3, .tzolkin-chiffre h3 {
                font-size: 1.1em;
            }
            .tzolkin-trecena p, .tzolkin-glyphe p, .tzolkin-chiffre p {
                margin-top: 0.4em;
                font-size: 0.9em;
            }
        }
    </style>';
});
function tzolkin_glyphes_shortcode($atts) {
    $data = tzolkin_load_data();
    $glyph_texts = $data['glyph_texts'];
    $atts = shortcode_atts(['offset' => 0], $atts, 'tzolkin_glyphes');
    $offset = intval($atts['offset']);
    error_log("Tzolk'in: tzolkin_glyphes_shortcode called with offset $offset");

    $widget = new Tzolkin_Maya_Widget();
    date_default_timezone_set('Europe/Paris');
    $today = new DateTime('today');
    $target_date = clone $today;
    $target_date->modify("$offset days");
    $base_date = new DateTime('2025-04-22');
    $base_glyph = 5;
    $interval = $base_date->diff($target_date)->days;
    if ($target_date < $base_date) $interval *= -1;
    $glyph = modAdjust($base_glyph + $interval, 20);

    if (!isset($widget->glyphs[$glyph]) || !is_int($glyph) || $glyph < 1 || $glyph > 20) {
        error_log("Tzolk'in: Invalid glyph index $glyph in tzolkin_glyphes_shortcode");
        return '<div class="tzolkin-glyphe"><p>Glyphe invalide.</p></div>';
    }

    $glyph_url = $widget->get_glyph_svg_url($glyph);
    $glyph_alt = 'Glyphe Tzolk\'in';
    $glyph_title = isset($glyph_texts[$glyph]['titre']) ? $glyph_texts[$glyph]['titre'] : 'Glyphe ' . $glyph;
    $glyph_desc = isset($glyph_texts[$glyph]['description']) ? $glyph_texts[$glyph]['description'] : 'Description non disponible.';
    $glyph_mots_cles = isset($glyph_texts[$glyph]['mots_cles']) ? $glyph_texts[$glyph]['mots_cles'] : 'Non spécifié';
    $glyph_animal_pouvoir = isset($glyph_texts[$glyph]['animal_pouvoir']) ? $glyph_texts[$glyph]['animal_pouvoir'] : 'Non spécifié';

    // Log pour vérifier le contenu de $glyph_animal_pouvoir
    error_log("Tzolk'in: glyph_animal_pouvoir = " . print_r($glyph_animal_pouvoir, true));

    $onerror = "this.style.display='none';this.insertAdjacentHTML('afterend','<span style=\"font-size:1.2em;color:#000;vertical-align:middle;margin-right:0.5em;\">" . esc_js($glyph) . "</span>');";
    $html = '<div class="tzolkin-glyphe" data-type="glyph" data-id="' . esc_attr($glyph) . '">' .
                '<img src="' . esc_url($glyph_url) . '" alt="' . esc_attr($glyph_alt) . '" class="tzolkin-shortcode-img tzolkin-glyphe-img clickable" onerror="' . esc_attr($onerror) . '" data-type="glyph" data-id="' . esc_attr($glyph) . '" data-lightbox="none" style="pointer-events: auto;" />' .
                '<h3 class="clickable" data-type="glyph" data-id="' . esc_attr($glyph) . '">' . esc_html($glyph_title) . '</h3>' .
                '<div style="clear:both;">' . wp_kses_post($glyph_desc) . '</div>' .
                '<p style="font-style: italic;">Mots-clés : ' . esc_html($glyph_mots_cles) . '</p>' .
                '<p>Être de Pouvoir : ' . wp_kses_post($glyph_animal_pouvoir) . '</p>' .
            '</div>';
    error_log("Tzolk'in: tzolkin_glyphes_shortcode executed successfully");
    return $html;
}
function tzolkin_chiffres_shortcode($atts) {
    $data = tzolkin_load_data();
    $number_texts = $data['number_texts'];
    $atts = shortcode_atts(['offset' => 0], $atts, 'tzolkin_chiffres');
    $offset = intval($atts['offset']);
    error_log("Tzolk'in: tzolkin_chiffres_shortcode called with offset $offset");

    $widget = new Tzolkin_Maya_Widget();
    date_default_timezone_set('Europe/Paris');
    $today = new DateTime('today');
    $target_date = clone $today;
    $target_date->modify("$offset days");
    $base_date = new DateTime('2025-04-22');
    $base_number = 11;
    $interval = $base_date->diff($target_date)->days;
    if ($target_date < $base_date) $interval *= -1;
    $number = modAdjust($base_number + $interval, 13);

    if (!isset($widget->numbers[$number]) || !is_int($number) || $number < 1 || $number > 13) {
        error_log("Tzolk'in: Invalid number index $number in tzolkin_chiffres_shortcode");
        return '<div class="tzolkin-chiffre"><p>Chiffre invalide.</p></div>';
    }

    $number_url = $widget->get_number_svg_url($number);
    $number_alt = 'Chiffre Tzolk\'in';
    $number_title = isset($number_texts[$number]['titre']) ? $number_texts[$number]['titre'] : 'Chiffre ' . $number;
    $number_desc = (isset($number_texts[$number]) && is_array($number_texts[$number]) && isset($number_texts[$number]['description'])) ? $number_texts[$number]['description'] : 'Description non disponible.';

    $onerror = "this.style.display='none';this.insertAdjacentHTML('afterend','<span style=\\\"font-size:1.2em;color:#000;vertical-align:middle;margin-right:0.5em;\\\">" . esc_js($number) . "</span>');";
    $html = '<div class="tzolkin-chiffre" data-type="number" data-id="' . esc_attr($number) . '">' .
                '<img src="' . esc_url($number_url) . '" alt="' . esc_attr($number_alt) . '" class="tzolkin-shortcode-img tzolkin-chiffre-img clickable" onerror="' . esc_attr($onerror) . '" data-type="number" data-id="' . esc_attr($number) . '" data-lightbox="none" style="pointer-events: auto;" />' .
                '<h3 class="clickable" data-type="number" data-id="' . esc_attr($number) . '">' . esc_html($number_title) . '</h3>' .
                '<div style="clear:both;">' . wp_kses_post($number_desc) . '</div>' . // Utilisation de wp_kses_post pour interpréter le HTML
            '</div>';
    error_log("Tzolk'in: tzolkin_chiffres_shortcode executed successfully");
    return $html;
}

function tzolkin_trecenas_shortcode($atts) {
    $data = tzolkin_load_data();
    $trecenas = $data['trecenas'];
    $atts = shortcode_atts(['offset' => 0], $atts, 'tzolkin_trecenas');
    $offset = intval($atts['offset']);
    error_log("Tzolk'in: tzolkin_trecenas_shortcode called with offset $offset");

    $widget = new Tzolkin_Maya_Widget();
    date_default_timezone_set('Europe/Paris');
    $today = new DateTime('today');
    $target_date = clone $today;
    $target_date->modify("$offset days");
    $base_date = new DateTime('2025-04-22');
    $base_glyph = 5;
    $base_number = 11;
    $interval = $base_date->diff($target_date)->days;
    if ($target_date < $base_date) $interval *= -1;
    $glyph = modAdjust($base_glyph + $interval, 20);
    $number = modAdjust($base_number + $interval, 13);
    $days_to_subtract = $number - 1;
    $trecena_glyph = modAdjust($glyph - $days_to_subtract, 20);

    if (!isset($widget->glyphs[$trecena_glyph]) || !is_int($trecena_glyph) || $trecena_glyph < 1 || $trecena_glyph > 20) {
        error_log("Tzolk'in: Invalid trecena glyph index $trecena_glyph in tzolkin_trecenas_shortcode");
        return '<div class="tzolkin-trecena"><p>Trécéna invalide.</p></div>';
    }

    $trecena_data = $trecenas[$trecena_glyph];
    $trecena_title = $trecena_data['nom_francais'] . ' (' . $trecena_data['traduction'] . ')';
    $trecena_desc = isset($trecena_data['description']) ? $trecena_data['description'] : 'Description non disponible.';

    $html = '<div class="tzolkin-trecena" data-type="trecena" data-id="' . esc_attr($trecena_glyph) . '">' .
                '<h3>' . esc_html($trecena_title) . '</h3>' .
                '<div style="clear:both;">' . wp_kses_post($trecena_desc) . '</div>' . // Utilisation de wp_kses_post pour interpréter le HTML
            '</div>';
    error_log("Tzolk'in: tzolkin_trecenas_shortcode executed successfully");
    return $html;


    error_log("Tzolk'in: Trecenas array defined: " . (is_array($trecenas) ? 'yes' : 'no'));
    error_log("Tzolk'in: Trecena texts for index $trecena_glyph: " . (isset($trecenas[$trecena_glyph]) ? print_r($trecenas[$trecena_glyph], true) : 'not set'));

    $trecena_url = $widget->get_glyph_svg_url($trecena_glyph);
$trecena_alt = 'Glyphe trecena';
$trecena_title = isset($trecenas[$trecena_glyph]['titre']) ? $trecenas[$trecena_glyph]['titre'] : 'Trécéna ' . (isset($trecenas[$trecena_glyph]['nawal_maya']) ? $trecenas[$trecena_glyph]['nawal_maya'] : 'Non spécifié');
$trecena_desc = (isset($trecenas[$trecena_glyph]) && is_array($trecenas[$trecena_glyph]) && isset($trecenas[$trecena_glyph]['description'])) ? $trecenas[$trecena_glyph]['description'] : 'Description non disponible.';
error_log("Tzolk'in: Trecena text for index $trecena_glyph - titre: $trecena_title, description: $trecena_desc");

    $onerror = "this.style.display='none';this.insertAdjacentHTML('afterend','<span style=\\\"font-size:1.2em;color:#000;vertical-align:middle;margin-right:0.5em;\\\">" . esc_js($trecena_glyph) . "</span>');";
    $html = '<div class="tzolkin-trecena" style="overflow:auto;display:flex;align-items:center;flex-wrap:wrap;">' .
                '<img src="' . esc_url($trecena_url) . '" alt="' . esc_attr($trecena_alt) . '" class="tzolkin-shortcode-img tzolkin-trecena-img" onerror="' . esc_attr($onerror) . '" data-lightbox="none" />' .
                '<h3 style="display:inline-block;vertical-align:middle;margin:0;font-size:1.2em;line-height:1.2;">' . esc_html($trecena_title) . '</h3>' .
                '<p style="clear:both;margin-top:0.5em;">' . esc_html($trecena_desc) . '</p>' .
            '</div>';
    error_log("Tzolk'in: tzolkin_trecenas_shortcode executed successfully");
    return $html;
}

// Action AJAX combinée
add_action('wp_ajax_tzolkin_update', 'tzolkin_update_callback');
add_action('wp_ajax_nopriv_tzolkin_update', 'tzolkin_update_callback');
function tzolkin_update_callback() {
    $data = tzolkin_load_data();
    $trecenas = $data['trecenas'];
    $glyph_texts = $data['glyph_texts'];
    $number_texts = $data['number_texts'];
    $offset = isset($_POST['offset']) ? intval($_POST['offset']) : 0;
    error_log("Tzolk'in: tzolkin_update_callback called with offset $offset");

    try {
        // Générer le HTML du widget
        ob_start();
        $widget = new Tzolkin_Maya_Widget();
        $widget->widget(['before_widget' => '', 'after_widget' => ''], ['tzolkin_offset' => $offset]);
        $widget_html = ob_get_clean();

        // Générer le HTML des shortcodes
        $glyph_html = tzolkin_glyphes_shortcode(['offset' => $offset]);
        $number_html = tzolkin_chiffres_shortcode(['offset' => $offset]);
        $trecena_html = tzolkin_trecenas_shortcode(['offset' => $offset]);

        wp_send_json_success([
            'widget' => $widget_html,
            'glyph_html' => $glyph_html,
            'number_html' => $number_html,
            'trecena_html' => $trecena_html
        ]);
    } catch (Exception $e) {
        error_log("Tzolk'in: Error in tzolkin_update_callback: " . $e->getMessage());
        wp_send_json_error(['message' => 'Erreur serveur lors de la mise à jour']);
    }
}

// Désactiver la lightbox pour les images Tzolk'in
add_action('wp_footer', function() {
    ?>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const tzolkinImages = document.querySelectorAll('.tzolkin-shortcode-img, .tzolkin-trecena-glyph, .tzolkin-number-img, .tzolkin-glyph-img');
            tzolkinImages.forEach(img => {
                img.setAttribute('data-lightbox', 'none');
                img.removeAttribute('data-lightbox');
                if (!img.classList.contains('clickable')) {
                    img.style.pointerEvents = 'none';
                }
            });
        });
    </script>
    <?php
});

// JavaScript pour la mise à jour
add_action('wp_footer', function() {
    global $trecenas, $glyph_texts, $number_texts;
    $glyphs = [
        1 => 'MAYA-g-log-cal-D01-Imix.svg',
        2 => 'MAYA-g-log-cal-D02-Ik.svg',
        3 => 'MAYA-g-log-cal-D03-Akbal.svg',
        4 => 'MAYA-g-log-cal-D04-Kan.svg',
        5 => 'MAYA-g-log-cal-D05-Chikchan.svg',
        6 => 'MAYA-g-log-cal-D06-Kimi.svg',
        7 => 'MAYA-g-log-cal-D07-Manik.svg',
        8 => 'MAYA-g-log-cal-D08-Lamat.svg',
        9 => 'MAYA-g-log-cal-D09-Muluk.svg',
        10 => 'MAYA-g-log-cal-D10-Ok_b.svg',
        11 => 'MAYA-g-log-cal-D11-Chuwen.svg',
        12 => 'MAYA-g-log-cal-D12-Eb.svg',
        13 => 'MAYA-g-log-cal-D13-Ben.svg',
        14 => 'MAYA-g-log-cal-D14-Ix.svg',
        15 => 'MAYA-g-log-cal-D15-Men.svg',
        16 => 'MAYA-g-log-cal-D16-Kib.svg',
        17 => 'MAYA-g-log-cal-D17-Kaban.svg',
        18 => 'MAYA-g-log-cal-D18-Etznab.svg',
        19 => 'MAYA-g-log-cal-D19-Kawak.svg',
        20 => 'MAYA-g-log-cal-D20-Ajaw.svg',
    ];
    $numbers = [
        1 => 'Maya_1.svg',
        2 => 'Maya_2.svg',
        3 => 'Maya_3.svg',
        4 => 'Maya_4.svg',
        5 => 'Maya_5.svg',
        6 => 'Maya_6.svg',
        7 => 'Maya_7.svg',
        8 => 'Maya_8.svg',
        9 => 'Maya_9.svg',
        10 => 'Maya_10.svg',
        11 => 'Maya_11.svg',
        12 => 'Maya_12.svg',
        13 => 'Maya_13.svg',
    ];
    $people = get_option('tzolkin_people_cycles', []);
    $glyphs_json = json_encode($glyphs, JSON_HEX_QUOT | JSON_HEX_APOS);
    $numbers_json = json_encode($numbers, JSON_HEX_QUOT | JSON_HEX_APOS);
    $people_json = json_encode($people, JSON_HEX_QUOT | JSON_HEX_APOS);
    $base_date = '2025-04-22';
    $base_number = 11;
    $base_glyph = 5;
    $theme_uri = get_stylesheet_directory_uri();
    ?>
<script src="<?php echo get_stylesheet_directory_uri(); ?>/imask.js"></script>
    <script>
    (function($) {
        console.log('Tzolk\'in Widget: Script initialized');
        function modAdjust(x, m) {
            let result = x % m;
            if (result <= 0) result += m;
            return result;
        }

        document.addEventListener('DOMContentLoaded', function() {
            const widget = document.querySelector('#tzolkin-widget-php');
            if (!widget) {
                console.error('Tzolk\'in Widget: Container #tzolkin-widget-php not found');
                return;
            }

            let offset = parseInt(widget.dataset.offset) || 0;
            const baseDate = new Date('<?php echo $base_date; ?>');
            const baseNumber = <?php echo $base_number; ?>;
            const baseGlyph = <?php echo $base_glyph; ?>;

            // Sélecteurs pour les shortcodes
            const glyphElements = document.querySelectorAll('.tzolkin-glyphe');
            const numberElements = document.querySelectorAll('.tzolkin-chiffre');
            const trecenaElements = document.querySelectorAll('.tzolkin-trecena');

            function updateWidget(newOffset) {
                console.log('Tzolk\'in Widget: updateWidget called with offset', newOffset);
                
                $.post('<?php echo admin_url('admin-ajax.php'); ?>', {
                    action: 'tzolkin_update',
                    offset: newOffset
                }, function(response) {
                    console.log('Tzolk\'in Widget: AJAX response', response);
                    if (response.success && response.data) {
                        // Mettre à jour le widget
                        widget.innerHTML = response.data.widget;
                        widget.dataset.offset = newOffset;

                        // Mettre à jour les shortcodes
                        glyphElements.forEach((el, index) => {
                            if (response.data.glyph_html) {
                                el.innerHTML = response.data.glyph_html;
                                console.log('Tzolk\'in Widget: Updated glyph shortcode', index);
                            }
                        });
                        numberElements.forEach((el, index) => {
                            if (response.data.number_html) {
                                el.innerHTML = response.data.number_html;
                                console.log('Tzolk\'in Widget: Updated number shortcode', index);
                            }
                        });
                        trecenaElements.forEach((el, index) => {
                            if (response.data.trecena_html) {
                                el.innerHTML = response.data.trecena_html;
                                console.log('Tzolk\'in Widget: Updated trecena shortcode', index);
                            }
                        });

                        // Réinitialiser les écouteurs d'événements
                        const newPrevButton = widget.querySelector('.tzolkin-nav-prev');
                        const newNextButton = widget.querySelector('.tzolkin-nav-next');
                        const newResetButton = widget.querySelector('.tzolkin-widget-reset');
                        const newDateInput = widget.querySelector('.tzolkin-date-input');
                        const newGregorianSpan = widget.querySelector('.tzolkin-gregorian');
                        const newSquare = widget.querySelector('.tzolkin-square');
                        const newTitleSpan = widget.querySelector('.tzolkin-title-span');

                        if (!newPrevButton || !newNextButton || !newResetButton || !newDateInput || !newGregorianSpan || !newSquare || !newTitleSpan) {
                            console.error('Tzolk\'in Widget: One or more elements not found after update');
                            return;
                        }

                        // Gestionnaires de survol
                        let currentNamesStr = newTitleSpan.dataset.names || '';
                        console.log('Tzolk\'in Widget: Names string set to', currentNamesStr);
                        function handleMouseEnter() {
                            console.log('Tzolk\'in Widget: Mouseenter on square, displaying:', currentNamesStr);
                            if (currentNamesStr) {
                                newTitleSpan.textContent = currentNamesStr;
                            }
                        }
                        function handleMouseLeave() {
                            const defaultTitle = newTitleSpan.getAttribute('data-title') || 'Tzolk’in';
                            console.log('Tzolk\'in Widget: Mouseleave on square, restoring:', defaultTitle);
                            newTitleSpan.textContent = defaultTitle;
                        }
                        newSquare.addEventListener('mouseenter', handleMouseEnter);
                        newSquare.addEventListener('mouseleave', handleMouseLeave);

                        newPrevButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Tzolk\'in Widget: Previous button clicked, current offset', offset);
                            offset--;
                            updateWidget(offset);
                        });

                        newNextButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Tzolk\'in Widget: Next button clicked, current offset', offset);
                            offset++;
                            updateWidget(offset);
                        });

                        newResetButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Tzolk\'in Widget: Reset button clicked, current offset', offset);
                            offset = 0;
                            updateWidget(offset);
                        });

                       newGregorianSpan.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Tzolk\'in Widget: Gregorian span clicked');
    newGregorianSpan.style.display = 'none';
    newDateInput.style.display = 'inline-block';
    newDateInput.value = ''; // Vide l'input au clic
    mask.updateValue(); // Réinitialise le masque pour afficher __/__/____
    newDateInput.focus();
});

// Applique le masque avec IMask.js
const mask = IMask(newDateInput, {
    mask: '00/00/0000',
    placeholderChar: '_',
    lazy: false // Affiche le masque même vide
});

newDateInput.addEventListener('blur', function(e) {
    console.log('Tzolk\'in Widget: Date input blurred');
    newDateInput.style.display = 'none';
    newGregorianSpan.style.display = 'inline-block';
});

newDateInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        console.log('Tzolk\'in Widget: Date input enter pressed', newDateInput.value);
        const dateValue = newDateInput.value;
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (dateRegex.test(dateValue)) {
            const [, day, month, year] = dateValue.match(dateRegex);
            const inputDate = new Date(`${year}-${month}-${day}`);
            if (isNaN(inputDate.getTime())) {
                console.error('Tzolk\'in Widget: Invalid date', dateValue);
                alert('Date invalide. Veuillez entrer une date valide (jj/mm/aaaa).');
                return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffTime = inputDate - today;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            offset = diffDays;
            console.log('Tzolk\'in Widget: Updating offset to', offset);
            updateWidget(offset); // Met à jour le widget avec la nouvelle date
        } else {
            console.error('Tzolk\'in Widget: Invalid date format', dateValue);
            alert('Format de date incorrect. Utilisez jj/mm/aaaa.');
        }
        newDateInput.style.display = 'none';
        newGregorianSpan.style.display = 'inline-block';
    }
});
                    } else {
                        console.error('Tzolk\'in Widget: AJAX response invalid', response);
                    }
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.error('Tzolk\'in Widget: AJAX request failed', textStatus, errorThrown);
                    alert('Erreur de connexion au serveur. Veuillez réessayer.');
                });
            }

            // Initialisation
            updateWidget(offset);
            console.log('Tzolk\'in Widget: Event listeners set up');
        });
    })(jQuery);
    </script>
    <?php
});

// Enregistrement explicite des shortcodes
add_action('init', function() {
    add_shortcode('tzolkin_glyphes', 'tzolkin_glyphes_shortcode');
    add_shortcode('tzolkin_chiffres', 'tzolkin_chiffres_shortcode');
    add_shortcode('tzolkin_trecenas', 'tzolkin_trecenas_shortcode');
});
?>