import { useState } from "react";

export default function OtpModal({ onClose, onSubmit, email }) {
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

    const handleChange = (value, index) => {
        if (/^\d?$/.test(value)) {
            const newValues = [...otpValues];
            newValues[index] = value;
            setOtpValues(newValues);
        }
    };

    const handleVerify = () => {
        const otp = otpValues.join("");
        if (otp.length < 6) {
            alert("Kode OTP harus 6 digit");
            return;
        }
        onSubmit(otp);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
                <h2 className="text-lg font-bold mb-2">Verifikasi Email</h2>
                <p className="mb-4 text-sm text-gray-600">
                    Masukkan kode OTP yang telah kami kirim ke email <b>{email}</b>.
                </p>
                <div className="flex gap-2 justify-center mb-4">
                    {otpValues.map((value, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleChange(e.target.value, i)}
                            className="border p-2 w-10 text-center text-lg"
                        />
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
                        Batal
                    </button>
                    <button onClick={handleVerify} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Verifikasi
                    </button>
                </div>
            </div>
        </div>
    );
}
