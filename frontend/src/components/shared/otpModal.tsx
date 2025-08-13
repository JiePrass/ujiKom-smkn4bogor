// components/shared/OtpModal.tsx
"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface OtpModalProps {
    onClose: () => void;
    onSubmit: (otp: string) => Promise<boolean>;
    email: string;
}

export default function OtpModal({ onClose, onSubmit, email }: OtpModalProps) {
    const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const router = useRouter();

    const handleChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) {
            const newValues = [...otpValues];
            newValues[index] = value;
            setOtpValues(newValues);

            if (value && index < otpValues.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otp = otpValues.join("");
        if (otp.length < 6) {
            setError("Kode OTP harus 6 digit");
            return;
        }

        setError("");

        const isValid = await onSubmit(otp);
        if (isValid) {
            router.push("/login");
        } else {
            setError("Kode OTP salah atau tidak valid");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
                <h2 className="text-lg font-bold mb-2">Verifikasi Email</h2>
                <p className="mb-4 text-sm text-gray-600">
                    Masukkan kode OTP yang telah kami kirim ke email <b>{email}</b>.
                </p>

                <div className="flex gap-2 justify-center mb-2">
                    {otpValues.map((value, i) => (
                        <Input
                            key={i}
                            ref={(el) => {inputRefs.current[i] = el}}
                            type="text"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleChange(e.target.value, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className="w-10 h-10 text-center text-lg"
                        />
                    ))}
                </div>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleVerify}>Verifikasi</Button>
                </div>
            </div>
        </div>
    );
}
