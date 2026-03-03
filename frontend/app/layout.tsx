import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ModalProvider } from "@/app/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import ModalRoot from "@/components/ModalRoot";
import ClientMainWrapper from "@/components/layout/ClientMainWrapper";

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
        <ModalProvider>
          <Header />
          <ClientMainWrapper>
            {children}
          </ClientMainWrapper>
          <Footer />
          <ModalRoot />
          <CookieBanner />
        </ModalProvider>
      </body>
    </html>
  );
}
