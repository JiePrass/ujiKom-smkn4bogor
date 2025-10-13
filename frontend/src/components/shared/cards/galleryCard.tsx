"use client";

import Image from "next/image";
import { Gallery } from "@/types/model";

interface Props {
    gallery: Gallery;
    onClick: () => void;
}

export default function GalleryCard({ gallery, onClick }: Props) {
    const media = gallery.media?.[0];
    return (
        <div
            onClick={onClick}
            className="relative break-inside-avoid cursor-pointer group overflow-hidden hover:shadow-lg transition-all"
        >
            {media && (
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${media.mediaUrl}`}
                    alt={gallery.caption || "Gallery image"}
                    width={500}
                    height={500}
                    className="w-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
                />
            )}

            {gallery.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {gallery.caption}
                </div>
            )}
        </div>
    );
}
