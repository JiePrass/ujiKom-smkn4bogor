// app/register/page.tsx
"use client";

import { useState } from "react";
import { registerUser, verifyEmail } from "@/lib/api/auth"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OtpModal from "@/components/shared/otpModal";
import { useRouter } from "next/navigation";

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    education: string;
    password: string;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        education: "",
        password: "",
    });

    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await registerUser(formData);
            alert(res.message);
            setIsOtpModalOpen(true);
        } catch (err: any) {
            alert(err.response?.data?.error || "Gagal mendaftar");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        try {
            const res = await verifyEmail({
                email: formData.email,
                otp,
            });
            alert(res.message);
            setIsOtpModalOpen(false);
            router.push("/login");
            return true;
        } catch (err: any) {
            alert(err.response?.data?.error || "OTP salah");
            return false;
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Register</h1>

            <form onSubmit={handleRegister} className="space-y-4">
                <Input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    onChange={handleChange}
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="education"
                    placeholder="Education"
                    onChange={handleChange}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Register"}
                </Button>
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
