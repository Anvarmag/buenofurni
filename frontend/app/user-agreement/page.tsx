import { Metadata } from 'next';
import MarkdownPage from '../_components/MarkdownPage';

export const metadata: Metadata = {
    title: 'Пользовательское соглашение | BUENOFURNI',
    description: 'Пользовательское соглашение интернет-магазина BUENOFURNI.',
};

export default function UserAgreementPage() {
    return (
        <main className="container min-h-screen py-12">
            <MarkdownPage fileName="user-agreement.md" />
        </main>
    );
}
