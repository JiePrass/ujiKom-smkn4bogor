import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

type NavItem = {
    key: string;
    href: string;
};

type MobileMenuProps = {
    navLinks: NavItem[];
    onClose: () => void;
    onNavigate: (sectionId: string) => void;
};

export default function MobileMenu({ navLinks, onClose, onNavigate }: MobileMenuProps) {
    return (
        <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-72 bg-white z-50 p-6 shadow-lg flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Menu</span>
                <button onClick={onClose}>
                    <X className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex flex-col gap-4">
                {navLinks.map((item) => (
                    <div key={item.key}>
                        {item.href.startsWith("#") ? (
                            <button
                                onClick={() => {
                                    onNavigate(item.href.substring(1));
                                    onClose();
                                }}
                                className="flex justify-between w-full text-left hover:text-sky-500"
                            >
                                <span>{item.key}</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        ) : (
                            <Link
                                to={item.href}
                                onClick={onClose}
                                className="flex justify-between hover:text-sky-500"
                            >
                                <span>{item.key}</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </motion.aside>
    );
}
