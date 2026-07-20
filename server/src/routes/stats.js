import express from 'express';
import db from '../db/index.js';

const router = express.Router();

/**
 * Доступ только изнутри сервера: админка на Next дёргает эти данные
 * по 127.0.0.1. Запросы снаружи идут через nginx, который всегда
 * проставляет X-Forwarded-For — по нему их и отсекаем.
 */
function internalOnly(req, res, next) {
    if (req.headers['x-forwarded-for']) return res.status(404).end();
    const ip = req.socket.remoteAddress || '';
    if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') return next();
    return res.status(404).end();
}
router.use(internalOnly);

const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Начало периода в ISO (сутки считаем по Москве). */
function cutoffFor(period) {
    const now = Date.now();
    if (period === '7d') return new Date(now - 7 * 864e5).toISOString();
    if (period === '30d') return new Date(now - 30 * 864e5).toISOString();
    if (period === 'all') return '1970-01-01T00:00:00.000Z';

    const msk = new Date(now + MSK_OFFSET_MS);
    const midnightUtc = Date.UTC(msk.getUTCFullYear(), msk.getUTCMonth(), msk.getUTCDate()) - MSK_OFFSET_MS;
    return new Date(midnightUtc).toISOString();
}

const q = {
    views: db.prepare('SELECT COUNT(*) c FROM page_views WHERE created_at >= ?'),
    visits: db.prepare('SELECT COUNT(DISTINCT session_id) c FROM page_views WHERE created_at >= ?'),
    online: db.prepare('SELECT COUNT(DISTINCT session_id) c FROM page_views WHERE created_at >= ?'),
    leads: db.prepare('SELECT COUNT(*) c FROM leads WHERE created_at >= ?'),
    leadsTotal: db.prepare('SELECT COUNT(*) c FROM leads'),
    topPages: db.prepare(`
        SELECT path, COUNT(*) views, COUNT(DISTINCT session_id) visits
        FROM page_views WHERE created_at >= ?
        GROUP BY path ORDER BY views DESC LIMIT 12
    `),
    sources: db.prepare(`
        SELECT source, COUNT(*) views FROM page_views WHERE created_at >= ?
        GROUP BY source ORDER BY views DESC
    `),
    referrers: db.prepare(`
        SELECT referrer_host host, COUNT(*) views FROM page_views
        WHERE created_at >= ? AND referrer_host IS NOT NULL AND referrer_host != ''
        GROUP BY referrer_host ORDER BY views DESC LIMIT 10
    `),
    devices: db.prepare(`
        SELECT device, COUNT(*) views FROM page_views WHERE created_at >= ?
        GROUP BY device ORDER BY views DESC
    `),
    goals: db.prepare(`
        SELECT name, COUNT(*) count FROM events WHERE created_at >= ?
        GROUP BY name ORDER BY count DESC
    `),
    byDay: db.prepare(`
        SELECT substr(created_at, 1, 10) day, COUNT(*) views, COUNT(DISTINCT session_id) visits
        FROM page_views WHERE created_at >= ?
        GROUP BY day ORDER BY day
    `),
    recent: db.prepare(`
        SELECT path, source, referrer_host, device, created_at
        FROM page_views ORDER BY id DESC LIMIT 15
    `),
};

/** GET /api/stats/summary?period=today|7d|30d|all — плитки дашборда */
router.get('/summary', (req, res) => {
    try {
        const period = String(req.query.period || '7d');
        const from = cutoffFor(period);
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        res.json({
            period,
            views: q.views.get(from).c,
            visits: q.visits.get(from).c,
            leads: q.leads.get(from).c,
            leadsTotal: q.leadsTotal.get().c,
            online: q.online.get(fiveMinAgo).c,
        });
    } catch (error) {
        console.error('Ошибка /api/stats/summary:', error);
        res.status(500).json({ error: 'stats_failed' });
    }
});

/** GET /api/stats/analytics?period=... — полная статистика для раздела «Аналитика» */
router.get('/analytics', (req, res) => {
    try {
        const period = String(req.query.period || '7d');
        const from = cutoffFor(period);
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const from14d = new Date(Date.now() - 14 * 864e5).toISOString();

        res.json({
            period,
            totals: {
                views: q.views.get(from).c,
                visits: q.visits.get(from).c,
                leads: q.leads.get(from).c,
                online: q.online.get(fiveMinAgo).c,
            },
            byDay: q.byDay.all(from14d),
            topPages: q.topPages.all(from),
            sources: q.sources.all(from),
            referrers: q.referrers.all(from),
            devices: q.devices.all(from),
            goals: q.goals.all(from),
            recent: q.recent.all(),
        });
    } catch (error) {
        console.error('Ошибка /api/stats/analytics:', error);
        res.status(500).json({ error: 'stats_failed' });
    }
});

/** GET /api/stats/leads?limit=100 — архив заявок */
router.get('/leads', (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 100, 500);
        const rows = db.prepare(`
            SELECT id, name, phone, company, quantity, comment, lead_type, source, page_url,
                   delivered_telegram, delivered_email, created_at
            FROM leads ORDER BY id DESC LIMIT ?
        `).all(limit);
        res.json({ total: q.leadsTotal.get().c, leads: rows });
    } catch (error) {
        console.error('Ошибка /api/stats/leads:', error);
        res.status(500).json({ error: 'stats_failed' });
    }
});

export default router;
