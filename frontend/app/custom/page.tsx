import { Metadata } from 'next';
import CustomClient from './CustomClient';
import PageLayout from "@/components/layout/PageLayout";
import { FAQS } from './faqs';

export const metadata: Metadata = {
    title: 'Стулья на заказ от производителя — свой размер, цвет, обивка | BUENOFURNI',
    description: 'Изготовление стульев на заказ: свой цвет ножек (5 цветов), обивка микровелюр, букле или экокожа, размеры под ваш стол. Каркас — берёзовая фанера E0,5 или массив. Любое количество, срок до 2 недель, гарантия 12 месяцев. От 5 900 ₽, доставка по России.',
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
                "description": "Производим стулья, табуреты и столы под ваш интерьер: выбор материала каркаса (берёзовая фанера или массив), цвета ножек и обивки. Любое количество, изготовление до 2 недель, гарантия 12 месяцев.",
                "provider": { "@id": "https://buenofurni.ru/#organization" },
                "areaServed": { "@type": "Country", "name": "Россия" },
                "url": "https://buenofurni.ru/custom"
            },
            {
                "@type": "FAQPage",
                "mainEntity": FAQS.map((f) => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": { "@type": "Answer", "text": f.a },
                })),
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
