"use client";

import { useModal } from "@/app/providers";

export default function ProductClient({ productTitle, productSlug }: { productTitle: string, productSlug: string }) {
    const { openModal } = useModal();

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
                onClick={() => openModal('b2c', `product_page_${productSlug}`)}
                className="button-primary text-lg font-medium py-4 px-8 w-full shadow-lg shadow-black/10 hover:-translate-y-1 transition-transform"
            >
                Заказать {productTitle}
            </button>
            <button
                onClick={() => openModal('b2b', `product_page_${productSlug}_b2b`)}
                className="button-secondary text-lg font-medium py-4 px-8 w-full"
            >
                Запрос для HoReCa
            </button>
        </div>
    );
}
