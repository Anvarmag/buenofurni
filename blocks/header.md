# Блок: Header (Главная навигация и шапка сайта) — BUENOFURNI

## 1. Обновлённая структура (DOM Blueprint)
Шапка сайта обеспечивает глобальную навигацию и доступность основных целевых действий.

*   `<header class="site-header" role="banner">`
    *   **Логотип:** `<a href="/" class="header__logo" aria-label="На главную BUENOFURNI">Логотип</a>`
    *   **Главное меню (`<nav class="header__nav" aria-label="Главное меню">`):**
        *   `<ul>`
            *   `<li><a href="/catalog">Каталог</a></li>`
            *   `<li><a href="/horeca" class="nav-b2b-link">HoReCa <span class="badge badge--b2b">B2B</span></a></li>`
            *   `<li><a href="/custom">На заказ</a></li>`
            *   `<li><a href="/materials">Материалы</a></li>`
            *   `<li><a href="/production">Производство</a></li>`
            *   `<li><a href="/contacts">Контакты</a></li>`
    *   **Блок действий (Actions):**
        *   Кнопки соцсетей (WhatsApp / Telegram) в виде иконок.
        *   **Динамическая CTA-кнопка:** `Primary Button` (Текст и действие меняются в зависимости от открытой страницы).
    *   **Мобильный триггер:** Кнопка-бургер `<button class="burger-menu" aria-expanded="false" aria-controls="mobile-menu" aria-label="Открыть меню">`

## 2. Логика определения текущей страницы (Dynamic CTA Logic)
Текст основной кнопки призыва к действию (Primary CTA) и модальное окно, которое она открывает, зависят от контекста страницы. Это обеспечивает бесшовный UX для B2B и B2C клиентов.

*Псевдокод (JavaScript):*
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const headerCtaButton = document.querySelector('.header__primary-cta');
    const currentPath = window.location.pathname; // Получаем текущий URL страницы

    // Проверяем, находится ли пользователь на странице B2B (HoReCa)
    if (currentPath.includes('/horeca')) {
        // Логика для HORECA
        headerCtaButton.textContent = 'Получить КП';
        headerCtaButton.addEventListener('click', () => {
            openHorecaModal({ source: 'header_b2b_cta', leadType: 'b2b' });
        });
    } else {
        // Стандартная логика для Каталога, Главной и всех остальных страниц
        headerCtaButton.textContent = 'Оставить заявку';
        headerCtaButton.addEventListener('click', () => {
            openStandardRequestModal({ source: 'header_b2c_cta', leadType: 'b2c' });
        });
    }
});
```

## 3. Поведение (Scroll & Hover Interactions)
*   **Sticky & Transparent Behavior:**
    *   На главной странице (Hero секции с изображением) шапка по умолчанию прозрачная (`background: transparent`, белый текст).
    *   При скролле вниз (например, `> 50px`) шапка становится плотной (`background: #FFF` или слоновая кость), появляется легкая тень (`box-shadow`), а текст и лого перекрашиваются в темный графит.
    *   Транзиция (переход) цвета и фона должна быть плавной (`transition: all 0.3s ease`).
*   **Subtle Hover Animation (Меню):**
    *   При наведении на пункты меню (`a:hover`), снизу деликатно выезжает подчеркивание (Underline animation). Например, линия появляется от центра к краям (`transform: scaleX(1)`). Никаких тяжелых заливок или прыжков текста (Layout Shift).

## 4. Mobile UX (Mobile-first Menu)
*   **Fullscreen Menu Overlay:** По клику на иконку "гамбургера", открывается мобильное меню на весь экран поверх контента (`100vw, 100vh`). Фон может быть слегка размыт (backdrop-filter) для премиального эффекта.
*   **Оформление пункта HoReCa:** В мобильном меню пункт `HoReCa` должен быть визуально отбит от остальных пунктов (например, небольшим бейджем `B2B` или легким акцентным шрифтом), чтобы оптовые клиенты сразу считывали свой раздел.
*   **Динамическая кнопка:** Кнопка "Оставить заявку / Получить КП" в мобильном меню дублирует десктопную логику и располагается массивно внизу списка (ширина 100%).

## 5. Доступность (Accessibility / A11y & SEO)
*   **Индикация активной страницы (`aria-current`):** Текущий раздел, в котором находится пользователь (например, `/production`), должен иметь стилистическое отличие (постоянное подчеркивание) и атрибут `aria-current="page"` в теге `<a>`.
*   **Keyboard Navigation (Навигация с клавиатуры):** Элементы `<nav>`, ссылки и кнопки обязаны фокусироваться при нажатии `Tab`. У фокуса должен быть четкий видимый контур (`:focus-visible` — стандартный синий outline или стилизованный брендовый контур).
*   **Семантика кнопок:** Гамбургер на мобилке использует связку `aria-expanded` (переключается `true/false` через JS) и `aria-controls="ID_меню"`, чтобы скринридер понимал, чем управляет эта кнопка.
