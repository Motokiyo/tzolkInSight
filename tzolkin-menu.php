<?php
// tzolkin-menu.php : Menu inférieur et modales pour Tzolkin
require_once __DIR__ . '/wp-functions.php';
?>
<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/tzolkin-menu.css">

<?php
$fonctionnement_path = get_theme_file_path('tzolkin-fonctionnement.php');
if (file_exists($fonctionnement_path)) {
    include $fonctionnement_path;
} else {
    echo '<div>Erreur : Contenu de la modale Fonctionnement non trouvé</div>';
}
?>

<div id="notes-modal" class="modal">
    <div class="modal-content">
        <div class="header">
            <h2>Notes</h2>
            <button class="open-saved-btn" id="open-saved-btn" onclick="openModal('saved')">Enregistrés</button>
            <div id="edit-controls" style="display: none; margin-left: auto;">
                <button onclick="saveEdit()"
                    style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; margin-right: 5px;">Enregistrer</button>
                <button onclick="cancelEdit()"
                    style="padding: 5px 10px; background-color: #FF5555; color: white; border: none; cursor: pointer;">Annuler</button>
            </div>
        </div>
        <div id="user-key-section" style="margin-bottom: 10px;">
            <label for="user-key-input">Clé personnelle (gardez-la secrète) : </label>
            <input type="text" id="user-key-input" placeholder="Entrez votre clé" style="padding: 5px; width: 200px;">
            <button onclick="saveUserKey()" style="padding: 5px 10px;">Valider</button>
        </div>
        <div class="custom-dropdown" id="color-dropdown" style="width: 100%; margin-bottom: 10px; position: relative;">
            <div class="dropdown-selected"
                style="padding: 5px; border: 1px solid #ccc; background-color: #FFFFFF; color: #000000; cursor: pointer; font-size: 14px;">
                ROUE DES EMOTIONS de R. Plutchik : Je me sens...
            </div>
            <div class="dropdown-options"
                style="display: none; position: absolute; width: 100%; border: 1px solid #ccc; background-color: #FFFFFF; z-index: 10; max-height: 200px; overflow-y: auto;">
                <span class="dropdown-option" data-value=""
                    style="display: block; padding: 5px; background-color: #FFFFFF; color: #000000; cursor: pointer; font-size: 14px;">Aucune
                    émotion (sans couleur)</span>
                <span class="dropdown-option" data-value="Joie,Sérénité,Extase"
                    style="display: block; padding: 5px; background-color: #FFFF99; color: #000000; cursor: pointer; font-size: 14px;">Joie,
                    Sérénité, Extase</span>
                <span class="dropdown-option" data-value="Tristesse,Songerie,Chagrin"
                    style="display: block; padding: 5px; background-color: #99CCFF; color: #000000; cursor: pointer; font-size: 14px;">Tristesse,
                    Songerie, Chagrin</span>
                <span class="dropdown-option" data-value="Peur,Appréhension,Terreur"
                    style="display: block; padding: 5px; background-color: #99FF99; color: #000000; cursor: pointer; font-size: 14px;">Peur,
                    Appréhension, Terreur</span>
                <span class="dropdown-option" data-value="Colère,Contrariété,Rage"
                    style="display: block; padding: 5px; background-color: #FF9999; color: #000000; cursor: pointer; font-size: 14px;">Colère,
                    Contrariété, Rage</span>
                <span class="dropdown-option" data-value="Surprise,Distraction,Stupéfaction"
                    style="display: block; padding: 5px; background-color: #CC99FF; color: #000000; cursor: pointer; font-size: 14px;">Surprise,
                    Distraction, Stupéfaction</span>
                <span class="dropdown-option" data-value="Confiance,Acceptation,Admiration"
                    style="display: block; padding: 5px; background-color: #CCFFCC; color: #000000; cursor: pointer; font-size: 14px;">Confiance,
                    Acceptation, Admiration</span>
                <span class="dropdown-option" data-value="Dégoût,Aversion,Ennui"
                    style="display: block; padding: 5px; background-color: #999966; color: #000000; cursor: pointer; font-size: 14px;">Dégoût,
                    Aversion, Ennui</span>
                <span class="dropdown-option" data-value="Anticipation,Intérêt,Vigilance"
                    style="display: block; padding: 5px; background-color: #FFCC99; color: #000000; cursor: pointer; font-size: 14px;">Anticipation,
                    Intérêt, Vigilance</span>
            </div>
        </div>
        <textarea id="notes-input" placeholder="Entrez vos notes du jour..."
            style="width: 100%; min-height: 100px;"></textarea>
    </div>
</div>

