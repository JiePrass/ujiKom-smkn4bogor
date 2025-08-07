import { Link } from "react-router-dom";

type UserProps = {
    name: string;
    email: string;
    role: string;
}

type ProfileDropdownProps = {
    visible: boolean;
    toggle: () => void;
    user: UserProps;
};

export default function ProfileDropdown({ user, visible, toggle }: ProfileDropdownProps) {
    return (
        <div className="relative">
            <img
                src="/images/user-profile.jpg"
                alt="User"
                onClick={toggle}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
            />
            {visible && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border p-4 z-50">
                    <div className="mb-2">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <hr className="my-2" />
                    <Link to="/profile" className="block text-sm py-1 hover:underline">Lihat Profil</Link>
                    {user.role === "ADMIN" && (
                        <Link to="/admin" className="block text-sm py-1 hover:underline">Admin Panel</Link>
                    )}
                </div>
            )}
        </div>
    );
}
