"use client";

import { useState, useRef, useEffect } from "react";
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
import { useAuth } from "@/context/authContext";

// 🔹 Import API helpers
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "@/lib/api/notification";
import { Notification } from "@/types/model";

const navLinks = [
    { key: "beranda", label: "Beranda", href: "/" },
    { key: "tentang", label: "Tentang", href: "/tentang" },
    { key: "event", label: "Event", href: "/events" },
    { key: "artikel", label: "Artikel", href: "/artikel" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [hideHeader, setHideHeader] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isTop, setIsTop] = useState(true);

    const pathname = usePathname();
    const router = useRouter();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const { user, isLoggedIn } = useAuth();

    // 🔹 State untuk notifikasi
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch notifikasi dari API
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotifications();
            setNotifications(res.notifications);
            setUnreadCount(res.unreadCount);
        } catch (error) {
            console.error("Gagal mengambil notifikasi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
        }
    }, [isLoggedIn]);

    // 🔹 Handler aksi notifikasi
    const handleMarkAsRead = async (id: number) => {
        await markNotificationAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllAsRead = async () => {
        await markAllNotificationsAsRead();
        fetchNotifications();
    };

    const handleDeleteNotification = async (id: number) => {
        await deleteNotification(id);
        fetchNotifications();
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    // Lock scroll saat mobile menu terbuka
    if (typeof document !== "undefined") {
        document.body.classList.toggle("overflow-hidden", isOpen);
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsTop(currentScrollY <= 10); // ✅ true kalau di paling atas
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
                className={`z-50 fixed top-0 left-0 w-full transition-all duration-300 
                ${hideHeader ? "-translate-y-full" : "translate-y-0"} 
                ${isTop ? "bg-transparent" : "bg-white shadow"} 
        `}>
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
                            src={`${isTop ? "/icons/simkas-main-white" : "/icons/simkas-main"}.svg`}
                            alt="Logo"
                            width={120}
                            height={32}
                            className="cursor-pointer transition-colors"
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
                                        className={`text-sm font-medium transition-colors ${isTop
                                            ? isActive
                                                ? "text-white font-semibold"
                                                : "text-gray-200 hover:text-white"
                                            : isActive
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
                        <SearchBar value="" onChange={() => console.log("NOT IMPLEMENT")} className="bg-white rounded-full" />
                        {isLoggedIn && user ? (
                            <>
                                <ProfileDropdown userData={user} />
                                <NotificationDropdown
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    loading={loading}
                                    visible={showNotif}
                                    toggle={() => setShowNotif(!showNotif)}
                                    onMarkAsRead={handleMarkAsRead}
                                    onMarkAllAsRead={handleMarkAllAsRead}
                                    onDelete={handleDeleteNotification}
                                    isTop={isTop}
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
                                    className={`rounded-full hover:text-white ${isTop
                                            ? "border-white text-white hover:backdrop-blur-md hover:bg-white/10"
                                            : "border-primary text-primary hover:bg-primary"
                                        }`}
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
