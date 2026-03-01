"use client";

import { useEffect, useState, useRef } from "react";
import { useModal } from "@/app/providers";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    leadType: "b2c" | "b2b";
    source: string;
    children?: React.ReactNode;
};

export default function BaseModal({
    isOpen,
    onClose,
    title,
    subtitle,
    leadType,
    source,
    children
}: ModalProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Reset status when modal closes so it's fresh for the next time
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setStatus("idle"), 300); // Wait for fade out animation
        }
    }, [isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (typeof data.phone === "string" && data.phone.length > 0 && data.phone.length < 18) {
            setErrorMessage("Ведите полный номер телефона (+7...).");
            setStatus("error");
            return;
        }

        // Anti-spam honeypot check
        if (data.website) {
            setStatus("success"); // Fake success for bots
            return;
        }

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadType,
                    source,
                    pageUrl: window.location.href,
                    ...data,
                }),
            });

            if (response.ok) {
                setStatus("success");
                setErrorMessage("");
                formRef.current?.reset();
            } else {
                const errorData = await response.json().catch(() => ({}));
                setErrorMessage(errorData.error || "Произошла ошибка при отправке заявки. Пожалуйста, напишите нам в WhatsApp или Telegram.");
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Произошла серверная ошибка. Пожалуйста, напишите нам в WhatsApp или Telegram.");
            setStatus("error");
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-left">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal panel */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[var(--background)] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="px-6 py-8 sm:p-10">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 rounded-full p-2 text-black/50 hover:bg-black/5 hover:text-black transition focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Закрыть"
                    >
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {status === "success" ? (
                        <div className="flex flex-col items-center text-center py-10">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Заявка успешно отправлена</h3>
                            <p className="text-[var(--muted)]">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                            <button
                                onClick={onClose}
                                className="mt-8 rounded-full bg-[var(--accent)] px-8 py-3 font-medium text-white hover:opacity-90 transition-opacity"
                            >
                                Вернуться на сайт
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-semibold md:text-3xl tracking-tight leading-tight mb-2">
                                    {title}
                                </h3>
                                {subtitle && <p className="text-[var(--muted)] leading-relaxed">{subtitle}</p>}
                            </div>

                            {status === "error" && (
                                <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-800 border border-red-100">
                                    {errorMessage}
                                </div>
                            )}

                            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {/* Honeypot field - invisible to users, traps bots */}
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="website">Website</label>
                                    <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                                </div>

                                {children}

                                <div className="mt-4 border-t border-black/10 pt-6">
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full rounded-full bg-[var(--accent)] py-4 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === "loading" ? "Отправка..." : leadType === 'b2b' ? "Получить коммерческое предложение" : "Отправить заявку"}
                                    </button>
                                    <p className="mt-4 text-center text-xs text-black/40">
                                        Нажимая кнопку, вы соглашаетесь с{" "}
                                        <a href="/privacy-policy" target="_blank" className="underline hover:text-black">
                                            политикой конфиденциальности
                                        </a>
                                        .
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
