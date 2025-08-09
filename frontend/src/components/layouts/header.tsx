import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DesktopNav from "./desktopNav";
import SearchBar from "../shared/searchBar";
import ProfileDropdown from "../shared/profileDropdown";
import NotificationDropdown from "../shared/notificationDropdown";
import MobileMenu from "./mobileMenu";

const navLinks = [
    { key: "Beranda", href: "/" },
    { key: "Tentang", href: "#tentang" },
    { key: "Event", href: "/event" },
    { key: "Kontak", href: "#kontak" },
];

const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "ADMIN",
};

const notifications = [
    "Event A akan dimulai besok.",
    "Sertifikat Anda tersedia.",
    "Pembayaran berhasil dikonfirmasi.",
    "Event B telah selesai.",
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const [hideHeader, setHideHeader] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);


    const location = useLocation();
    const navigate = useNavigate();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSectionNavigation = (target: string) => {
        if (target.startsWith("/")) {
            // Navigasi ke halaman berbeda (misal: /event)
            navigate(target);
        } else {
            // Navigasi ke anchor section di halaman saat ini
            if (location.pathname !== "/") {
                // Jika sedang di luar halaman utama, arahkan ke halaman utama + hash
                navigate(`/#${target}`);
            } else {
                if (target === "beranda") {
                    // Scroll ke atas jika target adalah beranda
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    const el = document.getElementById(target);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
    };

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isOpen);
    }, [isOpen]);

    useEffect(() => {
        const sectionIds = ["beranda", "tentang", "kontak"];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.6 }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scroll ke bawah & sudah lewat 100px dari atas
                setHideHeader(true);
            } else {
                // Scroll ke atas
                setHideHeader(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);


    return (
        <>
            <header className={`z-50 fixed top-0 left-0 w-full bg-white transition-transform duration-300 ${hideHeader ? "-translate-y-full" : "translate-y-0"
                } shadow`}>
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    variants={{
                        hidden: { opacity: 0, y: -20 },
                        show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5 },
                        },
                    }}
                    className="container mx-auto px-6 md:px-0 py-3 flex justify-between items-center"
                >
                    <img src="/images/SIMKAS.png" alt="Logo" className="h-8" />

                    <DesktopNav
                        navLinks={navLinks}
                        activeSection={activeSection}
                        onNavigate={handleSectionNavigation}
                    />

                    <div className="hidden md:flex items-center gap-4">
                        <SearchBar />
                        <ProfileDropdown
                            user={user}
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
                    </div>

                    <div className="md:hidden flex space-x-4 items-center">
                        <NotificationDropdown
                            notifications={notifications}
                            visible={showNotif}
                            toggle={() => {
                                setShowNotif(!showNotif);
                                setShowProfile(false);
                            }}
                        />
                        <button onClick={toggleMenu}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleMenu} />
                        <MobileMenu
                            navLinks={navLinks}
                            onClose={toggleMenu}
                            onNavigate={handleSectionNavigation}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
