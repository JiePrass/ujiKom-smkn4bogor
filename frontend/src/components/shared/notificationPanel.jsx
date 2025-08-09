// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export default function NotificationPanel({ onClose }) {
    return (
        <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
                duration: 0.5,
                ease: [1, 0, 0.3, 1]
            }}
            className="fixed inset-y-0 right-0 w-72 bg-white z-50 shadow-lg flex flex-col"
        >
            <div className="flex justify-between items-center px-4 pt-6 pb-4">
                <button onClick={onClose}>
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <span className="text-lg font-semibold w-full text-center mr-8">Notifikasi</span>
            </div>

            {/* Konten notifikasi */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="text-gray-500 text-sm">Belum ada notifikasi</div>
            </div>
        </motion.aside>
    );
}
