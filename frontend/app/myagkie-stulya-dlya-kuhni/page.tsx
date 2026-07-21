import type { Metadata } from 'next';
import Script from 'next/script';
import { promises as fs } from 'fs';
import path from 'path';
import PageLayout from '@/components/layout/PageLayout';
import { Product } from '../_data/products';
import MyagkieClient from './MyagkieClient';

const BASE = 'https://buenofurni.ru';
const PAGE_URL = `${BASE}/myagkie-stulya-dlya-kuhni`;

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Мягкие стулья для кухни от производителя — купить, любое количество | BUENOFURNI',
    description:
        'Мягкие стулья для кухни от производителя BUENOFURNI: антивандальный микровелюр, каркас из берёзовой фанеры 20 мм (класс E0,5). Со спинкой и с подлокотниками, свой цвет ножек, любое количество — хоть один стул. Цена от 5 900 ₽, доставка по всей России.',
    alternates: { canonical: '/myagkie-stulya-dlya-kuhni' },
    openGraph: {
        title: 'Мягкие стулья для кухни от производителя | BUENOFURNI',
        description:
            'Антивандальный микровелюр, берёзовая фанера E0,5, любое количество — хоть один стул. Цена от 5 900 ₽, доставка по России.',
        url: PAGE_URL,
        type: 'website',
        images: [{ url: '/blog-covers/stulya-dlya-kuhni.webp' }],
    },
};

// Единый источник FAQ: и для видимого аккордеона, и для FAQPage-разметки.
export const FAQS: { q: string; a: string }[] = [
    {
        q: 'Сколько стоят мягкие стулья для кухни?',
        a: 'Цена начинается от 5 900 ₽ за стул. Итоговая стоимость зависит от выбранной обивки (микровелюр, букле или экокожа) и отделки ножек. Точный расчёт пришлём по заявке в течение дня.',
    },
    {
        q: 'Можно заказать мягкие стулья со спинкой и с подлокотниками?',
        a: 'Да. Есть модели со спинкой и с подлокотниками — сиденье и спинка мягкие, с наполнителем ППУ высокой плотности. Подскажем, какой вариант удобнее и задвинется ли стул под ваш стол.',
    },
    {
        q: 'Можно купить 2, 4 или другое количество?',
        a: 'Любое количество — хоть один стул. В отличие от маркетплейсов, где стулья продаются комплектами по 2 или 4, у нас можно заказать 1, 3, 5 — сколько нужно именно вам.',
    },
    {
        q: 'Какая обивка у мягких стульев и практична ли она для кухни?',
        a: 'Основная ткань — антивандальный микровелюр, который проходит тест Мартиндейла на 60 000 циклов истирания. Также доступны букле и экокожа. Микровелюр и экокожа легко чистятся — это практично для кухни, семей с детьми и животными.',
    },
    {
        q: 'Стулья в наличии или под заказ?',
        a: 'Часть моделей есть в наличии для быстрой отгрузки, остальные изготавливаем на заказ до 2 недель. Доставка — по всей России, стоимость рассчитывается индивидуально.',
    },
    {
        q: 'Можно выбрать цвет ножек?',
        a: 'Да, ножки красим в пять цветов: чёрный, орех, светло-коричневый, коричневый и натуральный. Если у вас уже есть стол — подберём ножки в тон.',
    },
];

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

export default async function MyagkieStulyaPage() {
    let products: Product[] = [];
    try {
        const filePath = path.join(process.cwd(), 'data', 'products.json');
        const raw = await fs.readFile(filePath, 'utf8');
        products = (JSON.parse(raw) as Product[]).filter(isRealChair);
        // В наличии — вперёд, затем ограничиваем витрину.
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
                { '@type': 'ListItem', position: 3, name: 'Мягкие стулья для кухни', item: PAGE_URL },
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
                    description: p.shortDescription || 'Мягкий стул для кухни от производителя BUENOFURNI.',
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
                <Script
                    id="myagkie-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
                <MyagkieClient products={products} faqs={FAQS} />
            </main>
        </PageLayout>
    );
}
