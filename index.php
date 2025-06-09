<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Формы входа и регистрации</title>
    <style>
        .form-container { margin: 20px; padding: 20px; border: 1px solid #ccc; width: 300px; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Регистрация</h2>
        <?php if (isset($_GET['reg_error'])): ?>
            <p class="error"><?php echo htmlspecialchars($_GET['reg_error']); ?></p>
        <?php endif; ?>
        <?php if (isset($_GET['reg_success'])): ?>
            <p class="success">Регистрация успешна!</p>
        <?php endif; ?>
        
        <form action="register.php" method="post">
            <div>
                <label for="reg_username">Имя пользователя:</label>
                <input type="text" id="reg_username" name="username" 
                       value="<?php echo isset($_GET['reg_username']) ? htmlspecialchars($_GET['reg_username']) : ''; ?>">
            </div>
            <div>
                <label for="reg_email">Email:</label>
                <input type="email" id="reg_email" name="email" 
                       value="<?php echo isset($_GET['reg_email']) ? htmlspecialchars($_GET['reg_email']) : ''; ?>">
            </div>
            <div>
                <label for="reg_password">Пароль:</label>
                <input type="password" id="reg_password" name="password">
            </div>
            <div>
                <label for="reg_password_confirm">Подтвердите пароль:</label>
                <input type="password" id="reg_password_confirm" name="password_confirm">
            </div>
            <button type="submit">Зарегистрироваться</button>
        </form>
    </div>

    <div class="form-container">
        <h2>Вход</h2>
        <?php if (isset($_GET['login_error'])): ?>
            <p class="error"><?php echo htmlspecialchars($_GET['login_error']); ?></p>
        <?php endif; ?>
        
        <form action="login.php" method="post">
            <div>
                <label for="login_username">Имя пользователя или Email:</label>
                <input type="text" id="login_username" name="username" 
                       value="<?php echo isset($_GET['login_username']) ? htmlspecialchars($_GET['login_username']) : ''; ?>">
            </div>
            <div>
                <label for="login_password">Пароль:</label>
                <input type="password" id="login_password" name="password">
            </div>
            <button type="submit">Войти</button>
        </form>
    </div>
</body>
</html>