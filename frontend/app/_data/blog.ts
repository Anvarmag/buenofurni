import fs from 'fs';
import path from 'path';

// Статьи блога хранятся как markdown с YAML-фронтматтером в frontend/content/blog/*.md
// Папка лежит ВНУТРИ frontend (в отличие от корневого pages/), чтобы всегда попадать в деплой.

export interface ArticleMeta {
    slug: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    cover?: string;
    author: string;
}

export interface FaqItem {
    q: string;
    a: string;
}

export interface Article extends ArticleMeta {
    body: string; // markdown без ведущего H1 (заголовок выводим отдельно)
    faq: FaqItem[];
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// Мини-парсер фронтматтера (строковые значения) — без внешних зависимостей.
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) return { data: {}, content: raw };

    const data: Record<string, string> = {};
    for (const line of match[1].split(/\r?\n/)) {
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        if (!key) continue;
        data[key] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    }
    return { data, content: match[2] };
}

// Достаём пары «Вопрос/Ответ» из секции «Частые вопросы» для FAQPage-разметки.
// Формат в статье: заголовок ## Частые вопросы, далее **Вопрос?** на своей строке + абзац-ответ.
function extractFaq(content: string): FaqItem[] {
    const lines = content.split(/\r?\n/);
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/^#{2,3}\s+.*(частые вопросы|faq)/i.test(lines[i])) {
            start = i + 1;
            break;
        }
    }
    if (start === -1) return [];

    const faq: FaqItem[] = [];
    let q: string | null = null;
    let a: string[] = [];
    const flush = () => {
        const answer = a.join(' ').trim();
        if (q && answer) faq.push({ q, a: answer });
        q = null;
        a = [];
    };

    for (let i = start; i < lines.length; i++) {
        const line = lines[i];
        if (/^---\s*$/.test(line) || /^#{1,2}\s/.test(line)) break; // конец секции FAQ
        const question = line.match(/^\*\*(.+?)\*\*\s*$/);
        if (question) {
            flush();
            q = question[1].trim();
            continue;
        }
        if (q) a.push(line.trim());
    }
    flush();
    return faq;
}

function readArticle(file: string): Article | null {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { data, content } = parseFrontmatter(raw);
    if (!data.title) return null;

    return {
        slug: data.slug || file.replace(/\.md$/, ''),
        title: data.title,
        description: data.description || '',
        date: data.date || '',
        cover: data.cover || undefined,
        author: data.author || 'BUENOFURNI',
        body: content.replace(/^\s*#\s+.+\r?\n+/, ''), // убрать ведущий H1 (в т.ч. с пустой строкой перед ним)
        faq: extractFaq(content),
    };
}

export function getAllArticles(): Article[] {
    let files: string[] = [];
    try {
        files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
    } catch {
        return [];
    }
    return files
        .map(readArticle)
        .filter((a): a is Article => a !== null)
        .sort((x, y) => (x.date < y.date ? 1 : -1)); // новые сверху
}

export function getArticle(slug: string): Article | null {
    return getAllArticles().find((a) => a.slug === slug) || null;
}
