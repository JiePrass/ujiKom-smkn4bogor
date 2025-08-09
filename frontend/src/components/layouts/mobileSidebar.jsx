// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import NotificationPanel from "../shared/notificationPanel";
import { useState } from "react";
import MobileMenu from "../shared/mobileMenu";

export default function MobileSidebar({ navLinks, onClose, userData, isLoggedIn }) {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <AnimatePresence mode="wait">
            {!showNotifications ? (
                <MobileMenu navLinks={navLinks} userData={userData} onClose={onClose} isLoggedIn={isLoggedIn} setShowNotifications={setShowNotifications} />
            ) : (
                <NotificationPanel key="notifications" onClose={() => setShowNotifications(false)} />
            )}
        </AnimatePresence>
    );
}
