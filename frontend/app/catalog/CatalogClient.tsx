"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/app/providers";
import { Product, UpholsteryType, LegsColorType, AvailabilityType } from "../_data/products";

export default function CatalogClient({ products }: { products: Product[] }) {
    const { openModal } = useModal();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Filters state
    const [selectedUpholstery, setSelectedUpholstery] = useState<UpholsteryType[]>([]);
    const [selectedLegs, setSelectedLegs] = useState<LegsColorType | null>(null);
    const [availability, setAvailability] = useState<AvailabilityType | null>(null);

    // Apply filters
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchUpholstery = selectedUpholstery.length === 0 || selectedUpholstery.includes(p.upholstery);
            const matchLegs = selectedLegs === null || p.legsColor === selectedLegs;
            const matchAvail = availability === null || p.availability === availability;
            return matchUpholstery && matchLegs && matchAvail;
        });
    }, [products, selectedUpholstery, selectedLegs, availability]);

    // Prevent scrolling when mobile filter is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMobileMenuOpen]);

    // Handlers
    const toggleUpholstery = (val: UpholsteryType) => {
        setSelectedUpholstery(prev =>
            prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };

    const FilterPanel = () => (
        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 flex flex-col gap-8">
            <div>
                <h3 className="text-lg font-bold mb-4">Ткань</h3>
                <div className="flex flex-col gap-3">
                    {(["Микровелюр", "Букле", "Экокожа"] as UpholsteryType[]).map((uph) => (
                        <label key={uph} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedUpholstery.includes(uph)}
                                onChange={() => toggleUpholstery(uph)}
                                className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                            />
                            <span className="text-sm group-hover:text-[var(--accent)] transition-colors">{uph}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">Цвет ножек</h3>
                <div className="flex flex-col gap-3">
                    {(["Светлый дуб", "Тёмный орех"] as LegsColorType[]).map((leg) => (
                        <label key={leg} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="legs"
                                checked={selectedLegs === leg}
                                onChange={() => setSelectedLegs(leg)}
                                className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                            />
                            <span className="text-sm group-hover:text-[var(--accent)] transition-colors">{leg}</span>
                        </label>
                    ))}
                    {selectedLegs && (
                        <button onClick={() => setSelectedLegs(null)} className="text-xs text-[var(--muted)] hover:text-black underline text-left mt-1">
                            Сбросить цвет
                        </button>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">Наличие</h3>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="avail"
                            checked={availability === 'in-stock'}
                            onChange={() => setAvailability('in-stock')}
                            className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                        />
                        <span className="text-sm group-hover:text-[var(--accent)] transition-colors">В наличии</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="avail"
                            checked={availability === 'made-to-order'}
                            onChange={() => setAvailability('made-to-order')}
                            className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                        />
                        <span className="text-sm group-hover:text-[var(--accent)] transition-colors">Под заказ</span>
                    </label>
                    {availability && (
                        <button onClick={() => setAvailability(null)} className="text-xs text-[var(--muted)] hover:text-black underline text-left mt-1">
                            Показать все
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="container py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">

                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-[320px] shrink-0 sticky top-[100px]">
                    <FilterPanel />
                </aside>

                {/* Main Content */}
                <div className="flex-1 w-full">
                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden mb-6 sticky top-[80px] z-30 bg-[var(--background)] py-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="w-full flex justify-between items-center bg-white border border-black/10 px-6 py-4 rounded-xl shadow-sm text-lg font-medium"
                        >
                            Фильтры
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </button>
                    </div>

                    {/* Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Список стульев">
                        {filteredProducts.map((product, idx) => (
                            <article key={product.slug} className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-black/15 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">

                                {/* Image & Badges */}
                                <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-gray-100 overflow-hidden">
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
                                        {product.availability === 'in-stock' && (
                                            <span className="bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                                                В наличии
                                            </span>
                                        )}
                                        {product.badges.map(b => (
                                            <span key={b} className="bg-[var(--accent)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                                                {b}
                                            </span>
                                        ))}
                                    </div>

                                    <Image
                                        src={product.imagePath}
                                        alt={product.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        priority={idx < 4}
                                        loading={idx < 4 ? undefined : "lazy"}
                                    />
                                </Link>

                                {/* Content */}
                                <div className="p-5 sm:p-6 flex flex-col flex-1 bg-white">
                                    <h2 className="text-xl font-bold mb-1 text-gray-900 line-clamp-1">{product.title}</h2>
                                    <p className="text-sm text-[var(--muted)] mb-4 flex-1 line-clamp-2">{product.shortDescription}</p>

                                    <div className="mb-6">
                                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Стоимость</p>
                                        <p className="text-xl font-bold text-[var(--accent)]">
                                            от {product.priceFrom.toLocaleString('ru-RU')} ₽
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-auto">
                                        <Link href={`/product/${product.slug}`} className="button-secondary text-center text-sm font-semibold h-[48px] flex items-center justify-center hover:bg-gray-50">
                                            Подробнее
                                        </Link>
                                        <button
                                            onClick={() => openModal('b2c', `catalog_card_${product.slug}`)}
                                            className="button-primary text-center text-sm font-semibold h-[48px] flex items-center justify-center"
                                            aria-label={`Оставить заявку на ${product.title}`}
                                        >
                                            Оставить заявку
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-xl font-medium mb-4">По вашим фильтрам ничего не найдено</p>
                                <button onClick={() => {
                                    setSelectedLegs(null);
                                    setSelectedUpholstery([]);
                                    setAvailability(null);
                                }} className="button-primary">Сбросить все фильтры</button>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Mobile Off-Canvas Filter Panel */}
            <div className={`fixed inset-0 z-50 bg-[var(--background)] transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isMobileMenuOpen ? "translate-y-0" : "translate-y-full"}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white sticky top-0 shrink-0">
                    <h2 className="text-xl font-bold">Фильтры</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2" aria-label="Закрыть фильтры">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
                    <FilterPanel />
                </div>

                {/* Sticky footer CTA */}
                <div className="absolute inset-x-0 bottom-0 bg-white border-t border-black/10 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full button-primary text-center h-[52px] text-lg font-medium"
                    >
                        Показать {filteredProducts.length} товаров
                    </button>
                </div>
            </div>
        </>
    );
}
