import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ModalProvider } from "@/app/providers";
import CookieBanner from "@/components/layout/CookieBanner";
import ModalRoot from "@/components/ModalRoot";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://buenofurni.ru'),
  title: "BUENOFURNI | Деревянная мебель премиум-класса на заказ в России",
  description: "Собственное производство деревянных стульев из берёзовой фанеры и шпона. Открытые цены. В наличии и под заказ. Доставка по РФ.",
  keywords: ["купить стулья из фанеры", "стулья на заказ", "производство мебели из фанеры", "красивые стулья для дома", "дизайнерские стулья", "купить стулья из дерева"],
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: 'BUENOFURNI | Деревянная мебель премиум-класса',
    description: 'Собственное производство деревянных стульев из берёзовой фанеры и шпона. В наличии и под заказ.',
    url: 'https://buenofurni.ru',
    siteName: 'BUENOFURNI',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/generated/hero_chair.png',
        width: 1200,
        height: 630,
        alt: 'BUENOFURNI - Дизайнерские стулья',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BUENOFURNI | Деревянная мебель премиум-класса',
    description: 'Собственное производство дизайнерских стульев. Быстрая доставка.',
  },
  other: {
    "yandex-verification": "", // Placeholder if user provides one
  }
};

export const viewport: Viewport = {
  themeColor: "#F6F1E8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BUENOFURNI",
    "url": "https://buenofurni.ru",
    "logo": "https://buenofurni.ru/favicon.ico",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service",
      "availableLanguage": "Russian"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "BUENOFURNI - Производство Мебели",
    "image": "https://buenofurni.ru/generated/hero_chair.png",
    "@id": "https://buenofurni.ru",
    "url": "https://buenofurni.ru",
    "telephone": "",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RU"
    }
  };

  return (
    <html lang="ru" className={`${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[var(--background)] font-sans text-[var(--foreground)] antialiased selection:bg-[var(--accent)] selection:text-white">
        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=107082264', 'ym');

            ym(107082264, 'init', {
                ssr:true,
                webvisor:true,
                clickmap:true,
                ecommerce:"dataLayer",
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce:true,
                trackLinks:true
            });
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/107082264" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}

        <ModalProvider>
          {children}
          <ModalRoot />
          <CookieBanner />
        </ModalProvider>
      </body>
    </html>
  );
}
