import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        const scrollToHash = () => {
            if (location.hash) {
                const id = location.hash.replace("#", "");
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                }
            }
        };

        // Jalankan saat mount dan saat location berubah
        scrollToHash();

        // Event listener tambahan untuk back/forward browser
        window.addEventListener("hashchange", scrollToHash);

        return () => {
            window.removeEventListener("hashchange", scrollToHash);
        };
    }, [location]);


    return (
        <div className="mt-16">
            {/* Section Beranda */}
            <section id="beranda" className="min-h-screen">Beranda</section>

            {/* Section Tentang */}
            <section id="tentang" className="min-h-screen">Tentang Kami</section>

            {/* Section Kontak */}
            <section id="kontak" className="min-h-screen">Kontak</section>
        </div>
    )
}