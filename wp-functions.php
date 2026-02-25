<?php
// Équivalents WordPress pour l'app autonome
if (!function_exists('get_stylesheet_directory_uri')) {
    function get_stylesheet_directory_uri() {
        return './';
    }
}

if (!function_exists('get_theme_file_path')) {
    function get_theme_file_path($file) {
        return __DIR__ . '/' . $file;
    }
}
?>
