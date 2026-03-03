"use client";

import Image from "next/image";
import Link from "next/link";

const MODELS = [
    {
        id: "vela",
        name: "BUENOFURNI VELA",
        desc: "", // Removed description
        price: "от 5 900 ₽",
        image: "/generated/chair_boucle_light_oak_1772143430205.webp",
    },
    {
        id: "aurora",
        name: "BUENOFURNI AURORA",
        desc: "", // Removed description
        price: "от 5 900 ₽",
        image: "/generated/chair_microvelour_dark_walnut_1772143445101.webp",
    },
    {
        id: "anora",
        name: "BUENOFURNI ANORA",
        desc: "", // Removed description
        price: "от 5 900 ₽",
        image: "/generated/chair_ecoleather_light_oak_1772144305992.webp",
    }
];

export default function FeaturedModels() {
    return (
        <section className="py-24 sm:py-32 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black">
                            Популярные модели
                        </h2>
                        <p className="mt-4 text-lg text-[var(--muted)]">
                            Основа нашего каталога — выверенные конструкции, которые мы адаптируем под вас.
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        className="group flex flex-shrink-0 items-center gap-2 text-sm font-medium text-black transition-all hover:opacity-70"
                    >
                        Смотреть весь каталог
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {MODELS.map((model) => (
                        <Link key={model.id} href="/catalog" className="group flex flex-col">
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[var(--background)] mb-6 shadow-sm ring-1 ring-inset ring-black/5">
                                <Image
                                    src={model.image}
                                    alt={model.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex items-start justify-between gap-4 px-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-1">{model.name}</h3>
                                    <p className="text-sm text-[var(--muted)] line-clamp-2">{model.desc}</p>
                                </div>
                                <div className="text-sm font-semibold whitespace-nowrap bg-black/5 px-3 py-1 rounded-full">
                                    {model.price}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
