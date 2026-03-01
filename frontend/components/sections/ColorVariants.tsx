"use client";

import { useState } from "react";
import Image from "next/image";
import { useModal } from "@/app/providers";

// The swatches we have generated images for
const VARIANTS = [
    {
        id: "beige",
        name: "Массив березы(Натуральный) / Букле (Беж)",
        colorCode: "#EBE3D5", // Beige
        image: "/generated/chair_beige_1772141177229.png",
    },
    {
        id: "olive",
        name: "Светло коричневый / Микровелюр (Темно бежевый)",
        colorCode: "#957b6e", // Olive green
        image: "/generated/chair_olive_1772141156483.png",
    },
    {
        id: "gray",
        name: "Тёмно коричневый / Экокожа (Коричневый)",
        colorCode: "#56433c", // Gray
        image: "/generated/chair_gray_1772141189527.png",
    },
];

export default function ColorVariants() {
    const { openModal } = useModal();
    const [activeVariant, setActiveVariant] = useState(VARIANTS[0]);

    return (
        <section className="py-24 sm:py-32 bg-[var(--background)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Image Display */}
                    <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-[2rem] bg-white shadow-sm overflow-hidden flex items-center justify-center p-8 group">
                        {VARIANTS.map((v) => (
                            <Image
                                key={v.id}
                                src={v.image}
                                alt={v.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className={`object-contain p-8 sm:p-12 transition-all duration-700 ease-in-out ${activeVariant.id === v.id
                                    ? "opacity-100 scale-100 rotate-0"
                                    : "opacity-0 scale-95 rotate-2"
                                    }`}
                            />
                        ))}
                        {/* Subtle overlay border for premium feel */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none" />
                    </div>

                    {/* Interactive Info */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance text-black">
                            Один дизайн.<br />Разные характеры.
                        </h2>
                        <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed max-w-md">
                            Скомбинируйте оттенок деревянных ножек и фактуру ткани так, чтобы стул идеально вписался в ваш интерьер.
                        </p>

                        {/* Swatches */}
                        <div className="mt-12">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                                    Выбранный цвет:
                                </span>
                                <span className="text-sm font-semibold text-black animate-in fade-in slide-in-from-left-2 duration-300" key={activeVariant.id}>
                                    {activeVariant.name}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {VARIANTS.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setActiveVariant(variant)}
                                        aria-label={`Выбрать цвет ${variant.name}`}
                                        className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ${activeVariant.id === variant.id ? "ring-2 ring-black ring-offset-4 ring-offset-[var(--background)]" : "ring-1 ring-black/10 hover:ring-black/30"
                                            }`}
                                    >
                                        <span
                                            className="h-14 w-14 rounded-full shadow-inner"
                                            style={{ backgroundColor: variant.colorCode }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-8 border-t border-black/10">
                            <button
                                onClick={() => openModal("b2c", "swatches-request")}
                                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-all hover:bg-black/90 hover:scale-[1.02] shadow-lg shadow-black/10"
                            >
                                Согласовать цвета
                            </button>
                            <a
                                href="/materials"
                                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-transparent px-8 py-4 text-base font-medium text-black transition-all hover:bg-black/5"
                            >
                                Подробнее о материалах
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
