import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// База лежит в server/data/ — вне git (см. .gitignore), переживает деплой,
// так как git pull не трогает игнорируемые файлы.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'buenofurni.db'));

// WAL — параллельное чтение не блокирует запись, безопаснее при нескольких процессах.
db.pragma('journal_mode = WAL');

db.exec(`
    -- Просмотры страниц (своя аналитика посещаемости)
    CREATE TABLE IF NOT EXISTS page_views (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        path          TEXT NOT NULL,
        referrer      TEXT,
        referrer_host TEXT,
        source        TEXT NOT NULL,   -- direct | search | social | referral | internal
        device        TEXT NOT NULL,   -- desktop | mobile | tablet
        session_id    TEXT NOT NULL,
        created_at    TEXT NOT NULL    -- ISO 8601 (UTC)
    );
    CREATE INDEX IF NOT EXISTS idx_pv_created ON page_views (created_at);
    CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views (session_id);
    CREATE INDEX IF NOT EXISTS idx_pv_path    ON page_views (path);

    -- Цели/события: заявки, клики по телефону и мессенджерам
    CREATE TABLE IF NOT EXISTS events (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,      -- lead | lead_b2b | phone_click | telegram_click | max_click
        path       TEXT,
        session_id TEXT,
        created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ev_created ON events (created_at);
    CREATE INDEX IF NOT EXISTS idx_ev_name    ON events (name);

    -- Заявки. Пишем ДО отправки уведомлений, поэтому заявка не теряется,
    -- даже если Telegram и почта одновременно недоступны.
    CREATE TABLE IF NOT EXISTS leads (
        id                 INTEGER PRIMARY KEY AUTOINCREMENT,
        name               TEXT NOT NULL,
        phone              TEXT NOT NULL,
        company            TEXT,
        quantity           TEXT,
        comment            TEXT,
        lead_type          TEXT,
        source             TEXT,
        page_url           TEXT,
        delivered_telegram INTEGER NOT NULL DEFAULT 0,
        delivered_email    INTEGER NOT NULL DEFAULT 0,
        created_at         TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at);
`);

export default db;
