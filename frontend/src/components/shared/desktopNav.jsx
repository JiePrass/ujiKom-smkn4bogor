import { useLocation, Link } from "react-router-dom";

export default function DesktopNav({ navLinks }) {
    const location = useLocation();

    const getIsActive = (href) => {
        return location.pathname === href;
    };

    return (
        <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
                <Link
                    key={link.key}
                    to={link.href}
                    className={`text-sm font-medium transition-colors ${getIsActive(link.href)
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                        }`}
                >
                    {link.key}
                </Link>
            ))}
        </nav>
    );
}
