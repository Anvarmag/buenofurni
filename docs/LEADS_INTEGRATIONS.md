# Система сбора и уведомления о заявках (Leads Integration) — BUENOFURNI

## 1. Назначение документа
Описать архитектуру и логику работы системы сбора лидов (заявок от клиентов). Основной поток данных: **Website (Frontend) -> VPS API (Backend скрипт) -> Telegram + Email (Уведомления менеджеру).**
В системе предусмотрено разделение на два потока (Lead Flows): **B2C** (Обычные розничные клиенты) и **B2B** (Оптовики, HoReCa, Дизайн-студии).

## 2. Спецификация API (Endpoint API)
Фронтенд отправляет заявку через AJAX `fetch` запрос к единому endpoint на VPS. Разделение типов заявок происходит через поле `leadType`.

*   **URL:** `POST /api/leads` (относительный путь на том же домене, или полный URL `api.buenofurni.com`).
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Accept: application/json`

### 2.1. Request Body: Розничная заявка (B2C)
Отправляется из стандартного окна `#request-modal`.
```json
{
  "leadType": "b2c",
  "name": "Александр",
  "phone": "+7 (999) 123-45-67",
  "source": "product_page_detail",
  "pageUrl": "https://buenofurni.ru/product/lounge-chair",
  "hp": "" 
}
```

### 2.2. Request Body: Оптовая заявка (B2B / HoReCa)
Отправляется из модального окна `horeca-request-modal.md`.
```json
{
  "leadType": "b2b",
  "company": "Ресторан Густо",
  "contactName": "Мария",
  "phone": "+7 (999) 000-11-22",
  "quantity": "40",
  "comment": "Нужны стулья из темного дуба со спец-обивкой.",
  "source": "horeca_hero_btn",
  "pageUrl": "https://buenofurni.ru/horeca",
  "hp": "" 
}
```

*   **Серверные поля (Backend-generated):** К любому типу заявки сервер автоматически добавляет `timestamp` (МСК), `ip` (опционально) и `user_agent` (опционально).

## 3. Доставка в Telegram (Telegram Delivery)
Используется **Telegram Bot API**. Боту отправляются разные шаблоны сообщений в зависимости от флага `leadType`.

*   **Переменные окружения:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

### 3.1. Шаблон сообщения B2C (Розничная)
```text
НОВАЯ ЗАЯВКА — BUENOFURNI 🪑

👤 Имя: Александр
📞 Телефон: +7 (999) 123-45-67

🌐 Источник: product_page_detail
🔗 Страница: https://buenofurni.ru/product/lounge-chair
⏱ Дата: 26.02.2026, 15:45 (МСК)
```

### 3.2. Шаблон сообщения B2B (Опт / HoReCa)
```text
🔥 НОВАЯ HoReCa ЗАЯВКА (B2B) 🔥

🏢 Компания: Ресторан Густо
👤 Контакт: Мария
📞 Телефон: +7 (999) 000-11-22
📦 Объем: 40 шт.

💬 Комментарий: Нужны стулья из темного дуба со спец-обивкой.

🌐 Источник: horeca_hero_btn
🔗 Страница: https://buenofurni.ru/horeca
⏱ Дата: 26.02.2026, 15:50 (МСК)
```

## 4. Доставка на Email (Email Delivery)
Параллельное дублирование заявок на почту с использованием независимого от провайдера SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_TO`).

### 4.1. Email B2C
*   **Тема (Subject):** `BUENOFURNI - Новая заявка от клиента Александр`
*   **Тело (Body):** Аналогично Telegram B2C (`name`, `phone`, `source`, `pageUrl`, `timestamp`).

### 4.2. Email B2B (HoReCa)
*   **Тема (Subject):** `BUENOFURNI - HoReCa заявка (B2B) от Ресторан Густо`
*   **Тело (Body):** Содержит все B2B поля (`company`, `contactName`, `phone`, `quantity`, `comment`, `source`, `pageUrl`, `timestamp`). Верстка может включать HTML-таблицу для удобства чтения менеджером.

## 5. Безопасность и Валидация (Security & Anti-spam)
*   **Honeypot-поле (`hp`):** Присутствует в обеих формах. Если скрытое CSS поле `hp` заполнено, бэкенд игнорирует заявку, но возвращает статус `200 OK` (обманка для ботов).
*   **Rate Limiting:** Базовое ограничение (например, 10 запросов / 10 минут с одного IP) на эндпойнт `/api/leads`.
*   **Server-side валидация B2B:** 
    *   `company`: от 2 до 80 символов (санитаризация HTML).
    *   `contactName` / `name`: от 2 до 50 символов.
    *   `phone`: регулярное выражение (знак плюс, цифры, скобки, тире).
    *   `quantity` (для B2B): Приведение к `Number()`, проверка `> 0`. Должно быть валидным числом.
*   **CORS:** Сервер настроен (напр. в Express) на прием POST запросов только из доверенных Origin (напр. `https://buenofurni.ru`).

## 6. Надежность (Reliability Fallbacks)
Сбой одного канала (Telegram) не прерывает работу другого (Email).
*   Сервер запускает отправку через `Promise.allSettled`.
*   Возвращает клиенту HTTP `200 OK`, если **минимум один** из каналов (TG или Email) успешно доставил заявку.
*   Возвращает `500 Internal Server Error` только если **оба** канала упали.
