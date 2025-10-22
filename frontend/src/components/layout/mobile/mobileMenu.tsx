"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import SearchBar from "../../shared/searchBar";
import { ChangeEvent, useEffect, useState } from "react";
import { User } from "@/types/model";
import { getAllEvents } from "@/lib/api/event";
import { Event } from "@/types/model";
import { slugify } from "@/lib/utils/slugify";

interface MobileMenuProps {
    navLinks: { key: string; href: string; label: string }[];
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


    // 🔹 State untuk search
    const [searchQuery, setSearchQuery] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // 🔹 Handler pencarian event
    const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await getAllEvents();
            const filtered = res.filter((event: Event) =>
                event.title.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filtered || []);
        } catch (error) {
            console.error("Gagal mencari event:", error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchQuery.trim()) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleSearchChange({ target: { value: searchQuery } } as any);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchQuery]);


    // 🔹 Navigasi ke detail event berdasarkan slug
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectEvent = (event: any) => {
        setSearchQuery("");
        setSearchResults([]);
        const slug = slugify(event.title);
        router.push(`/event/${slug}-${event.id}`);
    };

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
                                ? `${userData.profilePicture}`
                                : "/images/default-profile.svg"
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
                <div className="relative">
                    <SearchBar
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari event..."
                        className="bg-white rounded-full"
                    />

                    {/* 🔹 Dropdown hasil pencarian */}
                    {searchQuery && searchResults.length > 0 && (
                        <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-50 max-h-60 overflow-auto">
                            {searchResults.map((event) => (
                                <button
                                    key={event.id}
                                    onClick={() => handleSelectEvent(event)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    {event.title}
                                </button>
                            ))}
                        </div>
                    )}

                    {isSearching && (
                        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg p-3 text-gray-500 text-sm">
                            Mencari...
                        </div>
                    )}

                    {searchQuery && !isSearching && searchResults.length === 0 && (
                        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg p-3 text-gray-500 text-sm">
                            Tidak ada event ditemukan.
                        </div>
                    )}
                </div>
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
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    {isLoggedIn && userData && (
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="font-medium w-full text-gray-700 flex justify-between px-4 rounded-lg py-2 transition-colors hover:text-blue-600 hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-2">
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
