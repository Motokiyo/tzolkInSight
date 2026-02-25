<?php
/*
 * Admin page for Tzolk'in Maya Widget: lets user set custom names and colors for glyphs 1-20.
 */
add_action('admin_menu', function() {
    add_options_page(
        "Tzolk'in Maya",
        "Tzolk'in Maya",
        'manage_options',
        'tzolkin-maya-settings',
        'tzolkin_maya_settings_page'
    );
});

function tzolkin_maya_settings_page() {
    // Vérifier si l'utilisateur est administrateur
    if (!current_user_can('manage_options')) {
        wp_die('Vous n\'avez pas les permissions nécessaires.');
    }

    // Gestion suppression
    if (isset($_GET['tzolkin_delete']) && is_numeric($_GET['tzolkin_delete'])) {
        $people = get_option('tzolkin_people_cycles', array());
        unset($people[intval($_GET['tzolkin_delete'])]);
        update_option('tzolkin_people_cycles', array_values($people));
        echo '<div class="updated"><p>Entrée supprimée.</p></div>';
    }
    // Ajout d'une personne
    if (isset($_POST['tzolkin_add'])) {
        $people = get_option('tzolkin_people_cycles', array());
        $people[] = array(
            'name' => sanitize_text_field($_POST['person_name']),
            'color' => sanitize_hex_color($_POST['person_color']),
            'glyph' => intval($_POST['person_glyph']),
            'number' => intval($_POST['person_number'])
        );
        update_option('tzolkin_people_cycles', $people);
        echo '<div class="updated"><p>Nouvelle entrée ajoutée.</p></div>';
    }
    // Mise à jour du mot de passe administrateur
    if (isset($_POST['tzolkin_admin_submit'])) {
        $admin_password = sanitize_text_field($_POST['tzolkin_admin_password']);
        update_option('tzolkin_admin_password', $admin_password);
        echo '<div class="updated"><p>Mot de passe administrateur mis à jour !</p></div>';
    }

    $people = get_option('tzolkin_people_cycles', array());
    $current_admin_password = get_option('tzolkin_admin_password', '');
    echo '<div class="wrap"><h1>Cycles de personnes Tzolk’in</h1>';
    echo '<h2>Ajouter une personne</h2>';
    echo '<form method="post" style="margin-bottom:24px;">';
    echo '<table><tr>';
    echo '<td>Nom :</td><td><input type="text" name="person_name" required placeholder="Nom de la personne" /></td>';
    echo '<td>Couleur :</td><td><input type="color" name="person_color" value="#ffeedd" required /></td>';
    echo '<td>Glyphe d\'entrée :</td><td><select name="person_glyph">';
    for ($i=1; $i<=20; $i++) echo '<option value="'.$i.'">'.$i.'</option>';
    echo '</select></td>';
    echo '<td>Chiffre d\'entrée :</td><td><select name="person_number">';
    for ($i=1; $i<=13; $i++) echo '<option value="'.$i.'">'.$i.'</option>';
    echo '</select></td>';
    echo '<td><input type="submit" name="tzolkin_add" class="button button-primary" value="Ajouter" /></td>';
    echo '</tr></table>';
    echo '</form>';
    if ($people && count($people)>0) {
        echo '<h2>Liste des cycles de personnes</h2>';
        echo '<table class="widefat fixed" style="max-width:800px;"><thead><tr><th>#</th><th>Nom</th><th>Couleur</th><th>Glyphe</th><th>Chiffre</th><th>Action</th></tr></thead><tbody>';
        foreach ($people as $idx=>$p) {
            echo '<tr>';
            echo '<td>'.($idx+1).'</td>';
            echo '<td>'.esc_html($p['name']).'</td>';
            echo '<td><span style="display:inline-block;width:24px;height:24px;background:'.esc_attr($p['color']).';border-radius:4px;"></span> '.esc_html($p['color']).'</td>';
            echo '<td style="text-align:center">'.intval($p['glyph']).'</td>';
            echo '<td style="text-align:center">'.intval($p['number']).'</td>';
            echo '<td><a href="?page=tzolkin-maya-settings&tzolkin_delete='.$idx.'" onclick="return confirm(\'Supprimer cette entrée ?\');">Supprimer</a></td>';
            echo '</tr>';
        }
        echo '</tbody></table>';
    } else {
        echo '<p>Aucune personne enregistrée.</p>';
    }
    // Section pour le mot de passe administrateur
    echo '<h2>Mot de passe administrateur</h2>';
    echo '<p>Ce mot de passe est utilisé pour afficher la liste des clés des utilisateurs dans l\'application Tzolkin.</p>';
    echo '<form method="post" action="">';
    echo '<table class="form-table">';
    echo '<tr>';
    echo '<th><label for="tzolkin_admin_password">Mot de passe administrateur</label></th>';
    echo '<td><input type="text" name="tzolkin_admin_password" id="tzolkin_admin_password" value="' . esc_attr($current_admin_password) . '" class="regular-text"></td>';
    echo '</tr>';
    echo '</table>';
    echo '<input type="submit" name="tzolkin_admin_submit" class="button button-primary" value="Enregistrer">';
    echo '</form>';
    // Section pour afficher la liste des clés
    echo '<h2>Liste des clés des utilisateurs</h2>';
    $storage_dir = WP_CONTENT_DIR . '/uploads/tzolkin-data/';
    $keys_file = $storage_dir . 'keys.json';
    if (file_exists($keys_file)) {
        $keys_data = json_decode(file_get_contents($keys_file), true) ?: ['keys' => []];
        $keys_list = $keys_data['keys'];
        if (!empty($keys_list)) {
            echo '<table class="widefat fixed" style="max-width:800px;"><thead><tr><th>Identifiant</th><th>Hash de la clé</th></tr></thead><tbody>';
            foreach ($keys_list as $hash => $label) {
                echo '<tr>';
                echo '<td>' . esc_html($label) . '</td>';
                echo '<td>' . esc_html(substr($hash, 0, 8)) . '...</td>';
                echo '</tr>';
            }
            echo '</tbody></table>';
        } else {
            echo '<p>Aucune clé enregistrée pour le moment.</p>';
        }
    } else {
        echo '<p>Le fichier des clés n\'existe pas encore. Ajoutez des utilisateurs dans l\'application pour qu\'ils apparaissent ici.</p>';
    }
    // Section de débogage
    echo '<h2>Débogage : tzolkin_people_cycles</h2>';
    echo '<pre>';
    var_dump(get_option('tzolkin_people_cycles'));
    echo '</pre>';
    echo '</div>';
}
?>