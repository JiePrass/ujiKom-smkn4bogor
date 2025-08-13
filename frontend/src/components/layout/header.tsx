"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import SearchBar from "../shared/searchBar";
import ProfileDropdown from "../shared/profileDropdown";
import NotificationDropdown from "../shared/notificationDropdown";
import MobileSidebar from "./mobile/mobileSidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/context/authContext"; // Ambil dari context

const navLinks = [
    { key: "beranda", label: "Beranda", href: "/" },
    { key: "tentang", label: "Tentang", href: "/tentang" },
    { key: "event", label: "Event", href: "/event" },
    { key: "artikel", label: "Artikel", href: "/artikel" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [hideHeader, setHideHeader] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const pathname = usePathname();
    const router = useRouter();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const { user, isLoggedIn } = useAuth(); // ✅ Ambil data dari Context

    const [notifications] = useState([
        "Event A akan dimulai besok.",
        "Sertifikat Anda tersedia.",
        "Pembayaran berhasil dikonfirmasi.",
        "Event B telah selesai.",
    ]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    // Lock scroll saat mobile menu terbuka
    if (typeof document !== "undefined") {
        document.body.classList.toggle("overflow-hidden", isOpen);
    }

    // Sembunyikan header saat scroll ke bawah
    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHideHeader(true);
            } else {
                setHideHeader(false);
            }
            setLastScrollY(currentScrollY);
        });
    }

    return (
        <>
            <header
                className={`z-50 fixed top-0 left-0 w-full bg-white transition-transform duration-300 ${hideHeader ? "-translate-y-full" : "translate-y-0"
                    } shadow`}
            >
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    variants={{
                        hidden: { opacity: 0, y: -20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                    className="container mx-auto px-6 md:px-0 py-3 flex items-center relative"
                >
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src="/images/SIMKAS.png"
                            alt="Logo"
                            width={120}
                            height={32}
                            className="cursor-pointer"
                            onClick={() => handleNavigation("/")}
                        />
                    </div>

                    {/* Menu tengah */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                        <nav className="hidden md:flex gap-6">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.key}
                                        href={link.href}
                                        className={`text-sm font-medium transition-colors ${isActive
                                                ? "text-blue-600 font-semibold"
                                                : "text-gray-700 hover:text-blue-600"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Menu kanan */}
                    <div className="ml-auto hidden md:flex items-center gap-4">
                        <SearchBar
                            value=""
                            onChange={() => console.log("NOT IMPLEMENT")}
                        />
                        {isLoggedIn && user ? (
                            <>
                                <ProfileDropdown
                                    userData={user}
                                    visible={showProfile}
                                    toggle={() => {
                                        setShowProfile(!showProfile);
                                        setShowNotif(false);
                                    }}
                                />
                                <NotificationDropdown
                                    notifications={notifications}
                                    visible={showNotif}
                                    toggle={() => {
                                        setShowNotif(!showNotif);
                                        setShowProfile(false);
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <Button asChild className="rounded-full">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50"
                                >
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Tombol menu mobile */}
                    <div className="md:hidden flex space-x-4 items-center ml-auto">
                        <button onClick={toggleMenu}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                        />
                        <MobileSidebar
                            key="mobileSidebar"
                            navLinks={navLinks}
                            onClose={toggleMenu}
                            userData={user}
                            isLoggedIn={isLoggedIn}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
