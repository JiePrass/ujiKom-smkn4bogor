"use client"

import Link from "next/link"
import Image from "next/image"
import { FaSquareXTwitter } from "react-icons/fa6"
import { FaFacebookSquare } from "react-icons/fa"
import { AiFillInstagram, AiFillTikTok } from "react-icons/ai"
import { usePathname } from "next/navigation"

export default function Footer() {
    const pathname = usePathname()

    const navLinks = [
        { href: "/", label: "Beranda" },
        { href: "/events", label: "Kegiatan" },
        { href: "/galery", label: "Galeri" },
        { href: "/articles", label: "Artikel" },
    ]

    return (
        <footer className="bg-gray-50 pt-8 pb-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32">
                {/* Kiri: Logo & Deskripsi */}
                <div className="flex flex-col gap-4 md:justify-between items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/icons/simkas-main.svg"
                            alt="SIMKAS"
                            width={128}
                            height={128}
                        />
                    </div>
                    <h2 className="text-2xl leading-tight font-semibold">
                        Sistem Informasi Manajemen Kegiatan Akademik Sekolah
                    </h2>
                    <p className="text-sm">
                        SIMKAS membantu pengelolaan kegiatan secara terintegrasi, mulai dari
                        pembuatan acara, pendaftaran peserta, verifikasi kehadiran,
                        hingga distribusi sertifikat secara digital.
                    </p>
                    <p className="mt-4 hidden md:inline text-xs">
                        &copy; {new Date().getFullYear()} SIMKAS. Seluruh hak cipta dilindungi.
                    </p>
                </div>

                {/* Kanan: Menu & Info */}
                <div className="flex flex-col gap-8">
                    {/* Navigasi */}
                    <nav
                        className="flex flex-wrap justify-center md:justify-end gap-2 text-sm"
                        aria-label="Navigasi Footer"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-1 border rounded-full transition ${pathname === link.href
                                        ? "bg-gray-900 text-white font-semibold"
                                        : "hover:bg-gray-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-semibold">Alamat</h3>
                            <address className="not-italic text-sm leading-relaxed">
                                Jl. Pendidikan No. 12, Jakarta, Indonesia
                            </address>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-semibold">Fitur Utama</h3>
                            <p className="text-sm">
                                Manajemen Kegiatan, Pendaftaran Peserta,
                                Presensi Digital, & Distribusi Sertifikat.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-semibold">Hubungi Kami</h3>
                            <p className="text-sm">
                                <a href="mailto:admin@simkas.com" className="hover:underline">
                                    renjieprass@gmail.com
                                </a>
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-semibold">Ikuti Kami</h3>
                            <div className="flex items-center gap-4">
                                <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                                    <FaFacebookSquare size={28} />
                                </Link>
                                <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                                    <AiFillInstagram size={30} />
                                </Link>
                                <Link href="https://tiktok.com" target="_blank" aria-label="TikTok">
                                    <AiFillTikTok size={30} />
                                </Link>
                                <Link href="https://twitter.com" target="_blank" aria-label="X (Twitter)">
                                    <FaSquareXTwitter size={28} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Mobile */}
                <p className="mt-4 md:hidden text-xs text-center">
                    &copy; {new Date().getFullYear()} SIMKAS. Seluruh hak cipta dilindungi.
                </p>
            </div>
        </footer>
    )
}
