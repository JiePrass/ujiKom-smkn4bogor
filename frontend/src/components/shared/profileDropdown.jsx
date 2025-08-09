import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfileDropdown({ visible, toggle, userData }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    console.log(userData.user)

    return (
        <div className="relative">
            <img
                src={userData.user.profilePicture ? `${BASE_URL}${userData.user.profilePicture}` : "/images/default-profile.png"}
                alt="User"
                onClick={toggle}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
            />
            {visible && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border p-4 z-50">
                    <div className="mb-2">
                        <p className="font-semibold">{userData.user.fullName}</p>
                        <p className="text-sm text-gray-500">{userData.user.email}</p>
                    </div>
                    <hr className="my-2" />
                    <Link to="/profile" className="block text-sm py-1 hover:underline">
                        Lihat Profil
                    </Link>
                    {userData.user.role === "ADMIN" && (
                        <Link to="/admin" className="block text-sm py-1 hover:underline">
                            Admin Panel
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left text-sm py-1 text-red-600 hover:underline mt-2"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
