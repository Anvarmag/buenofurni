import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageLayout from '@/components/layout/PageLayout';
import { getAllArticles, getArticle } from '../../_data/blog';

const BASE = 'https://buenofurni.ru';

export async function generateStaticParams() {
    return getAllArticles().map((article) => ({ slug: article.slug }));
}

export const revalidate = 3600;

function formatDate(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticle(slug);
    if (!article) return { title: 'Статья не найдена' };

    return {
        title: `${article.title} | BUENOFURNI`,
        description: article.description,
        alternates: { canonical: `/blog/${article.slug}` },
        openGraph: {
            title: article.title,
            description: article.description,
            url: `${BASE}/blog/${article.slug}`,
            type: 'article',
            images: article.cover ? [{ url: article.cover, alt: article.title }] : undefined,
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = getArticle(slug);
    if (!article) notFound();

    const url = `${BASE}/blog/${article.slug}`;

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                headline: article.title,
                description: article.description,
                image: article.cover ? [`${BASE}${article.cover}`] : undefined,
                datePublished: article.date || undefined,
                dateModified: article.date || undefined,
                author: { '@type': 'Organization', name: 'BUENOFURNI', url: BASE },
                publisher: {
                    '@type': 'Organization',
                    name: 'BUENOFURNI',
                    logo: { '@type': 'ImageObject', url: `${BASE}/favicon.ico` },
                },
                mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            },
            ...(article.faq.length
                ? [
                      {
                          '@type': 'FAQPage',
                          mainEntity: article.faq.map((f) => ({
                              '@type': 'Question',
                              name: f.q,
                              acceptedAnswer: { '@type': 'Answer', text: f.a },
                          })),
                      },
                  ]
                : []),
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE },
                    { '@type': 'ListItem', position: 2, name: 'Блог', item: `${BASE}/blog` },
                    { '@type': 'ListItem', position: 3, name: article.title, item: url },
                ],
            },
        ],
    };

    return (
        <PageLayout>
            <main className="bg-[var(--background)] min-h-screen">
                <Script
                    id={`article-schema-${article.slug}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />

                <div className="container py-10 sm:py-14 max-w-[820px]">
                    {/* Хлебные крошки */}
                    <nav className="text-sm text-[var(--muted)] mb-8 flex gap-2 items-center flex-wrap">
                        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
                            Главная
                        </Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-[var(--foreground)] transition-colors">
                            Блог
                        </Link>
                        <span>/</span>
                        <span className="text-[var(--foreground)]">{article.title}</span>
                    </nav>

                    <header className="mb-8">
                        {article.date && (
                            <time className="text-sm uppercase tracking-wider text-[var(--muted)]">
                                {formatDate(article.date)}
                            </time>
                        )}
                        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight">
                            {article.title}
                        </h1>
                    </header>

                    {article.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.cover} alt={article.title} className="w-full rounded-2xl mb-8 shadow-sm" />
                    )}

                    <article className="prose prose-neutral lg:prose-lg max-w-none break-words marker:text-[var(--accent)] prose-headings:font-bold prose-headings:text-[var(--foreground)] prose-a:text-[var(--accent-wood)] hover:prose-a:opacity-80 prose-img:rounded-xl prose-strong:text-[var(--foreground)]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
                    </article>

                    {/* CTA к заявке */}
                    <div className="mt-12 rounded-2xl bg-[var(--accent)] text-white p-6 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold">Хотите рассчитать свой проект?</h2>
                        <p className="mt-2 text-white/80">
                            Бесплатный замер и расчёт стоимости. Ответим в течение дня.
                        </p>
                        <Link
                            href="/custom"
                            className="inline-block mt-5 bg-white text-[var(--accent)] font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                        >
                            Оставить заявку
                        </Link>
                    </div>

                    <div className="mt-10">
                        <Link href="/blog" className="text-[var(--accent-wood)] font-medium">
                            ← Все статьи
                        </Link>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}
