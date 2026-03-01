# Блок: Request Modal (Центральное модальное окно заявки) — BUENOFURNI

## 1. Цель блока
Создать универсальный инструмент для непрерывной лидогенерации со всех страниц сайта. Модальное окно позволяет пользователю оставить свои контакты без переходов на другие страницы и отправляет данные напрямую в `POST /api/leads`. Окно обязано внушать доверие и обеспечивать премиальный UX за счет плавной анимации и понятной обратной связи (UI states).

## 2. UX логика (User Experience)
*   **Триггеры (Вызов окна):** Модал открывается по клику на любые CTA-кнопки с намерениями:
    *   `Оставить заявку`
    *   `Рассчитать стоимость`
    *   `Получить консультацию`
*   **Состав формы (Минимализм):**
    *   Поле **"Имя"** (`name`)
    *   Поле **"Телефон"** (`phone`)
    *   Опционально: **"Комментарий"** (`comment`)
    *   **Скрытые поля (Hidden Inputs):**
        *   `source`: Идентификатор места, где была нажата кнопка (например, `hero_section` или `catalog_card`).
        *   `pageUrl`: URL текущей страницы.
        *   `hp`: Honeypot-поле (приманка для спам-ботов). Должно быть пустым.
    *   **Чекбокс согласия:** Явный чекбокс (или строгий текст) согласия с [Политикой конфиденциальности](/privacy-policy).

*   **Состояния UI (Обратная связь/UI States):**
    *   **Loading (Загрузка):** При клике на "Отправить заявку" кнопка блокируется, текст меняется на "Отправляем..." (или появляется компактный спиннер). Защищает от множественных кликов (Double Submit).
    *   **Success (Успех):** Форма плавно скрывается. Вместо нее появляется сообщение: *"Заявка отправлена. Мы свяжемся с вами в ближайшее время."* Модальное окно при этом НЕ закрывается принудительно, чтобы пользователь зафиксировал результат.
    *   **Error (Ошибка):** Если API возвращает `ok: false` или происходит сбой сети, выводится красное/оранжевое уведомление: *"Не удалось отправить. Напишите нам в WhatsApp/Telegram."* (с активными ссылками на мессенджеры).

## 3. Структура DOM (HTML Blueprint)
*   `<dialog class="request-modal" aria-labelledby="modal-title" aria-modal="true">` 
    *   `<div class="request-modal__overlay"></div>`
    *   `<div class="request-modal__container">`
        *   `<button class="request-modal__close-btn" aria-label="Закрыть окно"></button>`
        *   
        *   `<div class="request-modal__content" id="modal-content-state">`
            *   `<h2 id="modal-title">Оставить заявку</h2>`
            *   
            *   `<form class="lead-form" id="leadForm">`
                *   `<input type="hidden" name="source" id="leadSource">`
                *   `<input type="hidden" name="pageUrl" id="leadPageUrl">`
                *   `<input type="text" name="hp" class="hidden-honeypot" tabindex="-1" aria-hidden="true" autocomplete="off" style="display:none;">`
                *   
                *   `<div class="form-group">`
                    *   `<label for="lead-name">Ваше имя</label>`
                    *   `<input type="text" id="lead-name" name="name" required>`
                *   `<div class="form-group">`
                    *   `<label for="lead-phone">Телефон</label>`
                    *   `<input type="tel" id="lead-phone" name="phone" required>`
                *   
                *   `<p class="legal-disclaimer">Нажимая кнопку, вы соглашаетесь с условиями обработки данных.</p>`
                *   `<button type="submit" class="btn btn--primary submit-btn">Отправить заявку</button>`
            *   
            *   `<!-- Success State (Hidden by default) -->`
            *   `<div class="state-message state-success" hidden>`
                 `Заявка отправлена. Мы свяжемся с вами в ближайшее время.`
                `</div>`
            *   
            *   `<!-- Error State (Hidden by default) -->`
            *   `<div class="state-message state-error" hidden>`
                 `Не удалось отправить. <a href="...">Напишите нам в WhatsApp/Telegram</a>.`
                `</div>`

## 4. Поведение (Behavior & Animation)
*   **Анимация открытия:** 
    *   Оверлей плавно появляется (`opacity: 0 -> 1`).
    *   Сам контейнер всплывает и увеличивается (Smooth fade + scale: `scale: 0.96 -> 1.0`, `translateY: 20px -> 0`). Длительность ~`300ms`, `ease-out`.
