import { Metadata } from 'next';
import MarkdownPage from '../_components/MarkdownPage';
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
    title: 'Политика конфиденциальности | BUENOFURNI',
    description: 'Политика конфиденциальности и обработки персональных данных BUENOFURNI.',
};

export default function PrivacyPolicyPage() {
    return (
        <PageLayout headerVariant="default">
            <div className="container py-12">
                <MarkdownPage fileName="privacy-policy.md" />
            </div>
        </PageLayout>
    );
}
