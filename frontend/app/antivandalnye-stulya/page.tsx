import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import PageLayout from '@/components/layout/PageLayout';
import { Product } from '../_data/products';
import AntivandalClient from './AntivandalClient';
import { FAQS } from './data';

const BASE = 'https://buenofurni.ru';
const PAGE_URL = `${BASE}/antivandalnye-stulya`;

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Антивандальные стулья от производителя — микровелюр, купить | BUENOFURNI',
    description:
        'Антивандальные стулья с обивкой из микровелюра (тест Мартиндейла 60 000 циклов): не боятся когтей, легко чистятся. Для дома с детьми и животными и для кафе. Каркас — берёзовая фанера E0,5. Любое количество, от 5 900 ₽, доставка по России.',
    alternates: { canonical: '/antivandalnye-stulya' },
    openGraph: {
        title: 'Антивандальные стулья от производителя | BUENOFURNI',
        description:
            'Микровелюр, устойчивый к когтям и износу (Мартиндейл 60 000). Для семей с животными и для HoReCa. От 5 900 ₽, доставка по России.',
        url: PAGE_URL,
        type: 'website',
        images: [{ url: '/blog-covers/mikrovelyur-obivka.webp' }],
    },
};

function isRealChair(p: Product): boolean {
    const title = (p.title || '').trim().toLowerCase();
    return (
        (p.category === 'Стулья' || p.category === 'Барные стулья') &&
        title !== '' &&
        title !== 'новый товар' &&
        typeof p.priceFrom === 'number' &&
        p.priceFrom > 0 &&
        !!p.imagePath &&
        p.imagePath.trim() !== ''
    );
}

export default async function AntivandalnyeStulyaPage() {
    let products: Product[] = [];
    try {
        const filePath = path.join(process.cwd(), 'data', 'products.json');
        const raw = await fs.readFile(filePath, 'utf8');
        products = (JSON.parse(raw) as Product[]).filter(isRealChair);
        products.sort(
            (a, b) => Number(b.availability === 'in-stock') - Number(a.availability === 'in-stock'),
        );
        products = products.slice(0, 6);
    } catch {
        products = [];
    }

    const graph: Record<string, unknown>[] = [
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE },
                { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE}/catalog` },
                { '@type': 'ListItem', position: 3, name: 'Антивандальные стулья', item: PAGE_URL },
            ],
        },
        {
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        },
    ];

    if (products.length) {
        graph.push({
            '@type': 'ItemList',
            itemListElement: products.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'Product',
                    name: p.title,
                    description: p.shortDescription || 'Антивандальный стул с обивкой из микровелюра от BUENOFURNI.',
                    image: p.imagePath.startsWith('http') ? p.imagePath : `${BASE}${p.imagePath}`,
                    url: `${BASE}/product/${p.slug}`,
                    brand: { '@type': 'Brand', name: 'BUENOFURNI' },
                    offers: {
                        '@type': 'Offer',
                        price: p.priceFrom,
                        priceCurrency: 'RUB',
                        availability:
                            p.availability === 'in-stock'
                                ? 'https://schema.org/InStock'
                                : 'https://schema.org/PreOrder',
                        url: `${BASE}/product/${p.slug}`,
                    },
                },
            })),
        });
    }

    const schema = { '@context': 'https://schema.org', '@graph': graph };

    return (
        <PageLayout headerVariant="overlay">
            <main className="bg-[var(--background)]">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
                <AntivandalClient products={products} faqs={FAQS} />
            </main>
        </PageLayout>
    );
}
