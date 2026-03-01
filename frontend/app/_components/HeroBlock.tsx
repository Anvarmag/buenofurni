import Image from 'next/image';
import Link from 'next/link';

interface HeroBlockProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
}

export default function HeroBlock({
    title,
    subtitle,
    imageUrl,
    ctaText = 'Связаться с нами',
    ctaLink = '/contacts'
}: HeroBlockProps) {
    return (
        <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-foreground">
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover brightness-50 opacity-90"
                    priority
                />
            </div>
            <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-md">{title}</h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow font-medium">{subtitle}</p>
                <Link href={ctaLink} className="button-primary text-lg inline-block hover:scale-105 transition-transform">
                    {ctaText}
                </Link>
            </div>
        </section>
    );
}
