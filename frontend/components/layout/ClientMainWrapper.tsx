"use client";

import { usePathname } from "next/navigation";

export default function ClientMainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if the current page has a dark hero section that requires header overlay
    const darkHeroPaths = ["/", "/custom", "/materials", "/production", "/horeca"];
    const isDarkHeroPage = darkHeroPaths.includes(pathname);

    return (
        <main
            className="flex-1"
            style={{
                // Add padding-top for non-hero pages so content isn't hidden under the fixed header
                paddingTop: !isDarkHeroPage ? 'var(--header-h)' : '0px'
            }}
        >
            {children}
        </main>
    );
}