<div id="saved-modal" class="modal">
    <div class="modal-content">
        <div class="header">
            <button class="back-btn" onclick="openModal('notes')"><</button>
            <h2 style="white-space: nowrap;">Notes enregistrées</h2>
        </div>
        <div class="search-bar">
            <div class="dropdown">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D01-Imix.svg"
                    alt="Glyphe">
                <span class="dropdown-icon">▼</span>
                <ul id="glyph-dropdown">
                    <li value="" class="selected">Sans glyphe</li>
                    <li value="Imix"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D01-Imix.svg"
                            alt="Imix"></li>
                    <li value="Ik"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D02-Ik.svg"
                            alt="Ik"></li>
                    <li value="Akbal"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D03-Akbal.svg"
                            alt="Akbal"></li>
                    <li value="Kan"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D04-Kan.svg"
                            alt="Kan"></li>
                    <li value="Chicchan"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D05-Chikchan.svg"
                            alt="Chicchan"></li>
                    <li value="Cimi"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D06-Kimi.svg"
                            alt="Cimi"></li>
                    <li value="Manik"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D07-Manik.svg"
                            alt="Manik"></li>
                    <li value="Lamat"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D08-Lamat.svg"
                            alt="Lamat"></li>
                    <li value="Muluc"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D09-Muluk.svg"
                            alt="Muluc"></li>
                    <li value="Oc"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D10-Ok_b.svg"
                            alt="Oc"></li>
                    <li value="Chuen"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D11-Chuwen.svg"
                            alt="Chuen"></li>
                    <li value="Eb"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D12-Eb.svg"
                            alt="Eb"></li>
                    <li value="Ben"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D13-Ben.svg"
                            alt="Ben"></li>
                    <li value="Ix"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D14-Ix.svg"
                            alt="Ix"></li>
                    <li value="Men"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D15-Men.svg"
                            alt="Men"></li>
                    <li value="Cib"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D16-Kib.svg"
                            alt="Cib"></li>
                    <li value="Caban"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D17-Kaban.svg"
                            alt="Caban"></li>
                    <li value="Etznab"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D18-Etznab.svg"
                            alt="Etznab"></li>
                    <li value="Cauac"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D19-Kawak.svg"
                            alt="Cauac"></li>
                    <li value="Ahau"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D20-Ajaw.svg"
                            alt="Ahau"></li>
                </ul>
            </div>
            <div class="dropdown">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_1.svg" alt="Numéro">
                <span class="dropdown-icon">▼</span>
                <ul id="number-dropdown">
                    <li value="" class="selected">Sans chiffre</li>
                    <li value="Hun"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_1.svg"
                            alt="Hun"></li>
                    <li value="Ca"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_2.svg"
                            alt="Ca"></li>
                    <li value="Ox"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_3.svg"
                            alt="Ox"></li>
                    <li value="Can"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_4.svg"
                            alt="Can"></li>
                    <li value="Ho"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_5.svg"
                            alt="Ho"></li>
                    <li value="Wak"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_6.svg"
                            alt="Wak"></li>
                    <li value="Uuc"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_7.svg"
                            alt="Uuc"></li>
                    <li value="Waxak"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_8.svg"
                            alt="Waxak"></li>
                    <li value="Bolon"><img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_9.svg"
                            alt="Bolon"></li>
                    <li value="Lahun"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_10.svg" alt="Lahun">
                    </li>
                    <li value="Buluc"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_11.svg" alt="Buluc">
                    </li>
                    <li value="Lahca"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_12.svg" alt="Lahca">
                    </li>
                    <li value="Oxlahun"><img
                            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_13.svg"
                            alt="Oxlahun"></li>
                </ul>
            </div>
            <div class="date-inputs">
                <input type="text" id="date-text" class="tzolkin-date-input-clone" placeholder="jj/mm/aaaa"
                    title="Aller à une date (Entrée)" oninput="formatDateInput(this)"
                    onkeydown="handleDateKeydown(event)" onfocus="showDatePicker()">
                <input type="date" id="date-search" onchange="syncDateInputs(this)">
            </div>
            <button class="sort-btn" onclick="toggleSortOrder(event)">
                <>
            </button>
        </div>
        <div class="notes-table" id="notes-table">
            <div class="no-results">Désolé, pas d'occurrence</div>
        </div>
        <div class="csv-buttons">
            <button onclick="downloadCSV(); event.stopPropagation()">Télécharger CSV</button>
        </div>
    </div>
</div>

<div id="credits-modal" class="modal">
    <div class="modal-content">
        <?php
        $splash_path = get_theme_file_path('tzolkin-splash.php');
        if (file_exists($splash_path)) {
            $is_modal = true;
            include $splash_path;
        } else {
            echo '<div>Erreur : Crédits non trouvés</div>';
        }
        ?>
    </div>
</div>

<div class="main-menu">
    <div class="menu-button" onclick="closeAllModals()">
        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/boutons/SVG/men-bt.svg" alt="Calendrier">
        <span>Calendrier</span>
    </div>
    <div class="menu-button" onclick="openModal('fonctionnement')">
        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/boutons/SVG/lamat-bt.svg" alt="Fonctionnement">
        <span>Fonctionnement</span>
    </div>
    <div class="menu-button" onclick="openModal('notes')">
        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/boutons/SVG/akbal-bt.svg" alt="Notes">
        <span>Notes</span>
    </div>
    <div class="menu-button" onclick="openModal('credits')">
        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/boutons/SVG/manik-bt.svg" alt="Crédits">
        <span>Crédits</span>
    </div>
