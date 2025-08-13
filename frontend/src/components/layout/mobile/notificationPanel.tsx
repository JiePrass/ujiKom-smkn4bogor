"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface NotificationPanelProps {
    onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
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
            <div className="flex items-center gap-2 px-4 pt-6 pb-4 border-b">
                <button
                    onClick={onClose}
                    className="p-1 rounded-md hover:bg-muted transition"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-lg font-semibold">Notifikasi</span>
            </div>

            {/* Konten notifikasi */}
            <div className="text-muted-foreground text-sm text-center mt-4">
                Belum ada notifikasi
            </div>
        </motion.aside>
    );
}
