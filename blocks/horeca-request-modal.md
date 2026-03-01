# Блок: HoReCa Request Modal (B2B модальное окно заявки) — BUENOFURNI

## 1. Цель блока
Предоставить выделенный, профессиональный инструмент для лидогенерации B2B-заказчиков (владельцев кафе, ресторанов, отелей). В отличие от стандартной формы заказа (`#request-modal`), эта форма собирает специфичные деловые данные (название компании, требуемый объем) для более точной подготовки коммерческого предложения (КП) отделом продаж.

## 2. UX логика (Триггеры и закрытие)
*   **Когда открывается:** По клику на любые CTA-кнопки B2B-направленности, например `"Получить коммерческое предложение"`, `"Заказать оптом"`, `"Сотрудничество"` на странице HoReCa (и опционально в подвале/шапке).
*   **State-состояния UI:**
    *   *Loading:* Блокировка кнопки, текст меняется на `"Отправляем..."`.
    *   *Success:* Скрытие формы без закрытия самого модального окна и вывод текста: *"Заявка принята. Мы подготовим КП и свяжемся с вами."*
    *   *Error:* Вывод красного текста поверх формы: *"Не удалось отправить. Напишите нам в WhatsApp/Telegram."*
*   **Как закрывается:** Клик по иконке крестика, клик по затемненному фону (`.overlay`), нажатие клавиши `Escape` на клавиатуре.

## 3. Структура DOM (HTML Blueprint)
Опционально форму можно разбить на визуальные шаги-колонки, но для простоты мы оставляем в виде единой ленты (Single-column layout).

*   `<dialog id="horeca-modal" class="request-modal b2b-modal" aria-labelledby="b2b-modal-title" aria-modal="true">`
    *   `<div class="request-modal__overlay"></div>`
    *   `<div class="request-modal__container">`
        *   `<button class="request-modal__close-btn" aria-label="Закрыть окно"></button>`
        *   `<div class="request-modal__content">`
            *   `<h2 id="b2b-modal-title">Получить коммерческое предложение</h2>`
            *   `<form id="b2bLeadForm" class="b2b-form">`
                *   `<input type="text" name="hp" class="hidden-honeypot" tabindex="-1" style="display:none;" aria-hidden="true">`
                *   `<input type="hidden" name="source" value="horeca_btn">`
                *   `<input type="hidden" name="pageUrl" value="https://...">`
                *   
                *   `<div class="form-group">`
                    *   `<label for="b2b-company">Название компании или заведения</label>`
                    *   `<input type="text" id="b2b-company" name="companyName" required>`
                *   `<div class="form-group">`
                    *   `<label for="b2b-name">Контактное лицо</label>`
                    *   `<input type="text" id="b2b-name" name="contactName" required>`
                *   `<div class="form-group">`
                    *   `<label for="b2b-phone">Телефон</label>`
                    *   `<input type="tel" id="b2b-phone" name="phone" required placeholder="+7">`
                *   `<div class="form-group">`
                    *   `<label for="b2b-qty">Примерное количество (шт.)</label>`
                    *   `<input type="number" id="b2b-qty" name="quantity" min="1" step="1">`
                *   `<div class="form-group form-group--optional">`
                    *   `<label for="b2b-comment">Комментарий к проекту (опционально)</label>`
                    *   `<textarea id="b2b-comment" name="comment" rows="2"></textarea>`
                *   `<p class="legal-disclaimer">Нажимая кнопку, вы соглашаетесь с условиями обработки данных.</p>`
                *   `<button type="submit" class="btn btn--primary submit-btn">Получить КП</button>`

## 4. Валидация (Client-side & Server-side rules)
Строгая проверка данных на стороне HTML5 для предотвращения "мусорных" заявок:
*   **Компания (`companyName`):** `minlength="2" maxlength="80"`.
*   **Контактное лицо (`contactName`):** `minlength="2" maxlength="50"`. Только буквы и пробел.
*   **Телефон (`phone`):** Проверка по регулярному выражению (`pattern`). Разрешены цифры, плюсы, скобки, тире (длина от 7 до 20 символов).
*   **Количество (`quantity`):** `type="number"`, `min="1"`, `max="9999"`, вводимое значение только целое (`step="1"`).

## 5. Mobile-first особенности (Responsive)
*   **Fullscreen Modal:** На малых экранах (меньше `768px`) окно обязательно занимает вес экран (`100vw`, `100vh`), работая как отдельный экран смартфона, что не отвлекает пользователя.
*   **Large inputs:** Размер полей ввода — минимум `48px` высотой с внутренними отступами (`padding`) для комфортного клика большим пальцем. Размер шрифта (font-size) у инпутов строго `16px` для блокировки встроенного автоматического зума `iOS Safari`.
*   **Sticky submit:** Так как полей много, на телефоне кнопка *"Получить КП"* должна быть зафиксирована (`position: sticky`, `bottom: 0`, `z-index: 10`) внизу области прокрутки контейнера, чтобы избежать дополнительных лишних свайпов.

## 6. Защита от спама (Anti-spam)
*   **Honeypot:** Форма содержит невидимое для пользователя текстовое поле `name="hp"` (`.hidden-honeypot`). Если при POST-запросе это поле заполнено (что делают только боты парсеры интерфейсов HTML), заявка сервером не отправляется на почту менеджерам, а `API` тихо отдает обманный статус `200 OK`.

## 7. Интеграция (API Payload)
Данные формы сериализуются и перенаправляются AJAX (`fetch`) POST-запросом к серверному Node.js эндпойнту (например `/api/b2b-leads` или модифицированному `/api/leads`). 
*   **Состав Payload (JSON):** 
    `{ companyName, contactName, phone, quantity, comment, source, pageUrl, hp }`.

## 8. Доступность (A11y) и SEO (SEO note)
*   **ARIA Roles:** Использование `aria-labelledby="b2b-modal-title"`. Сообщения успеха и ошибок должны иметь `aria-live="polite"` для немедленной озвучки через Screen Readers.
*   **Focus Trap & Esc:** Фокус клавиатуры обязан "закручиваться" внутри окна. Клавиша `Esc` мгновенно закрывает окно. Все инпуты и кнопки должны иметь явный выделенный контур при фокусе с клавиатуры (`:focus-visible`). Скролл окна (`<body>`) блокируется. 
*   **SEO Note:** Так как модальные окна не несут самостоятельной индексируемой ценности, Google не сканирует их детально. Форма может подгружаться отложенно или находиться в конце `<body>`. Это не вредит SEO, и страница `HoReCa` будет ранжироваться как коммерческий B2B лендинг независимо от этого модального окна.
