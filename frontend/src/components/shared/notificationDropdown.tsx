"use client";

import { Bell } from "lucide-react";

interface NotificationDropdownProps {
    notifications: string[];
    visible: boolean;
    toggle: () => void;
}

export default function NotificationDropdown({
    notifications,
    visible,
    toggle,
}: NotificationDropdownProps) {
    return (
        <div className="relative">
            <Bell
                className="w-5 h-5 text-black cursor-pointer"
                onClick={toggle}
            />
            {visible && (
                <div className="absolute right-0 mt-2 w-72 max-h-64 overflow-y-auto bg-white shadow-lg rounded-xl p-4 z-50">
                    <p className="font-semibold mb-4">Notifikasi</p>
                    <ul className="text-sm text-gray-500 space-y-2">
                        {notifications.length > 0 ? (
                            notifications.map((msg, i) => (
                                <li key={i} className="pb-2">
                                    {msg}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-400">
                                Tidak ada notifikasi
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
