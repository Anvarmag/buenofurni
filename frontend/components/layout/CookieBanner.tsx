"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check localStorage after mount to avoid hydration mismatch
        const consent = localStorage.getItem("buenofurni_cookie_consent");
        if (!consent) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem("buenofurni_cookie_consent", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 sm:max-w-md pointer-events-none">
            <div className="pointer-events-auto rounded-3xl bg-white p-6 shadow-2xl border border-black/5 animate-in slide-in-from-bottom-5 fade-in duration-500">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <p className="text-sm leading-relaxed text-[var(--muted)]">
                            Мы используем cookie-файлы для улучшения работы сайта. Продолжая использование, вы соглашаетесь с{" "}
                            <a href="/privacy-policy" className="font-medium text-black underline hover:opacity-80">
                                политикой конфиденциальности
                            </a>
                            .
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex gap-3">
                    <button
                        onClick={accept}
                        className="w-full rounded-full bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Согласен
                    </button>
                </div>
            </div>
        </div>
    );
}
