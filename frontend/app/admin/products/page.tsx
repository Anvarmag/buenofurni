import Link from 'next/link';
import AdminCatalogEditor from '../AdminCatalogEditor';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
    return (
        <div className="mx-auto max-w-6xl">
            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold sm:text-3xl">Товары</h1>
                    <p className="mt-1 text-sm text-black/50">Редактор карточек каталога.</p>
                </div>
                <Link
                    href="/catalog"
                    className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5"
                >
                    Открыть каталог на сайте →
                </Link>
            </header>

            <AdminCatalogEditor />
        </div>
    );
}
