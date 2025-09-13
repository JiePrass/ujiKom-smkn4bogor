import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CardData = {
    title: string;
    label: string;
    description: string;
    image: string;
};

type Props = {
    data: CardData;
};

export function DestinationCard({ data }: Props) {
    return (
        <article
            className="min-w-[250px] md:min-w-[280px] h-92 md:rounded-2xl overflow-hidden relative group shadow hover:shadow-lg transition-all duration-300"
            aria-label={`Paket wisata: ${data.title}`}
        >
            <Image
                src={data.image}
                alt={`Gambar ${data.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-115"
                loading="lazy"
            />

            {/* Overlay: Top gradient + Vignette */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.5) 100%)`,
                    }}
                />
            </div>

            {/* Label - kiri atas muncul saat hover */}
            <span
                className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 absolute top-4 left-4"
            >
                {data.label}
            </span>

            {/* Judul & Deskripsi di posisi bawah */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                {/* Judul: awal di bawah, lalu naik */}
                <h3
                    className="text-lg font-semibold text-white absolute left-4 right-4 bottom-4 group-hover:bottom-16 transition-all duration-500"
                >
                    {data.title}
                </h3>

                {/* Deskripsi: muncul dari bawah ke bawah judul */}
                <p
                    className="text-sm text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 absolute left-4 right-4 bottom-4"
                >
                    {data.description}
                </p>
            </div>

            {/* Tombol panah kanan */}
            <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition">
                <Link
                    href="/paket"
                    aria-label={`Lihat detail paket ${data.title}`}
                    title={`Lihat detail ${data.title}`}
                >
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                </Link>
            </div>
        </article>
    );
}
