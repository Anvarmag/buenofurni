import express from 'express';
import { sendTelegramMessage } from '../services/telegram.js';
import { sendEmail } from '../services/email.js';
import db from '../db/index.js';

const router = express.Router();

const insertLead = db.prepare(`
    INSERT INTO leads (name, phone, company, quantity, comment, lead_type, source, page_url, created_at)
    VALUES (@name, @phone, @company, @quantity, @comment, @leadType, @source, @pageUrl, @createdAt)
`);
const markDelivered = db.prepare(`
    UPDATE leads SET delivered_telegram = ?, delivered_email = ? WHERE id = ?
`);
const insertLeadEvent = db.prepare(`
    INSERT INTO events (name, path, session_id, created_at) VALUES (?, ?, ?, ?)
`);

// Регулярное выражение для проверки номера телефона. 
// Разрешены плюс, минус, круглые скобки, пробелы и цифры. Длина от 7 до 20 символов.
const phoneRegex = /^[0-9+\-()\s]{7,20}$/;

/**
 * POST /api/leads
 * Обрабатывает заявки с фронтенда, валидирует данные и отправляет уведомления менеджеру
 */
router.post('/', async (req, res) => {
    try {
        const { name, phone, source, pageUrl, hp, website, company, quantity, comment, leadType } = req.body;

        // 1. Проверка поля-приманки (Honeypot)
        // Honeypot не видим для обычных людей. Если спам-бот заполняет это скрытое поле (hp), 
        // мы тихо прерываем обработку, но возвращаем 200 OK, чтобы ввести бота в заблуждение.
        // Фронтенд шлёт поле "website", раньше проверялось только "hp" — теперь оба.
        const honeypot = (typeof hp === 'string' && hp.trim()) || (typeof website === 'string' && website.trim());
        if (honeypot) {
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

        // 4. СНАЧАЛА сохраняем заявку в базу — до любых отправок.
        // Благодаря этому заявка не теряется, даже если Telegram и почта недоступны.
        let leadId = null;
        try {
            const info = insertLead.run({
                name: leadData.name,
                phone: leadData.phone,
                company: leadData.company || null,
                quantity: leadData.quantity || null,
                comment: leadData.comment || null,
                leadType: leadType || 'b2c',
                source: leadData.source,
                pageUrl: leadData.pageUrl,
                createdAt: new Date().toISOString()
            });
            leadId = info.lastInsertRowid;
            insertLeadEvent.run(leadType === 'b2b' ? 'lead_b2b' : 'lead', leadData.pageUrl, null, new Date().toISOString());
        } catch (dbError) {
            // Сбой базы не должен мешать отправке уведомлений
            console.error('Не удалось сохранить заявку в базу:', dbError);
        }

        // 5. Параллельная отправка уведомлений
        // Инициируем сразу обе отправки и дожидаемся их выполнения независимо друг от друга.
        const [telegramResult, emailResult] = await Promise.allSettled([
            sendTelegramMessage(leadData),
            sendEmail(leadData)
        ]);

        const isTelegramSuccess = telegramResult.status === 'fulfilled' && telegramResult.value;
        const isEmailSuccess = emailResult.status === 'fulfilled' && emailResult.value;

        // 6. Фиксируем в базе, какие каналы отработали
        if (leadId !== null) {
            try {
                markDelivered.run(isTelegramSuccess ? 1 : 0, isEmailSuccess ? 1 : 0, leadId);
            } catch (dbError) {
                console.error('Не удалось обновить статус доставки заявки:', dbError);
            }
        }

        // 7. Принятие решения об успехе запроса
        if (isTelegramSuccess || isEmailSuccess) {
            // Если один из каналов все-таки упал, логируем это для админа
            if (!isTelegramSuccess) {
                console.error('Предупреждение: Отправка в Telegram не удалась', telegramResult.reason);
            }
            if (!isEmailSuccess) {
                console.error('Предупреждение: Отправка на Email не удалась', emailResult.reason);
            }
            return res.status(200).json({ ok: true });
        }

        // Оба канала недоступны. Раньше заявка на этом терялась и клиент видел ошибку.
        // Теперь она уже в базе — клиенту отвечаем успехом, а себе пишем критический лог.
        if (leadId !== null) {
            console.error('КРИТИЧНО: заявка не доставлена ни в Telegram, ни на почту. Сохранена в базе, id =', leadId);
            return res.status(200).json({ ok: true });
        }

        // Не сохранилась и не отправилась — вот это действительно потеря.
        console.error('КРИТИЧЕСКАЯ ОШИБКА: заявка не доставлена и не сохранена');
        return res.status(500).json({ ok: false, error: 'Не удалось отправить заявку. Попробуйте напрямую в мессенджере.' });

    } catch (error) {
        console.error('Ошибка исполнения маршрута /api/leads:', error);
        res.status(500).json({ ok: false, error: 'Внутренняя ошибка сервера' });
    }
});

export default router;
