import Image from "next/image";
import Link from "next/link";

export function FeatureSection() {
    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* 1. Text Card - Dark */}
                <div className="bg-foreground text-white rounded-xl p-6 flex flex-col aspect-square justify-between">
                    <h3 className="text-lg font-semibold">Cari Berbagai Event Menarik</h3>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-white/90">
                            Temukan berbagai kegiatan seru, inspiratif, dan bermanfaat mulai dari Seminar,
                            Workshop hingga Lomba.
                        </p>
                        <Link href="/" className="text-sm font-semibold underline">
                            Jelajahi
                        </Link>
                    </div>
                </div>

                {/* 2. Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                        src="/images/feature-3.png"
                        alt="Orang bekerja dengan laptop"
                        width={500}
                        height={500}
                        className="object-cover"
                    />
                </div>

                {/* 3. Text Card - White */}
                <div className="bg-white rounded-xl p-6 flex flex-col aspect-square justify-between shadow">
                    <h3 className="text-lg font-semibold">Daftar dan Ikuti Semua Kegiatan</h3>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-600">
                            Langsung daftar hanya dengan beberapa klik
                            dan nikmati seluruh rangkaian acaranya.
                        </p>
                        <Link href="/" className="text-sm font-semibold underline">
                            Daftar
                        </Link>
                    </div>
                </div>

                {/* 4. Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                        src="/images/feature-1.png"
                        alt="Suasana kelas"
                        width={500}
                        height={500}
                        className="object-cover"
                    />
                </div>

                {/* 5. Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                        src="/images/feature-4.png"
                        alt="Pria sedang bekerja"
                        width={500}
                        height={500}
                        className="object-cover"
                    />
                </div>

                {/* 6. Text Card - White */}
                <div className="bg-white rounded-xl p-6 flex flex-col aspect-square justify-between shadow">
                    <h3 className="text-lg font-semibold">Lihat Benefit dan Informasi Eventnya</h3>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-600">
                            Baca detail lengkap acara, termasuk jadwal, lokasi, narasumber, serta keuntungan
                            yang akan kamu dapatkan.
                        </p>
                        <Link href="/" className="text-sm font-semibold underline">
                            Jelajahi
                        </Link>
                    </div>
                </div>

                {/* 7. Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                        src="/images/feature-2.png"
                        alt="Tangan menandatangani dokumen"
                        width={500}
                        height={500}
                        className="object-cover"
                    />
                </div>

                {/* 8. Text Card - White */}
                <div className="bg-white rounded-xl p-6 flex flex-col aspect-square justify-between shadow">
                    <h3 className="text-lg font-semibold">Klaim dan Dapatkan Sertifikat Digitalmu</h3>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-600">
                            Dapatkan sertifikat digital resmi sebagai bukti partisipasi. Siap diunduh
                            dan dibagikan kapan saja.
                        </p>
                        <Link href="/" className="text-sm font-semibold underline">
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
