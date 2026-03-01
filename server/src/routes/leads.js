import express from 'express';
import { sendTelegramMessage } from '../services/telegram.js';
import { sendEmail } from '../services/email.js';

const router = express.Router();

// Регулярное выражение для проверки номера телефона. 
// Разрешены плюс, минус, круглые скобки, пробелы и цифры. Длина от 7 до 20 символов.
const phoneRegex = /^[0-9+\-()\s]{7,20}$/;

/**
 * POST /api/leads
 * Обрабатывает заявки с фронтенда, валидирует данные и отправляет уведомления менеджеру
 */
router.post('/', async (req, res) => {
    try {
        const { name, phone, source, pageUrl, hp, company, quantity, comment } = req.body;

        // 1. Проверка поля-приманки (Honeypot)
        // Honeypot не видим для обычных людей. Если спам-бот заполняет это скрытое поле (hp), 
        // мы тихо прерываем обработку, но возвращаем 200 OK, чтобы ввести бота в заблуждение.
        if (hp && hp.trim() !== '') {
            console.log('Обнаружен спам-бот через поле honeypot');
            return res.status(200).json({ ok: true });
        }

        // 2. Валидация входных данных, приходящих с фронтенда:
        // Имя: строка от 2 до 50 символов
        if (!name || typeof name !== 'string' || name.length < 2 || name.length > 50) {
            return res.status(400).json({ ok: false, error: 'Пожалуйста, укажите корректное имя' });
        }

        // Телефон: проверка через Regex
        if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone)) {
            return res.status(400).json({ ok: false, error: 'Пожалуйста, укажите корректный номер телефона' });
        }

        // 3. Подготовка объекта заявки (Payload)
        const leadData = {
            name: name.trim(),
            phone: phone.trim(),
            company: company ? company.trim() : '',
            quantity: quantity ? quantity.trim() : '',
            comment: comment ? comment.trim() : '',
            source: source || 'Не указан',
            pageUrl: pageUrl || 'Не указан',
            date: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) // Дата в МСК
        };

        // 4. Параллельная отправка уведомлений
        // Инициируем сразу обе отправки и дожидаемся их выполнения независимо друг от друга.
        const [telegramResult, emailResult] = await Promise.allSettled([
            sendTelegramMessage(leadData),
            sendEmail(leadData)
        ]);

        const isTelegramSuccess = telegramResult.status === 'fulfilled' && telegramResult.value;
        const isEmailSuccess = emailResult.status === 'fulfilled' && emailResult.value;

        // 5. Принятие решения об успехе запроса
        // Запрос успешен, если хотя бы один из каналов уведомлений отработал корректно.
        if (isTelegramSuccess || isEmailSuccess) {

            // Если один из каналов все-таки упал, логируем это для админа
            if (!isTelegramSuccess) {
                console.error('Предупреждение: Отправка в Telegram не удалась', telegramResult.reason);
            }
            if (!isEmailSuccess) {
                console.error('Предупреждение: Отправка на Email не удалась', emailResult.reason);
            }

            return res.status(200).json({ ok: true });

        } else {
            // Если ни почта, ни телеграм не работают — заявка потеряна, возвращаем 500.
            console.error('КРИТИЧЕСКАЯ ОШИБКА: Заявка не доставлена ни в один канал');
            return res.status(500).json({ ok: false, error: 'Не удалось отправить заявку. Попробуйте напрямую в мессенджере.' });
        }

    } catch (error) {
        console.error('Ошибка исполнения маршрута /api/leads:', error);
        res.status(500).json({ ok: false, error: 'Внутренняя ошибка сервера' });
    }
});

export default router;
