import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(formData);

            // Simpan token ke localStorage
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user)); // opsional jika ingin simpan data user

            alert("Login berhasil");
            // Redirect ke home
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.error || "Login gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" />
                <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 w-full">
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}
