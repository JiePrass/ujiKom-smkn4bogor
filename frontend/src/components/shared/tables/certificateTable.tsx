"use client";

import Image from "next/image";

interface Certificate {
    id: number;
    url: string;
    registration: { user: { fullName: string; email: string } };
}

export default function CertificatesTable({ certificates }: { certificates: Certificate[] }) {
    if (!certificates.length) {
        return <p className="text-sm text-gray-500">Belum ada sertifikat untuk event ini.</p>;
    }

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">Preview</th>
                        <th className="p-2 text-left">Peserta</th>
                        <th className="p-2 text-left">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.map((c) => (
                        <tr key={c.id} className="border-b">
                            <td className="p-2">
                                <Image
                                    src={`${c.url}`}
                                    alt="sertifikat"
                                    width={120}
                                    height={80}
                                    className="rounded border"
                                />
                            </td>
                            <td className="p-2">{c.registration.user.fullName}</td>
                            <td className="p-2">{c.registration.user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
