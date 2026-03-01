"use client";

import { useModal } from "@/app/providers";

const BENEFITS = [
    {
        title: "Собственное производство",
        description: "Контролируем качество на каждом этапе. Никаких посредников, только прямая работа фабрики.",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
            </svg>
        )
    },
    {
        title: "Берёзовая фанера, массив березы, дуба и бука",
        description: "Используем долговечные, экологичные материалы, которые служат десятилетиями.",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        )
    },
    {
        title: "Открытые цены и сроки",
        description: "Вы заранее знаете стоимость и точную дату готовности вашей мебели.",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: "Гарантия 12 месяцев",
        description: "Уверены в своей продукции — предоставляем полную коммерческую гарантию на год.",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
];

export default function TrustBenefits() {
    const { openModal } = useModal();

    return (
        <section className="py-24 sm:py-32 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black">
                            Почему BUENOFURNI
                        </h2>
                        <p className="mt-4 text-lg text-[var(--muted)]">
                            Мы создаём мебель, за которую нам не стыдно. Честно, надёжно и точно в срок.
                        </p>
                    </div>
                    <button
                        onClick={() => openModal("b2c", "trust-benefits")}
                        className="flex-shrink-0 rounded-full border border-black/15 bg-transparent px-6 py-3 text-sm font-medium text-black transition-all hover:bg-black/5"
                    >
                        Узнать о производстве
                    </button>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {BENEFITS.map((item, i) => (
                        <div
                            key={i}
                            className="group relative flex flex-col items-start p-8 bg-[var(--background)]/40 rounded-3xl border border-black/5 hover:bg-[var(--background)] transition-colors duration-500"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--accent)] shadow-sm border border-black/5 group-hover:scale-110 transition-transform duration-500">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-black mb-3">
                                {item.title}
                            </h3>
                            <p className="text-[var(--muted)] leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
