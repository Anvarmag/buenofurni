"use client";

import { useModal } from "@/app/providers";

const STEPS = [
    {
        num: "01",
        title: "Выберите модель",
        desc: "Определитесь с дизайном стула (Vela, Aurora, Anora)."
    },
    {
        num: "02",
        title: "Подберите ткань и отделку",
        desc: "С помощью нашего менеджера выберите тип ткани (велюр, букле, экокожа) и цвет ножек."
    },
    {
        num: "03",
        title: "Получите расчёт",
        desc: "Мы фиксируем точную стоимость и называем сроки производства."
    },
    {
        num: "04",
        title: "Запуск в производство",
        desc: "После согласования мы отправляем заказ на фабрику. От 7 дней."
    }
];

export default function CustomSteps() {
    const { openModal } = useModal();

    return (
        <section className="py-24 sm:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black">
                            Как заказать
                        </h2>
                        <p className="mt-4 text-lg text-[var(--muted)]">
                            Полный цикл: от идеи до готового стула в вашем интерьере.
                        </p>
                    </div>
                </div>

                {/* Mobile Swipeable / Desktop Grid */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">
                    {STEPS.map((step, i) => (
                        <div
                            key={i}
                            className="snap-start shrink-0 w-[280px] sm:w-auto relative flex flex-col p-8 bg-[var(--background)]/40 rounded-3xl border border-black/5"
                        >
                            <div className="text-5xl font-bold text-black/10 mb-6 tracking-tighter">
                                {step.num}
                            </div>
                            <h3 className="text-xl font-semibold text-black mb-3 pr-4">
                                {step.title}
                            </h3>
                            <p className="text-[var(--muted)] leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center sm:justify-start">
                    <button
                        onClick={() => openModal("b2c", "custom-steps")}
                        className="rounded-full bg-[var(--accent)] px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90 shadow-lg shadow-black/5"
                    >
                        Рассчитать стоимость
                    </button>
                </div>
            </div>
        </section>
    );
}
