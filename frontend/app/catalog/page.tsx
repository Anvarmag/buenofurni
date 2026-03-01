import { Metadata } from 'next';
import CatalogClient from './CatalogClient';
import { products } from '../_data/products';
import Script from 'next/script';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Каталог стульев и кресел | BUENOFURNI',
    description: 'Каталог премиальной мебели от производителя BUENOFURNI. Стулья, столы, кресла из берёзовой фанеры. Выбирайте ткань, цвет ножек и создавайте стул под ваш интерьер.',
    alternates: {
        canonical: '/catalog',
    }
};

export default function CatalogPage() {

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
