import { Link, useLocation } from "react-router-dom";

type NavItem = {
    key: string;
    href: string;
};

type DesktopNavProps = {
    navLinks: NavItem[];
    activeSection: string;
    onNavigate: (sectionId: string) => void;
};


export default function DesktopNav({ navLinks, activeSection, onNavigate }: DesktopNavProps) {
    const location = useLocation();

    const isActive = (href: string) => {
        if (href.startsWith("#")) {
            return location.pathname === "/" && `#${activeSection}` === href;
        }
        return location.pathname === href;
    };

    return (
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            {navLinks.map((item) =>
                item.href.startsWith("#") ? (
                    <button
                        key={item.key}
                        onClick={() => onNavigate(item.href.substring(1))}
                        className={`transition ${isActive(item.href) ? "text-sky-500 font-semibold" : "hover:text-gray-700"
                            }`}
                    >
                        {item.key}
                    </button>
                ) : (
                    <Link
                        key={item.key}
                        to={item.href}
                        className={`transition ${isActive(item.href) ? "text-sky-500 font-semibold" : "hover:text-gray-700"
                            }`}
                    >
                        {item.key}
                    </Link>
                )
            )}
        </nav>
    );
}
