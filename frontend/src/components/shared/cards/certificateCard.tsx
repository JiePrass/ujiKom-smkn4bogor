"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Fullscreen } from "lucide-react";
import ImageFullscreenModal from "../modals/imageFullScreenModal";

interface Certificate {
    id: number;
    eventTitle: string;
    eventDate: string;
    issuedAt: string;
    url: string;
}

interface CertificateCardProps {
    certificate: Certificate;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const hasFile = Boolean(certificate.url);
    const url = hasFile
        ? `${certificate.url}`
        : null;

    console.log("Certificate:", certificate);

    return (
        <>
            <div className="w-full">
                {/* Thumbnail */}
                <div className="relative w-full h-48 group bg-gray-100 flex items-center justify-center">
                    {hasFile ? (
                        <Image
                            src={url!}
                            alt={certificate.eventTitle ?? "Certificate"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <FileText className="w-12 h-12 text-gray-400" />
                    )}

                    {/* Hover Action (Fullscreen button) */}
                    {hasFile && (
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                        >
                            <Fullscreen size={16} />
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className="pt-4">
                    <h3 className="text-base font-semibold truncate">
                        {certificate.eventTitle ?? "Certificate"}
                    </h3>
                    <span className="text-sm text-gray-500">
                        Diterbitkan:{" "}
                        {new Date(certificate.issuedAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </div>

            {/* Modal Fullscreen */}
            {hasFile && (
                <ImageFullscreenModal
                    isOpen={isFullscreen}
                    imageUrl={url!}
                    alt={certificate.eventTitle ?? "Certificate"}
                    onClose={() => setIsFullscreen(false)}
                />
            )}
        </>
    );
}
