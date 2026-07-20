// Отправка целей в Яндекс.Метрику.
// Счётчик может быть не загружен (блокировщик, медленная сеть, SSR) —
// в этом случае вызов молча игнорируется: аналитика не должна ломать интерфейс.

const METRIKA_ID = 107082264;

/**
 * Цели, которые заводятся в интерфейсе Метрики (тип «JavaScript-событие»,
 * идентификатор цели = строка ниже).
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

export function reachGoal(goal: GoalName, params?: Record<string, unknown>): void {
    if (typeof window === 'undefined' || typeof window.ym !== 'function') return;
    try {
        window.ym(METRIKA_ID, 'reachGoal', goal, params);
    } catch {
        // молча игнорируем — сбой аналитики не должен влиять на пользователя
    }
}
