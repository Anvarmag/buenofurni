"use client";

import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import { Product } from "@/app/_data/products";
import Image from "next/image";

type CatalogOrderModalProps = {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
};

export default function CatalogOrderModal({ isOpen, onClose, product }: CatalogOrderModalProps) {
    const [quantity, setQuantity] = useState(1);

    // Функции форматирования телефона как в основном RequestModal
    const formatPhoneNumber = (value: string) => {
        if (["+7", "+7 ", "+7 (", "+7(", "+"].includes(value)) return "";

        let digits = value.replace(/\D/g, "");
        if (!digits) return "";

        if (digits[0] === "7" || digits[0] === "8") {
            digits = digits.substring(1);
        }

        if (digits.length === 0) return "+7 (";

        let result = "+7 (";
        result += digits.substring(0, 3);
        if (digits.length >= 4) result += `) ${digits.substring(3, 6)}`;
        if (digits.length >= 7) result += `-${digits.substring(6, 8)}`;
        if (digits.length >= 9) result += `-${digits.substring(8, 10)}`;

        return result;
    };

    // Reset quantity when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setQuantity(1), 0);
        }
    }, [isOpen]);

    if (!product) return null;

    const totalPrice = product.priceFrom * quantity;
    const details = [
        product.category,
        product.upholstery,
        product.legsMaterial,
        product.legsColor
    ].filter(Boolean).join(", ");

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Оформление заказа"
            subtitle="Оставьте контактные данные, и мы свяжемся с вами для подтверждения заказа."
            leadType="b2c"
            source={`catalog_order_${product.slug}`}
        >
            {/* Hidden fields for TG submission */}
            <input type="hidden" name="productTitle" value={product.title} />
            <input type="hidden" name="productDetails" value={details} />
            <input type="hidden" name="quantity" value={quantity} />
            <input type="hidden" name="totalPrice" value={`${totalPrice.toLocaleString('ru-RU')} ₽`} />

            {/* Product Summary */}
            <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100 mb-2">
                <div className="relative w-16 h-16 shrink-0 aspect-[4/5] bg-white rounded-lg overflow-hidden border border-gray-100">
                    <Image src={product.imagePath} alt={product.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                    <span className="font-bold text-gray-900 line-clamp-1">{product.title}</span>
                    <span className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">{details}</span>
                </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-sm font-medium text-gray-700">Количество:</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1.5 border border-gray-200">
                    <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-lg hover:text-[var(--accent)] disabled:opacity-50"
                        disabled={quantity <= 1}
                        aria-label="Уменьшить"
                    >-</button>
                    <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-lg hover:text-[var(--accent)]"
                        aria-label="Увеличить"
                    >+</button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4 px-1">
                <span className="text-sm font-medium text-gray-700">Итого:</span>
                <span className="text-xl font-bold text-[var(--accent)]">{totalPrice.toLocaleString('ru-RU')} ₽</span>
            </div>

            {/* User Details */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="order_name" className="text-sm font-medium text-gray-700 pl-1">
                    Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="order_name"
                    name="name"
                    required
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition-all placeholder:text-black/30 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="Иван Иванов"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="order_phone" className="text-sm font-medium text-gray-700 pl-1">
                    Телефон <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    id="order_phone"
                    name="phone"
                    required
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition-all placeholder:text-black/30 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="+7 (999) 000-00-00"
                    minLength={18}
                    maxLength={18}
                    onChange={(e) => {
                        e.target.value = formatPhoneNumber(e.target.value);
                    }}
                />
            </div>
        </BaseModal>
    );
}
