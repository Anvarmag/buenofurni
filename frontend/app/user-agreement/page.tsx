import { Metadata } from 'next';
import MarkdownPage from '../_components/MarkdownPage';
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
    title: 'Пользовательское соглашение | BUENOFURNI',
    description: 'Пользовательское соглашение интернет-магазина BUENOFURNI.',
};

export default function UserAgreementPage() {
    return (
        <PageLayout headerVariant="default">
            <div className="container py-12">
                <MarkdownPage fileName="user-agreement.md" />
            </div>
        </PageLayout>
    );
}
