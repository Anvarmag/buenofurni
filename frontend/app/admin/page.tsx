import Link from 'next/link';
import AdminCatalogEditor from './AdminCatalogEditor';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
    return (
        <main className="bg-[var(--background)] pt-32 pb-16 px-4 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-black">Admin - Catalog</h1>
                    <Link
                        href="/catalog"
                        className="px-4 py-2 border border-black/20 text-black rounded hover:bg-black/5 transition-colors font-medium"
                    >
                        ← Вернуться в каталог
                    </Link>
                </div>

                <AdminCatalogEditor />
            </div>
        </main>
    );
}
