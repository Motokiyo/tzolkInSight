<?php
/*
 * Tzolkin App Autonome - Point d'entrée principal
 * Version: 1.49
 */

require_once __DIR__ . '/wp-functions.php';
require_once __DIR__ . '/tzolkin-splash.php';
require_once __DIR__ . '/tzolkin-widget.php';
require_once __DIR__ . '/tzolkin-menu.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tzolkin du Parédé</title>
    <link rel="stylesheet" href="./style.css">
    <link rel="stylesheet" href="./tzolkin-splash.css">
    <link rel="stylesheet" href="./tzolkin-menu.css">
    <link rel="stylesheet" href="./tzolkin-details.css">
    <link rel="stylesheet" href="./tzolkin-page.css">
    <link rel="manifest" href="./manifest.json">
    <meta name="theme-color" content="#ded2b3">
    <meta name="background-color" content="#ded2b3">
</head>
<body>
    <div class="tzolkin-app">
        <!-- Écran de démarrage -->
        <div id="splash-screen">
            <?php include __DIR__ . '/tzolkin-splash.php'; ?>
        </div>
        
        <!-- Widget principal -->
        <main class="tzolkin-main">
            <?php
            $widget = new Tzolkin_Maya_Widget();
            echo $widget->render_widget();
            ?>
        </main>
        
        <!-- Menu et modales -->
        <?php include __DIR__ . '/tzolkin-menu.php'; ?>
    </div>

    <!-- Scripts -->
    <script src="./imask.js"></script>
    <script src="./tzolkin-modales.js"></script>
    <script src="./tzolkin-app-interactive.js"></script>
    <script src="./tzolkin-details.js"></script>
    
    <!-- Service Worker -->
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js', { scope: './' })
                .then((registration) => {
                    console.log('Service Worker enregistré avec succès:', registration);
                })
                .catch((error) => {
                    console.error('Erreur d'enregistrement du Service Worker:', error);
                });
        }
    </script>
</body>
</html>
