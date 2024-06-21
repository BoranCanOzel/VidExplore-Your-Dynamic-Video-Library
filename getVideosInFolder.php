<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$directory = $_GET['folder'];
$items = array_diff(scandir($directory), array('..', '.'));

$allowed_extensions = array('mp4'); // Add any other video extensions you want to allow
$contents = array();

foreach ($items as $item) {
    if (is_dir($directory . '/' . $item)) {
        $contents[] = array('type' => 'folder', 'name' => $item);
    } else {
        $extension = pathinfo($item, PATHINFO_EXTENSION);
        if (in_array($extension, $allowed_extensions)) {
            $base_name = pathinfo($item, PATHINFO_FILENAME);
            $description_file = $directory . '/' . $base_name . '.txt';
            $description = file_exists($description_file) ? file_get_contents($description_file) : 'No description available.';
            $contents[] = array('type' => 'file', 'name' => $item, 'video' => $item, 'description' => $description);
        }
    }
}

usort($contents, function($a, $b) {
    return strnatcasecmp($a['name'], $b['name']);
});

header('Content-Type: application/json');
echo json_encode($contents);
?>
