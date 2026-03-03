"use client";

import Image from "next/image";
import { useModal } from "@/app/providers";

export default function HorecaClient() {
    const { openModal } = useModal();

    // Data lists
    const benefits = [
        {
            title: "Усиленная конструкция",
            text: "Больше точек крепления и надежный крепеж. Каркас из березовой фанеры выдерживает до 150 кг постоянной нагрузки.",
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 22V9m12 0v13M5 9h14M6 9V5a2 2 0 012-2h8a2 2 0 012 2v4M8 13h8" />
                </svg>
            )
        },
        {
            title: "Износостойкие ткани",
            text: "Мы используем обивку с показателем износостойкости от 60 000 по тесту Мартиндейла, которая легко чистится и долго служит.",
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8l-8 8" />
                </svg>
            )
        },
        {
            title: "Производство партий от 10 шт",
            text: "Удобные условия для среднего и крупного бизнеса. Мы предлагаем специальные цены на заказы партий под проект.",
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
            )
        },
        {
            title: "Гибкие сроки и дизайн",
            text: "Можно выкрасить ножки в любой цвет из палитры RAL. Сроки производства партий от 14 рабочих дней в зависимости от объема.",
            icon: (
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    const processSteps = [
        { num: "01", title: "Заявка и бриф", text: "Оставьте запрос, и мы свяжемся с вами для уточнения деталей, объемов и стилистики." },
        { num: "02", title: "Подбор материалов", text: "Утверждаем модель стула, подбираем ткань и цвет деревянного каркаса по каталогу RAL." },
        { num: "03", title: "Производство", text: "Изготавливаем тестовый образец (если требуется) и запускаем партию в производство к нужному дню." },
        { num: "04", title: "Доставка", text: "Организуем бережную доставку мебели прямо до вашего ресторана, кафе или отеля." },
    ];

    const galleryImages = [
        "/generated/horeca_project_custom_01.webp",
        "/generated/horeca_project_custom_02.webp",
        "/generated/horeca_project_custom_03.webp",
        "/generated/horeca_project_custom_04.webp"
    ];

    return (
        <div className="w-full">

            {/* Hero Section */}
            <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center bg-[var(--background)] overflow-hidden">
                <div className="absolute inset-0 w-full h-full lg:w-1/2 lg:right-0 lg:left-auto pt-24 lg:pt-0">
                    <div className="relative w-full h-full">
                        <Image
                            src="/generated/hero_chair_v3.webp"
                            alt="Интерьер ресторана с премиальной мебелью"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40 lg:hidden"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent hidden lg:block"></div>
                    </div>
                </div>

                <div className="container relative z-10 pt-32 pb-16 lg:py-24">
                    <div className="max-w-2xl text-center lg:text-left text-white lg:text-black mt-8 md:mt-0">
                        <div className="inline-block bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
                            B2B Сектор
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            Мебель для кафе <br className="hidden lg:block" />и ресторанов
                        </h1>
                        <p className="text-lg md:text-xl font-medium mb-10 lg:text-gray-600 drop-shadow-md lg:drop-shadow-none max-w-xl mx-auto lg:mx-0">
                            Прочные материалы. Производство надежных партий. Индивидуальные цветовые решения под ваш интерьер.
                        </p>
                        <button
                            onClick={() => openModal('b2b', 'horeca-hero')}
                            className="button-primary text-base md:text-lg h-14 px-8 w-full sm:w-auto shadow-xl hover:-translate-y-1 transition-transform"
                        >
                            Получить коммерческое предложение
                        </button>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 md:py-28 bg-white border-b border-black/5">
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Почему HoReCa выбирает BUENOFURNI?</h2>
                        <p className="text-lg text-[var(--muted)]">Нашу мебель покупают заведения, которым критически важна надежность и долговечность, но без жертв стилю.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {benefits.map((b, i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-black/5">
                                <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm mb-6 border border-black/5">
                                    {b.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                                <p className="text-[var(--muted)] leading-relaxed">{b.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => openModal('b2b', 'horeca-benefits')}
                            className="button-primary h-14 px-8 md:px-12 text-lg shadow-md"
                        >
                            Оставить заявку на партию
                        </button>
                    </div>
                </div>
            </section>

            {/* Gallery: Mobile Swipe, Desktop Grid */}
            <section className="py-20 md:py-28 bg-[var(--background)] overflow-hidden">
                <div className="container mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Проекты и интерьеры</h2>
                </div>

                <div className="container pr-0 md:pr-4 mx-auto md:w-full max-w-full">
                    <div className="flex overflow-x-auto pb-8 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbars md:grid md:grid-cols-2 xl:grid-cols-4 md:overflow-visible pr-4 md:pr-0">
                        {galleryImages.map((src, i) => (
                            <div key={i} className="relative min-w-[300px] sm:min-w-[400px] md:min-w-0 md:w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-sm snap-center shrink-0">
                                <Image
                                    src={src}
                                    alt={`Проект HoReCa ${i + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 300px, 25vw"
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Как мы работаем с B2B-клиентами</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {processSteps.map((step, i) => (
                            <div key={i} className="relative flex flex-col p-8 rounded-3xl border border-black/10 hover:border-black/30 transition-colors bg-white z-10">
                                <span className="text-5xl font-black text-black/5 mb-6">{step.num}</span>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-[var(--muted)]">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 md:py-32 bg-[var(--background)] text-center">
                <div className="container max-w-4xl mx-auto flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">Готовы обсудить <br className="hidden sm:block" />проект?</h2>
                    <p className="text-xl md:text-2xl text-[var(--muted)] mb-12 max-w-2xl font-medium">
                        Напишите нам или оставьте заявку, чтобы получить каталог с оптовыми ценами и условиями сотрудничества.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => openModal('b2b', 'horeca-final')}
                            className="button-primary w-full sm:w-auto h-16 px-10 text-lg font-bold shadow-xl"
                        >
                            Получить КП
                        </button>
                        <a href="#" className="w-full sm:w-auto button-secondary h-16 px-8 text-lg font-bold flex items-center justify-center gap-3 bg-white">
                            <svg className="w-6 h-6 text-[#29B6F6]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                            Telegram
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
