import Header from "@/components/layout/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="mt-24 mx-auto container">
                {children}
            </main>
        </>
    );
}
