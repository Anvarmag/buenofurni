// Аналитика: цели уходят в Яндекс.Метрику И в собственную базу (/api/track).
// Любой сбой здесь молча игнорируется — аналитика не должна ломать интерфейс.

const METRIKA_ID = 110917495;

/**
 * Цели. В Метрике заводятся вручную (тип «JavaScript-событие»,
 * идентификатор = строка ниже), в свою базу пишутся автоматически.
 */
export type GoalName =
    | 'lead'            // отправлена заявка (B2C)
    | 'lead_b2b'        // отправлен запрос КП (HoReCa)
    | 'phone_click'     // клик по номеру телефона
    | 'telegram_click'  // клик по Telegram
    | 'max_click';      // клик по мессенджеру MAX

declare global {
    interface Window {
        ym?: (id: number, action: string, ...args: unknown[]) => void;
    }
}

/** Отправка «в один конец»: переживает уход со страницы. */
function post(url: string, data: unknown): void {
    if (typeof window === 'undefined') return;
    try {
        const body = JSON.stringify(data);
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
            credentials: 'same-origin',
        }).catch(() => { });
    } catch {
        // тишина
    }
}

/** Просмотр страницы — в собственную аналитику. */
export function trackPageView(path: string, referrer: string): void {
    post('/api/track', { path, referrer });
}

/** Цель — в Метрику и в собственную аналитику. */
export function reachGoal(goal: GoalName, params?: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;

    try {
        if (typeof window.ym === 'function') {
            window.ym(METRIKA_ID, 'reachGoal', goal, params);
        }
    } catch {
        // Метрика могла не загрузиться (блокировщик) — не мешаем дальше
    }

    post('/api/track/event', { name: goal, path: window.location.pathname });
}
