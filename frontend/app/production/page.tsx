import { Metadata } from 'next';
import ProductionClient from './ProductionClient';
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
    title: 'Собственное производство мебели и стульев | BUENOFURNI',
    description: 'Узнайте, как мы производим стулья из березовой фанеры и шпона. Ручная сборка, усиленная конструкция, контроль качества на каждом этапе. Мебель для дома и ресторанного бизнеса (HoReCa).',
    alternates: {
        canonical: '/production',
    }
};

export default function ProductionPage() {
    return (
        <PageLayout headerVariant="overlay">
            <main className="bg-[var(--background)]">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://buenofurni.ru" },
                                { "@type": "ListItem", "position": 2, "name": "Производство", "item": "https://buenofurni.ru/production" },
                            ],
                        }),
                    }}
                />
                <ProductionClient />
            </main>
        </PageLayout>
    );
}
