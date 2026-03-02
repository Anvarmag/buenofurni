import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import ProductGallery from '@/components/product/ProductGallery';
import Script from 'next/script';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '../../_data/products';

async function getProducts(): Promise<Product[]> {
    try {
        const filePath = path.join(process.cwd(), 'data', 'products.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        console.error('Error reading products:', e);
        return [];
    }
}

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((p) => ({
        slug: p.slug,
    }));
}

export const revalidate = 3600; // 1 hour caching for VPS offload

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const products = await getProducts();
    const product = products.find(p => p.slug === params.slug);

    if (!product) {
        return { title: 'Товар не найден' };
    }

    return {
        title: `${product.title} | Купить по цене от ${product.priceFrom} ₽`,
        description: `${product.title} от BUENOFURNI. ${product.shortDescription} Заказывайте напрямую у производителя!`,
        openGraph: {
            title: `${product.title} - BUENOFURNI`,
            description: product.shortDescription,
            url: `https://buenofurni.ru/product/${product.slug}`,
            images: [
                {
                    url: product.imagePath,
                    width: 800,
                    height: 800,
                    alt: product.title,
                }
            ]
        },
        alternates: {
            canonical: `/product/${product.slug}`
        }
    };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const products = await getProducts();
    const product = products.find(p => p.slug === params.slug);

    if (!product) {
        notFound();
    }

    const schemaMarkup = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": `https://buenofurni.ru${product.imagePath}`,
        "description": product.shortDescription,
        "offers": {
            "@type": "Offer",
            "url": `https://buenofurni.ru/product/${product.slug}`,
            "priceCurrency": "RUB",
            "price": product.priceFrom,
            "availability": product.availability === 'in-stock' ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    return (
        <main className="bg-white min-h-screen pt-24 pb-16">
            <Script
                id={`product-schema-${product.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            <div className="container max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="text-sm text-[var(--muted)] mb-8 flex gap-2 items-center">
                    <Link href="/" className="hover:text-black transition-colors">Главная</Link>
                    <span>/</span>
                    <Link href="/catalog" className="hover:text-black transition-colors">Каталог</Link>
                    <span>/</span>
                    <span className="text-black font-medium">{product.title}</span>
                </nav>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Gallery */}
                    <div className="relative aspect-[4/5] lg:aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-black/5 pt-12 md:pt-0">
                        <ProductGallery
                            images={[product.imagePath, ...(product.galleryImages || [])]}
                            title={product.title}
                            badges={product.badges}
                            inStock={product.availability === 'in-stock'}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{product.title}</h1>
                        <p className="text-lg text-[var(--muted)] mb-8 leading-relaxed">
                            {product.shortDescription}
                        </p>

                        <div className="mb-10 pb-10 border-b border-black/10">
                            <span className="text-sm uppercase tracking-wider text-gray-500 block mb-2">Базовая стоимость</span>
                            <span className="text-4xl font-bold text-black" itemProp="price">
                                {product.priceFrom.toLocaleString('ru-RU')} ₽
                            </span>
                        </div>

                        <div className="flex flex-col gap-6 mb-12">
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Тип мебели</h3>
                                <div className="inline-flex bg-gray-100 items-center justify-center px-5 py-2.5 rounded-full font-medium text-gray-800">
                                    {product.category || 'Стулья'}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Обивка (Материал)</h3>
                                <div className="inline-flex bg-gray-100 items-center justify-center px-5 py-2.5 rounded-full font-medium text-gray-800">
                                    {product.upholstery}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Материал ножек</h3>
                                <div className="inline-flex bg-gray-100 items-center justify-center px-5 py-2.5 rounded-full font-medium text-gray-800">
                                    {product.legsMaterial || 'Березовая фанера'}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Цвет ножек</h3>
                                <div className="inline-flex bg-gray-100 items-center justify-center px-5 py-2.5 rounded-full font-medium text-gray-800">
                                    {product.legsColor}
                                </div>
                            </div>
                        </div>

                        <ProductClient productTitle={product.title} productSlug={product.slug} />

                        <div className="mt-8 pt-8 border-t border-black/10 text-sm text-[var(--muted)] hover:text-black transition-colors">
                            <Link href="/materials" className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Подробнее о материалах и уходе
                            </Link>
                        </div>
                    </div>

                </section>
            </div>
        </main>
    );
}
