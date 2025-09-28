import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="space-y-24">
                {children}
            </main>
            <Footer />
        </>
    );
}
