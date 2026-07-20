import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "./AdminNav";

export const metadata: Metadata = {
    title: "Админ-панель | BUENOFURNI",
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#F4F6F8] text-[#141C26]">
            {/* Боковое меню */}
            <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-[#141C26] px-4 py-6 md:flex">
                <div className="px-4 pb-8">
                    <span className="text-sm font-bold uppercase tracking-widest text-white">
                        Админ панель
                    </span>
                    <span className="mt-1 block text-xs text-white/40">BUENOFURNI</span>
                </div>

                <AdminNav />

                <div className="mt-auto px-4 pt-8">
                    <Link href="/" className="text-xs text-white/40 transition-colors hover:text-white">
                        ← На сайт
                    </Link>
                </div>
            </aside>

            {/* Контент */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Меню для мобильных */}
                <div className="bg-[#141C26] px-4 py-3 md:hidden">
                    <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-white">
                        Админ панель
                    </span>
                    <AdminNav />
                </div>

                <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10">{children}</main>
            </div>
        </div>
    );
}
