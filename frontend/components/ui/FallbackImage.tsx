"use client";

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface FallbackImageProps extends ImageProps {
    fallbackSrc?: string;
}

export default function FallbackImage({ src, fallbackSrc, alt, ...rest }: FallbackImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt || ''}
            onError={() => {
                if (fallbackSrc && imgSrc !== fallbackSrc) {
                    setImgSrc(fallbackSrc);
                } else if (typeof src === 'string' && src.endsWith('.webp')) {
                    // Automatically try to fallback to .png if a specific fallback isn't provided
                    const pngSrc = src.replace('.webp', '.png');
                    if (imgSrc !== pngSrc) {
                        setImgSrc(pngSrc);
                    }
                } else if (typeof src === 'string' && src.endsWith('.jpg')) {
                    // Or fallback from webp to jpg logic if it was a webp string initially? 
                    // Let's just keep png as primary auto-fallback as it's common for our /generated folder
                }
            }}
        />
    );
}
