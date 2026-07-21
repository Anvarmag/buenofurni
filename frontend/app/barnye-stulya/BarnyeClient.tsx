"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FallbackImage from "@/components/ui/FallbackImage";
import { useModal } from "@/app/providers";
import { Product } from "../_data/products";

const priceFmt = new Intl.NumberFormat("ru-RU");

export default function BarnyeClient({
    products,
    faqs,
}: {
    products: Product[];
    faqs: { q: string; a: string }[];
}) {
    const { openModal } = useModal();
    const [scrolled, setScrolled] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 300);
            setIsNearBottom(window.innerHeight + window.scrollY >= document.body.offsetHeight - 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const features = [
        {
            title: "Высота под вашу стойку",
            text: "Барная стойка, кухонный остров или полубар — рассчитаем высоту сиденья так, чтобы сидеть было удобно.",
            link: "/blog/vysota-barnogo-stula",
            linkText: "Высота барного стула",
        },
        {
            title: "Со спинкой или без",
            text: "Делаем барный стул со спинкой (удобнее для долгих посиделок) или лаконичный без спинки — как вам нужнее.",
            link: "/blog/stul-so-spinkoy-ili-s-podlokotnikami",
            linkText: "Спинка или подлокотники",
        },
        {
            title: "Прочный деревянный каркас",
            text: "Каркас из берёзовой фанеры или массива на шиповых соединениях — устойчиво и надолго, а не шаткая конструкция.",
            link: "/blog/fanera-ili-massiv-stulya",
            linkText: "Фанера или массив",
        },
        {
            title: "Мягкое сиденье, своя обивка",
            text: "Сиденье мягкое, обивка на выбор — микровелюр, букле или экокожа. Микровелюр антивандальный: не боится когтей.",
            link: "/blog/antivandalnaya-obivka-mikrovelyur",
            linkText: "Про обивку",
        },
        {
            title: "Свой цвет ножек",
            text: "Пять цветов на выбор — чёрный, орех, светло-коричневый, коричневый, натуральный — или покраска по RAL.",
            link: "/blog/cveta-nozhek-stulyev",
            linkText: "Палитра ножек",
        },
        {
            title: "Любое количество",
            text: "Хоть один барный стул к острову, хоть комплект в заведение. Изготавливаем на заказ до 2 недель.",
            link: "/blog/skolko-stulyev-mozhno-zakazat",
            linkText: "Сколько заказать",
        },
    ];

    return (
        <div className="w-full bg-[var(--background)] pb-24 md:pb-0">
            {/* Hero */}
            <section className="relative w-full min-h-[100dvh] md:min-h-[680px] flex items-center pt-20 overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <FallbackImage
                        src="/blog-covers/karkas-iz-fanery.webp"
                        alt="Барный стул из берёзовой фанеры от BUENOFURNI"
                        fill
                        className="object-cover opacity-60"
                        priority
                        fetchPriority="high"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:bg-gradient-to-r md:from-black md:via-black/60 md:to-transparent" />
                </div>

                <div className="container relative z-10 w-full">
                    <div className="max-w-2xl px-2 md:px-0">
                        <div className="inline-block bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
                            Дерево · на заказ
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-md">
                            Барные стулья<br className="hidden md:block" /> деревянные
                        </h1>
                        <p className="text-lg md:text-xl font-medium mb-8 text-gray-200 drop-shadow max-w-xl">
                            Подберём высоту под вашу барную стойку или кухонный остров. Каркас — берёзовая фанера или
                            массив, мягкое сиденье, свой цвет ножек. Любое количество, доставка по всей России.
                        </p>

                        <div className="bg-gradient-to-r from-[var(--accent)] to-[#e5a84e] text-white p-6 rounded-2xl mb-8 max-w-md shadow-[0_10px_30px_-10px_rgba(224,166,78,0.5)] border border-white/20">
                            <span className="block text-2xl md:text-3xl font-black mb-1 drop-shadow-md">Высота под вашу стойку</span>
                            <span className="text-sm text-white/90 leading-tight font-medium">
                                Барная стойка, остров или полубар — рассчитаем посадку.
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button
                                onClick={() => openModal("b2c", "barnye_hero")}
                                className="button-primary h-16 px-6 sm:px-8 text-base sm:text-lg font-bold shadow-xl shadow-[var(--accent)]/20 w-full sm:w-auto whitespace-normal text-center leading-tight"
                            >
                                Рассчитать стоимость
                            </button>
                            <a
                                href="https://t.me/buenofurni_support"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button-secondary bg-white text-black h-16 px-6 text-base sm:text-lg font-bold flex items-center justify-center gap-2 hover:bg-[#2AABEE] hover:text-white hover:border-[#2AABEE] transition-all w-full sm:w-auto whitespace-normal text-center"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                                </svg>
                                Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust band */}
            <section className="bg-[var(--accent)] text-white py-10 shadow-inner">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 text-center">
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-black mb-1">Своя высота</h3>
                            <p className="text-sm font-medium opacity-90">Под стойку, остров или полубар</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/20" />
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-black mb-1">Гарантия 12 месяцев</h3>
                            <p className="text-sm font-medium opacity-90">По договору на изделие</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/20" />
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-black mb-1">Доставка по России</h3>
                            <p className="text-sm font-medium opacity-90">Изготовление на заказ до 2 недель</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Direct answer + features */}
            <section className="py-20 md:py-28 bg-white border-b border-black/5">
                <div className="container">
                    <div className="max-w-3xl mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Барные стулья, которые подойдут именно вашей стойке</h2>
                        <p className="text-lg text-[var(--muted)] leading-relaxed">
                            Барные стулья BUENOFURNI делаем на заказ из берёзовой фанеры или массива, с мягким сиденьем и
                            обивкой на выбор. Главное в барном стуле — высота: под классическую стойку 110–115 см нужно
                            сиденье около 75–80 см, под кухонный остров 90 см — около 65 см. Мы подбираем высоту под вашу
                            стойку, делаем со спинкой или без, в любом количестве.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((item, i) => (
                            <div
                                key={i}
                                className="bg-[var(--background)] p-8 rounded-3xl flex flex-col hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-[var(--muted)] mb-6 flex-1">{item.text}</p>
                                <Link
                                    href={item.link}
                                    className="inline-flex items-center text-[var(--accent)] font-bold hover:underline"
                                >
                                    {item.linkText}
                                    <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Models */}
            <section className="py-20 md:py-28 bg-[var(--background)]">
                <div className="container">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold max-w-xl">Модели барных стульев</h2>
                        <Link href="/catalog" className="text-[var(--accent)] font-bold text-lg hover:underline">
                            Весь каталог →
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((p) => (
                                <Link
                                    key={p.slug}
                                    href={`/product/${p.slug}`}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 hover:shadow-lg transition-shadow flex flex-col"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                        <FallbackImage
                                            src={p.imagePath}
                                            alt={`Барный стул ${p.title}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full">
                                            {p.availability === "in-stock" ? "В наличии" : "На заказ"}
                                        </span>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                                        <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2 flex-1">
                                            {p.shortDescription || `${p.upholstery}, ножки — ${p.legsColor.toLowerCase()}.`}
                                        </p>
                                        <span className="text-lg font-black text-[var(--accent)]">
                                            от {priceFmt.format(p.priceFrom)} ₽
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-black/5 shadow-sm">
                            <p className="text-lg text-[var(--muted)] mb-8 max-w-xl mx-auto">
                                Барные стулья делаем на заказ под высоту вашей стойки. Опишите стойку в заявке — предложим
                                модель, обивку и рассчитаем стоимость. Смотрите обычные модели в каталоге.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/catalog" className="button-primary text-lg inline-block">
                                    Смотреть каталог
                                </Link>
                                <button
                                    onClick={() => openModal("b2c", "barnye_models")}
                                    className="button-secondary text-lg"
                                >
                                    Оставить заявку
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* SEO text */}
            <section className="py-16 md:py-24 bg-white border-t border-black/5">
                <div className="container max-w-3xl">
                    <div className="prose prose-neutral lg:prose-lg max-w-none prose-a:text-[var(--accent)] prose-headings:font-bold">
                        <h2>Деревянные барные стулья на заказ</h2>
                        <p>
                            Барный стул выбирают в первую очередь по высоте. Ошибка с высотой — и сидеть за стойкой
                            неудобно: ноги висят или упираются. Мы делаем барные стулья на заказ и подбираем высоту
                            сиденья под вашу стойку, остров или полубар. Как рассчитать высоту самому — в статье{" "}
                            <Link href="/blog/vysota-barnogo-stula">«Высота барного стула»</Link>.
                        </p>
                        <p>
                            Каркас — из берёзовой фанеры или массива на шиповых соединениях: устойчиво и надолго. Сиденье
                            мягкое, обивка на выбор — микровелюр (антивандальный, не боится когтей), букле или экокожа.
                            Ножки красим в пять цветов или по RAL. Про материалы каркаса — в статье{" "}
                            <Link href="/blog/fanera-ili-massiv-stulya">«Фанера или массив»</Link>.
                        </p>
                        <p>
                            Делаем барный стул со спинкой или без, отгружаем любое количество — хоть один к острову, хоть
                            комплект в заведение. Оставьте заявку с высотой стойки — подберём модель и рассчитаем стоимость.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-28 bg-[var(--background)] border-t border-black/5">
                <div className="container max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Частые вопросы</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="bg-white rounded-3xl group shadow-sm border border-black/5 overflow-hidden open:ring-2 open:ring-[var(--accent)]/10 transition-all"
                            >
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
                    <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight">
                        Подберём барные стулья<br className="hidden md:block" /> под вашу стойку
                    </h2>
                    <button
                        onClick={() => openModal("b2c", "barnye_final")}
                        className="button-primary bg-[var(--accent)] hover:bg-[#d8973b] text-white h-20 px-12 sm:px-16 w-full sm:w-auto text-xl md:text-2xl font-bold shadow-[0_20px_40px_-15px_rgba(224,166,78,0.5)] hover:-translate-y-2 transition-transform rounded-2xl"
                    >
                        Оставить заявку
                    </button>
                    <p className="mt-8 text-gray-400 font-medium">Бесплатный расчёт в течение дня</p>
                </div>
            </section>

            {/* Mobile sticky CTA */}
            <div
                className={`md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-[20px] border-t border-black/10 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-300 z-40 ${
                    scrolled && !isNearBottom ? "translate-y-0" : "translate-y-[150%]"
                }`}
            >
                <button
                    onClick={() => openModal("b2c", "barnye_sticky")}
                    className="button-primary w-full h-14 text-base sm:text-lg font-bold shadow-md whitespace-normal text-center leading-tight px-4"
                >
                    Рассчитать стоимость
                </button>
            </div>
        </div>
    );
}
