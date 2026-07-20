import { Metadata } from 'next';
import HorecaClient from './HorecaClient';
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
    title: 'Стулья и мебель для кафе и ресторанов (HoReCa) | Производство BUENOFURNI',
    description: 'Производство надежной мебели для HoReCa от BUENOFURNI. Усиленный каркас, износостойкая ткань. Изготовим под ваш интерьер. Запросите КП онлайн.',
    alternates: {
        canonical: '/horeca',
    }
};

export default function HorecaPage() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Мебель для кафе и ресторанов (HoReCa)",
                "serviceType": "Мебель для заведений HoReCa",
                "description": "Стулья, табуреты и столы для кафе, ресторанов и баров: каркас из берёзовой фанеры, обивка с износостойкостью 60 000 циклов по тесту Мартиндейла, оптовый заказ от 10 штук, гарантия 12 месяцев.",
                "provider": { "@id": "https://buenofurni.ru/#organization" },
                "areaServed": { "@type": "Country", "name": "Россия" },
                "url": "https://buenofurni.ru/horeca"
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://buenofurni.ru" },
                    { "@type": "ListItem", "position": 2, "name": "HoReCa", "item": "https://buenofurni.ru/horeca" }
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
                <HorecaClient />
            </main>
        </PageLayout>
    );
}
