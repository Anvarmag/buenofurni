import { Metadata } from 'next';
import CustomClient from './CustomClient';
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
    title: 'Изготовление стульев на заказ | Мебель от BUENOFURNI',
    description: 'Производим стулья из шпона и фанеры под ваш интерьер. Выбор ткани (микровелюр, букле). Сроки до 15 дней. Гарантия 12 месяцев. Рассчитайте стоимость онлайн.',
    alternates: {
        canonical: '/custom',
    }
};

export default function CustomPage() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Изготовление стульев на заказ",
                "serviceType": "Изготовление мебели на заказ",
                "description": "Производим стулья, табуреты и столы под ваш интерьер: выбор материала каркаса (берёзовая фанера или массив), цвета ножек и обивки. Любое количество, изготовление до 15 дней, гарантия 12 месяцев.",
                "provider": { "@id": "https://buenofurni.ru/#organization" },
                "areaServed": { "@type": "Country", "name": "Россия" },
                "url": "https://buenofurni.ru/custom"
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://buenofurni.ru" },
                    { "@type": "ListItem", "position": 2, "name": "На заказ", "item": "https://buenofurni.ru/custom" }
                ]
            }
        ]
    };

    return (
        <PageLayout headerVariant="overlay">
            <main className="bg-[var(--background)]">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
                <CustomClient />
            </main>
        </PageLayout>
    );
}
