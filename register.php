<?php
// Валидация данных
$errors = [];

$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$password_confirm = $_POST['password_confirm'] ?? '';

// Проверка имени пользователя
if (empty($username)) {
    $errors[] = 'Имя пользователя обязательно для заполнения';
} elseif (strlen($username) < 3) {
    $errors[] = 'Имя пользователя должно быть не менее 3 символов';
}

// Проверка email
if (empty($email)) {
    $errors[] = 'Email обязателен для заполнения';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный формат email';
}

// Проверка пароля
if (empty($password)) {
    $errors[] = 'Пароль обязателен для заполнения';
} elseif (strlen($password) < 6) {
    $errors[] = 'Пароль должен быть не менее 6 символов';
} elseif ($password !== $password_confirm) {
    $errors[] = 'Пароли не совпадают';
}

// Если есть ошибки, возвращаем на форму
if (!empty($errors)) {
    $query = http_build_query([
        'reg_error' => implode('<br>', $errors),
        'reg_username' => $username,
        'reg_email' => $email
    ]);
    header("Location: index.php?$query");
    exit;
}

// Сохранение данных в файл
$data = [
    'username' => $username,
    'email' => $email,
    'password' => password_hash($password, PASSWORD_DEFAULT), // Хешируем пароль
    'created_at' => date('Y-m-d H:i:s')
];

$file = 'users.txt';
$current_data = file_exists($file) ? file_get_contents($file) : '';
$users = $current_data ? json_decode($current_data, true) : [];

// Проверка на существующего пользователя
foreach ($users as $user) {
    if ($user['username'] === $username) {
        header("Location: index.php?reg_error=Пользователь с таким именем уже существует");
        exit;
    }
    if ($user['email'] === $email) {
        header("Location: index.php?reg_error=Пользователь с таким email уже существует");
        exit;
    }
}

$users[] = $data;
file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));

// Редирект с сообщением об успехе
header("Location: index.php?reg_success=1");
?>