*   **Background Scroll:** Обязательна блокировка скролла у `<body>` (`overflow: hidden`), пока модалка открыта.
*   **Закрытие (Close Logic):** Окно закрывается:
    1.  Кликом по иконке крестика.
    2.  Кликом в любую зону оверлея вне карточки (вне белого/светлого прямоугольника).
    3.  Клавишей `Escape` на клавиатуре.

## 5. Mobile-first особенности (Responsive)
*   **Fullscreen Modal:** На мобильных телефонах (до `768px`) окно превращается в полноэкранное представление (Full-screen, `100vw`, `100vh`) или выезжает снизу как массивная "шторка" (Bottom sheet), перекрывая контент.
*   **Large tap targets (Крупные зоны тапа):** Размеры зон клика для кнопок, чекбоксов и крестика закрытия строго не менее `44x44px`.
*   **Шрифты (Anti-zoom):** Размер шрифта `input` на мобильных обязан быть `16px`, чтобы предотвратить автоматический зум интерфейса в iOS (Safari).
*   **Sticky Submit Button (Липкая кнопка):** Кнопка "Отправить заявку" фиксируется (`position: sticky; bottom: 0`) к нижней части экрана (или "шторки"), чтобы всегда быть под пальцем во время ввода данных или появления виртуальной клавиатуры устройства.

## 6. Интеграция с API (Псевдокод JS Request & UI States)

```javascript
/* === Логика отправки заявки и смены состояний UI === */

const leadForm = document.getElementById('leadForm');
const submitBtn = leadForm.querySelector('.submit-btn');
const successScreen = document.querySelector('.state-success');
const errorScreen = document.querySelector('.state-error');

// Функция открытия (Вызывается кликом по любой CTA кнопке)
function openModal(sourceId) {
    document.getElementById('leadSource').value = sourceId; // например 'hero_button'
    document.getElementById('leadPageUrl').value = window.location.href; // 'https://buenofurni.ru/catalog'
    // ...логика показа окна и сброса формы к изначальному виду
}

leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Активация состояния Loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';
    errorScreen.hidden = true; // Скрываем прошлую ошибку, если она была

    // Сбор данных формы в объект
    const formData = new FormData(leadForm);
    const data = Object.fromEntries(formData.entries());

    try {
        // 2. Отправка POST запроса на VPS API
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // 3. Обработка Success/Error состояний
        if (response.ok && result.ok === true) {
            // Success State (переключение UI)
            leadForm.hidden = true;
            successScreen.hidden = false;
        } else {
            // Ошибка от API (валидация не пройдена или сбой базы/сервисов)
            throw new Error(result.error || 'Server Error');
        }

    } catch (error) {
        console.error('Ошибка отправки:', error);
        
        // Error State (переключение UI)
        errorScreen.hidden = false;
    } finally {
        // Возвращаем кнопку в рабочее состояние (если форма не была скрыта)
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
    }
});
```

## 7. Доступность (A11y) и SEO (SEO note)
*   **Focus Trap:** При открытии модального окна навигация с клавиатуры (`Tab`) должна "запираться" (циклиться) внутри формы и не позволять проваливаться под оверлей.
*   **Aria Live:** Сообщения об успехе или ошибках (`.state-success`, `.state-error`) обязаны содержать атрибут `aria-live="polite"`, чтобы скринридеры автоматически озвучили ответ сервера после нажатия кнопки отправки.
*   **SEO (Индексация):** Содержимое модального окна с формами никак не влияет на поисковое ранжирование. Нет смысла индексировать попап-форму, поэтому весь этот HTML-блок можно отдать в самый низ `<body>` страницы.

## 8. Защита от спама (Anti-spam recommendation)
Скрытое поле `hp` (Honeypot) в DOM-структуре обязательно. Для живых людей оно скрыто через `style="display:none;"` или сдвинуто за пределы экрана (`position: absolute; left: -9999px`), но спам-боты часто парсят HTML напрямую и заполняют все поля типа `<input type="text">`. Сервер `POST /api/leads` проверит это: если `hp` заполнено, заявка тихо отбрасывается без отправки в Telegram/Email (вернув `200 OK` для обмана бота).