</div>

<script>
    function adjustBodyMargin() {
        const menu = document.querySelector('.main-menu');
        const menuHeight = menu ? menu.offsetHeight : 0;
        document.body.style.marginBottom = `${menuHeight}px`;
    }
    window.addEventListener('load', adjustBodyMargin);
    window.addEventListener('resize', adjustBodyMargin);

    let lastScrollTop = 0;
    let touchStartY = 0;
    let inactivityTimer = null;
    let showMenuTimeout = null;
    let hideMenuTimeout = null;
    const menu = document.querySelector('.main-menu');
    const INACTIVITY_TIMEOUT = 3000;
    const SCROLL_THRESHOLD = 50;
    const SPLASH_TIMEOUT = 10000; // 10 secondes pour le splash

    function hideMenu() {
        menu.classList.add('hidden');
    }

    function showMenu() {
        clearTimeout(hideMenuTimeout);
        menu.classList.remove('hidden');
    }

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        clearTimeout(hideMenuTimeout);
        if (window.location.hash === '#saved') {
            hideMenu(); // Menu toujours masqué dans #saved
            return;
        }
        showMenu();
        if (window.location.hash === '#calendar') {
            inactivityTimer = setTimeout(hideMenu, INACTIVITY_TIMEOUT);
        }
    }

    function handleScroll() {
        if (window.location.hash !== '#calendar') return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDistance = Math.abs(scrollTop - lastScrollTop);
        if (scrollDistance > SCROLL_THRESHOLD) {
            clearTimeout(showMenuTimeout);
            hideMenuTimeout = setTimeout(hideMenu, 100);
        } else {
            clearTimeout(hideMenuTimeout);
            showMenuTimeout = setTimeout(showMenu, 100);
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    // Gestion du splash screen
    function hideSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.style.display = 'none';
            document.body.classList.remove('splash-active');
            window.history.pushState({}, '', '#calendar');
            resetInactivityTimer();
        }
    }

    function setupSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen && !window.location.hash) {
            document.body.classList.add('splash-active');
            splashScreen.style.display = 'block';
            setTimeout(hideSplashScreen, SPLASH_TIMEOUT);
            splashScreen.addEventListener('click', hideSplashScreen);
            splashScreen.addEventListener('touchstart', hideSplashScreen);
        } else {
            hideSplashScreen();
        }
    }

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        resetInactivityTimer();
    });
    document.addEventListener('touchmove', (e) => {
        if (window.location.hash !== '#calendar') return;
        const touchY = e.touches[0].clientY;
        const touchDistance = Math.abs(touchY - touchStartY);
        if (touchDistance > SCROLL_THRESHOLD) {
            clearTimeout(showMenuTimeout);
            hideMenuTimeout = setTimeout(hideMenu, 100);
        } else {
            clearTimeout(hideMenuTimeout);
            showMenuTimeout = setTimeout(showMenu, 100);
        }
    });
    document.addEventListener('touchend', (e) => {
        if (window.location.hash !== '#calendar') return;
        const touchDistance = Math.abs(e.changedTouches[0].clientY - touchStartY);
        if (touchDistance < SCROLL_THRESHOLD) {
            resetInactivityTimer();
        }
    });
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('click', (e) => {
        const windowHeight = window.innerHeight;
        if (window.location.hash === '#saved') return; // Pas d'interaction avec le menu dans #saved
        const csvButtons = document.querySelector('.csv-buttons');
        if (csvButtons && csvButtons.contains(e.target)) {
            clearTimeout(inactivityTimer);
            showMenu();
        } else if (window.location.hash === '#calendar' && e.clientY > windowHeight * 0.8) {
            clearTimeout(inactivityTimer);
            showMenu();
        } else {
            resetInactivityTimer();
        }
    });

    if (window.location.hash === '#calendar') {
        resetInactivityTimer();
    }

    function openModal(modalId, skipSave = false) {
        if (modalId !== 'notes' && !skipSave) {
            saveCurrentNote();
            localStorage.setItem('isNoteModalOpen', 'false');
        }
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        const modal = document.getElementById(`${modalId}-modal`);
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        if (modalId === 'notes') {
            localStorage.setItem('isNoteModalOpen', 'true');
            ensureNotesLoaded().then(() => {
                applyCurrentNoteToUI();
            });
            checkUserKey();
        } else if (modalId === 'saved') {
            filterNotes();
            hideMenu(); // Masquer le menu pour #saved
        }
        window.history.pushState({}, '', `#${modalId}`);
        if (modalId !== 'saved') {
            showMenu(); // Afficher le menu pour les autres modales
        }
    }

    function closeAllModals() {
        saveCurrentNote();
        localStorage.setItem('isNoteModalOpen', 'false');
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        document.body.classList.remove('modal-open');
        window.history.pushState({}, '', '#calendar');
        resetInactivityTimer();
    }

    const glyphs = {
        1: { name: 'Imix', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D01-Imix.svg' },
        2: { name: 'Ik', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D02-Ik.svg' },
        3: { name: 'Akbal', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D03-Akbal.svg' },
        4: { name: 'Kan', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D04-Kan.svg' },
        5: { name: 'Chicchan', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D05-Chikchan.svg' },
        6: { name: 'Cimi', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D06-Kimi.svg' },
        7: { name: 'Manik', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D07-Manik.svg' },
        8: { name: 'Lamat', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D08-Lamat.svg' },
        9: { name: 'Muluc', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D09-Muluk.svg' },
        10: { name: 'Oc', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D10-Ok_b.svg' },
        11: { name: 'Chuen', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D11-Chuwen.svg' },
        12: { name: 'Eb', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D12-Eb.svg' },
        13: { name: 'Ben', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D13-Ben.svg' },
        14: { name: 'Ix', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D14-Ix.svg' },
        15: { name: 'Men', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D15-Men.svg' },
        16: { name: 'Cib', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D16-Kib.svg' },
        17: { name: 'Caban', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D17-Kaban.svg' },
        18: { name: 'Etznab', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D18-Etznab.svg' },
        19: { name: 'Cauac', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D19-Kawak.svg' },
        20: { name: 'Ahau', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D20-Ajaw.svg' }
    };
    const numbers = {
        1: { name: 'Hun', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_1.svg' },
        2: { name: 'Ca', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_2.svg' },
        3: { name: 'Ox', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_3.svg' },
        4: { name: 'Can', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_4.svg' },
        5: { name: 'Ho', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_5.svg' },
        6: { name: 'Wak', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_6.svg' },
        7: { name: 'Uuc', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_7.svg' },
        8: { name: 'Waxak', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_8.svg' },
        9: { name: 'Bolon', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_9.svg' },
        10: { name: 'Lahun', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_10.svg' },
        11: { name: 'Buluc', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_11.svg' },
        12: { name: 'Lahca', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_12.svg' },
        13: { name: 'Oxlahun', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_13.svg' }
    };

    function modAdjust(x, m) {
        let result = x % m;
        if (result <= 0) result += m;
        return result;
    }

    function calculateTzolkin(date) {
        const baseDate = new Date('2025-04-22');
        const baseGlyph = 5;
        const baseNumber = 11;
        const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
        const glyphId = modAdjust(baseGlyph + diffDays, 20);
        const numberId = modAdjust(baseNumber + diffDays, 13);
        return { glyphId, numberId };
    }

    let offset = 0;
    if (localStorage.getItem('tzolkin-offset')) {
        offset = parseInt(localStorage.getItem('tzolkin-offset')) || 0;
    } else {
        localStorage.setItem('tzolkin-offset', '0');
    }

    let activeFilters = { glyph: '', number: '', date: '' };
    let notes = [];
    let lastSavedDate = localStorage.getItem('lastSavedDate') || null;
    let notesLoaded = false;

    let autosaveTimer = null;
    const AUTOSAVE_DELAY_MS = 800;

    function scheduleAutosave() {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => {
            saveCurrentNote();
        }, AUTOSAVE_DELAY_MS);
    }

    const emotionColors = {
        'Joie,Sérénité,Extase': '#FFFF99',
        'Tristesse,Songerie,Chagrin': '#99CCFF',
        'Peur,Appréhension,Terreur': '#99FF99',
        'Colère,Contrariété,Rage': '#FF9999',
        'Surprise,Distraction,Stupéfaction': '#CC99FF',
        'Confiance,Acceptation,Admiration': '#CCFFCC',
        'Dégoût,Aversion,Ennui': '#999966',
        'Anticipation,Intérêt,Vigilance': '#FFCC99'
    };

    function saveUserKey() {
        const userKeyInput = document.getElementById('user-key-input');
        const userKey = userKeyInput.value.trim();
        if (!userKey) {
            alert('Veuillez entrer une clé personnelle.');
            return;
        }
        localStorage.setItem('tzolkin-user-key', userKey);
        checkUserKey();
        ensureNotesLoaded().then(() => {
            applyCurrentNoteToUI();
        });
    }

    function checkUserKey() {
        const userKey = localStorage.getItem('tzolkin-user-key');
        const userKeySection = document.getElementById('user-key-section');
        const notesInput = document.getElementById('notes-input');
        const colorDropdown = document.getElementById('color-dropdown');
        if (userKey) {
            userKeySection.style.display = 'none';
            notesInput.disabled = false;
            colorDropdown.style.pointerEvents = 'auto';
        } else {
            userKeySection.style.display = 'block';
            notesInput.disabled = true;
            colorDropdown.style.pointerEvents = 'none';
        }
    }

    async function saveCurrentNote() {
        const userKey = localStorage.getItem('tzolkin-user-key');
        if (!userKey) return;

        const textarea = document.getElementById('notes-input');
        if (!textarea) return;
        const text = textarea.value.trim();
        const parisDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
        const currentDate = new Date(parisDate.getTime());
        currentDate.setDate(currentDate.getDate() + offset);
        const dateStr = currentDate.toISOString().split('T')[0];
        const { glyphId, numberId } = calculateTzolkin(currentDate);

        const colorDropdown = document.getElementById('color-dropdown');
        const selected = colorDropdown.querySelector('.dropdown-selected');
        let emotion = selected.dataset.value || '';
        let color = emotion && emotion !== '' ? emotionColors[emotion] : '';

        const isNoteModalOpen = localStorage.getItem('isNoteModalOpen') === 'true';
        let noteDate = dateStr;
        let noteStartDate = localStorage.getItem('noteStartDate');

        if (isNoteModalOpen && !noteStartDate && (text || color)) {
            noteStartDate = dateStr;
            localStorage.setItem('noteStartDate', noteStartDate);
            console.log('noteStartDate défini :', noteStartDate);
        }
        if (isNoteModalOpen && noteStartDate) {
            noteDate = noteStartDate;
            console.log('saveCurrentNote - Utilisation de noteStartDate:', noteDate);
        }

        const noteGlyphId = calculateTzolkin(new Date(noteDate)).glyphId;
        const noteNumberId = calculateTzolkin(new Date(noteDate)).numberId;

        const existingNoteIndex = notes.findIndex(note => note.date === noteDate);
        const note = { date: noteDate, glyphId: noteGlyphId, numberId: noteNumberId, text, emotion, color };

        if (text || color) {
            if (existingNoteIndex >= 0) {
                notes[existingNoteIndex] = note;
            } else {
                notes.push(note);
            }
            localStorage.setItem('currentNoteText', text);
            localStorage.setItem('currentNoteEmotion', emotion);
            localStorage.setItem('currentNoteColor', color);
        } else {
            localStorage.setItem('currentNoteText', '');
            localStorage.setItem('currentNoteEmotion', '');
            localStorage.setItem('currentNoteColor', '');
            if (noteStartDate) {
                localStorage.removeItem('noteStartDate');
                console.log('noteStartDate supprimé car contenu vide');
            }
            return;
        }

        localStorage.setItem('lastSavedDate', noteDate);
        lastSavedDate = noteDate;

        try {
            const response = await fetch('<?php echo get_stylesheet_directory_uri(); ?>/tzolkin-save.php?cb=' + Date.now(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'upsert_note',
                    user_key: userKey,
                    note: note
                })
            });
            const result = await response.json();
            console.log('saveCurrentNote - Server response:', result);
            if (!result.success) {
                console.error('Erreur lors de la sauvegarde:', result.message);
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    }

    async function ensureNotesLoaded() {
        const userKey = localStorage.getItem('tzolkin-user-key');
        if (!userKey) return false;
        if (notesLoaded) return true;

        const tempNotes = notes;
        try {
            const response = await fetch('<?php echo get_stylesheet_directory_uri(); ?>/tzolkin-save.php?cb=' + Date.now(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'load',
                    user_key: userKey
                })
            });
            const result = await response.json();
            console.log('ensureNotesLoaded - Server response:', result);
            if (result.success && result.data) {
                notes = Array.isArray(result.data) ? result.data : tempNotes;
                notesLoaded = true;
                return true;
            }
            notes = tempNotes;
            return false;
        } catch (error) {
            console.error('Erreur réseau:', error);
            notes = tempNotes;
            return false;
        }
    }

    function applyCurrentNoteToUI() {
        const parisDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
        const currentDate = new Date(parisDate.getTime());
        currentDate.setDate(currentDate.getDate() + offset);
        const dateStr = currentDate.toISOString().split('T')[0];

        const textarea = document.getElementById('notes-input');
        const selected = document.getElementById('color-dropdown').querySelector('.dropdown-selected');
        const options = document.getElementById('color-dropdown').querySelectorAll('.dropdown-option');

        const noteStartDate = localStorage.getItem('noteStartDate');
        const isNoteModalOpen = localStorage.getItem('isNoteModalOpen') === 'true';

        if (!isNoteModalOpen && lastSavedDate && lastSavedDate !== dateStr) {
            console.log('applyCurrentNoteToUI - Changement de jour détecté, réinitialisation');
            textarea.value = '';
            selected.textContent = 'ROUE DES EMOTIONS de R. Plutchik : Je me sens...';
            selected.dataset.value = '';
            selected.style.backgroundColor = '#FFFFFF';
            textarea.style.backgroundColor = '#FFFFFF';
            localStorage.setItem('currentNoteText', '');
            localStorage.setItem('currentNoteEmotion', '');
            localStorage.setItem('currentNoteColor', '');
            localStorage.removeItem('noteStartDate');
        } else {
            let noteDate = dateStr;
            if (isNoteModalOpen && noteStartDate) {
                noteDate = noteStartDate;
            }
            const currentNote = notes.find(note => note.date === noteDate);
            if (currentNote) {
                textarea.value = currentNote.text;
                let selectedText = 'ROUE DES EMOTIONS de R. Plutchik : Je me sens...';
                let selectedColor = '#FFFFFF';
                options.forEach(option => {
                    if (option.dataset.value === currentNote.emotion) {
                        selectedText = option.textContent;
                        selectedColor = option.style.backgroundColor;
                    }
                });
                selected.textContent = selectedText;
                selected.dataset.value = currentNote.emotion || '';
                selected.style.backgroundColor = currentNote.color || selectedColor;
                textarea.style.backgroundColor = currentNote.color || selectedColor;
                localStorage.setItem('currentNoteText', currentNote.text);
                localStorage.setItem('currentNoteEmotion', currentNote.emotion || '');
                localStorage.setItem('currentNoteColor', currentNote.color || '');
            } else {
                textarea.value = '';
                selected.textContent = 'ROUE DES EMOTIONS de R. Plutchik : Je me sens...';
                selected.dataset.value = '';
                selected.style.backgroundColor = '#FFFFFF';
                textarea.style.backgroundColor = '#FFFFFF';
                localStorage.setItem('currentNoteText', '');
                localStorage.setItem('currentNoteEmotion', '');
                localStorage.setItem('currentNoteColor', '');
            }
        }

        lastSavedDate = dateStr;
        localStorage.setItem('lastSavedDate', dateStr);

        // UI Toggling for Edit Mode
        const openSavedBtn = document.getElementById('open-saved-btn');
        const editControls = document.getElementById('edit-controls');
        if (isNoteModalOpen && localStorage.getItem('isEditingMode') === 'true') {
            if (openSavedBtn) openSavedBtn.style.display = 'none';
            if (editControls) editControls.style.display = 'block';
        } else {
            if (openSavedBtn) openSavedBtn.style.display = 'block';
            if (editControls) editControls.style.display = 'none';
        }
    }

    async function deleteNote(date) {
        const userKey = localStorage.getItem('tzolkin-user-key');
        if (!userKey) return;

        if (!confirm('Voulez-vous vraiment supprimer cette note ?')) return;

        const index = notes.findIndex(note => note.date === date);
        if (index >= 0) {
            notes.splice(index, 1);
            try {
                const response = await fetch('<?php echo get_stylesheet_directory_uri(); ?>/tzolkin-save.php?cb=' + Date.now(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'delete_note',
                        user_key: userKey,
                        date: date
                    })
                });
                const result = await response.json();
                console.log('deleteNote - Server response:', result);
                if (!result.success) {
                    console.error('Erreur lors de la suppression:', result.message);
                }
            } catch (error) {
                console.error('Erreur réseau:', error);
            }
            filterNotes();
        }
    }

    function editNote(date) {
        const note = notes.find(n => n.date === date);
        if (note) {
            localStorage.setItem('originalNoteText', note.text || '');
            localStorage.setItem('originalNoteEmotion', note.emotion || '');
            localStorage.setItem('originalNoteColor', note.color || '');
        }
        localStorage.setItem('noteStartDate', date);
        localStorage.setItem('isEditingMode', 'true');
        openModal('notes');
    }

    async function saveEdit() {
        clearTimeout(autosaveTimer);
        await saveCurrentNote();
        cleanupEditMode();
        openModal('saved', true);
    }

    async function cancelEdit() {
        clearTimeout(autosaveTimer);
        const date = localStorage.getItem('noteStartDate');
        if (date) {
            const originalText = localStorage.getItem('originalNoteText');
            const originalEmotion = localStorage.getItem('originalNoteEmotion');
            const originalColor = localStorage.getItem('originalNoteColor');

            // Revert in memory
            const noteIndex = notes.findIndex(n => n.date === date);
            if (noteIndex >= 0) {
                notes[noteIndex].text = originalText;
                notes[noteIndex].emotion = originalEmotion;
                notes[noteIndex].color = originalColor;
            }

            // Force save reverted content
            const userKey = localStorage.getItem('tzolkin-user-key');
            if (userKey) {
                try {
                    // Manually construct note object to bypass UI reading in saveCurrentNote for safety
                    const { glyphId, numberId } = calculateTzolkin(new Date(date));
                    const note = {
                        date: date,
                        glyphId: glyphId,
                        numberId: numberId,
                        text: originalText,
                        emotion: originalEmotion,
                        color: originalColor
                    };

                    await fetch('<?php echo get_stylesheet_directory_uri(); ?>/tzolkin-save.php?cb=' + Date.now(), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'upsert_note',
                            user_key: userKey,
                            note: note
                        })
                    });
                } catch (e) { console.error(e); }
            }
        }
        cleanupEditMode();
        openModal('saved', true);
    }

    function cleanupEditMode() {
        localStorage.removeItem('isEditingMode');
        localStorage.removeItem('noteStartDate');
        localStorage.removeItem('originalNoteText');
        localStorage.removeItem('originalNoteEmotion');
        localStorage.removeItem('originalNoteColor');
    }

    function filterNotes() {
        const glyphFilter = activeFilters.glyph;
        const numberFilter = activeFilters.number;
        const dateFilter = activeFilters.date;
        const sortOrder = document.getElementById('sort-order')?.value || 'recent';

        const table = document.getElementById('notes-table');
        const noResults = table?.querySelector('.no-results');
        if (!table) return;

        let filteredNotes = [...notes];

        if (dateFilter && dateFilter.length === 10) {
            const [day, month, year] = dateFilter.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            filteredNotes = filteredNotes.filter(note => note.date === formattedDate);
        }
        if (glyphFilter) {
            filteredNotes = filteredNotes.filter(note => glyphs[note.glyphId].name === glyphFilter);
        }
        if (numberFilter) {
            filteredNotes = filteredNotes.filter(note => numbers[note.numberId].name === numberFilter);
        }

        filteredNotes.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
        });

        if (filteredNotes.length === 0) {
            table.innerHTML = '<div class="no-results">Aucune note enregistrée</div>';
            if (noResults) noResults.style.display = 'block';
        } else {
            table.innerHTML = filteredNotes.map(note => {
                const isLongNote = note.text.split(/\s+/).length > 200;
                const displayText = isLongNote ? note.text.split(/\s+/).slice(0, 200).join(' ') + ' (...)' : note.text;
                return `
                <div class="note-entry" style="background-color: ${note.color || '#FFFFFF'}; position: relative;" ${isLongNote ? 'onclick="toggleNoteText(this)"' : ''}>
                    <p>${new Date(note.date).toLocaleDateString('fr-FR')} - 
                       <img src="${glyphs[note.glyphId].image}" alt="${glyphs[note.glyphId].name}"> ${glyphs[note.glyphId].name} 
                       <img src="${numbers[note.numberId].image}" alt="${numbers[note.numberId].name}"> ${numbers[note.numberId].name}</p>
                    <p class="note-text" data-full-text="${note.text.replace(/"/g, '&quot;')}">${displayText}</p>
                    <div style="position: absolute; top: 10px; right: 10px;">
                        <button onclick="editNote('${note.date}'); event.stopPropagation();" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; margin-right: 5px;">Modifier</button>
                        <button onclick="deleteNote('${note.date}'); event.stopPropagation();" style="padding: 5px 10px; background-color: #FF5555; color: white; border: none; cursor: pointer;">Supprimer</button>
                    </div>
                </div>
            `;
            }).join('') + '<div class="no-results">Aucune note enregistrée</div>';
            if (noResults) noResults.style.display = 'none';
        }
    }

    function toggleNoteText(element) {
        const textElement = element.querySelector('.note-text');
        const fullText = textElement.dataset.fullText;
        const isTruncated = textElement.textContent.endsWith(' (...)');
        if (isTruncated) {
            textElement.textContent = fullText;
        } else {
            const words = fullText.split(/\s+/);
            textElement.textContent = words.slice(0, 200).join(' ') + ' (...)';
        }
    }

    function updateDropdown(dropdownId, items, selectedValue) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        dropdown.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.setAttribute('value', item.name || '');
            if (item.name) {
                li.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
            } else {
                li.textContent = dropdownId === 'glyph-dropdown' ? 'Sans glyphe' : 'Sans chiffre';
            }
            if (item.name === selectedValue) li.classList.add('selected');
            li.onclick = () => {
                dropdown.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                li.classList.add('selected');
                const img = li.querySelector('img');
                const parentImg = dropdown.parentElement.querySelector('img');
                if (img) {
                    parentImg.src = img.src;
                    parentImg.style.display = 'block';
                } else {
                    parentImg.style.display = 'none';
                }
                if (dropdownId === 'glyph-dropdown') {
                    activeFilters.glyph = item.name || '';
                } else {
                    activeFilters.number = item.name || '';
                }
                filterNotes();
            };
            dropdown.appendChild(li);
        });
    }

    function setupCustomDropdown() {
        const dropdown = document.getElementById('color-dropdown');
        const selected = dropdown.querySelector('.dropdown-selected');
        const optionsContainer = dropdown.querySelector('.dropdown-options');
        const options = dropdown.querySelectorAll('.dropdown-option');
        const textarea = document.getElementById('notes-input');

        selected.addEventListener('click', () => {
            optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.textContent = option.textContent;
                selected.dataset.value = option.dataset.value;
                selected.style.backgroundColor = option.style.backgroundColor;
                textarea.style.backgroundColor = option.style.backgroundColor;
                optionsContainer.style.display = 'none';
                scheduleAutosave();
            });
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                optionsContainer.style.display = 'none';
            }
        });
    }

    function formatDateInput(input) {
        let value = input.value.replace(/\D/g, '');
        let cursorPosition = input.selectionStart;
        let prevValue = input.value;

        if (value.length > 8) value = value.substring(0, 8);
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = value.substring(0, 2);
            if (value.length >= 2) {
                formattedValue += '/';
                formattedValue += value.substring(2, 4);
            }
            if (value.length >= 4) {
                formattedValue += '/';
                formattedValue += value.substring(4, 8);
            }
        }

        input.value = formattedValue;

        let newCursorPosition = cursorPosition;
        if (prevValue.length < formattedValue.length) {
            if (cursorPosition === 2 || cursorPosition === 5) {
                newCursorPosition++;
            }
        }
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    function handleDateKeydown(event) {
        if (event.key === 'Enter') {
            const dateValue = document.getElementById('date-text').value;
            activeFilters.date = dateValue;
            filterNotes();
            event.preventDefault();
        } else if (event.key === 'Backspace' && event.target.value === '') {
            const dateSearch = document.getElementById('date-search');
            if (dateSearch) {
                dateSearch.value = '';
                activeFilters.date = '';
                filterNotes();
            }
        }
        return /[0-9]|Arrow|Home|End|Tab|Backspace|Delete/.test(event.key);
    }

    function showDatePicker() {
        const dateSearch = document.getElementById('date-search');
        if (dateSearch) dateSearch.showPicker();
    }

    function syncDateInputs(dateInput) {
        const textInput = document.getElementById('date-text');
        if (!textInput || !dateInput) return;
        if (dateInput.value) {
            const date = new Date(dateInput.value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            textInput.value = `${day}/${month}/${year}`;
            activeFilters.date = textInput.value;
            filterNotes();
        } else {
            textInput.value = '';
            activeFilters.date = '';
            filterNotes();
        }
    }

    function toggleSortOrder(event) {
        event.preventDefault();
        event.stopPropagation();
        const sortInput = document.getElementById('sort-order');
        if (sortInput) {
            sortInput.value = sortInput.value === 'recent' ? 'old' : 'recent';
            console.log('Sort order changed to:', sortInput.value); // Débogage
            filterNotes();
        } else {
            console.error('Sort input not found');
        }
    }

    function downloadCSV() {
        const csv = [
            'Date,Glyphe,Chiffre,Glyphe+Chiffre,Couleur,Note',
            ...notes.map(note => {
                const glyphName = glyphs[note.glyphId].name;
                const numberName = numbers[note.numberId].name;
                const glyphNumber = `${glyphName} ${numberName}`;
                return `"${new Date(note.date).toLocaleDateString('fr-FR')}","${glyphName}","${numberName}","${glyphNumber}","${note.color && note.emotion !== '' ? note.color : ''}","${note.text.replace(/"/g, '""')}"`;
            })
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tzolkin-notes.csv';
        a.click();
        URL.revokeObjectURL(url);
        alert('Téléchargement réussi ! Le fichier "tzolkin-notes.csv" a été enregistré dans votre dossier de téléchargements.');
    }

    window.addEventListener('beforeunload', () => {
        saveCurrentNote();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            saveCurrentNote();
            localStorage.setItem('isNoteModalOpen', 'false');
            console.log('Application en arrière-plan, modale "Notes" considérée comme fermée');
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        updateDropdown('glyph-dropdown', [{ name: '', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/glyphs/MAYA-g-log-cal-D01-Imix.svg' }, ...Object.values(glyphs)], '');
        updateDropdown('number-dropdown', [{ name: '', image: '<?php echo get_stylesheet_directory_uri(); ?>/assets/numbers/Maya_1.svg' }, ...Object.values(numbers)], '');
        setupCustomDropdown();

        const textarea = document.getElementById('notes-input');
        if (textarea) {
            textarea.addEventListener('input', () => {
                scheduleAutosave();
            });
        }

        if (localStorage.getItem('tzolkin-user-key')) {
            ensureNotesLoaded().then(() => {
                applyCurrentNoteToUI();
            });
        }

        // Assurer l'initialisation de sort-order
        let sortInput = document.getElementById('sort-order');
        if (!sortInput) {
            sortInput = document.createElement('input');
            sortInput.type = 'hidden';
            sortInput.id = 'sort-order';
            sortInput.value = 'recent';
            document.body.appendChild(sortInput);
        }

        window.addEventListener('popstate', () => {
            const hash = window.location.hash.replace('#', '');
            const validModals = ['fonctionnement', 'notes', 'saved', 'credits'];
            if (validModals.includes(hash)) {
                openModal(hash);
            } else {
                closeAllModals();
            }
        });

        setupSplashScreen();
        closeAllModals();

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js', { scope: './' })
                .then((registration) => {
                    console.log('Service Worker enregistré avec succès:', registration);
                })
                .catch((error) => {
                    console.error('Erreur d’enregistrement du Service Worker:', error);
                });
        }

        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
        });
    });
</script>