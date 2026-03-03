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
    return (
        <PageLayout headerVariant="overlay">
            <main className="bg-[var(--background)]">
                <CustomClient />
            </main>
        </PageLayout>
    );
}
