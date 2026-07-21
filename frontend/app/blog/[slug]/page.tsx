import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageLayout from '@/components/layout/PageLayout';
import { getAllArticles, getArticle } from '../../_data/blog';

const BASE = 'https://buenofurni.ru';

// Картинки внутри текста статьи — центрируем и держим «нормальный» размер,
// чтобы вертикальные фото не занимали весь экран.
const markdownComponents: Components = {
    img: ({ src, alt }) =>
        src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={typeof src === 'string' ? src : undefined}
                alt={alt || ''}
                loading="lazy"
                className="mx-auto my-8 max-h-[420px] w-auto max-w-full rounded-xl shadow-sm"
            />
        ) : null,
};

export async function generateStaticParams() {
    return getAllArticles().map((article) => ({ slug: article.slug }));
}

export const revalidate = 3600;

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
            images: article.cover ? [{ url: article.cover, alt: article.coverAlt || article.title }] : undefined,
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
                <script
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
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight">
                            {article.title}
                        </h1>
                    </header>

                    {article.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={article.cover}
                            alt={article.coverAlt || article.title}
                            className="mx-auto mb-8 max-h-[480px] w-auto max-w-full rounded-2xl shadow-sm"
                        />
                    )}

                    <article className="prose prose-neutral lg:prose-lg max-w-none break-words marker:text-[var(--accent)] prose-headings:font-bold prose-headings:text-[var(--foreground)] prose-a:text-[var(--accent-wood)] hover:prose-a:opacity-80 prose-img:rounded-xl prose-strong:text-[var(--foreground)]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {article.body}
                        </ReactMarkdown>
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
