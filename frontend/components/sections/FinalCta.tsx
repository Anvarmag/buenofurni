"use client";

import { useModal } from "@/app/providers";

export default function FinalCta() {
    const { openModal } = useModal();

    return (
        <section className="py-24 sm:py-32 bg-[var(--background)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-black px-6 py-20 text-center shadow-2xl sm:px-16 sm:py-24 md:py-32">

                    {/* Subtle noise/texture overlay for premium dark feel */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6">
                            Готовы обсудить ваши идеальные стулья?
                        </h2>
                        <p className="mx-auto max-w-xl text-lg text-white/70 mb-10 leading-relaxed">
                            Оставьте заявку. Мы свяжемся с вами, чтобы обсудить ткань, цвет ножек и рассчитать точную стоимость с учётом производства и доставки.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => openModal("b2c", "final-cta")}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:bg-white/90 hover:scale-[1.02] shadow-lg shadow-black/20"
                            >
                                Оставить заявку
                            </button>
                            <a
                                href="https://t.me/buenofurni_support"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/40"
                            >
                                Написать в Telegram
                            </a>
                        </div>

                        <p className="mt-8 text-sm text-white/50">
                            Отвечаем в рабочее время с 10:00 до 19:00 по МСК.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
