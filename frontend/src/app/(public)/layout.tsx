import Header from "@/components/layout/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="space-y-24">
                {children}
            </main>
        </>
    );
}
