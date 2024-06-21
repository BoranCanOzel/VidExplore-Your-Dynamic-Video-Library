<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$directory = '.';
$folders = array_filter(glob($directory . '/*'), 'is_dir');

$folderNames = array_map(function($folder) {
    return basename($folder);
}, $folders);

natsort($folderNames);  // Natural order sorting

echo json_encode(array_values($folderNames));  // Ensure the array is re-indexed
?>
