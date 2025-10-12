"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            Swal.fire("Peringatan", "Email tidak boleh kosong.", "warning");
            return;
        }

        try {
            setLoading(true);
            const res = await forgotPassword({ email });
            Swal.fire("Berhasil", res.message, "success");
            setEmail("");
        } catch (err) {
            const errorMessage =
                (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
                "Gagal mengirim ulang OTP";
            Swal.fire("Gagal", errorMessage || "Terjadi kesalahan", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Lupa Password</h1>
                <p className="text-gray-600 text-center mb-6">
                    Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            placeholder="Masukkan email Anda"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Mengirim..." : "Kirim Link Reset"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
