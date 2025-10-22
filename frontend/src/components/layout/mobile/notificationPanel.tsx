"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Trash2, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "@/lib/api/notification";
import { Notification } from "@/types/model";
import { Button } from "@/components/ui/button";

interface NotificationPanelProps {
    onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
    const { isLoggedIn } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // 🔹 Fetch notifikasi
    const fetchNotifications = async () => {
        if (!isLoggedIn) return;
        try {
            setLoading(true);
            const res = await getNotifications();
            setNotifications(res.notifications);
            setUnreadCount(res.unreadCount);
        } catch (error) {
            console.error("Gagal mengambil notifikasi:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Aksi
    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error("Gagal menandai notifikasi:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            fetchNotifications();
        } catch (error) {
            console.error("Gagal menandai semua notifikasi:", error);
        }
    };

    const handleDeleteNotification = async (id: number) => {
        try {
            await deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error("Gagal menghapus notifikasi:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    return (
        <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1],
            }}
            className="fixed inset-y-0 right-0 w-80 bg-background z-50 shadow-lg flex flex-col border-l"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-muted transition"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-semibold">
                        Notifikasi
                        {unreadCount > 0 && (
                            <span className="ml-2 text-sm text-primary">
                                ({unreadCount})
                            </span>
                        )}
                    </span>
                </div>

                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-primary hover:underline"
                    >
                        Tandai semua terbaca
                    </button>
                )}
            </div>

            {/* Konten notifikasi */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Memuat notifikasi...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-muted-foreground text-sm text-center mt-4">
                        Belum ada notifikasi
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {notifications.map((notif) => (
                            <li
                                key={notif.id}
                                className={`p-3 rounded-lg border hover:bg-muted transition flex justify-between items-start ${!notif.isRead ? "bg-blue-50" : ""
                                    }`}
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {notif.title || "Notifikasi"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {notif.message}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end ml-2 space-y-1">
                                    {!notif.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleMarkAsRead(notif.id)
                                            }
                                            className="h-6 w-6 text-blue-600 hover:bg-blue-100"
                                            title="Tandai terbaca"
                                        >
                                            <CheckCheck className="w-4 h-4" />
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleDeleteNotification(notif.id)
                                        }
                                        className="h-6 w-6 text-destructive hover:bg-red-100"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.aside>
    );
}
