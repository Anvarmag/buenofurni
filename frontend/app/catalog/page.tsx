import { Metadata } from 'next';
import CatalogClient from './CatalogClient';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '../_data/products';
import PageLayout from "@/components/layout/PageLayout";

export const revalidate = 3600; // 1 hour caching for VPS offload

export const metadata: Metadata = {
    title: 'Каталог стульев и кресел | BUENOFURNI в Москве и РФ',
    description: 'Каталог премиальной мебели от производителя BUENOFURNI. Стулья, столы, кресла из берёзовой фанеры.',
    alternates: {
        canonical: '/catalog',
    },
    openGraph: {
        title: 'Каталог стульев и кресел | BUENOFURNI',
        description: 'Каталог премиальной мебели от производителя BUENOFURNI. Выбирайте ткань, цвет ножек и создавайте стул под ваш интерьер.',
        url: 'https://buenofurni.ru/catalog',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    }
};

export default async function CatalogPage() {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    let products: Product[] = [];

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        products = JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading products.json:', error);
    }

    // Generate Schema.org ItemList structure
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.title,
                "brand": { "@type": "Brand", "name": "BUENOFURNI" },
                "description": product.shortDescription,
                "image": `https://buenofurni.ru${product.imagePath}`,
                "url": `https://buenofurni.ru/product/${product.slug}`,
                "offers": {
                    "@type": "AggregateOffer",
                    "lowPrice": product.priceFrom,
                    "priceCurrency": "RUB",
                    "availability": product.availability === 'in-stock' ? "https://schema.org/InStock" : "https://schema.org/PreOrder"
                }
            }
        }))
    };

    return (
        <PageLayout headerVariant="default">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            {/* Compact Header */}
            <section className="pt-8 pb-5 md:pt-10 md:pb-7 px-4 text-center border-b border-black/10">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Каталог</h1>
                    <p className="text-base md:text-lg text-[var(--muted)] font-medium">Собственное производство. Выбирайте ткань, цвет ножек и создавайте мебель под ваш интерьер.</p>
                </div>
            </section>

            <CatalogClient products={products} />

            {/* SEO-текст каталога — расширенный блок с перелинковкой */}
            <section className="bg-white border-t border-black/10 py-14 md:py-20">
                <div className="container max-w-4xl">
                    <div className="prose prose-neutral lg:prose-lg max-w-none prose-a:text-[var(--accent-wood)] prose-headings:font-bold prose-headings:text-black">
                        <h2>Мебель из берёзовой фанеры и массива от производителя</h2>
                        <p>
                            BUENOFURNI — собственное производство стульев, столов и табуретов. Каркасы из берёзовой
                            фанеры 20 мм класса эмиссии E0,5, под заказ — из массива берёзы, дуба или бука. Мягкие
                            сиденья с наполнителем ППУ и обивкой на выбор:{" "}
                            <Link href="/blog/antivandalnaya-obivka-mikrovelyur">антивандальный микровелюр</Link>, букле
                            или экокожа. Ножки красим в пять цветов и делаем любое количество — хоть один стул.
                        </p>
                        <p>
                            Популярные категории: <Link href="/myagkie-stulya-dlya-kuhni">мягкие стулья для кухни</Link>,{" "}
                            <Link href="/antivandalnye-stulya">антивандальные стулья</Link>,{" "}
                            <Link href="/barnye-stulya">барные стулья</Link>,{" "}
                            <Link href="/obedennaya-gruppa">обеденная группа (стол и стулья в один тон)</Link>,{" "}
                            <Link href="/custom">стулья на заказ</Link> и мебель для{" "}
                            <Link href="/horeca">кафе и ресторанов</Link>.
                        </p>
                        <p>
                            Не знаете, что выбрать? Гайды в блоге:{" "}
                            <Link href="/blog/kak-vybrat-stulya-dlya-kuhni">как выбрать стулья для кухни</Link>,{" "}
                            <Link href="/blog/fanera-ili-massiv-stulya">фанера или массив</Link>,{" "}
                            <Link href="/blog/cveta-nozhek-stulyev">цвета ножек</Link>,{" "}
                            <Link href="/blog/vysota-stula-pod-stol">высота стула под стол</Link>. Доставка по всей
                            России, часть моделей в наличии, изготовление на заказ до 2 недель, гарантия 12 месяцев.
                        </p>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
