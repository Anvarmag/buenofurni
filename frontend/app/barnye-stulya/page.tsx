import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import PageLayout from '@/components/layout/PageLayout';
import { Product } from '../_data/products';
import BarnyeClient from './BarnyeClient';
import { FAQS } from './data';

const BASE = 'https://buenofurni.ru';
const PAGE_URL = `${BASE}/barnye-stulya`;

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Барные стулья деревянные на заказ — своя высота под стойку | BUENOFURNI',
    description:
        'Барные стулья из берёзовой фанеры и массива на заказ: подберём высоту под вашу барную стойку или кухонный остров. Со спинкой и без, мягкое сиденье (микровелюр, букле, экокожа), свой цвет ножек. Любое количество, доставка по России.',
    alternates: { canonical: '/barnye-stulya' },
    openGraph: {
        title: 'Барные стулья деревянные на заказ | BUENOFURNI',
        description:
            'Своя высота под стойку или остров, каркас из берёзовой фанеры или массива, мягкое сиденье. Любое количество, доставка по России.',
        url: PAGE_URL,
        type: 'website',
        images: [{ url: '/blog-covers/karkas-iz-fanery.webp' }],
    },
};

function isRealBarStool(p: Product): boolean {
    const title = (p.title || '').trim().toLowerCase();
    return (
        p.category === 'Барные стулья' &&
        title !== '' &&
        title !== 'новый товар' &&
        typeof p.priceFrom === 'number' &&
        p.priceFrom > 0 &&
        !!p.imagePath &&
        p.imagePath.trim() !== ''
    );
}

export default async function BarnyeStulyaPage() {
    let products: Product[] = [];
    try {
        const filePath = path.join(process.cwd(), 'data', 'products.json');
        const raw = await fs.readFile(filePath, 'utf8');
        products = (JSON.parse(raw) as Product[]).filter(isRealBarStool);
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
                { '@type': 'ListItem', position: 3, name: 'Барные стулья', item: PAGE_URL },
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
                    description: p.shortDescription || 'Барный стул из берёзовой фанеры от производителя BUENOFURNI.',
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
                <BarnyeClient products={products} faqs={FAQS} />
            </main>
        </PageLayout>
    );
}
