// src/components/shared/ImageFullscreenModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, Share2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface ImageFullscreenModalProps {
    isOpen: boolean;
    imageUrl: string;
    alt?: string;
    onClose: () => void;
}

export default function ImageFullscreenModal({
    isOpen,
    imageUrl,
    alt = "Image",
    onClose,
}: ImageFullscreenModalProps) {

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: alt,
                    text: "Lihat gambar ini",
                    url: imageUrl,
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(imageUrl);
                alert("Link gambar berhasil disalin!");
            } else {
                alert("Fitur share tidak didukung di browser ini.");
            }
        } catch (err) {
            console.error(err);
            alert("Gagal membagikan gambar.");
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
                    <div className="relative max-w-6xl w-full h-full overflow-hidden">
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
                            doubleClick={{ disabled: true }} // biar double click ga zoom otomatis
                            panning={{
                                disabled: false,
                                velocityDisabled: true,
                            }}
                        >
                            {({ zoomIn, zoomOut }) => (
                                <>
                                    {/* Tombol Zoom & Share */}
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
                                    </div>

                                    {/* Gambar di tengah */}
                                    <TransformComponent>
                                        <div className="flex items-center justify-center w-full h-screen">
                                            <Image
                                                src={imageUrl}
                                                alt={alt}
                                                width={1200}
                                                height={900}
                                                className="max-w-full max-h-full object-contain select-none"
                                                draggable={false}
                                            />
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
