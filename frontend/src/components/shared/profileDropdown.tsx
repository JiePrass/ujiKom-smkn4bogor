"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { User as UserType } from "@/types/model";
import { useAuth } from "@/context/authContext";

interface ProfileDropdownProps {
    visible: boolean;
    toggle: () => void;
    userData: UserType;
}

export default function ProfileDropdown({
    visible,
    toggle,
    userData,
}: ProfileDropdownProps) {
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                if (visible) toggle();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible, toggle]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Image
                src={
                    userData.profilePicture
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${userData.profilePicture}`
                        : "/images/default-profile.svg"
                }
                alt="User"
                onClick={toggle}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                width={32}
                height={32}
            />

            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{
                            duration: 0.2,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="absolute right-0 mt-2 min-w-48 bg-white shadow-lg rounded-xl z-50 origin-top border border-gray-100"
                    >
                        <div className="mb-2 px-4 pt-4">
                            <p className="font-semibold whitespace-nowrap">
                                {userData.fullName}
                            </p>
                            <p className="text-sm text-gray-500 border-b border-gray-100 pb-3 whitespace-nowrap">
                                {userData.email}
                            </p>
                        </div>
                        <div className="space-y-2 pb-2 flex flex-col">
                            <Link
                                href="/profile"
                                className="text-sm flex items-center py-1.5 px-2 mx-2 rounded-lg transition-colors ease-in-out hover:bg-gray-100"
                            >
                                <User className="inline w-4 h-4 mr-2" />
                                Lihat Profil
                            </Link>

                            {userData.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="text-sm flex items-center py-1.5 px-2 mx-2 rounded-lg transition-colors ease-in-out hover:bg-gray-100"
                                >
                                    <LayoutDashboard className="inline w-4 h-4 mr-2" />
                                    Admin Panel
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="text-sm flex items-center py-1.5 px-2 mx-2 rounded-lg text-red-500 transition-colors ease-in-out hover:bg-red-500 hover:text-white cursor-pointer"
                            >
                                <LogOut className="inline w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
