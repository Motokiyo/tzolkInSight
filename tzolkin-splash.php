<?php
// Écran de démarrage pour Tzolk'in (image + polices personnalisées)
// Si le splash est chargé dans une modal, on ajoute une classe spéciale
$is_in_modal = isset($is_modal) && $is_modal;
if ($is_in_modal) {
    echo '<div class="tzolkin-splash-modal-version">';
}
?>
<div id="tzolkin-splash">
    <div class="tzolkin-splash-title">Le TZOLK'IN DU PARÉDÉ</div>
    <div class="tzolkin-splash-icon">
        <img src="/wp-content/themes/astra-child/icons/icon-app-512.png" alt="Tzolk'in Icon"
            class="tzolkin-splash-image">
    </div>
    <p class="tzolkin-splash-author">Créée par Alexandre Ferran, assisté par Grok IA et DeepSeek IA - 2025©</p>
    <p class="tzolkin-splash-text">Explorez la magie du calendrier <b>Tzolk'in</b> de tradition Yucatèque et Parédéenne
        !</p>
    <p class="tzolkin-splash-link">
        <a href="https://leparede.org" target="_blank" rel="noopener noreferrer">https://leparede.org</a>
    </p>
    <div class="tzolkin-splash-title">version 1.49</div>
    <p class="tzolkin-splash-author">Résolution finale du bug de duplication des notes (autosauvegarde) et ajustement
        cosmétique du titre.</p>
</div>
<?php
if ($is_in_modal) {
    echo '</div>'; // Ferme la div .tzolkin-splash-modal-version
}
?>