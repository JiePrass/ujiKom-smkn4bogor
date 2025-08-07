import { Bell } from "lucide-react";

type NotificationDropdownProps = {
    visible: boolean;
    toggle: () => void;
    notifications: string[];
};

export default function NotificationDropdown({ notifications, visible, toggle }: NotificationDropdownProps) {
    return (
        <div className="relative">
            <Bell className="w-5 h-5 text-black cursor-pointer" onClick={toggle} />
            {visible && (
                <div className="absolute right-0 mt-2 w-72 max-h-64 overflow-y-auto bg-white shadow-lg rounded-xl border p-4 z-50">
                    <p className="font-semibold text-sm mb-2">Notifikasi</p>
                    <ul className="text-sm space-y-2">
                        {notifications.length > 0 ? (
                            notifications.map((msg, i) => (
                                <li key={i} className="border-b pb-2">{msg}</li>
                            ))
                        ) : (
                            <li className="text-gray-400">Tidak ada notifikasi</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
