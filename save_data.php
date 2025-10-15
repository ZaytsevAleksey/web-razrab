<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['filename']) || !isset($input['data'])) {
        die(json_encode(['error' => 'Invalid data']));
    }

    $filename = $input['filename'];
    $data = $input['data'];

    // Форматируем данные для записи
    $content = "New registration (" . date('Y-m-d H:i:s') . "):\n";
    $content .= "name: " . ($data['name'] ?? '') . "\n";
    $content .= "email: " . ($data['email'] ?? '') . "\n";
    $content .= "password: " . ($data['password'] ?? '') . "\n";
    $content .= "password2: " . ($data['password2'] ?? '') . "\n";
    $content .= "----------------------------------------\n\n";

    // Записываем в файл
    $result = file_put_contents($filename, $content, FILE_APPEND | LOCK_EX);

    if ($result === false) {
        die(json_encode(['error' => 'Failed to save registration data']));
    } else {
        echo json_encode(['success' => "Registration data saved to $filename"]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getUsers') {
    // Парсим существующих пользователей из register_data.txt
    $users = [];
    
    if (file_exists('register_data.txt')) {
        $content = file_get_contents('register_data.txt');
        $entries = explode("----------------------------------------", $content);
        
        foreach ($entries as $entry) {
            if (empty(trim($entry))) continue;
            
            $lines = explode("\n", trim($entry));
            $user = [];
            
            foreach ($lines as $line) {
                if (strpos($line, ': ') !== false) {
                    list($key, $value) = explode(': ', $line, 2);
                    $key = trim($key);
                    $value = trim($value);
                    
                    if (in_array($key, ['name', 'email', 'password']) && !empty($value)) {
                        $user[$key] = $value;
                    }
                }
            }
            
            // Добавляем пользователя только если есть email и пароль
            if (isset($user['email']) && isset($user['password']) && !empty($user['email'])) {
                // Проверяем, нет ли уже такого пользователя в массиве
                $exists = false;
                foreach ($users as $existingUser) {
                    if ($existingUser['email'] === $user['email']) {
                        $exists = true;
                        break;
                    }
                }
                
                if (!$exists) {
                    $users[] = $user;
                }
            }
        }
    }
    
    echo json_encode($users);
    
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>