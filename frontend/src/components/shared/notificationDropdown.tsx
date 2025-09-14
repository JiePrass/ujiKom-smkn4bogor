"use client";

import {
    Bell, Check, Trash2, Calendar, CreditCard, Award, Info, Inbox
} from "lucide-react";
import { Notification } from "@/types/model";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface NotificationDropdownProps {
    notifications: Notification[];
    unreadCount: number;
    loading?: boolean;
    visible: boolean;
    toggle: () => void;
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    onDelete: (id: number) => void;
    isTop?: boolean;
}

const FILTERS = [
    { key: "unread", label: "Belum Dibaca" },
    { key: "read", label: "Sudah Dibaca" },
    { key: "all", label: "Semua" },
];

function getIconByType(type: string) {
    switch (type) {
        case "EVENT_REMINDER":
            return { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100" };
        case "PAYMENT_STATUS":
            return { icon: CreditCard, color: "text-green-500", bg: "bg-green-100" };
        case "CERTIFICATE_READY":
            return { icon: Award, color: "text-purple-500", bg: "bg-purple-100" };
        case "SYSTEM":
        default:
            return { icon: Info, color: "text-gray-500", bg: "bg-gray-100" };
    }
}

export default function NotificationDropdown({
    notifications,
    unreadCount,
    loading = false,
    visible,
    toggle,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    isTop = false,
}: NotificationDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [activeFilter, setActiveFilter] = useState("unread");

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                toggle();
            }
        }
        if (visible) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible, toggle]);

    // Filter notifikasi
    const filteredNotifications = notifications.filter((n) => {
        if (activeFilter === "unread") return !n.isRead;
        if (activeFilter === "read") return n.isRead;
        return true;
    });

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Icon Bell */}
            <div className="relative cursor-pointer" onClick={toggle}>
                <Bell className={`w-5 h-5 transition-colors ${isTop
                                            ? "text-white"
                                            : "text-gray-800"
                                        }`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full aspect-square w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </div>

            {visible && (
                <div className="absolute right-0 mt-2 w-108 max-h-128 bg-white shadow-xl rounded-xl border flex flex-col z-50">
                    {/* Filter Tabs */}
                    <div className="flex px-4 gap-6 border-b pt-4">
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f.key;
                            return (
                                <button
                                    key={f.key}
                                    className={cn(
                                        "relative pb-4 text-sm flex justify-center items-center font-medium transition-colors",
                                        isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                                    )}
                                    onClick={() => setActiveFilter(f.key)}
                                >
                                    {f.label}
                                    {f.key === "unread" && unreadCount > 0 && (
                                        <span className="ml-1 text-[10px] bg-red-500 text-white rounded-full aspect-square w-4 h-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                    {isActive && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Isi Notifikasi */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            // Skeleton Loader
                            Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 animate-pulse"
                                >
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notif) => {
                                const { icon: Icon, color, bg } = getIconByType(notif.type);
                                return (
                                    <div
                                        key={notif.id}
                                        className={cn(
                                            "flex justify-between gap-3 p-3 rounded-lg transition hover:bg-gray-50 cursor-pointer",
                                            !notif.isRead && "bg-blue-50"
                                        )}
                                        onClick={() => {
                                            if (!notif.isRead) {
                                                onMarkAsRead(notif.id);
                                            } else {
                                                onDelete(notif.id);
                                            }
                                        }}
                                    >
                                        {/* Icon kiri */}
                                        <div className={cn("w-10 h-10 flex items-center justify-center rounded-full", bg)}>
                                            <Icon className={cn("w-6 h-6", color)} />
                                        </div>

                                        {/* Teks */}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{notif.title}</p>
                                            <p className="text-gray-600 text-xs">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(notif.createdAt).toLocaleString("id-ID", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </p>
                                        </div>

                                        {/* Tombol kanan */}
                                        <div className="flex items-center">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onMarkAsRead(notif.id);
                                                    }}
                                                    className="p-1 rounded hover:bg-blue-100 text-blue-600"
                                                    title="Tandai dibaca"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {notif.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(notif.id);
                                                    }}
                                                    className="p-2 aspect-square rounded-full hover:bg-red-100 text-red-600"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center text-center py-10 text-gray-400">
                                <Inbox className="w-10 h-10 mb-2" />
                                <p className="text-sm">Tidak ada notifikasi</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Sticky */}
                    {notifications.length > 0 && unreadCount > 0 &&  (
                        <div className="border-t p-2 sticky bottom-0 bg-white">
                            <button
                                onClick={onMarkAllAsRead}
                                className="w-full text-sm font-medium hover:bg-gray-50 cursor-pointer py-2 rounded-lg transition"
                            >
                                Tandai semua dibaca
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
