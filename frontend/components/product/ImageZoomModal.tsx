"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type ImageZoomModalProps = {
    images: string[];
    initialIndex?: number;
    onClose: () => void;
};

export default function ImageZoomModal({ images, initialIndex = 0, onClose }: ImageZoomModalProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, images.length]);

    if (!mounted || !images || images.length === 0) return null;

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-[210] p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
                aria-label="Закрыть"
            >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Main Image Container */}
            <div className="relative w-full h-[80vh] flex items-center justify-center px-4 md:px-16" onClick={onClose}>
                <div onClick={(e) => e.stopPropagation()} className="relative w-full h-full max-w-6xl flex items-center justify-center">
                    <Image
                        src={images[activeIndex]}
                        alt={`Zoomed image ${activeIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                        quality={100}
                    />
                </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-[210] p-3 md:p-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
                        aria-label="Предыдущее фото"
                    >
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-[210] p-3 md:p-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
                        aria-label="Следующее фото"
                    >
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Image Counter & Thumbnails */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[210] flex flex-col items-center gap-4">
                    <div className="bg-black/50 backdrop-blur px-4 py-1.5 rounded-full text-white text-sm tracking-widest font-medium">
                        {activeIndex + 1} / {images.length}
                    </div>
                    <div className="flex gap-2 max-w-[90vw] overflow-x-auto pb-2 scrollbar-none">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`relative w-16 h-16 shrink-0 rounded-md overflow-hidden transition-all duration-200 border-2 ${idx === activeIndex ? "border-white scale-110 opacity-100" : "border-transparent opacity-40 hover:opacity-100"
                                    }`}
                            >
                                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}
