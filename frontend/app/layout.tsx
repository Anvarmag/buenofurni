import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ModalProvider } from "@/app/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import ModalRoot from "@/components/ModalRoot";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BUENOFURNI | Деревянная мебель премиум-класса",
  description: "Собственное производство деревянных стульев из берёзовой фанеры и шпона. Открытые цены. В наличии и под заказ.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
  return (
    <html lang="ru" className={`${inter.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-[var(--background)] font-sans text-[var(--foreground)] antialiased selection:bg-[var(--accent)] selection:text-white">
        <ModalProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ModalRoot />
          <CookieBanner />
        </ModalProvider>
      </body>
    </html>
  );
}
