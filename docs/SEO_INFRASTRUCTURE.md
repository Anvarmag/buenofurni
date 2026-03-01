# Инфраструктура SEO и Мета-данных — BUENOFURNI

## 1. Цель документа
Регламентировать техническую реализацию поисковой оптимизации (SEO) для сайта BUENOFURNI. Документ описывает шаблоны мета-тегов, правила индексации, настройки социальных сетей (OpenGraph) и серверные редиректы.

## 2. Шаблоны мета-тегов (Meta Templates)
Каждая страница сайта обязана содержать уникальные теги `<title>` и `<meta name="description">`.

*   **Главная страница (Home):**
    *   *Title:* Дизайнерские стулья из фанеры на заказ | BUENOFURNI
    *   *Desc:* Производство дизайнерских стульев из шпона и березовой фанеры. Качественный микровелюр и букле. Цены от 5 500 руб. Гарантия 12 месяцев.
*   **Каталог (Catalog):**
    *   *Title:* Каталог стульев из фанеры — Купить онлайн | BUENOFURNI
    *   *Desc:* Выбирайте современные стулья из березовой фанеры и шпона. Актуальные цены, наличие и возможность предзаказа. Доставка по РФ.
*   **Страница модели (Product):**
    *   *Title:* `[Название модели]` от `[Цена]` руб. купить | Производство BUENOFURNI
    *   *Desc:* Заказать `[Название модели]` из фанеры. В наличии и под заказ. Выбор цвета ножек и ткани (микровелюр, букле). Гарантия 12 месяцев.
*   **HoReCa (B2B):**
    *   *Title:* Стулья и мебель для кафе и ресторанов (HoReCa) | Производство BUENOFURNI
    *   *Desc:* Производство надежной мебели для HoReCa от BUENOFURNI. Усиленный каркас, износостойкая ткань. Скидки за партию. Изготовим под ваш интерьер.
*   **На заказ (Custom):**
    *   *Title:* Изготовление стульев на заказ | Мебель от BUENOFURNI
    *   *Desc:* Производим стулья из шпона и фанеры под ваш интерьер. Выбор ткани (микровелюр, букле). Сроки от 7 дней. Гарантия. Рассчитайте стоимость онлайн.
*   **Инфо-страницы (Производство, Материалы, Контакты):**
    *   *Title:* `[Название страницы]` | BUENOFURNI
    *   *Desc:* `[Краткая выжимка контента страницы, до 150 символов]`.

## 3. Канонические ссылки (Canonical Rules)
*   **Правило:** Каждая страница должна явно указывать на свою основную версию во избежание дублей контента из-за GET-параметров (например, при переходе с рекламы `?utm_source=...`).
*   **Реализация:** В `<head>` каждой страницы прописывается тег:
    `<link rel="canonical" href="https://buenofurni.ru/[текущий_чистый_путь]" />`

## 4. Социальные сети: OpenGraph & Twitter Cards
Для красивого отображения ссылок в Telegram, WhatsApp и VK.

### 4.1. OpenGraph (OG)
Обязательный минимум тегов в `<head>`:
```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="BUENOFURNI">
<meta property="og:url" content="https://buenofurni.ru/[путь]">
<meta property="og:title" content="[Совпадает с Title страницы]">
<meta property="og:description" content="[Совпадает с Meta Description]">
<meta property="og:image" content="https://buenofurni.ru/og-image.jpg"> 
<!-- Изображение 1200x630px, качественное фото интерьера со стулом -->
```

### 4.2. Twitter Card
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Title]">
<meta name="twitter:description" content="[Description]">
<meta name="twitter:image" content="https://buenofurni.ru/og-image.jpg">
```

## 5. Иконки и Манифест (Favicon & Webmanifest)
*   **Favicon:** Должны быть предоставлены иконки в современных форматах (SVG для поддержки темной/светлой темы) и фоллбеки для Apple.
    *   `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
    *   `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
*   **Webmanifest:** Для Android устройств и PWA:
    *   `<link rel="manifest" href="/site.webmanifest">`
    *   *(Внутри `site.webmanifest` указать `name="BUENOFURNI"`, `theme_color="#FFFFFF"`, массив иконок `192x192` и `512x512`).*

## 6. Базовая серверная логика SEO
### 6.1. Логика 404 страницы (Not Found)
*   Если URL не существует, сервер (или фронтенд маршрутизатор) обязан отдавать строгий HTTP статус `404 Not Found` (не 200!).
*   На странице 404 должны быть:
    *   Извинение ("Страница не найдена").
    *   Кнопка "Перейти в Каталог".
    *   Кнопка "На главную".
    *   *Запрет индексации:* `<meta name="robots" content="noindex, nofollow">`.

### 6.2. Стратегия редиректов (Redirect Strategy)
На уровне сервера (`NGINX` / `Apache` / `Next.js config`):
*   **HTTP -> HTTPS:** Весь незащищенный трафик (80 порт) строго редиректится 301 кодом на защищенный `https://`.
*   **WWW -> Без WWW:** Редирект `301 Moved Permanently` с `www.buenofurni.ru` на `buenofurni.ru` (для концентрации ссылочной массы на одном домене).
*   **Trailing Slash:** Убрать слэши на конце ссылок. `buenofurni.ru/catalog/` редиректит 301 на `buenofurni.ru/catalog`.
