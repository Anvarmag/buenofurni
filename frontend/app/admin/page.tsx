import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { getAllArticles } from '../_data/blog';
import { getSummary } from '../_lib/stats';

export const dynamic = 'force-dynamic';

async function countProducts(): Promise<number | null> {
    try {
        const file = await fs.readFile(path.join(process.cwd(), 'data', 'products.json'), 'utf8');
        const list = JSON.parse(file);
        return Array.isArray(list) ? list.length : null;
    } catch {
        return null;
    }
}

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
    return (
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-black/40">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
            {hint && <p className="mt-1 text-xs text-black/40">{hint}</p>}
        </div>
    );
}

export default async function AdminDashboard() {
    const [products, summary] = await Promise.all([countProducts(), getSummary('7d')]);
    const articles = getAllArticles().length;
    const dash = (v: number | null | undefined) => (v === null || v === undefined ? '—' : v);

    return (
        <div className="mx-auto max-w-6xl">
            <header className="mb-8">
                <h1 className="text-2xl font-semibold sm:text-3xl">Обзор</h1>
                <p className="mt-1 text-sm text-black/50">Ключевые показатели сайта за последние 7 дней.</p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Tile label="Заявок за 7 дней" value={dash(summary?.leads)} hint={`всего в базе: ${dash(summary?.leadsTotal)}`} />
                <Tile label="Визитов за 7 дней" value={dash(summary?.visits)} hint="уникальные сессии" />
                <Tile label="Просмотров за 7 дней" value={dash(summary?.views)} />
                <Tile label="Онлайн сейчас" value={dash(summary?.online)} hint="за последние 5 минут" />
                <Tile label="Товаров в каталоге" value={dash(products)} />
                <Tile label="Статей в блоге" value={articles} />
            </div>

            {summary === null && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    Статистика недоступна: API не отвечает. Проверьте процесс <code>buenofurni-api</code>.
                </div>
            )}

            <section className="mt-10">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/40">Быстрые действия</h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/products" className="rounded-full bg-[#141C26] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                        Редактировать товары
                    </Link>
                    <Link href="/admin/leads" className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5">
                        Смотреть заявки
                    </Link>
                    <Link href="/admin/analytics" className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5">
                        Аналитика
                    </Link>
                </div>
            </section>
        </div>
    );
}
