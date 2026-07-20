// Чтение статистики из Express-API по локальному адресу.
// Эти эндпоинты доступны только изнутри сервера (см. server/src/routes/stats.js),
// а страницы админки и без того закрыты Basic-auth.

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://127.0.0.1:3001';

export type Period = 'today' | '7d' | '30d' | 'all';

export interface Summary {
    period: string;
    views: number;
    visits: number;
    leads: number;
    leadsTotal: number;
    online: number;
}

export interface Lead {
    id: number;
    name: string;
    phone: string;
    company: string | null;
    quantity: string | null;
    comment: string | null;
    lead_type: string | null;
    source: string | null;
    page_url: string | null;
    delivered_telegram: number;
    delivered_email: number;
    created_at: string;
}

/** Возвращает null, если API недоступен — страница покажет прочерки вместо падения. */
async function get<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${INTERNAL_API}${path}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

export interface Analytics {
    period: string;
    totals: { views: number; visits: number; leads: number; online: number };
    byDay: { day: string; views: number; visits: number }[];
    topPages: { path: string; views: number; visits: number }[];
    sources: { source: string; views: number }[];
    referrers: { host: string; views: number }[];
    devices: { device: string; views: number }[];
    goals: { name: string; count: number }[];
    recent: { path: string; source: string; referrer_host: string | null; device: string; created_at: string }[];
}

export function getSummary(period: Period = '7d') {
    return get<Summary>(`/api/stats/summary?period=${period}`);
}

export function getAnalytics(period: Period = '7d') {
    return get<Analytics>(`/api/stats/analytics?period=${period}`);
}

export function getLeads(limit = 100) {
    return get<{ total: number; leads: Lead[] }>(`/api/stats/leads?limit=${limit}`);
}
