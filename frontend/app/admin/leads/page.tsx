import { getLeads } from '../../_lib/stats';

export const dynamic = 'force-dynamic';

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminLeadsPage() {
    const data = await getLeads(200);

    return (
        <div className="mx-auto max-w-6xl">
            <header className="mb-8">
                <h1 className="text-2xl font-semibold sm:text-3xl">Заявки</h1>
                <p className="mt-1 text-sm text-black/50">
                    {data ? `Всего в базе: ${data.total}. Показаны последние ${data.leads.length}.` : 'Архив заявок с сайта.'}
                </p>
            </header>

            {data === null ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    Не удалось загрузить заявки: API не отвечает. Проверьте процесс <code>buenofurni-api</code>.
                </div>
            ) : data.leads.length === 0 ? (
                <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm text-black/50">
                    Заявок пока нет. Здесь будут все обращения с сайта — они сохраняются, даже если Telegram недоступен.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead>
                            <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wider text-black/40">
                                <th className="px-4 py-3 font-medium">Дата</th>
                                <th className="px-4 py-3 font-medium">Имя</th>
                                <th className="px-4 py-3 font-medium">Телефон</th>
                                <th className="px-4 py-3 font-medium">Комментарий</th>
                                <th className="px-4 py-3 font-medium">Источник</th>
                                <th className="px-4 py-3 font-medium">Тип</th>
                                <th className="px-4 py-3 font-medium">Доставка</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.leads.map((lead) => (
                                <tr key={lead.id} className="border-b border-black/5 last:border-0 align-top">
                                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-black/60">{formatDate(lead.created_at)}</td>
                                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} className="hover:underline">{lead.phone}</a>
                                    </td>
                                    <td className="max-w-[280px] px-4 py-3 text-black/70">{lead.comment || '—'}</td>
                                    <td className="px-4 py-3 text-black/60">{lead.source || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${lead.lead_type === 'b2b' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {lead.lead_type === 'b2b' ? 'HoReCa' : 'B2C'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {lead.delivered_telegram ? (
                                            <span className="text-green-700">Telegram ✓</span>
                                        ) : (
                                            <span className="text-red-700">не доставлено</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
