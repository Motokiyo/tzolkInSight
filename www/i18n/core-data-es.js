/**
 * TzolkInSight — Spanish (Latin American) core data overlay
 * Overwrites French translations in TzolkinCore after core.js loads
 */
(function() {
    if (!window.TzolkinCore) { console.warn('[i18n] TzolkinCore not loaded yet'); return; }

    // Overwrite GLYPHS translations
    var G = window.TzolkinCore.GLYPHS;
    G[1].translation = 'Cocodrilo';
    G[2].translation = 'Viento';
    G[3].translation = 'Noche';
    G[4].translation = 'Semilla';
    G[5].translation = 'Serpiente';
    G[6].translation = 'Muerte';
    G[7].translation = 'Venado';
    G[8].translation = 'Conejo';
    G[9].translation = 'Agua';
    G[10].translation = 'Perro';
    G[11].translation = 'Mono';
    G[12].translation = 'Camino';
    G[13].translation = 'Caña';
    G[14].translation = 'Jaguar';
    G[15].translation = 'Águila';
    G[16].translation = 'Buitre';
    G[17].translation = 'Tierra';
    G[18].translation = 'Cuchillo de Obsidiana';
    G[19].translation = 'Tormenta';
    G[20].translation = 'Sol';

    // Overwrite TRECENAS (translate 'translation' and 'description' for each of 1-20)
    var T = window.TzolkinCore.TRECENAS;

    T[1].translation = 'Cocodrilo';
    T[1].description = 'Imix se asocia con la creación, los sueños y la energía primordial de la Madre. Es un período para confiar en el universo y conectarse con la tierra y el agua.';

    T[2].translation = 'Viento';
    T[2].description = 'Ik\' se relaciona con la comunicación, la imaginación y la inspiración. Es un momento propicio para nuevas conversaciones y para abrirse a los cambios.';

    T[3].translation = 'Noche';
    T[3].description = 'Ak\'bal trata de la sombra y la luz, así como de la dualidad. Es un período para la reflexión y la búsqueda de la sabiduría interior.';

    T[4].translation = 'Semilla';
    T[4].description = 'Kan se asocia con la sabiduría, el poder y la fuerza vital. Es un momento propicio para el aprendizaje y la evolución espiritual.';

    T[5].translation = 'Serpiente';
    T[5].description = 'Chicchan pone de manifiesto la energía vital y la pasión. Es un momento poderoso y potencialmente transformador.';

    T[6].translation = 'Muerte';
    T[6].description = 'Cimi aborda los temas de la muerte y el soltar. Es un período de cambio profundo y de renovación espiritual.';

    T[7].translation = 'Venado';
    T[7].description = 'Manik encarna la libertad, el equilibrio y la conexión con la naturaleza. Este glifo simboliza el honor y la armonía.';

    T[8].translation = 'Conejo';
    T[8].description = 'Lamat representa la estrella, la belleza y la armonía cósmica. Este glifo se asocia con la creatividad y la prosperidad.';

    T[9].translation = 'Agua';
    T[9].description = 'Muluc simboliza las emociones, la purificación y el flujo de la vida. Este glifo invita a escuchar la intuición.';

    T[10].translation = 'Perro';
    T[10].description = 'Oc representa la lealtad, el amor y la protección. Este glifo encarna la fidelidad y las conexiones emocionales.';

    T[11].translation = 'Mono';
    T[11].description = 'Chuen simboliza la creatividad, el juego y el humor. Este glifo encarna el espíritu artístico y la espontaneidad.';

    T[12].translation = 'Camino';
    T[12].description = 'Eb representa al ser humano, el camino de la vida y las relaciones. Este glifo se vincula con la gratitud y la comunidad.';

    T[13].translation = 'Caña';
    T[13].description = 'Ben simboliza el crecimiento, la autoridad espiritual y la conexión entre la tierra y el cielo.';

    T[14].translation = 'Jaguar';
    T[14].description = 'Ix encarna la magia, la potencia y la conexión con la tierra. Este glifo representa la sabiduría chamánica.';

    T[15].translation = 'Águila';
    T[15].description = 'Men representa la visión, la libertad y la conciencia superior. Este glifo se vincula con la inspiración y la perspectiva elevada.';

    T[16].translation = 'Buitre';
    T[16].description = 'Cib simboliza la paciencia, la purificación y la sabiduría ancestral. Este glifo invita a aceptar los ciclos naturales.';

    T[17].translation = 'Tierra';
    T[17].description = 'Caban representa el movimiento, la evolución y la sincronicidad. Este glifo encarna la energía planetaria.';

    T[18].translation = 'Cuchillo de Obsidiana';
    T[18].description = 'Etznab simboliza la verdad, la reflexión y la claridad. Este glifo invita a enfrentar las propias sombras.';

    T[19].translation = 'Tormenta';
    T[19].description = 'Cauac representa la tormenta, la transformación y la energía purificadora. Este glifo trae la renovación a través del caos.';

    T[20].translation = 'Sol';
    T[20].description = 'Ahau encarna el sol, la luz y la maestría. Este glifo simboliza la iluminación y la realización.';

    // Overwrite LORDS_OF_NIGHT (translate 'domain' and 'description' for each of 1-9)
    var L = window.TzolkinCore.LORDS_OF_NIGHT;

    L[1].domain = 'Rayo · Linaje real · Poder sagrado';
    L[1].description = 'K\'awiil es el señor del rayo y de la continuidad dinástica. Gobierna las transformaciones poderosas, las iniciaciones y la herencia ancestral. Su presencia al nacer confiere un vínculo profundo con el poder sagrado y las fuerzas de los ancestros.';

    L[2].domain = 'Lluvia · Abundancia · Renovación';
    L[2].description = 'Chac es el señor de las aguas celestes y de la lluvia fertilizante. Encarna la abundancia, la renovación y la generosidad cósmica. Su presencia al nacer aporta una sensibilidad a los ciclos naturales y un don para nutrir y sostener a los demás.';

    L[3].domain = 'Sol · Visión · Calor creador';
    L[3].description = 'Kinich Ahau es la faz solar de lo divino, señor del sol naciente y de la visión clara. Representa la luz de la conciencia y el calor creador. Nacer bajo su gobierno confiere una naturaleza radiante, una aptitud para el liderazgo y la iluminación.';

    L[4].domain = 'Maíz sagrado · Germinación · Sustento';
    L[4].description = 'Wuk Ah (\'el Siete-veces\', coeficiente 7 en el glifo) es el señor de la germinación y del maíz sagrado. Encarna la fuerza subterránea que permite a la semilla atravesar la oscuridad y renacer como planta. Su presencia confiere un vínculo profundo con los ciclos naturales y la paciencia nutricia. (Identificación Frumker 1993; antigua hipótesis Kelley 1972: Yum Kaax.)';

    L[5].domain = 'Muerte · Transición · Misterio del ciclo';
    L[5].description = 'Ah Puch es el señor del paso entre los mundos. No representa la muerte como final, sino como transformación necesaria dentro del gran ciclo. Nacer bajo su gobierno otorga una profundidad particular, la capacidad de atravesar las pruebas y renacer.';

    L[6].domain = 'Luna · Agua · Medicina · Adivinación';
    L[6].description = 'Ix Chel es la gran diosa lunar, señora de las aguas, de la medicina y de la adivinación. Las inscripciones epigráficas asocian directamente a G6 con los nacimientos nobles y los eventos de alto rango dinástico — es una de las asociaciones mejor atestiguadas entre G1-G8. Su presencia confiere una intuición profunda, dones de sanación y una conexión fuerte con los ciclos lunares y el nacimiento.';

    L[7].domain = 'Fuego sagrado · Purificación · Valor';
    L[7].description = 'Buluc Chabtan se asocia con el fuego purificador y la prueba transformadora. Su naturaleza intensa impulsa a enfrentar los desafíos con valor. Nacer bajo su gobierno confiere una naturaleza guerrera en el sentido noble — la capacidad de defender lo justo y purificar a través de la acción.';

    L[8].domain = 'Sabiduría suprema · Escritura · Creación';
    L[8].description = 'Itzamna es el dios supremo del panteón maya, maestro de la sabiduría, la escritura y los calendarios sagrados. Su presencia al nacer es señal de una inteligencia profunda, un don para el conocimiento y una conexión natural con lo divino y lo sagrado.';

    L[9].domain = 'Viento · Cuatro direcciones · Sostén cósmico';
    L[9].description = 'Pauahtun es el único Señor de la Noche formalmente identificado por los epigrafistas mayas. Dios cuadripartito — presente en las cuatro esquinas del mundo — sostiene el cielo y la tierra. Su presencia confiere una naturaleza estable, portadora, capaz de ser un pilar para los demás.';

    console.log('[i18n] Core data: Spanish overlay applied');
})();
