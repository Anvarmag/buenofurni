"use client";

import { useState, useRef } from "react";
import { reachGoal } from "@/app/_lib/analytics";

// Форматирование номера: +7 (999) 000-00-00
const formatPhoneNumber = (value: string) => {
    if (["+7", "+7 ", "+7 (", "+7(", "+"].includes(value)) return "";

    let digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits[0] === "7" || digits[0] === "8") digits = digits.substring(1);
    if (digits.length === 0) return "+7 (";

    let result = "+7 (";
    result += digits.substring(0, 3);
    if (digits.length >= 4) result += `) ${digits.substring(3, 6)}`;
    if (digits.length >= 7) result += `-${digits.substring(6, 8)}`;
    if (digits.length >= 9) result += `-${digits.substring(8, 10)}`;
    return result;
};

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (typeof data.phone === "string" && data.phone.length > 0 && data.phone.length < 18) {
            setErrorMessage("Введите полный номер телефона (+7...).");
            setStatus("error");
            return;
        }

        // Honeypot: бот заполняет скрытое поле — показываем «успех», но ничего не шлём
        if (data.website) {
            setStatus("success");
            return;
        }

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadType: "b2c",
                    source: "contacts-page",
                    pageUrl: window.location.href,
                    ...data,
                }),
            });

            if (response.ok) {
                setStatus("success");
                setErrorMessage("");
                formRef.current?.reset();
                reachGoal("lead", { source: "contacts-page" });
            } else {
                const errorData = await response.json().catch(() => ({}));
                setErrorMessage(errorData.error || "Не удалось отправить заявку. Напишите нам в Telegram или позвоните: +7 993 094-08-07.");
                setStatus("error");
            }
        } catch {
            setErrorMessage("Сервер не ответил. Напишите нам в Telegram или позвоните: +7 993 094-08-07.");
            setStatus("error");
        }
    }

    if (status === "success") {
        return (
            <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-sm border border-black/5 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">Заявка отправлена</h3>
                <p className="text-[var(--muted)]">Свяжемся с вами в течение часа рабочего времени.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full border border-black/15 px-8 py-3 font-medium hover:bg-black/5 transition-colors"
                >
                    Отправить ещё одну
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-sm border border-black/5">
            <h2 className="text-2xl font-semibold mb-2">Напишите нам</h2>
            <p className="text-[var(--muted)] mb-8">Опишите задачу, и мы ответим в течение часа рабочего времени.</p>

            {status === "error" && (
                <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-800 border border-red-100">
                    {errorMessage}
                </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Honeypot — невидимая ловушка для ботов */}
                <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input type="text" id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">Ваше имя</label>
                        <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            placeholder="Александр"
                            className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium">Телефон</label>
                        <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="+7 (999) 000-00-00"
                            minLength={18}
                            maxLength={18}
                            onChange={(e) => { e.target.value = formatPhoneNumber(e.target.value); }}
                            className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="contact-comment" className="mb-2 block text-sm font-medium">Ваш вопрос</label>
                    <textarea
                        id="contact-comment"
                        name="comment"
                        rows={4}
                        placeholder="Сколько стульев нужно, какой цвет ножек и обивки, есть ли пожелания по срокам…"
                        className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-y"
                    />
                </div>

                <label className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <input
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                    />
                    <span>
                        Я согласен на обработку{" "}
                        <a href="/privacy-policy" target="_blank" className="underline hover:text-black">персональных данных</a>
                        {" "}и принимаю условия{" "}
                        <a href="/user-agreement" target="_blank" className="underline hover:text-black">пользовательского соглашения</a>.
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-2 w-full rounded-full bg-[var(--accent)] py-4 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === "loading" ? "Отправка..." : "Отправить заявку"}
                </button>
            </form>
        </div>
    );
}
