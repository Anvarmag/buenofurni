"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { reachGoal, trackPageView } from "@/app/_lib/analytics";

/**
 * Собственная аналитика:
 *  - просмотры страниц (в т.ч. при переходах внутри сайта без перезагрузки);
 *  - клики по контактам — одним делегированным слушателем на весь сайт,
 *    поэтому не нужно вешать onClick на каждый компонент.
 */
export default function AnalyticsEvents() {
    const pathname = usePathname();
    const lastPath = useRef<string | null>(null);

    // Просмотр страницы: при первой загрузке и на каждом переходе
    useEffect(() => {
        if (!pathname || lastPath.current === pathname) return;
        const isFirst = lastPath.current === null;
        lastPath.current = pathname;
        // При переходе внутри сайта реферрером считаем предыдущую страницу
        trackPageView(pathname, isFirst ? document.referrer : window.location.origin);
    }, [pathname]);

    // Клики по телефону и мессенджерам
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
