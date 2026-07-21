import { Metadata } from 'next';
import MaterialsClient from './MaterialsClient';
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
    title: 'Материалы и фактуры | Мебель из берёзовой фанеры и шпона BUENOFURNI',
    description: 'Берёзовая фанера, натуральный шпон, микровелюр, букле и премиальная экокожа. Материалы BUENOFURNI - прочность, фактура и долговечность. Подберём под ваш интерьер.',
    alternates: {
        canonical: '/materials',
    }
};

export default function MaterialsPage() {
    return (
        <PageLayout headerVariant="overlay">
            <main className="bg-[var(--background)] min-h-screen">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://buenofurni.ru" },
                                { "@type": "ListItem", "position": 2, "name": "Материалы", "item": "https://buenofurni.ru/materials" },
                            ],
                        }),
                    }}
                />
                <MaterialsClient />
            </main>
        </PageLayout>
    );
}
