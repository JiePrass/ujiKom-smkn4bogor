"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyEmail, resendVerifyEmail, getCurrentUser } from "@/lib/api/auth";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from "next/navigation";

interface ApiResponse {
    message: string;
}

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailQuery = searchParams.get("email");

    const [email, setEmail] = useState<string | null>(emailQuery);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isFromQuery, setIsFromQuery] = useState<boolean>(!!emailQuery);

    // ambil email dari user login jika tidak ada di query
    useEffect(() => {
        const fetchEmail = async () => {
            if (!emailQuery) {
                try {
                    const userData = await getCurrentUser();
                    if (userData?.email) {
                        setEmail(userData.email);
                        setIsFromQuery(false);
                        await handleAutoResend(userData.email);
                    } else {
                        Swal.fire("Error", "Email pengguna tidak ditemukan.", "error");
                    }
                } catch {
                    Swal.fire("Error", "Gagal memuat data pengguna. Silakan login ulang.", "error");
                }
            }
        };
        fetchEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle OTP input
    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    // countdown timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // fungsi resend OTP
    const handleResend = async () => {
        if (!email) {
            Swal.fire("Gagal", "Email tidak ditemukan.", "error");
            return;
        }

        try {
            setLoading(true);
            const res: ApiResponse = await resendVerifyEmail(email);
            Swal.fire("Berhasil", res.message, "success");
            setResendTimer(60);
        } catch (err) {
            const errorMessage =
                (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
                "Gagal mengirim ulang OTP";
            Swal.fire("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    // auto resend ketika login tanpa email query
    const handleAutoResend = async (userEmail: string) => {
        try {
            setLoading(true);
            const res: ApiResponse = await resendVerifyEmail(userEmail);
            Swal.fire("Kode OTP Dikirim", res.message, "success");
            setResendTimer(60);
        } catch (err) {
            const errorMessage =
                (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
                "Gagal Mengirim OTP";
            Swal.fire("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    // submit verifikasi
    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            Swal.fire("Error", "Masukkan kode OTP lengkap (6 digit).", "error");
            return;
        }

        try {
            setLoading(true);
            const res: ApiResponse = await verifyEmail({ email: email!, otp: code });
            await Swal.fire("Berhasil", res.message, "success");

            // arahkan sesuai asal email
            if (isFromQuery) {
                router.push("/login");
            } else {
                router.push("/profile");
            }
        } catch (err) {
            const errorMessage =
                (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
                "Kode OTP salah";
            Swal.fire("Gagal", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold mb-4">Verifikasi Email</h1>
                <p className="text-gray-500 mb-6">
                    {email
                        ? <>Kami telah mengirimkan kode OTP ke email <b>{email}</b></>
                        : "Memuat email pengguna..."}
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            id={`otp-${index}`}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            maxLength={1}
                            className="w-12 h-12 text-center text-lg font-semibold"
                            disabled={!email}
                        />
                    ))}
                </div>

                <Button onClick={handleVerify} disabled={loading || !email} className="w-full mb-4">
                    {loading ? "Memverifikasi..." : "Verifikasi"}
                </Button>

                <div className="text-sm text-gray-500">
                    {resendTimer > 0 ? (
                        <p>
                            Kirim ulang kode dalam <b>{resendTimer}</b> detik
                        </p>
                    ) : (
                        <Button variant="link" onClick={handleResend} disabled={loading || !email}>
                            Kirim Ulang Kode
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
