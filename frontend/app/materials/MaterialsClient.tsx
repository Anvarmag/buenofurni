"use client";

import { useState, useEffect, useRef } from "react";
import FallbackImage from "@/components/ui/FallbackImage";
import { useModal } from "@/app/providers";

// Intersection Observer Hook for scroll reveal animations
function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

// Reveal Wrapper Component
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    const { ref, isVisible } = useScrollReveal();
    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default function MaterialsClient() {
    const { openModal } = useModal();
    const [activeTab, setActiveTab] = useState<"microvelour" | "boucle" | "ecoleather">("microvelour");

    const tabsData = {
        microvelour: {
            title: "Микровелюр",
            desc: "Бархатистая струящаяся фактура, к которой хочется прикасаться.",
            bullets: [
                "Тест Мартиндейла: от 60 000 циклов (повышенная износостойкость)",
                "Легкая чистка влажной губкой",
                "Антивандальный эффект («Антикоготь»)",
                "Глубокие, переливающиеся на свету оттенки"
            ],
            img: "/generated/fabric_microvelour_macro_1772179422710.webp"
        },
        boucle: {
            title: "Букле",
            desc: "Уютная и объемная петельчатая пряжа, задающая тренды в современном дизайне.",
            bullets: [
                "Сложная фактура, скрывающая мелкие пятна",
                "Тактильная мягкость и тепло",
                "Прекрасно держит форму на спинках и сиденьях",
                "Идеально для интерьеров в стиле джапанди и минимализм"
            ],
            img: "/generated/fabric_boucle_macro_1772179435846.webp"
        },
        ecoleather: {
            title: "Премиальная экокожа",
            desc: "Абсолютная практичность и строгий деловой внешний вид с текстурой натуральной кожи.",
            bullets: [
                "Водоотталкивающие свойства (не впитывает пролитые жидкости)",
                "Максимальная простота в уходе и дезинфекции",
                "Атмосферный вид для статусных интерьеров и HoReCa",
                "Не трескается со временем"
            ],
            img: "/generated/fabric_ecoleather_macro_1772179449148.webp"
        }
    };

    return (
        <div className="w-full bg-[var(--background)]">

            {/* Hero */}
            <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <FallbackImage
                        src="/generated/materials_hero_macro_1772179379066.webp"
                        alt="Макро фактура премиальных материалов мебели"
                        fill
                        className="object-cover opacity-60 scale-105 animate-[slow-pan_20s_ease-in-out_infinite_alternate]"
                        priority
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <Reveal>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                            Материалы, <br className="hidden md:block" />которые ощущаются
                        </h1>
                    </Reveal>
                    <Reveal delay={200}>
                        <p className="text-xl md:text-2xl text-gray-200 font-medium tracking-wide drop-shadow-md">
                            Мы выбираем прочность, текстуру и долговечность.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Alternating 1: Plywood */}
            <section className="py-24 md:py-32 overflow-hidden">
                <div className="container max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-1/2 order-1 lg:order-1">
                            <Reveal>
                                <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <FallbackImage
                                        src="/generated/materials_birch_plywood_edge_1772179393601.webp"
                                        alt="Срез березовой фанеры крупным планом"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Reveal>
                        </div>
                        <div className="w-full lg:w-1/2 order-2 lg:order-2 flex flex-col justify-center">
                            <Reveal delay={200}>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Берёзовая фанера</h2>
                                <p className="text-lg md:text-xl text-[var(--muted)] mb-8 leading-relaxed">
                                    Основа наших изделий — высококачественная многослойная берёзовая фанера. В отличие от ДСП или МДФ, она обладает феноменальной прочностью на излом, не крошится и экологически безопасна.
                                </p>
                                <ul className="space-y-4">
                                    {["Выдерживает экстремальные нагрузки (стандарт HoReCa)", "Эстетичный слоистый торец", "Экологичный класс эмиссии E1"].map((text, i) => (
                                        <li key={i} className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0"></div>
                                            <span className="text-lg font-medium">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternating 2: Veneer */}
            <section className="py-24 md:py-32 bg-white overflow-hidden border-y border-black/5">
                <div className="container max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-1/2 order-2 lg:order-1 flex flex-col justify-center">
                            <Reveal delay={200}>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Массив дерева</h2>
                                <p className="text-lg md:text-xl text-[var(--muted)] mb-8 leading-relaxed">
                                    Тонкий срез благородных пород дерева передает неповторимый природный рисунок. Массив придает мебели премиальный внешний вид, сохраняя при этом геометрическую стабильность фанерного каркаса.
                                </p>
                                <ul className="space-y-4">
                                    {["Уникальная фактура каждого изделия", "Защита премиальными итальянскими лаками", "Теплота натурального дерева"].map((text, i) => (
                                        <li key={i} className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-black shrink-0"></div>
                                            <span className="text-lg font-medium">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        </div>
                        <div className="w-full lg:w-1/2 order-1 lg:order-2">
                            <Reveal>
                                <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <FallbackImage
                                        src="/generated/materials_veneer_grain_1772179408932.webp"
                                        alt="Фактура натурального шпона ореха"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fabrics Tabs Section */}
            <section className="py-24 md:py-32 overflow-hidden bg-[var(--background)]">
                <div className="container max-w-7xl">
                    <Reveal>
                        <h2 className="text-4xl md:text-6xl font-black text-center mb-16">Обивочные ткани</h2>
                    </Reveal>

                    {/* General Samples Image */}
                    <Reveal delay={200}>
                        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-16 shadow-lg">
                            <FallbackImage
                                src="/generated/materials_fabric_samples_1772143484127.webp"
                                alt="Образцы обивочных тканей BUENOFURNI"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Reveal>

                    {/* Tabs Control */}
                    <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
                        {(Object.keys(tabsData) as Array<keyof typeof tabsData>).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${activeTab === key
                                    ? 'bg-black text-white shadow-xl scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-black/10'
                                    }`}
                            >
                                {tabsData[key].title}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-black/5">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="w-full lg:w-1/2">
                                <Reveal key={activeTab}> {/* Re-trigger animation on tab change */}
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4">{tabsData[activeTab].title}</h3>
                                    <p className="text-xl text-[var(--muted)] mb-8 leading-relaxed">
                                        {tabsData[activeTab].desc}
                                    </p>
                                    <ul className="space-y-4">
                                        {tabsData[activeTab].bullets.map((bullet, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <svg className="w-6 h-6 text-[var(--accent)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-lg font-medium text-gray-800">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Reveal>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <Reveal delay={200} key={activeTab + "-img"}>
                                    <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-black/5">
                                        <FallbackImage
                                            src={tabsData[activeTab].img}
                                            alt={`Фактура ткани ${tabsData[activeTab].title}`}
                                            fill
                                            className="object-cover transform hover:scale-110 transition-transform duration-[20s] ease-out"
                                        />
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Colors Section */}
            <section className="py-24 bg-black text-white overflow-hidden">
                <div className="container text-center max-w-4xl">
                    <Reveal>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Цвета и оттенки</h2>
                        <p className="text-xl text-gray-400 mb-16">
                            Мы покрываем каркасы итальянскими эмалями и морилками. Вы можете выбрать классические древесные фактуры (Натуральный, Коричневый, Светло коричневый, Орех) или заказать выкрас по палитре RAL под ваш уникальный интерьер.
                        </p>
                    </Reveal>

                    <Reveal delay={200}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {[
                                { name: "Натуральный", img: "/generated/leg_finish_oak.webp" },
                                { name: "Коричневый", img: "/generated/leg_finish_walnut.webp" },
                                { name: "Светло коричневый", img: "/generated/leg_finish_wenge.webp" },
                                { name: "Орех", img: "/generated/leg_finish_ral.webp" }
                            ].map((color, i) => (
                                <div key={i} className="flex flex-col items-center gap-4">
                                    <div
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-2xl border-4 border-white/10 relative overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${color.img})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center"
                                        }}
                                    ></div>
                                    <span className="text-lg font-bold text-center">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Sustainability */}
            <section className="py-24 bg-white text-center">
                <div className="container max-w-3xl">
                    <Reveal>
                        <svg className="w-16 h-16 mx-auto mb-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Экологичность и срок службы</h2>
                        <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
                            Мы заботимся о здоровье наших клиентов и долговечности изделий. Все используемые клеи, морилки и лаки имеют сертификаты безопасности. Каркасы рассчитаны на годы ежедневной эксплуатации без потери геометрии и скрипов.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-[var(--background)] border-t border-black/10 text-center">
                <div className="container max-w-4xl mx-auto flex flex-col items-center">
                    <Reveal>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Подберём материал<br className="hidden md:block" />под ваш интерьер</h2>
                        <p className="text-xl md:text-2xl text-[var(--muted)] mb-12 max-w-2xl font-medium">
                            Оставьте заявку, и наши менеджеры помогут выбрать идеальное сочетание ткани и цвета Каркаса.
                        </p>
                        <button
                            onClick={() => openModal('b2c', 'materials-page')}
                            className="button-primary h-20 px-12 text-2xl font-bold shadow-2xl hover:-translate-y-2 transition-transform"
                        >
                            Оставить заявку
                        </button>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
