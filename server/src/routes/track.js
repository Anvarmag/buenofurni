import express from 'express';
import crypto from 'crypto';
import db from '../db/index.js';

const router = express.Router();

const SESSION_COOKIE = 'bf_sid';
const SESSION_TTL_MIN = 30;

// Поисковики, соцсети/мессенджеры — для классификации источника
const SEARCH_HOSTS = ['yandex.', 'google.', 'bing.', 'duckduckgo.', 'mail.ru', 'rambler.'];
const SOCIAL_HOSTS = ['vk.com', 't.me', 'telegram', 'instagram', 'facebook', 'pinterest', 'ok.ru', 'youtube', 'max.ru', 'dzen.ru'];

const BOT_RE = /bot|crawler|spider|crawling|yandex|googlebot|bingpreview|slurp|duckduck|ahrefs|semrush|mj12|petal|facebookexternalhit|headless|curl|wget|python-requests/i;

function parseCookies(header) {
    const out = {};
    if (!header) return out;
    for (const part of header.split(';')) {
        const i = part.indexOf('=');
        if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    }
    return out;
}

function detectDevice(ua = '') {
    if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobi|android|iphone|ipod|windows phone/i.test(ua)) return 'mobile';
    return 'desktop';
}

function hostOf(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return '';
    }
}

function classifySource(referrer, selfHost) {
    if (!referrer) return { source: 'direct', host: '' };
    const host = hostOf(referrer);
    if (!host) return { source: 'direct', host: '' };
    if (selfHost && host === selfHost.replace(/^www\./, '')) return { source: 'internal', host };
    if (SEARCH_HOSTS.some((h) => host.includes(h))) return { source: 'search', host };
    if (SOCIAL_HOSTS.some((h) => host.includes(h))) return { source: 'social', host };
    return { source: 'referral', host };
}

function getOrSetSession(req, res) {
    const cookies = parseCookies(req.headers.cookie);
    let sid = cookies[SESSION_COOKIE];
    if (!sid || sid.length < 8) sid = crypto.randomBytes(16).toString('hex');
    // Продлеваем сессию на каждый просмотр
    res.cookie(SESSION_COOKIE, sid, {
        maxAge: SESSION_TTL_MIN * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });
    return sid;
}

const insertView = db.prepare(`
    INSERT INTO page_views (path, referrer, referrer_host, source, device, session_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const insertEvent = db.prepare(`
    INSERT INTO events (name, path, session_id, created_at) VALUES (?, ?, ?, ?)
`);

const ALLOWED_EVENTS = new Set(['lead', 'lead_b2b', 'phone_click', 'telegram_click', 'max_click']);

/**
 * POST /api/track — просмотр страницы (beacon с фронтенда)
 */
router.post('/', (req, res) => {
    try {
        const ua = req.headers['user-agent'] || '';
        // Боты в статистику не попадают
        if (BOT_RE.test(ua)) return res.status(204).end();

        const { path: rawPath, referrer } = req.body || {};
        if (typeof rawPath !== 'string' || !rawPath.startsWith('/')) return res.status(204).end();
        // Служебные разделы не считаем
        if (rawPath.startsWith('/admin') || rawPath.startsWith('/api')) return res.status(204).end();

        const path = rawPath.slice(0, 300);
        const ref = typeof referrer === 'string' ? referrer.slice(0, 500) : '';
        const { source, host } = classifySource(ref, req.headers.host || '');
        const sid = getOrSetSession(req, res);

        insertView.run(path, ref || null, host || null, source, detectDevice(ua), sid, new Date().toISOString());
        return res.status(204).end();
    } catch (error) {
        console.error('Ошибка /api/track:', error);
        return res.status(204).end(); // аналитика не должна ломать клиента
    }
});

/**
 * POST /api/track/event — цель (заявка, клик по телефону/мессенджеру)
 */
router.post('/event', (req, res) => {
    try {
        const ua = req.headers['user-agent'] || '';
        if (BOT_RE.test(ua)) return res.status(204).end();

        const { name, path: rawPath } = req.body || {};
        if (typeof name !== 'string' || !ALLOWED_EVENTS.has(name)) return res.status(204).end();

        const cookies = parseCookies(req.headers.cookie);
        const sid = cookies[SESSION_COOKIE] || null;
        const path = typeof rawPath === 'string' ? rawPath.slice(0, 300) : null;

        insertEvent.run(name, path, sid, new Date().toISOString());
        return res.status(204).end();
    } catch (error) {
        console.error('Ошибка /api/track/event:', error);
        return res.status(204).end();
    }
});

export default router;
