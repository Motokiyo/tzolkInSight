<?php
// tzolkin-save.php : Sauvegarde et chargement des données pour Tzolkin

header('Content-Type: application/json');

// Chemin du dossier où stocker les données
$storage_dir = __DIR__ . '/../../uploads/tzolkin-data/';
if (!file_exists($storage_dir)) {
    mkdir($storage_dir, 0755, true);
}

// Fichier de suivi des clés
$keys_file = $storage_dir . 'keys.json';

// Récupérer les données envoyées
$input = json_decode(file_get_contents('php://input'), true);
$action = isset($input['action']) ? $input['action'] : '';
$user_key = isset($input['user_key']) ? $input['user_key'] : '';
$data = isset($input['data']) ? $input['data'] : [];
$note = isset($input['note']) ? $input['note'] : null;
$date = isset($input['date']) ? $input['date'] : '';
$admin_password = isset($input['admin_password']) ? $input['admin_password'] : '';

// Vérifier que la clé utilisateur est fournie (sauf pour l'action admin)
if (empty($user_key) && $action !== 'admin_list') {
    echo json_encode(['success' => false, 'message' => 'Clé utilisateur manquante']);
    exit;
}

function tzolkin_is_list_array($arr) {
    if (!is_array($arr)) {
        return false;
    }
    $expected = range(0, count($arr) - 1);
    return array_keys($arr) === $expected;
}

function tzolkin_read_notes($file_path) {
    if (!file_exists($file_path)) {
        return [];
    }
    $decoded = json_decode(file_get_contents($file_path), true);
    if (!is_array($decoded)) {
        return [];
    }
    if (tzolkin_is_list_array($decoded)) {
        return $decoded;
    }
    return array_values($decoded);
}

function tzolkin_write_notes($file_path, $notes) {
    if (!is_array($notes)) {
        $notes = [];
    }
    if (file_exists($file_path)) {
        @copy($file_path, $file_path . '.bak');
    }
    return file_put_contents($file_path, json_encode($notes, JSON_PRETTY_PRINT), LOCK_EX);
}

// Générer un nom de fichier basé sur un hash de la clé utilisateur
$file_hash = hash('sha256', $user_key);
$file_path = $storage_dir . $file_hash . '.json';

// Charger ou initialiser le fichier des clés
$keys_data = [];
if (file_exists($keys_file)) {
    $keys_data = json_decode(file_get_contents($keys_file), true) ?: ['keys' => []];
} else {
    $keys_data = ['keys' => []];
}

// Action : sauvegarder les données
if ($action === 'save') {
    // Ajouter ou mettre à jour la clé dans keys.json si elle est nouvelle
    if (!isset($keys_data['keys'][$file_hash])) {
        $user_count = count($keys_data['keys']) + 1;
        $keys_data['keys'][$file_hash] = "Utilisateur $user_count";
        file_put_contents($keys_file, json_encode($keys_data, JSON_PRETTY_PRINT));
    }

    $incoming = tzolkin_is_list_array($data) ? $data : (is_array($data) ? array_values($data) : []);
    $existing = tzolkin_read_notes($file_path);

    // Si une sauvegarde vide arrive alors qu'il y a déjà des données, on l'ignore pour éviter l'écrasement.
    if (empty($incoming) && !empty($existing)) {
        echo json_encode(['success' => true, 'message' => 'Sauvegarde vide ignorée (données existantes conservées)']);
        exit;
    }

    // Fusion par date: on conserve toutes les anciennes notes qui ne sont pas dans l'entrée, on remplace celles qui existent par la version entrante.
    $byDate = [];
    foreach ($existing as $n) {
        if (is_array($n) && isset($n['date'])) {
            $byDate[$n['date']] = $n;
        }
    }
    foreach ($incoming as $n) {
        if (is_array($n) && isset($n['date'])) {
            $byDate[$n['date']] = $n;
        }
    }
    $merged = array_values($byDate);

    if (tzolkin_write_notes($file_path, $merged)) {
        echo json_encode(['success' => true, 'message' => 'Données fusionnées et sauvegardées']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde']);
    }
    exit;
}

// Action : charger les données
if ($action === 'load') {
    if (file_exists($file_path)) {
        $saved_data = tzolkin_read_notes($file_path);
        echo json_encode(['success' => true, 'data' => $saved_data]);
    } else {
        echo json_encode(['success' => true, 'data' => []]);
    }
    exit;
}

if ($action === 'upsert_note') {
    if (!is_array($note) || empty($note['date'])) {
        echo json_encode(['success' => false, 'message' => 'Note invalide']);
        exit;
    }

    if (!isset($keys_data['keys'][$file_hash])) {
        $user_count = count($keys_data['keys']) + 1;
        $keys_data['keys'][$file_hash] = "Utilisateur $user_count";
        file_put_contents($keys_file, json_encode($keys_data, JSON_PRETTY_PRINT));
    }

    $notes = tzolkin_read_notes($file_path);
    $found_index = -1;
    foreach ($notes as $idx => $n) {
        if (is_array($n) && isset($n['date']) && $n['date'] === $note['date']) {
            $found_index = $idx;
            break;
        }
    }
    if ($found_index >= 0) {
        $notes[$found_index] = $note;
    } else {
        $notes[] = $note;
    }

    if (tzolkin_write_notes($file_path, $notes)) {
        echo json_encode(['success' => true, 'message' => 'Note enregistrée']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde']);
    }
    exit;
}

if ($action === 'delete_note') {
    if (empty($date)) {
        echo json_encode(['success' => false, 'message' => 'Date manquante']);
        exit;
    }

    $notes = tzolkin_read_notes($file_path);
    $new_notes = [];
    foreach ($notes as $n) {
        if (is_array($n) && isset($n['date']) && $n['date'] === $date) {
            continue;
        }
        $new_notes[] = $n;
    }

    if (tzolkin_write_notes($file_path, $new_notes)) {
        echo json_encode(['success' => true, 'message' => 'Note supprimée']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression']);
    }
    exit;
}

// Action : lister les clés (pour admin)
if ($action === 'admin_list') {
    $stored_password = get_option('tzolkin_admin_password', '');
    if ($admin_password === $stored_password && !empty($stored_password)) {
        $keys_list = [];
        foreach ($keys_data['keys'] as $hash => $label) {
            $keys_list[] = ['hash' => $hash, 'label' => $label];
        }
        echo json_encode(['success' => true, 'keys' => $keys_list]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Mot de passe admin incorrect']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Action invalide']);
?>