import Header from "@/components/layout/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="mx-auto container space-y-24">
                {children}
            </main>
        </>
    );
}
