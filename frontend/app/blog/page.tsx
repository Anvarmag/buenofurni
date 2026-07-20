import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { getAllArticles } from '../_data/blog';

export const metadata: Metadata = {
    title: 'Блог о мебели на заказ | BUENOFURNI',
    description:
        'Гайды по выбору мебели: материалы, стулья, столы, сроки и уход. Экспертные статьи от производителя BUENOFURNI.',
    alternates: { canonical: '/blog' },
};

export const revalidate = 3600;

function formatDate(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPage() {
    const articles = getAllArticles();

    return (
        <PageLayout>
            <main className="bg-[var(--background)] min-h-screen">
                <div className="container py-12 sm:py-16">
                    <header className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[var(--foreground)]">
                            Блог
                        </h1>
                        <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">
                            Как выбрать мебель, из чего складывается цена и сроки, чем отличаются материалы —
                            по делу, от производителя.
                        </p>
                    </header>

                    {articles.length === 0 ? (
                        <p className="text-[var(--muted)]">Скоро здесь появятся статьи.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {articles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className="group flex flex-col bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] transition-shadow hover:shadow-lg"
                                >
                                    {article.cover && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={article.cover}
                                            alt={article.coverAlt || article.title}
                                            loading="lazy"
                                            className="aspect-[16/10] w-full object-cover"
                                        />
                                    )}
                                    <div className="flex flex-col flex-1 p-5 sm:p-6">
                                        {article.date && (
                                            <time className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                                {formatDate(article.date)}
                                            </time>
                                        )}
                                        <h2 className="mt-2 text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-wood)] transition-colors">
                                            {article.title}
                                        </h2>
                                        <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3 flex-1">
                                            {article.description}
                                        </p>
                                        <span className="mt-4 text-sm font-medium text-[var(--accent-wood)]">
                                            Читать →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </PageLayout>
    );
}
