import Link from 'next/link';
import { getAnalytics, type Period } from '../../_lib/stats';

export const dynamic = 'force-dynamic';

const PERIODS: { key: Period; label: string }[] = [
    { key: 'today', label: 'Сегодня' },
    { key: '7d', label: '7 дней' },
    { key: '30d', label: '30 дней' },
    { key: 'all', label: 'Всё время' },
];

const SOURCE_LABELS: Record<string, string> = {
    direct: 'Прямые заходы',
    search: 'Поисковые системы',
    social: 'Соцсети / мессенджеры',
    referral: 'Другие сайты',
    internal: 'Внутренние переходы',
};

const DEVICE_LABELS: Record<string, string> = {
    desktop: 'Компьютер',
    mobile: 'Телефон',
    tablet: 'Планшет',
};

const GOAL_LABELS: Record<string, string> = {
    lead: 'Заявки (формы)',
    lead_b2b: 'Запросы КП (HoReCa)',
    phone_click: 'Клики по телефону',
    telegram_click: 'Клики по Telegram',
    max_click: 'Клики по MAX',
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">{title}</h2>
            {children}
        </section>
    );
}

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
    return (
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-black/40">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
            {hint && <p className="mt-1 text-xs text-black/40">{hint}</p>}
        </div>
    );
}

/** Горизонтальная полоса с долей от максимума */
function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <li className="py-2">
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-black/80">{label}</span>
                <span className="shrink-0 tabular-nums text-black/60">
                    {value}{suffix ? ` ${suffix}` : ''}
                </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                <div className="h-full rounded-full bg-[#141C26]" style={{ width: `${pct}%` }} />
            </div>
        </li>
    );
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminAnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ p?: string }>;
}) {
    const { p } = await searchParams;
    const period: Period = (['today', '7d', '30d', 'all'] as const).includes(p as Period) ? (p as Period) : '7d';
    const data = await getAnalytics(period);

    const maxDay = data ? Math.max(1, ...data.byDay.map((d) => d.views)) : 1;
    const maxPage = data ? Math.max(1, ...data.topPages.map((d) => d.views)) : 1;
    const maxSource = data ? Math.max(1, ...data.sources.map((d) => d.views)) : 1;
    const maxRef = data ? Math.max(1, ...data.referrers.map((d) => d.views)) : 1;
    const maxDevice = data ? Math.max(1, ...data.devices.map((d) => d.views)) : 1;
    const totalSourceViews = data ? data.sources.reduce((s, x) => s + x.views, 0) : 0;

    return (
        <div className="mx-auto max-w-6xl">
            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold sm:text-3xl">Аналитика сайта</h1>
                    <p className="mt-1 text-sm text-black/50">Собственная статистика посещений. Период применяется ко всем блокам.</p>
                </div>
                <div className="flex gap-1 rounded-full border border-black/10 bg-white p-1">
                    {PERIODS.map((item) => (
                        <Link
                            key={item.key}
                            href={`/admin/analytics?p=${item.key}`}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${period === item.key ? 'bg-[#141C26] text-white' : 'text-black/60 hover:bg-black/5'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </header>

            {data === null ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    Статистика недоступна: API не отвечает. Проверьте процесс <code>buenofurni-api</code>.
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Плитки */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <Tile label="Онлайн сейчас" value={data.totals.online} hint="за последние 5 минут" />
                        <Tile label="Просмотры" value={data.totals.views} />
                        <Tile label="Визиты" value={data.totals.visits} hint="уникальные сессии" />
                        <Tile label="Заявки" value={data.totals.leads} />
                    </div>

                    {/* График по дням */}
                    <Card title="Просмотры по дням (14 дней)">
                        {data.byDay.length === 0 ? (
                            <p className="text-sm text-black/40">Пока нет данных.</p>
                        ) : (
                            <div className="flex h-40 items-end gap-1 overflow-x-auto">
                                {data.byDay.map((d) => (
                                    <div key={d.day} className="flex min-w-[28px] flex-1 flex-col items-center gap-1" title={`${d.day}: ${d.views} просмотров, ${d.visits} визитов`}>
                                        <span className="text-[10px] tabular-nums text-black/40">{d.views}</span>
                                        <div
                                            className="w-full rounded-t bg-[#141C26]"
                                            style={{ height: `${Math.max(4, (d.views / maxDay) * 110)}px` }}
                                        />
                                        <span className="text-[10px] text-black/40">{d.day.slice(5)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card title="Топ страниц">
                            {data.topPages.length === 0 ? <p className="text-sm text-black/40">Пока нет данных.</p> : (
                                <ul>
                                    {data.topPages.map((row) => (
                                        <Bar key={row.path} label={row.path} value={row.views} max={maxPage} suffix={`/ ${row.visits} виз.`} />
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card title="Источники переходов">
                            {data.sources.length === 0 ? <p className="text-sm text-black/40">Пока нет данных.</p> : (
                                <ul>
                                    {data.sources.map((row) => (
                                        <Bar
                                            key={row.source}
                                            label={SOURCE_LABELS[row.source] || row.source}
                                            value={row.views}
                                            max={maxSource}
                                            suffix={totalSourceViews ? `· ${Math.round((row.views / totalSourceViews) * 100)}%` : ''}
                                        />
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card title="Откуда приходят (конкретные сайты)">
                            {data.referrers.length === 0 ? <p className="text-sm text-black/40">Переходов с других сайтов пока нет.</p> : (
                                <ul>
                                    {data.referrers.map((row) => (
                                        <Bar key={row.host} label={row.host} value={row.views} max={maxRef} />
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card title="Устройства">
                            {data.devices.length === 0 ? <p className="text-sm text-black/40">Пока нет данных.</p> : (
                                <ul>
                                    {data.devices.map((row) => (
                                        <Bar key={row.device} label={DEVICE_LABELS[row.device] || row.device} value={row.views} max={maxDevice} />
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card title="Цели и конверсии">
                            {data.goals.length === 0 ? (
                                <p className="text-sm text-black/40">Целей за период не зафиксировано.</p>
                            ) : (
                                <ul className="divide-y divide-black/5">
                                    {data.goals.map((row) => (
                                        <li key={row.name} className="flex items-center justify-between py-2.5 text-sm">
                                            <span className="text-black/80">{GOAL_LABELS[row.name] || row.name}</span>
                                            <span className="font-semibold tabular-nums">{row.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card title="Последняя активность">
                            {data.recent.length === 0 ? <p className="text-sm text-black/40">Пока нет данных.</p> : (
                                <ul className="divide-y divide-black/5">
                                    {data.recent.map((row, i) => (
                                        <li key={i} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                                            <div className="min-w-0">
                                                <p className="truncate text-black/80">{row.path}</p>
                                                <p className="text-xs text-black/40">
                                                    {SOURCE_LABELS[row.source] || row.source}
                                                    {row.referrer_host ? ` · ${row.referrer_host}` : ''}
                                                    {' · '}{DEVICE_LABELS[row.device] || row.device}
                                                </p>
                                            </div>
                                            <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-black/40">{formatTime(row.created_at)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>

                    <p className="text-xs text-black/40">
                        Данные собираются нашим трекером и хранятся на сервере. Боты и разделы <code>/admin</code> в статистику не попадают.
                    </p>
                </div>
            )}
        </div>
    );
}
