import { useState } from "react";
import { registerUser, verifyEmail } from "../api/auth";
import OtpModal from "../components/shared/OtpModal";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        education: "",
        password: ""
    });

    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await registerUser(formData);
            alert(res.message);
            setIsOtpModalOpen(true);
        } catch (err) {
            alert(err.response?.data?.error || "Gagal mendaftar");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (otp) => {
        try {
            const res = await verifyEmail({
                email: formData.email,
                otp
            });
            alert(res.message);
            setIsOtpModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.error || "OTP salah");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="border p-2 w-full" />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
                <input type="text" name="phone" placeholder="Phone" onChange={handleChange} className="border p-2 w-full" />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} className="border p-2 w-full" />
                <input type="text" name="education" placeholder="Education" onChange={handleChange} className="border p-2 w-full" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" />
                <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 w-full">
                    {loading ? "Loading..." : "Register"}
                </button>
            </form>

            {isOtpModalOpen && (
                <OtpModal
                    onClose={() => setIsOtpModalOpen(false)}
                    onSubmit={handleVerifyOtp}
                    email={formData.email}
                />
            )}
        </div>
    );
}
