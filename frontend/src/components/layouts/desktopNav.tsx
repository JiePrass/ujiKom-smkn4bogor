import { useLocation } from "react-router-dom";

interface NavLink {
    key: string;
    href: string;
}

interface Props {
    navLinks: NavLink[];
    activeSection: string;
    onNavigate: (sectionId: string) => void;
}

export default function DesktopNav({ navLinks, activeSection, onNavigate }: Props) {
    const location = useLocation();

    const getIsActive = (href: string) => {
        if (href.startsWith("#")) {
            const targetId = href.substring(1);
            return activeSection === targetId;
        }

        return location.pathname === href;
    };


    return (
        <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
                <button
                    key={link.key}
                    onClick={() => {
                        if (link.href.startsWith("#")) {
                            onNavigate(link.href.substring(1));
                        } else {
                            onNavigate(link.href);
                        }
                    }}
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
