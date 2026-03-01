import nodemailer from 'nodemailer';

/**
 * Модуль интеграции Email (SMTP).
 * Осуществляет резервную доставку заявок на рабочую почту.
 */

// Глобальная переменная для ленивой инициализации SMTP-транспортера
let transporter = null;

/**
 * Инициализирует и возвращает экземпляр nodemailer transporter
 */
function getTransporter() {
    // Если он уже инициализирован, не переподключаемся
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    // Парсим порт и выбираем SSL/TLS протокол защиты
    const portNumber = parseInt(SMTP_PORT || '465', 10);
    const isSecure = (portNumber === 465); // Для 465 порта всегда secure: true (SSL)

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: portNumber,
        secure: isSecure,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    return transporter;
}

/**
 * Непосредственная отправка письма о новой заявке.
 * @param {Object} data Объект с данными лида 
 * @returns {Promise<boolean>} Статус успеха отправки почты
 */
export async function sendEmail(data) {
    const { EMAIL_FROM, EMAIL_TO } = process.env;
    const mailTransporter = getTransporter();

    // Если нет настроек, отменяем процедуру (тихий выход, Telegram отработает)
    if (!mailTransporter || !EMAIL_FROM || !EMAIL_TO) {
        console.warn('Сервис Email: SMTP не настроен. Отправка отменена.');
        return false;
    }

    const subject = `BUENOFURNI - Новая заявка от клиента: ${data.name}`;

    // Форматирование содержимого письма
    const textBody = `Новая заявка BUENOFURNI\n\n` +
        `Имя: ${data.name}\n` +
        `Телефон: ${data.phone}\n` +
        `Источник: ${data.source}\n` +
        `Страница: ${data.pageUrl}\n` +
        `Дата: ${data.date}\n`;

    try {
        await mailTransporter.sendMail({
            from: `"Заявки BUENOFURNI" <${EMAIL_FROM}>`,
            to: EMAIL_TO,
            subject: subject,
            text: textBody,
            // (html: ... // здесь можно добавить HTML шаблон, если требуется в будущем)
        });

        return true;
    } catch (error) {
        console.error('Ошибка в email.js во время отправки SMTP:', error);
        return false;
    }
}
