<?php
/*
 * Tzolk'in Details
 * Description: Gère les textes détaillés pour les vues détaillées des glyphes, chiffres, trécénas.
 * Author: Alexandre Mathieu Motokiyo Ferran
 * Version: 1.0
 */
error_log("Tzolk'in: Loading tzolkin-details.php");

// Endpoint autonome pour les détails
if (isset($_GET['action']) && $_GET['action'] === 'tzolkin_details') {
    header('Content-Type: application/json');
    $type = $_GET['type'] ?? 'glyph';
    $id = intval($_GET['id'] ?? 1);
    
    function tzolkin_details_endpoint($request) {
        $details = [
            'glyphs' => [
                1 => [
                    'titre' => 'Imix, le Crocodile',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D01-Imix.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont extrêmement gentilles, aimantes, compréhensives et silencieuses - à condition qu’elles ne développent pas de vices, particulièrement l’alcool, car cette substance intoxicante affaiblit et dérange leur Nawal.</p>
                        <p>Elles perdent patience après une longue période de pression. Elles apprendront à contrôler leurs émotions lorsqu’elles s’immergeront pleinement dans les processus naturels, vivant en communion avec la nature et leur communauté, à l’écart des duretés du monde matériel.</p>
                        <p>L’Imox est hypersensible aux énergies, à la mort et à la souffrance d’autrui, au point de pouvoir perdre sa propre force et tomber malade en voulant aider excessivement.</p>
                        <p>C’est une excellente guérisseuse par le toucher, dotée de dons divins pour aider les personnes souffrant de psychoses, de troubles mentaux, d’alcoolisme ou de toxicomanie.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Imix</li>
                            <li>Chuen</li>
                            <li>Cib</li>
                            <li>Cimi</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>La fidélité reste un aspect sur lequel elles doivent continuer à travailler. Cela n’empêche pas leur capacité à s’engager dans des relations durables. Le mariage est une décision qu’elles considèrent avec prudence, car l’engagement formel (mariage légal) leur paraît complexe et peut leur donner une sensation d’emprisonnement.</p>'
                    ],
                2 => [
                    'titre' => 'Ik, le Vent',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D02-Ik.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>La personne née sous ce Nawal est d’une grande volatilité, avec un esprit qui passe constamment du macrocosme au microcosme. Profondément introspective, elle sait aussi se révéler une excellente interlocutrice.</p>
                        <p>D’une curiosité insatiable, cette qualité peut parfois la détourner de sa voie initiale. Loquace, spontanée et audacieuse, elle devient inflexible une fois sa décision prise.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Ik</li>
                            <li>Eb</li>
                            <li>Caban</li>
                            <li>Manik</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>Elle peut rester paralysée par la peur de la nouveauté, s’enlisant dans des relations prolongées mais sans avenir. Pourtant, sa nature fidèle et aimante lui permet d’attendre patiemment que la personne qui l’intéresse lui accorde son attention.</p>
                        <h4>En Amitié</h4>
                        <p>Fidèle, solidaire et dévouée. Toujours présente dans les moments difficiles, serviable et dotée d’un grand talent de conversation.</p>
                        <h4>Nawals d’Amitié</h4>
                        <ul>
                            <li>Ik</li>
                            <li>Ix</li>
                            <li>Etznab</li>
                            <li>Cimi</li>
                            <li>Oc</li>
                        </ul>
                        <h4>Leur Guide</h4>
                        <p>Leur animal guide est le <strong>COLIBRI</strong> et les <strong>ARCS-EN-CIEL</strong>. Elle recharge son énergie au contact de la nature, entourée d’arbres et des parfums floraux comme les roses et autres fragrances délicates.</p>
                        <p>Les dons que lui a offerts le grand Ahaw incluent :</p>
                        <ul>
                            <li>Un esprit et des mains habiles pour cultiver fleurs, plantes alimentaires et médicinales</li>
                            <li>Un grand cœur et des mains délicates capables de faire croître tout ce qu’elle entreprend</li>
                            <li>Une profonde connexion avec la terre et l’eau</li>
                        </ul>
                        <p>C’est dans le contact avec les éléments - en pétrissant, façonnant et créant - que son esprit trouve le repos. Observer la naissance et la transformation de la terre à travers les plantes la nourrit essentiellement.</p>
                        <p>Leurs dons : Main verte exceptionnelle (fleurs, plantes médicinales), créativité manuelle, connexion profonde à la terre et l’eau.</p>'
                    ],
                3 => [
                    'titre' => 'Akbal, la Nuit',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D03-Akbal.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les natives de ce Nawal sont des êtres solitaires, méfiantes, énigmatiques et passionnées, dont l’esprit foisonne de questions et de réponses immédiates. Elles ne croient que ce qui est vérifiable - par l’étude, l’expérience empirique ou les sensations corporelles.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Akbal</li>
                            <li>Ben</li>
                            <li>Etznab</li>
                            <li>Lamat</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Amoureuses passionnées et sexuellement actives. Bien que portées à l’infidélité, elles peuvent s’engager dans des relations durables.</p>
                        <h4>En tant qu’Amie</h4>
                        <p>Elles établissent rarement des amitiés prolongées. Quand c’est le cas, elles maintiennent ces relations à distance - avec affection, mais à distance.</p>
                        <h4>Nawals d’Amitié</h4>
                        <ul>
                            <li>Akbal</li>
                            <li>Chuen</li>
                            <li>Men</li>
                            <li>Cauac</li>
                            <li>Manik</li>
                        </ul>
                        <h4>Leur Guide</h4>
                        <p>Leur animal totem est la <strong>CHAUVE-SOURIS</strong>, qui leur enseigne :</p>
                        <ul>
                            <li>L’art de l’isolement contemplatif</li>
                            <li>L’observation du soleil depuis l’ombre</li>
                            <li>La dialectique des contraires (toute chose ayant deux faces également valides)</li>
                        </ul>
                        <p>Leurs défis initiatiques :</p>
                        <ul>
                            <li>Apprendre à s’exposer à la lumière</li>
                            <li>Cultiver une vision positive de l’existence</li>
                            <li>Transformer leur sensibilité en force vitale</li>
                        </ul>
                        <p>Leur mission sacrée : Diffuser des médecines alternatives (énergétiques, méditatives) à travers l’expérience corporelle. Accepter la dualité des choses, se tourner vers la lumière, transformer leur sensibilité en force.</p>
                        <p>Leur médecine pour le monde passe par leur corps (énergétique, méditation, santé).</p>'
                    ],
                4 => [
                    'titre' => 'Kan, le Maïs',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D04-Kan.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont très studieuses, compatissantes et au bon cœur. Elles doivent apprendre à partager, à remercier et à reconnaître la valeur des personnes qui traversent leur vie en laissant des enseignements. Elles doivent accepter avec gratitude quand les choses ne se passent pas comme prévu, avoir foi et patience sans juger ni souhaiter de mal.</p>
                        <p>C’est un Nawal très intrépide et extraverti, toujours en quête de ses idéaux et des outils nécessaires pour atteindre ses objectifs. Ce sont des personnes déterminées, mais dans la vie, elles feront face à de nombreuses situations difficiles par manque d’argent, car l’épargne n’est pas leur point fort.</p>
                        <p>Elles doivent apprendre à être organisées avec leurs finances. De plus, il est important qu’elles ne laissent pas leurs affaires chez les autres.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Kan</li>
                            <li>Ix</li>
                            <li>Caban</li>
                            <li>Muluc</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Aimante, attentionnée, fidèle, mais aussi possessive, jalouse, manipulatrice, directe et colérique.</p>
                        <p>Dans leur destin, il leur sera difficile de trouver un partenaire solide et stable avec qui fonder une famille ; cependant, elles peuvent y parvenir à un âge avancé.</p>
                        <h4>En tant qu’Amies</h4>
                        <p>Opportuniste, attachante, colérique. Amusante, directe, bonne auditrice.</p>
                        <h4>Nawals d’Amitié</h4>
                        <ul>
                            <li>Kan</li>
                            <li>Eb</li>
                            <li>Etznab</li>
                            <li>Ahau</li>
                            <li>Lamat</li>
                        </ul>
                        <h4>Leur Guide</h4>
                        <p>Leur animal guide est l’<strong>ARAIGNÉE</strong>, avec sa toile comme élément de pouvoir.</p>
                        <p>Dans leur vie, elles apprendront que souvent les choses ne se passeront pas comme prévu ; cependant, cela représente une opportunité pour emprunter de nouveaux chemins. Elles auront une vie pleine de changements, ainsi que de nombreuses relations amoureuses qui leur laisseront des enseignements solides pour leur évolution spirituelle.</p>
                        <p>Leurs mains sont des outils puissants pour guérir. Elles doivent éviter toute pratique de mysticisme, d’ésotérisme ou de magies noires, car sinon, elles pourraient sombrer dans des abîmes d’obscurité très profonds.</p>'
                    ],
                5 => [
                    'titre' => 'Chicchan, le Serpent',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D05-Chikchan.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont très actives, pleines de force, de mouvement et d’autorité. Leur vie sera marquée par de nombreux changements, particulièrement sur les plans économique et amoureux. Ces personnes sont souvent capricieuses, manipulatrices et enclines au mensonge.</p>
                        <p>Il est dans leur nature de donner, mais seulement après avoir calculé les bénéfices matériels, spirituels ou affectifs qu’elles pourraient en retirer. Elles connaissent chaque pas qu’elles font et les mesurent avec une extrême prudence.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Chicchan</li>
                            <li>Men</li>
                            <li>Ahau</li>
                            <li>Oc</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Elles sont très aimantes, protectrices et font de bonnes mères, bien que ces qualités s’expriment généralement à un âge adulte et mûr.</p>
                        <p>La fidélité est l’une de leurs faiblesses ; cependant, cela n’affecte pas l’engagement qu’elles peuvent prendre envers une personne. Passionnées, elles peuvent s’engager durablement à condition que tous leurs besoins soient satisfaits.</p>
                        <p>Sexuellement, elles sont extrêmement actives.</p>
                        <h4>En tant qu’Amies</h4>
                        <p>Elles ont peu d’amies, car étant généreuses ou pourvoyeuses, leur entourage les fréquente souvent pour ce qu’elles apportent plutôt que pour ce qu’elles sont.</p>
                        <p>Cet échange est réciproque, car les natives de Chicchan prennent également de leurs amies ce qu’elles peuvent leur apporter. Dès que ces personnes cessent d’être utiles, leur curiosité et leur intérêt s’éteignent.</p>
                        <h4>Nawals d’Amitié</h4>
                        <ul>
                            <li>Ben</li>
                            <li>Cauac</li>
                            <li>Imix</li>
                            <li>Kan</li>
                            <li>Muluc</li>
                        </ul>
                        <h4>Leur Guide</h4>
                        <p>L’animal qui les guide et protège est le <strong>SERPENT</strong>.</p>
                        <p>Dans leur vie, elles affronteront des épreuves difficiles liées à l’amour et aux finances. Avec persévérance et une bonne planification, elles pourront en sortir victorieuses.</p>
                        <p>Il est rare qu’on leur brise le cœur, mais quand cela arrive, ce sont des personnes qui auront du mal à lâcher prise.</p>
                        <p>Leur médecine pour le monde : rendre abondantes celles qui les entourent, sans abuser de cette abondance qu’elles aident à créer.</p>'
                    ],
                6 => [
                    'titre' => 'Cimi, la Mort',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D06-Kimi.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont intelligentes, concentrées, très structurées, perfectionnistes et dotées d’une forte capacité de jugement.</p>
                        <p>Leur vie sera marquée par de grands changements, incluant la perte d’êtres chers et des déménagements fréquents dès leur jeune âge.</p>
                        <p>Elles sont attirées par les arts, la médecine naturelle, ainsi que par l’étude de l’astrologie et de la numérologie. Ce sont d’excellentes compagnes dans les moments difficiles, se distinguant par leur capacité d’écoute et leurs conseils avisés - un trait marquant de leur personnalité. Bien que nobles, elles peuvent se montrer méfiantes.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Cimi</li>
                            <li>Chuen</li>
                            <li>Etznab</li>
                            <li>Imix</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>À condition que leur compagne soit ouverte au mouvement, au changement, aux voyages et à vivre dans différents endroits, tout en soutenant leurs projets, elles seront prêtes à s’engager.</p>
                        <p>Elles peuvent avoir des relations durables, mais doivent surveiller leur caractère et éviter d’agir négativement sous le coup de la colère.</p>
                        <p>Il leur arrive souvent de perdre leur partenaire à un moment de leur vie.</p>
                        <h4>En tant qu’Amies</h4>
                        <p>Elles ont peu d’amies, les choisissant avec grand soin et prudence, car elles ont du mal à mettre des racines en un seul lieu.</p>
                        <p>Elles ressentent que les processus de la vie sont éphémères et changeants ; par conséquent, s’engager profondément avec quelqu’une est difficile pour leur énergie.</p>
                        <h4>Nawals d’Amitié</h4>
                        <ul>
                            <li>Cimi</li>
                            <li>Ix</li>
                            <li>Etznab</li>
                            <li>Ik</li>
                            <li>Oc</li>
                        </ul>
                        <h4>Leur Guide</h4>
                        <p>Leur animal guide est le <strong>HIBOU</strong>, la <strong>CHOUETTE</strong> et particulièrement l’<strong>EFFRAIE</strong>.</p>
                        <p>Dans leur vie, elles affronteront de grandes épreuves, particulièrement liées à la perte d’êtres chers, mais c’est précisément pour cette raison que leur don sera d’enseigner à celles qui restent, la sagesse de la mort.</p>'
                    ],
                7 => [
                    'titre' => 'Manik, le Cerf',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D07-Manik.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont très nobles, aimantes, compréhensives, excellentes auditrices et nerveuses.</p>
                        <p>Parfois, elles agissent de manière viscérale lorsqu’elles sentent qu’elles perdent le contrôle des situations.</p>
                        <p>Elles auront des épreuves dans leur vie pour réaffirmer sans cesse leur humilité, ainsi que leur acceptation des caprices de la vie.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Manik</li>
                            <li>Eb</li>
                            <li>Cauac</li>
                            <li>Ik</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Elles sont affectueuses, enveloppantes et démonstratives, très expressives dans leur tendresse et leur amour.</p>
                        <p>Attentionnées envers leur partenaire, fidèles et dotées d’un cœur noble.</p>
                        <h4>En tant qu’Amies</h4>
                        <p>Elles ont plusieurs amies fidèles, des amitiés durables et de grande qualité.</p>
                        <p>Nobles, tendres et loyales, elles considèrent leurs meilleures amies comme leurs sœurs.</p>
                        <h4>Nawals d’Amitié</h4>
                        <ul>
                            <li>Manik</li>
                            <li>Chuen</li>
                            <li>Men</li>
                            <li>Caban</li>
                            <li>Akbal</li>
                        </ul>
                        <h4>Leur Guide</h4>
                        <p>L’animal qui les guide est le <strong>CERF SACRÉ</strong>, gardien des collines et des autels.</p>'
                    ],
                8 => [
                    'titre' => 'Lamat, l’Étoile',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D08-Lamat.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont nobles, obéissantes, réservées, observatrices, excellentes auditrices, silencieuses et peu loquaces.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Lamat</li>
                            <li>Ben</li>
                            <li>Etznab</li>
                            <li>Akbal</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Elle s’ennuie rapidement et est égoïste avec ses espaces et ses habitudes. Elle est affectueuse, bonne auditrice et conseillère.</p>'
                    ],
                9 => [
                    'titre' => 'Muluc, l’Eau',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D09-Muluk.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont dociles, passives, tranquilles, silencieuses, aimantes et toujours prêtes à aider en quoi que ce soit.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Muluc</li>
                            <li>Ix</li>
                            <li>Caban</li>
                            <li>Kan</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Fidèles et engagées pour la vie si nécessaire, elles ont souvent des enfants tôt ou à l’âge adulte.</p>'
                    ],
                10 => [
                    'titre' => 'Oc, le Chien',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D10-Ok_b.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont fortes, instruites, studieuses, grandes leaders, autoritaires, optimistes et rarement vaincues.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Oc</li>
                            <li>Men</li>
                            <li>Ahau</li>
                            <li>Chicchan</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Elles sont fidèles, jalouses et protectrices envers ce qui leur appartient. Elles veulent s’engager, et leur vie sexuelle est mesurée.</p>'
                    ],
                11 => [
                    'titre' => 'Chuen, le Singe',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D11-Chuwen.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>La personne née sous ce Nawal est persévérante, forte et définie dans ses idéaux. Très orientée vers les arts et l’expression artistique.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Chuen</li>
                            <li>Cib</li>
                            <li>Imix</li>
                            <li>Cimi</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>La fidélité est l’une de ses faiblesses. Cependant, quand elle tombe amoureuse, elle a la capacité de s’ouvrir et de partager depuis la profondeur de son être.</p>'
                    ],
                12 => [
                    'titre' => 'Eb, l’Herbe',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D12-Eb.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>La personne née sous ce Nawal est observatrice, intuitive, planificatrice et bien organisée. Elle est portée à aider et à mettre la main à la pâte là où c’est nécessaire.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Eb</li>
                            <li>Cauac</li>
                            <li>Ik</li>
                            <li>Manik</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Elles sont exigeantes, capricieuses, nobles, fidèles et très enclines aux engagements sérieux et durables.</p>'
                    ],
                13 => [
                    'titre' => 'Ben, le Roseau',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D13-Ben.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont fortes, honnêtes, travailleuses et très dévouées. Cependant, elles sont sujettes aux accidents lorsqu’elles ne sont pas alignées.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Ben</li>
                            <li>Etznab</li>
                            <li>Akbal</li>
                            <li>Lamat</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>Elles peuvent être très envahissantes, possessives et incontrôlables, car elles ont tendance à être passionnées et impulsives.</p>'
                    ],
                14 => [
                    'titre' => 'Ix, le Jaguar',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D14-Ix.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont fortes, habiles, studieuses et très concentrées. Cependant, elles peuvent aussi être distraites, désordonnées et peu réceptives.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Ix</li>
                            <li>Cauac</li>
                            <li>Muluc</li>
                            <li>Muluc</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>En couple, elles sont aimantes, passionnées, attentionnées, soucieuses de leur dualité, surprotectrices et capables de tuer par passion.</p>'
                    ],
                15 => [
                    'titre' => 'Men, l’Aigle',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D15-Men.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont extrêmement généreuses et aimantes, toujours prêtes à aider celles qui le demandent.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Men</li>
                            <li>Ahau</li>
                            <li>Chicchan</li>
                            <li>Oc</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>Passionnées, jalouses, possessives et très enclines à tomber amoureuses. La fidélité n’est pas leur point fort.</p>'
                    ],
                16 => [
                    'titre' => 'Cib, le Vautour',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D16-Kib.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont sincères, réservées, silencieuses et très appréciées lorsqu’elles se trouvent du côté positif de leur Nawal.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Etznab</li>
                            <li>Chuen</li>
                            <li>Imix</li>
                            <li>Cimi</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Elles sont libérales. Si elles se sentent piégées, elles ne restent pas, car elles aiment leur liberté comme de vrais oiseaux.</p>'
                    ],
                17 => [
                    'titre' => 'Caban, la Terre',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D17-Kaban.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont extrêmement studieuses, pleines de vitalité et enthousiastes pour les projets culturels, académiques, récréatifs et visuels.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Cauac</li>
                            <li>Eb</li>
                            <li>Ik</li>
                            <li>Manik</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Contrôlantes, très actives sexuellement, infidèles et possessives, mais prêtes à assumer des engagements de vie comme le mariage ou les enfants.</p>'
                    ],
                18 => [
                    'titre' => 'Etznab, le Couteau d’Obsidienne',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D18-Etznab.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont saines, fortes, courageuses et défendent fermement leurs convictions et leur vérité.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Etznab</li>
                            <li>Ben</li>
                            <li>Akbal</li>
                            <li>Lamat</li>
                            <li>Ik</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>Elles sont aimantes, passionnées, fidèles, mais aussi obsessionnelles, menteuses, destructrices et très contrôlantes.</p>'
                    ],
                19 => [
                    'titre' => 'Cauac, l’Orage',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D19-Kawak.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal sont obéissantes, nobles, compréhensives, excellentes à l’écoute et, lorsqu’elles sont en équilibre, douées pour la parole écrite et orale.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Cauac</li>
                            <li>Ix</li>
                            <li>Kan</li>
                            <li>Muluc</li>
                        </ul>
                        <h4>En tant que Partenaire</h4>
                        <p>Passionnelles, possessives et très jalouses, mais aussi soumises et évasives. Elles doivent apprendre à aimer avec liberté.</p>'
                    ],
                20 => [
                    'titre' => 'Ahau, le Soleil',
                    'image' => './assets/glyphs/MAYA-g-log-cal-D20-Ajaw.svg',
                    'detailed_description' => '
                        <h4>En tant que Personne</h4>
                        <p>Les personnes nées sous ce Nawal possèdent une grande capacité à anticiper l’avenir et à percevoir les intentions d’autrui. Méfiantes de nature, elles bénéficient d’une intuition particulièrement aiguisée.</p>
                        <h4>Nawals d’Amour</h4>
                        <ul>
                            <li>Ahau</li>
                            <li>Men</li>
                            <li>Chicchan</li>
                            <li>Oc</li>
                        </ul>
                        <h4>En Couple</h4>
                        <p>Amoureuses, passionnées et dévouées. Elles sont capables de s’engager dans des relations à long terme impliquant mariage, enfants, acquisitions immobilières.</p>'
                ]
            ],
            'numbers' => [
                1 => [
                    'titre' => 'Jun, l’Être du Commencement',
                    'image' => './assets/numbers/Maya_1.svg',
                    'detailed_description' => '
                        <p>L’Être du Jun dit : « Dans mon être, je montre que tout l’univers a un commencement. J’enseigne l’action de la vie : tu dois le faire, démarrer d’une manière ou d’une autre pour créer la force d’action. Je donne la force, je donne la patience, la compréhension des temps. »</p>'
                ],
                2 => [
                    'titre' => 'Ca’, l’Être de l’Équilibre',
                    'image' => './assets/numbers/Maya_2.svg',
                    'detailed_description' => '
                        <p>L’Être du Ca’ dit : « Je suis en haut et je suis en bas. Je vois depuis le lointain et l’ample, mais aussi depuis le détail. Je le vis, je le sens dans les micro-espaces qui forment l’être. »</p>'
                ],
                3 => [
                    'titre' => 'Ox, l’Être de la Force Indomptable',
                    'image' => './assets/numbers/Maya_3.svg',
                    'detailed_description' => '
                        <p>L’Être du Ox dit : « Je suis le nawal qui révèle la force irréductible de la nature : frontale, puissante, déterminée. Je ne tolère pas un refus, trouvant toujours le moyen de m’affirmer avec ardeur. »</p>'
                ],
                4 => [
                    'titre' => 'Kan, l’Être de la Stabilité',
                    'image' => './assets/numbers/Maya_4.svg',
                    'detailed_description' => '
                        <p>L’Être du Kan dit : « Je t’apporte la stabilité, la durabilité, la dureté et la concentration. Tout ce dont tu as besoin pour voir en prenant ton souffle, je peux te le montrer. »</p>'
                ],
                5 => [
                    'titre' => 'Ho’, l’Être de l’Unité',
                    'image' => './assets/numbers/Maya_5.svg',
                    'detailed_description' => '
                        <p>L’Être du Ho’ dit : « Ma force est unité et mon unité crée la force. Partager est souvent difficile car cela signifie cesser d’être seul et accepter l’existence des autres en moi pour un bien ou objectif commun. »</p>'
                ],
                6 => [
                    'titre' => 'Wak, l’Être de l’Intuition',
                    'image' => './assets/numbers/Maya_6.svg',
                    'detailed_description' => '
                        <p>L’Être du Wak dit : « Fort, intuitif, prudent, mon monde est plein de mystères et de mysticisme. Si le monde me dit que je ne peux pas y aller, si je sens un défi intérieur à relever, j’y suis. »</p>'
                ],
                7 => [
                    'titre' => 'Uk, l’Être de l’Infini',
                    'image' => './assets/numbers/Maya_7.svg',
                    'detailed_description' => '
                        <p>L’Être du Uk dit : « Dans ma vision, rien n’est suffisant, rien n’est limitant. Tout est un monde fertile et vaste, un espace pour naître et mourir. Sans limites. Mon plus grand don est de voir et de démêler les illusions de l’esprit humain. »</p>'
                ],
                8 => [
                    'titre' => 'Waxak, l’Être de l’Éternité',
                    'image' => './assets/numbers/Maya_8.svg',
                    'detailed_description' => '
                        <p>L’Être du Waxak dit : « Je suis le profond, ce qui est le plus enraciné dans le comportement humain : ce qui voyage à travers des vies et des vies, car ma vie ne s’arrête pas. Ma vie ne se termine pas, elle est infinie. »</p>'
                ],
                9 => [
                    'titre' => 'Bolon, l’Être de l’Ancrage',
                    'image' => './assets/numbers/Maya_9.svg',
                    'detailed_description' => '
                        <p>L’Être du Bolon dit : « Dans mon énergie mère, je prends garde à ne pas entrer dans les états superflus de l’esprit. Je cherche toujours un ancrage dans cette réalité, car j’y suis. Je dois apprendre de cette réalité, pas l’éviter. »</p>'
                ],
                10 => [
                    'titre' => 'Lahun, l’Être de la Plénitude',
                    'image' => './assets/numbers/Maya_10.svg',
                    'detailed_description' => '
                        <p>L’Être du Lahun dit : « Ma force presse l’esprit, m’élevant vers une réflexion sur les besoins que je juge indispensables ou que l’on m’a enseignés comme tels pour atteindre la perfection. »</p>'
                ],
                11 => [
                    'titre' => 'Buluc, l’Être de la Puissance',
                    'image' => './assets/numbers/Maya_11.svg',
                    'detailed_description' => '
                        <p>L’Être du Buluc dit : « Je, fort et puissant. Pour moi, ce n’est pas une fantaisie ; dans ma perception de l’univers, ma force est infinie. Je peux tout contrôler, tout créer et tout détruire. »</p>'
                ],
                12 => [
                    'titre' => 'Lahca, l’Être des Précisions',
                    'image' => './assets/numbers/Maya_12.svg',
                    'detailed_description' => '
                        <p>L’Être du Lahca dit : « Je viens vous enseigner les décisions difficiles, qui ne semblent compliquées qu’à cause de l’éducation sociale et morale reçue. Si je guide par le cœur, mes actions n’auront pas de poids. »</p>'
                ],
                13 => [
                    'titre' => 'Oxlahun, l’Être de la Sagesse',
                    'image' => './assets/numbers/Maya_13.svg',
                    'detailed_description' => '
                        <p>L’Être du Oxlahun dit : « Je connais le chemin. Je sais jusqu’où je peux aller, mais aussi où je dois m’arrêter pour observer, me taire et poursuivre. Nombreuses sont les vérités qui s’ouvrent à mes yeux. »</p>'
                ],
                'trecenas' => []
            ]
        ];
            return $details;
        }
        
        // Fonction pour récupérer les détails
        function get_tzolkin_details($type, $id) {
            $details = tzolkin_details_endpoint(null);
            return $details[$type][$id] ?? null;
        }
        
        $details = get_tzolkin_details($type, $id);
        if ($details) {
            echo json_encode(['success' => true, 'data' => $details]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Détails non trouvés']);
        }
        exit;
    }
