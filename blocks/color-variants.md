# Блок: Варианты цветов (Интерактивная витрина модели) — BUENOFURNI

## 1. Цель блока
Предоставить пользователю интерактивный инструмент для персонализации стула. Блок должен дать возможность "примерить" различные варианты обивки (ткани) и отделки каркаса (дерева/ножек), показывая изменения на крупной, детализированной фотографии. Главная задача — конвертировать вовлеченность в отправку заявки, сразу демонстрируя прозрачное и привлекательное ценообразование.

## 2. UX логика (User Experience)
*   **Ценовой крючок (Price Hook):** Цена является важнейшим фактором принятия решения. Она выводится сразу под заголовком товара в премиальном, спокойном стиле (крупно, но без агрессивных "скидочных" красных цветов). Рядом или чуть ниже располагается пояснение о зависимости финальной стоимости от материалов, чтобы формировать правильные ожидания.
*   **Mobile-First фокус:** Интерфейс изначально проектируется для удобного использования одной рукой на смартфоне. Цена и CTA-кнопка должны оставаться в зоне видимости при настройке конфигурации, избавляя пользователя от лишнего скролла.
*   **Мгновенный отклик:** Переключение цветов не должно вызывать заметных задержек или перестроения (скачков) макета.
*   **Инерция прокрутки:** Списки доступных цветов в мобильной версии поддерживают горизонтальный скролл с прилипанием (`scroll-snap-type: x mandatory`).
*   **Крупные зоны клика:** Минимальный размер интерактивного варианта цвета (swatch) — `44x44px` для безошибочного попадания пальцем.

## 3. Структура DOM (HTML Blueprint)
*   `<section class="color-showcase">`
    *   `<div class="container color-showcase__grid">`
        *   `<div class="color-showcase__media">` (Зона изображения)
            *   `<picture>`
                *   `<img class="model-image" src="model-chair-default.avif" alt="Стул в цвете Графит, шпон дуба">`
        
        *   `<div class="color-showcase__configurator">` (Зона настройки и конверсии)
            *   `<div class="config-header">`
                *   `<h2>Выберите свой характер</h2>`
                *   `<p class="subtitle">Один дизайн – разные цвета и оттенки ножек.</p>`
                *   `<div class="price-widget">`
                    *   `<div class="price">от 5 500 ₽</div>`
                    *   `<p class="price-note">*Финальная стоимость зависит от выбранной ткани и отделки ножек.</p>`
                *   `</div>`
            *   `</div>`
            
            *   `<div class="config-group config-group--fabric">`
                *   `<h3>Обивка: <span class="active-label">Микровелюр Графит</span></h3>`
                *   `<ul class="swatch-list" role="listbox" aria-label="Выбор цвета обивки">`
                    *   `<li><button class="swatch" data-fabric="graphite" aria-selected="true" style="background-color: #2A2D2A;"></button></li>`
                    *   `<li><button class="swatch" data-fabric="wine" aria-selected="false" style="background-color: #4B1D28;"></button></li>`
            
            *   `<div class="config-group config-group--legs">`
                *   `<h3>Каркас: <span class="active-label">Березовая фанера</span></h3>`
                *   `<ul class="swatch-list">`
                    *   `<li><button class="swatch" data-leg="plywood" ...></li>`
            
            *   `<div class="config-footer">`
                *   `<button class="btn btn--primary cta-btn">Оставить заявку</button>`

## 4. Логика переключения (Псевдокод JS)

```javascript
const state = { fabric: 'graphite', leg: 'plywood' };

const imageElement = выбрать_элемент('.model-image');
const fabricSelectors = выбрать_все('.swatch[data-fabric]');
const legSelectors = выбрать_все('.swatch[data-leg]');
const priceElement = выбрать_элемент('.price');
const fabricLabel = выбрать_элемент('.config-group--fabric .active-label');

функция обновитьВитрину() {
    const новоеИзображение = `path/to/img/model-chair-${state.fabric}-${state.leg}.avif`;
    
    добавить_класс(imageElement, 'is-fading-out');
    
    setTimeout(() => {
        установить_атрибут(imageElement, 'src', новоеИзображение);
        установить_атрибут(imageElement, 'alt', `Стул в конфигурации: обивка ${state.fabric}, ножки ${state.leg}`);
        удалить_класс(imageElement, 'is-fading-out');
    }, 250); 

    // Динамическое обновление цены "от X ₽" в зависимости от выбранного материала
    priceElement.textContent = рассчитатьЦену(state.fabric, state.leg);
    fabricLabel.textContent = получитьИмяТкани(state.fabric);
}

// Слушатели аналогичны для дерева и ткани
fabricSelectors.forEach(btn => {
    btn.addEventListener('click', (e) => {
        fabricSelectors.forEach(b => b.setAttribute('aria-selected', 'false'));
        e.target.setAttribute('aria-selected', 'true');
        state.fabric = e.target.dataset.fabric;
        обновитьВитрину();
    });
});
```

*Анимация в CSS:*
```css
.swatch[aria-selected="true"] {
    transform: scale(1.15);
    border: 2px solid #2A2D2A; /* Контрастный контур графитового цвета, без красного */
    outline-offset: 2px;
}
.price {
    font-size: 32px; /* Крупная, уверенная типографика */
    color: #2A2D2A; /* Графитовый, премиальный цвет */
}
.price-note {
    font-size: 14px;
    color: #888; /* Мягкий, нейтральный цвет для примечания */
}
```

## 5. Mobile-first адаптив (Responsive UI)
*   **Mobile (До `768px`):** 
    *   Линейная колонка.
    *   Изображение кресла в самом верху (Full Width, если позволяет дизайн) для привлечения внимания.
    *   Сразу под фото располагается заголовок `H2` и блок `.price-widget`. Цена "от 5 500 ₽" и примечание видны на первом экране пользователя (до глубокого скролла) вместе с самим товаром.
    *   Ниже идут свотчи с горизонтальной прокруткой. Кнопка "Оставить заявку" может фиксироваться (Sticky bar) внизу экрана при прокрутке блока настроек.
*   **Tablet (`768px` - `1024px`):** Макет делится на 2 колонки. Фотография слева, конфигуратор с ценой — справа. Блок цены находится в верхней части правой колонки.
*   **Desktop (Свыше `1024px`):** Двухколоночная журнальная верстка с большим количеством пустого пространства (Negative space). Блок `.price-widget` выглядит крупно, типографически выверенно, подчеркивая статус (без лишних ярких плашек).

## 6. Производительность (Performance Engine)
Из-за обилия изображений (комбинаций цветов), требуется агрессивный контроль загрузки:
*   **Предзагрузка первого изображения:** Стартовая картинка загружается с `fetchpriority="high"`.
*   **Ленивая загрузка вариантов:** Картинки вариантов цвета загружаются скрытно через скрипт `new Image().src = ...` *только в момент наведения курсора* на свотч (hover) или фоновым процессом без блокировки основного потока (`requestIdleCallback`).

## 7. SEO и Доступность (A11y)
*   **Семантика:** Структура ценника и пояснения сгруппирована логически (`.price-widget`), чтобы скринридер читал их слитно.
*   Конструкция выбора цвета обязана использовать семантику `role="listbox"`, либо быть группой стилизованных `<input type="radio">`.
*   У каждого свотча `aria-label="Цвет: Букле Крем"` и переключающийся атрибут `aria-selected="true/false"`.
*   Атрибут `alt` главного изображения динамически переписывается JS-скриптом.
