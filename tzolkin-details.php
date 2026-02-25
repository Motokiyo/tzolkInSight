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
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D03-Akbal.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les natives de ce Nawal sont des êtres solitaires, méfiantes, énigmatiques et passionnées, dont l’esprit foisonne de questions et de réponses immédiates. Elles ne croient que ce qui est vérifiable - par l’étude, l’expérience empirique ou les sensations corporelles. Leur besoin constant d’avoir raison tend à éloigner leur entourage.</p>
                    <p>Elles éprouvent une grande difficulté à écouter les opinions divergentes de leurs convictions. Ce en quoi elles croient devient une loi intangible.</p>
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
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D04-Kan.svg',
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
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D05-Chikchan.svg',
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
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D06-Kimi.svg',
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
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D07-Manik.svg',
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
                    <p>L’animal qui les guide est le <strong>CERF SACRÉ</strong>, gardien des collines et des autels.</p>
                    <p>Dans leur vie, elles recherchent le dynamisme de l’existence et l’acceptation de leurs proches concernant leurs décisions. Elles seront très respectées à l’âge adulte pour les réussites obtenues en osant tenter des choses durant leur jeunesse.</p>
                    <p>Leur médecine pour le monde est le calme, la patience, la tempérance, l’acceptation, la persévérance, mais surtout l’humilité.</p>
                    <p>Ses qualités sont la force, la guidance et la connexion avec le sacré.</p>'
            ],
            8 => [
                'titre' => 'Lamat, l’Etoile',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D08-Lamat.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont nobles, obéissantes, réservées, observatrices, excellentes auditrices, silencieuses et peu loquaces.</p>
                    <p>Elles devront apprendre à suivre les signes de leur cœur et de leur intuition. Leurs sens sont très affûtés, ce qui leur donne la capacité de percevoir le danger, la peur et les signaux d’alerte de la vie elle-même.</p>
                    <p>Avec le temps, elles comprendront que se cacher ou fuir les problèmes n’est pas une solution, particulièrement dans les situations difficiles.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Lamat</li>
                        <li>Ben</li>
                        <li>Etznab</li>
                        <li>Akbal</li>
                    </ul>
                    <h4>En tant que Partenaire</h4>
                    <p>Elle s’ennuie rapidement et est égoïste avec ses espaces et ses habitudes.</p>
                    <p>Elle est affectueuse, bonne auditrice et conseillère, et exprime toujours ce qu’elle ressent. Elle peut s’engager dans des relations à long terme.</p>
                    <p>Sexuellement, elle est très active.</p>
                    <p>Dans sa vie, elle recherche l’aventure, suit son cœur et son envie de changer aussi souvent que nécessaire quand elle perd l’intérêt. Elle fuira de nombreuses situations où elle sent qu’elle perd le contrôle d’elle-même.</p>
                    <p>Sa faim spirituelle la conduira sur des chemins profonds et authentiques.</p>
                    <h4>En tant qu’Amies</h4>
                    <p>Elle a peu d’amies mais elles sont fidèles et durables.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Lamat</li>
                        <li>Eb</li>
                        <li>Etznab</li>
                        <li>Ahau</li>
                        <li>Kan</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>L’animal qui les guide est le <strong>LAPIN</strong>, symbolisant l’abondance, la maturation et le chemin de vie. Dans la tradition yucatèque, Lamat, associé au lapin et à la planète Vénus, incarne la fertilité et la capacité de manifester instantanément ses désirs (Pouvoir de création rapide par la focalisation de l’intention). Les personnes nées sous ce signe portent une énergie de chance pure, où ce sur quoi elles se concentrent se multiplie, tel un champ fertile prêt à donner une récolte abondante. Le lapin, dans le Tzolk’in, est un nagual de régénération, guidant vers un équilibre entre donner et recevoir pour éviter l’épuisement. Elles doivent apprendre à diriger leur amour et leur attention vers des intentions positives, car, comme Vénus qui brille dans l’obscurité et la lumière, leur éclat peut illuminer leur chemin de vie ou les perdre si elles se laissent submerger par la peur ou l’excès.</p>'
            ],
            9 => [
                'titre' => 'Muluc, l’Eau',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D09-Muluk.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont dociles, passives, tranquilles, silencieuses, aimantes et toujours prêtes à aider en quoi que ce soit.</p>
                    <p>Leur vie sera marquée par de grandes épreuves visant à préserver leur harmonie et leur individualité.</p>
                    <p>Elles doivent suivre ce qui les remplit de vie. Elles sont naturellement attirées par les arts comme la musique, la danse et l’écriture.</p>
                    <p>Elles affronteront des épreuves spirituelles liées à leur corps physique, car elles sont nées pour servir l’humanité à travers un engagement social. Si elles négligent cette vocation, elles pourraient souffrir de maladies et de pertes matérielles.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Muluc</li>
                        <li>Ix</li>
                        <li>Caban</li>
                        <li>Kan</li>
                    </ul>
                    <h4>En tant que Partenaire</h4>
                    <p>Fidèles et engagées pour la vie si nécessaire, elles ont souvent des enfants tôt ou à l’âge adulte.</p>
                    <p>Elles doivent veiller à ne pas perdre leur autorité au sein du couple, car cela les rendrait soumises et incapables de prendre des décisions.</p>
                    <h4>En tant qu’Amies</h4>
                    <p>Nobles, loyales et attentionnées, elles ont peu d’amitiés mais celles-ci sont durables.</p>
                    <p>Elles sont respectées dans leur communauté.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Muluc</li>
                        <li>Ben</li>
                        <li>Cauac</li>
                        <li>Imix</li>
                        <li>Kan</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Leurs gardiennes sont les <strong>PIERRES</strong> et le <strong>FEU</strong> lui-même.</p>
                    <p>Dans leur vie, elles recherchent le calme et le confort, des choses stables. Elles n’aiment pas les changements radicaux ni les situations stressantes, car elles tombent rapidement malades.</p>
                    <p>Elles sont silencieuses et très mesurées dans leurs paroles lorsqu’elles partagent.</p>'
            ],
            10 => [
                'titre' => 'Oc, le Chien',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D10-Ok_b.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont fortes, instruites, studieuses, grandes leaders, autoritaires, optimistes et rarement vaincues. Elles ont un caractère déterminé.</p>
                    <p>Leur santé est généralement stable, à moins qu’elles ne se laissent submerger par un excès de responsabilités et de travail.</p>
                    <p>Dans leur vie, elles auront des épreuves où leur fidélité et leur honnêteté seront constamment mises à l’épreuve, et ces qualités seront la clé de leur succès.</p>
                    <p>Ce Nawal représente l’autorité et la rectitude ; par conséquent, celles qui naissent sous son énergie doivent protéger cette sagesse avant tout.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Oc</li>
                        <li>Men</li>
                        <li>Ahau</li>
                        <li>Chicchan</li>
                    </ul>
                    <h4>En tant que Partenaire</h4>
                    <p>Elles sont fidèles, jalouses et protectrices envers ce qui leur appartient.</p>
                    <p>Elles veulent s’engager, et leur vie sexuelle est mesurée et bien consciente dans la plupart des cas.</p>
                    <p>Elles cherchent une famille et la stabilité.</p>
                    <h4>En tant qu’Amies</h4>
                    <p>Elles sont fidèles, aidantes, supportrices et très patientes.</p>
                    <p>Pour elles, la fidélité et la parole franche sont primordiales.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Oc</li>
                        <li>Ix</li>
                        <li>Etznab</li>
                        <li>Cimi</li>
                        <li>Ik</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Leur animal guide est le <strong>CHIEN</strong>, gardien des trésors de son maître.</p>
                    <p>Pour cette raison, elles sont de bonnes travailleuses et collaboratrices, à condition que leur présence soit respectée ; sinon, elles se sentent rejetées et découragées.</p>
                    <p>Elles doivent maintenir leur corps physique toujours exercé et manger sainement pour préserver leur concentration et leur détermination dans leurs actions. S’éloigner de l’alcool est primordial pour les positions de pouvoir qu’elles pourraient occuper.</p>
                    <p>La médecine qu’elles apportent au monde est la justice, l’honnêteté et l’ordre. Elles doivent apprendre le discernement pour pouvoir être de bonnes leaders.</p>'
            ],
            11 => [
                'titre' => 'Chuen, le Singe',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D11-Chuwen.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>La personne née sous ce Nawal est persévérante, forte et définie dans ses idéaux. Très orientée vers les arts et l’expression artistique.</p>
                    <p>Affectueuse, talentueuse, amusante et extrêmement farceuse. Dès son plus jeune âge, elle aura des expériences sexuelles qui marqueront sa vie.</p>
                    <p>Elle aura une facilité à évoluer dans les mondes nocturnes, à socialiser et à trouver une partenaire.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Chuen</li>
                        <li>Cib</li>
                        <li>Imix</li>
                        <li>Cimi</li>
                    </ul>
                    <h4>En Couple</h4>
                    <p>La fidélité est l’une de ses faiblesses. Cependant, quand elle tombe amoureuse – ce qui arrive dans 1 relation sur 10 – elle a la capacité de s’ouvrir et de partager depuis la profondeur de son être. Elle doit avoir confiance en ses capacités et oser parier sur elle-même. Il est important qu’elle se fasse des promesses de confiance et qu’elle ose investir dans ses projets personnels, lesquels lui apporteront de grandes leçons.</p>
                    <p>Dans sa vie, elle pourra avoir beaucoup de confort, mais il lui sera difficile d’atteindre de grandes richesses. Il y a des exceptions, cependant, son attention énergétique maximale est basée sur la création, l’expression et l’art. Elle a tendance à se disperser avant de poursuivre les grandes richesses matérielles, se concentrant sur ce qui fait battre son cœur.</p>
                    <h4>En Amitié</h4>
                    <p>Elle est loyale, solidaire et généreuse.</p>
                    <p>Cependant, elle est très contrôlante et rancunière quand on lui cache des choses, allant jusqu’à retirer définitivement son amitié.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Chuen</li>
                        <li>Men</li>
                        <li>Cauac</li>
                        <li>Akbal</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>L’animal qui la guide est le <strong>SINGE</strong>.</p>
                    <p>L’action qui la guide est de tisser, d’unir les peuples et les cultures dans leur biodiversité de pensée.</p>
                    <p>Elle doit éviter les plaisirs de la nuit, le sexe incontrôlé et l’autodestruction.</p>
                    <p>Le contrôle de son Kan est sa plus grande tâche.</p>'
            ],
            12 => [
                'titre' => 'Eb, l’Herbe',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D12-Eb.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>La personne née sous ce Nawal est observatrice, intuitive, planificatrice et bien organisée. Elle est portée à aider et à mettre la main à la pâte là où c’est nécessaire, se concentrant sur le service et sur la manière de rendre la vie plus douce pour l’humanité. Amoureuse de la nature, du silence, des verts, des eaux perdues et des paysages naturels cachés au cœur des forêts et des jungles. Ce sont des personnes qui souhaitent ouvrir leur cœur ; cependant, elles ont du mal à accorder leur confiance, car leur côté spirituel est très fort et elles ressentent un engagement envers la conscience avant celui envers l’humain.</p>
                    <p>Dans le domaine sexuel, elles sont très investies et aiment se partager. Cependant, elles tracent une ligne très nette entre l’engagement et le divertissement.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Eb</li>
                        <li>Cauac</li>
                        <li>Ik</li>
                        <li>Manik</li>
                    </ul>
                    <h4>En tant que Partenaire</h4>
                    <p>Elles sont exigeantes, capricieuses, nobles, fidèles et très enclines aux engagements sérieux et durables.</p>
                    <p>Elles doivent apprendre à garder les pieds bien ancrés dans la réalité et à observer profondément leur situation avant d’agir. Sortir des cycles de violence familiale, éviter les relations personnelles où elles perdent leur voix et leur autorité. Savoir quand mettre fin aux relations qui les épuisent, en plaçant leurs besoins et leur cœur avant ceux des autres.</p>
                    <h4>En tant qu’Amies</h4>
                    <p>Elles sont extrêmement loyales, engagées, bonnes écouteuses, conseillères, complices et très honnêtes dans leurs ressentis.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Etznab</li>
                        <li>Ahau</li>
                        <li>Kan</li>
                        <li>Lamat</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>L’animal qui la guide est le <strong>CHAT SAUVAGE</strong>. Le chat sauvage est un symbole maya d’indépendance et de protection psychique.</p>
                    <p>Éviter de s’engager dans des relations à long terme si son cœur est incertain, car cela influencera profondément son cheminement. C’est un Nawal qui atteint la reconnaissance à l’âge mûr.</p>
                    <p>Elle a la capacité de couper - un pouvoir chamanique de purification énergétique - très facilement, uniquement par la pensée, toutes les énergies négatives qui l’assaillent.</p>'
            ],
            13 => [
                'titre' => 'Ben, le Roseau',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D13-Ben.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont fortes, honnêtes, travailleuses et très dévouées. Cependant, elles sont sujettes aux accidents lorsqu’elles ne sont pas alignées avec leur but dans la vie : fractures osseuses, ligaments rompus ou perte de vision.</p>
                    <p>Elles tombent facilement amoureuses et ont constamment envie de fonder une famille avec la personne qu’elles aiment. De tempérament fort et parfois violent, elles recherchent le leadership dans les groupes. Elles peuvent se sentir profondément blessées si elles ne sont pas écoutées.</p>
                    <p>Leur noblesse à aider peut se transformer en orgueil lorsqu’elles se sentent jugées. Elles doivent donc travailler leur relation avec l’autorité tout au long de leur vie.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Ben</li>
                        <li>Etznab</li>
                        <li>Akbal</li>
                        <li>Lamat</li>
                    </ul>
                    <h4>En Couple</h4>
                    <p>Elles peuvent être très envahissantes, possessives et incontrôlables, car elles ont tendance à être passionnées et impulsives. Cependant, si elles parviennent à canaliser leur cœur, elles peuvent devenir des mères exceptionnelles, soucieuses de l’intégrité de leur clan et prêtes à se sacrifier pour le bien-être de toutes.</p>
                    <p>Elles doivent éviter l’usage des plantes de pouvoir, car ce Nawal est très volatil et pourrait facilement leur faire perdre pied avec la réalité.</p>
                    <p>L’un de leurs dons réside dans leur capacité à intégrer et à comprendre les différents points de vue au sein de leur famille ou de leur communauté.</p>
                    <h4>En Amitié</h4>
                    <p>Fidèles, elles aident autant qu’elles le peuvent et partagent volontiers le peu ou le beaucoup qu’elles possèdent.</p>
                    <p>Cependant, leur besoin d’avoir raison peut les éloigner de leurs bonnes amitiés.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Ben</li>
                        <li>Caban</li>
                        <li>Imix</li>
                        <li>Kan</li>
                        <li>Muluc</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Leur animal guide est le <strong>TATOU</strong> ou les <strong>ÉCUREUILS</strong>.</p>
                    <p>Il est essentiel qu’elles recherchent le bien-être commun et la justice sociale comme l’une des missions de leur existence.</p>'
            ],
            14 => [
                'titre' => 'Ix, le Jaguar',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D14-Ix.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont fortes, habiles, studieuses et très concentrées. Cependant, elles peuvent aussi être distraites, désordonnées et peu réceptives.</p>
                    <p>Amoureuses de la nature, elles aiment vivre et découvrir d’autres cultures. Très bavardes et sociables, elles apprécient les activités en plein air, tout comme se reposer chez elles en compagnie de leurs proches.</p>
                    <p>De tempérament fort et parfois autoritaire, elles sont nobles et ont tendance à ne pas garder de rancune.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Ix</li>
                        <li>Cauac</li>
                        <li>Muluc</li>
                        <li>Muluc</li>
                    </ul>
                    <h4>En Couple</h4>
                    <p>En couple, elles sont aimantes, passionnées, attentionnées, soucieuses de leur dualité, surprotectrices et capables de tuer par passion.</p>
                    <p>Ce Nawal est celui des femmes de connaissance, chamanes, guérisseuses et guides spirituelles, grâce à leur connexion avec les mondes dimensionnels et leur proximité avec le Nawal Cimi, le Nawal de la mort.</p>
                    <p>L’un de leurs dons est la connexion avec le monde spirituel à travers les plantes ou les éléments de pouvoir.</p>
                    <h4>En Amitié</h4>
                    <p>En amitié, elles sont honnêtes, fidèles et très fermes dans leurs paroles. Directes, si elles découvrent une trahison, elles s’éloignent immédiatement, coupant la relation sans autre explication.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Ix</li>
                        <li>Etznab</li>
                        <li>Ik</li>
                        <li>Cimi</li>
                        <li>Oc</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Leur animal guide est le <strong>JAGUAR</strong>, astucieux et réfléchi avant chaque action. Ce sont des chamanes.</p>'
            ],
            15 => [
                'titre' => 'Men, l’Aigle',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D15-Men.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont extrêmement généreuses et aimantes, toujours prêtes à aider celles qui le demandent. Elles doivent cependant veiller à modérer leur générosité, car elles peuvent parfois donner jusqu’à se déposséder, se retrouvant alors dans le besoin de ce qu’elles ont offert.</p>
                    <p>Amoureuses de la spiritualité et du mysticisme, elles sont dotées d’une grande intuition et observent attentivement tout ce qui les entoure. De tempérament très aimable, leur côté déséquilibré peut cependant les amener à abuser de la confiance, de la vulnérabilité, de la noblesse, voire même de l’amour ou de la passion que d’autres éprouvent pour elles, dans le but d’en tirer profit.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Men</li>
                        <li>Ahau</li>
                        <li>Chicchan</li>
                        <li>Oc</li>
                    </ul>
                    <h4>En Couple</h4>
                    <p>Passionnées, jalouses, possessives et très enclines à tomber amoureuses. La fidélité n’est pas leur point fort. Cependant, lorsqu’elles tombent véritablement amoureuses, elles peuvent rester fidèles pendant plusieurs années.</p>
                    <h4>En Amitié</h4>
                    <p>Fidèles, honnêtes, sincères, ce sont d’excellentes conseillères.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Men</li>
                        <li>Chuen</li>
                        <li>Cauac</li>
                        <li>Akbal</li>
                        <li>Manik</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Leur animal guide est l’<strong>AIGLE ROYAL</strong> et le <strong>QUETZAL</strong>. L’un de leurs dons est la capacité à prédire l’avenir, à recevoir des visions dans leurs rêves et à comprendre les mécanismes de l’enrichissement matériel.</p>
                    <p>Elles doivent se méfier des affaires qui les exposent à l’énergie du Oc - c’est-à-dire celles impliquant des contrats, des juges et des avocates. Une lecture minutieuse de chaque détail est essentielle pour éviter les complications juridiques.</p>'
            ],
            16 => [
                'titre' => 'Cib, le Vautour',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D16-Kib.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont sincères, réservées, silencieuses et très appréciées lorsqu’elles se trouvent du côté positif de leur Nawal.</p>
                    <p>Dans le cas contraire, elles ont tendance à générer des commérages, à trop parler et à tenter les énergies pour créer des mécontentements.</p>
                    <p>Elles sont obéissantes et aiment étudier, ainsi qu’apprendre constamment de nouvelles choses. Si elles s’orientent vers l’astronomie, l’astrologie, le tarot ou le mysticisme, ces domaines sont leur point fort.</p>
                    <p>Les nombres, l’ordre et les calculs sont des qualités qu’elles doivent développer pour comprendre leur place dans le cosmos.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Etznab</li>
                        <li>Chuen</li>
                        <li>Imix</li>
                        <li>Cimi</li>
                    </ul>
                    <h4>En tant que Partenaire</h4>
                    <p>Elles sont libérales. Si elles se sentent piégées, elles ne restent pas, car elles aiment leur liberté comme de vrais oiseaux.</p>
                    <p>Elles apprécient la solitude et les lieux inhospitaliers.</p>
                    <h4>En tant qu’Amies</h4>
                    <p>Elles sont fidèles et leurs amitiés sont souvent de longue durée.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Etznab</li>
                        <li>Eb</li>
                        <li>Ahau</li>
                        <li>Kan</li>
                        <li>Lamat</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>L’animal qui les guide est le <strong>HIBOU</strong> ou la <strong>CHOUETTE</strong>. Elles ont la capacité de lire facilement les intentions des autres et de prédire des accidents à travers leurs rêves.</p>
                    <p>L’amour peut les mener à la ruine, il est donc nécessaire qu’elles se protègent lors de divorces ou de séparations.</p>
                    <p>L’un des objectifs de leur existence est de protéger les innocentes, d’agir pour la justice et de trouver l’harmonie pour celles qui les entourent, où qu’elles posent le pied.</p>'
            ],
            17 => [
                'titre' => 'Caban, la Terre',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D17-Kaban.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont extrêmement studieuses, pleines de vitalité et enthousiastes pour les projets culturels, académiques, récréatifs et visuels.</p>
                    <p>Elles s’intéressent à tout ce qui, selon elles, génère une avancée dans les capacités humaines, une nouvelle pensée, des idées novatrices et profondes.</p>
                    <p>Elles sont structurées, réservées et préfèrent avoir peu d’amies, mais des relations durables. Elles peuvent aussi être rancunières, passionnées et très attachées.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Cauac</li>
                        <li>Eb</li>
                        <li>Ik</li>
                        <li>Manik</li>
                    </ul>
                    <h4>En tant que Partenaire</h4>
                    <p>Contrôlantes, très actives sexuellement, infidèles et possessives, mais prêtes à assumer des engagements de vie comme le mariage ou les enfants.</p>
                    <p>Elles sont obéissantes bien que rebelles. Il est difficile de gagner leur confiance ; cependant, une fois obtenue, elles deviennent des fidèles défenseures de la vérité.</p>
                    <p>Elles doivent apprendre à gérer l’énergie de l’argent, car sans cela, elles peuvent être prospères un jour et ruinées le lendemain. Elles ont souvent une的产品依赖 envers leur partenaire, une situation qu’elles doivent éviter pour préserver l’équilibre de leur vie et de leur Nawal.</p>
                    <p>L’indépendance financière est primordiale pour leur santé émotionnelle, tout comme le sentiment d’apprendre chaque jour de nouvelles choses.</p>
                    <h4>En tant qu’Amies</h4>
                    <p>Généreuses, partageuses et soucieuses de leurs semblables.</p>
                    <p>Compréhensives, mais elles doivent apprendre à pardonner.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Cauac</li>
                        <li>Ben</li>
                        <li>Imix</li>
                        <li>Chicchan</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>L’animal qui les protège est le <strong>PIC-VERT</strong>.</p>
                    <p>L’un de leurs buts dans la vie est d’enseigner.</p>
                    <p>Elles doivent avoir suffisamment confiance en leurs passions pour les transmettre à leur communauté.</p>'
            ],
            18 => [
                'titre' => 'Etznab, le Couteau d’Obsidienne',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D18-Etznab.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont saines, fortes, courageuses et défendent fermement leurs convictions et leur vérité. Elles sont très studieuses et ouvertes à de nouveaux apprentissages.</p>
                    <p>Elles sont rancunières, attachées et très soucieuses des autres, surtout face aux injustices. Cependant, cela peut leur faire perdre leur objectivité dans les conflits.</p>
                    <p>Ces personnes sont nées pour défendre la justice à un niveau divin et rétablir l’équilibre dans leur communauté. Avant de s’exprimer, elles doivent être parfaitement équilibrées, sinon elles risquent de causer du tort à leur entourage ou à celles qu’elles critiquent. Ce tort pourrait ensuite se retourner contre leur propre santé.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Etznab</li>
                        <li>Ben</li>
                        <li>Akbal</li>
                        <li>Lamat</li>
                        <li>Ik</li>
                    </ul>
                    <h4>En Couple</h4>
                    <p>Elles sont aimantes, passionnées, fidèles, mais aussi obsessionnelles, menteuses, destructrices et très contrôlantes.</p>
                    <p>Ce Nawal a besoin de trouver une partenaire patiente, noble et qui aime écouter. Il est important que leur partenaire n’ait pas de vices comme l’alcool, la drogue, l’excès de plantes de pouvoir ou des pratiques comme les arts martiaux sanglants.</p>
                    <p>Sinon, elles pourraient facilement être entraînées vers des mondes obscurs.</p>
                    <h4>En Amitié</h4>
                    <p>Elles sont méfiantes, car elles ont la capacité de percevoir les multiples facettes de leurs amies. Elles sont toujours en alerte et attentives aux erreurs.</p>
                    <p>Pour cette raison, elles peuvent être très solitaires, ou leurs amies s’éloignent par périodes. Elles doivent apprendre à observer et à se taire.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Etznab</li>
                        <li>Ix</li>
                        <li>Ik</li>
                        <li>Cimi</li>
                        <li>Oc</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Leur animal guide est la <strong>CHOUETTE</strong>, et sa pierre est l’<strong>OBSIDIENNE</strong>.</p>
                    <p>D’un tempérament fort mais très sensible, elles cherchent à comprendre les choses au-delà des apparences.</p>
                    <p>L’un de leurs dons pour l’humanité est d’apprendre à examiner la justice divine avec une loupe de discernement. Leur main et leur esprit sont d’excellents ciseaux pour couper les maladies des personnes, des animaux, des plantes, etc.</p>
                    <p>Cependant, elles doivent cultiver suffisamment d’humilité pour comprendre leur place, qui se trouve derrière la main qui exécute.</p>'
            ],
            19 => [
                'titre' => 'Cauac, l’Orage',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D19-Kawak.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal sont obéissantes, nobles, compréhensives, excellentes à l’écoute et, lorsqu’elles sont en équilibre, douées pour la parole écrite et orale.</p>
                    <p>Ce Nawal incarne l’autorité au sein de la communauté, celle qui unit les forces et harmonise les énergies à travers les engagements pris.</p>
                    <p>Lorsque leurs énergies sont déséquilibrées, elles deviennent évasives, peu communicatives, colériques et rancunières, abandonnant leurs accords.</p>
                    <p>Elles sont nées pour maintenir l’équilibre familial et communautaire, tel un grand utérus qui soutient l’humanité dans son évolution.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Cauac</li>
                        <li>Ix</li>
                        <li>Kan</li>
                        <li>Muluc</li>
                    </ul>
                    <h4>En tant que Partenaire</h4>
                    <p>Passionnelles, possessives et très jalouses, mais aussi soumises et évasives.</p>
                    <p>Elles doivent apprendre à aimer avec liberté, car leur besoin de contrôle peut devenir obsessionnel.</p>
                    <p>Si elles parviennent à équilibrer leurs polarités, elles construiront des relations durables, honnêtes et saines.</p>
                    <h4>En tant qu’Amies</h4>
                    <p>Excellentes auditrices, loyales, directes et dotées d’une parole puissante.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Cauac</li>
                        <li>Chuen</li>
                        <li>Men</li>
                        <li>Akbal</li>
                        <li>Manik</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Animaux totems : <strong>TORTUE</strong>, <strong>BALEINE</strong>, <strong>REQUIN</strong>, <strong>CROCODILE</strong> ou <strong>LÉZARD</strong>.</p>
                    <p>Leur don repose sur la responsabilité et la parole honnête envers autrui.</p>
                    <p>Elles incarnent la maîtrise du silence et de la parole comme outils d’unité.</p>
                    <p><strong>Message clé :</strong> Elle apprendra à s’engager uniquement envers les responsabilités qu’elle peut honorer, à mesure que son cœur mûrit et que sa parole gagne en respect – y compris envers elle-même.</p>'
            ],
            20 => [
                'titre' => 'Ahau, le Soleil',
                'image' => '/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D20-Ajaw.svg',
                'detailed_description' => '
                    <h4>En tant que Personne</h4>
                    <p>Les personnes nées sous ce Nawal possèdent une grande capacité à anticiper l’avenir et à percevoir les intentions d’autrui. Méfiantes de nature, elles bénéficient d’une intuition particulièrement aiguisée.</p>
                    <p>Elles doivent apprendre à maîtriser leur tempérament et comprendre qu’il n’est pas toujours nécessaire d’être en guerre. Lorsqu’elles rencontrent d’autres "soleils" (personnalités dominantes), leurs jugements peuvent s’en trouver affectés, car elles sont orgueilleuses et, à l’image du soleil, aspirent à être vues et entendues avant toute autre chose.</p>
                    <p>Elles aiment être au centre de l’attention, ce qui peut parfois les pousser à provoquer des conflits dans ce but, sans réaliser qu’elles pourraient tout aussi bien attirer les regards en cultivant la paix autour d’elles.</p>
                    <h4>Nawals d’Amour</h4>
                    <ul>
                        <li>Ahau</li>
                        <li>Men</li>
                        <li>Chicchan</li>
                        <li>Oc</li>
                    </ul>
                    <h4>En Couple</h4>
                    <p>Amoureuses, passionnées et dévouées.</p>
                    <p>Elles sont capables de s’engager dans des relations à long terme impliquant mariage, enfants, acquisitions immobilières, etc.</p>
                    <h4>En Amitié</h4>
                    <p>Elles ont peu d’amies, étant donné leur nature critique et la dureté de leurs paroles.</p>
                    <p>Les amitiés qu’elles conservent deviennent aussi solides que des liens fraternels.</p>
                    <h4>Nawals d’Amitié</h4>
                    <ul>
                        <li>Ahau</li>
                        <li>Eb</li>
                        <li>Cib</li>
                        <li>Muluc</li>
                        <li>Lamat</li>
                    </ul>
                    <h4>Leur Guide</h4>
                    <p>Dans ce cas particulier, leur guide n’est pas un animal mais l’<strong>ÊTRE HUMAIN</strong> lui-même et sa conscience, symbolisé par le <strong>PHÉNIX</strong>.</p>
                    <p>Leur mission consiste à apprendre de l’expérience humaine et à rapporter à l’Ahau (la divinité/sagesse supérieure), à travers leur vécu personnel, les actions de cette humanité.</p>
                    <p>Leur don est de partager leurs visions lorsqu’elles peuvent aider quelqu’une à évoluer. Elles doivent le faire avec discernement, en maintenant une distance émotionnelle vis-à-vis des personnes qu’elles souhaitent aider.</p>
                    <p>Elles font d’excellentes masseuses, tarologues et guérisseuses par le feu.</p>'
            ]
        ],
        'numbers' => [
            1 => [
                'titre' => 'Jun, l’Être du Commencement',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_1.svg',
                'detailed_description' => '
                    <p>L’Être du Jun dit : « Dans mon être, je montre que tout l’univers a un commencement. J’enseigne l’action de la vie : tu dois le faire, démarrer d’une manière ou d’une autre pour créer la force d’action. Je donne la force, je donne la patience, la compréhension des temps. J’offre le calme, l’observation, la tempérance, la louange et la réflexion. J’ouvre la porte, j’ouvre le chemin pour créer ce que tu ne vois pas encore. Je t’aide à le voir, à le purifier. »</p>'
            ],
            2 => [
                'titre' => 'Ca’, l’Être de l’Équilibre',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_2.svg',
                'detailed_description' => '
                    <p>L’Être du Ca’ dit : « Je suis en haut et je suis en bas. Je vois depuis le lointain et l’ample, mais aussi depuis le détail. Je le vis, je le sens dans les micro-espaces qui forment l’être. Je trouve tout ce qui crée, mais aussi ce qui détruit. Je connais la force et la faiblesse de la vie, trouvant ainsi mon point mesuré où les deux se connectent et ne font qu’un : le nécessaire pour la vie. »</p>'
            ],
            3 => [
                'titre' => 'Ox, l’Être de la Force Indomptable',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_3.svg',
                'detailed_description' => '
                    <p>L’Être du Ox dit : « Je suis le nawal qui révèle la force irréductible de la nature : frontale, puissante, déterminée. Je ne tolère pas un refus, trouvant toujours le moyen de m’affirmer avec ardeur. Si je ne peux avancer comme une unité, je me divise en fragments délicats jusqu’à réaliser mes objectifs. Je porte en moi la force pour vous guider vers vos aspirations. Je défie le ’non’. Tout est possible, et si la voie principale se ferme, je l’ouvre par les fenêtres ou les plus petits interstices. Ma force s’unit ou se ramifie, mais atteint toujours sa destination et sa vision. »</p>'
            ],
            4 => [
                'titre' => 'Kan, l’Être de la Stabilité',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_4.svg',
                'detailed_description' => '
                    <p>L’Être du Kan dit : « Je t’apporte la stabilité, la durabilité, la dureté et la concentration. Tout ce dont tu as besoin pour voir en prenant ton souffle, je peux te le montrer. Mon point de méditation, réflexion et patience est avec moi. La force des directions de la vie, de la mort et au-delà est avec moi. L’avant et l’après naissent de moi. Ce qu’on attend, ce qui se brise, ce qui dure, est avec moi. »</p>'
            ],
            5 => [
                'titre' => 'Ho’, l’Être de l’Unité',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_5.svg',
                'detailed_description' => '
                    <p>L’Être du Ho’ dit : « Ma force est unité et mon unité crée la force. Partager est souvent difficile car cela signifie cesser d’être seul et accepter l’existence des autres en moi pour un bien ou objectif commun. De là vient le dicton ’l’union fait la force’. Si je sais accorder les forces des personnes autour de moi, si je peux voir leur potentiel sans réticence, alors ces vertus peuvent servir un bien commun. »</p>'
            ],
            6 => [
                'titre' => 'Wak, l’Être de l’Intuition',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_6.svg',
                'detailed_description' => '
                    <p>L’Être du Wak dit : « Fort, intuitif, prudent, mon monde est plein de mystères et de mysticisme. Si le monde me dit que je ne peux pas y aller, si je sens un défi intérieur à relever, j’y suis. Moi seul peux marcher sur le fil du monde avec un calme impassible. Les risques que je sais affronter, la partie de l’esprit qui m’a été donnée est conçue pour résoudre les labyrinthes. "Impossible" n’existe pas dans mon vocabulaire. Je prends ce dont j’ai besoin, et même ce dont je n’ai pas besoin, au cas où. Je dois mesurer mes actions ou risquer de causer des accidents. »</p>'
            ],
            7 => [
                'titre' => 'Uk, l’Être de l’Infini',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_7.svg',
                'detailed_description' => '
                    <p>L’Être du Uk dit : « Dans ma vision, rien n’est suffisant, rien n’est limitant. Tout est un monde fertile et vaste, un espace pour naître et mourir. Sans limites. Mon plus grand don est de voir et de démêler les illusions de l’esprit humain depuis la vision universelle et divine, depuis la perspective du créateur et de la grande mère cosmique. »</p>'
            ],
            8 => [
                'titre' => 'Waxak, l’Être de l’Éternité',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_8.svg',
                'detailed_description' => '
                    <p>L’Être du Waxak dit : « Je suis le profond, ce qui est le plus enraciné dans le comportement humain : ce qui voyage à travers des vies et des vies, car ma vie ne s’arrête pas. Ma vie ne se termine pas, elle est infinie. Je suis infini. Un fil de vie se connecte sans fin depuis ma première existence, depuis mon premier souffle. Ce n’est qu’en me souvenant que je peux avancer. »</p>'
            ],
            9 => [
                'titre' => 'Bolon, l’Être de l’Ancrage',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_9.svg',
                'detailed_description' => '
                    <p>L’Être du Bolon dit : « Dans mon énergie mère, je prends garde à ne pas entrer dans les états superflus de l’esprit. Je cherche toujours un ancrage dans cette réalité, car j’y suis. Je dois apprendre de cette réalité, pas l’éviter. Je me rappelle que je ne peux aider personne avant de m’aider moi-même et comprendre mon propre chemin. Je ne suis pas un sauveur spécial du monde ; je suis un être capable de sentir mon énergie, avec certaines limites et bénédictions. »</p>'
            ],
            10 => [
                'titre' => 'Lahun, l’Être de la Plénitude',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_10.svg',
                'detailed_description' => '
                    <p>L’Être du Lahun dit : « Ma force presse l’esprit, m’élevant vers une réflexion sur les besoins que je juge indispensables ou que l’on m’a enseignés comme tels pour atteindre la perfection. Mais qu’est-ce que la perfection ? Elle réside dans ce qui me procure satisfaction, plénitude et totalité. Ainsi, ma quête diffère pour chacun. Selon mes besoins, ma culture et mon éducation, je porte en moi une vision unique de la perfection. »</p>'
            ],
            11 => [
                'titre' => 'Buluc, l’Être de la Puissance',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_11.svg',
                'detailed_description' => '
                    <p>L’Être du Buluc dit : « Je, fort et puissant. Pour moi, ce n’est pas une fantaisie ; dans ma perception de l’univers, ma force est infinie. Je peux tout contrôler, tout créer et tout détruire. Avec mon pouvoir, je peux soumettre ou mettre à mes pieds ce dont j’ai besoin ou veux. Je suis principe et fin : je commence toujours, je termine toujours.»</p>'
            ],
            12 => [
                'titre' => 'Lahca, l’Être des Précisions',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_12.svg',
                'detailed_description' => '
                    <p>L’Être du Lahca dit : « Je viens vous enseigner les décisions difficiles, qui ne semblent compliquées qu’à cause de l’éducation sociale et morale reçue. Si je guide par le cœur, mes actions n’auront pas de poids, et je prendrai toujours la meilleure décision. Il y a toujours quelqu’un qui doit assumer les décisions difficiles et déterminantes, et je suis celui, plus froid, avec le caractère nécessaire pour voir et discerner. »</p>'
            ],
            13 => [
                'titre' => 'Oxlahun, l’Être de la Sagesse',
                'image' => '/wp-content/themes/astra-child/assets/numbers/Maya_13.svg',
                'detailed_description' => '
                    <p>L’Être du Oxlahun dit : « Je connais le chemin. Je sais jusqu’où je peux aller, mais aussi où je dois m’arrêter pour observer, me taire et poursuivre. Nombreuses sont les vérités qui s’ouvrent à mes yeux ; néanmoins, je dois continuer d’avancer au milieu des illusions des autres, en me souvenant que tous ne sont pas prêts à percevoir le monde sous un jour nouveau. J’accompagne avec amour et patience, cultivant un profond amour pour eux, insondable aux esprits jeunes. »</p>'
		]
            ],
        'trecenas' => []
    ];
    return new WP_REST_Response($details, 200);
}
add_action('rest_api_init', function() {
    register_rest_route('tzolkin/v1', '/details', [
        'methods' => 'GET',
        'callback' => function() {
            $cache_key = 'tzolkin_details_cache';
            $cached_data = get_transient($cache_key);
            if ($cached_data !== false) {
                header('Cache-Control: public, max-age=3600');
                return new WP_REST_Response($cached_data, 200);
            }
            $data = tzolkin_load_details();
            set_transient($cache_key, $data, 3600);
            header('Cache-Control: public, max-age=3600');
            return new WP_REST_Response($data, 200);
        },
        'permission_callback' => '__return_true'
    ]);
});

function clear_tzolkin_cache() {
    delete_transient('tzolkin_details_cache');
}
add_action('save_post', 'clear_tzolkin_cache');
add_action('update_option', 'clear_tzolkin_cache');
function tzolkin_details_shortcode() {
    ob_start();
    ?>
    <div id="tzolkin-detail-view" class="tzolkin-view" style="display: none;">
        <div id="tzolkin-detail-content"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('tzolkin_details', 'tzolkin_details_shortcode');
?>