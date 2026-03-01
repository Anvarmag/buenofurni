import { Metadata } from 'next';
import MarkdownPage from '../_components/MarkdownPage';

export const metadata: Metadata = {
    title: 'Политика конфиденциальности | BUENOFURNI',
    description: 'Политика конфиденциальности и обработки персональных данных BUENOFURNI.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="container min-h-screen py-12">
            <MarkdownPage fileName="privacy-policy.md" />
        </main>
    );
}
