// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, User } from "lucide-react";

export default function ProfileDropdown({ visible, toggle, userData }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (visible) toggle(); // tutup kalau dropdown terbuka
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible, toggle]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <img
                src={
                    userData.user.profilePicture
                        ? `${import.meta.env.VITE_API_BASE_URL}${userData.user.profilePicture}`
                        : "/images/default-profile.png"
                }
                alt="User"
                onClick={toggle}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
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
                        className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl z-50 origin-top"
                    >
                        <div className="mb-2 px-4 pt-4">
                            <p className="font-semibold">{userData.user.fullName}</p>
                            <p className="text-sm text-gray-500 border-b border-gray-100 pb-3">
                                {userData.user.email}
                            </p>
                        </div>
                        <div className="space-y-2 pb-2 flex flex-col">
                            <Link
                                to="/profile"
                                className="text-sm flex items-center py-1.5 px-2 mx-2 rounded-lg transition-colors ease-in-out hover:bg-gray-100"
                            >
                                <User className="inline w-4 h-4 mr-2" />
                                Lihat Profil
                            </Link>

                            {userData.user.role === "PARTICIPANT" && (
                                <Link
                                    to="/admin"
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
