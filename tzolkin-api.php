<?php
header('Content-Type: application/json');
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$date = new DateTime();
$date->modify("+$offset days");
$gregorian_date = $date->format('d/m/Y');

$glyphs = ['Imix', 'Ik', 'Akbal', 'Kan', 'Chikchan', 'Kimi', 'Manik', 'Lamat', 'Muluk', 'Ok', 'Chuwen', 'Eb', 'Ben', 'Ix', 'Men', 'Kib', 'Kaban', 'Etznab', 'Kawak', 'Ajaw'];
$numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
$glyph_index = ($offset % 20 + 20) % 20;
$number_index = ($offset % 13 + 13) % 13;

echo json_encode([
    'gregorian' => $gregorian_date,
    'glyph' => $glyphs[$glyph_index],
    'number' => $numbers[$number_index],
    'glyph_url' => "https://leparede.org/wp-content/themes/astra-child/assets/glyphs/MAYA-g-log-cal-D" . str_pad($glyph_index + 1, 2, '0', STR_PAD_LEFT) . "-{$glyphs[$glyph_index]}.svg",
    'number_url' => "https://leparede.org/wp-content/themes/astra-child/assets/numbers/Maya_" . ($number_index + 1) . ".svg"
]);
?>