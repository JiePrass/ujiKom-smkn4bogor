"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            Swal.fire("Error", "Token tidak ditemukan atau tidak valid.", "error");
            router.push("/forgot-password");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            Swal.fire("Peringatan", "Password minimal 8 karakter.", "warning");
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire("Peringatan", "Konfirmasi password tidak sama.", "warning");
            return;
        }

        try {
            setLoading(true);
            const res = await resetPassword({ token: token!, newPassword });
            Swal.fire("Berhasil", res.message, "success");
            router.push("/login");
        } catch (err) {
            const errorMessage =
                (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
                "Gagal Mereset Password";
            Swal.fire("Gagal", errorMessage|| "Terjadi kesalahan", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
                <p className="text-gray-600 text-center mb-6">
                    Masukkan password baru Anda di bawah ini.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input Password Baru */}
                    <div className="relative">
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password baru (minimal 8 karakter)"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Input Konfirmasi Password */}
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Konfirmasi password baru"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
