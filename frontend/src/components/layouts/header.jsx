import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DesktopNav from "../shared/desktopNav";
import SearchBar from "../shared/searchBar";
import ProfileDropdown from "../shared/profileDropdown";
import NotificationDropdown from "../shared/notificationDropdown";
import MobileMenu from "./mobileSidebar";
import { getCurrentUser } from "../../api/auth";

const navLinks = [
    { key: "Beranda", href: "/" },
    { key: "Tentang", href: "/tentang" },
    { key: "Event", href: "/event" },
    { key: "Artikel", href: "/artikel" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [hideHeader, setHideHeader] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const [user, setUser] = useState(null);
    const [notifications] = useState([
        "Event A akan dimulai besok.",
        "Sertifikat Anda tersedia.",
        "Pembayaran berhasil dikonfirmasi.",
        "Event B telah selesai.",
    ]);

    const navigate = useNavigate();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token && token !== "null" && token !== "undefined";

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    // Fetch user data jika login
    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn) {
                try {
                    const me = await getCurrentUser();
                    setUser(me);
                } catch (err) {
                    console.error("Gagal mengambil data user:", err);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, [isLoggedIn]);

    // Lock scroll saat mobile menu terbuka
    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isOpen);
    }, [isOpen]);

    // Sembunyikan header saat scroll ke bawah
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHideHeader(true);
            } else {
                setHideHeader(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <header
                className={`z-50 fixed top-0 left-0 w-full bg-white transition-transform duration-300 ${hideHeader ? "-translate-y-full" : "translate-y-0"
                    } shadow`}
            >
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    variants={{
                        hidden: { opacity: 0, y: -20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                    className="container mx-auto px-6 md:px-0 py-3 flex justify-between items-center"
                >
                    <img
                        src="/images/SIMKAS.png"
                        alt="Logo"
                        className="h-8 cursor-pointer"
                        onClick={() => handleNavigation("/")}
                    />

                    <DesktopNav navLinks={navLinks} onNavigate={handleNavigation} />

                    <div className="hidden md:flex items-center gap-4">
                        <SearchBar />
                        {isLoggedIn && user ? (
                            <>
                                <ProfileDropdown
                                    userData={user}
                                    visible={showProfile}
                                    toggle={() => {
                                        setShowProfile(!showProfile);
                                        setShowNotif(false);
                                    }}
                                />
                                <NotificationDropdown
                                    notifications={notifications}
                                    visible={showNotif}
                                    toggle={() => {
                                        setShowNotif(!showNotif);
                                        setShowProfile(false);
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleNavigation("/login")}
                                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavigation("/register")}
                                    className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex space-x-4 items-center">
                        <button onClick={toggleMenu}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                        />
                        <MobileMenu
                            navLinks={navLinks}
                            onClose={toggleMenu}
                            onNavigate={handleNavigation}
                            userData={user}
                            isLoggedIn={isLoggedIn}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
