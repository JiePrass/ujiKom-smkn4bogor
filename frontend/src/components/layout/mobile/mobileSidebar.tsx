// MobileSidebar.jsx
import { AnimatePresence } from "framer-motion";
import NotificationPanel from "./notificationPanel";
import MobileMenu from "./mobileMenu";
import { useState } from "react";
import { User } from "@/types/model";

interface MobileSidebarProps {
    navLinks: { label: string; href: string; key: string }[];
    onClose: () => void;
    userData: User | null;
    isLoggedIn: boolean;
}

export default function MobileSidebar({ navLinks, onClose, userData, isLoggedIn }: MobileSidebarProps) {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <AnimatePresence mode="wait">
            {!showNotifications ? (
                <MobileMenu
                    key="menu"
                    navLinks={navLinks}
                    userData={userData}
                    onClose={onClose}
                    isLoggedIn={isLoggedIn}
                    setShowNotifications={setShowNotifications}
                />
            ) : (
                <NotificationPanel
                    key="notifications"
                    onClose={() => setShowNotifications(false)}
                />
            )}
        </AnimatePresence>
    );
}
