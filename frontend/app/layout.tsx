import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ModalProvider } from "@/app/providers";
import CookieBanner from "@/components/layout/CookieBanner";
import ModalRoot from "@/components/ModalRoot";
import AnalyticsEvents from "@/app/_components/AnalyticsEvents";

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
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BUENOFURNI — деревянная мебель от производителя',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BUENOFURNI | Деревянная мебель премиум-класса',
    description: 'Собственное производство дизайнерских стульев. Быстрая доставка.',
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Единая сущность организации. @id используется как ссылка из разметки
  // товаров и статей (publisher/brand), чтобы поиск связывал их с компанией.
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": "https://buenofurni.ru/#organization",
    "name": "BUENOFURNI",
    "alternateName": "БУЭНОФУРНИ",
    "url": "https://buenofurni.ru",
    "logo": "https://buenofurni.ru/icon-512.png",
    "image": "https://buenofurni.ru/og-image.png",
    "description": "Собственное производство деревянных стульев, табуретов и столов из берёзовой фанеры и массива берёзы, дуба и бука. Доставка по всей России.",
    "telephone": "+7-993-094-08-07",
    "email": "buenofurni@yandex.ru",
    "taxID": "212710014902",
    "foundingDate": "2024",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RU"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    },
    "sameAs": ["https://t.me/buenofurni_support"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-993-094-08-07",
      "email": "buenofurni@yandex.ru",
      "contactType": "customer service",
      "availableLanguage": "Russian"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://buenofurni.ru/#website",
    "name": "BUENOFURNI",
    "url": "https://buenofurni.ru",
    "inLanguage": "ru-RU",
    "publisher": { "@id": "https://buenofurni.ru/#organization" }
  };

  return (
    <html lang="ru" className={`${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=110917495', 'ym');

            ym(110917495, 'init', {
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
            <img src="https://mc.yandex.ru/watch/110917495" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}

        <ModalProvider>
          {children}
          <ModalRoot />
          <CookieBanner />
          <AnalyticsEvents />
        </ModalProvider>
      </body>
    </html>
  );
}
