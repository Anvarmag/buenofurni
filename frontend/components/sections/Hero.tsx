"use client";

import { useState, useEffect } from "react";
import FallbackImage from "@/components/ui/FallbackImage";
import Link from "next/link";
import { useModal } from "@/app/providers";

const HERO_IMAGES = [
    "/generated/hero_chair_v1.webp",
    "/generated/hero_chair_v2.webp",
    "/generated/hero_chair_v3.webp",
];

export default function Hero() {
    const { openModal } = useModal();
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIdx((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[90vh] w-full overflow-hidden bg-[var(--background)] pt-20 flex items-center">
            {/* Background Graphic Element */}
            <div className="absolute -right-[20%] -top-[10%] h-[80vh] w-[80vh] rounded-full bg-[#EAE2D3] blur-3xl opacity-60 pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">

                    {/* Text Content */}
                    <div className="lg:col-span-5 flex flex-col justify-center animate-in slide-in-from-bottom-8 fade-in duration-1000">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-semibold leading-[1.05] tracking-tight text-balance text-black">
                            Стулья, которые формируют пространство.
                        </h1>

                        <p className="mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-[var(--muted)]">
                            Собственное производство. Берёзовая фанера, массив березы, дуба и бука. Открытые цены. В наличии и под заказ.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
                            <Link
                                href="/catalog"
                                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-4 text-base font-medium text-white transition-all hover:bg-[var(--accent)]/90 hover:scale-[1.02] sm:w-auto sm:px-8 shadow-lg shadow-black/5 text-center whitespace-normal"
                            >
                                Смотреть каталог
                            </Link>
                            <button
                                onClick={() => openModal("b2c", "hero-request")}
                                className="inline-flex w-full items-center justify-center rounded-full border border-black/15 bg-transparent px-6 py-4 text-base font-medium text-black transition-all hover:bg-black/5 hover:border-black/30 sm:w-auto sm:px-8 whitespace-normal text-center leading-tight"
                            >
                                Рассчитать стоимость
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-sm font-medium text-[var(--muted)] border-t border-black/10 pt-6 max-w-md">
                            <div className="flex flex-col">
                                <span className="text-black font-semibold text-base block">от 5 900 ₽</span>
                                <span className="text-xs">Базовая цена</span>
                            </div>
                            <div className="w-[1px] h-8 bg-black/10"></div>
                            <div className="flex flex-col">
                                <span className="text-black font-semibold text-base block">до 15 дней</span>
                                <span className="text-xs">Изготовление</span>
                            </div>
                            <div className="w-[1px] h-8 bg-black/10"></div>
                            <div className="flex flex-col">
                                <span className="text-black font-semibold text-base block">12 мес</span>
                                <span className="text-xs">Гарантия</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="lg:col-span-7 relative animate-in slide-in-from-right-8 fade-in duration-1000 delay-200">
                        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-[2rem] bg-black/5 shadow-2xl">
                            {HERO_IMAGES.map((src, idx) => (
                                <FallbackImage
                                    key={src}
                                    src={src}
                                    alt="Деревянный стул из дуба и букле — BUENOFURNI"
                                    fill
                                    priority={idx === 0}
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    className={`object-cover object-center absolute inset-0 transition-opacity duration-[200ms] ${idx === currentImageIdx ? "opacity-100 z-10" : "opacity-0 z-0"
                                        }`}
                                />
                            ))}
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem] pointer-events-none z-20" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
