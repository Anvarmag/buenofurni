"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/app/providers";
import ProductGallery from "@/components/product/ProductGallery";
import ImageZoomModal from "@/components/product/ImageZoomModal";
import CatalogOrderModal from "@/components/modals/CatalogOrderModal";
import { Product, UpholsteryType, LegsColorType, AvailabilityType, CategoryType, LegsMaterialType } from "../_data/products";

export default function CatalogClient({ products }: { products: Product[] }) {
    const { openModal } = useModal();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Filters state
    const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
    const [selectedUpholstery, setSelectedUpholstery] = useState<UpholsteryType[]>([]);
    const [selectedLegs, setSelectedLegs] = useState<LegsColorType | null>(null);
    const [selectedLegsMaterial, setSelectedLegsMaterial] = useState<LegsMaterialType[]>([]);
    const [availability, setAvailability] = useState<AvailabilityType | null>(null);

    // Active product for detailed popup
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Active product image for fullscreen zoom on the catalog
    const [zoomedProductInfo, setZoomedProductInfo] = useState<{ images: string[], title: string } | null>(null);

    // Active product for catalog order modal
    const [orderingProduct, setOrderingProduct] = useState<Product | null>(null);

    // Apply filters
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category || 'Стулья');
            const matchUpholstery = selectedUpholstery.length === 0 || selectedUpholstery.includes(p.upholstery);
            const matchLegs = selectedLegs === null || p.legsColor === selectedLegs;
            const matchLegsMaterial = selectedLegsMaterial.length === 0 || selectedLegsMaterial.includes(p.legsMaterial || 'Березовая фанера');
            const matchAvail = availability === null || p.availability === availability;
            return matchCategory && matchUpholstery && matchLegs && matchLegsMaterial && matchAvail;
        });
    }, [products, selectedCategories, selectedUpholstery, selectedLegs, selectedLegsMaterial, availability]);

    // Prevent scrolling when mobile filter is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMobileMenuOpen]);

    // Handlers
    const toggleCategory = (val: CategoryType) => {
        setSelectedCategories(prev =>
            prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };

    const toggleUpholstery = (val: UpholsteryType) => {
        setSelectedUpholstery(prev =>
            prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };

    const toggleLegsMaterial = (val: LegsMaterialType) => {
        setSelectedLegsMaterial(prev =>
            prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };

    const FilterPanel = () => (
        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 flex flex-col gap-8">
            <div>
                <h3 className="text-lg font-bold mb-4">Мебель</h3>
                <div className="flex flex-col gap-3">
                    {(["Стулья", "Барные стулья", "Табуретки", "Столы"] as CategoryType[]).map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                                className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                            />
                            <span className="text-sm group-hover:text-[var(--accent)] transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

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
                <h3 className="text-lg font-bold mb-4">Материал ножек</h3>
                <div className="flex flex-col gap-3">
                    {(["Березовая фанера", "Массив березы", "Массив дуба", "Массив бука"] as LegsMaterialType[]).map((mat) => (
                        <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedLegsMaterial.includes(mat)}
                                onChange={() => toggleLegsMaterial(mat)}
                                className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                            />
                            <span className="text-sm group-hover:text-[var(--accent)] transition-colors">{mat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">Цвет ножек</h3>
                <div className="flex flex-col gap-3">
                    {(["Орех", "Светло коричневый", "Коричневый", "Натуральный", "Черный"] as LegsColorType[]).map((leg) => (
                        <div
                            key={leg}
                            onClick={() => setSelectedLegs(selectedLegs === leg ? null : leg)}
                            className="flex items-center gap-3 cursor-pointer group select-none"
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedLegs === leg ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-gray-300 bg-white'}`}>
                                {selectedLegs === leg && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className="text-sm group-hover:text-[var(--accent)] transition-colors">{leg}</span>
                        </div>
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
                    <div
                        onClick={() => setAvailability(availability === 'in-stock' ? null : 'in-stock')}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${availability === 'in-stock' ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-gray-300 bg-white'}`}>
                            {availability === 'in-stock' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm group-hover:text-[var(--accent)] transition-colors">В наличии</span>
                    </div>

                    <div
                        onClick={() => setAvailability(availability === 'made-to-order' ? null : 'made-to-order')}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${availability === 'made-to-order' ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-gray-300 bg-white'}`}>
                            {availability === 'made-to-order' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm group-hover:text-[var(--accent)] transition-colors">Под заказ</span>
                    </div>
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
                    <div className="lg:hidden mb-6 sticky top-[80px] z-20 bg-[var(--background)] py-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="w-full flex justify-between items-center bg-white border border-black/10 px-6 py-4 rounded-xl shadow-sm text-lg font-medium"
                        >
                            Фильтры
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </button>
                    </div>

                    {/* Grid */}
                    <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6" aria-label="Список стульев">
                        {filteredProducts.map((product, idx) => (
                            <article key={product.slug} className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-black/15 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">

                                {/* Image & Badges */}
                                <div className="relative block aspect-[4/5] bg-gray-100 overflow-hidden text-left group">
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start pointer-events-none">
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

                                    {/* Main clickable area for details */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProduct(product)}
                                        className="absolute inset-0 z-[5] cursor-pointer"
                                        aria-label={`Подробнее о ${product.title}`}
                                    />

                                    {/* Zoom Button (visible on hover) */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setZoomedProductInfo({
                                                images: [product.imagePath, ...(product.galleryImages || [])],
                                                title: product.title
                                            });
                                        }}
                                        className="absolute top-4 right-4 z-[40] w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-black/70 hover:text-black opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all shadow-sm translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0"
                                        aria-label="Увеличить фото"
                                    >
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </button>

                                    <Image
                                        src={product.imagePath || "/placeholder.jpg"}
                                        alt={product.title}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        priority={idx < 4}
                                        loading={idx < 4 ? undefined : "lazy"}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-3 sm:p-5 lg:p-6 flex flex-col flex-1 bg-white">
                                    <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-1 text-gray-900 line-clamp-2 leading-tight" title={product.title}>{product.title}</h2>
                                    <p className="text-xs sm:text-sm text-[var(--muted)] mb-4 flex-1 line-clamp-3">{product.shortDescription}</p>

                                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                                        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-gray-100">{product.category || 'Стулья'}</span>
                                        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-gray-100">{product.legsMaterial || 'Березовая фанера'}</span>
                                    </div>

                                    <div className="mb-4 sm:mb-6">
                                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-0.5 sm:mb-1">Стоимость</p>
                                        <p className="text-base sm:text-lg lg:text-xl font-bold text-[var(--accent)]">
                                            {product.priceFrom.toLocaleString('ru-RU')} ₽
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
                                        <button
                                            onClick={() => setOrderingProduct(product)}
                                            className="w-full bg-[var(--accent)] hover:opacity-90 text-white h-[36px] sm:h-[44px] rounded-full font-medium text-xs sm:text-sm text-center transition-opacity shadow-md"
                                            aria-label={`Заказать ${product.title}`}
                                        >
                                            Заказать
                                        </button>
                                        <button
                                            onClick={() => setSelectedProduct(product)}
                                            className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 h-[36px] sm:h-[44px] rounded-full font-medium text-xs sm:text-sm text-center transition-all"
                                        >
                                            Подробнее
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

            {/* Product Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-left">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedProduct(null)}
                        aria-hidden="true"
                    />

                    {/* Modal Panel */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[600px] flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute right-4 top-4 z-[110] bg-white/80 backdrop-blur-md rounded-full p-2 text-black/50 hover:bg-gray-100 hover:text-black transition focus:outline-none focus:ring-2 focus:ring-black"
                            aria-label="Закрыть"
                        >
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image side */}
                        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col p-4 md:p-8 min-h-[300px] shrink-0">
                            <ProductGallery
                                images={[selectedProduct.imagePath, ...(selectedProduct.galleryImages || [])]}
                                title={selectedProduct.title}
                                badges={selectedProduct.badges}
                                inStock={selectedProduct.availability === 'in-stock'}
                            />
                        </div>

                        {/* Content side */}
                        <div className="w-full md:w-1/2 p-5 md:p-8 flex flex-col overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">{selectedProduct.title}</h2>
                            <p className="text-[13px] text-gray-600 mb-4 line-clamp-3 leading-relaxed">{selectedProduct.shortDescription}</p>

                            <div className="mb-6">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-0.5">Стоимость</span>
                                <span className="text-2xl font-bold text-black">
                                    {selectedProduct.priceFrom.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>

                            <div className="w-full space-y-3 mb-6">
                                <h3 className="text-xs font-semibold uppercase tracking-wider border-b border-gray-100 pb-1.5">Характеристики</h3>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs mt-3">
                                    <div>
                                        <span className="text-gray-500 block mb-1">Тип мебели</span>
                                        <span className="font-medium bg-gray-100 px-2 py-1 rounded-md inline-block">{selectedProduct.category || 'Стулья'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Мат. обивки</span>
                                        <span className="font-medium bg-gray-100 px-2 py-1 rounded-md inline-block">{selectedProduct.upholstery}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Мат. ножек</span>
                                        <span className="font-medium bg-gray-100 px-2 py-1 rounded-md inline-block">{selectedProduct.legsMaterial || 'Березовая фанера'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Цвет ножек</span>
                                        <span className="font-medium bg-gray-100 px-2 py-1 rounded-md inline-block">{selectedProduct.legsColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full mt-auto pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        // Slight delay so the UI doesn't visually jump too hard between modals
                                        setTimeout(() => setOrderingProduct(selectedProduct), 100);
                                    }}
                                    className="w-full bg-[var(--accent)] hover:opacity-90 text-white h-[48px] rounded-full font-medium text-sm text-center transition-opacity shadow-lg mb-3"
                                >
                                    Заказать
                                </button>

                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="w-full block text-center text-xs font-medium text-[var(--muted)] hover:text-black transition-colors py-1"
                                >
                                    Назад в каталог
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Catalog Level Image Zoom Modal */}
            {zoomedProductInfo && (
                <ImageZoomModal
                    images={zoomedProductInfo.images}
                    initialIndex={0}
                    onClose={() => setZoomedProductInfo(null)}
                />
            )}

            {/* Catalog Order Modal */}
            <CatalogOrderModal
                isOpen={!!orderingProduct}
                onClose={() => setOrderingProduct(null)}
                product={orderingProduct}
            />
        </>
    );
}
