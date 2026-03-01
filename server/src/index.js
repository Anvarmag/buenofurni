import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import leadsRouter from './routes/leads.js';

// Загрузка переменных окружения из файла .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Использование helmet для обеспечения базовой безопасности HTTP заголовков
app.use(helmet());

// Настройка CORS политик
// Разрешаем запросы только с домена, указанного в .env (например, фронтенд сайта)
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Парсинг тела запроса (req.body) в формате JSON
app.use(express.json());

// Ограничение частоты запросов (Rate Limiting)
// Это защитит от спама и DDoS атак на endpoint заявок. Максимум 30 запросов за 10 минут с одного IP.
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // Временное окно в 10 минут
    limit: 30, // Лимит запросов за одно окно
    message: { ok: false, error: 'Слишком много запросов. Пожалуйста, подождите немного.' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// Применение лимита скорости для всех путей, начинающихся с /api/
app.use('/api/', limiter);

// Регистрация маршрутов
app.use('/api/leads', leadsRouter);

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error('Необработанная ошибка сервера:', err);
    res.status(500).json({ ok: false, error: 'Внутренняя ошибка сервера' });
});

// Запуск прослушивания порта
app.listen(PORT, () => {
    console.log(`Сервер BUENOFURNI API запущен на порту ${PORT}`);
});
