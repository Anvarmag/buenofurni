"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin", label: "Дашборд", exact: true },
    { href: "/admin/analytics", label: "Аналитика" },
    { href: "/admin/products", label: "Товары" },
    { href: "/admin/leads", label: "Заявки" },
];

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${active
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
