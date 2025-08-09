import { useLocation } from "react-router-dom";

export default function DesktopNav({ navLinks, onNavigate }) {
    const location = useLocation();

    const getIsActive = (href) => {
        return location.pathname === href;
    };

    return (
        <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
                <button
                    key={link.key}
                    onClick={() => onNavigate(link.href)}
                    className={`text-sm font-medium transition-colors ${getIsActive(link.href)
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 hover:text-blue-600"
                        }`}
                >
                    {link.key}
                </button>
            ))}
        </nav>
    );
}
