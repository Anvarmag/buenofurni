/**
 * Модуль интеграции с Telegram Bot API
 * Осуществляет доставку лидов в персональный чат или рабочую группу менеджеров.
 */

export async function sendTelegramMessage(data) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // В случае если конфигурация пропущена в .env файле
    if (!botToken || !chatId) {
        console.warn('Сервис Telegram: токены отсутствуют. Отправка отменена.');
        return false;
    }

    // Формирование текстового шаблона на русском языке
    let message = `УРА! Новая заявка с сайта!\n` +
        `Имя: ${data.name}\n` +
        `Телефон: ${data.phone}\n`;

    if (data.company) {
        message += `Компания: ${data.company}\n`;
    }
    if (data.quantity) {
        message += `Кол-во стульев: ${data.quantity}\n`;
    }
    if (data.comment) {
        message += `Комментарий: ${data.comment}\n`;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        // Отправляем HTTP POST запрос средствами Node.js (fetch доступен с Node 18)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });

        // Проверяем статус HTTP ответа от Telegram
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка Telegram API. Код: ${response.status}. Тело ответа: ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error('Ошибка в telegram.js во время отправки:', error);
        return false;
    }
}
