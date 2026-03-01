"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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

export default function ProductionClient() {
    const { openModal } = useModal();

    const processStages = [
        {
            num: "01",
            title: "Подготовка материала",
            text: "Всё начинается с отбора премиальной березовой фанеры и натурального шпона. Мы проверяем влажность и сортируем листы, чтобы каркас будущего стула был геометрически стабильным на десятилетия.",
            img: "/generated/prod_step_01_1772182861362.png",
            link: "/materials",
            linkText: "Подробнее о материалах →"
        },
        {
            num: "02",
            title: "Раскрой и сборка каркаса",
            text: "Фанера режется на высокоточном ЧПУ оборудовании, что гарантирует точное совпадение деталей. Затем мастера вручную собирают каркас с использованием шиповых соединений и надежного крепежа.",
            img: "/generated/prod_step_02_1772182877749.png"
        },
        {
            num: "03",
            title: "Обивка и финишная отделка",
            text: "Ножки покрываются тремя слоями премиального итальянского лака или масла. На обивку идут ткани повышенной износостойкости. Внутреннее наполнение — пенополиуретан (ППУ) высокой плотности.",
            img: "/generated/prod_step_03_1772182891662.png"
        },
        {
            num: "04",
            title: "ОТК и упаковка",
            text: "Каждый стул проходит строгий отдел технического контроля (ОТК). Мы проверяем надежность швов, ровность лакокрасочного покрытия и устойчивость изделия перед бережной упаковкой.",
            img: "/generated/prod_step_04_1772182906129.png"
        }
    ];

    const qualityFeatures = [
        {
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 22V9m12 0v13M5 9h14M6 9V5a2 2 0 012-2h8a2 2 0 012 2v4M8 13h8" />
                </svg>
            ),
            title: "Усиленная конструкция",
            desc: "Каркасы из гибкой и прочной березовой фанеры выдерживают нагрузки в разы большие, чем стандартные решения из МДФ или ДСП."
        },
        {
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8M10 4v16a2 2 0 002 2h0a2 2 0 002-2V4M10 8h4M10 12h4M10 16h4" />
                </svg>
            ),
            title: "Надёжная фурнитура",
            desc: "Мы используем усиленный крепеж и проклеенные шиповые соединения, что исключает расшатывание и скрип стула даже после лет активного использования."
        },
        {
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8l-8 8" />
                </svg>
            ),
            title: "Износостойкие ткани",
            desc: "Обивка проходит тест Мартиндейла от 60 000 циклов (стандарт HoReCa). Она легко чистится, отталкивает грязь и долго сохраняет цвет."
        },
        {
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            title: "Многоступенчатый контроль",
            desc: "Проверка качества осуществляется после каждого этапа: от выбраковки древесины до финального осмотра ровности швов перед упаковкой."
        }
    ];

    return (
        <div className="w-full bg-[var(--background)]">

            {/* Hero Section */}
            <section className="relative w-full h-[85vh] min-h-[600px] flex items-center bg-black overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/generated/production_hero_1772182848435.png"
                        alt="Производственный цех BUENOFURNI мастерская"
                        fill
                        className="object-cover opacity-60"
                        priority
                        fetchPriority="high"
                    />
                    {/* Dark gradient for text readability and cinematic look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/50 to-black/20 md:bg-gradient-to-r md:from-black/80 md:to-transparent"></div>
                </div>

                <div className="container relative z-10 w-full mt-20">
                    <div className="max-w-3xl text-white">
                        <Reveal>
                            <div className="inline-block border border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-8">
                                О фабрике
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-xl tracking-tight">
                                Собственное <br className="hidden md:block" />производство
                            </h1>
                        </Reveal>
                        <Reveal delay={200}>
                            <p className="text-xl md:text-2xl font-medium mb-12 text-gray-200 drop-shadow max-w-2xl leading-relaxed">
                                Контроль качества на каждом этапе. От отбора листа березовой фанеры до упаковки готового дизайнерского стула.
                            </p>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                                {/* B2C Flow */}
                                <button
                                    onClick={() => openModal('b2c', 'production_b2c')}
                                    className="button-primary h-16 px-10 text-lg font-bold shadow-2xl w-full sm:w-auto hover:-translate-y-1 transition-transform"
                                >
                                    Оставить заявку
                                </button>
                                {/* B2B Flow */}
                                <button
                                    onClick={() => openModal('b2b', 'production_b2b')}
                                    className="button-secondary bg-white text-black border-transparent h-16 px-10 text-lg font-bold w-full sm:w-auto hover:bg-gray-100 hover:-translate-y-1 transition-transform shadow-xl"
                                >
                                    HoReCa — получить КП
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mt-4 opacity-80 pl-2">Производим мебель для дома и ресторанного бизнеса.</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Alternating Process Stages */}
            <section className="py-24 md:py-32 overflow-hidden bg-[var(--background)] relative z-10">
                <div className="container max-w-7xl">
                    <div className="text-center mb-24">
                        <Reveal>
                            <h2 className="text-4xl md:text-5xl font-black text-black">Как мы создаем мебель</h2>
                        </Reveal>
                    </div>

                    <div className="space-y-24 md:space-y-40">
                        {processStages.map((stage, index) => {
                            const isEven = index % 2 !== 0; // 0 is odd in alternating logic (left image, right text)

                            return (
                                <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24 relative`}>

                                    {/* Visual Connector (Desktop only) */}
                                    {index < processStages.length - 1 && (
                                        <div className={`hidden lg:block absolute top-[100%] w-px h-40 bg-black/10 z-0 ${isEven ? 'left-1/4' : 'right-1/4'}`}></div>
                                    )}

                                    {/* Image Side */}
                                    <div className="w-full lg:w-1/2 z-10">
                                        <Reveal delay={100} className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl group border border-black/5">
                                            <Image
                                                src={stage.img}
                                                alt={`Этап производства: ${stage.title}`}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                                                loading="lazy"
                                            />
                                        </Reveal>
                                    </div>

                                    {/* Text Side */}
                                    <div className="w-full lg:w-1/2 flex flex-col justify-center z-10">
                                        <Reveal delay={200}>
                                            <div className="flex items-center gap-6 mb-6">
                                                <span className="text-6xl md:text-8xl font-black text-black/5 select-none">{stage.num}</span>
                                                <div className="h-px bg-black/10 flex-grow hidden sm:block"></div>
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-black tracking-tight">{stage.title}</h3>
                                            <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed mb-8">
                                                {stage.text}
                                            </p>

                                            {stage.link && (
                                                <Link href={stage.link} className="inline-flex items-center text-[var(--accent)] font-bold text-lg hover:underline decoration-2 underline-offset-4 transition-all">
                                                    {stage.linkText}
                                                </Link>
                                            )}
                                        </Reveal>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Quality Grid Section */}
            <section className="py-24 md:py-32 bg-white border-y border-black/5">
                <div className="container max-w-6xl">
                    <Reveal>
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Качество на десятилетия</h2>
                            <p className="text-xl text-[var(--muted)]">Скандинавский подход к прочности и эргономике. Мы проектируем стулья так, чтобы они служили вашей семье поколениями.</p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
                        {qualityFeatures.map((feat, i) => (
                            <Reveal key={i} delay={i * 100}>
                                <div className="bg-gray-50 rounded-[2rem] p-10 h-full border border-black/5 hover:border-black/10 transition-colors">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                                        {feat.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                                    <p className="text-[var(--muted)] text-lg leading-relaxed">{feat.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* HoReCa Highlight Panel */}
            <section className="py-24 bg-[var(--background)] px-4">
                <div className="container max-w-6xl">
                    <Reveal>
                        <div className="relative rounded-[3rem] overflow-hidden bg-black text-white p-10 md:p-16 lg:p-24 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
                            {/* Decorative accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/20 blur-[100px] rounded-full"></div>

                            <div className="lg:w-2/3 relative z-10">
                                <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-8">
                                    B2B PARTNERS
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                    Оптовое производство для дизайна и бизнеса
                                </h2>
                                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                                    Оснащаем рестораны, кафе и отели (HoReCa) долговечной мебелью. Выполняем оптовые партии от 10 предсказуемые сроки с высокой повторяемостью качества каждого изделия.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <button
                                        onClick={() => openModal('b2b', 'production_b2b_panel')}
                                        className="button-primary bg-[var(--accent)] text-white hover:bg-[#d8973b] h-16 px-10 text-lg w-full sm:w-auto shadow-[0_10px_30px_-10px_rgba(224,166,78,0.5)] border-transparent"
                                    >
                                        Получить КП на партию
                                    </button>
                                    <Link href="/horeca" className="text-white font-bold text-lg hover:underline underline-offset-4 decoration-2 opacity-90 hover:opacity-100">
                                        Подробнее о HoReCa →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Sustainability Section */}
            <section className="py-24 md:py-32 bg-white overflow-hidden">
                <div className="container max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                        <div className="w-full md:w-1/2">
                            <Reveal>
                                <div className="relative aspect-square rounded-full overflow-hidden shadow-xl border-4 border-white">
                                    <Image
                                        src="/generated/prod_sustain_1772182921244.png"
                                        alt="Экологичное мебельное производство макро"
                                        fill
                                        className="object-cover scale-110"
                                    />
                                </div>
                            </Reveal>
                        </div>
                        <div className="w-full md:w-1/2">
                            <Reveal delay={200}>
                                <h2 className="text-4xl md:text-5xl font-black text-black mb-8 leading-tight">Уважение к природе и ресурсам</h2>
                                <p className="text-xl text-[var(--muted)] leading-relaxed mb-6">
                                    Наш принцип осознанного потребления прост — производить мебель, которую не придется выбрасывать через пару лет. Срок службы качественного стула из березовой фанеры составляет десятилетия.
                                </p>
                                <p className="text-xl text-[var(--muted)] leading-relaxed">
                                    Мы используем только сертифицированные экологически чистые лакокрасочные материалы с классом защиты, пригодным даже для детской мебели. Строго контролируем минимизацию отходов производства.
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Divided CTA Area */}
            <section className="py-32 bg-[var(--background)] border-t border-black/10 text-center">
                <div className="container max-w-4xl mx-auto flex flex-col items-center">
                    <Reveal>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Готовы обсудить <br className="hidden md:block" />проект?</h2>
                        <p className="text-xl md:text-2xl text-[var(--muted)] mb-12 max-w-2xl font-medium">
                            Мы одинаково ответственно подходим как к розничным заказам преобразиющим ваш дом, так и к крупным партиям для ресторанов.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 w-full">
                            <button
                                onClick={() => openModal('b2c', 'production_final_b2c')}
                                className="button-primary h-20 px-10 md:px-14 text-xl md:text-2xl font-bold shadow-xl hover:-translate-y-2 transition-transform w-full sm:w-auto"
                            >
                                Для дома
                            </button>
                            <span className="text-[var(--muted)] font-bold hidden sm:block mx-2">ИЛИ</span>
                            <button
                                onClick={() => openModal('b2b', 'production_final_b2b')}
                                className="button-secondary bg-white text-black h-20 px-10 md:px-14 text-xl md:text-2xl font-bold shadow-xl hover:-translate-y-2 transition-transform border border-black/10 w-full sm:w-auto"
                            >
                                Для бизнеса
                            </button>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
