"use client";

import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, Share2, Download } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { downloadEventQR } from "@/lib/api/registration";

interface QRModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: number;
    qrImageUrl?: string | null;
}

export default function QRModal({
    isOpen,
    onClose,
    eventId,
    qrImageUrl,
}: QRModalProps) {

    const handleShare = async () => {
        try {
            if (!qrImageUrl) return;
            if (navigator.share) {
                await navigator.share({
                    title: "QR Code Event",
                    text: "Lihat QR event ini.",
                    url: qrImageUrl,
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(qrImageUrl);
                alert("Link QR berhasil disalin ke clipboard!");
            } else {
                alert("Fitur berbagi tidak didukung di browser ini.");
            }
        } catch (err) {
            console.error("Gagal membagikan gambar:", err);
            alert("Terjadi kesalahan saat membagikan gambar.");
        }
    };

    const handleDownload = async () => {
        try {
            await downloadEventQR(eventId);
        } catch (err) {
            console.error("Gagal mengunduh QR:", err);
            alert("Terjadi kesalahan saat mengunduh QR Code.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="relative max-w-6xl w-full h-full flex justify-center items-center overflow-hidden">
                        {/* Tombol Close */}
                        <div className="absolute top-4 right-4 flex gap-2 z-50">
                            <Button
                                variant="ghost"
                                className="bg-white rounded-full w-9 h-9"
                                onClick={onClose}
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Zoomable Image */}
                        <TransformWrapper
                            initialScale={1}
                            minScale={1}
                            maxScale={4}
                            centerOnInit
                            wheel={{ step: 0.2 }}
                            pinch={{ step: 5 }}
                            doubleClick={{ disabled: true }}
                            panning={{ disabled: false, velocityDisabled: true }}
                        >
                            {({ zoomIn, zoomOut }) => (
                                <>
                                    {/* Tombol bawah kanan */}
                                    <div className="absolute bottom-6 right-6 flex gap-3 z-50">
                                        <Button
                                            variant="ghost"
                                            className="bg-white rounded-full w-9 h-9"
                                            onClick={() => zoomIn()}
                                        >
                                            <ZoomIn size={20} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="bg-white rounded-full w-9 h-9"
                                            onClick={() => zoomOut()}
                                        >
                                            <ZoomOut size={20} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="bg-white rounded-full w-9 h-9"
                                            onClick={handleShare}
                                        >
                                            <Share2 size={20} />
                                        </Button>

                                        <Button
                                            onClick={handleDownload}
                                            className="bg-white text-black rounded-full w-9 h-9"
                                        >
                                            <Download size={20} />
                                        </Button>
                                    </div>

                                    {/* Gambar */}
                                    <TransformComponent>
                                        <div className="flex items-center justify-center w-full min-h-[50vh] max-h-[80vh]">
                                            {qrImageUrl ? (
                                                <Image
                                                    src={qrImageUrl}
                                                    alt="QR Code Event"
                                                    width={500} // atur max width
                                                    height={500} // atur max height
                                                    className="max-w-full max-h-full object-contain select-none"
                                                    draggable={false}
                                                />
                                            ) : (
                                                <p className="text-white text-lg">QR Code tidak tersedia.</p>
                                            )}
                                        </div>
                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
