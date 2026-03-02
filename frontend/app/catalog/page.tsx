import { Metadata } from 'next';
import CatalogClient from './CatalogClient';
import Script from 'next/script';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '../_data/products';

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
        images: [{ url: '/generated/hero_chair.png', width: 1200, height: 630 }],
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
        <main className="bg-[var(--background)]">
            <Script
                id="catalog-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            {/* Compact Header */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-4 text-center border-b border-black/10">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Каталог</h1>
                    <p className="text-lg md:text-xl text-[var(--muted)] mb-8 font-medium">Собственное производство. Выбирайте ткань, цвет ножек и создавайте мебель под ваш интерьер.</p>
                    <Link href="/contacts" className="button-primary text-lg inline-block hover:scale-105 transition-transform">
                        Оставить заявку
                    </Link>
                </div>
            </section>

            <CatalogClient products={products} />
        </main>
    );
}
