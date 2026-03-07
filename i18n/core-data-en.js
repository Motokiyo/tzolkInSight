/**
 * TzolkInSight — English core data overlay
 * Overwrites French translations in TzolkinCore after core.js loads
 */
(function() {
    if (!window.TzolkinCore) { console.warn('[i18n] TzolkinCore not loaded yet'); return; }

    // Overwrite GLYPHS translations
    var G = window.TzolkinCore.GLYPHS;
    G[1].translation = 'Crocodile';
    G[2].translation = 'Wind';
    G[3].translation = 'Night';
    G[4].translation = 'Seed';
    G[5].translation = 'Serpent';
    G[6].translation = 'Death';
    G[7].translation = 'Deer';
    G[8].translation = 'Rabbit';
    G[9].translation = 'Water';
    G[10].translation = 'Dog';
    G[11].translation = 'Monkey';
    G[12].translation = 'Road';
    G[13].translation = 'Reed';
    G[14].translation = 'Jaguar';
    G[15].translation = 'Eagle';
    G[16].translation = 'Vulture';
    G[17].translation = 'Earth';
    G[18].translation = 'Obsidian Knife';
    G[19].translation = 'Storm';
    G[20].translation = 'Sun';

    // Overwrite TRECENAS (translate 'translation' and 'description' for each of 1-20)
    var T = window.TzolkinCore.TRECENAS;

    T[1].translation = 'Crocodile';
    T[1].description = 'Imix is associated with creation, dreams, and the primordial energy of the Mother. It is a period to trust the universe and connect with the earth and water.';

    T[2].translation = 'Wind';
    T[2].description = 'Ik\' is linked to communication, imagination, and inspiration. It is a favorable time for new conversations and openness to change.';

    T[3].translation = 'Night';
    T[3].description = 'Ak\'bal deals with shadow and light, as well as duality. It is a period for reflection and the search for inner wisdom.';

    T[4].translation = 'Seed';
    T[4].description = 'Kan is associated with wisdom, power, and life force. It is a favorable time for learning and spiritual evolution.';

    T[5].translation = 'Serpent';
    T[5].description = 'Chicchan highlights vital energy and passion. It is a powerful and potentially transformative moment.';

    T[6].translation = 'Death';
    T[6].description = 'Cimi addresses the themes of death and letting go. It is a period of profound change and spiritual renewal.';

    T[7].translation = 'Deer';
    T[7].description = 'Manik embodies freedom, balance, and connection with nature. This glyph symbolizes honor and harmony.';

    T[8].translation = 'Rabbit';
    T[8].description = 'Lamat represents the star, beauty, and cosmic harmony. This glyph is associated with creativity and prosperity.';

    T[9].translation = 'Water';
    T[9].description = 'Muluc symbolizes emotions, purification, and the flow of life. This glyph invites you to listen to your intuition.';

    T[10].translation = 'Dog';
    T[10].description = 'Oc represents loyalty, love, and protection. This glyph embodies faithfulness and emotional connections.';

    T[11].translation = 'Monkey';
    T[11].description = 'Chuen symbolizes creativity, play, and humor. This glyph embodies the artistic spirit and spontaneity.';

    T[12].translation = 'Road';
    T[12].description = 'Eb represents the human, the road of life, and relationships. This glyph is linked to gratitude and community.';

    T[13].translation = 'Reed';
    T[13].description = 'Ben symbolizes growth, spiritual authority, and the connection between earth and sky.';

    T[14].translation = 'Jaguar';
    T[14].description = 'Ix embodies magic, power, and connection with the earth. This glyph represents shamanic wisdom.';

    T[15].translation = 'Eagle';
    T[15].description = 'Men represents vision, freedom, and higher consciousness. This glyph is linked to inspiration and an elevated perspective.';

    T[16].translation = 'Vulture';
    T[16].description = 'Cib symbolizes patience, purification, and ancestral wisdom. This glyph invites you to accept the natural cycles.';

    T[17].translation = 'Earth';
    T[17].description = 'Caban represents movement, evolution, and synchronicity. This glyph embodies planetary energy.';

    T[18].translation = 'Obsidian Knife';
    T[18].description = 'Etznab symbolizes truth, reflection, and clarity. This glyph invites you to confront your shadows.';

    T[19].translation = 'Storm';
    T[19].description = 'Cauac represents the storm, transformation, and purifying energy. This glyph brings renewal through chaos.';

    T[20].translation = 'Sun';
    T[20].description = 'Ahau embodies the sun, light, and mastery. This glyph symbolizes illumination and accomplishment.';

    // Overwrite LORDS_OF_NIGHT (translate 'domain' and 'description' for each of 1-9)
    var L = window.TzolkinCore.LORDS_OF_NIGHT;

    L[1].domain = 'Lightning · Royal Lineage · Sacred Power';
    L[1].description = 'K\'awiil is the lord of lightning and dynastic continuity. He governs powerful transformations, initiations, and ancestral heritage. His presence at birth confers a deep connection to sacred power and the forces of the ancestors.';

    L[2].domain = 'Rain · Abundance · Renewal';
    L[2].description = 'Chac is the lord of celestial waters and fertilizing rain. He embodies abundance, renewal, and cosmic generosity. His presence at birth brings sensitivity to natural cycles and a gift for nurturing and supporting others.';

    L[3].domain = 'Sun · Vision · Creative Warmth';
    L[3].description = 'Kinich Ahau is the solar face of the divine, lord of the rising sun and clear vision. He represents the light of consciousness and creative warmth. Being born under his reign confers a radiant nature, an aptitude for leadership, and illumination.';

    L[4].domain = 'Sacred Corn · Germination · Sustenance';
    L[4].description = 'Wuk Ah (\'the Seven-fold\', coefficient 7 in the glyph) is the lord of germination and sacred corn. He embodies the underground force that allows the seed to pass through darkness and be reborn as a plant. His presence confers a deep connection to natural cycles and nurturing patience. (Identification Frumker 1993; former hypothesis Kelley 1972: Yum Kaax.)';

    L[5].domain = 'Death · Transition · Mystery of the Cycle';
    L[5].description = 'Ah Puch is the lord of passage between worlds. He does not represent death as an end, but as a necessary transformation in the great cycle. Being born under his reign gives a particular depth, the ability to overcome trials and be reborn.';

    L[6].domain = 'Moon · Water · Medicine · Divination';
    L[6].description = 'Ix Chel is the great lunar goddess, mistress of waters, medicine, and divination. Epigraphic inscriptions directly associate G6 with noble births and high-ranking dynastic events — it is one of the best-attested associations among G1-G8. Her presence confers deep intuition, healing gifts, and a strong connection to lunar cycles and birth.';

    L[7].domain = 'Sacred Fire · Purification · Courage';
    L[7].description = 'Buluc Chabtan is associated with purifying fire and transformative trial. His intense nature drives one to face challenges with courage. Being born under his reign confers a warrior nature in the noblest sense — the ability to defend what is right and purify through action.';

    L[8].domain = 'Supreme Wisdom · Writing · Creation';
    L[8].description = 'Itzamna is the supreme deity of the Maya pantheon, master of wisdom, writing, and sacred calendars. His presence at birth is a sign of deep intelligence, a gift for knowledge, and a natural connection with the divine and the sacred.';

    L[9].domain = 'Wind · Four Directions · Cosmic Support';
    L[9].description = 'Pauahtun is the only Lord of the Night formally identified by Maya epigraphers. A quadripartite deity — present at the four corners of the world — he supports sky and earth. His presence confers a stable, supportive nature, capable of being a pillar for others.';

    console.log('[i18n] Core data: English overlay applied');
})();
