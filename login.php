<?php
// Валидация данных
$errors = [];

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    $errors[] = 'Все поля обязательны для заполнения';
}

// Если есть ошибки, возвращаем на форму
if (!empty($errors)) {
    $query = http_build_query([
        'login_error' => implode('<br>', $errors),
        'login_username' => $username
    ]);
    header("Location: index.php?$query");
    exit;
}

// Проверка пользователя в файле
$file = 'users.txt';
if (!file_exists($file)) {
    header("Location: index.php?login_error=Пользователь не найден");
    exit;
}

$users = json_decode(file_get_contents($file), true);
$user_found = false;

foreach ($users as $user) {
    if (($user['username'] === $username || $user['email'] === $username) && 
        password_verify($password, $user['password'])) {
        $user_found = true;
        break;
    }
}

if ($user_found) {
    header("Location: welcome.php");
} else {
    header("Location: index.php?login_error=Неверное имя пользователя или пароль");
}
?>