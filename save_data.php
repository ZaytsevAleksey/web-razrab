<?php
header('Content-Type: text/plain');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['filename']) || !isset($input['data'])) {
    die('Ошибка: Неверные данные');
}

$filename = $input['filename'];
$data = $input['data'];

$content = "Новые данные (" . date('Y-m-d H:i:s') . "):\n";
foreach ($data as $key => $value) {
    $content .= "$key: $value\n";
}
$content .= "\n";

$result = file_put_contents($filename, $content, FILE_APPEND | LOCK_EX);

if ($result === false) {
    die('Ошибка при сохранении файла');
} else {
    echo "Данные успешно сохранены в $filename";
}
?>