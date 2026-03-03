"use client";

import { useState, useEffect } from "react";
import FallbackImage from "@/components/ui/FallbackImage";
import Link from "next/link";
import { useModal } from "@/app/providers";

export default function CustomClient() {
    const { openModal } = useModal();
    const [scrolled, setScrolled] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(false);

    // Configurator state (visual only)
    const [selectedFabric, setSelectedFabric] = useState("microvelour");
    const [selectedLegs, setSelectedLegs] = useState("oak");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 300);
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
            setIsNearBottom(nearBottom);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const galleryImages = [
        "/generated/custom_example_01_1772182175242.webp",
        "/generated/custom_example_02_1772182188889.webp",
        "/generated/custom_example_03_1772182202585.webp",
        "/generated/custom_example_04_1772182216731.webp",
        "/generated/custom_hero_1772182161501.webp",
        "/generated/custom_example_06_kitchen.png.png"
    ];

    const faqs = [
        { q: "Как подобрать идеальную модель?", a: "Мы предоставляем бесплатную консультацию дизайнера. Если у вас есть фото интерьера или визуализация, мы подберем 2-3 варианта стульев, подходящих по стилю, цвету и размерам." },
        { q: "Как выбрать правильную ткань(микровелюр, букле или экокожа)?", a: "Для дома с животными рекомендуем антивандальный микровелюр («антикоготь»). Букле отлично смотрится в гостиных и спальнях, придавая уют. Премиальная экокожа — самый практичный выбор для кухни или зоны с высокой проходимостью, она легко моется." },
        { q: "От чего зависит итоговая стоимость?", a: "Цена складывается из: базовой стоимости выбранной модели, категории ткани (у нас есть как базовые, так и эксклюзивные коллекции), типа покрытия деревянных элементов (стандартный лак, цветное масло или индивидуальная эмаль по RAL) и дополнительных пропиток." },
        { q: "Можно ли заказать выкрас ножек по моему образцу или RAL?", a: "Да, окрашивание деревянных элементов по каталогу RAL или NCS — одна из наших главных услуг. Это позволяет идеально вписать мебель в ваш проект." },
        { q: "Делаете ли вы мебель по фото или эскизу?", a: "Наше производство специализируется на адаптации наших базовых моделей (см. Каталог) под задачи клиента посредством выбора фактур и цветов. Производство принципиально новых каркасов «с нуля» по фото возможно только при оптовом заказе (от 20 шт)." }
    ];

    return (
        <div className="w-full bg-[var(--background)] pb-24 md:pb-0">

            {/* Hero Section */}
            <section className="relative w-full min-h-[100dvh] md:min-h-[700px] flex items-center justify-center pt-20 overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <FallbackImage
                        src="/generated/custom_hero_premium.webp"
                        alt="Премиальный интерьер с обеденным стулом"
                        fill
                        className="object-cover opacity-60"
                        priority
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-black md:via-black/60 md:to-transparent"></div>
                </div>

                <div className="container relative z-10 w-full">
                    <div className="max-w-2xl px-2 md:px-0">
                        <div className="inline-block bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
                            Индивидуальный заказ
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-md">
                            Сделаем под <br className="hidden md:block" />ваш интерьер
                        </h1>
                        <p className="text-lg md:text-2xl font-medium mb-8 text-gray-200 drop-shadow max-w-xl">
                            Выберите модель, ткань и отделку ножек — мы рассчитаем стоимость и сроки.
                        </p>

                        <div className="bg-gradient-to-r from-[var(--accent)] to-[#e5a84e] text-white backdrop-blur-md p-6 rounded-2xl mb-8 flex flex-col justify-center max-w-md shadow-[0_10px_30px_-10px_rgba(224,166,78,0.5)] border border-white/20 transform hover:scale-105 transition-transform">
                            <span className="text-4xl md:text-5xl font-black mb-1 drop-shadow-md">От 5 900 ₽*</span>
                            <span className="text-sm text-white/90 leading-tight font-medium">
                                *Финальная стоимость зависит от выбранной ткани и отделки ножек.
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button
                                onClick={() => openModal('b2c', 'custom_page_hero')}
                                className="button-primary h-16 px-6 sm:px-8 text-base sm:text-lg font-bold shadow-xl shadow-[var(--accent)]/20 w-full sm:w-auto whitespace-normal text-center leading-tight"
                            >
                                Рассчитать стоимость
                            </button>
                            <a href="https://t.me/buenofurni_support" target="_blank" rel="noopener noreferrer" className="button-secondary bg-white text-black h-16 px-6 text-base sm:text-lg font-bold flex items-center justify-center gap-2 hover:bg-[#2AABEE] hover:text-white hover:border-[#2AABEE] transition-all w-full sm:w-auto whitespace-normal text-center">
                                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" /></svg>
                                Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Band */}
            <section className="bg-[var(--accent)] text-white py-10 shadow-inner">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 text-center">
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-black mb-1">Сроки до 3 дней</h3>
                            <p className="text-sm font-medium opacity-90">На стандартный ассортимент</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/20"></div>
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-black mb-1">Гарантия 12 месяцев</h3>
                            <p className="text-sm font-medium opacity-90">По договору на изделие</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/20"></div>
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-black mb-1">Собственное производство</h3>
                            <p className="text-sm font-medium opacity-90">От каркаса до обивки</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How We Work */}
            <section className="py-20 md:py-28 bg-white border-b border-black/5">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16">Как работает создание на заказ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "Выбор модели", text: "Определитесь с базовой формой из нашего каталога.", link: "/catalog", linkText: "В каталог" },
                            { step: "02", title: "Ткань и цвет", text: "Подберем идеальную фактуру: букле, велюр или экокожа.", link: "/materials", linkText: "О материалах" },
                            { step: "03", title: "Стоимость", text: "Менеджер делает точный расчет и отправляет договор." },
                            { step: "04", title: "Производство", text: "Изготавливаем, упаковываем и привозим вам домой." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[var(--background)] p-8 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-shadow">
                                <span className="absolute -top-6 -right-4 text-8xl font-black text-black/5 select-none">{item.step}</span>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-[var(--muted)] mb-6">{item.text}</p>
                                    {item.link && (
                                        <Link href={item.link} className="inline-flex items-center text-[var(--accent)] font-bold hover:underline">
                                            {item.linkText}
                                            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Configurator (Visual Only) */}
            <section className="py-20 md:py-28 bg-[var(--background)]">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Кастомизируйте до мельчайших деталей</h2>
                            <p className="text-lg text-[var(--muted)] mb-12">
                                Вы не ограничены складскими запасами. Мы предлагаем сотни сочетаний для того, чтобы стул стал отражением вашего вкуса.
                            </p>

                            <div className="space-y-8 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-black/5">

                                {/* Fabric Type */}
                                <div>
                                    <span className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Тип ткани</span>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { id: "microvelour", label: "Микровелюр" },
                                            { id: "boucle", label: "Букле" },
                                            { id: "ecoleather", label: "Экокожа" }
                                        ].map(f => (
                                            <button
                                                key={f.id}
                                                onClick={() => setSelectedFabric(f.id)}
                                                className={`min-h-[44px] px-5 rounded-xl font-medium transition-all ${selectedFabric === f.id ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Legs Finish */}
                                <div>
                                    <span className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Отделка ножек</span>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { id: "oak", img: "/generated/leg_finish_oak.webp", label: "Дуб" },
                                            { id: "walnut", img: "/generated/leg_finish_walnut.webp", label: "Орех" },
                                            { id: "wenge", img: "/generated/leg_finish_wenge.webp", label: "Венге" },
                                            { id: "ral", img: "/generated/leg_finish_ral.webp", label: "RAL" }
                                        ].map(l => (
                                            <button
                                                key={l.id}
                                                title={l.label}
                                                onClick={() => setSelectedLegs(l.id)}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedLegs === l.id ? 'ring-4 ring-black ring-offset-2 scale-110 shadow-lg' : 'hover:scale-105 border border-black/10 shadow-sm'}`}
                                                style={{
                                                    backgroundImage: `url(${l.img})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                                <FallbackImage
                                    src="/generated/custom_example_04_1772182216731.webp"
                                    alt="Пример кастомного стула BUENOFURNI"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]"></div>

                                {/* Floating Badge */}
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-green-800" />
                                        <div className="w-8 h-8 rounded-full border-2 border-white" style={{ background: '#D4B895' }} />
                                    </div>
                                    <span className="font-bold text-sm">Ваш дизайн</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Examples Gallery */}
            <section className="py-20 md:py-28 bg-white overflow-hidden">
                <div className="container mb-12 flex items-end justify-between">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-xl">Галерея выполненных заказов</h2>
                    <div className="hidden md:block">
                        <button
                            onClick={() => openModal('b2c', 'custom_gallery')}
                            className="text-[var(--accent)] font-bold text-lg hover:underline"
                        >
                            Хочу также →
                        </button>
                    </div>
                </div>

                <div className="container pr-0 md:pr-4 mx-auto md:w-full max-w-full">
                    {/* Horizontal scroll snap on mobile, grid on desktop */}
                    <div className="flex overflow-x-auto pb-8 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbars md:grid md:grid-cols-3 md:overflow-visible pr-4 md:pr-0">
                        {galleryImages.map((src, i) => (
                            <div key={i} className="relative min-w-[300px] sm:min-w-[400px] md:min-w-0 md:w-full aspect-square rounded-3xl overflow-hidden shadow-sm snap-center shrink-0 border border-black/5 group cursor-pointer">
                                <FallbackImage
                                    src={src}
                                    alt={`Пример выполненного индивидуального заказа ${i + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 300px, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-20 md:py-28 bg-[var(--background)] border-t border-black/5">
                <div className="container max-w-3xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16">Популярные вопросы</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="bg-white rounded-3xl group shadow-sm border border-black/5 overflow-hidden open:ring-2 open:ring-[var(--accent)]/10 transition-all">
                                <summary className="flex items-center justify-between min-h-[64px] p-6 text-lg sm:text-xl font-bold cursor-pointer list-none select-none">
                                    {faq.q}
                                    <span className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-[var(--accent)] group-open:-rotate-180 transition-transform duration-300 shadow-sm border border-black/5">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="p-6 pt-0 text-[var(--muted)] text-base sm:text-lg leading-relaxed border-t border-gray-50">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 md:py-32 bg-black text-white text-center">
                <div className="container max-w-4xl mx-auto flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 leading-tight">
                        Оставьте заявку — <br className="hidden md:block" />мы предложим 2–3 варианта под ваш бюджет
                    </h2>
                    <button
                        onClick={() => openModal('b2c', 'custom_page_final')}
                        className="button-primary bg-[var(--accent)] hover:bg-[#d8973b] text-white h-20 px-12 sm:px-16 w-full sm:w-auto text-xl md:text-2xl font-bold shadow-[0_20px_40px_-15px_rgba(224,166,78,0.5)] hover:-translate-y-2 transition-transform rounded-2xl"
                    >
                        Оставить заявку
                    </button>
                    <p className="mt-8 text-gray-400 font-medium">Бесплатный расчет в течение 30 минут</p>
                </div>
            </section>

            {/* Mobile Sticky Bottom CTA */}
            <div className={`md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-[20px] border-t border-black/10 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-300 z-40 ${scrolled && !isNearBottom ? 'translate-y-0' : 'translate-y-[150%]'}`}>
                <button
                    onClick={() => openModal('b2c', 'custom_page_sticky')}
                    className="button-primary w-full h-14 text-base sm:text-lg font-bold shadow-md whitespace-normal text-center leading-tight px-4"
                >
                    Рассчитать стоимость
                </button>
            </div>
        </div>
    );
}
