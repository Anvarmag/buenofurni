"use client";

import { useState } from "react";
import Image from "next/image";
import ImageZoomModal from "./ImageZoomModal";

type ProductGalleryProps = {
    images: string[];
    title: string;
    badges?: string[];
    inStock?: boolean;
};

export default function ProductGallery({
    images,
    title,
    badges = [],
    inStock = false,
}: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center rounded-2xl">
                <span className="text-gray-400">Нет фото</span>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-2 h-full">
                {/* Main Image */}
                <div
                    className="relative w-full flex-1 bg-transparent overflow-hidden min-h-[200px] cursor-zoom-in group"
                    onClick={() => setIsZoomOpen(true)}
                >
                    <Image
                        src={images[activeIndex]}
                        alt={`${title} - вид ${activeIndex + 1}`}
                        fill
                        className="object-contain transition-opacity duration-300 group-hover:scale-[1.02]"
                        priority
                    />

                    {/* Badges Overlay */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
                        {inStock && (
                            <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm tracking-wide">
                                В наличии
                            </span>
                        )}
                        {badges.map((b) => (
                            <span
                                key={b}
                                className="bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm tracking-wide shadow-black/10"
                            >
                                {b}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="shrink-0 grid grid-cols-4 sm:grid-cols-5 gap-2 px-2 mt-auto pb-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeIndex === idx
                                        ? "border-[var(--accent)] opacity-100"
                                        : "border-transparent opacity-60 hover:opacity-100 bg-gray-100"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isZoomOpen && (
                <ImageZoomModal
                    images={images}
                    initialIndex={activeIndex}
                    onClose={() => setIsZoomOpen(false)}
                />
            )}
        </>
    );
}
