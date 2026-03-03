import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type PageLayoutProps = {
    children: React.ReactNode;
    headerVariant?: "default" | "overlay";
};

export default function PageLayout({ children, headerVariant = "default" }: PageLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header variant={headerVariant} />
            <main className={`flex-1 ${headerVariant === "default" ? "pt-[var(--header-h)]" : ""}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
