// components/shared/OtpModal.tsx
"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OtpModalProps {
    onClose: () => void;
    onSubmit: (otp: string) => Promise<boolean>;
    email?: string;
    title?: string;
    description?: string;
    redirectOnSuccess?: string;
    length?: number; // kalau dikasih → multi digit, kalau undefined → single input
}

export default function OtpModal({
    onClose,
    onSubmit,
    email,
    title = "Verifikasi",
    description = "Masukkan kode OTP yang telah dikirim.",
    redirectOnSuccess,
    length,
}: OtpModalProps) {
    const [otpValues, setOtpValues] = useState<string[]>(
        Array(length ?? 0).fill("")
    );
    const [singleValue, setSingleValue] = useState("");
    const [error, setError] = useState("");
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (value: string, index: number) => {
        if (/^[a-zA-Z0-9]?$/.test(value)) {
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
        const otp =
            typeof length === "number"
                ? otpValues.join("")
                : singleValue.trim();

        if (typeof length === "number" && otp.length < length) {
            setError(`Kode harus ${length} karakter`);
            return;
        }
        if (typeof length !== "number" && otp.length < 6) {
            setError("Token minimal 6 karakter");
            return;
        }

        setError("");
        const isValid = await onSubmit(otp);
        if (isValid) {
            if (redirectOnSuccess) {
                window.location.href = redirectOnSuccess;
            } else {
                onClose();
            }
        } else {
            setError("Kode salah atau tidak valid");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
                <h2 className="text-lg font-bold mb-2">{title}</h2>
                <p className="mb-4 text-sm text-gray-600">
                    {description}{" "}
                    {email && (
                        <>
                            <br />
                            Dikirim ke: <b>{email}</b>
                        </>
                    )}
                </p>

                {typeof length === "number" ? (
                    <div className="flex gap-2 justify-center mb-2">
                        {otpValues.map((value, i) => (
                            <Input
                                key={i}
                                ref={(el: HTMLInputElement | null) => {
                                    inputRefs.current[i] = el;
                                }}
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className="w-10 h-10 text-center text-lg"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mb-2">
                        <Input
                            type="text"
                            value={singleValue}
                            onChange={(e) => setSingleValue(e.target.value)}
                            placeholder="Masukkan token"
                            className="uppercase text-lg"
                        />
                    </div>
                )}

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

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
