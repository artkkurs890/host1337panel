const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Секретные данные (потом вынесем в переменные окружения)
const CORRECT_LOGIN = "floplusta"; // Логин из первой серии
const CORRECT_PASSWORD = "$jigfp89"; // Пароль из книги предателя

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Проверка: авторизован ли пользователь?
const authMiddleware = (req, res, next) => {
    if (req.cookies.auth_token === 'authorized_session_777') {
        next();
    } else {
        res.redirect('/login');
    }
};

// Главная страница панели (защищена)
app.get('/', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Страница входа
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Обработка логина
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === CORRECT_LOGIN && password === CORRECT_PASSWORD) {
        res.cookie('auth_token', 'authorized_session_777', { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    } else {
        // Можно добавить задержку, чтобы имитировать "медленный" хостинг
        res.send("Invalid credentials. System reported this attempt to 13377777.xyz security team.");
    }
});

app.listen(PORT, () => {
    console.log(`Panel is running on http://localhost:${PORT}`);
});