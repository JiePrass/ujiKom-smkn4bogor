"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import SearchBar from "../shared/searchBar";
import ProfileDropdown from "../shared/profileDropdown";
import NotificationDropdown from "../shared/notificationDropdown";
import MobileSidebar from "./mobile/mobileSidebar";
import { getCurrentUser } from "@/lib/api/auth";
import { Button } from "../ui/button";
import Link from "next/link";
import { User } from "@/types/model";

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

    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    console.log("User data:", user);

    const [notifications] = useState([
        "Event A akan dimulai besok.",
        "Sertifikat Anda tersedia.",
        "Pembayaran berhasil dikonfirmasi.",
        "Event B telah selesai.",
    ]);

    const router = useRouter();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    // Cek login & fetch user
    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = !!token && token !== "null" && token !== "undefined";
        setIsLoggedIn(loggedIn);

        const fetchUser = async () => {
            if (loggedIn) {
                try {
                    const me = await getCurrentUser();
                    setUser(me);
                } catch (err) {
                    console.error("Gagal mengambil data user:", err);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
        };

        fetchUser();
    }, []);

    // Lock scroll saat mobile menu terbuka
    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isOpen);
    }, [isOpen]);

    // Sembunyikan header saat scroll ke bawah
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHideHeader(true);
            } else {
                setHideHeader(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

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
                    {/* Kiri */}
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

                    {/* Tengah */}
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
                                        {link.key}
                                    </Link>

                                );
                            })}
                        </nav>
                    </div>

                    {/* Kanan */}
                    <div className="ml-auto hidden md:flex items-center gap-4">
                        <SearchBar value="" onChange={() => (console.log("NOT IMPLEMENT"))} />
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
                                <Button
                                    asChild
                                    className="rounded-full"
                                >
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

                    {/* Mobile Menu Button */}
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
