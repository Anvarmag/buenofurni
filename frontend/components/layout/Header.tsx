"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModal } from "@/app/providers";

const NAV_LINKS = [
    { href: "/catalog", label: "Каталог" },
    { href: "/horeca", label: "HoReCa", badge: "B2B" },
    { href: "/custom", label: "На заказ" },
    { href: "/materials", label: "Материалы" },
    { href: "/production", label: "Производство" },
    { href: "/contacts", label: "Контакты" },
];

export default function Header() {
    const pathname = usePathname();
    const { openModal } = useModal();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isHorecaPage = pathname === "/horeca";

    // Check if the current page has a dark hero section
    const darkHeroPaths = ["/materials", "/production", "/custom"];
    const isDarkHeroPage = darkHeroPaths.includes(pathname);

    // Text should be dark if scrolled, if mobile menu is open, or if it's NOT a dark hero page
    const isDarkText = scrolled || isMobileMenuOpen || !isDarkHeroPage;

    // Handle scroll state for header styling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMobileMenuOpen]);

    // Determine CTA behavior based on route
    const handleCtaClick = () => {
        if (isHorecaPage) {
            openModal("b2b", "header-b2b");
        } else {
            openModal("b2c", "header-b2c");
        }
    };

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-[60] h-[var(--header-h)] transition-all duration-300 ${scrolled
                    ? "bg-[var(--background)]/95 backdrop-blur-md shadow-sm border-b border-black/10"
                    : isDarkHeroPage ? "bg-transparent" : "bg-[var(--background)]"
                    }`}
                style={{ paddingTop: 'var(--sa-top, 0px)' }}
            >
                <div className="mx-auto flex w-full h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className={`relative group flex items-center text-lg font-bold tracking-widest uppercase transition-colors duration-300 ${isDarkText ? "text-black" : "text-white"}`}>
                        <span>БУЭНОФУРНИ | BUENOFURNI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`group relative text-sm font-medium transition-colors ${isActive
                                        ? (isDarkText ? "text-black" : "text-white")
                                        : (isDarkText ? "text-[var(--muted)] hover:text-black" : "text-white/80 hover:text-white")
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        {link.label}
                                        {link.badge && (
                                            <span className={`rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wider transition-colors ${isDarkText ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-white/20 text-white"
                                                }`}>
                                                {link.badge}
                                            </span>
                                        )}
                                    </span>
                                    {/* Subtle underline hover animation */}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-[1.5px] transition-all duration-300 ${isDarkText ? "bg-black" : "bg-white"} ${isActive ? "w-full" : "w-0 group-hover:w-full"
                                            }`}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop CTA & Mobile Toggle */}
                    <div className="relative flex items-center gap-4">
                        <button
                            onClick={handleCtaClick}
                            className="hidden rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 md:block"
                        >
                            {isHorecaPage ? "Получить КП" : "Оставить заявку"}
                        </button>

                        <button
                            className="relative p-2 md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
                        >
                            <div className="relative flex h-5 w-6 flex-col justify-between overflow-hidden">
                                <span
                                    className={`h-0.5 w-full transition-all duration-300 ${isDarkText ? "bg-black" : "bg-white"} ${isMobileMenuOpen ? "translate-y-2.5 rotate-45" : ""
                                        }`}
                                />
                                <span
                                    className={`h-0.5 transition-all duration-300 ${isDarkText ? "bg-black" : "bg-white"} ${isMobileMenuOpen ? "w-0 opacity-0" : "w-full opacity-100"
                                        }`}
                                />
                                <span
                                    className={`h-0.5 w-full transition-all duration-300 ${isDarkText ? "bg-black" : "bg-white"} ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[100] bg-[var(--background)] transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col justify-between px-6 pb-12 pt-28">
                    <nav className="flex flex-col gap-6 text-2xl font-medium">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 transition-colors ${isActive ? "text-black" : "text-[var(--muted)]"
                                        }`}
                                >
                                    {link.label}
                                    {link.badge && (
                                        <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[0.75rem] font-bold tracking-wider text-[var(--accent)]">
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex flex-col gap-4 mt-auto">
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleCtaClick();
                            }}
                            className="w-full rounded-full bg-[var(--accent)] py-4 text-center text-lg font-medium text-white transition-opacity hover:opacity-90"
                        >
                            {isHorecaPage ? "Получить КП" : "Оставить заявку"}
                        </button>
                        <a
                            href="https://t.me/buenofurni_support"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full rounded-full border border-black/10 py-4 text-center text-lg font-medium transition-colors hover:bg-black/5"
                        >
                            Telegram
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
