"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Home, Info, Calendar, FileText, Bell, ChevronRight, X } from "lucide-react";
import SearchBar from "../../shared/searchBar";
import { useEffect, useState } from "react";
import { User } from "@/types/model";

interface MobileMenuProps {
    navLinks: { key: string; href: string }[];
    onClose: () => void;
    userData: User | null;
    isLoggedIn: boolean;
    setShowNotifications: (value: boolean) => void;
}

export default function MobileMenu({ navLinks, onClose, userData, isLoggedIn, setShowNotifications }: MobileMenuProps) {
    const router = useRouter();
    const pathname = usePathname();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    const getIsActive = (href: string) => pathname === href;

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
        router.push("/login");
    };

    const icons: Record<string, React.ElementType> = {
        Beranda: Home,
        Tentang: Info,
        Event: Calendar,
        Artikel: FileText,
    };

    return (
        <motion.aside
            key="menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
                duration: 0.5,
                ease: [1, 0, 0.2, 1],
            }}
            className="fixed inset-y-0 right-0 w-72 bg-white z-50 shadow-lg flex flex-col"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-6 pt-6">
                <Image
                    src="/images/SIMKAS.png"
                    alt="Logo"
                    width={100}
                    height={32}
                    className="cursor-pointer"
                    onClick={() => router.push("/")}
                />
                <button onClick={onClose}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* User Info */}
            {isLoggedIn && userData && (
                <Link
                    href="/profile"
                    className="flex w-full px-6 mb-6 items-center gap-2 text-gray-700"
                    onClick={onClose}
                >
                    <Image
                        src={
                            userData.profilePicture
                                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${userData.profilePicture}`
                                : "/images/default-profile.png"
                        }
                        alt="User"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">{userData.fullName}</span>
                        <span className="text-sm">{userData.email}</span>
                    </div>
                </Link>
            )}

            {/* Search */}
            <div className="px-6 mb-6">
                <SearchBar value="" onChange={() => (console.log("TES"))} />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-3 font-semibold">
                <span className="text-gray-500 px-6">Menu</span>
                <div className="space-y-0.5 px-4 relative">
                    {(() => {
                        const activeIndex = navLinks.findIndex(link => getIsActive(link.href));
                        const isValid = activeIndex >= 0;
                        return (
                            <motion.div
                                layout
                                className="absolute left-0 w-1 bg-blue-600 rounded-r"
                                style={{
                                    top: isValid ? `${activeIndex * 42}px` : 0,
                                    height: "38px",
                                    opacity: isValid ? 1 : 0
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        );
                    })()}

                    {navLinks.map((item) => {
                        const Icon = icons[item.key];
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                onClick={onClose}
                                className={`font-medium flex items-center gap-2 px-4 rounded-lg py-2 transition-colors ${getIsActive(item.href)
                                        ? "text-blue-600 bg-gray-100"
                                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    }`}
                            >
                                {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                                <span>{item.key}</span>
                            </Link>
                        );
                    })}

                    {isLoggedIn && userData && (
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="font-medium w-full text-gray-700 flex justify-between px-4 rounded-lg py-2 transition-colors hover:text-blue-600 hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-gray-500" />
                                <span>Notifikasi</span>
                            </div>
                            <ChevronRight />
                        </button>
                    )}
                </div>
            </nav>

            {/* Footer */}
            <div className="flex h-full items-end p-6">
                {isLoggedIn && userData ? (
                    <button
                        onClick={handleLogout}
                        className="text-sm px-4 w-full py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors ease-in-out text-center"
                    >
                        Logout
                    </button>
                ) : (
                    <div className="flex gap-2 justify-center w-full">
                        <Link
                            href="/login"
                            className="text-sm px-4 w-1/2 py-2 bg-blue-600 text-white rounded-full transition-colors ease-in-out hover:bg-blue-700 text-center"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm px-4 py-2 w-1/2 border border-blue-600 text-blue-600 transition-colors ease-in-out rounded-full hover:bg-blue-50 text-center"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
