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
    return (
        <PageLayout headerVariant="overlay">
            <main className="bg-[var(--background)]">
                <HorecaClient />
            </main>
        </PageLayout>
    );
}
