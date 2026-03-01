import Link from "next/link";

const FOOTER_LINKS = {
    catalog: [
        { label: "Все стулья", href: "/catalog" },
        { label: "HoReCa", href: "/horeca" },
        { label: "На заказ", href: "/custom" },
        { label: "Материалы", href: "/materials" },
    ],
    company: [
        { label: "О производстве", href: "/production" },
        { label: "Контакты", href: "/contacts" },
    ],
    legal: [
        { label: "Политика конфиденциальности", href: "/privacy-policy" },
        { label: "Пользовательское соглашение", href: "/user-agreement" },
    ]
};

export default function Footer() {
    return (
        <footer className="w-full border-t border-black/10 bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">

                    {/* Brand Info */}
                    <div className="lg:col-span-4 lg:pr-8">
                        <Link href="/" className="text-xl font-bold tracking-widest uppercase">
                            BUENOFURNI
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                            Создаём минималистичную и надёжную деревянную мебель с душой. Собственное производство в России с контролем качества на каждом этапе.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <a href="https://t.me/buenofurni" target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-black transition-colors" aria-label="Telegram">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.666 3.475-1.512 5.792-2.512 6.95-2.997 3.303-1.385 3.99-1.624 4.435-1.63z" /></svg>
                            </a>
                            <a href="https://wa.me/79000000000" target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-black transition-colors" aria-label="WhatsApp">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.003 2.05L12 2C6.486 2 2 6.486 2 12c0 1.763.456 3.42 1.264 4.868L2 22l5.334-1.24a9.96 9.96 0 004.669 1.155l.003-.001C17.514 21.916 22 17.433 22 11.92 22 6.406 17.514 2.052 12.003 2.05zm5.532 14.12c-.237.669-1.36 1.28-1.88 1.347-.502.064-.997.185-3.32-.78-2.795-1.161-4.597-4.04-4.736-4.226-.134-.183-1.135-1.51-1.135-2.878 0-1.369.722-2.043.974-2.312.253-.266.549-.335.733-.335.184 0 .366-.002.529-.002.162 0 .383-.061.597.458.214.516.732 1.791.798 1.921.066.13.109.28.025.45-.084.17-.126.273-.254.422-.128.151-.27.332-.387.457-.13.14-.265.295-.11.562.152.264.678 1.121 1.458 1.815.992.882 1.83 1.15 2.103 1.283.272.132.434.113.593-.058.163-.17 .696-.813.883-1.092.188-.28.375-.233.626-.143.25.093 1.58.746 1.85 88.272.13.435.197.674.305.24.108.575.405.338 1.074z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                            <div>
                                <h3 className="text-sm font-semibold tracking-wider text-black">МЕБЕЛЬ</h3>
                                <ul className="mt-4 space-y-3">
                                    {FOOTER_LINKS.catalog.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="text-sm text-[var(--muted)] hover:text-black transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold tracking-wider text-black">О НАС</h3>
                                <ul className="mt-4 space-y-3">
                                    {FOOTER_LINKS.company.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="text-sm text-[var(--muted)] hover:text-black transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <h3 className="text-sm font-semibold tracking-wider text-black">ПОДДЕРЖКА</h3>
                                <ul className="mt-4 space-y-3">
                                    <li className="flex flex-col text-sm text-[var(--muted)]">
                                        <span className="font-medium text-black">Телефон</span>
                                        <a href="tel:+79930940807" className="hover:text-black transition-colors mt-1">+7 993 094-08-07</a>
                                    </li>
                                    <li className="flex flex-col text-sm text-[var(--muted)] mt-4">
                                        <span className="font-medium text-black">Почта</span>
                                        <a href="mailto:buenofurni@yandex.ru" className="hover:text-black transition-colors mt-1">buenofurni@yandex.ru</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[var(--muted)]">
                        &copy; {new Date().getFullYear()} BUENOFURNI. Все права защищены.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-[var(--muted)]">
                        {FOOTER_LINKS.legal.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-black hover:underline transition-all">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
