"use client";

import { useEffect } from "react";
import { reachGoal } from "@/app/_lib/analytics";

/**
 * Глобальный трекинг кликов по контактам.
 * Один делегированный слушатель покрывает все ссылки на сайте (в т.ч. будущие),
 * поэтому не нужно вешать onClick на каждый компонент.
 */
export default function AnalyticsEvents() {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
            if (!link) return;

            const href = link.getAttribute("href") || "";
            if (href.startsWith("tel:")) {
                reachGoal("phone_click");
            } else if (href.includes("t.me/")) {
                reachGoal("telegram_click");
            } else if (href.includes("max.ru/")) {
                reachGoal("max_click");
            }
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, []);

    return null;
}
